# Locked.in Demo Database

This is a simple in-memory database setup for demonstration purposes. It provides a way to test the Locked.in application without requiring registration.

## Features

- In-memory database (no installation required)
- Pre-configured demo user
- JWT authentication
- Simple API endpoints for testing

## Getting Started

1. Install dependencies:
   ```
   cd server
   npm install
   ```

2. Start the server:
   ```
   npm run dev
   ```

3. The server will display the demo credentials in the console and make them available at the `/api/demo-credentials` endpoint.

## Demo Credentials

- Email: demo@example.com
- Password: demo123456

## API Endpoints

- `GET /` - Welcome message and API information
- `GET /api/demo-credentials` - Get demo user credentials
- `POST /api/auth/login` - Login with demo credentials
  ```json
  {
    "email": "demo@example.com",
    "password": "demo123456"
  }
  ```
- `GET /api/user/profile` - Example protected route

## Notes

- This is an in-memory database that exists only while the server is running
- All data will be reset when the server restarts
- For production use, you would connect to a real MongoDB database