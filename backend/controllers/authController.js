const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const storeModel = require('../models/storeModel');

const register = async (req, res) => {
    try {
        const { name, email, password, address, role } = req.body;
        const reservedAdminEmail = 'giriganesh016@gmail.com';
        
        // Validate role - only allow Normal User and Store Owner (System Administrator is reserved)
        const validRoles = ['Normal User', 'Store Owner'];
        const userRole = validRoles.includes(role) ? role : 'Normal User';

        const existingUser = await userModel.getUserByEmail(email);
        if (existingUser) return res.status(400).json({ message: "Email already in use" });
        if (email === reservedAdminEmail) {
            return res.status(403).json({ message: "This email is reserved for the System Administrator" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = await userModel.createUser({ name, email, password: hashedPassword, address, role: userRole });
        
        // If Store Owner, create store with signup details
        if (userRole === 'Store Owner') {
            await storeModel.createStore({ owner_id: userId, name, email, address });
        }
        
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.getUserByEmail(email);
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        res.json({ token, role: user.role, name: user.name });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updatePassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await userModel.updatePassword(req.user.id, hashedPassword);
        res.json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateAddress = async (req, res) => {
    try {
        const { address } = req.body;
        if (!address || address.length > 400) {
            return res.status(400).json({ message: "Address is required and must not exceed 400 characters" });
        }
        await userModel.updateAddress(req.user.id, address);
        res.json({ message: "Address updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { register, login, updatePassword, updateAddress };