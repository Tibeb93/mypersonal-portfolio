import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { HiPlus, HiPencil, HiTrash, HiSave, HiX } from 'react-icons/hi'
import toast from 'react-hot-toast'
import PageHeader from '../components/PageHeader.jsx'
import Modal from '../components/Modal.jsx'
import ConfirmModal from '../components/ConfirmModal.jsx'
import { educationAPI } from '../api/endpoints.js'

const EMPTY = { university:'', degree:'', field:'', startDate:'', endDate:'', current:false, gpa:'', description:'', location:'', order:0, visible:true }

function toDateInput(d) { return d ? new Date(d).toISOString().slice(0,10) : '' }

function EducationForm({ initial, onSave, onCancel, loading }) {
  const [form, setForm] = useState(initial ? { ...initial, startDate:toDateInput(initial.startDate), endDate:toDateInput(initial.endDate) } : EMPTY)
  const set = (k,v) => setForm(f=>({...f,[k]:v}))
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2"><label className="label">University *</label><input value={form.university} onChange={e=>set('university',e.target.value)} required className="input"/></div>
        <div><label className="label">Degree *</label><input value={form.degree} onChange={e=>set('degree',e.target.value)} required placeholder="Bachelor of Science" className="input"/></div>
        <div><label className="label">Field of Study *</label><input value={form.field} onChange={e=>set('field',e.target.value)} required placeholder="Computer Science" className="input"/></div>
        <div><label className="label">Start Date *</label><input type="date" value={form.startDate} onChange={e=>set('startDate',e.target.value)} className="input"/></div>
        <div><label className="label">End Date</label><input type="date" value={form.endDate||''} onChange={e=>set('endDate',e.target.value)} disabled={form.current} className="input disabled:opacity-40"/></div>
        <div><label className="label">Location</label><input value={form.location||''} onChange={e=>set('location',e.target.value)} className="input"/></div>
        <div><label className="label">GPA</label><input value={form.gpa||''} onChange={e=>set('gpa',e.target.value)} placeholder="3.8/4.0" className="input"/></div>
      </div>
      <div className="flex items-center gap-2"><input type="checkbox" checked={form.current} onChange={e=>set('current',e.target.checked)} className="w-4 h-4 accent-violet-500"/><span className="text-sm text-slate-300">Currently enrolled</span></div>
      <div><label className="label">Description</label><textarea rows={3} value={form.description||''} onChange={e=>set('description',e.target.value)} className="input resize-none"/></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="label">Order</label><input type="number" value={form.order} onChange={e=>set('order',+e.target.value)} className="input"/></div>
        <div className="flex items-end pb-1"><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.visible} onChange={e=>set('visible',e.target.checked)} className="w-4 h-4 accent-violet-500"/><span className="text-sm text-slate-300">Visible</span></label></div>
      </div>
      <div className="flex gap-3 pt-2">
        <button onClick={()=>onSave(form)} disabled={loading} className="btn-primary flex-1 justify-center">
          {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <HiSave size={15}/>}
          {loading ? 'Saving…' : 'Save'}
        </button>
        <button onClick={onCancel} className="btn-secondary px-5"><HiX size={15}/></button>
      </div>
    </div>
  )
}

export default function EducationManager() {
  const qc = useQueryClient()
  const [modal, setModal] = useState(null)
  const [delId, setDelId] = useState(null)
  const { data, isLoading } = useQuery({ queryKey:['admin-education'], queryFn: educationAPI.getAll })
  const educations = data?.data?.educations || []
  const createMutation = useMutation({ mutationFn: educationAPI.create, onSuccess:()=>{ toast.success('Created'); qc.invalidateQueries(['admin-education']); setModal(null) }, onError:(e)=>toast.error(e.message) })
  const updateMutation = useMutation({ mutationFn:({id,data})=>educationAPI.update(id,data), onSuccess:()=>{ toast.success('Updated'); qc.invalidateQueries(['admin-education']); setModal(null) }, onError:(e)=>toast.error(e.message) })
  const deleteMutation = useMutation({ mutationFn: educationAPI.delete, onSuccess:()=>{ toast.success('Deleted'); qc.invalidateQueries(['admin-education']); setDelId(null) }, onError:(e)=>toast.error(e.message) })
  return (
    <div>
      <PageHeader title="Education Manager" description={`${educations.length} entries`}
        action={<button onClick={()=>setModal('add')} className="btn-primary"><HiPlus size={16}/> Add Education</button>}/>
      {isLoading ? <div className="space-y-3">{[...Array(2)].map((_,i)=><div key={i} className="card h-20 animate-pulse"/>)}</div> : (
        <div className="space-y-3">
          {educations.map(edu=>(
            <div key={edu._id} className="card p-5 flex items-center gap-4 hover:border-white/[0.12] transition-all">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-white text-sm">{edu.degree} in {edu.field}</h3>
                  {edu.current && <span className="badge-emerald text-xs">Current</span>}
                </div>
                <p className="text-slate-400 text-xs mt-0.5">{edu.university}</p>
                <p className="text-slate-600 text-xs mt-0.5">{toDateInput(edu.startDate)?.slice(0,4)} — {edu.current?'Present':toDateInput(edu.endDate)?.slice(0,4)||''}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={()=>setModal({edu})} className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white"><HiPencil size={14}/></button>
                <button onClick={()=>setDelId(edu._id)} className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 hover:text-red-300"><HiTrash size={14}/></button>
              </div>
            </div>
          ))}
          {educations.length===0 && <div className="card p-16 text-center text-slate-500">No education entries yet.</div>}
        </div>
      )}
      <Modal open={!!modal} onClose={()=>setModal(null)} size="lg" title={modal==='add'?'Add Education':`Edit: ${modal?.edu?.university}`}>
        <EducationForm initial={modal==='add'?null:modal?.edu} loading={createMutation.isPending||updateMutation.isPending} onCancel={()=>setModal(null)} onSave={(data)=>{ if(modal==='add') createMutation.mutate(data); else updateMutation.mutate({id:modal.edu._id,data}) }}/>
      </Modal>
      <ConfirmModal open={!!delId} title="Delete Education" message="This education record will be permanently deleted." loading={deleteMutation.isPending} onCancel={()=>setDelId(null)} onConfirm={()=>deleteMutation.mutate(delId)}/>
    </div>
  )
}
