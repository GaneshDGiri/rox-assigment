const express = require('express');
const { addStore, getStores, getAdminDashboard, updateStoreAddress } = require('../controllers/storeController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

const router = express.Router();

// Admin routes
router.post('/', verifyToken, verifyRole(['System Administrator']), addStore);
router.get('/dashboard-stats', verifyToken, verifyRole(['System Administrator']), getAdminDashboard);

// Store Owner routes
router.put('/update-address', verifyToken, verifyRole(['Store Owner']), updateStoreAddress);

// Accessible by Normal Users and Admins
router.get('/', verifyToken, verifyRole(['System Administrator', 'Normal User']), getStores);

module.exports = router;