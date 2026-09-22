import './LoadingSkeleton.css';

interface SkeletonProps {
  count?: number;
}

export function ProfileListSkeleton({ count = 4 }: SkeletonProps) {
  return (
    <div className="skeleton-list" aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <div className="skeleton-row skeleton-row--profile" key={index}>
          <div className="skeleton skeleton--avatar" />
          <div className="skeleton-row__lines">
            <div className="skeleton skeleton--line skeleton--line-wide" />
            <div className="skeleton skeleton--line skeleton--line-narrow" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ActivityPanelSkeleton({ count = 3 }: SkeletonProps) {
  return (
    <div className="skeleton-list" aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <div className="skeleton-row skeleton-row--activity" key={index}>
          <div className="skeleton skeleton--avatar skeleton--avatar-sm" />
          <div className="skeleton-row__lines">
            <div className="skeleton skeleton--line skeleton--line-wide" />
          </div>
        </div>
      ))}
    </div>
  );
}
