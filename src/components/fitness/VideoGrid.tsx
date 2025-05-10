
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Clock, Flame, Trophy, Dumbbell, ArrowRight } from 'lucide-react';

// Types
type VideoProps = {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  calories: number;
  intensity: 'easy' | 'medium' | 'hard';
  equipment: 'none' | 'minimal' | 'full';
  category: string;
  aiRecommended?: boolean;
  slug?: string;
};

type VideoGridProps = {
  activeCategory: string;
  filters: {
    time: string;
    intensity: string;
    equipment: string;
  };
};

export const VideoGrid = ({ activeCategory, filters }: VideoGridProps) => {
  // Sample video data
  const [videos] = useState<VideoProps[]>([
    {
      id: 'v1',
      title: 'HIIT Cardio Blast',
      thumbnail: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1050&q=80',
      duration: '30:00',
      calories: 350,
      intensity: 'medium',
      equipment: 'none',
      category: 'cardio',
      aiRecommended: true,
      slug: 'hiit-cardio-blast'
    },
    {
      id: 'v2',
      title: 'Strength Training for Beginners',
      thumbnail: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      duration: '15:30',
      calories: 220,
      intensity: 'medium',
      equipment: 'minimal',
      category: 'strength',
      slug: 'strength-training-beginners'
    },
    {
      id: 'v3',
      title: 'Dynamic Stretching Routine',
      thumbnail: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      duration: '12:15',
      calories: 120,
      intensity: 'easy',
      equipment: 'none',
      category: 'mobility',
      aiRecommended: true,
      slug: 'dynamic-stretching'
    },
    {
      id: 'v4',
      title: 'Advanced Kettlebell Workout',
      thumbnail: 'https://images.unsplash.com/photo-1517344884509-240c41fa58a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      duration: '35:10',
      calories: 450,
      intensity: 'hard',
      equipment: 'minimal',
      category: 'strength',
      slug: 'advanced-kettlebell'
    },
    {
      id: 'v5',
      title: 'Recovery Yoga for Athletes',
      thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      duration: '18:20',
      calories: 150,
      intensity: 'easy',
      equipment: 'none',
      category: 'recovery',
      slug: 'recovery-yoga'
    },
    {
      id: 'v6',
      title: 'Basketball Skills Training',
      thumbnail: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      duration: '25:45',
      calories: 280,
      intensity: 'medium',
      equipment: 'minimal',
      category: 'sport',
      slug: 'basketball-skills'
    },
  ]);

  // Filter videos based on selected category and filters
  const filteredVideos = videos.filter(video => {
    // Category filter
    if (activeCategory !== 'all' && video.category !== activeCategory) {
      return false;
    }

    // Time filter
    if (filters.time !== 'all') {
      const duration = parseInt(video.duration.split(':')[0]);
      if (filters.time === 'short' && duration >= 15) return false;
      if (filters.time === 'medium' && (duration < 15 || duration > 30)) return false;
      if (filters.time === 'long' && duration <= 30) return false;
    }

    // Intensity filter
    if (filters.intensity !== 'all' && video.intensity !== filters.intensity) {
      return false;
    }

    // Equipment filter
    if (filters.equipment !== 'all' && video.equipment !== filters.equipment) {
      return false;
    }

    return true;
  });

  // Function to render difficulty indicator
  const renderDifficulty = (intensity: 'easy' | 'medium' | 'hard') => {
    const colors = {
      easy: 'bg-green-500',
      medium: 'bg-yellow-500',
      hard: 'bg-glow-red',
    };

    return (
      <div className="flex items-center gap-1">
        <div className={`w-2 h-2 rounded-full ${colors[intensity]}`}></div>
        <span className="text-xs capitalize">{intensity}</span>
      </div>
    );
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold glow-text">Available Workouts</h2>
          <div className="text-gray-400">
            {filteredVideos.length} workouts found
          </div>
        </div>

        {filteredVideos.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-400">No workouts match your filters</p>
            <button className="mt-4 btn-glow">Reset Filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <div 
                key={video.id} 
                className="glass-card overflow-hidden group hover:border-glow-green/50 hover:shadow-glow-green/20 transition-all duration-300"
              >
                <Link to={`/fitness/${video.slug}`} className="block">
                  <div className="relative">
                    {/* Thumbnail */}
                    <img 
                      src={video.thumbnail} 
                      alt={video.title} 
                      className="w-full h-48 object-cover"
                    />
                    
                    {/* Play button overlay */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-16 h-16 bg-black/70 rounded-full flex items-center justify-center border-2 border-glow-red hover:border-glow-green hover:scale-110 transition-all duration-300">
                        <Play size={28} className="text-white ml-1" />
                      </div>
                    </div>
                    
                    {/* Duration */}
                    <div className="absolute bottom-3 right-3 bg-black/60 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                      <Clock size={12} />
                      {video.duration}
                    </div>
                    
                    {/* AI Recommended badge */}
                    {video.aiRecommended && (
                      <div className="absolute top-3 left-3 bg-glow-green/90 text-black px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                        <Trophy size={12} />
                        AI Pick
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{video.title}</h3>
                    
                    <div className="flex justify-between items-center text-sm text-gray-300 mb-3">
                      <div className="flex items-center gap-1">
                        <Flame size={14} className="text-glow-red" />
                        <span>{video.calories} cal</span>
                      </div>
                      
                      {renderDifficulty(video.intensity)}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Dumbbell size={12} />
                        <span className="capitalize">{video.equipment} equipment</span>
                      </div>
                      
                      <div className="text-glow-green text-xs flex items-center">
                        View Details
                        <ArrowRight size={12} className="ml-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
        
        {/* Featured Workout with Form Correction */}
        <div className="mt-16 mb-8">
          <h2 className="text-2xl font-bold glow-text mb-6">Featured Workout with AI Form Correction</h2>
          
          <div className="glass-card p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="relative rounded-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1549060279-7e168fcee0c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1050&q=80" 
                  alt="HIIT Cardio Blast" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-glow-green/90 text-black px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                      <Trophy size={12} />
                      Featured
                    </div>
                    <div className="bg-black/60 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                      <Clock size={12} />
                      30:00
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white">HIIT Cardio Blast</h3>
                  <p className="text-gray-300 text-sm mb-4">A high-intensity interval training workout designed to boost your cardiovascular fitness and burn calories.</p>
                  <Link to="/fitness/hiit-cardio-blast" className="btn-glow inline-flex items-center gap-2">
                    Try with Form Correction
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
              
              <div className="flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-4">AI-Powered Form Correction</h3>
                  <p className="text-gray-300 mb-6">
                    Experience real-time feedback on your exercise form using our advanced AI technology. 
                    This feature helps you perform exercises correctly, maximize results, and prevent injuries.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-black/50 border border-white/10 rounded-md p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 rounded-full bg-glow-green/20 flex items-center justify-center">
                          <Flame size={16} className="text-glow-green" />
                        </div>
                        <span className="font-medium">350 cal</span>
                      </div>
                      <p className="text-xs text-gray-400">Average calories burned</p>
                    </div>
                    
                    <div className="bg-black/50 border border-white/10 rounded-md p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 rounded-full bg-glow-green/20 flex items-center justify-center">
                          <Dumbbell size={16} className="text-glow-green" />
                        </div>
                        <span className="font-medium">No Equipment</span>
                      </div>
                      <p className="text-xs text-gray-400">Just bring yourself</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-glow-green/5 border border-glow-green/30 rounded-md p-4">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Trophy size={16} className="text-glow-green" />
                    Why Try Form Correction?
                  </h4>
                  <ul className="text-sm text-gray-300 space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-glow-green/20 flex items-center justify-center mt-0.5">
                        <Check size={12} className="text-glow-green" />
                      </div>
                      <span>Get real-time feedback on your form</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-glow-green/20 flex items-center justify-center mt-0.5">
                        <Check size={12} className="text-glow-green" />
                      </div>
                      <span>Prevent injuries from improper technique</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-glow-green/20 flex items-center justify-center mt-0.5">
                        <Check size={12} className="text-glow-green" />
                      </div>
                      <span>Maximize your workout effectiveness</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
