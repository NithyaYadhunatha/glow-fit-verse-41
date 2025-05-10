const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// AI Assistant chat endpoint
router.post('/chat', authenticateToken, async (req, res) => {
  try {
    const { message, context } = req.body;
    
    // In a real implementation, this would call an AI service like OpenAI
    // For demo purposes, we'll return simulated responses
    
    // Simple keyword-based responses
    let response = '';
    
    if (message.toLowerCase().includes('workout') || message.toLowerCase().includes('exercise')) {
      response = "Based on your fitness goals, I recommend focusing on compound exercises like squats, deadlifts, and bench press. Would you like me to create a personalized workout plan for you?";
    } else if (message.toLowerCase().includes('diet') || message.toLowerCase().includes('nutrition') || message.toLowerCase().includes('food')) {
      response = "A balanced diet is crucial for your fitness goals. For your body type and activity level, aim for about 2000 calories with 40% carbs, 30% protein, and 30% fats. Would you like some meal suggestions that include Indian cuisine options?";
    } else if (message.toLowerCase().includes('weight loss') || message.toLowerCase().includes('lose weight')) {
      response = "For effective weight loss, combine strength training with cardio and maintain a slight caloric deficit. Based on your data, a deficit of 300-400 calories per day would be sustainable. Would you like me to suggest a weight loss workout and diet plan?";
    } else if (message.toLowerCase().includes('muscle') || message.toLowerCase().includes('gain') || message.toLowerCase().includes('bulk')) {
      response = "To build muscle, focus on progressive overload in your strength training and ensure you're in a slight caloric surplus with adequate protein intake (1.6-2g per kg of body weight). Would you like a muscle-building program?";
    } else if (message.toLowerCase().includes('sleep') || message.toLowerCase().includes('recovery')) {
      response = "Your sleep data shows an average of 6.5 hours per night, which is below the recommended 7-9 hours for optimal recovery. Try to improve your sleep hygiene by maintaining a consistent schedule and avoiding screens before bed.";
    } else if (message.toLowerCase().includes('yoga') || message.toLowerCase().includes('flexibility')) {
      response = "Yoga is excellent for flexibility, balance, and mental well-being. Based on your goals, I recommend incorporating Surya Namaskar (Sun Salutation) and Vinyasa flow 2-3 times per week. Would you like a beginner-friendly yoga routine?";
    } else if (message.toLowerCase().includes('motivation') || message.toLowerCase().includes('stuck') || message.toLowerCase().includes('plateau')) {
      response = "It's normal to hit plateaus in your fitness journey. Looking at your progress, you've made significant improvements in the past 3 months! Try changing your routine, setting new short-term goals, or finding a workout buddy to stay motivated.";
    } else if (message.toLowerCase().includes('indian') || message.toLowerCase().includes('desi')) {
      response = "I can definitely incorporate Indian elements into your fitness plan! From Bhangra workouts for cardio to yoga for flexibility, and nutritious Indian recipes like dal, roti, and sabzi for your meal plan. Would you like specific recommendations?";
    } else if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi') || message.toLowerCase().includes('hey')) {
      response = "Namaste! I'm your AI fitness assistant. How can I help you today with your workout, nutrition, or wellness goals?";
    } else {
      response = "I'm here to help with your fitness journey. You can ask me about workouts, nutrition, progress tracking, or any other fitness-related questions. What would you like to know?";
    }
    
    res.json({
      success: true,
      message: response,
      context: context || 'fitness'
    });
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Voice assistant endpoint
router.post('/voice', authenticateToken, async (req, res) => {
  try {
    const { transcript, context } = req.body;
    
    // In a real implementation, this would process the transcript and generate a response
    // For demo purposes, we'll return simulated responses
    
    // Simple keyword-based responses (similar to chat)
    let response = '';
    
    if (transcript.toLowerCase().includes('workout') || transcript.toLowerCase().includes('exercise')) {
      response = "I recommend a full-body workout today focusing on compound movements. Start with 10 minutes of warm-up, then do 3 sets of squats, push-ups, rows, and planks. Would you like me to start a timer for your workout?";
    } else if (transcript.toLowerCase().includes('diet') || transcript.toLowerCase().includes('nutrition')) {
      response = "Based on your goals, I suggest increasing your protein intake. Try adding paneer, lentils, or chicken to your meals. Would you like me to suggest a meal plan?";
    } else if (transcript.toLowerCase().includes('timer') || transcript.toLowerCase().includes('countdown')) {
      response = "Starting a 30-second timer now. Get ready!";
    } else if (transcript.toLowerCase().includes('progress') || transcript.toLowerCase().includes('stats')) {
      response = "You've completed 5 workouts this week, which is 2 more than last week. Your average workout duration has increased by 15%. Great job!";
    } else if (transcript.toLowerCase().includes('water') || transcript.toLowerCase().includes('hydration')) {
      response = "You've logged 1.5 liters of water today. Try to drink at least 0.5 liters more to reach your daily goal of 2 liters.";
    } else {
      response = "I didn't quite catch that. You can ask me about workouts, nutrition, timers, or your progress.";
    }
    
    res.json({
      success: true,
      response,
      context: context || 'fitness'
    });
  } catch (error) {
    console.error('Voice assistant error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Pose detection feedback endpoint
router.post('/pose-feedback', authenticateToken, async (req, res) => {
  try {
    const { exercise, keypoints, frame } = req.body;
    
    // In a real implementation, this would analyze the pose keypoints and provide feedback
    // For demo purposes, we'll return simulated feedback
    
    // Simulate random feedback based on exercise
    const feedbackOptions = {
      squat: [
        { message: 'Keep your back straight', score: 75 },
        { message: 'Lower your hips more', score: 60 },
        { message: 'Keep your knees aligned with your toes', score: 80 },
        { message: 'Great form!', score: 95 },
        { message: 'Go deeper in your squat', score: 70 },
        { message: 'Keep your weight on your heels', score: 85 }
      ],
      pushup: [
        { message: 'Keep your core tight', score: 80 },
        { message: 'Lower your chest closer to the ground', score: 65 },
        { message: 'Keep your elbows at 45 degrees', score: 75 },
        { message: 'Perfect form!', score: 98 },
        { message: 'Keep your back straight', score: 70 },
        { message: 'Don\'t drop your hips', score: 60 }
      ],
      plank: [
        { message: 'Keep your back flat', score: 85 },
        { message: 'Engage your core', score: 75 },
        { message: 'Don\'t drop your hips', score: 65 },
        { message: 'Great form!', score: 90 },
        { message: 'Keep your neck neutral', score: 80 },
        { message: 'Breathe steadily', score: 95 }
      ],
      'warrior-pose': [
        { message: 'Extend your arms fully', score: 80 },
        { message: 'Bend your front knee more', score: 70 },
        { message: 'Keep your back leg straight', score: 75 },
        { message: 'Perfect warrior pose!', score: 95 },
        { message: 'Look forward', score: 85 },
        { message: 'Ground through your back foot', score: 80 }
      ],
      default: [
        { message: 'Keep your form steady', score: 80 },
        { message: 'Maintain proper alignment', score: 75 },
        { message: 'Good job!', score: 90 },
        { message: 'Focus on your breathing', score: 85 },
        { message: 'Maintain control of the movement', score: 80 }
      ]
    };
    
    const options = feedbackOptions[exercise] || feedbackOptions.default;
    const feedback = options[Math.floor(Math.random() * options.length)];
    
    // Simulate rep counting
    const isGoodForm = feedback.score >= 85;
    const repDetected = Math.random() > 0.7; // 30% chance of detecting a rep
    
    res.json({
      success: true,
      feedback: feedback.message,
      formScore: feedback.score,
      repDetected: isGoodForm && repDetected,
      keypoints: keypoints || [] // Echo back keypoints if provided
    });
  } catch (error) {
    console.error('Pose feedback error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Workout recommendation endpoint
router.post('/recommend-workout', authenticateToken, async (req, res) => {
  try {
    const { 
      goals, 
      equipment, 
      duration, 
      difficulty, 
      bodyParts,
      mood,
      energy,
      previousWorkouts
    } = req.body;
    
    // In a real implementation, this would generate personalized recommendations
    // For demo purposes, we'll return simulated recommendations
    
    // Determine workout type based on goals and mood
    let workoutType = 'strength';
    if (goals && goals.includes('weight_loss')) {
      workoutType = 'hiit';
    } else if (goals && goals.includes('endurance')) {
      workoutType = 'cardio';
    } else if (mood === 'stressed' || mood === 'anxious') {
      workoutType = 'yoga';
    } else if (energy === 'low') {
      workoutType = 'light_cardio';
    }
    
    // Generate workout recommendation
    const workoutRecommendation = {
      title: `Personalized ${workoutType.charAt(0).toUpperCase() + workoutType.slice(1)} Workout`,
      description: `This workout is designed based on your goals, available equipment, and current energy levels.`,
      duration: duration || 30,
      difficulty: difficulty || 'intermediate',
      caloriesBurn: workoutType === 'hiit' ? 350 : workoutType === 'strength' ? 250 : workoutType === 'cardio' ? 300 : 200,
      exercises: [
        {
          name: workoutType === 'strength' ? 'Dumbbell Squats' : 
                workoutType === 'hiit' ? 'Burpees' : 
                workoutType === 'cardio' ? 'High Knees' : 
                'Sun Salutation',
          sets: workoutType === 'yoga' ? 1 : 3,
          reps: workoutType === 'yoga' ? '5 breaths' : workoutType === 'cardio' || workoutType === 'hiit' ? '30 seconds' : '12',
          rest: workoutType === 'yoga' ? 0 : workoutType === 'hiit' ? 15 : 60
        },
        {
          name: workoutType === 'strength' ? 'Push-ups' : 
                workoutType === 'hiit' ? 'Mountain Climbers' : 
                workoutType === 'cardio' ? 'Jumping Jacks' : 
                'Warrior Pose',
          sets: workoutType === 'yoga' ? 1 : 3,
          reps: workoutType === 'yoga' ? '5 breaths each side' : workoutType === 'cardio' || workoutType === 'hiit' ? '30 seconds' : '10',
          rest: workoutType === 'yoga' ? 0 : workoutType === 'hiit' ? 15 : 60
        },
        {
          name: workoutType === 'strength' ? 'Bent-over Rows' : 
                workoutType === 'hiit' ? 'Jump Squats' : 
                workoutType === 'cardio' ? 'Skipping' : 
                'Downward Dog',
          sets: workoutType === 'yoga' ? 1 : 3,
          reps: workoutType === 'yoga' ? '5 breaths' : workoutType === 'cardio' || workoutType === 'hiit' ? '30 seconds' : '12',
          rest: workoutType === 'yoga' ? 0 : workoutType === 'hiit' ? 15 : 60
        }
      ],
      musicRecommendation: mood === 'energetic' ? 'Upbeat Bollywood Hits' : 
                          mood === 'focused' ? 'Electronic Focus' : 
                          mood === 'stressed' ? 'Calming Indian Classical' : 
                          'Motivational Workout Mix',
      tips: [
        'Remember to stay hydrated throughout your workout',
        'Focus on proper form rather than speed',
        'Listen to your body and adjust intensity as needed'
      ]
    };
    
    res.json({
      success: true,
      recommendation: workoutRecommendation
    });
  } catch (error) {
    console.error('Workout recommendation error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Nutrition recommendation endpoint
router.post('/recommend-nutrition', authenticateToken, async (req, res) => {
  try {
    const { 
      goals, 
      preferences, 
      allergies, 
      mealType,
      calorieTarget,
      macroPreferences,
      isVegetarian,
      isVegan,
      isIndian
    } = req.body;
    
    // In a real implementation, this would generate personalized recommendations
    // For demo purposes, we'll return simulated recommendations
    
    // Generate meal recommendation based on preferences
    let mealRecommendation = {};
    
    if (isIndian) {
      if (mealType === 'breakfast') {
        if (isVegetarian || isVegan) {
          mealRecommendation = {
            name: 'Masala Oats with Vegetables',
            description: 'Nutritious oats cooked with mixed vegetables and Indian spices',
            calories: 320,
            protein: 12,
            carbs: 45,
            fat: 10,
            ingredients: [
              '1 cup oats',
              '1/2 cup mixed vegetables (carrots, peas, bell peppers)',
              '1 tsp cumin seeds',
              '1/2 tsp turmeric',
              '1 tsp ginger-garlic paste',
              '1 green chili, chopped',
              'Salt to taste',
              '1 tsp oil'
            ],
            instructions: [
              'Heat oil in a pan and add cumin seeds',
              'Add ginger-garlic paste and green chili, sauté for 30 seconds',
              'Add vegetables and sauté for 2 minutes',
              'Add oats, turmeric, salt, and 2 cups of water',
              'Cook for 3-4 minutes until oats are soft',
              'Garnish with coriander leaves'
            ],
            benefits: [
              'High in fiber for digestive health',
              'Complex carbs for sustained energy',
              'Vegetables provide essential vitamins and minerals'
            ]
          };
        } else {
          mealRecommendation = {
            name: 'Egg Bhurji with Whole Wheat Paratha',
            description: 'Scrambled eggs with Indian spices served with whole wheat flatbread',
            calories: 420,
            protein: 22,
            carbs: 40,
            fat: 18,
            ingredients: [
              '2 eggs',
              '1 small onion, finely chopped',
              '1 small tomato, chopped',
              '1 green chili, chopped',
              '1/4 tsp turmeric',
              '1/2 tsp cumin powder',
              'Salt to taste',
              '1 tsp oil',
              '1 whole wheat paratha'
            ],
            instructions: [
              'Heat oil in a pan and add chopped onions',
              'Sauté until translucent, then add green chili',
              'Add tomatoes and cook until soft',
              'Add turmeric, cumin powder, and salt',
              'Beat eggs and pour into the pan, scramble until cooked',
              'Serve hot with whole wheat paratha'
            ],
            benefits: [
              'High in protein for muscle recovery',
              'Whole wheat provides complex carbs and fiber',
              'Rich in vitamins and minerals'
            ]
          };
        }
      } else if (mealType === 'lunch') {
        if (isVegetarian || isVegan) {
          mealRecommendation = {
            name: 'Dal Khichdi with Raita',
            description: 'One-pot meal of rice and lentils with yogurt side',
            calories: 450,
            protein: 18,
            carbs: 65,
            fat: 12,
            ingredients: [
              '1/2 cup rice',
              '1/4 cup yellow moong dal',
              '1 tsp cumin seeds',
              '1/2 tsp turmeric',
              '1 tsp ginger-garlic paste',
              'Salt to taste',
              '1 tsp ghee (or oil for vegan)',
              '1 cup yogurt (or plant-based yogurt for vegan)',
              '1/2 cucumber, grated',
              '1/4 tsp roasted cumin powder'
            ],
            instructions: [
              'Wash rice and dal together',
              'Heat ghee/oil in a pressure cooker and add cumin seeds',
              'Add ginger-garlic paste and sauté',
              'Add rice, dal, turmeric, salt, and 3 cups water',
              'Pressure cook for 3 whistles',
              'For raita, mix yogurt with cucumber, salt, and roasted cumin powder'
            ],
            benefits: [
              'Complete protein from rice and dal combination',
              'Easy to digest and light on stomach',
              'Probiotics from yogurt for gut health'
            ]
          };
        } else {
          mealRecommendation = {
            name: 'Chicken Curry with Brown Rice',
            description: 'Protein-rich chicken curry with fiber-rich brown rice',
            calories: 520,
            protein: 35,
            carbs: 55,
            fat: 16,
            ingredients: [
              '150g chicken breast, cubed',
              '1/2 cup brown rice',
              '1 onion, finely chopped',
              '1 tomato, chopped',
              '1 tsp ginger-garlic paste',
              '1/2 tsp turmeric',
              '1 tsp coriander powder',
              '1/2 tsp garam masala',
              'Salt to taste',
              '1 tsp oil'
            ],
            instructions: [
              'Cook brown rice as per instructions',
              'Heat oil in a pan and add chopped onions',
              'Add ginger-garlic paste and sauté',
              'Add chicken pieces and cook until sealed',
              'Add tomatoes, turmeric, coriander powder, and salt',
              'Cook until chicken is tender and gravy thickens',
              'Sprinkle garam masala and serve with brown rice'
            ],
            benefits: [
              'High in lean protein for muscle building',
              'Complex carbs from brown rice for sustained energy',
              'Rich in vitamins and minerals'
            ]
          };
        }
      } else { // dinner
        if (isVegetarian || isVegan) {
          mealRecommendation = {
            name: 'Palak Paneer with Roti',
            description: 'Cottage cheese in spinach gravy with whole wheat flatbread',
            calories: 480,
            protein: 22,
            carbs: 50,
            fat: 20,
            ingredients: [
              '100g paneer (cottage cheese) or tofu for vegan',
              '2 cups spinach, blanched and pureed',
              '1 onion, finely chopped',
              '1 tomato, pureed',
              '1 tsp ginger-garlic paste',
              '1/2 tsp cumin seeds',
              '1/2 tsp garam masala',
              'Salt to taste',
              '1 tsp oil',
              '2 whole wheat rotis'
            ],
            instructions: [
              'Heat oil in a pan and add cumin seeds',
              'Add chopped onions and sauté until golden',
              'Add ginger-garlic paste and sauté',
              'Add tomato puree and cook until oil separates',
              'Add spinach puree, salt, and cook for 5 minutes',
              'Add paneer/tofu cubes and garam masala',
              'Simmer for 2-3 minutes and serve with rotis'
            ],
            benefits: [
              'Iron-rich spinach for blood health',
              'Protein from paneer/tofu for muscle recovery',
              'Whole wheat rotis provide complex carbs and fiber'
            ]
          };
        } else {
          mealRecommendation = {
            name: 'Tandoori Fish with Vegetable Pulao',
            description: 'Spiced fish with fragrant rice and vegetables',
            calories: 490,
            protein: 30,
            carbs: 45,
            fat: 18,
            ingredients: [
              '150g fish fillet (preferably basa or tilapia)',
              '1 tbsp yogurt',
              '1 tsp tandoori masala',
              '1/2 tsp ginger-garlic paste',
              '1/2 cup basmati rice',
              '1/2 cup mixed vegetables (carrots, peas, beans)',
              '1 tsp cumin seeds',
              '1 bay leaf',
              'Salt to taste',
              '1 tsp oil'
            ],
            instructions: [
              'Marinate fish with yogurt, tandoori masala, ginger-garlic paste, and salt',
              'Bake in oven at 180°C for 15 minutes or pan-fry',
              'For pulao, heat oil and add cumin seeds and bay leaf',
              'Add rice and sauté for 2 minutes',
              'Add vegetables, salt, and 1 cup water',
              'Cook until rice is done and serve with tandoori fish'
            ],
            benefits: [
              'Lean protein from fish for muscle recovery',
              'Omega-3 fatty acids for heart health',
              'Vegetables provide essential vitamins and minerals'
            ]
          };
        }
      }
    } else {
      // Non-Indian meal recommendations
      if (mealType === 'breakfast') {
        if (isVegetarian || isVegan) {
          mealRecommendation = {
            name: 'Avocado Toast with Fruit Bowl',
            description: 'Whole grain toast with avocado and a side of fresh fruits',
            calories: 350,
            protein: 10,
            carbs: 45,
            fat: 16,
            ingredients: [
              '2 slices whole grain bread',
              '1/2 avocado, mashed',
              '1 tsp lemon juice',
              'Salt and pepper to taste',
              '1 cup mixed fruits (berries, banana, apple)'
            ],
            instructions: [
              'Toast the bread slices',
              'Mash avocado with lemon juice, salt, and pepper',
              'Spread avocado mixture on toast',
              'Serve with a side of mixed fruits'
            ],
            benefits: [
              'Healthy fats from avocado',
              'Fiber from whole grain bread and fruits',
              'Antioxidants from fresh fruits'
            ]
          };
        } else {
          mealRecommendation = {
            name: 'Greek Yogurt Protein Bowl',
            description: 'Protein-rich breakfast with yogurt, eggs, and nuts',
            calories: 420,
            protein: 28,
            carbs: 30,
            fat: 22,
            ingredients: [
              '1 cup Greek yogurt',
              '2 boiled eggs, sliced',
              '1 tbsp honey',
              '1 tbsp mixed nuts and seeds',
              '1/2 cup berries'
            ],
            instructions: [
              'Place Greek yogurt in a bowl',
              'Top with sliced boiled eggs',
              'Add berries and nuts',
              'Drizzle with honey'
            ],
            benefits: [
              'High in protein for muscle recovery',
              'Probiotics from yogurt for gut health',
              'Healthy fats from nuts and seeds'
            ]
          };
        }
      } else if (mealType === 'lunch') {
        if (isVegetarian || isVegan) {
          mealRecommendation = {
            name: 'Quinoa Vegetable Bowl',
            description: 'Nutrient-dense quinoa with roasted vegetables',
            calories: 420,
            protein: 15,
            carbs: 60,
            fat: 14,
            ingredients: [
              '1 cup cooked quinoa',
              '2 cups mixed vegetables (bell peppers, zucchini, broccoli)',
              '1 tbsp olive oil',
              '1 tsp mixed herbs',
              'Salt and pepper to taste',
              '1/4 avocado, sliced',
              '1 tbsp lemon juice'
            ],
            instructions: [
              'Toss vegetables in olive oil, herbs, salt, and pepper',
              'Roast in oven at 200°C for 20 minutes',
              'Place cooked quinoa in a bowl',
              'Top with roasted vegetables and avocado',
              'Drizzle with lemon juice'
            ],
            benefits: [
              'Complete protein from quinoa',
              'Fiber-rich meal for digestive health',
              'Healthy fats from olive oil and avocado'
            ]
          };
        } else {
          mealRecommendation = {
            name: 'Grilled Chicken Salad',
            description: 'Protein-packed salad with lean chicken and mixed greens',
            calories: 450,
            protein: 35,
            carbs: 25,
            fat: 22,
            ingredients: [
              '150g chicken breast',
              '3 cups mixed greens',
              '1/2 cucumber, sliced',
              '1 tomato, diced',
              '1/4 avocado, sliced',
              '1 tbsp olive oil',
              '1 tbsp balsamic vinegar',
              'Salt and pepper to taste'
            ],
            instructions: [
              'Season chicken with salt and pepper and grill until cooked',
              'Slice grilled chicken',
              'Toss mixed greens with cucumber and tomato',
              'Top with sliced chicken and avocado',
              'Drizzle with olive oil and balsamic vinegar'
            ],
            benefits: [
              'Lean protein from chicken for muscle building',
              'Low in carbs for weight management',
              'Healthy fats from olive oil and avocado'
            ]
          };
        }
      } else { // dinner
        if (isVegetarian || isVegan) {
          mealRecommendation = {
            name: 'Vegetable Stir-Fry with Tofu',
            description: 'Quick and nutritious stir-fry with protein-rich tofu',
            calories: 380,
            protein: 20,
            carbs: 35,
            fat: 18,
            ingredients: [
              '100g firm tofu, cubed',
              '2 cups mixed vegetables (broccoli, carrots, snap peas)',
              '1 tbsp soy sauce',
              '1 tsp sesame oil',
              '1 tsp ginger, minced',
              '1 clove garlic, minced',
              '1/2 cup brown rice, cooked'
            ],
            instructions: [
              'Press tofu to remove excess water and cube it',
              'Heat sesame oil in a pan and add ginger and garlic',
              'Add tofu and cook until golden',
              'Add vegetables and stir-fry for 3-4 minutes',
              'Add soy sauce and toss to combine',
              'Serve over cooked brown rice'
            ],
            benefits: [
              'Plant-based protein from tofu',
              'Fiber-rich vegetables for digestive health',
              'Complex carbs from brown rice for sustained energy'
            ]
          };
        } else {
          mealRecommendation = {
            name: 'Baked Salmon with Roasted Vegetables',
            description: 'Omega-3 rich salmon with colorful roasted vegetables',
            calories: 480,
            protein: 32,
            carbs: 30,
            fat: 24,
            ingredients: [
              '150g salmon fillet',
              '2 cups mixed vegetables (Brussels sprouts, sweet potato, red onion)',
              '1 tbsp olive oil',
              '1 tsp mixed herbs',
              '1 lemon, sliced',
              'Salt and pepper to taste'
            ],
            instructions: [
              'Preheat oven to 200°C',
              'Toss vegetables in olive oil, herbs, salt, and pepper',
              'Place on baking sheet and roast for 15 minutes',
              'Season salmon with salt and pepper',
              'Place salmon on baking sheet with vegetables',
              'Top salmon with lemon slices',
              'Bake for another 12-15 minutes until salmon is cooked'
            ],
            benefits: [
              'Omega-3 fatty acids from salmon for heart and brain health',
              'High-quality protein for muscle recovery',
              'Fiber and antioxidants from colorful vegetables'
            ]
          };
        }
      }
    }
    
    res.json({
      success: true,
      recommendation: mealRecommendation
    });
  } catch (error) {
    console.error('Nutrition recommendation error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Mood-based recommendation endpoint
router.post('/mood-recommendation', authenticateToken, async (req, res) => {
  try {
    const { mood, energy, stress, time, preferences } = req.body;
    
    // In a real implementation, this would generate personalized recommendations
    // For demo purposes, we'll return simulated recommendations
    
    let workoutRecommendation = {};
    let playlistRecommendation = {};
    
    // Determine recommendations based on mood and energy
    if (mood === 'happy' || mood === 'energetic') {
      workoutRecommendation = {
        type: 'HIIT',
        title: 'High-Energy HIIT Session',
        duration: 30,
        intensity: 'high',
        description: 'Channel your positive energy into this high-intensity interval training session to maximize your workout efficiency.'
      };
      
      playlistRecommendation = {
        title: 'Upbeat Bollywood Hits',
        description: 'Fast-paced Bollywood songs to match your energy',
        tracks: [
          'Malhari - Bajirao Mastani',
          'Badtameez Dil - Yeh Jawaani Hai Deewani',
          'Dhoom Machale - Dhoom',
          'Nagada Sang Dhol - Ram-Leela',
          'Balam Pichkari - Yeh Jawaani Hai Deewani'
        ]
      };
    } else if (mood === 'stressed' || mood === 'anxious') {
      workoutRecommendation = {
        type: 'Yoga',
        title: 'Stress-Relief Yoga Flow',
        duration: 25,
        intensity: 'low',
        description: 'This gentle yoga sequence focuses on deep breathing and relaxing poses to help reduce stress and anxiety.'
      };
      
      playlistRecommendation = {
        title: 'Calming Indian Classical',
        description: 'Soothing ragas to calm your mind',
        tracks: [
          'Raag Bhairav - Hariprasad Chaurasia',
          'Raag Yaman - Pandit Ravi Shankar',
          'Raag Darbari - Ustad Amjad Ali Khan',
          'Raag Bhimpalasi - Kishori Amonkar',
          'Raag Malkauns - Pandit Jasraj'
        ]
      };
    } else if (mood === 'tired' || energy === 'low') {
      workoutRecommendation = {
        type: 'Light Cardio',
        title: 'Energizing Light Cardio',
        duration: 20,
        intensity: 'moderate',
        description: 'A moderate-intensity workout designed to boost your energy levels without exhausting you.'
      };
      
      playlistRecommendation = {
        title: 'Motivational Bollywood',
        description: 'Inspiring songs to boost your energy',
        tracks: [
          'Zinda - Bhaag Milkha Bhaag',
          'Kar Har Maidaan Fateh - Sanju',
          'Chak De India - Chak De India',
          'Lakshya - Lakshya',
          'Brothers Anthem - Brothers'
        ]
      };
    } else if (mood === 'focused' || mood === 'determined') {
      workoutRecommendation = {
        type: 'Strength Training',
        title: 'Progressive Strength Workout',
        duration: 45,
        intensity: 'high',
        description: 'A structured strength training session to help you build muscle and improve overall strength.'
      };
      
      playlistRecommendation = {
        title: 'Intense Workout Mix',
        description: 'High-energy tracks to fuel your workout',
        tracks: [
          'Ziddi Dil - Mary Kom',
          'Sultan - Sultan',
          'Get Ready To Fight - Baaghi',
          'Dangal - Dangal',
          'Brothers Anthem - Brothers'
        ]
      };
    } else {
      workoutRecommendation = {
        type: 'Balanced Workout',
        title: 'Full-Body Balanced Workout',
        duration: 35,
        intensity: 'moderate',
        description: 'A well-rounded workout that combines strength, cardio, and flexibility training.'
      };
      
      playlistRecommendation = {
        title: 'Mixed Bollywood Workout',
        description: 'Varied tempo songs for a balanced workout',
        tracks: [
          'Senorita - Zindagi Na Milegi Dobara',
          'Ghungroo - War',
          'Desi Girl - Dostana',
          'Nashe Si Chadh Gayi - Befikre',
          'London Thumakda - Queen'
        ]
      };
    }
    
    res.json({
      success: true,
      recommendations: {
        workout: workoutRecommendation,
        playlist: playlistRecommendation,
        message: `Based on your current mood (${mood}) and energy level, we've customized these recommendations to help you feel your best.`
      }
    });
  } catch (error) {
    console.error('Mood recommendation error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;