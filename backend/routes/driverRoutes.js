import express from 'express';
import { Driver } from '../models/driverModel.js';

const router = express.Router();

// Register a Driver
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, vehicleType, licenceNumber, services, locations } = req.body;

        if (!name || !email || !password || !vehicleType || !licenceNumber) {
            return res.status(400).json({ message: 'Send all required fields' });
        }

        // Validate services
        const validServices = ["Half Truck", "Full Truck", "More Than Truck"];
        if (services && !services.every(service => validServices.includes(service))) {
            return res.status(400).json({ message: 'Invalid service type(s)' });
        }

        // Create new driver
        const driver = new Driver({
            name,
            email,
            password,
            vehicleType,
            licenceNumber,
            availability: false,
            services: services || [],
            locations: locations || []
        });

        await driver.save();
        res.status(201).json({ message: "Driver registered successfully, pending verification" });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
});

// Driver Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Send email and password' });
        }

        const driver = await Driver.findOne({ email });
        if (!driver) return res.status(404).json({ message: 'Driver not found' });

        const isMatch = await driver.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        if (!driver.verified) {
            return res.status(403).json({ message: 'Driver not verified yet' });
        }

        const token = driver.generateAuthToken();
        res.status(200).json({ token });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
});

// Admin Verification Route
router.put('/drivers/:id/verify', async (req, res) => {
    try {
        const { id } = req.params;
        const driver = await Driver.findById(id);
        if (!driver) return res.status(404).json({ message: 'Driver not found' });

        driver.verified = true;
        await driver.save();

        res.status(200).json({ message: 'Driver verified successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
});

// Update driver availability
router.put('/drivers/:id/availability', async (req, res) => {
    try {
        const { availability } = req.body;
        if (availability === undefined) {
            return res.status(400).json({ message: 'Availability status required' });
        }

        const driver = await Driver.findByIdAndUpdate(req.params.id, { availability }, { new: true });

        if (!driver) return res.status(404).json({ message: 'Driver not found' });

        res.json({ message: 'Availability updated', driver });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update driver services & locations
router.put('/drivers/:id/update', async (req, res) => {
    try {
        const { services, locations } = req.body;

        const validServices = ["Half Truck", "Full Truck", "More Than Truck"];
        if (services && !services.every(service => validServices.includes(service))) {
            return res.status(400).json({ message: 'Invalid service type(s)' });
        }

        const driver = await Driver.findByIdAndUpdate(
            req.params.id,
            { services, locations },
            { new: true }
        );

        if (!driver) return res.status(404).json({ message: 'Driver not found' });

        res.json({ message: 'Services & Locations updated', driver });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all drivers
router.get('/drivers', async (req, res) => {
    try {
        const drivers = await Driver.find({});
        res.status(200).json(drivers);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
});

// Get a single driver by ID
router.get('/drivers/:id', async (req, res) => {
    try {
        const driver = await Driver.findById(req.params.id);
        if (!driver) return res.status(404).json({ message: 'Driver not found' });
        res.status(200).json(driver);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
});



export default router;
