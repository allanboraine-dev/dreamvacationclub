import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { generateConciergeResponse } from '../services/geminiService';
import { MemberProfile } from '../types';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

interface ConciergeProps {
  user: MemberProfile;
}

const Concierge: React.FC<ConciergeProps> = ({ user }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: `Hello ${user.firstName}. I am your personal Dream Vacation Architect. How can I assist with your next escape?`, sender: 'bot' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim()) return;

    const userMsg: Message = { id: Date.now(), text: textToSend, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Call Gemini Service
    const botResponseText = await generateConciergeResponse(textToSend, user);
    
    setIsTyping(false);
    const botMsg: Message = { id: Date.now() + 1, text: botResponseText, sender: 'bot' };
    setMessages(prev => [...prev, botMsg]);
  };

  const suggestions = [
    "Check my points balance",
    "Suggest a beach resort", 
    "How do I buy points?"
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-navy-950 pt-safe transition-colors duration-300">
      {/* Header */}
      <div className="px-6 py-4 bg-white dark:bg-navy-900 border-b border-slate-100 dark:border-navy-800 flex items-center space-x-3 shadow-sm z-10 sticky top-0 transition-colors duration-300">
        <div className="w-10 h-10 rounded-full bg-navy-900 dark:bg-navy-800 flex items-center justify-center text-amber-400">
            <Sparkles size={20} />
        </div>
        <div>
            <h2 className="text-navy-900 dark:text-white font-bold font-serif text-lg leading-none">AI Concierge</h2>
            <span className="text-xs text-green-600 dark:text-green-400 font-medium">Online • 24/7 Support</span>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar pb-32">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm ${
              msg.sender === 'user' 
                ? 'bg-navy-900 dark:bg-amber-600 text-white rounded-br-none' 
                : 'bg-white dark:bg-navy-800 border border-slate-100 dark:border-navy-700 text-slate-700 dark:text-slate-200 rounded-bl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
           <div className="flex justify-start animate-in fade-in duration-300">
             <div className="bg-white dark:bg-navy-800 border border-slate-100 dark:border-navy-700 rounded-2xl rounded-bl-none p-4 shadow-sm flex space-x-1 items-center h-10">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></div>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white dark:bg-navy-900 border-t border-slate-100 dark:border-navy-800 pb-28 pt-2 transition-colors duration-300">
        {/* Suggestions */}
        <div className="flex space-x-2 overflow-x-auto no-scrollbar px-4 mb-3">
            {suggestions.map(s => (
                <button 
                    key={s} 
                    onClick={() => handleSend(s)}
                    className="flex-shrink-0 bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 text-slate-600 dark:text-slate-300 text-xs px-3 py-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-navy-700 active:scale-95 transition-transform"
                >
                    {s}
                </button>
            ))}
        </div>

        <div className="px-4 pb-4">
            <div className="flex items-center bg-slate-100 dark:bg-navy-950 rounded-full px-2 py-2 border border-transparent focus-within:border-amber-400 transition-colors">
                <input 
                    type="text" 
                    className="flex-1 bg-transparent border-none px-4 text-sm focus:outline-none focus:ring-0 text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button 
                    onClick={() => handleSend()}
                    disabled={!input.trim()}
                    className={`rounded-full p-2 transition-all duration-200 ${input.trim() ? 'bg-amber-500 text-white hover:bg-amber-600' : 'bg-slate-200 dark:bg-navy-800 text-slate-400'}`}
                >
                    <Send size={18} />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Concierge;