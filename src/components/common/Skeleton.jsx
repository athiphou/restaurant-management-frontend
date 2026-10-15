import { classNames } from '../../utils/formatters'

/*
  Skeleton — shimmer placeholders (spec §34 "Loading: skeleton shimmer").
  Compose simple blocks/skeletons; FoodCardGrid exposes a card skeleton grid.
*/
export function Skeleton({ className }) {
  return <div className={classNames('skeleton rounded-lg', className)} />
}

export function SkeletonText({ lines = 3, className }) {
  return (
    <div className={classNames('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={classNames('h-3.5', i === lines - 1 && 'w-2/3')} />
      ))}
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="space-y-2 p-4">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  )
}

export function SkeletonGrid({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
