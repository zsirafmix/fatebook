import React, { useState, useEffect } from 'react';
import { ActiveTab, UserProfile, BookChapter, FateEntity, BoardStory } from '../../types';
import { 
  MessageSquare, BookOpen, HelpCircle, Pin, Clock, Users, 
  Image as ImageIcon, History, BarChart3, Heart, Mic, ArrowRight, 
  AlertTriangle, Sparkles, RefreshCw, Search
} from 'lucide-react';

interface LiveTileDashboardProps {
  user: UserProfile;
  chapters: BookChapter[];
  entities: FateEntity[];
  boardStories: BoardStory[];
  setActiveTab: (tab: ActiveTab) => void;
  openVoiceModal: () => void;
  openContradictionModal: () => void;
  onSearch: (query: string) => void;
  onAskDailyQuestion: () => void;
}

export const LiveTileDashboard: React.FC<LiveTileDashboardProps> = ({
  user,
  chapters,
  entities,
  boardStories,
  setActiveTab,
  openVoiceModal,
  openContradictionModal,
  onSearch,
  onAskDailyQuestion,
}) => {
  const [isTileFlipped, setIsTileFlipped] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Subtle automatic Live Tile flip every 12 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIsTileFlipped((prev) => !prev);
    }, 12000);
    return () => clearInterval(timer);
  }, []);

  const latestChapter = chapters[chapters.length - 1] || chapters[0];
  const trendingStory = boardStories[0];
  const verifiedEntities = entities.filter((e) => e.confidence === 'verified');
  const hypothesisEntities = entities.filter((e) => e.confidence === 'hypothesis');

  return (
    <div className="flex flex-col space-y-5 pb-20 select-none">
      
      {/* 1. Contextual Nudge & Welcome Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Jó napot, {user.name}!
            </h1>
            <span className="text-[11px] font-semibold text-blue-300 bg-blue-950/80 border border-blue-800 px-2 py-0.5 rounded">
              Életrajzíró: {user.aiName}
            </span>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-1.5 flex items-center">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2 shrink-0 animate-pulse"></span>
            <span>„Tegnap ott hagytuk abba, hogy 1994-ben megérkeztetek Rómába. Mi történt másnap reggel?”</span>
          </p>
        </div>

        <div className="mt-3 md:mt-0 flex items-center space-x-2 shrink-0">
          <button
            onClick={() => setIsTileFlipped(!isTileFlipped)}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-md border border-slate-700 transition flex items-center space-x-1.5"
            title="Live Tile átfordítás kézi tesztelése"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Tile Forgatás</span>
          </button>
          
          <button
            onClick={openContradictionModal}
            className="text-xs bg-amber-950/80 hover:bg-amber-900 text-amber-200 px-3 py-1.5 rounded-md border border-amber-700/60 transition flex items-center space-x-1.5 shadow"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>1 Ellentmondás feloldása</span>
          </button>
        </div>
      </div>

      {/* 2. 12-Column Metro Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-3 sm:gap-4 auto-rows-[150px] sm:auto-rows-[165px]">

        {/* TILE 1: Beszélgessünk (Mélykék, 4 col x 2 row Desktop) */}
        <div
          onClick={() => setActiveTab('ai')}
          className="metro-tile lg:col-span-4 sm:col-span-2 row-span-2 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-950 rounded-lg p-5 flex flex-col justify-between border-t-4 border-blue-400 shadow-xl text-white group"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-md bg-blue-700/60 flex items-center justify-center text-blue-200">
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-blue-200">
                FateAI Beszélgetés
              </span>
            </div>
            <span className="text-[10px] bg-blue-700/60 text-blue-100 px-2 py-0.5 rounded font-bold uppercase">
              Aktív Fonal
            </span>
          </div>

          <div className="my-2">
            <h3 className="text-xl sm:text-2xl font-black leading-tight text-white group-hover:text-blue-100 transition">
              „Miről mesélnél ma?”
            </h3>
            <p className="text-xs sm:text-sm text-blue-200/90 mt-1.5 line-clamp-3 leading-relaxed">
              Az AI emlékszik a legutóbbi részletekre: Róma, Via Veneto és a 100 lírás érme. Folytassuk innen, vagy ugorjunk egy új emlékre?
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-blue-700/40">
            <div className="flex items-center space-x-2 text-xs text-blue-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Gépelés vagy hang</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                openVoiceModal();
              }}
              className="bg-white hover:bg-blue-50 text-blue-900 font-bold px-3 py-1.5 rounded-md text-xs flex items-center space-x-1.5 shadow transition active:scale-95"
            >
              <Mic className="w-3.5 h-3.5 text-rose-600" />
              <span>Mikrofon</span>
            </button>
          </div>
        </div>

        {/* TILE 2: Könyvem (Bordó, 4 col x 2 row Desktop, 3D Live Tile Flipper) */}
        <div
          onClick={() => setActiveTab('book')}
          className="metro-tile tile-flip-container lg:col-span-4 sm:col-span-2 row-span-2 rounded-lg shadow-xl text-white"
        >
          <div className={`tile-flipper ${isTileFlipped ? 'flipped' : ''}`}>
            
            {/* FRONT SIDE: Data, Pages, Chapters */}
            <div className="tile-front bg-gradient-to-br from-rose-950 via-rose-900 to-red-950 p-5 flex flex-col justify-between border-t-4 border-rose-400 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-md bg-rose-800/60 flex items-center justify-center text-rose-200">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <span className="text-xs uppercase font-extrabold tracking-wider text-rose-200">
                    My FateBook
                  </span>
                </div>
                <span className="text-xs font-bold bg-rose-800/60 px-2 py-0.5 rounded border border-rose-600/40">
                  {latestChapter.volumeName}
                </span>
              </div>

              <div className="my-2">
                <div className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-baseline space-x-2">
                  <span>{chapters.length}</span>
                  <span className="text-sm font-normal text-rose-300">fejezet kész</span>
                </div>
                <p className="text-xs text-rose-200/90 mt-1">
                  ~342 oldal • {user.totalWords.toLocaleString()} szó • 4 kötet
                </p>

                <div className="mt-2.5 bg-rose-950/70 rounded-md p-2.5 border border-rose-800/50 text-xs">
                  <span className="text-rose-300 block text-[10px] font-bold uppercase tracking-wider">
                    Legutóbb elkészült fejezet
                  </span>
                  <span className="font-bold text-white truncate block mt-0.5">
                    „{latestChapter.title}”
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-rose-200 pt-2 border-t border-rose-800/40">
                <span>Kétoldalas könyvolvasó megnyitása</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* BACK SIDE: Hardcover Art & Print Wizard CTA */}
            <div className="tile-back bg-gradient-to-br from-stone-900 via-rose-950 to-stone-950 p-5 flex flex-col justify-between border-t-4 border-amber-400 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Borító & Nyomtatás</span>
                </span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold">
                  Keménykötés
                </span>
              </div>

              <div className="text-center my-auto py-2">
                <p className="font-book text-2xl text-amber-100 font-bold italic">
                  {user.name} Krónikája
                </p>
                <p className="text-[11px] text-amber-300/80 tracking-widest uppercase mt-1 font-semibold">
                  1968 – 2026
                </p>
                <div className="w-16 h-0.5 bg-amber-400/40 mx-auto my-2.5"></div>
                <p className="text-xs text-stone-300 font-serif italic">
                  „Minden élet egy megíratlan könyv.”
                </p>
              </div>

              <div className="flex justify-between items-center text-xs text-amber-300/90 pt-2 border-t border-stone-800">
                <span>Nyomtatás és Export Wizard</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

          </div>
        </div>

        {/* TILE 3: Mai Kérdés (Türkiz, 4 col x 1 row Desktop) */}
        <div
          onClick={onAskDailyQuestion}
          className="metro-tile lg:col-span-4 sm:col-span-2 row-span-1 bg-gradient-to-br from-teal-900 via-teal-800 to-cyan-900 rounded-lg p-4 flex flex-col justify-between border-t-4 border-teal-400 shadow-md text-white group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-extrabold tracking-wider text-teal-200 flex items-center space-x-1.5">
              <HelpCircle className="w-4 h-4" />
              <span>Mai Személyes Kérdés</span>
            </span>
            <span className="text-[10px] bg-teal-700/60 px-2 py-0.5 rounded text-teal-100 font-bold">
              1979-es korszak
            </span>
          </div>

          <p className="text-xs sm:text-sm font-bold text-white line-clamp-2 mt-1 group-hover:text-teal-100 transition">
            „Ki volt a legmeghatározóbb tanárod a gimnáziumban, és melyik mondatára emlékszel máig?”
          </p>

          <div className="flex justify-between items-center text-[11px] text-teal-200 pt-1 border-t border-teal-700/40">
            <span>Válaszolok a kérdésre most</span>
            <span className="font-bold">1 perc →</span>
          </div>
        </div>

        {/* TILE 4: FateBoard (Meleg Narancs, 4 col x 1 row Desktop) */}
        <div
          onClick={() => setActiveTab('board')}
          className="metro-tile lg:col-span-4 sm:col-span-2 row-span-1 bg-gradient-to-br from-amber-800 via-orange-800 to-amber-900 rounded-lg p-4 flex flex-col justify-between border-t-4 border-amber-400 shadow-md text-white group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-extrabold tracking-wider text-amber-200 flex items-center space-x-1.5">
              <Pin className="w-4 h-4" />
              <span>FateBoard • Közösség</span>
            </span>
            <span className="text-[10px] bg-amber-700/60 px-2 py-0.5 rounded text-amber-100 font-bold">
              Trending #1
            </span>
          </div>

          <div className="text-xs text-amber-100 line-clamp-2 mt-1">
            <strong className="text-amber-200 font-bold">{trendingStory.authorPenName}:</strong> „{trendingStory.title}” – {trendingStory.content.substring(0, 70)}...
          </div>

          <div className="flex justify-between items-center text-[11px] text-amber-200 pt-1 border-t border-amber-700/40">
            <span className="flex items-center space-x-2">
              <span>🥹 {trendingStory.reactions.touching}</span>
              <span>❤️ {trendingStory.reactions.love}</span>
              <span>🦉 {trendingStory.reactions.wisdom}</span>
            </span>
            <span className="font-bold">Közösségi Parafatábla →</span>
          </div>
        </div>

        {/* TILE 5: Idővonalam (Mélylila, 3 col x 1 row Desktop) */}
        <div
          onClick={() => setActiveTab('memory')}
          className="metro-tile lg:col-span-3 sm:col-span-1 row-span-1 bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 rounded-lg p-4 flex flex-col justify-between border-t-4 border-purple-400 shadow-md text-white"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-extrabold tracking-wider text-purple-200 flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Idővonalam</span>
            </span>
            <span className="text-[10px] text-purple-300 font-semibold">1968 – 2026</span>
          </div>

          {/* Density Heatmap */}
          <div className="my-1">
            <div className="flex h-2 w-full rounded bg-purple-950 overflow-hidden space-x-0.5 border border-purple-800">
              <div className="bg-purple-400 w-1/5" title="Gyermekkor: 95% kész"></div>
              <div className="bg-purple-500 w-1/5" title="Kamaszkor: 80% kész"></div>
              <div className="bg-purple-900 w-1/5 relative" title="1976-1983: Csak 18% lefedettség!">
                <span className="absolute inset-0 bg-red-500/40 animate-pulse"></span>
              </div>
              <div className="bg-purple-400 w-1/5" title="Házasság & Első munka: 90%"></div>
              <div className="bg-purple-500 w-1/5" title="Család & Utazások: 85%"></div>
            </div>
            <div className="flex justify-between text-[9px] text-purple-300 mt-1 font-semibold">
              <span>'70</span>
              <span className="text-amber-400 font-black">'80 hiány</span>
              <span>'95</span>
              <span>'26</span>
            </div>
          </div>

          <span className="text-[11px] text-purple-200 font-semibold">Élet-idővonal megnyitása →</span>
        </div>

        {/* TILE 6: Szereplők (Smaragdzöld, 3 col x 1 row Desktop) */}
        <div
          onClick={() => setActiveTab('memory')}
          className="metro-tile lg:col-span-3 sm:col-span-1 row-span-1 bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 rounded-lg p-4 flex flex-col justify-between border-t-4 border-emerald-400 shadow-md text-white"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-200 flex items-center space-x-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>Szereplők</span>
            </span>
            <span className="text-xs font-bold text-emerald-300">{verifiedEntities.length} megerősítve</span>
          </div>

          <div className="flex items-center space-x-2 my-1">
            <div className="flex -space-x-2 overflow-hidden">
              <div className="inline-block h-7 w-7 rounded-full ring-2 ring-emerald-900 bg-amber-700 flex items-center justify-center text-[10px] font-bold">K</div>
              <div className="inline-block h-7 w-7 rounded-full ring-2 ring-emerald-900 bg-rose-700 flex items-center justify-center text-[10px] font-bold">P</div>
              <div className="inline-block h-7 w-7 rounded-full ring-2 ring-emerald-900 bg-blue-700 flex items-center justify-center text-[10px] font-bold">D</div>
              <div className="inline-block h-7 w-7 rounded-full ring-2 ring-emerald-900 bg-purple-700 flex items-center justify-center text-[10px] font-bold">K</div>
            </div>
            <span className="text-xs text-emerald-100 font-semibold">Kata, Péter, Dániel...</span>
          </div>

          <span className="text-[11px] text-emerald-300 font-semibold">Szereplőkártyák & Gráf →</span>
        </div>

        {/* TILE 7: Emlékek & Fotók (Mustársárga, 3 col x 1 row Desktop) */}
        <div
          onClick={() => setActiveTab('ai')}
          className="metro-tile lg:col-span-3 sm:col-span-1 row-span-1 bg-gradient-to-br from-amber-900 via-amber-800 to-yellow-950 rounded-lg p-4 flex flex-col justify-between border-t-4 border-yellow-400 shadow-md text-white"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-extrabold tracking-wider text-amber-200 flex items-center space-x-1.5">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Fotók / Emlékek</span>
            </span>
            <span className="text-xs font-bold text-amber-300">184 elem</span>
          </div>

          <div className="flex items-center space-x-2.5 my-1">
            <div className="w-9 h-9 bg-stone-100 text-stone-900 rounded p-1 shadow rotate-[-4deg] flex flex-col items-center justify-center shrink-0 border border-stone-300">
              <span className="text-[8px] font-bold">1994</span>
              <span className="text-[11px]">📷</span>
            </div>
            <p className="text-xs text-amber-100 line-clamp-2 leading-tight">
              „Kik vannak a képen? Fotófeltöltés és AI elemzés”
            </p>
          </div>

          <span className="text-[11px] text-amber-200 font-semibold">Fotók és Levelek feltöltése →</span>
        </div>

        {/* TILE 8: FateFamily (Karmazsinvörös, 3 col x 1 row Desktop) */}
        <div
          onClick={() => setActiveTab('family')}
          className="metro-tile lg:col-span-3 sm:col-span-1 row-span-1 bg-gradient-to-br from-red-950 via-rose-900 to-red-900 rounded-lg p-4 flex flex-col justify-between border-t-4 border-red-400 shadow-md text-white"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-extrabold tracking-wider text-red-200 flex items-center space-x-1.5">
              <Heart className="w-3.5 h-3.5" />
              <span>FateFamily</span>
            </span>
            <span className="text-[10px] bg-red-800/80 px-2 py-0.5 rounded text-red-200 font-bold">
              5 Családtag
            </span>
          </div>

          <div className="my-1">
            <p className="text-xs text-red-100 leading-tight">
              <strong className="font-bold">Anna (lányunk):</strong> új kérdést küldött a családfához!
            </p>
          </div>

          <span className="text-[11px] text-red-200 font-semibold">Többgenerációs emléktár →</span>
        </div>

      </div>

      {/* 3. Global Natural Language Search & Bottom Stats */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        
        <div className="flex items-center space-x-6 w-full md:w-auto justify-between md:justify-start">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-extrabold">Rögzített mesélés</span>
            <span className="text-white font-black text-sm">{user.totalAudioHours} óra</span>
          </div>
          <div className="h-7 w-px bg-slate-800"></div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-extrabold">Mesélési sorozat</span>
            <span className="text-emerald-400 font-black text-sm">🔥 {user.streakDays} napja</span>
          </div>
          <div className="h-7 w-px bg-slate-800"></div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-extrabold">Életlefedettség</span>
            <span className="text-blue-400 font-black text-sm">68% (Becslés)</span>
          </div>
        </div>

        {/* Natural Language Search Input */}
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSearch(searchQuery);
              }}
              placeholder="„Mutasd az 1990-es balatoni emlékeket...”"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
            />
          </div>
          <button
            onClick={() => onSearch(searchQuery)}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-lg font-bold text-xs border border-slate-700 transition shrink-0"
          >
            Keresés
          </button>
        </div>

      </div>

    </div>
  );
};
