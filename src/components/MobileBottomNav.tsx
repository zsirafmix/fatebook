import React from 'react';
import { ActiveTab } from '../types';
import { Home, MessageSquare, BookOpen, Pin, User, ShieldAlert } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isAdmin?: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeTab, setActiveTab, isAdmin }) => {
  const items: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Kezdőlap', icon: <Home className="w-5 h-5" /> },
    { id: 'ai', label: 'AI', icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'book', label: 'Könyvem', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'board', label: 'FateBoard', icon: <Pin className="w-5 h-5" /> },
    { id: 'memory', label: 'Profil', icon: <User className="w-5 h-5" /> },
  ];

  if (isAdmin) {
    items.push({
      id: 'admin',
      label: 'Admin',
      icon: <ShieldAlert className="w-5 h-5 text-red-400" />,
    });
  }

  return (
    <nav className="h-16 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 flex items-center justify-around z-40 px-2 shrink-0 select-none">
      {items.map((item) => {
        const isActive = activeTab === item.id;
        const isItemAdmin = item.id === 'admin';
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center flex-1 py-1 space-y-1 text-[10px] font-semibold transition ${
              isActive 
                ? isItemAdmin ? 'text-red-400 font-bold scale-105' : 'text-rose-400 font-bold scale-105'
                : isItemAdmin ? 'text-red-500/80 hover:text-red-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
