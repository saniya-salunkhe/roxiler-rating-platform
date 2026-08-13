const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const { buildWhereClause, buildOrderBy } = require('../utils/queryHelpers');

/**
 * GET /api/admin/dashboard
 * Returns counts: total users, total stores, total ratings.
 */
async function getDashboard(req, res) {
  try {
    const [[{ totalUsers }]] = await pool.query('SELECT COUNT(*) AS totalUsers FROM users');
    const [[{ totalStores }]] = await pool.query('SELECT COUNT(*) AS totalStores FROM stores');
    const [[{ totalRatings }]] = await pool.query('SELECT COUNT(*) AS totalRatings FROM ratings');

    return res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    console.error('Dashboard error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

/**
 * GET /api/admin/users
 * List users with filtering (name, email, address, role) and sorting.
 */
async function listUsers(req, res) {
  try {
    const { name, email, address, role, sort = 'id', order = 'asc' } = req.query;

    const { clause, params } = buildWhereClause(
      { name, email, address, role },
      ['name', 'email', 'address'],
      ['role'],
    );
    const orderBy = buildOrderBy('users', sort, order);

    const [rows] = await pool.query(
      `SELECT id, name, email, address, role, created_at FROM users ${clause} ${orderBy}`,
      params,
    );

    return res.json({ users: rows });
  } catch (err) {
    console.error('List users error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

/**
 * GET /api/admin/users/:id
 * User detail — if the user is a store_owner, also returns their store's avg rating.
 */
async function getUserDetail(req, res) {
  try {
    const { id } = req.params;

    const [users] = await pool.query(
      'SELECT id, name, email, address, role, created_at FROM users WHERE id = ?',
      [id],
    );
    if (!users.length) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = users[0];
    let storeRating = null;

    if (user.role === 'store_owner') {
      const [[row]] = await pool.query(
        `SELECT s.id AS store_id, s.name AS store_name,
                ROUND(AVG(r.rating), 2) AS avg_rating, COUNT(r.id) AS total_ratings
         FROM stores s
         LEFT JOIN ratings r ON r.store_id = s.id
         WHERE s.owner_id = ?
         GROUP BY s.id`,
        [id],
      );
      storeRating = row || null;
    }

    return res.json({ user, storeRating });
  } catch (err) {
    console.error('User detail error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

/**
 * POST /api/admin/users
 * Admin creates a user (any role). Hashes the password before storing.
 */
async function createUser(req, res) {
  const { name, email, password, address, role } = req.body;

  try {
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashed, address || null, role || 'user'],
    );

    return res.status(201).json({
      message: 'User created successfully',
      user: { id: result.insertId, name, email, address, role: role || 'user' },
    });
  } catch (err) {
    console.error('Create user error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

/**
 * GET /api/admin/stores
 * List stores with filtering (name, email, address) and sorting,
 * including their overall average rating.
 */
async function listStores(req, res) {
  try {
    const { name, email, address, sort = 'id', order = 'asc' } = req.query;

    const { clause, params } = buildWhereClause(
      { 's.name': name, 's.email': email, 's.address': address },
      ['s.name', 's.email', 's.address'],
    );

    // Sort mapping: allow "rating" to sort by the computed avg_rating column
    const sortColMap = {
      name: 's.name',
      email: 's.email',
      address: 's.address',
      rating: 'avg_rating',
      id: 's.id',
      created_at: 's.created_at',
    };
    const direction = String(order).toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    const sortCol = sortColMap[sort] || 's.id';
    const orderBy = `ORDER BY ${sortCol} ${direction}`;

    const [rows] = await pool.query(
      `SELECT s.id, s.name, s.email, s.address,
              ROUND(AVG(r.rating), 2) AS avg_rating,
              COUNT(r.id) AS total_ratings
       FROM stores s
       LEFT JOIN ratings r ON r.store_id = s.id
       ${clause}
       GROUP BY s.id
       ${orderBy}`,
      params,
    );

    return res.json({ stores: rows });
  } catch (err) {
    console.error('List stores error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

/**
 * POST /api/admin/stores
 * Admin creates a store. owner_id optionally links the store to a store_owner.
 */
async function createStore(req, res) {
  const { name, email, address, owner_id } = req.body;

  try {
    const [result] = await pool.query(
      'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
      [name, email, address || null, owner_id || null],
    );

    return res.status(201).json({
      message: 'Store created successfully',
      store: { id: result.insertId, name, email, address, owner_id: owner_id || null },
    });
  } catch (err) {
    console.error('Create store error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  getDashboard,
  listUsers,
  getUserDetail,
  createUser,
  listStores,
  createStore,
};
