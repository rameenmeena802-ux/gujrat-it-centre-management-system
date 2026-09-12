import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

const API_URL = 'https://gujrat-it-centre-management-system.onrender.com/api/expenses';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: '', amount: '', date: '', paymentMethod: 'Cash', paidTo: '', description: ''
  });
  const [filter, setFilter] = useState({
    month: String(new Date().getMonth() + 1),
    year: String(new Date().getFullYear()),
    category: '',
    paymentMethod: ''
  });

  const categoriesList = [
    'Electricity', 'Rent', 'Internet', 'Salary', 'Water',
    'Maintenance', 'Stationery', 'Marketing', 'Transport', 'Other'
  ];

  const paymentMethodsList = [
    'Cash', 'Bank Transfer', 'JazzCash', 'EasyPaisa', 'Cheque', 'Credit Card'
  ];

  const categoryColors = {
    Electricity: 'bg-yellow-500',
    Rent: 'bg-blue-500',
    Internet: 'bg-purple-500',
    Salary: 'bg-green-500',
    Water: 'bg-cyan-500',
    Maintenance: 'bg-orange-500',
    Stationery: 'bg-pink-500',
    Marketing: 'bg-indigo-500',
    Transport: 'bg-teal-500',
    Other: 'bg-gray-500'
  };

  // ============ API CALLS ============
  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setExpenses(res.data);
    } catch (err) {
      console.log('Error:', err.message);
      alert('Expenses load nahi ho sakay');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchExpenses(); }, []);

  // ============ FORM HANDLERS ============
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFilterChange = (e) => setFilter({ ...filter, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, { ...formData, amount: Number(formData.amount) });
      alert('Expense Added Successfully!');
      setFormData({ category: '', amount: '', date: '', paymentMethod: 'Cash', paidTo: '', description: '' });
      fetchExpenses();
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchExpenses();
    } catch (err) { alert('Error: ' + err.message); }
  };

  // ============ FILTERS & AUTO CALCULATIONS ============
  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      const d = new Date(e.date);
      const matchMonth = (d.getMonth() + 1) === Number(filter.month) && d.getFullYear() === Number(filter.year);
      const matchCategory = filter.category ? e.category === filter.category : true;
      const matchMethod = filter.paymentMethod ? e.paymentMethod === filter.paymentMethod : true;
      return matchMonth && matchCategory && matchMethod;
    });
  }, [expenses, filter]);

  const totalMonthly = useMemo(() => filteredExpenses.reduce((sum, e) => sum + e.amount, 0), [filteredExpenses]);

  const categoryTotals = useMemo(() => {
    const totals = {};
    filteredExpenses.forEach((e) => { totals[e.category] = (totals[e.category] || 0) + e.amount; });
    return totals;
  }, [filteredExpenses]);

  const paymentMethodTotals = useMemo(() => {
    const totals = {};
    filteredExpenses.forEach((e) => { totals[e.paymentMethod] = (totals[e.paymentMethod] || 0) + e.amount; });
    return totals;
  }, [filteredExpenses]);

  const handlePrint = () => window.print();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Institute Expenses</h2>
          <p className="text-gray-500 text-sm">Database se connected — Auto monthly total</p>
        </div>
        <button onClick={handlePrint} className="bg-[#1e3a8a] text-white px-4 py-2 rounded-lg hover:bg-[#1e40af] no-print">
          Print Sheet
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 no-print">
        <div className="bg-[#1e3a8a] text-white p-5 rounded-xl shadow-md">
          <p className="text-sm opacity-90">Total Monthly Expense</p>
          <p className="text-2xl font-bold mt-1">Rs. {totalMonthly.toLocaleString()}</p>
          <p className="text-xs mt-1 opacity-80">{filteredExpenses.length} entries</p>
        </div>
        <div className="bg-teal-600 text-white p-5 rounded-xl shadow-md">
          <p className="text-sm opacity-90">Total Categories</p>
          <p className="text-2xl font-bold mt-1">{Object.keys(categoryTotals).length}</p>
        </div>
        <div className="bg-purple-600 text-white p-5 rounded-xl shadow-md">
          <p className="text-sm opacity-90">Payment Methods Used</p>
          <p className="text-2xl font-bold mt-1">{Object.keys(paymentMethodTotals).length}</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white p-6 rounded-xl shadow-md no-print">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Add New Expense</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select name="category" value={formData.category} onChange={handleChange} required className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#1e3a8a]">
            <option value="">Select Category</option>
            {categoriesList.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <input type="number" name="amount" placeholder="Amount (Rs.)" value={formData.amount} onChange={handleChange} required className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#1e3a8a]" />
          <input type="date" name="date" value={formData.date} onChange={handleChange} required className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#1e3a8a]" />
          <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#1e3a8a]">
            {paymentMethodsList.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <input type="text" name="paidTo" placeholder="Paid To (e.g. WAPDA, PTCL)" value={formData.paidTo} onChange={handleChange} required className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#1e3a8a]" />
          <input type="text" name="description" placeholder="Description (Optional)" value={formData.description} onChange={handleChange} className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#1e3a8a]" />
          <button type="submit" className="md:col-span-3 bg-[#1e3a8a] text-white py-3 rounded-lg hover:bg-[#1e40af] transition">
            Add Expense
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
        <select name="category" value={filter.category} onChange={handleFilterChange} className="border border-gray-300 p-2 rounded-lg">
          <option value="">All Categories</option>
          {categoriesList.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select name="paymentMethod" value={filter.paymentMethod} onChange={handleFilterChange} className="border border-gray-300 p-2 rounded-lg">
          <option value="">All Methods</option>
          {paymentMethodsList.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      {/* Auto Breakdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 no-print">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Category-wise Breakdown (Auto)</h3>
          <div className="space-y-2">
            {Object.keys(categoryTotals).length === 0 ? (
              <p className="text-gray-500 text-sm">No expenses in this month.</p>
            ) : (
              Object.entries(categoryTotals).map(([cat, total]) => (
                <div key={cat} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className={`${categoryColors[cat] || 'bg-gray-500'} w-3 h-3 rounded-full`}></span>
                    <span className="font-medium text-gray-700">{cat}</span>
                  </div>
                  <span className="font-bold text-gray-800">Rs. {total.toLocaleString()}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Payment Method-wise Breakdown (Auto)</h3>
          <div className="space-y-2">
            {Object.keys(paymentMethodTotals).length === 0 ? (
              <p className="text-gray-500 text-sm">No expenses in this month.</p>
            ) : (
              Object.entries(paymentMethodTotals).map(([method, total]) => (
                <div key={method} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                  <span className="font-medium text-gray-700">{method}</span>
                  <span className="font-bold text-gray-800">Rs. {total.toLocaleString()}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white p-6 rounded-xl shadow-md" id="print-area">
        <div className="text-center mb-4 print-header">
          <h3 className="text-xl font-bold text-gray-800">GUJRAT IT CENTRE</h3>
          <p className="text-sm text-gray-600">Expense Sheet - {filter.month}/{filter.year}</p>
          <p className="text-xs text-gray-500">Generated: {new Date().toLocaleDateString()}</p>
        </div>
        <div className="overflow-x-auto">
          {loading ? <p className="text-center p-6 text-gray-500">Loading...</p> : (
            <table className="w-full text-left text-sm excel-table">
              <thead>
                <tr className="bg-gray-200 text-gray-800">
                  <th className="p-2 border border-gray-400 text-center font-bold">S.No</th>
                  <th className="p-2 border border-gray-400 font-bold">Date</th>
                  <th className="p-2 border border-gray-400 font-bold">Category</th>
                  <th className="p-2 border border-gray-400 font-bold">Paid To</th>
                  <th className="p-2 border border-gray-400 font-bold">Payment Method</th>
                  <th className="p-2 border border-gray-400 font-bold">Description</th>
                  <th className="p-2 border border-gray-400 font-bold">Amount</th>
                  <th className="p-2 border border-gray-400 text-center font-bold no-print">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.length === 0 ? (
                  <tr><td colSpan="8" className="p-3 text-center text-gray-500 border border-gray-400">No expenses found. Add your first expense!</td></tr>
                ) : (
                  filteredExpenses.map((e, index) => (
                    <tr key={e._id} className="hover:bg-gray-50">
                      <td className="p-2 border border-gray-400 text-center">{index + 1}</td>
                      <td className="p-2 border border-gray-400">{e.date}</td>
                      <td className="p-2 border border-gray-400">
                        <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${categoryColors[e.category] || 'bg-gray-500'}`}>{e.category}</span>
                      </td>
                      <td className="p-2 border border-gray-400">{e.paidTo}</td>
                      <td className="p-2 border border-gray-400">{e.paymentMethod}</td>
                      <td className="p-2 border border-gray-400 text-gray-600">{e.description || '-'}</td>
                      <td className="p-2 border border-gray-400 font-bold text-red-600">Rs. {e.amount.toLocaleString()}</td>
                      <td className="p-2 border border-gray-400 text-center no-print">
                        <button onClick={() => handleDelete(e._id)} className="text-red-600 hover:underline text-xs">Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {filteredExpenses.length > 0 && (
                <tfoot>
                  <tr className="bg-gray-800 text-white font-bold">
                    <td className="p-2 border border-gray-400" colSpan="6">AUTO TOTAL</td>
                    <td className="p-2 border border-gray-400">Rs. {totalMonthly.toLocaleString()}</td>
                    <td className="p-2 border border-gray-400 no-print"></td>
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

export default Expenses;