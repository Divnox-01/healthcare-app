'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare, X, Send, Bot, User, Activity, AlertTriangle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Message = {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  isTyping?: boolean;
  result?: any;
};

export const Chatbot = React.forwardRef<HTMLDivElement, { onClose: () => void }>(({ onClose }, ref) => {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'ai', text: "Hi! I'm your CareConnect AI Assistant. To help you best, what symptoms are you experiencing?" }
  ]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState(1);
  
  // Data collection
  const [symptoms, setSymptoms] = useState('');
  const [duration, setDuration] = useState('');
  const [severity, setSeverity] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateTyping = (text: string, onComplete?: () => void, resultData?: any) => {
    const id = Date.now().toString();
    setMessages(prev => [...prev, { id, sender: 'ai', text: '', isTyping: true }]);
    
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === id ? { ...msg, text, isTyping: false, result: resultData } : msg
      ));
      if (onComplete) onComplete();
    }, 1200);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', text: userMsg }]);

    if (step === 1) {
      setSymptoms(userMsg);
      setStep(2);
      simulateTyping("I hear you. Since when have you been feeling this way? (e.g., '3 days')");
    } else if (step === 2) {
      setDuration(userMsg);
      setStep(3);
      simulateTyping("Got it. On a scale of 1 to 5, how severe is it right now? (1 = Mild, 5 = Severe)");
    } else if (step === 3) {
      setSeverity(userMsg);
      setStep(4);
      
      const id = Date.now().toString() + 'loading';
      setMessages(prev => [...prev, { id, sender: 'ai', text: 'Analyzing your symptoms...', isTyping: true }]);
      
      try {
        const res = await fetch('http://localhost:5000/api/ai/symptom-check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            age: 30, // Default for now
            symptoms: symptoms ? symptoms.split(',') : [userMsg],
            durationDays: parseInt(duration) || 1,
            severity: parseInt(userMsg) || 3
          })
        });
        
        let data = null;
        try {
          data = await res.json();
        } catch (e) {
          console.error("Failed to parse AI response");
        }
        
        setMessages(prev => prev.filter(m => m.id !== id)); // remove loader
        
        if (res.ok && data) {
          simulateTyping(`Based on your symptoms, you should consult a ${data.recommendedDoctorType}. Here are some top-rated specialists you can book right away.`, undefined, data);
        } else {
          setStep(5); // Error state
          simulateTyping("Our AI is temporarily unavailable");
        }
      } catch (err) {
        console.error("Chatbot network error:", err);
        setMessages(prev => prev.filter(m => m.id !== id));
        setStep(5); // Error state
        simulateTyping("Our AI is temporarily unavailable");
      }
    }
  };

  return (
          <motion.div
            ref={ref}
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 w-[380px] h-[600px] max-h-[80vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 z-50"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex justify-between items-center text-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">CareConnect AI</h3>
                  <p className="text-xs text-blue-100 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Online
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="text-white/80 hover:text-white transition-colors p-2">
                <X size={24} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.sender === 'ai' && (
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-1">
                      <Bot size={18} className="text-blue-600" />
                    </div>
                  )}
                  
                  <div className={`max-w-[80%] ${msg.sender === 'user' ? 'order-1' : 'order-2'}`}>
                    <div className={`p-4 rounded-2xl ${
                      msg.sender === 'user' 
                        ? 'bg-blue-600 text-white rounded-br-sm shadow-sm' 
                        : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm shadow-sm'
                    }`}>
                      {msg.isTyping ? (
                        <div className="flex gap-2 items-center h-5">
                          <div className="flex gap-1 items-center">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          </div>
                          <span className="text-xs text-gray-500 font-medium italic">AI is typing...</span>
                        </div>
                      ) : (
                        <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      )}
                    </div>

                    {/* Rich Result Card */}
                    {msg.result && !msg.isTyping && (
                      <div className="mt-3 bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                        <div className={`p-3 text-xs font-bold flex justify-between items-center ${
                          msg.result.riskLevel === 'High' ? 'bg-red-50 text-red-700 border-b border-red-100' :
                          msg.result.riskLevel === 'Moderate' ? 'bg-yellow-50 text-yellow-700 border-b border-yellow-100' :
                          'bg-green-50 text-green-700 border-b border-green-100'
                        }`}>
                          <span className="flex items-center gap-1">
                            {msg.result.riskLevel === 'High' ? <AlertTriangle size={14}/> : <Activity size={14}/>}
                            Risk Level: {msg.result.riskLevel === 'Moderate' ? 'Medium' : msg.result.riskLevel}
                            {msg.result.riskLevel === 'High' ? '🔴' : msg.result.riskLevel === 'Moderate' ? '🟡' : '🟢'}
                          </span>
                          <span>{msg.result.confidenceScore}% Match</span>
                        </div>
                        <div className="p-4 space-y-3">
                          <p className="text-sm text-gray-600">Recommended Specialist:</p>
                          <p className="font-black text-lg text-blue-600">{msg.result.recommendedDoctorType}</p>
                          
                          {/* Recommended Doctors List */}
                          {msg.result.doctors && msg.result.doctors.length > 0 ? (
                            <div className="pt-2 flex flex-col gap-2">
                              <p className="text-[11px] text-gray-500 uppercase tracking-wider font-bold mb-1">Top Doctors Available</p>
                              {msg.result.doctors.slice(0, 3).map((doctor: any) => (
                                <div key={doctor.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-inner shrink-0">
                                      {doctor.firstName?.[0]}{doctor.lastName?.[0]}
                                    </div>
                                    <div className="min-w-0">
                                      <p className="text-sm font-bold text-gray-800 truncate">Dr. {doctor.firstName} {doctor.lastName}</p>
                                      <p className="text-xs text-gray-500 truncate">{doctor.specialization} • ⭐ {doctor.rating || '4.8'}</p>
                                    </div>
                                  </div>
                                  <button 
                                    onClick={() => {
                                      onClose();
                                      router.push(`/doctor/${doctor.id}`);
                                    }}
                                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm shrink-0 ml-2"
                                  >
                                    Book
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="pt-2 flex flex-col gap-2">
                              <p className="text-sm text-gray-500 mb-1">No specific doctors found matching this criteria.</p>
                              <button 
                                onClick={() => {
                                  onClose();
                                  router.push('/search');
                                }}
                                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                              >
                                Search All Doctors <ArrowRight size={16} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center shrink-0 mt-1 order-2">
                      <User size={18} className="text-indigo-600" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100 shrink-0 flex flex-col gap-3">
              {step === 1 && !messages[messages.length - 1]?.isTyping && (
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  {['Headache', 'Fever', 'Chest pain'].map(symptom => (
                    <button
                      key={symptom}
                      type="button"
                      onClick={() => {
                        const newMsg = symptom;
                        setInput('');
                        setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', text: newMsg }]);
                        setSymptoms(newMsg);
                        setStep(2);
                        simulateTyping("I hear you. Since when have you been feeling this way? (e.g., '3 days')");
                      }}
                      className="px-4 py-1.5 bg-blue-50 text-blue-600 text-sm font-medium rounded-full border border-blue-100 whitespace-nowrap hover:bg-blue-100 transition-colors"
                    >
                      {symptom}
                    </button>
                  ))}
                </div>
              )}
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={step >= 4 ? "Analysis complete." : "Type your answer..."}
                  disabled={step >= 4 || messages[messages.length-1]?.isTyping}
                  className="flex-1 px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm disabled:opacity-50"
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || step >= 4 || messages[messages.length-1]?.isTyping}
                  className="w-12 h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-xl flex items-center justify-center transition-colors shrink-0"
                >
                  <Send size={20} className="ml-1" />
                </button>
              </form>
            </div>
          </motion.div>
  );
});

Chatbot.displayName = 'Chatbot';

export default function ChatbotToggle() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="chatbot-button"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-16 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl shadow-blue-500/50 flex items-center justify-center transition-transform hover:scale-110 z-50"
          >
            <MessageSquare size={28} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && <Chatbot key="chatbot-window" onClose={() => setIsOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
