import React from 'react';
import { Shield, Map, AlertTriangle, BarChart2, Users, LogOut } from 'lucide-react';

export default function Sidebar({ currentView, setCurrentView, onLogout }) {
  const navItems = [
    { name: 'Dashboard', icon: <BarChart2 size={20} />, view: 'home' },
    { name: 'Live Map', icon: <Map size={20} />, view: 'map' },
    { name: 'Alerts', icon: <AlertTriangle size={20} />, view: 'alerts' },
    { name: 'Reports', icon: <Users size={20} />, view: 'reports' },
    { name: 'Statistics', icon: <Shield size={20} />, view: 'statistics' },
  ];

  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col min-h-screen">
      <div className="flex items-center justify-center p-6 border-b border-gray-700">
        <Shield size={32} className="text-blue-400" />
        <h1 className="text-xl font-bold ml-2">Tourist Safety</h1>
      </div>
      <nav className="flex-1 px-4 py-6">
        {navItems.map(item => (
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
      <div className="p-4 border-t border-gray-700">
        <button 
          onClick={onLogout} 
          className="w-full flex items-center px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white text-left"
        >
          <LogOut size={20}/>
          <span className="ml-4">Logout</span>
        </button>
      </div>
    </div>
  );
}
