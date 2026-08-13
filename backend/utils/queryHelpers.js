/**
 * Reusable helpers for building sortable / filterable SQL queries safely.
 * All user-supplied values go through parameterised placeholders — never string
 * concatenation — so SQL injection is not possible.
 */

const ALLOWED_SORT_FIELDS = {
  users: ['id', 'name', 'email', 'address', 'role', 'created_at'],
  stores: ['id', 'name', 'email', 'address', 'rating', 'created_at'],
  ratings: ['id', 'rating', 'created_at', 'updated_at'],
};

/**
 * Builds a WHERE clause + params array from filter key/value pairs.
 * Supports partial (LIKE) matching on string fields.
 */
function buildWhereClause(filters, likeFields, exactFields = []) {
  const conditions = [];
  const params = [];

  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === null || value === '') continue;

    if (likeFields.includes(key)) {
      conditions.push(`${key} LIKE ?`);
      params.push(`%${value}%`);
    } else if (exactFields.includes(key)) {
      conditions.push(`${key} = ?`);
      params.push(value);
    }
  }

  return {
    clause: conditions.length ? `WHERE ${conditions.join(' AND ')}` : '',
    params,
  };
}

/**
 * Safely builds an ORDER BY clause.
 * Falls back to a default if the requested field is not whitelisted.
 */
function buildOrderBy(table, sort, order) {
  const allowed = ALLOWED_SORT_FIELDS[table] || ['id'];
  const field = allowed.includes(sort) ? sort : 'id';
  const direction = String(order).toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
  return `ORDER BY ${field} ${direction}`;
}

module.exports = { buildWhereClause, buildOrderBy, ALLOWED_SORT_FIELDS };
