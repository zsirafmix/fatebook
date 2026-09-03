import React, { useState, useEffect } from 'react';
import { 
  ActiveTab, UserProfile, ChatMessage, FateEntity, 
  ContradictionItem, BookChapter, BoardStory, AiPersona, UserRole 
} from './types';
import { 
  initialUser, initialSystemUsers, initialMessages, initialEntities, 
  initialContradictions, initialChapters, initialBoardStories, initialFamilyEvent,
  defaultPermissions, adminPermissions 
} from './data/initialData';

import { AuthScreen } from './components/auth/AuthScreen';
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { LiveTileDashboard } from './components/dashboard/LiveTileDashboard';
import { FateAiChat } from './components/ai/FateAiChat';
import { VoiceStudioModal } from './components/ai/VoiceStudioModal';
import { ChapterWizardModal } from './components/ai/ChapterWizardModal';
import { BookReader } from './components/book/BookReader';
import { PrintWizardModal } from './components/book/PrintWizardModal';
import { FateBoard } from './components/board/FateBoard';
import { PrivacyCheckModal } from './components/board/PrivacyCheckModal';
import { FateMemoryGraph } from './components/memory/FateMemoryGraph';
import { ContradictionModal } from './components/memory/ContradictionModal';
import { FateFamilyView } from './components/family/FateFamilyView';
import { AdminPanel } from './components/admin/AdminPanel';
import { Ban, LogOut } from 'lucide-react';

export const App: React.FC = () => {
  // Authentication State
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('fatebook_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // System Users Registry for Admin Panel
  const [systemUsers, setSystemUsers] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem('fatebook_system_users');
      return saved ? JSON.parse(saved) : initialSystemUsers;
    } catch {
      return initialSystemUsers;
    }
  });

  // App Navigation & Device View State
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');

  // Core Data States
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const isDemo = localStorage.getItem('fatebook_is_demo') === 'true';
      if (isDemo) return initialMessages;
      const saved = localStorage.getItem('fatebook_messages');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [chapters, setChapters] = useState<BookChapter[]>(() => {
    try {
      const isDemo = localStorage.getItem('fatebook_is_demo') === 'true';
      if (isDemo) return initialChapters;
      const saved = localStorage.getItem('fatebook_chapters');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [entities, setEntities] = useState<FateEntity[]>(() => {
    try {
      const isDemo = localStorage.getItem('fatebook_is_demo') === 'true';
      if (isDemo) return initialEntities;
      const saved = localStorage.getItem('fatebook_entities');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [contradictions, setContradictions] = useState<ContradictionItem[]>(() => {
    try {
      const isDemo = localStorage.getItem('fatebook_is_demo') === 'true';
      if (isDemo) return initialContradictions;
      const saved = localStorage.getItem('fatebook_contradictions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [boardStories, setBoardStories] = useState<BoardStory[]>(() => {
    try {
      const saved = localStorage.getItem('fatebook_board_stories');
      return saved ? JSON.parse(saved) : initialBoardStories;
    } catch {
      return initialBoardStories;
    }
  });

  // Modals
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isChapterWizardOpen, setIsChapterWizardOpen] = useState(false);
  const [isPrintWizardOpen, setIsPrintWizardOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isContradictionModalOpen, setIsContradictionModalOpen] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Sync state to localStorage for persistence
  useEffect(() => {
    try {
      localStorage.setItem('fatebook_system_users', JSON.stringify(systemUsers));
      localStorage.setItem('fatebook_board_stories', JSON.stringify(boardStories));
    } catch (e) {
      console.error(e);
    }
  }, [systemUsers, boardStories]);

  useEffect(() => {
    if (user && localStorage.getItem('fatebook_is_demo') !== 'true') {
      try {
        localStorage.setItem('fatebook_chapters', JSON.stringify(chapters));
        localStorage.setItem('fatebook_entities', JSON.stringify(entities));
        localStorage.setItem('fatebook_contradictions', JSON.stringify(contradictions));
        localStorage.setItem('fatebook_messages', JSON.stringify(messages));
      } catch (e) {
        console.error(e);
      }
    }
  }, [chapters, entities, contradictions, messages, user]);

  // Auth Handlers
  const handleLogin = (newUser: UserProfile, isNewRegistration = false) => {
    setUser(newUser);
    
    // Add to systemUsers registry if not already present
    setSystemUsers((prev) => {
      const exists = prev.find((u) => u.id === newUser.id || u.email === newUser.email);
      if (exists) {
        return prev.map((u) => (u.id === newUser.id || u.email === newUser.email ? newUser : u));
      }
      return [...prev, newUser];
    });

    try {
      localStorage.setItem('fatebook_user', JSON.stringify(newUser));
      localStorage.setItem('fatebook_is_demo', 'false');
    } catch (e) {
      console.error(e);
    }

    if (isNewRegistration) {
      // BRAND NEW USER: Profile is COMPLETELY EMPTY!
      setChapters([]);
      setEntities([]);
      setContradictions([]);
      
      const welcomeMsg: ChatMessage = {
        id: `msg-welcome-${Date.now()}`,
        sender: 'ai',
        text: `Szia ${newUser.name}! Én vagyok ${newUser.aiName}, a személyes AI-életrajzíród. Nagyon örülök, hogy megismerhetlek! Az életkönyved első oldala még tiszta, üres papír, és a mi feladatunk, hogy lapról lapra megírjuk a történetedet. Miről mesélnél ma először? A gyerekkorodról, a szüleidről, egy felejthetetlen utazásról, vagy a mai napodról?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([welcomeMsg]);

      try {
        localStorage.setItem('fatebook_chapters', JSON.stringify([]));
        localStorage.setItem('fatebook_entities', JSON.stringify([]));
        localStorage.setItem('fatebook_contradictions', JSON.stringify([]));
        localStorage.setItem('fatebook_messages', JSON.stringify([welcomeMsg]));
      } catch (e) {
        console.error(e);
      }

      showToast(`Üdvözlünk a FateBookban, ${newUser.name}! A könyved tiszta lappal indul.`);
    } else {
      showToast(`Üdv újra itt, ${newUser.name}!`);
    }
  };

  const handleDemoLogin = () => {
    setUser(initialUser);
    setChapters(initialChapters);
    setEntities(initialEntities);
    setContradictions(initialContradictions);
    setMessages(initialMessages);

    try {
      localStorage.setItem('fatebook_user', JSON.stringify(initialUser));
      localStorage.setItem('fatebook_is_demo', 'true');
    } catch (e) {
      console.error(e);
    }

    showToast('Belépve Péter Főadmin demó fiókjába (Minden jog engedélyezve).');
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('fatebook_user');
      localStorage.removeItem('fatebook_is_demo');
      localStorage.removeItem('fatebook_chapters');
      localStorage.removeItem('fatebook_entities');
      localStorage.removeItem('fatebook_contradictions');
      localStorage.removeItem('fatebook_messages');
    } catch (e) {
      console.error(e);
    }
    setUser(null);
    setChapters([]);
    setEntities([]);
    setContradictions([]);
    setMessages([]);
    setActiveTab('dashboard');
    showToast('Sikeresen kijelentkeztél.');
  };

  // =========================================================================
  // ADMIN MANAGEMENT HANDLERS
  // =========================================================================
  
  // Toggle Admin Role for Current User
  const handleToggleAdminRole = () => {
    if (!user) return;
    const newRole: UserRole = user.role === 'admin' ? 'user' : 'admin';
    const updatedUser: UserProfile = {
      ...user,
      role: newRole,
      permissions: newRole === 'admin' ? adminPermissions : defaultPermissions,
    };
    setUser(updatedUser);
    setSystemUsers((prev) => prev.map((u) => (u.id === user.id ? updatedUser : u)));
    try {
      localStorage.setItem('fatebook_user', JSON.stringify(updatedUser));
    } catch (e) {
      console.error(e);
    }
    showToast(newRole === 'admin' ? '👑 Adminisztrátori mód bekapcsolva!' : '👤 Visszaváltva normál felhasználói módba.');
  };

  // Update Any User's Role, Tier or Permissions
  const handleUpdateUser = (updatedUser: UserProfile) => {
    setSystemUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    if (user && user.id === updatedUser.id) {
      setUser(updatedUser);
      try {
        localStorage.setItem('fatebook_user', JSON.stringify(updatedUser));
      } catch (e) {
        console.error(e);
      }
    }
    showToast(`✅ ${updatedUser.name} jogosultságai sikeresen frissítve!`);
  };

  // Delete User
  const handleDeleteUser = (userId: string) => {
    setSystemUsers((prev) => prev.filter((u) => u.id !== userId));
    if (user && user.id === userId) {
      handleLogout();
    }
    showToast('🗑️ Felhasználó és fiókadatok véglegesen törölve.');
  };

  // Ban User
  const handleBanUser = (userId: string, reason: string) => {
    setSystemUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              status: 'banned',
              banReason: reason,
              permissions: {
                canVoiceRecord: false,
                canCreateChapters: false,
                canPostToBoard: false,
                canUseAi: false,
                canExportPdf: false,
                canManageUsers: false,
              },
            }
          : u
      )
    );
    if (user && user.id === userId) {
      setUser((prev) =>
        prev
          ? {
              ...prev,
              status: 'banned',
              banReason: reason,
            }
          : null
      );
    }
    showToast(`🚫 Felhasználó kitiltva a rendszerből.`);
  };

  // Unban User
  const handleUnbanUser = (userId: string) => {
    setSystemUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              status: 'active',
              banReason: undefined,
              permissions: defaultPermissions,
            }
          : u
      )
    );
    showToast(`✅ Kitiltás feloldva.`);
  };

  // Kick User Session
  const handleKickUser = (userId: string) => {
    if (user && user.id === userId) {
      handleLogout();
    } else {
      showToast(`👢 Felhasználó munkamenete lezárva (kirúgva).`);
    }
  };

  // Delete Chapter
  const handleDeleteChapter = (chapterId: string) => {
    setChapters((prev) => prev.filter((c) => c.id !== chapterId));
    showToast('🗑️ Fejezet törölve a könyvből.');
  };

  // Delete Board Story
  const handleDeleteBoardStory = (storyId: string) => {
    setBoardStories((prev) => prev.filter((s) => s.id !== storyId));
    showToast('🗑️ Történet eltávolítva a FateBoardról.');
  };

  // Delete FateMemory Entity
  const handleDeleteEntity = (entityId: string) => {
    setEntities((prev) => prev.filter((e) => e.id !== entityId));
    showToast('🗑️ Entitás törölve a FateMemory tudásbázisból.');
  };

  // Factory Reset All Data
  const handleResetAllData = () => {
    setSystemUsers(initialSystemUsers);
    setChapters(initialChapters);
    setEntities(initialEntities);
    setContradictions(initialContradictions);
    setBoardStories(initialBoardStories);
    setMessages(initialMessages);
    setUser(initialUser);
    try {
      localStorage.setItem('fatebook_system_users', JSON.stringify(initialSystemUsers));
      localStorage.setItem('fatebook_board_stories', JSON.stringify(initialBoardStories));
      localStorage.setItem('fatebook_chapters', JSON.stringify(initialChapters));
      localStorage.setItem('fatebook_entities', JSON.stringify(initialEntities));
      localStorage.setItem('fatebook_contradictions', JSON.stringify(initialContradictions));
      localStorage.setItem('fatebook_messages', JSON.stringify(initialMessages));
      localStorage.setItem('fatebook_user', JSON.stringify(initialUser));
      localStorage.setItem('fatebook_is_demo', 'true');
    } catch (e) {
      console.error(e);
    }
    showToast('✨ Minden rendszeradat visszaállítva az alapértelmezett állapotra.');
  };

  // =========================================================================
  // AI Chat Handlers
  // =========================================================================
  const handleSendMessage = (text: string) => {
    if (user?.permissions && !user.permissions.canUseAi) {
      showToast('⚠️ Nincs jogosultságod a FateAI használatához (az adminisztrátor korlátozta).');
      return;
    }

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      const responses = [
        `Milyen érzés volt ezt átélni? Ha most visszagondolsz arra a pillanatra, mit mondanál az akkori önmagadnak?`,
        `Ezt az emléket rögzítettem a FateMemoryban. Úgy érzed, hogy ez a nap megváltoztatta a későbbi életed folyását?`,
        `Nagyon élénk részlet. Kik voltak még ott veled ezen a napon? Szívesen mesélsz róluk is?`,
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      const aiMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: randomResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        extractedEntities: ['Új emlékfonal rögzítve'],
      };

      setMessages((prev) => [...prev, aiMsg]);
    }, 850);
  };

  // Finish Voice Session to Chapter
  const handleFinishVoiceSession = (_transcript: string, durationSeconds: number) => {
    setIsVoiceModalOpen(false);
    if (user) {
      setUser((prev) =>
        prev
          ? {
              ...prev,
              totalAudioHours: +(prev.totalAudioHours + durationSeconds / 3600).toFixed(1),
            }
          : prev
      );
    }
    setIsChapterWizardOpen(true);
  };

  // Save Approved Chapter
  const handleSaveChapter = (newChapterData: Omit<BookChapter, 'id' | 'orderIndex' | 'pageNumber' | 'createdAt'>) => {
    if (user?.permissions && !user.permissions.canCreateChapters) {
      showToast('⚠️ Nincs jogosultságod fejezet mentéséhez (az adminisztrátor korlátozta).');
      return;
    }

    const newChapter: BookChapter = {
      ...newChapterData,
      id: `ch-${Date.now()}`,
      orderIndex: chapters.length + 1,
      pageNumber: chapters.length * 12 + 10,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setChapters((prev) => [...prev, newChapter]);
    if (user) {
      setUser((prev) => (prev ? { ...prev, totalWords: prev.totalWords + 480 } : prev));
    }
    showToast('📖 Új fejezet hozzáadva a Könyvedhez!');
    setActiveTab('book');
  };

  // Confirm Hypothesis in FateMemory
  const handleConfirmHypothesis = (entityId: string) => {
    setEntities((prev) =>
      prev.map((ent) =>
        ent.id === entityId ? { ...ent, confidence: 'verified' } : ent
      )
    );
    showToast('✅ Tény megerősítve a FateMemoryban!');
  };

  // Resolve Contradiction
  const handleResolveContradiction = (choice: string) => {
    setContradictions((prev) =>
      prev.map((c) => ({ ...c, status: 'resolved', resolvedChoice: choice }))
    );
    setIsContradictionModalOpen(false);
    showToast(`✅ Ellentmondás feloldva: „${choice}” rögzítve.`);
  };

  // FateBoard React
  const handleReactToBoardStory = (storyId: string, reactionKey: keyof BoardStory['reactions']) => {
    setBoardStories((prev) =>
      prev.map((s) => {
        if (s.id === storyId) {
          return {
            ...s,
            reactions: {
              ...s.reactions,
              [reactionKey]: s.reactions[reactionKey] + 1,
            },
          };
        }
        return s;
      })
    );
    showToast('✨ Reakció hozzáadva a történethez!');
  };

  // Publish to Board
  const handlePublishToBoard = (
    title: string,
    content: string,
    penName: string,
    era: string,
    location: string
  ) => {
    if (user?.permissions && !user.permissions.canPostToBoard) {
      showToast('⚠️ Nincs jogosultságod posztolni a FateBoardra (az adminisztrátor korlátozta).');
      return;
    }

    const newStory: BoardStory = {
      id: `story-${Date.now()}`,
      authorPenName: penName,
      title,
      content,
      era,
      location,
      reactions: {
        touching: 1,
        funny: 0,
        incredible: 0,
        thoughtful: 1,
        love: 1,
        adventure: 0,
        creepy: 0,
        wisdom: 1,
      },
      readCompletionRate: 100,
      createdAt: 'Épp most',
    };

    setBoardStories((prev) => [newStory, ...prev]);
    showToast(`📌 Történeted kitűzve a FateBoardra „${penName}” jeligével!`);
  };

  // Select Persona
  const handleSelectPersona = (persona: AiPersona) => {
    if (user) {
      setUser((prev) => (prev ? { ...prev, aiPersona: persona } : prev));
    }
    showToast(`🎭 AI Személyiség frissítve: ${persona}`);
  };

  // IF NOT AUTHENTICATED: Display Registration / Login Gate Screen
  if (!user) {
    return (
      <AuthScreen
        onLogin={handleLogin}
        onDemoLogin={handleDemoLogin}
      />
    );
  }

  // IF USER IS BANNED: Display Ban Screen
  if (user.status === 'banned') {
    return (
      <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="w-16 h-16 rounded-2xl bg-red-950/80 border border-red-800 flex items-center justify-center text-red-500 mb-4 shadow-xl">
          <Ban className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          A fiókodat a Főadminisztrátor felfüggesztette
        </h1>
        <p className="text-red-400 font-semibold text-xs sm:text-sm mt-2 max-w-md">
          {user.banReason || 'A közösségi irányelvek megsértése miatt a hozzáférésed korlátozásra került.'}
        </p>
        <p className="text-slate-500 text-xs mt-4">
          Ha úgy gondolod, hogy ez tévedés, lépj kapcsolatba a rendszergazdával.
        </p>
        <button
          onClick={handleLogout}
          className="mt-6 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition flex items-center space-x-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Kijelentkezés a fiókból</span>
        </button>
      </div>
    );
  }

  const activeContradictionsCount = contradictions.filter((c) => c.status === 'pending').length;
  const isAdmin = user.role === 'admin' || user.permissions?.canManageUsers;

  // IF AUTHENTICATED: Main FateBook Experience
  return (
    <div className="min-h-full flex flex-col bg-slate-950 text-slate-100 antialiased selection:bg-rose-500 selection:text-white">
      
      {/* Top Navigation Bar with Profile, Admin Action & Logout */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        deviceMode={deviceMode}
        setDeviceMode={setDeviceMode}
        openVoiceModal={() => {
          if (user.permissions && !user.permissions.canVoiceRecord) {
            showToast('⚠️ A hangfelvétel készítése le van tiltva a fiókodban.');
            return;
          }
          setIsVoiceModalOpen(true);
        }}
        user={user}
        onLogout={handleLogout}
        onToggleAdminRole={handleToggleAdminRole}
      />

      {/* Main Workspace Frame */}
      <main className="flex-1 overflow-hidden relative flex justify-center bg-slate-950">
        <div
          className={`w-full h-full flex flex-col transition-all duration-300 overflow-y-auto ${
            deviceMode === 'mobile'
              ? 'max-w-sm border-x-4 border-slate-800 shadow-2xl bg-slate-950 px-3 py-3'
              : 'max-w-7xl px-3 sm:px-6 py-4'
          }`}
        >
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <LiveTileDashboard
              user={user}
              chapters={chapters}
              entities={entities}
              boardStories={boardStories}
              contradictionsCount={activeContradictionsCount}
              setActiveTab={setActiveTab}
              openVoiceModal={() => {
                if (user.permissions && !user.permissions.canVoiceRecord) {
                  showToast('⚠️ A hangfelvétel készítése le van tiltva a fiókodban.');
                  return;
                }
                setIsVoiceModalOpen(true);
              }}
              openContradictionModal={() => setIsContradictionModalOpen(true)}
              onSearch={(q) => showToast(`🔍 Keresés a FateMemoryban: „${q}”`)}
              onAskDailyQuestion={() => {
                setActiveTab('ai');
                handleSendMessage('Mesélek a gyerekkoromról és a szülői házról.');
              }}
            />
          )}

          {/* TAB 2: FATEAI CHAT */}
          {activeTab === 'ai' && (
            <FateAiChat
              user={user}
              messages={messages}
              onSendMessage={handleSendMessage}
              openVoiceModal={() => {
                if (user.permissions && !user.permissions.canVoiceRecord) {
                  showToast('⚠️ A hangfelvétel készítése le van tiltva a fiókodban.');
                  return;
                }
                setIsVoiceModalOpen(true);
              }}
              openChapterWizard={() => setIsChapterWizardOpen(true)}
              openCorrectionModal={() => {
                const corr = prompt("Mit értett félre az AI? (pl. 'Nem 100 lírás, hanem 500 lírás érme volt'):");
                if (corr) showToast('🧠 Korrekció rögzítve a FateMemoryban!');
              }}
              onSelectPersona={handleSelectPersona}
            />
          )}

          {/* TAB 3: BOOK READER */}
          {activeTab === 'book' && (
            <BookReader
              chapters={chapters}
              userName={user.name}
              onOpenPrintWizard={() => {
                if (user.permissions && !user.permissions.canExportPdf) {
                  showToast('⚠️ A PDF nyomtatási és export funkció le van tiltva a fiókodban.');
                  return;
                }
                setIsPrintWizardOpen(true);
              }}
              onUpdateChapter={(id, newContent) => {
                setChapters((prev) =>
                  prev.map((c) => (c.id === id ? { ...c, content: newContent } : c))
                );
                showToast('✍️ Fejezet frissítve!');
              }}
              onNavigateToAi={() => setActiveTab('ai')}
            />
          )}

          {/* TAB 4: FATEBOARD */}
          {activeTab === 'board' && (
            <FateBoard
              stories={boardStories}
              onOpenPublishModal={() => {
                if (user.permissions && !user.permissions.canPostToBoard) {
                  showToast('⚠️ A posztolás le van tiltva a fiókodban (adminisztrátori korlátozás).');
                  return;
                }
                setIsPrivacyModalOpen(true);
              }}
              onReact={handleReactToBoardStory}
            />
          )}

          {/* TAB 5: FATEMEMORY GRAPH */}
          {activeTab === 'memory' && (
            <FateMemoryGraph
              entities={entities}
              contradictionsCount={activeContradictionsCount}
              onConfirmHypothesis={handleConfirmHypothesis}
              openContradictionModal={() => setIsContradictionModalOpen(true)}
              openCorrectionModal={() => {
                const corr = prompt("Mit javítanál az entitásokon?");
                if (corr) showToast('🧠 Tudásgráf sikeresen korrigálva!');
              }}
            />
          )}

          {/* TAB 6: FATEFAMILY */}
          {activeTab === 'family' && (
            <FateFamilyView familyEvent={initialFamilyEvent} />
          )}

          {/* TAB 7: ADMIN PANEL (Available for Admins) */}
          {activeTab === 'admin' && isAdmin && (
            <AdminPanel
              currentUser={user}
              users={systemUsers}
              chapters={chapters}
              boardStories={boardStories}
              entities={entities}
              onUpdateUser={handleUpdateUser}
              onDeleteUser={handleDeleteUser}
              onBanUser={handleBanUser}
              onUnbanUser={handleUnbanUser}
              onKickUser={handleKickUser}
              onDeleteChapter={handleDeleteChapter}
              onDeleteBoardStory={handleDeleteBoardStory}
              onDeleteEntity={handleDeleteEntity}
              onResetAllData={handleResetAllData}
            />
          )}
        </div>

        {/* Mobile Fixed Bottom Navigation Bar */}
        <div className={deviceMode === 'mobile' ? 'block' : 'block md:hidden'}>
          <div className="fixed bottom-0 left-0 right-0 z-40">
            <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={isAdmin} />
          </div>
        </div>
      </main>

      {/* MODALS */}
      <VoiceStudioModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onFinishSession={handleFinishVoiceSession}
      />

      <ChapterWizardModal
        isOpen={isChapterWizardOpen}
        onClose={() => setIsChapterWizardOpen(false)}
        onSaveChapter={handleSaveChapter}
      />

      <PrintWizardModal
        isOpen={isPrintWizardOpen}
        onClose={() => setIsPrintWizardOpen(false)}
        chapterCount={chapters.length}
      />

      <PrivacyCheckModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        onPublish={handlePublishToBoard}
      />

      {contradictions.length > 0 && (
        <ContradictionModal
          isOpen={isContradictionModalOpen}
          onClose={() => setIsContradictionModalOpen(false)}
          contradiction={contradictions[0]}
          onResolve={handleResolveContradiction}
        />
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-xl shadow-2xl text-xs font-bold flex items-center space-x-2 animate-fadeIn pointer-events-none">
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
};

export default App;
