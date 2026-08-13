import React from 'react';

/**
 * Reusable sortable table header.
 *
 * Props:
 *   columns: [{ key, label, sortable }]
 *   sort, order, onSort
 */
export default function SortableTableHeader({
  columns,
  sort,
  order,
  onSort,
}) {
  const handleSort = (key) => {
    if (!key) return;
    onSort(key);
  };

  return (
    <thead>
      <tr>
        {columns.map((col) => (
          <th
            key={col.key}
            className={col.sortable ? 'sortable' : ''}
            onClick={() => col.sortable && handleSort(col.key)}
          >
            {col.label}

            {col.sortable && sort === col.key && (
              <span className="sort-indicator">
                {order === 'asc' ? ' ▲' : ' ▼'}
              </span>
            )}
          </th>
        ))}
      </tr>
    </thead>
  );
}