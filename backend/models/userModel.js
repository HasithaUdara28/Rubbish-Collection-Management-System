import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        role: { type: String, enum: ['customer', 'driver'], default: 'customer' }, 
    },
    {
        timestamps: true,
    }
);

// Hash the password before saving to the database
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

// Generate JWT Token
userSchema.methods.generateAuthToken = function() {
    return jwt.sign({ id: this._id, role: this.role, name: this.name }, 'your_secret_key_here', { expiresIn: '1h' });
};

export const User = mongoose.model('User', userSchema);
