const Attendance = require('../models/Attendance');

// 1. Mark Attendance (Present/Absent lagana)
exports.markAttendance = async (req, res) => {
  try {
    const { studentId, date, status } = req.body;
    const d = new Date(date);
    
    // Check karein ke aaj ki attendance pehle se nahi lagi
    const existing = await Attendance.findOne({ studentId, date: d });
    if (existing) {
      return res.status(400).json({ message: 'Attendance already marked for this date' });
    }

    const attendance = new Attendance({
      studentId,
      date: d,
      status,
      month: d.getMonth() + 1, // 1-12
      year: d.getFullYear()
    });

    await attendance.save();
    res.status(201).json({ message: 'Attendance marked successfully', attendance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Get Monthly Attendance Report (Auto Calculated)
exports.getMonthlyReport = async (req, res) => {
  try {
    const { studentId, month, year } = req.query;

    // Database se us mahine ka data nikalna
    const records = await Attendance.find({ 
      studentId, 
      month: Number(month), 
      year: Number(year) 
    });

    const totalDays = records.length;
    const presentDays = records.filter(r => r.status === 'Present').length;
    const absentDays = records.filter(r => r.status === 'Absent').length;
    const lateDays = records.filter(r => r.status === 'Late').length;

    // AUTO CALCULATION: Percentage
    const percentage = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(2) : 0;

    res.status(200).json({
      totalDays,
      presentDays,
      absentDays,
      lateDays,
      percentage: `${percentage}%` // Ye auto calculate ho kar frontend par jayega
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};