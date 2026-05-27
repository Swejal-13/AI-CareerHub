const express = require('express')
const { protect } = require('../middleware/auth')

const router = express.Router()

// Mock job data (mirrors client dummyData)
const MOCK_JOBS = [
  { id: 'j1', title: 'Senior Frontend Engineer', company: 'Stripe', location: 'San Francisco, CA (Hybrid)', salary: '$150k – $200k', type: 'Full-time', stack: ['React', 'TypeScript', 'GraphQL'], posted: '2 days ago', match: 88 },
  { id: 'j2', title: 'Full Stack Developer', company: 'Notion', location: 'Remote', salary: '$130k – $170k', type: 'Full-time', stack: ['Node.js', 'React', 'PostgreSQL'], posted: '1 day ago', match: 74 },
  { id: 'j3', title: 'Backend Engineer – Python', company: 'Vercel', location: 'New York, NY', salary: '$140k – $180k', type: 'Full-time', stack: ['Python', 'FastAPI', 'Redis', 'AWS'], posted: '3 days ago', match: 61 },
  { id: 'j4', title: 'ML Engineer', company: 'Hugging Face', location: 'Remote', salary: '$160k – $220k', type: 'Full-time', stack: ['Python', 'PyTorch', 'Transformers'], posted: '5 days ago', match: 52 },
  { id: 'j5', title: 'DevOps / Platform Engineer', company: 'Linear', location: 'San Francisco, CA', salary: '$135k – $175k', type: 'Full-time', stack: ['Kubernetes', 'Terraform', 'Go', 'AWS'], posted: '1 week ago', match: 45 },
]

/**
 * GET /api/jobs
 * List all jobs with optional search/filter
 */
router.get('/', protect, (req, res) => {
  const { search, stack, type } = req.query
  let jobs = [...MOCK_JOBS]

  if (search) {
    const q = search.toLowerCase()
    jobs = jobs.filter(j =>
      j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q)
    )
  }
  if (stack) {
    jobs = jobs.filter(j => j.stack.some(s => s.toLowerCase().includes(stack.toLowerCase())))
  }
  if (type) {
    jobs = jobs.filter(j => j.type === type)
  }

  res.json({ jobs, total: jobs.length })
})

/**
 * GET /api/jobs/:id
 */
router.get('/:id', protect, (req, res) => {
  const job = MOCK_JOBS.find(j => j.id === req.params.id)
  if (!job) return res.status(404).json({ message: 'Job not found' })
  res.json({ job })
})

/**
 * POST /api/jobs/:id/apply
 */
router.post('/:id/apply', protect, (req, res) => {
  const job = MOCK_JOBS.find(j => j.id === req.params.id)
  if (!job) return res.status(404).json({ message: 'Job not found' })
  // In real app: create Application record
  res.json({ message: 'Application submitted successfully', jobId: req.params.id })
})

module.exports = router
