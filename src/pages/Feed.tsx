import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Card } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Heart, MessageCircle, Share2, Play, Search, TrendingUp, Music2, Bookmark, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Feed: React.FC = () => {
  const [activeView, setActiveView] = useState<'trending' | 'shorts'>('trending');
  const [activeShortIdx, setActiveShortIdx] = useState(0);
  const lowBandwidth = useStore(state => state.lowBandwidth);

  const posts = [
    {
      id: 1,
      author: 'Adebayo Market',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ade',
      content: 'Fresh Lagos Stock! Pure cotton fabrics available now. Location: Balogun Market.',
      image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/e48c463b-5947-4f56-9b9e-6c70334ab720/market-feed-1-a3208c4a-1779550511080.webp',
      likes: '2.4k',
      comments: 156
    },
    {
      id: 2,
      author: 'TechHustle NG',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tech',
      content: 'How to save data on FemsChat while streaming: Toggle Low-Bandwidth mode in settings! 🚀',
      likes: '890',
      comments: 42
    }
  ];

  const shorts = [
    { id: 1, author: '@jollof_queen', thumb: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/e48c463b-5947-4f56-9b9e-6c70334ab720/shorts-thumb-1-60b55020-1779550510864.webp', title: 'Cooking Party Jollof', views: '1.2M', likes: '200k', music: 'Burna Boy - Tested, Approved & Trusted' },
    { id: 2, author: '@lagos_vibes', thumb: 'https://images.unsplash.com/photo-1540553016722-983e48a2cd10?w=400&h=600&fit=crop', title: 'Lagos Night Life', views: '800k', likes: '50k', music: 'Wizkid - Pieces of My Heart' },
    { id: 3, author: '@hustle_king', thumb: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=600&fit=crop', title: 'Hustle Beats Vol 1', views: '500k', likes: '12k', music: 'Original Audio' },
  ];

  const handleShortClick = (idx: number) => {
    setActiveShortIdx(idx);
    setActiveView('shorts');
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden relative">
      <header className={`p-4 flex items-center justify-between shrink-0 z-20 ${activeView === 'shorts' ? 'bg-transparent text-white absolute top-0 left-0 right-0' : 'bg-background'}`}>
        <div className="flex gap-4">
          <button 
            onClick={() => setActiveView('trending')}
            className={`text-xl font-black italic tracking-tighter transition-all ${activeView === 'trending' ? 'text-primary scale-110' : (activeView === 'shorts' ? 'text-white/60' : 'text-muted-foreground')}`}
          >
            Trending
          </button>
          <button 
            onClick={() => setActiveView('shorts')}
            className={`text-xl font-black italic tracking-tighter transition-all ${activeView === 'shorts' ? 'text-white scale-110' : 'text-muted-foreground'}`}
          >
            Shorts
          </button>
        </div>
        <Search className={`w-6 h-6 ${activeView === 'shorts' ? 'text-white' : 'text-muted-foreground'}`} />
      </header>

      {activeView === 'trending' ? (
        <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-20 no-scrollbar">
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {['Market', 'Music', 'Tech', 'Politics', 'Sports'].map(tag => (
              <div key={tag} className="px-4 py-2 rounded-full bg-muted border font-bold text-xs shrink-0 flex items-center gap-2">
                <TrendingUp className="w-3 h-3 text-primary" /> {tag}
              </div>
            ))}
          </div>

          {posts.map(post => (
            <Card key={post.id} className="border-none shadow-none bg-transparent">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10 ring-2 ring-primary/20">
                    <AvatarImage src={post.avatar} />
                    <AvatarFallback>{post.author[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-bold text-sm">{post.author}</h4>
                    <p className="text-[10px] text-muted-foreground">Sponsored • 2h ago</p>
                  </div>
                </div>
                <MoreVertical className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-sm mb-3 leading-relaxed">{post.content}</p>
              {!lowBandwidth && post.image && (
                <div className="rounded-2xl overflow-hidden mb-3 aspect-[4/3] bg-muted relative group">
                  <img src={post.image} className="w-full h-full object-cover" alt="Post" />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all" />
                </div>
              )}
              {lowBandwidth && (
                <div className="h-20 bg-muted rounded-2xl flex items-center justify-center mb-3 border-2 border-dashed">
                  <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest italic">Data Saving Active</span>
                </div>
              )}
              <div className="flex items-center justify-between pt-2 px-1">
                <div className="flex gap-4">
                  <button className="flex items-center gap-1.5 text-xs font-bold"><Heart className="w-5 h-5" /> {post.likes}</button>
                  <button className="flex items-center gap-1.5 text-xs font-bold"><MessageCircle className="w-5 h-5" /> {post.comments}</button>
                </div>
                <div className="flex gap-4">
                  <Bookmark className="w-5 h-5 text-muted-foreground" />
                  <Share2 className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex-1 bg-black relative">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeShortIdx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
              onClick={() => setActiveShortIdx((activeShortIdx + 1) % shorts.length)}
            >
              <img 
                src={shorts[activeShortIdx].thumb} 
                className="w-full h-full object-cover opacity-80" 
                alt="Short" 
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
              
              <div className="absolute bottom-24 left-4 right-16 space-y-3">
                <div className="flex items-center gap-2">
                  <Avatar className="w-9 h-9 border-2 border-white">
                    <AvatarFallback>{shorts[activeShortIdx].author[1]}</AvatarFallback>
                  </Avatar>
                  <span className="text-white font-bold text-sm">{shorts[activeShortIdx].author}</span>
                  <button className="bg-primary text-[10px] px-3 py-1 rounded-full font-black uppercase text-white">Follow</button>
                </div>
                <p className="text-white text-sm font-medium">{shorts[activeShortIdx].title}</p>
                <div className="flex items-center gap-2 text-white/80">
                  <Music2 className="w-3 h-3 animate-spin" style={{ animationDuration: '3s' }} />
                  <span className="text-[10px] font-bold truncate">{shorts[activeShortIdx].music}</span>
                </div>
              </div>

              <div className="absolute right-4 bottom-24 flex flex-col items-center gap-6 text-white">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 fill-red-500 text-red-500" />
                  </div>
                  <span className="text-[10px] font-black">{shorts[activeShortIdx].likes}</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black">2.1k</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center">
                    <Share2 className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black">Share</span>
                </div>
              </div>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-20">
                <Play className="w-20 h-20 text-white fill-current" />
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1">
            {shorts.map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all ${i === activeShortIdx ? 'w-8 bg-white' : 'w-4 bg-white/40'}`} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};