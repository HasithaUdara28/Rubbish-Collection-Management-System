import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const driverSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        vehicleCapacity: { type: String, required: true },
        licenceNumber: { type: String, required: true },
        verified: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

// Hash the password before saving
driverSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password
driverSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

// Generate JWT Token
driverSchema.methods.generateAuthToken = function() {
    return jwt.sign({ id: this._id, role: 'driver', name: this.name }, 'your_secret_key_here', { expiresIn: '1h' });
};

export const Driver = mongoose.model('Driver', driverSchema);
