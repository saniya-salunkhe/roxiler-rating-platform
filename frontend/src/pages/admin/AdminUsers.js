import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/services';
import SortableTableHeader from '../../components/common/SortableTableHeader';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sort, setSort] = useState('name');
  const [order, setOrder] = useState('asc');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { ...filters, sort, order };
      Object.keys(params).forEach((k) => params[k] === '' && delete params[k]);
      const res = await adminService.listUsers(params);
      setUsers(res.data.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters, sort, order]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleSort = (field) => {
    if (sort === field) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSort(field);
      setOrder('asc');
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Users</h1>
        <Link to="/admin/users/add" className="btn btn-primary btn-sm">+ Add User</Link>
      </div>

      <div className="filter-bar">
        <input type="text" name="name" placeholder="Filter by name" value={filters.name} onChange={handleFilterChange} />
        <input type="text" name="email" placeholder="Filter by email" value={filters.email} onChange={handleFilterChange} />
        <input type="text" name="address" placeholder="Filter by address" value={filters.address} onChange={handleFilterChange} />
        <select name="role" value={filters.role} onChange={handleFilterChange}>
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
          <option value="store_owner">Store Owner</option>
        </select>
      </div>

      <div className="table-container">
        <table>
          <SortableTableHeader columns={columns} sort={sort} order={order} onSort={handleSort} />
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="text-center">Loading…</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan="5" className="text-center text-muted">No users found</td></tr>
            ) : (
              users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td className="cell-clamp">{u.address}</td>
                  <td><span className={`badge badge-${u.role}`}>{u.role}</span></td>
                  <td>
                    <Link to={`/admin/users/${u.id}`} className="btn btn-outline btn-sm">View</Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
