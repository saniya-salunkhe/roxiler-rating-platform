import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { adminService } from '../../services/services';
import RatingStars from '../../components/common/RatingStars';

export default function UserDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getUserDetail(id)
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page"><p>Loading…</p></div>;
  if (!data) return <div className="page"><p>User not found.</p></div>;

  const { user, storeRating } = data;

  return (
    <div className="page">
      <div className="page-header">
        <h1>User Details</h1>
        <Link to="/admin/users" className="btn btn-outline btn-sm">← Back to Users</Link>
      </div>

      <div className="detail-card">
        <div className="detail-row">
          <span className="detail-label">Name</span>
          <span className="detail-value">{user.name}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Email</span>
          <span className="detail-value">{user.email}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Address</span>
          <span className="detail-value">{user.address || '—'}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Role</span>
          <span className="detail-value"><span className={`badge badge-${user.role}`}>{user.role}</span></span>
        </div>

        {user.role === 'store_owner' && storeRating && (
          <div className="detail-row">
            <span className="detail-label">Store Rating</span>
            <span className="detail-value">
              <RatingStars value={storeRating.avg_rating} total={storeRating.total_ratings} />
              {storeRating.store_name && <span className="store-name-tag"> — {storeRating.store_name}</span>}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
