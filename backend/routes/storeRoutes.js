const express = require('express');
const {
    addStore,
    getStores,
    getAdminDashboard,
    updateStoreAddress,
    requestStoreUpdate,
    getStoreUpdateRequests,
    approveStoreUpdateRequest,
    rejectStoreUpdateRequest
} = require('../controllers/storeController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

const router = express.Router();

// Admin routes
router.post('/', verifyToken, verifyRole(['System Administrator']), addStore);
router.get('/dashboard-stats', verifyToken, verifyRole(['System Administrator']), getAdminDashboard);
router.get('/update-requests', verifyToken, verifyRole(['System Administrator']), getStoreUpdateRequests);
router.put('/update-requests/:requestId/approve', verifyToken, verifyRole(['System Administrator']), approveStoreUpdateRequest);
router.put('/update-requests/:requestId/reject', verifyToken, verifyRole(['System Administrator']), rejectStoreUpdateRequest);

// Store Owner routes
router.put('/update-address', verifyToken, verifyRole(['Store Owner']), updateStoreAddress);
router.post('/request-update', verifyToken, verifyRole(['Store Owner']), requestStoreUpdate);

// Accessible by Normal Users and Admins
router.get('/', verifyToken, verifyRole(['System Administrator', 'Normal User']), getStores);

module.exports = router;