import React, { useState } from 'react';
import Toast from '../components/Toast';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('institute');
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const [institute, setInstitute] = useState({
    name: 'Gujrat IT Centre',
    email: 'info@gujratitcentre.pk',
    phone: '0325-7882526',
    address: 'Qamar Sialvi road near Qamar ul Uloom, Gujrat, Punjab, Pakistan',
    website: 'gujratitcentre.pk'
  });

  const [admin, setAdmin] = useState({
    fullName: 'Admin',
    email: 'info@gujratitcentre.pk',
    phone: '0325-7882526',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [academic, setAcademic] = useState({
    session: '2026',
    gradingSystem: 'Percentage',
    passPercentage: '40',
    workingDays: '26'
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    feeReminders: true,
    attendanceAlerts: true,
    birthdayAlerts: true
  });

  const handleInstituteChange = (e) => setInstitute({ ...institute, [e.target.name]: e.target.value });
  const handleAdminChange = (e) => setAdmin({ ...admin, [e.target.name]: e.target.value });
  const handleAcademicChange = (e) => setAcademic({ ...academic, [e.target.name]: e.target.value });
  const handleNotificationToggle = (key) => setNotifications({ ...notifications, [key]: !notifications[key] });

  const saveInstitute = (e) => {
    e.preventDefault();
    showToast('Institute Settings Saved Successfully!', 'success');
  };

  const saveAdmin = (e) => {
    e.preventDefault();
    if (admin.newPassword && admin.newPassword !== admin.confirmPassword) {
      showToast('Passwords do not match!', 'error');
      return;
    }
    showToast('Admin Profile Updated Successfully!', 'success');
  };

  const saveAcademic = (e) => {
    e.preventDefault();
    showToast('Academic Settings Saved Successfully!', 'success');
  };

  const saveNotifications = () => showToast('Notification Settings Saved!', 'success');

  const tabs = [
    { id: 'institute', label: 'Institute Profile' },
    { id: 'admin', label: 'Admin Profile' },
    { id: 'academic', label: 'Academic Settings' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'backup', label: 'Backup & Restore' },
  ];

  return (
    <div className="space-y-6">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div>
        <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
        <p className="text-gray-500 text-sm">Institute, Admin aur System settings manage karein</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-4 rounded-xl shadow-md md:col-span-1">
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left p-3 rounded-lg transition text-sm ${activeTab === tab.id ? 'bg-[#1e3a8a] text-white font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="md:col-span-3 bg-white p-6 rounded-xl shadow-md">
          {activeTab === 'institute' && (
            <form onSubmit={saveInstitute} className="space-y-5">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Institute Profile</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Institute Name</label>
                  <input type="text" name="name" value={institute.name} onChange={handleInstituteChange} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#1e3a8a]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                  <input type="email" name="email" value={institute.email} onChange={handleInstituteChange} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#1e3a8a]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Phone</label>
                  <input type="text" name="phone" value={institute.phone} onChange={handleInstituteChange} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#1e3a8a]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Website</label>
                  <input type="text" name="website" value={institute.website} onChange={handleInstituteChange} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#1e3a8a]" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Address</label>
                  <input type="text" name="address" value={institute.address} onChange={handleInstituteChange} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#1e3a8a]" />
                </div>
              </div>
              <button type="submit" className="bg-[#1e3a8a] text-white px-6 py-3 rounded-lg hover:bg-[#1e40af]">
                Save Institute Settings
              </button>
            </form>
          )}

          {activeTab === 'admin' && (
            <form onSubmit={saveAdmin} className="space-y-5">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Admin Profile</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                  <input type="text" name="fullName" value={admin.fullName} onChange={handleAdminChange} className="w-full border border-gray-300 p-3 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                  <input type="email" name="email" value={admin.email} onChange={handleAdminChange} className="w-full border border-gray-300 p-3 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Phone</label>
                  <input type="text" name="phone" value={admin.phone} onChange={handleAdminChange} className="w-full border border-gray-300 p-3 rounded-lg" />
                </div>
              </div>
              <hr />
              <h4 className="text-md font-semibold text-gray-700">Change Password</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Current Password</label>
                  <input type="password" name="currentPassword" value={admin.currentPassword} onChange={handleAdminChange} className="w-full border border-gray-300 p-3 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">New Password</label>
                  <input type="password" name="newPassword" value={admin.newPassword} onChange={handleAdminChange} className="w-full border border-gray-300 p-3 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Confirm Password</label>
                  <input type="password" name="confirmPassword" value={admin.confirmPassword} onChange={handleAdminChange} className="w-full border border-gray-300 p-3 rounded-lg" />
                </div>
              </div>
              <button type="submit" className="bg-[#1e3a8a] text-white px-6 py-3 rounded-lg hover:bg-[#1e40af]">
                Update Admin Profile
              </button>
            </form>
          )}

          {activeTab === 'academic' && (
            <form onSubmit={saveAcademic} className="space-y-5">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Academic Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Current Session</label>
                  <input type="text" name="session" value={academic.session} onChange={handleAcademicChange} className="w-full border border-gray-300 p-3 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Grading System</label>
                  <select name="gradingSystem" value={academic.gradingSystem} onChange={handleAcademicChange} className="w-full border border-gray-300 p-3 rounded-lg">
                    <option value="Percentage">Percentage</option>
                    <option value="GPA">GPA</option>
                    <option value="Grades">Grades</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Pass Percentage (%)</label>
                  <input type="number" name="passPercentage" value={academic.passPercentage} onChange={handleAcademicChange} className="w-full border border-gray-300 p-3 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Monthly Working Days</label>
                  <input type="number" name="workingDays" value={academic.workingDays} onChange={handleAcademicChange} className="w-full border border-gray-300 p-3 rounded-lg" />
                </div>
              </div>
              <button type="submit" className="bg-[#1e3a8a] text-white px-6 py-3 rounded-lg hover:bg-[#1e40af]">
                Save Academic Settings
              </button>
            </form>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-5">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Notification Settings</h3>
              <div className="space-y-3">
                {[
                  { key: 'emailAlerts', label: 'Email Alerts', desc: 'Receive important alerts via email' },
                  { key: 'smsAlerts', label: 'SMS Alerts', desc: 'Receive SMS notifications' },
                  { key: 'feeReminders', label: 'Fee Reminders', desc: 'Automatic fee reminder notifications' },
                  { key: 'attendanceAlerts', label: 'Attendance Alerts', desc: 'Alert when student is absent' },
                  { key: 'birthdayAlerts', label: 'Birthday Alerts', desc: 'Student/Staff birthday notifications' },
                ].map((item) => (
                  <div key={item.key} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-700">{item.label}</p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => handleNotificationToggle(item.key)}
                      className={`relative w-14 h-7 rounded-full transition ${notifications[item.key] ? 'bg-green-500' : 'bg-gray-300'}`}
                    >
                      <span className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${notifications[item.key] ? 'translate-x-7' : ''}`}></span>
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={saveNotifications} className="bg-[#1e3a8a] text-white px-6 py-3 rounded-lg hover:bg-[#1e40af]">
                Save Notification Settings
              </button>
            </div>
          )}

          {activeTab === 'backup' && (
            <div className="space-y-5">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Backup & Restore</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-2 border-dashed border-green-300 bg-green-50 p-6 rounded-xl text-center">
                  <h4 className="font-semibold text-gray-700">Data Backup</h4>
                  <p className="text-xs text-gray-500 mt-1 mb-4">Apna saara data backup karein</p>
                  <button
                    onClick={() => showToast('Backup Started Successfully!', 'success')}
                    className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
                  >
                    Download Backup
                  </button>
                </div>
                <div className="border-2 border-dashed border-blue-300 bg-blue-50 p-6 rounded-xl text-center">
                  <h4 className="font-semibold text-gray-700">Data Restore</h4>
                  <p className="text-xs text-gray-500 mt-1 mb-4">Purana backup upload karein</p>
                  <button
                    onClick={() => showToast('Restore feature coming soon!', 'error')}
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Upload Backup
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;