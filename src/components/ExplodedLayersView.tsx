import React from 'react';
import { motion } from 'motion/react';
import { TimeState, ThemeFinish, ApertureFontId } from '../types';
import { Layers, CheckCircle2, Info } from 'lucide-react';
import { APERTURE_FONTS } from '../data/fonts';

interface ExplodedLayersViewProps {
  timeState: TimeState;
  finish: ThemeFinish;
  selectedFontId?: ApertureFontId;
  fontSize?: number;
}

export const ExplodedLayersView: React.FC<ExplodedLayersViewProps> = ({
  timeState,
  finish,
  selectedFontId = 'cinzel',
  fontSize = 24,
}) => {
  const { displayHour12, minutes, isNight, isPM, hours } = timeState;

  const activeFont = APERTURE_FONTS.find((f) => f.id === selectedFontId) || APERTURE_FONTS[0];

  const hourIndex = displayHour12 === 12 ? 0 : displayHour12;
  const apertureStartAngle = hourIndex * 30;
  const minuteHandAngle = (apertureStartAngle + (minutes / 60) * 360) % 360;

  const describeArc = (x: number, y: number, r: number, startAngle: number, endAngle: number) => {
    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = ((endAngle - 90) * Math.PI) / 180;
    const x1 = x + r * Math.cos(startRad);
    const y1 = y + r * Math.sin(startRad);
    const x2 = x + r * Math.cos(endRad);
    const y2 = y + r * Math.sin(endRad);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    return `M ${x} ${y} L ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  const layers = [
    {
      id: 'layer-4',
      title: 'Layer 4: Relative Minute Hand',
      subtitle: 'Starts from Left Edge of Cutout (Sweeps 360°)',
      desc: `Currently at ${minutes}m. Aligned with Left Edge (${displayHour12} o'clock) at 0m, and sits directly opposite (180° across) at 30m.`,
      render: (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="85" fill="none" stroke="#27272a" strokeWidth="1" strokeDasharray="2 4" />
          <g transform={`rotate(${minuteHandAngle} 100 100)`}>
            <line x1="100" y1="115" x2="100" y2="20" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="100" cy="100" r="4" fill="#f59e0b" />
            <polygon points="97,28 100,18 103,28" fill="#fbbf24" />
          </g>
        </svg>
      )
    },
    {
      id: 'layer-3',
      title: 'Layer 3: Top Aperture Mask Disc',
      subtitle: '1/12th Circle Cutout (30° Pizza Slice)',
      desc: `Jumps on every hour mark. Left edge aligns with ${displayHour12} o'clock (${apertureStartAngle}°), right edge aligns with ${(displayHour12 % 12) + 1} o'clock.`,
      render: (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            <mask id="layer3-mask">
              <rect width="200" height="200" fill="white" />
              <path d={describeArc(100, 100, 85, apertureStartAngle, apertureStartAngle + 30)} fill="black" />
            </mask>
          </defs>
          <circle cx="100" cy="100" r="85" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5" mask="url(#layer3-mask)" />
          {/* Bevel highlights */}
          {(() => {
            const lRad = ((apertureStartAngle - 90) * Math.PI) / 180;
            const rRad = ((apertureStartAngle + 30 - 90) * Math.PI) / 180;
            return (
              <g>
                <line x1="100" y1="100" x2={100 + 85 * Math.cos(lRad)} y2={100 + 85 * Math.sin(lRad)} stroke="#fbbf24" strokeWidth="2" />
                <line x1="100" y1="100" x2={100 + 85 * Math.cos(rRad)} y2={100 + 85 * Math.sin(rRad)} stroke="#d4af37" strokeWidth="1" strokeOpacity="0.8" />
              </g>
            );
          })()}
        </svg>
      )
    },
    {
      id: 'layer-2',
      title: 'Layer 2: Concentric Day/Night Disc',
      subtitle: 'White Sector (Sun + Clouds) • Black Sector (Moon + Stars)',
      desc: `24-hour split celestial plane: currently revealing the ${isNight ? 'Obsidian Night hemisphere (Moon & Stars)' : 'Luminous Day hemisphere (Sun & Clouds)'}.`,
      render: (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {/* Split Day/Night Disc */}
          <path d="M 100 52 A 48 48 0 0 1 100 148 Z" fill="#ffffff" />
          <path d="M 100 148 A 48 48 0 0 1 100 52 Z" fill="#09090b" />
          <circle cx="100" cy="100" r="48" fill="none" stroke="#d4af37" strokeWidth="2" />

          {/* Sun + Clouds on Day (Right) Half */}
          <g transform="translate(122, 100)">
            <circle cx="0" cy="0" r="7" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />
            <g stroke="#d97706" strokeWidth="1" strokeLinecap="round" opacity="0.8">
              <line x1="0" y1="-10" x2="0" y2="-13" />
              <line x1="0" y1="10" x2="0" y2="13" />
              <line x1="-10" y1="0" x2="-13" y2="0" />
              <line x1="10" y1="0" x2="13" y2="0" />
            </g>
            {/* Tiny Cloud */}
            <path d="M -8 3 C -10 3 -11 1 -11 -0.5 C -11 -2 -9 -3 -7 -3 C -6 -4.5 -4 -5.5 -2 -5.5 C 1 -5.5 2.5 -3.5 3 -2 C 4 -2 5.5 -1 5.5 0.5 C 5.5 2 4 3 2 3 Z" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.8" />
          </g>

          {/* Moon + Stars on Night (Left) Half */}
          <g transform="translate(78, 100)">
            <path d="M -3 -9 A 9 9 0 1 0 9 6 A 7.5 7.5 0 0 1 -3 -9 Z" fill="#fef08a" stroke="#fde047" strokeWidth="0.8" />
            <circle cx="8" cy="-8" r="1" fill="#ffffff" />
            <circle cx="-8" cy="8" r="0.8" fill="#fef08a" />
            <circle cx="6" cy="8" r="0.9" fill="#ffffff" />
          </g>
        </svg>
      )
    },
    {
      id: 'layer-1',
      title: 'Layer 1: Underneath Hour Numeral Disc',
      subtitle: `Numerals 1 to 12 in Selected Typography (${activeFont.name})`,
      desc: `Full diameter dial with hour numbers 1 through 12 arranged at each 30° quadrant. Only the active hour (${displayHour12}) is framed by the aperture.`,
      render: (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="85" fill="#121214" stroke="#27272a" strokeWidth="1" />
          {Array.from({ length: 12 }).map((_, i) => {
            const hNum = i === 0 ? 12 : i;
            const textAngle = i * 30 + 15;
            const rad = ((textAngle - 90) * Math.PI) / 180;
            const tx = 100 + 64 * Math.cos(rad);
            const ty = 100 + 64 * Math.sin(rad);
            const isCur = hNum === displayHour12;
            return (
              <text
                key={hNum}
                x={tx}
                y={ty + 4}
                textAnchor="middle"
                fill={isCur ? '#fbbf24' : '#52525b'}
                fontSize={isCur ? '13' : '9'}
                fontWeight={isCur ? 'bold' : 'normal'}
                style={{ fontFamily: activeFont.fontFamily }}
                className={activeFont.cssClass}
              >
                {hNum}
              </text>
            );
          })}
        </svg>
      )
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 bg-neutral-900/60 rounded-3xl border border-neutral-800 shadow-2xl">
      <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-space font-bold text-neutral-100">Horological Layer Anatomy</h3>
            <p className="text-xs text-neutral-400">Exploded structural breakdown of the 4 interacting mechanical planes</p>
          </div>
        </div>
        <span className="px-3 py-1 text-xs font-mono-code bg-neutral-800 text-amber-400 rounded-full border border-neutral-700">
          Live State: {displayHour12}:{String(minutes).padStart(2, '0')} {isPM ? 'PM' : 'AM'}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {layers.map((layer, idx) => (
          <div 
            key={layer.id}
            className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800/80 hover:border-neutral-700 transition-all flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono-code text-amber-500 uppercase tracking-wider">
                  PLANE 0{4 - idx}
                </span>
                <h4 className="text-sm font-space font-bold text-neutral-100 mt-0.5">{layer.title}</h4>
                <p className="text-xs font-medium text-amber-300/90">{layer.subtitle}</p>
              </div>
            </div>

            <div className="my-4 h-40 w-full flex items-center justify-center p-2 rounded-xl bg-neutral-900/50 border border-neutral-800/50">
              {layer.render}
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed bg-neutral-900/30 p-2.5 rounded-xl border border-neutral-800/40">
              {layer.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
