import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, User, Eye, EyeOff, AlertCircle, ArrowRight, Facebook } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

const Signup = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fitnessGoals, setFitnessGoals] = useState<string[]>([]);
  const [fitnessLevel, setFitnessLevel] = useState('beginner');
  
  const { signup, googleSignIn, facebookSignIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    
    try {
      setError('');
      setLoading(true);
      const user = await signup(email, password, name);
      
      // Navigate to onboarding or dashboard
      navigate('/onboarding');
    } catch (err: any) {
      setError(err.message || 'Failed to create an account');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      await googleSignIn();
      navigate('/onboarding');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      await facebookSignIn();
      navigate('/onboarding');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Facebook');
    } finally {
      setLoading(false);
    }
  };

  const handleGoalToggle = (goal: string) => {
    if (fitnessGoals.includes(goal)) {
      setFitnessGoals(fitnessGoals.filter(g => g !== goal));
    } else {
      setFitnessGoals([...fitnessGoals, goal]);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold font-orbitron mb-2">
              <span className="text-white">GET </span>
              <span className="text-glow-green">LOCKED IN</span>
            </h1>
            <p className="text-gray-400">Create your account to start your fitness journey</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-glow-red/10 border border-glow-red/30 rounded-md flex items-center gap-3">
              <AlertCircle size={20} className="text-glow-red" />
              <p className="text-white text-sm">{error}</p>
            </div>
          )}

          <div className="glass-card p-6 mb-6">
            {step === 1 && (
              <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={18} className="text-gray-500" />
                    </div>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="bg-black/50 border border-white/10 text-white rounded-md block w-full pl-10 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-glow-green focus:border-glow-green"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={18} className="text-gray-500" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-black/50 border border-white/10 text-white rounded-md block w-full pl-10 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-glow-green focus:border-glow-green"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className="text-gray-500" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-black/50 border border-white/10 text-white rounded-md block w-full pl-10 pr-10 py-2 focus:outline-none focus:ring-1 focus:ring-glow-green focus:border-glow-green"
                      placeholder="••••••••"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-500 hover:text-white focus:outline-none"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className="text-gray-500" />
                    </div>
                    <input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="bg-black/50 border border-white/10 text-white rounded-md block w-full pl-10 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-glow-green focus:border-glow-green"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-glow w-full flex items-center justify-center gap-2"
                >
                  Continue
                  <ArrowRight size={16} />
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">What are your fitness goals?</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {['Lose Weight', 'Build Muscle', 'Improve Endurance', 'Increase Strength', 'Better Flexibility', 'Overall Health'].map((goal) => (
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

                <div>
                  <h3 className="text-lg font-medium mb-3">What's your fitness level?</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setFitnessLevel(level.toLowerCase())}
                        className={`p-3 rounded-md text-sm text-center transition-all ${
                          fitnessLevel === level.toLowerCase()
                            ? 'bg-glow-green/20 border border-glow-green/50 text-white'
                            : 'bg-black/50 border border-white/10 text-gray-300 hover:border-white/30'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-2 px-4 border border-white/10 rounded-md hover:bg-white/5 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 btn-glow"
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-black text-gray-400">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="flex items-center justify-center gap-2 py-2 px-4 border border-white/10 rounded-md hover:bg-white/5 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
                <path fill="none" d="M1 1h22v22H1z" />
              </svg>
              Google
            </button>
            <button
              onClick={handleFacebookSignIn}
              disabled={loading}
              className="flex items-center justify-center gap-2 py-2 px-4 border border-white/10 rounded-md hover:bg-white/5 transition-colors"
            >
              <Facebook size={20} className="text-blue-500" />
              Facebook
            </button>
          </div>

          <p className="text-center text-gray-400 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-glow-green hover:text-glow-green/80">
              Log in
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Signup;