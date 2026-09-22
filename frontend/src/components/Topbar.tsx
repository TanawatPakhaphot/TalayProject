import type { ChangeEvent } from 'react';
import { Bell, Plus, Search, Settings } from 'lucide-react';
import './Topbar.css';

interface TopbarProps {
  query: string;
  onQueryChange: (query: string) => void;
  onAddProfile: () => void;
  onOpenNotifications: () => void;
  onOpenSettings: () => void;
}

function Topbar({ query, onQueryChange, onAddProfile, onOpenNotifications, onOpenSettings }: TopbarProps) {
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    onQueryChange(event.target.value);
  };

  return (
    <header className="topbar">
      <div className="topbar-row topbar-breadcrumb-row">
        <nav className="topbar-breadcrumb" aria-label="Breadcrumb">
          <span className="topbar-breadcrumb-muted">People</span>
          <span className="topbar-breadcrumb-separator" aria-hidden="true">
            /
          </span>
          <span className="topbar-breadcrumb-current">Profiles</span>
        </nav>
      </div>

      <div className="topbar-row topbar-search-row">
        <div className="topbar-search">
          <Search className="topbar-search-icon" size={18} aria-hidden="true" />
          <label className="topbar-visually-hidden" htmlFor="topbar-search-input">
            Search profiles
          </label>
          <input
            id="topbar-search-input"
            type="text"
            className="topbar-search-input"
            placeholder="Search profiles"
            aria-label="Search profiles"
            value={query}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="topbar-row topbar-actions-row">
        <button
          type="button"
          className="topbar-icon-button"
          title="Notifications"
          aria-label="Notifications"
          onClick={onOpenNotifications}
        >
          <Bell size={18} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="topbar-icon-button"
          title="Settings"
          aria-label="Settings"
          onClick={onOpenSettings}
        >
          <Settings size={18} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="topbar-add-button"
          onClick={onAddProfile}
        >
          <Plus size={18} aria-hidden="true" />
          <span>Add profile</span>
        </button>
      </div>
    </header>
  );
}

export default Topbar;
