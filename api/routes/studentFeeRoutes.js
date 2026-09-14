const express = require('express');
const router = express.Router();
const StudentFee = require('../models/StudentFee');

// Get all fee records
router.get('/', async (req, res) => {
  try {
    const fees = await StudentFee.find().sort({ createdAt: -1 });
    res.json(fees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add fee record
router.post('/', async (req, res) => {
  try {
    const fee = new StudentFee(req.body);
    await fee.save();
    res.status(201).json(fee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update fee record
router.put('/:id', async (req, res) => {
  try {
    const fee = await StudentFee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(fee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete fee record
router.delete('/:id', async (req, res) => {
  try {
    await StudentFee.findByIdAndDelete(req.params.id);
    res.json({ message: 'Fee record deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;