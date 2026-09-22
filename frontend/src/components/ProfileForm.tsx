import { useState, type FormEvent, type FocusEvent } from 'react';
import { ImageOff, Loader2 } from 'lucide-react';
import type { ProfileFormValues } from '../types';
import './ProfileForm.css';

interface ProfileFormProps {
  mode: 'add' | 'edit';
  initialValues: ProfileFormValues;
  onSubmit: (values: ProfileFormValues) => Promise<void>;
  onCancel: () => void;
  submitting: boolean;
}

type FieldErrors = Partial<Record<keyof ProfileFormValues, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isWellFormedUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function validate(values: ProfileFormValues): FieldErrors {
  const errors: FieldErrors = {};

  const fullName = values.fullName.trim();
  if (!fullName) {
    errors.fullName = 'Full name is required.';
  } else if (fullName.length > 100) {
    errors.fullName = 'Full name must be 100 characters or fewer.';
  }

  const email = values.email.trim();
  if (!email) {
    errors.email = 'Email is required.';
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'Enter a valid email address.';
  }

  const avatarUrl = values.avatarUrl?.trim();
  if (avatarUrl && !isWellFormedUrl(avatarUrl)) {
    errors.avatarUrl = 'Enter a valid URL.';
  }

  const bio = values.bio ?? '';
  if (bio.length > 500) {
    errors.bio = 'Bio must be 500 characters or fewer.';
  }

  return errors;
}

export function ProfileForm({ mode, initialValues, onSubmit, onCancel, submitting }: ProfileFormProps) {
  const [values, setValues] = useState<ProfileFormValues>(initialValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [avatarLoadError, setAvatarLoadError] = useState(false);

  const handleChange =
    (field: keyof ProfileFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((prev) => ({ ...prev, [field]: e.target.value }));
      if (field === 'avatarUrl') {
        setAvatarLoadError(false);
      }
    };

  const handleBlur = (field: keyof ProfileFormValues) => (_e: FocusEvent) => {
    setErrors((prev) => ({ ...prev, [field]: validate(values)[field] }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }
    try {
      await onSubmit(values);
    } catch {
      // submission errors are surfaced by the caller
    }
  };

  const avatarUrl = values.avatarUrl?.trim() ?? '';
  const showAvatarPreview = avatarUrl.length > 0 && isWellFormedUrl(avatarUrl) && !avatarLoadError;

  return (
    <form className="profile-form" onSubmit={handleSubmit} noValidate>
      <h2 className="profile-form__header">{mode === 'add' ? 'Add profile' : 'Edit profile'}</h2>

      <div className="profile-form__grid">
        <div className="profile-form__field">
          <label className="profile-form__label" htmlFor="profile-form-fullName">
            Full name
          </label>
          <input
            id="profile-form-fullName"
            className="profile-form__input"
            type="text"
            value={values.fullName}
            onChange={handleChange('fullName')}
            onBlur={handleBlur('fullName')}
            maxLength={100}
            required
            disabled={submitting}
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={errors.fullName ? 'profile-form-fullName-error' : undefined}
          />
          {errors.fullName && (
            <span className="profile-form__error" id="profile-form-fullName-error">
              {errors.fullName}
            </span>
          )}
        </div>

        <div className="profile-form__field">
          <label className="profile-form__label" htmlFor="profile-form-email">
            Email
          </label>
          <input
            id="profile-form-email"
            className="profile-form__input"
            type="email"
            value={values.email}
            onChange={handleChange('email')}
            onBlur={handleBlur('email')}
            required
            disabled={submitting}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'profile-form-email-error' : undefined}
          />
          {errors.email && (
            <span className="profile-form__error" id="profile-form-email-error">
              {errors.email}
            </span>
          )}
        </div>

        <div className="profile-form__field">
          <label className="profile-form__label" htmlFor="profile-form-phoneNumber">
            Phone number
          </label>
          <input
            id="profile-form-phoneNumber"
            className="profile-form__input"
            type="tel"
            value={values.phoneNumber ?? ''}
            onChange={handleChange('phoneNumber')}
            onBlur={handleBlur('phoneNumber')}
            disabled={submitting}
            aria-invalid={Boolean(errors.phoneNumber)}
            aria-describedby={errors.phoneNumber ? 'profile-form-phoneNumber-error' : undefined}
          />
          {errors.phoneNumber && (
            <span className="profile-form__error" id="profile-form-phoneNumber-error">
              {errors.phoneNumber}
            </span>
          )}
        </div>

        <div className="profile-form__field">
          <label className="profile-form__label" htmlFor="profile-form-avatarUrl">
            Avatar URL
          </label>
          <div className="profile-form__avatar-row">
            <div className="profile-form__avatar-preview">
              {showAvatarPreview ? (
                <img src={avatarUrl} alt="" onError={() => setAvatarLoadError(true)} />
              ) : (
                <ImageOff size={20} aria-hidden="true" />
              )}
            </div>
            <input
              id="profile-form-avatarUrl"
              className="profile-form__input"
              type="url"
              value={values.avatarUrl ?? ''}
              onChange={handleChange('avatarUrl')}
              onBlur={handleBlur('avatarUrl')}
              disabled={submitting}
              aria-invalid={Boolean(errors.avatarUrl)}
              aria-describedby={errors.avatarUrl ? 'profile-form-avatarUrl-error' : undefined}
            />
          </div>
          {errors.avatarUrl && (
            <span className="profile-form__error" id="profile-form-avatarUrl-error">
              {errors.avatarUrl}
            </span>
          )}
        </div>

        <div className="profile-form__field profile-form__field--full">
          <label className="profile-form__label" htmlFor="profile-form-bio">
            Bio
          </label>
          <textarea
            id="profile-form-bio"
            className="profile-form__textarea"
            value={values.bio ?? ''}
            onChange={handleChange('bio')}
            onBlur={handleBlur('bio')}
            rows={4}
            maxLength={500}
            disabled={submitting}
            aria-invalid={Boolean(errors.bio)}
            aria-describedby={errors.bio ? 'profile-form-bio-error' : undefined}
          />
          {errors.bio && (
            <span className="profile-form__error" id="profile-form-bio-error">
              {errors.bio}
            </span>
          )}
        </div>
      </div>

      <div className="profile-form__actions">
        <button
          type="button"
          className="profile-form__button profile-form__button--secondary"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="profile-form__button profile-form__button--primary"
          disabled={submitting}
        >
          {submitting ? <Loader2 className="profile-form__spinner" size={18} aria-hidden="true" /> : 'Save'}
        </button>
      </div>
    </form>
  );
}
