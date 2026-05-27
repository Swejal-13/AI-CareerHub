const express = require('express')
const { body } = require('express-validator')
const { signup, login, getMe } = require('../controllers/authController')
const { protect } = require('../middleware/auth')

const router = express.Router()

// Validation rules
const signupValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
]

const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
]

router.post('/signup', signupValidation, signup)
router.post('/login', loginValidation, login)
router.get('/me', protect, getMe)

module.exports = router
