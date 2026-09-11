import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/staff-salary';

const StaffSalary = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    staffName: '', designation: '', basicSalary: '', workingDays: '',
    presentDays: '', deductions: '', bonus: '', paidAmount: '',
    paymentDate: '', month: String(new Date().getMonth() + 1), year: String(new Date().getFullYear())
  });
  const [filter, setFilter] = useState({
    month: String(new Date().getMonth() + 1),
    year: String(new Date().getFullYear()),
    status: ''
  });

  // ============ API CALLS ============
  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setStaffList(res.data);
    } catch (err) {
      console.log('Error:', err.message);
      alert('Staff salary records load nahi ho sakay');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStaff(); }, []);

  // ============ AUTO CALCULATIONS ============
  const calculatePerDay = (basicSalary, workingDays) => {
    if (!workingDays || workingDays === 0) return 0;
    return basicSalary / workingDays;
  };

  const calculateEarned = (staff) => {
    const perDay = calculatePerDay(staff.basicSalary, staff.workingDays);
    return perDay * staff.presentDays;
  };

  const calculateNetSalary = (staff) => {
    const earned = calculateEarned(staff);
    const bonus = Number(staff.bonus || 0);
    const deductions = Number(staff.deductions || 0);
    return earned + bonus - deductions;
  };

  const calculateRemaining = (staff) => calculateNetSalary(staff) - Number(staff.paidAmount || 0);

  const getPaymentStatus = (staff) => {
    const net = calculateNetSalary(staff);
    const paid = Number(staff.paidAmount || 0);
    if (paid <= 0) return 'Unpaid';
    if (paid >= net) return 'Full Paid';
    return 'Half Paid';
  };

  // ============ FORM HANDLERS ============
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFilterChange = (e) => setFilter({ ...filter, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, {
        ...formData,
        basicSalary: Number(formData.basicSalary),
        workingDays: Number(formData.workingDays),
        presentDays: Number(formData.presentDays),
        deductions: Number(formData.deductions) || 0,
        bonus: Number(formData.bonus) || 0,
        paidAmount: Number(formData.paidAmount) || 0
      });
      alert('Staff Salary Record Added!');
      setFormData({
        staffName: '', designation: '', basicSalary: '', workingDays: '',
        presentDays: '', deductions: '', bonus: '', paidAmount: '',
        paymentDate: '', month: String(new Date().getMonth() + 1), year: String(new Date().getFullYear())
      });
      fetchStaff();
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this salary record?')) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchStaff();
    } catch (err) { alert('Error: ' + err.message); }
  };

  const handleUpdatePaid = async (staff) => {
    const net = calculateNetSalary(staff).toFixed(0);
    const amount = prompt(`Enter paid amount (Net Salary: Rs. ${net}):`, staff.paidAmount);
    if (amount === null || amount === '') return;
    try {
      await axios.put(`${API_URL}/${staff._id}`, {
        ...staff,
        paidAmount: Number(amount),
        paymentDate: new Date().toISOString().split('T')[0]
      });
      fetchStaff();
    } catch (err) { alert('Error: ' + err.message); }
  };

  const handleMarkFullPaid = async (staff) => {
    const net = Number(calculateNetSalary(staff).toFixed(0));
    try {
      await axios.put(`${API_URL}/${staff._id}`, {
        ...staff,
        paidAmount: net,
        paymentDate: new Date().toISOString().split('T')[0]
      });
      fetchStaff();
    } catch (err) { alert('Error: ' + err.message); }
  };

  // ============ FILTERS & SUMMARIES ============
  const filteredStaff = useMemo(() => {
    return staffList.filter((s) => {
      const matchMonth = s.month === filter.month && s.year === filter.year;
      const matchStatus = filter.status ? getPaymentStatus(s) === filter.status : true;
      return matchMonth && matchStatus;
    });
  }, [staffList, filter]);

  const summary = useMemo(() => {
    const totalNet = filteredStaff.reduce((sum, s) => sum + calculateNetSalary(s), 0);
    const totalPaid = filteredStaff.reduce((sum, s) => sum + Number(s.paidAmount || 0), 0);
    const totalRemaining = totalNet - totalPaid;
    const fullPaidCount = filteredStaff.filter(s => getPaymentStatus(s) === 'Full Paid').length;
    return { totalNet, totalPaid, totalRemaining, fullPaidCount };
  }, [filteredStaff]);

  const statusColors = {
    'Full Paid': 'bg-green-100 text-green-700',
    'Half Paid': 'bg-orange-100 text-orange-700',
    'Unpaid': 'bg-red-100 text-red-700'
  };

  const handlePrint = () => window.print();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Staff Salary Management</h2>
          <p className="text-gray-500 text-sm">Database se connected — Auto net salary</p>
        </div>
        <button onClick={handlePrint} className="bg-[#1e3a8a] text-white px-4 py-2 rounded-lg hover:bg-[#1e40af] no-print">
          Print Sheet
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 no-print">
        <div className="bg-[#1e3a8a] text-white p-5 rounded-xl shadow-md">
          <p className="text-sm opacity-90">Total Net Salary</p>
          <p className="text-2xl font-bold mt-1">Rs. {summary.totalNet.toFixed(0)}</p>
        </div>
        <div className="bg-green-600 text-white p-5 rounded-xl shadow-md">
          <p className="text-sm opacity-90">Total Paid</p>
          <p className="text-2xl font-bold mt-1">Rs. {summary.totalPaid.toLocaleString()}</p>
        </div>
        <div className="bg-red-600 text-white p-5 rounded-xl shadow-md">
          <p className="text-sm opacity-90">Total Remaining</p>
          <p className="text-2xl font-bold mt-1">Rs. {summary.totalRemaining.toFixed(0)}</p>
        </div>
        <div className="bg-purple-600 text-white p-5 rounded-xl shadow-md">
          <p className="text-sm opacity-90">Full Paid Staff</p>
          <p className="text-2xl font-bold mt-1">{summary.fullPaidCount} / {filteredStaff.length}</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white p-6 rounded-xl shadow-md no-print">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Add Staff Salary Record</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" name="staffName" placeholder="Staff Name" value={formData.staffName} onChange={handleChange} required className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#1e3a8a]" />
          <input type="text" name="designation" placeholder="Designation" value={formData.designation} onChange={handleChange} required className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#1e3a8a]" />
          <input type="number" name="basicSalary" placeholder="Basic Salary (Rs.)" value={formData.basicSalary} onChange={handleChange} required className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#1e3a8a]" />
          <input type="number" name="workingDays" placeholder="Working Days" value={formData.workingDays} onChange={handleChange} required className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#1e3a8a]" />
          <input type="number" name="presentDays" placeholder="Present Days" value={formData.presentDays} onChange={handleChange} required className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#1e3a8a]" />
          <input type="number" name="deductions" placeholder="Deductions (Rs.)" value={formData.deductions} onChange={handleChange} className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#1e3a8a]" />
          <input type="number" name="bonus" placeholder="Bonus (Rs.)" value={formData.bonus} onChange={handleChange} className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#1e3a8a]" />
          <input type="number" name="paidAmount" placeholder="Paid Amount (Rs.)" value={formData.paidAmount} onChange={handleChange} className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#1e3a8a]" />
          <input type="date" name="paymentDate" value={formData.paymentDate} onChange={handleChange} className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#1e3a8a]" />
          <select name="month" value={formData.month} onChange={handleChange} className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#1e3a8a]">
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={String(i + 1)}>{new Date(2026, i).toLocaleString('default', { month: 'long' })}</option>
            ))}
          </select>
          <input type="number" name="year" placeholder="Year" value={formData.year} onChange={handleChange} className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#1e3a8a]" />
          <button type="submit" className="md:col-span-3 bg-[#1e3a8a] text-white py-3 rounded-lg hover:bg-[#1e40af] transition">
            Add Salary Record
          </button>
        </form>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-md flex flex-wrap gap-3 items-center no-print">
        <h3 className="text-md font-semibold text-gray-700">Filter:</h3>
        <select name="month" value={filter.month} onChange={handleFilterChange} className="border border-gray-300 p-2 rounded-lg">
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={String(i + 1)}>{new Date(2026, i).toLocaleString('default', { month: 'long' })}</option>
          ))}
        </select>
        <input type="number" name="year" value={filter.year} onChange={handleFilterChange} className="border border-gray-300 p-2 rounded-lg w-24" />
        <select name="status" value={filter.status} onChange={handleFilterChange} className="border border-gray-300 p-2 rounded-lg">
          <option value="">All Status</option>
          <option value="Full Paid">Full Paid</option>
          <option value="Half Paid">Half Paid</option>
          <option value="Unpaid">Unpaid</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white p-6 rounded-xl shadow-md" id="print-area">
        <div className="text-center mb-4 print-header">
          <h3 className="text-xl font-bold text-gray-800">GUJRAT IT CENTRE</h3>
          <p className="text-sm text-gray-600">Staff Salary Sheet - {filter.month}/{filter.year}</p>
          <p className="text-xs text-gray-500">Generated: {new Date().toLocaleDateString()}</p>
        </div>
        <div className="overflow-x-auto">
          {loading ? <p className="text-center p-6 text-gray-500">Loading...</p> : (
            <table className="w-full text-left text-xs excel-table">
              <thead>
                <tr className="bg-gray-200 text-gray-800">
                  <th className="p-2 border border-gray-400 text-center font-bold">S.No</th>
                  <th className="p-2 border border-gray-400 font-bold">Staff Name</th>
                  <th className="p-2 border border-gray-400 font-bold">Designation</th>
                  <th className="p-2 border border-gray-400 font-bold">Basic Salary</th>
                  <th className="p-2 border border-gray-400 font-bold">Present/Working</th>
                  <th className="p-2 border border-gray-400 font-bold">Per Day</th>
                  <th className="p-2 border border-gray-400 font-bold">Earned</th>
                  <th className="p-2 border border-gray-400 font-bold">Bonus</th>
                  <th className="p-2 border border-gray-400 font-bold">Deductions</th>
                  <th className="p-2 border border-gray-400 font-bold">Net Salary</th>
                  <th className="p-2 border border-gray-400 font-bold">Paid</th>
                  <th className="p-2 border border-gray-400 font-bold">Remaining</th>
                  <th className="p-2 border border-gray-400 font-bold">Status</th>
                  <th className="p-2 border border-gray-400 font-bold">Pay Date</th>
                  <th className="p-2 border border-gray-400 text-center font-bold no-print">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.length === 0 ? (
                  <tr><td colSpan="15" className="p-3 text-center text-gray-500 border border-gray-400">No records found. Add your first salary record!</td></tr>
                ) : (
                  filteredStaff.map((s, index) => {
                    const perDay = calculatePerDay(s.basicSalary, s.workingDays);
                    const earned = calculateEarned(s);
                    const net = calculateNetSalary(s);
                    const remaining = calculateRemaining(s);
                    const status = getPaymentStatus(s);
                    return (
                      <tr key={s._id} className="hover:bg-gray-50">
                        <td className="p-2 border border-gray-400 text-center">{index + 1}</td>
                        <td className="p-2 border border-gray-400 font-semibold">{s.staffName}</td>
                        <td className="p-2 border border-gray-400">{s.designation}</td>
                        <td className="p-2 border border-gray-400">Rs. {Number(s.basicSalary).toLocaleString()}</td>
                        <td className="p-2 border border-gray-400 text-center">{s.presentDays}/{s.workingDays}</td>
                        <td className="p-2 border border-gray-400">Rs. {perDay.toFixed(0)}</td>
                        <td className="p-2 border border-gray-400">Rs. {earned.toFixed(0)}</td>
                        <td className="p-2 border border-gray-400 text-green-600">+{Number(s.bonus || 0).toLocaleString()}</td>
                        <td className="p-2 border border-gray-400 text-red-600">-{Number(s.deductions || 0).toLocaleString()}</td>
                        <td className="p-2 border border-gray-400 font-bold text-green-700">Rs. {net.toFixed(0)}</td>
                        <td className="p-2 border border-gray-400 text-green-600">Rs. {Number(s.paidAmount || 0).toLocaleString()}</td>
                        <td className="p-2 border border-gray-400 text-red-600 font-semibold">Rs. {remaining.toFixed(0)}</td>
                        <td className="p-2 border border-gray-400">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[status]}`}>{status}</span>
                        </td>
                        <td className="p-2 border border-gray-400 text-center">{s.paymentDate || '-'}</td>
                        <td className="p-2 border border-gray-400 text-center no-print">
                          <button onClick={() => handleMarkFullPaid(s)} className="text-green-600 hover:underline text-xs mr-2">Full Paid</button>
                          <button onClick={() => handleUpdatePaid(s)} className="text-blue-600 hover:underline text-xs mr-2">Update</button>
                          <button onClick={() => handleDelete(s._id)} className="text-red-600 hover:underline text-xs">Del</button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
              {filteredStaff.length > 0 && (
                <tfoot>
                  <tr className="bg-gray-800 text-white font-bold">
                    <td className="p-2 border border-gray-400" colSpan="9">AUTO TOTAL</td>
                    <td className="p-2 border border-gray-400">Rs. {summary.totalNet.toFixed(0)}</td>
                    <td className="p-2 border border-gray-400 text-green-300">Rs. {summary.totalPaid.toLocaleString()}</td>
                    <td className="p-2 border border-gray-400 text-red-300">Rs. {summary.totalRemaining.toFixed(0)}</td>
                    <td className="p-2 border border-gray-400 no-print" colSpan="3"></td>
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

export default StaffSalary;