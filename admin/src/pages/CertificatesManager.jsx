import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { HiPlus, HiPencil, HiTrash, HiSave, HiX, HiExternalLink } from 'react-icons/hi'
import toast from 'react-hot-toast'
import PageHeader from '../components/PageHeader.jsx'
import Modal from '../components/Modal.jsx'
import ConfirmModal from '../components/ConfirmModal.jsx'
import ImageUpload from '../components/ImageUpload.jsx'
import { certificatesAPI } from '../api/endpoints.js'

const EMPTY = { name:'', organization:'', issueDate:'', expiryDate:'', noExpiry:false, credentialId:'', credentialUrl:'', skills:'', order:0, visible:true }
const toDate = (d) => d ? new Date(d).toISOString().slice(0,10) : ''

function CertForm({ initial, onSave, onCancel, loading, certId, onImageUpload }) {
  const [form, setForm] = useState(initial
    ? { ...initial, issueDate:toDate(initial.issueDate), expiryDate:toDate(initial.expiryDate), skills:(initial.skills||[]).join(', ') }
    : EMPTY)
  const set = (k,v) => setForm(f=>({...f,[k]:v}))
  return (
    <div className="space-y-4">
      {certId && <ImageUpload label="Certificate Image" value={form.image} onUpload={onImageUpload}/>}
      <div><label className="label">Certificate Name *</label><input value={form.name} onChange={e=>set('name',e.target.value)} required className="input"/></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="label">Organization *</label><input value={form.organization} onChange={e=>set('organization',e.target.value)} required className="input"/></div>
        <div><label className="label">Issue Date *</label><input type="date" value={form.issueDate} onChange={e=>set('issueDate',e.target.value)} required className="input"/></div>
        <div><label className="label">Expiry Date</label><input type="date" value={form.expiryDate||''} onChange={e=>set('expiryDate',e.target.value)} disabled={form.noExpiry} className="input disabled:opacity-40"/></div>
        <div className="flex items-end pb-1"><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.noExpiry} onChange={e=>set('noExpiry',e.target.checked)} className="w-4 h-4 accent-violet-500"/><span className="text-sm text-slate-300">No expiry</span></label></div>
        <div><label className="label">Credential ID</label><input value={form.credentialId||''} onChange={e=>set('credentialId',e.target.value)} className="input"/></div>
        <div><label className="label">Credential URL</label><input value={form.credentialUrl||''} onChange={e=>set('credentialUrl',e.target.value)} className="input"/></div>
      </div>
      <div><label className="label">Skills (comma-separated)</label><input value={form.skills||''} onChange={e=>set('skills',e.target.value)} className="input"/></div>
      <div className="flex gap-3 pt-2">
        <button onClick={()=>onSave({...form, skills:form.skills.split(',').map(s=>s.trim()).filter(Boolean)})} disabled={loading} className="btn-primary flex-1 justify-center">
          {loading?<span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>:<HiSave size={15}/>}
          {loading?'Saving…':'Save'}
        </button>
        <button onClick={onCancel} className="btn-secondary px-5"><HiX size={15}/></button>
      </div>
    </div>
  )
}

export default function CertificatesManager() {
  const qc = useQueryClient()
  const [modal, setModal] = useState(null)
  const [delId, setDelId] = useState(null)
  const { data, isLoading } = useQuery({ queryKey:['admin-certs'], queryFn: certificatesAPI.getAll })
  const certs = data?.data?.certificates || []
  const createMutation = useMutation({ mutationFn: certificatesAPI.create, onSuccess:(res)=>{ toast.success('Created'); qc.invalidateQueries(['admin-certs']); setModal({cert:res.data.certificate}) }, onError:(e)=>toast.error(e.message) })
  const updateMutation = useMutation({ mutationFn:({id,data})=>certificatesAPI.update(id,data), onSuccess:()=>{ toast.success('Updated'); qc.invalidateQueries(['admin-certs']); setModal(null) }, onError:(e)=>toast.error(e.message) })
  const deleteMutation = useMutation({ mutationFn: certificatesAPI.delete, onSuccess:()=>{ toast.success('Deleted'); qc.invalidateQueries(['admin-certs']); setDelId(null) }, onError:(e)=>toast.error(e.message) })
  const uploadImageMutation = useMutation({ mutationFn:({id,form})=>certificatesAPI.uploadImage(id,form), onSuccess:()=>{ toast.success('Image uploaded'); qc.invalidateQueries(['admin-certs']) }, onError:(e)=>toast.error(e.message) })

  return (
    <div>
      <PageHeader title="Certificates Manager" description={`${certs.length} certificates`}
        action={<button onClick={()=>setModal('add')} className="btn-primary"><HiPlus size={16}/> Add Certificate</button>}/>
      {isLoading ? <div className="grid grid-cols-2 md:grid-cols-3 gap-4">{[...Array(4)].map((_,i)=><div key={i} className="card h-40 animate-pulse"/>)}</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {certs.map(cert=>(
            <div key={cert._id} className="card overflow-hidden hover:border-white/[0.12] transition-all group">
              <div className="h-32 bg-gradient-to-br from-violet-900/20 to-[#0F1525] relative overflow-hidden">
                {cert.image ? <img src={cert.image} alt={cert.name} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-slate-700 text-3xl font-black">{cert.name[0]}</div>}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-white text-sm line-clamp-1 mb-0.5">{cert.name}</h3>
                <p className="text-violet-400 text-xs mb-1">{cert.organization}</p>
                <p className="text-slate-600 text-xs mb-3">{toDate(cert.issueDate)}</p>
                <div className="flex items-center justify-between">
                  {cert.credentialUrl ? <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300"><HiExternalLink size={12}/> Verify</a> : <span/>}
                  <div className="flex gap-1.5">
                    <button onClick={()=>setModal({cert})} className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white"><HiPencil size={12}/></button>
                    <button onClick={()=>setDelId(cert._id)} className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400"><HiTrash size={12}/></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {certs.length===0 && <div className="col-span-4 card p-16 text-center text-slate-500">No certificates yet.</div>}
        </div>
      )}
      <Modal open={!!modal} onClose={()=>setModal(null)} size="lg" title={modal==='add'?'Add Certificate':`Edit: ${modal?.cert?.name}`}>
        <CertForm initial={modal==='add'?null:modal?.cert} certId={modal?.cert?._id} loading={createMutation.isPending||updateMutation.isPending} onCancel={()=>setModal(null)}
          onImageUpload={async(formData)=>{ const res=await uploadImageMutation.mutateAsync({id:modal.cert._id,form:formData}); return res?.data?.url }}
          onSave={(data)=>{ if(modal==='add') createMutation.mutate(data); else updateMutation.mutate({id:modal.cert._id,data}) }}/>
      </Modal>
      <ConfirmModal open={!!delId} title="Delete Certificate" message="This certificate will be permanently deleted." loading={deleteMutation.isPending} onCancel={()=>setDelId(null)} onConfirm={()=>deleteMutation.mutate(delId)}/>
    </div>
  )
}
