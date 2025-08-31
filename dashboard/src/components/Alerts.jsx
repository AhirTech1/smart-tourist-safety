import React from 'react';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-full w-full">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

export default function Alerts({ alerts, isLoading }) {
  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Alerts History</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <ul className="divide-y divide-gray-200">
          {alerts.map(alert => (
            <li key={alert._id} className="py-4">
              <p className="font-bold text-lg">{alert.type} Alert</p>
              <p>Tourist: {alert.tourist?.name || 'N/A'}</p>
              <p>Status: {alert.status}</p>
              <p>Time: {new Date(alert.timestamp).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
