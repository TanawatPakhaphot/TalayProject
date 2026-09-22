import { useCallback, useEffect, useMemo, useState } from 'react';
import { FileText, Phone as PhoneIcon, Plus, Users } from 'lucide-react';
import { profileApi } from './api/profileApi';
import { ProfileCard } from './components/ProfileCard';
import { ProfileForm } from './components/ProfileForm';
import { Sidebar, type SidebarView } from './components/Sidebar';
import Topbar from './components/Topbar';
import { ConfirmDialog } from './components/ConfirmDialog';
import { Toast } from './components/Toast';
import { ErrorBanner } from './components/ErrorBanner';
import { ProfileListSkeleton, ActivityPanelSkeleton } from './components/LoadingSkeleton';
import { StatCard } from './components/StatCard';
import { RecentProfiles } from './components/RecentProfiles';
import { ComingSoon } from './components/ComingSoon';
import type { Profile, ProfileFormValues } from './types';
import './App.css';

const emptyFormValues: ProfileFormValues = {
  fullName: '',
  email: '',
  phoneNumber: '',
  bio: '',
  avatarUrl: '',
};

const viewLabels: Record<SidebarView, string> = {
  dashboard: 'Dashboard',
  profiles: 'Profiles',
  messages: 'Messages',
  statistics: 'Statistics',
  schedule: 'Schedule',
};

interface ToastState {
  id: number;
  message: string;
  type: 'success' | 'error';
}

function toFormValues(profile: Profile): ProfileFormValues {
  const { id: _id, ...rest } = profile;
  return rest;
}

function matchesQuery(profile: Profile, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    profile.fullName.toLowerCase().includes(q) ||
    profile.email.toLowerCase().includes(q) ||
    (profile.phoneNumber ?? '').toLowerCase().includes(q)
  );
}

function App() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | 'new' | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Profile | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [view, setView] = useState<SidebarView>('profiles');

  const showToast = useCallback((message: string, type: ToastState['type'] = 'success') => {
    setToast((prev) => ({ id: (prev?.id ?? 0) + 1, message, type }));
  }, []);

  const loadProfiles = useCallback(() => {
    setLoading(true);
    setError(null);
    return profileApi
      .getAll()
      .then(setProfiles)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  const handleSave = async (values: ProfileFormValues) => {
    setSubmitting(true);
    setError(null);
    try {
      if (editingId === 'new') {
        const created = await profileApi.create(values);
        setProfiles((prev) => [...prev, created]);
        showToast('Profile created.');
      } else if (editingId) {
        await profileApi.update(editingId, values);
        setProfiles((prev) =>
          prev.map((p) => (p.id === editingId ? { ...values, id: editingId } : p)),
        );
        showToast('Profile updated.');
      }
      setEditingId(null);
    } catch (err) {
      setError((err as Error).message);
      showToast('Could not save profile.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleteBusy(true);
    try {
      await profileApi.remove(deleteTarget.id);
      setProfiles((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      showToast('Profile deleted.');
      setDeleteTarget(null);
    } catch (err) {
      setError((err as Error).message);
      showToast('Could not delete profile.', 'error');
    } finally {
      setDeleteBusy(false);
    }
  };

  const editingProfile = profiles.find((p) => p.id === editingId);
  const filteredProfiles = useMemo(
    () => profiles.filter((p) => matchesQuery(p, query)),
    [profiles, query],
  );
  const recentProfiles = useMemo(() => [...profiles].slice(-3).reverse(), [profiles]);

  const totalCount = profiles.length;
  const withPhoneCount = profiles.filter((p) => Boolean(p.phoneNumber?.trim())).length;
  const withBioCount = profiles.filter((p) => Boolean(p.bio?.trim())).length;

  const isEditing = editingId !== null;

  return (
    <div className="app-shell">
      <Sidebar activeView={view} onNavigate={setView} />
      <div className="app-shell__content">
        {view === 'profiles' ? (
          <Topbar
            query={query}
            onQueryChange={setQuery}
            onAddProfile={() => setEditingId('new')}
            onOpenNotifications={() => showToast('No new notifications yet.')}
            onOpenSettings={() => showToast('Settings are coming soon.')}
          />
        ) : (
          <header className="app-shell__header">
            <nav className="topbar-breadcrumb" aria-label="Breadcrumb">
              <span className="topbar-breadcrumb-muted">People</span>
              <span className="topbar-breadcrumb-separator" aria-hidden="true">
                /
              </span>
              <span className="topbar-breadcrumb-current">{viewLabels[view]}</span>
            </nav>
          </header>
        )}

        {view !== 'profiles' ? (
          <ComingSoon title={viewLabels[view]} />
        ) : (
          <>
            {error && !loading && <ErrorBanner message={error} onRetry={loadProfiles} />}

            <div className="app-shell__body">
              <section className="app-shell__main">
                {!isEditing && (
                  <div className="workspace-heading">
                    <h1>Profiles</h1>
                    <span className="workspace-heading__count">{totalCount} users</span>
                  </div>
                )}

                {loading ? (
                  <ProfileListSkeleton />
                ) : isEditing ? (
                  <ProfileForm
                    mode={editingId === 'new' ? 'add' : 'edit'}
                    initialValues={editingId === 'new' ? emptyFormValues : editingProfile ? toFormValues(editingProfile) : emptyFormValues}
                    onSubmit={handleSave}
                    onCancel={() => setEditingId(null)}
                    submitting={submitting}
                  />
                ) : filteredProfiles.length === 0 ? (
                  <div className="empty-state">
                    <p>{profiles.length === 0 ? 'No profiles yet' : 'No profiles match your search'}</p>
                    {profiles.length === 0 && (
                      <button type="button" className="empty-state__action" onClick={() => setEditingId('new')}>
                        <Plus size={16} aria-hidden="true" />
                        <span>Add profile</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="profile-list">
                    {filteredProfiles.map((profile) => (
                      <ProfileCard
                        key={profile.id}
                        profile={profile}
                        onEdit={() => setEditingId(profile.id)}
                        onDelete={() => setDeleteTarget(profile)}
                      />
                    ))}
                  </div>
                )}
              </section>

              <aside className="app-shell__activity">
                {loading ? <ActivityPanelSkeleton /> : <RecentProfiles profiles={recentProfiles} />}
              </aside>
            </div>

            <div className="app-shell__summary">
              <StatCard label="Total profiles" value={totalCount} icon={Users} tone="accent" />
              <StatCard label="Profiles with phone" value={withPhoneCount} icon={PhoneIcon} tone="info" />
              <StatCard label="Profiles with bio" value={withBioCount} icon={FileText} tone="warning" />
            </div>
          </>
        )}
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete profile"
        description={
          deleteTarget ? `Delete ${deleteTarget.fullName}? This cannot be undone.` : ''
        }
        confirmLabel="Delete profile"
        busy={deleteBusy}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {toast && (
        <Toast key={toast.id} message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />
      )}
    </div>
  );
}

export default App;
