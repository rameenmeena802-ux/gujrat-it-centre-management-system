const mongoose = require('mongoose');

const staffSalarySchema = new mongoose.Schema({
  staffName: { type: String, required: true },
  designation: { type: String, required: true },
  basicSalary: { type: Number, required: true },
  workingDays: { type: Number, required: true },
  presentDays: { type: Number, required: true },
  deductions: { type: Number, default: 0 },
  bonus: { type: Number, default: 0 },
  paidAmount: { type: Number, default: 0 },
  paymentDate: { type: String, default: '' },
  month: { type: String, required: true },
  year: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('StaffSalary', staffSalarySchema);