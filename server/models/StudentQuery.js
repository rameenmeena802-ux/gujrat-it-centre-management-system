const mongoose = require('mongoose');

const studentQuerySchema = new mongoose.Schema({
  date: { type: String, required: true },
  studentName: { type: String, required: true },
  whatsappNumber: { type: String, required: true },
  interestingCourse: { type: String, required: true },
  classMode: { type: String, default: 'Physical' },
  source: { type: String, default: 'WhatsApp' }
}, { timestamps: true });

module.exports = mongoose.model('StudentQuery', studentQuerySchema);