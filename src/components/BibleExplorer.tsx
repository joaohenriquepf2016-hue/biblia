import React, { useState, useMemo, useEffect } from 'react';
import { BIBLE_BOOKS, findBookByNameOrAbbrev } from '../data/bibleBooks';
import { getPassageVerses, OFFLINE_VERSES, saveCustomVerse, fetchAndCachePassage } from '../data/bibleVerses';
import { BibleBook, BibleVerse } from '../types';
import { 
  BookOpen, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Copy, 
  Check, 
  Bookmark, 
  BookmarkCheck,
  Edit3,
  Save,
  Volume2
} from 'lucide-react';
import { formatScriptureDisplay } from '../utils/bibleParser';

export const BibleExplorer: React.FC = () => {
  const [selectedBook, setSelectedBook] = useState<BibleBook>(BIBLE_BOOKS[42]); // João por padrão
  const [selectedChapter, setSelectedChapter] = useState<number>(3);
  const [filterTestament, setFilterTestament] = useState<'ALL' | 'VT' | 'NT'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedVerse, setCopiedVerse] = useState<number | null>(null);
  const [editingVerseNumber, setEditingVerseNumber] = useState<number | null>(null);
  const [customText, setCustomText] = useState<string>('');

  const filteredBooks = useMemo(() => {
    return BIBLE_BOOKS.filter(b => {
      if (filterTestament !== 'ALL' && b.testament !== filterTestament) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return b.name.toLowerCase().includes(q) || b.abbrevs.some(ab => ab.toLowerCase().includes(q));
      }
      return true;
    });
  }, [filterTestament, searchQuery]);

  const [currentVerses, setCurrentVerses] = useState<BibleVerse[]>([]);
  const [isLoadingOnline, setIsLoadingOnline] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    const initial = getPassageVerses(selectedBook.id, selectedChapter, 1, 40);
    // Filter out trailing empty verses if they exceed chapter length
    const meaningful = initial.filter(v => v.text && v.text.trim() !== '');
    setCurrentVerses(meaningful.length > 0 ? meaningful : initial.slice(0, 25));

    const hasMissing = initial.slice(0, 20).some(v => !v.text || v.text.trim() === '');
    if (hasMissing) {
      setIsLoadingOnline(true);
      fetchAndCachePassage(selectedBook.id, selectedChapter, 1, 35)
        .then((success) => {
          if (success && isMounted) {
            const updated = getPassageVerses(selectedBook.id, selectedChapter, 1, 40);
            const valid = updated.filter(v => v.text && v.text.trim() !== '');
            setCurrentVerses(valid.length > 0 ? valid : updated);
          }
        })
        .finally(() => {
          if (isMounted) setIsLoadingOnline(false);
        });
    }
    return () => { isMounted = false; };
  }, [selectedBook.id, selectedChapter, editingVerseNumber]);

  const handleCopy = (v: BibleVerse) => {
    const text = `${selectedBook.name} ${selectedChapter}:${v.verse} - "${v.text}"`;
    navigator.clipboard.writeText(text);
    setCopiedVerse(v.verse);
    setTimeout(() => setCopiedVerse(null), 2000);
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSaveEdit = (verseNumber: number) => {
    saveCustomVerse(selectedBook.id, selectedChapter, verseNumber, customText);
    setEditingVerseNumber(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-stone-900 text-stone-100 p-6 rounded-2xl border border-stone-800 shadow-md">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-wider text-amber-400">
            <BookOpen className="w-4 h-4" /> Bíblia Sagrada Completa (100% Offline)
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
            {selectedBook.name}, Capítulo {selectedChapter}
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Consulte qualquer um dos 66 livros bíblicos, navegue entre capítulos e copie passagens para seu sermão.
          </p>
        </div>

        {/* Chapter Prev / Next Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedChapter(prev => Math.max(1, prev - 1))}
            disabled={selectedChapter <= 1}
            className="px-3.5 py-2 bg-stone-800 hover:bg-stone-700 disabled:opacity-30 rounded-xl text-xs font-bold inline-flex items-center gap-1 cursor-pointer border border-stone-700"
          >
            <ChevronLeft className="w-4 h-4" /> Cap. Anterior
          </button>
          <span className="px-3 py-1.5 bg-amber-500 text-stone-950 font-black rounded-lg text-sm">
            {selectedChapter} / {selectedBook.chaptersCount}
          </span>
          <button
            type="button"
            onClick={() => setSelectedChapter(prev => Math.min(selectedBook.chaptersCount, prev + 1))}
            disabled={selectedChapter >= selectedBook.chaptersCount}
            className="px-3.5 py-2 bg-stone-800 hover:bg-stone-700 disabled:opacity-30 rounded-xl text-xs font-bold inline-flex items-center gap-1 cursor-pointer border border-stone-700"
          >
            Próximo Cap. <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Book & Chapter Navigator */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
            
            {/* Search Books */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
              <input
                type="text"
                placeholder="Buscar livro (ex: Salmos, Rm)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Testament Filter */}
            <div className="grid grid-cols-3 gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setFilterTestament('ALL')}
                className={`py-1.5 rounded-lg ${filterTestament === 'ALL' ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs font-bold' : 'text-stone-500'}`}
              >
                Todos (66)
              </button>
              <button
                type="button"
                onClick={() => setFilterTestament('VT')}
                className={`py-1.5 rounded-lg ${filterTestament === 'VT' ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs font-bold' : 'text-stone-500'}`}
              >
                Antigo (39)
              </button>
              <button
                type="button"
                onClick={() => setFilterTestament('NT')}
                className={`py-1.5 rounded-lg ${filterTestament === 'NT' ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs font-bold' : 'text-stone-500'}`}
              >
                Novo (27)
              </button>
            </div>

            {/* Books List Grid */}
            <div className="max-h-60 overflow-y-auto pr-1 space-y-1 scrollbar-thin">
              {filteredBooks.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => {
                    setSelectedBook(b);
                    setSelectedChapter(1);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                    selectedBook.id === b.id
                      ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                      : 'hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  <span>{b.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                    selectedBook.id === b.id ? 'bg-stone-950 text-amber-300' : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-400'
                  }`}>
                    {b.chaptersCount} caps
                  </span>
                </button>
              ))}
            </div>

            {/* Chapter Numbers Grid */}
            <div className="pt-3 border-t border-stone-200 dark:border-stone-800">
              <label className="block text-[11px] font-bold uppercase text-stone-500 dark:text-stone-400 mb-2">
                Capítulos de {selectedBook.name}:
              </label>
              <div className="grid grid-cols-6 sm:grid-cols-8 gap-1 max-h-40 overflow-y-auto p-1 scrollbar-thin">
                {Array.from({ length: selectedBook.chaptersCount }, (_, i) => i + 1).map((ch) => (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => setSelectedChapter(ch)}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      selectedChapter === ch
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200'
                    }`}
                  >
                    {ch}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Right: Scripture Reading Pane */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs">
            
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-stone-200 dark:border-stone-800">
              <div>
                <h2 className="font-serif font-bold text-2xl text-stone-900 dark:text-stone-100">
                  {selectedBook.name} {selectedChapter}
                </h2>
                <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
                  Texto Bíblico em Português (Offline)
                </span>
              </div>
            </div>

            {/* Verses stream */}
            <div className="space-y-4 font-serif text-lg leading-relaxed text-stone-900 dark:text-stone-100">
              {currentVerses.map((v) => (
                <div 
                  key={v.verse}
                  className="group relative pl-8 p-2 rounded-xl hover:bg-amber-500/10 transition-colors"
                >
                  <span className="absolute left-1 top-2.5 text-xs font-sans font-bold text-amber-700 dark:text-amber-400 select-none">
                    {v.verse}
                  </span>

                  {editingVerseNumber === v.verse ? (
                    <div className="space-y-2 font-sans text-sm">
                      <textarea
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value)}
                        rows={3}
                        className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingVerseNumber(null)}
                          className="px-3 py-1 text-xs text-stone-600 rounded"
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(v.verse)}
                          className="px-3 py-1 text-xs bg-amber-500 text-stone-950 font-bold rounded"
                        >
                          Salvar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <span>{v.text}</span>
                      
                      {/* Floating actions for this verse */}
                      <div className="inline-flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => handleCopy(v)}
                          className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded"
                          title="Copiar este versículo"
                        >
                          {copiedVerse === v.verse ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSpeak(v.text)}
                          className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded"
                          title="Ouvir em voz alta"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setCustomText(v.text);
                            setEditingVerseNumber(v.verse);
                          }}
                          className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded"
                          title="Editar / anotação"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
