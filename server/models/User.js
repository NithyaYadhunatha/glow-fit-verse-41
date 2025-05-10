const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  displayName: {
    type: String,
    required: true
  },
  photoURL: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  // Profile information
  profile: {
    gender: {
      type: String,
      enum: ['male', 'female', 'other', ''],
      default: ''
    },
    birthdate: {
      type: Date
    },
    height: {
      type: Number, // in cm
    },
    weight: {
      type: Number, // in kg
    },
    fitnessLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', ''],
      default: ''
    },
    fitnessGoals: [{
      type: String,
      enum: ['weight_loss', 'muscle_gain', 'endurance', 'flexibility', 'strength', 'general_fitness']
    }],
    preferredWorkouts: [{
      type: String
    }],
    dietPreferences: [{
      type: String,
      enum: ['vegetarian', 'vegan', 'non_vegetarian', 'pescatarian', 'keto', 'paleo', 'north_indian', 'south_indian', 'east_indian', 'west_indian']
    }],
    medicalConditions: [{
      type: String
    }],
    region: {
      type: String,
      enum: ['north_india', 'south_india', 'east_india', 'west_india', 'central_india', 'northeast_india', 'other'],
      default: 'north_india'
    }
  },
  // Gamification
  gamification: {
    level: {
      type: Number,
      default: 1
    },
    xp: {
      type: Number,
      default: 0
    },
    streak: {
      type: Number,
      default: 0
    },
    lastActive: {
      type: Date,
      default: Date.now
    },
    badges: [{
      id: String,
      name: String,
      description: String,
      imageUrl: String,
      earnedAt: Date
    }],
    achievements: [{
      id: String,
      name: String,
      description: String,
      progress: Number,
      completed: Boolean,
      completedAt: Date
    }]
  },
  // Settings
  settings: {
    language: {
      type: String,
      enum: ['en', 'hi'],
      default: 'en'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      },
      workoutReminders: {
        type: Boolean,
        default: true
      }
    },
    theme: {
      type: String,
      enum: ['dark', 'light'],
      default: 'dark'
    },
    measurementSystem: {
      type: String,
      enum: ['metric', 'imperial'],
      default: 'metric'
    }
  },
  // Connected devices
  connectedDevices: [{
    type: {
      type: String,
      enum: ['fitbit', 'miband', 'apple_watch', 'samsung_watch', 'google_fit', 'other']
    },
    name: String,
    connected: Boolean,
    lastSynced: Date
  }]
});

// Pre-save hook to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check password validity
userSchema.methods.isValidPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// Method to generate user profile data for client
userSchema.methods.toProfileJSON = function() {
  return {
    uid: this._id,
    username: this.username,
    email: this.email,
    displayName: this.displayName,
    photoURL: this.photoURL,
    createdAt: this.createdAt,
    profile: this.profile,
    gamification: {
      level: this.gamification.level,
      xp: this.gamification.xp,
      streak: this.gamification.streak,
      badges: this.gamification.badges,
      achievements: this.gamification.achievements
    },
    settings: {
      language: this.settings.language,
      theme: this.settings.theme,
      measurementSystem: this.settings.measurementSystem
    }
  };
};

const User = mongoose.model('User', userSchema);

module.exports = User;