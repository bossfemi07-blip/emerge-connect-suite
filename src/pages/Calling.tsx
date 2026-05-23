import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { Phone, PhoneOff, Video, Mic, MicOff, VideoOff, Maximize2, ShieldCheck, Wifi, SignalHigh } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Calling: React.FC = () => {
  const { activeCall, endCall, setCallStatus, lowBandwidth } = useStore();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(activeCall.type === 'voice');
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval: any;
    if (activeCall.status === 'calling') {
      setTimeout(() => setCallStatus('connected'), 3000);
    } else if (activeCall.status === 'connected') {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [activeCall.status]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (activeCall.status === 'idle') return null;

  return (
    <motion.div 
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      className="fixed inset-0 z-[100] bg-slate-900 text-white flex flex-col"
    >
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-green-400" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">End-to-End Encrypted</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full">
          <Wifi className={`w-3 h-3 ${lowBandwidth ? 'text-yellow-400' : 'text-green-400'}`} />
          <span className="text-[10px] font-bold">{lowBandwidth ? 'Low-Bandwidth Mode' : 'High Quality'}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8">
        <div className="relative">
          <motion.div 
            animate={{ scale: activeCall.status === 'calling' ? [1, 1.1, 1] : 1 }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-32 h-32 rounded-full border-4 border-primary/30 p-1"
          >
            <Avatar className="w-full h-full">
              <AvatarFallback className="bg-primary text-4xl">{activeCall.remoteUser?.[0]}</AvatarFallback>
            </Avatar>
          </motion.div>
          {activeCall.status === 'connected' && !isVideoOff && !lowBandwidth && (
            <div className="absolute inset-0 rounded-full overflow-hidden bg-slate-800">
               <img 
                src="https://images.unsplash.com/photo-1531123897727-8f129e16fd3c?w=400&h=400&fit=crop" 
                className="w-full h-full object-cover" 
                alt="Video feed" 
              />
            </div>
          )}
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-black italic tracking-tighter">{activeCall.remoteUser || 'Unknown Hustler'}</h2>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">
            {activeCall.status === 'calling' ? 'Ringing...' : formatTime(timer)}
          </p>
        </div>

        {lowBandwidth && activeCall.status === 'connected' && (
          <div className="bg-yellow-400/10 border border-yellow-400/20 p-4 rounded-2xl max-w-xs text-center">
            <p className="text-[10px] font-black text-yellow-400 uppercase tracking-wider">SFU Adaptive Scaling Active</p>
            <p className="text-[8px] text-slate-400 mt-1">Video disabled to prioritize audio packets on your 3G connection.</p>
          </div>
        )}
      </div>

      <div className="p-12 bg-gradient-to-t from-slate-950 to-transparent flex flex-col items-center gap-8">
        <div className="flex gap-6">
          <Button 
            variant="ghost" 
            size="icon" 
            className={`w-14 h-14 rounded-full border-2 ${isMuted ? 'bg-white text-slate-900 border-white' : 'bg-transparent text-white border-white/20'}`}
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <MicOff /> : <Mic />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`w-14 h-14 rounded-full border-2 ${isVideoOff ? 'bg-white text-slate-900 border-white' : 'bg-transparent text-white border-white/20'}`}
            onClick={() => setIsVideoOff(!isVideoOff)}
            disabled={lowBandwidth}
          >
            {isVideoOff ? <VideoOff /> : <Video />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-14 h-14 rounded-full border-2 bg-transparent text-white border-white/20"
          >
            <Maximize2 />
          </Button>
        </div>
        
        <Button 
          variant="destructive" 
          size="icon" 
          className="w-20 h-20 rounded-full shadow-2xl shadow-red-500/20"
          onClick={endCall}
        >
          <PhoneOff className="w-8 h-8" />
        </Button>
      </div>
    </motion.div>
  );
};