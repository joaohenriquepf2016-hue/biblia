import React from 'react';
import { ScriptureRef } from '../types';
import { BookOpen, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { formatScriptureDisplay } from '../utils/bibleParser';

interface ScriptureBadgeProps {
  scripture: ScriptureRef;
  onClick: (scripture: ScriptureRef) => void;
  onStatusChange?: (scriptureId: string, newStatus: 'pending' | 'active' | 'completed') => void;
  size?: 'sm' | 'md' | 'lg';
  showControls?: boolean;
}

export const ScriptureBadge: React.FC<ScriptureBadgeProps> = ({
  scripture,
  onClick,
  onStatusChange,
  size = 'md',
  showControls = false,
}) => {
  const isCompleted = scripture.status === 'completed';
  const isActive = scripture.status === 'active';

  // Cores dinâmicas para status
  let badgeStyles = 'bg-stone-100 text-stone-700 border-stone-300 hover:border-amber-500 hover:bg-amber-50/70';
  let dotStyles = 'bg-stone-400';
  let statusText = 'Pendente';

  if (isActive) {
    badgeStyles = 'bg-amber-500 text-stone-950 border-amber-600 shadow-md ring-2 ring-amber-400/60 font-semibold animate-pulse-subtle';
    dotStyles = 'bg-stone-950';
    statusText = 'Em Leitura';
  } else if (isCompleted) {
    badgeStyles = 'bg-emerald-100 text-emerald-900 border-emerald-300 hover:bg-emerald-200/80';
    dotStyles = 'bg-emerald-600';
    statusText = 'Já Lido';
  }

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1 gap-1.5',
    md: 'text-sm px-3.5 py-1.5 gap-2',
    lg: 'text-base px-4 py-2 gap-2.5',
  };

  return (
    <div className="inline-flex items-center gap-1.5 flex-wrap">
      <button
        id={`scripture-btn-${scripture.id}`}
        type="button"
        onClick={() => onClick(scripture)}
        className={`inline-flex items-center rounded-lg border transition-all cursor-pointer select-none ${badgeStyles} ${sizeClasses[size]}`}
        title={`Clique para abrir na Bíblia (${statusText})`}
      >
        {isCompleted ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
        ) : isActive ? (
          <Sparkles className="w-4 h-4 text-stone-950 shrink-0" />
        ) : (
          <BookOpen className="w-4 h-4 text-stone-500 shrink-0" />
        )}
        
        <span className="font-bold tracking-tight">
          {formatScriptureDisplay(scripture)}
        </span>

        <span className={`text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded ${
          isActive 
            ? 'bg-stone-900 text-amber-300' 
            : isCompleted 
              ? 'bg-emerald-200 text-emerald-800' 
              : 'bg-stone-200 text-stone-600'
        }`}>
          {statusText}
        </span>
      </button>

      {showControls && onStatusChange && (
        <div className="inline-flex items-center gap-1">
          {scripture.status !== 'active' && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onStatusChange(scripture.id, 'active');
              }}
              className="p-1 text-xs text-amber-700 hover:bg-amber-100 rounded border border-amber-200"
              title="Marcar como Em Leitura"
            >
              <Clock className="w-3.5 h-3.5" />
            </button>
          )}
          {scripture.status !== 'completed' && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onStatusChange(scripture.id, 'completed');
              }}
              className="p-1 text-xs text-emerald-700 hover:bg-emerald-100 rounded border border-emerald-200"
              title="Marcar como Já Lido"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
