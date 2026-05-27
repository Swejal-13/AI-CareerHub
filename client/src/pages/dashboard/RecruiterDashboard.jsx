import { useState } from 'react'
import { Users, Plus, TrendingUp, Star, ChevronDown, ChevronUp, Briefcase } from 'lucide-react'
import { dummyCandidates } from '../../utils/dummyData'
import toast from 'react-hot-toast'
import clsx from 'clsx'

const POSTED_JOBS = [
  { id: 'pj1', title: 'Senior Frontend Engineer', department: 'Engineering', applicants: 48, active: true, posted: 'Mar 10' },
  { id: 'pj2', title: 'Product Designer', department: 'Design', applicants: 31, active: true, posted: 'Mar 15' },
  { id: 'pj3', title: 'DevOps Engineer', department: 'Infrastructure', applicants: 22, active: false, posted: 'Feb 28' },
]

export default function RecruiterDashboard() {
  const [activeTab, setActiveTab] = useState('candidates')
  const [selectedJob, setSelectedJob] = useState('pj1')
  const [expanded, setExpanded] = useState(null)
  const [showPostForm, setShowPostForm] = useState(false)
  const [newJob, setNewJob] = useState({ title: '', department: '', description: '' })

  const handlePostJob = () => {
    if (!newJob.title || !newJob.department) { toast.error('Fill in job title and department'); return }
    toast.success(`Job "${newJob.title}" posted successfully!`)
    setNewJob({ title: '', department: '', description: '' })
    setShowPostForm(false)
  }

  const ScoreBar = ({ label, value, color = 'bg-brand-500' }) => (
    <div>
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
        <span>{label}</span><span>{value}%</span>
      </div>
      <div className="progress-bar">
        <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${value}%` }} />
      </div>
    </div>
  )

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-700 text-gray-900 dark:text-white">Recruiter Hub</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Post jobs, review candidates, and rank applicants by AI score.</p>
        </div>
        <button onClick={() => setShowPostForm(!showPostForm)} className="btn-primary">
          <Plus size={15} /> Post Job
        </button>
      </div>

      {/* Post job form */}
      {showPostForm && (
        <div className="card p-5 space-y-4 animate-slide-up border-2 border-brand-200 dark:border-brand-800">
          <h3 className="font-semibold text-gray-900 dark:text-white">New Job Posting</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Job Title</label>
              <input className="input" placeholder="e.g. Backend Engineer"
                value={newJob.title} onChange={e => setNewJob({ ...newJob, title: e.target.value })} />
            </div>
            <div>
              <label className="label">Department</label>
              <input className="input" placeholder="e.g. Engineering"
                value={newJob.department} onChange={e => setNewJob({ ...newJob, department: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label">Job Description</label>
            <textarea className="input min-h-[100px] resize-none"
              placeholder="Describe the role, requirements, and responsibilities..."
              value={newJob.description} onChange={e => setNewJob({ ...newJob, description: e.target.value })} />
          </div>
          <div className="flex gap-3">
            <button onClick={handlePostJob} className="btn-primary">Publish Job</button>
            <button onClick={() => setShowPostForm(false)} className="btn-secondary">Cancel</button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Active Jobs', value: '2', icon: Briefcase, color: 'text-brand-500', bg: 'bg-brand-50 dark:bg-brand-900/20' },
          { label: 'Total Applicants', value: '101', icon: Users, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
          { label: 'Avg. Match Score', value: '79%', icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
        ].map(s => (
          <div key={s.label} className="card p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
              <s.icon size={18} className={s.color} />
            </div>
            <div>
              <p className="font-display text-2xl font-700 text-gray-900 dark:text-white">{s.value}</p>
              <p className="text-xs text-gray-400">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 w-fit">
        {['candidates', 'jobs'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={clsx('px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize',
              activeTab === tab
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300')}>
            {tab === 'candidates' ? 'Candidate Rankings' : 'Posted Jobs'}
          </button>
        ))}
      </div>

      {activeTab === 'candidates' && (
        <div className="space-y-4">
          {/* Job selector */}
          <div className="flex gap-2 flex-wrap">
            {POSTED_JOBS.map(job => (
              <button key={job.id} onClick={() => setSelectedJob(job.id)}
                className={clsx('px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                  selectedJob === job.id
                    ? 'bg-brand-500 text-white'
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300')}>
                {job.title} <span className="opacity-60">({job.applicants})</span>
              </button>
            ))}
          </div>

          {/* Ranking header */}
          <div className="flex items-center gap-2">
            <Star size={14} className="text-yellow-400 fill-yellow-400" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              AI-ranked candidates for <strong>{POSTED_JOBS.find(j => j.id === selectedJob)?.title}</strong>
            </p>
          </div>

          {/* Candidate cards */}
          <div className="space-y-3">
            {dummyCandidates.map((candidate, idx) => (
              <div key={candidate.id} className="card overflow-hidden">
                <div className="p-4 flex items-center gap-4 cursor-pointer"
                  onClick={() => setExpanded(expanded === candidate.id ? null : candidate.id)}>
                  {/* Rank badge */}
                  <div className={clsx('w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0',
                    idx === 0 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600'
                    : idx === 1 ? 'bg-gray-100 dark:bg-gray-700 text-gray-500'
                    : idx === 2 ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-500'
                    : 'bg-gray-50 dark:bg-gray-800 text-gray-400')}>
                    #{idx + 1}
                  </div>

                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {candidate.avatar}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-800 dark:text-gray-100">{candidate.name}</p>
                      {idx === 0 && <span className="badge-green text-xs">Top Pick</span>}
                    </div>
                    <p className="text-xs text-gray-400">{candidate.experience} experience</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {candidate.skills.slice(0, 3).map(s => (
                        <span key={s} className="badge-gray text-xs">{s}</span>
                      ))}
                      {candidate.skills.length > 3 && (
                        <span className="badge-gray text-xs">+{candidate.skills.length - 3}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-center">
                      <p className={clsx('font-display text-2xl font-700',
                        candidate.score >= 90 ? 'text-green-500' : candidate.score >= 75 ? 'text-yellow-500' : 'text-orange-500')}>
                        {candidate.score}%
                      </p>
                      <p className="text-xs text-gray-400">match</p>
                    </div>
                    {expanded === candidate.id
                      ? <ChevronUp size={16} className="text-gray-400" />
                      : <ChevronDown size={16} className="text-gray-400" />}
                  </div>
                </div>

                {expanded === candidate.id && (
                  <div className="px-4 pb-4 pt-0 border-t border-gray-100 dark:border-gray-700 space-y-4 animate-slide-up">
                    <div className="grid md:grid-cols-3 gap-4 pt-3">
                      {/* Score breakdown */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Score Breakdown</h4>
                        <ScoreBar label="Skill Match" value={candidate.score} />
                        <ScoreBar label="ATS Score" value={candidate.atsScore} color="bg-purple-500" />
                        <ScoreBar label="Experience Fit" value={Math.round(candidate.score * 0.9)} color="bg-green-500" />
                      </div>

                      {/* Strengths */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Strengths</h4>
                        {candidate.strengths.map(s => (
                          <div key={s} className="flex items-start gap-2 text-sm">
                            <div className="w-4 h-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                            </div>
                            <span className="text-gray-600 dark:text-gray-300">{s}</span>
                          </div>
                        ))}
                      </div>

                      {/* Weaknesses */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Gaps</h4>
                        {candidate.weaknesses.map(w => (
                          <div key={w} className="flex items-start gap-2 text-sm">
                            <div className="w-4 h-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                            </div>
                            <span className="text-gray-600 dark:text-gray-300">{w}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button onClick={() => toast.success(`Invited ${candidate.name} to interview`)}
                        className="btn-primary text-sm">Invite to Interview</button>
                      <button onClick={() => toast('Shortlisted!')}
                        className="btn-secondary text-sm">Shortlist</button>
                      <button onClick={() => toast('Rejected')}
                        className="btn-ghost text-sm text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">Reject</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'jobs' && (
        <div className="space-y-3">
          {POSTED_JOBS.map(job => (
            <div key={job.id} className="card p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center flex-shrink-0">
                <Briefcase size={18} className="text-brand-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-800 dark:text-gray-100">{job.title}</p>
                  <span className={job.active ? 'badge-green' : 'badge-gray'}>
                    {job.active ? 'Active' : 'Closed'}
                  </span>
                </div>
                <p className="text-xs text-gray-400">{job.department} · Posted {job.posted} · {job.applicants} applicants</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => toast.success('Viewing applicants')} className="btn-secondary text-sm">
                  View Applicants
                </button>
                <button onClick={() => toast.success('Job closed')} className="btn-ghost text-sm">
                  {job.active ? 'Close' : 'Reopen'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
