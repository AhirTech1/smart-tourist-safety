import React, { useState } from 'react';
import { Shield, User, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function LoginView() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(email, password);
      // Navigation will be handled by the AuthProvider
    } catch (err) {
      setError(err.message || 'Failed to log in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-fill credentials
  const fillCredentials = (userEmail, userPassword) => {
    setEmail(userEmail);
    setPassword(userPassword);
    setError('');
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 rounded-full mb-4 shadow-lg">
            <Shield className="text-white" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-2">
            Admin Dashboard
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-center">
            Smart Tourist Safety System
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2" htmlFor="email">
              <User className="inline w-4 h-4 mr-2" />
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@smarttouristsafety.com"
              className="w-full px-4 py-3 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2" htmlFor="password">
              <Lock className="inline w-4 h-4 mr-2" />
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Signing In...
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Secure access for authorized personnel only
          </p>
          
          {/* Temporary Demo Credentials */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-left">
            <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">
              🔍 Demo Credentials (For Jury/Testing)
            </h3>
            <div className="space-y-2 text-xs">
              <div 
                className="bg-white dark:bg-gray-800 p-2 rounded border cursor-pointer hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors"
                onClick={() => fillCredentials('admin@smarttouristsafety.com', 'SuperAdmin@2025')}
              >
                <div className="font-medium text-yellow-700 dark:text-yellow-400">Super Admin (Full Access):</div>
                <div className="text-gray-600 dark:text-gray-300">📧 admin@smarttouristsafety.com</div>
                <div className="text-gray-600 dark:text-gray-300">🔑 SuperAdmin@2025</div>
              </div>
              <div 
                className="bg-white dark:bg-gray-800 p-2 rounded border cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                onClick={() => fillCredentials('viewer@smarttouristsafety.com', 'Viewer@2025')}
              >
                <div className="font-medium text-purple-700 dark:text-purple-400">Viewer (Read-only):</div>
                <div className="text-gray-600 dark:text-gray-300">📧 viewer@smarttouristsafety.com</div>
                <div className="text-gray-600 dark:text-gray-300">🔑 Viewer@2025</div>
              </div>
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
              💡 Click on any credential box to auto-fill the form
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
