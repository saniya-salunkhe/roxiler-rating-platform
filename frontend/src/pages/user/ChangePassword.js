import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/services';

export default function ChangePassword() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.newPassword !== form.confirmPassword) {
      setError('New password and confirmation do not match');
      return;
    }

    setLoading(true);
    try {
      await authService.changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setSuccess('Password updated successfully');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) setError(data.errors.map((e) => `${e.field}: ${e.message}`).join(', '));
      else setError(data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Change Password</h1>
      </div>

      <div className="form-card">
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Current Password</label>
            <input type="password" name="currentPassword" value={form.currentPassword}
              onChange={handleChange} placeholder="Enter current password" required />
          </div>
          <div className="form-group">
            <label>New Password <span className="hint">(8–16 chars, 1 uppercase + 1 special)</span></label>
            <input type="password" name="newPassword" value={form.newPassword}
              onChange={handleChange} placeholder="Enter new password" minLength="8" maxLength="16" required />
          </div>
          <div className="form-group">
            <label>Confirm New Password</label>
            <input type="password" name="confirmPassword" value={form.confirmPassword}
              onChange={handleChange} placeholder="Re-enter new password" required />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-outline"
              onClick={() => navigate(user?.role === 'admin' ? '/admin/dashboard' : user?.role === 'store_owner' ? '/owner/dashboard' : '/stores')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Updating…' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
