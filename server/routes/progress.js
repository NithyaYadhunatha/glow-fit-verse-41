const express = require('express');
const router = express.Router();
const { WorkoutLog, BodyMeasurement, SleepLog, ActivityLog, Goal } = require('../models/Progress');
const { authenticateToken } = require('../middleware/auth');

// Get workout logs for a user
router.get('/workouts', authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate, limit = 10, page = 1 } = req.query;
    
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
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Execute query
    const logs = await WorkoutLog.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('workout', 'title category difficulty');
      
    const total = await WorkoutLog.countDocuments(query);
    
    res.json({
      success: true,
      logs,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get workout logs error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get workout log by ID
router.get('/workouts/:id', authenticateToken, async (req, res) => {
  try {
    const log = await WorkoutLog.findById(req.params.id)
      .populate('workout');
      
    if (!log) {
      return res.status(404).json({ success: false, message: 'Workout log not found' });
    }
    
    // Check if user owns this log
    if (log.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    res.json({
      success: true,
      log
    });
  } catch (error) {
    console.error('Get workout log error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create a workout log
router.post('/workouts', authenticateToken, async (req, res) => {
  try {
    const {
      workout,
      title,
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
      photos,
      formScores,
      heartRate
    } = req.body;
    
    // Create new workout log
    const newLog = new WorkoutLog({
      user: req.user.id,
      workout,
      title: title || 'Custom Workout',
      date: date || new Date(),
      duration,
      caloriesBurned,
      exercises: exercises || [],
      intensity,
      mood,
      energy,
      notes,
      rating,
      location,
      photos,
      formScores,
      heartRate,
      isCompleted: true
    });
    
    await newLog.save();
    
    res.status(201).json({
      success: true,
      log: newLog,
      message: 'Workout logged successfully'
    });
  } catch (error) {
    console.error('Create workout log error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get body measurements for a user
router.get('/measurements', authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate, limit = 10 } = req.query;
    
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
    const measurements = await BodyMeasurement.find(query)
      .sort({ date: -1 })
      .limit(Number(limit));
    
    res.json({
      success: true,
      measurements
    });
  } catch (error) {
    console.error('Get measurements error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create a body measurement
router.post('/measurements', authenticateToken, async (req, res) => {
  try {
    const {
      date,
      weight,
      height,
      bodyFat,
      measurements,
      photos,
      notes
    } = req.body;
    
    // Calculate BMI if weight and height are provided
    let bmi = null;
    if (weight && height) {
      bmi = weight / ((height / 100) * (height / 100));
      bmi = parseFloat(bmi.toFixed(1));
    }
    
    // Create new measurement
    const newMeasurement = new BodyMeasurement({
      user: req.user.id,
      date: date || new Date(),
      weight,
      height,
      bodyFat,
      bmi,
      measurements,
      photos,
      notes
    });
    
    await newMeasurement.save();
    
    res.status(201).json({
      success: true,
      measurement: newMeasurement,
      message: 'Body measurement recorded successfully'
    });
  } catch (error) {
    console.error('Create measurement error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get sleep logs for a user
router.get('/sleep', authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate, limit = 10 } = req.query;
    
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
    const logs = await SleepLog.find(query)
      .sort({ date: -1 })
      .limit(Number(limit));
    
    res.json({
      success: true,
      logs
    });
  } catch (error) {
    console.error('Get sleep logs error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create a sleep log
router.post('/sleep', authenticateToken, async (req, res) => {
  try {
    const {
      date,
      bedTime,
      wakeTime,
      quality,
      stages,
      interruptions,
      notes,
      mood,
      energy,
      tags,
      source
    } = req.body;
    
    // Calculate duration in minutes
    const bedTimeDate = new Date(bedTime);
    const wakeTimeDate = new Date(wakeTime);
    const durationMinutes = Math.round((wakeTimeDate - bedTimeDate) / (1000 * 60));
    
    // Create new sleep log
    const newLog = new SleepLog({
      user: req.user.id,
      date: date || new Date(),
      bedTime,
      wakeTime,
      duration: durationMinutes,
      quality,
      stages,
      interruptions,
      notes,
      mood,
      energy,
      tags,
      source: source || 'manual'
    });
    
    await newLog.save();
    
    res.status(201).json({
      success: true,
      log: newLog,
      message: 'Sleep logged successfully'
    });
  } catch (error) {
    console.error('Create sleep log error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get activity logs for a user
router.get('/activity', authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate, limit = 10 } = req.query;
    
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
    const logs = await ActivityLog.find(query)
      .sort({ date: -1 })
      .limit(Number(limit));
    
    res.json({
      success: true,
      logs
    });
  } catch (error) {
    console.error('Get activity logs error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create an activity log
router.post('/activity', authenticateToken, async (req, res) => {
  try {
    const {
      date,
      steps,
      distance,
      activeMinutes,
      caloriesBurned,
      heartRate,
      floors,
      source
    } = req.body;
    
    // Create new activity log
    const newLog = new ActivityLog({
      user: req.user.id,
      date: date || new Date(),
      steps,
      distance,
      activeMinutes,
      caloriesBurned,
      heartRate,
      floors,
      source: source || 'manual'
    });
    
    await newLog.save();
    
    res.status(201).json({
      success: true,
      log: newLog,
      message: 'Activity logged successfully'
    });
  } catch (error) {
    console.error('Create activity log error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get goals for a user
router.get('/goals', authenticateToken, async (req, res) => {
  try {
    const { type, isCompleted, limit = 10 } = req.query;
    
    // Build query
    const query = { user: req.user.id };
    
    if (type) query.type = type;
    if (isCompleted !== undefined) query.isCompleted = isCompleted === 'true';
    
    // Execute query
    const goals = await Goal.find(query)
      .sort({ endDate: 1 })
      .limit(Number(limit));
    
    res.json({
      success: true,
      goals
    });
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create a goal
router.post('/goals', authenticateToken, async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      target,
      current,
      startDate,
      endDate,
      milestones,
      reminderFrequency,
      isPublic,
      tags
    } = req.body;
    
    // Calculate initial progress
    const initialValue = current ? current.value : 0;
    const progress = (initialValue / target.value) * 100;
    
    // Create new goal
    const newGoal = new Goal({
      user: req.user.id,
      title,
      description,
      type,
      target,
      current: current || { value: 0 },
      progress: progress || 0,
      startDate: startDate || new Date(),
      endDate,
      isCompleted: false,
      milestones,
      reminderFrequency,
      isPublic: isPublic !== undefined ? isPublic : false,
      tags
    });
    
    await newGoal.save();
    
    res.status(201).json({
      success: true,
      goal: newGoal,
      message: 'Goal created successfully'
    });
  } catch (error) {
    console.error('Create goal error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update goal progress
router.put('/goals/:id/progress', authenticateToken, async (req, res) => {
  try {
    const { current } = req.body;
    
    const goal = await Goal.findById(req.params.id);
    
    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }
    
    // Check if user owns this goal
    if (goal.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    // Update progress
    goal.current = current;
    goal.progress = (current.value / goal.target.value) * 100;
    
    // Check if goal is completed
    if (goal.progress >= 100 && !goal.isCompleted) {
      goal.isCompleted = true;
      goal.completedDate = new Date();
    }
    
    // Update milestones
    if (goal.milestones && goal.milestones.length > 0) {
      goal.milestones.forEach(milestone => {
        if (current.value >= milestone.value && !milestone.isCompleted) {
          milestone.isCompleted = true;
          milestone.completedDate = new Date();
        }
      });
    }
    
    await goal.save();
    
    res.json({
      success: true,
      goal,
      message: 'Goal progress updated successfully'
    });
  } catch (error) {
    console.error('Update goal progress error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get user stats and summary
router.get('/summary', authenticateToken, async (req, res) => {
  try {
    const { period = 'week' } = req.query;
    
    // Calculate date range
    const endDate = new Date();
    let startDate = new Date();
    
    if (period === 'week') {
      startDate.setDate(endDate.getDate() - 7);
    } else if (period === 'month') {
      startDate.setMonth(endDate.getMonth() - 1);
    } else if (period === 'year') {
      startDate.setFullYear(endDate.getFullYear() - 1);
    }
    
    // Get workout stats
    const workouts = await WorkoutLog.find({
      user: req.user.id,
      date: { $gte: startDate, $lte: endDate }
    });
    
    const totalWorkouts = workouts.length;
    const totalWorkoutMinutes = workouts.reduce((sum, log) => sum + log.duration, 0);
    const totalCaloriesBurned = workouts.reduce((sum, log) => sum + (log.caloriesBurned || 0), 0);
    
    // Get activity stats
    const activities = await ActivityLog.find({
      user: req.user.id,
      date: { $gte: startDate, $lte: endDate }
    });
    
    const totalSteps = activities.reduce((sum, log) => sum + log.steps.count, 0);
    const totalDistance = activities.reduce((sum, log) => sum + log.distance.value, 0);
    const totalActiveMinutes = activities.reduce((sum, log) => sum + log.activeMinutes.value, 0);
    
    // Get sleep stats
    const sleepLogs = await SleepLog.find({
      user: req.user.id,
      date: { $gte: startDate, $lte: endDate }
    });
    
    const totalSleepMinutes = sleepLogs.reduce((sum, log) => sum + log.duration, 0);
    const avgSleepHours = sleepLogs.length > 0 ? (totalSleepMinutes / sleepLogs.length) / 60 : 0;
    
    // Get body measurements
    const measurements = await BodyMeasurement.find({
      user: req.user.id,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: 1 });
    
    const weightChange = measurements.length >= 2 
      ? measurements[measurements.length - 1].weight - measurements[0].weight 
      : 0;
    
    // Get active goals
    const activeGoals = await Goal.find({
      user: req.user.id,
      isCompleted: false,
      endDate: { $gte: new Date() }
    }).sort({ endDate: 1 }).limit(5);
    
    res.json({
      success: true,
      summary: {
        period,
        workouts: {
          total: totalWorkouts,
          minutes: totalWorkoutMinutes,
          caloriesBurned: totalCaloriesBurned,
          avgDuration: totalWorkouts > 0 ? totalWorkoutMinutes / totalWorkouts : 0
        },
        activity: {
          totalSteps,
          totalDistance,
          totalActiveMinutes,
          avgSteps: activities.length > 0 ? totalSteps / activities.length : 0
        },
        sleep: {
          avgHours: avgSleepHours,
          totalLogs: sleepLogs.length
        },
        body: {
          weightChange,
          currentWeight: measurements.length > 0 ? measurements[measurements.length - 1].weight : null,
          currentBmi: measurements.length > 0 ? measurements[measurements.length - 1].bmi : null
        },
        goals: {
          active: activeGoals.length,
          completed: await Goal.countDocuments({
            user: req.user.id,
            isCompleted: true,
            completedDate: { $gte: startDate, $lte: endDate }
          })
        }
      },
      activeGoals
    });
  } catch (error) {
    console.error('Get summary error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Analyze progress and provide insights
router.get('/insights', authenticateToken, async (req, res) => {
  try {
    // In a real implementation, this would analyze user data and provide insights
    // For demo purposes, we'll return simulated insights
    
    res.json({
      success: true,
      insights: [
        {
          type: 'workout',
          title: 'Workout Consistency',
          description: 'You\'ve been consistent with your workouts this week. Keep it up!',
          metric: '+12%',
          trend: 'up'
        },
        {
          type: 'nutrition',
          title: 'Protein Intake',
          description: 'Your protein intake has been below target. Consider adding more protein-rich foods.',
          metric: '-15%',
          trend: 'down'
        },
        {
          type: 'sleep',
          title: 'Sleep Quality',
          description: 'Your sleep quality has improved this week.',
          metric: '+8%',
          trend: 'up'
        },
        {
          type: 'weight',
          title: 'Weight Trend',
          description: 'You\'re making steady progress towards your weight goal.',
          metric: '-0.5kg',
          trend: 'down'
        },
        {
          type: 'activity',
          title: 'Step Count',
          description: 'Your daily steps have increased compared to last week.',
          metric: '+1,500',
          trend: 'up'
        }
      ],
      recommendations: [
        {
          type: 'workout',
          title: 'Try HIIT Workouts',
          description: 'Based on your goals and progress, high-intensity interval training could help accelerate your results.'
        },
        {
          type: 'nutrition',
          title: 'Increase Protein Intake',
          description: 'Try adding paneer, lentils, or chicken to your meals to meet your protein goals.'
        },
        {
          type: 'recovery',
          title: 'Add Active Recovery',
          description: 'Consider adding yoga or light stretching on your rest days to improve recovery.'
        }
      ]
    });
  } catch (error) {
    console.error('Get insights error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;