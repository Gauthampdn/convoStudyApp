import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Google from 'expo-auth-session/providers/google';

export const storeAuthData = async (token, userData) => {
  try {
    await AsyncStorage.setItem('authToken', token);
    await AsyncStorage.setItem('userData', JSON.stringify(userData));
  } catch (error) {
    console.error('Error storing auth data:', error);
  }
};

export const getAuthData = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    const userData = await AsyncStorage.getItem('userData');
    return {
      token,
      user: userData ? JSON.parse(userData) : null
    };
  } catch (error) {
    console.error('Error retrieving auth data:', error);
    return { token: null, user: null };
  }
};

export const removeAuthData = async () => {
  try {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('userData');
  } catch (error) {
    console.error('Error removing auth data:', error);
  }
};

export const isAuthenticated = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    return !!token;
  } catch (error) {
    return false;
  }
}; 