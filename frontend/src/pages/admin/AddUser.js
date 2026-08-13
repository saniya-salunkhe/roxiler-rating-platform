import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services/services';

export default function AddUser() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '', role: 'user' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await adminService.createUser(form);
      navigate('/admin/users');
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) setError(data.errors.map((e) => `${e.field}: ${e.message}`).join(', '));
      else setError(data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Add User</h1>
      </div>

      <div className="form-card">
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name <span className="hint">(20–60 characters)</span></label>
            <input type="text" name="name" value={form.name} onChange={handleChange}
              placeholder="Full name (min 20 characters)" minLength="20" maxLength="60" required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange}
              placeholder="you@example.com" required />
          </div>
          <div className="form-group">
            <label>Address <span className="hint">(max 400 characters)</span></label>
            <textarea name="address" value={form.address} onChange={handleChange}
              placeholder="Full address" maxLength="400" rows="2" />
          </div>
          <div className="form-group">
            <label>Password <span className="hint">(8–16 chars, 1 uppercase + 1 special)</span></label>
            <input type="password" name="password" value={form.password} onChange={handleChange}
              placeholder="Password" minLength="8" maxLength="16" required />
          </div>
          <div className="form-group">
            <label>Role</label>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="user">Normal User</option>
              <option value="admin">System Administrator</option>
              <option value="store_owner">Store Owner</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => navigate('/admin/users')}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating…' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
