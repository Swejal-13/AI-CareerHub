import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, CheckCircle, AlertCircle, TrendingUp, Zap, ChevronDown, ChevronRight } from 'lucide-react'
import { calculateATSScore, extractKeywords, getResumeSuggestions, rewriteBullet } from '../../utils/aiHelpers'
import { dummyResumes } from '../../utils/dummyData'
import toast from 'react-hot-toast'
import clsx from 'clsx'

export default function ResumeAnalyzer() {
  const [resumes, setResumes] = useState(dummyResumes)
  const [analyzed, setAnalyzed] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [activeTab, setActiveTab] = useState('analyzer')
  const [bulletInput, setBulletInput] = useState('')
  const [rewritten, setRewritten] = useState('')

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (!file) return

    setAnalyzing(true)
    toast.loading('Analyzing your resume...', { id: 'analyze' })

    // Simulate reading/processing
    await new Promise(r => setTimeout(r, 2000))

    // Mock resume text for demo
    const mockText = `John Developer | john@email.com | github.com/johndev
    
Summary: Experienced frontend engineer with 3 years building React applications.

Experience:
Senior Frontend Developer at TechCo (2022-Present)
- Built React dashboard components used by 50,000+ users
- Reduced page load time by 45% through code splitting and lazy loading
- Led team of 3 developers, mentored junior engineers

Skills: React, TypeScript, JavaScript, Node.js, GraphQL, CSS, Git, Agile
Education: BS Computer Science, State University 2021
Projects: github.com/johndev/portfolio`

    const score = calculateATSScore(mockText)
    const keywords = extractKeywords(mockText)
    const suggestions = getResumeSuggestions(mockText)

    const result = {
      name: file.name,
      score,
      keywords,
      suggestions,
      sections: {
        skills: { score: Math.min(score + 8, 100), found: keywords.technical.length },
        experience: { score: Math.max(score - 5, 40), years: 3 },
        keywords: { score: Math.min(score + 3, 100), matched: keywords.technical.length, total: 20 },
        format: { score: 85, issues: 1 },
      }
    }

    setAnalyzed(result)

    const newResume = {
      id: `r${Date.now()}`,
      name: file.name,
      atsScore: score,
      uploaded: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      size: `${Math.round(file.size / 1024)} KB`,
      skills: keywords.technical.length,
      experience: '3 yrs',
      active: false,
    }
    setResumes(prev => [newResume, ...prev])

    setAnalyzing(false)
    toast.success('Analysis complete!', { id: 'analyze' })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] },
    maxFiles: 1,
  })

  const ScoreRing = ({ score, size = 120 }) => {
    const r = 44
    const circ = 2 * Math.PI * r
    const offset = circ - (score / 100) * circ
    const color = score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444'

    return (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#e5e7eb" strokeWidth="8" />
        <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 50 50)"
          style={{ transition: 'stroke-dashoffset 1.2s ease-out' }} />
        <text x="50" y="50" textAnchor="middle" dominantBaseline="central"
          fontSize="20" fontWeight="700" fill={color}>{score}</text>
        <text x="50" y="64" textAnchor="middle" fontSize="9" fill="#9ca3af">/100</text>
      </svg>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-700 text-gray-900 dark:text-white">Resume Analyzer</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Upload your resume for ATS scoring, keyword analysis, and AI-powered suggestions.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 w-fit">
        {['analyzer', 'versions', 'rewriter'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={clsx('px-4 py-2 rounded-lg text-sm font-medium transition-all',
              activeTab === tab
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300')}>
            {tab === 'analyzer' ? 'Analyzer' : tab === 'versions' ? 'Version Manager' : 'Bullet Rewriter'}
          </button>
        ))}
      </div>

      {activeTab === 'analyzer' && (
        <div className="grid lg:grid-cols-2 gap-5">
          {/* Upload area */}
          <div className="space-y-4">
            <div {...getRootProps()} className={clsx(
              'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all',
              isDragActive
                ? 'border-brand-400 bg-brand-50 dark:bg-brand-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-brand-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
            )}>
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-3">
                {analyzing ? (
                  <div className="w-12 h-12 border-3 border-brand-200 border-t-brand-500 rounded-full animate-spin" />
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center">
                    <Upload size={22} className="text-brand-500" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-100">
                    {analyzing ? 'Analyzing resume...' : isDragActive ? 'Drop it here!' : 'Drop your resume here'}
                  </p>
                  <p className="text-sm text-gray-400 mt-0.5">PDF or DOCX · Max 5MB</p>
                </div>
                {!analyzing && <button className="btn-primary text-sm">Browse files</button>}
              </div>
            </div>

            {/* ATS Tips */}
            <div className="card p-4 space-y-3">
              <h3 className="font-semibold text-sm text-gray-800 dark:text-gray-100">ATS Scoring Guide</h3>
              {[
                { range: '90–100', label: 'Excellent – highly ATS-optimized', color: 'text-green-500' },
                { range: '70–89', label: 'Good – minor improvements needed', color: 'text-yellow-500' },
                { range: '50–69', label: 'Fair – significant gaps found', color: 'text-orange-500' },
                { range: '<50', label: 'Needs work – major revisions needed', color: 'text-red-500' },
              ].map(item => (
                <div key={item.range} className="flex items-center gap-3">
                  <span className={`text-xs font-mono font-medium ${item.color} w-16`}>{item.range}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Results */}
          {analyzed ? (
            <div className="space-y-4">
              {/* Score card */}
              <div className="card p-5">
                <div className="flex items-center gap-5">
                  <ScoreRing score={analyzed.score} />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white">{analyzed.name}</p>
                    <p className="text-sm text-gray-400 mt-0.5">ATS Score</p>
                    <div className="mt-2">
                      <span className={clsx('badge',
                        analyzed.score >= 80 ? 'badge-green' : analyzed.score >= 60 ? 'badge-orange' : 'badge-red')}>
                        {analyzed.score >= 80 ? '✓ Strong Resume' : analyzed.score >= 60 ? '~ Needs Improvement' : '✗ Major Issues'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Section breakdown */}
                <div className="mt-4 space-y-2.5">
                  {Object.entries(analyzed.sections).map(([key, val]) => (
                    <div key={key}>
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                        <span className="capitalize">{key}</span>
                        <span>{val.score}%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${val.score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Keywords */}
              <div className="card p-4 space-y-3">
                <h3 className="font-semibold text-sm text-gray-800 dark:text-gray-100">Detected Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {analyzed.keywords.technical.map(kw => (
                    <span key={kw} className="badge-blue capitalize">{kw}</span>
                  ))}
                </div>
              </div>

              {/* Suggestions */}
              <div className="card p-4 space-y-3">
                <h3 className="font-semibold text-sm text-gray-800 dark:text-gray-100 flex items-center gap-2">
                  <TrendingUp size={15} className="text-brand-500" />
                  Improvement Suggestions
                </h3>
                <div className="space-y-2">
                  {analyzed.suggestions.map((s, i) => (
                    <div key={i} className="flex gap-2.5 text-sm">
                      <AlertCircle size={14} className="text-orange-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-300">{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="card p-8 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                <FileText size={28} className="text-gray-300" />
              </div>
              <p className="font-medium text-gray-700 dark:text-gray-300">No resume analyzed yet</p>
              <p className="text-sm text-gray-400">Upload a resume to see your ATS score and suggestions</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'versions' && (
        <div className="space-y-4">
          <div className="grid gap-3">
            {resumes.map(r => (
              <div key={r.id} className="card-hover p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
                  <FileText size={18} className="text-red-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm text-gray-800 dark:text-gray-100 truncate">{r.name}</p>
                    {r.active && <span className="badge-green">Active</span>}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{r.uploaded} · {r.size} · {r.skills} skills</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className={clsx('font-display text-xl font-700',
                      r.atsScore >= 80 ? 'text-green-500' : r.atsScore >= 60 ? 'text-yellow-500' : 'text-red-500')}>
                      {r.atsScore}
                    </p>
                    <p className="text-xs text-gray-400">ATS</p>
                  </div>
                  <button className="btn-secondary text-xs px-3 py-1.5">Set Active</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'rewriter' && (
        <div className="grid lg:grid-cols-2 gap-5">
          <div className="card p-5 space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Original Bullet Point</h3>
            <textarea
              className="input min-h-[120px] resize-none"
              placeholder="Paste a bullet point from your resume here..."
              value={bulletInput}
              onChange={e => setBulletInput(e.target.value)}
            />
            <button
              onClick={() => {
                if (!bulletInput.trim()) { toast.error('Enter a bullet point first'); return }
                setRewritten(rewriteBullet(bulletInput))
                toast.success('Rewritten!')
              }}
              className="btn-primary"
            >
              <Zap size={15} /> Rewrite with AI
            </button>
          </div>
          <div className="card p-5 space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Improved Version</h3>
            {rewritten ? (
              <div className="space-y-3">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle size={14} className="text-green-500" />
                    <span className="text-xs font-medium text-green-600 dark:text-green-400">AI Improved</span>
                  </div>
                  <p className="text-sm text-gray-800 dark:text-gray-100">{rewritten}</p>
                </div>
                <button onClick={() => { navigator.clipboard.writeText(rewritten); toast.success('Copied!') }}
                  className="btn-secondary text-sm w-full justify-center">
                  Copy to clipboard
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
                Improved bullet will appear here
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
