const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')

// Try to use Mongoose model; fall back to mock mode if no DB
let User
try {
  User = require('../models/User')
} catch (e) {
  User = null
}

// In-memory mock store for demo / no-DB mode
const mockUsers = [
  {
    _id: 'demo-user-001',
    name: 'Alex Johnson',
    email: 'demo@careerhub.io',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewFX7NoN4MbC3W3i', // demo1234
    role: 'jobseeker',
    profile: {},
    toPublicJSON() { return { id: this._id, name: this.name, email: this.email, role: this.role, profile: this.profile } }
  }
]

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id || user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'fallback_secret_change_in_prod',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )
}

// ─── Signup ───────────────────────────────────────────────────────────────────
exports.signup = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg })
    }

    const { name, email, password } = req.body

    // Mock mode (no DB)
    if (!User) {
      const existing = mockUsers.find(u => u.email === email.toLowerCase())
      if (existing) return res.status(409).json({ message: 'An account with this email already exists.' })

      const bcrypt = require('bcryptjs')
      const hashed = await bcrypt.hash(password, 12)
      const newUser = {
        _id: `user-${Date.now()}`,
        name,
        email: email.toLowerCase(),
        password: hashed,
        role: 'jobseeker',
        profile: {},
        toPublicJSON() { return { id: this._id, name: this.name, email: this.email, role: this.role, profile: this.profile } }
      }
      mockUsers.push(newUser)
      const token = generateToken(newUser)
      return res.status(201).json({ user: newUser.toPublicJSON(), token })
    }

    // DB mode
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email already exists.' })
    }

    const user = await User.create({ name, email, password })
    const token = generateToken(user)
    res.status(201).json({ user: user.toPublicJSON(), token })
  } catch (err) {
    console.error('[signup]', err)
    res.status(500).json({ message: 'Registration failed. Please try again.' })
  }
}

// ─── Login ────────────────────────────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg })
    }

    const { email, password } = req.body
    const bcrypt = require('bcryptjs')

    // Mock mode
    if (!User) {
      const user = mockUsers.find(u => u.email === email.toLowerCase())
      if (!user) return res.status(401).json({ message: 'Invalid email or password.' })

      const valid = await bcrypt.compare(password, user.password)
      if (!valid) return res.status(401).json({ message: 'Invalid email or password.' })

      const token = generateToken(user)
      return res.json({ user: user.toPublicJSON(), token })
    }

    // DB mode
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password')
    if (!user) return res.status(401).json({ message: 'Invalid email or password.' })

    const isValid = await user.comparePassword(password)
    if (!isValid) return res.status(401).json({ message: 'Invalid email or password.' })

    const token = generateToken(user)
    res.json({ user: user.toPublicJSON(), token })
  } catch (err) {
    console.error('[login]', err)
    res.status(500).json({ message: 'Login failed. Please try again.' })
  }
}

// ─── Get current user ─────────────────────────────────────────────────────────
exports.getMe = async (req, res) => {
  try {
    if (!User) {
      const user = mockUsers.find(u => u._id === req.user.id)
      if (!user) return res.status(404).json({ message: 'User not found.' })
      return res.json({ user: user.toPublicJSON() })
    }

    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ message: 'User not found.' })
    res.json({ user: user.toPublicJSON() })
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user.' })
  }
}
