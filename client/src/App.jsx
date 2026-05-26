import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './context/authStore'
import { useThemeStore } from './context/themeStore'
import AppLayout from './components/layout/AppLayout'
import LoginPage from './pages/auth/LoginPage'
import SignupPage from './pages/auth/SignupPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import Dashboard from './pages/dashboard/Dashboard'
import ResumeAnalyzer from './pages/dashboard/ResumeAnalyzer'
import JobPortal from './pages/dashboard/JobPortal'
import ApplicationTracker from './pages/dashboard/ApplicationTracker'
import CareerAssistant from './pages/dashboard/CareerAssistant'
import MockInterview from './pages/dashboard/MockInterview'
import SkillRoadmap from './pages/dashboard/SkillRoadmap'
import CoverLetter from './pages/dashboard/CoverLetter'
import RecruiterDashboard from './pages/dashboard/RecruiterDashboard'
import ProfilePage from './pages/dashboard/ProfilePage'

function PrivateRoute({ children }) {
  const token = useAuthStore(s => s.token)
  return token ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const token = useAuthStore(s => s.token)
  return token ? <Navigate to="/dashboard" replace /> : children
}

export default function App() {
  const initAuth = useAuthStore(s => s.initAuth)
  const initTheme = useThemeStore(s => s.initTheme)

  useEffect(() => {
    initAuth()
    initTheme()
  }, [])

  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />

      {/* Protected */}
      <Route path="/" element={<PrivateRoute><AppLayout /></PrivateRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="resume" element={<ResumeAnalyzer />} />
        <Route path="jobs" element={<JobPortal />} />
        <Route path="tracker" element={<ApplicationTracker />} />
        <Route path="assistant" element={<CareerAssistant />} />
        <Route path="interview" element={<MockInterview />} />
        <Route path="roadmap" element={<SkillRoadmap />} />
        <Route path="cover-letter" element={<CoverLetter />} />
        <Route path="recruiter" element={<RecruiterDashboard />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
