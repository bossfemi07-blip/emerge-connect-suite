import React from 'react';
import { useStore } from './store/useStore';
import { MessageSquare, LayoutGrid, PlayCircle, Wallet as WalletIcon, BrainCircuit, Settings, Wifi, WifiOff } from 'lucide-react';
import { Chat } from './pages/Chat';
import { Feed } from './pages/Feed';
import { Wallet } from './pages/Wallet';
import { AI } from './pages/AI';
import { Auth } from './pages/Auth';
import { Calling } from './pages/Calling';
import { Button } from './components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from './components/ui/dropdown-menu';
import { Toaster } from 'sonner';
import { AnimatePresence } from 'framer-motion';

const Navigation: React.FC = () => {
  const { currentTab, setTab } = useStore();
  
  const navItems = [
    { id: 'chat', icon: MessageSquare, label: 'Chat' },
    { id: 'feed', icon: LayoutGrid, label: 'Feed' },
    { id: 'shorts', icon: PlayCircle, label: 'Shorts' },
    { id: 'wallet', icon: WalletIcon, label: 'Wallet' },
    { id: 'ai', icon: BrainCircuit, label: 'Fems AI' },
  ];

  return (
    <nav className="flex items-center justify-around h-20 bg-background border-t px-2 pb-2 z-40">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setTab(item.id as any)}
          className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all ${
            currentTab === item.id 
              ? 'text-primary' 
              : 'text-muted-foreground'
          }`}
        >
          <div className={`p-2 rounded-2xl transition-colors ${currentTab === item.id ? 'bg-primary/10' : ''}`}>
            <item.icon className={`w-6 h-6 ${currentTab === item.id ? 'stroke-[2.5px]' : 'stroke-[1.5px]'}`} />
          </div>
          <span className={`text-[9px] font-black uppercase tracking-widest ${currentTab === item.id ? 'opacity-100' : 'opacity-60'}`}>
            {item.label}
          </span>
        </button>
      ))}
    </nav>
  );
};

const SettingsMenu: React.FC = () => {
  const { lowBandwidth, isOffline, toggleLowBandwidth, toggleOffline, logout } = useStore();

  return (
    <div className="fixed top-4 right-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full shadow-lg border-2 bg-background/50 backdrop-blur-md">
            <Settings className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 font-bold rounded-2xl p-2 shadow-2xl border-2">
          <DropdownMenuLabel className="italic px-3 py-2">App Settings</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={toggleLowBandwidth} className="flex justify-between items-center px-3 py-2 rounded-xl focus:bg-primary/10">
            <span className="text-xs uppercase tracking-widest">Low Bandwidth</span>
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${lowBandwidth ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>{lowBandwidth ? 'ON' : 'OFF'}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={toggleOffline} className="flex justify-between items-center px-3 py-2 rounded-xl focus:bg-primary/10">
            <span className="text-xs uppercase tracking-widest">Offline Mode</span>
            {isOffline ? <WifiOff className="w-4 h-4 text-destructive" /> : <Wifi className="w-4 h-4 text-primary" />}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout} className="text-destructive font-black px-3 py-2 rounded-xl focus:bg-destructive/10">
            LOGOUT
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default function App() {
  const { isAuthenticated, currentTab, isOffline, activeCall } = useStore();

  if (!isAuthenticated) {
    return (
      <main className="h-screen w-full bg-background overflow-hidden">
        <Auth />
        <Toaster position="top-center" richColors />
      </main>
    );
  }

  return (
    <main className="h-screen w-full bg-slate-200 flex items-center justify-center p-0 sm:p-4 overflow-hidden font-sans">
      <div className="w-full h-full max-w-[480px] bg-background shadow-2xl relative flex flex-col sm:rounded-[3.5rem] sm:border-[16px] sm:border-slate-900 overflow-hidden">
        {/* Dynamic Safe Area Top */}
        <div className="h-8 bg-background flex items-center justify-center px-8 sm:h-12">
            <div className="w-24 h-6 bg-slate-900 rounded-b-3xl sm:block hidden absolute top-0" />
            <div className="flex justify-between w-full text-[10px] font-black">
                <span>9:41</span>
                <div className="flex gap-1 items-center">
                    <Wifi className="w-3 h-3" />
                    <div className="w-5 h-2.5 border border-foreground/30 rounded-[2px] relative">
                        <div className="absolute left-0 top-0 bottom-0 bg-foreground w-4 m-px" />
                    </div>
                </div>
            </div>
        </div>

        {isOffline && (
          <div className="bg-destructive text-destructive-foreground text-[10px] font-black py-1 text-center uppercase tracking-[0.2em] animate-pulse z-50">
            Offline Mode • Messages will sync later
          </div>
        )}
        
        <SettingsMenu />
        
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence>
            {currentTab === 'chat' && <Chat />}
            {(currentTab === 'feed' || currentTab === 'shorts') && <Feed />}
            {currentTab === 'wallet' && <Wallet />}
            {currentTab === 'ai' && <AI />}
          </AnimatePresence>
        </div>

        <Navigation />

        <AnimatePresence>
          {activeCall.status !== 'idle' && <Calling />}
        </AnimatePresence>

        {/* Home Indicator */}
        <div className="h-1.5 w-32 bg-slate-300 rounded-full mx-auto mb-2 opacity-50" />
      </div>
      <Toaster position="top-center" richColors />
    </main>
  );
}