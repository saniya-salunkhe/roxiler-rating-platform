import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/services';

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
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

  // Handle signup
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      await authService.signup(form);

      // Signup successful → go to login
      navigate('/login');

    } catch (err) {
      const data = err.response?.data;

      if (data?.errors) {
        setError(
          data.errors
            .map((e) => `${e.field}: ${e.message}`)
            .join(', ')
        );
      } else {
        setError(
          data?.message || 'Signup failed'
        );
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* ==================================================
          BACKGROUND VIDEO
          ================================================== */}

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


      {/* ==================================================
          VIDEO OVERLAY
          ================================================== */}

      <div className="auth-video-overlay"></div>


      {/* ==================================================
          CENTER CONTENT
          ================================================== */}

      <div className="auth-content">

        {/* ==================================================
            SIGNUP CARD
            ================================================== */}

        <div className="auth-card">

          {/* Header */}

          <div className="auth-header">

            <h1>Roxiler Rating</h1>

            <p>
              Create your account
            </p>

          </div>


          {/* Error Message */}

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}


          {/* ==================================================
              SIGNUP FORM
              ================================================== */}

          <form onSubmit={handleSubmit}>

            {/* NAME */}

            <div className="form-group">

              <label htmlFor="name">
                Name
                <span className="hint">
                  {' '}(20–60 characters)
                </span>
              </label>

              <input
                id="name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                minLength={20}
                maxLength={60}
                required
              />

            </div>


            {/* EMAIL */}

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


            {/* ADDRESS */}

            <div className="form-group">

              <label htmlFor="address">
                Address
                <span className="hint">
                  {' '}(max 400 characters)
                </span>
              </label>

              <textarea
                id="address"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Enter your full address"
                maxLength={400}
                rows={2}
              />

            </div>


            {/* PASSWORD */}

            <div className="form-group">

              <label htmlFor="password">
                Password
                <span className="hint">
                  {' '}(8–16 chars, 1 uppercase + 1 special)
                </span>
              </label>

              <input
                id="password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Create a password"
                minLength={8}
                maxLength={16}
                required
              />

            </div>


            {/* SIGNUP BUTTON */}

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={loading}
            >
              {loading
                ? 'Creating account...'
                : 'Sign Up'}
            </button>

          </form>


          {/* ==================================================
              LOGIN LINK
              ================================================== */}

          <p className="auth-footer">

            Already have an account?{' '}

            <Link to="/login">
              Sign in
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}