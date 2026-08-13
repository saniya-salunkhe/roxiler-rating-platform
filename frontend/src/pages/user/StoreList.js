import React, { useState, useEffect, useCallback } from 'react';
import { storeService } from '../../services/services';
import RatingStars from '../../components/common/RatingStars';
import SortableTableHeader from '../../components/common/SortableTableHeader';

export default function StoreList() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [sort, setSort] = useState('name');
  const [order, setOrder] = useState('asc');
  const [ratingModal, setRatingModal] = useState({ open: false, storeId: null, storeName: '', currentRating: 0 });
  const [selectedRating, setSelectedRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const params = { ...filters, sort, order };
      Object.keys(params).forEach((k) => params[k] === '' && delete params[k]);
      const res = await storeService.listStores(params);
      setStores(res.data.stores);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters, sort, order]);

  useEffect(() => { fetchStores(); }, [fetchStores]);

  const handleSort = (field) => {
    if (sort === field) setOrder(order === 'asc' ? 'desc' : 'asc');
    else { setSort(field); setOrder('asc'); }
  };

  const openRatingModal = (store) => {
    setRatingModal({
      open: true,
      storeId: store.id,
      storeName: store.name,
      currentRating: store.my_rating || 0,
    });
    setSelectedRating(store.my_rating || 0);
  };

  const handleSubmitRating = async () => {
    setSubmitting(true);
    try {
      await storeService.submitRating(ratingModal.storeId, selectedRating);
      setRatingModal({ open: false, storeId: null, storeName: '', currentRating: 0 });
      fetchStores();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { key: 'name', label: 'Store Name', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    { key: 'rating', label: 'Overall Rating', sortable: true },
    { key: 'my_rating', label: 'Your Rating', sortable: false },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Stores</h1>
        <p>Browse and rate stores on the platform</p>
      </div>

      <div className="filter-bar">
        <input type="text" name="name" placeholder="Search by store name" value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })} />
        <input type="text" name="address" placeholder="Search by address" value={filters.address}
          onChange={(e) => setFilters({ ...filters, address: e.target.value })} />
      </div>

      <div className="table-container">
        <table>
          <SortableTableHeader columns={columns} sort={sort} order={order} onSort={handleSort} />
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="text-center">Loading…</td></tr>
            ) : stores.length === 0 ? (
              <tr><td colSpan="5" className="text-center text-muted">No stores found</td></tr>
            ) : (
              stores.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td className="cell-clamp">{s.address}</td>
                  <td><RatingStars value={s.avg_rating} total={s.total_ratings} /></td>
                  <td>
                    {s.my_rating ? (
                      <span className="my-rating-badge">{'★'.repeat(s.my_rating)}{'☆'.repeat(5 - s.my_rating)}</span>
                    ) : (
                      <span className="text-muted">Not rated</span>
                    )}
                  </td>
                  <td>
                    <button className="btn btn-primary btn-sm" onClick={() => openRatingModal(s)}>
                      {s.my_rating ? 'Modify Rating' : 'Rate Store'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Rating Modal */}
      {ratingModal.open && (
        <div className="modal-overlay" onClick={() => setRatingModal({ ...ratingModal, open: false })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Rate: {ratingModal.storeName}</h3>
            {ratingModal.currentRating > 0 && (
              <p className="text-muted">Your current rating: {'★'.repeat(ratingModal.currentRating)}</p>
            )}
            <div className="rating-selector">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  className={`star-btn ${n <= selectedRating ? 'selected' : ''}`}
                  onClick={() => setSelectedRating(n)}
                >
                  ★
                </button>
              ))}
            </div>
            <p className="selected-rating-text">Selected: {selectedRating} / 5</p>
            <div className="form-actions">
              <button className="btn btn-outline" onClick={() => setRatingModal({ ...ratingModal, open: false })}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSubmitRating} disabled={!selectedRating || submitting}>
                {submitting ? 'Submitting…' : 'Submit Rating'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
