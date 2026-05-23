import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  phone: string;
  username: string;
  avatar: string;
}

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
  status: 'SENT' | 'DELIVERED' | 'READ' | 'PENDING';
  isMedia?: boolean;
}

interface Transaction {
  id: string;
  amount: number;
  type: 'IN' | 'OUT';
  description: string;
  timestamp: number;
}

interface CallSession {
  type: 'voice' | 'video';
  status: 'idle' | 'calling' | 'connected' | 'ended';
  remoteUser: string | null;
}

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  lowBandwidth: boolean;
  isOffline: boolean;
  walletBalance: number;
  transactions: Transaction[];
  messages: Record<string, Message[]>;
  currentTab: 'chat' | 'feed' | 'shorts' | 'wallet' | 'ai';
  activeCall: CallSession;
  
  // Actions
  login: (phone: string, username: string) => void;
  logout: () => void;
  setTab: (tab: AppState['currentTab']) => void;
  toggleLowBandwidth: () => void;
  toggleOffline: () => void;
  addMessage: (chatId: string, message: Message) => void;
  sendPayment: (amount: number, recipient: string) => void;
  syncMessages: () => void;
  initiateCall: (type: 'voice' | 'video', user: string) => void;
  endCall: () => void;
  setCallStatus: (status: CallSession['status']) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      lowBandwidth: false,
      isOffline: false,
      walletBalance: 25000.50,
      transactions: [
        { id: '1', amount: 5000, type: 'IN', description: 'Wallet Top-up', timestamp: Date.now() - 86400000 },
        { id: '2', amount: 1200, type: 'OUT', description: 'Payment to @Kola', timestamp: Date.now() - 43200000 },
      ],
      messages: {
        'kola': [
          { id: 'm1', senderId: 'kola', text: 'How far, you don see the market updates?', timestamp: Date.now() - 3600000, status: 'READ' },
          { id: 'm2', senderId: 'me', text: 'I dey see am now. Nigeria market go soon boom!', timestamp: Date.now() - 1800000, status: 'READ' },
        ],
        'bola': [
          { id: 'b1', senderId: 'bola', text: 'Abeg, check that hustle assistant. It works well!', timestamp: Date.now() - 7200000, status: 'READ' },
        ]
      },
      currentTab: 'chat',
      activeCall: { type: 'voice', status: 'idle', remoteUser: null },

      login: (phone, username) => set({ 
        user: { id: 'me', phone, username, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + username }, 
        isAuthenticated: true 
      }),
      logout: () => set({ user: null, isAuthenticated: false }),
      setTab: (tab) => set({ currentTab: tab }),
      toggleLowBandwidth: () => set((state) => ({ lowBandwidth: !state.lowBandwidth })),
      toggleOffline: () => {
        const newOffline = !get().isOffline;
        set({ isOffline: newOffline });
        if (!newOffline) get().syncMessages();
      },
      addMessage: (chatId, message) => set((state) => ({
        messages: {
          ...state.messages,
          [chatId]: [...(state.messages[chatId] || []), message]
        }
      })),
      sendPayment: (amount, recipient) => set((state) => ({
        walletBalance: state.walletBalance - amount,
        transactions: [
          { id: Math.random().toString(), amount, type: 'OUT', description: `Paid ${recipient}`, timestamp: Date.now() },
          ...state.transactions
        ]
      })),
      syncMessages: () => {
        set((state) => {
          const newMessages = { ...state.messages };
          Object.keys(newMessages).forEach(chatId => {
            newMessages[chatId] = newMessages[chatId].map(m => 
              m.status === 'PENDING' ? { ...m, status: 'SENT' } : m
            );
          });
          return { messages: newMessages };
        });
      },
      initiateCall: (type, user) => set({ activeCall: { type, status: 'calling', remoteUser: user } }),
      endCall: () => set({ activeCall: { type: 'voice', status: 'idle', remoteUser: null } }),
      setCallStatus: (status) => set((state) => ({ activeCall: { ...state.activeCall, status } }))
    }),
    { name: 'femschat-storage-v2' }
  )
);