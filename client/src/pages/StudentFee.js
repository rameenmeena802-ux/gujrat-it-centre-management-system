import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

const API_URL = 'https://gujrat-it-centre-management-system.onrender.com/api/student-fee';

const StudentFee = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [formData, setFormData] = useState({
    date: '', voucherNo: '', studentName: '', regNo: '', fatherName: '',
    studentContact: '', guardianContact: '', course: '', classMode: 'Physical',
    totalCourseFee: '', admissionFee: '', installment1: '', installment2: '', installment3: ''
  });
  const [filter, setFilter] = useState({ course: '', status: '', classMode: '' });

  const coursesList = [
    'Web Development', 'Digital Marketing', 'Graphic Designing',
    'Computer Basic', 'IT for Kids', 'Video Editing', 'WordPress',
    'E-Commerce - Daraz', 'E-Commerce - Shopify', 'E-Commerce - Amazon',
    'E-Commerce - eBay', 'E-Commerce - Etsy', 'E-Commerce - OnBuy',
    'E-Commerce - WooCommerce', 'E-Commerce - TikTok Shop'
  ];
  const classModeOptions = ['Online', 'Physical', 'Hybrid'];

  const classModeColors = {
    'Online': 'bg-cyan-100 text-cyan-700',
    'Physical': 'bg-orange-100 text-orange-700',
    'Hybrid': 'bg-purple-100 text-purple-700'
  };
  const statusColors = {
    Paid: 'bg-green-100 text-green-700',
    Partial: 'bg-orange-100 text-orange-700',
    Unpaid: 'bg-red-100 text-red-700'
  };

  // ============ API CALLS ============
  const fetchFees = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setStudents(res.data);
    } catch (err) {
      console.log('Error:', err.message);
      alert('Fee records load nahi ho sakay');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFees(); }, []);

  // ============ AUTO CALCULATIONS ============
  const calculatePaidFee = (s) =>
    Number(s.admissionFee || 0) +
    Number(s.installment1 || 0) +
    Number(s.installment2 || 0) +
    Number(s.installment3 || 0);

  const calculateRemaining = (s) => Number(s.totalCourseFee || 0) - calculatePaidFee(s);

  const getFeeStatus = (s) => {
    const rem = calculateRemaining(s);
    if (rem <= 0) return 'Paid';
    if (calculatePaidFee(s) > 0) return 'Partial';
    return 'Unpaid';
  };

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
        totalCourseFee: Number(formData.totalCourseFee),
        admissionFee: Number(formData.admissionFee) || 0,
        installment1: Number(formData.installment1) || 0,
        installment2: Number(formData.installment2) || 0,
        installment3: Number(formData.installment3) || 0
      });
      alert('Student Fee Record Added!');
      setFormData({
        date: '', voucherNo: '', studentName: '', regNo: '', fatherName: '',
        studentContact: '', guardianContact: '', course: '', classMode: 'Physical',
        totalCourseFee: '', admissionFee: '', installment1: '', installment2: '', installment3: ''
      });
      fetchFees();
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this fee record?')) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchFees();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  // ============ EDIT HANDLERS ============
  const handleEditClick = (student) => {
    setEditingId(student._id);
    setEditData({
      date: student.date || '',
      voucherNo: student.voucherNo || '',
      studentName: student.studentName || '',
      regNo: student.regNo || '',
      fatherName: student.fatherName || '',
      studentContact: student.studentContact || '',
      guardianContact: student.guardianContact || '',
      course: student.course || '',
      classMode: student.classMode || 'Physical',
      totalCourseFee: student.totalCourseFee || 0,
      admissionFee: student.admissionFee || 0,
      installment1: student.installment1 || 0,
      installment2: student.installment2 || 0,
      installment3: student.installment3 || 0
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
        totalCourseFee: Number(editData.totalCourseFee),
        admissionFee: Number(editData.admissionFee) || 0,
        installment1: Number(editData.installment1) || 0,
        installment2: Number(editData.installment2) || 0,
        installment3: Number(editData.installment3) || 0
      });
      alert('Fee Record Updated Successfully!');
      setShowEditModal(false);
      setEditingId(null);
      fetchFees();
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || err.message));
    }
  };

  // ============ FILTERS & SUMMARIES ============
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchCourse = filter.course ? s.course === filter.course : true;
      const matchStatus = filter.status ? getFeeStatus(s) === filter.status : true;
      const matchMode = filter.classMode ? s.classMode === filter.classMode : true;
      return matchCourse && matchStatus && matchMode;
    });
  }, [students, filter]);

  const summary = useMemo(() => {
    const totalFee = filteredStudents.reduce((sum, s) => sum + Number(s.totalCourseFee || 0), 0);
    const totalPaid = filteredStudents.reduce((sum, s) => sum + calculatePaidFee(s), 0);
    const onlineCount = filteredStudents.filter(s => s.classMode === 'Online').length;
    const physicalCount = filteredStudents.filter(s => s.classMode === 'Physical').length;
    return { totalFee, totalPaid, totalRemaining: totalFee - totalPaid, onlineCount, physicalCount };
  }, [filteredStudents]);

  const handlePrint = () => window.print();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Student Fee Management</h2>
          <p className="text-gray-500 text-sm">Database se connected — Auto remaining fee</p>
        </div>
        <button onClick={handlePrint} className="bg-[#1e3a8a] text-white px-4 py-2 rounded-lg hover:bg-[#1e40af] no-print">
          Print Sheet
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 no-print">
        <div className="bg-blue-600 text-white p-4 rounded-xl shadow-md">
          <p className="text-xs opacity-90">Total Fee</p>
          <p className="text-xl font-bold mt-1">Rs. {summary.totalFee.toLocaleString()}</p>
        </div>
        <div className="bg-green-600 text-white p-4 rounded-xl shadow-md">
          <p className="text-xs opacity-90">Collected</p>
          <p className="text-xl font-bold mt-1">Rs. {summary.totalPaid.toLocaleString()}</p>
        </div>
        <div className="bg-red-600 text-white p-4 rounded-xl shadow-md">
          <p className="text-xs opacity-90">Pending</p>
          <p className="text-xl font-bold mt-1">Rs. {summary.totalRemaining.toLocaleString()}</p>
        </div>
        <div className="bg-cyan-600 text-white p-4 rounded-xl shadow-md">
          <p className="text-xs opacity-90">Online</p>
          <p className="text-xl font-bold mt-1">{summary.onlineCount}</p>
        </div>
        <div className="bg-orange-600 text-white p-4 rounded-xl shadow-md">
          <p className="text-xs opacity-90">Physical</p>
          <p className="text-xl font-bold mt-1">{summary.physicalCount}</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white p-6 rounded-xl shadow-md no-print">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Add New Fee Record</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="date" name="date" value={formData.date} onChange={handleChange} required className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#1e3a8a]" />
          <input type="text" name="voucherNo" placeholder="Voucher Number" value={formData.voucherNo} onChange={handleChange} className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#1e3a8a]" />
          <input type="text" name="studentName" placeholder="Student Name" value={formData.studentName} onChange={handleChange} required className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#1e3a8a]" />
          <input type="text" name="regNo" placeholder="Reg No" value={formData.regNo} onChange={handleChange} required className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#1e3a8a]" />
          <input type="text" name="fatherName" placeholder="Father Name" value={formData.fatherName} onChange={handleChange} required className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#1e3a8a]" />
          <input type="text" name="studentContact" placeholder="Student Contact" value={formData.studentContact} onChange={handleChange} required className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#1e3a8a]" />
          <input type="text" name="guardianContact" placeholder="Guardian Contact" value={formData.guardianContact} onChange={handleChange} required className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#1e3a8a]" />
          <select name="course" value={formData.course} onChange={handleChange} required className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#1e3a8a]">
            <option value="">Select Course</option>
            {coursesList.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select name="classMode" value={formData.classMode} onChange={handleChange} className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#1e3a8a]">
            {classModeOptions.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <input type="number" name="totalCourseFee" placeholder="Total Course Fee (Rs.)" value={formData.totalCourseFee} onChange={handleChange} required className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#1e3a8a]" />
          <input type="number" name="admissionFee" placeholder="Admission Fee (Rs.)" value={formData.admissionFee} onChange={handleChange} required className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#1e3a8a]" />
          <input type="number" name="installment1" placeholder="1st Installment (Rs.)" value={formData.installment1} onChange={handleChange} className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#1e3a8a]" />
          <input type="number" name="installment2" placeholder="2nd Installment (Rs.)" value={formData.installment2} onChange={handleChange} className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#1e3a8a]" />
          <input type="number" name="installment3" placeholder="3rd Installment (Rs.)" value={formData.installment3} onChange={handleChange} className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#1e3a8a]" />
          <button type="submit" className="md:col-span-3 bg-[#1e3a8a] text-white py-3 rounded-lg hover:bg-[#1e40af] transition">
            Add Fee Record
          </button>
        </form>
      </div>

      {/* Filters */}
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
        <select name="status" value={filter.status} onChange={handleFilterChange} className="border border-gray-300 p-2 rounded-lg text-sm">
          <option value="">All Status</option>
          <option value="Paid">Paid</option>
          <option value="Partial">Partial</option>
          <option value="Unpaid">Unpaid</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white p-6 rounded-xl shadow-md" id="print-area">
        <div className="text-center mb-4 print-header">
          <h3 className="text-xl font-bold text-gray-800">GUJRAT IT CENTRE</h3>
          <p className="text-sm text-gray-600">Student Fee Collection Sheet</p>
          <p className="text-xs text-gray-500">Generated: {new Date().toLocaleDateString()}</p>
        </div>
        <div className="overflow-x-auto">
          {loading ? <p className="text-center p-6 text-gray-500">Loading...</p> : (
            <table className="w-full text-left text-[10px] excel-table">
              <thead>
                <tr className="bg-gray-200 text-gray-800">
                  <th className="p-2 border border-gray-400 text-center font-bold">S.No</th>
                  <th className="p-2 border border-gray-400 font-bold">Voucher No</th>
                  <th className="p-2 border border-gray-400 font-bold">Reg No</th>
                  <th className="p-2 border border-gray-400 font-bold">Student Name</th>
                  <th className="p-2 border border-gray-400 font-bold">Father Name</th>
                  <th className="p-2 border border-gray-400 font-bold">Course</th>
                  <th className="p-2 border border-gray-400 font-bold">Mode</th>
                  <th className="p-2 border border-gray-400 font-bold">Contact</th>
                  <th className="p-2 border border-gray-400 font-bold">Total Fee</th>
                  <th className="p-2 border border-gray-400 font-bold">Admission</th>
                  <th className="p-2 border border-gray-400 font-bold">1st Inst.</th>
                  <th className="p-2 border border-gray-400 font-bold">2nd Inst.</th>
                  <th className="p-2 border border-gray-400 font-bold">3rd Inst.</th>
                  <th className="p-2 border border-gray-400 font-bold">Total Paid</th>
                  <th className="p-2 border border-gray-400 font-bold">Remaining</th>
                  <th className="p-2 border border-gray-400 font-bold">Status</th>
                  <th className="p-2 border border-gray-400 text-center font-bold no-print">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr><td colSpan="17" className="p-3 text-center text-gray-500 border border-gray-400">No records found. Add your first fee record!</td></tr>
                ) : (
                  filteredStudents.map((s, index) => {
                    const paid = calculatePaidFee(s);
                    const remaining = calculateRemaining(s);
                    const status = getFeeStatus(s);
                    return (
                      <tr key={s._id} className="hover:bg-gray-50">
                        <td className="p-2 border border-gray-400 text-center">{index + 1}</td>
                        <td className="p-2 border border-gray-400 font-semibold text-purple-700">{s.voucherNo || '-'}</td>
                        <td className="p-2 border border-gray-400 font-semibold text-[#1e3a8a]">{s.regNo}</td>
                        <td className="p-2 border border-gray-400 font-semibold">{s.studentName}</td>
                        <td className="p-2 border border-gray-400">{s.fatherName}</td>
                        <td className="p-2 border border-gray-400">{s.course}</td>
                        <td className="p-2 border border-gray-400">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${classModeColors[s.classMode]}`}>{s.classMode}</span>
                        </td>
                        <td className="p-2 border border-gray-400">{s.studentContact}</td>
                        <td className="p-2 border border-gray-400">Rs. {Number(s.totalCourseFee).toLocaleString()}</td>
                        <td className="p-2 border border-gray-400">Rs. {Number(s.admissionFee).toLocaleString()}</td>
                        <td className="p-2 border border-gray-400">Rs. {Number(s.installment1 || 0).toLocaleString()}</td>
                        <td className="p-2 border border-gray-400">Rs. {Number(s.installment2 || 0).toLocaleString()}</td>
                        <td className="p-2 border border-gray-400">Rs. {Number(s.installment3 || 0).toLocaleString()}</td>
                        <td className="p-2 border border-gray-400 text-green-600 font-semibold">Rs. {paid.toLocaleString()}</td>
                        <td className="p-2 border border-gray-400 text-red-600 font-semibold">Rs. {remaining.toLocaleString()}</td>
                        <td className="p-2 border border-gray-400">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[status]}`}>{status}</span>
                        </td>
                        <td className="p-2 border border-gray-400 text-center no-print">
                          <button onClick={() => handleEditClick(s)} className="text-blue-600 hover:underline text-xs mr-2">Edit</button>
                          <button onClick={() => handleDelete(s._id)} className="text-red-600 hover:underline text-xs">Delete</button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
              {filteredStudents.length > 0 && (
                <tfoot>
                  <tr className="bg-gray-800 text-white font-bold">
                    <td className="p-2 border border-gray-400" colSpan="8">TOTAL ({filteredStudents.length} Students)</td>
                    <td className="p-2 border border-gray-400">Rs. {summary.totalFee.toLocaleString()}</td>
                    <td className="p-2 border border-gray-400" colSpan="4"></td>
                    <td className="p-2 border border-gray-400 text-green-300">Rs. {summary.totalPaid.toLocaleString()}</td>
                    <td className="p-2 border border-gray-400 text-red-300">Rs. {summary.totalRemaining.toLocaleString()}</td>
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
              <h3 className="text-xl font-bold">Edit Fee Record</h3>
              <button onClick={() => setShowEditModal(false)} className="bg-white bg-opacity-20 hover:bg-opacity-40 rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold">×</button>
            </div>
            <form onSubmit={handleUpdateSubmit} className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Date</label>
                <input type="date" name="date" value={editData.date} onChange={handleEditChange} className="w-full border border-gray-300 p-3 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Voucher No</label>
                <input type="text" name="voucherNo" value={editData.voucherNo} onChange={handleEditChange} className="w-full border border-gray-300 p-3 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Student Name</label>
                <input type="text" name="studentName" value={editData.studentName} onChange={handleEditChange} className="w-full border border-gray-300 p-3 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Reg No</label>
                <input type="text" name="regNo" value={editData.regNo} onChange={handleEditChange} className="w-full border border-gray-300 p-3 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Father Name</label>
                <input type="text" name="fatherName" value={editData.fatherName} onChange={handleEditChange} className="w-full border border-gray-300 p-3 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Student Contact</label>
                <input type="text" name="studentContact" value={editData.studentContact} onChange={handleEditChange} className="w-full border border-gray-300 p-3 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Guardian Contact</label>
                <input type="text" name="guardianContact" value={editData.guardianContact} onChange={handleEditChange} className="w-full border border-gray-300 p-3 rounded-lg" />
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
                <label className="block text-sm font-medium text-gray-600 mb-1">Total Course Fee</label>
                <input type="number" name="totalCourseFee" value={editData.totalCourseFee} onChange={handleEditChange} className="w-full border border-gray-300 p-3 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Admission Fee</label>
                <input type="number" name="admissionFee" value={editData.admissionFee} onChange={handleEditChange} className="w-full border border-gray-300 p-3 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">1st Installment</label>
                <input type="number" name="installment1" value={editData.installment1} onChange={handleEditChange} className="w-full border border-gray-300 p-3 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">2nd Installment</label>
                <input type="number" name="installment2" value={editData.installment2} onChange={handleEditChange} className="w-full border border-gray-300 p-3 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">3rd Installment</label>
                <input type="number" name="installment3" value={editData.installment3} onChange={handleEditChange} className="w-full border border-gray-300 p-3 rounded-lg" />
              </div>
              <div className="md:col-span-3 flex gap-3 mt-2">
                <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 font-semibold">
                  Cancel
                </button>
                <button type="submit" className="flex-1 bg-[#1e3a8a] text-white py-3 rounded-lg hover:bg-[#1e40af] font-semibold">
                  Update Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentFee;