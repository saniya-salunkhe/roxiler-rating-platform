const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

/**
 * POST /api/auth/signup
 * Public registration — always creates a "user" role account.
 */
async function signup(req, res) {
  const { name, email, password, address } = req.body;

  try {
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existing.length) {
      return res.status(409).json({
        message: 'Email already registered',
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users
       (name, email, password, address, role)
       VALUES (?, ?, ?, ?, ?)`,
      [
        name,
        email,
        hashed,
        address || null,
        'user',
      ]
    );

    return res.status(201).json({
      message: 'Account created successfully. Please log in.',
    });
  } catch (err) {
    console.error('Signup error:', err);

    return res.status(500).json({
      message: 'Server error during registration',
    });
  }
}

/**
 * POST /api/auth/login
 * Single login for all roles.
 * Returns a JWT containing { id, role, email, name }.
 */
async function login(req, res) {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (!rows.length) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    const user = rows[0];

    const match = await bcrypt.compare(
      password,
      user.password
    );

    if (!match) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        email: user.email,
        name: user.name,
      },
      process.env.JWT_SECRET,
      {
        expiresIn:
          process.env.JWT_EXPIRES_IN || '24h',
      }
    );

    return res.json({
      message: 'Login successful',
      token,

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Login error:', err);

    return res.status(500).json({
      message: 'Server error during login',
    });
  }
}

/**
 * GET /api/auth/me
 * Returns the profile of the currently authenticated user.
 */
async function getProfile(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT
         id,
         name,
         email,
         address,
         role,
         created_at
       FROM users
       WHERE id = ?`,
      [req.user.id]
    );

    if (!rows.length) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    return res.json({
      user: rows[0],
    });
  } catch (err) {
    console.error('Profile error:', err);

    return res.status(500).json({
      message: 'Server error',
    });
  }
}

/**
 * PUT /api/auth/password
 * Change password for the logged-in user.
 */
async function changePassword(req, res) {
  const {
    currentPassword,
    newPassword,
  } = req.body;

  try {
    const [rows] = await pool.query(
      'SELECT password FROM users WHERE id = ?',
      [req.user.id]
    );

    if (!rows.length) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    const match = await bcrypt.compare(
      currentPassword,
      rows[0].password
    );

    if (!match) {
      return res.status(400).json({
        message: 'Current password is incorrect',
      });
    }

    const hashed = await bcrypt.hash(
      newPassword,
      10
    );

    await pool.query(
      'UPDATE users SET password = ? WHERE id = ?',
      [
        hashed,
        req.user.id,
      ]
    );

    return res.json({
      message: 'Password updated successfully',
    });
  } catch (err) {
    console.error(
      'Change password error:',
      err
    );

    return res.status(500).json({
      message: 'Server error',
    });
  }
}

module.exports = {
  signup,
  login,
  getProfile,
  changePassword,
};
