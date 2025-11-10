import React, { useState } from 'react';
import axios from 'axios';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const Login = () => {
  const { publicKey, connected } = useWallet();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [builderId, setBuilderId] = useState('');
  const [walletAddresses, setWalletAddresses] = useState({});

  const connectWallet = async (chain) => {
    if (chain === 'solana' && connected) {
      setWalletAddresses({...walletAddresses, [chain]: publicKey.toString()});
      alert(`Connected to Solana wallet: ${publicKey.toString()}`);
    } else {
      // Mock for other chains
      const address = `${chain}_address_${Math.random().toString(36).substr(2, 9)}`;
      setWalletAddresses({...walletAddresses, [chain]: address});
      alert(`Connected to ${chain} wallet: ${address}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const response = await axios.post('http://localhost:8000/api/login', { email, password });
        localStorage.setItem('token', response.data.access_token);
        window.location.href = '/dashboard';
      } else {
        await axios.post('http://localhost:8000/api/register', { name, email, password, builder_id: builderId, wallet_addresses: walletAddresses });
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
              <div className="space-y-2">
                <p>Connect Wallets:</p>
                <WalletMultiButton className="w-full" />
                <button type="button" onClick={() => connectWallet('sui')} className="w-full bg-blue-600 text-white py-2 rounded">Connect Sui Wallet</button>
                <button type="button" onClick={() => connectWallet('ton')} className="w-full bg-teal-600 text-white py-2 rounded">Connect TON Wallet</button>
                <button type="button" onClick={() => connectWallet('somnia')} className="w-full bg-orange-600 text-white py-2 rounded">Connect Somnia Wallet</button>
              </div>
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