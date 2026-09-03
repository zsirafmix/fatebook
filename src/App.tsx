import React, { useState } from 'react';
import { ActiveTab, UserProfile, ChatMessage, FateEntity, ContradictionItem, BookChapter, BoardStory, AiPersona } from './types';
import { 
  initialUser, initialMessages, initialEntities, 
  initialContradictions, initialChapters, initialBoardStories, initialFamilyEvent 
} from './data/initialData';

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
  // State
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [user, setUser] = useState<UserProfile>(initialUser);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [chapters, setChapters] = useState<BookChapter[]>(initialChapters);
  const [entities, setEntities] = useState<FateEntity[]>(initialEntities);
  const [contradictions, setContradictions] = useState<ContradictionItem[]>(initialContradictions);
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
        extractedEntities: ['Új emlékfonal (FateMemory rögzítve)'],
      };

      setMessages((prev) => [...prev, aiMsg]);
    }, 850);
  };

  // Finish Voice Session to Chapter
  const handleFinishVoiceSession = (_transcript: string, durationSeconds: number) => {
    setIsVoiceModalOpen(false);
    setUser((prev) => ({
      ...prev,
      totalAudioHours: +(prev.totalAudioHours + durationSeconds / 3600).toFixed(1),
    }));
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
    setUser((prev) => ({
      ...prev,
      totalWords: prev.totalWords + 480,
    }));
    showToast('📖 Új fejezet hozzáadva a Könyvemhez!');
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
    setUser((prev) => ({ ...prev, aiPersona: persona }));
    showToast(`🎭 AI Személyiség frissítve: ${persona}`);
  };

  return (
    <div className="min-h-full flex flex-col bg-slate-950 text-slate-100 antialiased selection:bg-rose-500 selection:text-white">
      
      {/* Top Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        deviceMode={deviceMode}
        setDeviceMode={setDeviceMode}
        openVoiceModal={() => setIsVoiceModalOpen(true)}
        user={user}
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
              setActiveTab={setActiveTab}
              openVoiceModal={() => setIsVoiceModalOpen(true)}
              openContradictionModal={() => setIsContradictionModalOpen(true)}
              onSearch={(q) => showToast(`🔍 Keresés a FateMemoryban: „${q}”`)}
              onAskDailyQuestion={() => {
                setActiveTab('ai');
                handleSendMessage('Mesélek a gimnáziumi tanáromról és az 1979-es évekről.');
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
              onOpenPrintWizard={() => setIsPrintWizardOpen(true)}
              onUpdateChapter={(id, newContent) => {
                setChapters((prev) =>
                  prev.map((c) => (c.id === id ? { ...c, content: newContent } : c))
                );
                showToast('✍️ Fejezet frissítve!');
              }}
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

      <ContradictionModal
        isOpen={isContradictionModalOpen}
        onClose={() => setIsContradictionModalOpen(false)}
        contradiction={contradictions[0]}
        onResolve={handleResolveContradiction}
      />

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
