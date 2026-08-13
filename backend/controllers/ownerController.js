const pool = require('../config/db');

/**
 * GET /api/owner/dashboard
 * Store owner dashboard — shows users who rated their store(s) and average rating.
 */
async function getDashboard(req, res) {
  try {
    const ownerId = req.user.id;

    // Fetch all stores owned by this owner, with aggregated rating data
    const [stores] = await pool.query(
      `SELECT s.id, s.name, s.email, s.address,
              ROUND(AVG(r.rating), 2) AS avg_rating,
              COUNT(r.id) AS total_ratings
       FROM stores s
       LEFT JOIN ratings r ON r.store_id = s.id
       WHERE s.owner_id = ?
       GROUP BY s.id`,
      [ownerId],
    );

    // Fetch all users who have rated any of this owner's stores
    const [raters] = await pool.query(
      `SELECT u.id, u.name, u.email, u.address,
              r.rating, r.updated_at, s.name AS store_name
       FROM ratings r
       JOIN users u ON r.user_id = u.id
       JOIN stores s ON r.store_id = s.id
       WHERE s.owner_id = ?
       ORDER BY r.updated_at DESC`,
      [ownerId],
    );

    return res.json({ stores, raters });
  } catch (err) {
    console.error('Owner dashboard error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { getDashboard };
