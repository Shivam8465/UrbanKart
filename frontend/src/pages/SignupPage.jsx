import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [loginId, setLoginId] = useState(''); // Can be email or phone
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState('email'); // 'email' or 'phone'
  const [otpSent, setOtpSent] = useState(false);
  
  const { signup, loginWithGoogle, sendOtp, verifyOtp } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSignup = () => {
    loginWithGoogle(); // The simulation is the same for login/signup
    navigate('/');
  };

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    setError('');
    // In a real app, the signup function would also take the email (loginId) and password
    const success = await signup(name, loginId, password);
    if (success) {
      navigate('/');
    } else {
      setError('Could not create account. Please try again.');
    }
  };

  const handlePhoneSignup = async (e) => {
    e.preventDefault();
    setError('');
    const success = await sendOtp(loginId);
    if (success) {
      setOtpSent(true);
    } else {
      setError('Failed to send OTP. Please try again.');
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    setError('');
    // In a real app, after verification, you would call the signup function
    const success = await verifyOtp(loginId, otp);
    if (success) {
      // Here you would typically call signup(name, loginId)
      console.log(`Simulating signup for ${name} with phone ${loginId}`);
      navigate('/');
    } else {
      setError('Invalid OTP. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] bg-gray-50 py-12">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-center text-gray-800">Create an Account</h1>
        
        <button
          onClick={handleGoogleSignup}
          className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google icon" className="w-6 h-6" />
          <span className="font-semibold text-gray-700">Sign up with Google</span>
        </button>

        <div className="flex items-center">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-4 text-gray-500 text-sm">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <div className="flex border-b">
          <button onClick={() => { setMode('email'); setOtpSent(false); setLoginId(''); }} className={`flex-1 py-2 font-semibold ${mode === 'email' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>
            Email
          </button>
          <button onClick={() => { setMode('phone'); setOtpSent(false); setLoginId(''); }} className={`flex-1 py-2 font-semibold ${mode === 'phone' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>
            Phone
          </button>
        </div>

        {/* Email Signup Form */}
        {mode === 'email' && (
          <form onSubmit={handleEmailSignup} className="space-y-4">
            <div><label htmlFor="name">Full Name</label><input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"/></div>
            <div><label htmlFor="email">Email Address</label><input id="email" type="email" required value={loginId} onChange={(e) => setLoginId(e.target.value)} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"/></div>
            <div><label htmlFor="password">Password</label><input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"/></div>
            <button type="submit" className="w-full py-2 font-semibold text-white bg-gray-800 rounded-md hover:bg-gray-900">Create Account</button>
          </form>
        )}

        {/* Phone Signup Form */}
        {mode === 'phone' && !otpSent && (
          <form onSubmit={handlePhoneSignup} className="space-y-4">
            <div><label htmlFor="name">Full Name</label><input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"/></div>
            <div><label htmlFor="phone">Phone Number</label><input id="phone" type="tel" required value={loginId} onChange={(e) => setLoginId(e.target.value)} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"/></div>
            <button type="submit" className="w-full py-2 font-semibold text-white bg-gray-800 rounded-md hover:bg-gray-900">Send OTP</button>
          </form>
        )}

        {/* OTP Verification Form */}
        {mode === 'phone' && otpSent && (
          <form onSubmit={handleOtpVerification} className="space-y-4">
            <p className="text-sm text-center">Enter the OTP sent to {loginId}</p>
            <div><label htmlFor="otp">OTP</label><input id="otp" type="text" required value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"/></div>
            <button type="submit" className="w-full py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700">Verify & Create Account</button>
          </form>
        )}
        
        {error && <p className="text-sm text-center text-red-500">{error}</p>}
        
        <p className="text-sm text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;