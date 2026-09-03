import React, { useState } from 'react';
import { BookChapter } from '../../types';
import { ChevronLeft, ChevronRight, Printer, List, Edit3, Sparkles } from 'lucide-react';

interface BookReaderProps {
  chapters: BookChapter[];
  onOpenPrintWizard: () => void;
  onUpdateChapter: (chapterId: string, newContent: string) => void;
}

export const BookReader: React.FC<BookReaderProps> = ({
  chapters,
  onOpenPrintWizard,
}) => {
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(chapters.length - 1); // latest by default
  const [showToc, setShowToc] = useState(false);

  const activeChapter = chapters[selectedChapterIndex] || chapters[0];

  const handlePrev = () => {
    if (selectedChapterIndex > 0) {
      setSelectedChapterIndex(selectedChapterIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedChapterIndex < chapters.length - 1) {
      setSelectedChapterIndex(selectedChapterIndex + 1);
    }
  };

  return (
    <div className="flex-1 flex flex-col space-y-4 max-w-5xl mx-auto w-full pb-20 select-none">
      
      {/* Top Controls Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowToc(!showToc)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center space-x-1.5 transition border border-slate-700"
          >
            <List className="w-4 h-4 text-rose-400" />
            <span>Tartalomjegyzék</span>
          </button>

          <div>
            <span className="font-book font-black text-sm sm:text-base text-rose-200 block sm:inline">
              Péter Könyve • {activeChapter.volumeName}
            </span>
            <span className="text-[11px] text-slate-400 sm:ml-2">
              (Fejezet {selectedChapterIndex + 1} / {chapters.length})
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={onOpenPrintWizard}
            className="bg-amber-800/90 hover:bg-amber-700 text-amber-100 px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition shadow"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Nyomtatás & Export Wizard</span>
          </button>

          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 text-xs text-slate-200 border border-slate-700">
            <button
              onClick={handlePrev}
              disabled={selectedChapterIndex === 0}
              className="px-2.5 py-1.5 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed rounded font-bold transition flex items-center space-x-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Előző</span>
            </button>
            <span className="px-2 text-[11px] text-slate-400 font-mono font-semibold">
              {activeChapter.pageNumber}-{activeChapter.pageNumber + 1}. oldal
            </span>
            <button
              onClick={handleNext}
              disabled={selectedChapterIndex === chapters.length - 1}
              className="px-2.5 py-1.5 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed rounded font-bold transition flex items-center space-x-1"
            >
              <span className="hidden sm:inline">Következő</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Table of Contents Drawer (Collapsible) */}
      {showToc && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl animate-fadeIn">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-rose-300 mb-2.5">
            Tartalomjegyzék (Kattints a fejezetre):
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
            {chapters.map((ch, idx) => (
              <button
                key={ch.id}
                onClick={() => {
                  setSelectedChapterIndex(idx);
                  setShowToc(false);
                }}
                className={`text-left p-2.5 rounded-lg border text-xs transition ${
                  selectedChapterIndex === idx
                    ? 'bg-rose-950/80 border-rose-600 text-white font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span className="text-[10px] text-rose-400 block font-mono">{ch.timeBracket}</span>
                <span className="truncate block mt-0.5">{ch.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Realistic Book Spread Outer Container */}
      <div className="flex-1 flex justify-center items-center py-1 sm:py-3">
        <div className="w-full max-w-4xl bg-stone-900 rounded-xl p-2 sm:p-4 shadow-2xl border border-stone-800 flex justify-center">
          
          {/* Two-Page Spread (Grid on md+, stacked on mobile) */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 rounded-lg shadow-2xl overflow-hidden relative border border-amber-950/40">
            
            {/* LEFT PAGE (Even Page) */}
            <div className="book-paper p-6 sm:p-9 text-stone-900 flex flex-col justify-between min-h-[490px] relative border-r border-stone-300/60">
              {/* Running header */}
              <div className="flex justify-between items-center text-[10px] text-stone-500 font-book uppercase tracking-widest pb-3 border-b border-stone-200">
                <span>Péter Élettörténete</span>
                <span>{activeChapter.timeBracket}</span>
              </div>

              {/* Page Body */}
              <div className="my-auto py-4">
                <div className="text-xs text-rose-900 font-extrabold uppercase tracking-wider mb-1">
                  Fejezet {selectedChapterIndex + 1} • {activeChapter.readingTimeMinutes} perc olvasás
                </div>
                
                <h2 className="font-book text-2xl sm:text-3xl font-bold text-stone-900 leading-tight mb-4">
                  {activeChapter.title}
                </h2>
                
                <p className="font-book text-sm sm:text-base leading-relaxed text-stone-800 text-justify first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-2.5 first-letter:text-rose-900">
                  {activeChapter.content.substring(0, Math.floor(activeChapter.content.length / 2))}
                </p>
              </div>

              {/* Running footer */}
              <div className="flex justify-between items-center text-xs text-stone-500 font-book pt-3 border-t border-stone-200">
                <span>{activeChapter.pageNumber}</span>
                <span className="text-[10px] italic">
                  Státusz: <strong className="text-rose-900">{activeChapter.status === 'final' ? 'Kánon' : 'Ellenőrizve'}</strong>
                </span>
              </div>
            </div>

            {/* RIGHT PAGE (Odd Page) with Spine Shadow & Embedded Polaroid */}
            <div className="book-paper p-6 sm:p-9 text-stone-900 flex flex-col justify-between min-h-[490px] relative">
              {/* Realistic spine shadow on inner edge */}
              <div className="hidden md:block absolute left-0 top-0 bottom-0 w-8 book-spine-shadow pointer-events-none"></div>

              {/* Running header */}
              <div className="flex justify-between items-center text-[10px] text-stone-500 font-book uppercase tracking-widest pb-3 border-b border-stone-200">
                <span className="truncate max-w-[180px]">{activeChapter.title}</span>
                <span>{activeChapter.style}</span>
              </div>

              {/* Page Body */}
              <div className="my-auto py-3 flex flex-col items-center">
                {/* Embedded Polaroid Photo (if available) */}
                {activeChapter.photoUrl && (
                  <div className="bg-white p-2.5 pb-4 shadow-xl border border-stone-200 rotate-1 max-w-[240px] my-2 transition transform hover:rotate-0 duration-200">
                    <div className="w-full h-36 bg-stone-200 overflow-hidden flex items-center justify-center text-stone-500 text-xs rounded-sm">
                      <img
                        src={activeChapter.photoUrl}
                        alt="Emlék fotó"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="font-hand text-sm text-stone-800 text-center mt-2 font-bold">
                      {activeChapter.photoCaption || '„Emlékezetes pillanat”'}
                    </p>
                  </div>
                )}

                <p className="font-book text-sm sm:text-base leading-relaxed text-stone-800 text-justify mt-3">
                  {activeChapter.content.substring(Math.floor(activeChapter.content.length / 2))}
                </p>
              </div>

              {/* Running footer */}
              <div className="flex justify-between items-center text-xs text-stone-500 font-book pt-3 border-t border-stone-200">
                <button
                  onClick={() => alert("✍️ Fejezetszerkesztő megnyitva: Finomhangolhatod a szavakat, bekezdéseket generálhatsz újra vagy új fotót adhatsz hozzá.")}
                  className="text-[11px] text-rose-900 hover:text-rose-700 font-bold flex items-center space-x-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Szerkesztés & Újragenerálás</span>
                </button>
                <span>{activeChapter.pageNumber + 1}</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Book Summary Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 text-xs flex flex-wrap items-center justify-between gap-2 text-slate-400">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>A fejezetek drag-and-drop rendezhetők és tematikus kötetekbe (pl. Gyermekkor, Család, Karrier) csoportosíthatók.</span>
        </div>
        <span className="text-slate-300 font-semibold">
          Teljes könyv: {chapters.length} fejezet • ~342 oldal
        </span>
      </div>

    </div>
  );
};
