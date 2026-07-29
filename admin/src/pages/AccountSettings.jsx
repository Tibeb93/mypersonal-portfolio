import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { HiSave, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi'
import toast from 'react-hot-toast'
import PageHeader from '../components/PageHeader.jsx'
import { authAPI } from '../api/endpoints.js'
import useAuthStore from '../stores/authStore.js'

export default function AccountSettings() {
  const { user, setAuth } = useAuthStore()
  const [profile, setProfile] = useState({ name: user?.name||'', email: user?.email||'' })
  const [pw, setPw] = useState({ currentPassword:'', newPassword:'', confirm:'' })
  const [showPw, setShowPw] = useState(false)
  const [pwErr, setPwErr] = useState('')

  const updateProfile = useMutation({
    mutationFn: ()=>authAPI.updateProfile({ name:profile.name, email:profile.email }),
    onSuccess: (res) => { toast.success('Profile updated'); setAuth(res.data.user, useAuthStore.getState().accessToken) },
    onError:   (e)  => toast.error(e.message),
  })

  const changePassword = useMutation({
    mutationFn: ()=>authAPI.changePassword({ currentPassword:pw.currentPassword, newPassword:pw.newPassword }),
    onSuccess: ()=>{ toast.success('Password changed'); setPw({currentPassword:'',newPassword:'',confirm:''}) },
    onError:   (e)=>toast.error(e.message),
  })

  const handlePwSubmit = (e) => {
    e.preventDefault()
    if (pw.newPassword !== pw.confirm) { setPwErr('Passwords do not match'); return }
    if (pw.newPassword.length < 8) { setPwErr('Password must be at least 8 characters'); return }
    setPwErr('')
    changePassword.mutate()
  }

  return (
    <div>
      <PageHeader title="Account Settings" description="Manage your admin account credentials."/>

      <div className="space-y-6 max-w-lg">
        {/* Profile */}
        <div className="card p-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Profile Information</h3>
          <div className="space-y-4">
            <div><label className="label">Full Name</label>
              <input value={profile.name} onChange={e=>setProfile(p=>({...p,name:e.target.value}))} className="input"/>
            </div>
            <div><label className="label">Email Address</label>
              <input type="email" value={profile.email} onChange={e=>setProfile(p=>({...p,email:e.target.value}))} className="input"/>
            </div>
            <div><label className="label">Role</label>
              <input readOnly value={user?.role||''} className="input opacity-50 cursor-not-allowed"/>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button onClick={()=>updateProfile.mutate()} disabled={updateProfile.isPending} className="btn-primary px-6">
              {updateProfile.isPending?<span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>:<HiSave size={15}/>}
              {updateProfile.isPending?'Saving…':'Save Profile'}
            </button>
          </div>
        </div>

        {/* Password */}
        <div className="card p-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Change Password</h3>
          <form onSubmit={handlePwSubmit} className="space-y-4">
            {[['currentPassword','Current Password'],['newPassword','New Password'],['confirm','Confirm New Password']].map(([k,lbl])=>(
              <div key={k}>
                <label className="label">{lbl}</label>
                <div className="relative">
                  <HiLockClosed size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"/>
                  <input type={showPw?'text':'password'} value={pw[k]} onChange={e=>setPw(p=>({...p,[k]:e.target.value}))} required className="input pl-10 pr-10"/>
                  <button type="button" onClick={()=>setShowPw(s=>!s)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                    {showPw?<HiEyeOff size={15}/>:<HiEye size={15}/>}
                  </button>
                </div>
              </div>
            ))}
            {pwErr && <p className="text-xs text-red-400">{pwErr}</p>}
            <div className="flex justify-end pt-2">
              <button type="submit" disabled={changePassword.isPending} className="btn-primary px-6">
                {changePassword.isPending?<span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>:<HiLockClosed size={15}/>}
                {changePassword.isPending?'Updating…':'Change Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
