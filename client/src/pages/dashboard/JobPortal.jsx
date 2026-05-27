import { useState } from 'react'
import { Search, Bookmark, BookmarkCheck, ExternalLink, Filter, MapPin, DollarSign, Clock } from 'lucide-react'
import { dummyJobs } from '../../utils/dummyData'
import toast from 'react-hot-toast'
import clsx from 'clsx'

const roles = ['All', 'Frontend', 'Backend', 'Full Stack', 'ML Engineer', 'DevOps']
const stacks = ['All', 'React', 'Python', 'Node.js', 'TypeScript', 'Go', 'Kubernetes']

export default function JobPortal() {
  const [jobs, setJobs] = useState(dummyJobs)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [stackFilter, setStackFilter] = useState('All')
  const [selected, setSelected] = useState(dummyJobs[0])
  const [showFilters, setShowFilters] = useState(false)

  const filtered = jobs.filter(job => {
    const matchSearch = !search ||
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === 'All' ||
      job.title.toLowerCase().includes(roleFilter.toLowerCase())
    const matchStack = stackFilter === 'All' ||
      job.stack.some(s => s.toLowerCase().includes(stackFilter.toLowerCase()))
    return matchSearch && matchRole && matchStack
  })

  const toggleSave = (jobId) => {
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, saved: !j.saved } : j))
    const job = jobs.find(j => j.id === jobId)
    toast.success(job.saved ? 'Removed from saved' : 'Job saved!')
  }

  const applyJob = (jobId) => {
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, applied: true } : j))
    toast.success('Application submitted! 🎉')
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-700 text-gray-900 dark:text-white">Job Portal</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">AI-matched jobs based on your resume and preferences.</p>
      </div>

      {/* Search & Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-64">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input pl-9" placeholder="Search roles, companies..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className="btn-secondary">
          <Filter size={15} /> Filters
          {(roleFilter !== 'All' || stackFilter !== 'All') && (
            <span className="w-2 h-2 bg-brand-500 rounded-full" />
          )}
        </button>
      </div>

      {showFilters && (
        <div className="card p-4 space-y-3 animate-slide-up">
          <div>
            <label className="label text-xs">Role Type</label>
            <div className="flex flex-wrap gap-2">
              {roles.map(r => (
                <button key={r} onClick={() => setRoleFilter(r)}
                  className={clsx('px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                    roleFilter === r
                      ? 'bg-brand-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700')}>
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="label text-xs">Tech Stack</label>
            <div className="flex flex-wrap gap-2">
              {stacks.map(s => (
                <button key={s} onClick={() => setStackFilter(s)}
                  className={clsx('px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                    stackFilter === s
                      ? 'bg-brand-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700')}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Job list + detail */}
      <div className="grid lg:grid-cols-5 gap-5">
        {/* List */}
        <div className="lg:col-span-2 space-y-2">
          <p className="text-xs text-gray-400">{filtered.length} jobs found</p>
          {filtered.map(job => (
            <div key={job.id}
              onClick={() => setSelected(job)}
              className={clsx(
                'card p-4 cursor-pointer transition-all',
                selected?.id === job.id
                  ? 'ring-2 ring-brand-400 shadow-card-hover'
                  : 'hover:shadow-card-hover'
              )}>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                  style={{ backgroundColor: job.logoColor }}>
                  {job.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-800 dark:text-gray-100 truncate">{job.title}</p>
                  <p className="text-xs text-gray-400">{job.company}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="badge-green">{job.match}% match</span>
                    <span className="text-xs text-gray-400">{job.salary}</span>
                    {job.applied && <span className="badge-blue">Applied</span>}
                  </div>
                </div>
                <button onClick={e => { e.stopPropagation(); toggleSave(job.id) }}
                  className="text-gray-300 hover:text-brand-500 transition-colors mt-0.5">
                  {job.saved ? <BookmarkCheck size={16} className="text-brand-500" /> : <Bookmark size={16} />}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Detail */}
        {selected && (
          <div className="lg:col-span-3 card p-6 space-y-5 h-fit sticky top-0">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold"
                  style={{ backgroundColor: selected.logoColor }}>
                  {selected.logo}
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-white">{selected.title}</h2>
                  <p className="text-sm text-gray-500">{selected.company}</p>
                </div>
              </div>
              <span className="badge-green text-sm">{selected.match}% match</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: MapPin, val: selected.location },
                { icon: DollarSign, val: selected.salary },
                { icon: Clock, val: selected.type },
                { icon: Clock, val: `Posted ${selected.posted}` },
              ].map(({ icon: Icon, val }, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Icon size={14} className="text-gray-400 flex-shrink-0" />
                  {val}
                </div>
              ))}
            </div>

            <div>
              <h3 className="font-medium text-sm text-gray-800 dark:text-gray-100 mb-2">About the role</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{selected.description}</p>
            </div>

            <div>
              <h3 className="font-medium text-sm text-gray-800 dark:text-gray-100 mb-2">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {selected.stack.map(s => <span key={s} className="badge-gray">{s}</span>)}
              </div>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-medium text-sm text-gray-800 dark:text-gray-100">Job Fit Analysis</h3>
              </div>
              <div className="progress-bar mb-1.5">
                <div className="progress-fill" style={{ width: `${selected.match}%` }} />
              </div>
              <p className="text-xs text-gray-400">{selected.match}% of required skills matched from your resume</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => applyJob(selected.id)}
                disabled={selected.applied}
                className={clsx('btn-primary flex-1 justify-center', selected.applied && 'opacity-60 cursor-not-allowed')}>
                {selected.applied ? '✓ Applied' : 'Apply Now'}
              </button>
              <button onClick={() => toggleSave(selected.id)} className="btn-secondary">
                {selected.saved ? <BookmarkCheck size={16} className="text-brand-500" /> : <Bookmark size={16} />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
