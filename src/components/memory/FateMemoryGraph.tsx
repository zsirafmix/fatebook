import React from 'react';
import { FateEntity } from '../../types';
import { Brain, Users, MapPin, Calendar, Box, AlertTriangle, Sparkles, CheckCircle2 } from 'lucide-react';

interface FateMemoryGraphProps {
  entities: FateEntity[];
  contradictionsCount: number;
  onConfirmHypothesis: (entityId: string) => void;
  openContradictionModal: () => void;
  openCorrectionModal: () => void;
}

export const FateMemoryGraph: React.FC<FateMemoryGraphProps> = ({
  entities,
  contradictionsCount,
  onConfirmHypothesis,
  openContradictionModal,
  openCorrectionModal,
}) => {
  const persons = entities.filter((e) => e.type === 'person');
  const places = entities.filter((e) => e.type === 'place');
  const objects = entities.filter((e) => e.type === 'object');
  const hasEntities = entities.length > 0;

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
          {contradictionsCount > 0 ? (
            <button
              onClick={openContradictionModal}
              className="bg-amber-950 text-amber-200 border border-amber-700/80 px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1.5 shadow"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>{contradictionsCount} Ellentmondás észlelve</span>
            </button>
          ) : (
            <div className="bg-slate-800/90 text-emerald-300 border border-slate-700 px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>0 ellentmondás (Minden adat tiszta)</span>
            </div>
          )}

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
              {persons.length > 0 ? (
                persons.map((person) => {
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
                })
              ) : (
                <div className="p-4 bg-slate-950/60 rounded-xl border border-dashed border-slate-800 text-center text-xs py-7">
                  <Users className="w-6 h-6 text-slate-600 mx-auto mb-2" />
                  <p className="font-bold text-slate-400">Még nincsenek rögzített szereplők</p>
                  <p className="text-[11px] mt-1 text-slate-500 leading-relaxed">
                    Ahogy mesélsz a családtagjaidról és barátaidról a FateAI-nak, itt épülnek fel a szereplőkártyák.
                  </p>
                </div>
              )}
            </div>
          </div>
          <span className="text-[10px] text-slate-500 mt-3 block">
            Az AI soha nem egyesít bizonytalan személyeket engedély nélkül.
          </span>
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
              {places.length > 0 || objects.length > 0 ? (
                <>
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
                </>
              ) : (
                <div className="p-4 bg-slate-950/60 rounded-xl border border-dashed border-slate-800 text-center text-xs py-7">
                  <MapPin className="w-6 h-6 text-slate-600 mx-auto mb-2" />
                  <p className="font-bold text-slate-400">Még nincsenek rögzített helyszínek</p>
                  <p className="text-[11px] mt-1 text-slate-500 leading-relaxed">
                    A városok, nyaralóhelyek, iskolák és munkahelyek automatikusan ide kerülnek a meséléseidből.
                  </p>
                </div>
              )}
            </div>
          </div>
          <span className="text-[10px] text-slate-500 mt-3 block">
            Helyszínekhez és fontos tárgyakhoz rendelt emlékfejezetek.
          </span>
        </div>

        {/* 3. Chronology & Gap Detector */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-purple-400 flex items-center space-x-1.5">
                <Calendar className="w-4 h-4" />
                <span>Életkorszakok Lefedettsége</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-semibold">Évtizedek</span>
            </div>

            <div className="space-y-3.5 text-xs">
              {hasEntities ? (
                <>
                  <div>
                    <div className="flex justify-between text-slate-300 text-[11px] mb-1 font-semibold">
                      <span>1968–1975: Gyermekkor</span>
                      <span className="text-emerald-400 font-black">92%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[92%]"></div>
                    </div>
                  </div>

                  <div className="bg-amber-950/40 p-3 rounded-lg border border-amber-800/70 shadow-sm">
                    <div className="flex justify-between text-amber-200 text-[11px] mb-1 font-bold">
                      <span>1976–1983: Gimnáziumi évek</span>
                      <span className="text-amber-400 font-black">18% (Hiányzó fejezet!)</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 w-[18%]"></div>
                    </div>
                    <p className="text-[10px] text-amber-300/90 mt-2 leading-relaxed">
                      💡 <strong>Hiányzó fejezet javaslat:</strong> Az AI a következő beszélgetésben a barátokról kérdez.
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 text-[11px] mb-1 font-semibold">
                      <span>1984–1995: Pályakezdés</span>
                      <span className="text-emerald-400 font-black">88%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[88%]"></div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-4 bg-slate-950/60 rounded-xl border border-dashed border-slate-800 text-center text-xs py-7">
                  <Calendar className="w-6 h-6 text-slate-600 mx-auto mb-2" />
                  <p className="font-bold text-slate-400">Tiszta Életút-Térkép</p>
                  <p className="text-[11px] mt-1 text-slate-500 leading-relaxed">
                    Ahogy megosztod az emlékeidet, a lefedettségi sávok életre kelnek, és az AI feltérképezi a teljes életedet.
                  </p>
                </div>
              )}
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
