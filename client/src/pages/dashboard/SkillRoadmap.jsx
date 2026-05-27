import { useState } from 'react'
import { Map, CheckCircle, Circle, Lightbulb, Target } from 'lucide-react'
import { dummyRoadmap } from '../../utils/dummyData'
import clsx from 'clsx'

const DREAM_JOBS = [
  'Senior ML Engineer', 'Staff Frontend Engineer', 'Backend Architect',
  'DevOps / SRE Lead', 'Data Scientist', 'Engineering Manager', 'CTO'
]

export default function SkillRoadmap() {
  const [dreamJob, setDreamJob] = useState('')
  const [currentSkills, setCurrentSkills] = useState('')
  const [generated, setGenerated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [roadmap, setRoadmap] = useState(null)

  const handleGenerate = async () => {
    if (!dreamJob) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))

    // Use dummy roadmap with dream job substitution
    setRoadmap({
      ...dummyRoadmap,
      dreamJob,
      yourSkills: currentSkills.split(',').map(s => s.trim()).filter(Boolean).length > 0
        ? currentSkills.split(',').map(s => s.trim()).filter(Boolean)
        : dummyRoadmap.yourSkills,
    })
    setGenerated(true)
    setLoading(false)
  }

  const phaseColors = [
    { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800', dot: 'bg-blue-500', label: 'text-blue-600 dark:text-blue-400' },
    { bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-200 dark:border-purple-800', dot: 'bg-purple-500', label: 'text-purple-600 dark:text-purple-400' },
    { bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-800', dot: 'bg-orange-500', label: 'text-orange-600 dark:text-orange-400' },
    { bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-800', dot: 'bg-green-500', label: 'text-green-600 dark:text-green-400' },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-700 text-gray-900 dark:text-white">Skill Gap Roadmap</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Get a personalized learning roadmap to reach your dream role.</p>
      </div>

      {!generated ? (
        <div className="max-w-xl space-y-5">
          <div className="card p-6 space-y-4">
            <div>
              <label className="label">What's your dream job?</label>
              <select className="input" value={dreamJob} onChange={e => setDreamJob(e.target.value)}>
                <option value="">Select a role...</option>
                {DREAM_JOBS.map(j => <option key={j}>{j}</option>)}
              </select>
            </div>

            <div>
              <label className="label">Your current skills (comma-separated)</label>
              <input className="input" placeholder="e.g. React, JavaScript, Node.js, CSS"
                value={currentSkills} onChange={e => setCurrentSkills(e.target.value)} />
              <p className="text-xs text-gray-400 mt-1">Leave blank to use skills from your uploaded resume</p>
            </div>

            <button onClick={handleGenerate} disabled={!dreamJob || loading} className="btn-primary w-full justify-center">
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating roadmap...
                </span>
              ) : (
                <><Map size={16} /> Generate My Roadmap</>
              )}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Target, label: 'Skill gap analysis', desc: 'See exactly what you\'re missing' },
              { icon: Map, label: 'Week-by-week plan', desc: 'Structured learning path' },
              { icon: Lightbulb, label: 'Resource recommendations', desc: 'Best courses and projects' },
            ].map(f => (
              <div key={f.label} className="card p-3 text-center space-y-1.5">
                <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center mx-auto">
                  <f.icon size={15} className="text-brand-500" />
                </div>
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{f.label}</p>
                <p className="text-xs text-gray-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-5 animate-fade-in">
          {/* Header */}
          <div className="card p-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Roadmap for</p>
              <h2 className="font-display text-xl font-700 text-gray-900 dark:text-white">{roadmap.dreamJob}</h2>
            </div>
            <button onClick={() => setGenerated(false)} className="btn-secondary text-sm">Regenerate</button>
          </div>

          {/* Skill gap */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="card p-4 space-y-3">
              <h3 className="font-semibold text-sm text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <CheckCircle size={14} className="text-green-500" /> Your Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {roadmap.yourSkills.map(s => <span key={s} className="badge-green">{s}</span>)}
              </div>
            </div>

            <div className="card p-4 space-y-3">
              <h3 className="font-semibold text-sm text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <Circle size={14} className="text-red-400" /> Skills to Acquire
              </h3>
              <div className="flex flex-wrap gap-2">
                {roadmap.missingSkills.map(s => <span key={s} className="badge-red">{s}</span>)}
              </div>
            </div>

            <div className="card p-4 space-y-2">
              <h3 className="font-semibold text-sm text-gray-800 dark:text-gray-100">Readiness</h3>
              <div className="text-3xl font-display font-700 text-gray-900 dark:text-white">
                {Math.round((roadmap.yourSkills.length / roadmap.requiredSkills.length) * 100)}%
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${Math.round((roadmap.yourSkills.length / roadmap.requiredSkills.length) * 100)}%` }} />
              </div>
              <p className="text-xs text-gray-400">{roadmap.missingSkills.length} skills to go</p>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Learning Roadmap</h2>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-5 top-6 bottom-6 w-0.5 bg-gray-200 dark:bg-gray-700" />

              <div className="space-y-4">
                {roadmap.roadmap.map((phase, idx) => {
                  const colors = phaseColors[idx % phaseColors.length]
                  return (
                    <div key={phase.phase} className="flex gap-4 pl-0">
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div className={`w-10 h-10 rounded-full ${colors.dot} flex items-center justify-center text-white text-xs font-bold z-10`}>
                          {idx + 1}
                        </div>
                      </div>
                      <div className={`card p-4 flex-1 ${colors.bg} border ${colors.border} mb-0`}>
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`text-xs font-medium font-mono ${colors.label}`}>{phase.phase}</span>
                          <span className="font-semibold text-gray-800 dark:text-gray-100">{phase.title}</span>
                        </div>
                        <ul className="space-y-1.5">
                          {phase.tasks.map(task => (
                            <li key={task} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                              <CheckCircle size={13} className={`${colors.label} mt-0.5 flex-shrink-0`} />
                              {task}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
