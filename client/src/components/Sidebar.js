import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Admission', path: '/admission' },
    { name: 'Attendance', path: '/attendance' },
    { name: 'Student Query', path: '/student-query' },
    { name: 'Student Visiting', path: '/student-visiting' },
    { name: 'Expenses', path: '/expenses' },
    { name: 'Staff Salary', path: '/salary' },
    { name: 'Student Fee', path: '/fee' },
    { name: 'Courses', path: '/courses' },
    { name: 'Reports', path: '/reports' },
    { name: 'Settings', path: '/settings' },
  ];

  return (
    <div className="w-64 h-screen bg-white shadow-lg flex flex-col fixed left-0 top-0 overflow-y-auto">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <img 
            src="/gujrat-it-centre.png" 
            alt="Gujrat IT Centre Logo" 
            className="w-12 h-12 object-contain rounded-lg"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div>
            <h1 className="text-lg font-bold text-[#1e3a8a] leading-tight">Gujrat IT Centre</h1>
            <p className="text-xs text-gray-500 mt-1">Admin Panel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`block p-3 rounded-lg transition-colors text-sm ${
              location.pathname === item.path
                ? 'bg-[#1e3a8a] text-white font-semibold'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <p className="text-xs text-gray-400 text-center">2026 Gujrat IT Centre</p>
      </div>
    </div>
  );
};

export default Sidebar;