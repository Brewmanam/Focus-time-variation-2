import React, { useRef, useState, useEffect, useCallback } from 'react';
import { 
  RotateCcw, 
  Play, 
  Zap, 
  ChevronUp, 
  ChevronDown, 
  Clock, 
  Sliders, 
  Sun, 
  Moon,
  Sparkles,
  Volume2,
  VolumeX
} from 'lucide-react';
import { TimeState } from '../types';
import { audio } from '../utils/audio';

interface VerticalScrubberProps {
  timeState: TimeState;
  isLive: boolean;
  onRecalibrate: () => void;
  baseHour: number;
  setBaseHour: (h: number) => void;
  sliderMinutes: number;
  setSliderMinutes: (m: number) => void;
  onScrub: (baseH: number, mins: number) => void;
  isMuted: boolean;
  setIsMuted: (m: boolean) => void;
  cityName?: string;
  timeZone?: string;
}

export const VerticalScrubber: React.FC<VerticalScrubberProps> = ({
  timeState,
  isLive,
  onRecalibrate,
  baseHour,
  setBaseHour,
  sliderMinutes,
  setSliderMinutes,
  onScrub,
  isMuted,
  setIsMuted,
  cityName,
  timeZone,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Key milestones in the 0-120 minute window
  const milestones = [
    { minute: 0, label: '0m', desc: 'Hour 1 Left Edge' },
    { minute: 15, label: '15m', desc: '90° Quarter' },
    { minute: 30, label: '30m', desc: '180° Opposite' },
    { minute: 45, label: '45m', desc: '270° Turn' },
    { minute: 59, label: '59m', desc: 'Pre-Jump' },
    { minute: 60, label: '60m ⚡', desc: '1st Jump', isJump: true },
    { minute: 75, label: '75m', desc: '+15m (Hr 2)' },
    { minute: 90, label: '90m', desc: '180° in Hr 2' },
    { minute: 105, label: '105m', desc: '+45m (Hr 2)' },
    { minute: 119, label: '119m', desc: 'Pre-Jump 2' },
    { minute: 120, label: '120m ⚡', desc: '2nd Jump', isJump: true },
  ];

  // Calculate percentage along the horizontal track (0% at left = 0m, 100% at right = 120m)
  const percent = (sliderMinutes / 120) * 100;

  const updateFromPointer = useCallback((clientX: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const relativeX = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const ratio = relativeX / rect.width;
    const newMins = Math.round(ratio * 120);
    const clampedMins = Math.max(0, Math.min(120, newMins));
    
    setSliderMinutes(clampedMins);
    onScrub(baseHour, clampedMins);
  }, [baseHour, onScrub, setSliderMinutes]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateFromPointer(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      updateFromPointer(e.clientX);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch (err) {
        // Safe fallback
      }
    }
  };

  const handleStep = (delta: number) => {
    const next = Math.max(0, Math.min(120, sliderMinutes + delta));
    setSliderMinutes(next);
    onScrub(baseHour, next);
  };

  const handleSetExactMinute = (targetMin: number) => {
    setSliderMinutes(targetMin);
    onScrub(baseHour, targetMin);
  };

  const currentEffectiveHour = (baseHour + Math.floor(sliderMinutes / 60)) % 24;
  const currentEffectiveDisplay12 = currentEffectiveHour % 12 === 0 ? 12 : currentEffectiveHour % 12;
  const currentEffectiveMinute = sliderMinutes % 60;
  const isNightTime = currentEffectiveHour >= 18 || currentEffectiveHour < 6;

  return (
    <div className="w-full p-4 sm:p-5 rounded-3xl bg-neutral-900/80 border border-neutral-800/90 shadow-2xl backdrop-blur-xl space-y-4">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-800">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-space font-bold text-neutral-100">
                0–120 Minute Precision Calibre Scrubber
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-code bg-amber-500/15 text-amber-400 border border-amber-500/30">
                Bottom Deck
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Drag needle along the continuous multi-hour timeline to observe the jump-hour trigger and 360° relative minute rotation
            </p>
          </div>
        </div>

        {/* Sync / Recalibrate button */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onRecalibrate}
            className={`py-1.5 px-3 rounded-xl flex items-center space-x-1.5 transition-all cursor-pointer border text-xs font-space ${
              isLive
                ? 'bg-emerald-950/80 hover:bg-emerald-900/80 border-emerald-600/70 text-emerald-300'
                : 'bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold border-amber-400 shadow-md'
            }`}
            title="Resume live local time"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isLive ? 'text-emerald-400' : 'text-neutral-950'}`} />
            <span>{isLive ? 'Live Sync' : 'Reset to Live'}</span>
          </button>
        </div>
      </div>

      {/* Main Scrubber Track & Current Indicator Stage */}
      <div className="space-y-3">
        {/* Banner with Effective Time, Milestones, and Calibre Info */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-neutral-950/80 border border-neutral-800 text-xs font-mono-code">
          <div className="flex items-center space-x-3">
            {/* Split Day/Night Disc Visual Indicator */}
            <div 
              className="w-4 h-4 rounded-full border border-neutral-600 shadow-sm shrink-0"
              style={{ backgroundColor: isNightTime ? '#09090b' : '#ffffff' }}
              title={isNightTime ? 'Night State (Black slice)' : 'Day State (White slice)'}
            />
            <div>
              <span className="text-neutral-400 text-[11px]">Effective Time: </span>
              <span className="text-amber-400 font-bold text-sm">
                {currentEffectiveDisplay12}:{String(currentEffectiveMinute).padStart(2, '0')} {currentEffectiveHour >= 12 ? 'PM' : 'AM'}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-neutral-400 text-[11px]">
            <div>
              <span>Minute Progress: </span>
              <span className="text-amber-300 font-bold">{sliderMinutes}m</span>
              <span className="text-neutral-500"> / 120m</span>
            </div>
            <div className="hidden sm:block">
              <span>Aperture θ: </span>
              <span className="text-amber-400 font-semibold">{((currentEffectiveDisplay12 === 12 ? 0 : currentEffectiveDisplay12) * 30)}°</span>
            </div>
            <div className="hidden sm:block">
              <span>Minute θ: </span>
              <span className="text-amber-400 font-semibold">
                {Math.round(((currentEffectiveDisplay12 === 12 ? 0 : currentEffectiveDisplay12) * 30 + (currentEffectiveMinute / 60) * 360) % 360)}°
              </span>
            </div>
          </div>
        </div>

        {/* Continuous Horizontal Precision Track */}
        <div className="relative pt-6 pb-6 select-none">
          {/* Milestone markers above track */}
          <div className="relative w-full h-5 pointer-events-none mb-1">
            {milestones.map((m) => {
              const posPercent = (m.minute / 120) * 100;
              const isSelected = Math.abs(sliderMinutes - m.minute) <= 1;
              return (
                <div
                  key={m.minute}
                  className="absolute -translate-x-1/2 flex flex-col items-center"
                  style={{ left: `${posPercent}%` }}
                >
                  <span
                    className={`text-[10px] font-mono-code transition-all whitespace-nowrap ${
                      isSelected
                        ? 'text-amber-300 font-bold scale-110'
                        : m.isJump
                        ? 'text-emerald-400 font-semibold'
                        : 'text-neutral-500'
                    }`}
                  >
                    {m.label}
                  </span>
                  <div
                    className={`w-[1px] ${
                      isSelected
                        ? 'h-2 bg-amber-400'
                        : m.isJump
                        ? 'h-2 bg-emerald-500'
                        : 'h-1 bg-neutral-700'
                    }`}
                  />
                </div>
              );
            })}
          </div>

          {/* Tactile Horizontal Track Bar */}
          <div
            ref={trackRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="relative w-full h-8 bg-neutral-950 rounded-full border border-neutral-700/80 shadow-inner cursor-pointer hover:border-amber-500/60 transition-colors flex items-center px-2 overflow-visible touch-none"
          >
            {/* Center Track Guide */}
            <div className="absolute left-3 right-3 h-1 bg-neutral-800 rounded-full" />

            {/* Jump Horizon Line at 60m (50% mark) */}
            <div className="absolute top-0 bottom-0 left-1/2 w-[2px] bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.8)] z-0" />

            {/* Filled Progress Bar */}
            <div
              className="absolute left-2 top-2 bottom-2 rounded-full bg-gradient-to-r from-amber-500/30 via-amber-500/60 to-amber-400 transition-none"
              style={{ width: `calc(${percent}% - 4px)` }}
            />

            {/* Scrubbed Needle Knob Indicator */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-neutral-900 border-2 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.6)] flex items-center justify-center transition-none z-10 hover:scale-110 active:scale-125"
              style={{ left: `${percent}%` }}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            </div>
          </div>

          {/* Quick Jump Buttons below track */}
          <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2">
            <div className="flex items-center space-x-1">
              <button
                onClick={() => handleStep(-1)}
                className="py-1 px-2.5 rounded-lg bg-neutral-950 hover:bg-neutral-800 text-neutral-300 text-xs font-mono-code border border-neutral-700 cursor-pointer flex items-center space-x-1"
                title="Step backward 1 minute"
              >
                <span>-1m</span>
              </button>
              <button
                onClick={() => handleStep(1)}
                className="py-1 px-2.5 rounded-lg bg-neutral-950 hover:bg-neutral-800 text-neutral-300 text-xs font-mono-code border border-neutral-700 cursor-pointer flex items-center space-x-1"
                title="Step forward 1 minute"
              >
                <span>+1m</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => handleSetExactMinute(0)}
                className={`py-1 px-2 rounded-lg text-xs font-mono-code border cursor-pointer ${
                  sliderMinutes === 0
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500 font-bold'
                    : 'bg-neutral-950 hover:bg-neutral-800 text-neutral-400 border-neutral-750'
                }`}
              >
                0m (Start)
              </button>
              <button
                onClick={() => handleSetExactMinute(30)}
                className={`py-1 px-2 rounded-lg text-xs font-mono-code border cursor-pointer ${
                  sliderMinutes === 30
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500 font-bold'
                    : 'bg-neutral-950 hover:bg-neutral-800 text-neutral-400 border-neutral-750'
                }`}
              >
                30m (180°)
              </button>
              <button
                onClick={() => handleSetExactMinute(59)}
                className={`py-1 px-2 rounded-lg text-xs font-mono-code border cursor-pointer ${
                  sliderMinutes === 59 
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500 font-bold' 
                    : 'bg-neutral-950 hover:bg-neutral-800 text-neutral-400 border-neutral-750'
                }`}
              >
                59m (Pre-Jump)
              </button>
              <button
                onClick={() => handleSetExactMinute(60)}
                className={`py-1 px-2.5 rounded-lg text-xs font-mono-code border cursor-pointer flex items-center space-x-1 ${
                  sliderMinutes === 60 
                    ? 'bg-emerald-500/30 text-emerald-300 border-emerald-500 font-bold' 
                    : 'bg-neutral-950 hover:bg-neutral-800 text-emerald-400 border-neutral-750'
                }`}
              >
                <Zap className="w-3 h-3" />
                <span>60m (⚡ Hour Jumps)</span>
              </button>
              <button
                onClick={() => handleSetExactMinute(120)}
                className={`py-1 px-2 rounded-lg text-xs font-mono-code border cursor-pointer ${
                  sliderMinutes === 120 
                    ? 'bg-emerald-500/30 text-emerald-300 border-emerald-500 font-bold' 
                    : 'bg-neutral-950 hover:bg-neutral-800 text-neutral-400 border-neutral-750'
                }`}
              >
                120m (2nd Jump)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Start Hour Selector Deck */}
      <div className="pt-3 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2 text-xs font-space text-neutral-400">
          <span>Base Start Hour:</span>
          <span className="font-mono-code text-amber-400 font-bold">
            {baseHour % 12 === 0 ? 12 : baseHour % 12}:00 {baseHour >= 12 ? 'PM' : 'AM'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1">
          {Array.from({ length: 12 }).map((_, i) => {
            const h12 = i === 0 ? 12 : i;
            const isSelected = (baseHour % 12 === 0 ? 12 : baseHour % 12) === h12;
            return (
              <button
                key={h12}
                onClick={() => {
                  const newH = baseHour >= 12 ? (h12 === 12 ? 12 : h12 + 12) : (h12 === 12 ? 0 : h12);
                  setBaseHour(newH);
                  onScrub(newH, sliderMinutes);
                }}
                className={`px-2 py-1 text-xs font-mono-code rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500 font-bold'
                    : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-neutral-200'
                }`}
              >
                {h12}
              </button>
            );
          })}

          <div className="flex ml-2 border border-neutral-800 rounded-lg overflow-hidden">
            <button
              onClick={() => {
                if (baseHour >= 12) {
                  const newH = baseHour - 12;
                  setBaseHour(newH);
                  onScrub(newH, sliderMinutes);
                }
              }}
              className={`px-2 py-1 text-[11px] font-mono-code transition-all cursor-pointer ${
                baseHour < 12 ? 'bg-neutral-800 text-neutral-100 font-bold' : 'bg-neutral-950 text-neutral-500'
              }`}
            >
              AM
            </button>
            <button
              onClick={() => {
                if (baseHour < 12) {
                  const newH = baseHour + 12;
                  setBaseHour(newH);
                  onScrub(newH, sliderMinutes);
                }
              }}
              className={`px-2 py-1 text-[11px] font-mono-code transition-all cursor-pointer ${
                baseHour >= 12 ? 'bg-neutral-800 text-neutral-100 font-bold' : 'bg-neutral-950 text-neutral-500'
              }`}
            >
              PM
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
