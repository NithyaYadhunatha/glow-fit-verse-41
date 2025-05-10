const express = require('express');
const router = express.Router();
const { Workout, Exercise } = require('../models/Workout');
const { WorkoutLog } = require('../models/Progress');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

// Get all workouts with optional filtering
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      category,
      difficulty,
      duration,
      equipment,
      muscleGroups,
      isIndian,
      search,
      limit = 20,
      page = 1
    } = req.query;

    // Build query
    const query = { isPublic: true };
    
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (isIndian) query.isIndian = isIndian === 'true';
    
    if (duration) {
      const [min, max] = duration.split('-').map(Number);
      query.duration = { $gte: min || 0 };
      if (max) query.duration.$lte = max;
    }
    
    if (equipment) {
      query.equipment = { $in: Array.isArray(equipment) ? equipment : [equipment] };
    }
    
    if (muscleGroups) {
      query.muscleGroups = { $in: Array.isArray(muscleGroups) ? muscleGroups : [muscleGroups] };
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Execute query
    const workouts = await Workout.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .select('-exercises.exercise.formCues'); // Exclude large data
      
    const total = await Workout.countDocuments(query);
    
    res.json({
      success: true,
      workouts,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get workouts error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get workout by ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id)
      .populate('exercises.exercise');
      
    if (!workout) {
      return res.status(404).json({ success: false, message: 'Workout not found' });
    }
    
    // Check if workout is public or user is creator
    if (!workout.isPublic && (!req.user || workout.creator.toString() !== req.user.id)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    res.json({
      success: true,
      workout
    });
  } catch (error) {
    console.error('Get workout error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create a new workout
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      title,
      description,
      imageUrl,
      coverImageUrl,
      duration,
      difficulty,
      category,
      tags,
      equipment,
      muscleGroups,
      exercises,
      warmup,
      cooldown,
      estimatedCalories,
      isIndian,
      indianElements,
      musicSuggestions,
      isPublic
    } = req.body;
    
    // Create new workout
    const newWorkout = new Workout({
      title,
      description,
      imageUrl,
      coverImageUrl,
      duration,
      difficulty,
      category,
      tags,
      equipment,
      muscleGroups,
      exercises: exercises || [],
      warmup,
      cooldown,
      estimatedCalories,
      isIndian,
      indianElements,
      musicSuggestions,
      isPublic,
      creator: req.user.id
    });
    
    await newWorkout.save();
    
    res.status(201).json({
      success: true,
      workout: newWorkout,
      message: 'Workout created successfully'
    });
  } catch (error) {
    console.error('Create workout error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update a workout
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    
    if (!workout) {
      return res.status(404).json({ success: false, message: 'Workout not found' });
    }
    
    // Check if user is creator
    if (workout.creator.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    // Update fields
    const updatedWorkout = await Workout.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      workout: updatedWorkout,
      message: 'Workout updated successfully'
    });
  } catch (error) {
    console.error('Update workout error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete a workout
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    
    if (!workout) {
      return res.status(404).json({ success: false, message: 'Workout not found' });
    }
    
    // Check if user is creator
    if (workout.creator.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    await Workout.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Workout deleted successfully'
    });
  } catch (error) {
    console.error('Delete workout error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Rate a workout
router.post('/:id/rate', authenticateToken, async (req, res) => {
  try {
    const { rating, review } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }
    
    const workout = await Workout.findById(req.params.id);
    
    if (!workout) {
      return res.status(404).json({ success: false, message: 'Workout not found' });
    }
    
    // Check if user has already rated
    const existingRatingIndex = workout.ratings.findIndex(
      r => r.user.toString() === req.user.id
    );
    
    if (existingRatingIndex !== -1) {
      // Update existing rating
      workout.ratings[existingRatingIndex].rating = rating;
      workout.ratings[existingRatingIndex].review = review;
    } else {
      // Add new rating
      workout.ratings.push({
        user: req.user.id,
        rating,
        review
      });
    }
    
    // Calculate average rating
    const totalRating = workout.ratings.reduce((sum, item) => sum + item.rating, 0);
    workout.averageRating = totalRating / workout.ratings.length;
    workout.totalRatings = workout.ratings.length;
    
    await workout.save();
    
    res.json({
      success: true,
      averageRating: workout.averageRating,
      totalRatings: workout.totalRatings,
      message: 'Workout rated successfully'
    });
  } catch (error) {
    console.error('Rate workout error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Log a completed workout
router.post('/:id/log', authenticateToken, async (req, res) => {
  try {
    const {
      date,
      duration,
      caloriesBurned,
      exercises,
      intensity,
      mood,
      energy,
      notes,
      rating,
      location,
      formScores
    } = req.body;
    
    const workout = await Workout.findById(req.params.id);
    
    if (!workout) {
      return res.status(404).json({ success: false, message: 'Workout not found' });
    }
    
    // Create workout log
    const workoutLog = new WorkoutLog({
      user: req.user.id,
      workout: workout._id,
      title: workout.title,
      date: date || new Date(),
      duration: duration || workout.duration,
      caloriesBurned,
      exercises,
      intensity,
      mood,
      energy,
      notes,
      rating,
      location,
      formScores,
      isCompleted: true
    });
    
    await workoutLog.save();
    
    res.status(201).json({
      success: true,
      workoutLog,
      message: 'Workout logged successfully'
    });
  } catch (error) {
    console.error('Log workout error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Generate AI workout
router.post('/generate', authenticateToken, async (req, res) => {
  try {
    const {
      goals,
      duration,
      equipment,
      difficulty,
      isIndian
    } = req.body;
    
    // In a real implementation, this would call an AI service
    // For demo purposes, we'll return a pre-defined workout
    
    const generatedWorkout = {
      title: isIndian ? 'Desi HIIT Fusion' : 'AI Generated Workout',
      description: `Custom workout based on your goals: ${goals.join(', ')}`,
      imageUrl: 'https://via.placeholder.com/500',
      coverImageUrl: 'https://via.placeholder.com/1200x600',
      duration: duration || 30,
      difficulty: difficulty || 'intermediate',
      category: 'hiit',
      tags: [...goals, 'ai_generated'],
      equipment: equipment || ['none'],
      muscleGroups: ['full_body'],
      exercises: [
        {
          name: isIndian ? 'Surya Namaskar' : 'Jumping Jacks',
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
          name: isIndian ? 'Bhujangasana to Adho Mukha' : 'Mountain Climbers',
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
          name: isIndian ? 'Naukasana' : 'Plank',
          sets: 3,
          reps: '45 seconds',
          rest: 30
        }
      ],
      warmup: {
        duration: 5,
        description: 'Light cardio and dynamic stretching',
        exercises: [
          {
            name: 'Jogging in place',
            duration: 60,
            description: 'Light jog to increase heart rate'
          },
          {
            name: 'Arm circles',
            duration: 30,
            description: 'Rotate arms forward and backward'
          },
          {
            name: 'Hip rotations',
            duration: 30,
            description: 'Rotate hips in circular motion'
          }
        ]
      },
      cooldown: {
        duration: 5,
        description: 'Static stretching to improve flexibility',
        exercises: [
          {
            name: 'Hamstring stretch',
            duration: 30,
            description: 'Reach for toes while seated'
          },
          {
            name: 'Quad stretch',
            duration: 30,
            description: 'Pull heel to buttocks while standing'
          },
          {
            name: 'Child\'s pose',
            duration: 60,
            description: 'Relax in child\'s pose position'
          }
        ]
      },
      estimatedCalories: 250,
      isIndian: isIndian || false,
      indianElements: isIndian ? {
        name: 'Yoga-HIIT Fusion',
        description: 'A blend of traditional yoga poses with high-intensity interval training',
        region: 'all_india',
        culturalContext: 'Combines ancient yoga practices with modern fitness techniques'
      } : null,
      musicSuggestions: isIndian ? [
        {
          title: 'Bollywood Workout Mix',
          artist: 'Various Artists',
          genre: 'Bollywood',
          isIndian: true
        },
        {
          title: 'Bhangra Beats',
          artist: 'Punjabi MC',
          genre: 'Bhangra',
          isIndian: true
        }
      ] : [
        {
          title: 'Workout Motivation Mix',
          artist: 'Various Artists',
          genre: 'Electronic',
          isIndian: false
        }
      ],
      isAIGenerated: true,
      creator: req.user.id
    };
    
    res.json({
      success: true,
      workout: generatedWorkout,
      message: 'Workout generated successfully'
    });
  } catch (error) {
    console.error('Generate workout error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;