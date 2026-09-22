export interface Profile {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
}

export type ProfileFormValues = Omit<Profile, 'id'>;
