import mongoose from "mongoose";

const paymentSchema = mongoose.Schema(
    {
        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job',
            required: true,
        },
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        driverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Driver',
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'completed', 'failed'],
            default: 'pending',
            required: true,
        },
        paymentMethod: {
            type: String,
            required: true,
        },
        transactionId: {
            type: String,
            optional: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Payment = mongoose.model('Payment', paymentSchema);
