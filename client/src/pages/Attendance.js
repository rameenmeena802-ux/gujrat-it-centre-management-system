import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

const STUDENTS_URL = 'https://gujrat-it-centre-management-system.onrender.com/api/students';
const ATTENDANCE_URL = 'https://gujrat-it-centre-management-system.onrender.com/api/attendance';

const Attendance = () => {
  const [studentsList, setStudentsList] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ studentId: '', date: '', status: 'Present' });
  const [filter, setFilter] = useState({
    month: String(new Date().getMonth() + 1),
    year: String(new Date().getFullYear()),
    classMode: ''
  });
  const [bulkDate, setBulkDate] = useState('');
  const [bulkStatus, setBulkStatus] = useState({});

  const classModeOptions = ['Online', 'Physical', 'Hybrid'];
  const classModeColors = {
    'Online': 'bg-cyan-100 text-cyan-700',
    'Physical': 'bg-orange-100 text-orange-700',
    'Hybrid': 'bg-purple-100 text-purple-700'
  };

  // ============ FETCH DATA ============
  const fetchData = async () => {
    setLoading(true);
    try {
      const [sRes, aRes] = await Promise.all([
        axios.get(STUDENTS_URL),
        axios.get(ATTENDANCE_URL)
      ]);
      setStudentsList(sRes.data);
      setRecords(aRes.data);
    } catch (err) {
      console.log('Error:', err.message);
      alert('Data load nahi ho saka. Server chal raha hai?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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
    const existing = records.find(
      r => r.studentId?._id === formData.studentId && r.date === formData.date
    );
    if (existing) {
      alert('Attendance already marked for this date!');
      return;
    }
    try {
      await axios.post(ATTENDANCE_URL, formData);
      alert('Attendance Marked!');
      setFormData({ studentId: '', date: '', status: 'Present' });
      fetchData();
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || err.message));
    }
  };

  // ============ BULK UPLOAD ============
  const handleBulkUpload = async () => {
    if (!bulkDate) {
      alert('Please select a date for bulk upload!');
      return;
    }
    const newRecords = [];
    studentsList.forEach((s) => {
      const existing = records.find(r => r.studentId?._id === s._id && r.date === bulkDate);
      if (!existing) {
        newRecords.push({
          studentId: s._id,
          date: bulkDate,
          status: bulkStatus[s._id] || 'Present'
        });
      }
    });

    if (newRecords.length === 0) {
      alert('Attendance already marked for all students on this date!');
      return;
    }

    try {
      await axios.post(`${ATTENDANCE_URL}/bulk`, newRecords);
      alert(`Attendance uploaded for ${newRecords.length} students!`);
      setBulkStatus({});
      setBulkDate('');
      fetchData();
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleBulkStatusChange = (studentId, status) => {
    setBulkStatus({ ...bulkStatus, [studentId]: status });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this attendance record?')) return;
    try {
      await axios.delete(`${ATTENDANCE_URL}/${id}`);
      fetchData();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  // ============ AUTO CALCULATION ============
  const studentReport = useMemo(() => {
    return studentsList
      .filter(s => filter.classMode ? s.classMode === filter.classMode : true)
      .map((student) => {
        const studentRecords = records.filter((r) => {
          const d = new Date(r.date);
          return (
            r.studentId?._id === student._id &&
            (d.getMonth() + 1) === Number(filter.month) &&
            d.getFullYear() === Number(filter.year)
          );
        });

        const totalDays = studentRecords.length;
        const present = studentRecords.filter((r) => r.status === 'Present').length;
        const absent = studentRecords.filter((r) => r.status === 'Absent').length;
        const late = studentRecords.filter((r) => r.status === 'Late').length;
        const percentage = totalDays > 0 ? ((present / totalDays) * 100).toFixed(2) : '0.00';

        return { ...student, totalDays, present, absent, late, percentage };
      });
  }, [studentsList, records, filter]);

  const overallSummary = useMemo(() => {
    const totalPresent = studentReport.reduce((sum, s) => sum + s.present, 0);
    const totalAbsent = studentReport.reduce((sum, s) => sum + s.absent, 0);
    const totalLate = studentReport.reduce((sum, s) => sum + s.late, 0);
    const avgPercentage = studentReport.length > 0
      ? (studentReport.reduce((sum, s) => sum + Number(s.percentage), 0) / studentReport.length).toFixed(2)
      : '0.00';
    return { totalPresent, totalAbsent, totalLate, avgPercentage };
  }, [studentReport]);

  const handlePrint = () => window.print();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Student Attendance</h2>
          <p className="text-gray-500 text-sm">Database se connected — Auto percentage</p>
        </div>
        <button onClick={handlePrint} className="bg-[#1e3a8a] text-white px-4 py-2 rounded-lg hover:bg-[#1e40af] no-print">
          Print Sheet
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 no-print">
        <div className="bg-green-600 text-white p-5 rounded-xl shadow-md">
          <p className="text-sm opacity-90">Total Present</p>
          <p className="text-2xl font-bold mt-1">{overallSummary.totalPresent}</p>
        </div>
        <div className="bg-red-600 text-white p-5 rounded-xl shadow-md">
          <p className="text-sm opacity-90">Total Absent</p>
          <p className="text-2xl font-bold mt-1">{overallSummary.totalAbsent}</p>
        </div>
        <div className="bg-orange-500 text-white p-5 rounded-xl shadow-md">
          <p className="text-sm opacity-90">Total Late</p>
          <p className="text-2xl font-bold mt-1">{overallSummary.totalLate}</p>
        </div>
        <div className="bg-[#1e3a8a] text-white p-5 rounded-xl shadow-md">
          <p className="text-sm opacity-90">Average Percentage</p>
          <p className="text-2xl font-bold mt-1">{overallSummary.avgPercentage}%</p>
        </div>
      </div>

      {/* Mark Single Attendance */}
      <div className="bg-white p-6 rounded-xl shadow-md no-print">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Mark Single Attendance</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select name="studentId" value={formData.studentId} onChange={handleChange} required className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]">
            <option value="">Select Student</option>
            {studentsList.map((s) => (
              <option key={s._id} value={s._id}>{s.studentName} ({s.rollNo})</option>
            ))}
          </select>
          <input type="date" name="date" value={formData.date} onChange={handleChange} required className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]" />
          <select name="status" value={formData.status} onChange={handleChange} className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]">
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Late">Late</option>
          </select>
          <button type="submit" className="bg-[#1e3a8a] text-white py-3 rounded-lg hover:bg-[#1e40af] transition">
            Mark Attendance
          </button>
        </form>
      </div>

      {/* Bulk Upload */}
      <div className="bg-white p-6 rounded-xl shadow-md no-print">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Bulk Attendance Upload (All Students)</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-2">Select Date</label>
          <input type="date" value={bulkDate} onChange={(e) => setBulkDate(e.target.value)} className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] max-w-xs" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-gray-600">
                <th className="p-3 border">Reg No</th>
                <th className="p-3 border">Student Name</th>
                <th className="p-3 border">Course</th>
                <th className="p-3 border">Mode</th>
                <th className="p-3 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {studentsList.map((s) => (
                <tr key={s._id} className="border-b">
                  <td className="p-3 border font-semibold text-[#1e3a8a]">{s.rollNo}</td>
                  <td className="p-3 border">{s.studentName}</td>
                  <td className="p-3 border">{s.course}</td>
                  <td className="p-3 border">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${classModeColors[s.classMode]}`}>{s.classMode}</span>
                  </td>
                  <td className="p-3 border">
                    <div className="flex gap-2">
                      {['Present', 'Absent', 'Late'].map((status) => (
                        <button key={status} type="button" onClick={() => handleBulkStatusChange(s._id, status)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                            (bulkStatus[s._id] || 'Present') === status
                              ? status === 'Present' ? 'bg-green-600 text-white'
                                : status === 'Absent' ? 'bg-red-600 text-white'
                                : 'bg-orange-500 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}>
                          {status}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button onClick={handleBulkUpload} className="mt-4 bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition">
          Upload Attendance for All Students
        </button>
      </div>

      {/* Filter */}
      <div className="bg-white p-4 rounded-xl shadow-md flex flex-wrap gap-3 items-center no-print">
        <h3 className="text-md font-semibold text-gray-700">Monthly Report Filter:</h3>
        <select name="month" value={filter.month} onChange={handleFilterChange} className="border border-gray-300 p-2 rounded-lg">
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={String(i + 1)}>
              {new Date(2026, i).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>
        <input type="number" name="year" value={filter.year} onChange={handleFilterChange} className="border border-gray-300 p-2 rounded-lg w-24" />
        <select name="classMode" value={filter.classMode} onChange={handleFilterChange} className="border border-gray-300 p-2 rounded-lg">
          <option value="">All Modes</option>
          {classModeOptions.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      {/* Excel-Style Print Sheet */}
      <div className="bg-white p-6 rounded-xl shadow-md" id="print-area">
        <div className="text-center mb-4 print-header">
          <h3 className="text-xl font-bold text-gray-800">GUJRAT IT CENTRE</h3>
          <p className="text-sm text-gray-600">Student Attendance Sheet - {filter.month}/{filter.year}</p>
          <p className="text-xs text-gray-500">Generated: {new Date().toLocaleDateString()}</p>
        </div>
        <div className="overflow-x-auto">
          {loading ? <p className="text-center p-6 text-gray-500">Loading...</p> : (
            <table className="w-full text-left text-sm excel-table">
              <thead>
                <tr className="bg-gray-200 text-gray-800">
                  <th className="p-2 border border-gray-400 text-center font-bold">S.No</th>
                  <th className="p-2 border border-gray-400 font-bold">Reg No</th>
                  <th className="p-2 border border-gray-400 font-bold">Student Name</th>
                  <th className="p-2 border border-gray-400 font-bold">Course</th>
                  <th className="p-2 border border-gray-400 font-bold">Mode</th>
                  <th className="p-2 border border-gray-400 font-bold">Total Days</th>
                  <th className="p-2 border border-gray-400 font-bold">Present</th>
                  <th className="p-2 border border-gray-400 font-bold">Absent</th>
                  <th className="p-2 border border-gray-400 font-bold">Late</th>
                  <th className="p-2 border border-gray-400 font-bold">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {studentReport.length === 0 ? (
                  <tr><td colSpan="10" className="p-3 text-center text-gray-500 border border-gray-400">No records found.</td></tr>
                ) : (
                  studentReport.map((s, index) => (
                    <tr key={s._id} className="hover:bg-gray-50">
                      <td className="p-2 border border-gray-400 text-center">{index + 1}</td>
                      <td className="p-2 border border-gray-400 font-semibold text-[#1e3a8a]">{s.rollNo}</td>
                      <td className="p-2 border border-gray-400 font-semibold">{s.studentName}</td>
                      <td className="p-2 border border-gray-400">{s.course}</td>
                      <td className="p-2 border border-gray-400">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${classModeColors[s.classMode]}`}>{s.classMode}</span>
                      </td>
                      <td className="p-2 border border-gray-400 text-center">{s.totalDays}</td>
                      <td className="p-2 border border-gray-400 text-center text-green-600 font-semibold">{s.present}</td>
                      <td className="p-2 border border-gray-400 text-center text-red-600 font-semibold">{s.absent}</td>
                      <td className="p-2 border border-gray-400 text-center text-orange-500 font-semibold">{s.late}</td>
                      <td className="p-2 border border-gray-400 text-center">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          Number(s.percentage) >= 75 ? 'bg-green-100 text-green-700'
                            : Number(s.percentage) >= 50 ? 'bg-orange-100 text-orange-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {s.percentage}%
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {studentReport.length > 0 && (
                <tfoot>
                  <tr className="bg-gray-800 text-white font-bold">
                    <td className="p-2 border border-gray-400" colSpan="5">TOTAL / AVERAGE</td>
                    <td className="p-2 border border-gray-400 text-center">{studentReport.reduce((sum, s) => sum + s.totalDays, 0)}</td>
                    <td className="p-2 border border-gray-400 text-center text-green-300">{overallSummary.totalPresent}</td>
                    <td className="p-2 border border-gray-400 text-center text-red-300">{overallSummary.totalAbsent}</td>
                    <td className="p-2 border border-gray-400 text-center text-orange-300">{overallSummary.totalLate}</td>
                    <td className="p-2 border border-gray-400 text-center">{overallSummary.avgPercentage}%</td>
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

export default Attendance;