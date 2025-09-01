import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import apiService from '../services/apiService';

export default function LoginView({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      // Using a simulated login from the apiService
      await apiService.login(email, password);
      onLogin();
    } catch (err) {
      setError('Failed to log in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
            <div className="bg-blue-500 p-3 rounded-full mb-4">
                <Shield className="text-white" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">Admin Dashboard</h2>
            <p className="text-gray-500 dark:text-gray-400">Smart Tourist Safety</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full px-3 py-2 text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
             <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="w-full px-3 py-2 text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:shadow-outline transition-colors disabled:bg-blue-300"
            >
              {isLoading ? 'Logging In...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
