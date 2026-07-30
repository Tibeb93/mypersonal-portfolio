import { useRef, useState } from 'react'
import { HiUpload, HiPhotograph, HiX } from 'react-icons/hi'
import toast from 'react-hot-toast'

export default function ImageUpload({
  value,
  onChange,
  onUpload,
  uploading,
  accept = 'image/*',
  label = 'Image',
  hint,
  fieldName = 'image', // ← configurable field name for multipart form
}) {
  const inputRef = useRef(null)
  const [preview, setPreview] = useState(value || null)

  const handleFile = async (file) => {
    if (!file) return
    const localUrl = URL.createObjectURL(file)
    setPreview(localUrl)
    onChange?.(file)
    if (onUpload) {
      const form = new FormData()
      form.append(fieldName, file) // ← use the configured field name
      try {
        const url = await onUpload(form)
        if (url) setPreview(url)
        toast.success('Uploaded successfully')
      } catch (err) {
        toast.error(err.message || 'Upload failed')
        setPreview(value || null)
      }
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div>
      {label && <label className="label">{label}</label>}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl transition-all duration-200 cursor-pointer
          ${uploading ? 'cursor-wait' : 'hover:border-violet-500/50 hover:bg-violet-500/5'}
          ${preview ? 'border-white/10 p-0 overflow-hidden' : 'border-white/10 p-8'}`}
      >
        {preview ? (
          <div className="relative group">
            <img src={preview} alt="Preview" className="w-full h-48 object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100
              transition-opacity flex items-center justify-center gap-3">
              <button type="button" onClick={(e) => { e.stopPropagation(); inputRef.current?.click() }}
                className="btn-primary text-xs px-3 py-2">
                <HiUpload size={14} /> Replace
              </button>
              <button type="button" onClick={(e) => { e.stopPropagation(); setPreview(null); onChange?.(null) }}
                className="btn-danger text-xs px-3 py-2">
                <HiX size={14} /> Remove
              </button>
            </div>
            {uploading && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
              {uploading
                ? <div className="w-5 h-5 border-2 border-violet-400/30 border-t-violet-400 rounded-full animate-spin" />
                : <HiPhotograph size={24} className="text-slate-500" />
              }
            </div>
            <div>
              <p className="text-sm text-slate-400">
                {uploading ? 'Uploading…' : 'Drop image here or click to browse'}
              </p>
              {hint && <p className="text-xs text-slate-600 mt-1">{hint}</p>}
            </div>
          </div>
        )}
      </div>
      <input ref={inputRef} type="file" accept={accept} className="hidden"
        onChange={(e) => handleFile(e.target.files[0])} />
    </div>
  )
}
