const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');

// Get all attendance records
router.get('/', async (req, res) => {
  try {
    const records = await Attendance.find().populate('studentId').sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add single attendance
router.post('/', async (req, res) => {
  try {
    const record = new Attendance(req.body);
    await record.save();
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Bulk upload attendance
router.post('/bulk', async (req, res) => {
  try {
    const records = await Attendance.insertMany(req.body);
    res.status(201).json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete attendance
router.delete('/:id', async (req, res) => {
  try {
    await Attendance.findByIdAndDelete(req.params.id);
    res.json({ message: 'Attendance deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;