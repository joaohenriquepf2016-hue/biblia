import React, { useState } from 'react';
import { Sermon, SermonSection, ScriptureRef } from '../types';
import { BIBLE_BOOKS, findBookByNameOrAbbrev } from '../data/bibleBooks';
import { extractAllScriptures, formatScriptureDisplay, generateUniqueId } from '../utils/bibleParser';
import { ScriptureBadge } from './ScriptureBadge';
import { downloadStandaloneHtmlFile } from '../utils/htmlExporter';
import { 
  Plus, 
  Trash2, 
  MoveUp, 
  MoveDown, 
  BookOpen, 
  Sparkles, 
  Eye, 
  Clock, 
  Layers, 
  Bookmark, 
  CheckCircle2, 
  HelpCircle,
  FileText,
  ListPlus,
  Download
} from 'lucide-react';

interface SermonEditorProps {
  sermon: Sermon;
  onUpdateSermon: (updatedSermon: Sermon) => void;
  onOpenScripture: (scripture: ScriptureRef) => void;
  onSwitchToPreachMode: () => void;
}

export const SermonEditor: React.FC<SermonEditorProps> = ({
  sermon,
  onUpdateSermon,
  onOpenScripture,
  onSwitchToPreachMode,
}) => {
  const [activeManualAddSectionId, setActiveManualAddSectionId] = useState<string | null>(null);
  const [quickScriptureInput, setQuickScriptureInput] = useState<string>('');
  
  // Form states for manual scripture modal
  const [manualBook, setManualBook] = useState<string>('João');
  const [manualChapter, setManualChapter] = useState<number>(3);
  const [manualVerseStart, setManualVerseStart] = useState<number>(16);
  const [manualVerseEnd, setManualVerseEnd] = useState<string>('');
  const [manualNote, setManualNote] = useState<string>('');

  // Toast / feedback message
  const [notification, setNotification] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleUpdateSection = (sectionId: string, updates: Partial<SermonSection>) => {
    const updatedSections = sermon.sections.map((sec) => {
      if (sec.id === sectionId) {
        return { ...sec, ...updates };
      }
      return sec;
    });

    onUpdateSermon({
      ...sermon,
      sections: updatedSections,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleAddSection = (type: SermonSection['type'] = 'point') => {
    const sectionCount = sermon.sections.filter(s => s.type === 'point').length;
    let title = '';
    let estimatedMinutes = 7;

    if (type === 'intro') {
      title = 'Introdução & Contexto';
      estimatedMinutes = 5;
    } else if (type === 'conclusion') {
      title = 'Conclusão & Apelo';
      estimatedMinutes = 5;
    } else if (type === 'illustration') {
      title = `Ilustração: ${sectionCount + 1}`;
      estimatedMinutes = 4;
    } else if (type === 'application') {
      title = `Aplicação Prática: Ponto ${sectionCount + 1}`;
      estimatedMinutes = 5;
    } else {
      title = `${sectionCount + 1}º Ponto Principal`;
      estimatedMinutes = 8;
    }

    const newSection: SermonSection = {
      id: `sec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title,
      type,
      content: '',
      estimatedMinutes,
      scriptures: [],
    };

    onUpdateSermon({
      ...sermon,
      sections: [...sermon.sections, newSection],
      updatedAt: new Date().toISOString(),
    });
  };

  const handleDeleteSection = (sectionId: string) => {
    if (sermon.sections.length <= 1) {
      alert('O esboço precisa ter pelo menos uma seção.');
      return;
    }
    const updated = sermon.sections.filter((sec) => sec.id !== sectionId);
    onUpdateSermon({
      ...sermon,
      sections: updated,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sermon.sections.length) return;

    const updated = [...sermon.sections];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    onUpdateSermon({
      ...sermon,
      sections: updated,
      updatedAt: new Date().toISOString(),
    });
  };

  // Detecta referências bíblicas automaticamente no texto digitado da seção
  const handleAutoDetectScriptures = (sectionId: string, content: string) => {
    const detected = extractAllScriptures(content);
    if (detected.length === 0) {
      showFeedback('Nenhuma referência identificada. Digite ex: João 3:16, Rm 8:28, Sl 23:1-6.');
      return;
    }

    const section = sermon.sections.find((s) => s.id === sectionId);
    if (!section) return;

    // Mescla sem duplicar referências idênticas
    const existingKeys = section.scriptures.map(s => `${s.book}_${s.chapter}_${s.verseStart}_${s.verseEnd || 0}`.toLowerCase());
    const newScriptures = [...section.scriptures];

    let addedCount = 0;
    detected.forEach(d => {
      const key = `${d.book}_${d.chapter}_${d.verseStart}_${d.verseEnd || 0}`.toLowerCase();
      if (!existingKeys.includes(key)) {
        newScriptures.push(d);
        existingKeys.push(key);
        addedCount++;
      }
    });

    handleUpdateSection(sectionId, { scriptures: newScriptures });
    showFeedback(`${addedCount} versículo(s) identificado(s) e adicionado(s) com sucesso!`);
  };

  // Adiciona múltiplos versículos a partir de texto digitado no input rápido
  const handleAddQuickScriptures = (sectionId: string) => {
    if (!quickScriptureInput.trim()) return;

    const detected = extractAllScriptures(quickScriptureInput);
    if (detected.length === 0) {
      showFeedback('Formato não reconhecido. Tente ex: "João 3:16, Romanos 8:28, Salmos 23:1-6"');
      return;
    }

    const section = sermon.sections.find((s) => s.id === sectionId);
    if (!section) return;

    const existingKeys = section.scriptures.map(s => `${s.book}_${s.chapter}_${s.verseStart}_${s.verseEnd || 0}`.toLowerCase());
    const newScriptures = [...section.scriptures];

    let addedCount = 0;
    detected.forEach(d => {
      const key = `${d.book}_${d.chapter}_${d.verseStart}_${d.verseEnd || 0}`.toLowerCase();
      if (!existingKeys.includes(key)) {
        newScriptures.push(d);
        existingKeys.push(key);
        addedCount++;
      }
    });

    handleUpdateSection(sectionId, { scriptures: newScriptures });
    setQuickScriptureInput('');
    setActiveManualAddSectionId(null);
    showFeedback(`${addedCount} passagem(ns) adicionada(s) à seção!`);
  };

  // Adiciona versículo manualmente com seletores
  const handleAddManualScripture = (sectionId: string) => {
    const book = findBookByNameOrAbbrev(manualBook);
    if (!book) {
      alert('Livro bíblico não encontrado.');
      return;
    }

    const endVerse = manualVerseEnd ? parseInt(manualVerseEnd, 10) : undefined;
    const newRef: ScriptureRef = {
      id: generateUniqueId(),
      rawText: `${book.name} ${manualChapter}:${manualVerseStart}${endVerse && endVerse >= manualVerseStart ? '-' + endVerse : ''}`,
      book: book.name,
      bookAbbrev: book.abbrevs[0].toUpperCase(),
      chapter: manualChapter,
      verseStart: manualVerseStart,
      verseEnd: endVerse && endVerse >= manualVerseStart ? endVerse : undefined,
      note: manualNote.trim() || undefined,
      status: 'pending',
    };

    const section = sermon.sections.find((s) => s.id === sectionId);
    if (section) {
      handleUpdateSection(sectionId, {
        scriptures: [...section.scriptures, newRef],
      });
    }

    setActiveManualAddSectionId(null);
    setManualNote('');
    setManualVerseEnd('');
    showFeedback(`Passagem ${formatScriptureDisplay(newRef)} adicionada!`);
  };

  const handleRemoveScripture = (sectionId: string, scriptureId: string) => {
    const section = sermon.sections.find((s) => s.id === sectionId);
    if (section) {
      handleUpdateSection(sectionId, {
        scriptures: section.scriptures.filter((sc) => sc.id !== scriptureId),
      });
    }
  };

  const allScripturesInSermon = sermon.sections.flatMap(s => s.scriptures);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-amber-300 px-4 py-3 rounded-xl shadow-lg border border-amber-500/40 flex items-center gap-2 text-sm font-medium animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {notification}
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200 dark:border-stone-800">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-amber-600 dark:text-amber-400">
              Estruturação da Mensagem
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100 mt-1">
              Organizador de Pregação
            </h1>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
              Organize seus tópicos, digite múltiplos versículos e acompanhe o roteiro completo no púlpito.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="download-sermon-html-btn"
              type="button"
              onClick={() => downloadStandaloneHtmlFile([sermon], sermon.title)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-xs inline-flex items-center gap-2 transition-all cursor-pointer text-sm"
              title="Baixar este sermão em um arquivo HTML único offline"
            >
              <Download className="w-4 h-4" />
              <span>Baixar HTML</span>
            </button>

            <button
              id="go-to-pulpit-btn"
              type="button"
              onClick={onSwitchToPreachMode}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl shadow-sm inline-flex items-center gap-2 transition-all cursor-pointer text-sm"
            >
              <Eye className="w-4 h-4" />
              <span>Abrir no Modo Púlpito</span>
            </button>
          </div>
        </div>

        {/* Sermon Metadata Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 pt-6">
          <div className="md:col-span-2">
            <label className="block text-xs uppercase font-bold text-stone-600 dark:text-stone-400 mb-1.5">
              Título da Mensagem
            </label>
            <input
              type="text"
              value={sermon.title}
              onChange={(e) => onUpdateSermon({ ...sermon, title: e.target.value, updatedAt: new Date().toISOString() })}
              placeholder="Ex: O Poder da Oração Eficaz"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-serif font-bold text-lg focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-bold text-stone-600 dark:text-stone-400 mb-1.5">
              Tempo Estimado de Ministração
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={5}
                max={180}
                value={sermon.targetDurationMinutes}
                onChange={(e) => onUpdateSermon({ ...sermon, targetDurationMinutes: parseInt(e.target.value, 10) || 30, updatedAt: new Date().toISOString() })}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-bold focus:ring-2 focus:ring-amber-500 outline-none"
              />
              <span className="text-sm font-medium text-stone-500">min</span>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase font-bold text-stone-600 dark:text-stone-400 mb-1.5">
              Tema / Assunto Principal
            </label>
            <input
              type="text"
              value={sermon.theme || ''}
              onChange={(e) => onUpdateSermon({ ...sermon, theme: e.target.value, updatedAt: new Date().toISOString() })}
              placeholder="Ex: Fé, Cura, Família, Graça..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-bold text-stone-600 dark:text-stone-400 mb-1.5">
              Texto Bíblico Base
            </label>
            <input
              type="text"
              value={sermon.mainScripture || ''}
              onChange={(e) => onUpdateSermon({ ...sermon, mainScripture: e.target.value, updatedAt: new Date().toISOString() })}
              placeholder="Ex: João 3:16-18, Tiago 5:16"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-bold text-stone-600 dark:text-stone-400 mb-1.5">
              Anotações & Lembretes Pastorais
            </label>
            <input
              type="text"
              value={sermon.notes || ''}
              onChange={(e) => onUpdateSermon({ ...sermon, notes: e.target.value, updatedAt: new Date().toISOString() })}
              placeholder="Ex: Chamar o ministério de louvor no final..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>
        </div>

        {/* Scripture Overview Summary Bar */}
        <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
            <span className="text-sm font-semibold text-stone-800 dark:text-stone-200">
              Roteiro de Leitura Bíblica: {allScripturesInSermon.length} passagens no esboço
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            {allScripturesInSermon.map((sc, idx) => (
              <span 
                key={sc.id}
                onClick={() => onOpenScripture(sc)}
                className="text-xs font-bold px-2.5 py-1 rounded-md bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700 cursor-pointer hover:border-amber-500"
              >
                {idx + 1}. {formatScriptureDisplay(sc)}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Sections List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            Seções do Esboço & Versículos Vinculados
          </h2>
          
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleAddSection('point')}
              className="px-3 py-1.5 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold rounded-lg inline-flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> + Ponto Principal
            </button>
            <button
              type="button"
              onClick={() => handleAddSection('illustration')}
              className="px-3 py-1.5 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold rounded-lg inline-flex items-center gap-1 cursor-pointer hidden sm:inline-flex"
            >
              <Plus className="w-3.5 h-3.5" /> + Ilustração
            </button>
            <button
              type="button"
              onClick={() => handleAddSection('conclusion')}
              className="px-3 py-1.5 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold rounded-lg inline-flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> + Conclusão
            </button>
          </div>
        </div>

        {sermon.sections.map((section, index) => (
          <div
            key={section.id}
            id={`section-card-${section.id}`}
            className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 sm:p-6 shadow-xs transition-all hover:border-stone-300 dark:hover:border-stone-700"
          >
            {/* Section Header Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2.5 flex-1">
                <span className="w-7 h-7 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 text-xs font-bold flex items-center justify-center">
                  {index + 1}
                </span>
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => handleUpdateSection(section.id, { title: e.target.value })}
                  placeholder="Título da Seção (ex: 1. A Necessidade da Oração)"
                  className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100 bg-transparent border-b border-transparent hover:border-stone-300 focus:border-amber-500 focus:bg-stone-50 dark:focus:bg-stone-800/50 px-1.5 py-0.5 rounded outline-none flex-1"
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-xs text-stone-500">
                  <Clock className="w-3.5 h-3.5" />
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={section.estimatedMinutes || 5}
                    onChange={(e) => handleUpdateSection(section.id, { estimatedMinutes: parseInt(e.target.value, 10) || 5 })}
                    className="w-12 px-1.5 py-1 text-center bg-stone-100 dark:bg-stone-800 rounded border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 font-bold"
                  />
                  <span>min</span>
                </div>

                <div className="flex items-center gap-1 border-l border-stone-200 dark:border-stone-700 pl-2">
                  <button
                    type="button"
                    onClick={() => handleMoveSection(index, 'up')}
                    disabled={index === 0}
                    className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 disabled:opacity-30 rounded hover:bg-stone-100 dark:hover:bg-stone-800"
                    title="Mover para cima"
                  >
                    <MoveUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveSection(index, 'down')}
                    disabled={index === sermon.sections.length - 1}
                    className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 disabled:opacity-30 rounded hover:bg-stone-100 dark:hover:bg-stone-800"
                    title="Mover para baixo"
                  >
                    <MoveDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteSection(section.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 rounded hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    title="Excluir seção"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Section Notes Textarea */}
            <div className="py-4">
              <textarea
                rows={4}
                value={section.content}
                onChange={(e) => handleUpdateSection(section.id, { content: e.target.value })}
                placeholder="Escreva aqui as anotações, argumentos, ilustrações e referências bíblicas (ex: Ler João 3:16, Romanos 8:28 e Salmos 23:1-6)..."
                className="w-full p-3.5 rounded-xl border border-stone-200 dark:border-stone-700/80 bg-stone-50/70 dark:bg-stone-800/40 text-stone-900 dark:text-stone-100 font-sans text-sm leading-relaxed focus:bg-white dark:focus:bg-stone-800 focus:ring-2 focus:ring-amber-500 outline-none transition-all resize-y"
              />
            </div>

            {/* Attached Scripture Badges Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" /> Versículos ({section.scriptures.length}):
                </span>
                
                {section.scriptures.length === 0 ? (
                  <span className="text-xs text-stone-400 italic">Nenhum versículo anexado.</span>
                ) : (
                  section.scriptures.map((sc) => (
                    <div key={sc.id} className="inline-flex items-center gap-1 group">
                      <ScriptureBadge
                        scripture={sc}
                        onClick={onOpenScripture}
                        size="sm"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveScripture(section.id, sc.id)}
                        className="text-stone-400 hover:text-rose-500 p-0.5 text-xs font-bold"
                        title="Remover versículo desta seção"
                      >
                        ×
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Action Buttons for Scriptures */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleAutoDetectScriptures(section.id, section.content)}
                  className="px-2.5 py-1 text-xs bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 border border-amber-300 dark:border-amber-700/50 rounded-lg font-medium inline-flex items-center gap-1 cursor-pointer"
                  title="Detectar automaticamente todas as referências bíblicas escritas no texto acima"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Detectar do Texto
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveManualAddSectionId(activeManualAddSectionId === section.id ? null : section.id);
                    setQuickScriptureInput('');
                  }}
                  className="px-2.5 py-1 text-xs bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-600 rounded-lg font-medium inline-flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> + Inserir Versículos
                </button>
              </div>
            </div>

            {/* Manual Scripture Selector & Multi-Input Accordion */}
            {activeManualAddSectionId === section.id && (
              <div className="mt-4 p-4 rounded-xl bg-stone-100 dark:bg-stone-800/90 border border-amber-500/30 space-y-4 animate-in fade-in">
                
                {/* Mode A: Quick batch text input for multiple verses */}
                <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                      <ListPlus className="w-3.5 h-3.5" /> Adicionar Múltiplos Versículos de Uma Vez
                    </span>
                    <button 
                      type="button" 
                      onClick={() => setActiveManualAddSectionId(null)}
                      className="text-xs text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                    >
                      Fechar
                    </button>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={quickScriptureInput}
                      onChange={(e) => setQuickScriptureInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddQuickScriptures(section.id);
                        }
                      }}
                      placeholder="Ex: João 3:16, Romanos 8:28, Salmos 23:1-6, Efésios 6:10-18..."
                      className="flex-1 p-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-600 rounded-lg text-stone-900 dark:text-stone-100 outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddQuickScriptures(section.id)}
                      className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-lg shrink-0 cursor-pointer"
                    >
                      Adicionar Todos
                    </button>
                  </div>
                  <p className="text-[11px] text-stone-400">
                    Dica: Você pode colar quantos versículos quiser separados por vírgula ou ponto e vírgula.
                  </p>
                </div>

                {/* Mode B: Manual specific selection */}
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase text-stone-500 dark:text-stone-400 block">
                    Ou selecione pelo livro e capítulo:
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                        Livro Bíblico
                      </label>
                      <select
                        value={manualBook}
                        onChange={(e) => setManualBook(e.target.value)}
                        className="w-full p-2 text-xs font-medium bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
                      >
                        <optgroup label="Novo Testamento">
                          {BIBLE_BOOKS.filter(b => b.testament === 'NT').map(b => (
                            <option key={b.id} value={b.name}>{b.name}</option>
                          ))}
                        </optgroup>
                        <optgroup label="Antigo Testamento">
                          {BIBLE_BOOKS.filter(b => b.testament === 'VT').map(b => (
                            <option key={b.id} value={b.name}>{b.name}</option>
                          ))}
                        </optgroup>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                        Capítulo
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={150}
                        value={manualChapter}
                        onChange={(e) => setManualChapter(parseInt(e.target.value, 10) || 1)}
                        className="w-full p-2 text-xs font-bold bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                        Versículo Inicial
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={176}
                        value={manualVerseStart}
                        onChange={(e) => setManualVerseStart(parseInt(e.target.value, 10) || 1)}
                        className="w-full p-2 text-xs font-bold bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                        Versículo Final (Opcional)
                      </label>
                      <input
                        type="number"
                        min={manualVerseStart}
                        max={176}
                        value={manualVerseEnd}
                        onChange={(e) => setManualVerseEnd(e.target.value)}
                        placeholder="Ex: 18"
                        className="w-full p-2 text-xs font-bold bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                      Nota ou Ênfase do Pregador (Opcional)
                    </label>
                    <input
                      type="text"
                      value={manualNote}
                      onChange={(e) => setManualNote(e.target.value)}
                      placeholder="Ex: Enfatizar o amor incondicional..."
                      className="w-full p-2 text-xs bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleAddManualScripture(section.id)}
                      className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> Anexar Esta Passagem
                    </button>
                  </div>
                </div>

              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
