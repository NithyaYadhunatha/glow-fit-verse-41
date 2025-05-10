const mongoose = require('mongoose');

// Food item schema
const foodItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  calories: {
    type: Number,
    required: true
  },
  protein: {
    type: Number, // in grams
    required: true
  },
  carbs: {
    type: Number, // in grams
    required: true
  },
  fat: {
    type: Number, // in grams
    required: true
  },
  fiber: {
    type: Number, // in grams
    default: 0
  },
  sugar: {
    type: Number, // in grams
    default: 0
  },
  servingSize: {
    type: Number, // in grams or ml
    required: true
  },
  servingUnit: {
    type: String,
    enum: ['g', 'ml', 'oz', 'cup', 'tbsp', 'tsp', 'piece'],
    default: 'g'
  },
  category: {
    type: String,
    enum: ['fruits', 'vegetables', 'grains', 'protein', 'dairy', 'fats_oils', 'nuts_seeds', 'beverages', 'snacks', 'sweets', 'prepared_meals', 'other'],
    required: true
  },
  isIndian: {
    type: Boolean,
    default: false
  },
  indianRegion: {
    type: String,
    enum: ['north_indian', 'south_indian', 'east_indian', 'west_indian', 'central_indian', 'northeast_indian', 'all_india', ''],
    default: ''
  },
  imageUrl: {
    type: String
  },
  isVegetarian: {
    type: Boolean,
    default: false
  },
  isVegan: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String
  }],
  alternativesFor: [{
    type: String
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isVerified: {
    type: Boolean,
    default: false
  }
});

// Meal schema
const mealSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  type: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack', 'pre_workout', 'post_workout'],
    required: true
  },
  items: [{
    foodItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FoodItem'
    },
    quantity: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      enum: ['g', 'ml', 'oz', 'cup', 'tbsp', 'tsp', 'piece'],
      default: 'g'
    }
  }],
  totalCalories: {
    type: Number,
    default: 0
  },
  totalProtein: {
    type: Number,
    default: 0
  },
  totalCarbs: {
    type: Number,
    default: 0
  },
  totalFat: {
    type: Number,
    default: 0
  },
  imageUrl: {
    type: String
  },
  preparationTime: {
    type: Number, // in minutes
  },
  cookingTime: {
    type: Number, // in minutes
  },
  instructions: [{
    type: String
  }],
  isIndian: {
    type: Boolean,
    default: false
  },
  indianRegion: {
    type: String,
    enum: ['north_indian', 'south_indian', 'east_indian', 'west_indian', 'central_indian', 'northeast_indian', 'all_india', ''],
    default: ''
  },
  isVegetarian: {
    type: Boolean,
    default: false
  },
  isVegan: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isPublic: {
    type: Boolean,
    default: true
  }
});

// Diet plan schema
const dietPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  goal: {
    type: String,
    enum: ['weight_loss', 'muscle_gain', 'maintenance', 'general_health', 'performance', 'other'],
    required: true
  },
  duration: {
    type: Number, // in days
    required: true
  },
  calorieTarget: {
    type: Number
  },
  macroSplit: {
    protein: {
      type: Number, // percentage
      default: 30
    },
    carbs: {
      type: Number, // percentage
      default: 40
    },
    fat: {
      type: Number, // percentage
      default: 30
    }
  },
  meals: [{
    day: {
      type: Number, // 1-based index for day of plan
      required: true
    },
    breakfast: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Meal'
    },
    lunch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Meal'
    },
    dinner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Meal'
    },
    snacks: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Meal'
    }]
  }],
  isIndian: {
    type: Boolean,
    default: false
  },
  indianRegion: {
    type: String,
    enum: ['north_indian', 'south_indian', 'east_indian', 'west_indian', 'central_indian', 'northeast_indian', 'all_india', ''],
    default: ''
  },
  isVegetarian: {
    type: Boolean,
    default: false
  },
  isVegan: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String
  }],
  createdBy: {
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
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// User nutrition log schema
const nutritionLogSchema = new mongoose.Schema({
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
  meals: [{
    type: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'snack', 'pre_workout', 'post_workout'],
      required: true
    },
    time: {
      type: Date,
      required: true
    },
    items: [{
      foodItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FoodItem'
      },
      name: String, // For custom entries
      quantity: {
        type: Number,
        required: true
      },
      unit: {
        type: String,
        enum: ['g', 'ml', 'oz', 'cup', 'tbsp', 'tsp', 'piece'],
        default: 'g'
      },
      calories: Number,
      protein: Number,
      carbs: Number,
      fat: Number
    }],
    totalCalories: {
      type: Number,
      default: 0
    },
    notes: {
      type: String
    },
    imageUrl: {
      type: String
    }
  }],
  water: {
    amount: {
      type: Number, // in ml
      default: 0
    },
    goal: {
      type: Number, // in ml
      default: 2000
    }
  },
  dailySummary: {
    totalCalories: {
      type: Number,
      default: 0
    },
    totalProtein: {
      type: Number,
      default: 0
    },
    totalCarbs: {
      type: Number,
      default: 0
    },
    totalFat: {
      type: Number,
      default: 0
    },
    calorieGoal: {
      type: Number,
      default: 2000
    },
    proteinGoal: {
      type: Number,
      default: 150
    },
    carbsGoal: {
      type: Number,
      default: 200
    },
    fatGoal: {
      type: Number,
      default: 65
    }
  },
  mood: {
    type: String,
    enum: ['great', 'good', 'neutral', 'bad', 'terrible', ''],
    default: ''
  },
  hunger: {
    type: Number, // 1-5 scale
    min: 1,
    max: 5
  },
  energy: {
    type: Number, // 1-5 scale
    min: 1,
    max: 5
  },
  notes: {
    type: String
  }
});

// Create models
const FoodItem = mongoose.model('FoodItem', foodItemSchema);
const Meal = mongoose.model('Meal', mealSchema);
const DietPlan = mongoose.model('DietPlan', dietPlanSchema);
const NutritionLog = mongoose.model('NutritionLog', nutritionLogSchema);

module.exports = {
  FoodItem,
  Meal,
  DietPlan,
  NutritionLog
};