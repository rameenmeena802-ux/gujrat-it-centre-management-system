const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');

// Get all expenses with timeout
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 }).maxTimeMS(3000);
    res.json(expenses);
  } catch (err) {
    console.error('Expenses API Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Add expense
router.post('/', async (req, res) => {
  try {
    const expense = new Expense(req.body);
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    console.error('Add Expense Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Update expense
router.put('/:id', async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete expense
router.delete('/:id', async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;