require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const mongoose = require('mongoose')

const authRoutes = require('./routes/auth')
const resumeRoutes = require('./routes/resume')
const jobRoutes = require('./routes/jobs')
const applicationRoutes = require('./routes/applications')
const aiRoutes = require('./routes/ai')

const app = express()
const PORT = process.env.PORT || 5000

// ─── Security & middleware ────────────────────────────────────────────────────
app.use(helmet())
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 'https://yourdomain.com' : 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Rate limiting — generous for dev
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200,
  message: { message: 'Too many requests, please try again later.' },
})
app.use('/api', limiter)

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes)
app.use('/api/resume', resumeRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/applications', applicationRoutes)
app.use('/api/ai', aiRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Error]', err.message)
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
})

// ─── DB + Start ───────────────────────────────────────────────────────────────
async function start() {
  try {
    if (process.env.MONGO_URI) {
      await mongoose.connect(process.env.MONGO_URI)
      console.log('✅ MongoDB connected')
    } else {
      console.log('⚠️  No MONGO_URI — running without DB (mock mode)')
    }
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error('Failed to start server:', err)
    process.exit(1)
  }
}

start()
