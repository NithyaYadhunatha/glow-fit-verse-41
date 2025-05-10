import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { AiAssistant } from '../components/ui/AiAssistant';
import { PoseDetection } from '../components/fitness/PoseDetection';
import { 
  Clock, Dumbbell, Flame, Award, Heart, ChevronDown, ChevronUp, 
  Play, Pause, SkipForward, RotateCcw, CheckCircle, Share2
} from 'lucide-react';

// Mock workout data
const workoutData = {
  'hiit-cardio-blast': {
    title: 'HIIT Cardio Blast',
    level: 'Intermediate',
    duration: '30 min',
    calories: 350,
    category: 'Cardio',
    rating: 4.8,
    equipment: ['None', 'Optional: Mat'],
    description: 'A high-intensity interval training workout designed to boost your cardiovascular fitness and burn calories. This workout alternates between intense bursts of activity and fixed periods of less-intense activity or rest.',
    image: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1050&q=80',
    exercises: [
      {
        name: 'Warm-up',
        duration: '3 min',
        description: 'Light jogging in place, arm circles, and dynamic stretches to prepare your body for the workout.'
      },
      {
        name: 'Jumping Jacks',
        duration: '45 sec',
        rest: '15 sec',
        description: 'Stand with your feet together and arms at your sides, then jump to a position with legs spread and arms overhead. Return to starting position and repeat.',
        formTips: ['Keep your core engaged', 'Land softly on your feet', 'Maintain a steady rhythm']
      },
      {
        name: 'Mountain Climbers',
        duration: '45 sec',
        rest: '15 sec',
        description: 'Start in a plank position. Alternate bringing each knee toward your chest in a running motion.',
        formTips: ['Keep your hips down', 'Engage your core', 'Maintain a steady pace']
      },
      {
        name: 'Burpees',
        duration: '45 sec',
        rest: '15 sec',
        description: 'Begin in a standing position, drop into a squat position with hands on the ground, kick feet back into a plank, return to squat, and jump up from squat position.',
        formTips: ['Keep your back flat during the plank', 'Jump with power', 'Land softly']
      },
      {
        name: 'High Knees',
        duration: '45 sec',
        rest: '15 sec',
        description: 'Run in place, bringing your knees up to hip level with each step.',
        formTips: ['Stay on the balls of your feet', 'Pump your arms', 'Keep your chest up']
      },
      {
        name: 'Squat Jumps',
        duration: '45 sec',
        rest: '15 sec',
        description: 'Perform a regular squat, then explode upward into a jump. Land softly and immediately lower into the next squat.',
        formTips: ['Keep weight in your heels', 'Knees in line with toes', 'Land softly']
      },
      {
        name: 'Plank',
        duration: '45 sec',
        rest: '15 sec',
        description: 'Hold a push-up position with your body in a straight line from head to heels.',
        formTips: ['Keep your back flat', 'Engage your core', 'Don\'t let your hips sag']
      },
      {
        name: 'Lateral Shuffles',
        duration: '45 sec',
        rest: '15 sec',
        description: 'Start in a slight squat position, then shuffle quickly to one side for several steps, then shuffle back to the other side.',
        formTips: ['Stay low in your squat', 'Keep your chest up', 'Move quickly but controlled']
      },
      {
        name: 'Cool Down',
        duration: '3 min',
        description: 'Light stretching to reduce heart rate and prevent muscle stiffness.'
      }
    ]
  }
};

const WorkoutDetail = () => {
  const { workoutId } = useParams<{ workoutId: string }>();
  const workout = workoutData[workoutId as keyof typeof workoutData];
  
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showFormCorrection, setShowFormCorrection] = useState(false);
  const [expandedExercises, setExpandedExercises] = useState<number[]>([]);
  
  const toggleExerciseExpand = (index: number) => {
    if (expandedExercises.includes(index)) {
      setExpandedExercises(expandedExercises.filter(i => i !== index));
    } else {
      setExpandedExercises([...expandedExercises, index]);
    }
  };
  
  const startWorkout = () => {
    setIsPlaying(true);
    setCurrentExerciseIndex(0);
    // In a real implementation, you would start a timer here
  };
  
  const pauseWorkout = () => {
    setIsPlaying(false);
    // In a real implementation, you would pause the timer here
  };
  
  const nextExercise = () => {
    if (currentExerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    }
  };
  
  const resetWorkout = () => {
    setIsPlaying(false);
    setCurrentExerciseIndex(0);
  };
  
  const toggleFormCorrection = () => {
    setShowFormCorrection(!showFormCorrection);
  };
  
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <main className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h1 className="text-3xl font-bold font-orbitron mb-2">{workout.title}</h1>
              <div className="flex flex-wrap gap-3 mb-4">
                <div className="bg-glow-green/10 text-white py-1 px-3 rounded-full text-xs border border-glow-green/30 flex items-center">
                  <Clock size={14} className="mr-1" /> {workout.duration}
                </div>
                <div className="bg-glow-green/10 text-white py-1 px-3 rounded-full text-xs border border-glow-green/30 flex items-center">
                  <Dumbbell size={14} className="mr-1" /> {workout.level}
                </div>
                <div className="bg-glow-green/10 text-white py-1 px-3 rounded-full text-xs border border-glow-green/30 flex items-center">
                  <Flame size={14} className="mr-1" /> {workout.calories} cal
                </div>
                <div className="bg-glow-green/10 text-white py-1 px-3 rounded-full text-xs border border-glow-green/30 flex items-center">
                  <Award size={14} className="mr-1" /> {workout.category}
                </div>
                <div className="bg-glow-green/10 text-white py-1 px-3 rounded-full text-xs border border-glow-green/30 flex items-center">
                  <Heart size={14} className="mr-1" /> {workout.rating}/5
                </div>
              </div>
              <p className="text-gray-300 mb-4">{workout.description}</p>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-400 mb-1">Equipment Needed:</h3>
                <div className="flex flex-wrap gap-2">
                  {workout.equipment.map((item, index) => (
                    <span key={index} className="bg-black/50 text-white py-1 px-3 rounded-full text-xs border border-white/10">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Workout Player */}
            <div className="glass-card p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Workout Player</h2>
                <div className="flex gap-2">
                  <button 
                    onClick={toggleFormCorrection}
                    className={`px-3 py-1 rounded-md text-sm ${
                      showFormCorrection 
                        ? 'bg-glow-green/20 text-glow-green border border-glow-green/50' 
                        : 'bg-black/50 text-gray-300 border border-white/10'
                    }`}
                  >
                    Form Correction
                  </button>
                  <button className="bg-black/50 text-gray-300 border border-white/10 px-3 py-1 rounded-md text-sm flex items-center gap-1">
                    <Share2 size={14} />
                    Share
                  </button>
                </div>
              </div>
              
              {showFormCorrection ? (
                <PoseDetection />
              ) : (
                <div className="aspect-video relative overflow-hidden rounded-lg mb-4 bg-black/50">
                  <img 
                    src={workout.image} 
                    alt={workout.title} 
                    className="w-full h-full object-cover opacity-70"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <h3 className="text-xl font-bold mb-2">Ready to start your workout?</h3>
                      <button 
                        onClick={startWorkout}
                        className="btn-glow px-6 py-2 flex items-center gap-2 mx-auto"
                      >
                        <Play size={16} />
                        Start Workout
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Workout Controls */}
              <div className="flex justify-between items-center mb-4">
                <div className="text-lg font-bold">
                  {isPlaying ? workout.exercises[currentExerciseIndex].name : 'Press Play to Start'}
                </div>
                <div className="text-lg font-bold">
                  {isPlaying ? `${timeRemaining}s` : workout.duration}
                </div>
              </div>
              
              <div className="flex justify-center gap-4 mb-4">
                <button 
                  onClick={resetWorkout}
                  className="p-3 rounded-full bg-black/50 border border-white/10 text-white hover:bg-white/10 transition-colors"
                >
                  <RotateCcw size={20} />
                </button>
                <button 
                  onClick={isPlaying ? pauseWorkout : startWorkout}
                  className="p-4 rounded-full bg-glow-green/20 border border-glow-green/50 text-white hover:bg-glow-green/30 transition-colors"
                >
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>
                <button 
                  onClick={nextExercise}
                  className="p-3 rounded-full bg-black/50 border border-white/10 text-white hover:bg-white/10 transition-colors"
                >
                  <SkipForward size={20} />
                </button>
              </div>
              
              <div className="w-full bg-gray-700/30 h-2 rounded-full">
                <div 
                  className="bg-glow-green h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${(currentExerciseIndex / workout.exercises.length) * 100}%` }}
                ></div>
              </div>
            </div>
            
            {/* Exercise List */}
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold mb-4">Workout Plan</h2>
              <div className="space-y-3">
                {workout.exercises.map((exercise, index) => (
                  <div 
                    key={index}
                    className={`border border-white/10 rounded-md overflow-hidden transition-all ${
                      currentExerciseIndex === index && isPlaying ? 'border-glow-green/50 bg-glow-green/5' : ''
                    }`}
                  >
                    <div 
                      className="flex justify-between items-center p-4 cursor-pointer"
                      onClick={() => toggleExerciseExpand(index)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          currentExerciseIndex > index ? 'bg-glow-green/20 text-glow-green' : 'bg-black/50 text-white'
                        }`}>
                          {currentExerciseIndex > index ? (
                            <CheckCircle size={16} />
                          ) : (
                            <span>{index + 1}</span>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">{exercise.name}</h3>
                          <p className="text-sm text-gray-400">
                            {exercise.duration}
                            {exercise.rest && ` • ${exercise.rest} rest`}
                          </p>
                        </div>
                      </div>
                      <button className="text-gray-400">
                        {expandedExercises.includes(index) ? (
                          <ChevronUp size={20} />
                        ) : (
                          <ChevronDown size={20} />
                        )}
                      </button>
                    </div>
                    
                    {expandedExercises.includes(index) && (
                      <div className="p-4 pt-0 border-t border-white/10">
                        <p className="text-gray-300 mb-3">{exercise.description}</p>
                        {exercise.formTips && (
                          <div>
                            <h4 className="text-sm font-medium text-glow-green mb-2">Form Tips:</h4>
                            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                              {exercise.formTips.map((tip, tipIndex) => (
                                <li key={tipIndex}>{tip}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Similar Workouts</h2>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-20 h-20 rounded-md overflow-hidden bg-black/50">
                    <img 
                      src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" 
                      alt="Workout" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">Tabata Burn</h3>
                    <p className="text-sm text-gray-400">20 min • High Intensity</p>
                    <div className="flex items-center mt-1">
                      <Heart size={12} className="text-glow-green mr-1" />
                      <span className="text-xs text-gray-400">4.7/5</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="w-20 h-20 rounded-md overflow-hidden bg-black/50">
                    <img 
                      src="https://images.unsplash.com/photo-1599058917765-a780eda07a3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" 
                      alt="Workout" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">Cardio Kickboxing</h3>
                    <p className="text-sm text-gray-400">35 min • Intermediate</p>
                    <div className="flex items-center mt-1">
                      <Heart size={12} className="text-glow-green mr-1" />
                      <span className="text-xs text-gray-400">4.5/5</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="w-20 h-20 rounded-md overflow-hidden bg-black/50">
                    <img 
                      src="https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" 
                      alt="Workout" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">Full Body HIIT</h3>
                    <p className="text-sm text-gray-400">25 min • All Levels</p>
                    <div className="flex items-center mt-1">
                      <Heart size={12} className="text-glow-green mr-1" />
                      <span className="text-xs text-gray-400">4.9/5</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold mb-4">Workout Stats</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm text-gray-400">Completion Rate</p>
                    <p className="text-sm font-medium">87%</p>
                  </div>
                  <div className="w-full bg-gray-700/30 h-2 rounded-full">
                    <div className="bg-glow-green h-2 rounded-full" style={{ width: '87%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm text-gray-400">Avg. Calories Burned</p>
                    <p className="text-sm font-medium">320-380</p>
                  </div>
                  <div className="w-full bg-gray-700/30 h-2 rounded-full">
                    <div className="bg-glow-green h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm text-gray-400">Difficulty Rating</p>
                    <p className="text-sm font-medium">★★★☆☆</p>
                  </div>
                  <div className="w-full bg-gray-700/30 h-2 rounded-full">
                    <div className="bg-glow-green h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                
                <div className="pt-2">
                  <h3 className="text-sm font-medium mb-2">Top Muscles Targeted</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-black/50 border border-white/10 rounded-md p-2 text-center">
                      <p className="text-xs text-gray-400">Quads</p>
                      <p className="text-sm font-medium">Primary</p>
                    </div>
                    <div className="bg-black/50 border border-white/10 rounded-md p-2 text-center">
                      <p className="text-xs text-gray-400">Core</p>
                      <p className="text-sm font-medium">Primary</p>
                    </div>
                    <div className="bg-black/50 border border-white/10 rounded-md p-2 text-center">
                      <p className="text-xs text-gray-400">Shoulders</p>
                      <p className="text-sm font-medium">Secondary</p>
                    </div>
                    <div className="bg-black/50 border border-white/10 rounded-md p-2 text-center">
                      <p className="text-xs text-gray-400">Glutes</p>
                      <p className="text-sm font-medium">Secondary</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      <AiAssistant />
    </div>
  );
};

export default WorkoutDetail;