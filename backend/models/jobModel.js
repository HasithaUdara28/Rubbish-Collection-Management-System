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
        rubbishType: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['posted', 'accepted', 'completed', 'cancelled'],
            default: 'posted',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Job = mongoose.model('Job', jobSchema);
