const mongoose = require('mongoose');

const studentFeeSchema = new mongoose.Schema({
  date: { type: String, required: true },
  studentName: { type: String, required: true },
  regNo: { type: String, required: true },
  fatherName: { type: String, required: true },
  studentContact: { type: String, required: true },
  guardianContact: { type: String, required: true },
  course: { type: String, required: true },
  classMode: { type: String, default: 'Physical' },
  totalCourseFee: { type: Number, required: true },
  admissionFee: { type: Number, default: 0 },
  installment1: { type: Number, default: 0 },
  installment2: { type: Number, default: 0 },
  installment3: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('StudentFee', studentFeeSchema);