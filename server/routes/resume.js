const express = require('express')
const multer = require('multer')
const { protect } = require('../middleware/auth')
const aiService = require('../services/aiService')

const router = express.Router()

// Multer — store in memory for processing
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Only PDF and DOCX files are allowed'))
    }
  },
})

/**
 * POST /api/resume/analyze
 * Analyze uploaded resume and return ATS score + suggestions
 */
router.post('/analyze', protect, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    // In a real app you'd extract text from PDF/DOCX here.
    // For demo, we use mock text or whatever text was passed.
    const mockText = req.body.text || `
      Senior Frontend Developer | React, TypeScript, Node.js
      Experience: 4 years building scalable web applications
      Skills: React, TypeScript, JavaScript, GraphQL, PostgreSQL, Docker, AWS
      Education: BS Computer Science
      Projects: github.com/user/portfolio
      Increased team velocity by 35% through component library creation
    `

    const atsScore = aiService.calculateATSScore(mockText)
    const keywords = aiService.extractKeywords(mockText)
    const suggestions = aiService.getSuggestions(mockText)

    res.json({
      name: req.file.originalname,
      size: `${Math.round(req.file.size / 1024)} KB`,
      atsScore,
      keywords,
      suggestions,
      sections: {
        skills: { score: Math.min(atsScore + 8, 100), found: keywords.technical.length },
        experience: { score: Math.max(atsScore - 5, 40) },
        keywords: { score: Math.min(atsScore + 3, 100), matched: keywords.technical.length, total: 20 },
        format: { score: 85, issues: 1 },
      },
    })
  } catch (err) {
    console.error('[resume/analyze]', err)
    res.status(500).json({ message: err.message || 'Analysis failed' })
  }
})

/**
 * POST /api/resume/match
 * Match resume text against a job description
 */
router.post('/match', protect, async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body
    if (!resumeText || !jobDescription) {
      return res.status(400).json({ message: 'resumeText and jobDescription are required' })
    }
    const result = aiService.matchResumeToJob(resumeText, jobDescription)
    res.json(result)
  } catch (err) {
    res.status(500).json({ message: 'Matching failed' })
  }
})

module.exports = router
