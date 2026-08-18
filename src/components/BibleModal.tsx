import React, { useState, useEffect } from 'react';
import { ScriptureRef, BibleVerse, FontSize } from '../types';
import { getPassageVerses, saveCustomVerse, fetchAndCachePassage } from '../data/bibleVerses';
import { BIBLE_BOOKS, findBookByNameOrAbbrev } from '../data/bibleBooks';
import { 
  X, 
  CheckCircle, 
  ChevronLeft, 
  ChevronRight, 
  Copy, 
  Check, 
  Volume2, 
  Edit3, 
  Save, 
  BookOpen,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { formatScriptureDisplay } from '../utils/bibleParser';

interface BibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  scripture: ScriptureRef | null;
  onMarkCompleted?: (scriptureId: string) => void;
  onSelectNextScripture?: () => void;
  hasNextScripture?: boolean;
  nextScriptureRef?: ScriptureRef | null;
  fontSize?: FontSize;
}

export const BibleModal: React.FC<BibleModalProps> = ({
  isOpen,
  onClose,
  scripture,
  onMarkCompleted,
  onSelectNextScripture,
  hasNextScripture = false,
  nextScriptureRef,
  fontSize = 'large',
}) => {
  const [currentChapter, setCurrentChapter] = useState<number>(1);
  const [currentBookName, setCurrentBookName] = useState<string>('Hebreus');
  const [currentVerseStart, setCurrentVerseStart] = useState<number>(1);
  const [currentVerseEnd, setCurrentVerseEnd] = useState<number | undefined>(undefined);
  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [copied, setCopied] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingText, setEditingText] = useState<string>('');
  const [localFontSize, setLocalFontSize] = useState<FontSize>(fontSize);
  const [isLoadingOnline, setIsLoadingOnline] = useState<boolean>(false);

  useEffect(() => {
    if (scripture) {
      setCurrentBookName(scripture.book);
      setCurrentChapter(scripture.chapter);
      setCurrentVerseStart(scripture.verseStart);
      setCurrentVerseEnd(scripture.verseEnd);
      setIsEditing(false);
    }
  }, [scripture]);

  useEffect(() => {
    let isMounted = true;
    if (currentBookName && currentChapter) {
      const list = getPassageVerses(
        currentBookName, 
        currentChapter, 
        currentVerseStart, 
        currentVerseEnd
      );
      setVerses(list);

      // Se algum versículo estiver sem texto no banco local, busca na API da Bíblia Almeida
      const missingAny = list.some(v => !v.text || v.text.trim() === '');
      if (missingAny) {
        setIsLoadingOnline(true);
        fetchAndCachePassage(currentBookName, currentChapter, currentVerseStart, currentVerseEnd)
          .then((success) => {
            if (success && isMounted) {
              const updated = getPassageVerses(
                currentBookName,
                currentChapter,
                currentVerseStart,
                currentVerseEnd
              );
              setVerses(updated);
            }
          })
          .finally(() => {
            if (isMounted) setIsLoadingOnline(false);
          });
      }
    }
    return () => {
      isMounted = false;
    };
  }, [currentBookName, currentChapter, currentVerseStart, currentVerseEnd, isEditing]);

  if (!isOpen || !scripture) return null;

  const currentBook = findBookByNameOrAbbrev(currentBookName);

  const handlePrevChapter = () => {
    if (currentChapter > 1) {
      setCurrentChapter(prev => prev - 1);
      setCurrentVerseStart(1);
      setCurrentVerseEnd(undefined);
    }
  };

  const handleNextChapter = () => {
    if (currentBook && currentChapter < currentBook.chaptersCount) {
      setCurrentChapter(prev => prev + 1);
      setCurrentVerseStart(1);
      setCurrentVerseEnd(undefined);
    }
  };

  const handleCopyText = () => {
    const fullText = verses.map(v => `${v.verse}. ${v.text}`).join('\n');
    const header = formatScriptureDisplay({
      book: currentBookName,
      chapter: currentChapter,
      verseStart: currentVerseStart,
      verseEnd: currentVerseEnd,
    });
    navigator.clipboard.writeText(`${header}\n${fullText}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const textToRead = verses.map(v => `Versículo ${v.verse}: ${v.text}`).join('. ');
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSaveCustomText = () => {
    if (currentBook && verses.length > 0) {
      saveCustomVerse(currentBook.id, currentChapter, currentVerseStart, editingText);
      setIsEditing(false);
    }
  };

  const getFontSizeClass = () => {
    switch (localFontSize) {
      case 'normal': return 'text-base leading-relaxed';
      case 'large': return 'text-lg md:text-xl leading-relaxed';
      case 'xlarge': return 'text-xl md:text-2xl leading-loose';
      case 'huge': return 'text-2xl md:text-3xl leading-loose';
      default: return 'text-xl leading-relaxed';
    }
  };

  return (
    <div 
      id="bible-modal-backdrop" 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-stone-950/75 backdrop-blur-xs transition-opacity animate-in fade-in"
      onClick={onClose}
    >
      <div
        id="bible-modal-card"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-amber-500/10 border-b border-amber-500/20 dark:bg-amber-950/20">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-700 dark:text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100">
                  {formatScriptureDisplay({
                    book: currentBookName,
                    chapter: currentChapter,
                    verseStart: currentVerseStart,
                    verseEnd: currentVerseEnd
                  })}
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 font-medium">
                  {currentBook?.testament === 'NT' ? 'Novo Testamento' : 'Antigo Testamento'}
                </span>
                {isLoadingOnline && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400">
                    <Loader2 className="w-3 h-3 animate-spin" /> Carregando...
                  </span>
                )}
              </div>
              {scripture.note && (
                <p className="text-xs text-stone-600 dark:text-stone-400 italic">
                  Nota: {scripture.note}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Font Size controls */}
            <div className="hidden sm:flex items-center bg-stone-200 dark:bg-stone-800 rounded-lg p-0.5 text-xs font-semibold text-stone-700 dark:text-stone-300">
              <button 
                type="button" 
                onClick={() => setLocalFontSize('normal')}
                className={`px-2 py-1 rounded cursor-pointer ${localFontSize === 'normal' ? 'bg-white dark:bg-stone-700 shadow-xs' : ''}`}
                title="Texto normal"
              >
                A
              </button>
              <button 
                type="button" 
                onClick={() => setLocalFontSize('large')}
                className={`px-2 py-1 rounded text-sm cursor-pointer ${localFontSize === 'large' ? 'bg-white dark:bg-stone-700 shadow-xs' : ''}`}
                title="Texto grande"
              >
                A+
              </button>
              <button 
                type="button" 
                onClick={() => setLocalFontSize('xlarge')}
                className={`px-2 py-1 rounded text-base cursor-pointer ${localFontSize === 'xlarge' ? 'bg-white dark:bg-stone-700 shadow-xs' : ''}`}
                title="Texto extra grande para púlpito"
              >
                A++
              </button>
            </div>

            <button
              type="button"
              onClick={handleCopyText}
              className="p-2 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
              title="Copiar versículo"
            >
              {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
            </button>

            <button
              type="button"
              onClick={handleSpeak}
              className="p-2 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
              title="Ouvir leitura em voz alta"
            >
              <Volume2 className="w-5 h-5" />
            </button>

            <button
              id="close-bible-modal-btn"
              type="button"
              onClick={onClose}
              className="p-2 text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 hover:bg-stone-200 dark:hover:bg-stone-800 rounded-lg transition-colors ml-1 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Scripture Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-amber-50/30 dark:bg-stone-900/50">
          {isEditing ? (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">
                Editar texto offline do versículo {currentVerseStart}:
              </label>
              <textarea
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                rows={4}
                className="w-full p-3.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-sm text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800 rounded-lg cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveCustomText}
                  className="px-4 py-2 text-sm bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Salvar Versículo Offline
                </button>
              </div>
            </div>
          ) : (
            <div className={`font-serif text-stone-900 dark:text-stone-100 ${getFontSizeClass()} space-y-4`}>
              {verses.map((v) => (
                <p key={v.verse} className="relative group pl-8">
                  <span className="absolute left-0 top-1 text-sm font-sans font-bold text-amber-700 dark:text-amber-400 select-none">
                    {v.verse}
                  </span>
                  <span className="hover:bg-amber-100/60 dark:hover:bg-stone-800/60 rounded px-1 transition-colors">
                    {v.text || (
                      <span className="text-stone-400 italic text-sm">
                        Texto da passagem sendo carregado ou disponível para edição rápida.
                      </span>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingText(v.text);
                      setIsEditing(true);
                    }}
                    className="opacity-0 group-hover:opacity-100 ml-2 text-xs text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 inline-flex items-center transition-opacity cursor-pointer"
                    title="Editar anotação do versículo"
                  >
                    <Edit3 className="w-3.5 h-3.5 inline" />
                  </button>
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer / Preaching Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 bg-stone-100 dark:bg-stone-800/80 border-t border-stone-300 dark:border-stone-700">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrevChapter}
              disabled={currentChapter <= 1}
              className="px-3 py-1.5 text-xs sm:text-sm font-medium text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-lg hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Cap. {currentChapter > 1 ? currentChapter - 1 : ''}
            </button>
            <button
              type="button"
              onClick={handleNextChapter}
              disabled={Boolean(currentBook && currentChapter >= currentBook.chaptersCount)}
              className="px-3 py-1.5 text-xs sm:text-sm font-medium text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-lg hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1 cursor-pointer"
            >
              Cap. {currentBook && currentChapter < currentBook.chaptersCount ? currentChapter + 1 : ''} <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {onMarkCompleted && (
              <button
                id="mark-scripture-read-btn"
                type="button"
                onClick={() => {
                  onMarkCompleted(scripture.id);
                  if (hasNextScripture && onSelectNextScripture) {
                    onSelectNextScripture();
                  } else {
                    onClose();
                  }
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl shadow-xs inline-flex items-center gap-2 transition-all cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Marcar como Lido</span>
                {hasNextScripture && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-xs bg-emerald-700/80 px-2 py-0.5 rounded-full">
                    Próximo: {nextScriptureRef ? formatScriptureDisplay(nextScriptureRef) : ''}
                    <ArrowRight className="w-3 h-3" />
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
