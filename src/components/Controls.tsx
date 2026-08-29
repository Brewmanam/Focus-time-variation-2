import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon, 
  Sparkles, 
  Clock, 
  Sliders, 
  Eye, 
  FastForward,
  Palette
} from 'lucide-react';
import { ThemeFinish, TimeState, PresetTime, DisplayView } from '../types';
import { audio } from '../utils/audio';

interface ControlsProps {
  timeState: TimeState;
  isLive: boolean;
  setIsLive: (live: boolean) => void;
  onRecalibrate?: () => void;
  onTimeChange: (h: number, m: number, s: number) => void;
  speed: number;
  setSpeed: (speed: number) => void;
  finish: ThemeFinish;
  setFinish: (f: ThemeFinish) => void;
  view: DisplayView;
  setView: (v: DisplayView) => void;
  showSeconds: boolean;
  setShowSeconds: (s: boolean) => void;
  showRelativeMinuteLabels: boolean;
  setShowRelativeMinuteLabels: (s: boolean) => void;
  showXRay: boolean;
  setShowXRay: (x: boolean) => void;
  isMuted: boolean;
  setIsMuted: (m: boolean) => void;
}

export const Controls: React.FC<ControlsProps> = ({
  timeState,
  isLive,
  setIsLive,
  onRecalibrate,
  onTimeChange,
  speed,
  setSpeed,
  finish,
  setFinish,
  view,
  setView,
  showSeconds,
  setShowSeconds,
  showRelativeMinuteLabels,
  setShowRelativeMinuteLabels,
  showXRay,
  setShowXRay,
  isMuted,
  setIsMuted,
}) => {
  const presets: PresetTime[] = [
    {
      name: '12:30 AM',
      hour: 0,
      minute: 30,
      second: 0,
      description: 'Night slice • Left edge at 12 • Hand opposite'
    },
    {
      name: '4:30 PM',
      hour: 16,
      minute: 30,
      second: 0,
      description: 'Day slice • Left edge at 4 • Hand across at 10'
    },
    {
      name: '11:59 PM',
      hour: 23,
      minute: 59,
      second: 50,
      description: 'Observe jumping hour to 12:00 AM'
    },
    {
      name: '6:00 AM',
      hour: 6,
      minute: 0,
      second: 0,
      description: 'Dawn transition • Left edge at 6'
    },
    {
      name: '12:00 PM',
      hour: 12,
      minute: 0,
      second: 0,
      description: 'Solar noon • Left edge at 12'
    },
    {
      name: '9:15 PM',
      hour: 21,
      minute: 15,
      second: 0,
      description: 'Night slice • 90° relative quarter turn'
    }
  ];

  const finishes: { id: ThemeFinish; label: string; accent: string }[] = [
    { id: 'classic_slate', label: 'Classic Slate', accent: '#ffffff' },
    { id: 'obsidian_gold', label: 'Obsidian & 18K Gold', accent: '#d4af37' },
    { id: 'titanium_stealth', label: 'Brushed Titanium', accent: '#38bdf8' },
    { id: 'vintage_ivory', label: 'Vintage Ivory & Blued', accent: '#1e3a8a' },
    { id: 'midnight_astral', label: 'Midnight Astral', accent: '#818cf8' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Top View Selector Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-1.5 rounded-2xl bg-neutral-900/80 border border-neutral-800 backdrop-blur-md">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setView('dial')}
            className={`px-4 py-2 rounded-xl text-xs font-space font-semibold transition-all cursor-pointer ${
              view === 'dial' ? 'bg-neutral-800 text-amber-400 shadow-md border border-neutral-700' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Watch Dial
          </button>
          <button
            onClick={() => setView('exploded')}
            className={`px-4 py-2 rounded-xl text-xs font-space font-semibold transition-all cursor-pointer ${
              view === 'exploded' ? 'bg-neutral-800 text-amber-400 shadow-md border border-neutral-700' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Exploded 4-Layer Anatomy
          </button>
          <button
            onClick={() => setView('principles')}
            className={`px-4 py-2 rounded-xl text-xs font-space font-semibold transition-all cursor-pointer ${
              view === 'principles' ? 'bg-neutral-800 text-amber-400 shadow-md border border-neutral-700' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Design Principles & Scenarios
          </button>
        </div>

        {/* Live vs Interactive toggle */}
        <div className="flex items-center space-x-2 px-2">
          {onRecalibrate && (
            <button
              onClick={onRecalibrate}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-space font-semibold transition-all cursor-pointer bg-neutral-950/70 hover:bg-neutral-800 text-amber-300 border border-neutral-700"
              title="Reset and recalibrate timepiece to current live local time"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Recalibrate</span>
            </button>
          )}

          <button
            onClick={() => {
              if (onRecalibrate) onRecalibrate();
              else setIsLive(true);
            }}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-space font-semibold transition-all cursor-pointer ${
              isLive ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 shadow' : 'text-neutral-400 hover:text-neutral-200 bg-neutral-950/40'
            }`}
          >
            <Clock className={`w-3.5 h-3.5 ${isLive ? 'animate-spin' : ''}`} style={{ animationDuration: '60s' }} />
            <span>Viewer Local Time</span>
          </button>

          <button
            onClick={() => setIsLive(false)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-space font-semibold transition-all cursor-pointer ${
              !isLive ? 'bg-amber-950/80 text-amber-300 border border-amber-700/60 shadow' : 'text-neutral-400 hover:text-neutral-200 bg-neutral-950/40'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Manual Scrubber</span>
          </button>

          {/* Audio toggle */}
          <button
            onClick={() => {
              const next = !isMuted;
              setIsMuted(next);
              audio.setMuted(next);
              if (!next) audio.playJumpHour();
            }}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              !isMuted ? 'bg-neutral-800 text-amber-400 border-neutral-700' : 'bg-neutral-950/40 text-neutral-500 border-neutral-800'
            }`}
            title={isMuted ? 'Unmute mechanical sound effects' : 'Mute sound effects'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Interactive Time Machine & Scrubber Panel */}
      <div className="p-4 sm:p-5 rounded-3xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-md space-y-4">
        {/* Scrubber Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Hour Slider */}
          <div className="p-3.5 rounded-2xl bg-neutral-950/70 border border-neutral-800">
            <div className="flex items-center justify-between text-xs font-space font-semibold mb-2">
              <span className="text-neutral-400 uppercase tracking-wider">Hour Selection (Jumping Aperture)</span>
              <span className="font-mono-code font-bold text-amber-400 text-sm">
                {timeState.hours % 12 === 0 ? 12 : timeState.hours % 12}:00 {timeState.hours >= 12 ? 'PM' : 'AM'} ({timeState.hours}:00)
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="23"
              value={timeState.hours}
              onChange={(e) => {
                setIsLive(false);
                onTimeChange(parseInt(e.target.value, 10), timeState.minutes, timeState.seconds);
              }}
              className="w-full accent-amber-500 h-2 bg-neutral-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[9px] font-mono-code text-neutral-500 mt-1">
              <span>12 AM (Midnight)</span>
              <span>6 AM</span>
              <span>12 PM (Noon)</span>
              <span>6 PM</span>
              <span>11 PM</span>
            </div>
          </div>

          {/* Minute Slider */}
          <div className="p-3.5 rounded-2xl bg-neutral-950/70 border border-neutral-800">
            <div className="flex items-center justify-between text-xs font-space font-semibold mb-2">
              <span className="text-neutral-400 uppercase tracking-wider">Minute Hand (360° from Left Edge)</span>
              <span className="font-mono-code font-bold text-amber-400 text-sm">
                {timeState.minutes} min {timeState.minutes === 30 ? '(180° Opposite)' : ''}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="59"
              value={timeState.minutes}
              onChange={(e) => {
                setIsLive(false);
                onTimeChange(timeState.hours, parseInt(e.target.value, 10), timeState.seconds);
              }}
              className="w-full accent-amber-500 h-2 bg-neutral-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[9px] font-mono-code text-neutral-500 mt-1">
              <span>0m (Left Edge)</span>
              <span>15m</span>
              <span>30m (Opposite)</span>
              <span>45m</span>
              <span>59m</span>
            </div>
          </div>
        </div>

        {/* Canonical Test Scenario Presets */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-space font-semibold text-neutral-400 uppercase tracking-wider">
              Quick Test Presets & User Scenarios
            </span>
            {!isLive && (
              <span className="text-[10px] font-mono-code text-amber-400">
                Click to instantaneously calibrate the mechanism
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {presets.map((preset) => {
              const isCurrent = 
                !isLive && 
                timeState.hours === preset.hour && 
                timeState.minutes === preset.minute;

              return (
                <button
                  key={preset.name}
                  onClick={() => {
                    setIsLive(false);
                    onTimeChange(preset.hour, preset.minute, preset.second);
                  }}
                  className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                    isCurrent 
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md' 
                      : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700 text-neutral-300'
                  }`}
                >
                  <span className="font-mono-code font-bold text-xs">{preset.name}</span>
                  <span className="text-[10px] text-neutral-400 line-clamp-1 mt-0.5">{preset.description}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Speed Simulation & Fine Details */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-800">
          {/* Simulation fast-forward */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-space text-neutral-400 flex items-center space-x-1">
              <FastForward className="w-3.5 h-3.5" />
              <span>Sim Speed:</span>
            </span>
            {[1, 10, 60, 300].map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono-code transition-all cursor-pointer ${
                  speed === s ? 'bg-amber-500 text-neutral-950 font-bold' : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Dial View Options */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowSeconds(!showSeconds)}
              className={`px-3 py-1 rounded-lg text-xs font-space transition-all cursor-pointer border ${
                showSeconds ? 'bg-neutral-800 text-amber-400 border-neutral-700' : 'bg-neutral-950/40 text-neutral-500 border-neutral-800'
              }`}
            >
              Seconds Sweep
            </button>
            <button
              onClick={() => setShowRelativeMinuteLabels(!showRelativeMinuteLabels)}
              className={`px-3 py-1 rounded-lg text-xs font-space transition-all cursor-pointer border ${
                showRelativeMinuteLabels ? 'bg-neutral-800 text-amber-400 border-neutral-700' : 'bg-neutral-950/40 text-neutral-500 border-neutral-800'
              }`}
            >
              Outer 5-Min Track (5–60)
            </button>
            <button
              onClick={() => setShowXRay(!showXRay)}
              className={`px-3 py-1 rounded-lg text-xs font-space transition-all cursor-pointer border ${
                showXRay ? 'bg-neutral-800 text-cyan-400 border-neutral-700' : 'bg-neutral-950/40 text-neutral-500 border-neutral-800'
              }`}
            >
              X-Ray Undercarriage
            </button>
          </div>
        </div>

        {/* Horological Finishes */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-800">
          <div className="flex items-center space-x-1.5 text-xs font-space text-neutral-400">
            <Palette className="w-3.5 h-3.5 text-amber-400" />
            <span>Horological Finishes:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {finishes.map((f) => (
              <button
                key={f.id}
                onClick={() => setFinish(f.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-space transition-all cursor-pointer border ${
                  finish === f.id ? 'bg-neutral-800 text-neutral-100 border-amber-500/80 shadow' : 'bg-neutral-950/40 text-neutral-400 border-neutral-800 hover:text-neutral-200'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full border border-neutral-600" style={{ backgroundColor: f.accent }} />
                <span>{f.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
