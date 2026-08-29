import { CityTimezone, TimeState } from '../types';

export const CITIES: CityTimezone[] = [
  // Horological Capitals
  { id: 'geneva', name: 'Geneva', country: 'Switzerland', region: 'Horological Capitals', timeZone: 'Europe/Zurich', flag: '🇨🇭', isHorologicalHub: true },
  { id: 'le-locle', name: 'Le Locle & La Chaux-de-Fonds', country: 'Switzerland', region: 'Horological Capitals', timeZone: 'Europe/Zurich', flag: '🇨🇭', isHorologicalHub: true },
  { id: 'glashuette', name: 'Glashütte / Dresden', country: 'Germany', region: 'Horological Capitals', timeZone: 'Europe/Berlin', flag: '🇩🇪', isHorologicalHub: true },
  { id: 'london', name: 'London (Greenwich)', country: 'United Kingdom', region: 'Horological Capitals', timeZone: 'Europe/London', flag: '🇬🇧', isHorologicalHub: true },
  { id: 'paris', name: 'Paris', country: 'France', region: 'Horological Capitals', timeZone: 'Europe/Paris', flag: '🇫🇷', isHorologicalHub: true },
  { id: 'tokyo', name: 'Tokyo (Ginza / Shizukuishi)', country: 'Japan', region: 'Horological Capitals', timeZone: 'Asia/Tokyo', flag: '🇯🇵', isHorologicalHub: true },

  // Europe & Middle East
  { id: 'berlin', name: 'Berlin', country: 'Germany', region: 'Europe & Middle East', timeZone: 'Europe/Berlin', flag: '🇩🇪' },
  { id: 'rome', name: 'Rome', country: 'Italy', region: 'Europe & Middle East', timeZone: 'Europe/Rome', flag: '🇮🇹' },
  { id: 'madrid', name: 'Madrid', country: 'Spain', region: 'Europe & Middle East', timeZone: 'Europe/Madrid', flag: '🇪🇸' },
  { id: 'athens', name: 'Athens', country: 'Greece', region: 'Europe & Middle East', timeZone: 'Europe/Athens', flag: '🇬🇷' },
  { id: 'istanbul', name: 'Istanbul', country: 'Turkey', region: 'Europe & Middle East', timeZone: 'Europe/Istanbul', flag: '🇹🇷' },
  { id: 'dubai', name: 'Dubai', country: 'United Arab Emirates', region: 'Europe & Middle East', timeZone: 'Asia/Dubai', flag: '🇦🇪' },
  { id: 'riyadh', name: 'Riyadh', country: 'Saudi Arabia', region: 'Europe & Middle East', timeZone: 'Asia/Riyadh', flag: '🇸🇦' },
  { id: 'cairo', name: 'Cairo', country: 'Egypt', region: 'Europe & Middle East', timeZone: 'Africa/Cairo', flag: '🇪🇬' },

  // Americas
  { id: 'new-york', name: 'New York', country: 'United States', region: 'Americas', timeZone: 'America/New_York', flag: '🇺🇸' },
  { id: 'chicago', name: 'Chicago', country: 'United States', region: 'Americas', timeZone: 'America/Chicago', flag: '🇺🇸' },
  { id: 'denver', name: 'Denver', country: 'United States', region: 'Americas', timeZone: 'America/Denver', flag: '🇺🇸' },
  { id: 'los-angeles', name: 'Los Angeles', country: 'United States', region: 'Americas', timeZone: 'America/Los_Angeles', flag: '🇺🇸' },
  { id: 'toronto', name: 'Toronto', country: 'Canada', region: 'Americas', timeZone: 'America/Toronto', flag: '🇨🇦' },
  { id: 'vancouver', name: 'Vancouver', country: 'Canada', region: 'Americas', timeZone: 'America/Vancouver', flag: '🇨🇦' },
  { id: 'mexico-city', name: 'Mexico City', country: 'Mexico', region: 'Americas', timeZone: 'America/Mexico_City', flag: '🇲🇽' },
  { id: 'sao-paulo', name: 'São Paulo', country: 'Brazil', region: 'Americas', timeZone: 'America/Sao_Paulo', flag: '🇧🇷' },
  { id: 'buenos-aires', name: 'Buenos Aires', country: 'Argentina', region: 'Americas', timeZone: 'America/Argentina/Buenos_Aires', flag: '🇦🇷' },
  { id: 'honolulu', name: 'Honolulu', country: 'United States', region: 'Americas', timeZone: 'Pacific/Honolulu', flag: '🇺🇸' },

  // Asia & Pacific
  { id: 'singapore', name: 'Singapore', country: 'Singapore', region: 'Asia & Pacific', timeZone: 'Asia/Singapore', flag: '🇸🇬' },
  { id: 'hong-kong', name: 'Hong Kong', country: 'Hong Kong', region: 'Asia & Pacific', timeZone: 'Asia/Hong_Kong', flag: '🇭🇰' },
  { id: 'shanghai', name: 'Shanghai / Beijing', country: 'China', region: 'Asia & Pacific', timeZone: 'Asia/Shanghai', flag: '🇨🇳' },
  { id: 'seoul', name: 'Seoul', country: 'South Korea', region: 'Asia & Pacific', timeZone: 'Asia/Seoul', flag: '🇰🇷' },
  { id: 'bangkok', name: 'Bangkok', country: 'Thailand', region: 'Asia & Pacific', timeZone: 'Asia/Bangkok', flag: '🇹🇭' },
  { id: 'mumbai', name: 'Mumbai / New Delhi', country: 'India', region: 'Asia & Pacific', timeZone: 'Asia/Kolkata', flag: '🇮🇳' },
  { id: 'sydney', name: 'Sydney', country: 'Australia', region: 'Asia & Pacific', timeZone: 'Australia/Sydney', flag: '🇦🇺' },
  { id: 'auckland', name: 'Auckland', country: 'New Zealand', region: 'Asia & Pacific', timeZone: 'Pacific/Auckland', flag: '🇳🇿' },
];

/**
 * Cache for timezone offsets to prevent Intl.DateTimeFormat instantiation on every frame
 */
const tzOffsetCache = new Map<string, { offsetMinutes: number; lastChecked: number }>();

/**
 * Calculates current TimeState in the given IANA timezone with 100% precision
 */
export function getTimeInTimezone(timeZone: string, baseDate = new Date()): TimeState {
  try {
    const nowMs = baseDate.getTime();
    let offsetMinutes: number;

    const cached = tzOffsetCache.get(timeZone);
    // Refresh cached offset every 10 seconds or on demand
    if (cached && nowMs - cached.lastChecked < 10000) {
      offsetMinutes = cached.offsetMinutes;
    } else {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone,
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hourCycle: 'h23',
      });
      const parts = formatter.formatToParts(baseDate);
      const partMap: Record<string, number> = {};
      for (const p of parts) {
        if (p.type !== 'literal') {
          partMap[p.type] = parseInt(p.value, 10);
        }
      }

      const tzAsUtc = Date.UTC(
        partMap.year || baseDate.getUTCFullYear(),
        (partMap.month ? partMap.month - 1 : baseDate.getUTCMonth()),
        partMap.day || baseDate.getUTCDate(),
        (partMap.hour || 0) % 24,
        partMap.minute || 0,
        partMap.second || 0
      );

      const utcTimestamp = Date.UTC(
        baseDate.getUTCFullYear(),
        baseDate.getUTCMonth(),
        baseDate.getUTCDate(),
        baseDate.getUTCHours(),
        baseDate.getUTCMinutes(),
        baseDate.getUTCSeconds()
      );

      offsetMinutes = Math.round((tzAsUtc - utcTimestamp) / 60000);
      tzOffsetCache.set(timeZone, { offsetMinutes, lastChecked: nowMs });
    }

    // Exact timezone time calculated by shifting UTC timestamp
    const tzTimestamp = nowMs + offsetMinutes * 60000;
    const tzDate = new Date(tzTimestamp);

    const h = tzDate.getUTCHours();
    const m = tzDate.getUTCMinutes();
    const s = tzDate.getUTCSeconds();
    const ms = baseDate.getMilliseconds(); // Global millisecond phase

    const isPM = h >= 12;
    const displayHour12 = h % 12 === 0 ? 12 : h % 12;
    const isNight = h >= 18 || h < 6;

    return {
      hours: h,
      minutes: m,
      seconds: s,
      milliseconds: ms,
      isPM,
      displayHour12,
      isNight,
    };
  } catch (err) {
    // Fallback to local
    const h24 = baseDate.getHours();
    const isPM = h24 >= 12;
    const displayHour12 = h24 % 12 === 0 ? 12 : h24 % 12;
    const isNight = h24 >= 18 || h24 < 6;
    return {
      hours: h24,
      minutes: baseDate.getMinutes(),
      seconds: baseDate.getSeconds(),
      milliseconds: baseDate.getMilliseconds(),
      isPM,
      displayHour12,
      isNight,
    };
  }
}

/**
 * Gets formatted UTC offset string (e.g. "UTC+1", "UTC-5", "UTC+5:30")
 */
export function getUtcOffsetString(timeZone: string, date = new Date()): string {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      timeZoneName: 'shortOffset',
    });
    const parts = formatter.formatToParts(date);
    const tzPart = parts.find(p => p.type === 'timeZoneName');
    if (tzPart && tzPart.value) {
      return tzPart.value.replace('GMT', 'UTC');
    }
  } catch {
    // Fallback calculation
  }
  return '';
}

/**
 * Detect user city and timezone based on IP with browser timezone fallback
 */
export async function detectLocationFromIP(): Promise<{
  city: string;
  country: string;
  timeZone: string;
  ip?: string;
  isFromIP: boolean;
}> {
  // 1. Try free IP Geolocation API
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);
    const res = await fetch('https://ipapi.co/json/', { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.timezone) {
        return {
          city: data.city || data.region || 'Detected Location',
          country: data.country_name || data.country || '',
          timeZone: data.timezone,
          ip: data.ip,
          isFromIP: true,
        };
      }
    }
  } catch (e) {
    // Fail quietly and move to secondary IP API or local resolution
  }

  // 2. Secondary IP service fallback
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);
    const res = await fetch('https://worldtimeapi.org/api/ip', { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.timezone) {
        const cityGuess = data.timezone.split('/').pop()?.replace(/_/g, ' ') || 'Local City';
        return {
          city: cityGuess,
          country: '',
          timeZone: data.timezone,
          ip: data.client_ip,
          isFromIP: true,
        };
      }
    }
  } catch (e) {
    // Fallback to browser system timezone
  }

  // 3. Fallback: Browser resolved timezone
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const cityGuess = tz.split('/').pop()?.replace(/_/g, ' ') || 'Device Local';
    return {
      city: cityGuess,
      country: '',
      timeZone: tz,
      isFromIP: false,
    };
  } catch {
    return {
      city: 'UTC',
      country: '',
      timeZone: 'UTC',
      isFromIP: false,
    };
  }
}
