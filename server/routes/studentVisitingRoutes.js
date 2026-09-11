const express = require('express');
const router = express.Router();
const StudentVisiting = require('../models/StudentVisiting');

router.get('/', async (req, res) => {
  try {
    const visitors = await StudentVisiting.find().sort({ createdAt: -1 });
    res.json(visitors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const visitor = new StudentVisiting(req.body);
    await visitor.save();
    res.status(201).json(visitor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const visitor = await StudentVisiting.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(visitor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await StudentVisiting.findByIdAndDelete(req.params.id);
    res.json({ message: 'Visitor deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;