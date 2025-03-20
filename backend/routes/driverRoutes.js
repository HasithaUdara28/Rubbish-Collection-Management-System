import express from 'express';
import { Driver } from '../models/driverModel.js';

const router = express.Router();

// Register a Driver
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, vehicleCapacity, licenceNumber } = req.body;

        if (!name || !email || !password || !vehicleCapacity || !licenceNumber) {
            return res.status(400).send({ message: 'Send all required fields' });
        }

        // Create new driver
        const driver = new Driver({ name, email, password, vehicleCapacity, licenceNumber });
        await driver.save();

        res.status(201).json({ message: "Driver registered successfully, pending verification" });

    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Driver Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({ message: 'Send email and password' });
        }

        const driver = await Driver.findOne({ email });
        if (!driver) return res.status(404).send({ message: 'Driver not found' });

        const isMatch = await driver.comparePassword(password);
        if (!isMatch) return res.status(400).send({ message: 'Invalid credentials' });

        if (!driver.verified) {
            return res.status(403).send({ message: 'Driver not verified yet' });
        }

        const token = driver.generateAuthToken();
        res.status(200).json({ token });

    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Admin Verification Route
router.put('/verify/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const driver = await Driver.findById(id);
        if (!driver) return res.status(404).json({ message: 'Driver not found' });

        driver.verified = true;
        await driver.save();

        res.status(200).json({ message: 'Driver verified successfully' });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Get All Drivers
router.get('/', async (req, res) => {
    try {
        const drivers = await Driver.find({});
        res.status(200).json(drivers);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

export default router;
