const express = require('express');
const router = express.Router();
const { FoodItem, Meal, DietPlan, NutritionLog } = require('../models/Nutrition');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

// Get all food items with optional filtering
router.get('/foods', optionalAuth, async (req, res) => {
  try {
    const {
      category,
      isIndian,
      indianRegion,
      isVegetarian,
      isVegan,
      search,
      limit = 20,
      page = 1
    } = req.query;

    // Build query
    const query = {};
    
    if (category) query.category = category;
    if (isIndian) query.isIndian = isIndian === 'true';
    if (indianRegion) query.indianRegion = indianRegion;
    if (isVegetarian) query.isVegetarian = isVegetarian === 'true';
    if (isVegan) query.isVegan = isVegan === 'true';
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Execute query
    const foods = await FoodItem.find(query)
      .sort({ name: 1 })
      .skip(skip)
      .limit(Number(limit));
      
    const total = await FoodItem.countDocuments(query);
    
    res.json({
      success: true,
      foods,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get foods error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get food item by ID
router.get('/foods/:id', optionalAuth, async (req, res) => {
  try {
    const food = await FoodItem.findById(req.params.id);
      
    if (!food) {
      return res.status(404).json({ success: false, message: 'Food item not found' });
    }
    
    res.json({
      success: true,
      food
    });
  } catch (error) {
    console.error('Get food error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create a new food item
router.post('/foods', authenticateToken, async (req, res) => {
  try {
    const {
      name,
      description,
      calories,
      protein,
      carbs,
      fat,
      fiber,
      sugar,
      servingSize,
      servingUnit,
      category,
      isIndian,
      indianRegion,
      imageUrl,
      isVegetarian,
      isVegan,
      tags,
      alternativesFor
    } = req.body;
    
    // Create new food item
    const newFood = new FoodItem({
      name,
      description,
      calories,
      protein,
      carbs,
      fat,
      fiber,
      sugar,
      servingSize,
      servingUnit,
      category,
      isIndian,
      indianRegion,
      imageUrl,
      isVegetarian,
      isVegan,
      tags,
      alternativesFor,
      createdBy: req.user.id,
      isVerified: false
    });
    
    await newFood.save();
    
    res.status(201).json({
      success: true,
      food: newFood,
      message: 'Food item created successfully'
    });
  } catch (error) {
    console.error('Create food error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all meals with optional filtering
router.get('/meals', optionalAuth, async (req, res) => {
  try {
    const {
      type,
      isIndian,
      indianRegion,
      isVegetarian,
      isVegan,
      search,
      limit = 20,
      page = 1
    } = req.query;

    // Build query
    const query = { isPublic: true };
    
    if (type) query.type = type;
    if (isIndian) query.isIndian = isIndian === 'true';
    if (indianRegion) query.indianRegion = indianRegion;
    if (isVegetarian) query.isVegetarian = isVegetarian === 'true';
    if (isVegan) query.isVegan = isVegan === 'true';
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Execute query
    const meals = await Meal.find(query)
      .sort({ name: 1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('items.foodItem');
      
    const total = await Meal.countDocuments(query);
    
    res.json({
      success: true,
      meals,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get meals error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get meal by ID
router.get('/meals/:id', optionalAuth, async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id)
      .populate('items.foodItem');
      
    if (!meal) {
      return res.status(404).json({ success: false, message: 'Meal not found' });
    }
    
    // Check if meal is public or user is creator
    if (!meal.isPublic && (!req.user || meal.createdBy.toString() !== req.user.id)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    res.json({
      success: true,
      meal
    });
  } catch (error) {
    console.error('Get meal error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create a new meal
router.post('/meals', authenticateToken, async (req, res) => {
  try {
    const {
      name,
      description,
      type,
      items,
      imageUrl,
      preparationTime,
      cookingTime,
      instructions,
      isIndian,
      indianRegion,
      isVegetarian,
      isVegan,
      tags,
      isPublic
    } = req.body;
    
    // Calculate nutrition totals
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    
    // In a real implementation, you would fetch food items and calculate totals
    // For demo purposes, we'll use provided values or defaults
    
    // Create new meal
    const newMeal = new Meal({
      name,
      description,
      type,
      items: items || [],
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      imageUrl,
      preparationTime,
      cookingTime,
      instructions,
      isIndian,
      indianRegion,
      isVegetarian,
      isVegan,
      tags,
      createdBy: req.user.id,
      isPublic: isPublic !== undefined ? isPublic : true
    });
    
    await newMeal.save();
    
    res.status(201).json({
      success: true,
      meal: newMeal,
      message: 'Meal created successfully'
    });
  } catch (error) {
    console.error('Create meal error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all diet plans with optional filtering
router.get('/plans', optionalAuth, async (req, res) => {
  try {
    const {
      goal,
      duration,
      isIndian,
      indianRegion,
      isVegetarian,
      isVegan,
      search,
      limit = 20,
      page = 1
    } = req.query;

    // Build query
    const query = { isPublic: true };
    
    if (goal) query.goal = goal;
    if (isIndian) query.isIndian = isIndian === 'true';
    if (indianRegion) query.indianRegion = indianRegion;
    if (isVegetarian) query.isVegetarian = isVegetarian === 'true';
    if (isVegan) query.isVegan = isVegan === 'true';
    
    if (duration) {
      const [min, max] = duration.split('-').map(Number);
      query.duration = { $gte: min || 0 };
      if (max) query.duration.$lte = max;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Execute query
    const plans = await DietPlan.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .select('-meals'); // Exclude meal details for list view
      
    const total = await DietPlan.countDocuments(query);
    
    res.json({
      success: true,
      plans,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get diet plans error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get diet plan by ID
router.get('/plans/:id', optionalAuth, async (req, res) => {
  try {
    const plan = await DietPlan.findById(req.params.id)
      .populate({
        path: 'meals.breakfast meals.lunch meals.dinner meals.snacks',
        populate: {
          path: 'items.foodItem'
        }
      });
      
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Diet plan not found' });
    }
    
    // Check if plan is public or user is creator
    if (!plan.isPublic && (!req.user || plan.createdBy.toString() !== req.user.id)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    res.json({
      success: true,
      plan
    });
  } catch (error) {
    console.error('Get diet plan error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create a new diet plan
router.post('/plans', authenticateToken, async (req, res) => {
  try {
    const {
      name,
      description,
      goal,
      duration,
      calorieTarget,
      macroSplit,
      meals,
      isIndian,
      indianRegion,
      isVegetarian,
      isVegan,
      tags,
      isPublic
    } = req.body;
    
    // Create new diet plan
    const newPlan = new DietPlan({
      name,
      description,
      goal,
      duration,
      calorieTarget,
      macroSplit: macroSplit || {
        protein: 30,
        carbs: 40,
        fat: 30
      },
      meals: meals || [],
      isIndian,
      indianRegion,
      isVegetarian,
      isVegan,
      tags,
      createdBy: req.user.id,
      isPublic: isPublic !== undefined ? isPublic : true,
      isAIGenerated: false
    });
    
    await newPlan.save();
    
    res.status(201).json({
      success: true,
      plan: newPlan,
      message: 'Diet plan created successfully'
    });
  } catch (error) {
    console.error('Create diet plan error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Log nutrition for a day
router.post('/log', authenticateToken, async (req, res) => {
  try {
    const {
      date,
      meals,
      water,
      dailySummary,
      mood,
      hunger,
      energy,
      notes
    } = req.body;
    
    // Check if log already exists for this date
    const existingLog = await NutritionLog.findOne({
      user: req.user.id,
      date: {
        $gte: new Date(date).setHours(0, 0, 0, 0),
        $lt: new Date(date).setHours(23, 59, 59, 999)
      }
    });
    
    if (existingLog) {
      // Update existing log
      existingLog.meals = meals || existingLog.meals;
      existingLog.water = water || existingLog.water;
      existingLog.dailySummary = dailySummary || existingLog.dailySummary;
      existingLog.mood = mood || existingLog.mood;
      existingLog.hunger = hunger || existingLog.hunger;
      existingLog.energy = energy || existingLog.energy;
      existingLog.notes = notes || existingLog.notes;
      
      await existingLog.save();
      
      res.json({
        success: true,
        log: existingLog,
        message: 'Nutrition log updated successfully'
      });
    } else {
      // Create new log
      const newLog = new NutritionLog({
        user: req.user.id,
        date: date || new Date(),
        meals: meals || [],
        water: water || {
          amount: 0,
          goal: 2000
        },
        dailySummary: dailySummary || {
          totalCalories: 0,
          totalProtein: 0,
          totalCarbs: 0,
          totalFat: 0,
          calorieGoal: 2000,
          proteinGoal: 150,
          carbsGoal: 200,
          fatGoal: 65
        },
        mood,
        hunger,
        energy,
        notes
      });
      
      await newLog.save();
      
      res.status(201).json({
        success: true,
        log: newLog,
        message: 'Nutrition log created successfully'
      });
    }
  } catch (error) {
    console.error('Log nutrition error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get nutrition logs for a user
router.get('/log', authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate, limit = 7 } = req.query;
    
    // Build query
    const query = { user: req.user.id };
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    } else if (startDate) {
      query.date = { $gte: new Date(startDate) };
    } else if (endDate) {
      query.date = { $lte: new Date(endDate) };
    }
    
    // Execute query
    const logs = await NutritionLog.find(query)
      .sort({ date: -1 })
      .limit(Number(limit));
    
    res.json({
      success: true,
      logs
    });
  } catch (error) {
    console.error('Get nutrition logs error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Analyze food image (simulated)
router.post('/analyze-image', authenticateToken, async (req, res) => {
  try {
    // In a real implementation, this would process an uploaded image
    // For demo purposes, we'll return simulated results
    
    res.json({
      success: true,
      analysis: {
        foodItems: [
          {
            name: 'Rice',
            confidence: 0.92,
            calories: 130,
            protein: 2.7,
            carbs: 28,
            fat: 0.3,
            servingSize: 100,
            servingUnit: 'g'
          },
          {
            name: 'Dal',
            confidence: 0.87,
            calories: 116,
            protein: 9,
            carbs: 20,
            fat: 0.4,
            servingSize: 100,
            servingUnit: 'g'
          },
          {
            name: 'Vegetable Curry',
            confidence: 0.78,
            calories: 152,
            protein: 4,
            carbs: 15,
            fat: 9,
            servingSize: 100,
            servingUnit: 'g'
          }
        ],
        totalEstimate: {
          calories: 398,
          protein: 15.7,
          carbs: 63,
          fat: 9.7
        },
        mealType: 'lunch',
        isIndian: true,
        indianRegion: 'north_indian'
      },
      message: 'Food image analyzed successfully'
    });
  } catch (error) {
    console.error('Analyze food image error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Generate AI diet plan
router.post('/generate-plan', authenticateToken, async (req, res) => {
  try {
    const {
      goal,
      calorieTarget,
      duration,
      isVegetarian,
      isVegan,
      isIndian,
      indianRegion,
      allergies,
      preferences
    } = req.body;
    
    // In a real implementation, this would call an AI service
    // For demo purposes, we'll return a pre-defined plan
    
    const generatedPlan = {
      name: isIndian ? 'Indian Balanced Diet Plan' : 'Balanced Diet Plan',
      description: `Custom diet plan for ${goal} with ${calorieTarget} daily calories`,
      goal: goal || 'weight_loss',
      duration: duration || 7,
      calorieTarget: calorieTarget || 1800,
      macroSplit: {
        protein: 30,
        carbs: 40,
        fat: 30
      },
      meals: [
        {
          day: 1,
          breakfast: {
            name: isIndian ? 'Masala Oats with Vegetables' : 'Oatmeal with Berries',
            type: 'breakfast',
            totalCalories: 350,
            isIndian: isIndian || false
          },
          lunch: {
            name: isIndian ? 'Dal Khichdi with Raita' : 'Grilled Chicken Salad',
            type: 'lunch',
            totalCalories: 450,
            isIndian: isIndian || false
          },
          dinner: {
            name: isIndian ? 'Roti with Paneer Curry' : 'Baked Salmon with Vegetables',
            type: 'dinner',
            totalCalories: 500,
            isIndian: isIndian || false
          },
          snacks: [
            {
              name: isIndian ? 'Roasted Chana' : 'Greek Yogurt with Nuts',
              type: 'snack',
              totalCalories: 200,
              isIndian: isIndian || false
            }
          ]
        },
        {
          day: 2,
          breakfast: {
            name: isIndian ? 'Vegetable Poha' : 'Protein Smoothie',
            type: 'breakfast',
            totalCalories: 320,
            isIndian: isIndian || false
          },
          lunch: {
            name: isIndian ? 'Rajma Chawal' : 'Turkey Wrap',
            type: 'lunch',
            totalCalories: 480,
            isIndian: isIndian || false
          },
          dinner: {
            name: isIndian ? 'Vegetable Pulao' : 'Stir-Fry Vegetables with Tofu',
            type: 'dinner',
            totalCalories: 420,
            isIndian: isIndian || false
          },
          snacks: [
            {
              name: isIndian ? 'Fruit Chaat' : 'Apple with Almond Butter',
              type: 'snack',
              totalCalories: 180,
              isIndian: isIndian || false
            }
          ]
        }
      ],
      isIndian: isIndian || false,
      indianRegion: indianRegion || 'north_indian',
      isVegetarian: isVegetarian || false,
      isVegan: isVegan || false,
      tags: [goal, isIndian ? 'indian' : 'international', isVegetarian ? 'vegetarian' : ''],
      isAIGenerated: true
    };
    
    res.json({
      success: true,
      plan: generatedPlan,
      message: 'Diet plan generated successfully'
    });
  } catch (error) {
    console.error('Generate diet plan error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;