import React, { useState, useEffect } from 'react';
import { Sermon, ScriptureRef, FontSize, PulpitTheme, BibleVerse } from '../types';
import { getPassageVerses, fetchAndCachePassage } from '../data/bibleVerses';
import { formatScriptureDisplay } from '../utils/bibleParser';
import { ScriptureBadge } from './ScriptureBadge';
import { 
  BookOpen, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Maximize2, 
  Layers, 
  Flame, 
  ShieldAlert, 
  Smartphone,
  Eye,
  CheckCheck,
  List
} from 'lucide-react';

interface PreachModeProps {
  sermon: Sermon;
  onUpdateSermon: (updatedSermon: Sermon) => void;
  onOpenBibleModal: (scripture: ScriptureRef) => void;
  pulpitTheme: PulpitTheme;
  setPulpitTheme: (theme: PulpitTheme) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
}

export const PreachMode: React.FC<PreachModeProps> = ({
  sermon,
  onUpdateSermon,
  onOpenBibleModal,
  pulpitTheme,
  setPulpitTheme,
  fontSize,
  setFontSize,
}) => {
  const [activeScriptureId, setActiveScriptureId] = useState<string | null>(null);
  const [wakeLockActive, setWakeLockActive] = useState<boolean>(false);
  const [wakeLockSentinel, setWakeLockSentinel] = useState<any>(null);
  const [showBibleSidePanel, setShowBibleSidePanel] = useState<boolean>(true);
  const [viewAllSectionVerses, setViewAllSectionVerses] = useState<boolean>(false);

  // Flatten all scriptures in sermon order
  const allScriptures: { scripture: ScriptureRef; sectionId: string; sectionTitle: string; sectionIndex: number }[] = [];
  sermon.sections.forEach((sec, idx) => {
    sec.scriptures.forEach((sc) => {
      allScriptures.push({
        scripture: sc,
        sectionId: sec.id,
        sectionTitle: sec.title,
        sectionIndex: idx + 1,
      });
    });
  });

  // Current active scripture object
  const currentActiveScripture = allScriptures.find(item => item.scripture.id === activeScriptureId)?.scripture 
    || allScriptures.find(item => item.scripture.status === 'active')?.scripture
    || (allScriptures.length > 0 ? allScriptures[0].scripture : null);

  const currentActiveIndex = currentActiveScripture 
    ? allScriptures.findIndex(item => item.scripture.id === currentActiveScripture.id)
    : -1;

  // Active Section
  const activeSectionId = currentActiveScripture 
    ? allScriptures.find(item => item.scripture.id === currentActiveScripture.id)?.sectionId
    : null;
  const currentActiveSection = sermon.sections.find(s => s.id === activeSectionId);

  // Screen Wake Lock support
  useEffect(() => {
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          const lock = await (navigator as any).wakeLock.request('screen');
          setWakeLockSentinel(lock);
          setWakeLockActive(true);
          lock.addEventListener('release', () => {
            setWakeLockActive(false);
          });
        }
      } catch (err) {
        console.warn('Wake Lock not available or denied', err);
      }
    };

    requestWakeLock();

    return () => {
      if (wakeLockSentinel) {
        wakeLockSentinel.release().catch(() => {});
      }
    };
  }, []);

  const handleScriptureClick = (scripture: ScriptureRef) => {
    const updatedSections = sermon.sections.map((sec) => ({
      ...sec,
      scriptures: sec.scriptures.map((sc) => {
        if (sc.id === scripture.id) {
          return { ...sc, status: 'active' as const };
        }
        if (sc.status === 'active') {
          return { ...sc, status: 'completed' as const };
        }
        return sc;
      }),
    }));

    setActiveScriptureId(scripture.id);
    onUpdateSermon({
      ...sermon,
      sections: updatedSections,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleMarkScriptureStatus = (scriptureId: string, newStatus: 'pending' | 'active' | 'completed') => {
    const updatedSections = sermon.sections.map((sec) => ({
      ...sec,
      scriptures: sec.scriptures.map((sc) => {
        if (sc.id === scriptureId) {
          return { ...sc, status: newStatus };
        }
        return sc;
      }),
    }));

    if (newStatus === 'active') {
      setActiveScriptureId(scriptureId);
    }

    onUpdateSermon({
      ...sermon,
      sections: updatedSections,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleNextScripture = () => {
    if (currentActiveIndex >= 0 && currentActiveIndex < allScriptures.length - 1) {
      const nextItem = allScriptures[currentActiveIndex + 1];
      handleScriptureClick(nextItem.scripture);
    } else if (currentActiveIndex === -1 && allScriptures.length > 0) {
      handleScriptureClick(allScriptures[0].scripture);
    }
  };

  const handlePrevScripture = () => {
    if (currentActiveIndex > 0) {
      const prevItem = allScriptures[currentActiveIndex - 1];
      handleScriptureClick(prevItem.scripture);
    }
  };

  const handleMarkCurrentCompletedAndNext = () => {
    if (currentActiveScripture) {
      handleMarkScriptureStatus(currentActiveScripture.id, 'completed');
      if (currentActiveIndex < allScriptures.length - 1) {
        const nextItem = allScriptures[currentActiveIndex + 1];
        handleScriptureClick(nextItem.scripture);
      }
    }
  };

  // Theme Styles
  const getThemeContainerClass = () => {
    switch (pulpitTheme) {
      case 'sepia':
        return 'bg-[#fbf7ee] text-[#2c2416]';
      case 'dark':
        return 'bg-stone-950 text-stone-100';
      case 'pulpit-amber':
        return 'bg-[#121110] text-[#f5ebd7]';
      case 'light':
      default:
        return 'bg-stone-100/70 text-stone-900';
    }
  };

  const getCardBgClass = () => {
    switch (pulpitTheme) {
      case 'sepia':
        return 'bg-[#f4ede0] border-[#dfd2be] shadow-xs';
      case 'dark':
        return 'bg-stone-900 border-stone-800 shadow-xs';
      case 'pulpit-amber':
        return 'bg-[#1d1a16] border-[#383025] shadow-xs';
      case 'light':
      default:
        return 'bg-white border-stone-200 shadow-xs';
    }
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'normal': return 'text-base leading-relaxed';
      case 'large': return 'text-lg md:text-xl leading-relaxed';
      case 'xlarge': return 'text-xl md:text-2xl leading-loose';
      case 'huge': return 'text-2xl md:text-3xl leading-loose';
      default: return 'text-lg leading-relaxed';
    }
  };

  // Dynamic verse loading with offline fallback & online caching
  const [activeVerses, setActiveVerses] = useState<BibleVerse[]>([]);

  useEffect(() => {
    let isMounted = true;
    if (currentActiveScripture) {
      const initial = getPassageVerses(
        currentActiveScripture.book,
        currentActiveScripture.chapter,
        currentActiveScripture.verseStart,
        currentActiveScripture.verseEnd
      );
      setActiveVerses(initial);

      const hasMissing = initial.some(v => !v.text || v.text.trim() === '');
      if (hasMissing) {
        fetchAndCachePassage(
          currentActiveScripture.book,
          currentActiveScripture.chapter,
          currentActiveScripture.verseStart,
          currentActiveScripture.verseEnd
        ).then((success) => {
          if (success && isMounted) {
            const updated = getPassageVerses(
              currentActiveScripture.book,
              currentActiveScripture.chapter,
              currentActiveScripture.verseStart,
              currentActiveScripture.verseEnd
            );
            setActiveVerses(updated);
          }
        });
      }
    } else {
      setActiveVerses([]);
    }
    return () => { isMounted = false; };
  }, [currentActiveScripture?.id, currentActiveScripture?.book, currentActiveScripture?.chapter, currentActiveScripture?.verseStart, currentActiveScripture?.verseEnd]);

  // All verses of current active section
  const sectionScriptures = currentActiveSection ? currentActiveSection.scriptures : [];

  const completedCount = allScriptures.filter(s => s.scripture.status === 'completed').length;
  const progressPercent = allScriptures.length > 0 ? Math.round((completedCount / allScriptures.length) * 100) : 0;

  return (
    <div className={`min-h-[calc(100vh-4rem)] p-3 sm:p-5 lg:p-6 transition-colors duration-300 ${getThemeContainerClass()}`}>
      
      {/* Top Pulpit Toolbar */}
      <div className="max-w-7xl mx-auto mb-5 flex flex-wrap items-center justify-between gap-3 bg-stone-900/90 text-stone-100 p-3.5 rounded-2xl border border-stone-800 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-stone-950 font-bold">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-base sm:text-lg text-white truncate max-w-xs sm:max-w-md">
              {sermon.title}
            </h2>
            <div className="flex items-center gap-2 text-xs text-stone-400">
              {sermon.mainScripture && (
                <span className="text-amber-400 font-semibold">{sermon.mainScripture}</span>
              )}
              <span>• {sermon.targetDurationMinutes} min</span>
            </div>
          </div>
        </div>

        {/* Theme & Controls Switcher */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          
          {/* Themes */}
          <div className="flex items-center bg-stone-950 p-1 rounded-xl border border-stone-800">
            <button
              type="button"
              onClick={() => setPulpitTheme('light')}
              className={`px-2.5 py-1 rounded-lg font-medium cursor-pointer ${pulpitTheme === 'light' ? 'bg-white text-stone-900 font-bold' : 'text-stone-400 hover:text-white'}`}
              title="Tema Claro"
            >
              Claro
            </button>
            <button
              type="button"
              onClick={() => setPulpitTheme('sepia')}
              className={`px-2.5 py-1 rounded-lg font-medium cursor-pointer ${pulpitTheme === 'sepia' ? 'bg-[#fbf7ee] text-[#2c2416] font-bold' : 'text-stone-400 hover:text-white'}`}
              title="Tema Sépia / Papiro"
            >
              Sépia
            </button>
            <button
              type="button"
              onClick={() => setPulpitTheme('pulpit-amber')}
              className={`px-2.5 py-1 rounded-lg font-medium cursor-pointer ${pulpitTheme === 'pulpit-amber' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400 hover:text-white'}`}
              title="Tema Púlpito Âmbar"
            >
              Âmbar
            </button>
            <button
              type="button"
              onClick={() => setPulpitTheme('dark')}
              className={`px-2.5 py-1 rounded-lg font-medium cursor-pointer ${pulpitTheme === 'dark' ? 'bg-stone-800 text-white font-bold' : 'text-stone-400 hover:text-white'}`}
              title="Tema Noturno OLED"
            >
              Noturno
            </button>
          </div>

          {/* Font Size */}
          <div className="flex items-center bg-stone-950 p-1 rounded-xl border border-stone-800">
            <button
              type="button"
              onClick={() => setFontSize('normal')}
              className={`px-2 py-1 rounded text-xs cursor-pointer ${fontSize === 'normal' ? 'bg-stone-800 text-amber-300 font-bold' : 'text-stone-400'}`}
              title="Fonte Normal"
            >
              A
            </button>
            <button
              type="button"
              onClick={() => setFontSize('large')}
              className={`px-2 py-1 rounded text-sm cursor-pointer ${fontSize === 'large' ? 'bg-stone-800 text-amber-300 font-bold' : 'text-stone-400'}`}
              title="Fonte Grande"
            >
              A+
            </button>
            <button
              type="button"
              onClick={() => setFontSize('xlarge')}
              className={`px-2 py-1 rounded text-base cursor-pointer ${fontSize === 'xlarge' ? 'bg-stone-800 text-amber-300 font-bold' : 'text-stone-400'}`}
              title="Fonte Extra Grande"
            >
              A++
            </button>
          </div>

          {/* Toggle Bible Side Panel */}
          <button
            type="button"
            onClick={() => setShowBibleSidePanel(!showBibleSidePanel)}
            className={`px-3 py-1.5 rounded-xl border font-bold inline-flex items-center gap-1.5 cursor-pointer ${showBibleSidePanel ? 'bg-amber-500 text-stone-950 border-amber-400' : 'bg-stone-800 text-stone-300 border-stone-700'}`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{showBibleSidePanel ? 'Ocultar Bíblia' : 'Mostrar Bíblia'}</span>
          </button>
        </div>
      </div>

      {/* Scripture Live Sequence Flow Bar */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-stone-900 text-stone-200 p-4 rounded-2xl border border-stone-800 shadow-md space-y-3">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider text-amber-400 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" /> Roteiro de Versículos ({completedCount}/{allScriptures.length})
              </span>
              <span className="text-xs text-stone-400 font-mono">
                {progressPercent}% ministrado
              </span>
            </div>

            {/* Quick Navigation Stepper */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevScripture}
                disabled={currentActiveIndex <= 0}
                className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 disabled:opacity-30 text-stone-200 cursor-pointer"
                title="Versículo Anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono text-stone-300">
                {currentActiveIndex >= 0 ? `${currentActiveIndex + 1} de ${allScriptures.length}` : `0 de ${allScriptures.length}`}
              </span>
              <button
                type="button"
                onClick={handleNextScripture}
                disabled={currentActiveIndex >= allScriptures.length - 1}
                className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 disabled:opacity-30 text-stone-200 cursor-pointer"
                title="Próximo Versículo"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Horizontal Scrollable Scripture Badges */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-1.5 scrollbar-thin">
            {allScriptures.length === 0 ? (
              <span className="text-xs text-stone-400 italic">Nenhum versículo registrado no esboço ainda.</span>
            ) : (
              allScriptures.map((item, idx) => {
                const isCurrent = currentActiveScripture?.id === item.scripture.id;
                const isCompleted = item.scripture.status === 'completed';

                let statusBorder = 'border-stone-700 bg-stone-800/80 text-stone-300 hover:border-stone-500';
                let statusLabel = `${idx + 1}. Pendente`;

                if (isCurrent) {
                  statusBorder = 'border-amber-500 bg-amber-500 text-stone-950 font-black ring-2 ring-amber-400/80 shadow-md scale-105';
                  statusLabel = `${idx + 1}. EM USO AGORA`;
                } else if (isCompleted) {
                  statusBorder = 'border-emerald-400 bg-emerald-950/60 text-emerald-300 font-semibold';
                  statusLabel = `${idx + 1}. Lido ✓`;
                }

                return (
                  <button
                    key={item.scripture.id}
                    id={`scripture-flow-${item.scripture.id}`}
                    type="button"
                    onClick={() => handleScriptureClick(item.scripture)}
                    className={`shrink-0 px-3.5 py-2 rounded-xl border text-xs sm:text-sm transition-all cursor-pointer select-none flex flex-col items-start gap-0.5 ${statusBorder}`}
                  >
                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-85">
                      {statusLabel}
                    </span>
                    <span className="font-serif font-bold text-sm sm:text-base whitespace-nowrap">
                      {formatScriptureDisplay(item.scripture)}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Preach Outline on Left, Interactive Bible Display on Right */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Preaching Outline & Points */}
        <div className={`space-y-6 transition-all ${showBibleSidePanel ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
          {sermon.notes && (
            <div className={`p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-xs sm:text-sm italic`}>
              <span className="font-bold not-italic">Lembrete Pastoral:</span> {sermon.notes}
            </div>
          )}

          {sermon.sections.map((section, index) => (
            <div
              key={section.id}
              className={`p-6 sm:p-8 rounded-2xl border transition-all ${getCardBgClass()}`}
            >
              {/* Section Header */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-200/50 dark:border-stone-800">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-400 font-black font-serif text-sm flex items-center justify-center">
                    {index + 1}
                  </span>
                  <h3 className="font-serif font-bold text-xl sm:text-2xl tracking-tight">
                    {section.title}
                  </h3>
                </div>
                {section.estimatedMinutes && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-500">
                    ~{section.estimatedMinutes} min
                  </span>
                )}
              </div>

              {/* Section Preaching Content Notes */}
              {section.content && (
                <div className={`font-serif ${getFontSizeClass()} whitespace-pre-wrap leading-relaxed mb-5 opacity-95`}>
                  {section.content}
                </div>
              )}

              {/* Section Attached Scriptures with dynamic clickable badges */}
              {section.scriptures.length > 0 && (
                <div className="pt-3 border-t border-stone-200/40 dark:border-stone-800/60 flex flex-wrap items-center gap-2.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 flex items-center gap-1 mr-1">
                    <BookOpen className="w-3.5 h-3.5 text-amber-500" /> Passagens ({section.scriptures.length}):
                  </span>
                  {section.scriptures.map((sc) => (
                    <ScriptureBadge
                      key={sc.id}
                      scripture={sc}
                      onClick={(clickedSc) => {
                        handleScriptureClick(clickedSc);
                      }}
                      onStatusChange={handleMarkScriptureStatus}
                      showControls={true}
                      size="md"
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right Column: Embedded Side Bible Reader for Pulpit */}
        {showBibleSidePanel && (
          <div className="lg:col-span-5 space-y-4">
            <div className={`sticky top-24 p-5 sm:p-6 rounded-2xl border ${getCardBgClass()} max-h-[82vh] flex flex-col`}>
              
              {/* Reader Header */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-200/50 dark:border-stone-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-lg leading-tight">
                      {currentActiveScripture ? formatScriptureDisplay(currentActiveScripture) : 'Selecione um Versículo'}
                    </h4>
                    <p className="text-[11px] text-stone-400">
                      {currentActiveScripture ? 'Texto bíblico completo offline' : 'Clique em qualquer versículo para leitura imediata'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {sectionScriptures.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setViewAllSectionVerses(!viewAllSectionVerses)}
                      className={`px-2 py-1 rounded text-xs font-bold inline-flex items-center gap-1 cursor-pointer ${viewAllSectionVerses ? 'bg-amber-500 text-stone-950' : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'}`}
                      title="Exibir todos os versículos desta seção juntos"
                    >
                      <List className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Todos da Seção</span>
                    </button>
                  )}

                  {currentActiveScripture && (
                    <button
                      type="button"
                      onClick={() => onOpenBibleModal(currentActiveScripture)}
                      className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
                      title="Expandir em Modal"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Reader Body */}
              <div className="flex-1 overflow-y-auto pr-1 space-y-4 font-serif text-base sm:text-lg leading-relaxed scrollbar-thin">
                {viewAllSectionVerses && sectionScriptures.length > 1 ? (
                  // Multi-verse display for entire active section
                  <div className="space-y-6">
                    {sectionScriptures.map((secSc) => {
                      const verses = getPassageVerses(secSc.book, secSc.chapter, secSc.verseStart, secSc.verseEnd);
                      const isCurrent = secSc.id === currentActiveScripture?.id;

                      return (
                        <div key={secSc.id} className={`p-4 rounded-xl border ${isCurrent ? 'border-amber-500/50 bg-amber-500/5 ring-1 ring-amber-500/30' : 'border-stone-200/40 dark:border-stone-800/40'}`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-serif font-bold text-base text-amber-700 dark:text-amber-400">
                              {formatScriptureDisplay(secSc)}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleScriptureClick(secSc)}
                              className="text-xs px-2 py-0.5 rounded bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-amber-500 hover:text-stone-950 font-bold"
                            >
                              Focar
                            </button>
                          </div>
                          <div className="space-y-2">
                            {verses.map(v => (
                              <p key={v.verse} className="relative pl-6 text-sm sm:text-base">
                                <span className="absolute left-0 top-0.5 text-xs font-sans font-black text-amber-600 dark:text-amber-400 select-none">
                                  {v.verse}
                                </span>
                                <span>{v.text}</span>
                              </p>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : currentActiveScripture ? (
                  // Single active passage verses
                  activeVerses.map((v) => (
                    <p key={v.verse} className="relative pl-6">
                      <span className="absolute left-0 top-0.5 text-xs font-sans font-black text-amber-600 dark:text-amber-400 select-none">
                        {v.verse}
                      </span>
                      <span>{v.text}</span>
                    </p>
                  ))
                ) : (
                  <div className="text-center py-12 px-4 text-stone-400">
                    <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="font-sans text-sm font-semibold">Nenhum versículo ativo no momento.</p>
                    <p className="font-sans text-xs mt-1">
                      Clique em qualquer marcador de versículo no esboço para abrir o texto bíblico instantaneamente.
                    </p>
                  </div>
                )}
              </div>

              {/* Reader Action Footer */}
              {currentActiveScripture && (
                <div className="pt-4 mt-4 border-t border-stone-200/50 dark:border-stone-800 flex items-center justify-between gap-2">
                  <span className="text-xs text-stone-400 font-medium">
                    Status: <span className="font-bold text-amber-500 capitalize">{currentActiveScripture.status === 'active' ? 'Em Leitura' : currentActiveScripture.status}</span>
                  </span>

                  <button
                    id="mark-read-and-advance-btn"
                    type="button"
                    onClick={handleMarkCurrentCompletedAndNext}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Concluir Leitura</span>
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
