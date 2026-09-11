import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/student-visiting';

const StudentVisiting = () => {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: '', studentName: '', contactNumber: '', reference: '', classMode: 'Physical', admissionDone: 'No'
  });
  const [filter, setFilter] = useState({ reference: '', classMode: '', admissionDone: '' });

  const referencesList = ['Facebook Ad', 'Instagram Ad', 'TikTok Ad', 'Google Ad', 'Friend Reference', 'Family Reference', 'Walk-in', 'WhatsApp', 'Other'];
  const classModeOptions = ['Online', 'Physical', 'Hybrid'];

  const classModeColors = {
    'Online': 'bg-cyan-100 text-cyan-700', 'Physical': 'bg-orange-100 text-orange-700', 'Hybrid': 'bg-purple-100 text-purple-700'
  };

  // API CALLS
  const fetchVisitors = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setVisitors(res.data);
    } catch (err) {
      console.log(err.message);
      alert('Visitors load nahi ho sakay. Server chal raha hai?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVisitors(); }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFilterChange = (e) => setFilter({ ...filter, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, formData);
      alert('Visitor Record Saved!');
      setFormData({ date: '', studentName: '', contactNumber: '', reference: '', classMode: 'Physical', admissionDone: 'No' });
      fetchVisitors();
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this visitor record?')) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchVisitors();
    } catch (err) { alert('Error: ' + err.message); }
  };

  const filteredVisitors = useMemo(() => visitors.filter((v) => {
    const mRef = filter.reference ? v.reference === filter.reference : true;
    const mMode = filter.classMode ? v.classMode === filter.classMode : true;
    const mAdm = filter.admissionDone ? v.admissionDone === filter.admissionDone : true;
    return mRef && mMode && mAdm;
  }), [visitors, filter]);

  // Auto Summary
  const totalVisitors = visitors.length;
  const admissionDone = visitors.filter(v => v.admissionDone === 'Yes').length;
  const admissionPending = visitors.filter(v => v.admissionDone === 'No').length;
  const onlineCount = visitors.filter(v => v.classMode === 'Online').length;
  const physicalCount = visitors.filter(v => v.classMode === 'Physical').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Student Visiting Form</h2>
          <p className="text-gray-500 text-sm">Database se connected</p>
        </div>
        <button onClick={() => window.print()} className="bg-[#1e3a8a] text-white px-4 py-2 rounded-lg hover:bg-[#1e40af] no-print">Print Sheet</button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 no-print">
        <div className="bg-[#1e3a8a] text-white p-4 rounded-xl shadow-md"><p className="text-xs opacity-90">Total Visitors</p><p className="text-2xl font-bold mt-1">{totalVisitors}</p></div>
        <div className="bg-green-600 text-white p-4 rounded-xl shadow-md"><p className="text-xs opacity-90">Admission Done</p><p className="text-2xl font-bold mt-1">{admissionDone}</p></div>
        <div className="bg-orange-500 text-white p-4 rounded-xl shadow-md"><p className="text-xs opacity-90">Pending</p><p className="text-2xl font-bold mt-1">{admissionPending}</p></div>
        <div className="bg-cyan-600 text-white p-4 rounded-xl shadow-md"><p className="text-xs opacity-90">Online</p><p className="text-2xl font-bold mt-1">{onlineCount}</p></div>
        <div className="bg-orange-700 text-white p-4 rounded-xl shadow-md"><p className="text-xs opacity-90">Physical</p><p className="text-2xl font-bold mt-1">{physicalCount}</p></div>
      </div>

      {/* Form */}
      <div className="bg-white p-6 rounded-xl shadow-md no-print">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Add Visiting Record</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="date" name="date" value={formData.date} onChange={handleChange} required className="border border-gray-300 p-3 rounded-lg" />
          <input type="text" name="studentName" placeholder="Student Name" value={formData.studentName} onChange={handleChange} required className="border border-gray-300 p-3 rounded-lg" />
          <input type="text" name="contactNumber" placeholder="Contact Number" value={formData.contactNumber} onChange={handleChange} required className="border border-gray-300 p-3 rounded-lg" />
          <select name="reference" value={formData.reference} onChange={handleChange} required className="border border-gray-300 p-3 rounded-lg">
            <option value="">Select Reference</option>
            {referencesList.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <select name="classMode" value={formData.classMode} onChange={handleChange} className="border border-gray-300 p-3 rounded-lg">
            {classModeOptions.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <select name="admissionDone" value={formData.admissionDone} onChange={handleChange} className="border border-gray-300 p-3 rounded-lg">
            <option value="No">Admission Not Done</option>
            <option value="Yes">Admission Done</option>
          </select>
          <button type="submit" className="md:col-span-3 bg-[#1e3a8a] text-white py-3 rounded-lg hover:bg-[#1e40af]">Add Visitor</button>
        </form>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-md flex flex-wrap gap-3 items-center no-print">
        <h3 className="text-md font-semibold text-gray-700">Filter:</h3>
        <select name="reference" value={filter.reference} onChange={handleFilterChange} className="border border-gray-300 p-2 rounded-lg text-sm">
          <option value="">All References</option>{referencesList.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        <select name="classMode" value={filter.classMode} onChange={handleFilterChange} className="border border-gray-300 p-2 rounded-lg text-sm">
          <option value="">All Modes</option>{classModeOptions.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
        <select name="admissionDone" value={filter.admissionDone} onChange={handleFilterChange} className="border border-gray-300 p-2 rounded-lg text-sm">
          <option value="">All Status</option><option value="Yes">Admission Done</option><option value="No">Pending</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white p-6 rounded-xl shadow-md" id="print-area">
        <div className="text-center mb-4 print-header">
          <h3 className="text-xl font-bold">GUJRAT IT CENTRE</h3>
          <p className="text-sm text-gray-600">Student Visiting Sheet</p>
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
                  <th className="p-2 border border-gray-400">Contact</th>
                  <th className="p-2 border border-gray-400">Reference</th>
                  <th className="p-2 border border-gray-400">Class Mode</th>
                  <th className="p-2 border border-gray-400">Admission</th>
                  <th className="p-2 border border-gray-400 text-center no-print">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVisitors.length === 0 ? (
                  <tr><td colSpan="8" className="p-6 text-center text-gray-500 border border-gray-400">No visiting records found. Add your first record!</td></tr>
                ) : (
                  filteredVisitors.map((v, i) => (
                    <tr key={v._id} className="hover:bg-gray-50">
                      <td className="p-2 border border-gray-400 text-center">{i + 1}</td>
                      <td className="p-2 border border-gray-400">{v.date}</td>
                      <td className="p-2 border border-gray-400 font-semibold">{v.studentName}</td>
                      <td className="p-2 border border-gray-400">{v.contactNumber}</td>
                      <td className="p-2 border border-gray-400">{v.reference}</td>
                      <td className="p-2 border border-gray-400"><span className={`px-2 py-1 rounded text-xs font-semibold ${classModeColors[v.classMode]}`}>{v.classMode}</span></td>
                      <td className="p-2 border border-gray-400">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${v.admissionDone === 'Yes' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                          {v.admissionDone === 'Yes' ? 'Done' : 'Pending'}
                        </span>
                      </td>
                      <td className="p-2 border border-gray-400 text-center no-print">
                        <button onClick={() => handleDelete(v._id)} className="text-red-600 hover:underline text-xs">Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentVisiting;