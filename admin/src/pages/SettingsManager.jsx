import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { HiSave } from 'react-icons/hi'
import toast from 'react-hot-toast'
import PageHeader from '../components/PageHeader.jsx'
import ImageUpload from '../components/ImageUpload.jsx'
import { settingsAPI } from '../api/endpoints.js'

export default function SettingsManager() {
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({ queryKey:['admin-settings'], queryFn: settingsAPI.get })
  const [form, setForm] = useState({
    siteTitle:'', siteTagline:'', primaryColor:'#8B5CF6', accentColor:'#EC4899',
    footerText:'', copyright:'', contactEmail:'', contactPhone:'', contactAddress:'',
    socials:{ github:'', linkedin:'', twitter:'', telegram:'', instagram:'', youtube:'' },
    seoTitle:'', seoDescription:'', seoKeywords:'', googleAnalytics:'',
    features:{ blog:true, darkMode:true, contactForm:true, analytics:true },
    maintenanceMode:false, maintenanceMsg:'',
  })

  useEffect(()=>{
    const s = data?.data?.settings
    if (s) setForm(f=>({ ...f, ...s, socials:{...f.socials,...(s.socials||{})}, features:{...f.features,...(s.features||{})}, seoKeywords:(s.seoKeywords||[]).join(', ') }))
  },[data])

  const set = (k,v) => setForm(f=>({...f,[k]:v}))
  const setSocial = (k,v) => setForm(f=>({...f,socials:{...f.socials,[k]:v}}))
  const setFeature = (k,v) => setForm(f=>({...f,features:{...f.features,[k]:v}}))

  const updateMutation = useMutation({
    mutationFn: (d)=>settingsAPI.update(d),
    onSuccess: ()=>{ toast.success('Settings saved'); qc.invalidateQueries(['admin-settings']) },
    onError:   (e)=>toast.error(e.message),
  })
  const uploadLogoMutation    = useMutation({ mutationFn:(fd)=>settingsAPI.uploadLogo(fd),    onSuccess:()=>{ toast.success('Logo uploaded');    qc.invalidateQueries(['admin-settings']) }, onError:(e)=>toast.error(e.message) })
  const uploadFaviconMutation = useMutation({ mutationFn:(fd)=>settingsAPI.uploadFavicon(fd), onSuccess:()=>{ toast.success('Favicon uploaded'); qc.invalidateQueries(['admin-settings']) }, onError:(e)=>toast.error(e.message) })

  const handleSave = (e) => {
    e.preventDefault()
    updateMutation.mutate({ ...form, seoKeywords: form.seoKeywords.split(',').map(s=>s.trim()).filter(Boolean) })
  }

  if (isLoading) return <div className="text-slate-400 text-sm">Loading settings…</div>

  const Section = ({title, children}) => (
    <div className="card p-6 space-y-4">
      <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/[0.06] pb-3">{title}</h3>
      {children}
    </div>
  )

  return (
    <div>
      <PageHeader title="Website Settings" description="Manage your portfolio settings and configuration."/>
      <form onSubmit={handleSave} className="space-y-6 max-w-4xl">

        <Section title="Branding">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="label">Site Title</label><input value={form.siteTitle||''} onChange={e=>set('siteTitle',e.target.value)} className="input"/></div>
            <div><label className="label">Tagline</label><input value={form.siteTagline||''} onChange={e=>set('siteTagline',e.target.value)} className="input"/></div>
            <div><label className="label">Primary Color</label><div className="flex gap-2"><input type="color" value={form.primaryColor||'#8B5CF6'} onChange={e=>set('primaryColor',e.target.value)} className="w-10 h-10 rounded-lg border border-white/10 bg-transparent"/><input value={form.primaryColor||''} onChange={e=>set('primaryColor',e.target.value)} className="input flex-1"/></div></div>
            <div><label className="label">Accent Color</label><div className="flex gap-2"><input type="color" value={form.accentColor||'#EC4899'} onChange={e=>set('accentColor',e.target.value)} className="w-10 h-10 rounded-lg border border-white/10 bg-transparent"/><input value={form.accentColor||''} onChange={e=>set('accentColor',e.target.value)} className="input flex-1"/></div></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <ImageUpload label="Logo" value={form.logo} hint="SVG or PNG, transparent background" onUpload={async(fd)=>{ const r=await uploadLogoMutation.mutateAsync(fd); return r?.data?.url }} uploading={uploadLogoMutation.isPending}/>
            <ImageUpload label="Favicon" value={form.favicon} hint="32×32px or 64×64px" onUpload={async(fd)=>{ const r=await uploadFaviconMutation.mutateAsync(fd); return r?.data?.url }} uploading={uploadFaviconMutation.isPending}/>
          </div>
        </Section>

        <Section title="Contact Information">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="label">Contact Email</label><input type="email" value={form.contactEmail||''} onChange={e=>set('contactEmail',e.target.value)} className="input"/></div>
            <div><label className="label">Contact Phone</label><input value={form.contactPhone||''} onChange={e=>set('contactPhone',e.target.value)} className="input"/></div>
            <div className="sm:col-span-2"><label className="label">Address</label><input value={form.contactAddress||''} onChange={e=>set('contactAddress',e.target.value)} className="input"/></div>
          </div>
        </Section>

        <Section title="Social Links">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.keys(form.socials).map(platform=>(
              <div key={platform}><label className="label capitalize">{platform}</label><input value={form.socials[platform]||''} onChange={e=>setSocial(platform,e.target.value)} placeholder={`https://${platform}.com/...`} className="input"/></div>
            ))}
          </div>
        </Section>

        <Section title="SEO Settings">
          <div className="space-y-4">
            <div><label className="label">SEO Title</label><input value={form.seoTitle||''} onChange={e=>set('seoTitle',e.target.value)} className="input"/></div>
            <div><label className="label">SEO Description</label><textarea rows={2} value={form.seoDescription||''} onChange={e=>set('seoDescription',e.target.value)} className="input resize-none"/></div>
            <div><label className="label">Keywords (comma-separated)</label><input value={form.seoKeywords||''} onChange={e=>set('seoKeywords',e.target.value)} className="input"/></div>
            <div><label className="label">Google Analytics ID</label><input value={form.googleAnalytics||''} onChange={e=>set('googleAnalytics',e.target.value)} placeholder="G-XXXXXXXXXX" className="input"/></div>
          </div>
        </Section>

        <Section title="Footer">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="label">Footer Text</label><input value={form.footerText||''} onChange={e=>set('footerText',e.target.value)} className="input"/></div>
            <div><label className="label">Copyright</label><input value={form.copyright||''} onChange={e=>set('copyright',e.target.value)} className="input"/></div>
          </div>
        </Section>

        <Section title="Features">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Object.keys(form.features).map(f=>(
              <label key={f} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.features[f]} onChange={e=>setFeature(f,e.target.checked)} className="w-4 h-4 accent-violet-500"/>
                <span className="text-sm text-slate-300 capitalize">{f.replace(/([A-Z])/g,' $1')}</span>
              </label>
            ))}
          </div>
        </Section>

        <Section title="Maintenance">
          <label className="flex items-center gap-2 cursor-pointer mb-3">
            <input type="checkbox" checked={form.maintenanceMode} onChange={e=>set('maintenanceMode',e.target.checked)} className="w-4 h-4 accent-red-500"/>
            <span className="text-sm text-slate-300">Enable Maintenance Mode</span>
            {form.maintenanceMode && <span className="badge-red text-xs">ACTIVE</span>}
          </label>
          {form.maintenanceMode && <div><label className="label">Maintenance Message</label><textarea rows={2} value={form.maintenanceMsg||''} onChange={e=>set('maintenanceMsg',e.target.value)} className="input resize-none"/></div>}
        </Section>

        <div className="flex justify-end">
          <button type="submit" disabled={updateMutation.isPending} className="btn-primary px-8 py-3">
            {updateMutation.isPending?<><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Saving…</>:<><HiSave size={16}/>Save Settings</>}
          </button>
        </div>
      </form>
    </div>
  )
}
