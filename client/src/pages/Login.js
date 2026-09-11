import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/admin';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/login`, formData);

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('adminEmail', res.data.admin.email);
      localStorage.setItem('adminName', res.data.admin.fullName);

      navigate('/');
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Server chal raha hai?');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:flex md:w-1/2 bg-white text-gray-800 p-12 flex-col justify-between border-r border-gray-200">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <img src="/gujrat-it-centre.png" alt="Logo" className="w-14 h-14 object-contain rounded-xl" onError={(e) => { e.target.style.display = 'none'; }} />
            <div>
              <h1 className="text-2xl font-bold text-[#1e3a8a]">Gujrat IT Centre</h1>
              <p className="text-sm text-gray-500">Management System</p>
            </div>
          </div>
          <h2 className="text-4xl font-bold leading-tight mt-16 text-gray-800">Welcome Back, <br /> Admin!</h2>
          <p className="mt-4 text-lg text-gray-600">Apne IT Centre ko manage karein — Students, Fees, Attendance, Courses aur bohot kuch.</p>
        </div>
        <p className="text-sm text-gray-400">© 2026 Gujrat IT Centre. All rights reserved.</p>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center bg-[#1e3a8a] p-6">
        <div className="w-full max-w-md">
          <div className="bg-white p-8 rounded-2xl shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">Admin Login</h2>
              <p className="text-gray-500 text-sm mt-2">Apne account mein login karein</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="info@gujratitcentre.pk" required className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" required className="w-full border border-gray-300 p-3 pr-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl">
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className={`w-full py-3 rounded-lg text-white font-semibold transition ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#1e3a8a] hover:bg-[#1e40af] shadow-lg'}`}>
                {loading ? 'Logging in...' : 'Login to Dashboard'}
              </button>
            </form>

            <p className="text-center text-xs text-gray-400 mt-6">Secure Login | Powered by Gujrat IT Centre</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;