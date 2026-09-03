import React, { useState } from 'react';
import { BookChapter, ChapterStatus } from '../../types';
import { BookOpen, Sparkles, Check, X, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ChapterWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveChapter: (chapter: Omit<BookChapter, 'id' | 'orderIndex' | 'pageNumber' | 'createdAt'>) => void;
}

export const ChapterWizardModal: React.FC<ChapterWizardModalProps> = ({
  isOpen,
  onClose,
  onSaveChapter,
}) => {
  const [title, setTitle] = useState('A Trevi-kút és a 100 lírás érme');
  const [timeBracket, setTimeBracket] = useState('1994. Július');
  const [style, setStyle] = useState('Irodalmi életrajz');
  const [status, setStatus] = useState<ChapterStatus>('reviewed');
  const [content, setContent] = useState(
    'A forróság úgy nehezedett a városra azon a délutánon, mint egy nehéz bársonyfüggöny. A macskaköveken szinte megolvadt a sarunk talpa, de amint befordultunk a szűk sikátorból a térre, a víz csobogása azonnal elmosta a zsibbadt fáradtságot. Kata ott állt a márványperem előtt, a táskája mélyén kotorászva, míg végül előhúzott egy kopott 100 lírás pénzérmét. Rám nézett azzal a jellegzetes, félig pajkos, félig komoly tekintetével: „Tudod, ide még vissza fogunk jönni a gyerekeinkkel is.” Akkor még csak álom volt a család, de két évvel később már Dániel babakocsiját toltuk a budai Gesztenyés-kertben.'
  );

  if (!isOpen) return null;

  const handleApprove = () => {
    // Fire festive celebration confetti!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    onSaveChapter({
      title,
      timeBracket,
      volumeName: 'I. Kötet: A kezdetek',
      content,
      style,
      status,
      readingTimeMinutes: 4,
      photoUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&auto=format&fit=crop&q=80',
      photoCaption: '„Kata a kútnál – Róma, 1994. július 18.”',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn select-none">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 sm:p-7 shadow-2xl space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-md bg-rose-600/20 text-rose-400 flex items-center justify-center font-bold">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                „Elkészítsem ebből a mai fejezetet?”
              </h3>
              <p className="text-[11px] text-slate-400">
                Az AI a beszélgetésből olvasmányos fejezetet szintetizált.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-3.5 text-xs">
          
          <div>
            <label className="text-slate-300 font-bold block mb-1">
              Javasolt fejezetcím:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-white font-bold text-xs focus:outline-none focus:border-rose-500 transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-slate-300 font-bold block mb-1">Időszak / Év:</label>
              <input
                type="text"
                value={timeBracket}
                onChange={(e) => setTimeBracket(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs"
              />
            </div>

            <div>
              <label className="text-slate-300 font-bold block mb-1">Írásmód stílusa:</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2 text-white text-xs font-semibold focus:outline-none"
              >
                <option>Irodalmi életrajz</option>
                <option>Napló forma</option>
                <option>Humoros memoár</option>
                <option>Dokumentarista / Tárgyilagos</option>
                <option>Klasszikus életrajz</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-bold block mb-1">Jóváhagyási szint:</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ChapterStatus)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2 text-white text-xs font-semibold focus:outline-none"
              >
                <option value="draft">AI-vázlat</option>
                <option value="reviewed">Ellenőrizve</option>
                <option value="final">Végleges (Kánon)</option>
              </select>
            </div>
          </div>

          {/* Synthesized Text Preview */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-emerald-400 font-bold uppercase text-[10px] flex items-center space-x-1">
                <Sparkles className="w-3 h-3" />
                <span>Generált Fejezetszöveg (Szerkeszthető):</span>
              </span>
              <span className="text-slate-400 text-[10px]">~4 perc olvasási idő</span>
            </div>
            
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 text-xs leading-relaxed font-serif focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800 text-[11px] text-slate-400 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              A nyers beszélgetési napló soha nem vész el. Bármikor visszaállíthatod az eredeti szöveget.
            </span>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-2.5 pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs rounded-lg text-slate-400 hover:text-white transition font-medium"
          >
            Mégsem
          </button>
          
          <button
            onClick={handleApprove}
            className="px-5 py-2 text-xs rounded-lg bg-rose-600 hover:bg-rose-500 font-black text-white shadow-lg shadow-rose-900/40 transition flex items-center space-x-1.5 active:scale-95"
          >
            <Check className="w-4 h-4" />
            <span>Jóváhagyás & Mentés a Könyvembe</span>
          </button>
        </div>

      </div>
    </div>
  );
};
