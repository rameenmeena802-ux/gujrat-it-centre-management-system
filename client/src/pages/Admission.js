import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

const API_URL = 'https://gujrat-it-centre-management-system.onrender.com/api/students';

const Admission = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [formData, setFormData] = useState({
    date: '', studentName: '', rollNo: '', fatherName: '', contact: '',
    course: '', classMode: 'Physical', classTiming: 'Morning',
    totalFee: '', admissionFee: '', paidFee: '', status: 'Active'
  });

  const [filter, setFilter] = useState({
    course: '', classMode: '', classTiming: '', status: ''
  });

  const coursesList = [
    'Web Development', 'Digital Marketing', 'Graphic Designing',
    'Computer Basic', 'IT for Kids', 'Video Editing', 'WordPress',
    'E-Commerce - Daraz', 'E-Commerce - Shopify', 'E-Commerce - Amazon',
    'E-Commerce - eBay', 'E-Commerce - Etsy', 'E-Commerce - OnBuy',
    'E-Commerce - WooCommerce', 'E-Commerce - TikTok Shop'
  ];

  const classModeOptions = ['Online', 'Physical', 'Hybrid'];
  const classTimingOptions = ['Morning', 'Afternoon', 'Evening', 'Weekend'];

  // ============ FETCH STUDENTS ============
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setStudents(res.data);
    } catch (err) {
      console.log('Error:', err.message);
      alert('Students load nahi ho sakay. Server chal raha hai?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // ============ FORM HANDLERS ============
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, {
        ...formData,
        totalFee: Number(formData.totalFee),
        admissionFee: Number(formData.admissionFee) || 0,
        paidFee: Number(formData.paidFee) || 0
      });
      alert('Student Added Successfully!');
      setFormData({
        date: '', studentName: '', rollNo: '', fatherName: '', contact: '',
        course: '', classMode: 'Physical', classTiming: 'Morning',
        totalFee: '', admissionFee: '', paidFee: '', status: 'Active'
      });
      fetchStudents();
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student?')) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchStudents();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  // ============ EDIT HANDLERS ============
  const handleEditClick = (student) => {
    setEditingId(student._id);
    setEditData({
      date: student.date || '',
      studentName: student.studentName || '',
      rollNo: student.rollNo || '',
      fatherName: student.fatherName || '',
      contact: student.contact || '',
      course: student.course || '',
      classMode: student.classMode || 'Physical',
      classTiming: student.classTiming || 'Morning',
      totalFee: student.totalFee || 0,
      admissionFee: student.admissionFee || 0,
      paidFee: student.paidFee || 0,
      status: student.status || 'Active'
    });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/${editingId}`, {
        ...editData,
        totalFee: Number(editData.totalFee),
        admissionFee: Number(editData.admissionFee) || 0,
        paidFee: Number(editData.paidFee) || 0
      });
      alert('Student Updated Successfully!');
      setShowEditModal(false);
      setEditingId(null);
      fetchStudents();
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || err.message));
    }
  };

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchCourse = filter.course ? s.course === filter.course : true;
      const matchMode = filter.classMode ? s.classMode === filter.classMode : true;
      const matchTiming = filter.classTiming ? s.classTiming === filter.classTiming : true;
      const matchStatus = filter.status ? s.status === filter.status : true;
      return matchCourse && matchMode && matchTiming && matchStatus;
    });
  }, [students, filter]);

  // AUTO CALCULATIONS
  const totalStudents = students.length;
  const onlineCount = students.filter(s => s.classMode === 'Online').length;
  const physicalCount = students.filter(s => s.classMode === 'Physical').length;
  const hybridCount = students.filter(s => s.classMode === 'Hybrid').length;

  const classModeColors = {
    'Online': 'bg-cyan-100 text-cyan-700',
    'Physical': 'bg-orange-100 text-orange-700',
    'Hybrid': 'bg-purple-100 text-purple-700'
  };

  const timingColors = {
    'Morning': 'bg-yellow-100 text-yellow-700',
    'Afternoon': 'bg-orange-100 text-orange-700',
    'Evening': 'bg-indigo-100 text-indigo-700',
    'Weekend': 'bg-pink-100 text-pink-700'
  };

  const handlePrint = () => window.print();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Student Admission</h2>
          <p className="text-gray-500 text-sm">Database se connected</p>
        </div>
        <button onClick={handlePrint} className="bg-[#1e3a8a] text-white px-4 py-2 rounded-lg hover:bg-[#1e40af] no-print">
          Print Sheet
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 no-print">
        <div className="bg-[#1e3a8a] text-white p-5 rounded-xl shadow-md">
          <p className="text-sm opacity-90">Total Students</p>
          <p className="text-2xl font-bold mt-1">{totalStudents}</p>
        </div>
        <div className="bg-cyan-600 text-white p-5 rounded-xl shadow-md">
          <p className="text-sm opacity-90">Online Students</p>
          <p className="text-2xl font-bold mt-1">{onlineCount}</p>
        </div>
        <div className="bg-orange-600 text-white p-5 rounded-xl shadow-md">
          <p className="text-sm opacity-90">Physical Students</p>
          <p className="text-2xl font-bold mt-1">{physicalCount}</p>
        </div>
        <div className="bg-purple-600 text-white p-5 rounded-xl shadow-md">
          <p className="text-sm opacity-90">Hybrid Students</p>
          <p className="text-2xl font-bold mt-1">{hybridCount}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md no-print">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Add New Student</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="date" name="date" value={formData.date} onChange={handleChange} required className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]" />
          <input type="text" name="studentName" placeholder="Student Name" value={formData.studentName} onChange={handleChange} required className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]" />
          <input type="text" name="rollNo" placeholder="Roll No (e.g. IT-004)" value={formData.rollNo} onChange={handleChange} required className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]" />
          <input type="text" name="fatherName" placeholder="Father Name" value={formData.fatherName} onChange={handleChange} required className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]" />
          <input type="text" name="contact" placeholder="Contact Number" value={formData.contact} onChange={handleChange} required className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]" />
          <select name="course" value={formData.course} onChange={handleChange} required className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]">
            <option value="">Select Course</option>
            {coursesList.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select name="classMode" value={formData.classMode} onChange={handleChange} className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]">
            {classModeOptions.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <select name="classTiming" value={formData.classTiming} onChange={handleChange} className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]">
            {classTimingOptions.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <input type="number" name="totalFee" placeholder="Total Fee (Rs.)" value={formData.totalFee} onChange={handleChange} required className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]" />
          <input type="number" name="admissionFee" placeholder="Admission Fee (Rs.)" value={formData.admissionFee} onChange={handleChange} className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]" />
          <input type="number" name="paidFee" placeholder="Paid Fee (Rs.)" value={formData.paidFee} onChange={handleChange} required className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]" />
          <select name="status" value={formData.status} onChange={handleChange} className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]">
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <button type="submit" className="md:col-span-3 bg-[#1e3a8a] text-white py-3 rounded-lg hover:bg-[#1e40af] transition">
            Add Student
          </button>
        </form>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-md flex flex-wrap gap-3 items-center no-print">
        <h3 className="text-md font-semibold text-gray-700">Filter:</h3>
        <select name="course" value={filter.course} onChange={handleFilterChange} className="border border-gray-300 p-2 rounded-lg text-sm">
          <option value="">All Courses</option>
          {coursesList.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select name="classMode" value={filter.classMode} onChange={handleFilterChange} className="border border-gray-300 p-2 rounded-lg text-sm">
          <option value="">All Modes</option>
          {classModeOptions.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
        <select name="classTiming" value={filter.classTiming} onChange={handleFilterChange} className="border border-gray-300 p-2 rounded-lg text-sm">
          <option value="">All Timings</option>
          {classTimingOptions.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select name="status" value={filter.status} onChange={handleFilterChange} className="border border-gray-300 p-2 rounded-lg text-sm">
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md" id="print-area">
        <div className="text-center mb-4 print-header">
          <h3 className="text-xl font-bold text-gray-800">GUJRAT IT CENTRE</h3>
          <p className="text-sm text-gray-600">Student Admission Sheet</p>
          <p className="text-xs text-gray-500">Generated: {new Date().toLocaleDateString()}</p>
        </div>
        <div className="overflow-x-auto">
          {loading ? <p className="text-center p-6 text-gray-500">Loading...</p> : (
            <table className="w-full text-left text-sm excel-table">
              <thead>
                <tr className="bg-gray-200 text-gray-800">
                  <th className="p-2 border border-gray-400 text-center font-bold">S.No</th>
                  <th className="p-2 border border-gray-400 font-bold">Roll No</th>
                  <th className="p-2 border border-gray-400 font-bold">Student Name</th>
                  <th className="p-2 border border-gray-400 font-bold">Father Name</th>
                  <th className="p-2 border border-gray-400 font-bold">Contact</th>
                  <th className="p-2 border border-gray-400 font-bold">Course</th>
                  <th className="p-2 border border-gray-400 font-bold">Mode</th>
                  <th className="p-2 border border-gray-400 font-bold">Timing</th>
                  <th className="p-2 border border-gray-400 font-bold">Total Fee</th>
                  <th className="p-2 border border-gray-400 font-bold">Admission Fee</th>
                  <th className="p-2 border border-gray-400 font-bold">Paid</th>
                  <th className="p-2 border border-gray-400 font-bold">Remaining</th>
                  <th className="p-2 border border-gray-400 font-bold">Status</th>
                  <th className="p-2 border border-gray-400 text-center font-bold no-print">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr><td colSpan="14" className="p-3 text-center text-gray-500 border border-gray-400">No students found. Add your first student!</td></tr>
                ) : (
                  filteredStudents.map((s, index) => (
                    <tr key={s._id} className="hover:bg-gray-50">
                      <td className="p-2 border border-gray-400 text-center">{index + 1}</td>
                      <td className="p-2 border border-gray-400 font-semibold text-[#1e3a8a]">{s.rollNo}</td>
                      <td className="p-2 border border-gray-400 font-semibold">{s.studentName}</td>
                      <td className="p-2 border border-gray-400">{s.fatherName}</td>
                      <td className="p-2 border border-gray-400">{s.contact}</td>
                      <td className="p-2 border border-gray-400">{s.course}</td>
                      <td className="p-2 border border-gray-400">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${classModeColors[s.classMode]}`}>{s.classMode}</span>
                      </td>
                      <td className="p-2 border border-gray-400">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${timingColors[s.classTiming]}`}>{s.classTiming}</span>
                      </td>
                      <td className="p-2 border border-gray-400">Rs. {Number(s.totalFee).toLocaleString()}</td>
                      <td className="p-2 border border-gray-400 text-purple-600">Rs. {Number(s.admissionFee || 0).toLocaleString()}</td>
                      <td className="p-2 border border-gray-400 text-green-600 font-semibold">Rs. {Number(s.paidFee).toLocaleString()}</td>
                      <td className="p-2 border border-gray-400 text-red-600 font-semibold">Rs. {Number(s.totalFee - s.paidFee).toLocaleString()}</td>
                      <td className="p-2 border border-gray-400">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${s.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{s.status}</span>
                      </td>
                      <td className="p-2 border border-gray-400 text-center no-print">
                        <button onClick={() => handleEditClick(s)} className="text-blue-600 hover:underline text-xs mr-2">Edit</button>
                        <button onClick={() => handleDelete(s._id)} className="text-red-600 hover:underline text-xs">Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {filteredStudents.length > 0 && (
                <tfoot>
                  <tr className="bg-gray-800 text-white font-bold">
                    <td className="p-2 border border-gray-400" colSpan="8">TOTAL STUDENTS: {filteredStudents.length}</td>
                    <td className="p-2 border border-gray-400">Rs. {filteredStudents.reduce((sum, s) => sum + Number(s.totalFee), 0).toLocaleString()}</td>
                    <td className="p-2 border border-gray-400">Rs. {filteredStudents.reduce((sum, s) => sum + Number(s.admissionFee || 0), 0).toLocaleString()}</td>
                    <td className="p-2 border border-gray-400 text-green-300">Rs. {filteredStudents.reduce((sum, s) => sum + Number(s.paidFee), 0).toLocaleString()}</td>
                    <td className="p-2 border border-gray-400 text-red-300">Rs. {filteredStudents.reduce((sum, s) => sum + (Number(s.totalFee) - Number(s.paidFee)), 0).toLocaleString()}</td>
                    <td className="p-2 border border-gray-400 no-print" colSpan="2"></td>
                  </tr>
                </tfoot>
              )}
            </table>
          )}
        </div>
      </div>

      {/* ============ EDIT MODAL ============ */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999] p-4 no-print">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="bg-[#1e3a8a] text-white p-5 rounded-t-2xl flex justify-between items-center">
              <h3 className="text-xl font-bold">Edit Student</h3>
              <button onClick={() => setShowEditModal(false)} className="bg-white bg-opacity-20 hover:bg-opacity-40 rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold">×</button>
            </div>
            <form onSubmit={handleUpdateSubmit} className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Date</label>
                <input type="date" name="date" value={editData.date} onChange={handleEditChange} className="w-full border border-gray-300 p-3 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Student Name</label>
                <input type="text" name="studentName" value={editData.studentName} onChange={handleEditChange} className="w-full border border-gray-300 p-3 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Roll No</label>
                <input type="text" name="rollNo" value={editData.rollNo} onChange={handleEditChange} className="w-full border border-gray-300 p-3 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Father Name</label>
                <input type="text" name="fatherName" value={editData.fatherName} onChange={handleEditChange} className="w-full border border-gray-300 p-3 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Contact</label>
                <input type="text" name="contact" value={editData.contact} onChange={handleEditChange} className="w-full border border-gray-300 p-3 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Course</label>
                <input type="text" name="course" value={editData.course} onChange={handleEditChange} className="w-full border border-gray-300 p-3 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Class Mode</label>
                <select name="classMode" value={editData.classMode} onChange={handleEditChange} className="w-full border border-gray-300 p-3 rounded-lg">
                  {classModeOptions.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Class Timing</label>
                <select name="classTiming" value={editData.classTiming} onChange={handleEditChange} className="w-full border border-gray-300 p-3 rounded-lg">
                  {classTimingOptions.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Total Fee</label>
                <input type="number" name="totalFee" value={editData.totalFee} onChange={handleEditChange} className="w-full border border-gray-300 p-3 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Admission Fee</label>
                <input type="number" name="admissionFee" value={editData.admissionFee} onChange={handleEditChange} className="w-full border border-gray-300 p-3 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Paid Fee</label>
                <input type="number" name="paidFee" value={editData.paidFee} onChange={handleEditChange} className="w-full border border-gray-300 p-3 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                <select name="status" value={editData.status} onChange={handleEditChange} className="w-full border border-gray-300 p-3 rounded-lg">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="md:col-span-3 flex gap-3 mt-2">
                <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 font-semibold">
                  Cancel
                </button>
                <button type="submit" className="flex-1 bg-[#1e3a8a] text-white py-3 rounded-lg hover:bg-[#1e40af] font-semibold">
                  Update Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admission;