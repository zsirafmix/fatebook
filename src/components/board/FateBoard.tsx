import React, { useState } from 'react';
import { BoardStory } from '../../types';
import { Pin, Filter, Plus, Flame, Sparkles } from 'lucide-react';

interface FateBoardProps {
  stories: BoardStory[];
  onOpenPublishModal: () => void;
  onReact: (storyId: string, reactionKey: keyof BoardStory['reactions']) => void;
}

export const FateBoard: React.FC<FateBoardProps> = ({
  stories,
  onOpenPublishModal,
  onReact,
}) => {
  const [filter, setFilter] = useState('trending');

  const reactionEmojis: Record<keyof BoardStory['reactions'], { emoji: string; label: string }> = {
    touching: { emoji: '🥹', label: 'Megható' },
    funny: { emoji: '😂', label: 'Vicces' },
    incredible: { emoji: '😲', label: 'Hihetetlen' },
    thoughtful: { emoji: '🤔', label: 'Elgondolkodtató' },
    love: { emoji: '❤️', label: 'Szerelem' },
    adventure: { emoji: '🎒', label: 'Kaland' },
    creepy: { emoji: '🕯️', label: 'Hátborzongató' },
    wisdom: { emoji: '🦉', label: 'Életbölcsesség' },
  };

  const rotations = ['rotate-[-1.5deg]', 'rotate-[1.8deg]', 'rotate-[-0.8deg]', 'rotate-[1.2deg]'];
  const pinColors = ['bg-red-600', 'bg-blue-600', 'bg-emerald-600', 'bg-amber-600'];

  return (
    <div className="flex-1 flex flex-col space-y-4 max-w-6xl mx-auto w-full pb-20 select-none">
      
      {/* Top Filter & CTA Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div>
          <h2 className="text-base font-black text-amber-300 flex items-center space-x-2">
            <Pin className="w-4 h-4 text-amber-400" />
            <span>FateBoard – Közösségi Parafatábla</span>
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">
            Valódi élettörténetek anonim jeligével. Nincsenek nevek, csak sorsok, emlékek és tanulságok.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <div className="flex items-center bg-slate-800 rounded-lg px-2.5 py-1 border border-slate-700 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
            >
              <option value="trending">🔥 Most pörög (Smart Ranking)</option>
              <option value="funny">😂 Ma legviccesebb</option>
              <option value="touching">🥹 Ma legmeghatóbb</option>
              <option value="weekly">⭐ A hét története</option>
              <option value="night">🌙 Esti olvasmány</option>
            </select>
          </div>

          <button
            onClick={onOpenPublishModal}
            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-black transition shadow-lg flex items-center space-x-1.5 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Történet Kitűzése a Táblára</span>
          </button>
        </div>
      </div>

      {/* Corkboard Background & Pinned Notes Grid */}
      <div className="cork-texture rounded-2xl p-4 sm:p-7 border-4 border-amber-950 shadow-2xl min-h-[580px] overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story, idx) => {
            const rotationClass = rotations[idx % rotations.length];
            const pinColor = pinColors[idx % pinColors.length];

            return (
              <div
                key={story.id}
                className={`bg-amber-50/95 text-stone-900 p-5 sm:p-6 rounded-lg shadow-2xl border-t-4 border-amber-500 ${rotationClass} relative flex flex-col justify-between min-h-[240px] transition transform hover:rotate-0 hover:scale-[1.02] duration-200`}
              >
                {/* Brass / Colored Pushpin */}
                <div
                  className={`absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full ${pinColor} shadow-md border-2 border-white`}
                ></div>

                <div>
                  <div className="flex items-center justify-between text-[11px] text-stone-500 mb-2">
                    <span className="font-bold text-stone-800 font-mono bg-amber-200/80 px-2 py-0.5 rounded border border-amber-300">
                      Jelige: {story.authorPenName}
                    </span>
                    <span className="font-semibold">{story.era} • {story.location}</span>
                  </div>

                  <h3 className="font-bold text-base text-stone-900 leading-snug">
                    „{story.title}”
                  </h3>

                  <p className="text-xs text-stone-800 mt-2.5 leading-relaxed font-serif">
                    {story.content}
                  </p>
                </div>

                {/* Emotional Reactions Toolbar */}
                <div className="pt-3.5 mt-4 border-t border-amber-200/90 flex flex-col space-y-2">
                  <div className="flex flex-wrap items-center gap-1">
                    {(Object.keys(reactionEmojis) as Array<keyof BoardStory['reactions']>).slice(0, 5).map((key) => (
                      <button
                        key={key}
                        onClick={() => onReact(story.id, key)}
                        title={reactionEmojis[key].label}
                        className="hover:bg-amber-200 px-2 py-1 rounded transition text-xs flex items-center space-x-1 border border-amber-300/40 active:scale-95 bg-white/50"
                      >
                        <span>{reactionEmojis[key].emoji}</span>
                        <span className="font-bold text-[11px] text-stone-800">
                          {story.reactions[key]}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-stone-500 pt-1">
                    <span>Kitűzve: {story.createdAt}</span>
                    <span className="font-bold text-emerald-800">
                      {story.readCompletionRate}% olvasási arány
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
