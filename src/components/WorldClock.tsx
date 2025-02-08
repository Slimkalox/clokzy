import React, { useState, useEffect } from 'react';
import { Search, Plus, Sun, Moon, Trash2, X, Check, Clock2 as Clock24, Clock12, ArrowRight } from 'lucide-react';
import type { TimeZone } from '../types';

// Comprehensive time zones data
const TIME_ZONES = [
  // North America
  { name: 'America/New_York', city: 'New York', country: 'United States' },
  { name: 'America/Los_Angeles', city: 'Los Angeles', country: 'United States' },
  { name: 'America/Chicago', city: 'Chicago', country: 'United States' },
  { name: 'America/Denver', city: 'Denver', country: 'United States' },
  { name: 'America/Phoenix', city: 'Phoenix', country: 'United States' },
  { name: 'America/Toronto', city: 'Toronto', country: 'Canada' },
  { name: 'America/Vancouver', city: 'Vancouver', country: 'Canada' },
  { name: 'America/Montreal', city: 'Montreal', country: 'Canada' },
  { name: 'America/Mexico_City', city: 'Mexico City', country: 'Mexico' },
  
  // South America
  { name: 'America/Sao_Paulo', city: 'São Paulo', country: 'Brazil' },
  { name: 'America/Buenos_Aires', city: 'Buenos Aires', country: 'Argentina' },
  { name: 'America/Santiago', city: 'Santiago', country: 'Chile' },
  { name: 'America/Lima', city: 'Lima', country: 'Peru' },
  { name: 'America/Bogota', city: 'Bogota', country: 'Colombia' },
  
  // Europe
  { name: 'Europe/London', city: 'London', country: 'United Kingdom' },
  { name: 'Europe/Paris', city: 'Paris', country: 'France' },
  { name: 'Europe/Berlin', city: 'Berlin', country: 'Germany' },
  { name: 'Europe/Rome', city: 'Rome', country: 'Italy' },
  { name: 'Europe/Madrid', city: 'Madrid', country: 'Spain' },
  { name: 'Europe/Amsterdam', city: 'Amsterdam', country: 'Netherlands' },
  { name: 'Europe/Brussels', city: 'Brussels', country: 'Belgium' },
  { name: 'Europe/Vienna', city: 'Vienna', country: 'Austria' },
  { name: 'Europe/Moscow', city: 'Moscow', country: 'Russia' },
  { name: 'Europe/Stockholm', city: 'Stockholm', country: 'Sweden' },
  { name: 'Europe/Oslo', city: 'Oslo', country: 'Norway' },
  { name: 'Europe/Copenhagen', city: 'Copenhagen', country: 'Denmark' },
  { name: 'Europe/Dublin', city: 'Dublin', country: 'Ireland' },
  { name: 'Europe/Helsinki', city: 'Helsinki', country: 'Finland' },
  { name: 'Europe/Warsaw', city: 'Warsaw', country: 'Poland' },
  { name: 'Europe/Prague', city: 'Prague', country: 'Czech Republic' },
  
  // Asia
  { name: 'Asia/Tokyo', city: 'Tokyo', country: 'Japan' },
  { name: 'Asia/Shanghai', city: 'Shanghai', country: 'China' },
  { name: 'Asia/Hong_Kong', city: 'Hong Kong', country: 'China' },
  { name: 'Asia/Singapore', city: 'Singapore', country: 'Singapore' },
  { name: 'Asia/Seoul', city: 'Seoul', country: 'South Korea' },
  { name: 'Asia/Dubai', city: 'Dubai', country: 'UAE' },
  { name: 'Asia/Bangkok', city: 'Bangkok', country: 'Thailand' },
  { name: 'Asia/Taipei', city: 'Taipei', country: 'Taiwan' },
  { name: 'Asia/Manila', city: 'Manila', country: 'Philippines' },
  { name: 'Asia/Jakarta', city: 'Jakarta', country: 'Indonesia' },
  { name: 'Asia/Kuala_Lumpur', city: 'Kuala Lumpur', country: 'Malaysia' },
  { name: 'Asia/Kolkata', city: 'Mumbai', country: 'India' },
  { name: 'Asia/Delhi', city: 'New Delhi', country: 'India' },
  { name: 'Asia/Karachi', city: 'Karachi', country: 'Pakistan' },
  { name: 'Asia/Dhaka', city: 'Dhaka', country: 'Bangladesh' },
  
  // Oceania
  { name: 'Australia/Sydney', city: 'Sydney', country: 'Australia' },
  { name: 'Australia/Melbourne', city: 'Melbourne', country: 'Australia' },
  { name: 'Australia/Brisbane', city: 'Brisbane', country: 'Australia' },
  { name: 'Australia/Perth', city: 'Perth', country: 'Australia' },
  { name: 'Pacific/Auckland', city: 'Auckland', country: 'New Zealand' },
  { name: 'Pacific/Fiji', city: 'Suva', country: 'Fiji' },
  
  // Africa
  { name: 'Africa/Cairo', city: 'Cairo', country: 'Egypt' },
  { name: 'Africa/Lagos', city: 'Lagos', country: 'Nigeria' },
  { name: 'Africa/Johannesburg', city: 'Johannesburg', country: 'South Africa' },
  { name: 'Africa/Nairobi', city: 'Nairobi', country: 'Kenya' },
  { name: 'Africa/Casablanca', city: 'Casablanca', country: 'Morocco' },
];

const WorldClock: React.FC = () => {
  const [timeZones, setTimeZones] = useState<TimeZone[]>([
    {
      id: '1',
      name: 'America/New_York',
      offset: '-05:00',
      city: 'New York',
      country: 'United States',
      isDaytime: true,
      currentTime: new Date().toLocaleTimeString('en-US', { timeZone: 'America/New_York' })
    },
    {
      id: '2',
      name: 'Europe/London',
      offset: '+00:00',
      city: 'London',
      country: 'United Kingdom',
      isDaytime: true,
      currentTime: new Date().toLocaleTimeString('en-US', { timeZone: 'Europe/London' })
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTimeZones, setSelectedTimeZones] = useState<Set<string>>(new Set());
  const [filteredTimeZones, setFilteredTimeZones] = useState(TIME_ZONES);
  const [use24Hour, setUse24Hour] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [compareZone1, setCompareZone1] = useState<string | null>(null);
  const [compareZone2, setCompareZone2] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeZones(zones => 
        zones.map(zone => {
          const now = new Date();
          const timeInZone = new Date(now.toLocaleString('en-US', { timeZone: zone.name }));
          const hours = timeInZone.getHours();
          return {
            ...zone,
            isDaytime: hours >= 6 && hours < 18,
            currentTime: now.toLocaleTimeString('en-US', { 
              timeZone: zone.name,
              hour12: !use24Hour,
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })
          };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [use24Hour]);

  useEffect(() => {
    const filtered = TIME_ZONES.filter(tz => 
      tz.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tz.country.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTimeZones(filtered);
  }, [searchQuery]);

  const removeTimeZone = (id: string) => {
    setTimeZones(zones => zones.filter(zone => zone.id !== id));
    if (compareZone1 === id) setCompareZone1(null);
    if (compareZone2 === id) setCompareZone2(null);
  };

  const toggleTimeZone = (tz: typeof TIME_ZONES[0]) => {
    setSelectedTimeZones(prev => {
      const next = new Set(prev);
      if (next.has(tz.name)) {
        next.delete(tz.name);
      } else {
        next.add(tz.name);
      }
      return next;
    });
  };

  const addTimeZones = () => {
    const now = new Date();
    const newTimeZones = Array.from(selectedTimeZones).map(tzName => {
      const tzInfo = TIME_ZONES.find(tz => tz.name === tzName)!;
      const timeInZone = new Date(now.toLocaleString('en-US', { timeZone: tzName }));
      const hours = timeInZone.getHours();
      const offset = -now.getTimezoneOffset() / 60;
      const offsetStr = offset >= 0 ? `+${offset.toString().padStart(2, '0')}:00` : `${offset.toString().padStart(2, '0')}:00`;

      return {
        id: crypto.randomUUID(),
        name: tzName,
        offset: offsetStr,
        city: tzInfo.city,
        country: tzInfo.country,
        isDaytime: hours >= 6 && hours < 18,
        currentTime: now.toLocaleTimeString('en-US', { 
          timeZone: tzName,
          hour12: !use24Hour,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      };
    });

    setTimeZones(prev => [...prev, ...newTimeZones]);
    setShowAddModal(false);
    setSelectedTimeZones(new Set());
    setSearchQuery('');
  };

  const getTimeDifference = (zone1: TimeZone, zone2: TimeZone) => {
    const now = new Date();
    const time1 = new Date(now.toLocaleString('en-US', { timeZone: zone1.name }));
    const time2 = new Date(now.toLocaleString('en-US', { timeZone: zone2.name }));
    const diffHours = (time2.getTime() - time1.getTime()) / (1000 * 60 * 60);
    const hours = Math.floor(Math.abs(diffHours));
    const minutes = Math.floor((Math.abs(diffHours) - hours) * 60);
    return `${diffHours >= 0 ? '+' : '-'}${hours}h ${minutes}m`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative flex-1 mr-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search for a city or time zone..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="h-5 w-5 text-gray-400 hover:text-indigo-600" />
          </button>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => setUse24Hour(!use24Hour)}
            className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {use24Hour ? <Clock24 className="h-5 w-5 mr-2" /> : <Clock12 className="h-5 w-5 mr-2" />}
            {use24Hour ? '24h' : '12h'}
          </button>
          <button
            onClick={() => setShowComparison(!showComparison)}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              showComparison
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Compare Times
          </button>
        </div>
      </div>

      {showComparison && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Time Comparison
          </h3>
          <div className="flex items-center space-x-4">
            <select
              value={compareZone1 || ''}
              onChange={(e) => setCompareZone1(e.target.value || null)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Select first time zone</option>
              {timeZones.map((zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone.city}, {zone.country}
                </option>
              ))}
            </select>
            <ArrowRight className="h-6 w-6 text-gray-400" />
            <select
              value={compareZone2 || ''}
              onChange={(e) => setCompareZone2(e.target.value || null)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Select second time zone</option>
              {timeZones.map((zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone.city}, {zone.country}
                </option>
              ))}
            </select>
          </div>
          {compareZone1 && compareZone2 && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              {(() => {
                const zone1 = timeZones.find((z) => z.id === compareZone1)!;
                const zone2 = timeZones.find((z) => z.id === compareZone2)!;
                return (
                  <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      When it's <span className="font-semibold text-gray-900 dark:text-white">{zone1.currentTime}</span> in {zone1.city},
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      it's <span className="font-semibold text-gray-900 dark:text-white">{zone2.currentTime}</span> in {zone2.city}
                    </p>
                    <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mt-2">
                      Time difference: {getTimeDifference(zone1, zone2)}
                    </p>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Add Time Zones
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Search Location
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for cities..."
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div className="max-h-60 overflow-y-auto">
                {filteredTimeZones.map((tz) => (
                  <button
                    key={tz.name}
                    onClick={() => toggleTimeZone(tz)}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md flex items-center space-x-3 ${
                      selectedTimeZones.has(tz.name)
                        ? 'bg-indigo-50 dark:bg-indigo-900'
                        : ''
                    }`}
                  >
                    <div className={`w-4 h-4 border rounded ${
                      selectedTimeZones.has(tz.name)
                        ? 'bg-indigo-600 border-indigo-600'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      {selectedTimeZones.has(tz.name) && (
                        <Check className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {tz.city}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {tz.country}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedTimeZones.size} time zone{selectedTimeZones.size !== 1 ? 's' : ''} selected
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addTimeZones}
                    disabled={selectedTimeZones.size === 0}
                    className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Add Selected
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {timeZones.map((zone) => (
          <div
            key={zone.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-transform hover:scale-102"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {zone.city}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{zone.country}</p>
              </div>
              <div className="flex items-center space-x-2">
                {zone.isDaytime ? (
                  <Sun className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Moon className="h-5 w-5 text-blue-500" />
                )}
                <button
                  onClick={() => removeTimeZone(zone.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {zone.currentTime}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              UTC {zone.offset}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorldClock;