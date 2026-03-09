import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protect = async (req, res, next) => {
    let token = req.cookies.token;

    if (!token) return res.status(401).json({ message: 'Not authorized, no token' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Exclude the password hash when fetching the user
        req.user = await User.findByPk(decoded.id, {
            attributes: { exclude: ['password'] }
        });
        
        if (!req.user) {
            return res.status(401).json({ message: 'User no longer exists' });
        }
        
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token failed or expired' });
    }
};