import React, { useState, useEffect } from 'react';
import { ActiveTab, UserProfile, ChatMessage, FateEntity, ContradictionItem, BookChapter, BoardStory, AiPersona } from './types';
import { 
  initialUser, initialMessages, initialEntities, 
  initialContradictions, initialChapters, initialBoardStories, initialFamilyEvent 
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

  // App Navigation & Device View State
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');

  // Core Data States (Initialized based on whether user is demo or newly registered)
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

  const [boardStories, setBoardStories] = useState<BoardStory[]>(initialBoardStories);

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

    showToast('Belépve Péter demó fiókjába (előre kitöltött könyvvel).');
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

  // AI Chat Handlers
  const handleSendMessage = (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);

    // Simulated thoughtful AI response
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

  const activeContradictionsCount = contradictions.filter((c) => c.status === 'pending').length;

  // IF AUTHENTICATED: Main FateBook Experience
  return (
    <div className="min-h-full flex flex-col bg-slate-950 text-slate-100 antialiased selection:bg-rose-500 selection:text-white">
      
      {/* Top Navigation Bar with Profile & Logout */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        deviceMode={deviceMode}
        setDeviceMode={setDeviceMode}
        openVoiceModal={() => setIsVoiceModalOpen(true)}
        user={user}
        onLogout={handleLogout}
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
              openVoiceModal={() => setIsVoiceModalOpen(true)}
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
              openVoiceModal={() => setIsVoiceModalOpen(true)}
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
              onOpenPrintWizard={() => setIsPrintWizardOpen(true)}
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
              onOpenPublishModal={() => setIsPrivacyModalOpen(true)}
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
        </div>

        {/* Mobile Fixed Bottom Navigation Bar (Visible in mobile mode or on small screens) */}
        <div className={deviceMode === 'mobile' ? 'block' : 'block md:hidden'}>
          <div className="fixed bottom-0 left-0 right-0 z-40">
            <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
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
