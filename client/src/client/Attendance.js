import React, { useState } from 'react';
import axios from 'axios';

function Attendance() {
  const [studentId, setStudentId] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('Present');
  const [report, setReport] = useState(null);

  // Attendance Mark karne ka function
  const markAttendance = async () => {
    try {
      await axios.post('http://localhost:5000/api/attendance/mark', {
        studentId, date, status
      });
      alert('Attendance Marked!');
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  // Report nikalne ka function (Auto Calculation)
  const getReport = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/attendance/report?studentId=${studentId}&month=10&year=2026`);
      setReport(res.data); // Yahan auto calculated data aayega
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Student Attendance</h2>
      
      {/* Form */}
      <input placeholder="Student ID" onChange={(e) => setStudentId(e.target.value)} />
      <input type="date" onChange={(e) => setDate(e.target.value)} />
      <select onChange={(e) => setStatus(e.target.value)}>
        <option value="Present">Present</option>
        <option value="Absent">Absent</option>
        <option value="Late">Late</option>
      </select>
      <button onClick={markAttendance}>Mark Attendance</button>

      <hr />

      {/* Auto Report Section */}
      <h3>Monthly Auto Report</h3>
      <button onClick={getReport}>Get Report</button>
      
      {report && (
        <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px' }}>
          <p><b>Total Days:</b> {report.totalDays}</p>
          <p><b>Present:</b> {report.presentDays}</p>
          <p><b>Absent:</b> {report.absentDays}</p>
          <p><b>Percentage:</b> {report.percentage} (Auto Calculated)</p>
        </div>
      )}
    </div>
  );
}

export default Attendance;