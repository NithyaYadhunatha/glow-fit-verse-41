
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Lock, User, LogOut, Settings, Award, ChevronDown } from "lucide-react";
import { ThemeToggle } from '../ui/ThemeToggle';
import { useAuth } from '../../lib/AuthContext';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Fitness', path: '/fitness' },
    { name: 'Nutrition', path: '/nutrition' },
    { name: 'Events', path: '/events' },
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'Blog', path: '/blog' },
  ];

  // Add dashboard for logged in users
  if (currentUser) {
    navItems.push({ name: 'Dashboard', path: '/dashboard' });
  }

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!currentUser || !currentUser.displayName) return 'U';
    
    const nameParts = currentUser.displayName.split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <nav className="backdrop-blur-md bg-black/50 border-b border-glow-green/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Lock size={24} className="text-glow-green" />
            <span className="text-2xl font-bold font-orbitron text-white">
              LOCKED <span className="text-glow-green">IN</span>
            </span>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-white hover:text-glow-green transition-colors relative group"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-glow-green transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            {currentUser ? (
              <div className="relative" ref={profileRef}>
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="hidden md:flex items-center gap-2 py-1 px-2 rounded-md hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-glow-green/20 border border-glow-green/50 text-white">
                    <span>{getUserInitials()}</span>
                  </div>
                  <ChevronDown size={16} className={`text-white transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-md border border-glow-green/30 rounded-md shadow-lg py-1 animate-fade-in">
                    <div className="px-4 py-2 border-b border-glow-green/20">
                      <p className="text-white font-medium truncate">{currentUser.displayName}</p>
                      <p className="text-gray-400 text-xs truncate">{currentUser.email}</p>
                    </div>
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-white hover:bg-glow-green/10 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <User size={16} className="inline-block mr-2" />
                      Profile
                    </Link>
                    <Link 
                      to="/dashboard" 
                      className="block px-4 py-2 text-white hover:bg-glow-green/10 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Award size={16} className="inline-block mr-2" />
                      Dashboard
                    </Link>
                    <Link 
                      to="/settings" 
                      className="block px-4 py-2 text-white hover:bg-glow-green/10 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Settings size={16} className="inline-block mr-2" />
                      Settings
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-glow-red hover:bg-glow-red/10 transition-colors"
                    >
                      <LogOut size={16} className="inline-block mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link 
                  to="/login" 
                  className="text-white hover:text-glow-green transition-colors px-3 py-1"
                >
                  Log In
                </Link>
                <Link 
                  to="/signup" 
                  className="btn-glow"
                >
                  Sign Up
                </Link>
              </div>
            )}
            
            {/* Mobile menu button */}
            <button
              className="md:hidden text-white hover:text-glow-green"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <div className="md:hidden animate-fade-in px-4 pb-4 pt-2 bg-black/90 border-b border-glow-green/20">
          <div className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-white hover:text-glow-green transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {currentUser ? (
              <>
                <Link 
                  to="/profile" 
                  className="flex items-center gap-2 text-white hover:text-glow-green transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User size={16} />
                  Profile
                </Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-2 text-glow-red hover:text-glow-red/80 transition-colors py-2"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-white hover:text-glow-green transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log In
                </Link>
                <Link 
                  to="/signup" 
                  className="text-glow-green hover:text-glow-green/80 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
