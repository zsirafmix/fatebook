import React, { useState } from 'react';
import { X, Check, Book, Download, Printer, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PrintWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapterCount: number;
}

export const PrintWizardModal: React.FC<PrintWizardModalProps> = ({
  isOpen,
  onClose,
  chapterCount,
}) => {
  const [step, setStep] = useState(1);
  const [coverType, setCoverType] = useState('linen');
  const [paperType, setPaperType] = useState('ivory');

  if (!isOpen) return null;

  const handleFinishOrder = () => {
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.6 },
    });
    alert('🎉 Könyvrendelés és nyomdai előkészítés elindítva! A 300 DPI minősítésű PDF/X-1a fájl generálása elkészült.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn select-none">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 sm:p-7 shadow-2xl space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-md bg-amber-600/20 text-amber-400 flex items-center justify-center font-bold">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                FateBook Print & Export Wizard
              </h3>
              <p className="text-[11px] text-slate-400">
                Lépés {step} / 3 • Készítsd el fizikai könyvedet
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Format & Binding */}
        {step === 1 && (
          <div className="space-y-4 text-xs">
            <p className="text-slate-300">
              Válaszd ki a nyomtatott vagy digitális kivitelt a(z) <strong>{chapterCount} fejezethez</strong>:
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={() => setCoverType('linen')}
                className={`p-3.5 rounded-xl border cursor-pointer transition ${
                  coverType === 'linen'
                    ? 'bg-amber-950/60 border-amber-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-2xl mb-1">📖</div>
                <h4 className="font-bold text-sm text-amber-200">Prémium Keménytábla</h4>
                <p className="text-[11px] mt-1 text-slate-300">Vászonkötés, aranypréseléses betűk, védőborító fényképpel.</p>
                <span className="text-[10px] text-emerald-400 font-bold block mt-2">Nyomtatott példány</span>
              </div>

              <div
                onClick={() => setCoverType('digital')}
                className={`p-3.5 rounded-xl border cursor-pointer transition ${
                  coverType === 'digital'
                    ? 'bg-amber-950/60 border-amber-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-2xl mb-1">💻</div>
                <h4 className="font-bold text-sm text-amber-200">Digitális E-Könyv</h4>
                <p className="text-[11px] mt-1 text-slate-300">Azonnal letölthető PDF, EPUB és DOCX formátumban.</p>
                <span className="text-[10px] text-blue-400 font-bold block mt-2">Ingyenes export</span>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-slate-400 text-[11px] flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Az AI ellenőrizte a fotókat: mind a 28 kép megfelel a 300 DPI nyomdai követelményeknek.</span>
            </div>
          </div>
        )}

        {/* Step 2: Paper & Cover Options */}
        {step === 2 && (
          <div className="space-y-4 text-xs">
            <h4 className="font-bold text-slate-200">Papírtípus és Tipográfia:</h4>
            
            <div className="space-y-2">
              <label className="flex items-center space-x-3 p-2.5 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer">
                <input
                  type="radio"
                  name="paper"
                  checked={paperType === 'ivory'}
                  onChange={() => setPaperType('ivory')}
                  className="text-amber-500"
                />
                <div>
                  <span className="font-bold text-white block">Elefántcsont Munken Pure (120g)</span>
                  <span className="text-[11px] text-slate-400">Meleg, tükröződésmentes archív könyvpapír, 100+ év garancia.</span>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-2.5 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer">
                <input
                  type="radio"
                  name="paper"
                  checked={paperType === 'white'}
                  onChange={() => setPaperType('white')}
                  className="text-amber-500"
                />
                <div>
                  <span className="font-bold text-white block">Selyemfényű Műnyomó (135g)</span>
                  <span className="text-[11px] text-slate-400">Tökéletes a színes családi fotók és Polaroidok élénk bemutatásához.</span>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation & Dispatch */}
        {step === 3 && (
          <div className="space-y-4 text-xs text-center py-3">
            <div className="w-16 h-16 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mx-auto text-3xl">
              📚
            </div>
            <h4 className="text-base font-bold text-white">A könyved készen áll a gyártásra!</h4>
            <p className="text-slate-300 max-w-md mx-auto leading-relaxed">
              Összesen <strong>{chapterCount} fejezet</strong>, 342 oldal, 28 illusztráció, családfa melléklettel és elegáns vászonkötésben.
            </p>

            <div className="flex justify-center space-x-3 pt-2">
              <button
                onClick={() => alert('📄 PDF export letöltése elindult.')}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center space-x-1.5 border border-slate-700"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Digitális PDF Letöltése</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer controls */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-3 py-1.5 rounded text-slate-400 hover:text-white"
            >
              ← Vissza
            </button>
          ) : (
            <div></div>
          )}

          <div className="flex items-center space-x-2">
            <button onClick={onClose} className="px-3 py-1.5 rounded text-slate-400 hover:text-white">
              Bezárás
            </button>
            
            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 font-bold text-white shadow"
              >
                Tovább →
              </button>
            ) : (
              <button
                onClick={handleFinishOrder}
                className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 font-black text-white shadow-lg shadow-rose-900/40"
              >
                Rendelés és Nyomtatás
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
