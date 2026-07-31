import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { HiPlus, HiTrash, HiSave } from 'react-icons/hi'
import toast from 'react-hot-toast'
import PageHeader from '../components/PageHeader.jsx'
import ImageUpload from '../components/ImageUpload.jsx'
import { aboutAPI } from '../api/endpoints.js'

const EMPTY_VALUE = { title: '', description: '', icon: '' }
const EMPTY_STAT  = { label: '', value: '' }

export default function AboutManager() {
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-about'],
    queryFn:  aboutAPI.get,
  })

  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    heading: '',
    description: '',
    image: '',
    mission: '',
    vision: '',
    values: [],
    stats: [],
    ctaText: 'Get In Touch',
    ctaLink: '#contact',
  })

  useEffect(() => {
    const a = data?.data?.about
    if (a) setForm(prev => ({
      ...prev,
      ...a,
      values: a.values || [],
      stats:  a.stats  || [],
    }))
  }, [data])

  const updateMutation = useMutation({
    mutationFn: (d) => aboutAPI.update(d),
    onSuccess: () => { toast.success('About section saved'); qc.invalidateQueries(['admin-about']) },
    onError:   (e) => toast.error(e.message),
  })

  const uploadImageMutation = useMutation({
    mutationFn: (form) => aboutAPI.uploadImage(form),
    onSuccess:  (res)  => { toast.success('Image uploaded'); qc.invalidateQueries(['admin-about']); return res.data?.url },
    onError:    (e)    => { toast.error(e.message); throw e },
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = (e) => {
    e.preventDefault()
    updateMutation.mutate(form)
  }

  const addValue    = () => setForm(f => ({ ...f, values: [...f.values, { ...EMPTY_VALUE }] }))
  const removeValue = (i) => setForm(f => ({ ...f, values: f.values.filter((_, idx) => idx !== i) }))
  const setValue    = (i, k, v) => setForm(f => ({
    ...f,
    values: f.values.map((item, idx) => idx === i ? { ...item, [k]: v } : item),
  }))

  const addStat    = () => setForm(f => ({ ...f, stats: [...f.stats, { ...EMPTY_STAT }] }))
  const removeStat = (i) => setForm(f => ({ ...f, stats: f.stats.filter((_, idx) => idx !== i) }))
  const setStat    = (i, k, v) => setForm(f => ({
    ...f,
    stats: f.stats.map((item, idx) => idx === i ? { ...item, [k]: v } : item),
  }))

  if (isLoading) return <div className="text-slate-400 text-sm">Loading about section…</div>

  return (
    <div>
      <PageHeader
        title="About Section"
        description="Manage the content displayed in the About section of your portfolio."
      />

      <form onSubmit={handleSave} className="space-y-6 max-w-4xl">

        {/* About Image */}
        <div className="card p-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">About Image</h3>
          <div className="max-w-xs">
            <ImageUpload
              value={form.image}
              label="About Section Image"
              hint="Photo displayed in the About section"
              fieldName="image"
              onUpload={async (formData) => {
                const res = await uploadImageMutation.mutateAsync(formData)
                return res?.data?.url
              }}
              uploading={uploadImageMutation.isPending}
            />
          </div>
        </div>

        {/* Header Content */}
        <div className="card p-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Header</h3>
          <div className="space-y-4">
            <div>
              <label className="label">Section Title</label>
              <input type="text" value={form.title || ''} onChange={(e) => set('title', e.target.value)}
                placeholder="About Me" className="input" />
            </div>
            <div>
              <label className="label">Subtitle</label>
              <input type="text" value={form.subtitle || ''} onChange={(e) => set('subtitle', e.target.value)}
                placeholder="Get to know me better" className="input" />
            </div>
            <div>
              <label className="label">Main Heading</label>
              <input type="text" value={form.heading || ''} onChange={(e) => set('heading', e.target.value)}
                placeholder="Passionate Developer, Creative Thinker" className="input" />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="card p-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Description</h3>
          <textarea rows={5} value={form.description || ''} onChange={(e) => set('description', e.target.value)}
            placeholder="Write your about section description here..." className="input resize-none" />
        </div>

        {/* Mission & Vision */}
        <div className="card p-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Mission & Vision</h3>
          <div className="space-y-4">
            <div>
              <label className="label">Mission</label>
              <textarea rows={3} value={form.mission || ''} onChange={(e) => set('mission', e.target.value)}
                placeholder="Your mission statement..." className="input resize-none" />
            </div>
            <div>
              <label className="label">Vision</label>
              <textarea rows={3} value={form.vision || ''} onChange={(e) => set('vision', e.target.value)}
                placeholder="Your vision statement..." className="input resize-none" />
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Values</h3>
            <button type="button" onClick={addValue} className="btn-secondary text-xs px-3 py-2">
              <HiPlus size={14} /> Add
            </button>
          </div>
          <div className="space-y-3">
            {form.values.map((v, i) => (
              <div key={i} className="grid grid-cols-12 gap-3 items-start">
                <div className="col-span-3">
                  <input value={v.icon || ''} onChange={(e) => setValue(i, 'icon', e.target.value)}
                    placeholder="Icon name" className="input text-xs" />
                </div>
                <div className="col-span-3">
                  <input value={v.title || ''} onChange={(e) => setValue(i, 'title', e.target.value)}
                    placeholder="Title" className="input text-xs" />
                </div>
                <div className="col-span-5">
                  <input value={v.description || ''} onChange={(e) => setValue(i, 'description', e.target.value)}
                    placeholder="Description" className="input text-xs" />
                </div>
                <button type="button" onClick={() => removeValue(i)}
                  className="btn-danger px-2.5 py-2 text-xs col-span-1">
                  <HiTrash size={14} />
                </button>
              </div>
            ))}
            {form.values.length === 0 && (
              <p className="text-xs text-slate-600">No values yet. Click Add to create one.</p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Stats</h3>
            <button type="button" onClick={addStat} className="btn-secondary text-xs px-3 py-2">
              <HiPlus size={14} /> Add
            </button>
          </div>
          <div className="space-y-3">
            {form.stats.map((s, i) => (
              <div key={i} className="grid grid-cols-12 gap-3 items-center">
                <div className="col-span-5">
                  <input value={s.label || ''} onChange={(e) => setStat(i, 'label', e.target.value)}
                    placeholder="Label (e.g. Years Experience)" className="input text-xs" />
                </div>
                <div className="col-span-5">
                  <input value={s.value || ''} onChange={(e) => setStat(i, 'value', e.target.value)}
                    placeholder="Value (e.g. 5+)" className="input text-xs" />
                </div>
                <button type="button" onClick={() => removeStat(i)}
                  className="btn-danger px-2.5 py-2 text-xs col-span-2">
                  <HiTrash size={14} />
                </button>
              </div>
            ))}
            {form.stats.length === 0 && (
              <p className="text-xs text-slate-600">No stats yet. Click Add to create one.</p>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="card p-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Call to Action</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Button Text</label>
              <input type="text" value={form.ctaText || ''} onChange={(e) => set('ctaText', e.target.value)}
                placeholder="Get In Touch" className="input" />
            </div>
            <div>
              <label className="label">Button Link</label>
              <input type="text" value={form.ctaLink || ''} onChange={(e) => set('ctaLink', e.target.value)}
                placeholder="#contact" className="input" />
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end">
          <button type="submit" disabled={updateMutation.isPending} className="btn-primary px-8 py-3">
            {updateMutation.isPending
              ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</>
              : <><HiSave size={16} /> Save About Section</>
            }
          </button>
        </div>
      </form>
    </div>
  )
}
