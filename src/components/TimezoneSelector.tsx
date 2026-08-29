import React, { useState, useEffect, useRef } from 'react';
import { 
  Globe, 
  MapPin, 
  Search, 
  ChevronDown, 
  Check, 
  Sparkles, 
  Radio, 
  Compass,
  Clock
} from 'lucide-react';
import { CityTimezone } from '../types';
import { CITIES, getUtcOffsetString, getTimeInTimezone } from '../data/timezones';

interface TimezoneSelectorProps {
  selectedTimezone: string;
  selectedCityName: string;
  onSelectCity: (city: CityTimezone | { timeZone: string; name: string; country?: string; flag?: string }) => void;
  onAutoDetectIP: () => void;
  isDetectingIP: boolean;
  detectedInfo?: { city: string; country?: string; timeZone: string; isFromIP: boolean } | null;
}

export const TimezoneSelector: React.FC<TimezoneSelectorProps> = ({
  selectedTimezone,
  selectedCityName,
  onSelectCity,
  onAutoDetectIP,
  isDetectingIP,
  detectedInfo,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCities = CITIES.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.timeZone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group by region
  const grouped = filteredCities.reduce<Record<string, CityTimezone[]>>((acc, city) => {
    if (!acc[city.region]) acc[city.region] = [];
    acc[city.region].push(city);
    return acc;
  }, {});

  const currentOffset = getUtcOffsetString(selectedTimezone);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-850 border border-neutral-800 text-neutral-200 transition-all cursor-pointer shadow-sm hover:border-amber-500/50 max-w-[145px] sm:max-w-none"
        title="Select World City & Timezone"
      >
        <div className="p-1 rounded-lg bg-amber-500/10 text-amber-400 flex-shrink-0">
          <Globe className="w-3.5 h-3.5" />
        </div>
        <div className="text-left flex flex-col min-w-0">
          <div className="flex items-center space-x-1 sm:space-x-1.5 min-w-0">
            <span className="text-xs font-space font-semibold text-neutral-100 truncate">
              {selectedCityName}
            </span>
            <span className="text-[10px] font-mono-code text-amber-400/90 font-medium flex-shrink-0">
              {currentOffset}
            </span>
          </div>
          <span className="text-[9px] text-neutral-400 font-mono-code -mt-0.5 truncate hidden sm:inline">
            {selectedTimezone}
          </span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu Modal */}
      {isOpen && (
        <div className="absolute right-0 sm:left-0 sm:right-auto mt-2 w-80 sm:w-96 rounded-2xl bg-neutral-950/95 border border-neutral-800 shadow-2xl backdrop-blur-2xl z-50 overflow-hidden flex flex-col max-h-[480px]">
          {/* Header & Search */}
          <div className="p-3 border-b border-neutral-800/80 bg-neutral-900/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-space font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>World Cities & Time Zones</span>
              </span>
              <button
                onClick={() => {
                  onAutoDetectIP();
                }}
                disabled={isDetectingIP}
                className="flex items-center space-x-1 text-[11px] font-mono-code px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 transition-all cursor-pointer"
                title="Detect timezone automatically via IP geolocation"
              >
                <Radio className={`w-3 h-3 ${isDetectingIP ? 'animate-pulse text-amber-400' : ''}`} />
                <span>{isDetectingIP ? 'Locating IP...' : 'Auto-Detect IP'}</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search city, country, or timezone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-neutral-900 rounded-xl border border-neutral-700/80 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500 font-space"
                autoFocus
              />
            </div>
          </div>

          {/* Detected Location Banner if available */}
          {detectedInfo && (
            <div className="px-3 py-2 bg-neutral-900/40 border-b border-neutral-800/60 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-1.5 text-neutral-300">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] font-space text-neutral-300 truncate max-w-[200px]">
                  Detected: <strong className="text-emerald-300">{detectedInfo.city}</strong> {detectedInfo.country ? `(${detectedInfo.country})` : ''}
                </span>
              </div>
              <button
                onClick={() => {
                  onSelectCity({
                    id: 'detected-ip',
                    name: detectedInfo.city,
                    country: detectedInfo.country || '',
                    region: 'Detected IP Location',
                    timeZone: detectedInfo.timeZone,
                    flag: '📍',
                  });
                  setIsOpen(false);
                }}
                className="text-[10px] font-mono-code text-amber-400 hover:text-amber-300 underline cursor-pointer"
              >
                Select
              </button>
            </div>
          )}

          {/* List of Cities Grouped */}
          <div className="overflow-y-auto p-2 space-y-3 flex-1 scrollbar-thin scrollbar-thumb-neutral-800">
            {Object.keys(grouped).length === 0 ? (
              <div className="text-center py-6 text-xs text-neutral-500 font-space">
                No cities found matching "{searchQuery}"
              </div>
            ) : (
              Object.entries(grouped).map(([region, cities]) => (
                <div key={region} className="space-y-1">
                  <div className="text-[10px] font-space font-bold uppercase tracking-wider text-neutral-500 px-2 py-0.5">
                    {region}
                  </div>
                  <div className="space-y-0.5">
                    {cities.map((city) => {
                      const isSelected = selectedTimezone === city.timeZone && selectedCityName.includes(city.name.split(' ')[0]);
                      const cityTime = getTimeInTimezone(city.timeZone);
                      const cityOffset = getUtcOffsetString(city.timeZone);

                      return (
                        <button
                          key={city.id}
                          onClick={() => {
                            onSelectCity(city);
                            setIsOpen(false);
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all cursor-pointer ${
                            isSelected 
                              ? 'bg-amber-500/20 text-amber-200 border border-amber-500/50' 
                              : 'hover:bg-neutral-900 text-neutral-300 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center space-x-2 min-w-0">
                            <span className="text-sm shrink-0">{city.flag || '🌐'}</span>
                            <div className="min-w-0">
                              <div className="text-xs font-space font-semibold text-neutral-100 flex items-center gap-1.5 truncate">
                                <span>{city.name}</span>
                                {city.isHorologicalHub && (
                                  <span className="text-[8px] font-mono-code px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                    HOROLOGY
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-neutral-400 font-mono-code truncate">
                                {city.country} • {city.timeZone}
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0 pl-2">
                            <div className="text-xs font-mono-code font-bold text-neutral-200">
                              {cityTime.displayHour12}:{String(cityTime.minutes).padStart(2, '0')} {cityTime.isPM ? 'PM' : 'AM'}
                            </div>
                            <div className="text-[9px] font-mono-code text-amber-400/80">
                              {cityOffset}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
