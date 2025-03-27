import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const driverSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        vehicleType: { type: String, required: true },
        licenceNumber: { type: String, required: true },
        availability: { type: Boolean, default: false },
        verified: { type: Boolean, default: false },
        
       
        services: { 
            type: [String], 
            enum: ["Half Truck", "Full Truck", "More Than Truck"],
            default: [] 
        },

       
        locations: { 
            type: [String], 
            default: [] 
        },
    },
    {
        timestamps: true,
    }
);
driverSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
driverSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};
driverSchema.methods.generateAuthToken = function() {
    return jwt.sign({ id: this._id, role: 'driver', name: this.name }, 'your_secret_key_here', { expiresIn: '1h' });
};

export const Driver = mongoose.model('Driver', driverSchema);
