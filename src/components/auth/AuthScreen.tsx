import React, { useState } from 'react';
import { UserProfile, AiPersona } from '../../types';
import { BookOpen, Sparkles, User, ShieldCheck, Mail, Lock, Feather, ArrowRight, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AuthScreenProps {
  onLogin: (user: UserProfile, isNewRegistration?: boolean) => void;
  onDemoLogin: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, onDemoLogin }) => {
  const [mode, setMode] = useState<'register' | 'login'>('register');

  // Form Fields
  const [name, setName] = useState('');
  const [penName, setPenName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [aiName, setAiName] = useState('Krónikás Gergő');
  const [aiPersona, setAiPersona] = useState<AiPersona>('biographer');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Kérjük, töltsd ki az e-mail címet és a jelszót!');
      return;
    }

    if (mode === 'register') {
      if (!name.trim()) {
        setError('Kérjük, add meg a teljes nevedet a könyv szerzőjeként!');
        return;
      }
      if (!penName.trim()) {
        setError('Kérjük, válassz egy jeligét a FateBoard közösségi falhoz!');
        return;
      }
      if (password.length < 6) {
        setError('A jelszónak legalább 6 karakter hosszúnak kell lennie!');
        return;
      }

      const newUser: UserProfile = {
        id: `user-${Date.now()}`,
        name: name.trim(),
        penName: penName.trim(),
        email: email.trim(),
        aiName: aiName.trim() || 'Krónikás',
        aiPersona,
        tier: 'free',
        streakDays: 1,
        totalAudioHours: 0,
        totalWords: 0,
      };

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });

      // Pass true for brand new empty profile!
      onLogin(newUser, true);
    } else {
      // Login existing user
      const existingUser: UserProfile = {
        id: `user-${Date.now()}`,
        name: name.trim() || 'Új Látogató',
        penName: penName.trim() || 'KrónikásUser',
        email: email.trim(),
        aiName: aiName || 'Krónikás',
        aiPersona: 'biographer',
        tier: 'free',
        streakDays: 1,
        totalAudioHours: 0,
        totalWords: 0,
      };

      onLogin(existingUser, false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden select-none">
      
      {/* Ambient background glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-rose-900/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-900/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Brand Header */}
      <div className="text-center max-w-md mx-auto mb-6 z-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-600 via-purple-700 to-blue-600 shadow-xl shadow-rose-950/40 text-white font-black text-2xl mb-3">
          F
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center justify-center">
          FateBook<span className="text-rose-500">.</span>
        </h1>
        <p className="text-sm font-semibold text-rose-300 mt-1 font-serif italic">
          „Az életedből folyamatosan könyv lesz.”
        </p>
        <p className="text-xs text-slate-400 mt-2">
          Személyes AI-életrajzíró, digitális emlékarchívum, napló és anonim történetközösség.
        </p>
      </div>

      {/* Main Auth Card */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl z-10 backdrop-blur-xl">
        
        {/* Toggle Mode: Regisztráció vs Bejelentkezés */}
        <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 mb-6 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`flex-1 py-2.5 rounded-lg transition text-center ${
              mode === 'register'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Új Könyv Nyitása (Regisztráció)
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`flex-1 py-2.5 rounded-lg transition text-center ${
              mode === 'login'
                ? 'bg-slate-800 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Bejelentkezés
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 bg-red-950/60 border border-red-800 rounded-xl text-xs text-red-300 flex items-center space-x-2 animate-fadeIn">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {mode === 'register' && (
            <>
              {/* Full Name */}
              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  Teljes neved (A könyv szerzője):
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="pl. Kovács Péter"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 transition font-medium"
                  />
                </div>
              </div>

              {/* FateBoard Pen Name */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-slate-300 font-bold block">
                    FateBoard jeligéd (Közösségi álnév):
                  </label>
                  <span className="text-[10px] text-slate-400 font-semibold">Anonim</span>
                </div>
                <div className="relative">
                  <Feather className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={penName}
                    onChange={(e) => setPenName(e.target.value)}
                    placeholder="pl. ÖregRóka72, HegyvidékiVándor"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-white font-mono placeholder-slate-600 focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  🛡️ A valós neved és személyes adataid soha nem jelennek meg a nyilvános FateBoardon.
                </p>
              </div>

              {/* AI Biographer Name & Persona */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">
                    AI Életrajzíró neve:
                  </label>
                  <input
                    type="text"
                    value={aiName}
                    onChange={(e) => setAiName(e.target.value)}
                    placeholder="pl. Krónikás Gergő"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">
                    AI Személyiség típusa:
                  </label>
                  <select
                    value={aiPersona}
                    onChange={(e) => setAiPersona(e.target.value as AiPersona)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2.5 text-white focus:outline-none focus:border-blue-500 transition cursor-pointer font-medium"
                  >
                    <option value="biographer">Életrajzíró (Precíz, krónikás)</option>
                    <option value="friend">Barát (Melegszívű, laza)</option>
                    <option value="reporter">Riporter (Kérdező, mély)</option>
                    <option value="hunter">Emlékvadász (Érzékek, illatok)</option>
                    <option value="humorist">Humorista (Könnyed, vidám)</option>
                    <option value="writer">Író (Irodalmi regényes)</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Email */}
          <div>
            <label className="text-slate-300 font-bold block mb-1">
              E-mail cím:
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="pelda@email.hu"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 transition"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-slate-300 font-bold block mb-1">
              Jelszó:
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Legalább 6 karakter"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 transition"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 via-purple-700 to-blue-600 hover:from-rose-500 hover:to-blue-500 font-black text-xs text-white shadow-xl shadow-rose-950/40 transition active:scale-[0.98] flex items-center justify-center space-x-2 mt-2"
          >
            <span>
              {mode === 'register' ? 'Könyv Nyitása & Belépés' : 'Bejelentkezés a Könyvembe'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800"></div>
          </div>
          <span className="relative bg-slate-900 px-3 text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
            Vagy kipróbálás demó adatokkal
          </span>
        </div>

        {/* 1-Click Guest Demo Button */}
        <button
          type="button"
          onClick={onDemoLogin}
          className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs transition flex items-center justify-center space-x-2 shadow"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Kipróbálás Demó Fiókkal (Péter előre megírt könyve)</span>
        </button>

        {/* Privacy Note */}
        <div className="mt-5 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Évtizedes titkosított tárhely. Az adataidat nem használjuk nyilvános AI modellek tréningezésére.
          </span>
        </div>

      </div>

    </div>
  );
};
