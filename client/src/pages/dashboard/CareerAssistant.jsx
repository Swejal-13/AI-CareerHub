import { useState, useRef, useEffect } from 'react'
import { Send, Bot, Sparkles } from 'lucide-react'
import { useAuthStore } from '../../context/authStore'
import clsx from 'clsx'

const SUGGESTIONS = [
  'How do I negotiate a higher salary?',
  'What should I include in my LinkedIn summary?',
  'How do I prepare for a system design interview?',
  'What are the most in-demand tech skills in 2024?',
  'How do I switch from frontend to full-stack roles?',
]

// Simple rule-based career Q&A
function getAIResponse(message) {
  const lower = message.toLowerCase()

  if (lower.includes('salary') || lower.includes('negotiat')) {
    return `**Salary negotiation tips:**\n\n1. **Research market rates** using Levels.fyi, Glassdoor, or LinkedIn Salary before the conversation.\n\n2. **Let them name the first number** — this gives you a baseline to work from.\n\n3. **Counter with a range**, not a single figure. Place your target at the bottom of your range.\n\n4. **Don't just focus on base pay** — RSUs, signing bonus, and PTO all have value.\n\n5. **Use competing offers** (even ones you're not serious about) as leverage.\n\nMost importantly: negotiating rarely causes offer withdrawals. Companies expect it. Ask for what you deserve! 💪`
  }

  if (lower.includes('linkedin') || lower.includes('profile')) {
    return `**LinkedIn profile tips:**\n\n• **Headline**: Don't just list your title. Use "Senior React Engineer | Building scalable UIs | Open to new roles"\n\n• **About section**: Tell a story. What problems do you solve? What are you passionate about?\n\n• **Open to Work**: Enable it privately (visible to recruiters only) to avoid awkward situations\n\n• **Skills**: Add 5-10 relevant skills. Endorsements do matter for search ranking\n\n• **Featured section**: Pin your best portfolio project, GitHub, or a published article\n\nRecruiters spend ~6 seconds on profiles — make your headline and photo count!`
  }

  if (lower.includes('system design') || lower.includes('interview')) {
    return `**System design interview prep:**\n\n**Framework (use this every time):**\n1. Clarify requirements (functional + non-functional)\n2. Estimate scale (users, QPS, storage)\n3. High-level design (draw the boxes)\n4. Deep dive (databases, caching, APIs)\n5. Trade-offs and alternatives\n\n**Key topics to study:**\n• Load balancers, CDNs, caching (Redis)\n• SQL vs NoSQL trade-offs\n• Message queues (Kafka, SQS)\n• Consistent hashing, database sharding\n\n**Resources:** System Design Primer (GitHub), Grokking the System Design Interview, ByteByteGo`
  }

  if (lower.includes('skill') || lower.includes('learn') || lower.includes('demand')) {
    return `**Most in-demand tech skills right now:**\n\n🔥 **Hot areas:**\n• AI/ML Engineering (Python, PyTorch, LLM fine-tuning)\n• Cloud-native (AWS/GCP, Kubernetes, Terraform)\n• TypeScript (everywhere — frontend, backend, tooling)\n\n📈 **Always valuable:**\n• System design & distributed systems\n• SQL + data modeling\n• API design (REST, GraphQL, gRPC)\n\n🛠️ **Tooling you should know:**\n• Docker & containerization\n• CI/CD (GitHub Actions, GitLab CI)\n• Monitoring (Datadog, Grafana)\n\nMy advice: go deep on one area rather than shallow on many. Depth gets you interviews; breadth helps you on the job.`
  }

  if (lower.includes('switch') || lower.includes('career change') || lower.includes('full.stack')) {
    return `**Making the switch to full-stack:**\n\nIf you're coming from frontend:\n\n1. **Pick a backend language** — Node.js is the easiest if you already know JavaScript. Python (FastAPI) is great for ML-adjacent roles.\n\n2. **Learn databases** — Start with PostgreSQL. Understand indexing, joins, and transactions.\n\n3. **Build a full project** — A CRUD app with auth, API, and database. Deploy it to AWS/Railway/Render.\n\n4. **Understand the request lifecycle** — DNS → Load balancer → API gateway → Service → Database → Response\n\n5. **Apply for "full-stack" roles that emphasize your strong side** — Many companies hire frontend-heavy full-stack devs.\n\nThe transition typically takes 3–6 months of focused practice. You've got this! 🚀`
  }

  if (lower.includes('resume') || lower.includes('cv')) {
    return `**Resume best practices for tech roles:**\n\n• **1 page** for < 10 years experience. 2 pages only if truly needed.\n\n• **Lead with impact**: "Reduced API latency by 60%" > "Worked on API optimization"\n\n• **STAR format**: Situation → Task → Action → Result for each bullet\n\n• **Include**: GitHub link, portfolio, relevant certifications\n\n• **Keywords matter**: Match your resume to each job description's language\n\n• **ATS tips**: Use standard section headers (Experience, Education, Skills), avoid tables and columns\n\nUse the Resume Analyzer tab to get your ATS score and specific improvement suggestions!`
  }

  // Default response
  return `That's a great question! Here's my take:\n\nThe tech industry moves fast, but the fundamentals that matter most remain consistent: solid problem-solving skills, ability to communicate technical concepts clearly, and a growth mindset.\n\nFor career advancement specifically:\n1. Build in public — contribute to open source, write blog posts, or speak at meetups\n2. Develop T-shaped skills: deep expertise in one area, broad knowledge across many\n3. Network intentionally — most senior roles are filled through referrals\n\nFeel free to ask me something more specific — about resumes, interviews, salary, job searching, or career transitions! I'm here to help. 🎯`
}

export default function CareerAssistant() {
  const user = useAuthStore(s => s.user)
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hi ${user?.name?.split(' ')[0] || 'there'}! 👋 I'm your AI career assistant. I can help you with resume tips, interview prep, salary negotiation, career switches, and anything else career-related.\n\nWhat's on your mind?`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text) => {
    const msg = text || input.trim()
    if (!msg) return
    setInput('')

    const userMsg = { id: Date.now(), role: 'user', content: msg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    // Simulate AI thinking
    await new Promise(r => setTimeout(r, 800 + Math.random() * 600))

    const response = getAIResponse(msg)
    const aiMsg = { id: Date.now() + 1, role: 'assistant', content: response, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    setMessages(prev => [...prev, aiMsg])
    setLoading(false)
  }

  // Simple markdown-ish renderer
  const renderContent = (content) => {
    const lines = content.split('\n')
    return lines.map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={i} className="font-semibold mt-2 first:mt-0">{line.replace(/\*\*/g, '')}</p>
      }
      if (line.includes('**')) {
        const parts = line.split('**')
        return (
          <p key={i} className="leading-relaxed">
            {parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p)}
          </p>
        )
      }
      if (line.startsWith('• ') || line.startsWith('🔥') || line.startsWith('📈') || line.startsWith('🛠️') || /^\d+\./.test(line)) {
        return <p key={i} className="ml-2 leading-relaxed">{line}</p>
      }
      if (line === '') return <div key={i} className="h-1" />
      return <p key={i} className="leading-relaxed">{line}</p>
    })
  }

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] animate-fade-in">
      <div className="mb-4">
        <h1 className="font-display text-2xl font-700 text-gray-900 dark:text-white">Career Assistant</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Ask me anything about your career journey</p>
      </div>

      {/* Chat area */}
      <div className="flex-1 card overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center">
            <Bot size={15} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-100">CareerBot</p>
            <p className="text-xs text-green-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block" /> Online
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={clsx('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                  <Bot size={13} className="text-white" />
                </div>
              )}
              <div className={clsx('max-w-lg', msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai')}>
                <div className="text-sm space-y-0.5">
                  {renderContent(msg.content)}
                </div>
                <p className={clsx('text-xs mt-1.5', msg.role === 'user' ? 'text-white/60' : 'text-gray-400')}>
                  {msg.time}
                </p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                <Bot size={13} className="text-white" />
              </div>
              <div className="chat-bubble-ai">
                <div className="flex gap-1 py-1">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Suggestions */}
        {messages.length === 1 && (
          <div className="px-4 pb-3">
            <p className="text-xs text-gray-400 mb-2 flex items-center gap-1.5">
              <Sparkles size={12} /> Suggested questions
            </p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => sendMessage(s)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-900/20 dark:hover:text-brand-400 transition-colors">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex gap-2">
            <input
              className="input flex-1"
              placeholder="Ask anything about your career..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              disabled={loading}
            />
            <button onClick={() => sendMessage()} disabled={loading || !input.trim()} className="btn-primary px-3">
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
