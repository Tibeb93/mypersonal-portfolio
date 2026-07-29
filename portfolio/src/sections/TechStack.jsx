import { motion } from 'framer-motion'
import { FaReact, FaNodeJs, FaGitAlt, FaDocker, FaPython } from 'react-icons/fa'
import {
  SiJavascript, SiMongodb, SiPostgresql, SiTailwindcss,
  SiExpress, SiRedis, SiFirebase, SiLinux,
  SiTypescript, SiFigma, SiNextdotjs, SiGraphql,
  SiLaravel, SiPhp, SiMysql,
} from 'react-icons/si'
import SectionTitle from '../components/SectionTitle'
import Skeleton from '../components/Skeleton'
import { staggerContainer, staggerItem, viewport } from '../utils/animations'
import useSkills from '../hooks/useSkills'
import useProfile from '../hooks/useProfile'

// Icon registry — maps skill name to component
const ICON_REGISTRY = {
  'React':        { Icon: FaReact,       color: '#61DAFB' },
  'JavaScript':   { Icon: SiJavascript,  color: '#F7DF1E' },
  'TypeScript':   { Icon: SiTypescript,  color: '#3178C6' },
  'Tailwind CSS': { Icon: SiTailwindcss, color: '#38BDF8' },
  'Tailwind':     { Icon: SiTailwindcss, color: '#38BDF8' },
  'Next.js':      { Icon: SiNextdotjs,   color: '#FFFFFF' },
  'Node.js':      { Icon: FaNodeJs,      color: '#68A063' },
  'Express.js':   { Icon: SiExpress,     color: '#FFFFFF' },
  'Express':      { Icon: SiExpress,     color: '#FFFFFF' },
  'Python':       { Icon: FaPython,      color: '#3776AB' },
  'GraphQL':      { Icon: SiGraphql,     color: '#E10098' },
  'Laravel':      { Icon: SiLaravel,     color: '#FF2D20' },
  'PHP':          { Icon: SiPhp,         color: '#777BB4' },
  'MongoDB':      { Icon: SiMongodb,     color: '#47A248' },
  'PostgreSQL':   { Icon: SiPostgresql,  color: '#336791' },
  'MySQL':        { Icon: SiMysql,       color: '#4479A1' },
  'Redis':        { Icon: SiRedis,       color: '#DC382D' },
  'Firebase':     { Icon: SiFirebase,    color: '#FFCA28' },
  'Git':          { Icon: FaGitAlt,      color: '#F05032' },
  'Docker':       { Icon: FaDocker,      color: '#2496ED' },
  'Linux':        { Icon: SiLinux,       color: '#FCC624' },
  'Figma':        { Icon: SiFigma,       color: '#F24E1E' },
}

const CATEGORY_ORDER = ['frontend', 'backend', 'database', 'tools', 'devops', 'design', 'other']
const CATEGORY_LABELS = {
  frontend: 'Frontend',
  backend:  'Backend',
  database: 'Database & Cloud',
  tools:    'Tools & DevOps',
  devops:   'DevOps',
  design:   'Design',
  other:    'Other',
}

function TechItem({ skill }) {
  const registry = ICON_REGISTRY[skill.name] || null
  const Icon  = registry?.Icon  || null
  const color = skill.iconColor || registry?.color || '#8B5CF6'
  const pct   = skill.level ?? 80

  return (
    <motion.div
      variants={staggerItem}
      className="group relative flex flex-col items-center gap-3 p-4 rounded-2xl glass border border-white/[0.06]
        hover:border-white/[0.15] hover:bg-white/[0.04] transition-all duration-300 cursor-default"
      whileHover={{ y: -4, scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      aria-label={`${skill.name} – ${pct}%`}
    >
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
        style={{ background: `radial-gradient(circle, ${color}25, transparent 70%)` }} />

      <div className="relative z-10 transition-transform duration-300 group-hover:scale-110">
        {Icon ? (
          <Icon size={32} color={color} />
        ) : (
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
            style={{ background: `${color}20`, color }}>
            {skill.name[0]}
          </div>
        )}
      </div>

      <span className="relative z-10 text-xs font-semibold text-slate-400 group-hover:text-white transition-colors text-center leading-tight">
        {skill.name}
      </span>

      <div className="relative z-10 w-full h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}70, ${color})` }}
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  )
}

export default function TechStack() {
  const { grouped, isLoading } = useSkills()
  const { profile }            = useProfile()

  const yearsExp  = profile?.yearsExperience ?? 2
  const projCount = profile?.projectsCount   ?? 20
  const techCount = Object.values(grouped).flat().length || 15

  // Sort categories by preferred order
  const sortedCategories = CATEGORY_ORDER.filter((cat) => grouped[cat]?.length > 0)

  return (
    <section id="techstack" className="section-padding">
      <div className="container-custom">
        <SectionTitle label="My Arsenal" title="Tech" highlight="Stack"
          description="Technologies and tools I use to bring ideas to life — from pixel-perfect frontends to robust backend systems." />

        {isLoading ? (
          <div className="space-y-10">
            {[1, 2, 3, 4].map((g) => (
              <div key={g}>
                <div className="flex items-center gap-3 mb-5">
                  <Skeleton className="h-4 w-24" />
                  <div className="flex-1 h-px bg-white/5" />
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton.SkillItem key={i} />)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-10">
            {sortedCategories.map((cat, ci) => (
              <motion.div key={cat}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={viewport} transition={{ duration: 0.5, delay: ci * 0.1 }}>
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-sm font-semibold text-slate-500 uppercase tracking-widest">
                    {CATEGORY_LABELS[cat] || cat}
                  </span>
                  <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
                </div>
                <motion.div
                  className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3"
                  variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewport}>
                  {grouped[cat].map((skill) => <TechItem key={skill._id} skill={skill} />)}
                </motion.div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Stats row */}
        <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport} transition={{ duration: 0.6, delay: 0.2 }}>
          {[
            { val: `${techCount}+`, label: 'Technologies',  color: 'text-violet-400' },
            { val: `${projCount}+`, label: 'Projects Built', color: 'text-pink-400'   },
            { val: `${yearsExp}+`,  label: 'Years Exp.',     color: 'text-orange-400' },
            { val: '100%',          label: 'Dedication',     color: 'text-emerald-400'},
          ].map(({ val, label, color }) => (
            <div key={label} className="glass rounded-2xl p-5 text-center border border-white/[0.06]
              hover:border-white/[0.12] transition-all duration-300">
              <div className={`text-3xl font-black ${color} mb-1`}>{val}</div>
              <div className="text-slate-500 text-sm font-medium">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
