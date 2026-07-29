import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { HiShieldCheck, HiUser, HiCollection, HiClock } from 'react-icons/hi'
import PageHeader from '../components/PageHeader.jsx'
import DataTable from '../components/DataTable.jsx'
import { auditAPI } from '../api/endpoints.js'

const ACTION_COLORS = { CREATE:'badge-emerald', UPDATE:'badge-violet', DELETE:'badge-red', LOGIN:'badge-orange', UPLOAD:'badge-slate' }

export default function AuditLog() {
  const [page, setPage] = useState(1)
  const [resource, setResource] = useState('')
  const [action, setAction]     = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['audit-log', page, resource, action],
    queryFn:  () => auditAPI.getAll({ page, limit:50, resource:resource||undefined, action:action||undefined }),
  })
  const logs       = data?.data   || []
  const pagination = data?.pagination || null

  const columns = [
    { key:'action',   label:'Action',   render:(v)=><span className={ACTION_COLORS[v]||'badge-slate'}>{v}</span> },
    { key:'resource', label:'Resource', render:(v)=><span className="text-slate-300 capitalize">{v}</span> },
    { key:'userName', label:'By',       render:(v,row)=>(
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-violet-500/20 flex items-center justify-center">
          <HiUser size={12} className="text-violet-400"/>
        </div>
        <span className="text-sm text-slate-300">{v || row.user?.name || 'System'}</span>
      </div>
    )},
    { key:'status', label:'Status', render:(v)=><span className={v==='success'?'badge-emerald':'badge-red'}>{v}</span> },
    { key:'ip',     label:'IP',     render:(v)=><span className="text-xs text-slate-500 font-mono">{v||'—'}</span> },
    { key:'createdAt', label:'Time', render:(v)=><span className="text-xs text-slate-500">{new Date(v).toLocaleString()}</span> },
  ]

  return (
    <div>
      <PageHeader title="Audit Log" description="All admin actions are recorded here for security."
        action={
          <div className="flex gap-3">
            <select value={resource} onChange={e=>setResource(e.target.value)} className="input text-sm py-2 w-36">
              <option value="">All resources</option>
              {['profile','skills','projects','experience','education','certificates','blog','contact','media','settings'].map(r=><option key={r} value={r}>{r}</option>)}
            </select>
            <select value={action} onChange={e=>setAction(e.target.value)} className="input text-sm py-2 w-32">
              <option value="">All actions</option>
              {['CREATE','UPDATE','DELETE','UPLOAD','LOGIN'].map(a=><option key={a} value={a}>{a}</option>)}
            </select>
          </div>
        }/>
      <DataTable columns={columns} data={logs} loading={isLoading} pagination={pagination} onPageChange={setPage}
        emptyMessage="No audit logs found."/>
    </div>
  )
}
