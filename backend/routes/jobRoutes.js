import express from 'express';
import { Job } from '../models/jobModel.js';
import { Driver } from '../models/driverModel.js';
import { authenticateToken } from '../middleware/authenticate.js';
import mongoose from "mongoose";

const router = express.Router();


router.post('/create', authenticateToken, async (req, res) => {
  try {
    
    const { 
      jobType, 
      pickupLocation,
      pickupTime, 
      description, 
      estimatedPrice
    } = req.body;

    const customerId = req.user.id;
    
    
    if (!jobType || !pickupLocation || !pickupTime) { 
      return res.status(400).json({ 
        message: 'Job type, pickup location, and pickup time are required' 
      });
    }

    
    const pickupTimeDate = new Date(pickupTime);
    if (isNaN(pickupTimeDate.getTime()) || pickupTimeDate < new Date()) {
      return res.status(400).json({
        message: 'Invalid pickup time or time is in the past'
      });
    }

    
    const price = estimatedPrice ? parseFloat(estimatedPrice) : null;
    if (price !== null && isNaN(price)) {
      return res.status(400).json({ 
        message: 'Invalid estimated price' 
      });
    }

   
    const newJob = new Job({
      customerId,
      jobType,
      pickupLocation: pickupLocation.trim(),
      pickupTime: pickupTimeDate, 
      description: description || '',
      estimatedPrice: price,
      status: 'posted',
    });

   
    const savedJob = await newJob.save();

    
    res.status(201).json({
      message: 'Job created successfully',
      job: savedJob
    });

  } catch (error) {
    console.error('Job Creation Error:', error);

    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation Error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
});


router.get('/my-jobs', authenticateToken, async (req, res) => {
  try {
    const customerId = req.user.id;
    const jobs = await Job.find({ customerId })
    .sort({ createdAt: -1 }); 

    res.status(200).json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ 
      message: 'Failed to retrieve jobs', 
      error: error.message 
    });
  }
});


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


router.put('/:jobId', authenticateToken, async (req, res) => {
  try {
    const { jobId } = req.params;
    const { 
      jobType, 
      pickupLocation,
      pickupTime, 
      description, 
      estimatedPrice 
    } = req.body;

    
    let pickupTimeDate;
    if (pickupTime) {
      pickupTimeDate = new Date(pickupTime);
      if (isNaN(pickupTimeDate.getTime()) || pickupTimeDate < new Date()) {
        return res.status(400).json({
          message: 'Invalid pickup time or time is in the past'
        });
      }
    }

    
    const updatedJob = await Job.findOneAndUpdate(
      { 
        _id: jobId, 
        customerId: req.user.userId,
        status: 'posted' 
      }, 
      { 
        jobType, 
        pickupLocation, 
        pickupTime: pickupTimeDate, 
        description, 
        estimatedPrice: estimatedPrice ? parseFloat(estimatedPrice) : null
      },
      { 
        new: true, 
        runValidators: true 
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


router.put('/:jobId/cancel', authenticateToken, async (req, res) => {
  try {
    const { jobId } = req.params;

   
    const job = await Job.findOneAndUpdate(
      { 
        _id: jobId, 
        customerId: req.user.userId,
        status: { $in: ['posted', 'accepted'] } 
      }, 
      { 
        status: 'cancelled' 
      },
      { 
        new: true
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
  
      
      if (jobType) queryConditions.jobType = jobType;
      if (minPrice || maxPrice) {
        queryConditions.estimatedPrice = {};
        if (minPrice) queryConditions.estimatedPrice.$gte = parseFloat(minPrice);
        if (maxPrice) queryConditions.estimatedPrice.$lte = parseFloat(maxPrice);
      }
      if (location) queryConditions.pickupLocation = { $regex: location, $options: 'i' };
  
      
      const jobs = await Job.find(queryConditions)
        .populate('customerId', 'name')
        .populate('driverId', 'name')
        .populate('driversApplied', 'name') 
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
      const driverId = req.user.id; 
  
      
      if (!mongoose.Types.ObjectId.isValid(jobId)) {
        return res.status(400).json({ 
          message: 'Invalid job ID' 
        });
      }
  
     
      const job = await Job.findById(jobId);
  
      if (!job) {
        return res.status(404).json({ 
          message: 'Job not found' 
        });
      }
  
      
      if (job.status !== 'posted' && job.status !== 'bidding') {
        return res.status(400).json({ 
          message: 'This job is not currently accepting bids' 
        });
      }
  
      
      if (job.driversApplied.includes(driverId)) {
        return res.status(400).json({ 
          message: 'You have already applied to this job' 
        });
      }
  
      
      job.driversApplied.push(driverId);
      
      
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
  
      
      if (!mongoose.Types.ObjectId.isValid(jobId)) {
        return res.status(400).json({ 
          message: 'Invalid job ID' 
        });
      }
  
      
      const job = await Job.findById(jobId)
        .populate({
          path: 'driversApplied',
          select: 'name email phone rating' 
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
  
      
      if (!mongoose.Types.ObjectId.isValid(jobId) || !mongoose.Types.ObjectId.isValid(driverId)) {
        return res.status(400).json({ 
          message: 'Invalid job or driver ID' 
        });
      }
  
      
      const job = await Job.findOne({ 
        _id: jobId, 
        customerId: customerId 
      });
  
      if (!job) {
        return res.status(404).json({ 
          message: 'Job not found' 
        });
      }
  
     
      if (!job.driversApplied.includes(driverId)) {
        return res.status(400).json({ 
          message: 'Selected driver has not applied to this job' 
        });
      }
  
      
      if (job.status !== 'posted' && job.status !== 'bidding') {
        return res.status(400).json({ 
          message: 'Job cannot be assigned at this stage' 
        });
      }
  
      
      job.driverId = driverId;
      job.status = 'accepted';
  
      await job.save();
  
      
  
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
      
      console.log('User from token:', req.user);
      
      
      if (!req.user) {
        return res.status(400).json({ message: 'User information not found in token' });
      }
      
      
      const driverId = req.user._id || req.user.id;
      console.log('Driver ID from token:', driverId);
      
      
      if (!driverId) {
        return res.status(400).json({ 
          message: 'Driver ID not found in token',
          tokenUser: req.user
        });
      }
      
      
      const acceptedJobs = await Job.find({ 
        driverId: driverId, 
        status: 'accepted' 
      }).populate('customerId');
      
      console.log('Found jobs:', acceptedJobs.length);
      
      
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
  
      
      if (!mongoose.Types.ObjectId.isValid(jobId)) {
        return res.status(400).json({ 
          message: 'Invalid job ID' 
        });
      }
  
      
      const job = await Job.findOne({ 
        _id: jobId, 
        driverId: driverId,
        status: 'accepted' 
      });
  
      if (!job) {
        return res.status(404).json({ 
          message: 'Job not found or cannot be completed' 
        });
      }
  
      
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