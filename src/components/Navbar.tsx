import React from 'react';
import { 
  BookOpen, 
  Flame, 
  FileText, 
  Library, 
  WifiOff, 
  Maximize2, 
  Settings, 
  Plus, 
  Download, 
  Upload,
  Printer,
  Sparkles
} from 'lucide-react';
import { PulpitTimer } from './PulpitTimer';
import { FontSize, PulpitTheme } from '../types';

interface NavbarProps {
  activeTab: 'editor' | 'preach' | 'bible' | 'sermons';
  setActiveTab: (tab: 'editor' | 'preach' | 'bible' | 'sermons') => void;
  targetDurationMinutes: number;
  onTargetDurationChange?: (mins: number) => void;
  onNewSermon: () => void;
  onOpenPrint: () => void;
  onDownloadHtml: () => void;
  pulpitTheme: PulpitTheme;
  setPulpitTheme: (theme: PulpitTheme) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  activeScriptureCount: number;
  completedScriptureCount: number;
  totalScriptureCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  targetDurationMinutes,
  onTargetDurationChange,
  onNewSermon,
  onOpenPrint,
  onDownloadHtml,
  pulpitTheme,
  setPulpitTheme,
  fontSize,
  setFontSize,
  activeScriptureCount,
  completedScriptureCount,
  totalScriptureCount,
}) => {
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn('Fullscreen request failed', err);
      });
    } else {
      document.exitFullscreen().catch(err => {
        console.warn('Exit fullscreen failed', err);
      });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-stone-900 text-stone-100 border-b border-stone-800 shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-stone-950 shadow-sm font-serif font-black text-lg">
              ✞
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-lg text-white tracking-wide">
                  PÚLPITO
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <WifiOff className="w-3 h-3" /> 100% Offline
                </span>
              </div>
              <p className="text-xs text-stone-400">Auxiliar de Pregação & Bíblia</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center bg-stone-950/80 p-1 rounded-xl border border-stone-800 text-xs sm:text-sm font-medium">
            <button
              id="tab-preach-mode"
              type="button"
              onClick={() => setActiveTab('preach')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'preach'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span className="hidden xs:inline">Modo Púlpito</span>
              <span className="xs:hidden">Púlpito</span>
              {totalScriptureCount > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeTab === 'preach' ? 'bg-stone-950 text-amber-300' : 'bg-stone-800 text-stone-300'
                }`}>
                  {completedScriptureCount}/{totalScriptureCount}
                </span>
              )}
            </button>

            <button
              id="tab-editor"
              type="button"
              onClick={() => setActiveTab('editor')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'editor'
                  ? 'bg-stone-800 text-amber-300 font-bold border border-amber-500/30 shadow-xs'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Esboço</span>
            </button>

            <button
              id="tab-bible"
              type="button"
              onClick={() => setActiveTab('bible')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'bible'
                  ? 'bg-stone-800 text-amber-300 font-bold border border-amber-500/30 shadow-xs'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Bíblia</span>
            </button>

            <button
              id="tab-sermons"
              type="button"
              onClick={() => setActiveTab('sermons')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'sermons'
                  ? 'bg-stone-800 text-amber-300 font-bold border border-amber-500/30 shadow-xs'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <Library className="w-4 h-4" />
              <span className="hidden sm:inline">Sermões</span>
            </button>
          </nav>

          {/* Right Action Tools: Timer, Download HTML & Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <PulpitTimer 
              targetMinutes={targetDurationMinutes}
              onTargetChange={onTargetDurationChange}
            />

            {/* Quick Download HTML button */}
            <button
              id="download-standalone-html-btn"
              type="button"
              onClick={onDownloadHtml}
              className="px-2.5 sm:px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Baixar App em Arquivo Único .html para usar no computador ou celular"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Baixar HTML</span>
            </button>

            <button
              id="fullscreen-toggle-btn"
              type="button"
              onClick={toggleFullscreen}
              className="p-2 text-stone-300 hover:text-white hover:bg-stone-800 rounded-xl transition-colors hidden sm:inline-flex cursor-pointer"
              title="Alternar Tela Cheia"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            <button
              id="print-outline-btn"
              type="button"
              onClick={onOpenPrint}
              className="p-2 text-stone-300 hover:text-white hover:bg-stone-800 rounded-xl transition-colors hidden lg:inline-flex cursor-pointer"
              title="Imprimir / Visualizar Roteiro"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
