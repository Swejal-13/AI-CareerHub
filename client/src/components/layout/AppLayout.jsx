import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, FileText, Briefcase, KanbanSquare,
  MessageSquare, Mic, Map, FileEdit, Users, User,
  Sun, Moon, Bell, Search, Menu, X, LogOut, ChevronDown, Zap
} from 'lucide-react'
import { useAuthStore } from '../../context/authStore'
import { useThemeStore } from '../../context/themeStore'
import { dummyNotifications } from '../../utils/dummyData'
import clsx from 'clsx'

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Resume Analyzer', path: '/resume', icon: FileText },
  { label: 'Job Portal', path: '/jobs', icon: Briefcase },
  { label: 'Application Tracker', path: '/tracker', icon: KanbanSquare },
  { label: 'Career Assistant', path: '/assistant', icon: MessageSquare },
  { label: 'Mock Interview', path: '/interview', icon: Mic },
  { label: 'Skill Roadmap', path: '/roadmap', icon: Map },
  { label: 'Cover Letter', path: '/cover-letter', icon: FileEdit },
]

const recruiterItems = [
  { label: 'Recruiter Hub', path: '/recruiter', icon: Users },
]

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const { theme, toggleTheme } = useThemeStore()

  const unread = dummyNotifications.filter(n => !n.read).length

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const NavItem = ({ item }) => {
    const active = location.pathname === item.path
    return (
      <button
        onClick={() => navigate(item.path)}
        className={clsx('nav-link w-full', active && 'active')}
      >
        <item.icon size={17} />
        {sidebarOpen && <span>{item.label}</span>}
        {!sidebarOpen && (
          <span className="sr-only">{item.label}</span>
        )}
      </button>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-surface-dark">
      {/* Sidebar */}
      <aside className={clsx(
        'flex-shrink-0 flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 transition-all duration-300',
        sidebarOpen ? 'w-56' : 'w-16'
      )}>
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center flex-shrink-0">
            <Zap size={15} className="text-white" />
          </div>
          {sidebarOpen && (
            <span className="font-display font-700 text-gray-900 dark:text-white text-base">
              CareerHub
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          <div className="space-y-0.5">
            {navItems.map(item => <NavItem key={item.path} item={item} />)}
          </div>

          {sidebarOpen && (
            <p className="text-xs font-medium text-gray-400 dark:text-gray-600 uppercase tracking-wider px-3 pt-4 pb-1">
              For Recruiters
            </p>
          )}
          {!sidebarOpen && <div className="my-2 border-t border-gray-100 dark:border-gray-800" />}
          <div className="space-y-0.5">
            {recruiterItems.map(item => <NavItem key={item.path} item={item} />)}
          </div>
        </nav>

        {/* Profile bottom */}
        <div className="p-3 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={() => navigate('/profile')}
            className={clsx('nav-link w-full', location.pathname === '/profile' && 'active')}
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user?.name?.charAt(0) || 'U'}
            </div>
            {sidebarOpen && (
              <div className="text-left min-w-0">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email || ''}</p>
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="btn-ghost p-2 -ml-1"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          {/* Search */}
          <div className="flex-1 max-w-sm relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs, skills, companies..."
              className="input pl-9 py-2 text-sm h-9"
            />
          </div>

          <div className="ml-auto flex items-center gap-1">
            {/* Theme */}
            <button onClick={toggleTheme} className="btn-ghost p-2">
              {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false) }}
                className="btn-ghost p-2 relative"
              >
                <Bell size={17} />
                {unread > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-11 w-80 card shadow-card-hover z-50 animate-slide-up">
                  <div className="p-3 border-b border-gray-100 dark:border-gray-700">
                    <p className="font-semibold text-sm">Notifications</p>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {dummyNotifications.map(n => (
                      <div key={n.id} className={clsx(
                        'px-4 py-3 border-b border-gray-50 dark:border-gray-800 last:border-0',
                        !n.read && 'bg-brand-50/50 dark:bg-brand-900/10'
                      )}>
                        <p className="text-sm text-gray-800 dark:text-gray-200">{n.message}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false) }}
                className="flex items-center gap-2 btn-ghost px-2 py-1.5"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <ChevronDown size={14} className="text-gray-400" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-11 w-48 card shadow-card-hover z-50 animate-slide-up p-1.5">
                  <button onClick={() => { navigate('/profile'); setProfileOpen(false) }} className="btn-ghost w-full justify-start text-sm px-3 py-2">
                    <User size={15} /> Profile
                  </button>
                  <div className="border-t border-gray-100 dark:border-gray-700 my-1" />
                  <button onClick={handleLogout} className="btn-ghost w-full justify-start text-sm px-3 py-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                    <LogOut size={15} /> Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
