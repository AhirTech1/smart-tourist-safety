import React from 'react';
import { Shield, Map, AlertTriangle, BarChart2, Users, LogOut, Settings, UserCheck, Crown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Sidebar({ currentView, setCurrentView, onLogout }) {
  const { user, hasPermission, hasRole } = useAuth();

  // Define navigation items with permission requirements
  const navItems = [
    { 
      name: 'Dashboard', 
      icon: <BarChart2 size={20} />, 
      view: 'home',
      permission: 'view_dashboard'
    },
    { 
      name: 'Live Map', 
      icon: <Map size={20} />, 
      view: 'map',
      permission: 'view_dashboard'
    },
    { 
      name: 'Alerts', 
      icon: <AlertTriangle size={20} />, 
      view: 'alerts',
      permission: 'manage_alerts'
    },
    { 
      name: 'Reports', 
      icon: <Users size={20} />, 
      view: 'reports',
      permission: 'view_analytics'
    },
    { 
      name: 'Statistics', 
      icon: <Shield size={20} />, 
      view: 'statistics',
      permission: 'view_analytics'
    },
    { 
      name: 'User Management', 
      icon: <UserCheck size={20} />, 
      view: 'users',
      permission: 'user_management',
      adminOnly: true
    },
    { 
      name: 'System Settings', 
      icon: <Settings size={20} />, 
      view: 'settings',
      permission: 'system_settings',
      superAdminOnly: true
    }
  ];

  // Filter nav items based on permissions
  const visibleNavItems = navItems.filter(item => {
    if (item.superAdminOnly && !hasRole('super_admin')) return false;
    if (item.adminOnly && !hasRole('super_admin') && !hasRole('admin')) return false;
    return hasPermission(item.permission);
  });

  const getRoleIcon = (role) => {
    switch (role) {
      case 'super_admin':
        return <Crown size={16} className="text-yellow-400" />;
      case 'admin':
        return <Shield size={16} className="text-blue-400" />;
      case 'moderator':
        return <UserCheck size={16} className="text-green-400" />;
      default:
        return <Users size={16} className="text-gray-400" />;
    }
  };

  const getRoleName = (role) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin';
      case 'admin':
        return 'Administrator';
      case 'moderator':
        return 'Moderator';
      default:
        return 'User';
    }
  };

  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-center p-6 border-b border-gray-700">
        <Shield size={32} className="text-blue-400" />
        <h1 className="text-xl font-bold ml-2">Tourist Safety</h1>
      </div>

      {/* User Info */}
      {user && (
        <div className="px-4 py-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold">
                {user.name?.charAt(0).toUpperCase() || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user.name || 'Admin User'}
              </p>
              <div className="flex items-center space-x-1">
                {getRoleIcon(user.role)}
                <p className="text-xs text-gray-300">
                  {getRoleName(user.role)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        {visibleNavItems.map(item => (
          <button
            key={item.name}
            onClick={() => setCurrentView(item.view)}
            className={`w-full flex items-center px-4 py-3 my-1 rounded-lg transition-colors text-left ${
              currentView === item.view
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {item.icon}
            <span className="ml-4">{item.name}</span>
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-700">
        <button 
          onClick={onLogout} 
          className="w-full flex items-center px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white text-left transition-colors"
        >
          <LogOut size={20}/>
          <span className="ml-4">Logout</span>
        </button>
      </div>
    </div>
  );
}
