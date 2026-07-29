import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { HiPlus, HiPencil, HiTrash, HiEye, HiSave, HiX } from 'react-icons/hi'
import toast from 'react-hot-toast'
import PageHeader from '../components/PageHeader.jsx'
import Modal from '../components/Modal.jsx'
import ConfirmModal from '../components/ConfirmModal.jsx'
import DataTable from '../components/DataTable.jsx'
import { blogAPI } from '../api/endpoints.js'
import useAuthStore from '../stores/authStore.js'

const STATUSES = ['draft','published','archived']
const EMPTY = { title:'', excerpt:'', content:'', category:'', tags:'', status:'draft', featured:false, seoTitle:'', seoDescription:'', seoKeywords:'' }

function BlogForm({ initial, onSave, onCancel, loading }) {
  const [form, setForm] = useState(initial
    ? { ...initial, tags:(initial.tags||[]).join(', '), seoKeywords:(initial.seoKeywords||[]).join(', ') }
    : EMPTY)
  const set = (k,v) => setForm(f=>({...f,[k]:v}))
  return (
    <div className="space-y-4">
      <div><label className="label">Title *</label><input value={form.title} onChange={e=>set('title',e.target.value)} required className="input"/></div>
      <div><label className="label">Excerpt *</label><textarea rows={2} value={form.excerpt} onChange={e=>set('excerpt',e.target.value)} required className="input resize-none"/></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="label">Category *</label><input value={form.category} onChange={e=>set('category',e.target.value)} required placeholder="Tech, Tutorial…" className="input"/></div>
        <div><label className="label">Status</label><select value={form.status} onChange={e=>set('status',e.target.value)} className="input">{STATUSES.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
      </div>
      <div><label className="label">Tags (comma-separated)</label><input value={form.tags||''} onChange={e=>set('tags',e.target.value)} className="input"/></div>
      <div><label className="label">Content (Markdown) *</label><textarea rows={12} value={form.content} onChange={e=>set('content',e.target.value)} required placeholder="Write your article in Markdown…" className="input resize-none font-mono text-xs"/></div>
      <div className="border-t border-white/[0.06] pt-4">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">SEO Settings</p>
        <div className="space-y-3">
          <div><label className="label">SEO Title</label><input value={form.seoTitle||''} onChange={e=>set('seoTitle',e.target.value)} className="input"/></div>
          <div><label className="label">SEO Description</label><textarea rows={2} value={form.seoDescription||''} onChange={e=>set('seoDescription',e.target.value)} className="input resize-none"/></div>
          <div><label className="label">SEO Keywords (comma-separated)</label><input value={form.seoKeywords||''} onChange={e=>set('seoKeywords',e.target.value)} className="input"/></div>
        </div>
      </div>
      <div className="flex items-center gap-2"><input type="checkbox" checked={form.featured} onChange={e=>set('featured',e.target.checked)} className="w-4 h-4 accent-violet-500"/><span className="text-sm text-slate-300">Featured post</span></div>
      <div className="flex gap-3 pt-2">
        <button onClick={()=>onSave({...form, tags:form.tags.split(',').map(s=>s.trim()).filter(Boolean), seoKeywords:form.seoKeywords.split(',').map(s=>s.trim()).filter(Boolean)})} disabled={loading} className="btn-primary flex-1 justify-center">
          {loading?<span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>:<HiSave size={15}/>}
          {loading?'Saving…':'Save Post'}
        </button>
        <button onClick={onCancel} className="btn-secondary px-5"><HiX size={15}/></button>
      </div>
    </div>
  )
}

export default function BlogManager() {
  const qc = useQueryClient()
  const { user } = useAuthStore()
  const [page, setPage] = useState(1)
  const [modal, setModal] = useState(null)
  const [delId, setDelId] = useState(null)
  const [statusFilter, setStatusFilter] = useState('')

  const { data, isLoading } = useQuery({
    queryKey:['admin-blog', page, statusFilter],
    queryFn: ()=>blogAPI.getAll({ page, limit:10, status:statusFilter||undefined }),
  })
  const posts = data?.data || []
  const pagination = data?.pagination || null

  const createMutation = useMutation({ mutationFn: blogAPI.create, onSuccess:()=>{ toast.success('Post created'); qc.invalidateQueries(['admin-blog']); setModal(null) }, onError:(e)=>toast.error(e.message) })
  const updateMutation = useMutation({ mutationFn:({id,data})=>blogAPI.update(id,data), onSuccess:()=>{ toast.success('Post updated'); qc.invalidateQueries(['admin-blog']); setModal(null) }, onError:(e)=>toast.error(e.message) })
  const deleteMutation = useMutation({ mutationFn: blogAPI.delete, onSuccess:()=>{ toast.success('Post deleted'); qc.invalidateQueries(['admin-blog']); setDelId(null) }, onError:(e)=>toast.error(e.message) })

  const statusColor = { draft:'badge-slate', published:'badge-emerald', archived:'badge-orange' }

  const columns = [
    { key:'title', label:'Title', render:(v,row)=>(
      <div>
        <p className="font-semibold text-white text-sm line-clamp-1">{v}</p>
        <p className="text-xs text-slate-500 mt-0.5">{row.category}</p>
      </div>
    )},
    { key:'status', label:'Status', render:(v)=><span className={statusColor[v]||'badge-slate'}>{v}</span> },
    { key:'views',  label:'Views',  render:(v)=><span className="text-slate-400">{v||0}</span> },
    { key:'readTime', label:'Read', render:(v)=><span className="text-slate-500">{v}m</span> },
    { key:'publishedAt', label:'Published', render:(v)=>v?<span className="text-slate-500 text-xs">{new Date(v).toLocaleDateString()}</span>:<span className="text-slate-600 text-xs">—</span> },
    { key:'_actions', label:'', render:(_,row)=>(
      <div className="flex items-center gap-1.5">
        <button onClick={()=>setModal({post:row})} className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white"><HiPencil size={13}/></button>
        <button onClick={()=>setDelId(row._id)} className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400"><HiTrash size={13}/></button>
      </div>
    )},
  ]

  return (
    <div>
      <PageHeader title="Blog CMS" description={`${pagination?.total||0} total posts`}
        action={
          <div className="flex items-center gap-3">
            <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="input text-xs py-2 w-32">
              <option value="">All</option>
              {STATUSES.map(s=><option key={s} value={s}>{s}</option>)}
            </select>
            <button onClick={()=>setModal('add')} className="btn-primary"><HiPlus size={16}/> New Post</button>
          </div>
        }/>
      <DataTable columns={columns} data={posts} loading={isLoading} pagination={pagination} onPageChange={setPage}
        emptyMessage="No blog posts yet. Click New Post to start writing."/>
      <Modal open={!!modal} onClose={()=>setModal(null)} size="xl" title={modal==='add'?'New Blog Post':`Edit: ${modal?.post?.title}`}>
        <BlogForm initial={modal==='add'?null:modal?.post} loading={createMutation.isPending||updateMutation.isPending} onCancel={()=>setModal(null)}
          onSave={(data)=>{ if(modal==='add') createMutation.mutate(data); else updateMutation.mutate({id:modal.post._id,data}) }}/>
      </Modal>
      <ConfirmModal open={!!delId} title="Delete Post" message="This blog post will be permanently deleted." loading={deleteMutation.isPending} onCancel={()=>setDelId(null)} onConfirm={()=>deleteMutation.mutate(delId)}/>
    </div>
  )
}
