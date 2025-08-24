import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, Brain, Sparkles, Settings, User, Menu, X } from 'lucide-react';

const TherapyChatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello, I'm here to support you today. I'm a licensed therapist specializing in cognitive-behavioral therapy and trauma-informed care. How are you feeling right now, and what would you like to explore together?",
      isBot: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isTyping: false
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [typingMessageId, setTypingMessageId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Typing animation effect
  const typeMessage = (messageId, fullText, delay = 30) => {
    return new Promise((resolve) => {
      let currentIndex = 0;
      setTypingMessageId(messageId);
      
      const typeNextCharacter = () => {
        if (currentIndex < fullText.length) {
          setMessages(prev => prev.map(msg => 
            msg.id === messageId 
              ? { ...msg, text: fullText.substring(0, currentIndex + 1), isTyping: true }
              : msg
          ));
          currentIndex++;
          typingTimeoutRef.current = setTimeout(typeNextCharacter, delay);
        } else {
          setMessages(prev => prev.map(msg => 
            msg.id === messageId 
              ? { ...msg, isTyping: false }
              : msg
          ));
          setTypingMessageId(null);
          resolve();
        }
      };
      
      typeNextCharacter();
    });
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const therapistPrompt = `You are Dr. Sarah, a licensed clinical psychologist with 15 years of experience. You specialize in CBT, DBT, trauma-informed care, and mindfulness-based interventions.

Your therapeutic style:
- Warm, empathetic, and genuinely curious about the client's experience
- Ask meaningful questions that help clients explore their thoughts and feelings
- Provide practical, evidence-based strategies
- Validate emotions while offering new perspectives
- Speak naturally and professionally, as you would in your private practice

Important: 
- Write ONLY your direct response to the client
- Do NOT include any meta-commentary, instructions, or explanations of your approach
- Do NOT use asterisks, bullet points, or formatting markers
- Do NOT label your questions as "feeling-focused" or "thought-focused"
- Keep responses concise (100-200 words) and conversational
- Speak as Dr. Sarah would speak, not as an AI following instructions

Focus on being genuinely helpful and present with your client.`;

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      isBot: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isTyping: false
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText('');
    setIsLoading(true);

    try {
      console.log("Sending message to Gemini API:", currentInput);
      const response = await callGeminiAPI(currentInput, [...messages, userMessage]);
      console.log("Received response from Gemini API:", response);
      
      const botMessageId = Date.now() + 1;
      const botMessage = {
        id: botMessageId,
        text: '',
        isBot: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isTyping: false
      };

      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
      
      // Start typing animation
      await typeMessage(botMessageId, response, 25);
      
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      const errorMessageId = Date.now() + 1;
      const errorMessage = {
        id: errorMessageId,
        text: '',
        isBot: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isTyping: false
      };
      
      setMessages(prev => [...prev, errorMessage]);
      setIsLoading(false);
      
      const errorText = "I apologize, but I'm having trouble connecting right now. Please try again in a moment. Remember, if you're in crisis, please contact emergency services or a crisis helpline.";
      await typeMessage(errorMessageId, errorText, 25);
    }
  };

  // Improved Gemini API integration
  const callGeminiAPI = async (message, currentMessages) => {
    const API_KEY = import.meta.env.VITE_API_KEY;
    
    if (!API_KEY) {
      throw new Error('Gemini API key not found. Please add VITE_API_KEY to your .env file and restart the dev server.');
    }

    // Build conversation history more effectively
    const conversationHistory = currentMessages
      .slice(-10) // Get last 10 messages for better context
      .filter(msg => msg.text.trim()) // Filter out empty messages
      .map(msg => ({
        role: msg.isBot ? 'model' : 'user',
        parts: [{ text: msg.text }]
      }));

    // Create the full conversation for the API
    const contents = [
      {
        role: 'user',
        parts: [{ text: therapistPrompt }]
      },
      {
        role: 'model',
        parts: [{ text: "I understand. I'm Dr. Sarah, and I'm here to provide therapeutic support. I'll respond with empathy, ask thoughtful questions, and help you explore your thoughts and feelings in a supportive way. How can I help you today?" }]
      },
      ...conversationHistory
    ];

    console.log("Sending conversation context:", contents);

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: contents,
        generationConfig: {
          temperature: 0.8, // Balanced creativity and consistency
          topK: 40,
          topP: 0.9,
          maxOutputTokens: 300, // Shorter, more focused responses
          candidateCount: 1,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH", 
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", errorData);
      throw new Error(errorData.error?.message || `API Error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Full API Response:", data);
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response format from Gemini API');
    }

    const responseText = data.candidates[0].content.parts[0].text.trim();
    
    // Clean up the response - remove any unwanted formatting or meta-commentary
    const cleanedResponse = responseText
      .replace(/^(Dr\.\s*Sarah:|Therapist:|Assistant:)\s*/i, '')
      .replace(/\*\*\*/g, '') // Remove triple asterisks
      .replace(/\*\*/g, '') // Remove double asterisks
      .replace(/\* /g, '') // Remove bullet points
      .replace(/\(This is a [^)]+\)/gi, '') // Remove meta-commentary in parentheses
      .replace(/\[.*?\]/g, '') // Remove bracketed instructions
      .replace(/\n\s*\n/g, '\n') // Clean up extra line breaks
      .trim();

    return cleanedResponse || responseText;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <style jsx>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .typing-cursor {
          animation: blink 1s infinite;
        }
      `}</style>
      
      <div className={`min-h-screen transition-all duration-300 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'}`}>
        {/* Mobile menu button */}
        <div className="lg:hidden fixed top-4 left-4 z-50">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`p-2 rounded-lg backdrop-blur-md transition-all duration-300 ${
              isDarkMode
                ? 'bg-gray-800/70 text-gray-200 hover:bg-gray-700/70'
                : 'bg-white/70 text-gray-700 hover:bg-gray-100/70'
            }`}
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile sidebar backdrop */}
        {isSidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`fixed top-0 left-0 bottom-0 z-40 border-r backdrop-blur-md transition-all duration-300 lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isDarkMode ? 'bg-gray-900/70 border-gray-800' : 'bg-white/70 border-gray-200'} w-64 lg:w-56`}>
          <div className="h-full flex flex-col p-4">
            <div className="flex items-center justify-between mb-6 mt-2">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                  <Brain className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
                <span className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>MindfulAI</span>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="space-y-2">
              <button className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`} title="Conversations">
                <MessageCircle className="w-5 h-5" />
                <span>Conversations</span>
              </button>
              <button className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`} title="Settings" onClick={() => setShowSettings(true)}>
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </button>
            </nav>

            <div className="mt-3">
              <div className="flex items-center justify-between px-1">
                <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Theme</span>
                <div
                  className="relative w-14 h-7 cursor-pointer"
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  style={{
                    perspective: '500px',
                    transform: 'rotateX(5deg) rotateY(-8deg)'
                  }}
                >
                  <div
                    className="absolute inset-0 rounded-full overflow-hidden transition-all duration-500"
                    style={{
                      background: !isDarkMode
                        ? 'linear-gradient(135deg, #e6f3ff 0%, #cce7ff 50%, #b3daff 100%)'
                        : 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
                      boxShadow: !isDarkMode
                        ? isHovered
                          ? 'inset 0 2px 6px rgba(0, 0, 0, 0.15), inset 0 -1px 3px rgba(255, 215, 0, 0.3), 0 0 10px rgba(255, 215, 0, 0.4)'
                          : 'inset 0 2px 4px rgba(0, 0, 0, 0.1), inset 0 -1px 2px rgba(255, 215, 0, 0.2)'
                        : isHovered
                          ? 'inset 0 2px 6px rgba(0, 0, 0, 0.9), inset 0 -1px 3px rgba(147, 112, 219, 0.2), 0 0 10px rgba(147, 112, 219, 0.3)'
                          : 'inset 0 2px 4px rgba(0, 0, 0, 0.8), inset 0 -1px 2px rgba(147, 112, 219, 0.1)'
                    }}
                  />
                  <div
                    className="absolute inset-0 rounded-full overflow-hidden transition-all duration-500"
                    style={{
                      background: !isDarkMode
                        ? 'radial-gradient(circle at 30% 40%, rgba(255, 215, 0, 0.3) 0%, transparent 60%), radial-gradient(circle at 70% 60%, rgba(255, 140, 0, 0.2) 0%, transparent 50%)'
                        : 'radial-gradient(circle at 30% 40%, rgba(147, 112, 219, 0.3) 0%, transparent 60%), radial-gradient(circle at 70% 60%, rgba(75, 0, 130, 0.2) 0%, transparent 50%)',
                      opacity: isHovered ? 0.9 : 0.6
                    }}
                  />
                  <div
                    className="absolute top-0.5 left-0.5 rounded-full overflow-hidden transition-all duration-700"
                    style={{
                      width: '24px',
                      height: '24px',
                      background: !isDarkMode
                        ? 'radial-gradient(circle at 35% 35%, rgba(255, 255, 200, 1) 0%, rgba(255, 215, 0, 0.95) 30%, rgba(255, 140, 0, 0.9) 100%)'
                        : 'radial-gradient(circle at 35% 35%, rgba(245, 245, 255, 0.95) 0%, rgba(220, 220, 240, 0.9) 40%, rgba(147, 112, 219, 0.8) 100%)',
                      boxShadow: !isDarkMode
                        ? isHovered
                          ? '0 0 18px rgba(255, 215, 0, 1), inset -2px -2px 6px rgba(255, 140, 0, 0.5), inset 2px 2px 6px rgba(255, 255, 200, 0.7)'
                          : '0 0 12px rgba(255, 215, 0, 0.8), inset -2px -2px 5px rgba(255, 140, 0, 0.4), inset 2px 2px 5px rgba(255, 255, 200, 0.6)'
                        : isHovered
                          ? '0 0 15px rgba(147, 112, 219, 0.8), inset -2px -2px 6px rgba(75, 0, 130, 0.7), inset 2px 2px 6px rgba(245, 245, 255, 0.4)'
                          : '0 0 10px rgba(147, 112, 219, 0.6), inset -2px -2px 5px rgba(75, 0, 130, 0.6), inset 2px 2px 5px rgba(245, 245, 255, 0.3)',
                      transform: `translateX(${!isDarkMode ? '0px' : '32px'}) scale(${isHovered ? 1.1 : 1})`,
                    }}
                  >
                    {!isDarkMode ? (
                      <>
                        {[...Array(8)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute bg-yellow-200 transition-all duration-300"
                            style={{
                              width: '1px',
                              height: '4px',
                              left: '50%',
                              top: '50%',
                              transformOrigin: '0.5px 12px',
                              transform: `rotate(${i * 45}deg) translateX(-0.5px) translateY(-12px)`,
                              borderRadius: '0.5px',
                              opacity: isHovered ? 1 : 0.6,
                              scale: isHovered ? 1.3 : 1
                            }}
                          />
                        ))}
                      </>
                    ) : (
                      <>
                        <div
                          className="absolute rounded-full bg-gray-300 opacity-40"
                          style={{ width: '4px', height: '4px', top: '6px', left: '7px' }}
                        />
                        <div
                          className="absolute rounded-full bg-gray-300 opacity-30"
                          style={{ width: '3px', height: '3px', top: '12px', left: '14px' }}
                        />
                        <div
                          className="absolute rounded-full bg-gray-300 opacity-35"
                          style={{ width: '2px', height: '2px', top: '16px', left: '9px' }}
                        />
                      </>
                    )}
                    <div
                      className="absolute inset-1.5 rounded-full transition-all duration-300"
                      style={{
                        background: !isDarkMode
                          ? 'radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(255, 215, 0, 0.4) 60%, transparent 100%)'
                          : 'radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, rgba(220, 220, 240, 0.3) 60%, transparent 100%)',
                        opacity: isHovered ? 1 : 0.8,
                        scale: isHovered ? 1.2 : 1
                      }}
                    />
                    <div
                      className="absolute top-1 left-1.5 w-2 h-2 rounded-full transition-all duration-200"
                      style={{
                        background: !isDarkMode
                          ? 'radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, transparent 70%)'
                          : 'radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, transparent 70%)',
                        opacity: isHovered ? 1 : 0.9,
                        scale: isHovered ? 1.2 : 1
                      }}
                    />
                  </div>
                  {isHovered && (
                    <>
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute rounded-full animate-pulse"
                          style={{
                            width: '1px',
                            height: `${3 + Math.random() * 5}px`,
                            background: !isDarkMode
                              ? 'linear-gradient(to bottom, rgba(255, 215, 0, 0.8), transparent)'
                              : 'linear-gradient(to bottom, rgba(147, 112, 219, 0.8), transparent)',
                            left: `${25 + Math.random() * 50}%`,
                            top: `${20 + Math.random() * 60}%`,
                            filter: 'blur(0.3px)',
                            animationDelay: `${i * 0.2}s`
                          }}
                        />
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-auto">
              <p className={`text-xs text-center ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>v1.0.0</p>
            </div>
          </div>
        </aside>

        {/* Content wrapper */}
        <div className="lg:ml-56 pt-16 lg:pt-0">
          {/* Chat Container */}
          <main className="max-w-4xl mx-auto px-4 pb-32">
            <div className="py-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 mb-6 ${
                    message.isBot ? 'justify-start' : 'justify-end'
                  }`}
                >
                  {message.isBot && (
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'
                    }`}>
                      <Brain className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                    </div>
                  )}
                  
                  <div className={`group max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl ${
                    message.isBot ? 'order-2' : 'order-1'
                  }`}>
                    <div className={`relative px-4 py-3 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md ${
                      message.isBot 
                        ? isDarkMode 
                          ? 'bg-gray-800 text-gray-100 rounded-tl-md' 
                          : 'bg-white text-gray-800 rounded-tl-md border border-gray-200'
                        : isDarkMode
                          ? 'bg-blue-600 text-white rounded-tr-md'
                          : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-tr-md'
                    }`}>
                      <p className="text-sm leading-relaxed">
                        {message.text}
                        {message.isTyping && (
                          <span className={`inline-block w-2 h-4 ml-1 typing-cursor ${
                            isDarkMode ? 'bg-blue-400' : 'bg-blue-500'
                          }`} />
                        )}
                      </p>
                      
                      {/* Sparkle animation for bot messages */}
                      {message.isBot && (
                        <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Sparkles className="w-3 h-3 text-purple-400 animate-pulse" />
                        </div>
                      )}
                    </div>
                    
                    <p className={`text-xs mt-1 px-2 ${
                      isDarkMode ? 'text-gray-500' : 'text-gray-500'
                    } ${message.isBot ? 'text-left' : 'text-right'}`}>
                      {message.timestamp}
                    </p>
                  </div>

                  {!message.isBot && (
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      isDarkMode ? 'bg-purple-500/20' : 'bg-purple-100'
                    }`}>
                      <User className={`w-5 h-5 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                    </div>
                  )}
                </div>
              ))}
              
              {/* Loading indicator */}
              {isLoading && (
                <div className="flex items-start space-x-3 mb-6">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'
                  }`}>
                    <Brain className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  </div>
                  <div className={`px-4 py-3 rounded-2xl rounded-tl-md ${
                    isDarkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'
                  }`}>
                    <div className="flex space-x-1">
                      <div className={`w-2 h-2 rounded-full animate-pulse ${isDarkMode ? 'bg-blue-400' : 'bg-blue-500'}`}></div>
                      <div className={`w-2 h-2 rounded-full animate-pulse ${isDarkMode ? 'bg-blue-400' : 'bg-blue-500'}`} style={{ animationDelay: '0.1s' }}></div>
                      <div className={`w-2 h-2 rounded-full animate-pulse ${isDarkMode ? 'bg-blue-400' : 'bg-blue-500'}`} style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </main>

          {/* Input Area */}
          <div className="fixed bottom-0 right-0 z-40 left-0 lg:left-56">
            <div className={`backdrop-blur-md border-t transition-all duration-300 ${
              isDarkMode ? 'bg-gray-900/80 border-gray-700' : 'bg-white/80 border-gray-200'
            }`}>
              <div className="max-w-4xl mx-auto px-4 py-4">
                <div className="relative">
                  <textarea
                    ref={inputRef}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Share what's on your mind..."
                    disabled={isLoading || typingMessageId !== null}
                    className={`w-full px-4 py-3 pr-12 rounded-2xl resize-none focus:outline-none focus:ring-2 transition-all duration-300 ${
                      isDarkMode 
                        ? 'bg-gray-800 text-white border border-gray-600 focus:ring-blue-500 placeholder-gray-400'
                        : 'bg-white text-gray-800 border border-gray-300 focus:ring-blue-500 placeholder-gray-500 shadow-sm'
                    }`}
                    rows="1"
                    style={{ minHeight: '48px', maxHeight: '120px' }}
                  />
                  
                  <button
                    onClick={sendMessage}
                    disabled={!inputText.trim() || isLoading || typingMessageId !== null}
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-xl transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed ${
                      inputText.trim() && !isLoading && typingMessageId === null
                        ? isDarkMode
                          ? 'bg-blue-600 text-white hover:bg-blue-500'
                          : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                        : isDarkMode
                          ? 'bg-gray-700 text-gray-500'
                          : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                
                <p className={`text-xs mt-2 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  This is an AI assistant. In crisis situations, please contact emergency services.
                </p>
              </div>
            </div>
          </div>

          {/* Settings Modal */}
          {showSettings && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className={`max-w-md w-full mx-4 p-6 rounded-2xl shadow-xl ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  Settings
                </h3>
                <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Theme preferences and app settings
                </p>
                <button
                  onClick={() => setShowSettings(false)}
                  className={`w-full py-2 px-4 rounded-xl transition-colors ${
                    isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TherapyChatbot;