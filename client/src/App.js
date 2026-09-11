import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Admission from './pages/Admission';
import Attendance from './pages/Attendance';
import Expenses from './pages/Expenses';
import StudentFee from './pages/StudentFee';
import StaffSalary from './pages/StaffSalary';
import Courses from './pages/Courses';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Login from './pages/Login';
import StudentQuery from './pages/StudentQuery';
import StudentVisiting from './pages/StudentVisiting';

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="admission" element={<Admission />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="expenses" element={<Expenses />} />
        <Route path="salary" element={<StaffSalary />} />
        <Route path="fee" element={<StudentFee />} />
        <Route path="courses" element={<Courses />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
        <Route path="student-query" element={<StudentQuery />} />
        <Route path="student-visiting" element={<StudentVisiting />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;