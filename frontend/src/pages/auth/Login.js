import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Handle login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(form.email, form.password);

      // Redirect according to role
      switch (user.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;

        case 'store_owner':
          navigate('/owner/dashboard');
          break;

        default:
          navigate('/stores');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Login failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* ================= BACKGROUND VIDEO ================= */}
      <video
        className="auth-background-video"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      >
        <source
          src="/videos/roxiler-systems.mp4"
          type="video/mp4"
        />

        Your browser does not support the video tag.
      </video>

      {/* ================= DARK VIDEO OVERLAY ================= */}
      <div className="auth-video-overlay"></div>

      {/* ================= CENTER CONTENT ================= */}
      <div className="auth-content">

        {/* ================= LOGIN CARD ================= */}
        <div className="auth-card">

          {/* Header */}
          <div className="auth-header">
            <h1>Roxiler Rating</h1>
            <p>Sign in to your account</p>
          </div>

          {/* Error */}
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

          </form>

          {/* Signup Link */}
          <p className="auth-footer">
            Don't have an account?{' '}
            <Link to="/signup">
              Sign up
            </Link>
          </p>

          {/* Demo Credentials */}
          <div className="demo-credentials">
            <p className="demo-label">
              Demo credentials
            </p>

            <p>
              <strong>Email:</strong> admin@roxiler.com
            </p>

            <p>
              <strong>Password:</strong> Admin@1234
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}