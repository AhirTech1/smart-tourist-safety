import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, RefreshCw, Eye, AlertCircle, Clock, 
  CheckCircle, XCircle, User, MapPin, Calendar, 
  ChevronDown, ChevronRight, FileText, Users, 
  TrendingUp, BarChart3, Download, ExternalLink 
} from 'lucide-react';
import { useIncident } from '../contexts/IncidentContext';

const INCIDENT_TYPES = [
  { value: 'theft', label: 'Theft/Robbery', color: 'text-red-600', bgColor: 'bg-red-100' },
  { value: 'harassment', label: 'Harassment', color: 'text-orange-600', bgColor: 'bg-orange-100' },
  { value: 'fraud', label: 'Fraud/Scam', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  { value: 'assault', label: 'Physical Assault', color: 'text-red-800', bgColor: 'bg-red-200' },
  { value: 'vandalism', label: 'Vandalism', color: 'text-purple-600', bgColor: 'bg-purple-100' },
  { value: 'pickpocketing', label: 'Pickpocketing', color: 'text-orange-800', bgColor: 'bg-orange-200' },
  { value: 'suspicious', label: 'Suspicious Activity', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  { value: 'lost', label: 'Lost/Missing Person', color: 'text-teal-600', bgColor: 'bg-teal-100' },
  { value: 'other', label: 'Other', color: 'text-gray-600', bgColor: 'bg-gray-100' }
];

const PRIORITY_LEVELS = [
  { value: 'low', label: 'Low Priority', color: 'text-green-600', bgColor: 'bg-green-100' },
  { value: 'medium', label: 'Medium Priority', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  { value: 'high', label: 'High Priority', color: 'text-red-600', bgColor: 'bg-red-100' },
  { value: 'critical', label: 'EMERGENCY', color: 'text-red-800', bgColor: 'bg-red-200' }
];

const STATUS_OPTIONS = [
  { value: 'reported', label: 'Reported', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  { value: 'investigating', label: 'Investigating', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  { value: 'resolved', label: 'Resolved', color: 'text-green-600', bgColor: 'bg-green-100' },
  { value: 'closed', label: 'Closed', color: 'text-gray-600', bgColor: 'bg-gray-100' },
  { value: 'rejected', label: 'Rejected', color: 'text-red-600', bgColor: 'bg-red-100' }
];

export default function Reports() {
  const { 
    incidents, 
    loading, 
    error, 
    filters, 
    applyFilters, 
    resetFilters, 
    refreshIncidents,
    updateIncidentStatus 
  } = useIncident();

  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(null);

  // Filter incidents based on search term
  const filteredIncidents = incidents.filter(incident =>
    incident.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    incident.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get display properties for incident type
  const getTypeInfo = (type) => {
    return INCIDENT_TYPES.find(t => t.value === type) || INCIDENT_TYPES[INCIDENT_TYPES.length - 1];
  };

  // Get display properties for priority
  const getPriorityInfo = (priority) => {
    return PRIORITY_LEVELS.find(p => p.value === priority) || PRIORITY_LEVELS[1];
  };

  // Get display properties for status
  const getStatusInfo = (status) => {
    return STATUS_OPTIONS.find(s => s.value === status) || STATUS_OPTIONS[0];
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return `${Math.floor(diffInHours * 60)} minutes ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  // Handle status update
  const handleStatusUpdate = async (incidentId, newStatus) => {
    setStatusUpdateLoading(incidentId);
    try {
      await updateIncidentStatus(incidentId, newStatus, `Status updated to ${newStatus} by admin`);
    } catch (error) {
      alert(`Failed to update status: ${error.message}`);
    } finally {
      setStatusUpdateLoading(null);
    }
  };

  // Handle filter application
  const handleFilterChange = (filterKey, value) => {
    applyFilters({ [filterKey]: value });
  };

  // Statistics calculations
  const stats = {
    total: incidents.length,
    pending: incidents.filter(i => i.status === 'reported' || i.status === 'investigating').length,
    resolved: incidents.filter(i => i.status === 'resolved').length,
    critical: incidents.filter(i => i.priority === 'critical').length
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Incident Reports</h1>
            <p className="text-gray-600 mt-1">Manage and track safety incident reports</p>
          </div>
          <button
            onClick={refreshIncidents}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <FileText className="text-blue-600" size={24} />
              <div className="ml-3">
                <p className="text-sm text-gray-600">Total Reports</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <Clock className="text-orange-600" size={24} />
              <div className="ml-3">
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <CheckCircle className="text-green-600" size={24} />
              <div className="ml-3">
                <p className="text-sm text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <AlertCircle className="text-red-600" size={24} />
              <div className="ml-3">
                <p className="text-sm text-gray-600">Critical</p>
                <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search incidents by description or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center text-gray-600 gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter size={16} />
            Filters
            {showFilters ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Statuses</option>
                  {STATUS_OPTIONS.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={filters.priority}
                  onChange={(e) => handleFilterChange('priority', e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Priorities</option>
                  {PRIORITY_LEVELS.map(priority => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Types</option>
                  {INCIDENT_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reset Button */}
              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="text-red-600" size={20} />
            <span className="ml-2 text-red-800">{error}</span>
          </div>
        </div>
      )}

      {/* Incidents List */}
      <div className="bg-white rounded-lg shadow-lg">
        {loading ? (
          <div className="p-8 text-center">
            <RefreshCw className="animate-spin mx-auto mb-4 text-gray-400" size={32} />
            <p className="text-gray-600">Loading incidents...</p>
          </div>
        ) : filteredIncidents.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="mx-auto mb-4 text-gray-400" size={32} />
            <p className="text-gray-600">No incidents found matching your criteria</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredIncidents.map((incident) => {
              const typeInfo = getTypeInfo(incident.type);
              const priorityInfo = getPriorityInfo(incident.priority);
              const statusInfo = getStatusInfo(incident.status);

              return (
                <div key={incident._id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        {/* Type Badge */}
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeInfo.bgColor} ${typeInfo.color}`}>
                          {typeInfo.label}
                        </span>

                        {/* Priority Badge */}
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityInfo.bgColor} ${priorityInfo.color}`}>
                          {priorityInfo.label}
                        </span>

                        {/* Status Badge */}
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>

                        {/* Anonymous Badge */}
                        {incident.isAnonymous && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            Anonymous
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-gray-900 mb-3 line-clamp-2">
                        {incident.description}
                      </p>

                      {/* Meta Information */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar size={16} />
                          {formatDate(incident.createdAt)}
                        </div>

                        {incident.location && (
                          <div className="flex items-center gap-1">
                            <MapPin size={16} />
                            Location Available
                          </div>
                        )}

                        {!incident.isAnonymous && incident.reportedBy && (
                          <div className="flex items-center gap-1">
                            <User size={16} />
                            Reported by User
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 ml-4">
                      {/* Status Update Dropdown */}
                      <select
                        value={incident.status}
                        onChange={(e) => handleStatusUpdate(incident._id, e.target.value)}
                        disabled={statusUpdateLoading === incident._id}
                        className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {STATUS_OPTIONS.map(status => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>

                      {/* View Details Button */}
                      <button
                        onClick={() => setSelectedIncident(incident)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Incident Details Modal */}
      {selectedIncident && (
        <IncidentDetailsModal
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
}

// Incident Details Modal Component
function IncidentDetailsModal({ incident, onClose, onStatusUpdate }) {
  const typeInfo = INCIDENT_TYPES.find(t => t.value === incident.type) || INCIDENT_TYPES[INCIDENT_TYPES.length - 1];
  const priorityInfo = PRIORITY_LEVELS.find(p => p.value === incident.priority) || PRIORITY_LEVELS[1];
  const statusInfo = STATUS_OPTIONS.find(s => s.value === incident.status) || STATUS_OPTIONS[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Incident Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <XCircle size={20} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${typeInfo.bgColor} ${typeInfo.color}`}>
                {typeInfo.label}
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${priorityInfo.bgColor} ${priorityInfo.color}`}>
                {priorityInfo.label}
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
                {statusInfo.label}
              </span>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
              <p className="text-gray-900 whitespace-pre-wrap">{incident.description}</p>
            </div>

            {/* Location */}
            {incident.location && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Location</h3>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-900">
                    Latitude: {incident.location.coordinates?.[1] || 'N/A'}<br />
                    Longitude: {incident.location.coordinates?.[0] || 'N/A'}
                    {incident.location.accuracy && (
                      <><br />Accuracy: ±{incident.location.accuracy}m</>
                    )}
                  </p>
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Reported</h3>
                <p className="text-sm text-gray-900">{new Date(incident.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Last Updated</h3>
                <p className="text-sm text-gray-900">{new Date(incident.updatedAt).toLocaleString()}</p>
              </div>
            </div>

            {/* Reporter Info */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Reporter</h3>
              <p className="text-sm text-gray-900">
                {incident.isAnonymous ? 'Anonymous Report' : 'Registered User'}
              </p>
            </div>

            {/* Status Update */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Update Status</h3>
              <div className="flex gap-2">
                {STATUS_OPTIONS.map(status => (
                  <button
                    key={status.value}
                    onClick={() => onStatusUpdate(incident._id, status.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      incident.status === status.value
                        ? `${status.bgColor} ${status.color}`
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
