import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  getAuthData, 
  storeAuthData, 
  removeAuthData, 
  isAuthenticated as checkAuth,
  refreshAccessToken,
  logout as logoutService,
  fetchWithAuth
} from '../services/authService';

// Define the shape of our auth context
interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (accessToken: string, refreshToken: string, userData: any) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  authFetch: (url: string, options?: any) => Promise<Response>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  login: async () => {},
  logout: async () => {},
  checkAuthStatus: async () => {},
  authFetch: async () => new Response(),
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

// Provider component that wraps your app and provides the auth context value
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Check if the user is authenticated when the component mounts
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Function to check authentication status
  const checkAuthStatus = async () => {
    setLoading(true);
    try {
      const isUserAuthenticated = await checkAuth();
      setIsAuthenticated(isUserAuthenticated);
      
      if (isUserAuthenticated) {
        const { user: userData } = await getAuthData();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Function to log in
  const login = async (accessToken: string, refreshToken: string, userData: any) => {
    await storeAuthData(accessToken, refreshToken, userData);
    setUser(userData);
    setIsAuthenticated(true);
  };

  // Function to log out
  const logout = async () => {
    await logoutService(); // This will call the server and clear AsyncStorage
    setUser(null);
    setIsAuthenticated(false);
  };

  // Authenticated fetch function that uses tokens and handles refresh
  const authFetch = async (url: string, options = {}) => {
    const response = await fetchWithAuth(url, options);
    
    // Check if we need to re-authenticate
    if (response.status === 401) {
      try {
        const data = await response.json();
        if (data.authRequired) {
          // Authentication is required, set state to trigger login flow
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        // If we can't parse the response, continue
      }
    }
    
    return response;
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    checkAuthStatus,
    authFetch,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 