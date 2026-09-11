const express = require('express');
const router = express.Router();
const StaffSalary = require('../models/StaffSalary');

// Get all staff salary records
router.get('/', async (req, res) => {
  try {
    const staff = await StaffSalary.find().sort({ createdAt: -1 });
    res.json(staff);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add staff salary record
router.post('/', async (req, res) => {
  try {
    const staff = new StaffSalary(req.body);
    await staff.save();
    res.status(201).json(staff);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update staff salary
router.put('/:id', async (req, res) => {
  try {
    const staff = await StaffSalary.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(staff);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete staff salary
router.delete('/:id', async (req, res) => {
  try {
    await StaffSalary.findByIdAndDelete(req.params.id);
    res.json({ message: 'Staff salary record deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;