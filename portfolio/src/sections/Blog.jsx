import { useState } from 'react'
import { motion } from 'framer-motion'
import { HiClock, HiEye, HiTag, HiArrowRight } from 'react-icons/hi'
import { useQuery } from '@tanstack/react-query'
import SectionTitle from '../components/SectionTitle'
import Skeleton from '../components/Skeleton'
import BlogDetailModal from '../components/BlogDetailModal'
import { staggerContainer, staggerItem, viewport } from '../utils/animations'
import { blogAPI } from '../services/api'

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function BlogCard({ post, index, onReadMore }) {
  const colors = ['violet', 'pink', 'orange', 'cyan', 'emerald']
  const color = colors[index % colors.length]
  const borderMap = { violet: 'hover:border-violet-500/30', pink: 'hover:border-pink-500/30', orange: 'hover:border-orange-500/30', cyan: 'hover:border-cyan-500/30', emerald: 'hover:border-emerald-500/30' }
  const textMap = { violet: 'text-violet-400', pink: 'text-pink-400', orange: 'text-orange-400', cyan: 'text-cyan-400', emerald: 'text-emerald-400' }
  const bgMap = { violet: 'bg-violet-500/10', pink: 'bg-pink-500/10', orange: 'bg-orange-500/10', cyan: 'bg-cyan-500/10', emerald: 'bg-emerald-500/10' }

  return (
    <motion.article
      variants={staggerItem}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`glass rounded-2xl border border-white/[0.06] overflow-hidden group
        transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] ${borderMap[color]}`}
    >
      {/* Cover */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-white/[0.03] to-transparent">
        {post.coverImage ? (
          <img src={post.coverImage} alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy" />
        ) : (
          <div className={`w-full h-full flex items-center justify-center ${bgMap[color]}`}>
            <span className="text-4xl font-black text-white/10">{post.title[0]}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F1525] via-transparent to-transparent" />

        {post.featured && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-bold
            bg-gradient-to-r from-violet-600 to-pink-600 text-white">
            Featured
          </div>
        )}

        <div className="absolute bottom-3 left-4">
          <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${bgMap[color]} ${textMap[color]} border border-white/10`}>
            {post.category}
          </span>
        </div>

        {post.videoUrl && (
          <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5">
        <h3 className="text-base font-bold text-white mb-2 line-clamp-2 group-hover:text-violet-300 transition-colors">
          {post.title}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
          <span className="flex items-center gap-1">
            <HiClock size={12} /> {post.readTime} min read
          </span>
          {post.views > 0 && (
            <span className="flex items-center gap-1">
              <HiEye size={12} /> {post.views}
            </span>
          )}
          <span>{formatDate(post.publishedAt)}</span>
        </div>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="flex items-center gap-1 px-2 py-0.5 rounded text-xs
                text-slate-500 bg-white/5 border border-white/8">
                <HiTag size={10} /> {tag}
              </span>
            ))}
          </div>
        )}

        <button
          onClick={() => onReadMore(post.slug)}
          className={`flex items-center gap-1.5 text-xs font-semibold ${textMap[color]}
            group-hover:gap-2.5 transition-all duration-200`}
        >
          Read More <HiArrowRight size={13} />
        </button>
      </div>
    </motion.article>
  )
}

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedSlug, setSelectedSlug] = useState(null)

  const { data: blogsData, isLoading } = useQuery({
    queryKey: ['blog', { category: activeCategory }],
    queryFn: () => blogAPI.getAll({ limit: 6, ...(activeCategory !== 'all' ? { category: activeCategory } : {}) }),
    staleTime: 5 * 60 * 1000,
  })

  const { data: categoriesData } = useQuery({
    queryKey: ['blog-categories'],
    queryFn: blogAPI.getCategories,
    staleTime: 10 * 60 * 1000,
  })

  const posts      = blogsData?.data     ?? []
  const categories = ['all', ...(categoriesData?.data?.categories ?? [])]

  if (!isLoading && posts.length === 0) return null

  return (
    <section id="blog" className="section-padding">
      <div className="container-custom">
        <SectionTitle label="My Writing" title="Latest" highlight="Articles"
          description="Thoughts, tutorials, and insights on web development, design, and technology." />

        {categories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 capitalize
                  ${activeCategory === cat
                    ? 'bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.4)]'
                    : 'glass border border-white/[0.08] text-slate-400 hover:text-white hover:border-violet-500/30'
                  }`}>
                {cat}
              </button>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => <Skeleton.Card key={i} />)}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewport}
          >
            {posts.map((post, i) => (
              <BlogCard key={post._id} post={post} index={i} onReadMore={setSelectedSlug} />
            ))}
          </motion.div>
        )}
      </div>

      <BlogDetailModal slug={selectedSlug} onClose={() => setSelectedSlug(null)} />
    </section>
  )
}
