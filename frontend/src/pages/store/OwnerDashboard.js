import React, { useState, useEffect } from 'react';
import { ownerService } from '../../services/services';
import RatingStars from '../../components/common/RatingStars';

export default function OwnerDashboard() {
  const [data, setData] = useState({ stores: [], raters: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ownerService.getDashboard()
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page"><p>Loading…</p></div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Store Owner Dashboard</h1>
        <p>View ratings and reviewers for your store(s)</p>
      </div>

      {/* Store summary cards */}
      <div className="stats-grid">
        {data.stores.length === 0 ? (
          <p className="text-muted">No stores linked to your account yet.</p>
        ) : (
          data.stores.map((store) => (
            <div key={store.id} className="stat-card stat-blue">
              <div className="stat-icon">🏪</div>
              <div className="stat-label">{store.name}</div>
              <div className="stat-value"><RatingStars value={store.avg_rating} total={store.total_ratings} /></div>
            </div>
          ))
        )}
      </div>

      {/* Raters table */}
      <div className="page-header" style={{ marginTop: '2rem' }}>
        <h2>Users Who Rated Your Store</h2>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Store</th>
              <th>Rating</th>
              <th>Rated On</th>
            </tr>
          </thead>
          <tbody>
            {data.raters.length === 0 ? (
              <tr><td colSpan="6" className="text-center text-muted">No ratings submitted yet</td></tr>
            ) : (
              data.raters.map((r) => (
                <tr key={`${r.id}-${r.store_name}`}>
                  <td>{r.name}</td>
                  <td>{r.email}</td>
                  <td className="cell-clamp">{r.address}</td>
                  <td>{r.store_name}</td>
                  <td><span className="my-rating-badge">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span></td>
                  <td>{new Date(r.updated_at).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
