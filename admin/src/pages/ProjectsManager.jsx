import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { HiPlus, HiPencil, HiTrash, HiEye, HiEyeOff, HiStar, HiExternalLink } from 'react-icons/hi'
import { FaGithub } from 'react-icons/fa'
import toast from 'react-hot-toast'
import PageHeader from '../components/PageHeader.jsx'
import Modal from '../components/Modal.jsx'
import ConfirmModal from '../components/ConfirmModal.jsx'
import ImageUpload from '../components/ImageUpload.jsx'
import { projectsAPI } from '../api/endpoints.js'

const CATS = ['fullstack','frontend','backend','web','mobile','api','other']
const STATUSES = ['completed','in-progress','archived']
const EMPTY = { title:'', description:'', longDesc:'', githubUrl:'', liveUrl:'', technologies:'', category:'fullstack', status:'completed', featured:false, visible:true, order:0 }

function ProjectForm({ initial, onSave, onCancel, loading, projectId, onThumbnailUpload, onCoverUpload }) {
  const [form, setForm] = useState(
    initial ? { ...initial, technologies: (initial.technologies||[]).join(', ') } : EMPTY
  )
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave({ ...form, technologies: form.technologies.split(',').map(t=>t.trim()).filter(Boolean) }) }}
      className="space-y-4">

      {projectId && (
        <div className="grid grid-cols-2 gap-4">
          <ImageUpload label="Project Thumbnail" value={form.thumbnail}
            hint="Recommended: 1200×630px"
            fieldName="thumbnail"
            onUpload={onThumbnailUpload} />
          <ImageUpload label="Cover Image" value={form.coverImage}
            hint="Full-width banner for blog/detail views"
            fieldName="coverImage"
            onUpload={onCoverUpload} />
        </div>
      )}

      <div>
        <label className="label">Title *</label>
        <input value={form.title} onChange={(e) => set('title', e.target.value)} required placeholder="My Awesome Project" className="input" />
      </div>
      <div>
        <label className="label">Short Description *</label>
        <textarea rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} required className="input resize-none" />
      </div>
      <div>
        <label className="label">Full Description</label>
        <textarea rows={4} value={form.longDesc||''} onChange={(e) => set('longDesc', e.target.value)} className="input resize-none" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">GitHub URL</label>
          <input value={form.githubUrl||''} onChange={(e) => set('githubUrl', e.target.value)} placeholder="https://github.com/..." className="input" />
        </div>
        <div>
          <label className="label">Live URL</label>
          <input value={form.liveUrl||''} onChange={(e) => set('liveUrl', e.target.value)} placeholder="https://..." className="input" />
        </div>
      </div>
      <div>
        <label className="label">Technologies (comma-separated)</label>
        <input value={form.technologies} onChange={(e) => set('technologies', e.target.value)} placeholder="React, Node.js, MongoDB" className="input" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="label">Category</label>
          <select value={form.category} onChange={(e) => set('category', e.target.value)} className="input">
            {CATS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Status</label>
          <select value={form.status} onChange={(e) => set('status', e.target.value)} className="input">
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Order</label>
          <input type="number" value={form.order} onChange={(e) => set('order', +e.target.value)} className="input" />
        </div>
      </div>
      <div className="flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} className="w-4 h-4 accent-violet-500" />
          <span className="text-sm text-slate-300">Featured project</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.visible} onChange={(e) => set('visible', e.target.checked)} className="w-4 h-4 accent-violet-500" />
          <span className="text-sm text-slate-300">Visible</span>
        </label>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
          {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
          {loading ? 'Saving…' : 'Save Project'}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary px-5">Cancel</button>
      </div>
    </form>
  )
}

export default function ProjectsManager() {
  const qc = useQueryClient()
  const [page, setPage]   = useState(1)
  const [modal, setModal] = useState(null)
  const [delId, setDelId] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-projects', page],
    queryFn:  () => projectsAPI.getAll({ page, limit: 12 }),
  })

  const projects   = data?.data   || []
  const pagination = data?.pagination || null

  const createMutation = useMutation({
    mutationFn: projectsAPI.create,
    onSuccess: (res) => {
      toast.success('Project created')
      qc.invalidateQueries(['admin-projects'])
      // Keep modal open with project id for thumbnail upload
      setModal({ project: res.data.project })
    },
    onError: (e) => toast.error(e.message),
  })
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => projectsAPI.update(id, data),
    onSuccess: () => { toast.success('Project updated'); qc.invalidateQueries(['admin-projects']); setModal(null) },
    onError:   (e) => toast.error(e.message),
  })
  const deleteMutation = useMutation({
    mutationFn: projectsAPI.delete,
    onSuccess: () => { toast.success('Project deleted'); qc.invalidateQueries(['admin-projects']); setDelId(null) },
    onError:   (e) => toast.error(e.message),
  })
  const toggleFeatured = useMutation({
    mutationFn: ({ id, featured }) => projectsAPI.update(id, { featured }),
    onSuccess: () => qc.invalidateQueries(['admin-projects']),
    onError:   (e) => toast.error(e.message),
  })
  const toggleVisible = useMutation({
    mutationFn: ({ id, visible }) => projectsAPI.update(id, { visible }),
    onSuccess: () => qc.invalidateQueries(['admin-projects']),
    onError:   (e) => toast.error(e.message),
  })

  const handleThumbnailUpload = async (formData) => {
    const projectId = modal?.project?._id
    if (!projectId) return
    const res = await projectsAPI.uploadThumbnail(projectId, formData)
    qc.invalidateQueries(['admin-projects'])
    return res?.data?.url
  }

  const handleCoverUpload = async (formData) => {
    const projectId = modal?.project?._id
    if (!projectId) return
    const res = await projectsAPI.uploadCover(projectId, formData)
    qc.invalidateQueries(['admin-projects'])
    return res?.data?.url
  }

  return (
    <div>
      <PageHeader title="Projects Manager" description={`${pagination?.total || 0} total projects`}
        action={<button onClick={() => setModal('add')} className="btn-primary"><HiPlus size={16}/> Add Project</button>} />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_,i) => <div key={i} className="card h-64 animate-pulse" />)}
        </div>
      ) : projects.length === 0 ? (
        <div className="card p-16 text-center text-slate-500">No projects yet. Click Add Project to create one.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map(p => (
            <div key={p._id} className={`card overflow-hidden group hover:border-white/[0.12] transition-all duration-200 ${!p.visible ? 'opacity-60' : ''}`}>
              <div className="relative h-40 bg-gradient-to-br from-violet-900/40 to-[#0F1525] overflow-hidden">
                {p.thumbnail
                  ? <img src={p.thumbnail} alt={p.title} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-4xl font-black text-white/10">{p.title[0]}</div>
                }
                {p.featured && <span className="absolute top-2 left-2 badge-violet text-xs">Featured</span>}
                <span className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-lg border
                  ${p.status === 'completed' ? 'badge-emerald' : p.status === 'in-progress' ? 'badge-orange' : 'badge-slate'}`}>
                  {p.status}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-white text-sm mb-1 truncate">{p.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mb-3">{p.description}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {p.technologies?.slice(0,3).map(t => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded bg-white/5 border border-white/8 text-slate-400">{t}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-violet-400"><HiExternalLink size={13}/></a>}
                    {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white"><FaGithub size={12}/></a>}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => toggleFeatured.mutate({ id: p._id, featured: !p.featured })}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors
                        ${p.featured ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/5 text-slate-500 hover:text-yellow-400'}`}>
                      <HiStar size={13}/>
                    </button>
                    <button onClick={() => toggleVisible.mutate({ id: p._id, visible: !p.visible })}
                      className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white">
                      {p.visible ? <HiEye size={13}/> : <HiEyeOff size={13}/>}
                    </button>
                    <button onClick={() => setModal({ project: p })}
                      className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white">
                      <HiPencil size={13}/>
                    </button>
                    <button onClick={() => setDelId(p._id)}
                      className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 hover:text-red-300">
                      <HiTrash size={13}/>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {[...Array(pagination.pages)].map((_,i) => (
            <button key={i} onClick={() => setPage(i+1)}
              className={`w-9 h-9 rounded-xl text-sm font-semibold transition-colors
                ${page === i+1 ? 'bg-violet-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white'}`}>
              {i+1}
            </button>
          ))}
        </div>
      )}

      <Modal open={!!modal} onClose={() => setModal(null)} size="lg"
        title={modal === 'add' ? 'Add Project' : `Edit: ${modal?.project?.title}`}>
        <ProjectForm
          initial={modal === 'add' ? null : modal?.project}
          projectId={modal?.project?._id}
          loading={createMutation.isPending || updateMutation.isPending}
          onCancel={() => setModal(null)}
          onThumbnailUpload={handleThumbnailUpload}
          onCoverUpload={handleCoverUpload}
          onSave={(data) => {
            if (modal === 'add') createMutation.mutate(data)
            else updateMutation.mutate({ id: modal.project._id, data })
          }}
        />
      </Modal>

      <ConfirmModal open={!!delId} title="Delete Project"
        message="This project and all its images will be permanently deleted."
        loading={deleteMutation.isPending}
        onCancel={() => setDelId(null)}
        onConfirm={() => deleteMutation.mutate(delId)} />
    </div>
  )
}
