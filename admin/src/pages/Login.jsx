import { useState } from 'react'
import { motion } from 'framer-motion'
import { HiMail, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi'
import { FaReact } from 'react-icons/fa'
import useAuth from '../hooks/useAuth.js'

export default function Login() {
  const { login, isLoggingIn } = useAuth()
  const [form, setForm]  = useState({ email: '', password: '' })
  const [show, setShow]  = useState(false)
  const [err, setErr]    = useState({})

  const validate = () => {
    const e = {}
    if (!form.email.trim())    e.email    = 'Email required'
    if (!form.password.trim()) e.password = 'Password required'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErr(errs); return }
    setErr({})
    login(form)
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-600/8 rounded-full blur-[100px]" />
      </div>

      <motion.div
        className="relative w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 via-pink-600 to-orange-500
            flex items-center justify-center mx-auto mb-4 shadow-[0_0_40px_rgba(139,92,246,0.4)]">
            <span className="text-white font-black text-xl">GK</span>
          </div>
          <h1 className="text-2xl font-black text-white">Portfolio Admin</h1>
          <p className="text-slate-400 text-sm mt-1">Sign in to manage your portfolio</p>
        </div>

        {/* Form card */}
        <div className="bg-[#0F1525] border border-white/[0.08] rounded-2xl p-8">
          <form onSubmit={handleSubmit} noValidate>

            {/* Email */}
            <div className="mb-4">
              <label className="label">Email Address</label>
              <div className="relative">
                <HiMail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email" value={form.email}
                  onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="admin@portfolio.com"
                  className={`input pl-10 ${err.email ? 'border-red-500/50' : ''}`}
                  disabled={isLoggingIn}
                />
              </div>
              {err.email && <p className="text-xs text-red-400 mt-1.5">{err.email}</p>}
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="label">Password</label>
              <div className="relative">
                <HiLockClosed size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={show ? 'text' : 'password'} value={form.password}
                  onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  className={`input pl-10 pr-10 ${err.password ? 'border-red-500/50' : ''}`}
                  disabled={isLoggingIn}
                />
                <button type="button" onClick={() => setShow(s => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {show ? <HiEyeOff size={16} /> : <HiEye size={16} />}
                </button>
              </div>
              {err.password && <p className="text-xs text-red-400 mt-1.5">{err.password}</p>}
            </div>

            <button type="submit" disabled={isLoggingIn} className="btn-primary w-full justify-center py-3">
              {isLoggingIn
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in…</>
                : 'Sign In'
              }
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6 flex items-center justify-center gap-1.5">
          <FaReact size={12} className="text-cyan-500" /> Built with React + Node.js + MongoDB
        </p>
      </motion.div>
    </div>
  )
}
