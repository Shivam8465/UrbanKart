import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // --- SIMULATED BACKEND FUNCTIONS ---

  const login = async (email, password) => {
    console.log("Simulating login with:", email, password);
    // TODO: Replace with a real API call to your backend
    // const response = await fetch('/api/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    // const data = await response.json();
    // if (data.success) { setUser(data.user); return true; } else { return false; }
    
    // For the prototype, we'll just log in a fake user
    setUser({ name: "Test User", email: email });
    return true; // Indicate success
  };

  const signup = async (name, email, password) => {
    console.log("Simulating signup with:", name, email, password);
    // TODO: Replace with a real API call to your backend
    setUser({ name: name, email: email });
    return true;
  };

  const sendOtp = async (phoneNumber) => {
    console.log("Simulating sending OTP to:", phoneNumber);
    // TODO: Replace with a real API call to your backend to send an SMS
    // For the prototype, we'll just pretend it worked
    return true;
  };

  const verifyOtp = async (phoneNumber, otp) => {
    console.log("Simulating verifying OTP:", otp, "for number:", phoneNumber);
    // TODO: Replace with a real API call to your backend
    if (otp === "123456") { // Use a magic OTP for the prototype
      setUser({ name: "Phone User", phone: phoneNumber });
      return true;
    }
    return false;
  };

  const loginWithGoogle = () => {
    console.log("Simulating login with Google");
    // In a real app, this would open the Google OAuth popup.
    // TODO: Integrate Google Sign-In SDK
    setUser({ name: "Google User", email: "googleuser@example.com" });
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    login,
    signup,
    logout,
    sendOtp,
    verifyOtp,
    loginWithGoogle,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};