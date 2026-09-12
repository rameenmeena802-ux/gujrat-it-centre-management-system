const dns = require('dns');
dns.setServers(['1.1.1.1', '8.8.8.8']);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/staff-salary', require('./routes/staffSalaryRoutes'));
app.use('/api/student-fee', require('./routes/studentFeeRoutes'));
app.use('/api/student-query', require('./routes/studentQueryRoutes'));
app.use('/api/student-visiting', require('./routes/studentVisitingRoutes'));

app.get('/', (req, res) => {
  res.send('Gujrat IT Centre API is running...');
});

// MongoDB Connection + Server Start
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log('❌ MongoDB Error:', err.message);
  });

module.exports = app;