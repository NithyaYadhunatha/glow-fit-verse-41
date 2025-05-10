const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Initialize Express app
const app = express();
const PORT = 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:8081'],
  credentials: true
}));
app.use(express.json());

// Demo users for Locked.in fitness app (Indian context)
const users = [
  {
    uid: '1',
    email: 'demo@lockedin.fit',
    password: bcrypt.hashSync('demo123', 10),
    displayName: 'Rahul Sharma',
    photoURL: 'https://randomuser.me/api/portraits/men/44.jpg',
    profile: {
      uid: '1',
      displayName: 'Rahul Sharma',
      email: 'demo@lockedin.fit',
      photoURL: 'https://randomuser.me/api/portraits/men/44.jpg',
      createdAt: new Date().toISOString(),
      fitnessGoals: ['Weight Loss', 'Improve Endurance'],
      fitnessLevel: 'intermediate',
      height: 175,
      weight: 78,
      gender: 'male',
      birthdate: '1992-05-15',
      preferredWorkouts: ['HIIT', 'Yoga', 'Running'],
      location: 'Bangalore',
      dietPreference: 'Vegetarian',
      onboardingCompleted: true,
      stats: {
        workoutStreak: 7,
        totalWorkouts: 32,
        caloriesBurned: 12500,
        xpPoints: 1250,
        level: 8,
        badges: ['Morning Warrior', 'Yoga Yodha', 'Lassi Burner']
      }
    }
  },
  {
    uid: '2',
    email: 'priya@lockedin.fit',
    password: bcrypt.hashSync('priya123', 10),
    displayName: 'Priya Patel',
    photoURL: 'https://randomuser.me/api/portraits/women/33.jpg',
    profile: {
      uid: '2',
      displayName: 'Priya Patel',
      email: 'priya@lockedin.fit',
      photoURL: 'https://randomuser.me/api/portraits/women/33.jpg',
      createdAt: new Date().toISOString(),
      fitnessGoals: ['Build Muscle', 'Improve Flexibility'],
      fitnessLevel: 'beginner',
      height: 162,
      weight: 58,
      gender: 'female',
      birthdate: '1995-08-22',
      preferredWorkouts: ['Zumba', 'Pilates', 'Bodyweight'],
      location: 'Mumbai',
      dietPreference: 'Vegetarian',
      onboardingCompleted: true,
      stats: {
        workoutStreak: 4,
        totalWorkouts: 18,
        caloriesBurned: 7800,
        xpPoints: 850,
        level: 5,
        badges: ['Consistency Queen', 'Early Riser']
      }
    }
  }
];

// JWT Secret
const JWT_SECRET = 'lockedin-fitness-secret-key';

// Login user
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = users.find(user => user.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Generate JWT token
    const token = jwt.sign({ uid: user.uid, email }, JWT_SECRET, { expiresIn: '7d' });
    
    // Return user data and token
    res.json({
      token,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      },
      profile: user.profile
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Test route
app.get('/api/test', (req, res) => {
  console.log('Test route hit');
  res.json({ message: 'API is working!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Test the API with: curl http://localhost:${PORT}/api/test`);
  console.log(`Demo login credentials:`);
  console.log(`Email: demo@lockedin.fit`);
  console.log(`Password: demo123`);
  console.log(`OR`);
  console.log(`Email: priya@lockedin.fit`);
  console.log(`Password: priya123`);
});