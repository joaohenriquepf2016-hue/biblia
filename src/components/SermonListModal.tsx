import React, { useState } from 'react';
import { Sermon } from '../types';
import { DEFAULT_SERMONS } from '../data/defaultSermons';
import { downloadStandaloneHtmlFile } from '../utils/htmlExporter';
import { 
  X, 
  Plus, 
  Copy, 
  Trash2, 
  Download, 
  Upload, 
  BookOpen, 
  Clock, 
  Calendar, 
  Check,
  FileText,
  Flame,
  ArrowRight,
  FileCode
} from 'lucide-react';
import { formatScriptureDisplay } from '../utils/bibleParser';

interface SermonListModalProps {
  isOpen: boolean;
  onClose: () => void;
  sermons: Sermon[];
  activeSermonId: string;
  onSelectSermon: (sermonId: string) => void;
  onCreateNewSermon: () => void;
  onDuplicateSermon: (sermon: Sermon) => void;
  onDeleteSermon: (sermonId: string) => void;
  onImportSermons: (imported: Sermon[]) => void;
}

export const SermonListModal: React.FC<SermonListModalProps> = ({
  isOpen,
  onClose,
  sermons,
  activeSermonId,
  onSelectSermon,
  onCreateNewSermon,
  onDuplicateSermon,
  onDeleteSermon,
  onImportSermons,
}) => {
  const [filterSearch, setFilterSearch] = useState<string>('');

  if (!isOpen) return null;

  const filtered = sermons.filter(s => {
    if (!filterSearch.trim()) return true;
    const q = filterSearch.toLowerCase();
    return s.title.toLowerCase().includes(q) 
      || (s.theme && s.theme.toLowerCase().includes(q))
      || (s.mainScripture && s.mainScripture.toLowerCase().includes(q));
  });

  const handleExportJson = () => {
    const jsonStr = JSON.stringify(sermons, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pulpito_sermoes_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadStandaloneHtml = () => {
    const active = sermons.find(s => s.id === activeSermonId) || sermons[0];
    downloadStandaloneHtmlFile(sermons, active?.title);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string);
        if (Array.isArray(parsed)) {
          onImportSermons(parsed);
          alert(`${parsed.length} sermões importados com sucesso!`);
        } else if (parsed.id && parsed.title) {
          onImportSermons([parsed]);
          alert('1 sermão importado com sucesso!');
        }
      } catch (err) {
        alert('Arquivo de backup inválido.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div 
      id="sermon-list-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/80 backdrop-blur-xs transition-opacity"
      onClick={onClose}
    >
      <div 
        id="sermon-list-card"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[85vh] flex flex-col bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/50">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2.5">
              <FileText className="w-6 h-6 text-amber-500" /> Meus Sermões & Esboços Salvos
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              Todos os seus sermões ficam guardados no seu navegador de forma 100% offline.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-800"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Action Bar */}
        <div className="p-4 sm:px-6 bg-stone-100 dark:bg-stone-800/60 border-b border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3">
          <input
            type="text"
            value={filterSearch}
            onChange={(e) => setFilterSearch(e.target.value)}
            placeholder="Buscar por título, tema ou versículo..."
            className="px-3.5 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 outline-none focus:ring-2 focus:ring-amber-500 w-full sm:w-64"
          />

          <div className="flex flex-wrap items-center gap-2">
            <button
              id="new-sermon-action-btn"
              type="button"
              onClick={() => {
                onCreateNewSermon();
                onClose();
              }}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-xl shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Novo Sermão
            </button>

            {/* Standalone Single File HTML Button */}
            <button
              type="button"
              onClick={handleDownloadStandaloneHtml}
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
              title="Baixar aplicativo completo em um único arquivo HTML"
            >
              <FileCode className="w-3.5 h-3.5" /> Baixar Arquivo HTML
            </button>

            <button
              type="button"
              onClick={handleExportJson}
              className="px-3 py-2 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold rounded-xl border border-stone-300 dark:border-stone-700 inline-flex items-center gap-1.5 cursor-pointer"
              title="Baixar backup de dados em JSON"
            >
              <Download className="w-3.5 h-3.5" /> Backup JSON
            </button>

            <label className="px-3 py-2 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold rounded-xl border border-stone-300 dark:border-stone-700 inline-flex items-center gap-1.5 cursor-pointer">
              <Upload className="w-3.5 h-3.5" /> Importar
              <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
            </label>
          </div>
        </div>

        {/* Sermons List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5 scrollbar-thin">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-stone-400">
              <FileText className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p className="font-semibold text-sm">Nenhum sermão encontrado.</p>
            </div>
          ) : (
            filtered.map((s) => {
              const isSelected = s.id === activeSermonId;
              const scriptureCount = s.sections.reduce((acc, sec) => acc + sec.scriptures.length, 0);

              return (
                <div
                  key={s.id}
                  id={`sermon-item-${s.id}`}
                  onClick={() => {
                    onSelectSermon(s.id);
                    onClose();
                  }}
                  className={`p-4 sm:p-5 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500/50 ring-2 ring-amber-400/30'
                      : 'bg-stone-50/70 dark:bg-stone-800/40 border-stone-200 dark:border-stone-800 hover:border-amber-400'
                  }`}
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900 dark:text-stone-100">
                        {s.title}
                      </h3>
                      {isSelected && (
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-500 text-stone-950">
                          Ativo
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 dark:text-stone-400">
                      {s.theme && (
                        <span className="font-medium text-stone-700 dark:text-stone-300">
                          Tema: {s.theme}
                        </span>
                      )}
                      {s.mainScripture && (
                        <span className="text-amber-600 dark:text-amber-400 font-serif font-semibold">
                          Texto: {s.mainScripture}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {s.targetDurationMinutes} min
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" /> {scriptureCount} versículos
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => downloadStandaloneHtmlFile([s], s.title)}
                      className="p-2 text-stone-500 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-lg"
                      title="Baixar este sermão em arquivo HTML único"
                    >
                      <FileCode className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDuplicateSermon(s)}
                      className="p-2 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg"
                      title="Duplicar este sermão"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Tem certeza que deseja excluir o sermão "${s.title}"?`)) {
                          onDeleteSermon(s.id);
                        }
                      }}
                      className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg"
                      title="Excluir sermão"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onSelectSermon(s.id);
                        onClose();
                      }}
                      className="px-3 py-1.5 bg-stone-900 dark:bg-stone-800 hover:bg-stone-800 dark:hover:bg-stone-700 text-amber-400 font-bold text-xs rounded-lg inline-flex items-center gap-1"
                    >
                      <span>Abrir</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
