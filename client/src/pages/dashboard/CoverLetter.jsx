import { useState } from 'react'
import { FileEdit, Copy, Download, Sparkles, RefreshCw } from 'lucide-react'
import { generateCoverLetter } from '../../utils/aiHelpers'
import { useAuthStore } from '../../context/authStore'
import { dummyJobs } from '../../utils/dummyData'
import toast from 'react-hot-toast'

export default function CoverLetter() {
  const user = useAuthStore(s => s.user)
  const [form, setForm] = useState({
    jobTitle: '',
    company: '',
    skills: '',
    tone: 'professional',
    customNote: '',
  })
  const [letter, setLetter] = useState('')
  const [generating, setGenerating] = useState(false)

  const tones = [
    { value: 'professional', label: 'Professional', desc: 'Formal and business-like' },
    { value: 'friendly', label: 'Friendly', desc: 'Warm and approachable' },
    { value: 'bold', label: 'Bold', desc: 'Confident and direct' },
  ]

  const handleGenerate = async () => {
    if (!form.jobTitle || !form.company) {
      toast.error('Enter job title and company')
      return
    }
    setGenerating(true)
    await new Promise(r => setTimeout(r, 1400))

    const skills = form.skills.split(',').map(s => s.trim()).filter(Boolean)
    let generated = generateCoverLetter(user?.name || 'Your Name', form.jobTitle, form.company, skills)

    // Tone adjustments
    if (form.tone === 'friendly') {
      generated = generated
        .replace('Dear Hiring Manager,', 'Hi there,')
        .replace("I'm excited to apply", "I'd love to apply")
        .replace('Thank you for considering my application', 'Thanks so much for considering me')
    } else if (form.tone === 'bold') {
      generated = generated
        .replace("I'm excited to apply for", "I'm the right person for")
        .replace('I believe I can make an immediate, meaningful contribution', 'I will make an immediate, measurable impact')
    }

    if (form.customNote) {
      generated = generated.replace(
        'Best regards,',
        `${form.customNote}\n\nBest regards,`
      )
    }

    setLetter(generated)
    setGenerating(false)
    toast.success('Cover letter generated!')
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(letter)
    toast.success('Copied to clipboard!')
  }

  const handleDownload = () => {
    const blob = new Blob([letter], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cover-letter-${form.company.replace(/\s+/g, '-')}.txt`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Downloaded!')
  }

  const quickFill = (job) => {
    setForm(f => ({
      ...f,
      jobTitle: job.title,
      company: job.company,
      skills: job.stack.join(', '),
    }))
    toast.success(`Filled with ${job.company} job details`)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-700 text-gray-900 dark:text-white">Cover Letter Generator</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Generate a tailored cover letter in seconds using your resume and the job description.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Form */}
        <div className="space-y-4">
          {/* Quick fill */}
          <div className="card p-4 space-y-2">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Quick fill from saved jobs</p>
            <div className="flex flex-wrap gap-2">
              {dummyJobs.slice(0, 4).map(job => (
                <button key={job.id} onClick={() => quickFill(job)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-900/20 dark:hover:text-brand-400 transition-colors">
                  {job.company}
                </button>
              ))}
            </div>
          </div>

          <div className="card p-5 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Job Title</label>
                <input className="input" placeholder="Frontend Engineer"
                  value={form.jobTitle} onChange={e => setForm({ ...form, jobTitle: e.target.value })} />
              </div>
              <div>
                <label className="label">Company</label>
                <input className="input" placeholder="Stripe"
                  value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
              </div>
            </div>

            <div>
              <label className="label">Your Key Skills (comma-separated)</label>
              <input className="input" placeholder="React, TypeScript, Node.js, GraphQL"
                value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} />
            </div>

            <div>
              <label className="label">Tone</label>
              <div className="grid grid-cols-3 gap-2">
                {tones.map(t => (
                  <button key={t.value} onClick={() => setForm({ ...form, tone: t.value })}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      form.tone === t.value
                        ? 'border-brand-400 bg-brand-50 dark:bg-brand-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}>
                    <p className="font-medium text-xs text-gray-800 dark:text-gray-100">{t.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{t.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label">Additional Note <span className="text-gray-400 font-normal">(optional)</span></label>
              <textarea className="input min-h-[80px] resize-none"
                placeholder="Any specific points you want to mention..."
                value={form.customNote} onChange={e => setForm({ ...form, customNote: e.target.value })} />
            </div>

            <button onClick={handleGenerate} disabled={generating} className="btn-primary w-full justify-center">
              {generating ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating...
                </span>
              ) : (
                <><Sparkles size={15} /> Generate Cover Letter</>
              )}
            </button>
          </div>
        </div>

        {/* Output */}
        <div className="card p-5 space-y-3 flex flex-col">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm flex items-center gap-2">
              <FileEdit size={15} /> Generated Letter
            </h3>
            {letter && (
              <div className="flex gap-2">
                <button onClick={() => { setLetter(''); handleGenerate() }} className="btn-ghost text-xs px-2 py-1">
                  <RefreshCw size={13} /> Regenerate
                </button>
                <button onClick={handleCopy} className="btn-ghost text-xs px-2 py-1">
                  <Copy size={13} /> Copy
                </button>
                <button onClick={handleDownload} className="btn-secondary text-xs px-2 py-1.5">
                  <Download size={13} /> Save
                </button>
              </div>
            )}
          </div>

          {letter ? (
            <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-xl p-5 overflow-y-auto">
              <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                {letter}
              </pre>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3 min-h-64">
              <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                <FileEdit size={24} className="text-gray-300" />
              </div>
              <p className="font-medium text-gray-700 dark:text-gray-300 text-sm">No letter generated yet</p>
              <p className="text-xs text-gray-400">Fill in the details and click generate</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
