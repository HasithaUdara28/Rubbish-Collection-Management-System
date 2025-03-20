import express from 'express';
import { User } from '../models/userModel.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).send({
                message: 'Send all required fields: name, email, password'
            });
        }

        // Create new user
        const user = new User({ name, email, password, role });
        await user.save();

        // Generate token
        const token = user.generateAuthToken();
        res.status(201).json({ token });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).send({
                message: 'Send email and password'
            });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) return res.status(404).send({ message: 'User not found' });

        // Compare password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).send({ message: 'Invalid credentials' });

        // Generate token
        const token = user.generateAuthToken();
        res.status(200).json({ token });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

export default router;
