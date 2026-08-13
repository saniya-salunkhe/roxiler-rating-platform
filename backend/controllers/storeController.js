const pool = require('../config/db');
const { buildWhereClause, buildOrderBy } = require('../utils/queryHelpers');

/**
 * GET /api/stores
 * Public (authenticated) — list all stores with search (name, address),
 * overall rating, and the logged-in user's submitted rating.
 */
async function listStores(req, res) {
  try {
    const { name, address, sort = 'id', order = 'asc' } = req.query;
    const userId = req.user.id;

    const { clause, params } = buildWhereClause(
      { 's.name': name, 's.address': address },
      ['s.name', 's.address'],
    );

    const sortColMap = {
      name: 's.name',
      address: 's.address',
      rating: 'avg_rating',
      id: 's.id',
    };
    const direction = String(order).toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    const sortCol = sortColMap[sort] || 's.id';
    const orderBy = `ORDER BY ${sortCol} ${direction}`;

    const [rows] = await pool.query(
      `SELECT s.id, s.name, s.email, s.address,
              ROUND(AVG(r.rating), 2) AS avg_rating,
              COUNT(r.id) AS total_ratings,
              (SELECT rating FROM ratings WHERE store_id = s.id AND user_id = ? LIMIT 1) AS my_rating
       FROM stores s
       LEFT JOIN ratings r ON r.store_id = s.id
       ${clause}
       GROUP BY s.id
       ${orderBy}`,
      [userId, ...params],
    );

    return res.json({ stores: rows });
  } catch (err) {
    console.error('List stores error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

/**
 * GET /api/stores/:id
 */
async function getStore(req, res) {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      `SELECT s.id, s.name, s.email, s.address,
              ROUND(AVG(r.rating), 2) AS avg_rating,
              COUNT(r.id) AS total_ratings
       FROM stores s
       LEFT JOIN ratings r ON r.store_id = s.id
       WHERE s.id = ?
       GROUP BY s.id`,
      [id],
    );
    if (!rows.length) {
      return res.status(404).json({ message: 'Store not found' });
    }
    return res.json({ store: rows[0] });
  } catch (err) {
    console.error('Get store error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

/**
 * POST /api/stores/:id/rate
 * Submit or update the logged-in user's rating for a store.
 * Uses INSERT ... ON DUPLICATE KEY UPDATE so a user can only have one rating
 * per store (enforced by the unique constraint on (store_id, user_id)).
 */
async function submitRating(req, res) {
  const storeId = req.params.id;
  const { rating } = req.body;
  const userId = req.user.id;

  try {
    // Verify store exists
    const [stores] = await pool.query('SELECT id FROM stores WHERE id = ?', [storeId]);
    if (!stores.length) {
      return res.status(404).json({ message: 'Store not found' });
    }

    await pool.query(
      `INSERT INTO ratings (store_id, user_id, rating)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE rating = VALUES(rating), updated_at = CURRENT_TIMESTAMP`,
      [storeId, userId, rating],
    );

    return res.json({ message: 'Rating submitted successfully' });
  } catch (err) {
    console.error('Submit rating error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { listStores, getStore, submitRating };
