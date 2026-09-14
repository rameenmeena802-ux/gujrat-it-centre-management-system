const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseCategory: { type: String, enum: ['Regular', 'E-Commerce'], required: true },
  courseName: { type: String, required: true },
  platform: { type: String, default: '' },
  duration: { type: String, required: true },
  totalFee: { type: Number, required: true },
  description: { type: String, default: '' },
  detail: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);