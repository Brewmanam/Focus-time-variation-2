import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeFinish, TimeState, ApertureFontId } from '../types';
import { audio } from '../utils/audio';
import { APERTURE_FONTS } from '../data/fonts';

interface ApertureClockProps {
  timeState: TimeState;
  finish: ThemeFinish;
  showSeconds: boolean;
  showRelativeMinuteLabels: boolean;
  showXRay?: boolean;
  cityName?: string;
  timeZone?: string;
  selectedFontId?: ApertureFontId;
  fontSize?: number;
  outerFontId?: ApertureFontId;
  outerFontSize?: number;
}

export const ApertureClock: React.FC<ApertureClockProps> = ({
  timeState,
  finish,
  showSeconds,
  showRelativeMinuteLabels,
  showXRay = false,
  cityName,
  timeZone,
  selectedFontId = 'cinzel',
  fontSize = 24,
  outerFontId = 'space',
  outerFontSize = 11,
}) => {
  const { hours, minutes, seconds, milliseconds, isPM, displayHour12, isNight } = timeState;
  const prevHourRef = useRef(displayHour12);

  const activeFont = APERTURE_FONTS.find((f) => f.id === selectedFontId) || APERTURE_FONTS[0];
  const activeOuterFont = APERTURE_FONTS.find((f) => f.id === outerFontId) || APERTURE_FONTS[5];

  // Jump hour sound trigger
  useEffect(() => {
    if (prevHourRef.current !== displayHour12) {
      audio.playJumpHour();
      prevHourRef.current = displayHour12;
    }
  }, [displayHour12]);

  // Geometry
  const size = 520;
  const cx = size / 2; // 260
  const cy = size / 2; // 260
  const dialRadius = 220;
  const dayNightRadius = 112;

  // Aperture Angle:
  // 12 o'clock = 0 deg, 1 = 30 deg, 2 = 60 deg ... 4 = 120 deg
  const hourIndex = displayHour12 === 12 ? 0 : displayHour12;
  const apertureStartAngle = hourIndex * 30; // Left edge of cutout
  const apertureEndAngle = apertureStartAngle + 30; // Right edge of cutout
  const apertureMidAngle = apertureStartAngle + 15; // Center of cutout (for numeral)

  // 24-Hour Day/Night disc rotation:
  // At 12:00 PM (Noon), Day Sun is at the 12 o'clock aperture.
  // At 12:00 AM (Midnight), Night Moon is at the 12 o'clock aperture.
  const totalDayMinutes = hours * 60 + minutes + (seconds + milliseconds / 1000) / 60;
  const dayNightAngle = (totalDayMinutes / 1440) * 360;

  // Minute hand angle starting from the LEFT EDGE of the cutout (apertureStartAngle):
  // At min = 0 => apertureStartAngle + 0
  // At min = 30 => apertureStartAngle + 180 (directly opposite / across)
  const minuteProgress = (minutes + (showSeconds ? (seconds + milliseconds / 1000) / 60 : seconds / 60)) / 60;
  const minuteHandAngle = (apertureStartAngle + minuteProgress * 360) % 360;

  // Smooth seconds angle starting from the LEFT EDGE of the cutout (apertureStartAngle):
  // At sec = 0 => apertureStartAngle + 0 (left edge)
  // At sec = 30 => apertureStartAngle + 180 (opposite side)
  const secondsProgress = (seconds + milliseconds / 1000) / 60;
  const secondsAngle = (apertureStartAngle + secondsProgress * 360) % 360;

  // Theme palettes
  const getThemeStyles = () => {
    switch (finish) {
      case 'obsidian_gold':
        return {
          caseBorder: 'from-amber-600/50 via-amber-400/20 to-neutral-900',
          caseShadow: '0 25px 60px -10px rgba(0,0,0,0.9), inset 0 2px 4px rgba(251,191,36,0.3)',
          discBg: '#121110',
          discAccent: '#24201b',
          bezelGrad: 'radial-gradient(circle, #29241e 0%, #171411 75%, #0d0b09 100%)',
          textMain: '#f5e6c8',
          textMuted: '#9e8c75',
          goldAccent: '#d4af37',
          dayColor: '#fbfaf5',
          dayText: '#18181b',
          nightColor: '#0a0a0c',
          nightText: '#f4f4f5',
          handColor: '#f59e0b',
          handAccent: '#fbbf24',
          cutoutBorder: '#d4af37',
        };
      case 'titanium_stealth':
        return {
          caseBorder: 'from-slate-500/40 via-slate-300/10 to-neutral-950',
          caseShadow: '0 25px 60px -10px rgba(0,0,0,0.95), inset 0 1px 3px rgba(255,255,255,0.2)',
          discBg: '#181b20',
          discAccent: '#222730',
          bezelGrad: 'radial-gradient(circle, #272d37 0%, #191c23 75%, #0f1217 100%)',
          textMain: '#f8fafc',
          textMuted: '#94a3b8',
          goldAccent: '#38bdf8',
          dayColor: '#ffffff',
          dayText: '#0f172a',
          nightColor: '#090d14',
          nightText: '#f8fafc',
          handColor: '#38bdf8',
          handAccent: '#7dd3fc',
          cutoutBorder: '#38bdf8',
        };
      case 'vintage_ivory':
        return {
          caseBorder: 'from-amber-700/40 via-amber-200/30 to-neutral-800',
          caseShadow: '0 20px 50px -10px rgba(0,0,0,0.35), inset 0 2px 5px rgba(255,255,255,0.8)',
          discBg: '#f6f3eb',
          discAccent: '#eae4d5',
          bezelGrad: 'radial-gradient(circle, #fcfaf5 0%, #ede6d6 75%, #ded5c0 100%)',
          textMain: '#1e293b',
          textMuted: '#64748b',
          goldAccent: '#1e3a8a',
          dayColor: '#ffffff',
          dayText: '#1e293b',
          nightColor: '#1e293b',
          nightText: '#f8fafc',
          handColor: '#1e3a8a', // Blued steel
          handAccent: '#2563eb',
          cutoutBorder: '#1e3a8a',
        };
      case 'midnight_astral':
        return {
          caseBorder: 'from-indigo-500/40 via-cyan-400/20 to-neutral-950',
          caseShadow: '0 25px 60px -10px rgba(0,0,0,0.9), inset 0 2px 4px rgba(99,102,241,0.3)',
          discBg: '#090d1c',
          discAccent: '#111833',
          bezelGrad: 'radial-gradient(circle, #151d3b 0%, #0c1226 75%, #050813 100%)',
          textMain: '#e0e7ff',
          textMuted: '#6366f1',
          goldAccent: '#818cf8',
          dayColor: '#f8fafc',
          dayText: '#0f172a',
          nightColor: '#020617',
          nightText: '#cbd5e1',
          handColor: '#a855f7',
          handAccent: '#c084fc',
          cutoutBorder: '#818cf8',
        };
      case 'classic_slate':
      default:
        return {
          caseBorder: 'from-neutral-600/40 via-neutral-400/10 to-neutral-950',
          caseShadow: '0 25px 60px -10px rgba(0,0,0,0.9), inset 0 2px 4px rgba(255,255,255,0.15)',
          discBg: '#121214',
          discAccent: '#1a1a1e',
          bezelGrad: 'radial-gradient(circle, #222226 0%, #151518 75%, #09090b 100%)',
          textMain: '#ffffff',
          textMuted: '#71717a',
          goldAccent: '#e4e4e7',
          dayColor: '#ffffff',
          dayText: '#09090b',
          nightColor: '#09090b',
          nightText: '#f4f4f5',
          handColor: '#ef4444', // Red chronometer hand
          handAccent: '#f87171',
          cutoutBorder: '#ffffff',
        };
    }
  };

  const theme = getThemeStyles();
  const isLight = finish === 'vintage_ivory';

  // Helper for SVG wedge paths
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

  return (
    <div id="aperture-watch-dial" className="relative flex flex-col items-center justify-center select-none w-full max-w-full my-auto">
      {/* Outer Watch Case Bezel - Maximized to Viewport Bounding Box */}
      <div 
        className="relative w-[min(94vw,66dvh,540px)] h-[min(94vw,66dvh,540px)] sm:w-[min(88vw,68dvh,580px)] sm:h-[min(88vw,68dvh,580px)] md:w-[min(76vw,70dvh,640px)] md:h-[min(76vw,70dvh,640px)] lg:w-[min(48vw,74dvh,720px)] lg:h-[min(48vw,74dvh,720px)] xl:w-[min(44vw,78dvh,780px)] xl:h-[min(44vw,78dvh,780px)] aspect-square rounded-full p-2 sm:p-3 md:p-4 flex items-center justify-center transition-all duration-300 flex-shrink-0 mx-auto"
        style={{
          background: theme.bezelGrad,
          boxShadow: theme.caseShadow,
          border: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        {/* Watch Crown at 3 O'clock */}
        <div 
          className="absolute -right-3.5 sm:-right-4 w-4 sm:w-5 h-8 sm:h-10 rounded-r-md border border-neutral-700 shadow-xl"
          style={{
            background: 'linear-gradient(to right, #2a2a2e, #4a4a52, #1a1a1d)'
          }}
        >
          {/* Ridges */}
          <div className="w-full h-full flex flex-col justify-between py-1 px-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-0.5 w-full bg-neutral-900/60" />
            ))}
          </div>
        </div>

        {/* Outer Fixed Bezel Calibration (1..12 Reference Numbers & Minute Batons) */}
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
          <defs>
            {/* Shadow filters for depth */}
            <filter id="cutout-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000000" floodOpacity="0.8" />
            </filter>
            <filter id="hand-shadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000000" floodOpacity="0.75" />
            </filter>
            
            {/* Sun & Moon gradients for Day/Night disc */}
            <radialGradient id="sun-solar-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fffbeb" />
              <stop offset="40%" stopColor="#fde047" />
              <stop offset="85%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </radialGradient>

            <linearGradient id="lunar-crescent-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#eab308" />
            </linearGradient>

            {/* Mask to cut out exactly 30° (1/12th of circle) from the Top Aperture Disc */}
            <mask id="jumping-aperture-mask">
              {/* White area = solid top disc */}
              <rect x="0" y="0" width={size} height={size} fill="white" />
              {/* Black area = the 30° pizza slice opening (cutout) */}
              <path
                d={describeArc(cx, cy, dialRadius + 2, apertureStartAngle, apertureEndAngle)}
                fill="black"
              />
            </mask>
          </defs>

          {/* BASE DIAL SURFACE */}
          <circle cx={cx} cy={cy} r={dialRadius} fill={theme.discBg} />

          {/* ======================================================== */}
          {/* LAYER 1: UNDERNEATH HOUR NUMERAL DISC (Numbers 1 to 12)  */}
          {/* ======================================================== */}
          <g id="layer-hour-numerals">
            {/* Background ring for numerals */}
            <circle 
              cx={cx} 
              cy={cy} 
              r={dialRadius - 2} 
              fill="none" 
              stroke={theme.discAccent} 
              strokeWidth="50" 
              strokeOpacity="0.4"
            />

            {/* 12 Hour positions (12 at top = 0°, 1 = 30°, 2 = 60° ... 11 = 330°) */}
            {Array.from({ length: 12 }).map((_, i) => {
              const hourNum = i === 0 ? 12 : i;
              const angleDeg = i * 30; // 0 for 12, 30 for 1, 60 for 2, etc.
              const isCurrentHour = hourNum === displayHour12;
              
              // Position the numeral in the middle of its 30° quadrant (angleDeg + 15°)
              const textAngleDeg = angleDeg + 15;
              const textRad = ((textAngleDeg - 90) * Math.PI) / 180;
              const numeralRadius = 162; // Between dayNightRadius (112) and dialRadius (220)
              const tx = cx + numeralRadius * Math.cos(textRad);
              const ty = cy + numeralRadius * Math.sin(textRad);

              return (
                <g key={hourNum} opacity={isCurrentHour ? 1 : showXRay ? 0.3 : 0.05}>
                  <text
                    x={tx}
                    y={ty}
                    dominantBaseline="central"
                    textAnchor="middle"
                    fill={isCurrentHour ? theme.goldAccent : theme.textMuted}
                    fontSize={fontSize.toString()}
                    fontWeight="800"
                    style={{ fontFamily: activeFont.fontFamily }}
                    className={`${activeFont.cssClass} tracking-wider transition-all`}
                    filter={isCurrentHour ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))' : undefined}
                  >
                    {hourNum}
                  </text>
                  {/* Subtle radiating delimiter lines between hours on the base disc */}
                  {showXRay && (
                    <line
                      x1={cx + dayNightRadius * Math.cos(((angleDeg - 90) * Math.PI) / 180)}
                      y1={cy + dayNightRadius * Math.sin(((angleDeg - 90) * Math.PI) / 180)}
                      x2={cx + dialRadius * Math.cos(((angleDeg - 90) * Math.PI) / 180)}
                      y2={cy + dialRadius * Math.sin(((angleDeg - 90) * Math.PI) / 180)}
                      stroke={theme.textMuted}
                      strokeWidth="0.8"
                      strokeDasharray="2 2"
                    />
                  )}
                </g>
              );
            })}
          </g>

          {/* ======================================================== */}
          {/* LAYER 2: 24-HOUR CONCENTRIC DAY / NIGHT DISC             */}
          {/* White sector = Sun + Clouds (6 AM to 6 PM)               */}
          {/* Black sector = Moon + Stars (6 PM to 6 AM next morning)  */}
          {/* ======================================================== */}
          <g id="layer-day-night-indicator">
            {/* Split 24-hour rotating celestial disc: rotates with 24-hr day progression */}
            <g transform={`rotate(${dayNightAngle + 15}, ${cx}, ${cy})`}>
              {/* WHITE / DAY HEMISPHERE (6:00 AM to 6:00 PM) */}
              <path
                d={`M ${cx + dayNightRadius} ${cy} A ${dayNightRadius} ${dayNightRadius} 0 0 1 ${cx - dayNightRadius} ${cy} Z`}
                fill={theme.dayColor}
              />

              {/* BLACK / NIGHT HEMISPHERE (6:00 PM to 6:00 AM next morning) */}
              <path
                d={`M ${cx - dayNightRadius} ${cy} A ${dayNightRadius} ${dayNightRadius} 0 0 1 ${cx + dayNightRadius} ${cy} Z`}
                fill={theme.nightColor}
              />

              {/* Outer rim border on day/night disc */}
              <circle
                cx={cx}
                cy={cy}
                r={dayNightRadius}
                fill="none"
                stroke={theme.discAccent}
                strokeWidth="2.5"
              />

              {/* DAY SECTION GRAPHICS (Sun + Clouds) on the White Sector (centered at Noon 180°) */}
              <g id="day-celestial-elements" transform={`translate(${cx}, ${cy + 52})`}>
                {/* Radiant Solar Rays */}
                <g stroke="#d97706" strokeWidth="1.6" strokeLinecap="round" opacity="0.85">
                  <line x1="0" y1="-21" x2="0" y2="-28" />
                  <line x1="0" y1="21" x2="0" y2="28" />
                  <line x1="-21" y1="0" x2="-28" y2="0" />
                  <line x1="21" y1="0" x2="28" y2="0" />
                  <line x1="-15" y1="-15" x2="-20" y2="-20" />
                  <line x1="15" y1="-15" x2="20" y2="-20" />
                  <line x1="-15" y1="15" x2="-20" y2="20" />
                  <line x1="15" y1="15" x2="20" y2="20" />
                </g>

                {/* Sun Core Disc */}
                <circle cx="0" cy="0" r="14" fill="url(#sun-solar-grad)" stroke="#d97706" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="10" fill="#f59e0b" opacity="0.9" />

                {/* Cloud 1: Floating across the left/lower solar horizon */}
                <g transform="translate(-18, 6)" opacity="0.92">
                  <path
                    d="M -12 6 C -15 6 -17 3.5 -17 0.5 C -17 -2.5 -14.5 -5 -11.5 -5 C -10.5 -8 -7.5 -10 -4 -10 C 1 -10 4.5 -7 5.5 -4 C 7 -4 9 -2 9 0.5 C 9 3.5 6.5 6 3.5 6 Z"
                    fill="#e2e8f0"
                    stroke="#94a3b8"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M -9 3 C -11 3 -12 1.5 -12 0 C -12 -1.5 -10.5 -2.5 -8.5 -2.5 C -7.5 -4.5 -5.5 -6 -3 -6 C 0.5 -6 3 -4 3.5 -2 C 4.5 -2 6 -0.5 6 1 Z"
                    fill="#ffffff"
                    opacity="0.8"
                  />
                </g>

                {/* Cloud 2: Wispy companion cloud to the upper right */}
                <g transform="translate(16, -10)" opacity="0.85">
                  <path
                    d="M -8 4 C -10 4 -12 2.5 -12 0.5 C -12 -1.5 -10 -3 -8 -3 C -7 -5 -5 -6.5 -2.5 -6.5 C 1 -6.5 3 -4.5 4 -2.5 C 5 -2.5 6.5 -1 6.5 0.5 C 6.5 2.5 5 4 3 4 Z"
                    fill="#f1f5f9"
                    stroke="#94a3b8"
                    strokeWidth="1.1"
                  />
                </g>
              </g>

              {/* NIGHT SECTION GRAPHICS (Moon + Stars) on the Black Sector (centered at Midnight 0°) */}
              <g id="night-celestial-elements" transform={`translate(${cx}, ${cy - 52})`}>
                {/* Crescent Moon */}
                <path
                  d="M -5 -18 A 18 18 0 1 0 17 11 A 15 15 0 0 1 -5 -18 Z"
                  fill="url(#lunar-crescent-grad)"
                  stroke="#fde047"
                  strokeWidth="1.4"
                  filter="drop-shadow(0 0 6px rgba(253, 224, 71, 0.45))"
                />

                {/* Twinkling Starburst 1 (4-Point Diamond Sparkle) */}
                <g transform="translate(16, -14)">
                  <path d="M 0 -7 L 1.5 -1.5 L 7 0 L 1.5 1.5 L 0 7 L -1.5 1.5 L -7 0 L -1.5 -1.5 Z" fill="#fef08a" opacity="0.95" />
                </g>

                {/* Twinkling Starburst 2 */}
                <g transform="translate(-16, -10)">
                  <path d="M 0 -5 L 1.2 -1.2 L 5 0 L 1.2 1.2 L 0 5 L -1.2 1.2 L -5 0 L -1.2 -1.2 Z" fill="#ffffff" opacity="0.9" />
                </g>

                {/* Twinkling Starburst 3 */}
                <g transform="translate(-14, 14)">
                  <path d="M 0 -4 L 1 -1 L 4 0 L 1 1 L 0 4 L -1 1 L -4 0 L -1 -1 Z" fill="#fef9c3" opacity="0.85" />
                </g>

                {/* Scattered Astral Star Pips */}
                <circle cx="20" cy="5" r="1.5" fill="#ffffff" opacity="0.9" />
                <circle cx="-6" cy="22" r="1.3" fill="#fef08a" opacity="0.8" />
                <circle cx="8" cy="-22" r="1.1" fill="#ffffff" opacity="0.95" />
                <circle cx="-22" cy="4" r="1.4" fill="#ffffff" opacity="0.8" />
                <circle cx="5" cy="18" r="1" fill="#fde047" opacity="0.75" />
              </g>
            </g>

            {/* Inner bevel edge on day/night disc */}
            <circle
              cx={cx}
              cy={cy}
              r={dayNightRadius - 2}
              fill="none"
              stroke={isNight ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.12)'}
              strokeWidth="1.5"
            />
          </g>

          {/* ======================================================== */}
          {/* LAYER 3: TOP MASK DISC WITH 1/12th CUTOUT PIZZA SLICE    */}
          {/* ======================================================== */}
          {/* Solid opaque circular disc covering the face, masked with the jumping 30° cutout */}
          <g id="layer-aperture-mask-disc">
            <circle
              cx={cx}
              cy={cy}
              r={dialRadius}
              fill={theme.discBg}
              mask="url(#jumping-aperture-mask)"
              opacity={showXRay ? 0.7 : 1}
            />

            {/* Decorative Engine-turned / Radial Grain Texture on Top Disc */}
            <circle
              cx={cx}
              cy={cy}
              r={dialRadius}
              fill="none"
              stroke={theme.discAccent}
              strokeWidth="0.5"
              strokeDasharray="2 4"
              mask="url(#jumping-aperture-mask)"
            />
            <circle
              cx={cx}
              cy={cy}
              r={dialRadius - 35}
              fill="none"
              stroke={theme.discAccent}
              strokeWidth="0.5"
              strokeDasharray="1 3"
              mask="url(#jumping-aperture-mask)"
            />

            {/* Inscriptions on Top Disc */}
            <g mask="url(#jumping-aperture-mask)" className="pointer-events-none">
              <text
                x={cx}
                y={cy + 62}
                textAnchor="middle"
                fill={theme.textMuted}
                fontSize="7.5"
                fontWeight="700"
                letterSpacing="2.5"
                className="font-cinzel opacity-75"
              >
                APERTURE JUMP-HOUR
              </text>
              <text
                x={cx}
                y={cy + 74}
                textAnchor="middle"
                fill={theme.textMuted}
                fontSize="6"
                fontWeight="600"
                letterSpacing="1.2"
                className="font-space opacity-50"
              >
                360° RELATIVE MINUTE HORIZON
              </text>
              {cityName && (
                <text
                  x={cx}
                  y={cy + 86}
                  textAnchor="middle"
                  fill={theme.goldAccent}
                  fontSize="6.5"
                  fontWeight="700"
                  letterSpacing="1.5"
                  className="font-space opacity-85"
                >
                  {cityName.toUpperCase()}
                </text>
              )}
            </g>

            {/* Luminous High-Precision Bevel Edges along the Cutout Opening */}
            {/* Left Edge: Aligned with current hour (e.g. 12:00 = 0°, 4:00 = 120°) */}
            {(() => {
              const leftRad = ((apertureStartAngle - 90) * Math.PI) / 180;
              const lx = cx + dialRadius * Math.cos(leftRad);
              const ly = cy + dialRadius * Math.sin(leftRad);

              const rightRad = ((apertureEndAngle - 90) * Math.PI) / 180;
              const rx = cx + dialRadius * Math.cos(rightRad);
              const ry = cy + dialRadius * Math.sin(rightRad);

              return (
                <g id="cutout-bevel-borders" filter="url(#cutout-shadow)">
                  {/* Left Edge Line (Start of minute count) */}
                  <line
                    x1={cx}
                    y1={cy}
                    x2={lx}
                    y2={ly}
                    stroke={theme.cutoutBorder}
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                  {/* Right Edge Line (End of 30° cutout) */}
                  <line
                    x1={cx}
                    y1={cy}
                    x2={rx}
                    y2={ry}
                    stroke={theme.cutoutBorder}
                    strokeWidth="1.2"
                    strokeOpacity="0.8"
                    strokeLinecap="round"
                  />
                  {/* Outer curved boundary of the cutout */}
                  <path
                    d={`M ${lx} ${ly} A ${dialRadius} ${dialRadius} 0 0 1 ${rx} ${ry}`}
                    fill="none"
                    stroke={theme.cutoutBorder}
                    strokeWidth="1.5"
                  />
                  {/* Step boundary between Day/Night inner disc & Hour Numeral outer ring */}
                  {(() => {
                    const dlx = cx + dayNightRadius * Math.cos(leftRad);
                    const dly = cy + dayNightRadius * Math.sin(leftRad);
                    const drx = cx + dayNightRadius * Math.cos(rightRad);
                    const dry = cy + dayNightRadius * Math.sin(rightRad);
                    return (
                      <path
                        d={`M ${dlx} ${dly} A ${dayNightRadius} ${dayNightRadius} 0 0 1 ${drx} ${dry}`}
                        fill="none"
                        stroke={theme.cutoutBorder}
                        strokeWidth="1"
                        strokeDasharray="2 2"
                        strokeOpacity="0.6"
                      />
                    );
                  })()}
                </g>
              );
            })()}
          </g>

          {/* ======================================================== */}
          {/* OUTER BEZEL GRADUATIONS & ROTATING 5-MIN RELATIVE SCALE  */}
          {/* (Replaces static 1-12 with rotating 5-min increments)    */}
          {/* ======================================================== */}
          <g id="outer-bezel-indices">
            {/* Fixed 60-division Precision Minute Batons on the Bezel Track */}
            {Array.from({ length: 60 }).map((_, i) => {
              const is5Min = i % 5 === 0;
              const is15Min = i % 15 === 0;
              const angleDeg = i * 6;
              const rad = ((angleDeg - 90) * Math.PI) / 180;

              const rInner = is15Min ? dialRadius - 15 : is5Min ? dialRadius - 11 : dialRadius - 7;
              const rOuter = dialRadius - 1;

              const x1 = cx + rInner * Math.cos(rad);
              const y1 = cy + rInner * Math.sin(rad);
              const x2 = cx + rOuter * Math.cos(rad);
              const y2 = cy + rOuter * Math.sin(rad);

              return (
                <line
                  key={`bezel-tick-${i}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={is15Min ? theme.goldAccent : theme.textMain}
                  strokeWidth={is15Min ? 2.8 : is5Min ? 2.0 : 1.4}
                  strokeOpacity={is15Min ? 1.0 : is5Min ? 0.9 : 0.65}
                  strokeLinecap="round"
                />
              );
            })}

            {/* ROTATING 5-MINUTE RELATIVE NUMERALS (5..60) ON OUTER EDGE */}
            {showRelativeMinuteLabels && (
              <g id="outer-rotating-5min-scale">
                {[5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60].map((relMin) => {
                  // Angle rotates dynamically with the aperture disc (relative to left edge)
                  const relAngleDeg = (apertureStartAngle + (relMin / 60) * 360) % 360;
                  const relRad = ((relAngleDeg - 90) * Math.PI) / 180;

                  const isQuarter = relMin % 15 === 0;
                  const isHalf = relMin === 30;

                  // Outer edge position (just outside dial radius in bezel ring)
                  const numR = dialRadius + 18;
                  const nx = cx + numR * Math.cos(relRad);
                  const ny = cy + numR * Math.sin(relRad);

                  // Outer alignment pip at bezel boundary
                  const pipR = dialRadius + 4;
                  const px = cx + pipR * Math.cos(relRad);
                  const py = cy + pipR * Math.sin(relRad);

                  return (
                    <g key={`rot-min-${relMin}`}>
                      {/* Pip Indicator */}
                      <circle
                        cx={px}
                        cy={py}
                        r={isHalf ? 2.5 : isQuarter ? 2 : 1.2}
                        fill={isHalf ? theme.handAccent : isQuarter ? theme.goldAccent : theme.handColor}
                        opacity={isHalf ? 1 : isQuarter ? 0.85 : 0.5}
                      />

                      {/* Numerals (5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60) styled with activeOuterFont and outerFontSize */}
                      <text
                        x={nx}
                        y={ny}
                        dominantBaseline="central"
                        textAnchor="middle"
                        fill={isHalf ? theme.handAccent : isQuarter ? theme.goldAccent : theme.textMain}
                        fontSize={
                          isHalf
                            ? (outerFontSize * 1.25).toFixed(1)
                            : isQuarter
                            ? (outerFontSize * 1.1).toFixed(1)
                            : outerFontSize.toFixed(1)
                        }
                        fontWeight={isHalf ? "800" : isQuarter ? "700" : "600"}
                        style={{ fontFamily: activeOuterFont.fontFamily }}
                        className={`${activeOuterFont.cssClass} tracking-tight transition-all`}
                        opacity={isHalf ? 1 : isQuarter ? 0.95 : 0.8}
                        filter={isHalf ? 'drop-shadow(0 1px 3px rgba(0,0,0,0.6))' : undefined}
                      >
                        {relMin}
                      </text>
                    </g>
                  );
                })}
              </g>
            )}
          </g>

          {/* ======================================================== */}
          {/* LAYER 4: RELATIVE MINUTE HAND                            */}
          {/* Count begins from the left edge of the cutout            */}
          {/* ======================================================== */}
          <g 
            id="layer-minute-hand" 
            transform={`rotate(${minuteHandAngle} ${cx} ${cy})`}
            filter="url(#hand-shadow)"
          >
            {/* Counterweight */}
            <circle cx={cx} cy={cy + 36} r="5" fill={theme.handColor} stroke={theme.discBg} strokeWidth="1.5" />
            <line x1={cx} y1={cy + 42} x2={cx} y2={cy - 200} stroke={theme.handColor} strokeWidth="2.5" strokeLinecap="round" />

            {/* Precision Diamond / Arrowhead Tip at Minute Hand */}
            <polygon
              points={`${cx - 5.5},${cy - 180} ${cx},${cy - 208} ${cx + 5.5},${cy - 180} ${cx},${cy - 186}`}
              fill={theme.handAccent}
              stroke={theme.discBg}
              strokeWidth="0.8"
            />
            {/* Luminous Inner Infill */}
            <line x1={cx} y1={cy - 30} x2={cx} y2={cy - 175} stroke="#ffffff" strokeWidth="1" strokeOpacity="0.85" />
          </g>

          {/* ======================================================== */}
          {/* OPTIONAL SECONDS SWEEP INDICATOR                         */}
          {/* ======================================================== */}
          {showSeconds && (
            <g id="layer-seconds-hand" transform={`rotate(${secondsAngle} ${cx} ${cy})`}>
              <line x1={cx} y1={cy + 25} x2={cx} y2={cy - 212} stroke="#ef4444" strokeWidth="1" strokeLinecap="round" />
              <circle cx={cx} cy={cy - 150} r="3" fill="#ef4444" />
            </g>
          )}

          {/* Center Jewel / Pinion Cap */}
          <circle cx={cx} cy={cy} r="9" fill={theme.caseBorder} stroke="#000000" strokeWidth="2" />
          <circle cx={cx} cy={cy} r="6" fill={theme.goldAccent} />
          <circle cx={cx} cy={cy} r="2.5" fill="#ef4444" />
        </svg>
      </div>
    </div>
  );
};
