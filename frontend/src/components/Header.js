import React, { useState, useEffect } from 'react';

const Header = () => {
  const [somniaConnected, setSomniaConnected] = useState(false);

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

  return (
    <header className="bg-green-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">ForestGuard Agent</h1>
      <div className="flex items-center">
        <span className={`mr-4 px-2 py-1 rounded ${somniaConnected ? 'bg-green-300 text-green-800' : 'bg-red-300 text-red-800'}`}>
          Somnia: {somniaConnected ? 'Connected' : 'Disconnected'}
        </span>
        <button className="mr-4">Notifications</button>
        <button onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }}>Logout</button>
      </div>
    </header>
  );
};

export default Header;