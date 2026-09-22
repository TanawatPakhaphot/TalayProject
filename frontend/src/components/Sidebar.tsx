import {
  BarChart2,
  Calendar,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Users,
  Waves,
  type LucideIcon,
} from 'lucide-react';
import './Sidebar.css';

export type SidebarView = 'dashboard' | 'profiles' | 'messages' | 'statistics' | 'schedule';

interface SidebarProps {
  activeView: SidebarView;
  onNavigate: (view: SidebarView) => void;
}

const navItems: { id: SidebarView; label: string; icon: LucideIcon }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'profiles', label: 'Profiles', icon: Users },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'statistics', label: 'Statistics', icon: BarChart2 },
  { id: 'schedule', label: 'Schedule', icon: Calendar },
];

// Layout collapse (full -> icon rail -> bottom nav) is driven entirely by
// Sidebar.css media queries matching App.css's 1024px/768px breakpoints.
export function Sidebar({ activeView, onNavigate }: SidebarProps) {
  return (
    <aside className="app-shell__sidebar sidebar">
      <div className="sidebar__brand">
        <Waves size={20} className="sidebar__brand-icon" aria-hidden="true" />
        <span className="sidebar__brand-text">Talay</span>
      </div>

      <nav className="sidebar__nav app-shell__bottom-nav" aria-label="Primary">
        {navItems.map(({ id, label, icon: Icon }) => {
          const active = activeView === id;
          return (
            <button
              key={id}
              type="button"
              title={label}
              className={`sidebar__nav-item${active ? ' sidebar__nav-item--active' : ''}`}
              aria-current={active ? 'page' : undefined}
              onClick={() => onNavigate(id)}
            >
              <Icon size={18} aria-hidden="true" />
              <span className="sidebar__nav-label">{label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar__footer">
        <button type="button" title="Help" className="sidebar__nav-item" disabled aria-disabled="true">
          <HelpCircle size={18} aria-hidden="true" />
          <span className="sidebar__nav-label">Help</span>
        </button>
        <button
          type="button"
          title="Sign out"
          className="sidebar__nav-item"
          disabled
          aria-disabled="true"
        >
          <LogOut size={18} aria-hidden="true" />
          <span className="sidebar__nav-label">Sign out</span>
        </button>
      </div>
    </aside>
  );
}
