/**
 * AI Service — rule-based logic for resume analysis, job matching, etc.
 * This runs on the server side and mirrors the client-side helpers.
 * In a production system you'd call an LLM API here.
 */

const TECH_KEYWORDS = [
  'react', 'vue', 'angular', 'node', 'express', 'fastapi', 'django', 'flask',
  'python', 'javascript', 'typescript', 'java', 'golang', 'rust',
  'sql', 'postgresql', 'mongodb', 'redis', 'elasticsearch',
  'aws', 'gcp', 'azure', 'docker', 'kubernetes', 'terraform',
  'git', 'graphql', 'rest', 'grpc', 'machine learning', 'tensorflow',
  'pytorch', 'sklearn', 'numpy', 'pandas', 'html', 'css', 'tailwind',
  'webpack', 'vite', 'agile', 'scrum', 'figma', 'storybook',
]

/**
 * Extract keywords from resume text
 */
exports.extractKeywords = (text) => {
  const lower = text.toLowerCase()
  const technical = TECH_KEYWORDS.filter(kw => lower.includes(kw))
  const softSkills = ['leadership', 'communication', 'teamwork', 'collaboration', 'analytical']
    .filter(s => lower.includes(s))
  return { technical, soft: softSkills }
}

/**
 * Calculate ATS score (0–100)
 */
exports.calculateATSScore = (text) => {
  const lower = text.toLowerCase()
  let score = 40

  const kwCount = TECH_KEYWORDS.filter(kw => lower.includes(kw)).length
  score += Math.min(kwCount * 2.5, 25)

  if (lower.includes('experience') || lower.includes('work history')) score += 5
  if (lower.includes('education')) score += 5
  if (lower.includes('skills')) score += 5
  if (lower.includes('summary') || lower.includes('objective')) score += 3
  if (lower.includes('projects') || lower.includes('portfolio')) score += 3
  if (/\d+%/.test(text) || /\$[\d,]+/.test(text)) score += 5
  if (lower.includes('github') || lower.includes('linkedin')) score += 4

  if (text.length < 500) score -= 15

  return Math.min(Math.max(Math.round(score), 20), 98)
}

/**
 * Generate improvement suggestions
 */
exports.getSuggestions = (text) => {
  const lower = text.toLowerCase()
  const suggestions = []

  if (!/\d+%/.test(text) && !/increased|reduced|improved/i.test(text))
    suggestions.push('Add quantifiable achievements (e.g. "Reduced load time by 40%")')
  if (!lower.includes('github') && !lower.includes('portfolio'))
    suggestions.push('Include links to your GitHub profile or portfolio')
  if (lower.includes('responsible for') || lower.includes('worked on'))
    suggestions.push('Replace weak phrases like "responsible for" with strong action verbs')
  if (!lower.includes('summary') && !lower.includes('objective'))
    suggestions.push('Add a 2-3 sentence professional summary at the top')
  if (text.length < 800)
    suggestions.push('Expand experience descriptions — aim for 1–2 detailed bullet points per role')

  suggestions.push('Ensure each bullet starts with a strong action verb')
  suggestions.push('Tailor keywords to each specific job description')

  return suggestions.slice(0, 5)
}

/**
 * Match resume to job and return score + details
 */
exports.matchResumeToJob = (resumeText, jobText) => {
  const resumeLower = resumeText.toLowerCase()
  const jobLower = jobText.toLowerCase()

  const jobKeywords = TECH_KEYWORDS.filter(kw => jobLower.includes(kw))
  const matched = jobKeywords.filter(kw => resumeLower.includes(kw))
  const missing = jobKeywords.filter(kw => !resumeLower.includes(kw))

  const score = jobKeywords.length > 0
    ? Math.min(Math.round((matched.length / jobKeywords.length) * 100), 95)
    : 60

  return {
    score,
    matched,
    missing,
    suggestions: missing.slice(0, 3).map(kw => `Add experience demonstrating ${kw}`),
  }
}

/**
 * Evaluate an interview answer
 */
exports.evaluateAnswer = (question, answer) => {
  if (!answer || answer.trim().split(/\s+/).length < 10) {
    return { score: 2, feedback: 'Answer is too short. Provide more detail and context.' }
  }

  let score = 5
  const wordCount = answer.split(/\s+/).length
  if (wordCount > 80) score += 1
  if (wordCount > 150) score += 1
  if (/situation|context/i.test(answer)) score += 0.5
  if (/action|did|implemented|built/i.test(answer)) score += 0.5
  if (/result|outcome|impact|improved/i.test(answer)) score += 1
  if (/\d+/.test(answer)) score += 0.5

  score = Math.min(Math.round(score), 10)

  let feedback = ''
  if (score >= 8) feedback = 'Excellent! Well-structured with clear context and measurable outcomes.'
  else if (score >= 6) feedback = 'Good answer. Add specific metrics to strengthen your response.'
  else if (score >= 4) feedback = 'Decent start. Try the STAR method: Situation, Task, Action, Result.'
  else feedback = 'Needs more depth. Explain context, actions taken, and measurable outcomes.'

  return { score, feedback }
}
