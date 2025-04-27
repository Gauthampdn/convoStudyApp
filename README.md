# Study App with Google Authentication

This is a study app with Google Sign-In authentication. The app is built with React Native (Expo) for the frontend and Node.js/Express for the backend.

## Project Structure

- `frontend/`: React Native (Expo) application
- `backend/`: Node.js/Express API server

## Prerequisites

- Node.js (v14 or higher)
- MongoDB account and database
- Google OAuth credentials

## Setup

### Backend

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables in `.env`:
   - `MONGO_URI`: Your MongoDB connection string
   - `PORT`: Port for the server (default: 3000)
   - `SECRET`: Session secret
   - `JWT_SECRET`: Secret for JWT access tokens
   - `REFRESH_TOKEN_SECRET`: Secret for JWT refresh tokens
   - Google OAuth credentials

4. Start the server:
   ```
   npm run dev
   ```

### Frontend

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables in `.env`:
   - Google OAuth client IDs for different platforms
   - `API_URL`: Backend API URL

4. Start the Expo development server:
   ```
   npm start
   ```

## Features

- Google Sign-In authentication
- User data stored in MongoDB
- JWT-based authentication with token refresh system
- Protected routes
- Automatic token refresh when access tokens expire
- Token rotation for perpetual sessions

## Authentication Flow

1. User clicks the "Sign in with Google" button
2. Google OAuth authentication popup appears
3. After successful Google authentication, user profile is sent to the backend
4. Backend creates a new user if the email doesn't exist in the database
5. Backend returns an access token (short-lived), refresh token (long-lived), and user data
6. Frontend stores both tokens and user data in AsyncStorage
7. User is now authenticated and can access protected routes

## Token Refresh System with Rotation

The app implements a token rotation system for enhanced security and persistent sessions:

1. **Short-lived Access Tokens**: Access tokens expire after 15 minutes
2. **Longer-lived Refresh Tokens**: Refresh tokens last for 30 days
3. **Token Rotation**: When a refresh token is used, a new refresh token is issued
4. **Perpetual Sessions**: Through token rotation, users can stay logged in indefinitely
5. **Automatic Token Refresh**: When an access token expires, the app automatically uses the refresh token to get a new access token and a new refresh token
6. **Secure Storage**: Both tokens are stored in AsyncStorage
7. **Server-side Validation**: The server validates refresh tokens against the database

This approach provides:
- Enhanced security (short-lived access tokens)
- Persistent sessions (users stay logged in indefinitely)
- Ability to revoke access (server can invalidate refresh tokens)
- Better user experience (no need to log in again unless explicitly logged out)

## API Endpoints

- `POST /api/auth/google`: Google Sign-In
- `POST /api/auth/refresh`: Refresh access token (with token rotation)
- `POST /api/auth/logout`: Logout and invalidate refresh token
- `GET /api/auth/profile`: Get user profile (protected)
