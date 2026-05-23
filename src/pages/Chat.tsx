import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { MessageSquare, Send, ArrowLeft, Image as ImageIcon, CheckCircle2, WifiOff, Download, Phone, Video, DollarSign, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export const Chat: React.FC = () => {
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const { messages, addMessage, isOffline, lowBandwidth, initiateCall, sendPayment, walletBalance } = useStore();

  const contacts = [
    { id: 'kola', name: 'Kola Electronics', lastMsg: 'How far, you don see...', time: '2m ago', online: true },
    { id: 'bola', name: 'Bola Ventures', lastMsg: 'Abeg, check that hustle...', time: '1h ago', online: false },
    { id: 'market', name: 'Market Group 🇳🇬', lastMsg: 'Price of dollar don drop!', time: '15m ago', online: true, group: true },
  ];

  const handleSend = () => {
    if (!inputText.trim() || !activeChat) return;

    // Command Parsing: /pay @user amount
    if (inputText.startsWith('/pay')) {
      const parts = inputText.split(' ');
      if (parts.length === 3) {
        const amount = parseFloat(parts[2]);
        if (!isNaN(amount) && amount > 0) {
          if (amount > walletBalance) {
            toast.error('Insufficient funds for this hustle!');
            return;
          }
          setIsProcessingPayment(true);
          setTimeout(() => {
            sendPayment(amount, parts[1]);
            addMessage(activeChat, {
              id: Date.now().toString(),
              senderId: 'me',
              text: `💸 Sent ₦${amount} to ${parts[1]}`,
              timestamp: Date.now(),
              status: isOffline ? 'PENDING' : 'SENT',
              isMedia: false
            });
            setIsProcessingPayment(false);
            toast.success(`Payment of ₦${amount} confirmed!`);
          }, 2000);
          setInputText('');
          return;
        }
      }
      toast.error('Invalid command. Use /pay @user amount');
      return;
    }

    const msg = {
      id: Date.now().toString(),
      senderId: 'me',
      text: inputText,
      timestamp: Date.now(),
      status: isOffline ? 'PENDING' : 'SENT'
    };
    addMessage(activeChat, msg as any);
    setInputText('');
  };

  if (activeChat) {
    const chatMessages = messages[activeChat] || [];
    const contact = contacts.find(c => c.id === activeChat);

    return (
      <div className="flex flex-col h-full bg-[#E5DDD5] dark:bg-slate-950">
        <header className="bg-primary text-primary-foreground p-3 flex items-center gap-3 shadow-md relative z-10">
          <button onClick={() => setActiveChat(null)}><ArrowLeft className="w-6 h-6" /></button>
          <Avatar className="w-10 h-10 border-2 border-primary-foreground/20">
            <AvatarFallback>{contact?.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <h3 className="font-bold text-sm leading-tight truncate">{contact?.name}</h3>
            <p className="text-[10px] opacity-80">{contact?.online ? 'Online' : 'Offline'}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="text-white h-9 w-9 rounded-full" onClick={() => initiateCall('voice', contact?.name || 'User')}>
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white h-9 w-9 rounded-full" onClick={() => initiateCall('video', contact?.name || 'User')}>
              <Video className="w-4 h-4" />
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
          <AnimatePresence>
            {isProcessingPayment && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-6"
              >
                <div className="bg-background rounded-[2rem] p-8 text-center space-y-6 w-full max-w-xs shadow-2xl border-2 border-primary">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <DollarSign className="w-10 h-10 text-primary animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-black italic">Processing...</h3>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Biometric Secure Connect</p>
                  </div>
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-center">
            <span className="bg-white/50 dark:bg-slate-800/50 text-[10px] px-2 py-1 rounded-full uppercase font-bold tracking-wider">Today</span>
          </div>
          
          {chatMessages.map((m) => (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              key={m.id} 
              className={`flex ${m.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] rounded-2xl p-3 shadow-sm relative ${
                m.senderId === 'me' 
                  ? 'bg-primary text-primary-foreground rounded-tr-none' 
                  : 'bg-white dark:bg-slate-800 text-foreground rounded-tl-none'
              } ${m.text.includes('💸') ? 'border-2 border-yellow-400 font-bold' : ''}`}>
                <p className="text-sm">{m.text}</p>
                <div className="flex items-center justify-end gap-1 mt-1">
                  <span className="text-[9px] opacity-70">
                    {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {m.senderId === 'me' && (
                    m.status === 'PENDING' ? <WifiOff className="w-2 h-2" /> : <CheckCircle2 className="w-2 h-2" />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          
          {lowBandwidth && (
            <div className="flex justify-start">
              <div className="max-w-[80%] bg-white dark:bg-slate-800 rounded-2xl p-2 shadow-sm rounded-tl-none border-2 border-dashed border-primary/30">
                <div className="w-48 h-32 bg-slate-200 dark:bg-slate-700 flex flex-col items-center justify-center rounded-lg gap-2">
                  <ImageIcon className="w-8 h-8 opacity-30" />
                  <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1">
                    <Download className="w-3 h-3" /> Download (150KB)
                  </Button>
                </div>
                <p className="text-[10px] mt-1 text-muted-foreground italic">Low-resolution preview</p>
              </div>
            </div>
          )}
        </div>

        <footer className="p-3 bg-background border-t flex items-center gap-2 absolute bottom-0 left-0 right-0">
          <Button variant="ghost" size="icon" className="rounded-full shrink-0 text-muted-foreground" onClick={() => setInputText('/pay @ ')}>
            <DollarSign className="w-5 h-5" />
          </Button>
          <Input 
            placeholder="Type your message or /pay..." 
            className="rounded-full bg-muted border-none"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button onClick={handleSend} size="icon" className="rounded-full shrink-0">
            <Send className="w-4 h-4" />
          </Button>
        </footer>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <header className="p-4 bg-background border-b flex items-center justify-between">
        <h1 className="text-2xl font-black text-primary italic">Chats</h1>
        <Button variant="ghost" size="icon" className="rounded-full">
          <MessageSquare className="w-6 h-6" />
        </Button>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 bg-muted/30 mb-2">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 px-1">Active Communities</p>
          <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
            {contacts.filter(c => c.group).map(c => (
              <div key={c.id} className="flex flex-col items-center gap-1 shrink-0">
                <Avatar className="w-14 h-14 border-2 border-primary ring-2 ring-offset-2 ring-transparent">
                  <AvatarFallback>{c.name[0]}</AvatarFallback>
                </Avatar>
                <span className="text-[10px] font-bold truncate w-14 text-center">{c.name.split(' ')[0]}</span>
              </div>
            ))}
            <div className="flex flex-col items-center gap-1 shrink-0">
              <div className="w-14 h-14 rounded-full border-2 border-dashed flex items-center justify-center bg-muted">
                <span className="text-2xl font-bold opacity-30">+</span>
              </div>
              <span className="text-[10px] font-bold text-muted-foreground">New</span>
            </div>
          </div>
        </div>

        {contacts.map((c) => (
          <button 
            key={c.id} 
            onClick={() => setActiveChat(c.id)}
            className="w-full p-4 flex gap-3 hover:bg-muted transition-colors active:bg-muted border-b border-muted/50 text-left group"
          >
            <div className="relative">
              <Avatar className="w-12 h-12 ring-primary/20 group-hover:ring-2 transition-all">
                <AvatarFallback>{c.name[0]}</AvatarFallback>
              </Avatar>
              {c.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />}
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="flex justify-between items-center mb-0.5">
                <h4 className="font-bold text-sm truncate">{c.name}</h4>
                <span className="text-[10px] text-muted-foreground font-medium">{c.time}</span>
              </div>
              <p className="text-xs text-muted-foreground truncate">{c.lastMsg}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};