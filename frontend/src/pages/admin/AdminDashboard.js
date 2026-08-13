import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/services';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService
      .getDashboard()
      .then((res) => {
        setStats(res.data);
      })
      .catch((error) => {
        console.error('Failed to load dashboard:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="page">
      {/* Page Header */}
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Platform overview and management</p>
      </div>

      {/* Statistics */}
      <div className="stats-grid">
        {/* Total Users */}
        <div className="stat-card stat-blue">
          <div className="stat-icon">👥</div>

          <div className="stat-value">
            {loading ? '…' : stats.totalUsers}
          </div>

          <div className="stat-label">
            Total Users
          </div>
        </div>

        {/* Total Stores */}
        <div className="stat-card stat-green">
          <div className="stat-icon">🏪</div>

          <div className="stat-value">
            {loading ? '…' : stats.totalStores}
          </div>

          <div className="stat-label">
            Total Stores
          </div>
        </div>

        {/* Total Ratings */}
        <div className="stat-card stat-purple">
          <div className="stat-icon">⭐</div>

          <div className="stat-value">
            {loading ? '…' : stats.totalRatings}
          </div>

          <div className="stat-label">
            Total Ratings
          </div>
        </div>
      </div>

      {/* Admin Actions */}
      <div className="action-grid">
        {/* Manage Users */}
        <Link
          to="/admin/users"
          className="action-card"
        >
          <span className="action-icon">👥</span>

          <span className="action-label">
            Manage Users
          </span>
        </Link>

        {/* Manage Stores */}
        <Link
          to="/admin/stores"
          className="action-card"
        >
          <span className="action-icon">🏪</span>

          <span className="action-label">
            Manage Stores
          </span>
        </Link>

        {/* Add User */}
        <Link
          to="/admin/users/add"
          className="action-card"
        >
          <span className="action-icon">➕</span>

          <span className="action-label">
            Add User
          </span>
        </Link>

        {/* Add Store */}
        <Link
          to="/admin/stores/add"
          className="action-card"
        >
          <span className="action-icon">🏪➕</span>

          <span className="action-label">
            Add Store
          </span>
        </Link>
      </div>
    </div>
  );
}