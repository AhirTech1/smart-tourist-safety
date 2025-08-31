import React from 'react';
import { Shield, Map, AlertTriangle, Users } from 'lucide-react';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-full w-full">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
    <div className={`p-3 rounded-full mr-4 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

export default function DashboardHome({ tourists, alerts, isLoading }) {
  if (isLoading) return <LoadingSpinner />;

  const activeAlerts = alerts.filter(a => a.status === 'Active').length;
  const resolvedAlerts = alerts.length - activeAlerts;

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Tourists" value={tourists.length} icon={<Users className="text-white" />} color="bg-blue-500" />
        <StatCard title="Active Alerts" value={activeAlerts} icon={<AlertTriangle className="text-white" />} color="bg-red-500" />
        <StatCard title="Incidents Resolved" value={resolvedAlerts} icon={<Shield className="text-white" />} color="bg-green-500" />
        <StatCard title="Safe Zones" value="12" icon={<Map className="text-white" />} color="bg-yellow-500" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Registered Tourists</h2>
          <div className="overflow-y-auto h-64">
            <ul className="divide-y divide-gray-200">
              {tourists.length > 0 ? tourists.map(tourist => (
                <li key={tourist._id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-800">{tourist.name}</p>
                    <p className="text-sm text-gray-500">Device ID: {tourist.deviceId}</p>
                  </div>
                  <span className="text-xs text-gray-400">
                    Last seen: {new Date(tourist.lastSeen).toLocaleString()}
                  </span>
                </li>
              )) : <p className="text-gray-500">No tourists registered yet.</p>}
            </ul>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Recent Alerts</h2>
          <div className="overflow-y-auto h-64">
            <ul className="divide-y divide-gray-200">
              {alerts.length > 0 ? alerts.map(alert => (
                <li key={alert._id} className="py-3">
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-gray-800">{alert.tourist?.name || 'Unknown Tourist'}</p>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${alert.status === 'Active' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {alert.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">Type: {alert.type} at {new Date(alert.timestamp).toLocaleTimeString()}</p>
                </li>
              )) : <p className="text-gray-500">No alerts found.</p>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
