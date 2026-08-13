import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/services';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getDashboard()
      .then((res) => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Platform overview and management</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card stat-blue">
          <div className="stat-icon">👥</div>
          <div className="stat-value">{loading ? '…' : stats.totalUsers}</div>
          <div className="stat-label">Total Users</div>
        </div>
        <div className="stat-card stat-green">
          <div className="stat-icon">🏪</div>
          <div className="stat-value">{loading ? '…' : stats.totalStores}</div>
          <div className="stat-label">Total Stores</div>
        </div>
        <div className="stat-card stat-purple">
          <div className="stat-icon">⭐</div>
          <div className="stat-value">{loading ? '…' : stats.totalRatings}</div>
          <div className="stat-label">Total Ratings</div>
        </div>
      </div>

      <div className="action-grid">
        <Link to="/admin/users" className="action-card">
          <span className="action-icon">👥</span>
          <span className="action-label">Manage Users</span>
        </Link>
        <Link to="/admin/stores" className="action-card">
          <span className="action-icon">🏪</span>
          <span className="action-label">Manage Stores</span>
        </Link>
        <Link to="/admin/users/add" className="action-card">
          <span className="action-icon">➕</span>
          <span className="action-label">Add User</span>
        </Link>
        <Link to="/admin/stores/add" className="action-card">
          <span className="action-icon">🏪➕</span>
          <span className="action-label">Add Store</span>
        </Link>
      </div>
    </div>
  );
}
