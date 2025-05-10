const bcrypt = require('bcryptjs');

// In-memory database for demo purposes
class InMemoryDB {
  constructor() {
    this.users = [];
    this.workouts = [];
    this.exercises = [];
    this.workoutLogs = [];
    this.foodItems = [];
    this.meals = [];
    this.dietPlans = [];
    this.nutritionLogs = [];
    this.bodyMeasurements = [];
    this.sleepLogs = [];
    this.activityLogs = [];
    this.goals = [];
    this.challenges = [];
    this.events = [];
    this.teams = [];
    this.posts = [];
    
    this.userIdCounter = 1;
    this.workoutIdCounter = 1;
    this.exerciseIdCounter = 1;
    this.workoutLogIdCounter = 1;
    this.foodItemIdCounter = 1;
    this.mealIdCounter = 1;
    this.dietPlanIdCounter = 1;
    this.nutritionLogIdCounter = 1;
    this.bodyMeasurementIdCounter = 1;
    this.sleepLogIdCounter = 1;
    this.activityLogIdCounter = 1;
    this.goalIdCounter = 1;
    this.challengeIdCounter = 1;
    this.eventIdCounter = 1;
    this.teamIdCounter = 1;
    this.postIdCounter = 1;
  }

  // User methods
  async findUserById(id) {
    return this.users.find(user => user._id.toString() === id.toString());
  }

  async findUserByEmail(email) {
    return this.users.find(user => user.email === email);
  }

  async findUserByUsername(username) {
    return this.users.find(user => user.username === username);
  }

  async findOne(collection, query) {
    if (collection === 'users') {
      if (query.email) {
        return this.users.find(user => user.email === query.email);
      }
      if (query._id) {
        return this.users.find(user => user._id.toString() === query._id.toString());
      }
    }
    return null;
  }

  async find(collection, query = {}, options = {}) {
    let results = [];
    
    switch (collection) {
      case 'users':
        results = [...this.users];
        break;
      case 'workouts':
        results = [...this.workouts];
        break;
      case 'exercises':
        results = [...this.exercises];
        break;
      case 'workoutLogs':
        results = [...this.workoutLogs];
        break;
      case 'foodItems':
        results = [...this.foodItems];
        break;
      case 'meals':
        results = [...this.meals];
        break;
      case 'dietPlans':
        results = [...this.dietPlans]workouts = [];
    this.exercises = [];
    this.workoutLogs = [];
    this.foodItems = [];
    this.meals = [];
    this.dietPlans = [];
    this.nutritionLogs = [];
    this.bodyMeasurements = [];
    this.sleepLogs = [];
    this.activityLogs = [];
    this.goals = [];
    this.challenges = [];
    this.events = [];
    this.teams = [];
    this.posts = [];
    
    this.userIdCounter = 1;
    this.workoutIdCounter = 1;
    this.exerciseIdCounter = 1;
    this.workoutLogIdCounter = 1;
    this.foodItemIdCounter = 1;
    this.mealIdCounter = 1;
    this.dietPlanIdCounter = 1;
    this.nutritionLogIdCounter = 1;
    this.bodyMeasurementIdCounter = 1;
    this.sleepLogIdCounter = 1;
    this.activityLogIdCounter = 1;
    this.goalIdCounter = 1;
    this.challengeIdCounter = 1;
    this.eventIdCounter = 1;
    this.teamIdCounter = 1;
    this.postIdCounter = 1;
  }

  // User methods
  async findUserById(id) {
    return this.users.find(user => user._id.toString() === id.toString());
  }

  async findUserByEmail(email) {
    return this.users.find(user => user.email === email);
  }

  async findUserByUsername(username) {
    return this.users.find(user => user.username === username);
  }

  async findOne(collection, query) {
    if (collection === 'users') {
      if (query.email) {
        return this.users.find(user => user.email === query.email);
      }
      if (query._id) {
        return this.users.find(user => user._id.toString() === query._id.toString());
      }
    }
    return null;
  }

  async find(collection, query = {}, options = {}) {
    let results = [];
    
    switch (collection) {
      case 'users':
        results = [...this.users];
        break;
      case 'workouts':
        results = [...this.workouts];
        break;
      case 'exercises':
        results = [...this.exercises];
        break;
      case 'workoutLogs':
        results = [...this.workoutLogs];
        break;
      case 'foodItems':
        results = [...this.foodItems];
        break;
      case 'meals':
        results = [...this.meals];
        break;
      case 'dietPlans':
        results = [...this.dietPlans];
        break;
      case 'nutritionLogs':
        results = [...this.nutritionLogs];
        break;
      case 'bodyMeasurements':
        results = [...this.bodyMeasurements];
        break;
      case 'sleepLogs':
        results = [...this.sleepLogs];
        break;
      case 'activityLogs':
        results = [...this.activityLogs];
        break;
      case 'goals':
        results = [...this.goals];
        break;
      case 'challenges':
        results = [...this.challenges];
        break;
      case 'events':
        results = [...this.events];
        break;
      case 'teams':
        results = [...this.teams];
        break;
      case 'posts':
        results = [...this.posts];
        break;
      default:
        return [];
    }
    
    // Apply simple filtering
    if (Object.keys(query).length > 0) {
      results = results.filter(item => {
        for (const key in query) {
          if (key === '_id' || key === 'user' || key === 'creator') {
            if (item[key].toString() !== query[key].toString()) {
              return false;
            }
          } else if (item[key] !== query[key]) {
            return false;
          }
        }
        return true;
      });
    }
    
    // Apply sorting
    if (options.sort) {
      const sortKey = Object.keys(options.sort)[0];
      const sortDir = options.sort[sortKey];
      results.sort((a, b) => {
        if (sortDir === 1) {
          return a[sortKey] > b[sortKey] ? 1 : -1;
        } else {
          return a[sortKey] < b[sortKey] ? 1 : -1;
        }
      });
    }
    
    // Apply pagination
    if (options.skip) {
      results = results.slice(options.skip);
    }
    
    if (options.limit) {
      results = results.slice(0, options.limit);
    }
    
    return results;
  }

  async countDocuments(collection, query = {}) {
    const results = await this.find(collection, query);
    return results.length;
  }

  async findById(collection, id) {
    switch (collection) {
      case 'users':
        return this.users.find(user => user._id.toString() === id.toString());
      case 'workouts':
        return this.workouts.find(workout => workout._id.toString() === id.toString());
      case 'exercises':
        return this.exercises.find(exercise => exercise._id.toString() === id.toString());
      case 'workoutLogs':
        return this.workoutLogs.find(log => log._id.toString() === id.toString());
      case 'foodItems':
        return this.foodItems.find(item => item._id.toString() === id.toString());
      case 'meals':
        return this.meals.find(meal => meal._id.toString() === id.toString());
      case 'dietPlans':
        return this.dietPlans.find(plan => plan._id.toString() === id.toString());
      case 'nutritionLogs':
        return this.nutritionLogs.find(log => log._id.toString() === id.toString());
      case 'bodyMeasurements':
        return this.bodyMeasurements.find(measurement => measurement._id.toString() === id.toString());
      case 'sleepLogs':
        return this.sleepLogs.find(log => log._id.toString() === id.toString());
      case 'activityLogs':
        return this.activityLogs.find(log => log._id.toString() === id.toString());
      case 'goals':
        return this.goals.find(goal => goal._id.toString() === id.toString());
      case 'challenges':
        return this.challenges.find(challenge => challenge._id.toString() === id.toString());
      case 'events':
        return this.events.find(event => event._id.toString() === id.toString());
      case 'teams':
        return this.teams.find(team => team._id.toString() === id.toString());
      case 'posts':
        return this.posts.find(post => post._id.toString() === id.toString());
      default:
        return null;
    }
  }

  async findByIdAndUpdate(collection, id, update, options = {}) {
    const item = await this.findById(collection, id);
    if (!item) return null;
    
    // Apply updates
    Object.assign(item, update);
    
    // Return updated item if new option is true
    if (options.new) {
      return item;
    }
    
    return item;
  }

  async findByIdAndDelete(collection, id) {
    let index = -1;
    let item = null;
    
    switch (collection) {
      case 'users':
        index = this.users.findIndex(user => user._id.toString() === id.toString());
        if (index !== -1) {
          item = this.users[index];
          this.users.splice(index, 1);
        }
        break;
      case 'workouts':
        index = this.workouts.findIndex(workout => workout._id.toString() === id.toString());
        if (index !== -1) {
          item = this.workouts[index];
          this.workouts.splice(index, 1);
        }
        break;
      // Add other collections as needed
      default:
        return null;
    }
    
    return item;
  }

  async createUser(userData) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    
    const newUser = {
      _id: this.userIdCounter++,
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      displayName: userData.displayName || userData.username,
      photoURL: userData.photoURL || 'https://via.placeholder.com/150',
      profile: userData.profile || {
        fitnessGoals: ['general_fitness'],
        fitnessLevel: 'beginner',
        region: 'north_india'
      },
      settings: userData.settings || {
        language: 'en',
        theme: 'dark',
        measurementSystem: 'metric'
      },
      gamification: {
        level: 1,
        xp: 0,
        streak: 0,
        lastActive: new Date(),
        badges: [],
        achievements: []
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.users.push(newUser);
    return newUser;
  }

  async createWorkout(workoutData) {
    const newWorkout = {
      _id: this.workoutIdCounter++,
      ...workoutData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.workouts.push(newWorkout);
    return newWorkout;
  }

  async save(collection, item) {
    if (!item._id) {
      // Create new item
      switch (collection) {
        case 'users':
          return this.createUser(item);
        case 'workouts':
          return this.createWorkout(item);
        // Add other collections as needed
        default:
          item._id = Math.floor(Math.random() * 10000);
          this[collection].push(item);
          return item;
      }
    } else {
      // Update existing item
      const existingItem = await this.findById(collection, item._id);
      if (existingItem) {
        Object.assign(existingItem, item);
        return existingItem;
      }
      return null;
    }
  }
}

// Model factory
class ModelFactory {
  constructor(db, collection) {
    this.db = db;
    this.collection = collection;
  }

  async findOne(query) {
    return this.db.findOne(this.collection, query);
  }

  async find(query, options) {
    return this.db.find(this.collection, query, options);
  }

  async findById(id) {
    return this.db.findById(this.collection, id);
  }

  async findByIdAndUpdate(id, update, options) {
    return this.db.findByIdAndUpdate(this.collection, id, update, options);
  }

  async findByIdAndDelete(id) {
    return this.db.findByIdAndDelete(this.collection, id);
  }

  async countDocuments(query) {
    return this.db.countDocuments(this.collection, query);
  }

  async create(data) {
    return this.db.save(this.collection, data);
  }

  async save(item) {
    return this.db.save(this.collection, item);
  }
}

// Add methods to user objects
const userMethods = {
  isValidPassword: async function(password) {
    return await bcrypt.compare(password, this.password);
  },
  toProfileJSON: function() {
    return {
      id: this._id,
      username: this.username,
      displayName: this.displayName,
      photoURL: this.photoURL,
      profile: this.profile,
      gamification: this.gamification,
      createdAt: this.createdAt
    };
  }
};

// Connect to in-memory database
const connectDB = async () => {
  try {
    console.log('Setting up in-memory database for demo purposes');
    
    // Create in-memory database
    const db = new InMemoryDB();
    
    // Create models
    const UserModel = new ModelFactory(db, 'users');
    const WorkoutModel = new ModelFactory(db, 'workouts');
    const ExerciseModel = new ModelFactory(db, 'exercises');
    const WorkoutLogModel = new ModelFactory(db, 'workoutLogs');
    const FoodItemModel = new ModelFactory(db, 'foodItems');
    const MealModel = new ModelFactory(db, 'meals');
    const DietPlanModel = new ModelFactory(db, 'dietPlans');
    const NutritionLogModel = new ModelFactory(db, 'nutritionLogs');
    const BodyMeasurementModel = new ModelFactory(db, 'bodyMeasurements');
    const SleepLogModel = new ModelFactory(db, 'sleepLogs');
    const ActivityLogModel = new ModelFactory(db, 'activityLogs');
    const GoalModel = new ModelFactory(db, 'goals');
    const ChallengeModel = new ModelFactory(db, 'challenges');
    const EventModel = new ModelFactory(db, 'events');
    const TeamModel = new ModelFactory(db, 'teams');
    const PostModel = new ModelFactory(db, 'posts');
    
    // Create a demo user for trial purposes
    const demoUser = {
      username: 'demo_user',
      email: 'demo@example.com',
      password: 'demo123456',
      displayName: 'Demo User',
      photoURL: 'https://via.placeholder.com/150',
      profile: {
        bio: 'Fitness enthusiast trying to get in shape',
        gender: 'male',
        dateOfBirth: new Date('1990-01-01'),
        height: 175,
        weight: 70,
        fitnessGoals: ['weight_loss', 'muscle_gain', 'endurance'],
        fitnessLevel: 'intermediate',
        region: 'north_india',
        preferredWorkouts: ['hiit', 'strength', 'yoga'],
        dietaryPreferences: ['vegetarian'],
        allergies: []
      }
    };
    
    // Check if demo user exists, if not create it
    const existingUser = await UserModel.findOne({ email: demoUser.email });
    let newUser;
    
    if (!existingUser) {
      newUser = await db.createUser(demoUser);
      Object.assign(newUser, userMethods);
      console.log('Demo user created successfully');
    } else {
      newUser = existingUser;
      Object.assign(newUser, userMethods);
    }
    
    // Create some demo workouts
    if ((await WorkoutModel.find()).length === 0) {
      const demoWorkouts = [
        {
          title: 'Full Body HIIT',
          description: 'High-intensity interval training for full body workout',
          imageUrl: 'https://via.placeholder.com/500',
          coverImageUrl: 'https://via.placeholder.com/1200x600',
          duration: 30,
          difficulty: 'intermediate',
          category: 'hiit',
          tags: ['full_body', 'cardio', 'strength'],
          equipment: ['none'],
          muscleGroups: ['full_body'],
          exercises: [
            {
              name: 'Jumping Jacks',
              sets: 3,
              reps: '30 seconds',
              rest: 15
            },
            {
              name: 'Push-ups',
              sets: 3,
              reps: '10-12',
              rest: 30
            },
            {
              name: 'Mountain Climbers',
              sets: 3,
              reps: '30 seconds',
              rest: 30
            },
            {
              name: 'Squats',
              sets: 3,
              reps: '15',
              rest: 30
            },
            {
              name: 'Plank',
              sets: 3,
              reps: '45 seconds',
              rest: 30
            }
          ],
          estimatedCalories: 300,
          isIndian: false,
          isPublic: true,
          creator: newUser._id
        },
        {
          title: 'Yoga Flow for Beginners',
          description: 'Gentle yoga flow for beginners to improve flexibility and reduce stress',
          imageUrl: 'https://via.placeholder.com/500',
          coverImageUrl: 'https://via.placeholder.com/1200x600',
          duration: 20,
          difficulty: 'beginner',
          category: 'yoga',
          tags: ['yoga', 'flexibility', 'stress_relief'],
          equipment: ['yoga_mat'],
          muscleGroups: ['full_body'],
          exercises: [
            {
              name: 'Mountain Pose',
              sets: 1,
              reps: '30 seconds',
              rest: 0
            },
            {
              name: 'Downward Dog',
              sets: 1,
              reps: '45 seconds',
              rest: 0
            },
            {
              name: 'Warrior I',
              sets: 1,
              reps: '30 seconds each side',
              rest: 0
            },
            {
              name: 'Child\'s Pose',
              sets: 1,
              reps: '1 minute',
              rest: 0
            }
          ],
          estimatedCalories: 150,
          isIndian: true,
          indianElements: {
            name: 'Traditional Yoga',
            description: 'Based on traditional Indian yoga practices',
            region: 'all_india',
            culturalContext: 'Ancient practice for mind-body wellness'
          },
          isPublic: true,
          creator: newUser._id
        }
      ];
      
      for (const workout of demoWorkouts) {
        await WorkoutModel.create(workout);
      }
      console.log('Demo workouts created successfully');
    }
    
    // Extend the User model to include methods
    const UserModelWithMethods = {
      findOne: async (query) => {
        const user = await UserModel.findOne(query);
        if (user) {
          Object.assign(user, userMethods);
        }
        return user;
      },
      findById: async (id) => {
        const user = await UserModel.findById(id);
        if (user) {
          Object.assign(user, userMethods);
        }
        return user;
      },
      find: UserModel.find.bind(UserModel),
      create: async (userData) => {
        const user = await db.createUser(userData);
        Object.assign(user, userMethods);
        return user;
      },
      save: UserModel.save.bind(UserModel)
    };
    
    // Create global models
    global.User = UserModelWithMethods;
    
    // Create mock models for the routes
    const mockModel = {
      find: async () => [],
      findById: async () => null,
      findOne: async () => null,
      countDocuments: async () => 0
    };
    
    global.Workout = WorkoutModel;
    global.Exercise = ExerciseModel;
    global.WorkoutLog = WorkoutLogModel;
    global.FoodItem = mockModel;
    global.Meal = mockModel;
    global.DietPlan = mockModel;
    global.NutritionLog = mockModel;
    global.BodyMeasurement = mockModel;
    global.SleepLog = mockModel;
    global.ActivityLog = mockModel;
    global.Goal = mockModel;
    global.Challenge = mockModel;
    global.Event = mockModel;
    global.Team = mockModel;
    global.Post = mockModel;
        break;
      case 'nutritionLogs':
        results = [...this.nutritionLogs];
        break;
      case 'bodyMeasurements':
        results = [...this.bodyMeasurements];
        break;
      case 'sleepLogs':
        results = [...this.sleepLogs];
        break;
      case 'activityLogs':
        results = [...this.activityLogs];
        break;
      case 'goals':
        results = [...this.goals];
        break;
      case 'challenges':
        results = [...this.challenges];
        break;
      case 'events':
        results = [...this.events];
        break;
      case 'teams':
        results = [...this.teams];
        break;
      case 'posts':
        results = [...this.posts];
        break;
      default:
        return [];
    }
    
    // Apply simple filtering
    if (Object.keys(query).length > 0) {
      results = results.filter(item => {
        for (const key in query) {
          if (key === '_id' || key === 'user' || key === 'creator') {
            if (item[key].toString() !== query[key].toString()) {
              return false;
            }
          } else if (item[key] !== query[key]) {
            return false;
          }
        }
        return true;
      });
    }
    
    // Apply sorting
    if (options.sort) {
      const sortKey = Object.keys(options.sort)[0];
      const sortDir = options.sort[sortKey];
      results.sort((a, b) => {
        if (sortDir === 1) {
          return a[sortKey] > b[sortKey] ? 1 : -1;
        } else {
          return a[sortKey] < b[sortKey] ? 1 : -1;
        }
      });
    }
    
    // Apply pagination
    if (options.skip) {
      results = results.slice(options.skip);
    }
    
    if (options.limit) {
      results = results.slice(0, options.limit);
    }
    
    return results;
  }

  async countDocuments(collection, query = {}) {
    const results = await this.find(collection, query);
    return results.length;
  }

  async findById(collection, id) {
    switch (collection) {
      case 'users':
        return this.users.find(user => user._id.toString() === id.toString());
      case 'workouts':
        return this.workouts.find(workout => workout._id.toString() === id.toString());
      case 'exercises':
        return this.exercises.find(exercise => exercise._id.toString() === id.toString());
      case 'workoutLogs':
        return this.workoutLogs.find(log => log._id.toString() === id.toString());
      case 'foodItems':
        return this.foodItems.find(item => item._id.toString() === id.toString());
      case 'meals':
        return this.meals.find(meal => meal._id.toString() === id.toString());
      case 'dietPlans':
        return this.dietPlans.find(plan => plan._id.toString() === id.toString());
      case 'nutritionLogs':
        return this.nutritionLogs.find(log => log._id.toString() === id.toString());
      case 'bodyMeasurements':
        return this.bodyMeasurements.find(measurement => measurement._id.toString() === id.toString());
      case 'sleepLogs':
        return this.sleepLogs.find(log => log._id.toString() === id.toString());
      case 'activityLogs':
        return this.activityLogs.find(log => log._id.toString() === id.toString());
      case 'goals':
        return this.goals.find(goal => goal._id.toString() === id.toString());
      case 'challenges':
        return this.challenges.find(challenge => challenge._id.toString() === id.toString());
      case 'events':
        return this.events.find(event => event._id.toString() === id.toString());
      case 'teams':
        return this.teams.find(team => team._id.toString() === id.toString());
      case 'posts':
        return this.posts.find(post => post._id.toString() === id.toString());
      default:
        return null;
    }
  }

  async findByIdAndUpdate(collection, id, update, options = {}) {
    const item = await this.findById(collection, id);
    if (!item) return null;
    
    // Apply updates
    Object.assign(item, update);
    
    // Return updated item if new option is true
    if (options.new) {
      return item;
    }
    
    return item;
  }

  async findByIdAndDelete(collection, id) {
    let index = -1;
    let item = null;
    
    switch (collection) {
      case 'users':
        index = this.users.findIndex(user => user._id.toString() === id.toString());
        if (index !== -1) {
          item = this.users[index];
          this.users.splice(index, 1);
        }
        break;
      case 'workouts':
        index = this.workouts.findIndex(workout => workout._id.toString() === id.toString());
        if (index !== -1) {
          item = this.workouts[index];
          this.workouts.splice(index, 1);
        }
        break;
      // Add other collections as needed
      default:
        return null;
    }
    
    return item;
  }

  async createUser(userData) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    
    const newUser = {
      _id: this.userIdCounter++,
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      displayName: userData.displayName || userData.username,
      photoURL: userData.photoURL || 'https://via.placeholder.com/150',
      profile: userData.profile || {
        fitnessGoals: ['general_fitness'],
        fitnessLevel: 'beginner',
        region: 'north_india'
      },
      settings: userData.settings || {
        language: 'en',
        theme: 'dark',
        measurementSystem: 'metric'
      },
      gamification: {
        level: 1,
        xp: 0,
        streak: 0,
        lastActive: new Date(),
        badges: [],
        achievements: []
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.users.push(newUser);
    return newUser;
  }

  async createWorkout(workoutData) {
    const newWorkout = {
      _id: this.workoutIdCounter++,
      ...workoutData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.workouts.push(newWorkout);
    return newWorkout;
  }

  async save(collection, item) {
    if (!item._id) {
      // Create new item
      switch (collection) {
        case 'users':
          return this.createUser(item);
        case 'workouts':
          return this.createWorkout(item);
        // Add other collections as needed
        default:
          item._id = Math.floor(Math.random() * 10000);
          this[collection].push(item);
          return item;
      }
    } else {
      // Update existing item
      const existingItem = await this.findById(collection, item._id);
      if (existingItem) {
        Object.assign(existingItem, item);
        return existingItem;
      }
      return null;
    }
  }
}

// Model factory
class ModelFactory {
  constructor(db, collection) {
    this.db = db;
    this.collection = collection;
  }

  async findOne(query) {
    return this.db.findOne(this.collection, query);
  }

  async find(query, options) {
    return this.db.find(this.collection, query, options);
  }

  async findById(id) {
    return this.db.findById(this.collection, id);
  }

  async findByIdAndUpdate(id, update, options) {
    return this.db.findByIdAndUpdate(this.collection, id, update, options);
  }

  async findByIdAndDelete(id) {
    return this.db.findByIdAndDelete(this.collection, id);
  }

  async countDocuments(query) {
    return this.db.countDocuments(this.collection, query);
  }

  async create(data) {
    return this.db.save(this.collection, data);
  }

  async save(item) {
    return this.db.save(this.collection, item);
  }
}

// Add methods to user objects
const userMethods = {
  isValidPassword: async function(password) {
    return await bcrypt.compare(password, this.password);
  },
  toProfileJSON: function() {
    return {
      id: this._id,
      username: this.username,
      displayName: this.displayName,
      photoURL: this.photoURL,
      profile: this.profile,
      gamification: this.gamification,
      createdAt: this.createdAt
    };
  }
};

// Connect to in-memory database
const connectDB = async () => {
  try {
    console.log('Setting up in-memory database for demo purposes');
    
    // Create in-memory database
    const db = new InMemoryDB();
    
    // Create models
    const UserModel = new ModelFactory(db, 'users');
    const WorkoutModel = new ModelFactory(db, 'workouts');
    const ExerciseModel = new ModelFactory(db, 'exercises');
    const WorkoutLogModel = new ModelFactory(db, 'workoutLogs');
    const FoodItemModel = new ModelFactory(db, 'foodItems');
    const MealModel = new ModelFactory(db, 'meals');
    const DietPlanModel = new ModelFactory(db, 'dietPlans');
    const NutritionLogModel = new ModelFactory(db, 'nutritionLogs');
    const BodyMeasurementModel = new ModelFactory(db, 'bodyMeasurements');
    const SleepLogModel = new ModelFactory(db, 'sleepLogs');
    const ActivityLogModel = new ModelFactory(db, 'activityLogs');
    const GoalModel = new ModelFactory(db, 'goals');
    const ChallengeModel = new ModelFactory(db, 'challenges');
    const EventModel = new ModelFactory(db, 'events');
    const TeamModel = new ModelFactory(db, 'teams');
    const PostModel = new ModelFactory(db, 'posts');
    
    // Create a demo user for trial purposes
    const demoUser = {
      username: 'demo_user',
      email: 'demo@example.com',
      password: 'demo123456',
      displayName: 'Demo User',
      photoURL: 'https://via.placeholder.com/150',
      profile: {
        bio: 'Fitness enthusiast trying to get in shape',
        gender: 'male',
        dateOfBirth: new Date('1990-01-01'),
        height: 175,
        weight: 70,
        fitnessGoals: ['weight_loss', 'muscle_gain', 'endurance'],
        fitnessLevel: 'intermediate',
        region: 'north_india',
        preferredWorkouts: ['hiit', 'strength', 'yoga'],
        dietaryPreferences: ['vegetarian'],
        allergies: []
      }
    };
    
    // Check if demo user exists, if not create it
    const existingUser = await UserModel.findOne({ email: demoUser.email });
    let newUser;
    
    if (!existingUser) {
      newUser = await db.createUser(demoUser);
      Object.assign(newUser, userMethods);
      console.log('Demo user created successfully');
    } else {
      newUser = existingUser;
      Object.assign(newUser, userMethods);
    }
    
    // Create some demo workouts
    if ((await WorkoutModel.find()).length === 0) {
      const demoWorkouts = [
        {
          title: 'Full Body HIIT',
          description: 'High-intensity interval training for full body workout',
          imageUrl: 'https://via.placeholder.com/500',
          coverImageUrl: 'https://via.placeholder.com/1200x600',
          duration: 30,
          difficulty: 'intermediate',
          category: 'hiit',
          tags: ['full_body', 'cardio', 'strength'],
          equipment: ['none'],
          muscleGroups: ['full_body'],
          exercises: [
            {
              name: 'Jumping Jacks',
              sets: 3,
              reps: '30 seconds',
              rest: 15
            },
            {
              name: 'Push-ups',
              sets: 3,
              reps: '10-12',
              rest: 30
            },
            {
              name: 'Mountain Climbers',
              sets: 3,
              reps: '30 seconds',
              rest: 30
            },
            {
              name: 'Squats',
              sets: 3,
              reps: '15',
              rest: 30
            },
            {
              name: 'Plank',
              sets: 3,
              reps: '45 seconds',
              rest: 30
            }
          ],
          estimatedCalories: 300,
          isIndian: false,
          isPublic: true,
          creator: newUser._id
        },
        {
          title: 'Yoga Flow for Beginners',
          description: 'Gentle yoga flow for beginners to improve flexibility and reduce stress',
          imageUrl: 'https://via.placeholder.com/500',
          coverImageUrl: 'https://via.placeholder.com/1200x600',
          duration: 20,
          difficulty: 'beginner',
          category: 'yoga',
          tags: ['yoga', 'flexibility', 'stress_relief'],
          equipment: ['yoga_mat'],
          muscleGroups: ['full_body'],
          exercises: [
            {
              name: 'Mountain Pose',
              sets: 1,
              reps: '30 seconds',
              rest: 0
            },
            {
              name: 'Downward Dog',
              sets: 1,
              reps: '45 seconds',
              rest: 0
            },
            {
              name: 'Warrior I',
              sets: 1,
              reps: '30 seconds each side',
              rest: 0
            },
            {
              name: 'Child\'s Pose',
              sets: 1,
              reps: '1 minute',
              rest: 0
            }
          ],
          estimatedCalories: 150,
          isIndian: true,
          indianElements: {
            name: 'Traditional Yoga',
            description: 'Based on traditional Indian yoga practices',
            region: 'all_india',
            culturalContext: 'Ancient practice for mind-body wellness'
          },
          isPublic: true,
          creator: newUser._id
        }
      ];
      
      for (const workout of demoWorkouts) {
        await WorkoutModel.create(workout);
      }
      console.log('Demo workouts created successfully');
    }
    
    // Extend the User model to include methods
    const UserModelWithMethods = {
      findOne: async (query) => {
        const user = await UserModel.findOne(query);
        if (user) {
          Object.assign(user, userMethods);
        }
        return user;
      },
      findById: async (id) => {
        const user = await UserModel.findById(id);
        if (user) {
          Object.assign(user, userMethods);
        }
        return user;
      },
      find: UserModel.find.bind(UserModel),
      create: async (userData) => {
        const user = await db.createUser(userData);
        Object.assign(user, userMethods);
        return user;
      },
      save: UserModel.save.bind(UserModel)
    };
    
    // Create global models
    global.User = UserModelWithMethods;
    global.Workout = WorkoutModel;
    global.Exercise = ExerciseModel;
    global.WorkoutLog = WorkoutLogModel;
    global.FoodItem = FoodItemModel;
    global.Meal = MealModel;
    global.DietPlan = DietPlanModel;
    global.NutritionLog = NutritionLogModel;
    global.BodyMeasurement = BodyMeasurementModel;
    global.SleepLog = SleepLogModel;
    global.ActivityLog = ActivityLogModel;
    global.Goal = GoalModel;
    global.Challenge = ChallengeModel;
    global.Event = EventModel;
    global.Team = TeamModel;
    global.Post = PostModel;
    
    return {
      demoCredentials: {
        email: demoUser.email,
        password: 'demo123456' // Plain text for demo purposes
      },
      User: UserModelWithMethods
    };
  } catch (error) {
    console.error('Database setup error:', error);
    process.exit(1);
  }
};

module.exports = {
  connectDB
};