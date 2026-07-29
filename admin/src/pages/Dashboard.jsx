import { useQuery } from '@tanstack/react-query'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar,
} from 'recharts'
import {
  HiViewGrid, HiDocumentText, HiMail, HiEye,
  HiLightningBolt, HiBriefcase, HiChartBar,
} from 'react-icons/hi'
import StatCard from '../components/StatCard.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { analyticsAPI, contactAPI } from '../api/endpoints.js'
import useAuthStore from '../stores/authStore.js'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#141B2D] border border-white/10 rounded-xl px-4 py-3 text-sm">
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-semibold">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuthStore()

  const { data: overview, isLoading: loadingOverview } = useQuery({
    queryKey: ['analytics-overview'],
    queryFn:  analyticsAPI.overview,
    staleTime: 2 * 60 * 1000,
  })

  const { data: visitors } = useQuery({
    queryKey: ['analytics-visitors', 30],
    queryFn:  () => analyticsAPI.visitors(30),
    staleTime: 5 * 60 * 1000,
  })

  const { data: contactActivity } = useQuery({
    queryKey: ['contact-activity', 30],
    queryFn:  () => analyticsAPI.contactActivity(30),
    staleTime: 5 * 60 * 1000,
  })

  const { data: projectStats } = useQuery({
    queryKey: ['analytics-projects'],
    queryFn:  analyticsAPI.projectStats,
    staleTime: 5 * 60 * 1000,
  })

  const stats = overview?.data || {}
  const visitorData = visitors?.data?.stats || []
  const contactData = contactActivity?.data?.activity || []
  const topProjects = projectStats?.data?.projects || []

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div>
      <PageHeader
        title={`${greeting}, ${user?.name?.split(' ')[0] || 'Admin'} 👋`}
        description="Here's what's happening with your portfolio today."
      />

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Projects"  value={stats.totalProjects}  icon={HiViewGrid}      color="violet"  loading={loadingOverview} />
        <StatCard label="Blog Posts"      value={stats.totalBlogs}     icon={HiDocumentText}  color="pink"    loading={loadingOverview} />
        <StatCard label="Messages"        value={stats.totalMessages}  icon={HiMail}          color="orange"  loading={loadingOverview} />
        <StatCard label="Page Views"      value={stats.totalViews}     icon={HiEye}           color="cyan"    loading={loadingOverview} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Unread Messages" value={stats.unreadMessages} icon={HiMail}          color="blue"    loading={loadingOverview} />
        <StatCard label="Skills"          value={stats.totalSkills}    icon={HiLightningBolt} color="emerald" loading={loadingOverview} />
        <StatCard label="Experience"      value={stats.totalExperiences} icon={HiBriefcase}  color="violet"  loading={loadingOverview} />
        <StatCard label="Visitor Days"    value={visitorData.length ? `${visitorData.length}d` : '—'} icon={HiChartBar} color="pink" loading={loadingOverview} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

        {/* Visitor stats */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-white mb-1">Page Views — Last 30 Days</h3>
          <p className="text-xs text-slate-500 mb-5">Daily visitor traffic to your portfolio</p>
          {visitorData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={visitorData}>
                <defs>
                  <linearGradient id="visitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#8B5CF6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false}
                  tickFormatter={(v) => v.slice(5)} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="visits" name="Visits"
                  stroke="#8B5CF6" strokeWidth={2} fill="url(#visitGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-slate-600 text-sm">
              No data yet — visitors will appear here once your portfolio is live.
            </div>
          )}
        </div>

        {/* Contact activity */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-white mb-1">Contact Activity — Last 30 Days</h3>
          <p className="text-xs text-slate-500 mb-5">Messages received per day</p>
          {contactData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={contactData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false}
                  tickFormatter={(v) => v.slice(5)} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Messages" fill="#EC4899" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-slate-600 text-sm">
              No messages yet.
            </div>
          )}
        </div>
      </div>

      {/* Top projects */}
      {topProjects.length > 0 && (
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Most Viewed Projects</h3>
          <div className="space-y-3">
            {topProjects.map((p) => (
              <div key={p._id} className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{p.title}</p>
                  {p.featured && <span className="badge-violet text-xs">Featured</span>}
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full"
                      style={{ width: `${Math.min(100, (p.views / (topProjects[0]?.views || 1)) * 100)}%` }} />
                  </div>
                  <span className="text-xs text-slate-400 w-10 text-right">{p.views}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
