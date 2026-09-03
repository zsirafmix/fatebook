import React, { useState } from 'react';
import { MultiPerspectiveEvent } from '../../types';
import { Users, Heart, MessageCircle, Clock, Sparkles, Send, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FateFamilyViewProps {
  familyEvent: MultiPerspectiveEvent;
}

export const FateFamilyView: React.FC<FateFamilyViewProps> = ({ familyEvent }) => {
  const [activePerspId, setActivePerspId] = useState(familyEvent.perspectives[0].id);
  const [askMemberQuestion, setAskMemberQuestion] = useState('');
  const [questionSent, setQuestionSent] = useState(false);

  const activePerspective =
    familyEvent.perspectives.find((p) => p.id === activePerspId) ||
    familyEvent.perspectives[0];

  const handleSendFamilyQuestion = () => {
    if (!askMemberQuestion.trim()) return;
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
    });
    setQuestionSent(true);
    setTimeout(() => {
      setAskMemberQuestion('');
      setQuestionSent(false);
    }, 4000);
  };

  return (
    <div className="flex-1 flex flex-col space-y-5 max-w-5xl mx-auto w-full pb-20 select-none">
      
      {/* Top Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div>
          <h2 className="text-base font-black text-red-300 flex items-center space-x-2">
            <Users className="w-5 h-5 text-red-400" />
            <span>FateFamily – Többgenerációs Családi Emléktár</span>
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">
            Ugyanaz az esemény, több ember nézőpontja. Közös családfa és megőrzött generációs örökség.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-red-200 bg-red-950/80 border border-red-800 px-3 py-1.5 rounded-lg">
            5 Családtag a körben
          </span>
        </div>
      </div>

      {/* 1. Multi-Perspective Event Showcase Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 mb-4 gap-2">
          <div>
            <span className="text-[10px] uppercase font-black text-amber-400 bg-amber-950/80 px-2.5 py-1 rounded-md border border-amber-800">
              Közös Családi Esemény
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white mt-1.5">
              {familyEvent.title}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Helyszín: {familyEvent.place} • Év: {familyEvent.year}
            </p>
          </div>

          <div className="text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 shrink-0">
            {familyEvent.perspectives.length} családtag emlékezete összekapcsolva
          </div>
        </div>

        {/* Perspective Switcher Tabs */}
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 mb-4 overflow-x-auto text-xs font-bold">
          {familyEvent.perspectives.map((p) => {
            const isActive = p.id === activePerspId;
            return (
              <button
                key={p.id}
                onClick={() => setActivePerspId(p.id)}
                className={`px-4 py-2 rounded-xl transition flex items-center space-x-2 shrink-0 ${
                  isActive
                    ? `${p.avatarColor} text-white shadow-lg font-black`
                    : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                <span>{p.authorName}</span>
                <span className="text-[10px] opacity-80">({p.relationship})</span>
              </button>
            );
          })}
        </div>

        {/* Active Perspective Content */}
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 text-sm leading-relaxed text-slate-200">
          <div className="flex items-center space-x-2 mb-2 font-bold text-xs text-amber-300">
            <Heart className="w-4 h-4 text-rose-400" />
            <span>{activePerspective.authorName} személyes emlékezete:</span>
          </div>

          <p className="font-serif italic text-slate-100 text-sm sm:text-base leading-relaxed">
            „{activePerspective.text}”
          </p>
        </div>
      </div>

      {/* 2. "Kérdezz egy családtagtól" (Asynchronous Intergenerational Interview) */}
      <div className="bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-900 border border-red-900/50 rounded-2xl p-5 sm:p-6 shadow-xl space-y-3">
        <div className="flex items-center space-x-2.5 text-red-300">
          <MessageCircle className="w-5 h-5 text-red-400" />
          <h3 className="text-sm sm:text-base font-black text-white">
            „Kérdezz egy családtagtól” (Generációs híd)
          </h3>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
          Tegyél fel egy kérdést a nagyszüleidnek, szüleidnek vagy gyermekeidnek (pl. <em>„Nagyi, hogyan kért meg a papa?”</em>). Az ő saját FateAI-ja a következő reggeli beszélgetésben természetesen, szelíden beemeli ezt a kérdést, és a válaszból új fejezet készül a családi könyvbe.
        </p>

        {questionSent ? (
          <div className="p-3 bg-emerald-950/80 border border-emerald-800 rounded-xl text-xs text-emerald-300 flex items-center space-x-2 animate-fadeIn">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Kérdés elküldve! A családtagod FateAI-ja természetesen fel fogja tenni neki a következő meséléskor.
            </span>
          </div>
        ) : (
          <div className="flex items-center space-x-2 pt-1 max-w-xl">
            <input
              type="text"
              value={askMemberQuestion}
              onChange={(e) => setAskMemberQuestion(e.target.value)}
              placeholder="pl. „Nagyi, mesélj arról, hogyan ismerted meg a papát!”"
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
            />
            <button
              onClick={handleSendFamilyQuestion}
              className="bg-red-700 hover:bg-red-600 text-white px-4 py-2.5 rounded-xl font-bold text-xs transition shadow flex items-center space-x-1.5 shrink-0 active:scale-95"
            >
              <span>Elküldés</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* 3. Changing Perspective over Time (Longitudinal AI Reflection) */}
      <div className="bg-gradient-to-r from-purple-950/50 via-slate-900 to-slate-900 border border-purple-800/60 rounded-2xl p-5 sm:p-6 shadow-xl space-y-3">
        <div className="flex items-center space-x-2 text-purple-300 text-xs font-black uppercase tracking-wider">
          <Clock className="w-4 h-4 text-purple-400" />
          <span>Változó Nézőpont • Az ember belső fejlődése az évek során</span>
        </div>

        <p className="text-xs text-slate-300">
          Az AI évekkel később visszatérhet régi eseményekhez, és megőrzi ugyanannak az eseménynek az évtizedekkel későbbi átértékelését:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
          <div className="bg-slate-950/90 p-4 rounded-xl border border-slate-800">
            <span className="text-slate-400 font-bold block text-[10px] uppercase">
              Ahogy 2026-ban gondoltál a döntésre:
            </span>
            <p className="text-slate-200 mt-2 font-serif italic text-sm leading-relaxed">
              „Az a munkahelyváltás életem legrosszabb döntése volt, hónapokig nem találtam a helyem az új cégnél, és bántam, hogy eljöttem.”
            </p>
          </div>

          <div className="bg-slate-950/90 p-4 rounded-xl border border-purple-800/80">
            <span className="text-purple-300 font-bold block text-[10px] uppercase">
              Ahogy ma látod (AI longitudinális reflexió után):
            </span>
            <p className="text-purple-100 mt-2 font-serif text-sm leading-relaxed">
              „Kellett az a pofon, mert anélkül soha nem mertem volna elindítani a saját műhelyemet. Utólag nézve a legjobb dolog volt, ami történhetett velem.”
            </p>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 pt-1 flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Így a FateBook nemcsak az eseményeket, hanem az ember bölcsebbé válását is dokumentálja az életkönyvben.</span>
        </p>
      </div>

    </div>
  );
};
