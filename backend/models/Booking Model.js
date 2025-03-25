import mongoose from "mongoose";

const bookingSchema = mongoose.Schema(
    {
        customerId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Customer', 
            required: true 
        },
        driverId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Driver', 
            required: true 
        },
        service: { 
            type: String, 
            enum: ["Half Truck", "Full Truck", "More Than Truck"],
            required: true 
        },
        date: { 
            type: Date, 
            required: true 
        },
        startTime: { 
            type: Date, 
            required: true 
        },
        endTime: { 
            type: Date, 
            required: true 
        },
        location: { 
            type: String, 
            required: true 
        },
        status: { 
            type: String, 
            enum: ['pending', 'confirmed', 'completed', 'cancelled'],
            default: 'pending'
        },
        notes: { 
            type: String,
            default: ''
        },
        totalPrice: {
            type: Number,
            required: true
        },
        paymentStatus: {
            type: String,
            enum: ['unpaid', 'paid'],
            default: 'unpaid'
        }
    },
    {
        timestamps: true,
    }
);

export const Booking = mongoose.model('Booking', bookingSchema);