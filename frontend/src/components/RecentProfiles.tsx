import type { Profile } from '../types';
import './RecentProfiles.css';

interface RecentProfilesProps {
  profiles: Profile[];
}

export function RecentProfiles({ profiles }: RecentProfilesProps) {
  const recent = profiles.slice(0, 3);

  return (
    <div className="recent-profiles">
      <h2 className="recent-profiles__heading">Recent profiles</h2>
      {recent.length === 0 ? (
        <p className="recent-profiles__empty">No recent profiles</p>
      ) : (
        <ul className="recent-profiles__list">
          {recent.map((profile) => (
            <li key={profile.id} className="recent-profiles__item">
              <img
                className="recent-profiles__avatar"
                src={profile.avatarUrl || 'https://i.pravatar.cc/150'}
                alt=""
              />
              <div className="recent-profiles__details">
                <span className="recent-profiles__name">{profile.fullName}</span>
                <span className="recent-profiles__email">{profile.email}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
