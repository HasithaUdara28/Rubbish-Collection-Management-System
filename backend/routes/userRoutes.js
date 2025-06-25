import express from 'express';
import { User } from '../models/userModel.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { name, email, password,phone, role } = req.body;

        
        if (!name || !email || !password) {
            return res.status(400).send({
                message: 'Send all required fields: name, email, password'
            });
        }

        
        const user = new User({ name, email, password,phone, role });
        await user.save();

        
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

        
        if (!email || !password) {
            return res.status(400).send({
                message: 'Send email and password'
            });
        }

        
        const user = await User.findOne({ email });
        if (!user) return res.status(404).send({ message: 'User not found' });

       
        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).send({ message: 'Invalid credentials' });

        
        const token = user.generateAuthToken();
        res.status(200).json({ token });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

router.get('/customers', async (req, res) => {
    try {
        
        const customers = await User.find({ 
            $or: [
                { role: 'customer' }, 
                { role: { $exists: false } }
            ] 
        });
        res.status(200).json(customers);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
});


router.get('/customers/:id', async (req, res) => {
    try {
        const customer = await User.findById(req.params.id);
        if (!customer) return res.status(404).json({ message: 'Customer not found' });
        res.status(200).json(customer);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
});

export default router;
