import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, AlertTriangle } from 'lucide-react';

// This is a simplified voice assistant component
// In a real implementation, you would need to use the Web Speech API
// and potentially integrate with a backend service for more complex queries

export const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const micRef = useRef<HTMLDivElement>(null);
  
  // Simulate speech recognition
  const startListening = () => {
    // Check if browser supports speech recognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Speech recognition is not supported in your browser.');
      return;
    }
    
    setIsListening(true);
    setTranscript('');
    setResponse(null);
    
    // In a real implementation, you would use the Web Speech API
    // const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    // const recognition = new SpeechRecognition();
    // recognition.continuous = false;
    // recognition.interimResults = true;
    // recognition.onresult = (event) => {
    //   const transcript = event.results[0][0].transcript;
    //   setTranscript(transcript);
    // };
    // recognition.start();
    
    // Simulate speech recognition for demo
    setTimeout(() => {
      setTranscript('Listening...');
    }, 500);
    
    // Simulate end of speech after 3 seconds
    setTimeout(() => {
      const randomQueries = [
        'Show me some HIIT workouts',
        'How many calories in a banana',
        'What exercises target the abs',
        'Start a 30 minute timer',
        'What\'s my progress this week'
      ];
      
      const randomQuery = randomQueries[Math.floor(Math.random() * randomQueries.length)];
      setTranscript(randomQuery);
      setIsListening(false);
      
      // Process the query
      processQuery(randomQuery);
    }, 3000);
  };
  
  const stopListening = () => {
    setIsListening(false);
    
    // In a real implementation, you would stop the speech recognition
    // recognition.stop();
  };
  
  // Process the voice query
  const processQuery = (query: string) => {
    // In a real implementation, you would send the query to a backend service
    // or use a local NLP library to process the query
    
    // Simulate processing for demo
    setTimeout(() => {
      let assistantResponse = '';
      
      if (query.toLowerCase().includes('hiit')) {
        assistantResponse = 'I found several HIIT workouts for you. The most popular one is "HIIT Cardio Blast" which is a 30-minute intermediate workout.';
      } else if (query.toLowerCase().includes('calories') && query.toLowerCase().includes('banana')) {
        assistantResponse = 'A medium-sized banana (118 grams) contains about 105 calories, 27 grams of carbs, and 3 grams of fiber.';
      } else if (query.toLowerCase().includes('abs') || query.toLowerCase().includes('core')) {
        assistantResponse = 'Great core exercises include planks, crunches, Russian twists, and leg raises. Would you like me to show you a core workout?';
      } else if (query.toLowerCase().includes('timer')) {
        assistantResponse = 'Setting a 30-minute timer for your workout. Your timer will start now.';
      } else if (query.toLowerCase().includes('progress')) {
        assistantResponse = 'You\'ve completed 5 workouts this week, which is 2 more than last week. Your average workout duration has increased by 15%.';
      } else {
        assistantResponse = 'I\'m not sure how to help with that. You can ask me about workouts, nutrition, or your fitness progress.';
      }
      
      setResponse(assistantResponse);
      speakResponse(assistantResponse);
    }, 1000);
  };
  
  // Speak the response using text-to-speech
  const speakResponse = (text: string) => {
    // Check if browser supports speech synthesis
    if (!('speechSynthesis' in window)) {
      setError('Text-to-speech is not supported in your browser.');
      return;
    }
    
    setIsSpeaking(true);
    
    // In a real implementation, you would use the Web Speech API
    // const utterance = new SpeechSynthesisUtterance(text);
    // utterance.onend = () => {
    //   setIsSpeaking(false);
    // };
    // window.speechSynthesis.speak(utterance);
    
    // Simulate speech for demo
    setTimeout(() => {
      setIsSpeaking(false);
    }, 5000);
  };
  
  // Pulse animation for the microphone
  useEffect(() => {
    if (!isListening || !micRef.current) return;
    
    const pulseInterval = setInterval(() => {
      const size = 40 + Math.random() * 20;
      micRef.current!.style.width = `${size}px`;
      micRef.current!.style.height = `${size}px`;
    }, 100);
    
    return () => {
      clearInterval(pulseInterval);
      if (micRef.current) {
        micRef.current.style.width = '40px';
        micRef.current.style.height = '40px';
      }
    };
  }, [isListening]);
  
  return (
    <div className="w-full">
      <div className="glass-card p-6 text-center">
        <h2 className="text-xl font-bold mb-6">Voice Assistant</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-glow-red/10 border border-glow-red/30 rounded-md flex items-center gap-2">
            <AlertTriangle size={18} className="text-glow-red" />
            <p className="text-sm text-white">{error}</p>
          </div>
        )}
        
        <div className="flex flex-col items-center justify-center mb-6">
          <div 
            ref={micRef}
            className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-200 ${
              isListening 
                ? 'bg-glow-green/20 border-2 border-glow-green animate-pulse' 
                : 'bg-black/50 border border-white/20'
            }`}
          >
            {isListening ? (
              <Mic size={24} className="text-glow-green" />
            ) : (
              <Mic size={24} className="text-white" />
            )}
          </div>
          
          <div className="h-12">
            {transcript && (
              <p className="text-white mb-2">{transcript}</p>
            )}
            {!transcript && !isListening && (
              <p className="text-gray-400 mb-2">Tap the microphone and ask a question</p>
            )}
          </div>
          
          <button
            onClick={isListening ? stopListening : startListening}
            className={`px-4 py-2 rounded-md transition-colors ${
              isListening 
                ? 'bg-glow-red/20 text-white border border-glow-red/50' 
                : 'btn-glow'
            }`}
          >
            {isListening ? (
              <>
                <MicOff size={16} className="inline-block mr-2" />
                Stop Listening
              </>
            ) : (
              <>
                <Mic size={16} className="inline-block mr-2" />
                Start Listening
              </>
            )}
          </button>
        </div>
        
        {response && (
          <div className={`p-4 bg-glow-green/5 border border-glow-green/30 rounded-md mb-4 transition-opacity duration-300 ${
            isSpeaking ? 'animate-pulse' : ''
          }`}>
            <div className="flex items-start gap-3">
              {isSpeaking && (
                <Volume2 size={20} className="text-glow-green mt-1 animate-pulse" />
              )}
              <p className="text-white text-left">{response}</p>
            </div>
          </div>
        )}
        
        <div className="text-left">
          <h3 className="text-lg font-medium mb-3">Try asking:</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-glow-green"></span>
              "Show me some HIIT workouts"
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-glow-green"></span>
              "How many calories in a banana"
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-glow-green"></span>
              "What exercises target the abs"
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-glow-green"></span>
              "Start a 30 minute timer"
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-glow-green"></span>
              "What's my progress this week"
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};