import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = {
  fees: 'http://localhost:5000/api/student-fee',
  students: 'http://localhost:5000/api/students'
};

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const reportsList = [
    { id: 1, title: 'Student List With Remaining Balance', desc: 'Students with outstanding fee balance', color: 'from-purple-500 to-purple-700', icon: 'ST' },
    { id: 2, title: 'Fee Summary', desc: 'Summary of all fees', color: 'from-green-400 to-green-600', icon: 'FS' },
    { id: 3, title: 'Student Fee Report Section & Head Wise', desc: 'Student fees by section and fee head', color: 'from-orange-500 to-red-600', icon: 'SF' },
    { id: 4, title: 'Fee Summary Detail', desc: 'Detailed summary of fees', color: 'from-teal-400 to-teal-600', icon: 'FD' },
    { id: 5, title: 'Student Fee Discount', desc: 'Student fee discounts', color: 'from-orange-400 to-orange-600', icon: 'SD' },
    { id: 6, title: 'Fee Report Headwise', desc: 'Fee report by individual fee heads', color: 'from-blue-500 to-indigo-700', icon: 'FH' },
    { id: 7, title: 'Fee Comparison Section Wise', desc: 'Fee comparison across sections', color: 'from-pink-500 to-rose-600', icon: 'FC' },
    { id: 8, title: 'Fee List', desc: 'General list of fees', color: 'from-cyan-400 to-blue-500', icon: 'FL' },
    { id: 9, title: 'Fee Collected By User', desc: 'Fees collected by specific users', color: 'from-lime-400 to-green-600', icon: 'CU' },
    { id: 10, title: 'Fee Report For Bank Reconciliation', desc: 'Fee report for bank reconciliation', color: 'from-yellow-700 to-amber-800', icon: 'BR' },
    { id: 11, title: 'Fine Collection', desc: 'Report on collected fines', color: 'from-pink-600 to-purple-700', icon: 'FN' },
    { id: 12, title: 'Receivable Vs Received', desc: 'Comparison of receivable vs received', color: 'from-blue-700 to-indigo-900', icon: 'RR' },
    { id: 13, title: 'Fee Collection Report', desc: 'General fee collection report', color: 'from-green-600 to-emerald-700', icon: 'CR' },
    { id: 14, title: 'Fee Comparison Month Wise', desc: 'Monthly fee comparison', color: 'from-fuchsia-500 to-purple-600', icon: 'MC' },
    { id: 15, title: 'Student Head Wise Fee Collection', desc: 'Student fee collection by head', color: 'from-slate-500 to-gray-700', icon: 'HW' },
    { id: 16, title: 'Student Defaulter List', desc: 'General student defaulter list', color: 'from-gray-700 to-black', icon: 'DL' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fRes, sRes] = await Promise.all([axios.get(API.fees), axios.get(API.students)]);
        setFees(fRes.data);
        setStudents(sRes.data);
      } catch (err) { console.log(err.message); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const calculatePaidFee = (f) => 
    Number(f.admissionFee || 0) + Number(f.installment1 || 0) + Number(f.installment2 || 0) + Number(f.installment3 || 0);

  const reportSummary = {
    totalFee: fees.reduce((s, f) => s + Number(f.totalCourseFee || 0), 0),
    totalPaid: fees.reduce((s, f) => s + calculatePaidFee(f), 0),
    totalRemaining: fees.reduce((s, f) => s + (Number(f.totalCourseFee || 0) - calculatePaidFee(f)), 0)
  };

  const classModeColors = {
    'Online': 'bg-cyan-100 text-cyan-700',
    'Physical': 'bg-orange-100 text-orange-700',
    'Hybrid': 'bg-purple-100 text-purple-700'
  };

  const filteredReports = reportsList.filter((r) =>
    r.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePrint = () => window.print();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Fee Reports</h2>
        <p className="text-gray-500 text-sm">Select a report to generate ({fees.length} fee records, {students.length} students)</p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-md no-print">
        <input
          type="text"
          placeholder="Search Report (e.g. Fee Summary, Defaulter List)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 no-print">
        {filteredReports.length === 0 ? (
          <p className="text-gray-500 col-span-4 text-center p-6">No reports found.</p>
        ) : (
          filteredReports.map((report) => (
            <button
              key={report.id}
              onClick={() => setSelectedReport(report)}
              className={`bg-gradient-to-br ${report.color} text-white p-5 rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-200 text-left`}
            >
              <div className="flex justify-between items-start">
                <div className="bg-white bg-opacity-30 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm">
                  {report.icon}
                </div>
                <span className="bg-white bg-opacity-30 text-xs px-2 py-1 rounded-full">#{report.id}</span>
              </div>
              <h3 className="text-md font-bold mt-3 leading-tight">{report.title}</h3>
              <p className="text-xs opacity-90 mt-2">{report.desc}</p>
              <div className="mt-3 text-xs font-semibold bg-white bg-opacity-20 px-3 py-1 rounded-full inline-block">
                Click to Generate
              </div>
            </button>
          ))
        )}
      </div>

      {/* Report Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 no-print">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className={`bg-gradient-to-r ${selectedReport.color} text-white p-5 rounded-t-xl flex justify-between items-center`}>
              <div>
                <h3 className="text-xl font-bold">{selectedReport.title}</h3>
                <p className="text-sm opacity-90 mt-1">{selectedReport.desc}</p>
              </div>
              <button onClick={() => setSelectedReport(null)} className="bg-white bg-opacity-20 hover:bg-opacity-40 rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold">X</button>
            </div>

            <div className="p-6">
              <div className="mb-4 flex flex-wrap gap-3">
                <button onClick={handlePrint} className="bg-[#1e3a8a] text-white px-4 py-2 rounded-lg hover:bg-[#1e40af]">Print Report</button>
              </div>

              <div className="text-center mb-4 print-header">
                <h3 className="text-xl font-bold text-gray-800">GUJRAT IT CENTRE</h3>
                <p className="text-sm text-gray-600">{selectedReport.title}</p>
                <p className="text-xs text-gray-500">Generated: {new Date().toLocaleDateString()}</p>
              </div>

              <div className="overflow-x-auto" id="print-area">
                {loading ? <p className="text-center p-6">Loading...</p> : (
                  <table className="w-full text-left text-sm excel-table">
                    <thead>
                      <tr className="bg-gray-200 text-gray-800">
                        <th className="p-2 border border-gray-400 text-center font-bold">S.No</th>
                        <th className="p-2 border border-gray-400 font-bold">Reg No</th>
                        <th className="p-2 border border-gray-400 font-bold">Student Name</th>
                        <th className="p-2 border border-gray-400 font-bold">Course</th>
                        <th className="p-2 border border-gray-400 font-bold">Class Mode</th>
                        <th className="p-2 border border-gray-400 font-bold">Total Fee</th>
                        <th className="p-2 border border-gray-400 font-bold">Paid Fee</th>
                        <th className="p-2 border border-gray-400 font-bold">Remaining</th>
                        <th className="p-2 border border-gray-400 font-bold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fees.length === 0 ? (
                        <tr><td colSpan="9" className="p-3 text-center text-gray-500 border border-gray-400">No fee records found.</td></tr>
                      ) : (
                        fees.map((s, i) => {
                          const paid = calculatePaidFee(s);
                          const remaining = Number(s.totalCourseFee || 0) - paid;
                          return (
                            <tr key={s._id} className="hover:bg-gray-50">
                              <td className="p-2 border border-gray-400 text-center">{i + 1}</td>
                              <td className="p-2 border border-gray-400 font-semibold text-[#1e3a8a]">{s.regNo}</td>
                              <td className="p-2 border border-gray-400 font-semibold">{s.studentName}</td>
                              <td className="p-2 border border-gray-400">{s.course}</td>
                              <td className="p-2 border border-gray-400">
                                <span className={`px-2 py-1 rounded text-xs font-semibold ${classModeColors[s.classMode]}`}>{s.classMode}</span>
                              </td>
                              <td className="p-2 border border-gray-400">Rs. {Number(s.totalCourseFee).toLocaleString()}</td>
                              <td className="p-2 border border-gray-400 text-green-600">Rs. {paid.toLocaleString()}</td>
                              <td className="p-2 border border-gray-400 text-red-600 font-semibold">Rs. {remaining.toLocaleString()}</td>
                              <td className="p-2 border border-gray-400">
                                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                  remaining === 0 ? 'bg-green-100 text-green-700' : paid > 0 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                                }`}>
                                  {remaining === 0 ? 'Paid' : paid > 0 ? 'Partial' : 'Unpaid'}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                    {fees.length > 0 && (
                      <tfoot>
                        <tr className="bg-gray-800 text-white font-bold">
                          <td className="p-2 border border-gray-400" colSpan="5">AUTO TOTAL</td>
                          <td className="p-2 border border-gray-400">Rs. {reportSummary.totalFee.toLocaleString()}</td>
                          <td className="p-2 border border-gray-400 text-green-300">Rs. {reportSummary.totalPaid.toLocaleString()}</td>
                          <td className="p-2 border border-gray-400 text-red-300">Rs. {reportSummary.totalRemaining.toLocaleString()}</td>
                          <td className="p-2 border border-gray-400"></td>
                        </tr>
                      </tfoot>
                    )}
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;