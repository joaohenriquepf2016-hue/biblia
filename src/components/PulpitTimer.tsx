import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock, AlertCircle } from 'lucide-react';

interface PulpitTimerProps {
  targetMinutes: number;
  onTargetChange?: (minutes: number) => void;
}

export const PulpitTimer: React.FC<PulpitTimerProps> = ({
  targetMinutes,
  onTargetChange,
}) => {
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const minutes = Math.floor(secondsElapsed / 60);
  const seconds = secondsElapsed % 60;
  const targetSeconds = (targetMinutes || 30) * 60;
  const progressPercent = Math.min(100, Math.round((secondsElapsed / targetSeconds) * 100));
  const isOvertime = secondsElapsed > targetSeconds;
  const isNearEnd = !isOvertime && (targetSeconds - secondsElapsed) <= 300; // 5 mins left

  const formatDigits = (val: number) => String(val).padStart(2, '0');

  const handleReset = () => {
    setIsRunning(false);
    setSecondsElapsed(0);
  };

  return (
    <div className="relative inline-flex items-center gap-2 bg-stone-900 text-stone-100 px-3 py-1.5 rounded-xl border border-stone-700 shadow-xs">
      <div className="flex items-center gap-2">
        <Clock className={`w-4 h-4 ${isOvertime ? 'text-rose-400 animate-pulse' : isNearEnd ? 'text-amber-400' : 'text-amber-500'}`} />
        <span 
          className={`font-mono text-sm sm:text-base font-bold tracking-wider ${
            isOvertime ? 'text-rose-400' : isNearEnd ? 'text-amber-400' : 'text-white'
          }`}
        >
          {formatDigits(minutes)}:{formatDigits(seconds)}
        </span>
        <span className="text-xs text-stone-400 font-sans hidden sm:inline">
          / {targetMinutes}min
        </span>
      </div>

      <div className="flex items-center gap-1 border-l border-stone-700 pl-2">
        <button
          id="timer-toggle-btn"
          type="button"
          onClick={() => setIsRunning(!isRunning)}
          className={`p-1 rounded-lg transition-colors cursor-pointer ${
            isRunning ? 'bg-amber-500 text-stone-950 hover:bg-amber-400' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
          }`}
          title={isRunning ? 'Pausar Cronômetro' : 'Iniciar Cronômetro'}
        >
          {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>
        <button
          id="timer-reset-btn"
          type="button"
          onClick={handleReset}
          className="p-1 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
          title="Zerar Cronômetro"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Progress Line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-stone-800 rounded-b-xl overflow-hidden">
        <div 
          className={`h-full transition-all duration-500 ${
            isOvertime ? 'bg-rose-500' : isNearEnd ? 'bg-amber-400' : 'bg-emerald-500'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};
