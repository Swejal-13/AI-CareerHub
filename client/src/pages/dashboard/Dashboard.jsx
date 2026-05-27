import { useNavigate } from 'react-router-dom'
import { FileText, Briefcase, Target, TrendingUp, ArrowRight, Zap, Award, Clock } from 'lucide-react'
import { useAuthStore } from '../../context/authStore'
import { dummyJobs, dummyApplications } from '../../utils/dummyData'
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts'

const statCards = [
  { label: 'Resume ATS Score', value: '78', unit: '%', icon: FileText, color: 'text-brand-500', bg: 'bg-brand-50 dark:bg-brand-900/20', change: '+6 pts this week' },
  { label: 'Jobs Applied', value: '12', unit: '', icon: Briefcase, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20', change: '3 pending response' },
  { label: 'Profile Match', value: '82', unit: '%', icon: Target, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20', change: 'Top 15% of candidates' },
  { label: 'Interviews', value: '2', unit: '', icon: Award, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20', change: '1 scheduled this week' },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const user = useAuthStore(s => s.user)
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const topJobs = dummyJobs.slice(0, 3)
  const activeApps = [...dummyApplications.applied, ...dummyApplications.interview]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-700 text-gray-900 dark:text-white">
            {greeting}, {user?.name?.split(' ')[0] || 'there'} 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            You have 2 pending interviews and 3 new job matches today.
          </p>
        </div>
        <button onClick={() => navigate('/resume')} className="btn-primary hidden sm:flex">
          <Zap size={15} /> Analyze Resume
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(card => (
          <div key={card.label} className="card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{card.label}</span>
              <div className={`w-8 h-8 ${card.bg} rounded-lg flex items-center justify-center`}>
                <card.icon size={15} className={card.color} />
              </div>
            </div>
            <div>
              <div className="flex items-end gap-1">
  <span className="text-3xl font-bold leading-none tracking-tight">
    {card.value}
  </span>
  <span className="text-xs text-gray-400 pb-[3px]">
    {card.unit}
  </span>
</div>
              <p className="text-xs text-gray-400 mt-0.5">{card.change}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Quick actions */}
        <div className="card p-5 space-y-3">
          <h2 className="font-semibold text-gray-900 dark:text-white text-sm">Quick Actions</h2>
          {[
            { label: 'Upload & analyze resume', path: '/resume', icon: FileText, color: 'bg-brand-500' },
            { label: 'Browse matching jobs', path: '/jobs', icon: Briefcase, color: 'bg-purple-500' },
            { label: 'Practice mock interview', path: '/interview', icon: Award, color: 'bg-green-500' },
            { label: 'Generate cover letter', path: '/cover-letter', icon: Clock, color: 'bg-orange-500' },
          ].map(action => (
            <button key={action.path} onClick={() => navigate(action.path)}
              className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
              <div className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <action.icon size={15} className="text-white" />
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300 text-left">{action.label}</span>
              <ArrowRight size={14} className="ml-auto text-gray-300 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors" />
            </button>
          ))}
        </div>

        {/* Top job matches */}
        <div className="card p-5 space-y-3 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 dark:text-white text-sm">Top Job Matches</h2>
            <button onClick={() => navigate('/jobs')} className="text-xs text-brand-500 hover:text-brand-600">View all →</button>
          </div>
          <div className="space-y-2">
            {topJobs.map(job => (
              <div key={job.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                  style={{ backgroundColor: job.logoColor }}>
                  {job.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{job.title}</p>
                  <p className="text-xs text-gray-400">{job.company} · {job.location}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="badge-green text-xs">{job.match}% match</span>
                  <span className="text-xs text-gray-400">{job.salary}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Application activity */}
      <div className="card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 dark:text-white text-sm">Recent Applications</h2>
          <button onClick={() => navigate('/tracker')} className="text-xs text-brand-500 hover:text-brand-600">Open tracker →</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400 border-b border-gray-100 dark:border-gray-700">
                <th className="pb-2 font-medium">Role</th>
                <th className="pb-2 font-medium">Company</th>
                <th className="pb-2 font-medium">Date</th>
                <th className="pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {activeApps.map(app => (
                <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="py-2.5 font-medium text-gray-800 dark:text-gray-100">{app.role}</td>
                  <td className="py-2.5 text-gray-500">{app.company}</td>
                  <td className="py-2.5 text-gray-400">{app.date}</td>
                  <td className="py-2.5">
                    <span className={dummyApplications.interview.some(a => a.id === app.id)
                      ? 'badge-green' : 'badge-blue'}>
                      {dummyApplications.interview.some(a => a.id === app.id) ? 'Interview' : 'Applied'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
