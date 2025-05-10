const mongoose = require('mongoose');

// Challenge schema
const challengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String
  },
  coverImageUrl: {
    type: String
  },
  duration: {
    type: Number, // in days
    required: true
  },
  type: {
    type: String,
    enum: ['workout', 'steps', 'nutrition', 'water', 'meditation', 'sleep', 'habit', 'other'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'all_levels'],
    required: true
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isIndian: {
    type: Boolean,
    default: false
  },
  indianElements: {
    name: String,
    description: String,
    festival: String,
    culturalContext: String
  },
  dailyTasks: [{
    day: {
      type: Number, // 1-based index for day of challenge
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
      enum: ['workout', 'steps', 'nutrition', 'water', 'meditation', 'sleep', 'habit', 'other'],
      required: true
    },
    target: {
      value: {
        type: Number
      },
      unit: {
        type: String
      }
    },
    workout: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workout'
    },
    meal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Meal'
    }
  }],
  rewards: {
    xp: {
      type: Number,
      default: 100
    },
    badge: {
      id: String,
      name: String,
      description: String,
      imageUrl: String
    }
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    progress: {
      type: Number, // percentage
      default: 0
    },
    completedDays: [{
      day: Number,
      completedAt: Date,
      notes: String
    }],
    isCompleted: {
      type: Boolean,
      default: false
    },
    completedAt: {
      type: Date
    }
  }],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  isAIGenerated: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Event schema
const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String
  },
  coverImageUrl: {
    type: String
  },
  type: {
    type: String,
    enum: ['workout', 'run', 'walk', 'yoga', 'meditation', 'nutrition', 'workshop', 'competition', 'other'],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['online', 'physical', 'hybrid'],
      required: true
    },
    name: {
      type: String
    },
    address: {
      type: String
    },
    city: {
      type: String
    },
    state: {
      type: String
    },
    country: {
      type: String,
      default: 'India'
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    onlineUrl: {
      type: String
    }
  },
  isIndian: {
    type: Boolean,
    default: true
  },
  indianElements: {
    festival: String,
    culturalContext: String
  },
  organizer: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: {
      type: String
    },
    contact: {
      email: String,
      phone: String
    }
  },
  capacity: {
    type: Number
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    registeredAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['registered', 'attended', 'cancelled', 'no_show'],
      default: 'registered'
    },
    notes: {
      type: String
    }
  }],
  isPublic: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Team schema
const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  imageUrl: {
    type: String
  },
  coverImageUrl: {
    type: String
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['admin', 'member'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isPublic: {
    type: Boolean,
    default: true
  },
  challenges: [{
    challenge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Challenge'
    },
    startDate: {
      type: Date
    },
    endDate: {
      type: Date
    },
    isActive: {
      type: Boolean,
      default: true
    },
    progress: {
      type: Number, // percentage
      default: 0
    }
  }],
  stats: {
    totalWorkouts: {
      type: Number,
      default: 0
    },
    totalSteps: {
      type: Number,
      default: 0
    },
    totalMinutes: {
      type: Number,
      default: 0
    },
    totalCaloriesBurned: {
      type: Number,
      default: 0
    },
    challengesCompleted: {
      type: Number,
      default: 0
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Post schema
const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  images: [{
    url: String,
    caption: String
  }],
  video: {
    url: String,
    thumbnail: String,
    duration: Number
  },
  workout: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WorkoutLog'
  },
  challenge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge'
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },
  achievement: {
    type: {
      type: String,
      enum: ['workout_streak', 'weight_goal', 'challenge_completed', 'personal_record', 'badge_earned', 'other']
    },
    name: String,
    description: String
  },
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    content: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    likes: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }]
  }],
  tags: [{
    type: String
  }],
  location: {
    name: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create models
const Challenge = mongoose.model('Challenge', challengeSchema);
const Event = mongoose.model('Event', eventSchema);
const Team = mongoose.model('Team', teamSchema);
const Post = mongoose.model('Post', postSchema);

module.exports = {
  Challenge,
  Event,
  Team,
  Post
};