const express = require('express');
const { getUsers, createUser, getUserById } = require('../controllers/userController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');
const { validateUserRegistration } = require('../middleware/validatorMiddleware');

const router = express.Router();

// Admin user management routes
router.get('/', verifyToken, verifyRole(['System Administrator']), getUsers);
router.post('/', verifyToken, verifyRole(['System Administrator']), validateUserRegistration, createUser);
router.get('/:id', verifyToken, verifyRole(['System Administrator']), getUserById);

module.exports = router;