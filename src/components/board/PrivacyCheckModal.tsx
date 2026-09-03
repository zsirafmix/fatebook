import React, { useState } from 'react';
import { X, ShieldAlert, Check, UserCheck, Eye } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PrivacyCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (title: string, content: string, penName: string, era: string, location: string) => void;
}

export const PrivacyCheckModal: React.FC<PrivacyCheckModalProps> = ({
  isOpen,
  onClose,
  onPublish,
}) => {
  const [penName, setPenName] = useState('ÖregRóka72');
  const [title, setTitle] = useState('A siófoki restiben felejtett jegygyűrű');
  const [content, setContent] = useState(
    'A siófoki vasútállomás restijében hagytam a papírzacskót, amiben a félretett fizetésemből vett gyűrű lapult. A restis néni a kezembe nyomta, mikor visszarohantam: „Tudtam, hogy visszajössz érte, fiam.” Azóta 44 év telt el.'
  );
  const [visibility, setVisibility] = useState('board');
  const [isAnonymized, setIsAnonymized] = useState(false);

  if (!isOpen) return null;

  const handleApplyAnonymize = () => {
    setIsAnonymized(true);
    setContent(
      'Egy balatoni vasútállomás restijében hagytam a papírzacskót, amiben a félretett fizetésemből vett gyűrű lapult. A kedves pultos néni a kezembe nyomta, mikor visszarohantam: „Tudtam, hogy visszajössz érte, fiam.” Azóta több mint négy évtized telt el.'
    );
  };

  const handleConfirm = () => {
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
    });
    onPublish(title, content, penName, '1982', 'Balaton');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn select-none">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-md bg-amber-600/20 text-amber-400 flex items-center justify-center font-bold">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                FateBoard Publikáció & Privacy Guard
              </h3>
              <p className="text-[11px] text-slate-400">
                Szigorú adatvédelem: a személyes adatok soha nem kerülnek ki automatikusan.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Privacy Scanner Alert */}
        <div className="p-3.5 bg-amber-950/50 border border-amber-800/80 rounded-xl text-xs text-amber-200 space-y-2">
          <div className="flex items-center space-x-1.5 font-bold">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>AI Privacy-Check eredménye:</span>
          </div>
          
          <p className="text-[11px] text-amber-300/90 leading-relaxed">
            {isAnonymized ? (
              <span className="text-emerald-400 font-bold flex items-center space-x-1">
                <Check className="w-3.5 h-3.5" />
                <span>Minden érzékeny adat (helyszín, évszám) sikeresen anonimizálva!</span>
              </span>
            ) : (
              <span>
                Felismerhető elemek észlelve: <strong className="text-white font-mono bg-amber-900/60 px-1 py-0.5 rounded">„Siófok”</strong>, <strong className="text-white font-mono bg-amber-900/60 px-1 py-0.5 rounded">„44 év”</strong>. Javasoljuk az automatikus általánosítást.
              </span>
            )}
          </p>

          {!isAnonymized && (
            <button
              onClick={handleApplyAnonymize}
              className="bg-amber-700 hover:bg-amber-600 text-white px-3 py-1.5 rounded-md font-bold text-[11px] transition shadow flex items-center space-x-1"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>1-Kattintásos Anonimizálás Alkalmazása</span>
            </button>
          )}
        </div>

        {/* Pen Name & Story Text */}
        <div className="space-y-3 text-xs">
          <div>
            <label className="text-slate-300 font-bold block mb-1">
              Választott jeligéd a táblán (nem a valós neved):
            </label>
            <input
              type="text"
              value={penName}
              onChange={(e) => setPenName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono font-bold focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-slate-300 font-bold block mb-1">
              Történet szövege (nyilvános előnézet):
            </label>
            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 text-xs font-serif leading-relaxed focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-slate-300 font-bold block mb-1">Láthatóság:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setVisibility('board')}
                className={`p-2 rounded-lg border text-left text-xs transition ${
                  visibility === 'board'
                    ? 'bg-amber-950/60 border-amber-600 text-white font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <span>📌 Anonim FateBoard</span>
                <span className="text-[10px] block text-slate-400">Jeligével a közösségnek</span>
              </button>

              <button
                onClick={() => setVisibility('family')}
                className={`p-2 rounded-lg border text-left text-xs transition ${
                  visibility === 'family'
                    ? 'bg-amber-950/60 border-amber-600 text-white font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <span>👨‍👩‍👧 Csak Család</span>
                <span className="text-[10px] block text-slate-400">FateFamily archívumba</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-800 text-xs">
          <button onClick={onClose} className="px-3.5 py-2 text-slate-400 hover:text-white">
            Mégsem
          </button>
          
          <button
            onClick={handleConfirm}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 font-bold text-white shadow-lg active:scale-95 transition flex items-center space-x-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Kitűzés a FateBoardra</span>
          </button>
        </div>

      </div>
    </div>
  );
};
