/**
 * Reusable skeleton loader shapes.
 * Usage: <Skeleton className="h-6 w-32 rounded-xl" />
 *        <Skeleton.Card />   — pre-built project card skeleton
 *        <Skeleton.Text lines={3} />
 */

export default function Skeleton({ className = '' }) {
  return (
    <div className={`animate-pulse bg-white/[0.05] rounded-xl ${className}`} />
  )
}

Skeleton.Text = function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse bg-white/[0.05] rounded-lg h-4"
          style={{ width: i === lines - 1 ? '65%' : '100%' }}
        />
      ))}
    </div>
  )
}

Skeleton.Card = function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden border border-white/[0.06] animate-pulse">
      <div className="h-52 bg-white/[0.05]" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-white/[0.05] rounded-lg w-3/4" />
        <div className="h-4 bg-white/[0.05] rounded-lg w-full" />
        <div className="h-4 bg-white/[0.05] rounded-lg w-5/6" />
        <div className="flex gap-2 pt-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-6 w-16 bg-white/[0.05] rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  )
}

Skeleton.SkillItem = function SkeletonSkillItem() {
  return (
    <div className="flex flex-col items-center gap-3 p-4 rounded-2xl border border-white/[0.06] animate-pulse">
      <div className="w-8 h-8 bg-white/[0.05] rounded-xl" />
      <div className="h-3 w-14 bg-white/[0.05] rounded" />
      <div className="w-full h-1 bg-white/[0.05] rounded-full" />
    </div>
  )
}

Skeleton.Timeline = function SkeletonTimeline() {
  return (
    <div className="flex gap-4 animate-pulse">
      <div className="w-10 h-10 flex-shrink-0 bg-white/[0.05] rounded-xl" />
      <div className="flex-1 space-y-2 pb-2">
        <div className="h-3 w-16 bg-white/[0.05] rounded" />
        <div className="h-5 w-48 bg-white/[0.05] rounded-lg" />
        <div className="h-3 w-32 bg-white/[0.05] rounded" />
        <div className="h-4 bg-white/[0.05] rounded w-full" />
        <div className="h-4 bg-white/[0.05] rounded w-5/6" />
      </div>
    </div>
  )
}
