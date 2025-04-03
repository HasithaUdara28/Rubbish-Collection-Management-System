import mongoose from "mongoose";

const jobSchema = mongoose.Schema(
    {
      customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver',
        optional: true,
      },
      jobType: {
        type: String,
        required: true,
      },
      pickupLocation: {
        type: String,
        required: true,
      },
      pickupTime: {
        type: Date,
        required: true
      },
      description: {
        type: String,
        default: '',
        maxlength: 500 
      },
      estimatedPrice: {
        type: Number,
        min: 0,
        required: true,
        default: null
      },
      status: {
        type: String,
        enum: ['posted', 'accepted', 'completed', 'cancelled', 'bidding'],
        default: 'posted',
        required: true,
      },
      driversApplied: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver',
      }],
    },
    {
      timestamps: true,
    }
  );
  
export const Job = mongoose.model('Job', jobSchema);