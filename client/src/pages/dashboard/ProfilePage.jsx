import { useState } from 'react'
import { User, Mail, Briefcase, MapPin, Globe, Save, Camera } from 'lucide-react'
import { useAuthStore } from '../../context/authStore'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const user = useAuthStore(s => s.user)
  const [profile, setProfile] = useState({
    name: user?.name || 'Alex Johnson',
    email: user?.email || 'alex@example.com',
    title: 'Senior Frontend Engineer',
    location: 'San Francisco, CA',
    website: 'github.com/alexjohnson',
    bio: 'Passionate frontend engineer with 4+ years building scalable React applications. Open to new opportunities in product-focused companies.',
    skills: 'React, TypeScript, Node.js, GraphQL, CSS, PostgreSQL',
    experience: '4 years',
    openToWork: true,
  })
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 900))
    setSaving(false)
    toast.success('Profile updated!')
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="font-display text-2xl font-700 text-gray-900 dark:text-white">Profile</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage your account and career preferences.</p>
      </div>

      {/* Avatar */}
      <div className="card p-5 flex items-center gap-5">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
            {profile.name.charAt(0)}
          </div>
          <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors">
            <Camera size={13} className="text-gray-500" />
          </button>
        </div>
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{profile.name}</p>
          <p className="text-sm text-gray-500">{profile.title}</p>
          <div className="flex items-center gap-3 mt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <div className={`relative w-10 h-5 rounded-full transition-colors ${profile.openToWork ? 'bg-green-400' : 'bg-gray-300 dark:bg-gray-600'}`}
                onClick={() => setProfile(p => ({ ...p, openToWork: !p.openToWork }))}>
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${profile.openToWork ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Open to Work</span>
            </label>
            {profile.openToWork && <span className="badge-green text-xs">Visible to recruiters</span>}
          </div>
        </div>
      </div>

      {/* Form sections */}
      <div className="card p-5 space-y-4">
        <h2 className="font-semibold text-gray-900 dark:text-white text-sm border-b border-gray-100 dark:border-gray-700 pb-3">Personal Information</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Full Name</label>
            <div className="relative">
              <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input className="input pl-9" value={profile.name}
                onChange={e => setProfile({ ...profile, name: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label">Email</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input className="input pl-9" value={profile.email}
                onChange={e => setProfile({ ...profile, email: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label">Current Title</label>
            <div className="relative">
              <Briefcase size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input className="input pl-9" value={profile.title}
                onChange={e => setProfile({ ...profile, title: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label">Location</label>
            <div className="relative">
              <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input className="input pl-9" value={profile.location}
                onChange={e => setProfile({ ...profile, location: e.target.value })} />
            </div>
          </div>
        </div>

        <div>
          <label className="label">Website / GitHub</label>
          <div className="relative">
            <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="input pl-9" value={profile.website}
              onChange={e => setProfile({ ...profile, website: e.target.value })} />
          </div>
        </div>

        <div>
          <label className="label">Bio</label>
          <textarea className="input min-h-[100px] resize-none" value={profile.bio}
            onChange={e => setProfile({ ...profile, bio: e.target.value })} />
        </div>
      </div>

      <div className="card p-5 space-y-4">
        <h2 className="font-semibold text-gray-900 dark:text-white text-sm border-b border-gray-100 dark:border-gray-700 pb-3">Career Details</h2>

        <div>
          <label className="label">Skills</label>
          <input className="input" value={profile.skills}
            onChange={e => setProfile({ ...profile, skills: e.target.value })}
            placeholder="React, TypeScript, Node.js..." />
          <p className="text-xs text-gray-400 mt-1">Comma-separated list</p>
        </div>

        <div>
          <label className="label">Years of Experience</label>
          <select className="input" value={profile.experience}
            onChange={e => setProfile({ ...profile, experience: e.target.value })}>
            {['0–1 years', '1–2 years', '2–4 years', '4–6 years', '6–10 years', '10+ years'].map(y => (
              <option key={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      <button onClick={handleSave} disabled={saving} className="btn-primary">
        {saving ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Saving...
          </span>
        ) : (
          <><Save size={15} /> Save Changes</>
        )}
      </button>
    </div>
  )
}
