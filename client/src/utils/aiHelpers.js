// ─── Simple rule-based AI helpers ────────────────────────────────────────────
// These run on the client to simulate AI features without a real model

const TECH_KEYWORDS = [
  'react', 'vue', 'angular', 'node', 'express', 'fastapi', 'django', 'flask',
  'python', 'javascript', 'typescript', 'java', 'golang', 'rust', 'c++',
  'sql', 'postgresql', 'mongodb', 'redis', 'elasticsearch',
  'aws', 'gcp', 'azure', 'docker', 'kubernetes', 'terraform',
  'git', 'ci/cd', 'graphql', 'rest', 'grpc',
  'machine learning', 'tensorflow', 'pytorch', 'sklearn', 'numpy', 'pandas',
  'html', 'css', 'tailwind', 'sass', 'webpack', 'vite',
  'agile', 'scrum', 'jira', 'figma', 'storybook',
]

const SOFT_SKILLS = [
  'leadership', 'communication', 'teamwork', 'problem-solving', 'collaboration',
  'analytical', 'creative', 'detail-oriented', 'organized', 'adaptable',
]

// Extract keywords from resume text
export function extractKeywords(text) {
  const lower = text.toLowerCase()
  const found = TECH_KEYWORDS.filter(kw => lower.includes(kw))
  const soft = SOFT_SKILLS.filter(s => lower.includes(s))
  return { technical: found, soft }
}

// Calculate ATS score based on resume text
export function calculateATSScore(text) {
  const lower = text.toLowerCase()
  let score = 40 // base

  // Keywords presence
  const kwCount = TECH_KEYWORDS.filter(kw => lower.includes(kw)).length
  score += Math.min(kwCount * 2.5, 25)

  // Structure checks
  if (lower.includes('experience') || lower.includes('work history')) score += 5
  if (lower.includes('education')) score += 5
  if (lower.includes('skills')) score += 5
  if (lower.includes('summary') || lower.includes('objective')) score += 3
  if (lower.includes('projects') || lower.includes('portfolio')) score += 3
  if (/\d+%/.test(text) || /\$[\d,]+/.test(text)) score += 5 // metrics
  if (lower.includes('github') || lower.includes('linkedin')) score += 4

  // Penalize for common issues
  if (text.length < 500) score -= 15
  if (lower.includes('objective:') && !lower.includes('summary')) score -= 3

  return Math.min(Math.max(Math.round(score), 20), 98)
}

// Match resume to a job description
export function matchResumeToJob(resumeText, jobDescription) {
  const resumeLower = resumeText.toLowerCase()
  const jobLower = jobDescription.toLowerCase()

  // Extract job keywords
  const jobKeywords = TECH_KEYWORDS.filter(kw => jobLower.includes(kw))
  const matchedKeywords = jobKeywords.filter(kw => resumeLower.includes(kw))
  const missingKeywords = jobKeywords.filter(kw => !resumeLower.includes(kw))

  const matchPercent = jobKeywords.length > 0
    ? Math.round((matchedKeywords.length / jobKeywords.length) * 100)
    : 60

  return {
    score: Math.min(matchPercent, 95),
    matched: matchedKeywords,
    missing: missingKeywords,
    suggestions: missingKeywords.slice(0, 4).map(kw =>
      `Add experience or projects demonstrating ${kw}`
    )
  }
}

// Generate resume improvement suggestions
export function getResumeSuggestions(text) {
  const lower = text.toLowerCase()
  const suggestions = []

  if (!/\d+%/.test(text) && !/increased|reduced|improved/i.test(text))
    suggestions.push('Add quantifiable achievements (e.g., "Reduced load time by 40%")')

  if (!lower.includes('github') && !lower.includes('portfolio'))
    suggestions.push('Include links to your GitHub profile or portfolio')

  if (lower.includes('responsible for') || lower.includes('worked on'))
    suggestions.push('Replace weak phrases like "responsible for" with action verbs (built, led, architected)')

  if (!lower.includes('summary') && !lower.includes('objective'))
    suggestions.push('Add a 2-3 sentence professional summary at the top')

  if (text.length < 800)
    suggestions.push('Expand your experience descriptions – aim for 1–2 detailed bullet points per role')

  if (!lower.includes('team') && !lower.includes('collaborat'))
    suggestions.push('Mention collaborative projects or cross-functional team experience')

  suggestions.push('Ensure each bullet starts with a strong action verb')
  suggestions.push('Tailor keywords to each job description before applying')

  return suggestions.slice(0, 5)
}

// Rewrite a bullet point to be stronger
export function rewriteBullet(bullet) {
  const actions = ['Engineered', 'Architected', 'Delivered', 'Spearheaded', 'Optimized', 'Designed', 'Built', 'Led']
  const action = actions[Math.floor(Math.random() * actions.length)]
  const withMetric = bullet.includes('%') || bullet.includes('$')
    ? bullet
    : bullet + ', resulting in a 30% improvement in team efficiency'

  // Basic rewrite: replace weak openers
  let rewritten = withMetric
    .replace(/^(Worked on|Responsible for|Helped with|Assisted in)/i, action)
    .replace(/^(Was in charge of)/i, 'Led')
    .replace(/^(Did|Made|Got)/i, action)

  if (rewritten === withMetric) {
    rewritten = `${action} ${bullet.charAt(0).toLowerCase() + bullet.slice(1)}`
  }

  return rewritten
}

// Evaluate interview answer
export function evaluateAnswer(question, answer) {
  if (!answer || answer.trim().length < 20) {
    return { score: 2, feedback: 'Answer is too short. Provide more detail and context.' }
  }

  let score = 5

  // Check answer length
  const wordCount = answer.split(/\s+/).length
  if (wordCount > 80) score += 1
  if (wordCount > 150) score += 1

  // Check for STAR method clues
  if (/situation|context/i.test(answer)) score += 0.5
  if (/action|did|implemented|built/i.test(answer)) score += 0.5
  if (/result|outcome|impact|improved/i.test(answer)) score += 1
  if (/\d+/.test(answer)) score += 0.5 // metrics

  score = Math.min(Math.round(score), 10)

  let feedback = ''
  if (score >= 8) feedback = 'Excellent answer! Well-structured with clear context and measurable outcomes.'
  else if (score >= 6) feedback = 'Good answer. Consider adding specific metrics or outcomes to strengthen your response.'
  else if (score >= 4) feedback = 'Decent start, but try to use the STAR method: Situation, Task, Action, Result.'
  else feedback = 'Answer needs more depth. Explain the context, what you did, and what the outcome was.'

  return { score, feedback }
}

// Generate a cover letter template
export function generateCoverLetter(name, jobTitle, company, skills = []) {
  const skillsList = skills.slice(0, 3).join(', ') || 'my technical expertise'
  return `Dear Hiring Manager,

I'm excited to apply for the ${jobTitle} position at ${company}. Having built strong expertise in ${skillsList}, I believe I can make an immediate, meaningful contribution to your team.

Throughout my career, I've consistently delivered high-quality work that drives real impact. I'm drawn to ${company}'s mission and culture, and I see this role as an ideal next step where I can both contribute and grow.

I'd love the opportunity to discuss how my background aligns with what you're looking for. Thank you for considering my application — I look forward to the conversation.

Best regards,
${name}`
}
