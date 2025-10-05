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
  const [mapCenter, setMapCenter] = useState<[number, number]>([25.0330, 121.5654]); // Taipei
  const [isMapFixed, setIsMapFixed] = useState(false);
  const mapRef = useRef<L.Map>(null);

  // Notify parent component of map fixed state change
  useEffect(() => {
    onMapFixedChange?.(isMapFixed);
  }, [isMapFixed, onMapFixedChange]);

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

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
    }
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

  // Handle map click
  const handleMapClick = (location: Location) => {
    onLocationSelect(location);
    if (!isMapFixed) {
      setIsMapFixed(true);
      setTimeout(() => {
        const mapElement = document.getElementById('fixed-map');
        if (mapElement) {
          mapElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      }, 100);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Title and description */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          🌍 Select Analysis Location
        </h2>
        <p className="text-gray-600">
          Click on the map or search to select the location for weather risk analysis
        </p>
      </div>

      {/* Search and date selection area */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="flex-1 flex gap-3">
            <div className="flex-1">
              <label htmlFor="search-input" className="block text-sm font-medium text-gray-700 mb-2">
                Search Location
              </label>
              <input
                id="search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter city name or address..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                🔍 Search
              </button>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row items-center gap-3">
            <div>
              <label htmlFor="start-date-picker" className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                id="start-date-picker"
                type="date"
                value={startDate || ''}
                onChange={handleStartDateChange}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="end-date-picker" className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                id="end-date-picker"
                type="date"
                value={endDate || ''}
                onChange={handleEndDateChange}
                min={startDate}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* ✅ Historical years selection, dropdown version */}
        <div className="mt-4 text-center">
          <label
            htmlFor="trend-years-select"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Historical Years
          </label>
          <select
            id="trend-years-select"
            value={trendYears}
            onChange={(e) => onTrendYearsChange(parseInt(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            {[1, 3, 5, 10, 15, 20, 25, 30].map((year) => (
              <option key={year} value={year}>
                {year} years
              </option>
            ))}
          </select>
          <div className="text-xs text-gray-500 mt-1">
            Currently analyzing trends for the past <span className="font-semibold text-blue-600">{trendYears}</span> years
          </div>
        </div>
        
        {/* Selected location and date information */}
        {selectedLocation && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-blue-600">📍</span>
                <span className="text-sm font-medium text-blue-800">
                  Selected location: Latitude {selectedLocation.lat.toFixed(4)}, Longitude {selectedLocation.lon.toFixed(4)}
                </span>
              </div>
              {startDate && (
                <div className="flex items-center gap-2">
                  <span className="text-blue-600">📅</span>
                  <span className="text-sm font-medium text-blue-800">
                    Analysis period: {startDate} {endDate && endDate !== startDate ? `to ${endDate}` : ''}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Map area - determine if fixed based on state */}
      <div 
        id="fixed-map"
        className={`bg-white rounded-lg shadow-md overflow-hidden ${
          isMapFixed 
            ? 'fixed bottom-0 left-0 right-0 z-40 mx-0 rounded-t-lg' 
            : 'relative'
        }`}
      >
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            🗺️ Interactive Map
            <span className="text-sm font-normal text-gray-500">
              (Click anywhere on the map to select a location)
            </span>
          </h3>
          {isMapFixed && (
            <button
              onClick={resetMapPosition}
              className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
              title="Reset map position"
            >
              ↕️ Reset Position
            </button>
          )}
        </div>
        <div 
          className="relative" 
          style={{ 
            height: isMapFixed ? '60vh' : '500px',
            maxHeight: isMapFixed ? '500px' : 'none'
          }}
        >
          <MapContainer
            center={mapCenter}
            zoom={13}
            className="w-full h-full rounded-b-lg"
            ref={mapRef}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Map click handler */}
            <MapClickHandler onLocationSelect={handleMapClick} />
            
            {/* Selected location marker */}
            {selectedLocation && (
              <Marker position={[selectedLocation.lat, selectedLocation.lon]} />
            )}
          </MapContainer>
        </div>
      </div>

      {/* Usage tips - hidden when map is fixed */}
      {!isMapFixed && (
        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="text-blue-500 text-xl">💡</div>
            <div>
              <h4 className="font-medium text-gray-800 mb-1">Usage Tips</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Click anywhere on the map to select an analysis location</li>
                <li>• Use the search box to enter city name or address for quick positioning</li>
                <li>• Select the date range you want to analyze (start date and end date)</li>
                <li>• If only start date is selected, single-day data will be analyzed</li>
                <li>• After selection, the system will automatically load historical weather data for that location</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
