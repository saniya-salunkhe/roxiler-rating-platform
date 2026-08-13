import React from 'react';

/**
 * Renders 1-5 stars, highlighting up to the given value.
 * value can be null/undefined (shows "No ratings yet").
 */
export default function RatingStars({ value, total }) {
  if (value === null || value === undefined) {
    return <span className="text-muted">No ratings yet</span>;
  }

  return (
    <span className="rating-stars">
      <span className="stars">
        {[1, 2, 3, 4, 5].map((n) => (
          <span key={n} className={n <= Math.round(value) ? 'star filled' : 'star'}>★</span>
        ))}
      </span>
      <span className="rating-value">{Number(value).toFixed(2)}</span>
      {total !== undefined && total !== null && (
        <span className="rating-total">({total})</span>
      )}
    </span>
  );
}
