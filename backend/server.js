const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const storeRoutes = require('./routes/storeRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const userModel = require('./models/userModel');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/ratings', ratingRoutes);

const seedAdminUser = async () => {
    const adminEmail = 'giriganesh016@gmail.com';
    const adminPassword = 'Gani@3010';
    const adminName = 'System Administrator';
    const adminAddress = 'System Admin Address';

    const existingAdmin = await userModel.getUserByEmail(adminEmail);
    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        await userModel.createUser({
            name: adminName,
            email: adminEmail,
            password: hashedPassword,
            address: adminAddress,
            role: 'System Administrator'
        });
        console.log('Seeded System Administrator account:', adminEmail);
    }
};

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await seedAdminUser();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
};

startServer();