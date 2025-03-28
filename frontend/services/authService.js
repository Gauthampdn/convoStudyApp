import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { 
  IOS_GOOGLE_CLIENT_ID, 
  ANDROID_GOOGLE_CLIENT_ID, 
  WEB_GOOGLE_CLIENT_ID,
  API_URL as ENV_API_URL
} from '@env';

// Initialize WebBrowser for Expo Auth Session
WebBrowser.maybeCompleteAuthSession();

const API_URL = ENV_API_URL || 'http://localhost:3000/api';

export const storeAuthData = async (accessToken, refreshToken, userData) => {
  try {
    await AsyncStorage.setItem('accessToken', accessToken);
    await AsyncStorage.setItem('refreshToken', refreshToken);
    await AsyncStorage.setItem('userData', JSON.stringify(userData));
  } catch (error) {
    console.error('Error storing auth data:', error);
  }
};

export const getAuthData = async () => {
  try {
    const accessToken = await AsyncStorage.getItem('accessToken');
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    const userData = await AsyncStorage.getItem('userData');
    return {
      accessToken,
      refreshToken,
      user: userData ? JSON.parse(userData) : null
    };
  } catch (error) {
    console.error('Error retrieving auth data:', error);
    return { accessToken: null, refreshToken: null, user: null };
  }
};

export const removeAuthData = async () => {
  try {
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
    await AsyncStorage.removeItem('userData');
  } catch (error) {
    console.error('Error removing auth data:', error);
  }
};

export const isAuthenticated = async () => {
  try {
    const accessToken = await AsyncStorage.getItem('accessToken');
    return !!accessToken;
  } catch (error) {
    return false;
  }
};

// Refresh the access token using refresh token
export const refreshAccessToken = async () => {
  try {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      // Check if refresh token expired
      if (data.expired) {
        console.log('Refresh token expired, logging out');
        await removeAuthData();
        return null;
      }
      throw new Error(data.message || 'Failed to refresh token');
    }
    
    // Store the new access token
    await AsyncStorage.setItem('accessToken', data.accessToken);
    
    // Also store the new refresh token if provided (token rotation)
    if (data.refreshToken) {
      await AsyncStorage.setItem('refreshToken', data.refreshToken);
      console.log('Stored new refresh token (token rotation)');
    }
    
    return data.accessToken;
  } catch (error) {
    console.error('Token refresh error:', error);
    // On refresh failure, clear auth data
    await removeAuthData();
    return null;
  }
};

// Make an authenticated API request with automatic token refresh
export const fetchWithAuth = async (url, options = {}) => {
  try {
    let accessToken = await AsyncStorage.getItem('accessToken');
    
    // Create request with access token
    const authOptions = {
      ...options,
      headers: {
        ...options.headers,
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    };
    
    // Make the request
    let response = await fetch(url, authOptions);
    
    // If token expired, try to refresh
    if (response.status === 401) {
      try {
        const responseData = await response.json();
        
        // Check if token expired
        if (responseData.tokenExpired) {
          console.log('Access token expired, refreshing...');
          
          // Try to get a new access token
          accessToken = await refreshAccessToken();
          
          // If refresh successful, retry the request
          if (accessToken) {
            console.log('Token refresh successful, retrying request');
            authOptions.headers.Authorization = `Bearer ${accessToken}`;
            response = await fetch(url, authOptions);
          } else {
            console.log('Token refresh failed, authentication required');
            // Create a customized response to indicate auth required
            return new Response(JSON.stringify({ 
              success: false, 
              message: 'Authentication required',
              authRequired: true
            }), {
              status: 401,
              headers: { 'Content-Type': 'application/json' }
            });
          }
        }
      } catch (parseError) {
        console.error('Error parsing 401 response:', parseError);
        // Continue with original response if we can't parse the response
      }
    }
    
    return response;
  } catch (error) {
    console.error('Fetch with auth error:', error);
    throw error;
  }
};

// Logout from the server and clear local storage
export const logout = async () => {
  try {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    
    if (refreshToken) {
      // Notify server about logout
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });
    }
    
    // Clear local storage regardless of server response
    await removeAuthData();
  } catch (error) {
    console.error('Logout error:', error);
    // Still clear local storage even if server request fails
    await removeAuthData();
  }
};

// Initialize Google Auth - call this in your component where you want to use Google Sign-In
export const useGoogleAuth = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: IOS_GOOGLE_CLIENT_ID,
    androidClientId: ANDROID_GOOGLE_CLIENT_ID,
    webClientId: WEB_GOOGLE_CLIENT_ID,
  });

  return { request, response, promptAsync };
};

// Process Google Sign In
export const processGoogleSignIn = async (response) => {
  if (response?.type !== 'success') {
    throw new Error('Google sign in was not successful');
  }

  // Get user info from Google
  const userInfoResponse = await fetch(
    'https://www.googleapis.com/userinfo/v2/me',
    {
      headers: { Authorization: `Bearer ${response.authentication.accessToken}` },
    }
  );
  
  const userInfo = await userInfoResponse.json();
  
  // Call our backend with the Google user info
  return await googleSignIn({
    email: userInfo.email,
    id: userInfo.id,
    name: userInfo.name,
    picture: userInfo.picture
  });
};

// Send Google profile to our backend
export const googleSignIn = async (googleData) => {
  try {
    const response = await fetch(`${API_URL}/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: googleData.email,
        googleId: googleData.id,
        name: googleData.name,
        picture: googleData.picture
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to sign in with Google');
    }

    // Store both tokens and user data
    await storeAuthData(data.accessToken, data.refreshToken, data.user);

    return data;
  } catch (error) {
    console.error('Google sign in error:', error);
    throw error;
  }
}; 