import React from 'react';
import { FateEntity } from '../../types';
import { Brain, Users, MapPin, Calendar, Box, AlertTriangle, Check, HelpCircle, Sparkles } from 'lucide-react';

interface FateMemoryGraphProps {
  entities: FateEntity[];
  onConfirmHypothesis: (entityId: string) => void;
  openContradictionModal: () => void;
  openCorrectionModal: () => void;
}

export const FateMemoryGraph: React.FC<FateMemoryGraphProps> = ({
  entities,
  onConfirmHypothesis,
  openContradictionModal,
  openCorrectionModal,
}) => {
  const persons = entities.filter((e) => e.type === 'person');
  const places = entities.filter((e) => e.type === 'place');
  const objects = entities.filter((e) => e.type === 'object');

  return (
    <div className="flex-1 flex flex-col space-y-4 max-w-5xl mx-auto w-full pb-20 select-none">
      
      {/* Top Controls Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div>
          <h2 className="text-base font-black text-purple-300 flex items-center space-x-2">
            <Brain className="w-5 h-5 text-purple-400" />
            <span>FateMemory – Strukturált Személyes Tudásbázis</span>
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">
            Összekapcsolt entitásgráf: személyek, helyek, korszakok és tárgyak. Hallucinációmentes kánon.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <button
            onClick={openContradictionModal}
            className="bg-amber-950 text-amber-200 border border-amber-700/80 px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1.5 shadow"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>1 Ellentmondás észlelve</span>
          </button>

          <button
            onClick={openCorrectionModal}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 font-bold transition"
          >
            „Ezt rosszul értetted” korrekció
          </button>
        </div>
      </div>

      {/* 3 Entity Category Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* 1. Persons & Family */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5">
                <Users className="w-4 h-4" />
                <span>Szereplők ({persons.length} fő)</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-semibold">Tények / Hipotézisek</span>
            </div>

            <div className="space-y-2.5">
              {persons.map((person) => {
                const isHypothesis = person.confidence === 'hypothesis';
                return (
                  <div
                    key={person.id}
                    className={`p-3 rounded-lg border transition ${
                      isHypothesis
                        ? 'bg-purple-950/40 border-purple-800/80'
                        : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className="font-bold text-white text-xs">{person.name}</span>
                          {isHypothesis ? (
                            <span className="text-[10px] bg-purple-900 text-purple-200 px-1.5 py-0.2 rounded font-mono font-bold border border-purple-700">
                              [?] Feltételezés
                            </span>
                          ) : (
                            <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.2 rounded font-bold border border-emerald-800">
                              Megerősítve
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-300 mt-1 leading-snug">{person.details}</p>
                        {person.inferredExplanation && (
                          <p className="text-[10px] text-purple-300/80 italic mt-1">
                            💡 {person.inferredExplanation}
                          </p>
                        )}
                      </div>

                      {isHypothesis && (
                        <button
                          onClick={() => onConfirmHypothesis(person.id)}
                          className="bg-purple-800 hover:bg-purple-700 text-white px-2 py-1 rounded text-[10px] font-bold shrink-0 ml-2 shadow transition"
                        >
                          Megerősítés
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <span className="text-[10px] text-slate-400 mt-3 block">Az AI soha nem egyesít bizonytalan személyeket engedély nélkül.</span>
        </div>

        {/* 2. Places & Locations */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center space-x-1.5">
                <MapPin className="w-4 h-4" />
                <span>Helyszínek ({places.length})</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-semibold">Térkép & emlékek</span>
            </div>

            <div className="space-y-2.5">
              {places.map((place) => (
                <div key={place.id} className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                  <div className="font-bold text-white text-xs">{place.name}</div>
                  <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">{place.details}</p>
                  <span className="text-[10px] text-cyan-300 font-mono mt-1 block font-semibold">
                    {place.relatedYears}
                  </span>
                </div>
              ))}

              {objects.map((obj) => (
                <div key={obj.id} className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                  <div className="font-bold text-white text-xs flex items-center space-x-1.5">
                    <Box className="w-3.5 h-3.5 text-amber-400" />
                    <span>{obj.name}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">{obj.details}</p>
                  <span className="text-[10px] text-amber-400 font-mono mt-1 block font-semibold">
                    {obj.relatedYears}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <span className="text-[10px] text-slate-400 mt-3 block">Helyszínekhez és fontos tárgyakhoz rendelt emlékfejezetek.</span>
        </div>

        {/* 3. Chronology & Gap Detector */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-purple-400 flex items-center space-x-1.5">
                <Calendar className="w-4 h-4" />
                <span>Életkorszakok Lefedettsége</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-semibold">1968–2026</span>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <div className="flex justify-between text-slate-300 text-[11px] mb-1 font-semibold">
                  <span>1968–1975: Gyermekkor</span>
                  <span className="text-emerald-400 font-black">92%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[92%]"></div>
                </div>
              </div>

              {/* Flagged Missing Era Gap */}
              <div className="bg-amber-950/40 p-3 rounded-lg border border-amber-800/70 shadow-sm">
                <div className="flex justify-between text-amber-200 text-[11px] mb-1 font-bold">
                  <span>1976–1983: Gimnáziumi évek</span>
                  <span className="text-amber-400 font-black">18% (Alig meséltél róla!)</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 w-[18%]"></div>
                </div>
                <p className="text-[10px] text-amber-300/90 mt-2 leading-relaxed">
                  💡 <strong>Hiányzó fejezet javaslat:</strong> Az AI a következő beszélgetésben a gimnáziumi barátokról és az érettségiről kérdez majd.
                </p>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 text-[11px] mb-1 font-semibold">
                  <span>1984–1995: Pályakezdés & Házasság</span>
                  <span className="text-emerald-400 font-black">88%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[88%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 text-[11px] mb-1 font-semibold">
                  <span>1996–2010: Család & Gyermeknevelés</span>
                  <span className="text-emerald-400 font-black">76%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[76%]"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-purple-300 flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>Az AI évtizedes skálán egyenletesen ösztönöz a teljes életút feltárására.</span>
          </div>
        </div>

      </div>

    </div>
  );
};
