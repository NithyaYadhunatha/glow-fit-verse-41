const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  muscleGroups: [{
    type: String,
    enum: ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'forearms', 'abs', 'quads', 'hamstrings', 'calves', 'glutes', 'full_body', 'cardio']
  }],
  equipment: [{
    type: String,
    enum: ['none', 'dumbbells', 'barbell', 'kettlebell', 'resistance_bands', 'yoga_mat', 'bench', 'pull_up_bar', 'medicine_ball', 'stability_ball', 'foam_roller', 'treadmill', 'stationary_bike', 'elliptical', 'rowing_machine', 'cable_machine', 'smith_machine', 'leg_press', 'other']
  }],
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate'
  },
  videoUrl: {
    type: String
  },
  imageUrl: {
    type: String
  },
  formCues: [{
    type: String
  }],
  alternatives: [{
    type: String
  }],
  isIndian: {
    type: Boolean,
    default: false
  },
  indianName: {
    type: String
  }
});

const workoutSchema = new mongoose.Schema({
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
    type: Number, // in minutes
    required: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  category: {
    type: String,
    enum: ['strength', 'cardio', 'hiit', 'yoga', 'pilates', 'stretching', 'meditation', 'crossfit', 'bodyweight', 'desi_workout', 'dance', 'sports', 'other'],
    required: true
  },
  tags: [{
    type: String
  }],
  equipment: [{
    type: String,
    enum: ['none', 'dumbbells', 'barbell', 'kettlebell', 'resistance_bands', 'yoga_mat', 'bench', 'pull_up_bar', 'medicine_ball', 'stability_ball', 'foam_roller', 'treadmill', 'stationary_bike', 'elliptical', 'rowing_machine', 'cable_machine', 'smith_machine', 'leg_press', 'other']
  }],
  muscleGroups: [{
    type: String,
    enum: ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'forearms', 'abs', 'quads', 'hamstrings', 'calves', 'glutes', 'full_body', 'cardio']
  }],
  exercises: [{
    exercise: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exercise'
    },
    sets: {
      type: Number,
      default: 3
    },
    reps: {
      type: String, // Can be "10" or "8-12" or "30 seconds"
      default: "10"
    },
    rest: {
      type: Number, // in seconds
      default: 60
    },
    notes: {
      type: String
    }
  }],
  warmup: {
    duration: {
      type: Number, // in minutes
      default: 5
    },
    description: {
      type: String
    },
    exercises: [{
      name: String,
      duration: Number, // in seconds
      description: String
    }]
  },
  cooldown: {
    duration: {
      type: Number, // in minutes
      default: 5
    },
    description: {
      type: String
    },
    exercises: [{
      name: String,
      duration: Number, // in seconds
      description: String
    }]
  },
  estimatedCalories: {
    type: Number
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isIndian: {
    type: Boolean,
    default: false
  },
  indianElements: {
    name: String,
    description: String,
    region: {
      type: String,
      enum: ['north_india', 'south_india', 'east_india', 'west_india', 'central_india', 'northeast_india', 'all_india']
    },
    festival: String,
    culturalContext: String
  },
  musicSuggestions: [{
    title: String,
    artist: String,
    genre: String,
    url: String,
    isIndian: Boolean
  }],
  ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    review: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    default: 0
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  isAIGenerated: {
    type: Boolean,
    default: false
  }
});

// Create a separate Exercise model
const Exercise = mongoose.model('Exercise', exerciseSchema);

// Create the Workout model
const Workout = mongoose.model('Workout', workoutSchema);

module.exports = { Workout, Exercise };