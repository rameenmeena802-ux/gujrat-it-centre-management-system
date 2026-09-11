const express = require('express');
const router = express.Router();
const StudentQuery = require('../models/StudentQuery');

router.get('/', async (req, res) => {
  try {
    const queries = await StudentQuery.find().sort({ createdAt: -1 });
    res.json(queries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const query = new StudentQuery(req.body);
    await query.save();
    res.status(201).json(query);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const query = await StudentQuery.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(query);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await StudentQuery.findByIdAndDelete(req.params.id);
    res.json({ message: 'Query deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;