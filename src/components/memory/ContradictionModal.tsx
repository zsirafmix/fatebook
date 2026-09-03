import React from 'react';
import { X, AlertTriangle, CheckCircle, HelpCircle, Layers } from 'lucide-react';
import { ContradictionItem } from '../../types';

interface ContradictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  contradiction: ContradictionItem;
  onResolve: (choice: string) => void;
}

export const ContradictionModal: React.FC<ContradictionModalProps> = ({
  isOpen,
  onClose,
  contradiction,
  onResolve,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn select-none">
      <div className="bg-slate-900 border border-amber-800/80 rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2.5 text-amber-400">
            <div className="w-8 h-8 rounded-md bg-amber-500/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Ellentmondás Észlelve</h3>
              <p className="text-[11px] text-amber-300/80 font-medium">Tényellenőrzés a FateMemoryban</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Prompt description */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-200 leading-relaxed">
          <p className="font-semibold text-white mb-1.5">{contradiction.title}:</p>
          <p className="text-slate-300">
            „{contradiction.context} <strong>Az AI soha nem dönt önkényesen a tényekről.</strong> Melyik a pontos dátum?”
          </p>
        </div>

        {/* 4 Choices */}
        <div className="space-y-2 text-xs">
          <button
            onClick={() => onResolve(contradiction.optionA)}
            className="w-full text-left p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700/80 text-white font-bold flex items-center justify-between transition group active:scale-95"
          >
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>{contradiction.optionA}</span>
            </div>
            <span className="text-[10px] text-slate-400 group-hover:text-white font-semibold">Tény rögzítése</span>
          </button>

          <button
            onClick={() => onResolve(contradiction.optionB)}
            className="w-full text-left p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700/80 text-white font-bold flex items-center justify-between transition group active:scale-95"
          >
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>{contradiction.optionB}</span>
            </div>
            <span className="text-[10px] text-slate-400 group-hover:text-white font-semibold">Tény rögzítése</span>
          </button>

          <button
            onClick={() => onResolve('Nem emlékszem pontosan')}
            className="w-full text-left p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700/80 text-slate-300 flex items-center justify-between transition group active:scale-95"
          >
            <div className="flex items-center space-x-2">
              <HelpCircle className="w-4 h-4 text-purple-400" />
              <span>Nem emlékszem pontosan</span>
            </div>
            <span className="text-[10px] text-purple-400 font-mono font-bold">[?] Bizonytalan adat</span>
          </button>

          <button
            onClick={() => onResolve('Két különböző eseményről van szó')}
            className="w-full text-left p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700/80 text-slate-300 flex items-center justify-between transition group active:scale-95"
          >
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-blue-400" />
              <span>Két különböző eseményről van szó</span>
            </div>
            <span className="text-[10px] text-blue-400 font-semibold">Külön entitások</span>
          </button>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs text-slate-400 hover:text-white font-medium"
          >
            Később döntök
          </button>
        </div>

      </div>
    </div>
  );
};
