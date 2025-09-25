import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [loginId, setLoginId] = useState(''); // Can be email or phone
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState('email'); // 'email' or 'phone'
  const [otpSent, setOtpSent] = useState(false);
  
  const { login, loginWithGoogle, sendOtp, verifyOtp } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    loginWithGoogle();
    navigate('/');
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    const success = await sendOtp(loginId);
    if (success) {
      setOtpSent(true);
    } else {
      setError('Failed to send OTP. Please check the number and try again.');
    }
  };

  const handleOtpLogin = async (e) => {
    e.preventDefault();
    setError('');
    const success = await verifyOtp(loginId, otp);
    if (success) {
      navigate('/');
    } else {
      setError('Invalid OTP. Please try again.');
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    const success = await login(loginId, password);
    if (success) {
      navigate('/');
    } else {
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] bg-gray-50 py-12">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-center text-gray-800">Login</h1>
        <p className="text-center text-gray-500">Welcome back to UrbanKart</p>
        
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google icon" className="w-6 h-6" />
          <span className="font-semibold text-gray-700">Continue with Google</span>
        </button>

        <div className="flex items-center">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-4 text-gray-500 text-sm">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Tab buttons to switch between Email and Phone */}
        <div className="flex border-b">
          <button onClick={() => { setMode('email'); setOtpSent(false); setLoginId(''); }} className={`flex-1 py-2 font-semibold ${mode === 'email' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>
            Email
          </button>
          <button onClick={() => { setMode('phone'); setOtpSent(false); setLoginId(''); }} className={`flex-1 py-2 font-semibold ${mode === 'phone' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>
            Phone
          </button>
        </div>

        {/* Email Login Form */}
        {mode === 'email' && (
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label htmlFor="email">Email Address</label>
              <input id="email" type="email" placeholder="you@example.com" required value={loginId} onChange={(e) => setLoginId(e.target.value)} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"/>
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"/>
            </div>
            <button type="submit" className="w-full py-2 font-semibold text-white bg-gray-800 rounded-md hover:bg-gray-900">Login with Email</button>
          </form>
        )}

        {/* Phone Login Form */}
        {mode === 'phone' && !otpSent && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label htmlFor="phone">Phone Number</label>
              <input id="phone" type="tel" placeholder="Enter your phone number" required value={loginId} onChange={(e) => setLoginId(e.target.value)} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"/>
            </div>
            <button type="submit" className="w-full py-2 font-semibold text-white bg-gray-800 rounded-md hover:bg-gray-900">Send OTP</button>
          </form>
        )}

        {/* OTP Verification Form */}
        {mode === 'phone' && otpSent && (
          <form onSubmit={handleOtpLogin} className="space-y-4">
            <p className="text-sm text-center">Enter the OTP sent to {loginId}</p>
            <div>
              <label htmlFor="otp">OTP</label>
              <input id="otp" type="text" placeholder="Enter 6-digit OTP" required value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"/>
            </div>
            <button type="submit" className="w-full py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700">Verify & Login</button>
          </form>
        )}
        
        {error && <p className="text-sm text-center text-red-500">{error}</p>}
        
        <p className="text-sm text-center text-gray-600">
          Need an account?{' '}
          <Link to="/signup" className="font-medium text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;