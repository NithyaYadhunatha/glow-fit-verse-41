import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

// Define User type for MERN stack
interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  createdAt: string;
  fitnessGoals: string[];
  fitnessLevel: string;
  height?: number;
  weight?: number;
  birthdate?: string;
  gender?: string;
  preferredWorkouts?: string[];
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signup: (email: string, password: string, displayName: string) => Promise<User>;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  googleSignIn: () => Promise<User>;
  facebookSignIn: () => Promise<User>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (displayName: string, photoURL?: string) => Promise<void>;
  userProfile: UserProfile | null;
}

// API base URL - would come from environment variables in a real app
const API_URL = 'http://localhost:5000/api';

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  return useContext(AuthContext) as AuthContextType;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Get auth token from localStorage
        const token = localStorage.getItem('authToken');
        
        if (token) {
          // Set auth header for all future requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Fetch current user data
          const response = await axios.get(`${API_URL}/auth/me`);
          
          if (response.data.user) {
            setCurrentUser(response.data.user);
            setUserProfile(response.data.profile || null);
          }
        }
      } catch (err) {
        console.error('Auth status check failed:', err);
        // Clear potentially invalid token
        localStorage.removeItem('authToken');
        axios.defaults.headers.common['Authorization'] = '';
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  async function signup(email: string, password: string, displayName: string): Promise<User> {
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, { 
        email, 
        password, 
        displayName 
      });
      
      // Store token in localStorage
      localStorage.setItem('authToken', response.data.token);
      
      // Set auth header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
      // Set user data
      setCurrentUser(response.data.user);
      setUserProfile(response.data.profile);
      
      return response.data.user;
    } catch (err: any) {
      console.error('Signup error:', err.response?.data?.message || err.message);
      throw new Error(err.response?.data?.message || 'Signup failed');
    }
  }

  async function login(email: string, password: string): Promise<User> {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      
      // Store token in localStorage
      localStorage.setItem('authToken', response.data.token);
      
      // Set auth header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
      // Set user data
      setCurrentUser(response.data.user);
      setUserProfile(response.data.profile);
      
      return response.data.user;
    } catch (err: any) {
      console.error('Login error:', err.response?.data?.message || err.message);
      throw new Error(err.response?.data?.message || 'Login failed');
    }
  }

  async function logout(): Promise<void> {
    try {
      // Call logout endpoint (optional, depends on your backend implementation)
      await axios.post(`${API_URL}/auth/logout`);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear token from localStorage
      localStorage.removeItem('authToken');
      
      // Clear auth header
      axios.defaults.headers.common['Authorization'] = '';
      
      // Clear user data
      setCurrentUser(null);
      setUserProfile(null);
    }
  }

  async function googleSignIn(): Promise<User> {
    try {
      // In a real implementation, this would redirect to Google OAuth
      // For now, we'll simulate it with a direct API call
      const response = await axios.get(`${API_URL}/auth/google`);
      
      // Store token in localStorage
      localStorage.setItem('authToken', response.data.token);
      
      // Set auth header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
      // Set user data
      setCurrentUser(response.data.user);
      setUserProfile(response.data.profile);
      
      return response.data.user;
    } catch (err: any) {
      console.error('Google sign-in error:', err.response?.data?.message || err.message);
      throw new Error(err.response?.data?.message || 'Google sign-in failed');
    }
  }

  async function facebookSignIn(): Promise<User> {
    try {
      // In a real implementation, this would redirect to Facebook OAuth
      // For now, we'll simulate it with a direct API call
      const response = await axios.get(`${API_URL}/auth/facebook`);
      
      // Store token in localStorage
      localStorage.setItem('authToken', response.data.token);
      
      // Set auth header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
      // Set user data
      setCurrentUser(response.data.user);
      setUserProfile(response.data.profile);
      
      return response.data.user;
    } catch (err: any) {
      console.error('Facebook sign-in error:', err.response?.data?.message || err.message);
      throw new Error(err.response?.data?.message || 'Facebook sign-in failed');
    }
  }

  async function resetPassword(email: string): Promise<void> {
    try {
      await axios.post(`${API_URL}/auth/reset-password`, { email });
    } catch (err: any) {
      console.error('Password reset error:', err.response?.data?.message || err.message);
      throw new Error(err.response?.data?.message || 'Password reset failed');
    }
  }

  async function updateUserProfile(displayName: string, photoURL?: string): Promise<void> {
    if (!currentUser) throw new Error('No user logged in');
    
    try {
      const updates: { displayName: string; photoURL?: string } = { displayName };
      if (photoURL) updates.photoURL = photoURL;
      
      const response = await axios.put(`${API_URL}/users/profile`, updates);
      
      // Update local user state
      setCurrentUser(prev => {
        if (!prev) return null;
        return { ...prev, displayName, ...(photoURL && { photoURL }) };
      });
      
      // Update profile state
      setUserProfile(prev => {
        if (!prev) return null;
        return { ...prev, displayName, ...(photoURL && { photoURL }) };
      });
    } catch (err: any) {
      console.error('Profile update error:', err.response?.data?.message || err.message);
      throw new Error(err.response?.data?.message || 'Profile update failed');
    }
  }

  const value = {
    currentUser,
    userProfile,
    loading,
    signup,
    login,
    logout,
    googleSignIn,
    facebookSignIn,
    resetPassword,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}