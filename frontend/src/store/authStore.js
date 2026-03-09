import { create } from 'zustand';
import { loginUser, registerUser, fetchProfile } from '../api/auth.api';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const data = await loginUser(credentials);
      set({ user: data.user, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Login failed. Please try again.', 
        isLoading: false 
      });
      return { success: false };
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const data = await registerUser(userData);
      set({ user: data.user, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Registration failed. Please try again.', 
        isLoading: false 
      });
      return { success: false };
    }
  },

  checkAuth: async () => {
    set({ isLoading: true, error: null });
    try {
      const user = await fetchProfile();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
        console.log("Error: ", error);
        
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  logout: () => {
    // Optional: Call a backend /logout endpoint here if you create one to clear the cookie
    set({ user: null, isAuthenticated: false });
  }
}));

export default useAuthStore;