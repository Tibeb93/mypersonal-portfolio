import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { HiUpload, HiTrash, HiClipboardCopy, HiSearch, HiPhotograph, HiFilm } from 'react-icons/hi'
import toast from 'react-hot-toast'
import PageHeader from '../components/PageHeader.jsx'
import ConfirmModal from '../components/ConfirmModal.jsx'
import { mediaAPI } from '../api/endpoints.js'

function formatBytes(bytes) {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes/1024).toFixed(1)}KB`
  return `${(bytes/1024/1024).toFixed(1)}MB`
}

export default function MediaLibrary() {
  const qc = useQueryClient()
  const fileRef = useRef(null)
  const [page, setPage]     = useState(1)
  const [search, setSearch] = useState('')
  const [type, setType]     = useState('')
  const [delId, setDelId]   = useState(null)
  const [selected, setSelected] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-media', page, search, type],
    queryFn:  () => mediaAPI.getAll({ page, limit:24, search:search||undefined, resourceType:type||undefined }),
  })
  const media      = data?.data   || []
  const pagination = data?.pagination || null

  const uploadMutation = useMutation({
    mutationFn: (form) => mediaAPI.upload(form),
    onSuccess: () => { toast.success('File uploaded'); qc.invalidateQueries(['admin-media']) },
    onError:   (e) => toast.error(e.message),
  })
  const deleteMutation = useMutation({
    mutationFn: mediaAPI.delete,
    onSuccess: () => { toast.success('File deleted'); qc.invalidateQueries(['admin-media']); setDelId(null); setSelected(null) },
    onError:   (e) => toast.error(e.message),
  })

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    files.forEach(file => {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('name', file.name)
      uploadMutation.mutate(fd)
    })
    e.target.value = ''
  }

  const copyUrl = (url) => {
    navigator.clipboard.writeText(url)
    toast.success('URL copied to clipboard')
  }

  return (
    <div>
      <PageHeader title="Media Library" description={`${pagination?.total||0} files`}
        action={
          <div className="flex items-center gap-3">
            <label className={`btn-primary cursor-pointer ${uploadMutation.isPending?'opacity-70':''}`}>
              {uploadMutation.isPending
                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                : <HiUpload size={16}/>
              }
              {uploadMutation.isPending ? 'Uploading…' : 'Upload Files'}
              <input ref={fileRef} type="file" multiple accept="image/*,video/*,.pdf" className="hidden" onChange={handleFileChange}/>
            </label>
          </div>
        }/>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <HiSearch size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search files…" className="input pl-9 text-sm py-2"/>
        </div>
        <select value={type} onChange={e=>setType(e.target.value)} className="input text-sm py-2 w-36">
          <option value="">All types</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
          <option value="raw">Documents</option>
        </select>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 mb-6">
        {isLoading
          ? [...Array(16)].map((_,i)=><div key={i} className="aspect-square rounded-xl bg-white/5 animate-pulse"/>)
          : media.map(item=>(
            <div key={item._id} onClick={()=>setSelected(item)}
              className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all
                ${selected?._id===item._id?'border-violet-500 shadow-[0_0_20px_rgba(139,92,246,0.4)]':'border-transparent hover:border-white/20'}`}>
              {item.resourceType==='image'
                ? <img src={item.url} alt={item.name} className="w-full h-full object-cover"/>
                : <div className="w-full h-full bg-[#141B2D] flex flex-col items-center justify-center gap-1">
                    {item.resourceType==='video' ? <HiFilm size={24} className="text-violet-400"/> : <HiPhotograph size={24} className="text-slate-500"/>}
                    <span className="text-xs text-slate-500 text-center px-1 truncate w-full text-center">{item.format}</span>
                  </div>
              }
            </div>
          ))
        }
      </div>

      {/* File detail panel */}
      {selected && (
        <div className="card p-5 mb-6 flex items-start gap-5 flex-wrap">
          <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-[#141B2D]">
            {selected.resourceType==='image'
              ? <img src={selected.url} alt={selected.name} className="w-full h-full object-cover"/>
              : <div className="w-full h-full flex items-center justify-center"><HiFilm size={32} className="text-violet-400"/></div>
            }
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white text-sm truncate mb-1">{selected.name}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-500">
              <span>Type: <span className="text-slate-300">{selected.resourceType}</span></span>
              <span>Format: <span className="text-slate-300">{selected.format}</span></span>
              <span>Size: <span className="text-slate-300">{formatBytes(selected.size)}</span></span>
              {selected.width && <span>Dimensions: <span className="text-slate-300">{selected.width}×{selected.height}</span></span>}
            </div>
            <div className="flex items-center gap-2 mt-3">
              <input readOnly value={selected.url} className="input text-xs flex-1 py-1.5"/>
              <button onClick={()=>copyUrl(selected.url)} className="btn-secondary text-xs px-3 py-1.5 flex-shrink-0">
                <HiClipboardCopy size={14}/> Copy
              </button>
              <button onClick={()=>setDelId(selected._id)} className="btn-danger text-xs px-3 py-1.5 flex-shrink-0">
                <HiTrash size={14}/> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center gap-2">
          {[...Array(pagination.pages)].map((_,i)=>(
            <button key={i} onClick={()=>setPage(i+1)}
              className={`w-9 h-9 rounded-xl text-sm font-semibold transition-colors ${page===i+1?'bg-violet-600 text-white':'bg-white/5 text-slate-400 hover:text-white'}`}>
              {i+1}
            </button>
          ))}
        </div>
      )}

      <ConfirmModal open={!!delId} title="Delete File" message="This file will be deleted from Cloudinary and cannot be recovered." loading={deleteMutation.isPending} onCancel={()=>setDelId(null)} onConfirm={()=>deleteMutation.mutate(delId)}/>
    </div>
  )
}
