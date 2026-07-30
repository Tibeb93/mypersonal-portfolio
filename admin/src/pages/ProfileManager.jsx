import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { HiPlus, HiTrash, HiSave } from 'react-icons/hi'
import toast from 'react-hot-toast'
import PageHeader from '../components/PageHeader.jsx'
import ImageUpload from '../components/ImageUpload.jsx'
import { profileAPI } from '../api/endpoints.js'

const EMPTY_SOCIAL = { platform: '', url: '', icon: '' }

export default function ProfileManager() {
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-profile'],
    queryFn:  profileAPI.get,
  })

  const [form, setForm] = useState({
    name: '', title: '', subtitle: '', bio: '', shortBio: '',
    location: '', email: '', phone: '', website: '',
    yearsExperience: 0, projectsCount: 0,
    available: true, availabilityNote: 'Available for opportunities',
    goals: '', careerJourney: '', socials: [],
  })

  useEffect(() => {
    const p = data?.data?.profile
    if (p) setForm({ ...form, ...p, socials: p.socials || [] })
  }, [data])

  const updateMutation = useMutation({
    mutationFn: (d) => profileAPI.update(d),
    onSuccess: () => { toast.success('Profile saved'); qc.invalidateQueries(['admin-profile']) },
    onError:   (e) => toast.error(e.message),
  })

  const uploadImageMutation = useMutation({
    mutationFn: (form) => profileAPI.uploadImage(form),
    onSuccess:  (res)  => { toast.success('Image uploaded'); qc.invalidateQueries(['admin-profile']); return res.data?.url },
    onError:    (e)    => { toast.error(e.message); throw e },
  })

  const uploadResumeMutation = useMutation({
    mutationFn: (form) => profileAPI.uploadResume(form),
    onSuccess:  ()     => { toast.success('Resume uploaded'); qc.invalidateQueries(['admin-profile']) },
    onError:    (e)    => toast.error(e.message),
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = (e) => {
    e.preventDefault()
    updateMutation.mutate(form)
  }

  const addSocial    = () => setForm(f => ({ ...f, socials: [...f.socials, { ...EMPTY_SOCIAL }] }))
  const removeSocial = (i) => setForm(f => ({ ...f, socials: f.socials.filter((_, idx) => idx !== i) }))
  const setSocial    = (i, k, v) => setForm(f => ({
    ...f,
    socials: f.socials.map((s, idx) => idx === i ? { ...s, [k]: v } : s),
  }))

  if (isLoading) return <div className="text-slate-400 text-sm">Loading profile…</div>

  return (
    <div>
      <PageHeader title="Profile Manager" description="Update your personal information and bio." />

      <form onSubmit={handleSave} className="space-y-6 max-w-4xl">

        {/* Profile image */}
        <div className="card p-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Profile Image</h3>
          <div className="max-w-xs">
            <ImageUpload
              value={form.profileImage}
              label="Profile Photo"
              hint="Recommended: 400×400px, JPG or PNG"
              fieldName="image"
              onUpload={async (formData) => {
                const res = await uploadImageMutation.mutateAsync(formData)
                return res?.data?.url
              }}
              uploading={uploadImageMutation.isPending}
            />
          </div>
        </div>

        {/* Basic info */}
        <div className="card p-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              ['name',     'Full Name',          'text',  'Gebremeskel Kiflemeskel'],
              ['title',    'Job Title',          'text',  'Full Stack Web Developer'],
              ['subtitle', 'Subtitle',           'text',  'Building modern web experiences'],
              ['email',    'Email',              'email', 'gkiflemeskel@gmail.com'],
              ['phone',    'Phone',              'text',  '+251...'],
              ['location', 'Location',           'text',  'Ethiopia, East Africa'],
              ['website',  'Website URL',        'url',   'https://...'],
              ['availabilityNote', 'Availability Note', 'text', 'Available for opportunities'],
            ].map(([k, lbl, type, ph]) => (
              <div key={k}>
                <label className="label">{lbl}</label>
                <input type={type} value={form[k] || ''} onChange={(e) => set(k, e.target.value)}
                  placeholder={ph} className="input" />
              </div>
            ))}
            <div>
              <label className="label">Years of Experience</label>
              <input type="number" min={0} value={form.yearsExperience} onChange={(e) => set('yearsExperience', +e.target.value)} className="input" />
            </div>
            <div>
              <label className="label">Projects Count</label>
              <input type="number" min={0} value={form.projectsCount} onChange={(e) => set('projectsCount', +e.target.value)} className="input" />
            </div>
            <div className="sm:col-span-2 flex items-center gap-3">
              <input type="checkbox" id="available" checked={form.available}
                onChange={(e) => set('available', e.target.checked)}
                className="w-4 h-4 accent-violet-500" />
              <label htmlFor="available" className="text-sm text-slate-300">Available for opportunities</label>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="card p-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Bio & Story</h3>
          <div className="space-y-4">
            <div>
              <label className="label">Short Bio (Hero section)</label>
              <textarea rows={2} value={form.shortBio || ''} onChange={(e) => set('shortBio', e.target.value)}
                placeholder="One-line summary for hero section" className="input resize-none" />
            </div>
            <div>
              <label className="label">Full Bio (About section)</label>
              <textarea rows={5} value={form.bio || ''} onChange={(e) => set('bio', e.target.value)}
                placeholder="Your full biography..." className="input resize-none" />
            </div>
            <div>
              <label className="label">Career Journey</label>
              <textarea rows={3} value={form.careerJourney || ''} onChange={(e) => set('careerJourney', e.target.value)}
                placeholder="Describe your career path..." className="input resize-none" />
            </div>
            <div>
              <label className="label">Goals</label>
              <textarea rows={2} value={form.goals || ''} onChange={(e) => set('goals', e.target.value)}
                placeholder="Your professional goals..." className="input resize-none" />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Social Links</h3>
            <button type="button" onClick={addSocial} className="btn-secondary text-xs px-3 py-2">
              <HiPlus size={14} /> Add
            </button>
          </div>
          <div className="space-y-3">
            {form.socials.map((s, i) => (
              <div key={i} className="grid grid-cols-3 gap-3 items-center">
                <input value={s.platform} onChange={(e) => setSocial(i, 'platform', e.target.value)}
                  placeholder="Platform (github, linkedin…)" className="input text-xs" />
                <input value={s.url} onChange={(e) => setSocial(i, 'url', e.target.value)}
                  placeholder="URL" className="input text-xs" />
                <div className="flex gap-2">
                  <input value={s.icon} onChange={(e) => setSocial(i, 'icon', e.target.value)}
                    placeholder="Icon (FaGithub…)" className="input text-xs flex-1" />
                  <button type="button" onClick={() => removeSocial(i)}
                    className="btn-danger px-2.5 py-2 text-xs flex-shrink-0">
                    <HiTrash size={14} />
                  </button>
                </div>
              </div>
            ))}
            {form.socials.length === 0 && (
              <p className="text-xs text-slate-600">No social links yet. Click Add to create one.</p>
            )}
          </div>
        </div>

        {/* Resume */}
        <div className="card p-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Resume / CV</h3>
          <div className="flex items-center gap-4 flex-wrap">
            {form.resumeUrl && (
              <a href={form.resumeUrl} target="_blank" rel="noopener noreferrer"
                className="btn-secondary text-xs">View Current Resume</a>
            )}
            <label className={`btn-secondary text-xs cursor-pointer ${uploadResumeMutation.isPending ? 'opacity-50' : ''}`}>
              <HiPlus size={14} />
              {uploadResumeMutation.isPending ? 'Uploading…' : 'Upload New Resume (PDF)'}
              <input type="file" accept=".pdf" className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0]
                  if (!file) return
                  const fd = new FormData()
                  fd.append('resume', file)
                  uploadResumeMutation.mutate(fd)
                }} />
            </label>
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end">
          <button type="submit" disabled={updateMutation.isPending} className="btn-primary px-8 py-3">
            {updateMutation.isPending
              ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</>
              : <><HiSave size={16} /> Save Profile</>
            }
          </button>
        </div>
      </form>
    </div>
  )
}
