import React from 'react';
import { Shield, Map, AlertTriangle, Users, CheckCircle, XCircle } from 'lucide-react';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-full w-full">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center">
    <div className={`p-3 rounded-full mr-4 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
    </div>
  </div>
);

const kycStatusPill = (status) => {
  switch (status) {
    case 'verified':
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Verified</span>;
    case 'expired':
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Expired</span>;
    case 'pending':
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">Pending</span>;
    default:
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Rejected</span>;
  }
};


export default function DashboardHome({ tourists, alerts, isLoading }) {
  if (isLoading) return <LoadingSpinner />;

  const activeAlerts = alerts.filter(a => a.status === 'Active').length;
  const kycVerified = tourists.filter(t => t.kycStatus === 'verified').length;


  return (
    <div className="p-6 md:p-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Tourists" value={tourists.length} icon={<Users className="text-white" />} color="bg-blue-500" />
        <StatCard title="Active Digital IDs" value={kycVerified} icon={<CheckCircle className="text-white" />} color="bg-green-500" />
        <StatCard title="Active Alerts" value={activeAlerts} icon={<AlertTriangle className="text-white" />} color="bg-red-500" />
        <StatCard title="Expired IDs" value={tourists.filter(t=>t.kycStatus === 'expired').length} icon={<XCircle className="text-white" />} color="bg-yellow-500" />
      </div>
      <div className="grid grid-cols-1">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Registered Tourists</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">Name</th>
                  <th scope="col" className="px-6 py-3">Email</th>
                  <th scope="col" className="px-6 py-3">KYC Status</th>
                  <th scope="col" className="px-6 py-3">ID Valid Until</th>
                  <th scope="col" className="px-6 py-3">Last Seen</th>
                </tr>
              </thead>
              <tbody>
                {tourists.length > 0 ? tourists.map(tourist => (
                  <tr key={tourist._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{tourist.name}</td>
                    <td className="px-6 py-4">{tourist.email}</td>
                    <td className="px-6 py-4">{kycStatusPill(tourist.kycStatus)}</td>
                    <td className="px-6 py-4">{tourist.idValidUntil ? new Date(tourist.idValidUntil).toLocaleDateString() : 'N/A'}</td>
                    <td className="px-6 py-4">{new Date(tourist.lastSeen).toLocaleString()}</td>
                  </tr>
                )) : (
                  <tr><td colSpan="5" className="text-center py-4">No tourists registered yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
