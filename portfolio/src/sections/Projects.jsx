import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa'
import SectionTitle from '../components/SectionTitle'
import { staggerContainer, staggerItem, viewport } from '../utils/animations'

const PROJECTS = [
  {
    id: 1, title: 'E-Commerce Platform',
    desc: 'Full-featured online store with product management, cart, payment integration, and admin dashboard. Built for performance and scalability.',
    gradient: 'from-violet-900/60 via-purple-900/40 to-[#0F1525]',
    tags: ['React','Node.js','MongoDB','Stripe','JWT'],
    github: 'https://github.com/Tibeb93/Ecommerce', demo: 'https://ecommerce-frontend-xi-eight.vercel.app/',
  },
  {
    id: 2, title: 'Task Management App',
    desc: 'Collaborative project management tool with real-time updates, drag-and-drop boards, team collaboration, and progress tracking.',
    gradient: 'from-pink-900/60 via-rose-900/40 to-[#0F1525]',
    tags: ['React','Socket.io','Express','PostgreSQL'],
    github: 'https://github.com', demo: 'https://example.com',
  },
  {
    id: 3, title: 'AI Content Generator',
    desc: 'AI-powered writing assistant that generates blog posts, social media content, and marketing copy using OpenAI API integration.',
    gradient: 'from-orange-900/60 via-amber-900/40 to-[#0F1525]',
    tags: ['React','Python','FastAPI','OpenAI','Redis'],
    github: 'https://github.com', demo: 'https://example.com',
  },
  {
    id: 4, title: 'Social Media Dashboard',
    desc: 'Analytics dashboard aggregating data from multiple social platforms with beautiful charts, insights, and scheduled posting.',
    gradient: 'from-cyan-900/60 via-teal-900/40 to-[#0F1525]',
    tags: ['React','Chart.js','Node.js','OAuth'],
    github: 'https://github.com', demo: 'https://example.com',
  },
  {
    id: 5, title: 'Real Estate Finder',
    desc: 'Property listing platform with advanced search filters, map integration, virtual tours, and mortgage calculator.',
    gradient: 'from-emerald-900/60 via-green-900/40 to-[#0F1525]',
    tags: ['React','Google Maps API','Node.js','MongoDB'],
    github: 'https://github.com', demo: 'https://example.com',
  },
  {
    id: 6, title: 'Learning Management System',
    desc: 'Educational platform with course creation, video streaming, quizzes, progress tracking, and certificate generation.',
    gradient: 'from-indigo-900/60 via-blue-900/40 to-[#0F1525]',
    tags: ['React','Node.js','AWS S3','MongoDB','Stripe'],
    github: 'https://github.com', demo: 'https://lms-platform-git-main-tibeb93s-projects.vercel.app/',
  },
]

const TAG_COLORS = {
  React:      'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  'Node.js':  'bg-green-500/10 text-green-400 border-green-500/20',
  MongoDB:    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Stripe:     'bg-violet-500/10 text-violet-400 border-violet-500/20',
  JWT:        'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  'Socket.io':'bg-pink-500/10 text-pink-400 border-pink-500/20',
  Express:    'bg-slate-500/10 text-slate-400 border-slate-500/20',
  PostgreSQL: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Python:     'bg-blue-500/10 text-blue-400 border-blue-500/20',
  FastAPI:    'bg-teal-500/10 text-teal-400 border-teal-500/20',
  OpenAI:     'bg-orange-500/10 text-orange-400 border-orange-500/20',
  Redis:      'bg-red-500/10 text-red-400 border-red-500/20',
  'Chart.js': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  OAuth:      'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  'Google Maps API': 'bg-green-500/10 text-green-400 border-green-500/20',
  'AWS S3':   'bg-orange-500/10 text-orange-400 border-orange-500/20',
}
const tagCls = t => TAG_COLORS[t] || 'bg-slate-500/10 text-slate-400 border-slate-500/20'

function ProjectCard({ project, index }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.article variants={staggerItem}
      className="group rounded-2xl overflow-hidden border border-white/[0.06]
        hover:border-white/[0.12] hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)] transition-all duration-500"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -8 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>

      {/* Thumbnail */}
      <div className={`relative h-52 bg-gradient-to-br ${project.gradient} overflow-hidden`}>
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

        <AnimatePresence>
          {hovered && (
            <motion.div className="absolute inset-0 bg-[#0B0F19]/80 backdrop-blur-sm flex items-center justify-center gap-4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <a href={project.demo} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl
                  bg-gradient-to-r from-violet-600 to-pink-600 text-white text-sm font-semibold
                  hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] transition-all duration-200">
                <FaExternalLinkAlt size={12} /> Live Demo
              </a>
              <a href={project.github} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass border border-white/15
                  text-white text-sm font-semibold hover:bg-white/10 transition-all duration-200">
                <FaGithub size={14} /> GitHub
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Body */}
      <div className="p-5 bg-[#0F1525]/80">
        <h3 className="text-lg font-bold text-white mb-2">{project.title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-2">{project.desc}</p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tags.map(t => (
            <span key={t} className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${tagCls(t)}`}>{t}</span>
          ))}
        </div>
        <div className="flex items-center gap-3 pt-3 border-t border-white/5">
          <a href={project.demo} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors">
            <FaExternalLinkAlt size={11} /> Live Demo
          </a>
          <span className="text-white/10">|</span>
          <a href={project.github} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
            <FaGithub size={12} /> Source Code
          </a>
        </div>
      </div>
    </motion.article>
  )
}

export default function Projects() {
  return (
    <section id="projects" className="section-padding">
      <div className="container-custom">
        <SectionTitle label="My Work" title="Featured" highlight="Projects"
          description="A selection of projects that showcase my skills in building real-world, production-ready applications." />

        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewport}>
          {PROJECTS.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
        </motion.div>

        <motion.div className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport} transition={{ duration: 0.5, delay: 0.3 }}>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer"
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
