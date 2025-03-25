import express from 'express';
import { Booking } from '../models/Booking Model.js';
import { Driver } from '../models/driverModel.js';
import { authenticateToken } from '../middleware/authenticate.js';

const router = express.Router();

// Create a new booking
// Create a new booking
router.post('/create', authenticateToken, async (req, res) => {
    try {
        const { 
            driverId, 
            service, 
            date, 
            startTime, 
            location, 
            notes 
        } = req.body;

        // Get customer ID from auth middleware
        const customerId = req.user.id;

        if (!driverId || !service || !date || !startTime || !location) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }

        // Parse booking start time and date
        const bookingStartTime = new Date(startTime);
        
        // Check if booking is within 24 hours
        const now = new Date();
        const twentyFourHoursFromNow = new Date(now);
        twentyFourHoursFromNow.setHours(now.getHours() + 24);
        
        if (bookingStartTime > twentyFourHoursFromNow) {
            return res.status(400).json({ 
                message: 'Bookings can only be made for within the next 24 hours' 
            });
        }

        // Find the driver
        const driver = await Driver.findById(driverId);
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        // Check if driver offers this service
        if (!driver.services.includes(service)) {
            return res.status(400).json({ message: 'Driver does not offer this service' });
        }

        // Validate service
        const validServices = ["Half Truck", "Full Truck", "More Than Truck"];
        if (!validServices.includes(service)) {
            return res.status(400).json({ message: 'Invalid service type' });
        }

        // Calculate duration based on service
        let durationHours;
        let pricePerHour = 0;
        switch(service) {
            case "Half Truck":
                durationHours = 2;
                pricePerHour = 50; // Example price
                break;
            case "Full Truck":
                durationHours = 5;
                pricePerHour = 45; // Example price
                break;
            case "More Than Truck":
                durationHours = 8;
                pricePerHour = 40; // Example price
                break;
        }

        // Calculate booking end time
        const bookingEndTime = new Date(bookingStartTime);
        bookingEndTime.setHours(bookingStartTime.getHours() + durationHours);
        
        // Calculate total price
        const totalPrice = durationHours * pricePerHour;

        // Check if driver is available (general availability flag)
        if (!driver.availability) {
            return res.status(400).json({ message: 'Driver is not currently available for bookings' });
        }

        // Create the booking
        const booking = new Booking({
            customerId,
            driverId,
            service,
            date: new Date(date),
            startTime: bookingStartTime,
            endTime: bookingEndTime,
            location,
            notes: notes || '',
            totalPrice,
            status: 'pending',
            paymentStatus: 'unpaid'
        });

        await booking.save();

        res.status(201).json({ 
            message: 'Booking created successfully',
            booking
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
});

// Get customer's bookings
router.get('/my-bookings', authenticateToken, async (req, res) => {
    try {
        const customerId = req.user.id;
        
        const bookings = await Booking.find({ customerId })
            .populate('driverId', 'name vehicleType')
            .sort({ date: 1 });
        
        res.status(200).json(bookings);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
});

// Get single booking details
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const bookingId = req.params.id;
        const customerId = req.user.id;
        
        const booking = await Booking.findOne({ _id: bookingId, customerId })
            .populate('driverId', 'name email vehicleType licenceNumber')
            .populate('customerId', 'name email');
        
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        
        res.status(200).json(booking);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
});

// Cancel booking
router.put('/:id/cancel', authenticateToken, async (req, res) => {
    try {
        const bookingId = req.params.id;
        const customerId = req.user.id;
        
        const booking = await Booking.findOne({ _id: bookingId, customerId });
        
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        
        // Only allow cancellation if booking is pending or confirmed
        if (booking.status !== 'pending' && booking.status !== 'confirmed') {
            return res.status(400).json({ 
                message: 'Cannot cancel booking that is already completed or cancelled' 
            });
        }
        
        booking.status = 'cancelled';
        await booking.save();
        
        res.status(200).json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
});

// Get driver availability slots
router.get('/driver/:id/availability', async (req, res) => {
    try {
        const { date } = req.query;
        const driverId = req.params.id;
        
        if (!date) {
            return res.status(400).json({ message: 'Date is required' });
        }
        
        const driver = await Driver.findById(driverId);
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }
        
        // Find all booked slots for that day
        const queryDate = new Date(date);
        const bookedSlots = driver.timeSlots.filter(slot => {
            const slotDate = new Date(slot.date);
            return slotDate.toISOString().split('T')[0] === queryDate.toISOString().split('T')[0] && slot.isBooked;
        });
        
        // Get the day of week
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayOfWeek = days[queryDate.getDay()];
        
        // Find driver's schedule for that day
        const daySchedule = driver.weeklySchedule.find(schedule => schedule.day === dayOfWeek);
        
        if (!daySchedule) {
            return res.status(200).json({
                available: false,
                message: 'Driver does not work on this day',
                bookedSlots: []
            });
        }
        
        // Generate available slots based on driver's schedule and booked slots
        const [startHour, startMinute] = daySchedule.startTime.split(':').map(Number);
        const [endHour, endMinute] = daySchedule.endTime.split(':').map(Number);
        
        const startOfDay = new Date(queryDate);
        startOfDay.setHours(startHour, startMinute, 0, 0);
        
        const endOfDay = new Date(queryDate);
        endOfDay.setHours(endHour, endMinute, 0, 0);
        
        // Create slots every 30 minutes
        const availableSlots = [];
        const currentSlot = new Date(startOfDay);
        
        while (currentSlot < endOfDay) {
            const slotEnd = new Date(currentSlot);
            slotEnd.setMinutes(currentSlot.getMinutes() + 30);
            
            // Check if this slot overlaps with any booked slot
            const isOverlapping = bookedSlots.some(bookedSlot => {
                const bookedStart = new Date(bookedSlot.startTime);
                const bookedEnd = new Date(bookedSlot.endTime);
                
                return (
                    (currentSlot >= bookedStart && currentSlot < bookedEnd) ||
                    (slotEnd > bookedStart && slotEnd <= bookedEnd) ||
                    (currentSlot <= bookedStart && slotEnd >= bookedEnd)
                );
            });
            
            if (!isOverlapping) {
                availableSlots.push({
                    startTime: new Date(currentSlot),
                    endTime: new Date(slotEnd)
                });
            }
            
            // Move to next slot
            currentSlot.setMinutes(currentSlot.getMinutes() + 30);
        }
        
        res.status(200).json({
            driverName: driver.name,
            services: driver.services,
            availableSlots,
            bookedSlots: bookedSlots.map(slot => ({
                service: slot.service,
                startTime: slot.startTime,
                endTime: slot.endTime
            }))
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
});

router.get('/driver/:driverId', authenticateToken, async (req, res) => {
    try {
      const { driverId } = req.params;
      
      // Find all bookings for this driver
      const bookings = await Booking.find({ 
        driverId,
        // Optionally limit to recent and upcoming bookings
        date: { $gte: new Date(new Date().setDate(new Date().getDate() - 7)) }
      });
      
      res.status(200).json(bookings);
    } catch (error) {
      console.error('Error fetching driver bookings:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Updated route to get driver bookings filtered by service
router.get('/driver/:driverId/services', authenticateToken, async (req, res) => {
    try {
        const { driverId } = req.params;
        const { service } = req.query; // Optional service filter

        // Base query for driver's bookings
        const query = { 
            driverId,
            // Optionally limit to recent and upcoming bookings
            date: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) }
        };

        // Add service filter if provided
        if (service) {
            query.service = service;
        }

        // Find bookings with optional service filtering
        const bookings = await Booking.find(query)
            .populate('customerId', 'name email') // Optionally populate customer details
            .sort({ date: 1 }); // Sort by date ascending

        // Group bookings by service if no specific service was requested
        if (!service) {
            const groupedBookings = bookings.reduce((acc, booking) => {
                if (!acc[booking.service]) {
                    acc[booking.service] = [];
                }
                acc[booking.service].push(booking);
                return acc;
            }, {});

            return res.status(200).json({
                totalBookings: bookings.length,
                groupedBookings
            });
        }

        // If a specific service was requested, return those bookings
        res.status(200).json({
            service,
            totalBookings: bookings.length,
            bookings
        });
    } catch (error) {
        console.error('Error fetching driver bookings:', error);
        res.status(500).json({ message: error.message });
    }
});
  
router.put('/:id/reject', authenticateToken, async (req, res) => {
    try {
        const bookingId = req.params.id;
        const driverId = req.user.id; // Get driver ID from authentication

        // Find the booking
        const booking = await Booking.findOne({ 
            _id: bookingId, 
            driverId 
        });

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Only allow rejection of pending bookings
        if (booking.status !== 'pending') {
            return res.status(400).json({ 
                message: 'Only pending bookings can be rejected' 
            });
        }

        // Delete the booking
        await Booking.findByIdAndDelete(bookingId);

        res.status(200).json({ 
            message: 'Booking rejected and deleted successfully' 
});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
});

// Add a route to confirm booking
router.put('/:id/confirm', authenticateToken, async (req, res) => {
    try {
        const bookingId = req.params.id;
        const driverId = req.user.id;

        // Find the booking
        const booking = await Booking.findOne({ 
            _id: bookingId, 
            driverId 
        });

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Only allow confirmation of pending bookings
        if (booking.status !== 'pending') {
            return res.status(400).json({ 
                message: 'Only pending bookings can be confirmed' 
            });
        }

        // Update booking status
        booking.status = 'confirmed';
        await booking.save();

        res.status(200).json({ 
            message: 'Booking confirmed successfully',
            booking 
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
});
export default router;