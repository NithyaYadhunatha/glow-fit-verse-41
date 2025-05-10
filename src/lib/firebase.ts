// API service configuration for Locked.in
import axios from 'axios';

// API base URL - would come from environment variables in a real app
const API_URL = 'http://localhost:5000/api';

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token in all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors (token expired, etc.)
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth service
const authService = {
  login: async (email: string, password: string) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      localStorage.setItem('authToken', response.data.token);
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Failed to login. Please check your credentials and try again.');
      }
    }
  },
  
  signup: async (email: string, password: string, displayName: string) => {
    try {
      const response = await apiClient.post('/auth/signup', { email, password, displayName });
      localStorage.setItem('authToken', response.data.token);
      return response.data;
    } catch (error: any) {
      console.error('Signup error:', error);
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Failed to create account. Please try again later.');
      }
    }
  },
  
  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
    }
  },
  
  resetPassword: async (email: string) => {
    try {
      const response = await apiClient.post('/auth/reset-password', { email });
      return response.data;
    } catch (error: any) {
      console.error('Reset password error:', error);
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Failed to reset password. Please try again later.');
      }
    }
  },
  
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (error: any) {
      console.error('Get current user error:', error);
      if (error.response && error.response.status === 401) {
        // Token is invalid or expired
        localStorage.removeItem('authToken');
      }
      throw error;
    }
  },
  
  googleSignIn: async () => {
    try {
      // In a real implementation, this would redirect to Google OAuth
      // For now, we'll simulate it with a direct API call
      const response = await apiClient.get('/auth/google');
      localStorage.setItem('authToken', response.data.token);
      return response.data;
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Failed to sign in with Google. Please try again later.');
      }
    }
  },
  
  facebookSignIn: async () => {
    try {
      // In a real implementation, this would redirect to Facebook OAuth
      // For now, we'll simulate it with a direct API call
      const response = await apiClient.get('/auth/facebook');
      localStorage.setItem('authToken', response.data.token);
      return response.data;
    } catch (error: any) {
      console.error('Facebook sign-in error:', error);
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Failed to sign in with Facebook. Please try again later.');
      }
    }
  },
};

// User service
const userService = {
  updateProfile: async (data: any) => {
    try {
      const response = await apiClient.put('/users/profile', data);
      return response.data;
    } catch (error: any) {
      console.error('Update profile error:', error);
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Failed to update profile. Please try again later.');
      }
    }
  },
  
  updateEmail: async (email: string) => {
    try {
      const response = await apiClient.put('/auth/email', { email });
      return response.data;
    } catch (error: any) {
      console.error('Update email error:', error);
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Failed to update email. Please try again later.');
      }
    }
  },
  
  updatePassword: async (password: string) => {
    try {
      const response = await apiClient.put('/auth/password', { password });
      return response.data;
    } catch (error: any) {
      console.error('Update password error:', error);
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Failed to update password. Please try again later.');
      }
    }
  },
  
  getWorkoutHistory: async () => {
    try {
      const response = await apiClient.get('/users/workout-history');
      return response.data;
    } catch (error: any) {
      console.error('Get workout history error:', error);
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Failed to get workout history. Please try again later.');
      }
    }
  },
  
  saveWorkoutResult: async (workoutData: any) => {
    try {
      const response = await apiClient.post('/users/workout-history', workoutData);
      return response.data;
    } catch (error: any) {
      console.error('Save workout result error:', error);
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Failed to save workout result. Please try again later.');
      }
    }
  },
};

// Workout service
const workoutService = {
  getWorkouts: async (filters?: any) => {
    try {
      const response = await apiClient.get('/workouts', { params: filters });
      return response.data;
    } catch (error: any) {
      console.error('Get workouts error:', error);
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Failed to get workouts. Please try again later.');
      }
    }
  },
  
  getWorkoutById: async (id: string) => {
    try {
      const response = await apiClient.get(`/workouts/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Get workout by ID error:', error);
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Failed to get workout details. Please try again later.');
      }
    }
  },
  
  getRecommendedWorkouts: async () => {
    try {
      const response = await apiClient.get('/workouts/recommended');
      return response.data;
    } catch (error: any) {
      console.error('Get recommended workouts error:', error);
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Failed to get recommended workouts. Please try again later.');
      }
    }
  },
};

// Export services
export { 
  apiClient, 
  authService, 
  userService, 
  workoutService 
};