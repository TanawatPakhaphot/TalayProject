import { FileText, Phone as PhoneIcon, Users } from 'lucide-react';
import { StatCard } from './StatCard';
import { RecentProfiles } from './RecentProfiles';
import { ActivityPanelSkeleton } from './LoadingSkeleton';
import type { Profile } from '../types';
import './DashboardView.css';

interface DashboardViewProps {
  profiles: Profile[];
  loading: boolean;
}

export function DashboardView({ profiles, loading }: DashboardViewProps) {
  const totalCount = profiles.length;
  const withPhoneCount = profiles.filter((p) => Boolean(p.phoneNumber?.trim())).length;
  const withBioCount = profiles.filter((p) => Boolean(p.bio?.trim())).length;
  const recentProfiles = [...profiles].slice(-3).reverse();

  return (
    <div className="dashboard-view">
      <div className="app-shell__summary">
        <StatCard label="Total profiles" value={totalCount} icon={Users} tone="accent" />
        <StatCard label="Profiles with phone" value={withPhoneCount} icon={PhoneIcon} tone="info" />
        <StatCard label="Profiles with bio" value={withBioCount} icon={FileText} tone="warning" />
      </div>

      <div className="dashboard-view__activity">
        {loading ? <ActivityPanelSkeleton /> : <RecentProfiles profiles={recentProfiles} />}
      </div>
    </div>
  );
}
