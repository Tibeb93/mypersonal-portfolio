/**
 * Skeleton loader shapes with shimmer animation.
 *
 * Usage:
 *   <Skeleton className="h-6 w-32 rounded-xl" />
 *   <Skeleton.Text lines={3} />
 *   <Skeleton.Card />
 *   <Skeleton.SkillItem />
 *   <Skeleton.Timeline />
 */

const base = 'skeleton-shimmer rounded-xl'

export default function Skeleton({ className = '' }) {
  return <div className={`${base} ${className}`} aria-hidden="true" />
}

Skeleton.Text = function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-2.5 ${className}`} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`${base} h-4`}
          style={{ width: i === lines - 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  )
}

Skeleton.Card = function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden border border-white/[0.06]" aria-hidden="true">
      <div className={`${base} h-52 rounded-none`} />
      <div className="p-5 space-y-3">
        <div className={`${base} h-5 w-3/4`} />
        <div className={`${base} h-4 w-full`} />
        <div className={`${base} h-4 w-5/6`} />
        <div className="flex gap-2 pt-1">
          {[1, 2, 3].map(i => (
            <div key={i} className={`${base} h-6 w-16`} />
          ))}
        </div>
      </div>
    </div>
  )
}

Skeleton.SkillItem = function SkeletonSkillItem() {
  return (
    <div
      className="flex flex-col items-center gap-3 p-4 rounded-2xl border border-white/[0.06]"
      aria-hidden="true"
    >
      <div className={`${base} w-8 h-8`} />
      <div className={`${base} h-3 w-14`} />
      <div className={`${base} w-full h-1 rounded-full`} />
    </div>
  )
}

Skeleton.Timeline = function SkeletonTimeline() {
  return (
    <div className="flex gap-4" aria-hidden="true">
      <div className={`${base} w-10 h-10 flex-shrink-0`} />
      <div className="flex-1 space-y-2.5 pb-2">
        <div className={`${base} h-3 w-14`} />
        <div className={`${base} h-5 w-52`} />
        <div className={`${base} h-3 w-36`} />
        <div className={`${base} h-4 w-full`} />
        <div className={`${base} h-4 w-4/5`} />
      </div>
    </div>
  )
}
