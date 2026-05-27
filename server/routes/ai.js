const express = require('express')
const { protect } = require('../middleware/auth')
const aiService = require('../services/aiService')

const router = express.Router()

/**
 * POST /api/ai/cover-letter
 * Generate a cover letter from name, jobTitle, company, skills
 */
router.post('/cover-letter', protect, (req, res) => {
  try {
    const { name, jobTitle, company, skills = [], tone = 'professional' } = req.body
    if (!jobTitle || !company) {
      return res.status(400).json({ message: 'jobTitle and company are required' })
    }

    const skillsList = Array.isArray(skills) ? skills.slice(0, 4).join(', ') : skills
    let letter = `Dear Hiring Manager,

I'm excited to apply for the ${jobTitle} position at ${company}. With strong expertise in ${skillsList || 'my technical domain'}, I'm confident I can make an immediate and meaningful contribution to your team.

Throughout my career, I've consistently delivered high-quality work with real business impact. ${company}'s mission resonates deeply with me, and I see this role as an ideal next step for both of us.

I'd love to connect and discuss how my background aligns with what you're building. Thank you for your consideration.

Best regards,
${name}`

    if (tone === 'friendly') {
      letter = letter.replace('Dear Hiring Manager,', 'Hi there,')
        .replace("I'm excited to apply for", "I'd love to explore")
    } else if (tone === 'bold') {
      letter = letter.replace("I'm excited to apply for the", "I'm the right candidate for the")
    }

    res.json({ letter })
  } catch (err) {
    res.status(500).json({ message: 'Cover letter generation failed' })
  }
})

/**
 * POST /api/ai/evaluate-answer
 * Score an interview answer
 */
router.post('/evaluate-answer', protect, (req, res) => {
  try {
    const { question, answer } = req.body
    if (!question || !answer) {
      return res.status(400).json({ message: 'question and answer are required' })
    }
    const result = aiService.evaluateAnswer(question, answer)
    res.json(result)
  } catch (err) {
    res.status(500).json({ message: 'Evaluation failed' })
  }
})

/**
 * POST /api/ai/roadmap
 * Generate skill gap roadmap
 */
router.post('/roadmap', protect, (req, res) => {
  try {
    const { dreamJob, currentSkills = [] } = req.body
    if (!dreamJob) return res.status(400).json({ message: 'dreamJob is required' })

    // Simplified rule-based roadmap generation
    const roadmapTemplates = {
      default: {
        requiredSkills: ['Python', 'System Design', 'Data Structures', 'Cloud (AWS/GCP)', 'Docker', 'SQL'],
        roadmap: [
          { phase: 'Week 1–2', title: 'Foundations', tasks: ['Core language fundamentals', 'Data structures & algorithms', 'Git & version control'] },
          { phase: 'Week 3–6', title: 'Core Skills', tasks: ['Build 2 portfolio projects', 'Practice LeetCode (Easy/Medium)', 'Study system design basics'] },
          { phase: 'Week 7–10', title: 'Advanced Topics', tasks: ['Distributed systems concepts', 'Cloud deployment (AWS/GCP)', 'Docker & containerization'] },
          { phase: 'Week 11–14', title: 'Job Ready', tasks: ['Mock interviews x10', 'Finalize portfolio', 'Network on LinkedIn', 'Apply to 5+ roles/week'] },
        ]
      }
    }

    const template = roadmapTemplates.default
    const missingSkills = template.requiredSkills.filter(s =>
      !currentSkills.map(c => c.toLowerCase()).includes(s.toLowerCase())
    )

    res.json({
      dreamJob,
      requiredSkills: template.requiredSkills,
      yourSkills: currentSkills,
      missingSkills,
      roadmap: template.roadmap,
    })
  } catch (err) {
    res.status(500).json({ message: 'Roadmap generation failed' })
  }
})

/**
 * POST /api/ai/rewrite-bullet
 * Rewrite a resume bullet point
 */
router.post('/rewrite-bullet', protect, (req, res) => {
  try {
    const { bullet } = req.body
    if (!bullet) return res.status(400).json({ message: 'bullet is required' })

    const actions = ['Engineered', 'Architected', 'Delivered', 'Spearheaded', 'Optimized', 'Designed', 'Built', 'Led']
    const action = actions[Math.floor(Math.random() * actions.length)]
    let rewritten = bullet
      .replace(/^(Worked on|Responsible for|Helped with|Assisted in)/i, action)
      .replace(/^(Was in charge of)/i, 'Led')

    if (rewritten === bullet) rewritten = `${action} ${bullet.charAt(0).toLowerCase() + bullet.slice(1)}`
    if (!/%|\$|\d/.test(rewritten)) rewritten += ', resulting in measurable improvement in team productivity'

    res.json({ original: bullet, rewritten })
  } catch (err) {
    res.status(500).json({ message: 'Rewrite failed' })
  }
})

module.exports = router
