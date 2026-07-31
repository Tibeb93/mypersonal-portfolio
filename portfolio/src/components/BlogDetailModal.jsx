import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiX, HiClock, HiEye, HiTag, HiExternalLink } from 'react-icons/hi'
import { useQuery } from '@tanstack/react-query'
import Skeleton from './Skeleton'
import { blogAPI } from '../services/api'

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function renderMarkdown(md) {
  if (!md) return ''
  return md
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold text-white mt-6 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-white mt-8 mb-3">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-white mt-8 mb-3">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code class="px-1.5 py-0.5 rounded bg-white/10 text-violet-300 text-sm font-mono">$1</code>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 text-slate-300">$1</li>')
    .replace(/(<li[^>]*>.*<\/li>\n?)+/g, (m) => `<ul class="list-disc ml-6 space-y-1 my-3">${m}</ul>`)
    .replace(/\n{2,}/g, '</p><p class="text-slate-300 leading-relaxed mb-4">')
    .replace(/\n/g, '<br/>')
    .replace(/^(.+)$/gm, (line) => {
      if (line.startsWith('<')) return line
      return line
    })
}

export default function BlogDetailModal({ slug, onClose }) {
  const { data, isLoading } = useQuery({
    queryKey: ['blog-detail', slug],
    queryFn: () => blogAPI.getBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  })

  const blog = data?.data?.blog

  useEffect(() => {
    if (slug) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [slug])

  return (
    <AnimatePresence>
      {slug && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-start justify-center p-4 pt-16 pb-8 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-3xl bg-[#151c2c] border border-white/[0.08] rounded-2xl shadow-2xl z-10"
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/20 transition-colors"
            >
              <HiX size={18} />
            </button>

            {isLoading ? (
              <div className="p-8 space-y-4">
                <Skeleton className="h-7 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-64 w-full" />
                <Skeleton.Text lines={5} />
              </div>
            ) : blog ? (
              <>
                {/* Cover */}
                {blog.coverImage && (
                  <div className="relative h-64 sm:h-80 overflow-hidden rounded-t-2xl">
                    <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#151c2c] via-transparent to-transparent" />
                  </div>
                )}

                {/* Video */}
                {blog.videoUrl && (
                  <div className="px-6 pt-6">
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/[0.08]">
                      <iframe
                        src={blog.videoUrl}
                        className="absolute inset-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={`${blog.title} video`}
                      />
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-violet-500/10 text-violet-400 border border-white/10">
                      {blog.category}
                    </span>
                    {blog.featured && (
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-gradient-to-r from-violet-600 to-pink-600 text-white">
                        Featured
                      </span>
                    )}
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 leading-tight">{blog.title}</h2>

                  <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
                    {blog.author?.name && <span className="text-slate-400">{blog.author.name}</span>}
                    <span className="flex items-center gap-1"><HiClock size={14} /> {blog.readTime} min read</span>
                    {blog.views > 0 && <span className="flex items-center gap-1"><HiEye size={14} /> {blog.views}</span>}
                    <span>{formatDate(blog.publishedAt)}</span>
                  </div>

                  {blog.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {blog.tags.map((tag) => (
                        <span key={tag} className="flex items-center gap-1 px-2 py-0.5 rounded text-xs text-slate-400 bg-white/5 border border-white/8">
                          <HiTag size={10} /> {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div
                    className="prose prose-invert max-w-none text-slate-300 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: `<p class="text-slate-300 leading-relaxed mb-4">${renderMarkdown(blog.content)}</p>` }}
                  />
                </div>
              </>
            ) : (
              <div className="p-8 text-center text-slate-500">Blog post not found.</div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
