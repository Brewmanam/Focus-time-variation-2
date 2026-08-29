import { ThemeFinish, ThemeSettings, WatchVariationInfo } from '../types';

export const DEFAULT_THEME_PROFILES: Record<ThemeFinish, ThemeSettings> = {
  obsidian_gold: {
    selectedFontId: 'cinzel',
    fontSize: 24,
    outerFontId: 'space',
    outerFontSize: 11,
    showSeconds: true,
    showRelativeMinuteLabels: true,
    showXRay: false,
  },
  titanium_stealth: {
    selectedFontId: 'space',
    fontSize: 24,
    outerFontId: 'jetbrains',
    outerFontSize: 11,
    showSeconds: true,
    showRelativeMinuteLabels: true,
    showXRay: true,
  },
  classic_slate: {
    selectedFontId: 'syne',
    fontSize: 24,
    outerFontId: 'space',
    outerFontSize: 11,
    showSeconds: true,
    showRelativeMinuteLabels: true,
    showXRay: false,
  },
  midnight_astral: {
    selectedFontId: 'orbitron',
    fontSize: 24,
    outerFontId: 'orbitron',
    outerFontSize: 11,
    showSeconds: true,
    showRelativeMinuteLabels: true,
    showXRay: false,
  },
  vintage_ivory: {
    selectedFontId: 'bodoni',
    fontSize: 24,
    outerFontId: 'cormorant',
    outerFontSize: 11,
    showSeconds: true,
    showRelativeMinuteLabels: true,
    showXRay: false,
  },
};

export const WATCH_VARIATIONS: WatchVariationInfo[] = [
  {
    id: 'obsidian_gold',
    name: 'Obsidian & 18K Gold',
    tag: 'CLASSIC HOROLOGY',
    desc: 'Sunray brushed radial dial with polished 18K gold bezel, gold minute needle & day/night disc.',
    accent: '#d4af37',
    defaultSettings: DEFAULT_THEME_PROFILES.obsidian_gold,
  },
  {
    id: 'titanium_stealth',
    name: 'Industrial Skeleton / Titanium',
    tag: 'X-RAY MECHANICAL',
    desc: 'Satin brushed aerospace titanium with electric blue accents and high-visibility luminescence.',
    accent: '#38bdf8',
    defaultSettings: DEFAULT_THEME_PROFILES.titanium_stealth,
  },
  {
    id: 'classic_slate',
    name: 'Bauhaus Minimalist',
    tag: 'MODERNIST CONTRAST',
    desc: 'High-contrast monochrome slate and crisp white finish with red Bauhaus second hand.',
    accent: '#ef4444',
    defaultSettings: DEFAULT_THEME_PROFILES.classic_slate,
  },
  {
    id: 'midnight_astral',
    name: 'Celestial Galaxy / Astral',
    tag: 'ASTRONOMICAL HORIZON',
    desc: 'Deep cosmic indigo & cyan gradient dial reflecting midnight starlight and lunar phase transitions.',
    accent: '#818cf8',
    defaultSettings: DEFAULT_THEME_PROFILES.midnight_astral,
  },
  {
    id: 'vintage_ivory',
    name: 'Vintage Ivory & Blued Steel',
    tag: 'HERITAGE CHRONOMETER',
    desc: 'Warm enamel porcelain ivory dial with heat-blued steel hands and Parisian typography.',
    accent: '#1e3a8a',
    defaultSettings: DEFAULT_THEME_PROFILES.vintage_ivory,
  },
];

const THEME_PROFILES_STORAGE_KEY = 'aperture_clock_theme_profiles_v1';
const ACTIVE_THEME_STORAGE_KEY = 'aperture_clock_active_theme_v1';

export function loadSavedThemeProfiles(): Record<ThemeFinish, ThemeSettings> {
  try {
    const raw = localStorage.getItem(THEME_PROFILES_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_THEME_PROFILES };
    const parsed = JSON.parse(raw);
    return {
      obsidian_gold: { ...DEFAULT_THEME_PROFILES.obsidian_gold, ...(parsed.obsidian_gold || {}) },
      titanium_stealth: { ...DEFAULT_THEME_PROFILES.titanium_stealth, ...(parsed.titanium_stealth || {}) },
      classic_slate: { ...DEFAULT_THEME_PROFILES.classic_slate, ...(parsed.classic_slate || {}) },
      midnight_astral: { ...DEFAULT_THEME_PROFILES.midnight_astral, ...(parsed.midnight_astral || {}) },
      vintage_ivory: { ...DEFAULT_THEME_PROFILES.vintage_ivory, ...(parsed.vintage_ivory || {}) },
    };
  } catch (e) {
    console.error('Failed to load theme profiles from storage:', e);
    return { ...DEFAULT_THEME_PROFILES };
  }
}

export function saveThemeProfilesToStorage(profiles: Record<ThemeFinish, ThemeSettings>): void {
  try {
    localStorage.setItem(THEME_PROFILES_STORAGE_KEY, JSON.stringify(profiles));
  } catch (e) {
    console.error('Failed to save theme profiles to storage:', e);
  }
}

export function loadSavedActiveTheme(): ThemeFinish {
  try {
    const saved = localStorage.getItem(ACTIVE_THEME_STORAGE_KEY) as ThemeFinish;
    if (saved && DEFAULT_THEME_PROFILES[saved]) {
      return saved;
    }
  } catch (e) {
    console.error('Failed to load active theme from storage:', e);
  }
  return 'obsidian_gold';
}

export function saveActiveThemeToStorage(finish: ThemeFinish): void {
  try {
    localStorage.setItem(ACTIVE_THEME_STORAGE_KEY, finish);
  } catch (e) {
    console.error('Failed to save active theme to storage:', e);
  }
}
