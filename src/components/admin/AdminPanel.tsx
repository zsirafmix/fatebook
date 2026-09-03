import React, { useState } from 'react';
import { 
  UserProfile, UserRole, UserStatus, UserPermissions, 
  BookChapter, BoardStory, FateEntity 
} from '../../types';
import { 
  Shield, Users, BookOpen, Pin, Brain, Trash2, Edit, 
  UserX, UserCheck, AlertTriangle, Search, Check, X, 
  Sparkles, ShieldAlert, Key, Mic, FileText, Ban, Power, 
  Settings, CheckCircle2, Lock, Unlock
} from 'lucide-react';

interface AdminPanelProps {
  currentUser: UserProfile;
  users: UserProfile[];
  chapters: BookChapter[];
  boardStories: BoardStory[];
  entities: FateEntity[];
  onUpdateUser: (updatedUser: UserProfile) => void;
  onDeleteUser: (userId: string) => void;
  onBanUser: (userId: string, reason: string) => void;
  onUnbanUser: (userId: string) => void;
  onKickUser: (userId: string) => void;
  onDeleteChapter: (chapterId: string) => void;
  onDeleteBoardStory: (storyId: string) => void;
  onDeleteEntity: (entityId: string) => void;
  onResetAllData: () => void;
}

type AdminSubTab = 'users' | 'chapters' | 'board' | 'entities' | 'system';

export const AdminPanel: React.FC<AdminPanelProps> = ({
  currentUser,
  users,
  chapters,
  boardStories,
  entities,
  onUpdateUser,
  onDeleteUser,
  onBanUser,
  onUnbanUser,
  onKickUser,
  onDeleteChapter,
  onDeleteBoardStory,
  onDeleteEntity,
  onResetAllData,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<AdminSubTab>('users');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  
  // Modal for Editing User Permissions
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);

  // Filtered users
  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.penName.toLowerCase().includes(userSearchQuery.toLowerCase());
    const matchesRole = selectedRoleFilter === 'all' || u.role === selectedRoleFilter;
    return matchesSearch && matchesRole;
  });

  const handleSaveUserPermissions = () => {
    if (editingUser) {
      onUpdateUser(editingUser);
      setEditingUser(null);
    }
  };

  const togglePermission = (key: keyof UserPermissions) => {
    if (!editingUser) return;
    setEditingUser({
      ...editingUser,
      permissions: {
        ...editingUser.permissions,
        [key]: !editingUser.permissions[key],
      },
    });
  };

  return (
    <div className="flex-1 flex flex-col space-y-5 max-w-6xl mx-auto w-full pb-24 select-none">
      
      {/* 1. Admin Header Bar */}
      <div className="bg-gradient-to-r from-red-950 via-slate-900 to-slate-900 border border-red-800/60 rounded-xl p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-xl bg-red-600/20 border border-red-500/50 flex items-center justify-center text-red-400 shadow-inner">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center space-x-2">
                <span>FateBook Főadminisztrátori Vezérlőpult</span>
              </h1>
              <span className="bg-red-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider shadow">
                Root Admin
              </span>
            </div>
            <p className="text-slate-400 text-xs mt-1">
              Bejelentkezve mint: <strong className="text-white">{currentUser.name}</strong> ({currentUser.email}) • Teljes jogú rendszerkezelés
            </p>
          </div>
        </div>

        {/* Global Reset Emergency Button */}
        <button
          onClick={() => {
            if (confirm("⚠️ BIZTOSAN VISSZAÁLLÍTOD AZ ALAPÉRTELMEZETT RENDSZERADATOKAT? Minden nem mentett tesztadat törlődik!")) {
              onResetAllData();
            }
          }}
          className="bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-700/80 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 shadow active:scale-95"
        >
          <Power className="w-3.5 h-3.5" />
          <span>Gyári Adatok Visszaállítása</span>
        </button>
      </div>

      {/* 2. Admin KPI Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Összes Felhasználó</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-1.5">
            {users.length} <span className="text-xs text-slate-400 font-normal">fiók</span>
          </div>
          <div className="text-[10px] text-emerald-400 mt-1 font-semibold">
            {users.filter(u => u.status === 'active').length} aktív • {users.filter(u => u.status === 'banned').length} kitiltva
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Könyv Fejezetek</span>
            <BookOpen className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-1.5">
            {chapters.length} <span className="text-xs text-slate-400 font-normal">fejezet</span>
          </div>
          <div className="text-[10px] text-rose-300 mt-1 font-semibold">
            Kánonba rögzített memoárok
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>FateBoard Történetek</span>
            <Pin className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-1.5">
            {boardStories.length} <span className="text-xs text-slate-400 font-normal">poszt</span>
          </div>
          <div className="text-[10px] text-amber-300 mt-1 font-semibold">
            Anonim közösségi parafatábla
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>FateMemory Entitások</span>
            <Brain className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-1.5">
            {entities.length} <span className="text-xs text-slate-400 font-normal">entitás</span>
          </div>
          <div className="text-[10px] text-purple-300 mt-1 font-semibold">
            Szereplők, helyek és tárgyak
          </div>
        </div>
      </div>

      {/* 3. Sub-Navigation Tabs */}
      <div className="flex items-center space-x-1.5 bg-slate-900/90 border border-slate-800 p-1.5 rounded-xl text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('users')}
          className={`px-3.5 py-2 rounded-lg transition flex items-center space-x-2 shrink-0 ${
            activeSubTab === 'users'
              ? 'bg-red-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Felhasználók & Jogosultságok ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('chapters')}
          className={`px-3.5 py-2 rounded-lg transition flex items-center space-x-2 shrink-0 ${
            activeSubTab === 'chapters'
              ? 'bg-rose-700 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Fejezetek Moderációja ({chapters.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('board')}
          className={`px-3.5 py-2 rounded-lg transition flex items-center space-x-2 shrink-0 ${
            activeSubTab === 'board'
              ? 'bg-amber-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Pin className="w-4 h-4" />
          <span>FateBoard Posztok ({boardStories.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('entities')}
          className={`px-3.5 py-2 rounded-lg transition flex items-center space-x-2 shrink-0 ${
            activeSubTab === 'entities'
              ? 'bg-purple-700 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Brain className="w-4 h-4" />
          <span>FateMemory Entitások ({entities.length})</span>
        </button>
      </div>

      {/* 4. SUB-TAB 1: USERS & PERMISSIONS MANAGEMENT */}
      {activeSubTab === 'users' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-xl flex flex-col space-y-4">
          
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                placeholder="Keresés név, email vagy jelige alapján..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition"
              />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <span className="text-xs text-slate-400 font-semibold">Szerepkör szűrő:</span>
              <select
                value={selectedRoleFilter}
                onChange={(e) => setSelectedRoleFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-red-500 cursor-pointer"
              >
                <option value="all">Minden szerepkör</option>
                <option value="admin">Csak Adminok (👑)</option>
                <option value="moderator">Csak Moderátorok (🛡️)</option>
                <option value="editor">Csak Szerkesztők (✍️)</option>
                <option value="user">Sima Felhasználók (👤)</option>
              </select>
            </div>
          </div>

          {/* User Table */}
          <div className="overflow-x-auto border border-slate-800 rounded-lg">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-extrabold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Felhasználó & Jelige</th>
                  <th className="py-3 px-3">Email</th>
                  <th className="py-3 px-3">Szerepkör</th>
                  <th className="py-3 px-3">Csomag</th>
                  <th className="py-3 px-3">Állapot</th>
                  <th className="py-3 px-3">Engedélyezett Jogok</th>
                  <th className="py-3 px-4 text-right">Műveletek</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {filteredUsers.map((u) => {
                  const isBanned = u.status === 'banned';
                  const isCurrent = u.id === currentUser.id;

                  return (
                    <tr key={u.id} className="hover:bg-slate-800/40 transition">
                      {/* Name & Pen Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-slate-700 to-slate-900 border border-slate-700 flex items-center justify-center font-black text-white text-xs">
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-white block">{u.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">@{u.penName}</span>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3 px-3 text-slate-300 font-mono text-[11px]">
                        {u.email}
                      </td>

                      {/* Role Badge */}
                      <td className="py-3 px-3">
                        {u.role === 'admin' && (
                          <span className="inline-flex items-center space-x-1 bg-red-950 text-red-300 border border-red-800 px-2 py-0.5 rounded text-[10px] font-black uppercase">
                            <span>👑 Admin</span>
                          </span>
                        )}
                        {u.role === 'moderator' && (
                          <span className="inline-flex items-center space-x-1 bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded text-[10px] font-black uppercase">
                            <span>🛡️ Moderátor</span>
                          </span>
                        )}
                        {u.role === 'editor' && (
                          <span className="inline-flex items-center space-x-1 bg-purple-950 text-purple-300 border border-purple-800 px-2 py-0.5 rounded text-[10px] font-black uppercase">
                            <span>✍️ Szerkesztő</span>
                          </span>
                        )}
                        {u.role === 'user' && (
                          <span className="inline-flex items-center space-x-1 bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded text-[10px] font-black uppercase">
                            <span>👤 Felhasználó</span>
                          </span>
                        )}
                      </td>

                      {/* Tier */}
                      <td className="py-3 px-3">
                        <span className="capitalize text-[11px] font-bold text-amber-300">
                          {u.tier}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3">
                        {isBanned ? (
                          <span className="bg-red-900/60 text-red-200 border border-red-700 px-2 py-0.5 rounded text-[10px] font-bold flex items-center space-x-1 w-fit">
                            <Ban className="w-3 h-3" />
                            <span>Kitiltva</span>
                          </span>
                        ) : u.status === 'suspended' ? (
                          <span className="bg-amber-900/60 text-amber-200 border border-amber-700 px-2 py-0.5 rounded text-[10px] font-bold w-fit block">
                            Felfüggesztve
                          </span>
                        ) : (
                          <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold flex items-center space-x-1 w-fit">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Aktív</span>
                          </span>
                        )}
                      </td>

                      {/* Permissions icons */}
                      <td className="py-3 px-3">
                        <div className="flex items-center space-x-1.5 text-slate-400">
                          <span title={u.permissions?.canVoiceRecord ? 'Hangrögzítés engedélyezve' : 'Hangrögzítés letiltva'}>
                            <Mic className={`w-3.5 h-3.5 ${u.permissions?.canVoiceRecord ? 'text-emerald-400' : 'text-slate-600 opacity-40'}`} />
                          </span>
                          <span title={u.permissions?.canCreateChapters ? 'Fejezetgenerálás engedélyezve' : 'Fejezetgenerálás letiltva'}>
                            <BookOpen className={`w-3.5 h-3.5 ${u.permissions?.canCreateChapters ? 'text-rose-400' : 'text-slate-600 opacity-40'}`} />
                          </span>
                          <span title={u.permissions?.canPostToBoard ? 'FateBoard poszt engedélyezve' : 'FateBoard poszt letiltva'}>
                            <Pin className={`w-3.5 h-3.5 ${u.permissions?.canPostToBoard ? 'text-amber-400' : 'text-slate-600 opacity-40'}`} />
                          </span>
                          <span title={u.permissions?.canUseAi ? 'AI hozzáférés engedélyezve' : 'AI hozzáférés letiltva'}>
                            <Sparkles className={`w-3.5 h-3.5 ${u.permissions?.canUseAi ? 'text-blue-400' : 'text-slate-600 opacity-40'}`} />
                          </span>
                          <span title={u.permissions?.canExportPdf ? 'PDF nyomtatás engedélyezve' : 'PDF nyomtatás letiltva'}>
                            <FileText className={`w-3.5 h-3.5 ${u.permissions?.canExportPdf ? 'text-purple-400' : 'text-slate-600 opacity-40'}`} />
                          </span>
                        </div>
                      </td>

                      {/* Action buttons */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          {/* Edit Permissions Button */}
                          <button
                            onClick={() => setEditingUser({ ...u })}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-blue-300 rounded border border-slate-700 transition"
                            title="Jogosultságok & Szerepkör szerkesztése"
                          >
                            <Key className="w-3.5 h-3.5" />
                          </button>

                          {/* Kick Session Button */}
                          {!isCurrent && (
                            <button
                              onClick={() => onKickUser(u.id)}
                              className="p-1.5 bg-slate-800 hover:bg-amber-900/60 text-amber-300 rounded border border-slate-700 transition"
                              title="Felhasználó kirúgása (Munkamenet bontása)"
                            >
                              <UserX className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Ban / Unban Button */}
                          {!isCurrent && (
                            isBanned ? (
                              <button
                                onClick={() => onUnbanUser(u.id)}
                                className="p-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 rounded border border-emerald-800 transition"
                                title="Kitiltás feloldása"
                              >
                                <UserCheck className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  const reason = prompt("Add meg a kitiltás indokát:", "Közösségi irányelvek megsértése");
                                  if (reason) onBanUser(u.id, reason);
                                }}
                                className="p-1.5 bg-red-950 hover:bg-red-900 text-red-300 rounded border border-red-800 transition"
                                title="Felhasználó kitiltása"
                              >
                                <Ban className="w-3.5 h-3.5" />
                              </button>
                            )
                          )}

                          {/* Delete User Button */}
                          {!isCurrent && (
                            <button
                              onClick={() => {
                                if (confirm(`⚠️ VÉGLEGES TÖRLÉS: Biztosan törlöd "${u.name}" felhasználót és minden adatát?`)) {
                                  onDeleteUser(u.id);
                                }
                              }}
                              className="p-1.5 bg-slate-800 hover:bg-red-950 text-red-400 hover:text-red-200 rounded border border-slate-700 transition"
                              title="Felhasználó végleges törlése"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* 5. SUB-TAB 2: CHAPTERS MODERATION */}
      {activeSubTab === 'chapters' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-xl flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase text-rose-300">
              Rendszerben Lévő Könyv Fejezetek ({chapters.length})
            </h3>
            <span className="text-xs text-slate-400">Bármely fejezet azonnal szerkeszthető vagy törölhető</span>
          </div>

          <div className="space-y-3">
            {chapters.length > 0 ? (
              chapters.map((ch) => (
                <div key={ch.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-bold text-rose-400">{ch.timeBracket}</span>
                      <span className="text-slate-400 text-xs">• {ch.volumeName}</span>
                      <span className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded font-bold">
                        {ch.status}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-white mt-1">„{ch.title}”</h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {ch.content}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => {
                        const newTitle = prompt("Új fejezetcím:", ch.title);
                        if (newTitle) {
                          ch.title = newTitle;
                          alert("Fejezetcím frissítve!");
                        }
                      }}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-blue-300 rounded-lg text-xs font-bold transition flex items-center space-x-1"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Cím Szerkesztése</span>
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Biztosan törlöd a(z) "${ch.title}" fejezetet a kánonból?`)) {
                          onDeleteChapter(ch.id);
                        }
                      }}
                      className="px-3 py-1.5 bg-red-950 hover:bg-red-900 text-red-200 border border-red-800 rounded-lg text-xs font-bold transition flex items-center space-x-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Törlés</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-slate-500">Nincsenek fejezetek a rendszerben.</div>
            )}
          </div>
        </div>
      )}

      {/* 6. SUB-TAB 3: FATEBOARD STORIES MODERATION */}
      {activeSubTab === 'board' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-xl flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase text-amber-300">
              FateBoard Közösségi Történetek Moderációja ({boardStories.length})
            </h3>
            <span className="text-xs text-slate-400">Nem megfelelő vagy spam posztok törlése</span>
          </div>

          <div className="space-y-3">
            {boardStories.map((story) => (
              <div key={story.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-amber-400">@{story.authorPenName}</span>
                    <span className="text-slate-400 text-xs">• {story.era} • {story.location}</span>
                  </div>
                  <h4 className="text-base font-bold text-white mt-1">„{story.title}”</h4>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                    {story.content}
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => {
                      if (confirm(`Biztosan törlöd ezt a történetet a FateBoardról: "${story.title}"?`)) {
                        onDeleteBoardStory(story.id);
                      }
                    }}
                    className="px-3 py-1.5 bg-red-950 hover:bg-red-900 text-red-200 border border-red-800 rounded-lg text-xs font-bold transition flex items-center space-x-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Poszt Törlése</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. SUB-TAB 4: FATEMEMORY ENTITIES */}
      {activeSubTab === 'entities' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-xl flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase text-purple-300">
              FateMemory Tudásbázis Entitások ({entities.length})
            </h3>
            <span className="text-xs text-slate-400">Entitások moderálása és törlése</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {entities.map((ent) => (
              <div key={ent.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">{ent.name}</span>
                    <span className="text-[10px] bg-purple-950 text-purple-300 px-1.5 py-0.5 rounded font-mono uppercase">
                      {ent.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1 leading-snug">{ent.details}</p>
                </div>

                <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-800 text-[10px]">
                  <span className="text-slate-400">{ent.confidence === 'verified' ? '✅ Megerősítve' : '❓ Hipotézis'}</span>
                  <button
                    onClick={() => onDeleteEntity(ent.id)}
                    className="text-red-400 hover:text-red-200 font-bold transition"
                  >
                    Törlés
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT USER ROLES & PERMISSIONS */}
      {/* ========================================================================= */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-fadeIn text-xs">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-red-500" />
                <h3 className="text-base font-black text-white">
                  Jogosultságok & Szerepkör: {editingUser.name}
                </h3>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 py-4">
              
              {/* Role Selector */}
              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  Rendszer Szerepkör:
                </label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as UserRole })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                >
                  <option value="admin">👑 Adminisztrátor (Minden jog, törlés, kitiltás)</option>
                  <option value="moderator">🛡️ Moderátor (Közösségi fal, bejegyzések)</option>
                  <option value="editor">✍️ Szerkesztő (Könyvszerkesztés, lektorálás)</option>
                  <option value="user">👤 Általános Felhasználó</option>
                </select>
              </div>

              {/* Tier Selector */}
              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  Előfizetési Csomag (Tier):
                </label>
                <select
                  value={editingUser.tier}
                  onChange={(e) => setEditingUser({ ...editingUser, tier: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                >
                  <option value="free">Ingyenes (Alapfunkciók)</option>
                  <option value="plus">FateBook Plus (Korlátlan hang, AI)</option>
                  <option value="family">FateFamily (Családi megosztás)</option>
                  <option value="lifetime">Örökös Tagság (VIP)</option>
                </select>
              </div>

              {/* Granular Permissions Checkboxes */}
              <div>
                <label className="text-slate-300 font-bold block mb-2">
                  Finomhangolt Jogosultságok:
                </label>

                <div className="space-y-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-slate-300 font-semibold flex items-center space-x-2">
                      <Mic className="w-3.5 h-3.5 text-blue-400" />
                      <span>Hangrögzítés és mikrofon használat</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={editingUser.permissions?.canVoiceRecord}
                      onChange={() => togglePermission('canVoiceRecord')}
                      className="rounded accent-red-600 w-4 h-4 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-slate-300 font-semibold flex items-center space-x-2">
                      <BookOpen className="w-3.5 h-3.5 text-rose-400" />
                      <span>Új fejezetek generálása és mentése</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={editingUser.permissions?.canCreateChapters}
                      onChange={() => togglePermission('canCreateChapters')}
                      className="rounded accent-red-600 w-4 h-4 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-slate-300 font-semibold flex items-center space-x-2">
                      <Pin className="w-3.5 h-3.5 text-amber-400" />
                      <span>FateBoard posztolási jog (közösségi fal)</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={editingUser.permissions?.canPostToBoard}
                      onChange={() => togglePermission('canPostToBoard')}
                      className="rounded accent-red-600 w-4 h-4 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-slate-300 font-semibold flex items-center space-x-2">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      <span>AI életrajzíró csevegés hozzáférés</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={editingUser.permissions?.canUseAi}
                      onChange={() => togglePermission('canUseAi')}
                      className="rounded accent-red-600 w-4 h-4 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-slate-300 font-semibold flex items-center space-x-2">
                      <FileText className="w-3.5 h-3.5 text-teal-400" />
                      <span>PDF és Keménykötés export</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={editingUser.permissions?.canExportPdf}
                      onChange={() => togglePermission('canExportPdf')}
                      className="rounded accent-red-600 w-4 h-4 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer pt-1 border-t border-slate-800">
                    <span className="text-red-300 font-bold flex items-center space-x-2">
                      <Shield className="w-3.5 h-3.5 text-red-500" />
                      <span>Adminisztrátori / Felhasználókezelési jog</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={editingUser.permissions?.canManageUsers}
                      onChange={() => togglePermission('canManageUsers')}
                      className="rounded accent-red-600 w-4 h-4 cursor-pointer"
                    />
                  </label>

                </div>
              </div>

            </div>

            {/* Modal Buttons */}
            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition"
              >
                Mégse
              </button>
              <button
                type="button"
                onClick={handleSaveUserPermissions}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl shadow-lg transition active:scale-95"
              >
                Módosítások Mentése
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
