import type { KeyboardEvent, MouseEvent } from 'react';
import { Pencil, Phone, Trash2 } from 'lucide-react';
import type { Profile } from '../types';
import './ProfileCard.css';

interface ProfileCardProps {
  profile: Profile;
  selected?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ProfileCard({
  profile,
  selected = false,
  disabled = false,
  onSelect,
  onEdit,
  onDelete,
}: ProfileCardProps) {
  const selectable = Boolean(onSelect) && !disabled;

  const handleSelect = () => {
    if (selectable) {
      onSelect?.();
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!selectable) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect?.();
    }
  };

  // Stop button clicks from also triggering the row's onSelect handler.
  const stopAndRun = (handler: () => void) => (event: MouseEvent) => {
    event.stopPropagation();
    handler();
  };

  const rowProps = onSelect
    ? {
        role: 'button' as const,
        tabIndex: disabled ? -1 : 0,
        'aria-pressed': selected,
        'aria-disabled': disabled,
        onClick: handleSelect,
        onKeyDown: handleKeyDown,
      }
    : {};

  const classNames = [
    'profile-card',
    onSelect ? 'profile-card--selectable' : '',
    selected ? 'profile-card--selected' : '',
    disabled ? 'profile-card--disabled' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classNames} {...rowProps}>
      <img
        className="profile-card__avatar"
        src={profile.avatarUrl || 'https://i.pravatar.cc/150'}
        alt={`${profile.fullName} avatar`}
      />
      <div className="profile-card__body">
        <div className="profile-card__header">
          <h2 className="profile-card__name">{profile.fullName}</h2>
          <p className="profile-card__email">{profile.email}</p>
          {profile.phoneNumber && (
            <p className="profile-card__phone">
              <Phone size={14} aria-hidden="true" />
              <span>{profile.phoneNumber}</span>
            </p>
          )}
        </div>
        {profile.bio && <p className="profile-card__bio">{profile.bio}</p>}
      </div>
      <div className="profile-card__actions">
        <button
          type="button"
          className="profile-card__icon-button"
          aria-label={`Edit ${profile.fullName}`}
          title="Edit profile"
          disabled={disabled}
          onClick={stopAndRun(onEdit)}
        >
          <Pencil size={16} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="profile-card__icon-button profile-card__icon-button--danger"
          aria-label={`Delete ${profile.fullName}`}
          title="Delete profile"
          disabled={disabled}
          onClick={stopAndRun(onDelete)}
        >
          <Trash2 size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

