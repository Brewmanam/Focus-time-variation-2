import React from 'react';
import { CheckCircle2, ArrowRight, Compass, Sun, Moon } from 'lucide-react';
import { PresetTime } from '../types';

interface MechanismDiagramProps {
  onSelectPreset: (preset: PresetTime) => void;
}

export const MechanismDiagram: React.FC<MechanismDiagramProps> = ({ onSelectPreset }) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 bg-neutral-900/60 rounded-3xl border border-neutral-800 shadow-2xl space-y-6">
      <div className="flex items-center space-x-3 pb-4 border-b border-neutral-800">
        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
          <Compass className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-space font-bold text-neutral-100">Horological Principles & Exact Scenarios</h3>
          <p className="text-xs text-neutral-400">Detailed breakdown of the two canonical test states specified in your design</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Scenario 1: 12:30 AM */}
        <div className="p-5 rounded-2xl bg-neutral-950/90 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-800/40 text-xs font-mono-code font-bold">
                <Moon className="w-3.5 h-3.5" />
                <span>SCENARIO A: 12:30 AM</span>
              </span>
              <button
                onClick={() => onSelectPreset({
                  name: '12:30 AM',
                  hour: 0,
                  minute: 30,
                  second: 0,
                  description: 'Midnight aperture study'
                })}
                className="text-xs font-space font-semibold text-amber-400 hover:text-amber-300 flex items-center space-x-1 underline cursor-pointer"
              >
                <span>Load State</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="mt-4 space-y-2.5 text-xs text-neutral-300">
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-neutral-100">Aperture Cutout Alignment:</strong> Left edge is aligned with <strong>12 o'clock</strong> (0°); Right edge is aligned with <strong>1 o'clock</strong> (30°).
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-neutral-100">Day/Night Slice:</strong> The smaller radius disc reveals a <strong className="text-neutral-100 bg-neutral-900 px-1 py-0.5 rounded border border-neutral-700">Black slice</strong> indicating night time.
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-neutral-100">Hour Numeral:</strong> The max-diameter disc underneath reveals the number <strong className="text-amber-400 font-mono-code font-bold text-sm">12</strong> right in the middle of the opening.
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-neutral-100">Minute Hand:</strong> Starts at 12 o'clock (0m). At 30m, it sweeps 180° and sits <strong className="text-amber-400">directly opposite 12 o'clock</strong> (pointing at 6 o'clock).
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-800/80 font-mono-code text-[11px] text-neutral-400">
            θ_aperture = 0° | θ_minute = 0° + 180° = 180°
          </div>
        </div>

        {/* Scenario 2: 4:30 PM */}
        <div className="p-5 rounded-2xl bg-neutral-950/90 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-amber-950/70 text-amber-300 border border-amber-800/40 text-xs font-mono-code font-bold">
                <Sun className="w-3.5 h-3.5" />
                <span>SCENARIO B: 4:30 PM</span>
              </span>
              <button
                onClick={() => onSelectPreset({
                  name: '4:30 PM',
                  hour: 16,
                  minute: 30,
                  second: 0,
                  description: 'Afternoon solar study'
                })}
                className="text-xs font-space font-semibold text-amber-400 hover:text-amber-300 flex items-center space-x-1 underline cursor-pointer"
              >
                <span>Load State</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="mt-4 space-y-2.5 text-xs text-neutral-300">
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-neutral-100">Aperture Cutout Alignment:</strong> Left edge is aligned with <strong>4 o'clock</strong> (120°); Right edge is aligned with <strong>5 o'clock</strong> (150°).
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-neutral-100">Day/Night Slice:</strong> The smaller radius disc reveals a <strong className="text-neutral-900 bg-neutral-100 px-1 py-0.5 rounded font-bold">White slice</strong> indicating day time.
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-neutral-100">Hour Numeral:</strong> The max-diameter disc underneath reveals the number <strong className="text-amber-400 font-mono-code font-bold text-sm">4</strong> right in the middle of the opening.
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-neutral-100">Minute Hand:</strong> Starts at 4 o'clock (120°). At 30m, it sits <strong className="text-amber-400">right across 4 o'clock</strong> (120° + 180° = 300°, which is 10 o'clock!).
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-800/80 font-mono-code text-[11px] text-neutral-400">
            θ_aperture = 120° | θ_minute = 120° + 180° = 300° (10 o'clock)
          </div>
        </div>
      </div>

      {/* Geometry Mathematical Formulation */}
      <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800/70">
        <h4 className="text-xs font-space font-bold uppercase tracking-wider text-neutral-300 mb-2">
          Mathematical Formulation of the Calibre
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono-code text-neutral-300">
          <div className="p-2.5 rounded-xl bg-neutral-900/70 border border-neutral-800">
            <span className="text-[10px] text-neutral-500 block">JUMPING APERTURE</span>
            <span className="text-amber-400 font-bold">θ_left = (H mod 12) × 30°</span>
          </div>
          <div className="p-2.5 rounded-xl bg-neutral-900/70 border border-neutral-800">
            <span className="text-[10px] text-neutral-500 block">RELATIVE MINUTE</span>
            <span className="text-amber-400 font-bold">θ_min = θ_left + (M / 60) × 360°</span>
          </div>
          <div className="p-2.5 rounded-xl bg-neutral-900/70 border border-neutral-800">
            <span className="text-[10px] text-neutral-500 block">HALF-HOUR HORIZON</span>
            <span className="text-amber-400 font-bold">θ_30min = θ_left + 180°</span>
          </div>
        </div>
      </div>
    </div>
  );
};
