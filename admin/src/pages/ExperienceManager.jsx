import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { HiPlus, HiPencil, HiTrash, HiSave, HiX } from 'react-icons/hi'
import toast from 'react-hot-toast'
import PageHeader from '../components/PageHeader.jsx'
import Modal from '../components/Modal.jsx'
import ConfirmModal from '../components/ConfirmModal.jsx'
import { experienceAPI } from '../api/endpoints.js'

const TYPES = ['full-time','part-time','freelance','internship','contract']
const EMPTY = { company:'', position:'', location:'', type:'full-time', startDate:'', endDate:'', current:false, description:'', responsibilities:'', achievements:'', technologies:'', companyUrl:'', order:0, visible:true }

function toDateInput(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toISOString().slice(0, 10)
}

function ExperienceForm({ initial, onSave, onCancel, loading }) {
  const [form, setForm] = useState(initial
    ? { ...initial, startDate: toDateInput(initial.startDate), endDate: toDateInput(initial.endDate),
        responsibilities: (initial.responsibilities||[]).join('\n'),
        achievements:     (initial.achievements||[]).join('\n'),
        technologies:     (initial.technologies||[]).join(', ') }
    : EMPTY)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = () => onSave({
    ...form,
    responsibilities: form.responsibilities.split('\n').map(s=>s.trim()).filter(Boolean),
    achievements:     form.achievements.split('\n').map(s=>s.trim()).filter(Boolean),
    technologies:     form.technologies.split(',').map(s=>s.trim()).filter(Boolean),
  })

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div><label className="label">Company *</label><input value={form.company} onChange={e=>set('company',e.target.value)} required className="input" /></div>
        <div><label className="label">Position *</label><input value={form.position} onChange={e=>set('position',e.target.value)} required className="input" /></div>
        <div><label className="label">Location</label><input value={form.location||''} onChange={e=>set('location',e.target.value)} className="input" /></div>
        <div><label className="label">Type</label><select value={form.type} onChange={e=>set('type',e.target.value)} className="input">{TYPES.map(t=><option key={t} value={t}>{t}</option>)}</select></div>
        <div><label className="label">Start Date *</label><input type="date" value={form.startDate} onChange={e=>set('startDate',e.target.value)} className="input" /></div>
        <div><label className="label">End Date</label><input type="date" value={form.endDate||''} onChange={e=>set('endDate',e.target.value)} disabled={form.current} className="input disabled:opacity-40" /></div>
      </div>
      <div className="flex items-center gap-2"><input type="checkbox" checked={form.current} onChange={e=>set('current',e.target.checked)} className="w-4 h-4 accent-violet-500"/><span className="text-sm text-slate-300">Currently working here</span></div>
      <div><label className="label">Description</label><textarea rows={3} value={form.description||''} onChange={e=>set('description',e.target.value)} className="input resize-none"/></div>
      <div><label className="label">Responsibilities (one per line)</label><textarea rows={4} value={form.responsibilities||''} onChange={e=>set('responsibilities',e.target.value)} className="input resize-none"/></div>
      <div><label className="label">Achievements (one per line)</label><textarea rows={3} value={form.achievements||''} onChange={e=>set('achievements',e.target.value)} className="input resize-none"/></div>
      <div><label className="label">Technologies (comma-separated)</label><input value={form.technologies||''} onChange={e=>set('technologies',e.target.value)} className="input"/></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="label">Company URL</label><input value={form.companyUrl||''} onChange={e=>set('companyUrl',e.target.value)} className="input"/></div>
        <div><label className="label">Order</label><input type="number" value={form.order} onChange={e=>set('order',+e.target.value)} className="input"/></div>
      </div>
      <div className="flex items-center gap-2"><input type="checkbox" checked={form.visible} onChange={e=>set('visible',e.target.checked)} className="w-4 h-4 accent-violet-500"/><span className="text-sm text-slate-300">Visible</span></div>
      <div className="flex gap-3 pt-2">
        <button onClick={handleSave} disabled={loading} className="btn-primary flex-1 justify-center">
          {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <HiSave size={15}/>}
          {loading ? 'Saving…' : 'Save'}
        </button>
        <button onClick={onCancel} className="btn-secondary px-5"><HiX size={15}/></button>
      </div>
    </div>
  )
}

export default function ExperienceManager() {
  const qc = useQueryClient()
  const [modal, setModal] = useState(null)
  const [delId, setDelId] = useState(null)

  const { data, isLoading } = useQuery({ queryKey:['admin-experience'], queryFn: experienceAPI.getAll })
  const experiences = data?.data?.experiences || []

  const createMutation = useMutation({ mutationFn: experienceAPI.create, onSuccess:()=>{ toast.success('Created'); qc.invalidateQueries(['admin-experience']); setModal(null) }, onError:(e)=>toast.error(e.message) })
  const updateMutation = useMutation({ mutationFn:({id,data})=>experienceAPI.update(id,data), onSuccess:()=>{ toast.success('Updated'); qc.invalidateQueries(['admin-experience']); setModal(null) }, onError:(e)=>toast.error(e.message) })
  const deleteMutation = useMutation({ mutationFn: experienceAPI.delete, onSuccess:()=>{ toast.success('Deleted'); qc.invalidateQueries(['admin-experience']); setDelId(null) }, onError:(e)=>toast.error(e.message) })

  return (
    <div>
      <PageHeader title="Experience Manager" description={`${experiences.length} entries`}
        action={<button onClick={()=>setModal('add')} className="btn-primary"><HiPlus size={16}/> Add Experience</button>}/>

      {isLoading ? <div className="space-y-3">{[...Array(3)].map((_,i)=><div key={i} className="card h-20 animate-pulse"/>)}</div> : (
        <div className="space-y-3">
          {experiences.map(exp => (
            <div key={exp._id} className={`card p-5 flex items-center gap-4 hover:border-white/[0.12] transition-all ${!exp.visible?'opacity-60':''}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-white text-sm">{exp.position}</h3>
                  <span className="badge-violet text-xs">{exp.type}</span>
                  {exp.current && <span className="badge-emerald text-xs">Current</span>}
                </div>
                <p className="text-slate-400 text-xs mt-0.5">{exp.company} {exp.location ? `· ${exp.location}` : ''}</p>
                <p className="text-slate-600 text-xs mt-0.5">
                  {new Date(exp.startDate).toLocaleDateString('en-US',{month:'short',year:'numeric'})} — {exp.current ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US',{month:'short',year:'numeric'}) : ''}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={()=>setModal({exp})} className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white"><HiPencil size={14}/></button>
                <button onClick={()=>setDelId(exp._id)} className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 hover:text-red-300"><HiTrash size={14}/></button>
              </div>
            </div>
          ))}
          {experiences.length===0 && <div className="card p-16 text-center text-slate-500">No experience entries yet.</div>}
        </div>
      )}

      <Modal open={!!modal} onClose={()=>setModal(null)} size="lg" title={modal==='add'?'Add Experience':`Edit: ${modal?.exp?.position}`}>
        <ExperienceForm initial={modal==='add'?null:modal?.exp} loading={createMutation.isPending||updateMutation.isPending} onCancel={()=>setModal(null)}
          onSave={(data)=>{ if(modal==='add') createMutation.mutate(data); else updateMutation.mutate({id:modal.exp._id,data}) }}/>
      </Modal>
      <ConfirmModal open={!!delId} title="Delete Experience" message="This experience entry will be permanently deleted." loading={deleteMutation.isPending} onCancel={()=>setDelId(null)} onConfirm={()=>deleteMutation.mutate(delId)}/>
    </div>
  )
}
