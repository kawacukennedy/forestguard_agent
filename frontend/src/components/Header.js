import React from 'react';

const Header = () => {
  return (
    <header className="bg-green-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">ForestGuard Agent</h1>
      <div>
        <button className="mr-4">Notifications</button>
        <button onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }}>Logout</button>
      </div>
    </header>
  );
};

export default Header;