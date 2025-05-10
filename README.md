# Locked.in Fitness App

A modern fitness application with AI-powered recommendations, personalized tracking, and community features. Designed with an Indian context in mind, featuring culturally relevant workout and nutrition recommendations.

## Features

- **User Authentication**: Secure signup, login, and profile management
- **Personalized Workouts**: Get workout recommendations based on your fitness level and goals
- **Nutrition Tracking**: Track your meals and get Indian-specific nutrition recommendations
- **Progress Monitoring**: Track your fitness journey with detailed statistics
- **Community Challenges**: Participate in challenges with other users
- **AI Assistant**: Get help and guidance from our AI fitness assistant
- **Gamification**: Earn badges, track streaks, and level up your fitness journey

## Tech Stack

### Frontend
- React
- TypeScript
- React Router
- Axios
- TailwindCSS
- Lucide Icons

### Backend
- Node.js
- Express
- MongoDB (optional)
- JWT Authentication
- bcrypt for password hashing

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/locked-in-fitness.git
cd locked-in-fitness
```

2. Install frontend dependencies
```
npm install
```

3. Install backend dependencies
```
cd server
npm install
```

### Running the Application

1. Start the backend server
```
cd server
npm run dev
```

2. In a new terminal, start the frontend development server
```
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Demo Login Credentials

You can use these demo accounts to test the application:

1. **Rahul Sharma (Male User)**
   - Email: demo@lockedin.fit
   - Password: demo123

2. **Priya Patel (Female User)**
   - Email: priya@lockedin.fit
   - Password: priya123

## Project Structure

```
locked-in/
├── public/              # Static files
├── server/              # Backend server
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── server.js        # Server entry point
│   └── package.json     # Backend dependencies
├── src/
│   ├── components/      # React components
│   ├── lib/             # Utilities and services
│   ├── pages/           # Page components
│   ├── styles/          # Global styles
│   ├── App.tsx          # Main app component
│   └── main.tsx         # Entry point
└── package.json         # Frontend dependencies
```

## Original Project Info

**URL**: https://lovable.dev/projects/4eaa6df6-941f-4f53-b3a5-f1ef536dd802

This project was originally built with:
- Vite
- TypeScript
- React
- TailwindCSS

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [TailwindCSS](https://tailwindcss.com/)
- [React](https://reactjs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
