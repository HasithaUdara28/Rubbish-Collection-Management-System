import jwt from 'jsonwebtoken';
import { User } from '../models/User';

export const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Access Denied' });

    jwt.verify(token, 'your_secret_key_here', (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid Token' });
        req.user = user;
        next();
    });
};
