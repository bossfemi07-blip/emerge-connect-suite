import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Sparkles, Send, BrainCircuit, Lightbulb, TrendingUp, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

export const AI: React.FC = () => {
  const [messages, setMessages] = useState<{role: 'ai' | 'user', text: string}[]>([
    { role: 'ai', text: 'Abeg, how I fit help your business today? I be your Hustle Assistant!' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let response = "Omo, I no understand that one yet. Ask me about market, business tips, or how to save naira!";
      const lower = userMsg.toLowerCase();
      
      if (lower.includes('hustle')) response = "True hustle no easy, but consistency be the key! Focus on wetin people need daily.";
      if (lower.includes('market')) response = "Right now, tech and agriculture dey boom for Nigeria. Which one you wan focus on?";
      if (lower.includes('naira')) response = "E fit hard, but try save in assets like gold or stocks. I fit guide you!";
      if (lower.includes('hello') || lower.includes('hi')) response = "Salute, my person! Wetin we dey cook today?";

      setMessages(prev => [...prev, { role: 'ai', text: response }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900">
      <header className="p-4 bg-background border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-black italic text-primary leading-none">Fems AI</h1>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Hustle Assistant</p>
          </div>
        </div>
        <BrainCircuit className="w-6 h-6 text-primary opacity-20" />
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        <div className="grid grid-cols-2 gap-2 mb-6">
          {[
            { icon: <TrendingUp className="w-4 h-4" />, label: 'Market Trends' },
            { icon: <Lightbulb className="w-4 h-4" />, label: 'Business Ideas' },
            { icon: <DollarSign className="w-4 h-4" />, label: 'Saving Tips' },
            { icon: <BrainCircuit className="w-4 h-4" />, label: 'Advice' },
          ].map((item, idx) => (
            <button 
              key={idx} 
              onClick={() => setInput(item.label)}
              className="p-3 rounded-2xl bg-white dark:bg-slate-800 border shadow-sm flex flex-col gap-2 hover:border-primary transition-colors text-left"
            >
              <div className="text-primary">{item.icon}</div>
              <span className="text-[10px] font-black uppercase">{item.label}</span>
            </button>
          ))}
        </div>

        {messages.map((m, idx) => (
          <motion.div 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            key={idx} 
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-2 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <Avatar className="w-8 h-8 shrink-0 mt-1">
                {m.role === 'ai' ? (
                  <AvatarImage src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/e48c463b-5947-4f56-9b9e-6c70334ab720/ai-assistant-avatar-58859b44-1779550512471.webp" />
                ) : null}
                <AvatarFallback className="bg-primary/10 text-[10px] font-bold">{m.role === 'ai' ? 'AI' : 'ME'}</AvatarFallback>
              </Avatar>
              <div className={`p-3 rounded-2xl shadow-sm ${
                m.role === 'user' 
                  ? 'bg-primary text-primary-foreground rounded-tr-none' 
                  : 'bg-white dark:bg-slate-800 text-foreground rounded-tl-none border'
              }`}>
                <p className="text-sm font-medium leading-relaxed">{m.text}</p>
              </div>
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none border shadow-sm flex gap-1">
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      <footer className="p-4 bg-background border-t">
        <div className="relative">
          <Input 
            placeholder="Ask your hustle assistant..." 
            className="pr-12 h-12 rounded-2xl bg-muted border-none font-medium"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button 
            onClick={handleSend}
            className="absolute right-1 top-1 bottom-1 w-10 h-10 rounded-xl" 
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </footer>
    </div>
  );
};