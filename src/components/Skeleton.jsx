/* ===================================================
   Skeleton — animated placeholder loaders
=================================================== */
export function SkeletonBar({ width = '100%', height = '1rem', className = '' }) {
  return (
    <div
      className={`skeleton-bar ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  )
}

export function SkeletonCard({ className = '' }) {
  return (
    <div className={`skeleton-card ${className}`} aria-hidden="true">
      <div className="skeleton-card__image" />
      <div className="skeleton-card__content">
        <SkeletonBar width="70%" />
        <SkeletonBar width="100%" />
        <SkeletonBar width="60%" />
      </div>
    </div>
  )
}

export function SkeletonOrderRow() {
  return (
    <div className="skeleton-row" aria-hidden="true">
      <div className="skeleton-row__col" style={{ width: '15%' }}>
        <SkeletonBar />
      </div>
      <div className="skeleton-row__col" style={{ width: '20%' }}>
        <SkeletonBar />
      </div>
      <div className="skeleton-row__col" style={{ width: '20%' }}>
        <SkeletonBar />
      </div>
      <div className="skeleton-row__col" style={{ width: '15%' }}>
        <SkeletonBar />
      </div>
      <div className="skeleton-row__col" style={{ width: '20%' }}>
        <SkeletonBar />
      </div>
    </div>
  )
}

export function SkeletonOrderCard() {
  return (
    <div className="skeleton-order-card" aria-hidden="true">
      <div className="skeleton-order-card__header">
        <SkeletonBar width="20%" height="1.5rem" />
        <SkeletonBar width="30%" height="1.5rem" />
      </div>
      <SkeletonBar width="100%" height="1rem" />
      <SkeletonBar width="90%" height="1rem" />
    </div>
  )
}

export function SkeletonProfile() {
  return (
    <div className="skeleton-profile" aria-hidden="true">
      <div className="skeleton-profile__avatar" />
      <SkeletonBar width="50%" height="1.5rem" />
      <SkeletonBar width="80%" height="1rem" />
    </div>
  )
}
