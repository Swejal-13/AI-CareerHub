import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Mail, Zap } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) { toast.error('Enter your email address'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    setSent(true)
    toast.success('Reset link sent!')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-surface-dark p-8">
      <div className="w-full max-w-sm space-y-7 animate-fade-in">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-brand-500 flex items-center justify-center">
            <Zap size={17} className="text-white" />
          </div>
          <span className="font-display font-700 text-gray-900 dark:text-white text-lg">AI CareerHub</span>
        </div>

        {!sent ? (
          <>
            <div>
              <h2 className="font-display text-2xl font-700 text-gray-900 dark:text-white">Reset password</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Enter your email and we'll send you a reset link.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Email address</label>
                <input type="email" className="input" placeholder="you@example.com"
                  value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : 'Send reset link'}
              </button>
            </form>
          </>
        ) : (
          <div className="card p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
              <Mail size={24} className="text-green-500" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Check your inbox</h3>
              <p className="text-sm text-gray-500 mt-1">We sent a password reset link to <strong>{email}</strong></p>
            </div>
            <p className="text-xs text-gray-400">Didn't get it? Check your spam folder or try again.</p>
          </div>
        )}

        <Link to="/login" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
          <ArrowLeft size={15} /> Back to login
        </Link>
      </div>
    </div>
  )
}
