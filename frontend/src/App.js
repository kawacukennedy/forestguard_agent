import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import IncidentDetail from './pages/IncidentDetail';
import Upload from './pages/Upload';

function App() {
  const isLoggedIn = localStorage.getItem('token');

  return (
    <Router>
      <div className="App min-h-screen flex flex-col">
        {isLoggedIn && <Header />}
        <main className="flex-grow">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/incident/:id" element={<IncidentDetail />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/" element={<Login />} />
          </Routes>
        </main>
        {isLoggedIn && <Footer />}
      </div>
    </Router>
  );
}

export default App;