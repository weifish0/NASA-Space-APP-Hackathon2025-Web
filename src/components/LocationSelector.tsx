import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Location } from '../types';

// 修復 Leaflet 圖標問題
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

// 地圖點擊事件處理組件
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
  const [mapCenter, setMapCenter] = useState<[number, number]>([25.0330, 121.5654]); // 台北市
  const [isMapFixed, setIsMapFixed] = useState(false);
  const mapRef = useRef<L.Map>(null);

  // 通知父組件地圖固定狀態變化
  useEffect(() => {
    onMapFixedChange?.(isMapFixed);
  }, [isMapFixed, onMapFixedChange]);

  // 處理搜尋
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      // 使用 Nominatim API 進行地理編碼
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`
      );
      const data = await response.json();
      
      if (data.length > 0) {
        const { lat, lon } = data[0];
        const location = { lat: parseFloat(lat), lon: parseFloat(lon) };
        onLocationSelect(location);
        setMapCenter([location.lat, location.lon]);
        
        // 移動地圖到搜尋結果
        if (mapRef.current) {
          mapRef.current.setView([location.lat, location.lon], 13);
        }
        
        // 固定地圖到底部
        setIsMapFixed(true);
        
        // 滾動到地圖位置
        setTimeout(() => {
          const mapElement = document.getElementById('fixed-map');
          if (mapElement) {
            mapElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
          }
        }, 100);
      }
    } catch (error) {
      console.error('搜尋地點時發生錯誤:', error);
    }
  };

  // 處理 Enter 鍵搜尋
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 處理開始日期變更
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onStartDateSelect(e.target.value);
  };

  // 處理結束日期變更
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onEndDateSelect(e.target.value);
  };

  // 重置地圖位置
  const resetMapPosition = () => {
    setIsMapFixed(false);
  };

  // 處理地圖點擊
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
      {/* 標題和說明 */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          🌍 選擇分析地點
        </h2>
        <p className="text-gray-600">
          點擊地圖或搜尋來選擇您想要分析天氣風險的地點
        </p>
      </div>

      {/* 搜尋和日期選擇區域 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="flex-1 flex gap-3">
            <div className="flex-1">
              <label htmlFor="search-input" className="block text-sm font-medium text-gray-700 mb-2">
                搜尋地點
              </label>
              <input
                id="search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="輸入城市名稱或地址..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                🔍 搜尋
              </button>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row items-center gap-3">
            <div>
              <label htmlFor="start-date-picker" className="block text-sm font-medium text-gray-700 mb-2">
                開始日期
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
                結束日期
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

        {/* ✅ 歷史年數選擇，下拉式選單版本 */}
        <div className="mt-4 text-center">
          <label
            htmlFor="trend-years-select"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            歷史年數
          </label>
          <select
            id="trend-years-select"
            value={trendYears}
            onChange={(e) => onTrendYearsChange(parseInt(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            {[1, 3, 5, 10, 15, 20, 25, 30].map((year) => (
              <option key={year} value={year}>
                {year} 年
              </option>
            ))}
          </select>
          <div className="text-xs text-gray-500 mt-1">
            目前分析過去 <span className="font-semibold text-blue-600">{trendYears}</span> 年的趨勢
          </div>
        </div>
        
        {/* 選中的位置和日期資訊 */}
        {selectedLocation && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-blue-600">📍</span>
                <span className="text-sm font-medium text-blue-800">
                  已選擇位置: 緯度 {selectedLocation.lat.toFixed(4)}, 經度 {selectedLocation.lon.toFixed(4)}
                </span>
              </div>
              {startDate && (
                <div className="flex items-center gap-2">
                  <span className="text-blue-600">📅</span>
                  <span className="text-sm font-medium text-blue-800">
                    分析期間: {startDate} {endDate && endDate !== startDate ? `至 ${endDate}` : ''}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 地圖區域 - 根據狀態決定是否固定 */}
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
            🗺️ 互動地圖
            <span className="text-sm font-normal text-gray-500">
              (點擊地圖上的任意位置來選擇地點)
            </span>
          </h3>
          {isMapFixed && (
            <button
              onClick={resetMapPosition}
              className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
              title="重置地圖位置"
            >
              ↕️ 重置位置
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
            
            {/* 地圖點擊處理 */}
            <MapClickHandler onLocationSelect={handleMapClick} />
            
            {/* 選中的位置標記 */}
            {selectedLocation && (
              <Marker position={[selectedLocation.lat, selectedLocation.lon]} />
            )}
          </MapContainer>
        </div>
      </div>

      {/* 使用提示 - 當地圖固定時隱藏 */}
      {!isMapFixed && (
        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="text-blue-500 text-xl">💡</div>
            <div>
              <h4 className="font-medium text-gray-800 mb-1">使用提示</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 在地圖上點擊任意位置來選擇分析地點</li>
                <li>• 使用搜尋框輸入城市名稱或地址進行快速定位</li>
                <li>• 選擇您想要分析的日期範圍（開始日期和結束日期）</li>
                <li>• 如果只選擇開始日期，將分析單日數據</li>
                <li>• 選擇完成後，系統將自動載入該地點的歷史同期天氣數據</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
