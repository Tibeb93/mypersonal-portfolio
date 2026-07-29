import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { HiPlus, HiPencil, HiTrash, HiSave, HiX } from 'react-icons/hi'
import toast from 'react-hot-toast'
import PageHeader from '../components/PageHeader.jsx'
import Modal from '../components/Modal.jsx'
import ConfirmModal from '../components/ConfirmModal.jsx'
import { skillsAPI } from '../api/endpoints.js'

const CATEGORIES = ['frontend','backend','database','tools','devops','design','other']
const EMPTY = { name: '', category: 'frontend', level: 80, iconColor: '#8B5CF6', description: '', visible: true, order: 0 }

function SkillForm({ initial, onSave, onCancel, loading }) {
  const [form, setForm] = useState(initial || EMPTY)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form) }} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Skill Name *</label>
          <input value={form.name} onChange={(e) => set('name', e.target.value)}
            required placeholder="React" className="input" />
        </div>
        <div>
          <label className="label">Category *</label>
          <select value={form.category} onChange={(e) => set('category', e.target.value)} className="input">
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Proficiency Level: {form.level}%</label>
          <input type="range" min={0} max={100} value={form.level} onChange={(e) => set('level', +e.target.value)}
            className="w-full accent-violet-500" />
        </div>
        <div>
          <label className="label">Icon Color</label>
          <div className="flex items-center gap-3">
            <input type="color" value={form.iconColor || '#8B5CF6'} onChange={(e) => set('iconColor', e.target.value)}
              className="w-10 h-10 rounded-lg border border-white/10 bg-transparent cursor-pointer" />
            <input value={form.iconColor || ''} onChange={(e) => set('iconColor', e.target.value)}
              placeholder="#8B5CF6" className="input flex-1 text-xs" />
          </div>
        </div>
      </div>
      <div>
        <label className="label">Description (optional)</label>
        <textarea rows={2} value={form.description || ''} onChange={(e) => set('description', e.target.value)}
          placeholder="Brief description…" className="input resize-none" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Order</label>
          <input type="number" value={form.order} onChange={(e) => set('order', +e.target.value)} className="input" />
        </div>
        <div className="flex items-end pb-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.visible} onChange={(e) => set('visible', e.target.checked)} className="w-4 h-4 accent-violet-500" />
            <span className="text-sm text-slate-300">Visible on portfolio</span>
          </label>
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
          {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <HiSave size={15} />}
          {loading ? 'Saving…' : 'Save Skill'}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary px-5"><HiX size={15} /></button>
      </div>
    </form>
  )
}

export default function SkillsManager() {
  const qc = useQueryClient()
  const [modal, setModal]   = useState(null) // null | 'add' | { skill }
  const [delId, setDelId]   = useState(null)
  const [activeTab, setActiveTab] = useState('all')

  const { data, isLoading } = useQuery({ queryKey: ['admin-skills'], queryFn: skillsAPI.getAll })
  const skills = data?.data?.skills || []
  const filtered = activeTab === 'all' ? skills : skills.filter(s => s.category === activeTab)

  const createMutation = useMutation({
    mutationFn: skillsAPI.create,
    onSuccess: () => { toast.success('Skill created'); qc.invalidateQueries(['admin-skills']); setModal(null) },
    onError:   (e) => toast.error(e.message),
  })
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => skillsAPI.update(id, data),
    onSuccess: () => { toast.success('Skill updated'); qc.invalidateQueries(['admin-skills']); setModal(null) },
    onError:   (e) => toast.error(e.message),
  })
  const deleteMutation = useMutation({
    mutationFn: skillsAPI.delete,
    onSuccess: () => { toast.success('Skill deleted'); qc.invalidateQueries(['admin-skills']); setDelId(null) },
    onError:   (e) => toast.error(e.message),
  })

  const usedCats = ['all', ...new Set(skills.map(s => s.category))]

  return (
    <div>
      <PageHeader title="Skills Manager" description={`${skills.length} skills across ${usedCats.length - 1} categories`}
        action={<button onClick={() => setModal('add')} className="btn-primary"><HiPlus size={16} /> Add Skill</button>} />

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {usedCats.map(cat => (
          <button key={cat} onClick={() => setActiveTab(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all capitalize
              ${activeTab === cat ? 'bg-violet-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'}`}>
            {cat} {cat === 'all' ? `(${skills.length})` : `(${skills.filter(s => s.category === cat).length})`}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {[...Array(12)].map((_, i) => <div key={i} className="card p-4 animate-pulse h-24" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filtered.map(skill => (
            <div key={skill._id} className={`card p-4 flex flex-col items-center gap-2 text-center group
              hover:border-white/[0.12] transition-all duration-200 ${!skill.visible ? 'opacity-50' : ''}`}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                style={{ background: `${skill.iconColor || '#8B5CF6'}20`, color: skill.iconColor || '#8B5CF6' }}>
                {skill.name[0]}
              </div>
              <span className="text-xs font-semibold text-white leading-tight">{skill.name}</span>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${skill.level}%`, background: skill.iconColor || '#8B5CF6' }} />
              </div>
              <span className="text-xs text-slate-500">{skill.level}%</span>
              <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setModal({ skill })}
                  className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white">
                  <HiPencil size={12} />
                </button>
                <button onClick={() => setDelId(skill._id)}
                  className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 hover:text-red-300">
                  <HiTrash size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal open={!!modal} onClose={() => setModal(null)}
        title={modal === 'add' ? 'Add Skill' : `Edit: ${modal?.skill?.name}`}>
        <SkillForm
          initial={modal === 'add' ? EMPTY : modal?.skill}
          loading={createMutation.isPending || updateMutation.isPending}
          onCancel={() => setModal(null)}
          onSave={(data) => {
            if (modal === 'add') createMutation.mutate(data)
            else updateMutation.mutate({ id: modal.skill._id, data })
          }}
        />
      </Modal>

      {/* Delete confirm */}
      <ConfirmModal open={!!delId} title="Delete Skill"
        message="This skill will be permanently removed from your portfolio."
        loading={deleteMutation.isPending}
        onCancel={() => setDelId(null)}
        onConfirm={() => deleteMutation.mutate(delId)} />
    </div>
  )
}
