import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/courses';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    courseCategory: '', courseName: '', platform: '', duration: '', totalFee: '', description: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState({ category: '', platform: '' });

  const regularCoursesList = ['Web Development', 'Digital Marketing', 'Graphic Designing', 'Computer Basic', 'IT for Kids', 'Video Editing', 'WordPress'];
  const platformsList = ['Daraz', 'Shopify', 'Amazon', 'eBay', 'Etsy', 'OnBuy', 'WooCommerce', 'TikTok Shop'];

  const platformColors = {
    'Daraz': 'bg-orange-500', 'Shopify': 'bg-green-600', 'Amazon': 'bg-yellow-600',
    'eBay': 'bg-blue-600', 'Etsy': 'bg-orange-700', 'OnBuy': 'bg-teal-600',
    'WooCommerce': 'bg-purple-600', 'TikTok Shop': 'bg-pink-600'
  };

  // ============ API CALLS ============

  // Load courses from database
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setCourses(res.data);
    } catch (err) {
      console.log('Error fetching courses:', err.message);
      alert('Courses load nahi ho sakay. Server chal raha hai?');
    } finally {
      setLoading(false);
    }
  };

  // Load on page mount
  useEffect(() => {
    fetchCourses();
  }, []);

  // ============ FORM HANDLERS ============

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'courseCategory' && value === 'Regular') {
      setFormData({ ...formData, courseCategory: value, platform: '' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFilterChange = (e) => setFilter({ ...filter, [e.target.name]: e.target.value });

  // Add or Update course
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.courseCategory === 'E-Commerce' && !formData.platform) {
      alert('E-Commerce ke liye Platform select karein!');
      return;
    }

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData);
        alert('Course Updated Successfully!');
        setEditingId(null);
      } else {
        await axios.post(API_URL, formData);
        alert('Course Added Successfully!');
      }
      setFormData({ courseCategory: '', courseName: '', platform: '', duration: '', totalFee: '', description: '' });
      fetchCourses();
    } catch (err) {
      console.log(err);
      alert('Error: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleEdit = (c) => {
    setFormData({
      courseCategory: c.courseCategory, courseName: c.courseName,
      platform: c.platform || '', duration: c.duration,
      totalFee: c.totalFee, description: c.description || ''
    });
    setEditingId(c._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      alert('Course Deleted!');
      fetchCourses();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ courseCategory: '', courseName: '', platform: '', duration: '', totalFee: '', description: '' });
  };

  // ============ FILTERS & SUMMARIES ============

  const filteredCourses = useMemo(() => courses.filter((c) => {
    const mCat = filter.category ? c.courseCategory === filter.category : true;
    const mPlat = filter.platform ? c.platform === filter.platform : true;
    return mCat && mPlat;
  }), [courses, filter]);

  const totalFeeSum = useMemo(() => filteredCourses.reduce((sum, c) => sum + Number(c.totalFee || 0), 0), [filteredCourses]);
  const regularCount = courses.filter(c => c.courseCategory === 'Regular').length;
  const ecommerceCount = courses.filter(c => c.courseCategory === 'E-Commerce').length;

  // ============ RENDER ============

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Courses Management</h2>
          <p className="text-gray-500 text-sm">Database se connected - sab data cloud mein save hoga</p>
        </div>
        <button onClick={() => window.print()} className="bg-[#1e3a8a] text-white px-4 py-2 rounded-lg hover:bg-[#1e40af] no-print">Print Sheet</button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 no-print">
        <div className="bg-[#1e3a8a] text-white p-5 rounded-xl shadow-md"><p className="text-sm opacity-90">Total Courses</p><p className="text-2xl font-bold mt-1">{courses.length}</p></div>
        <div className="bg-teal-600 text-white p-5 rounded-xl shadow-md"><p className="text-sm opacity-90">Regular</p><p className="text-2xl font-bold mt-1">{regularCount}</p></div>
        <div className="bg-purple-600 text-white p-5 rounded-xl shadow-md"><p className="text-sm opacity-90">E-Commerce</p><p className="text-2xl font-bold mt-1">{ecommerceCount}</p></div>
        <div className="bg-orange-600 text-white p-5 rounded-xl shadow-md"><p className="text-sm opacity-90">Total Fee Sum</p><p className="text-2xl font-bold mt-1">Rs. {totalFeeSum.toLocaleString()}</p></div>
      </div>

      {/* Form */}
      <div className="bg-white p-6 rounded-xl shadow-md no-print">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700">{editingId ? 'Edit Course' : 'Add New Course'}</h3>
          {editingId && <button onClick={handleCancelEdit} className="text-sm text-red-600 hover:underline">Cancel Edit</button>}
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select name="courseCategory" value={formData.courseCategory} onChange={handleChange} required className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#1e3a8a]">
            <option value="">Select Category</option>
            <option value="Regular">Regular Course</option>
            <option value="E-Commerce">E-Commerce Course</option>
          </select>
          {formData.courseCategory === 'Regular' ? (
            <select name="courseName" value={formData.courseName} onChange={handleChange} required className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#1e3a8a]">
              <option value="">Select Course</option>
              {regularCoursesList.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          ) : (
            <input type="text" name="courseName" placeholder="Course Name" value={formData.courseName} onChange={handleChange} required className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#1e3a8a]" />
          )}
          {formData.courseCategory === 'E-Commerce' ? (
            <select name="platform" value={formData.platform} onChange={handleChange} required className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#1e3a8a]">
              <option value="">Select Platform</option>
              {platformsList.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          ) : (
            <input type="text" placeholder="N/A for Regular" disabled className="border border-gray-300 p-3 rounded-lg bg-gray-100" />
          )}
          <input type="text" name="duration" placeholder="Duration" value={formData.duration} onChange={handleChange} required className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#1e3a8a]" />
          <input type="number" name="totalFee" placeholder="Total Fee (Rs.)" value={formData.totalFee} onChange={handleChange} required className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#1e3a8a]" />
          <input type="text" name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#1e3a8a]" />
          <button type="submit" className={`md:col-span-3 text-white py-3 rounded-lg ${editingId ? 'bg-green-600 hover:bg-green-700' : 'bg-[#1e3a8a] hover:bg-[#1e40af]'}`}>
            {editingId ? 'Update Course' : 'Add Course'}
          </button>
        </form>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-md flex flex-wrap gap-3 items-center no-print">
        <h3 className="text-md font-semibold text-gray-700">Filter:</h3>
        <select name="category" value={filter.category} onChange={handleFilterChange} className="border border-gray-300 p-2 rounded-lg text-sm">
          <option value="">All Categories</option><option value="Regular">Regular</option><option value="E-Commerce">E-Commerce</option>
        </select>
        <select name="platform" value={filter.platform} onChange={handleFilterChange} className="border border-gray-300 p-2 rounded-lg text-sm">
          <option value="">All Platforms</option>{platformsList.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white p-6 rounded-xl shadow-md" id="print-area">
        <div className="text-center mb-4 print-header">
          <h3 className="text-xl font-bold">GUJRAT IT CENTRE</h3>
          <p className="text-sm text-gray-600">Courses List</p>
          <p className="text-xs text-gray-500">Generated: {new Date().toLocaleDateString()}</p>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <p className="text-center text-gray-500 p-6">Loading courses...</p>
          ) : (
            <table className="w-full text-left text-sm excel-table">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border border-gray-400 text-center">S.No</th>
                  <th className="p-2 border border-gray-400">Category</th>
                  <th className="p-2 border border-gray-400">Course Name</th>
                  <th className="p-2 border border-gray-400">Platform</th>
                  <th className="p-2 border border-gray-400">Duration</th>
                  <th className="p-2 border border-gray-400">Total Fee</th>
                  <th className="p-2 border border-gray-400">Description</th>
                  <th className="p-2 border border-gray-400 text-center no-print">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.length === 0 ? (
                  <tr><td colSpan="8" className="p-6 text-center text-gray-500 border border-gray-400">No courses found. Add your first course above!</td></tr>
                ) : (
                  filteredCourses.map((c, i) => (
                    <tr key={c._id} className="hover:bg-gray-50">
                      <td className="p-2 border border-gray-400 text-center">{i + 1}</td>
                      <td className="p-2 border border-gray-400">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${c.courseCategory === 'Regular' ? 'bg-teal-100 text-teal-700' : 'bg-purple-100 text-purple-700'}`}>{c.courseCategory}</span>
                      </td>
                      <td className="p-2 border border-gray-400 font-semibold">{c.courseName}</td>
                      <td className="p-2 border border-gray-400">{c.platform ? <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${platformColors[c.platform] || 'bg-gray-500'}`}>{c.platform}</span> : <span className="text-gray-400">-</span>}</td>
                      <td className="p-2 border border-gray-400">{c.duration}</td>
                      <td className="p-2 border border-gray-400 text-blue-600 font-semibold">Rs. {Number(c.totalFee).toLocaleString()}</td>
                      <td className="p-2 border border-gray-400 text-gray-600">{c.description || '-'}</td>
                      <td className="p-2 border border-gray-400 text-center no-print">
                        <button onClick={() => handleEdit(c)} className="text-blue-600 hover:underline text-xs mr-2">Edit</button>
                        <button onClick={() => handleDelete(c._id)} className="text-red-600 hover:underline text-xs">Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {filteredCourses.length > 0 && (
                <tfoot>
                  <tr className="bg-gray-800 text-white font-bold">
                    <td className="p-2 border border-gray-400" colSpan="5">TOTAL ({filteredCourses.length} Courses)</td>
                    <td className="p-2 border border-gray-400">Rs. {totalFeeSum.toLocaleString()}</td>
                    <td className="p-2 border border-gray-400 no-print" colSpan="2"></td>
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

export default Courses;