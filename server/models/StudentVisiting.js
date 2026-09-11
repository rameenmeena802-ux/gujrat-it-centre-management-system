const mongoose = require('mongoose');

const studentVisitingSchema = new mongoose.Schema({
  date: { type: String, required: true },
  studentName: { type: String, required: true },
  contactNumber: { type: String, required: true },
  reference: { type: String, required: true },
  classMode: { type: String, default: 'Physical' },
  admissionDone: { type: String, enum: ['Yes', 'No'], default: 'No' }
}, { timestamps: true });

module.exports = mongoose.model('StudentVisiting', studentVisitingSchema);