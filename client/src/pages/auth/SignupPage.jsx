import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Zap, ArrowRight } from 'lucide-react'
import { useAuthStore } from '../../context/authStore'
import toast from 'react-hot-toast'

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const { signup, isLoading, error, clearError } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    clearError()
    if (!form.name || !form.email || !form.password) {
      toast.error('Please fill in all fields')
      return
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    const ok = await signup(form.name, form.email, form.password)
    if (ok) {
      toast.success('Account created! Welcome to CareerHub 🎉')
      navigate('/dashboard')
    }
  }

  const pwStrength = form.password.length === 0 ? 0
    : form.password.length < 6 ? 1
    : form.password.length < 10 ? 2 : 3

  const strengthLabel = ['', 'Weak', 'Good', 'Strong']
  const strengthColor = ['', 'bg-red-400', 'bg-yellow-400', 'bg-green-400']

  return (
    <div className="min-h-screen flex">
      {/* Left gradient panel */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 bg-gradient-to-br from-purple-600 via-brand-500 to-brand-600 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-80 h-80 bg-white/5 rounded-full" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Zap size={20} className="text-white" />
          </div>
          <span className="font-display text-white text-xl font-700">AI CareerHub</span>
        </div>

        <div className="relative z-10 space-y-5">
          <h1 className="font-display text-white text-4xl font-800 leading-tight">
            Start your<br />career journey today
          </h1>
          <p className="text-white/70 text-lg">
            Join thousands of professionals using AI to land their dream jobs faster.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: '12,000+', desc: 'Active users' },
              { label: '85%', desc: 'Interview rate' },
              { label: '3x', desc: 'Faster job search' },
              { label: '94%', desc: 'Satisfaction score' },
            ].map(stat => (
              <div key={stat.label} className="bg-white/10 rounded-xl p-4">
                <p className="font-display text-white text-2xl font-700">{stat.label}</p>
                <p className="text-white/60 text-sm">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-white/40 text-sm">Free plan available · No credit card required</div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 dark:bg-surface-dark">
        <div className="w-full max-w-sm space-y-6 animate-fade-in">
          <div>
            <div className="flex items-center gap-2 mb-6 lg:hidden">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
                <Zap size={15} className="text-white" />
              </div>
              <span className="font-display font-700 text-gray-900 dark:text-white">AI CareerHub</span>
            </div>
            <h2 className="font-display text-2xl font-700 text-gray-900 dark:text-white">Create your account</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Free forever. No credit card required.</p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full name</label>
              <input type="text" className="input" placeholder="Jane Smith"
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="label">Email address</label>
              <input type="email" className="input" placeholder="jane@example.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} className="input pr-10"
                  placeholder="Min. 6 characters"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.password.length > 0 && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= pwStrength ? strengthColor[pwStrength] : 'bg-gray-200 dark:bg-gray-700'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-gray-400">{strengthLabel[pwStrength]}</p>
                </div>
              )}
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full justify-center mt-2">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center gap-2">Create account <ArrowRight size={16} /></span>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-500 hover:text-brand-600 font-medium">Sign in</Link>
          </p>

          <p className="text-center text-xs text-gray-400">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}
