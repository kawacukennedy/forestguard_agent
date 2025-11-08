import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [builderId, setBuilderId] = useState('');
  const [somniaWallet, setSomniaWallet] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const response = await axios.post('http://localhost:8000/api/login', { email, password });
        localStorage.setItem('token', response.data.access_token);
        window.location.href = '/dashboard';
      } else {
        await axios.post('http://localhost:8000/api/register', { name, email, password, builder_id: builderId, somnia_wallet_address: somniaWallet });
        alert('Registration successful, please login');
        setIsLogin(true);
      }
    } catch (error) {
      alert(isLogin ? 'Login failed' : 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Sign in to ForestGuard' : 'Register for ForestGuard'}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="w-full px-3 py-2 border rounded" required />
              <input type="text" value={builderId} onChange={(e) => setBuilderId(e.target.value)} placeholder="Builder ID" className="w-full px-3 py-2 border rounded" required />
              <input type="text" value={somniaWallet} onChange={(e) => setSomniaWallet(e.target.value)} placeholder="Somnia Wallet Address" className="w-full px-3 py-2 border rounded" required />
            </>
          )}
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full px-3 py-2 border rounded" required />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full px-3 py-2 border rounded" required />
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">{isLogin ? 'Sign In' : 'Register'}</button>
        </form>
        <div className="text-center">
          <button onClick={() => setIsLogin(!isLogin)} className="text-blue-600">{isLogin ? 'Need an account? Register' : 'Already have an account? Login'}</button>
        </div>
      </div>
    </div>
  );
};

export default Login;