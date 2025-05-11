
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Volume2 } from "lucide-react";
import { toast } from "./ui/sonner";

export function VoiceAssistant() {
  const [isActive, setIsActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [conversation, setConversation] = useState<{role: string, content: string}[]>([
    { role: "assistant", content: "Hello! How can I help with your finances today?" }
  ]);
  
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  
  // SpeechRecognition setup
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join("");
        
        setUserInput(transcript);
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
        toast.error("Speech recognition error. Please try again.");
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleAssistant = () => {
    setIsActive(!isActive);
    if (!isActive) {
      console.log("Voice assistant activated");
    } else {
      setIsListening(false);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      console.log("Voice assistant deactivated");
    }
  };

  const toggleListening = () => {
    if (!SpeechRecognition) {
      toast.error("Speech recognition is not supported in this browser.");
      return;
    }
    
    if (!isListening) {
      setIsListening(true);
      setUserInput("");
      recognitionRef.current.start();
      console.log("Started listening");
    } else {
      setIsListening(false);
      recognitionRef.current.stop();
      
      // Only handle processing if there's actual content
      if (userInput.trim()) {
        handleUserQuery(userInput);
      }
      console.log("Stopped listening");
    }
  };
  
  // Mock function to handle user queries
  const handleUserQuery = (query: string) => {
    // Add user message to conversation
    setConversation(prev => [...prev, { role: "user", content: query }]);
    
    // Simulate AI processing
    setIsSpeaking(true);
    
    // Mock response based on keywords in the query
    setTimeout(() => {
      let response = "";
      
      if (query.toLowerCase().includes("portfolio") || query.toLowerCase().includes("earnings") || query.toLowerCase().includes("losses")) {
        response = "Your portfolio has grown by 3.2% in the last month. Your tech investments performed particularly well with a 5.7% gain.";
      }
      else if (query.toLowerCase().includes("market") || query.toLowerCase().includes("trends")) {
        response = "Current market trends show technology and renewable energy sectors outperforming the general market. There's volatility in financial services due to recent regulatory changes.";
      }
      else if (query.toLowerCase().includes("recommend") || query.toLowerCase().includes("invest")) {
        response = "Based on your risk profile and goals, I'd suggest diversifying into index ETFs with a small allocation to emerging markets. Would you like more specific recommendations?";
      }
      else {
        response = "I'm not sure I understood that query. Could you rephrase it? You can ask me about your portfolio performance, market trends, or investment recommendations.";
      }
      
      // Add AI response to conversation
      setConversation(prev => [...prev, { role: "assistant", content: response }]);
      speakResponse(response);
      
      setIsSpeaking(false);
    }, 1500);
  };
  
  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance();
      speech.text = text;
      speech.volume = 1;
      speech.rate = 1;
      speech.pitch = 1;
      
      // On some systems, we need to set the voice
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        // Try to find a female voice for better quality
        const femaleVoice = voices.find(voice => 
          voice.name.includes('Female') || 
          voice.name.includes('Samantha') ||
          voice.name.includes('Google UK English Female')
        );
        
        if (femaleVoice) {
          speech.voice = femaleVoice;
        }
      }
      
      window.speechSynthesis.speak(speech);
      
      speech.onstart = () => setIsSpeaking(true);
      speech.onend = () => setIsSpeaking(false);
    }
  };

  // Handle keyboard submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim()) {
      handleUserQuery(userInput);
      setUserInput("");
    }
  };

  return (
    <>
      {/* Fixed voice assistant button */}
      <motion.button
        onClick={toggleAssistant}
        className={`fixed bottom-8 right-8 z-50 rounded-full p-4 shadow-xl
          ${isActive 
            ? "bg-[#2751B9] shadow-[0_0_25px_rgba(39,81,185,0.4)]" 
            : "bg-[#151515]/80 border border-[#2751B9]/30"}`}
        whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(39,81,185,0.5)" }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {isSpeaking ? (
          <Volume2 className="w-6 h-6 text-white animate-pulse" />
        ) : (
          <Mic className="w-6 h-6 text-white" />
        )}
      </motion.button>

      {/* Expanded assistant interface */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-8 w-80 bg-[#151515]/95 backdrop-blur-md border border-[#2751B9]/30 rounded-2xl p-5 shadow-2xl shadow-[#2751B9]/20 z-40"
          >
            <div className="flex flex-col items-center">
              <motion.div 
                className="w-24 h-24 rounded-full bg-[#151515] border-2 border-[#2751B9]/50 flex items-center justify-center mb-4"
                animate={{ 
                  boxShadow: isListening || isSpeaking
                    ? ['0 0 0 rgba(39,81,185,0.4)', '0 0 20px rgba(39,81,185,0.8)', '0 0 0 rgba(39,81,185,0.4)'] 
                    : '0 0 0 rgba(39,81,185,0.4)'
                }}
                transition={{ 
                  repeat: (isListening || isSpeaking) ? Infinity : 0, 
                  duration: 1.5 
                }}
              >
                <motion.button
                  onClick={toggleListening}
                  className={`w-20 h-20 rounded-full ${isListening ? 'bg-[#2751B9]/40' : 'bg-[#2751B9]/20'} flex items-center justify-center`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isListening ? (
                    <motion.div
                      initial={{ scale: 1 }}
                      animate={{ 
                        scale: [1, 1.2, 1], 
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 1.5,
                      }}
                    >
                      <Mic className="w-10 h-10 text-[#2751B9]" />
                    </motion.div>
                  ) : (
                    <MicOff className="w-10 h-10 text-[#2751B9]/70" />
                  )}
                </motion.button>
              </motion.div>
              
              <h3 className="text-white text-xl font-semibold mb-2">
                {isListening ? "Listening..." : isSpeaking ? "Speaking..." : "Trade Republic Assistant"}
              </h3>
              
              {/* Conversation history */}
              <div className="w-full h-48 overflow-y-auto mb-4 scrollbar-thin scrollbar-thumb-[#2751B9]/20 scrollbar-track-transparent p-2">
                {conversation.map((message, index) => (
                  <div 
                    key={index} 
                    className={`mb-2 p-2 rounded-lg ${
                      message.role === 'user' 
                        ? 'bg-[#2751B9]/20 ml-8' 
                        : 'bg-[#222222] mr-8'
                    }`}
                  >
                    <p className="text-sm text-white">{message.content}</p>
                  </div>
                ))}
              </div>
              
              {isListening && (
                <div className="w-full bg-[#222222] rounded-lg p-2 mb-4">
                  <p className="text-sm text-[#8E9196]">I heard:</p>
                  <p className="text-sm text-white">{userInput || "..."}</p>
                </div>
              )}
              
              {/* Text input as an alternative to voice */}
              <form onSubmit={handleSubmit} className="w-full flex">
                <textarea
                  ref={textAreaRef}
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Type your question here..."
                  className="w-full bg-[#222222] rounded-lg p-3 text-white text-sm resize-none border border-[#333333] focus:border-[#2751B9] focus:outline-none"
                  rows={2}
                  disabled={isListening}
                />
                <button 
                  type="submit" 
                  className="ml-2 bg-[#2751B9] text-white p-2 rounded-lg"
                  disabled={!userInput.trim() || isListening}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
