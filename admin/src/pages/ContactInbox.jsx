import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { HiMail, HiMailOpen, HiTrash, HiReply, HiArchive, HiCheck } from 'react-icons/hi'
import toast from 'react-hot-toast'
import PageHeader from '../components/PageHeader.jsx'
import Modal from '../components/Modal.jsx'
import ConfirmModal from '../components/ConfirmModal.jsx'
import DataTable from '../components/DataTable.jsx'
import { contactAPI } from '../api/endpoints.js'

const STATUS_COLORS = { unread:'badge-violet', read:'badge-slate', replied:'badge-emerald', archived:'badge-orange' }

export default function ContactInbox() {
  const qc = useQueryClient()
  const [page, setPage]     = useState(1)
  const [filter, setFilter] = useState('')
  const [selected, setSelected] = useState(null)
  const [delId, setDelId]       = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-contact', page, filter],
    queryFn:  () => contactAPI.getAll({ page, limit:20, status:filter||undefined }),
  })
  const { data: statsData } = useQuery({ queryKey:['contact-stats'], queryFn: contactAPI.getStats })

  const messages  = data?.data   || []
  const pagination= data?.pagination || null
  const stats     = statsData?.data?.stats || []
  const unread    = stats.find(s=>s._id==='unread')?.count || 0

  const updateStatus = useMutation({
    mutationFn: ({id,status}) => contactAPI.updateStatus(id, status),
    onSuccess: () => { qc.invalidateQueries(['admin-contact']); qc.invalidateQueries(['contact-stats']) },
    onError:   (e) => toast.error(e.message),
  })
  const deleteMutation = useMutation({
    mutationFn: contactAPI.delete,
    onSuccess: () => { toast.success('Message deleted'); qc.invalidateQueries(['admin-contact']); setDelId(null); setSelected(null) },
    onError:   (e) => toast.error(e.message),
  })

  const openMessage = async (msg) => {
    setSelected(msg)
    if (msg.status === 'unread') updateStatus.mutate({ id: msg._id, status: 'read' })
  }

  const columns = [
    { key:'name', label:'From', render:(v,row)=>(
      <div className="flex items-center gap-2">
        {row.status==='unread' && <div className="w-2 h-2 rounded-full bg-violet-400 flex-shrink-0"/>}
        <div>
          <p className={`text-sm ${row.status==='unread'?'font-bold text-white':'font-medium text-slate-300'}`}>{v}</p>
          <p className="text-xs text-slate-500">{row.email}</p>
        </div>
      </div>
    )},
    { key:'subject', label:'Subject', render:(v)=><span className="text-sm text-slate-300 line-clamp-1">{v}</span> },
    { key:'status', label:'Status', render:(v)=><span className={STATUS_COLORS[v]||'badge-slate'}>{v}</span> },
    { key:'createdAt', label:'Date', render:(v)=><span className="text-xs text-slate-500">{new Date(v).toLocaleDateString()}</span> },
    { key:'_actions', label:'', render:(_,row)=>(
      <div className="flex items-center gap-1.5">
        <button onClick={()=>openMessage(row)} className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white"><HiMailOpen size={13}/></button>
        <button onClick={()=>updateStatus.mutate({id:row._id,status:'replied'})} className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 hover:text-emerald-300"><HiCheck size={13}/></button>
        <button onClick={()=>setDelId(row._id)} className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 hover:text-red-300"><HiTrash size={13}/></button>
      </div>
    )},
  ]

  return (
    <div>
      <PageHeader title={`Contact Inbox ${unread>0?`(${unread} unread)`:''}`} description="Messages from your portfolio contact form."
        action={
          <select value={filter} onChange={e=>setFilter(e.target.value)} className="input text-sm py-2 w-40">
            <option value="">All messages</option>
            {['unread','read','replied','archived'].map(s=><option key={s} value={s}>{s}</option>)}
          </select>
        }/>

      <DataTable columns={columns} data={messages} loading={isLoading} pagination={pagination} onPageChange={setPage}
        emptyMessage="No messages yet."/>

      {/* Message detail modal */}
      <Modal open={!!selected} onClose={()=>setSelected(null)} title="Message" size="md">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-slate-500 text-xs mb-1">From</p><p className="text-white font-semibold">{selected.name}</p></div>
              <div><p className="text-slate-500 text-xs mb-1">Email</p><a href={`mailto:${selected.email}`} className="text-violet-400 hover:text-violet-300">{selected.email}</a></div>
              <div><p className="text-slate-500 text-xs mb-1">Subject</p><p className="text-white">{selected.subject}</p></div>
              <div><p className="text-slate-500 text-xs mb-1">Received</p><p className="text-slate-400">{new Date(selected.createdAt).toLocaleString()}</p></div>
            </div>
            <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.06]">
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</p>
            </div>
            <div className="flex gap-3 pt-2">
              <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`} target="_blank" rel="noopener noreferrer"
                className="btn-primary flex-1 justify-center">
                <HiReply size={16}/> Reply via Email
              </a>
              <button onClick={()=>{ updateStatus.mutate({id:selected._id,status:'replied'}); setSelected(null) }}
                className="btn-secondary px-4"><HiCheck size={15}/> Mark Replied</button>
              <button onClick={()=>{ setDelId(selected._id) }} className="btn-danger px-4"><HiTrash size={15}/></button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmModal open={!!delId} title="Delete Message" message="This message will be permanently deleted." loading={deleteMutation.isPending} onCancel={()=>setDelId(null)} onConfirm={()=>deleteMutation.mutate(delId)}/>
    </div>
  )
}
