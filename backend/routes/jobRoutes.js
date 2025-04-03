import express from 'express';
import { Job } from '../models/jobModel.js';
import { Driver } from '../models/driverModel.js';
import { authenticateToken } from '../middleware/authenticate.js';
import mongoose from "mongoose";

const router = express.Router();

// Route to create a new job
router.post('/create', authenticateToken, async (req, res) => {
  try {
    // Destructure and validate request body
    const { 
      jobType, 
      pickupLocation,
      pickupTime, // Add this new field
      description, 
      estimatedPrice
    } = req.body;

    const customerId = req.user.id;
    
    // Validate required fields
    if (!jobType || !pickupLocation || !pickupTime) { // Add pickupTime validation
      return res.status(400).json({ 
        message: 'Job type, pickup location, and pickup time are required' 
      });
    }

    // Validate pickup time (ensure it's in the future)
    const pickupTimeDate = new Date(pickupTime);
    if (isNaN(pickupTimeDate.getTime()) || pickupTimeDate < new Date()) {
      return res.status(400).json({
        message: 'Invalid pickup time or time is in the past'
      });
    }

    // Validate estimatedPrice if provided
    const price = estimatedPrice ? parseFloat(estimatedPrice) : null;
    if (price !== null && isNaN(price)) {
      return res.status(400).json({ 
        message: 'Invalid estimated price' 
      });
    }

    // Create new job
    const newJob = new Job({
      customerId,
      jobType,
      pickupLocation: pickupLocation.trim(),
      pickupTime: pickupTimeDate, // Add the pickup time
      description: description || '',
      estimatedPrice: price,
      status: 'posted', // Use model's default status
    });

    // Save job to database
    const savedJob = await newJob.save();

    // Respond with created job
    res.status(201).json({
      message: 'Job created successfully',
      job: savedJob
    });

  } catch (error) {
    console.error('Job Creation Error:', error);

    // Handle specific error types
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation Error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    // Generic server error
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
});

// Route to get customer's jobs
router.get('/my-jobs', authenticateToken, async (req, res) => {
  try {
    const customerId = req.user.id;
    const jobs = await Job.find({ customerId })
    .sort({ createdAt: -1 }); // Sort by most recent first

    res.status(200).json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ 
      message: 'Failed to retrieve jobs', 
      error: error.message 
    });
  }
});

// Route to get a specific job by ID
router.get('/:jobId', authenticateToken, async (req, res) => {
  try {
    const job = await Job.findOne({ 
      _id: req.params.jobId, 
      customerId: req.user.userId 
    });

    if (!job) {
      return res.status(404).json({ 
        message: 'Job not found' 
      });
    }

    res.status(200).json(job);
  } catch (error) {
    console.error('Error fetching job details:', error);
    res.status(500).json({ 
      message: 'Failed to retrieve job details', 
      error: error.message 
    });
  }
});

// Route to update a job
// Route to update a job
router.put('/:jobId', authenticateToken, async (req, res) => {
  try {
    const { jobId } = req.params;
    const { 
      jobType, 
      pickupLocation,
      pickupTime, // Add this field 
      description, 
      estimatedPrice 
    } = req.body;

    // Validate pickup time if provided
    let pickupTimeDate;
    if (pickupTime) {
      pickupTimeDate = new Date(pickupTime);
      if (isNaN(pickupTimeDate.getTime()) || pickupTimeDate < new Date()) {
        return res.status(400).json({
          message: 'Invalid pickup time or time is in the past'
        });
      }
    }

    // Find and update the job
    const updatedJob = await Job.findOneAndUpdate(
      { 
        _id: jobId, 
        customerId: req.user.userId,
        status: 'posted' // Only allow updates to jobs in 'posted' status
      }, 
      { 
        jobType, 
        pickupLocation, 
        pickupTime: pickupTimeDate, // Add this field
        description, 
        estimatedPrice: estimatedPrice ? parseFloat(estimatedPrice) : null
      },
      { 
        new: true, // Return the updated document
        runValidators: true // Run model validations
      }
    );

    if (!updatedJob) {
      return res.status(404).json({ 
        message: 'Job not found or cannot be updated' 
      });
    }

    res.status(200).json({
      message: 'Job updated successfully',
      job: updatedJob
    });
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ 
      message: 'Failed to update job', 
      error: error.message 
    });
  }
});

// Route to cancel a job
router.put('/:jobId/cancel', authenticateToken, async (req, res) => {
  try {
    const { jobId } = req.params;

    // Find and update the job
    const job = await Job.findOneAndUpdate(
      { 
        _id: jobId, 
        customerId: req.user.userId,
        status: { $in: ['posted', 'accepted'] } // Only cancel jobs in these statuses
      }, 
      { 
        status: 'cancelled' 
      },
      { 
        new: true // Return the updated document
      }
    );

    if (!job) {
      return res.status(404).json({ 
        message: 'Job not found or cannot be cancelled' 
      });
    }

    res.status(200).json({
      message: 'Job cancelled successfully',
      job
    });
  } catch (error) {
    console.error('Error cancelling job:', error);
    res.status(500).json({ 
      message: 'Failed to cancel job', 
      error: error.message 
    });
  }
});

router.get('/', async (req, res) => {
    try {
      const { jobType, minPrice, maxPrice, location } = req.query;
  
      const queryConditions = {};
  
      // Apply filters
      if (jobType) queryConditions.jobType = jobType;
      if (minPrice || maxPrice) {
        queryConditions.estimatedPrice = {};
        if (minPrice) queryConditions.estimatedPrice.$gte = parseFloat(minPrice);
        if (maxPrice) queryConditions.estimatedPrice.$lte = parseFloat(maxPrice);
      }
      if (location) queryConditions.pickupLocation = { $regex: location, $options: 'i' };
  
      // Fetch jobs from the database
      const jobs = await Job.find(queryConditions)
        .populate('customerId', 'name')
        .populate('driverId', 'name')
        .populate('driversApplied', 'name') // Populate the drivers who applied
        .sort({ createdAt: -1 });
  
      res.json({ jobs });
    } catch (error) {
      console.error('Error retrieving jobs:', error);
      res.status(500).json({ message: 'Failed to retrieve jobs', error: error.message });
    }
  });
  
  router.post('/:jobId/bid', authenticateToken, async (req, res) => {
    try {
      const { jobId } = req.params;
      const driverId = req.user.id; // Assuming the authenticated user is a driver
  
      // Validate job ID
      if (!mongoose.Types.ObjectId.isValid(jobId)) {
        return res.status(400).json({ 
          message: 'Invalid job ID' 
        });
      }
  
      // Find the job
      const job = await Job.findById(jobId);
  
      if (!job) {
        return res.status(404).json({ 
          message: 'Job not found' 
        });
      }
  
      // Check if job is in a state that allows bidding
      if (job.status !== 'posted' && job.status !== 'bidding') {
        return res.status(400).json({ 
          message: 'This job is not currently accepting bids' 
        });
      }
  
      // Check if driver has already applied
      if (job.driversApplied.includes(driverId)) {
        return res.status(400).json({ 
          message: 'You have already applied to this job' 
        });
      }
  
      // Update job with driver's bid
      job.driversApplied.push(driverId);
      
      // Change job status to 'bidding' if not already
      if (job.status === 'posted') {
        job.status = 'bidding';
      }
  
      await job.save();
  
      res.status(201).json({ 
        message: 'Bid submitted successfully',
        driversApplied: job.driversApplied.length
      });
  
    } catch (error) {
      console.error('Job Bid Submission Error:', error);
      res.status(500).json({ 
        message: 'Internal server error',
        error: error.message 
      });
    }
  });

  router.get('/:jobId/applied-drivers', authenticateToken, async (req, res) => {
    try {
      const { jobId } = req.params;
  
      // Validate job ID
      if (!mongoose.Types.ObjectId.isValid(jobId)) {
        return res.status(400).json({ 
          message: 'Invalid job ID' 
        });
      }
  
      // Find the job and populate applied drivers
      const job = await Job.findById(jobId)
        .populate({
          path: 'driversApplied',
          select: 'name email phone rating' // Select specific driver fields
        });
  
      if (!job) {
        return res.status(404).json({ 
          message: 'Job not found' 
        });
      }
  
    
  
      res.status(200).json({
        jobId: job._id,
        driversApplied: job.driversApplied
      });
  
    } catch (error) {
      console.error('Applied Drivers Retrieval Error:', error);
      res.status(500).json({ 
        message: 'Internal server error',
        error: error.message 
      });
    }
  });

  router.put('/:jobId/select-driver', authenticateToken, async (req, res) => {
    try {
      const { jobId } = req.params;
      const { driverId } = req.body;
      const customerId = req.user.id;
  
      // Validate job ID and driver ID
      if (!mongoose.Types.ObjectId.isValid(jobId) || !mongoose.Types.ObjectId.isValid(driverId)) {
        return res.status(400).json({ 
          message: 'Invalid job or driver ID' 
        });
      }
  
      // Find the job
      const job = await Job.findOne({ 
        _id: jobId, 
        customerId: customerId 
      });
  
      if (!job) {
        return res.status(404).json({ 
          message: 'Job not found' 
        });
      }
  
      // Check if the driver has applied to this job
      if (!job.driversApplied.includes(driverId)) {
        return res.status(400).json({ 
          message: 'Selected driver has not applied to this job' 
        });
      }
  
      // Check job status
      if (job.status !== 'posted' && job.status !== 'bidding') {
        return res.status(400).json({ 
          message: 'Job cannot be assigned at this stage' 
        });
      }
  
      // Update job with selected driver
      job.driverId = driverId;
      job.status = 'accepted';
  
      await job.save();
  
      // Optionally, you might want to notify the driver
      // This would typically involve a separate notification service
  
      res.status(200).json({
        message: 'Driver selected successfully',
        job: {
          _id: job._id,
          driverId: job.driverId,
          status: job.status
        }
      });
  
    } catch (error) {
      console.error('Driver Selection Error:', error);
      res.status(500).json({ 
        message: 'Internal server error',
        error: error.message 
      });
    }
  });

  router.get('/driver/accepted-jobs', authenticateToken, async (req, res) => {
    try {
      // Debugging - Print the whole user object from the token
      console.log('User from token:', req.user);
      
      // Check if user exists and has an _id
      if (!req.user) {
        return res.status(400).json({ message: 'User information not found in token' });
      }
      
      // Extract the driver ID from the token - check both _id and id fields
      const driverId = req.user._id || req.user.id;
      console.log('Driver ID from token:', driverId);
      
      // If no driver ID was found, return an error
      if (!driverId) {
        return res.status(400).json({ 
          message: 'Driver ID not found in token',
          tokenUser: req.user
        });
      }
      
      // Get jobs with this driver ID
      const acceptedJobs = await Job.find({ 
        driverId: driverId, 
        status: 'accepted' 
      }).populate('customerId');
      
      console.log('Found jobs:', acceptedJobs.length);
      
      // Return the jobs found
      res.json({ 
        acceptedJobs,
        message: acceptedJobs.length ? 'Jobs found' : 'No accepted jobs' 
      });
    } catch (error) {
      console.error('Full error in route:', error);
      res.status(500).json({ 
        message: 'Error retrieving accepted jobs', 
        error: error.toString() 
      });
    }
  });
  
  router.put('/:jobId/complete', authenticateToken, async (req, res) => {
    try {
      const { jobId } = req.params;
      const driverId = req.user.id;
  
      // Validate job ID
      if (!mongoose.Types.ObjectId.isValid(jobId)) {
        return res.status(400).json({ 
          message: 'Invalid job ID' 
        });
      }
  
      // Find the job
      const job = await Job.findOne({ 
        _id: jobId, 
        driverId: driverId,
        status: 'accepted' // Only accepted jobs can be completed
      });
  
      if (!job) {
        return res.status(404).json({ 
          message: 'Job not found or cannot be completed' 
        });
      }
  
      // Update job status to completed
      job.status = 'completed';
      await job.save();
  
      res.status(200).json({
        message: 'Job marked as completed successfully',
        job: {
          _id: job._id,
          status: job.status
        }
      });
  
    } catch (error) {
      console.error('Job Completion Error:', error);
      res.status(500).json({ 
        message: 'Internal server error',
        error: error.message 
      });
    }
  });

  router.get('/driver/completed-jobs', authenticateToken, async (req, res) => {
    try {
      const driverId = req.user.id;
      
      // Get completed jobs for this driver
      const completedJobs = await Job.find({ 
        driverId: driverId, 
        status: 'completed' 
      }).populate('customerId').sort({ updatedAt: -1 });
      
      res.json({ 
        completedJobs,
        message: completedJobs.length ? 'Completed jobs found' : 'No completed jobs' 
      });
    } catch (error) {
      console.error('Error retrieving completed jobs:', error);
      res.status(500).json({ 
        message: 'Error retrieving completed jobs', 
        error: error.toString() 
      });
    }
  });
export default router;