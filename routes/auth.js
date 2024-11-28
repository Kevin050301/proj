// routes/auth.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { body } = require('express-validator');

// GET Register Page
router.get('/register', authController.getRegister);

// POST Register
router.post('/register', [
    body('username', 'Username is required').notEmpty(),
    body('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    body('password2', 'Confirm password is required').notEmpty(),
], authController.postRegister);

// GET Login Page
router.get('/login', authController.getLogin);

// POST Login
router.post('/login', [
    body('username', 'Username is required').notEmpty(),
    body('password', 'Password is required').notEmpty(),
], authController.postLogin);

// GET Logout
router.get('/logout', authController.logout);

module.exports = router;
