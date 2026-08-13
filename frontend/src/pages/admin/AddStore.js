import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services/services';

export default function AddStore() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', address: '', owner_id: '' });
  const [owners, setOwners] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    adminService.listUsers({ role: 'store_owner' })
      .then((res) => setOwners(res.data.users))
      .catch(console.error);
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = { ...form };
      if (!payload.owner_id) delete payload.owner_id;
      await adminService.createStore(payload);
      navigate('/admin/stores');
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) setError(data.errors.map((e) => `${e.field}: ${e.message}`).join(', '));
      else setError(data?.message || 'Failed to create store');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Add Store</h1>
      </div>

      <div className="form-card">
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name <span className="hint">(20–60 characters)</span></label>
            <input type="text" name="name" value={form.name} onChange={handleChange}
              placeholder="Store name (min 20 characters)" minLength="20" maxLength="60" required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange}
              placeholder="store@example.com" required />
          </div>
          <div className="form-group">
            <label>Address <span className="hint">(max 400 characters)</span></label>
            <textarea name="address" value={form.address} onChange={handleChange}
              placeholder="Store address" maxLength="400" rows="2" />
          </div>
          <div className="form-group">
            <label>Store Owner <span className="hint">(optional)</span></label>
            <select name="owner_id" value={form.owner_id} onChange={handleChange}>
              <option value="">— None —</option>
              {owners.map((o) => (
                <option key={o.id} value={o.id}>{o.name} ({o.email})</option>
              ))}
            </select>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => navigate('/admin/stores')}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating…' : 'Create Store'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
