import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, AiPersona, UserProfile } from '../../types';
import { Mic, Send, Image as ImageIcon, Sparkles, BookOpen, AlertCircle, Volume2 } from 'lucide-react';

interface FateAiChatProps {
  user: UserProfile;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  openVoiceModal: () => void;
  openChapterWizard: () => void;
  openCorrectionModal: () => void;
  onSelectPersona: (persona: AiPersona) => void;
}

export const FateAiChat: React.FC<FateAiChatProps> = ({
  user,
  messages,
  onSendMessage,
  openVoiceModal,
  openChapterWizard,
  openCorrectionModal,
  onSelectPersona,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const personaDescriptions: Record<AiPersona, { name: string; desc: string }> = {
    biographer: { name: 'Életrajzíró', desc: 'Precíz, kronologikus, tiszteletteljes' },
    friend: { name: 'Barát', desc: 'Melegszívű, közvetlen, bátorító' },
    reporter: { name: 'Riporter', desc: 'Kíváncsi, a belső okokat kutatja' },
    hunter: { name: 'Emlékvadász', desc: 'Illatok, ízek, elfeledett részletek' },
    humorist: { name: 'Humorista', desc: 'Vidám, anekdotikus, önironikus' },
    writer: { name: 'Író', desc: 'Gazdag szókincs, irodalmi metaforák' },
  };

  const quickModes = [
    { label: '☀️ Mai napom', text: 'Mesélek a mai napomról és a gondolataimról.' },
    { label: '🚗 Egy fontos emlék', text: 'Emlékezzünk az első autómra, az öreg Opelre!' },
    { label: '👤 Egy ember', text: 'Mesélni szeretnék egy számomra meghatározó emberről.' },
    { label: '🎲 Lepj meg', text: 'Lepj meg egy régi kérdéssel az ifjúkoromból!' },
    { label: '😂 Vicces sztori', text: 'Van egy nagyon mulatságos balatoni történetem.' },
    { label: '✨ Szabad mesélés', text: 'Csak hallgass meg, csapongani szeretnék az emlékek között.' },
  ];

  return (
    <div className="flex-1 flex flex-col space-y-4 max-w-4xl mx-auto w-full pb-20 select-none">
      
      {/* 1. Personality Selector & Chapter Trigger Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center space-x-2.5">
          <span className="text-xs text-slate-400 font-extrabold uppercase tracking-wider">
            AI Karakter:
          </span>
          <select
            value={user.aiPersona}
            onChange={(e) => onSelectPersona(e.target.value as AiPersona)}
            className="bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-blue-500 cursor-pointer shadow-inner"
          >
            {Object.entries(personaDescriptions).map(([key, value]) => (
              <option key={key} value={key}>
                {value.name} – {value.desc}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={openVoiceModal}
            className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-md text-xs font-bold flex items-center space-x-1.5 shadow transition active:scale-95"
          >
            <Mic className="w-3.5 h-3.5 text-red-300 animate-pulse" />
            <span>Hangos Mesélés Mód</span>
          </button>
          
          <button
            onClick={openChapterWizard}
            className="bg-rose-700 hover:bg-rose-600 text-white px-3 py-1.5 rounded-md text-xs font-bold transition flex items-center space-x-1.5 shadow active:scale-95"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Fejezet Készítése</span>
          </button>
        </div>
      </div>

      {/* 2. Quick Storytelling Mode Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="text-slate-400 text-[11px] font-bold shrink-0">Gyors indítás:</span>
        {quickModes.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => onSendMessage(chip.text)}
            className="px-3 py-1 bg-slate-800/90 hover:bg-slate-700 text-slate-200 rounded-full border border-slate-700/80 shrink-0 font-medium transition active:scale-95"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* 3. Messenger-like Chat Message Stream */}
      <div className="flex-1 bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 overflow-y-auto space-y-4 min-h-[420px] max-h-[580px] shadow-inner">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-xs shrink-0 shadow">
                  AI
                </div>
              )}

              <div className={`flex-1 max-w-xl flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center space-x-2 mb-1">
                  <span className={`text-xs font-bold ${isUser ? 'text-rose-300' : 'text-blue-300'}`}>
                    {isUser ? user.name : user.aiName}
                  </span>
                  <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                  {msg.audioDurationSeconds && (
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded flex items-center space-x-1">
                      <Volume2 className="w-3 h-3 text-red-400" />
                      <span>{msg.audioDurationSeconds} mp hang</span>
                    </span>
                  )}
                </div>

                <div
                  className={`text-sm p-3.5 sm:p-4 rounded-2xl leading-relaxed shadow-sm ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-slate-800/90 text-slate-200 rounded-tl-none border border-slate-700/80'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Extracted Entities In-line badge (FateMemory Graph Integration) */}
                {msg.extractedEntities && msg.extractedEntities.length > 0 && (
                  <div className="mt-2 bg-slate-950/90 border border-slate-800 rounded-lg p-2.5 text-xs flex flex-wrap items-center justify-between gap-2 w-full">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-purple-400 font-bold flex items-center space-x-1">
                        <Sparkles className="w-3 h-3" />
                        <span>FateMemory:</span>
                      </span>
                      {msg.extractedEntities.map((ent, i) => (
                        <span key={i} className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[11px] font-medium">
                          {ent}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={openCorrectionModal}
                      className="text-slate-400 hover:text-amber-300 underline text-[11px] flex items-center space-x-1 ml-auto"
                    >
                      <AlertCircle className="w-3 h-3 text-amber-400" />
                      <span>Ezt rosszul értetted?</span>
                    </button>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-full bg-rose-700 flex items-center justify-center text-white font-black text-xs shrink-0 shadow">
                  {user.name.charAt(0)}
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* 4. Chat Input Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 sm:p-2.5 flex items-center space-x-2 shadow-lg">
        <button
          onClick={() => alert("📷 Fotó / Kézirat csatolása: tölts fel egy régi fotót, és az AI azonnal felteszi a kontextuális kérdéseket!")}
          title="Fénykép vagy dokumentum csatolása"
          className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
        >
          <ImageIcon className="w-5 h-5" />
        </button>

        <button
          onClick={openVoiceModal}
          title="Hangalapú mesélés indítása"
          className="p-2 text-rose-400 hover:text-rose-300 hover:bg-slate-800 rounded-lg transition"
        >
          <Mic className="w-5 h-5" />
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Írj vagy mesélj az emlékeidről..."
          className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
        />

        <button
          onClick={handleSend}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-lg font-bold text-xs transition shadow flex items-center space-x-1.5 active:scale-95"
        >
          <span>Küldés</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
