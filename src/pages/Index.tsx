
import { useState, useEffect } from "react";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { Hero } from "../components/home/Hero";
import { FitnessCards } from "../components/home/FitnessCards";
import { QuickAccess } from "../components/home/QuickAccess";
import { AiAssistant } from "../components/ui/AiAssistant";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate checking if components are ready to render
    try {
      console.log("Index page mounting...");
      // Set a timeout to ensure we don't show loading state forever
      const timer = setTimeout(() => {
        setIsLoading(false);
        console.log("Index page loaded");
      }, 1000);
      
      return () => clearTimeout(timer);
    } catch (err) {
      console.error("Error in Index page:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
      setIsLoading(false);
    }
  }, []);

  // Fallback loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-glow-green border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-glow-green text-xl">Loading Locked.in...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h2 className="text-glow-red text-2xl mb-4">Something went wrong</h2>
          <p className="mb-4">We encountered an error while loading the page.</p>
          <div className="bg-black/40 p-4 rounded-md border border-glow-red/30 mb-4">
            <code className="text-white/80">{error}</code>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-glow-green text-black rounded-md hover:bg-glow-green/80"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // Main content
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main>
        <Hero />
        <FitnessCards />
        <QuickAccess />
      </main>
      <Footer />
      <AiAssistant />
    </div>
  );
};

export default Index;
