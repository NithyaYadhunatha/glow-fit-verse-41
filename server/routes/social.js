const express = require('express');
const router = express.Router();
const { Challenge, Event, Team, Post } = require('../models/Social');
const User = require('../models/User');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

// Get all challenges with optional filtering
router.get('/challenges', optionalAuth, async (req, res) => {
  try {
    const {
      type,
      difficulty,
      duration,
      isActive,
      isIndian,
      search,
      limit = 10,
      page = 1
    } = req.query;

    // Build query
    const query = { isPublic: true };
    
    if (type) query.type = type;
    if (difficulty) query.difficulty = difficulty;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (isIndian) query.isIndian = isIndian === 'true';
    
    if (duration) {
      const [min, max] = duration.split('-').map(Number);
      query.duration = { $gte: min || 0 };
      if (max) query.duration.$lte = max;
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
    const challenges = await Challenge.find(query)
      .sort({ startDate: -1 })
      .skip(skip)
      .limit(Number(limit))
      .select('-dailyTasks'); // Exclude task details for list view
      
    const total = await Challenge.countDocuments(query);
    
    res.json({
      success: true,
      challenges,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get challenges error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get challenge by ID
router.get('/challenges/:id', optionalAuth, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id)
      .populate('creator', 'username displayName photoURL');
      
    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Challenge not found' });
    }
    
    // Check if challenge is public or user is creator
    if (!challenge.isPublic && (!req.user || challenge.creator._id.toString() !== req.user.id)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    // Check if user is a participant
    let userProgress = null;
    if (req.user) {
      const participant = challenge.participants.find(p => p.user.toString() === req.user.id);
      if (participant) {
        userProgress = {
          progress: participant.progress,
          completedDays: participant.completedDays,
          isCompleted: participant.isCompleted,
          completedAt: participant.completedAt
        };
      }
    }
    
    res.json({
      success: true,
      challenge,
      userProgress
    });
  } catch (error) {
    console.error('Get challenge error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create a new challenge
router.post('/challenges', authenticateToken, async (req, res) => {
  try {
    const {
      title,
      description,
      imageUrl,
      coverImageUrl,
      duration,
      type,
      difficulty,
      startDate,
      endDate,
      isIndian,
      indianElements,
      dailyTasks,
      rewards,
      isPublic,
      tags
    } = req.body;
    
    // Create new challenge
    const newChallenge = new Challenge({
      title,
      description,
      imageUrl,
      coverImageUrl,
      duration,
      type,
      difficulty,
      startDate,
      endDate,
      isActive: true,
      isIndian,
      indianElements,
      dailyTasks: dailyTasks || [],
      rewards: rewards || {
        xp: 100
      },
      participants: [],
      creator: req.user.id,
      isPublic: isPublic !== undefined ? isPublic : true,
      isAIGenerated: false,
      tags
    });
    
    await newChallenge.save();
    
    res.status(201).json({
      success: true,
      challenge: newChallenge,
      message: 'Challenge created successfully'
    });
  } catch (error) {
    console.error('Create challenge error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Join a challenge
router.post('/challenges/:id/join', authenticateToken, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    
    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Challenge not found' });
    }
    
    // Check if user is already a participant
    const existingParticipant = challenge.participants.find(
      p => p.user.toString() === req.user.id
    );
    
    if (existingParticipant) {
      return res.status(400).json({ success: false, message: 'You are already participating in this challenge' });
    }
    
    // Add user as participant
    challenge.participants.push({
      user: req.user.id,
      joinedAt: new Date(),
      progress: 0,
      completedDays: [],
      isCompleted: false
    });
    
    await challenge.save();
    
    res.json({
      success: true,
      message: 'Joined challenge successfully'
    });
  } catch (error) {
    console.error('Join challenge error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update challenge progress
router.post('/challenges/:id/progress', authenticateToken, async (req, res) => {
  try {
    const { day, notes } = req.body;
    
    const challenge = await Challenge.findById(req.params.id);
    
    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Challenge not found' });
    }
    
    // Find participant
    const participantIndex = challenge.participants.findIndex(
      p => p.user.toString() === req.user.id
    );
    
    if (participantIndex === -1) {
      return res.status(400).json({ success: false, message: 'You are not participating in this challenge' });
    }
    
    // Check if day is valid
    if (day < 1 || day > challenge.duration) {
      return res.status(400).json({ success: false, message: 'Invalid day' });
    }
    
    // Check if day is already completed
    const dayCompleted = challenge.participants[participantIndex].completedDays.find(d => d.day === day);
    
    if (dayCompleted) {
      return res.status(400).json({ success: false, message: 'Day already completed' });
    }
    
    // Add completed day
    challenge.participants[participantIndex].completedDays.push({
      day,
      completedAt: new Date(),
      notes
    });
    
    // Update progress
    const completedDaysCount = challenge.participants[participantIndex].completedDays.length;
    challenge.participants[participantIndex].progress = (completedDaysCount / challenge.duration) * 100;
    
    // Check if challenge is completed
    if (completedDaysCount >= challenge.duration) {
      challenge.participants[participantIndex].isCompleted = true;
      challenge.participants[participantIndex].completedAt = new Date();
      
      // In a real implementation, you would award XP and badges here
    }
    
    await challenge.save();
    
    res.json({
      success: true,
      progress: challenge.participants[participantIndex].progress,
      completedDays: challenge.participants[participantIndex].completedDays,
      isCompleted: challenge.participants[participantIndex].isCompleted,
      message: 'Progress updated successfully'
    });
  } catch (error) {
    console.error('Update challenge progress error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all events with optional filtering
router.get('/events', optionalAuth, async (req, res) => {
  try {
    const {
      type,
      location,
      startDate,
      endDate,
      isIndian,
      search,
      limit = 10,
      page = 1
    } = req.query;

    // Build query
    const query = { isPublic: true };
    
    if (type) query.type = type;
    if (location) query['location.type'] = location;
    if (isIndian) query.isIndian = isIndian === 'true';
    
    if (startDate) {
      query.startDate = { $gte: new Date(startDate) };
    }
    
    if (endDate) {
      query.endDate = { $lte: new Date(endDate) };
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'location.name': { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Execute query
    const events = await Event.find(query)
      .sort({ startDate: 1 })
      .skip(skip)
      .limit(Number(limit));
      
    const total = await Event.countDocuments(query);
    
    res.json({
      success: true,
      events,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get event by ID
router.get('/events/:id', optionalAuth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer.user', 'username displayName photoURL');
      
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    
    // Check if event is public or user is organizer
    if (!event.isPublic && (!req.user || event.organizer.user._id.toString() !== req.user.id)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    // Check if user is registered
    let userRegistration = null;
    if (req.user) {
      const participant = event.participants.find(p => p.user.toString() === req.user.id);
      if (participant) {
        userRegistration = {
          status: participant.status,
          registeredAt: participant.registeredAt
        };
      }
    }
    
    res.json({
      success: true,
      event,
      userRegistration
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create a new event
router.post('/events', authenticateToken, async (req, res) => {
  try {
    const {
      title,
      description,
      imageUrl,
      coverImageUrl,
      type,
      startDate,
      endDate,
      location,
      isIndian,
      indianElements,
      capacity,
      isPublic,
      tags
    } = req.body;
    
    // Get user info
    const user = await User.findById(req.user.id).select('username displayName email');
    
    // Create new event
    const newEvent = new Event({
      title,
      description,
      imageUrl,
      coverImageUrl,
      type,
      startDate,
      endDate,
      location,
      isIndian,
      indianElements,
      organizer: {
        user: req.user.id,
        name: user.displayName,
        contact: {
          email: user.email
        }
      },
      capacity,
      participants: [],
      isPublic: isPublic !== undefined ? isPublic : true,
      tags
    });
    
    await newEvent.save();
    
    res.status(201).json({
      success: true,
      event: newEvent,
      message: 'Event created successfully'
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Register for an event
router.post('/events/:id/register', authenticateToken, async (req, res) => {
  try {
    const { notes } = req.body;
    
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    
    // Check if event has capacity limit and is full
    if (event.capacity && event.participants.length >= event.capacity) {
      return res.status(400).json({ success: false, message: 'Event is at full capacity' });
    }
    
    // Check if user is already registered
    const existingParticipant = event.participants.find(
      p => p.user.toString() === req.user.id
    );
    
    if (existingParticipant) {
      return res.status(400).json({ success: false, message: 'You are already registered for this event' });
    }
    
    // Add user as participant
    event.participants.push({
      user: req.user.id,
      registeredAt: new Date(),
      status: 'registered',
      notes
    });
    
    await event.save();
    
    res.json({
      success: true,
      message: 'Registered for event successfully'
    });
  } catch (error) {
    console.error('Register for event error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all teams
router.get('/teams', optionalAuth, async (req, res) => {
  try {
    const { search, limit = 10, page = 1 } = req.query;

    // Build query
    const query = { isPublic: true };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Execute query
    const teams = await Team.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('creator', 'username displayName photoURL')
      .populate('members.user', 'username displayName photoURL');
      
    const total = await Team.countDocuments(query);
    
    res.json({
      success: true,
      teams,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get teams error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get team by ID
router.get('/teams/:id', optionalAuth, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('creator', 'username displayName photoURL')
      .populate('members.user', 'username displayName photoURL')
      .populate('challenges.challenge');
      
    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }
    
    // Check if team is public or user is a member
    const isMember = req.user && (
      team.creator._id.toString() === req.user.id ||
      team.members.some(m => m.user._id.toString() === req.user.id)
    );
    
    if (!team.isPublic && !isMember) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    res.json({
      success: true,
      team,
      isMember,
      isAdmin: isMember && (
        team.creator._id.toString() === req.user.id ||
        team.members.some(m => m.user._id.toString() === req.user.id && m.role === 'admin')
      )
    });
  } catch (error) {
    console.error('Get team error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create a new team
router.post('/teams', authenticateToken, async (req, res) => {
  try {
    const {
      name,
      description,
      imageUrl,
      coverImageUrl,
      isPublic
    } = req.body;
    
    // Create new team
    const newTeam = new Team({
      name,
      description,
      imageUrl,
      coverImageUrl,
      creator: req.user.id,
      members: [
        {
          user: req.user.id,
          role: 'admin',
          joinedAt: new Date()
        }
      ],
      isPublic: isPublic !== undefined ? isPublic : true,
      challenges: [],
      stats: {
        totalWorkouts: 0,
        totalSteps: 0,
        totalMinutes: 0,
        totalCaloriesBurned: 0,
        challengesCompleted: 0
      }
    });
    
    await newTeam.save();
    
    res.status(201).json({
      success: true,
      team: newTeam,
      message: 'Team created successfully'
    });
  } catch (error) {
    console.error('Create team error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Join a team
router.post('/teams/:id/join', authenticateToken, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    
    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }
    
    // Check if user is already a member
    const existingMember = team.members.find(
      m => m.user.toString() === req.user.id
    );
    
    if (existingMember) {
      return res.status(400).json({ success: false, message: 'You are already a member of this team' });
    }
    
    // Add user as member
    team.members.push({
      user: req.user.id,
      role: 'member',
      joinedAt: new Date()
    });
    
    await team.save();
    
    res.json({
      success: true,
      message: 'Joined team successfully'
    });
  } catch (error) {
    console.error('Join team error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get posts with optional filtering
router.get('/posts', optionalAuth, async (req, res) => {
  try {
    const { user, limit = 10, page = 1 } = req.query;

    // Build query
    const query = { isPublic: true };
    
    if (user) query.user = user;

    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Execute query
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('user', 'username displayName photoURL')
      .populate('workout', 'title duration')
      .populate('challenge', 'title')
      .populate('event', 'title');
      
    const total = await Post.countDocuments(query);
    
    res.json({
      success: true,
      posts,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create a new post
router.post('/posts', authenticateToken, async (req, res) => {
  try {
    const {
      content,
      images,
      video,
      workout,
      challenge,
      event,
      achievement,
      location,
      isPublic,
      tags
    } = req.body;
    
    // Create new post
    const newPost = new Post({
      user: req.user.id,
      content,
      images,
      video,
      workout,
      challenge,
      event,
      achievement,
      likes: [],
      comments: [],
      tags,
      location,
      isPublic: isPublic !== undefined ? isPublic : true
    });
    
    await newPost.save();
    
    // Populate user info for response
    await newPost.populate('user', 'username displayName photoURL');
    
    res.status(201).json({
      success: true,
      post: newPost,
      message: 'Post created successfully'
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Like a post
router.post('/posts/:id/like', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    
    // Check if user already liked the post
    const existingLike = post.likes.find(
      like => like.user.toString() === req.user.id
    );
    
    if (existingLike) {
      // Unlike the post
      post.likes = post.likes.filter(
        like => like.user.toString() !== req.user.id
      );
    } else {
      // Like the post
      post.likes.push({
        user: req.user.id,
        createdAt: new Date()
      });
    }
    
    await post.save();
    
    res.json({
      success: true,
      liked: !existingLike,
      likesCount: post.likes.length,
      message: existingLike ? 'Post unliked successfully' : 'Post liked successfully'
    });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Comment on a post
router.post('/posts/:id/comment', authenticateToken, async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ success: false, message: 'Comment content is required' });
    }
    
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    
    // Add comment
    post.comments.push({
      user: req.user.id,
      content,
      createdAt: new Date(),
      likes: []
    });
    
    await post.save();
    
    // Get updated post with populated user info
    const updatedPost = await Post.findById(req.params.id)
      .populate('user', 'username displayName photoURL')
      .populate('comments.user', 'username displayName photoURL');
    
    res.json({
      success: true,
      comments: updatedPost.comments,
      message: 'Comment added successfully'
    });
  } catch (error) {
    console.error('Comment on post error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get leaderboard
router.get('/leaderboard', optionalAuth, async (req, res) => {
  try {
    const { type = 'xp', period = 'week', limit = 10 } = req.query;
    
    // In a real implementation, this would query user activity data
    // For demo purposes, we'll return simulated leaderboard data
    
    // Get some real users from the database
    const users = await User.find()
      .select('username displayName photoURL gamification.level gamification.xp gamification.streak')
      .limit(20);
    
    // Generate leaderboard based on type
    let leaderboard = [];
    
    if (type === 'xp') {
      leaderboard = users.map(user => ({
        user: {
          id: user._id,
          username: user.username,
          displayName: user.displayName,
          photoURL: user.photoURL,
          level: user.gamification?.level || 1
        },
        score: user.gamification?.xp || Math.floor(Math.random() * 1000),
        rank: 0
      }));
      
      // Sort by XP
      leaderboard.sort((a, b) => b.score - a.score);
    } else if (type === 'streak') {
      leaderboard = users.map(user => ({
        user: {
          id: user._id,
          username: user.username,
          displayName: user.displayName,
          photoURL: user.photoURL,
          level: user.gamification?.level || 1
        },
        score: user.gamification?.streak || Math.floor(Math.random() * 30),
        rank: 0
      }));
      
      // Sort by streak
      leaderboard.sort((a, b) => b.score - a.score);
    } else if (type === 'workouts') {
      leaderboard = users.map(user => ({
        user: {
          id: user._id,
          username: user.username,
          displayName: user.displayName,
          photoURL: user.photoURL,
          level: user.gamification?.level || 1
        },
        score: Math.floor(Math.random() * 20),
        rank: 0
      }));
      
      // Sort by workout count
      leaderboard.sort((a, b) => b.score - a.score);
    } else if (type === 'steps') {
      leaderboard = users.map(user => ({
        user: {
          id: user._id,
          username: user.username,
          displayName: user.displayName,
          photoURL: user.photoURL,
          level: user.gamification?.level || 1
        },
        score: Math.floor(Math.random() * 100000),
        rank: 0
      }));
      
      // Sort by steps
      leaderboard.sort((a, b) => b.score - a.score);
    }
    
    // Assign ranks
    leaderboard.forEach((entry, index) => {
      entry.rank = index + 1;
    });
    
    // Limit results
    leaderboard = leaderboard.slice(0, limit);
    
    // Find user's rank if authenticated
    let userRank = null;
    if (req.user) {
      const userIndex = leaderboard.findIndex(entry => entry.user.id.toString() === req.user.id);
      if (userIndex !== -1) {
        userRank = {
          rank: leaderboard[userIndex].rank,
          score: leaderboard[userIndex].score
        };
      } else {
        // User not in top results, simulate their rank
        userRank = {
          rank: Math.floor(Math.random() * 50) + leaderboard.length,
          score: Math.floor(Math.random() * (leaderboard[leaderboard.length - 1].score))
        };
      }
    }
    
    res.json({
      success: true,
      leaderboard,
      userRank,
      type,
      period,
      unit: type === 'xp' ? 'XP' : type === 'streak' ? 'days' : type === 'workouts' ? 'workouts' : 'steps'
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Generate AI challenge
router.post('/challenges/generate', authenticateToken, async (req, res) => {
  try {
    const {
      goal,
      duration,
      difficulty,
      isIndian
    } = req.body;
    
    // In a real implementation, this would call an AI service
    // For demo purposes, we'll return a pre-defined challenge
    
    const generatedChallenge = {
      title: isIndian ? '21-Day Desi Weight Loss Challenge' : '30-Day Fitness Challenge',
      description: `Custom challenge based on your goal: ${goal}. Complete daily tasks to improve your fitness and reach your goals.`,
      imageUrl: 'https://via.placeholder.com/500',
      coverImageUrl: 'https://via.placeholder.com/1200x600',
      duration: duration || (isIndian ? 21 : 30),
      type: goal === 'weight_loss' ? 'workout' : goal === 'strength' ? 'workout' : 'habit',
      difficulty: difficulty || 'intermediate',
      startDate: new Date(),
      endDate: new Date(Date.now() + (duration || 30) * 24 * 60 * 60 * 1000),
      isActive: true,
      isIndian: isIndian || false,
      indianElements: isIndian ? {
        name: 'Holi Hustle',
        description: 'Inspired by the festival of colors, this challenge brings vibrant energy to your fitness routine',
        festival: 'Holi',
        culturalContext: 'Celebrates the victory of good over evil and the arrival of spring'
      } : null,
      dailyTasks: Array.from({ length: duration || 30 }, (_, i) => ({
        day: i + 1,
        title: isIndian ? 
          (i % 7 === 0 ? 'Yoga Day' : 
           i % 7 === 1 ? 'HIIT Bhangra' : 
           i % 7 === 2 ? 'Desi Cardio' : 
           i % 7 === 3 ? 'Rest & Recover' : 
           i % 7 === 4 ? 'Strength Training' : 
           i % 7 === 5 ? 'Dance Workout' : 
           'Active Recovery') :
          (i % 7 === 0 ? 'Cardio Day' : 
           i % 7 === 1 ? 'Upper Body' : 
           i % 7 === 2 ? 'Lower Body' : 
           i % 7 === 3 ? 'Rest Day' : 
           i % 7 === 4 ? 'Full Body' : 
           i % 7 === 5 ? 'HIIT' : 
           'Active Recovery'),
        description: `Day ${i + 1} of your fitness journey. ${
          i % 7 === 3 ? 'Take time to rest and recover today.' : 'Push yourself to new limits!'
        }`,
        type: i % 7 === 3 ? 'habit' : 'workout',
        target: {
          value: i % 7 === 3 ? 1 : 30,
          unit: i % 7 === 3 ? 'completion' : 'minutes'
        }
      })),
      rewards: {
        xp: 500,
        badge: {
          id: 'challenge_1',
          name: isIndian ? 'Desi Warrior' : 'Fitness Warrior',
          description: `Completed the ${isIndian ? '21-Day Desi Weight Loss' : '30-Day Fitness'} Challenge`,
          imageUrl: 'https://via.placeholder.com/100'
        }
      },
      isAIGenerated: true,
      creator: req.user.id,
      tags: [goal, difficulty, isIndian ? 'indian' : 'international']
    };
    
    res.json({
      success: true,
      challenge: generatedChallenge,
      message: 'Challenge generated successfully'
    });
  } catch (error) {
    console.error('Generate challenge error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;