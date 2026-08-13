import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linksByRole = {
    admin: [
      { to: '/admin/dashboard', label: 'Dashboard' },
      { to: '/admin/users', label: 'Users' },
      { to: '/admin/stores', label: 'Stores' },
    ],
    user: [{ to: '/stores', label: 'Stores' }],
    store_owner: [{ to: '/owner/dashboard', label: 'Dashboard' }],
  };

  const links = linksByRole[user?.role] || [];
  const roleLabel = { admin: 'Administrator', user: 'User', store_owner: 'Store Owner' }[user?.role] || '';

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/"> Roxiler Rating</Link>
      </div>
      <div className="navbar-links">
        {links.map((link) => (
          <Link key={link.to} to={link.to}>{link.label}</Link>
        ))}
        <Link to="/change-password">Change Password</Link>
      </div>
      <div className="navbar-right">
        <span className="navbar-user">
          {user?.name} <span className="badge badge-role">{roleLabel}</span>
        </span>
        <button onClick={handleLogout} className="btn btn-outline btn-sm">Logout</button>
      </div>
    </nav>
  );
}
