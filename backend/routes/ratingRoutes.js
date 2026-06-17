const express = require('express');
const { addOrUpdateRating, getStoreOwnerDashboard } = require('../controllers/ratingController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', verifyToken, verifyRole(['Normal User']), addOrUpdateRating);
router.get('/owner-dashboard', verifyToken, verifyRole(['Store Owner']), getStoreOwnerDashboard);

module.exports = router;