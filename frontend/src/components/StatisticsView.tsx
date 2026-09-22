import { FileText, Image, Phone as PhoneIcon, Users } from 'lucide-react';
import { StatCard } from './StatCard';
import type { Profile } from '../types';
import './StatisticsView.css';

interface StatisticsViewProps {
  profiles: Profile[];
}

interface Breakdown {
  label: string;
  count: number;
  total: number;
}

function BreakdownBar({ label, count, total }: Breakdown) {
  const percent = total === 0 ? 0 : Math.round((count / total) * 100);
  return (
    <div className="statistics-view__bar-row">
      <div className="statistics-view__bar-labels">
        <span>{label}</span>
        <span className="statistics-view__bar-value">
          {count}/{total} ({percent}%)
        </span>
      </div>
      <div className="statistics-view__bar-track">
        <div className="statistics-view__bar-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

export function StatisticsView({ profiles }: StatisticsViewProps) {
  const total = profiles.length;
  const withPhone = profiles.filter((p) => Boolean(p.phoneNumber?.trim())).length;
  const withBio = profiles.filter((p) => Boolean(p.bio?.trim())).length;
  const withAvatar = profiles.filter((p) => Boolean(p.avatarUrl?.trim())).length;

  return (
    <div className="statistics-view">
      <div className="app-shell__summary">
        <StatCard label="Total profiles" value={total} icon={Users} tone="accent" />
        <StatCard label="With phone number" value={withPhone} icon={PhoneIcon} tone="info" />
        <StatCard label="With bio" value={withBio} icon={FileText} tone="warning" />
      </div>

      <div className="statistics-view__panel">
        <h2 className="statistics-view__heading">Profile completeness</h2>
        {total === 0 ? (
          <p className="statistics-view__empty">Add profiles to see completeness statistics.</p>
        ) : (
          <div className="statistics-view__bars">
            <BreakdownBar label="Phone number" count={withPhone} total={total} />
            <BreakdownBar label="Bio" count={withBio} total={total} />
            <BreakdownBar label="Avatar" count={withAvatar} total={total} />
          </div>
        )}
      </div>

      <div className="statistics-view__panel">
        <h2 className="statistics-view__heading">
          <Image size={16} aria-hidden="true" />
          <span>Avatar coverage</span>
        </h2>
        <p className="statistics-view__description">
          {withAvatar} of {total} profiles have a custom avatar image.
        </p>
      </div>
    </div>
  );
}
