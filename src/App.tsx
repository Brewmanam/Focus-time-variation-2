import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ApertureClock } from './components/ApertureClock';
import { TypographyInspector, ApertureTypographyPanel, OuterRingTypographyPanel } from './components/TypographyInspector';
import { VerticalScrubber } from './components/VerticalScrubber';
import { ExplodedLayersView } from './components/ExplodedLayersView';
import { MechanismDiagram } from './components/MechanismDiagram';
import { Controls } from './components/Controls';
import { TimezoneSelector } from './components/TimezoneSelector';
import { TimeState, ThemeFinish, DisplayView, PresetTime, CityTimezone, ApertureFontId } from './types';
import { audio } from './utils/audio';
import { CITIES, getTimeInTimezone, detectLocationFromIP, getUtcOffsetString } from './data/timezones';
import { Clock, Compass, Layers, RotateCcw, ShieldCheck, Sparkles, MapPin, ChevronDown, Check, Palette } from 'lucide-react';

export default function App() {
  const [isLive, setIsLive] = useState<boolean>(true);
  const [view, setView] = useState<DisplayView>('dial');
  const [finish, setFinish] = useState<ThemeFinish>('obsidian_gold');
  const [speed, setSpeed] = useState<number>(1);
  const [showSeconds, setShowSeconds] = useState<boolean>(true);
  const [showRelativeMinuteLabels, setShowRelativeMinuteLabels] = useState<boolean>(true);
  const [showXRay, setShowXRay] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Aperture Typography Study State
  const [selectedFontId, setSelectedFontId] = useState<ApertureFontId>('cinzel');
  const [fontSize, setFontSize] = useState<number>(24);

  // Outer Edge Ring Typography Study State
  const [outerFontId, setOuterFontId] = useState<ApertureFontId>('space');
  const [outerFontSize, setOuterFontSize] = useState<number>(11);

  // Timezone & Location state
  const initialLocalTz = typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'UTC';
  const initialCityMatch = CITIES.find(c => c.timeZone === initialLocalTz);
  const [selectedTimezone, setSelectedTimezone] = useState<string>(initialLocalTz);
  const [selectedCityName, setSelectedCityName] = useState<string>(
    initialCityMatch ? initialCityMatch.name : (initialLocalTz.split('/').pop()?.replace(/_/g, ' ') || 'Local')
  );
  const [isDetectingIP, setIsDetectingIP] = useState<boolean>(false);
  const [detectedInfo, setDetectedInfo] = useState<{
    city: string;
    country?: string;
    timeZone: string;
    isFromIP: boolean;
  } | null>(null);

  // Focus Time Variation Dropdown Menu State
  const [isVariationMenuOpen, setIsVariationMenuOpen] = useState<boolean>(false);
  const variationDropdownRef = useRef<HTMLDivElement>(null);

  // Close variation menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (variationDropdownRef.current && !variationDropdownRef.current.contains(e.target as Node)) {
        setIsVariationMenuOpen(false);
      }
    };
    if (isVariationMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isVariationMenuOpen]);

  const WATCH_VARIATIONS: { id: ThemeFinish; name: string; tag: string; desc: string; accent: string; fontId: ApertureFontId }[] = [
    {
      id: 'obsidian_gold',
      name: 'Obsidian & 18K Gold',
      tag: 'CLASSIC HOROLOGY',
      desc: 'Sunray brushed radial dial with polished 18K gold bezel, gold minute needle & day/night disc.',
      accent: '#d4af37',
      fontId: 'cinzel'
    },
    {
      id: 'titanium_stealth',
      name: 'Industrial Skeleton / Titanium',
      tag: 'X-RAY MECHANICAL',
      desc: 'Satin brushed aerospace titanium with electric blue accents and high-visibility luminescence.',
      accent: '#38bdf8',
      fontId: 'space'
    },
    {
      id: 'classic_slate',
      name: 'Bauhaus Minimalist',
      tag: 'MODERNIST CONTRAST',
      desc: 'High-contrast monochrome slate and crisp white finish with red Bauhaus second hand.',
      accent: '#ef4444',
      fontId: 'syne'
    },
    {
      id: 'midnight_astral',
      name: 'Celestial Galaxy / Astral',
      tag: 'ASTRONOMICAL HORIZON',
      desc: 'Deep cosmic indigo & cyan gradient dial reflecting midnight starlight and lunar phase transitions.',
      accent: '#818cf8',
      fontId: 'orbitron'
    },
    {
      id: 'vintage_ivory',
      name: 'Vintage Ivory & Blued Steel',
      tag: 'HERITAGE CHRONOMETER',
      desc: 'Warm enamel porcelain ivory dial with heat-blued steel hands and Parisian typography.',
      accent: '#1e3a8a',
      fontId: 'bodoni'
    }
  ];

  // User manual city selection ref to prevent IP detection race conditions
  const hasUserSelectedCityRef = useRef<boolean>(false);
  const selectedTimezoneRef = useRef<string>(selectedTimezone);
  selectedTimezoneRef.current = selectedTimezone;

  // Initialize time with chosen timezone
  const getNowState = useCallback((tz: string = selectedTimezone): TimeState => {
    return getTimeInTimezone(tz, new Date());
  }, [selectedTimezone]);

  const [timeState, setTimeState] = useState<TimeState>(() => getNowState(selectedTimezone));
  const [baseHour, setBaseHour] = useState<number>(timeState.hours);
  const [sliderMinutes, setSliderMinutes] = useState<number>(timeState.minutes);

  const simulatedTimeRef = useRef<{ h: number; m: number; s: number; ms: number }>({
    h: timeState.hours,
    m: timeState.minutes,
    s: timeState.seconds,
    ms: 0,
  });

  // Auto-detect IP on initial boot
  const handleAutoDetectIP = useCallback(async () => {
    setIsDetectingIP(true);
    try {
      const info = await detectLocationFromIP();
      if (info && info.timeZone) {
        setDetectedInfo(info);
        // Only override if user has not manually picked a city
        if (!hasUserSelectedCityRef.current) {
          setSelectedTimezone(info.timeZone);
          setSelectedCityName(info.city);

          // Update current time to the detected location
          const updated = getTimeInTimezone(info.timeZone, new Date());
          setTimeState(updated);
          setBaseHour(updated.hours);
          setSliderMinutes(updated.minutes);
          simulatedTimeRef.current = {
            h: updated.hours,
            m: updated.minutes,
            s: updated.seconds,
            ms: updated.milliseconds,
          };
        }
      }
    } catch (e) {
      console.error('IP Detection Error:', e);
    } finally {
      setIsDetectingIP(false);
    }
  }, []);

  useEffect(() => {
    handleAutoDetectIP();
  }, [handleAutoDetectIP]);

  // Handle city / timezone change from dropdown
  const handleSelectCity = (city: CityTimezone | { timeZone: string; name: string; country?: string; flag?: string }) => {
    hasUserSelectedCityRef.current = true;
    setSelectedTimezone(city.timeZone);
    selectedTimezoneRef.current = city.timeZone;
    setSelectedCityName(city.name);
    setIsLive(true);
    setSpeed(1);

    const updated = getTimeInTimezone(city.timeZone, new Date());
    setTimeState(updated);
    setBaseHour(updated.hours);
    setSliderMinutes(updated.minutes);
    simulatedTimeRef.current = {
      h: updated.hours,
      m: updated.minutes,
      s: updated.seconds,
      ms: updated.milliseconds,
    };
    if (!isMuted) {
      audio.playJumpHour();
    }
  };

  // Real-time continuous animation loop
  useEffect(() => {
    let animId: number;
    let lastTimestamp = performance.now();

    const loop = (nowTimestamp: number) => {
      const deltaMs = Math.min(100, nowTimestamp - lastTimestamp);
      lastTimestamp = nowTimestamp;

      if (isLive) {
        // Continuously tick and keep live time running in the selected timezone
        const current = getTimeInTimezone(selectedTimezoneRef.current, new Date());
        setTimeState(current);
        simulatedTimeRef.current = {
          h: current.hours,
          m: current.minutes,
          s: current.seconds,
          ms: current.milliseconds,
        };
      } else if (speed > 1) {
        // Fast-forward simulation
        const sim = simulatedTimeRef.current;
        sim.ms += deltaMs * speed;
        while (sim.ms >= 1000) {
          sim.ms -= 1000;
          sim.s += 1;
          if (sim.s >= 60) {
            sim.s = 0;
            sim.m += 1;
            if (sim.m >= 60) {
              sim.m = 0;
              sim.h = (sim.h + 1) % 24;
            }
          }
        }

        const isPM = sim.h >= 12;
        const displayHour12 = sim.h % 12 === 0 ? 12 : sim.h % 12;
        const isNight = sim.h >= 18 || sim.h < 6;

        setTimeState({
          hours: sim.h,
          minutes: sim.m,
          seconds: sim.s,
          milliseconds: Math.floor(sim.ms),
          isPM,
          displayHour12,
          isNight,
        });
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isLive, speed, selectedTimezone]);

  // Handle manual scrub
  const handleTimeChange = (h: number, m: number, s: number) => {
    let totalMinutesInDay = h * 60 + m;
    if (totalMinutesInDay < 0) totalMinutesInDay = (totalMinutesInDay % 1440) + 1440;
    totalMinutesInDay = totalMinutesInDay % 1440;

    const normalizedHour = Math.floor(totalMinutesInDay / 60) % 24;
    const normalizedMinute = totalMinutesInDay % 60;

    const isPM = normalizedHour >= 12;
    const displayHour12 = normalizedHour % 12 === 0 ? 12 : normalizedHour % 12;
    const isNight = normalizedHour >= 18 || normalizedHour < 6;

    simulatedTimeRef.current = { h: normalizedHour, m: normalizedMinute, s: s || 0, ms: 0 };
    setTimeState({
      hours: normalizedHour,
      minutes: normalizedMinute,
      seconds: s || 0,
      milliseconds: 0,
      isPM,
      displayHour12,
      isNight,
    });
  };

  // Handle scrubber movement across 0-120 minutes from vertical panel
  const handleScrub = (startH: number, mins: number) => {
    setIsLive(false);
    const addedH = Math.floor(mins / 60);
    const effMinute = mins % 60;
    const effHour = (startH + addedH) % 24;
    handleTimeChange(effHour, effMinute, timeState.seconds);
  };

  // Recalibrate / Reset to current real time in selected timezone
  const handleRecalibrate = () => {
    const current = getNowState(selectedTimezone);
    setIsLive(true);
    setSpeed(1);
    setBaseHour(current.hours);
    setSliderMinutes(current.minutes);
    simulatedTimeRef.current = {
      h: current.hours,
      m: current.minutes,
      s: current.seconds,
      ms: current.milliseconds,
    };
    setTimeState(current);
    if (!isMuted) {
      audio.playJumpHour();
    }
  };

  const handleSelectPreset = (preset: PresetTime) => {
    setIsLive(false);
    setBaseHour(preset.hour);
    setSliderMinutes(preset.minute);
    handleTimeChange(preset.hour, preset.minute, preset.second);
  };

  const utcOffset = getUtcOffsetString(selectedTimezone);

  return (
    <main className="min-h-screen w-full bg-neutral-950 text-neutral-100 flex flex-col justify-between p-2 sm:p-4 selection:bg-amber-500/30 selection:text-amber-200 relative overflow-x-hidden">
      {/* Subtle ambient lighting */}
      <div className="fixed inset-0 pointer-events-none opacity-40 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(245,158,11,0.15),rgba(0,0,0,0))]" />

      {/* Floating Minimal HUD: City & Timezone Bar + Live/Recalibrate Pill */}
      <header className="w-full max-w-7xl mx-auto flex items-center justify-between gap-2 z-30 flex-shrink-0 px-2 py-1 relative">
        {/* Interactive Focus Time Header & Variations Picker */}
        <div ref={variationDropdownRef} className="relative">
          <button
            onClick={() => setIsVariationMenuOpen(!isVariationMenuOpen)}
            className="flex items-center space-x-2.5 px-2.5 py-1.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-850 border border-neutral-800 hover:border-amber-500/50 text-neutral-100 transition-all cursor-pointer shadow-sm group select-none text-left"
            title="Click to explore and switch watch variations"
          >
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0 group-hover:scale-105 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center space-x-1.5">
                <span className="text-sm font-space font-bold text-neutral-100 tracking-tight whitespace-nowrap group-hover:text-amber-300 transition-colors">
                  Focus Time
                </span>
                <span className="text-[10px] font-mono-code px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 font-semibold uppercase">
                  {WATCH_VARIATIONS.find(v => v.id === finish)?.name.split(' ')[0] || 'EDITION'}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 group-hover:text-amber-400 transition-transform duration-200 ${isVariationMenuOpen ? 'rotate-180' : ''}`} />
              </div>
              <div className="flex items-center space-x-1.5 text-[10px] font-mono-code text-neutral-400 truncate">
                <MapPin className="w-2.5 h-2.5 text-amber-400 flex-shrink-0" />
                <span className="text-neutral-300 font-medium truncate max-w-[90px] sm:max-w-[140px]">{selectedCityName}</span>
                <span className="text-neutral-500">•</span>
                <span className="text-amber-400/90 font-medium">{utcOffset}</span>
              </div>
            </div>
          </button>

          {/* Variations Dropdown Popover */}
          {isVariationMenuOpen && (
            <div className="absolute top-full left-0 mt-2 w-[310px] sm:w-[360px] p-2.5 rounded-2xl bg-neutral-900/95 border border-neutral-700 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between px-2 pb-2 mb-1.5 border-b border-neutral-800">
                <div className="flex items-center space-x-1.5 text-xs font-space font-bold text-neutral-200 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Choose Watch Variation</span>
                </div>
                <span className="text-[10px] font-mono-code text-neutral-400">5 Editions</span>
              </div>

              <div className="space-y-1.5 max-h-[340px] overflow-y-auto pr-1">
                {WATCH_VARIATIONS.map((v) => {
                  const isSelected = finish === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => {
                        setFinish(v.id);
                        setSelectedFontId(v.fontId);
                        setIsVariationMenuOpen(false);
                        audio.playJumpHour();
                      }}
                      className={`w-full p-2.5 rounded-xl text-left transition-all cursor-pointer flex items-start space-x-3 ${
                        isSelected
                          ? 'bg-neutral-800 border border-amber-500/80 shadow-md ring-1 ring-amber-500/20'
                          : 'bg-neutral-950/60 border border-neutral-800/80 hover:bg-neutral-800/60 hover:border-neutral-700'
                      }`}
                    >
                      <div
                        className="w-4 h-4 rounded-full border border-neutral-600 mt-0.5 flex-shrink-0 flex items-center justify-center shadow-sm"
                        style={{ backgroundColor: v.accent }}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-space font-bold ${isSelected ? 'text-amber-300' : 'text-neutral-100'}`}>
                            {v.name}
                          </span>
                          <span className="text-[9px] font-mono-code px-1.5 py-0.2 rounded bg-neutral-900 text-neutral-400 border border-neutral-800 font-semibold uppercase">
                            {v.tag}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400 font-sans mt-0.5 line-clamp-2 leading-relaxed">
                          {v.desc}
                        </p>
                      </div>

                      {isSelected && (
                        <Check className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Location Dropdown & Live Reset */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <TimezoneSelector
            selectedTimezone={selectedTimezone}
            selectedCityName={selectedCityName}
            onSelectCity={handleSelectCity}
            onAutoDetectIP={handleAutoDetectIP}
            isDetectingIP={isDetectingIP}
            detectedInfo={detectedInfo}
          />

          <button
            onClick={handleRecalibrate}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer shadow-sm text-xs font-mono-code ${
              isLive
                ? 'bg-neutral-900/90 border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/60 font-semibold'
            }`}
            title="Reset watch to current live time in active city"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isLive ? 'text-emerald-400' : 'text-amber-400 animate-spin'}`} style={{ animationDuration: '4s' }} />
            <span className="hidden sm:inline">{isLive ? 'LIVE' : 'RESUME'}</span>
          </button>
        </div>
      </header>

      {/* Main Display Stage: Maximized Viewport Box with Flanking Side Panels */}
      <section className="w-full flex-1 flex items-center justify-center z-10 px-2 py-2 sm:py-3">
        {view === 'dial' && (
          <div className="w-full flex flex-col lg:flex-row items-center justify-center lg:justify-between max-w-7xl mx-auto gap-4 lg:gap-6">
            {/* Left Side Wing: Aperture Hour (1–12) Font Settings */}
            <div className="w-full sm:w-auto max-w-sm lg:max-w-none flex justify-center order-2 lg:order-1 flex-shrink-0 z-20">
              <ApertureTypographyPanel
                selectedFontId={selectedFontId}
                onSelectFontId={setSelectedFontId}
                fontSize={fontSize}
                onSelectFontSize={setFontSize}
              />
            </div>

            {/* Center: Maximized Watch Stage Bounding Box */}
            <div className="flex-1 flex items-center justify-center order-1 lg:order-2 w-full py-1">
              <ApertureClock
                timeState={timeState}
                finish={finish}
                showSeconds={showSeconds}
                showRelativeMinuteLabels={showRelativeMinuteLabels}
                showXRay={showXRay}
                cityName={selectedCityName}
                timeZone={selectedTimezone}
                selectedFontId={selectedFontId}
                fontSize={fontSize}
                outerFontId={outerFontId}
                outerFontSize={outerFontSize}
              />
            </div>

            {/* Right Side Wing: Outer Ring (5–60) Minute Font Settings */}
            <div className="w-full sm:w-auto max-w-sm lg:max-w-none flex justify-center order-3 lg:order-3 flex-shrink-0 z-20">
              <OuterRingTypographyPanel
                outerFontId={outerFontId}
                onSelectOuterFontId={setOuterFontId}
                outerFontSize={outerFontSize}
                onSelectOuterFontSize={setOuterFontSize}
              />
            </div>
          </div>
        )}

        {view === 'exploded' && (
          <div className="w-full flex flex-col items-center space-y-4 max-h-full overflow-y-auto">
            <TypographyInspector
              selectedFontId={selectedFontId}
              onSelectFontId={setSelectedFontId}
              fontSize={fontSize}
              onSelectFontSize={setFontSize}
              outerFontId={outerFontId}
              onSelectOuterFontId={setOuterFontId}
              outerFontSize={outerFontSize}
              onSelectOuterFontSize={setOuterFontSize}
            />
            <ExplodedLayersView
              timeState={timeState}
              finish={finish}
              selectedFontId={selectedFontId}
              fontSize={fontSize}
            />
          </div>
        )}

        {view === 'principles' && (
          <div className="w-full max-h-full overflow-y-auto">
            <MechanismDiagram
              onSelectPreset={handleSelectPreset}
            />
          </div>
        )}
      </section>

      {/* Bottom Ultra-Slim Scrubber */}
      <footer className="w-full max-w-5xl mx-auto z-20 flex-shrink-0 pb-1">
        <VerticalScrubber
          timeState={timeState}
          isLive={isLive}
          onRecalibrate={handleRecalibrate}
          baseHour={baseHour}
          setBaseHour={setBaseHour}
          sliderMinutes={sliderMinutes}
          setSliderMinutes={setSliderMinutes}
          onScrub={handleScrub}
          isMuted={isMuted}
          setIsMuted={setIsMuted}
          cityName={selectedCityName}
          timeZone={selectedTimezone}
        />
      </footer>
    </main>
  );
}

