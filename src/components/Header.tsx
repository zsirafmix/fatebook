import React from 'react';
import { ActiveTab, UserProfile } from '../types';
import { BookOpen, MessageSquare, Home, Pin, Brain, Users, Mic, Monitor, Smartphone, LogOut, ShieldAlert, Shield } from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  deviceMode: 'desktop' | 'mobile';
  setDeviceMode: (mode: 'desktop' | 'mobile') => void;
  openVoiceModal: () => void;
  user: UserProfile;
  onLogout: () => void;
  onToggleAdminRole?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  deviceMode,
  setDeviceMode,
  openVoiceModal,
  user,
  onLogout,
  onToggleAdminRole,
}) => {
  const isAdmin = user.role === 'admin' || user.permissions?.canManageUsers;

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Kezdőlap', icon: <Home className="w-4 h-4" /> },
    { id: 'ai', label: 'FateAI', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'book', label: 'Könyvem', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'board', label: 'FateBoard', icon: <Pin className="w-4 h-4" /> },
    { id: 'memory', label: 'FateMemory', icon: <Brain className="w-4 h-4" /> },
    { id: 'family', label: 'FateFamily', icon: <Users className="w-4 h-4" /> },
  ];

  if (isAdmin) {
    navItems.push({
      id: 'admin',
      label: 'Admin',
      icon: <ShieldAlert className="w-4 h-4 text-red-400" />,
    });
  }

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between z-30 shrink-0 select-none">
      {/* Brand & Logo */}
      <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
        <div className="w-9 h-9 rounded-md bg-gradient-to-br from-rose-600 via-purple-700 to-blue-600 flex items-center justify-center font-extrabold text-white shadow-md text-xl tracking-tight">
          F
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xl font-extrabold tracking-tight text-white">
              FateBook<span className="text-rose-500">.</span>
            </span>
            <span className="hidden lg:inline-block text-[10px] text-slate-400 tracking-wider uppercase font-semibold bg-slate-800 px-2 py-0.5 rounded border border-slate-700/60">
              „Az életedből könyv lesz”
            </span>
          </div>
        </div>
      </div>

      {/* Desktop Main Navigation Tabs */}
      <nav className="hidden md:flex items-center bg-slate-800/80 p-1 rounded-lg border border-slate-700/60 text-xs font-semibold space-x-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const isItemAdmin = item.id === 'admin';
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3 py-1.5 rounded-md transition flex items-center space-x-1.5 ${
                isActive
                  ? isItemAdmin
                    ? 'bg-red-600 text-white shadow-sm font-bold'
                    : 'bg-slate-700 text-white shadow-sm font-bold'
                  : isItemAdmin
                  ? 'text-red-400 hover:text-white hover:bg-red-950/60'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Right Controls: Device Mode, Voice CTA, Admin Quick Access, Profile & Logout */}
      <div className="flex items-center space-x-3">
        
        {/* Admin Quick Action Button */}
        {isAdmin ? (
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-md font-black text-xs flex items-center space-x-1.5 transition border ${
              activeTab === 'admin'
                ? 'bg-red-600 border-red-500 text-white shadow-md'
                : 'bg-red-950/60 border-red-800/80 text-red-300 hover:bg-red-900'
            }`}
            title="Adminisztrátori Vezérlőpult megnyitása"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden sm:inline">Admin</span>
          </button>
        ) : (
          /* Subtle toggle button for testing Admin privileges */
          onToggleAdminRole && (
            <button
              onClick={onToggleAdminRole}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-400 border border-slate-700 font-mono transition"
              title="Kattints ide az Admin mód bekapcsolásához"
            >
              👑 Admin Mód
            </button>
          )
        )}

        {/* Responsive Frame Switcher */}
        <div className="flex items-center bg-slate-800/90 p-0.5 rounded border border-slate-700 text-xs">
          <button
            onClick={() => setDeviceMode('desktop')}
            title="Desktop 12-oszlopos elrendezés"
            className={`px-2.5 py-1 rounded flex items-center space-x-1 text-[11px] font-medium transition ${
              deviceMode === 'desktop' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>
          <button
            onClick={() => setDeviceMode('mobile')}
            title="Mobil keret és alsó navigáció szimulációja"
            className={`px-2.5 py-1 rounded flex items-center space-x-1 text-[11px] font-medium transition ${
              deviceMode === 'mobile' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobil keret</span>
          </button>
        </div>

        {/* Global 1-Tap Voice Storytelling Button */}
        <button
          onClick={openVoiceModal}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-3 sm:px-3.5 py-1.5 rounded-md font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-blue-900/30 transition transform hover:scale-[1.02] active:scale-95"
        >
          <Mic className="w-4 h-4 text-rose-300 animate-pulse" />
          <span className="hidden sm:inline">Mesélj most</span>
        </button>

        {/* User Profile Avatar with Admin Crown indicator */}
        <div
          onClick={() => setActiveTab('memory')}
          className="flex items-center space-x-2 pl-2 border-l border-slate-800 cursor-pointer relative"
          title={`Bejelentkezve: ${user.name} (${(user.role || 'user').toUpperCase()})`}
        >
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-rose-900 to-amber-900 border border-rose-500/50 flex items-center justify-center text-xs font-black text-rose-100 shadow relative">
            {user.name.charAt(0)}
            {isAdmin && (
              <span className="absolute -top-1.5 -right-1.5 text-[9px] bg-red-600 rounded-full px-1 text-white font-bold border border-slate-900 shadow">
                👑
              </span>
            )}
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          title="Kijelentkezés"
          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
