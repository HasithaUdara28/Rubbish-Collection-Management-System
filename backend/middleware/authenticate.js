import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js';

// export const authenticateToken = (req, res, next) => {
//     const token = req.header('Authorization');
//     if (!token) return res.status(401).json({ message: 'Access Denied' });

//     jwt.verify(token, 'your_secret_key_here', (err, user) => {
//         if (err) return res.status(403).json({ message: 'Invalid Token' });
//         req.user = user;
//         next();
//     });
// };
export const authenticateToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
        return res.status(401).json({ message: 'Access Denied: No token provided' });
    }
    
    // Extract the token from the Authorization header
    // The format should be "Bearer <token>"
    const token = authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'Access Denied: Invalid token format' });
    }

    try {
        const verified = jwt.verify(token, 'your_secret_key_here');
        req.user = verified;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};