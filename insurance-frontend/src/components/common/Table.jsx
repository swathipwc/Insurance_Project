import React from 'react';
import { Card, CardContent } from './Card';
import LoadingSpinner from './LoadingSpinner';

const Table = ({ columns = [], data = [], className = '', onRowClick, loading = false }) => {
  return (
    <Card className={`border border-gray-200 shadow-md ${className}`}>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-purple-50 to-gray-50 border-b-2 border-purple-200">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
                    style={column.style}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-12 text-center">
                    <LoadingSpinner size="md" />
                    <p className="text-xs text-gray-500 mt-2">Loading data...</p>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-8 text-center">
                    <p className="text-xs text-gray-600">No data available</p>
                  </td>
                </tr>
              ) : (
                data.map((row, index) => (
                  <tr
                    key={row.id || index}
                    onClick={() => onRowClick?.(row.id || row)}
                    className={`transition-colors hover:bg-purple-50/50 border-l-4 border-transparent hover:border-purple-300 ${
                      onRowClick ? 'cursor-pointer' : ''
                    }`}
                  >
                    {columns.map((column) => (
                      <td 
                        key={column.key} 
                        className="px-4 py-4 text-xs text-gray-900 whitespace-nowrap"
                        style={column.style}
                      >
                        {column.render
                          ? column.render(row[column.key], row)
                          : row[column.key]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default Table;
