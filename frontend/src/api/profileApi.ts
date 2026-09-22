import type { Profile, ProfileFormValues } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }
  if (response.status === 204) {
    return undefined as T;
  }
  return response.json() as Promise<T>;
}

// Backend rejects empty strings for [Phone]/[Url] fields but accepts null.
function normalizeForApi(values: ProfileFormValues): ProfileFormValues {
  return {
    ...values,
    phoneNumber: values.phoneNumber?.trim() ? values.phoneNumber.trim() : null,
    avatarUrl: values.avatarUrl?.trim() ? values.avatarUrl.trim() : null,
  };
}

export const profileApi = {
  getAll: (): Promise<Profile[]> =>
    fetch(`${API_BASE_URL}/profiles`).then((res) => handleResponse<Profile[]>(res)),

  getById: (id: string): Promise<Profile> =>
    fetch(`${API_BASE_URL}/profiles/${id}`).then((res) => handleResponse<Profile>(res)),

  create: (values: ProfileFormValues): Promise<Profile> =>
    fetch(`${API_BASE_URL}/profiles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalizeForApi(values)),
    }).then((res) => handleResponse<Profile>(res)),

  update: (id: string, values: ProfileFormValues): Promise<void> =>
    fetch(`${API_BASE_URL}/profiles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalizeForApi(values)),
    }).then((res) => handleResponse<void>(res)),

  remove: (id: string): Promise<void> =>
    fetch(`${API_BASE_URL}/profiles/${id}`, { method: 'DELETE' }).then((res) =>
      handleResponse<void>(res),
    ),
};
