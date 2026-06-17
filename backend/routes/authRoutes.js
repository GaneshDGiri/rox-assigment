const express = require('express');
const { register, login, updatePassword, updateAddress } = require('../controllers/authController');
const { validateUserRegistration } = require('../middleware/validatorMiddleware');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/signup', validateUserRegistration, register);
router.post('/login', login);
router.put('/update-password', verifyToken, updatePassword);
router.put('/update-address', verifyToken, updateAddress);

module.exports = router;