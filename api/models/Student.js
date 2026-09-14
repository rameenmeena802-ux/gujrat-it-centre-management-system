const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  date: { type: String, required: true },
  studentName: { type: String, required: true },
  rollNo: { type: String, required: true, unique: true },
  fatherName: { type: String, required: true },
  contact: { type: String, required: true },
  course: { type: String, required: true },
  classMode: { type: String, enum: ['Online', 'Physical', 'Hybrid'], default: 'Physical' },
  classTiming: { type: String, default: 'Morning' },
  totalFee: { type: Number, required: true },
  admissionFee: { type: Number, default: 0 },
  paidFee: { type: Number, default: 0 },
  status: { type: String, default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);