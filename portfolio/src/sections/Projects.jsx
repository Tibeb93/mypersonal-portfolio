import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa'
import { HiEye } from 'react-icons/hi'
import SectionTitle from '../components/SectionTitle'
import Skeleton from '../components/Skeleton'
import { staggerContainer, staggerItem, viewport } from '../utils/animations'
import useProjects from '../hooks/useProjects'

const CATEGORIES = ['all', 'fullstack', 'frontend', 'backend', 'web', 'mobile', 'api']

const TAG_COLORS = {
  React:       'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  'Node.js':   'bg-green-500/10 text-green-400 border-green-500/20',
  MongoDB:     'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Stripe:      'bg-violet-500/10 text-violet-400 border-violet-500/20',
  JWT:         'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  'Socket.io': 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  Express:     'bg-slate-500/10 text-slate-400 border-slate-500/20',
  PostgreSQL:  'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Python:      'bg-blue-500/10 text-blue-400 border-blue-500/20',
  TypeScript:  'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'AWS S3':    'bg-orange-500/10 text-orange-400 border-orange-500/20',
  Docker:      'bg-sky-500/10 text-sky-400 border-sky-500/20',
  'Next.js':   'bg-slate-500/10 text-slate-300 border-slate-500/20',
}
const tagCls = (t) => TAG_COLORS[t] || 'bg-slate-500/10 text-slate-400 border-slate-500/20'

// Gradient palette cycles for projects without a thumbnail
const GRADIENTS = [
  'from-violet-900/60 via-purple-900/40 to-[#0F1525]',
  'from-pink-900/60 via-rose-900/40 to-[#0F1525]',
  'from-orange-900/60 via-amber-900/40 to-[#0F1525]',
  'from-cyan-900/60 via-teal-900/40 to-[#0F1525]',
  'from-emerald-900/60 via-green-900/40 to-[#0F1525]',
  'from-indigo-900/60 via-blue-900/40 to-[#0F1525]',
]

function ProjectCard({ project, index }) {
  const [hovered, setHovered] = useState(false)
  const gradient = GRADIENTS[index % GRADIENTS.length]

  return (
    <motion.article
      variants={staggerItem}
      className="group rounded-2xl overflow-hidden border border-white/[0.06]
        hover:border-white/[0.12] hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)] transition-all duration-500"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Thumbnail */}
      <div className={`relative h-52 overflow-hidden ${project.thumbnail ? '' : `bg-gradient-to-br ${gradient}`}`}>
        {project.thumbnail ? (
          <img
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <>
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px,transparent 1px),
                linear-gradient(90deg,rgba(255,255,255,.1) 1px,transparent 1px)`,
              backgroundSize: '30px 30px',
            }} />
            <div className="absolute top-4 left-4 text-6xl font-black text-white/5 select-none">
              {String(index + 1).padStart(2, '0')}
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-2xl glass border border-white/10 flex items-center justify-center">
                <span className="text-2xl font-black text-white/50">{project.title[0]}</span>
              </div>
            </div>
          </>
        )}

        {/* Featured badge */}
        {project.featured && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-bold
            bg-gradient-to-r from-violet-600 to-pink-600 text-white border border-white/10">
            Featured
          </div>
        )}

        {/* Views */}
        {project.views > 0 && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg
            glass border border-white/10 text-xs text-slate-300">
            <HiEye size={12} /> {project.views}
          </div>
        )}

        {/* Hover overlay */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              className="absolute inset-0 bg-[#0B0F19]/80 backdrop-blur-sm flex items-center justify-center gap-4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl
                    bg-gradient-to-r from-violet-600 to-pink-600 text-white text-sm font-semibold
                    hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] transition-all duration-200">
                  <FaExternalLinkAlt size={12} /> Live Demo
                </a>
              )}
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass border border-white/15
                    text-white text-sm font-semibold hover:bg-white/10 transition-all duration-200">
                  <FaGithub size={14} /> GitHub
                </a>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Body */}
      <div className="p-5 bg-[#0F1525]/80">
        <h3 className="text-lg font-bold text-white mb-2">{project.title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-2">{project.description}</p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {(project.technologies || []).slice(0, 5).map((t) => (
            <span key={t} className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${tagCls(t)}`}>{t}</span>
          ))}
        </div>
        <div className="flex items-center gap-3 pt-3 border-t border-white/5">
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors">
              <FaExternalLinkAlt size={11} /> Live Demo
            </a>
          )}
          {project.liveUrl && project.githubUrl && (
            <span className="text-white/10">|</span>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
              <FaGithub size={12} /> Source Code
            </a>
          )}
        </div>
      </div>
    </motion.article>
  )
}

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState('all')
  const params = activeCategory === 'all' ? {} : { category: activeCategory }
  const { projects, isLoading } = useProjects(params)

  // Available categories from actual data
  const usedCategories = ['all', ...new Set(projects.map((p) => p.category))]

  return (
    <section id="projects" className="section-padding">
      <div className="container-custom">
        <SectionTitle label="My Work" title="Featured" highlight="Projects"
          description="A selection of projects showcasing real-world, production-ready applications." />

        {/* Category filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {usedCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 capitalize
                ${activeCategory === cat
                  ? 'bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.4)]'
                  : 'glass border border-white/[0.08] text-slate-400 hover:text-white hover:border-violet-500/30'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton.Card key={i} />)}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <p className="text-lg">No projects found in this category.</p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewport}
          >
            {projects.map((p, i) => <ProjectCard key={p._id} project={p} index={i} />)}
          </motion.div>
        )}

        {/* GitHub CTA */}
        <motion.div className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport} transition={{ duration: 0.5, delay: 0.3 }}>
          <a href="https://github.com/Tibeb93" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl glass border border-white/10
              text-slate-300 font-semibold hover:text-white hover:border-violet-500/30 hover:bg-violet-500/5
              transition-all duration-300">
            <FaGithub size={18} /> View All on GitHub
          </a>
        </motion.div>
      </div>
    </section>
  )
}
