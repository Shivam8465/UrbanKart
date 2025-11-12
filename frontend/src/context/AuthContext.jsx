import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

// API Base URL - Change this when deploying
 const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem('accessToken');
      const storedRefreshToken = localStorage.getItem('refreshToken');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        setAccessToken(storedToken);
        
        // Fetch fresh user data with current role from backend
        try {
          const response = await fetch(`${API_URL}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${storedToken}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            // Update with fresh data from backend (includes current role from DB)
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
            console.log('✅ User loaded with role:', data.user.role);
          } else {
            // Token expired, try to refresh
            if (storedRefreshToken) {
              await refreshAccessToken(storedRefreshToken);
            } else {
              logout();
            }
          }
        } catch (error) {
          console.error('Load user failed:', error);
          logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  // Refresh access token using refresh token
  const refreshAccessToken = async (refreshToken) => {
    try {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('accessToken', data.accessToken);
        setAccessToken(data.accessToken);
        return true;
      } else {
        logout();
        return false;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      return false;
    }
  };

  // SIGNUP with backend
  const signup = async (name, email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save tokens and user data
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        setUser(data.user);
        setAccessToken(data.accessToken);
        
        console.log('✅ Signup successful:', data.user.email, 'Role:', data.user.role);
        return true;
      } else {
        console.error('Signup failed:', data.message);
        alert(data.message || 'Signup failed');
        return false;
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('Network error. Please check your connection and try again.');
      return false;
    }
  };

  // LOGIN with backend
  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save tokens and user data
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        setUser(data.user);
        setAccessToken(data.accessToken);
        
        console.log('✅ Login successful:', data.user.email, 'Role:', data.user.role);
        return true;
      } else {
        console.error('Login failed:', data.message);
        alert(data.message || 'Login failed');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Network error. Please check your connection and try again.');
      return false;
    }
  };

  // LOGOUT
  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (refreshToken && accessToken) {
        // Call backend logout to invalidate refresh token
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({ refreshToken }),
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage and state
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setUser(null);
      setAccessToken(null);
      console.log('✅ Logged out');
    }
  };

  // SEND OTP (Phone authentication - not implemented in backend yet)
  const sendOtp = async (phoneNumber) => {
    console.log("⚠️ Phone OTP not implemented in backend yet");
    alert("Phone authentication is not available yet. Please use email signup/login.");
    return false;
  };

  // VERIFY OTP (Phone authentication - not implemented in backend yet)
  const verifyOtp = async (phoneNumber, otp) => {
    console.log("⚠️ Phone OTP verification not implemented in backend yet");
    alert("Phone authentication is not available yet. Please use email signup/login.");
    return false;
  };

  // LOGIN WITH GOOGLE (Not implemented in backend yet)
  const loginWithGoogle = () => {
    console.log("⚠️ Google Sign-In not implemented in backend yet");
    alert("Google Sign-In is not available yet. Please use email signup/login.");
  };

  // UPDATE PROFILE
  const updateProfile = async (name) => {
    try {
      const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();

      if (response.ok) {
        const updatedUser = data.user;
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        console.log('✅ Profile updated');
        return true;
      } else {
        console.error('Update profile failed:', data.message);
        alert(data.message || 'Failed to update profile');
        return false;
      }
    } catch (error) {
      console.error('Update profile error:', error);
      alert('Network error. Please try again.');
      return false;
    }
  };

  // CHANGE PASSWORD
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await fetch(`${API_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Password changed successfully');
        alert('Password changed successfully. Please login again.');
        logout();
        return true;
      } else {
        console.error('Change password failed:', data.message);
        alert(data.message || 'Failed to change password');
        return false;
      }
    } catch (error) {
      console.error('Change password error:', error);
      alert('Network error. Please try again.');
      return false;
    }
  };

  // Helper function to make authenticated API calls
  const authenticatedFetch = async (url, options = {}) => {
    const token = accessToken || localStorage.getItem('accessToken');
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`
      }
    });

    // If token expired, try to refresh
    if (response.status === 401) {
      const data = await response.json();
      if (data.expired) {
        const refreshToken = localStorage.getItem('refreshToken');
        const refreshed = await refreshAccessToken(refreshToken);
        
        if (refreshed) {
          // Retry the original request with new token
          const newToken = localStorage.getItem('accessToken');
          return fetch(url, {
            ...options,
            headers: {
              ...options.headers,
              'Authorization': `Bearer ${newToken}`
            }
          });
        }
      }
    }

    return response;
  };

  // Manual refresh user data (call this after changing role in db.json)
  const refreshUserData = async () => {
    const token = accessToken || localStorage.getItem('accessToken');
    if (!token) return false;

    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        console.log('✅ User data refreshed. Current role:', data.user.role);
        alert(`User data updated! You are now: ${data.user.role === 'admin' ? 'Admin' : 'User'}`);
        return true;
      }
    } catch (error) {
      console.error('Refresh user data error:', error);
    }
    return false;
  };

  const value = {
    user,
    loading,
    accessToken,
    login,
    signup,
    logout,
    sendOtp,
    verifyOtp,
    loginWithGoogle,
    updateProfile,
    changePassword,
    authenticatedFetch,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};