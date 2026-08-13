import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/services';
import SortableTableHeader from '../../components/common/SortableTableHeader';
import RatingStars from '../../components/common/RatingStars';

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });
  const [sort, setSort] = useState('name');
  const [order, setOrder] = useState('asc');

  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const params = { ...filters, sort, order };
      Object.keys(params).forEach((k) => params[k] === '' && delete params[k]);
      const res = await adminService.listStores(params);
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

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    { key: 'rating', label: 'Rating', sortable: true },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Stores</h1>
        <Link to="/admin/stores/add" className="btn btn-primary btn-sm">+ Add Store</Link>
      </div>

      <div className="filter-bar">
        <input type="text" name="name" placeholder="Filter by name" value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value })} />
        <input type="text" name="email" placeholder="Filter by email" value={filters.email} onChange={(e) => setFilters({ ...filters, email: e.target.value })} />
        <input type="text" name="address" placeholder="Filter by address" value={filters.address} onChange={(e) => setFilters({ ...filters, address: e.target.value })} />
      </div>

      <div className="table-container">
        <table>
          <SortableTableHeader columns={columns} sort={sort} order={order} onSort={handleSort} />
          <tbody>
            {loading ? (
              <tr><td colSpan="4" className="text-center">Loading…</td></tr>
            ) : stores.length === 0 ? (
              <tr><td colSpan="4" className="text-center text-muted">No stores found</td></tr>
            ) : (
              stores.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td className="cell-clamp">{s.address}</td>
                  <td><RatingStars value={s.avg_rating} total={s.total_ratings} /></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
