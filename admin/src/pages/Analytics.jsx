import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie } from 'recharts'
import { HiEye, HiCursorClick, HiChartBar, HiMail, HiGlobe, HiDesktopComputer, HiDeviceMobile, HiExternalLink } from 'react-icons/hi'
import PageHeader from '../components/PageHeader.jsx'
import StatCard from '../components/StatCard.jsx'
import { analyticsAPI } from '../api/endpoints.js'

const TT = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#141B2D] border border-white/10 rounded-xl px-4 py-3 text-sm">
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map(p=><p key={p.name} style={{color:p.color}} className="font-semibold">{p.name}: {p.value}</p>)}
    </div>
  )
}

const COLORS = ['#8B5CF6','#EC4899','#F97316','#06B6D4','#10B981','#F59E0B','#EF4444','#6366F1']

function MiniBar({ data, label }) {
  if (!data || data.length === 0) return <p className="text-slate-600 text-xs">No data</p>
  const total = data.reduce((s, d) => s + d.count, 0)
  return (
    <div className="space-y-1.5">
      {data.slice(0, 6).map((d, i) => (
        <div key={d.name} className="flex items-center gap-2">
          <span className="text-xs text-slate-400 w-20 truncate flex-shrink-0" title={d.name}>{d.name}</span>
          <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${(d.count / total) * 100}%`, background: COLORS[i % COLORS.length] }} />
          </div>
          <span className="text-xs text-slate-500 w-8 text-right flex-shrink-0">{d.count}</span>
        </div>
      ))}
    </div>
  )
}

export default function Analytics() {
  const [days, setDays] = useState(30)

  const { data: overview  } = useQuery({ queryKey:['analytics-overview'],    queryFn: analyticsAPI.overview, staleTime: 60000 })
  const { data: visitors  } = useQuery({ queryKey:['analytics-visitors',days], queryFn:()=>analyticsAPI.visitors(days), staleTime: 120000 })
  const { data: topPages  } = useQuery({ queryKey:['analytics-top-pages'],   queryFn: analyticsAPI.topPages, staleTime: 120000 })
  const { data: projects  } = useQuery({ queryKey:['analytics-projects'],    queryFn: analyticsAPI.projectStats, staleTime: 120000 })
  const { data: contact   } = useQuery({ queryKey:['contact-activity',days], queryFn:()=>analyticsAPI.contactActivity(days), staleTime: 120000 })
  const { data: summary   } = useQuery({ queryKey:['analytics-visitor-summary',days], queryFn:()=>analyticsAPI.visitorSummary(days), staleTime: 120000 })
  const { data: recentVis } = useQuery({ queryKey:['analytics-recent-visitors'], queryFn:()=>analyticsAPI.recentVisitors(50), staleTime: 60000 })

  const stats      = overview?.data || {}
  const visitorData = visitors?.data?.stats || []
  const pagesData  = topPages?.data?.pages || []
  const projData   = projects?.data?.projects || []
  const contactData= contact?.data?.activity || []
  const visSummary = summary?.data || {}
  const visitorLogs = recentVis?.data?.visitors || []

  return (
    <div>
      <PageHeader title="Analytics" description="Portfolio performance metrics and visitor insights."
        action={
          <select value={days} onChange={e=>setDays(+e.target.value)} className="input text-sm py-2 w-36">
            <option value={7}>Last 7 days</option>
            <option value={14}>Last 14 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        }/>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Page Views"   value={stats.totalViews}    icon={HiEye}      color="violet"/>
        <StatCard label="Unique Visitors"    value={visSummary.uniqueVisitors || 0} icon={HiGlobe} color="cyan"/>
        <StatCard label="Blog Posts"         value={stats.totalBlogs}    icon={HiChartBar} color="pink"/>
        <StatCard label="Total Messages"     value={stats.totalMessages} icon={HiMail}     color="orange"/>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Visitors chart */}
        <div className="card p-5">
          <h3 className="text-sm font-bold text-white mb-4">Page Views — Last {days} Days</h3>
          {visitorData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={visitorData}>
                <defs><linearGradient id="vg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/><stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
                <XAxis dataKey="date" tick={{fill:'#64748b',fontSize:10}} tickLine={false} axisLine={false} tickFormatter={v=>v.slice(5)}/>
                <YAxis tick={{fill:'#64748b',fontSize:10}} tickLine={false} axisLine={false}/>
                <Tooltip content={<TT/>}/>
                <Area type="monotone" dataKey="visits" name="Visits" stroke="#8B5CF6" strokeWidth={2} fill="url(#vg)"/>
              </AreaChart>
            </ResponsiveContainer>
          ) : <div className="h-[220px] flex items-center justify-center text-slate-600 text-sm">No visitor data yet.</div>}
        </div>

        {/* Contact activity */}
        <div className="card p-5">
          <h3 className="text-sm font-bold text-white mb-4">Contact Activity — Last {days} Days</h3>
          {contactData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={contactData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
                <XAxis dataKey="date" tick={{fill:'#64748b',fontSize:10}} tickLine={false} axisLine={false} tickFormatter={v=>v.slice(5)}/>
                <YAxis tick={{fill:'#64748b',fontSize:10}} tickLine={false} axisLine={false}/>
                <Tooltip content={<TT/>}/>
                <Bar dataKey="count" name="Messages" fill="#EC4899" radius={[4,4,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="h-[220px] flex items-center justify-center text-slate-600 text-sm">No contact data yet.</div>}
        </div>
      </div>

      {/* Visitor breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="card p-5">
          <h3 className="text-sm font-bold text-white mb-4">Browsers</h3>
          <MiniBar data={visSummary.browsers} />
        </div>
        <div className="card p-5">
          <h3 className="text-sm font-bold text-white mb-4">Operating Systems</h3>
          <MiniBar data={visSummary.operatingSystems} />
        </div>
        <div className="card p-5">
          <h3 className="text-sm font-bold text-white mb-4">Devices</h3>
          <MiniBar data={visSummary.devices} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top pages */}
        <div className="card p-5">
          <h3 className="text-sm font-bold text-white mb-4">Top Pages</h3>
          <div className="space-y-3">
            {pagesData.length > 0 ? pagesData.map((p,i)=>(
              <div key={p.page} className="flex items-center gap-3">
                <span className="text-xs text-slate-500 w-5">{i+1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{p.page}</p>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mt-1">
                    <div className="h-full rounded-full" style={{width:`${(p.views/(pagesData[0]?.views||1))*100}%`,background:COLORS[i%COLORS.length]}}/>
                  </div>
                </div>
                <span className="text-xs text-slate-400 flex-shrink-0">{p.views}</span>
              </div>
            )) : <p className="text-slate-600 text-sm">No page view data yet.</p>}
          </div>
        </div>

        {/* Top referrers */}
        <div className="card p-5">
          <h3 className="text-sm font-bold text-white mb-4">Top Referrers</h3>
          <div className="space-y-3">
            {visSummary.topReferrers && visSummary.topReferrers.length > 0 ? visSummary.topReferrers.map((r,i)=>(
              <div key={r.domain} className="flex items-center gap-3">
                <span className="text-xs text-slate-500 w-5">{i+1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <HiExternalLink size={11} className="text-emerald-400 flex-shrink-0" />
                    <p className="text-sm text-white truncate">{r.domain}</p>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mt-1">
                    <div className="h-full rounded-full" style={{width:`${(r.count/(visSummary.topReferrers[0]?.count||1))*100}%`,background:COLORS[i%COLORS.length]}}/>
                  </div>
                </div>
                <span className="text-xs text-slate-400 flex-shrink-0">{r.count}</span>
              </div>
            )) : <p className="text-slate-600 text-sm">No referrer data yet.</p>}
          </div>
        </div>
      </div>

      {/* Recent visitor logs */}
      <div className="card p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white">Recent Visitor Logs</h3>
          <span className="text-xs text-slate-500">Last {visitorLogs.length} visits</span>
        </div>
        {visitorLogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-500 border-b border-white/5">
                  <th className="pb-2 font-medium">IP Address</th>
                  <th className="pb-2 font-medium">Page</th>
                  <th className="pb-2 font-medium">Browser</th>
                  <th className="pb-2 font-medium">OS</th>
                  <th className="pb-2 font-medium">Device</th>
                  <th className="pb-2 font-medium">Referrer</th>
                  <th className="pb-2 font-medium text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {visitorLogs.map((v) => (
                  <tr key={v._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-2.5">
                      <span className="text-xs text-slate-300 font-mono">{v.ip}</span>
                    </td>
                    <td className="py-2.5">
                      <span className="text-xs text-white font-medium">/{v.page}</span>
                    </td>
                    <td className="py-2.5">
                      <span className="text-xs text-slate-300">{v.browser}{v.browserVersion ? ` ${v.browserVersion}` : ''}</span>
                    </td>
                    <td className="py-2.5">
                      <span className="text-xs text-slate-400">{v.os}</span>
                    </td>
                    <td className="py-2.5">
                      <span className={`text-xs px-1.5 py-0.5 rounded ${v.device === 'Mobile' ? 'bg-orange-500/10 text-orange-400' : 'bg-cyan-500/10 text-cyan-400'}`}>
                        {v.device}
                      </span>
                    </td>
                    <td className="py-2.5">
                      {v.referrer ? (
                        <span className="text-xs text-emerald-400 truncate max-w-[120px] block" title={v.referrer}>{v.referrer}</span>
                      ) : (
                        <span className="text-xs text-slate-600">Direct</span>
                      )}
                    </td>
                    <td className="py-2.5 text-right">
                      <span className="text-xs text-slate-500">{new Date(v.timestamp).toLocaleString()}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-600 text-sm">No visitor logs yet.</div>
        )}
      </div>
    </div>
  )
}
