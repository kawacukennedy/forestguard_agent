import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Settings = () => {
  const [user, setUser] = useState(null);
  const [preferences, setPreferences] = useState({
    theme: 'light',
    notifications: true,
    emailAlerts: true,
    referralCode: ''
  });

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:8000/api/auth/me', { headers: { Authorization: `Bearer ${token}` } });
        setUser(response.data);
        setPreferences({
          theme: localStorage.getItem('darkMode') === 'true' ? 'dark' : 'light',
          notifications: true, // Mock
          emailAlerts: true, // Mock
          referralCode: response.data.referral_code || ''
        });
      } catch (error) {
        console.error('Failed to fetch user', error);
      }
    };
    fetchUser();
  }, []);

  const savePreferences = async () => {
    // Mock save
    localStorage.setItem('darkMode', preferences.theme === 'dark');
    alert('Preferences saved!');
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="p-8 bg-white dark:bg-gray-900 text-black dark:text-white">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Theme</label>
          <select value={preferences.theme} onChange={(e) => setPreferences({...preferences, theme: e.target.value})} className="mt-1 w-full px-3 py-2 border rounded dark:bg-gray-800">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        <div>
          <label className="flex items-center">
            <input type="checkbox" checked={preferences.notifications} onChange={(e) => setPreferences({...preferences, notifications: e.target.checked})} className="mr-2" />
            Enable Notifications
          </label>
        </div>
        <div>
          <label className="flex items-center">
            <input type="checkbox" checked={preferences.emailAlerts} onChange={(e) => setPreferences({...preferences, emailAlerts: e.target.checked})} className="mr-2" />
            Email Alerts
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium">Referral Code</label>
          <input type="text" value={preferences.referralCode} onChange={(e) => setPreferences({...preferences, referralCode: e.target.value})} className="mt-1 w-full px-3 py-2 border rounded dark:bg-gray-800" />
          <p className="text-sm mt-1">Share this code to invite friends and earn bonus rewards!</p>
        </div>
        <button onClick={savePreferences} className="bg-blue-600 text-white px-4 py-2 rounded">Save Preferences</button>
      </div>
    </div>
  );
};

export default Settings;