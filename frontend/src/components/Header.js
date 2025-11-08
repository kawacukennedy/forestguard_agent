import React, { useState, useEffect } from 'react';

const Header = () => {
  const [somniaConnected, setSomniaConnected] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');

  useEffect(() => {
    // Mock Somnia connection check
    const checkConnection = () => {
      // In real, check Somnia network status
      setSomniaConnected(Math.random() > 0.5);
    };
    checkConnection();
    const interval = setInterval(checkConnection, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  return (
    <header className="bg-green-600 dark:bg-green-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">ForestGuard Agent</h1>
      <div className="flex items-center">
        <button onClick={() => setDarkMode(!darkMode)} className="mr-4 px-2 py-1 bg-gray-600 rounded">
          {darkMode ? 'Light' : 'Dark'} Mode
        </button>
        <span className={`mr-4 px-2 py-1 rounded ${somniaConnected ? 'bg-green-300 text-green-800' : 'bg-red-300 text-red-800'}`}>
          Somnia: {somniaConnected ? 'Connected' : 'Disconnected'}
        </span>
        <button onClick={() => window.location.href = '/stats'} className="mr-4">Stats</button>
        <button onClick={() => window.location.href = '/settings'} className="mr-4">Settings</button>
        <button className="mr-4">Notifications</button>
        <button onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }}>Logout</button>
      </div>
    </header>
  );
};

export default Header;