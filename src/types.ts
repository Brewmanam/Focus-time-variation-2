export type ThemeFinish = 
  | 'classic_slate'
  | 'obsidian_gold'
  | 'titanium_stealth'
  | 'vintage_ivory'
  | 'midnight_astral';

export type DisplayView = 'dial' | 'exploded' | 'xray' | 'principles';

export type ApertureFontId =
  | 'cinzel'
  | 'bodoni'
  | 'playfair'
  | 'cormorant'
  | 'instrument'
  | 'space'
  | 'jakarta'
  | 'syne'
  | 'jetbrains'
  | 'mono'
  | 'orbitron'
  | 'bebas'
  | 'vt323';

export interface ApertureFontOption {
  id: ApertureFontId;
  name: string;
  category: string;
  cssClass: string;
  fontFamily: string;
}

export interface TimeState {
  hours: number;       // 0 - 23 (24-hour format)
  minutes: number;     // 0 - 59
  seconds: number;     // 0 - 59
  milliseconds: number; // 0 - 999
  isPM: boolean;
  displayHour12: number; // 1 - 12
  isNight: boolean;    // true if 18:00 - 06:00 or PM night
}

export interface PresetTime {
  name: string;
  hour: number;
  minute: number;
  second: number;
  description: string;
}

export interface CityTimezone {
  id: string;
  name: string;
  region: string;
  country: string;
  timeZone: string;
  flag?: string;
  isHorologicalHub?: boolean;
}
