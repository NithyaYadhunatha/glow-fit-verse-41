import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, ArrowLeft, Dumbbell, Ruler, Scale, Calendar, 
  User, Heart, Clock, Award, Target
} from 'lucide-react';
import { userService } from '../lib/firebase';
import { useAuth } from '../lib/AuthContext';

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // User profile data
  const [gender, setGender] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [fitnessLevel, setFitnessLevel] = useState('beginner');
  const [fitnessGoals, setFitnessGoals] = useState<string[]>([]);
  const [workoutDays, setWorkoutDays] = useState<string[]>([]);
  const [workoutDuration, setWorkoutDuration] = useState('30');
  const [preferredWorkouts, setPreferredWorkouts] = useState<string[]>([]);
  
  const handleGoalToggle = (goal: string) => {
    if (fitnessGoals.includes(goal)) {
      setFitnessGoals(fitnessGoals.filter(g => g !== goal));
    } else {
      setFitnessGoals([...fitnessGoals, goal]);
    }
  };
  
  const handleDayToggle = (day: string) => {
    if (workoutDays.includes(day)) {
      setWorkoutDays(workoutDays.filter(d => d !== day));
    } else {
      setWorkoutDays([...workoutDays, day]);
    }
  };
  
  const handleWorkoutToggle = (workout: string) => {
    if (preferredWorkouts.includes(workout)) {
      setPreferredWorkouts(preferredWorkouts.filter(w => w !== workout));
    } else {
      setPreferredWorkouts([...preferredWorkouts, workout]);
    }
  };
  
  const handleNext = () => {
    setStep(step + 1);
  };
  
  const handleBack = () => {
    setStep(step - 1);
  };
  
  const handleComplete = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      
      // Save user profile data to API
      await userService.updateProfile({
        gender,
        birthdate,
        height: parseFloat(height),
        weight: parseFloat(weight),
        fitnessLevel,
        fitnessGoals,
        workoutDays,
        workoutDuration: parseInt(workoutDuration),
        preferredWorkouts,
        onboardingCompleted: true
      });
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <header className="border-b border-glow-green/20 py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-glow-green/20 flex items-center justify-center border border-glow-green/50">
                <span className="text-glow-green font-bold">LI</span>
              </div>
              <span className="text-xl font-bold font-orbitron">LOCKED<span className="text-glow-green">IN</span></span>
            </div>
            <div className="text-sm text-gray-400">
              Step {step} of 5
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <div className="w-full bg-gray-700/30 h-2 rounded-full">
            <div 
              className="bg-glow-green h-2 rounded-full transition-all duration-500" 
              style={{ width: `${(step / 5) * 100}%` }}
            ></div>
          </div>
        </div>
        
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center">
              <h1 className="text-3xl font-bold font-orbitron mb-2">
                <span className="text-white">TELL US ABOUT </span>
                <span className="text-glow-green">YOURSELF</span>
              </h1>
              <p className="text-gray-400">
                We'll use this information to personalize your experience
              </p>
            </div>
            
            <div className="glass-card p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <User size={16} className="inline-block mr-2 text-glow-green" />
                  Gender
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['Male', 'Female', 'Other'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setGender(option.toLowerCase())}
                      className={`p-3 rounded-md text-sm text-center transition-all ${
                        gender === option.toLowerCase()
                          ? 'bg-glow-green/20 border border-glow-green/50 text-white'
                          : 'bg-black/50 border border-white/10 text-gray-300 hover:border-white/30'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="birthdate" className="block text-sm font-medium text-gray-300 mb-2">
                  <Calendar size={16} className="inline-block mr-2 text-glow-green" />
                  Date of Birth
                </label>
                <input
                  id="birthdate"
                  type="date"
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                  className="bg-black/50 border border-white/10 text-white rounded-md block w-full px-3 py-2 focus:outline-none focus:ring-1 focus:ring-glow-green focus:border-glow-green"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="height" className="block text-sm font-medium text-gray-300 mb-2">
                    <Ruler size={16} className="inline-block mr-2 text-glow-green" />
                    Height (cm)
                  </label>
                  <input
                    id="height"
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="bg-black/50 border border-white/10 text-white rounded-md block w-full px-3 py-2 focus:outline-none focus:ring-1 focus:ring-glow-green focus:border-glow-green"
                    placeholder="175"
                  />
                </div>
                <div>
                  <label htmlFor="weight" className="block text-sm font-medium text-gray-300 mb-2">
                    <Scale size={16} className="inline-block mr-2 text-glow-green" />
                    Weight (kg)
                  </label>
                  <input
                    id="weight"
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="bg-black/50 border border-white/10 text-white rounded-md block w-full px-3 py-2 focus:outline-none focus:ring-1 focus:ring-glow-green focus:border-glow-green"
                    placeholder="70"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={handleNext}
                className="btn-glow px-6 py-2 flex items-center gap-2"
              >
                Next
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
        
        {/* Step 2: Fitness Level */}
        {step === 2 && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center">
              <h1 className="text-3xl font-bold font-orbitron mb-2">
                <span className="text-white">YOUR FITNESS </span>
                <span className="text-glow-green">LEVEL</span>
              </h1>
              <p className="text-gray-400">
                Help us understand where you're starting from
              </p>
            </div>
            
            <div className="glass-card p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-4">
                    <Heart size={16} className="inline-block mr-2 text-glow-green" />
                    How would you describe your current fitness level?
                  </label>
                  <div className="grid grid-cols-1 gap-4">
                    <button
                      type="button"
                      onClick={() => setFitnessLevel('beginner')}
                      className={`p-4 rounded-md text-left transition-all ${
                        fitnessLevel === 'beginner'
                          ? 'bg-glow-green/20 border border-glow-green/50 text-white'
                          : 'bg-black/50 border border-white/10 text-gray-300 hover:border-white/30'
                      }`}
                    >
                      <div className="font-medium mb-1">Beginner</div>
                      <div className="text-sm text-gray-400">New to fitness or returning after a long break</div>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setFitnessLevel('intermediate')}
                      className={`p-4 rounded-md text-left transition-all ${
                        fitnessLevel === 'intermediate'
                          ? 'bg-glow-green/20 border border-glow-green/50 text-white'
                          : 'bg-black/50 border border-white/10 text-gray-300 hover:border-white/30'
                      }`}
                    >
                      <div className="font-medium mb-1">Intermediate</div>
                      <div className="text-sm text-gray-400">Exercising regularly for several months</div>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setFitnessLevel('advanced')}
                      className={`p-4 rounded-md text-left transition-all ${
                        fitnessLevel === 'advanced'
                          ? 'bg-glow-green/20 border border-glow-green/50 text-white'
                          : 'bg-black/50 border border-white/10 text-gray-300 hover:border-white/30'
                      }`}
                    >
                      <div className="font-medium mb-1">Advanced</div>
                      <div className="text-sm text-gray-400">Consistently training for a year or more</div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={handleBack}
                className="px-6 py-2 border border-white/10 rounded-md hover:bg-white/5 transition-colors flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                Back
              </button>
              <button
                onClick={handleNext}
                className="btn-glow px-6 py-2 flex items-center gap-2"
              >
                Next
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
        
        {/* Step 3: Fitness Goals */}
        {step === 3 && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center">
              <h1 className="text-3xl font-bold font-orbitron mb-2">
                <span className="text-white">YOUR FITNESS </span>
                <span className="text-glow-green">GOALS</span>
              </h1>
              <p className="text-gray-400">
                Select all that apply to you
              </p>
            </div>
            
            <div className="glass-card p-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-4">
                  <Target size={16} className="inline-block mr-2 text-glow-green" />
                  What are you looking to achieve?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    'Lose Weight', 
                    'Build Muscle', 
                    'Improve Endurance', 
                    'Increase Strength', 
                    'Better Flexibility', 
                    'Reduce Stress',
                    'Improve Sleep',
                    'Overall Health'
                  ].map((goal) => (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => handleGoalToggle(goal)}
                      className={`p-3 rounded-md text-sm text-left transition-all ${
                        fitnessGoals.includes(goal)
                          ? 'bg-glow-green/20 border border-glow-green/50 text-white'
                          : 'bg-black/50 border border-white/10 text-gray-300 hover:border-white/30'
                      }`}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={handleBack}
                className="px-6 py-2 border border-white/10 rounded-md hover:bg-white/5 transition-colors flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                Back
              </button>
              <button
                onClick={handleNext}
                className="btn-glow px-6 py-2 flex items-center gap-2"
              >
                Next
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
        
        {/* Step 4: Workout Schedule */}
        {step === 4 && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center">
              <h1 className="text-3xl font-bold font-orbitron mb-2">
                <span className="text-white">YOUR WORKOUT </span>
                <span className="text-glow-green">SCHEDULE</span>
              </h1>
              <p className="text-gray-400">
                Tell us when you prefer to work out
              </p>
            </div>
            
            <div className="glass-card p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-4">
                  <Calendar size={16} className="inline-block mr-2 text-glow-green" />
                  Which days do you plan to work out?
                </label>
                <div className="grid grid-cols-7 gap-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleDayToggle(day)}
                      className={`p-3 rounded-md text-sm text-center transition-all ${
                        workoutDays.includes(day)
                          ? 'bg-glow-green/20 border border-glow-green/50 text-white'
                          : 'bg-black/50 border border-white/10 text-gray-300 hover:border-white/30'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-4">
                  <Clock size={16} className="inline-block mr-2 text-glow-green" />
                  How long do you want your workouts to be?
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['15', '30', '45', '60', '75', '90'].map((duration) => (
                    <button
                      key={duration}
                      type="button"
                      onClick={() => setWorkoutDuration(duration)}
                      className={`p-3 rounded-md text-sm text-center transition-all ${
                        workoutDuration === duration
                          ? 'bg-glow-green/20 border border-glow-green/50 text-white'
                          : 'bg-black/50 border border-white/10 text-gray-300 hover:border-white/30'
                      }`}
                    >
                      {duration} min
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={handleBack}
                className="px-6 py-2 border border-white/10 rounded-md hover:bg-white/5 transition-colors flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                Back
              </button>
              <button
                onClick={handleNext}
                className="btn-glow px-6 py-2 flex items-center gap-2"
              >
                Next
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
        
        {/* Step 5: Workout Preferences */}
        {step === 5 && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center">
              <h1 className="text-3xl font-bold font-orbitron mb-2">
                <span className="text-white">WORKOUT </span>
                <span className="text-glow-green">PREFERENCES</span>
              </h1>
              <p className="text-gray-400">
                Select the types of workouts you enjoy
              </p>
            </div>
            
            <div className="glass-card p-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-4">
                  <Dumbbell size={16} className="inline-block mr-2 text-glow-green" />
                  What types of workouts do you prefer?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    'HIIT', 
                    'Strength Training', 
                    'Cardio', 
                    'Yoga', 
                    'Pilates', 
                    'Cycling',
                    'Running',
                    'Bodyweight',
                    'CrossFit',
                    'Boxing'
                  ].map((workout) => (
                    <button
                      key={workout}
                      type="button"
                      onClick={() => handleWorkoutToggle(workout)}
                      className={`p-3 rounded-md text-sm text-left transition-all ${
                        preferredWorkouts.includes(workout)
                          ? 'bg-glow-green/20 border border-glow-green/50 text-white'
                          : 'bg-black/50 border border-white/10 text-gray-300 hover:border-white/30'
                      }`}
                    >
                      {workout}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={handleBack}
                className="px-6 py-2 border border-white/10 rounded-md hover:bg-white/5 transition-colors flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                Back
              </button>
              <button
                onClick={handleComplete}
                disabled={loading}
                className="btn-glow px-6 py-2 flex items-center gap-2"
              >
                {loading ? 'Saving...' : 'Complete Setup'}
                <Award size={16} />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Onboarding;