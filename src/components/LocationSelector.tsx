import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Location } from '../types';

// Fix Leaflet icon issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Map style options
const MAP_STYLES = [
  {
    id: 'osm',
    name: 'Standard Map',
    icon: '🗺️',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  },
  {
    id: 'carto-light',
    name: 'Light Theme',
    icon: '☀️',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
  },
  {
    id: 'carto-dark',
    name: 'Dark Theme',
    icon: '🌙',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
  },
  {
    id: 'satellite',
    name: 'Satellite View',
    icon: '🛰️',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  },
  {
    id: 'terrain',
    name: 'Terrain Map',
    icon: '🏔️',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  }
];

interface LocationSelectorProps {
  onLocationSelect: (location: Location) => void;
  onStartDateSelect: (date: string) => void;
  onEndDateSelect: (date: string) => void;
  selectedLocation?: Location;
  startDate?: string;
  endDate?: string;
  onMapFixedChange?: (isFixed: boolean) => void;
  onTrendYearsChange: (years: number) => void;
  trendYears: number;
}

// Create custom marker icon
const createCustomIcon = (color: string = '#3B82F6', isPending: boolean = false) => {
  const animation = isPending ? 'pulse-pending 1.5s infinite' : 'pulse 2s infinite';

  if (isPending) {
    // 圖釘樣式的待確認標記
    const html = `
      <div style="
        position: relative;
        width: 32px;
        height: 32px;
        animation: ${animation};
      ">
        <div style="
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 12px solid ${color};
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        "></div>
        <div style="
          position: absolute;
          bottom: 8px;
          left: 50%;
          transform: translateX(-50%);
          width: 16px;
          height: 16px;
          background: ${color};
          border-radius: 50%;
          border: 3px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          color: white;
          font-weight: bold;
        "></div>
        <div style="
          position: absolute;
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 8px solid white;
        "></div>
      </div>
    `;

    return L.divIcon({
      className: 'custom-marker',
      html: html,
      iconSize: [32, 32],
      iconAnchor: [16, 12]
    });
  } else {
    // 已確認位置標記（保持原樣）
    const html = `
      <div style="
        background: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: white;
        animation: ${animation};
      ">📍</div>
    `;

    return L.divIcon({
      className: 'custom-marker',
      html: html,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
  }
};

// Create user location marker icon
const createUserLocationIcon = () => {
  const html = `
    <div style="
      position: relative;
      width: 20px;
      height: 20px;
      animation: pulse 2s infinite;
    ">
      <div style="
        background: #10B981;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        color: white;
        font-weight: bold;
      ">👤</div>
      <div style="
        position: absolute;
        top: -8px;
        left: -8px;
        right: -8px;
        bottom: -8px;
        border: 2px solid #10B981;
        border-radius: 50%;
        opacity: 0.3;
        animation: pulse-ring 2s infinite;
      "></div>
    </div>
  `;

  return L.divIcon({
    className: 'user-location-marker',
    html: html,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

// Map click event handler component
const MapClickHandler: React.FC<{ onLocationSelect: (location: Location) => void }> = ({ onLocationSelect }) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelect({ lat, lon: lng });
    },
  });
  return null;
};

const LocationSelector: React.FC<LocationSelectorProps> = ({
  onLocationSelect,
  onStartDateSelect,
  onEndDateSelect,
  selectedLocation,
  startDate,
  endDate,
  onMapFixedChange,
  onTrendYearsChange,
  trendYears
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Array<{ display_name: string; lat: string; lon: string }>>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const suggestAbortRef = useRef<AbortController | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([25.0330, 121.5654]); // Default to Taipei
  const [isMapFixed, setIsMapFixed] = useState(false);
  const [mapStyle, setMapStyle] = useState(MAP_STYLES[0]); // Default to OSM
  const [isMapLoading, setIsMapLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isAutoLocating, setIsAutoLocating] = useState(true); // Auto-locate on page load
  const [userLocation, setUserLocation] = useState<Location | null>(null); // User's current location
  const [pendingLocation, setPendingLocation] = useState<Location | null>(null);
  const [pendingAddress, setPendingAddress] = useState<string>('');
  const [showLocationConfirm, setShowLocationConfirm] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const mapRef = useRef<L.Map>(null);

  // Notify parent component of map fixed state change
  useEffect(() => {
    onMapFixedChange?.(isMapFixed);
  }, [isMapFixed, onMapFixedChange]);

  // Auto-locate user on page load
  useEffect(() => {
    if (isAutoLocating) {
      getCurrentLocation(false); // Don't show confirmation dialog for auto-location
      setIsAutoLocating(false);
    }
  }, [isAutoLocating]);

  // Get current location using browser geolocation
  const getCurrentLocation = (showConfirm: boolean = true) => {
    if (!navigator.geolocation) {
      if (showConfirm) {
        alert('Geolocation is not supported by this browser.');
      }
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const location = { lat: latitude, lon: longitude };

        // Save user's current location
        setUserLocation(location);

        // Move map to current location
        setMapCenter([latitude, longitude]);
        if (mapRef.current) {
          mapRef.current.setView([latitude, longitude], 15);
        }

        if (showConfirm) {
          // Get address from coordinates for confirmation
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
            );
            const data = await response.json();
            const address = data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;

            setPendingLocation(location);
            setPendingAddress(address);
            setShowLocationConfirm(true);
          } catch (error) {
            console.error('Error getting address:', error);
            setPendingLocation(location);
            setPendingAddress(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
            setShowLocationConfirm(true);
          }
        }

        setIsLocating(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        if (showConfirm) {
          let errorMessage = 'Unable to retrieve your location.';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied by user.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out.';
              break;
          }
          alert(errorMessage);
        }
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  // Confirm location selection
  const confirmLocationSelection = () => {
    if (pendingLocation) {
      onLocationSelect(pendingLocation);
      setShowLocationConfirm(false);
      setPendingLocation(null);
      setPendingAddress('');
      setIsMapFixed(true);

      setTimeout(() => {
        const mapElement = document.getElementById('fixed-map');
        if (mapElement) {
          mapElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      }, 100);
    }
  };

  // Cancel location selection
  const cancelLocationSelection = () => {
    setShowLocationConfirm(false);
    setPendingLocation(null);
    setPendingAddress('');
  };

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsMapLoading(true);
    try {
      // Use Nominatim API for geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`
      );
      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon } = data[0];
        const location = { lat: parseFloat(lat), lon: parseFloat(lon) };
        onLocationSelect(location);
        setMapCenter([location.lat, location.lon]);

        // Move map to search result
        if (mapRef.current) {
          mapRef.current.setView([location.lat, location.lon], 13);
        }

        // Fix map to bottom
        setIsMapFixed(true);

        // Scroll to map position
        setTimeout(() => {
          const mapElement = document.getElementById('fixed-map');
          if (mapElement) {
            mapElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
          }
        }, 100);
      }
    } catch (error) {
      console.error('Error searching location:', error);
    } finally {
      setIsMapLoading(false);
    }
  };

  // Fetch top-3 suggestions as user types (debounced)
  useEffect(() => {
    const q = searchQuery.trim();
    if (!q) {
      setSuggestions([]);
      return;
    }

    const handler = setTimeout(async () => {
      try {
        setIsSuggesting(true);
        if (suggestAbortRef.current) {
          suggestAbortRef.current.abort();
        }
        const controller = new AbortController();
        suggestAbortRef.current = controller;
        const resp = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=3`, {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json'
          }
        });
        const data = await resp.json();
        if (Array.isArray(data)) {
          setSuggestions(data.slice(0, 3));
        } else {
          setSuggestions([]);
        }
      } catch (e) {
        if ((e as any)?.name !== 'AbortError') {
          console.error('Error fetching suggestions:', e);
        }
      } finally {
        setIsSuggesting(false);
      }
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const handleSelectSuggestion = async (s: { display_name: string; lat: string; lon: string }) => {
    const location = { lat: parseFloat(s.lat), lon: parseFloat(s.lon) };
    onLocationSelect(location);
    setSearchQuery(s.display_name);
    setSuggestions([]);
    setMapCenter([location.lat, location.lon]);
    if (mapRef.current) {
      mapRef.current.setView([location.lat, location.lon], 13);
    }
    setIsMapFixed(true);
    setTimeout(() => {
      const mapElement = document.getElementById('fixed-map');
      if (mapElement) {
        mapElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }, 100);
  };

  // Handle Enter key search
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Handle start date change
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onStartDateSelect(e.target.value);
  };

  // Handle end date change
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onEndDateSelect(e.target.value);
  };

  // Reset map position
  const resetMapPosition = () => {
    setIsMapFixed(false);
  };

  // Handle map click - show confirmation instead of immediate selection
  const handleMapClick = async (location: Location) => {
    // Move map to clicked location
    setMapCenter([location.lat, location.lon]);
    if (mapRef.current) {
      mapRef.current.setView([location.lat, location.lon], 15);
    }

    // Get address from coordinates
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lon}&addressdetails=1`
      );
      const data = await response.json();
      const address = data.display_name || `${location.lat.toFixed(4)}, ${location.lon.toFixed(4)}`;

      setPendingLocation(location);
      setPendingAddress(address);
      setShowLocationConfirm(true);
    } catch (error) {
      console.error('Error getting address:', error);
      setPendingLocation(location);
      setPendingAddress(`${location.lat.toFixed(4)}, ${location.lon.toFixed(4)}`);
      setShowLocationConfirm(true);
    }
  };

  // Handle map style change
  const handleMapStyleChange = (styleId: string) => {
    const style = MAP_STYLES.find(s => s.id === styleId);
    if (style) {
      setMapStyle(style);
    }
  };

  return (
    <div className="w-full max-w-8xl mx-auto p-3">
      <div className="flex gap-6 items-start">
        {/* Left column */}
        <div className="w-1/3">
          {/* Search and date selection area */}
          <div className="glass-card rounded-2xl p-6 mb-6">
            <div className="flex flex-col gap-4">
              {/* Row 1: Search label + input + search button */}
              <div className="flex-1 flex gap-3 items-end">
                <div className="flex-1 relative">
                  <label htmlFor="search-input" className="block text-sm font-semibold text-gray-700 mb-2">
                    🔍 Search Location
                  </label>
                  <input
                    id="search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter city name or address..."
                    className="search-input"
                  />
                  {searchQuery && suggestions.length > 0 && (
                    <div className="absolute z-20 mt-2 w-full bg-white/80 backdrop-blur rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                      {suggestions.map((s, idx) => (
                        <button
                          key={`${s.lat}-${s.lon}-${idx}`}
                          onClick={() => handleSelectSuggestion(s)}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                          title={s.display_name}
                        >
                          <div className="text-sm text-gray-800 truncate">{s.display_name}</div>
                        </button>
                      ))}
                    </div>
                  )}
                  {isSuggesting && (
                    <div className="absolute right-3 top-10 text-xs text-gray-500">Searching...</div>
                  )}
                </div>
                <div className="flex items-end gap-2">
                  <button
                    onClick={handleSearch}
                    disabled={isMapLoading}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isMapLoading ? '⏳ Searching...' : '🔍 Search'}
                  </button>
                </div>
              </div>
              {/* Row 2: Start/End Date */}
              <div className="w-full flex flex-col lg:flex-row items-center gap-3 min-w-0">
                <div className="w-full min-w-0">
                  <label htmlFor="start-date-picker" className="block text-sm font-semibold text-gray-700 mb-2">
                    📅 Start Date
                  </label>
                  <input
                    id="start-date-picker"
                    type="date"
                    value={startDate || ''}
                    onChange={handleStartDateChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div className="w-full min-w-0">
                  <label htmlFor="end-date-picker" className="block text-sm font-semibold text-gray-700 mb-2">
                    📅 End Date
                  </label>
                  <input
                    id="end-date-picker"
                    type="date"
                    value={endDate || ''}
                    onChange={handleEndDateChange}
                    min={startDate}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Advanced toggle */}
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setShowAdvanced(v => !v)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 border-gray-200 bg-white hover:bg-gray-50 transition-colors"
                aria-expanded={showAdvanced}
                aria-controls="advanced-panel"
              >
                <span className="font-semibold text-gray-800">⚙️ Advanced</span>
                <span className={`transform transition-transform ${showAdvanced ? 'rotate-180' : ''}`}>▾</span>
              </button>
              {showAdvanced && (
                <div id="advanced-panel" className="mt-4">
                  <div className="rounded-2xl border-2 border-gray-200 bg-white/70 p-4">
                    <div className="flex flex-col lg:flex-row gap-4 items-start">
                      {/* Map style selector */}
                      <div className="bg-gray-50 rounded-xl p-4 flex-1 w-full lg:basis-2/3 lg:flex-[2]">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          🎨 Map Style
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {MAP_STYLES.map((style) => (
                            <button
                              key={style.id}
                              onClick={() => handleMapStyleChange(style.id)}
                              className={`w-full map-style-btn ${mapStyle.id === style.id ? 'active' : 'inactive'
                                }`}
                            >
                              <span className="mr-2">{style.icon}</span>
                              <span className="hidden sm:inline">{style.name}</span>
                              <span className="sm:hidden">{style.icon}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Historical years selection */}
                      <div className="bg-gray-50 rounded-xl p-4 w-full lg:basis-1/3 lg:flex-[1] lg:max-w-sm lg:ml-auto">
                        <label
                          htmlFor="trend-years-select"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          📊 Historical Analysis Period
                        </label>
                        <div className="flex">
                          <select
                            id="trend-years-select"
                            value={trendYears}
                            onChange={(e) => onTrendYearsChange(parseInt(e.target.value))}
                            className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-200"
                          >
                            {[1, 3, 5, 10, 15, 20, 25, 30].map((year) => (
                              <option key={year} value={year}>
                                {year} years
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="text-sm text-gray-600 mt-2">
                          Currently analyzing trends for the past <span className="font-bold text-blue-600">{trendYears}</span> years
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Selected location and date information */}
            {selectedLocation && (
              <div className="mt-6 p-4 card-gradient">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">📍</span>
                    <span className="text-sm font-semibold text-blue-800">
                      Selected location: Latitude {selectedLocation.lat.toFixed(4)}, Longitude {selectedLocation.lon.toFixed(4)}
                    </span>
                  </div>
                  {startDate && (
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">📅</span>
                      <span className="text-sm font-semibold text-blue-800">
                        Analysis period: {startDate} {endDate && endDate !== startDate ? `to ${endDate}` : ''}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="w-2/3">
          {/* Map area */}
          <div
            id="fixed-map"
            className={`card-modern overflow-hidden ${isMapFixed
              ? 'fixed bottom-0 left-0 right-0 z-40 mx-0 rounded-t-2xl'
              : 'relative'
              }`}
          >
            <div className="p-4 border-b border-white/25 flex items-center justify-between bg-white/15 backdrop-blur-xl">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                🗺️ Interactive Map
                <span className="text-sm font-normal text-gray-500">
                  (Click anywhere on the map to select analysis location)
                </span>
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Style: {mapStyle.icon} {mapStyle.name}
                </span>
                <button
                  onClick={() => getCurrentLocation(true)}
                  disabled={isLocating}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed px-2 py-1 text-xs"
                  title="Use current location"
                >
                  {isLocating ? '⏳ Locating...' : '📍 Current Location'}
                </button>
                {isMapFixed && (
                  <button
                    onClick={resetMapPosition}
                    className="btn-secondary"
                    title="Reset map position"
                  >
                    ↕️ Reset Position
                  </button>
                )}
              </div>
            </div>
            <div
              className="relative"
              style={{
                height: isMapFixed ? '60vh' : '500px',
                maxHeight: isMapFixed ? '500px' : 'none'
              }}
            >
              {isMapLoading && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                  <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <span className="text-sm text-gray-600">Loading map...</span>
                  </div>
                </div>
              )}
              <MapContainer
                center={mapCenter}
                zoom={13}
                className="w-full h-full rounded-b-2xl"
                ref={mapRef}
              >
                <TileLayer
                  attribution={mapStyle.attribution}
                  url={mapStyle.url}
                />

                {/* Map click handler */}
                <MapClickHandler onLocationSelect={handleMapClick} />

                {/* User's current location marker */}
                {userLocation && (
                  <Marker
                    position={[userLocation.lat, userLocation.lon]}
                    icon={createUserLocationIcon()}
                  />
                )}

                {/* Selected location marker with custom icon */}
                {selectedLocation && (
                  <Marker
                    position={[selectedLocation.lat, selectedLocation.lon]}
                    icon={createCustomIcon('#3B82F6', false)}
                  />
                )}

                {/* Pending location marker (for confirmation) */}
                {pendingLocation && (
                  <Marker
                    position={[pendingLocation.lat, pendingLocation.lon]}
                    icon={createCustomIcon('#F59E0B', true)}
                  />
                )}
              </MapContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Usage tips - hidden when map is fixed */}
      {!isMapFixed && (
        <div className="mt-6 card-gradient p-6">
          <div className="flex items-start gap-4">
            <div className="text-3xl">💡</div>
            <div>
              <h4 className="font-bold text-gray-800 mb-3 text-lg">Usage Tips</h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">•</span>
                  Click anywhere on the map to select an analysis location
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">•</span>
                  Use the search box to enter city name or address for quick positioning
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">•</span>
                  Use the "Current Location" button to automatically detect your position
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">•</span>
                  Select the date range you want to analyze (start date and end date)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">•</span>
                  If only start date is selected, single-day data will be analyzed
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">•</span>
                  After selection, the system will automatically load historical weather data for that location
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Location confirmation modal - with backdrop and highest z-index */}
      {showLocationConfirm && pendingLocation && (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-4">
          {/* Backdrop overlay */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={cancelLocationSelection}
          ></div>

          {/* Modal content */}
          <div className="relative z-[10000] max-w-md w-full mx-4">
            <div className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-200 animate-slide-down relative">
              {/* Close button */}
              <button
                onClick={cancelLocationSelection}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
                title="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="text-center">
                <div className="text-4xl mb-4">📍</div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Confirm Location Selection
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>Coordinates:</strong>
                  </div>
                  <div className="text-sm font-mono text-gray-800">
                    Latitude: {pendingLocation.lat.toFixed(6)}<br />
                    Longitude: {pendingLocation.lon.toFixed(6)}
                  </div>
                  <div className="text-sm text-gray-600 mt-3">
                    <strong>Address:</strong>
                  </div>
                  <div className="text-sm text-gray-800 mt-1 max-h-20 overflow-y-auto">
                    {pendingAddress}
                  </div>
                </div>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={cancelLocationSelection}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmLocationSelection}
                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors font-medium"
                  >
                    Confirm Selection
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;