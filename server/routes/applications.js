const express = require('express')
const { protect } = require('../middleware/auth')

const router = express.Router()

// In-memory store for demo mode
const applicationStore = new Map()

/**
 * GET /api/applications
 * Get all applications for the logged-in user (kanban grouped)
 */
router.get('/', protect, (req, res) => {
  const userApps = applicationStore.get(req.user.id) || {
    applied: [], interview: [], offer: [], rejected: []
  }
  res.json(userApps)
})

/**
 * POST /api/applications
 * Create a new application
 */
router.post('/', protect, (req, res) => {
  const { role, company, salary, status = 'applied' } = req.body
  if (!role || !company) {
    return res.status(400).json({ message: 'role and company are required' })
  }

  const app = {
    id: `app-${Date.now()}`,
    role, company, salary,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    logo: company.charAt(0).toUpperCase(),
    logoColor: '#6366f1',
  }

  const userApps = applicationStore.get(req.user.id) || {
    applied: [], interview: [], offer: [], rejected: []
  }
  userApps[status].unshift(app)
  applicationStore.set(req.user.id, userApps)

  res.status(201).json(app)
})

/**
 * PATCH /api/applications/:id/status
 * Move card between columns
 */
router.patch('/:id/status', protect, (req, res) => {
  const { status } = req.body
  const validStatuses = ['applied', 'interview', 'offer', 'rejected']
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' })
  }

  const userApps = applicationStore.get(req.user.id)
  if (!userApps) return res.status(404).json({ message: 'No applications found' })

  // Find and move the application
  let found = null
  for (const col of validStatuses) {
    const idx = userApps[col].findIndex(a => a.id === req.params.id)
    if (idx !== -1) {
      found = userApps[col].splice(idx, 1)[0]
      break
    }
  }

  if (!found) return res.status(404).json({ message: 'Application not found' })
  userApps[status].push(found)
  applicationStore.set(req.user.id, userApps)

  res.json({ message: 'Status updated', application: { ...found, status } })
})

/**
 * DELETE /api/applications/:id
 */
router.delete('/:id', protect, (req, res) => {
  const userApps = applicationStore.get(req.user.id)
  if (!userApps) return res.status(404).json({ message: 'No applications found' })

  const cols = ['applied', 'interview', 'offer', 'rejected']
  for (const col of cols) {
    const idx = userApps[col].findIndex(a => a.id === req.params.id)
    if (idx !== -1) {
      userApps[col].splice(idx, 1)
      applicationStore.set(req.user.id, userApps)
      return res.json({ message: 'Deleted' })
    }
  }
  res.status(404).json({ message: 'Application not found' })
})

module.exports = router
