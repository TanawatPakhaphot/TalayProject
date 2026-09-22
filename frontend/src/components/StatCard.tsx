import type { LucideIcon } from 'lucide-react';
import './StatCard.css';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  tone?: 'accent' | 'info' | 'warning';
}

export function StatCard({ label, value, icon: Icon, tone = 'accent' }: StatCardProps) {
  return (
    <div className={`stat-card stat-card--${tone}`}>
      <div className="stat-card__badge">
        <Icon size={20} aria-hidden="true" />
      </div>
      <div className="stat-card__text">
        <span className="stat-card__value">{value}</span>
        <span className="stat-card__label">{label}</span>
      </div>
    </div>
  );
}
