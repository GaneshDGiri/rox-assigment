const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const ratingModel = require('../models/ratingModel');

const getUsers = async (req, res) => {
    try {
        const filters = {
            name: req.query.name,
            email: req.query.email,
            address: req.query.address,
            role: req.query.role,
            sortBy: req.query.sortBy,
            order: req.query.order
        };
        const users = await userModel.getAllUsers(filters);
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createUser = async (req, res) => {
    try {
        const { name, email, password, address, role } = req.body;
        const allowedRoles = ['System Administrator', 'Normal User', 'Store Owner'];
        const reservedAdminEmail = 'giriganesh016@gmail.com';

        if (!allowedRoles.includes(role)) {
            return res.status(400).json({ message: 'Invalid role provided' });
        }

        const existingUser = await userModel.getUserByEmail(email);
        if (existingUser) return res.status(400).json({ message: 'Email already in use' });
        if (email === reservedAdminEmail && role !== 'System Administrator') {
            return res.status(403).json({ message: 'This email is reserved for the System Administrator' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await userModel.createUser({ name, email, password: hashedPassword, address, role });

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await userModel.getUserById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (user.role === 'Store Owner') {
            const ratings = await ratingModel.getStoreRatingsByOwner(user.id);
            const average_rating = ratings.length > 0
                ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
                : 0;
            return res.json({ ...user, ratings, average_rating });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getUsers, createUser, getUserById };