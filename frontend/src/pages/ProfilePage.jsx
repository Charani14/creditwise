import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  ErrorText,
  Field,
  Loading,
  Notice,
  PageHeader,
  Panel,
} from '../components/ui';

const blankProfile = {
  name: '',
  phone: '',
  currentPassword: '',
  newPassword: '',
};

export function ProfilePage() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState(blankProfile);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState('');
  const { updateUser } = useAuth();

  useEffect(() => {
    api.get('/auth/me')
      .then((response) => {
        const account = response.data.user;
        setUser(account);
        setForm((currentForm) => ({
          ...currentForm,
          name: account.name || '',
          phone: account.phone || '',
        }));
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  function updateField(fieldName) {
    return (event) => {
      setForm({ ...form, [fieldName]: event.target.value });
    };
  }

  async function saveProfile(event) {
    event.preventDefault();
    setError(null);

    if (form.newPassword && (!form.currentPassword || form.newPassword.length < 6)) {
      setError({
        response: {
          data: {
            message: 'Enter your current password and a new password with at least 6 characters.',
          },
        },
      });
      return;
    }

    setBusy(true);
    try {
      const response = await api.put('/auth/profile', form);
      setUser(response.data.user);
      updateUser(response.data.user);
      setNotice('Profile saved.');
      setForm((currentForm) => ({
        ...currentForm,
        currentPassword: '',
        newPassword: '',
      }));
    } catch (requestError) {
      setError(requestError);
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <PageHeader
        title="My profile"
        description="Update your account details and password."
      />
      {notice && (
        <Notice kind="success" onDismiss={() => setNotice('')}>
          {notice}
        </Notice>
      )}
      <ErrorText error={error} />

      {user && (
        <Panel
          title="Account details"
          subtitle="Your profile is private to your account"
          className="profile-panel"
        >
          <form onSubmit={saveProfile}>
            <div className="form-row">
              <Field
                label="Full name"
                value={form.name}
                onChange={updateField('name')}
                minLength="2"
                maxLength="100"
                required
              />
              <Field label="Email address" type="email" value={user.email} disabled />
            </div>

            <Field
              label="Phone (optional)"
              type="tel"
              value={form.phone || ''}
              onChange={updateField('phone')}
              maxLength="20"
            />

            <div className="profile-divider">
              <div className="eyebrow">PASSWORD</div>
              <p>Leave password fields blank to keep your current password.</p>
            </div>

            <div className="form-row">
              <Field
                label="Current password"
                type="password"
                value={form.currentPassword}
                onChange={updateField('currentPassword')}
                autoComplete="current-password"
              />
              <Field
                label="New password"
                type="password"
                value={form.newPassword}
                onChange={updateField('newPassword')}
                minLength="6"
                autoComplete="new-password"
              />
            </div>

            <div className="form-actions">
              <button className="btn-primary-cw" disabled={busy}>
                {busy ? 'Saving…' : 'Save profile'}
              </button>
            </div>
          </form>
        </Panel>
      )}
    </div>
  );
}
