const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

// Register a new user
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, displayName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    // Create new user
    const newUser = new User({
      username,
      email,
      password,
      displayName,
      profile: {
        fitnessGoals: ['general_fitness'],
        fitnessLevel: 'beginner',
        region: 'north_india'
      },
      settings: {
        language: 'en',
        theme: 'dark',
        measurementSystem: 'metric'
      }
    });

    await newUser.save();

    // Create JWT token
    const token = jwt.sign(
      { id: newUser._id, username: newUser.username, email: newUser.email },
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: '7d' }
    );

    // Return user data and token
    res.status(201).json({
      success: true,
      token,
      user: {
        uid: newUser._id,
        username: newUser.username,
        email: newUser.email,
        displayName: newUser.displayName
      },
      profile: newUser.profile,
      message: 'User registered successfully'
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.isValidPassword(password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: '7d' }
    );

    // Return user data and token
    res.json({
      success: true,
      token,
      user: {
        uid: user._id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      },
      profile: user.toProfileJSON(),
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        uid: user._id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      },
      profile: user.toProfileJSON()
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Reset password request
router.post('/reset-password', async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // In a real implementation, you would send an email with a reset link
    // For demo purposes, we'll just return success
    res.json({
      success: true,
      message: 'Password reset instructions sent to your email'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Logout (optional, as JWT is stateless)
router.post('/logout', (req, res) => {
  // In a real implementation with refresh tokens, you would invalidate the token
  res.json({ success: true, message: 'Logged out successfully' });
});

// Google OAuth (simulated)
router.get('/google', (req, res) => {
  // In a real implementation, this would redirect to Google OAuth
  // For demo purposes, we'll simulate a successful login
  const demoUser = {
    uid: 'google-123456',
    username: 'google_user',
    email: 'google_user@example.com',
    displayName: 'Google User',
    photoURL: 'https://via.placeholder.com/150'
  };

  const token = jwt.sign(
    { id: demoUser.uid, username: demoUser.username, email: demoUser.email },
    process.env.JWT_SECRET || 'your_jwt_secret_key',
    { expiresIn: '7d' }
  );

  res.json({
    success: true,
    token,
    user: demoUser,
    profile: {
      ...demoUser,
      profile: {
        fitnessGoals: ['weight_loss', 'muscle_gain'],
        fitnessLevel: 'intermediate'
      },
      gamification: {
        level: 5,
        xp: 1250,
        streak: 7
      }
    }
  });
});

// Facebook OAuth (simulated)
router.get('/facebook', (req, res) => {
  // In a real implementation, this would redirect to Facebook OAuth
  // For demo purposes, we'll simulate a successful login
  const demoUser = {
    uid: 'facebook-123456',
    username: 'facebook_user',
    email: 'facebook_user@example.com',
    displayName: 'Facebook User',
    photoURL: 'https://via.placeholder.com/150'
  };

  const token = jwt.sign(
    { id: demoUser.uid, username: demoUser.username, email: demoUser.email },
    process.env.JWT_SECRET || 'your_jwt_secret_key',
    { expiresIn: '7d' }
  );

  res.json({
    success: true,
    token,
    user: demoUser,
    profile: {
      ...demoUser,
      profile: {
        fitnessGoals: ['endurance', 'flexibility'],
        fitnessLevel: 'beginner'
      },
      gamification: {
        level: 3,
        xp: 750,
        streak: 4
      }
    }
  });
});

module.exports = router;