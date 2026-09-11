import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/student-query';

const StudentQuery = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: '', studentName: '', whatsappNumber: '', interestingCourse: '', classMode: 'Physical', source: 'WhatsApp'
  });
  const [filter, setFilter] = useState({ course: '', date: '', classMode: '', source: '' });

  const coursesList = ['Web Development', 'Digital Marketing', 'Graphic Designing', 'Computer Basic', 'IT for Kids', 'Video Editing', 'WordPress', 'E-Commerce - Daraz', 'E-Commerce - Shopify', 'E-Commerce - Amazon', 'E-Commerce - eBay', 'E-Commerce - Etsy', 'E-Commerce - OnBuy', 'E-Commerce - WooCommerce', 'E-Commerce - TikTok Shop'];
  const classModeOptions = ['Online', 'Physical', 'Hybrid'];
  const sourceOptions = ['WhatsApp', 'Instagram', 'Facebook Ads', 'Meta Ads', 'Walk-in', 'Reference'];

  const sourceColors = {
    'WhatsApp': 'bg-green-100 text-green-700', 'Instagram': 'bg-pink-100 text-pink-700',
    'Facebook Ads': 'bg-blue-100 text-blue-700', 'Meta Ads': 'bg-indigo-100 text-indigo-700',
    'Walk-in': 'bg-gray-100 text-gray-700', 'Reference': 'bg-purple-100 text-purple-700'
  };

  const classModeColors = {
    'Online': 'bg-cyan-100 text-cyan-700', 'Physical': 'bg-orange-100 text-orange-700', 'Hybrid': 'bg-purple-100 text-purple-700'
  };

  // API CALLS
  const fetchQueries = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setQueries(res.data);
    } catch (err) {
      console.log(err.message);
      alert('Queries load nahi ho sakay. Server chal raha hai?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQueries(); }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFilterChange = (e) => setFilter({ ...filter, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, formData);
      alert('Query Saved Successfully!');
      setFormData({ date: '', studentName: '', whatsappNumber: '', interestingCourse: '', classMode: 'Physical', source: 'WhatsApp' });
      fetchQueries();
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this query?')) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchQueries();
    } catch (err) { alert('Error: ' + err.message); }
  };

  const filteredQueries = useMemo(() => queries.filter((q) => {
    const mCourse = filter.course ? q.interestingCourse === filter.course : true;
    const mDate = filter.date ? q.date === filter.date : true;
    const mMode = filter.classMode ? q.classMode === filter.classMode : true;
    const mSource = filter.source ? q.source === filter.source : true;
    return mCourse && mDate && mMode && mSource;
  }), [queries, filter]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Student Query Management</h2>
          <p className="text-gray-500 text-sm">Database se connected - WhatsApp, Instagram, Meta Ads</p>
        </div>
        <button onClick={() => window.print()} className="bg-[#1e3a8a] text-white px-4 py-2 rounded-lg hover:bg-[#1e40af] no-print">Print Sheet</button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 no-print">
        <div className="bg-[#1e3a8a] text-white p-5 rounded-xl shadow-md"><p className="text-sm opacity-90">Total Queries</p><p className="text-2xl font-bold mt-1">{queries.length}</p></div>
        <div className="bg-green-600 text-white p-5 rounded-xl shadow-md"><p className="text-sm opacity-90">WhatsApp</p><p className="text-2xl font-bold mt-1">{queries.filter(q => q.source === 'WhatsApp').length}</p></div>
        <div className="bg-pink-600 text-white p-5 rounded-xl shadow-md"><p className="text-sm opacity-90">Instagram</p><p className="text-2xl font-bold mt-1">{queries.filter(q => q.source === 'Instagram').length}</p></div>
        <div className="bg-blue-600 text-white p-5 rounded-xl shadow-md"><p className="text-sm opacity-90">Facebook/Meta</p><p className="text-2xl font-bold mt-1">{queries.filter(q => q.source === 'Facebook Ads' || q.source === 'Meta Ads').length}</p></div>
      </div>

      {/* Form */}
      <div className="bg-white p-6 rounded-xl shadow-md no-print">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Add New Query</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="date" name="date" value={formData.date} onChange={handleChange} required className="border border-gray-300 p-3 rounded-lg" />
          <input type="text" name="studentName" placeholder="Student Name" value={formData.studentName} onChange={handleChange} required className="border border-gray-300 p-3 rounded-lg" />
          <input type="text" name="whatsappNumber" placeholder="WhatsApp Number" value={formData.whatsappNumber} onChange={handleChange} required className="border border-gray-300 p-3 rounded-lg" />
          <select name="interestingCourse" value={formData.interestingCourse} onChange={handleChange} required className="border border-gray-300 p-3 rounded-lg">
            <option value="">Select Course</option>
            {coursesList.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select name="classMode" value={formData.classMode} onChange={handleChange} className="border border-gray-300 p-3 rounded-lg">
            {classModeOptions.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <select name="source" value={formData.source} onChange={handleChange} className="border border-gray-300 p-3 rounded-lg">
            {sourceOptions.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <button type="submit" className="md:col-span-3 bg-[#1e3a8a] text-white py-3 rounded-lg hover:bg-[#1e40af]">Add Query</button>
        </form>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-md flex flex-wrap gap-3 items-center no-print">
        <h3 className="text-md font-semibold text-gray-700">Filter:</h3>
        <select name="course" value={filter.course} onChange={handleFilterChange} className="border border-gray-300 p-2 rounded-lg text-sm">
          <option value="">All Courses</option>{coursesList.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select name="classMode" value={filter.classMode} onChange={handleFilterChange} className="border border-gray-300 p-2 rounded-lg text-sm">
          <option value="">All Modes</option>{classModeOptions.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
        <select name="source" value={filter.source} onChange={handleFilterChange} className="border border-gray-300 p-2 rounded-lg text-sm">
          <option value="">All Sources</option>{sourceOptions.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <input type="date" name="date" value={filter.date} onChange={handleFilterChange} className="border border-gray-300 p-2 rounded-lg text-sm" />
      </div>

      {/* Table */}
      <div className="bg-white p-6 rounded-xl shadow-md" id="print-area">
        <div className="text-center mb-4 print-header">
          <h3 className="text-xl font-bold">GUJRAT IT CENTRE</h3>
          <p className="text-sm text-gray-600">Student Query Sheet</p>
          <p className="text-xs text-gray-500">Generated: {new Date().toLocaleDateString()}</p>
        </div>
        <div className="overflow-x-auto">
          {loading ? <p className="text-center p-6 text-gray-500">Loading...</p> : (
            <table className="w-full text-left text-sm excel-table">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border border-gray-400 text-center">S.No</th>
                  <th className="p-2 border border-gray-400">Date</th>
                  <th className="p-2 border border-gray-400">Student Name</th>
                  <th className="p-2 border border-gray-400">WhatsApp</th>
                  <th className="p-2 border border-gray-400">Course</th>
                  <th className="p-2 border border-gray-400">Class Mode</th>
                  <th className="p-2 border border-gray-400">Source</th>
                  <th className="p-2 border border-gray-400 text-center no-print">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredQueries.length === 0 ? (
                  <tr><td colSpan="8" className="p-6 text-center text-gray-500 border border-gray-400">No queries found. Add your first query above!</td></tr>
                ) : (
                  filteredQueries.map((q, i) => (
                    <tr key={q._id} className="hover:bg-gray-50">
                      <td className="p-2 border border-gray-400 text-center">{i + 1}</td>
                      <td className="p-2 border border-gray-400">{q.date}</td>
                      <td className="p-2 border border-gray-400 font-semibold">{q.studentName}</td>
                      <td className="p-2 border border-gray-400">
                        <a href={`https://wa.me/${q.whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">{q.whatsappNumber}</a>
                      </td>
                      <td className="p-2 border border-gray-400">{q.interestingCourse}</td>
                      <td className="p-2 border border-gray-400"><span className={`px-2 py-1 rounded text-xs font-semibold ${classModeColors[q.classMode]}`}>{q.classMode}</span></td>
                      <td className="p-2 border border-gray-400"><span className={`px-2 py-1 rounded text-xs font-semibold ${sourceColors[q.source] || 'bg-gray-100 text-gray-700'}`}>{q.source}</span></td>
                      <td className="p-2 border border-gray-400 text-center no-print">
                        <button onClick={() => handleDelete(q._id)} className="text-red-600 hover:underline text-xs">Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {filteredQueries.length > 0 && (
                <tfoot>
                  <tr className="bg-gray-800 text-white font-bold">
                    <td className="p-2 border border-gray-400" colSpan="7">TOTAL QUERIES</td>
                    <td className="p-2 border border-gray-400">{filteredQueries.length}</td>
                  </tr>
                </tfoot>
              )}
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentQuery;