import React from 'react';
import Sidebar from './Sidebar';
import { Outlet, useNavigate } from 'react-router-dom';

const Layout = () => {
  const navigate = useNavigate();
  const adminEmail = localStorage.getItem('adminEmail') || 'Admin';

  const handleLogout = () => {
    if (window.confirm('Kya aap logout karna chahti hain?')) {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('adminEmail');
      navigate('/login');
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="ml-64 flex-1 p-8">
        {/* Top Navbar */}
        <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800">Welcome, Admin</h2>
          <div className="flex items-center gap-4">
            <span className="text-gray-500 text-xl">🔔</span>
            <div className="w-9 h-9 bg-blue-600 rounded-full text-white flex items-center justify-center font-bold">
              {adminEmail.charAt(0).toUpperCase()}
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition text-sm font-semibold"
            >
              🚪 Logout
            </button>
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;