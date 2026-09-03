import React, { useState, useEffect } from 'react';
import { X, Pause, Play, Check } from 'lucide-react';

interface VoiceStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFinishSession: (transcript: string, durationSeconds: number) => void;
}

export const VoiceStudioModal: React.FC<VoiceStudioModalProps> = ({
  isOpen,
  onClose,
  onFinishSession,
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [seconds, setSeconds] = useState(168); // 02:48 default
  const [liveTranscript, setLiveTranscript] = useState(
    '„...és akkor Apa beindította a motort, de a hűtővíz azonnal gőzölni kezdett. Mindenki nevetett, csak a nagymama csóválta a fejét a hátsó ülésen a dinnyés kosarak mellett...”'
  );

  useEffect(() => {
    if (!isOpen || isPaused) return;
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, isPaused]);

  if (!isOpen) return null;

  const minutes = Math.floor(seconds / 60);
  const remainingSecs = seconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(remainingSecs).padStart(2, '0')}`;

  const handleFinish = () => {
    onFinishSession(liveTranscript, seconds);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl flex flex-col justify-between p-6 sm:p-12 animate-fadeIn select-none">
      
      {/* Top Voice Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-3.5 h-3.5 rounded-full bg-red-500 animate-ping"></div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-slate-300">
            Élő Hangalapú Mesélés • Voice Activity Detection (VAD)
          </span>
        </div>
        
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-2 rounded-lg bg-slate-900 border border-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Middle Waveform, Timer & Live Speech-to-Text Transcript */}
      <div className="max-w-2xl mx-auto w-full text-center my-auto flex flex-col items-center">
        
        {/* Animated Waveform Bars */}
        <div className="flex items-center justify-center space-x-2.5 h-20 my-6">
          <div className={`wave-bar w-2 bg-blue-500 rounded-full ${isPaused ? 'h-2 !animation-none' : ''}`}></div>
          <div className={`wave-bar w-2 bg-indigo-500 rounded-full ${isPaused ? 'h-2 !animation-none' : ''}`}></div>
          <div className={`wave-bar w-2 bg-rose-500 rounded-full ${isPaused ? 'h-2 !animation-none' : ''}`}></div>
          <div className={`wave-bar w-2 bg-amber-500 rounded-full ${isPaused ? 'h-2 !animation-none' : ''}`}></div>
          <div className={`wave-bar w-2 bg-emerald-500 rounded-full ${isPaused ? 'h-2 !animation-none' : ''}`}></div>
          <div className={`wave-bar w-2 bg-purple-500 rounded-full ${isPaused ? 'h-2 !animation-none' : ''}`}></div>
          <div className={`wave-bar w-2 bg-cyan-400 rounded-full ${isPaused ? 'h-2 !animation-none' : ''}`}></div>
        </div>

        {/* Big Live Elapsed Timer */}
        <div className="text-4xl sm:text-5xl font-mono font-black text-white tracking-widest my-2">
          {formattedTime}
        </div>

        {/* Live Streaming Speech-to-Text Transcript */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 text-slate-200 text-sm sm:text-base leading-relaxed max-w-xl text-left shadow-2xl mt-4 w-full">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-xs font-black uppercase tracking-wider">
              Élő Átirat (Speech-to-Text):
            </span>
            <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-bold">
              Hangfelismerés aktív
            </span>
          </div>
          
          <p className="font-serif italic text-slate-100">
            {liveTranscript}
            <span className="inline-block w-2 h-4 bg-rose-500 ml-1.5 animate-pulse align-middle"></span>
          </p>
        </div>

        <p className="text-xs text-slate-400 mt-4 max-w-md">
          „Te csak mesélj. Az AI csendben figyel, és csak természetes, hosszabb szünetekben kérdez tovább.”
        </p>

      </div>

      {/* Bottom Voice Controls */}
      <div className="max-w-md mx-auto w-full flex items-center justify-center space-x-4">
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="px-6 py-3.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition flex items-center space-x-2 shadow-lg active:scale-95"
        >
          {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4 text-amber-400" />}
          <span>{isPaused ? 'Mesélés Folytatása' : 'Szüneteltetés'}</span>
        </button>

        <button
          onClick={handleFinish}
          className="px-7 py-3.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-xl shadow-rose-900/40 transition flex items-center space-x-2 active:scale-95"
        >
          <Check className="w-4 h-4" />
          <span>Befejezés & Fejezet Készítése</span>
        </button>
      </div>

    </div>
  );
};
