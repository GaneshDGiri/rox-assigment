const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const validateUserRegistration = [
    body('name').isLength({ min: 20, max: 60 }).withMessage('Name must be 20-60 characters'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/)
        .withMessage('Password must be 8-16 chars, contain 1 uppercase and 1 special char'),
    body('address').isLength({ max: 400 }).withMessage('Address max 400 characters'),
    
    // Explicitly accept and validate the role
    body('role').optional().isIn(['System Administrator', 'Normal User', 'Store Owner'])
        .withMessage('Invalid role selected'),
        
    handleValidationErrors
];

module.exports = { validateUserRegistration };