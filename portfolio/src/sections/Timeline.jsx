import { motion } from 'framer-motion'
import { HiAcademicCap, HiCode, HiBriefcase, HiOfficeBuilding } from 'react-icons/hi'
import SectionTitle from '../components/SectionTitle'
import Skeleton from '../components/Skeleton'
import { viewport } from '../utils/animations'
import useExperience from '../hooks/useExperience'
import useEducation from '../hooks/useEducation'

const COLORS = ['violet', 'pink', 'orange', 'emerald', 'cyan', 'blue']
const C = {
  violet:  { dot: 'bg-violet-500',  ring: 'ring-violet-500/30',  icon: 'text-violet-400',  bg: 'bg-violet-500/15 border-violet-500/20',  tag: 'bg-violet-500/10 text-violet-400 border-violet-500/20' },
  pink:    { dot: 'bg-pink-500',    ring: 'ring-pink-500/30',    icon: 'text-pink-400',    bg: 'bg-pink-500/15 border-pink-500/20',      tag: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
  orange:  { dot: 'bg-orange-500',  ring: 'ring-orange-500/30',  icon: 'text-orange-400',  bg: 'bg-orange-500/15 border-orange-500/20',  tag: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  emerald: { dot: 'bg-emerald-500', ring: 'ring-emerald-500/30', icon: 'text-emerald-400', bg: 'bg-emerald-500/15 border-emerald-500/20',tag: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  cyan:    { dot: 'bg-cyan-500',    ring: 'ring-cyan-500/30',    icon: 'text-cyan-400',    bg: 'bg-cyan-500/15 border-cyan-500/20',      tag: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
  blue:    { dot: 'bg-blue-500',    ring: 'ring-blue-500/30',    icon: 'text-blue-400',    bg: 'bg-blue-500/15 border-blue-500/20',      tag: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

function TimelineCard({ item, align = 'left', colorKey }) {
  const c = C[colorKey]
  return (
    <div className={`glass rounded-2xl border border-white/[0.06] p-5 max-w-sm w-full
      hover:border-white/[0.12] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all duration-300
      ${align === 'right' ? 'text-right' : 'text-left'}`}>

      <div className="flex items-center gap-2 mb-1" style={{ justifyContent: align === 'right' ? 'flex-end' : 'flex-start' }}>
        <span className={`text-xs font-bold tracking-widest uppercase ${c.icon} font-mono`}>
          {item.year}
        </span>
        {item.current && (
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
            Current
          </span>
        )}
      </div>

      <h3 className="text-base font-bold text-white mt-1 mb-0.5">{item.title}</h3>
      <p className="text-xs text-slate-500 font-medium mb-3">{item.sub}</p>
      <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">{item.desc}</p>

      {item.tags?.length > 0 && (
        <div className={`flex flex-wrap gap-1.5 ${align === 'right' ? 'justify-end' : 'justify-start'}`}>
          {item.tags.map((t) => (
            <span key={t} className={`px-2 py-0.5 rounded-md text-xs font-medium border ${c.tag}`}>{t}</span>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Timeline() {
  const { experiences, isLoading: loadingExp } = useExperience()
  const { educations,  isLoading: loadingEdu } = useEducation()
  const isLoading = loadingExp || loadingEdu

  // Merge and sort all items by date descending
  const items = [
    ...experiences.map((exp, i) => ({
      id:      exp._id,
      year:    new Date(exp.startDate).getFullYear().toString(),
      title:   exp.position,
      sub:     exp.company + (exp.location ? ` · ${exp.location}` : ''),
      desc:    exp.description || exp.responsibilities?.[0] || '',
      tags:    exp.technologies?.slice(0, 4) || [],
      current: exp.current,
      date:    new Date(exp.startDate),
      type:    'experience',
      Icon:    HiBriefcase,
      color:   COLORS[i % COLORS.length],
    })),
    ...educations.map((edu, i) => ({
      id:      edu._id,
      year:    new Date(edu.startDate).getFullYear().toString(),
      title:   edu.degree + ' in ' + edu.field,
      sub:     edu.university + (edu.location ? ` · ${edu.location}` : ''),
      desc:    edu.description || '',
      tags:    edu.achievements?.slice(0, 3) || [],
      current: edu.current,
      date:    new Date(edu.startDate),
      type:    'education',
      Icon:    HiAcademicCap,
      color:   COLORS[(experiences.length + i) % COLORS.length],
    })),
  ].sort((a, b) => b.date - a.date)

  // Fallback static items when API has no data yet
  const FALLBACK = [
    { id: '1', year: '2024', title: 'Advanced Full Stack Projects', sub: 'Self-Directed Learning', desc: 'Built multiple production-ready applications including e-commerce platforms and AI-integrated tools.', tags: ['React','Node.js','AWS','Docker'], Icon: HiCode, color: 'violet' },
    { id: '2', year: '2023', title: 'Full Stack Development Journey', sub: 'Intensive Learning Phase', desc: 'Mastered backend technologies including Express, MongoDB, and RESTful API design.', tags: ['Express','MongoDB','REST APIs','JWT'], Icon: HiOfficeBuilding, color: 'pink' },
    { id: '3', year: '2022', title: 'Computer Science Studies Begin', sub: 'University Enrollment', desc: 'Enrolled in Computer Science program. Started learning algorithms, data structures, and web development.', tags: ['C++','Python','Algorithms'], Icon: HiAcademicCap, color: 'orange' },
  ]

  const displayItems = items.length > 0 ? items : (isLoading ? [] : FALLBACK)

  return (
    <section id="timeline" className="section-padding">
      <div className="container-custom">
        <SectionTitle label="My Journey" title="Experience &" highlight="Education"
          description="The milestones and experiences that shaped me as a developer." />

        <div className="relative max-w-4xl mx-auto">
          {/* Center line */}
          <div className="hidden md:block absolute left-1/2 top-6 bottom-6 w-px
            bg-gradient-to-b from-violet-500/30 via-pink-500/20 to-transparent -translate-x-1/2" />

          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => <Skeleton.Timeline key={i} />)}
            </div>
          ) : (
            <div className="space-y-6 md:space-y-0">
              {displayItems.map((item, i) => {
                const c = C[item.color]
                const isLeft = i % 2 === 0
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={viewport} transition={{ duration: 0.6, delay: i * 0.08 }}
                  >
                    {/* Desktop alternating layout */}
                    <div className="hidden md:grid grid-cols-[1fr_auto_1fr] gap-6 items-start mb-8">
                      <div className="flex justify-end">
                        {isLeft && <TimelineCard item={item} align="right" colorKey={item.color} />}
                      </div>
                      <div className="flex flex-col items-center">
                        <div className={`w-12 h-12 rounded-2xl border ${c.bg} flex items-center justify-center
                          ring-4 ${c.ring} z-10 relative`}>
                          <item.Icon size={20} className={c.icon} />
                        </div>
                        {i < displayItems.length - 1 && (
                          <div className="w-px flex-1 min-h-[60px] bg-gradient-to-b from-white/10 to-transparent mt-2" />
                        )}
                      </div>
                      <div>
                        {!isLeft && <TimelineCard item={item} align="left" colorKey={item.color} />}
                      </div>
                    </div>

                    {/* Mobile single-column */}
                    <div className="flex md:hidden gap-4 mb-6">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-xl border ${c.bg} flex items-center justify-center
                          ring-2 ${c.ring} z-10 flex-shrink-0`}>
                          <item.Icon size={16} className={c.icon} />
                        </div>
                        {i < displayItems.length - 1 && (
                          <div className="w-px flex-1 min-h-[40px] bg-gradient-to-b from-white/10 to-transparent mt-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-2">
                        <TimelineCard item={item} align="left" colorKey={item.color} />
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
