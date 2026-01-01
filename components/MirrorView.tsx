import React, { useState, useRef, useEffect } from 'react';
import { Message, MessageRole, Language, NarrativeEvent } from '../types';
import { streamChatResponse } from '../services/geminiService';
import { translations } from '../translations';

interface MirrorViewProps {
  initialMessage?: string;
  language: Language;
  addToHistory: (event: NarrativeEvent) => void;
}

const MirrorView: React.FC<MirrorViewProps> = ({ initialMessage, language, addToHistory }) => {
  const t = translations[language].mirror;
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      role: MessageRole.MODEL,
      text: t.init,
      timestamp: Date.now()
    }
  ]);
  
  // Re-init welcome message on language switch only if it's the sole message
  useEffect(() => {
    if (messages.length === 1 && messages[0].id === 'init') {
        setMessages([{
            id: 'init',
            role: MessageRole.MODEL,
            text: t.init,
            timestamp: Date.now()
        }]);
    }
  }, [language, t.init]);

  const [inputValue, setInputValue] = useState(initialMessage || '');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const userText = inputValue;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: MessageRole.USER,
      text: userText,
      timestamp: Date.now()
    };

    // 1. Update UI
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // 2. Add to Global Narrative History
    addToHistory({
        id: userMsg.id,
        type: 'log_entry',
        timestamp: userMsg.timestamp,
        content: userText
    });

    // 3. Get AI Response
    const history = messages.map(m => ({
        role: m.role === MessageRole.USER ? 'user' : 'model',
        content: m.text
    }));

    const botMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
        id: botMsgId,
        role: MessageRole.MODEL,
        text: "",
        timestamp: Date.now()
    }]);

    try {
        let fullResponse = "";
        const stream = streamChatResponse(history, userMsg.text, language);
        
        for await (const chunk of stream) {
            fullResponse += chunk;
            setMessages(prev => prev.map(msg => 
                msg.id === botMsgId ? { ...msg, text: fullResponse } : msg
            ));
        }
    } catch (err) {
        console.error(err);
    } finally {
        setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 pb-24">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === MessageRole.USER ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] md:max-w-[70%] p-6 rounded-2xl border ${
                msg.role === MessageRole.USER
                  ? 'bg-subtle border-gray-700 text-white rounded-br-none'
                  : 'bg-void border-subtle text-gray-300 rounded-bl-none shadow-lg'
              }`}
            >
              <p className="font-serif leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                {msg.text}
              </p>
              <span className="text-[10px] uppercase tracking-widest text-gray-600 mt-4 block">
                {msg.role === MessageRole.USER ? t.ego : t.dasein}
              </span>
            </div>
          </div>
        ))}
        {isTyping && (
           <div className="flex justify-start animate-pulse">
             <div className="bg-void border border-subtle p-4 rounded-2xl rounded-bl-none">
                <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                </div>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-surface to-transparent p-4 md:p-8">
        <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={t.placeholder}
            className="w-full bg-[#0a0a0b] border border-gray-700 rounded-full py-4 px-6 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-core focus:ring-1 focus:ring-core transition-all shadow-xl font-serif"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-subtle rounded-full text-gray-400 hover:text-white disabled:opacity-50 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default MirrorView;
