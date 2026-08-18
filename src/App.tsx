import React, { useState, useEffect } from 'react';
import { Sermon, ScriptureRef, FontSize, PulpitTheme } from './types';
import { DEFAULT_SERMONS } from './data/defaultSermons';
import { Navbar } from './components/Navbar';
import { SermonEditor } from './components/SermonEditor';
import { PreachMode } from './components/PreachMode';
import { BibleExplorer } from './components/BibleExplorer';
import { BibleModal } from './components/BibleModal';
import { SermonListModal } from './components/SermonListModal';
import { PrintOutline } from './components/PrintOutline';
import { downloadStandaloneHtmlFile } from './utils/htmlExporter';

const STORAGE_KEY_SERMONS = 'pulpito_sermons_v1';
const STORAGE_KEY_ACTIVE_ID = 'pulpito_active_sermon_id_v1';
const STORAGE_KEY_THEME = 'pulpito_theme_v1';
const STORAGE_KEY_FONT_SIZE = 'pulpito_fontsize_v1';

export default function App() {
  const [sermons, setSermons] = useState<Sermon[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SERMONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load sermons from local storage', e);
    }
    return DEFAULT_SERMONS;
  });

  const [activeSermonId, setActiveSermonId] = useState<string>(() => {
    try {
      const savedId = localStorage.getItem(STORAGE_KEY_ACTIVE_ID);
      if (savedId) return savedId;
    } catch (e) {
      console.warn(e);
    }
    return DEFAULT_SERMONS[0].id;
  });

  const [activeTab, setActiveTab] = useState<'editor' | 'preach' | 'bible' | 'sermons'>('preach');
  const [pulpitTheme, setPulpitTheme] = useState<PulpitTheme>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_THEME) as PulpitTheme;
      if (saved) return saved;
    } catch {}
    return 'light';
  });

  const [fontSize, setFontSize] = useState<FontSize>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FONT_SIZE) as FontSize;
      if (saved) return saved;
    } catch {}
    return 'large';
  });

  // Modal states
  const [bibleModalOpen, setBibleModalOpen] = useState<boolean>(false);
  const [modalScripture, setModalScripture] = useState<ScriptureRef | null>(null);
  const [sermonListOpen, setSermonListOpen] = useState<boolean>(false);
  const [printOutlineOpen, setPrintOutlineOpen] = useState<boolean>(false);

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SERMONS, JSON.stringify(sermons));
    } catch (e) {
      console.error('Failed to save sermons to local storage', e);
    }
  }, [sermons]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE_ID, activeSermonId);
    } catch (e) {}
  }, [activeSermonId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_THEME, pulpitTheme);
    } catch (e) {}
  }, [pulpitTheme]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FONT_SIZE, fontSize);
    } catch (e) {}
  }, [fontSize]);

  // Current active sermon
  const currentSermon = sermons.find(s => s.id === activeSermonId) || sermons[0] || DEFAULT_SERMONS[0];

  // Update active sermon
  const handleUpdateCurrentSermon = (updated: Sermon) => {
    setSermons(prev => prev.map(s => (s.id === updated.id ? updated : s)));
  };

  // Open Bible Modal on specific reference
  const handleOpenBibleModal = (scripture: ScriptureRef) => {
    setModalScripture(scripture);
    setBibleModalOpen(true);
  };

  // Mark scripture as completed from modal
  const handleMarkScriptureCompleted = (scriptureId: string) => {
    const updatedSections = currentSermon.sections.map((sec) => ({
      ...sec,
      scriptures: sec.scriptures.map((sc) => {
        if (sc.id === scriptureId) {
          return { ...sc, status: 'completed' as const };
        }
        return sc;
      }),
    }));

    handleUpdateCurrentSermon({
      ...currentSermon,
      sections: updatedSections,
      updatedAt: new Date().toISOString(),
    });
  };

  // Find next scripture in sequence
  const allCurrentScriptures = currentSermon.sections.flatMap(s => s.scriptures);
  const currentModalIndex = modalScripture ? allCurrentScriptures.findIndex(s => s.id === modalScripture.id) : -1;
  const hasNextScripture = currentModalIndex >= 0 && currentModalIndex < allCurrentScriptures.length - 1;
  const nextScriptureRef = hasNextScripture ? allCurrentScriptures[currentModalIndex + 1] : null;

  const handleSelectNextScriptureInModal = () => {
    if (nextScriptureRef) {
      setModalScripture(nextScriptureRef);
      // Also mark it active
      const updatedSections = currentSermon.sections.map((sec) => ({
        ...sec,
        scriptures: sec.scriptures.map((sc) => {
          if (sc.id === nextScriptureRef.id) {
            return { ...sc, status: 'active' as const };
          }
          return sc;
        }),
      }));
      handleUpdateCurrentSermon({
        ...currentSermon,
        sections: updatedSections,
        updatedAt: new Date().toISOString(),
      });
    } else {
      setBibleModalOpen(false);
    }
  };

  // Create new blank sermon
  const handleCreateNewSermon = () => {
    const newId = `sermon_${Date.now()}`;
    const newSermon: Sermon = {
      id: newId,
      title: 'Nova Mensagem da Palavra',
      theme: 'Tema Geral',
      mainScripture: 'João 3:16',
      targetDurationMinutes: 30,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: '',
      tags: [],
      sections: [
        {
          id: `sec_${Date.now()}_1`,
          title: 'Introdução e Leitura Inicial',
          type: 'intro',
          content: 'Apresentação do tema e contexto da passagem bíblica.',
          estimatedMinutes: 5,
          scriptures: [
            {
              id: `ref_${Date.now()}_1`,
              rawText: 'João 3:16',
              book: 'João',
              bookAbbrev: 'JOAO',
              chapter: 3,
              verseStart: 16,
              status: 'pending',
            }
          ]
        },
        {
          id: `sec_${Date.now()}_2`,
          title: '1. Primeiro Ponto Principal',
          type: 'point',
          content: 'Desenvolvimento do primeiro ponto da mensagem.',
          estimatedMinutes: 10,
          scriptures: []
        },
        {
          id: `sec_${Date.now()}_3`,
          title: '2. Segundo Ponto Principal',
          type: 'point',
          content: 'Desenvolvimento do segundo ponto da mensagem.',
          estimatedMinutes: 10,
          scriptures: []
        },
        {
          id: `sec_${Date.now()}_4`,
          title: 'Conclusão e Apelo',
          type: 'conclusion',
          content: 'Fechamento da mensagem e momento de oração.',
          estimatedMinutes: 5,
          scriptures: []
        }
      ]
    };

    setSermons(prev => [newSermon, ...prev]);
    setActiveSermonId(newId);
    setActiveTab('editor');
  };

  const handleDuplicateSermon = (source: Sermon) => {
    const newId = `sermon_${Date.now()}`;
    const duplicated: Sermon = {
      ...source,
      id: newId,
      title: `${source.title} (Cópia)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sections: source.sections.map(sec => ({
        ...sec,
        id: `sec_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        scriptures: sec.scriptures.map(sc => ({
          ...sc,
          id: `ref_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          status: 'pending' as const,
        }))
      }))
    };

    setSermons(prev => [duplicated, ...prev]);
    setActiveSermonId(newId);
  };

  const handleDeleteSermon = (sermonId: string) => {
    if (sermons.length <= 1) {
      alert('Você precisa ter pelo menos um sermão cadastrado.');
      return;
    }
    const filtered = sermons.filter(s => s.id !== sermonId);
    setSermons(filtered);
    if (activeSermonId === sermonId) {
      setActiveSermonId(filtered[0].id);
    }
  };

  const handleImportSermons = (importedList: Sermon[]) => {
    setSermons(prev => [...importedList, ...prev]);
    if (importedList.length > 0) {
      setActiveSermonId(importedList[0].id);
    }
  };

  // Stats for current sermon
  const totalScriptures = allCurrentScriptures.length;
  const completedScriptures = allCurrentScriptures.filter(s => s.status === 'completed').length;
  const activeScriptures = allCurrentScriptures.filter(s => s.status === 'active').length;

  return (
    <div className="min-h-screen flex flex-col bg-stone-100 dark:bg-stone-950 font-sans text-stone-900 dark:text-stone-100 selection:bg-amber-400 selection:text-stone-950">
      
      {/* Top Main Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'sermons') {
            setSermonListOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        targetDurationMinutes={currentSermon.targetDurationMinutes}
        onTargetDurationChange={(mins) => handleUpdateCurrentSermon({ ...currentSermon, targetDurationMinutes: mins })}
        onNewSermon={handleCreateNewSermon}
        onOpenPrint={() => setPrintOutlineOpen(true)}
        onDownloadHtml={() => downloadStandaloneHtmlFile(sermons, currentSermon.title)}
        pulpitTheme={pulpitTheme}
        setPulpitTheme={setPulpitTheme}
        fontSize={fontSize}
        setFontSize={setFontSize}
        activeScriptureCount={activeScriptures}
        completedScriptureCount={completedScriptures}
        totalScriptureCount={totalScriptures}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {activeTab === 'preach' && (
          <PreachMode
            sermon={currentSermon}
            onUpdateSermon={handleUpdateCurrentSermon}
            onOpenBibleModal={handleOpenBibleModal}
            pulpitTheme={pulpitTheme}
            setPulpitTheme={setPulpitTheme}
            fontSize={fontSize}
            setFontSize={setFontSize}
          />
        )}

        {activeTab === 'editor' && (
          <SermonEditor
            sermon={currentSermon}
            onUpdateSermon={handleUpdateCurrentSermon}
            onOpenScripture={handleOpenBibleModal}
            onSwitchToPreachMode={() => setActiveTab('preach')}
          />
        )}

        {activeTab === 'bible' && (
          <BibleExplorer />
        )}
      </main>

      {/* Scripture Interactive Bible Modal */}
      <BibleModal
        isOpen={bibleModalOpen}
        onClose={() => setBibleModalOpen(false)}
        scripture={modalScripture}
        onMarkCompleted={handleMarkScriptureCompleted}
        onSelectNextScripture={handleSelectNextScriptureInModal}
        hasNextScripture={hasNextScripture}
        nextScriptureRef={nextScriptureRef}
        fontSize={fontSize}
      />

      {/* Sermons Library Modal */}
      <SermonListModal
        isOpen={sermonListOpen}
        onClose={() => setSermonListOpen(false)}
        sermons={sermons}
        activeSermonId={activeSermonId}
        onSelectSermon={(id) => {
          setActiveSermonId(id);
          setSermonListOpen(false);
        }}
        onCreateNewSermon={handleCreateNewSermon}
        onDuplicateSermon={handleDuplicateSermon}
        onDeleteSermon={handleDeleteSermon}
        onImportSermons={handleImportSermons}
      />

      {/* Print Outline View */}
      {printOutlineOpen && (
        <PrintOutline
          sermon={currentSermon}
          onClose={() => setPrintOutlineOpen(false)}
        />
      )}

    </div>
  );
}
