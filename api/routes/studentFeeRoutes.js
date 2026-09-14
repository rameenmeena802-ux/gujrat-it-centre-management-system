const express = require('express');
const router = express.Router();
const StudentFee = require('../models/StudentFee');

// ============ GET ALL FEE RECORDS ============
router.get('/', async (req, res) => {
  try {
    const fees = await StudentFee.find().sort({ createdAt: -1 });
    res.json(fees);
  } catch (err) {
    console.error('Error fetching fees:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ============ ADD NEW FEE RECORD ============
router.post('/', async (req, res) => {
  try {
    const fee = new StudentFee(req.body);
    await fee.save();
    res.status(201).json(fee);
  } catch (err) {
    console.error('Error adding fee:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ============ UPDATE FEE RECORD (EDIT) ============
router.put('/:id', async (req, res) => {
  try {
    const fee = await StudentFee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!fee) {
      return res.status(404).json({ message: 'Fee record not found' });
    }
    res.json(fee);
  } catch (err) {
    console.error('Error updating fee:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ============ DELETE FEE RECORD ============
router.delete('/:id', async (req, res) => {
  try {
    const fee = await StudentFee.findByIdAndDelete(req.params.id);
    if (!fee) {
      return res.status(404).json({ message: 'Fee record not found' });
    }
    res.json({ message: 'Fee record deleted successfully' });
  } catch (err) {
    console.error('Error deleting fee:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;