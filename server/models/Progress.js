const mongoose = require('mongoose');

// Workout log schema
const workoutLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  workout: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workout'
  },
  title: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  caloriesBurned: {
    type: Number
  },
  exercises: [{
    name: {
      type: String,
      required: true
    },
    sets: [{
      weight: {
        type: Number
      },
      reps: {
        type: Number
      },
      duration: {
        type: Number // in seconds
      },
      completed: {
        type: Boolean,
        default: true
      },
      notes: {
        type: String
      }
    }]
  }],
  intensity: {
    type: String,
    enum: ['light', 'moderate', 'intense', 'very_intense'],
    default: 'moderate'
  },
  mood: {
    before: {
      type: String,
      enum: ['great', 'good', 'neutral', 'bad', 'terrible', ''],
      default: ''
    },
    after: {
      type: String,
      enum: ['great', 'good', 'neutral', 'bad', 'terrible', ''],
      default: ''
    }
  },
  energy: {
    before: {
      type: Number, // 1-5 scale
      min: 1,
      max: 5
    },
    after: {
      type: Number, // 1-5 scale
      min: 1,
      max: 5
    }
  },
  notes: {
    type: String
  },
  rating: {
    type: Number, // 1-5 scale
    min: 1,
    max: 5
  },
  location: {
    type: {
      type: String,
      enum: ['home', 'gym', 'outdoors', 'other'],
      default: 'home'
    },
    name: {
      type: String
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  photos: [{
    url: String,
    caption: String,
    timestamp: Date
  }],
  isCompleted: {
    type: Boolean,
    default: true
  },
  formScores: [{
    exerciseName: String,
    score: Number // 0-100
  }],
  heartRate: {
    average: Number,
    max: Number,
    min: Number,
    zones: {
      easy: Number, // time in seconds
      fatBurn: Number,
      cardio: Number,
      peak: Number
    }
  }
});

// Body measurement schema
const bodyMeasurementSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  weight: {
    type: Number, // in kg
  },
  height: {
    type: Number, // in cm
  },
  bodyFat: {
    type: Number, // percentage
  },
  bmi: {
    type: Number
  },
  measurements: {
    chest: Number, // in cm
    waist: Number,
    hips: Number,
    thighs: Number,
    biceps: Number,
    neck: Number,
    shoulders: Number,
    calves: Number
  },
  photos: [{
    url: String,
    type: {
      type: String,
      enum: ['front', 'side', 'back', 'other']
    },
    timestamp: Date
  }],
  notes: {
    type: String
  }
});

// Sleep log schema
const sleepLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  bedTime: {
    type: Date,
    required: true
  },
  wakeTime: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, // in minutes
  },
  quality: {
    type: Number, // 1-5 scale
    min: 1,
    max: 5
  },
  stages: {
    deep: {
      type: Number, // in minutes
    },
    light: {
      type: Number
    },
    rem: {
      type: Number
    },
    awake: {
      type: Number
    }
  },
  interruptions: {
    type: Number,
    default: 0
  },
  notes: {
    type: String
  },
  mood: {
    type: String,
    enum: ['great', 'good', 'neutral', 'bad', 'terrible', ''],
    default: ''
  },
  energy: {
    type: Number, // 1-5 scale
    min: 1,
    max: 5
  },
  tags: [{
    type: String
  }],
  source: {
    type: String,
    enum: ['manual', 'fitbit', 'miband', 'apple_watch', 'samsung_watch', 'google_fit', 'other'],
    default: 'manual'
  }
});

// Activity log schema
const activityLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  steps: {
    count: {
      type: Number,
      default: 0
    },
    goal: {
      type: Number,
      default: 10000
    }
  },
  distance: {
    value: {
      type: Number, // in km
      default: 0
    },
    goal: {
      type: Number,
      default: 5
    }
  },
  activeMinutes: {
    value: {
      type: Number,
      default: 0
    },
    goal: {
      type: Number,
      default: 30
    }
  },
  caloriesBurned: {
    value: {
      type: Number,
      default: 0
    },
    goal: {
      type: Number,
      default: 500
    }
  },
  heartRate: {
    average: Number,
    resting: Number,
    max: Number,
    min: Number
  },
  floors: {
    count: {
      type: Number,
      default: 0
    }
  },
  source: {
    type: String,
    enum: ['manual', 'fitbit', 'miband', 'apple_watch', 'samsung_watch', 'google_fit', 'other'],
    default: 'manual'
  }
});

// Goal schema
const goalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  type: {
    type: String,
    enum: ['weight', 'workout', 'nutrition', 'habit', 'measurement', 'challenge', 'other'],
    required: true
  },
  target: {
    value: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      required: true
    }
  },
  current: {
    value: {
      type: Number,
      default: 0
    }
  },
  progress: {
    type: Number, // percentage
    default: 0
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedDate: {
    type: Date
  },
  milestones: [{
    value: Number,
    isCompleted: Boolean,
    completedDate: Date
  }],
  reminderFrequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'none'],
    default: 'weekly'
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String
  }]
});

// Create models
const WorkoutLog = mongoose.model('WorkoutLog', workoutLogSchema);
const BodyMeasurement = mongoose.model('BodyMeasurement', bodyMeasurementSchema);
const SleepLog = mongoose.model('SleepLog', sleepLogSchema);
const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
const Goal = mongoose.model('Goal', goalSchema);

module.exports = {
  WorkoutLog,
  BodyMeasurement,
  SleepLog,
  ActivityLog,
  Goal
};