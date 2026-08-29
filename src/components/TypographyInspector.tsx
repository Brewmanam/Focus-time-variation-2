import React, { useState, useRef, useEffect } from 'react';
import { 
  Type, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown, 
  Sparkles, 
  Check, 
  Gauge,
  Plus,
  Minus,
  Maximize2
} from 'lucide-react';
import { ApertureFontId } from '../types';
import { APERTURE_FONTS, FONT_SIZES, OUTER_FONT_SIZES } from '../data/fonts';

interface AperturePanelProps {
  selectedFontId: ApertureFontId;
  onSelectFontId: (id: ApertureFontId) => void;
  fontSize: number;
  onSelectFontSize: (size: number) => void;
  compact?: boolean;
}

interface OuterRingPanelProps {
  outerFontId: ApertureFontId;
  onSelectOuterFontId: (id: ApertureFontId) => void;
  outerFontSize: number;
  onSelectOuterFontSize: (size: number) => void;
  compact?: boolean;
}

export interface TypographyInspectorProps {
  selectedFontId: ApertureFontId;
  onSelectFontId: (id: ApertureFontId) => void;
  fontSize: number;
  onSelectFontSize: (size: number) => void;
  outerFontId: ApertureFontId;
  onSelectOuterFontId: (id: ApertureFontId) => void;
  outerFontSize: number;
  onSelectOuterFontSize: (size: number) => void;
}

/**
 * Left Side Wing: Aperture Hour Numerals (1–12) Settings Panel
 */
export const ApertureTypographyPanel: React.FC<AperturePanelProps> = ({
  selectedFontId,
  onSelectFontId,
  fontSize,
  onSelectFontSize,
  compact = false,
}) => {
  const [isFontDropdownOpen, setIsFontDropdownOpen] = useState<boolean>(false);
  const [isSizeDropdownOpen, setIsSizeDropdownOpen] = useState<boolean>(false);
  const fontDropdownRef = useRef<HTMLDivElement>(null);
  const sizeDropdownRef = useRef<HTMLDivElement>(null);

  const currentFontIndex = APERTURE_FONTS.findIndex(f => f.id === selectedFontId);
  const currentFont = APERTURE_FONTS[currentFontIndex >= 0 ? currentFontIndex : 0];
  const currentSizeIndex = FONT_SIZES.indexOf(fontSize);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (fontDropdownRef.current && !fontDropdownRef.current.contains(target)) {
        setIsFontDropdownOpen(false);
      }
      if (sizeDropdownRef.current && !sizeDropdownRef.current.contains(target)) {
        setIsSizeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePrevFont = () => {
    const prevIdx = (currentFontIndex - 1 + APERTURE_FONTS.length) % APERTURE_FONTS.length;
    onSelectFontId(APERTURE_FONTS[prevIdx].id);
  };

  const handleNextFont = () => {
    const nextIdx = (currentFontIndex + 1) % APERTURE_FONTS.length;
    onSelectFontId(APERTURE_FONTS[nextIdx].id);
  };

  const handlePrevSize = () => {
    if (currentSizeIndex > 0) {
      onSelectFontSize(FONT_SIZES[currentSizeIndex - 1]);
    } else if (currentSizeIndex === -1 && fontSize > FONT_SIZES[0]) {
      onSelectFontSize(fontSize - 4);
    }
  };

  const handleNextSize = () => {
    if (currentSizeIndex < FONT_SIZES.length - 1 && currentSizeIndex !== -1) {
      onSelectFontSize(FONT_SIZES[currentSizeIndex + 1]);
    } else if (currentSizeIndex === -1 && fontSize < FONT_SIZES[FONT_SIZES.length - 1]) {
      onSelectFontSize(fontSize + 4);
    }
  };

  // Quick preset sizes for jumping directly to room-scale visibility
  const quickSizes = [24, 36, 48, 64, 80];

  return (
    <div className={`flex flex-col gap-2.5 p-3 rounded-2xl bg-neutral-900/90 border border-neutral-800/90 shadow-2xl backdrop-blur-xl transition-all ${
      compact ? 'w-full' : 'w-full lg:w-[210px] xl:w-[230px]'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-neutral-800/80">
        <div className="flex items-center space-x-1.5">
          <div className="p-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Type className="w-3.5 h-3.5" />
          </div>
          <span className="font-space font-bold text-neutral-200 tracking-tight text-xs">
            Aperture (1–12)
          </span>
        </div>
        <span className="text-[9px] font-mono-code px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 font-semibold">
          HOUR
        </span>
      </div>

      {/* Font Family Selector */}
      <div className="flex flex-col space-y-1">
        <label className="text-[10px] font-space uppercase tracking-wider text-neutral-400 font-medium">
          Typeface
        </label>
        <div className="flex items-center space-x-0.5 relative" ref={fontDropdownRef}>
          <button
            onClick={handlePrevFont}
            className="p-1.5 rounded-l-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-amber-400 transition-all cursor-pointer active:scale-95 flex-shrink-0"
            title="Previous Font"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              setIsFontDropdownOpen(!isFontDropdownOpen);
              setIsSizeDropdownOpen(false);
            }}
            className="flex-1 flex items-center justify-between space-x-1 px-2.5 py-1.5 bg-neutral-950 hover:bg-neutral-850 border-y border-neutral-800 text-neutral-200 transition-all cursor-pointer min-w-0"
          >
            <div className="text-left truncate">
              <div className={`text-xs font-bold text-amber-300 truncate ${currentFont.cssClass}`}>
                {currentFont.name}
              </div>
            </div>
            <ChevronDown className={`w-3 h-3 text-neutral-400 transition-transform duration-200 flex-shrink-0 ${isFontDropdownOpen ? 'rotate-180 text-amber-400' : ''}`} />
          </button>

          <button
            onClick={handleNextFont}
            className="p-1.5 rounded-r-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-amber-400 transition-all cursor-pointer active:scale-95 flex-shrink-0"
            title="Next Font"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {/* Dropdown Popup */}
          {isFontDropdownOpen && (
            <div className="absolute top-full left-0 right-0 sm:right-auto sm:w-60 mt-2 max-h-64 overflow-y-auto rounded-2xl bg-neutral-950/98 border border-neutral-800 shadow-2xl p-1.5 z-50 backdrop-blur-2xl scrollbar-thin scrollbar-thumb-neutral-800">
              <div className="px-2.5 py-1.5 text-[9px] font-space font-bold uppercase tracking-wider text-neutral-500 border-b border-neutral-800/80 mb-1 flex items-center justify-between">
                <span>Aperture Fonts</span>
                <Sparkles className="w-3 h-3 text-amber-400" />
              </div>
              {APERTURE_FONTS.map((font) => {
                const isSelected = font.id === selectedFontId;
                return (
                  <button
                    key={font.id}
                    onClick={() => {
                      onSelectFontId(font.id);
                      setIsFontDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-left transition-all cursor-pointer my-0.5 ${
                      isSelected
                        ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40'
                        : 'hover:bg-neutral-900 text-neutral-300 border border-transparent'
                    }`}
                  >
                    <div className="truncate pr-1">
                      <div className={`text-xs font-semibold ${font.cssClass} truncate`}>
                        12 &nbsp; {font.name}
                      </div>
                      <div className="text-[8.5px] text-neutral-400 font-mono-code truncate">
                        {font.category}
                      </div>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Font Size Selector with Stepper and Dropdown */}
      <div className="flex flex-col space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-space uppercase tracking-wider text-neutral-400 font-medium">
            Scale / Size
          </label>
          <span className="text-[10px] font-mono-code font-bold text-amber-400">
            {fontSize}px
          </span>
        </div>

        <div className="flex items-center space-x-1 relative" ref={sizeDropdownRef}>
          <button
            onClick={handlePrevSize}
            disabled={currentSizeIndex === 0}
            className={`p-1.5 rounded-xl border transition-all active:scale-95 flex-shrink-0 ${
              currentSizeIndex === 0
                ? 'bg-neutral-950/40 border-neutral-900 text-neutral-600 cursor-not-allowed'
                : 'bg-neutral-950 hover:bg-neutral-800 border-neutral-800 text-neutral-300 hover:text-amber-400 cursor-pointer'
            }`}
            title="Decrease Size"
          >
            <Minus className="w-3 h-3" />
          </button>

          <button
            onClick={() => {
              setIsSizeDropdownOpen(!isSizeDropdownOpen);
              setIsFontDropdownOpen(false);
            }}
            className="flex-1 flex items-center justify-center space-x-1 py-1.5 px-2 bg-neutral-950 hover:bg-neutral-850 border border-neutral-800 rounded-xl text-neutral-200 transition-all cursor-pointer"
          >
            <span className="text-xs font-mono-code font-bold text-amber-300">
              {fontSize} px
            </span>
            <ChevronDown className={`w-3 h-3 text-neutral-400 transition-transform ${isSizeDropdownOpen ? 'rotate-180 text-amber-400' : ''}`} />
          </button>

          <button
            onClick={handleNextSize}
            disabled={currentSizeIndex === FONT_SIZES.length - 1}
            className={`p-1.5 rounded-xl border transition-all active:scale-95 flex-shrink-0 ${
              currentSizeIndex === FONT_SIZES.length - 1
                ? 'bg-neutral-950/40 border-neutral-900 text-neutral-600 cursor-not-allowed'
                : 'bg-neutral-950 hover:bg-neutral-800 border-neutral-800 text-neutral-300 hover:text-amber-400 cursor-pointer'
            }`}
            title="Increase Size"
          >
            <Plus className="w-3 h-3" />
          </button>

          {/* Size Dropdown Popup */}
          {isSizeDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 max-h-56 overflow-y-auto rounded-2xl bg-neutral-950/98 border border-neutral-800 shadow-2xl p-1.5 z-50 backdrop-blur-2xl scrollbar-thin scrollbar-thumb-neutral-800">
              <div className="px-2 py-1 text-[8.5px] font-space font-bold uppercase tracking-wider text-neutral-500 border-b border-neutral-800/80 mb-1 flex items-center justify-between">
                <span>Aperture Sizes</span>
                <Maximize2 className="w-3 h-3 text-amber-400" />
              </div>
              <div className="grid grid-cols-2 gap-1">
                {FONT_SIZES.map((sz) => {
                  const isSelected = sz === fontSize;
                  return (
                    <button
                      key={sz}
                      onClick={() => {
                        onSelectFontSize(sz);
                        setIsSizeDropdownOpen(false);
                      }}
                      className={`flex items-center justify-center py-1.5 px-2 rounded-lg text-xs font-mono-code transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500/20 text-amber-200 font-bold border border-amber-500/50'
                          : 'hover:bg-neutral-900 text-neutral-300 border border-transparent'
                      }`}
                    >
                      <span>{sz}px</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Quick Size Preset Pills */}
        <div className="pt-1.5 flex flex-wrap gap-1">
          {quickSizes.map((qs) => (
            <button
              key={qs}
              onClick={() => onSelectFontSize(qs)}
              className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono-code transition-all cursor-pointer ${
                fontSize === qs
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                  : 'bg-neutral-950 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
              }`}
            >
              {qs}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Right Side Wing: Outer Edge Minute Numerals (5–60) Settings Panel
 */
export const OuterRingTypographyPanel: React.FC<OuterRingPanelProps> = ({
  outerFontId,
  onSelectOuterFontId,
  outerFontSize,
  onSelectOuterFontSize,
  compact = false,
}) => {
  const [isOuterFontDropdownOpen, setIsOuterFontDropdownOpen] = useState<boolean>(false);
  const [isOuterSizeDropdownOpen, setIsOuterSizeDropdownOpen] = useState<boolean>(false);
  const outerFontDropdownRef = useRef<HTMLDivElement>(null);
  const outerSizeDropdownRef = useRef<HTMLDivElement>(null);

  const currentOuterFontIndex = APERTURE_FONTS.findIndex(f => f.id === outerFontId);
  const currentOuterFont = APERTURE_FONTS[currentOuterFontIndex >= 0 ? currentOuterFontIndex : 0];
  const currentOuterSizeIndex = OUTER_FONT_SIZES.indexOf(outerFontSize);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (outerFontDropdownRef.current && !outerFontDropdownRef.current.contains(target)) {
        setIsOuterFontDropdownOpen(false);
      }
      if (outerSizeDropdownRef.current && !outerSizeDropdownRef.current.contains(target)) {
        setIsOuterSizeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePrevOuterFont = () => {
    const prevIdx = (currentOuterFontIndex - 1 + APERTURE_FONTS.length) % APERTURE_FONTS.length;
    onSelectOuterFontId(APERTURE_FONTS[prevIdx].id);
  };

  const handleNextOuterFont = () => {
    const nextIdx = (currentOuterFontIndex + 1) % APERTURE_FONTS.length;
    onSelectOuterFontId(APERTURE_FONTS[nextIdx].id);
  };

  const handlePrevOuterSize = () => {
    if (currentOuterSizeIndex > 0) {
      onSelectOuterFontSize(OUTER_FONT_SIZES[currentOuterSizeIndex - 1]);
    } else if (currentOuterSizeIndex === -1 && outerFontSize > OUTER_FONT_SIZES[0]) {
      onSelectOuterFontSize(outerFontSize - 2);
    }
  };

  const handleNextOuterSize = () => {
    if (currentOuterSizeIndex < OUTER_FONT_SIZES.length - 1 && currentOuterSizeIndex !== -1) {
      onSelectOuterFontSize(OUTER_FONT_SIZES[currentOuterSizeIndex + 1]);
    } else if (currentOuterSizeIndex === -1 && outerFontSize < OUTER_FONT_SIZES[OUTER_FONT_SIZES.length - 1]) {
      onSelectOuterFontSize(outerFontSize + 2);
    }
  };

  // Quick preset sizes for outer numbers
  const quickOuterSizes = [11, 14, 18, 24, 32];

  return (
    <div className={`flex flex-col gap-2.5 p-3 rounded-2xl bg-neutral-900/90 border border-neutral-800/90 shadow-2xl backdrop-blur-xl transition-all ${
      compact ? 'w-full' : 'w-full lg:w-[210px] xl:w-[230px]'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-neutral-800/80">
        <div className="flex items-center space-x-1.5">
          <div className="p-1 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Gauge className="w-3.5 h-3.5" />
          </div>
          <span className="font-space font-bold text-neutral-200 tracking-tight text-xs">
            Outer Ring (5–60)
          </span>
        </div>
        <span className="text-[9px] font-mono-code px-1.5 py-0.5 rounded-md bg-sky-500/10 text-sky-300 border border-sky-500/20 font-semibold">
          MINUTES
        </span>
      </div>

      {/* Font Family Selector */}
      <div className="flex flex-col space-y-1">
        <label className="text-[10px] font-space uppercase tracking-wider text-neutral-400 font-medium">
          Typeface
        </label>
        <div className="flex items-center space-x-0.5 relative" ref={outerFontDropdownRef}>
          <button
            onClick={handlePrevOuterFont}
            className="p-1.5 rounded-l-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-sky-400 transition-all cursor-pointer active:scale-95 flex-shrink-0"
            title="Previous Outer Font"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              setIsOuterFontDropdownOpen(!isOuterFontDropdownOpen);
              setIsOuterSizeDropdownOpen(false);
            }}
            className="flex-1 flex items-center justify-between space-x-1 px-2.5 py-1.5 bg-neutral-950 hover:bg-neutral-850 border-y border-neutral-800 text-neutral-200 transition-all cursor-pointer min-w-0"
          >
            <div className="text-left truncate">
              <div className={`text-xs font-bold text-sky-300 truncate ${currentOuterFont.cssClass}`}>
                {currentOuterFont.name}
              </div>
            </div>
            <ChevronDown className={`w-3 h-3 text-neutral-400 transition-transform duration-200 flex-shrink-0 ${isOuterFontDropdownOpen ? 'rotate-180 text-sky-400' : ''}`} />
          </button>

          <button
            onClick={handleNextOuterFont}
            className="p-1.5 rounded-r-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-sky-400 transition-all cursor-pointer active:scale-95 flex-shrink-0"
            title="Next Outer Font"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {/* Dropdown Popup */}
          {isOuterFontDropdownOpen && (
            <div className="absolute top-full left-0 right-0 sm:right-auto sm:w-60 mt-2 max-h-64 overflow-y-auto rounded-2xl bg-neutral-950/98 border border-neutral-800 shadow-2xl p-1.5 z-50 backdrop-blur-2xl scrollbar-thin scrollbar-thumb-neutral-800">
              <div className="px-2.5 py-1.5 text-[9px] font-space font-bold uppercase tracking-wider text-neutral-500 border-b border-neutral-800/80 mb-1 flex items-center justify-between">
                <span>Outer Ring Fonts</span>
                <Sparkles className="w-3 h-3 text-sky-400" />
              </div>
              {APERTURE_FONTS.map((font) => {
                const isSelected = font.id === outerFontId;
                return (
                  <button
                    key={font.id}
                    onClick={() => {
                      onSelectOuterFontId(font.id);
                      setIsOuterFontDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-left transition-all cursor-pointer my-0.5 ${
                      isSelected
                        ? 'bg-sky-500/20 text-sky-200 border border-sky-500/40'
                        : 'hover:bg-neutral-900 text-neutral-300 border border-transparent'
                    }`}
                  >
                    <div className="truncate pr-1">
                      <div className={`text-xs font-semibold ${font.cssClass} truncate`}>
                        30 &nbsp; {font.name}
                      </div>
                      <div className="text-[8.5px] text-neutral-400 font-mono-code truncate">
                        {font.category}
                      </div>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Font Size Selector with Stepper and Dropdown */}
      <div className="flex flex-col space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-space uppercase tracking-wider text-neutral-400 font-medium">
            Scale / Size
          </label>
          <span className="text-[10px] font-mono-code font-bold text-sky-400">
            {outerFontSize}px
          </span>
        </div>

        <div className="flex items-center space-x-1 relative" ref={outerSizeDropdownRef}>
          <button
            onClick={handlePrevOuterSize}
            disabled={currentOuterSizeIndex === 0}
            className={`p-1.5 rounded-xl border transition-all active:scale-95 flex-shrink-0 ${
              currentOuterSizeIndex === 0
                ? 'bg-neutral-950/40 border-neutral-900 text-neutral-600 cursor-not-allowed'
                : 'bg-neutral-950 hover:bg-neutral-800 border-neutral-800 text-neutral-300 hover:text-sky-400 cursor-pointer'
            }`}
            title="Decrease Outer Size"
          >
            <Minus className="w-3 h-3" />
          </button>

          <button
            onClick={() => {
              setIsOuterSizeDropdownOpen(!isOuterSizeDropdownOpen);
              setIsOuterFontDropdownOpen(false);
            }}
            className="flex-1 flex items-center justify-center space-x-1 py-1.5 px-2 bg-neutral-950 hover:bg-neutral-850 border border-neutral-800 rounded-xl text-neutral-200 transition-all cursor-pointer"
          >
            <span className="text-xs font-mono-code font-bold text-sky-300">
              {outerFontSize} px
            </span>
            <ChevronDown className={`w-3 h-3 text-neutral-400 transition-transform ${isOuterSizeDropdownOpen ? 'rotate-180 text-sky-400' : ''}`} />
          </button>

          <button
            onClick={handleNextOuterSize}
            disabled={currentOuterSizeIndex === OUTER_FONT_SIZES.length - 1}
            className={`p-1.5 rounded-xl border transition-all active:scale-95 flex-shrink-0 ${
              currentOuterSizeIndex === OUTER_FONT_SIZES.length - 1
                ? 'bg-neutral-950/40 border-neutral-900 text-neutral-600 cursor-not-allowed'
                : 'bg-neutral-950 hover:bg-neutral-800 border-neutral-800 text-neutral-300 hover:text-sky-400 cursor-pointer'
            }`}
            title="Increase Outer Size"
          >
            <Plus className="w-3 h-3" />
          </button>

          {/* Size Dropdown Popup */}
          {isOuterSizeDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 max-h-56 overflow-y-auto rounded-2xl bg-neutral-950/98 border border-neutral-800 shadow-2xl p-1.5 z-50 backdrop-blur-2xl scrollbar-thin scrollbar-thumb-neutral-800">
              <div className="px-2 py-1 text-[8.5px] font-space font-bold uppercase tracking-wider text-neutral-500 border-b border-neutral-800/80 mb-1 flex items-center justify-between">
                <span>Outer Ring Sizes</span>
                <Maximize2 className="w-3 h-3 text-sky-400" />
              </div>
              <div className="grid grid-cols-2 gap-1">
                {OUTER_FONT_SIZES.map((sz) => {
                  const isSelected = sz === outerFontSize;
                  return (
                    <button
                      key={sz}
                      onClick={() => {
                        onSelectOuterFontSize(sz);
                        setIsOuterSizeDropdownOpen(false);
                      }}
                      className={`flex items-center justify-center py-1.5 px-2 rounded-lg text-xs font-mono-code transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-sky-500/20 text-sky-200 font-bold border border-sky-500/50'
                          : 'hover:bg-neutral-900 text-neutral-300 border border-transparent'
                      }`}
                    >
                      <span>{sz}px</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Quick Size Preset Pills */}
        <div className="pt-1.5 flex flex-wrap gap-1">
          {quickOuterSizes.map((qs) => (
            <button
              key={qs}
              onClick={() => onSelectOuterFontSize(qs)}
              className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono-code transition-all cursor-pointer ${
                outerFontSize === qs
                  ? 'bg-sky-500 text-neutral-950 font-bold shadow-sm'
                  : 'bg-neutral-950 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
              }`}
            >
              {qs}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Full Typography Inspector Bar (for stacked or mobile/tablet views)
 */
export const TypographyInspector: React.FC<TypographyInspectorProps> = (props) => {
  return (
    <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-3 z-30">
      <ApertureTypographyPanel
        selectedFontId={props.selectedFontId}
        onSelectFontId={props.onSelectFontId}
        fontSize={props.fontSize}
        onSelectFontSize={props.onSelectFontSize}
        compact
      />
      <OuterRingTypographyPanel
        outerFontId={props.outerFontId}
        onSelectOuterFontId={props.onSelectOuterFontId}
        outerFontSize={props.outerFontSize}
        onSelectOuterFontSize={props.onSelectOuterFontSize}
        compact
      />
    </div>
  );
};
