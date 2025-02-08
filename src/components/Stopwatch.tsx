import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Flag } from 'lucide-react';
import type { Stopwatch as StopwatchType } from '../types';

interface LapTime {
  id: string;
  time: string;
  splitTime: string;
}

const Stopwatch: React.FC = () => {
  const [stopwatch, setStopwatch] = useState<StopwatchType>({
    time: 0,
    isRunning: false,
    laps: [],
  });
  const [lapTimes, setLapTimes] = useState<LapTime[]>([]);
  const [lastLapTime, setLastLapTime] = useState(0);

  const formatTime = useCallback((ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10);

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds
      .toString()
      .padStart(2, '0')}`;
  }, []);

  const startStopwatch = () => {
    if (!stopwatch.isRunning) {
      setStopwatch(prev => ({ ...prev, isRunning: true }));
      if (stopwatch.time === 0) {
        setLastLapTime(Date.now());
      }
    }
  };

  const pauseStopwatch = () => {
    setStopwatch(prev => ({ ...prev, isRunning: false }));
  };

  const resetStopwatch = () => {
    setStopwatch({
      time: 0,
      isRunning: false,
      laps: [],
    });
    setLapTimes([]);
    setLastLapTime(0);
  };

  const addLap = () => {
    if (stopwatch.isRunning) {
      const currentTime = Date.now();
      const lapDuration = currentTime - lastLapTime;
      setLapTimes(prev => [
        ...prev,
        {
          id: crypto.randomUUID(),
          time: formatTime(stopwatch.time),
          splitTime: formatTime(lapDuration),
        },
      ]);
      setLastLapTime(currentTime);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (stopwatch.isRunning) {
      const startTime = Date.now() - stopwatch.time;
      interval = setInterval(() => {
        setStopwatch(prev => ({
          ...prev,
          time: Date.now() - startTime,
        }));
      }, 10);
    }

    return () => clearInterval(interval);
  }, [stopwatch.isRunning]);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Stopwatch</h2>

      <div className="flex flex-col items-center justify-center space-y-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <div className="text-6xl font-mono font-bold text-gray-900 dark:text-white tracking-wider">
            {formatTime(stopwatch.time)}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {!stopwatch.isRunning ? (
            <button
              onClick={startStopwatch}
              className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Play className="h-5 w-5 mr-2" />
              Start
            </button>
          ) : (
            <button
              onClick={pauseStopwatch}
              className="flex items-center px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              <Pause className="h-5 w-5 mr-2" />
              Pause
            </button>
          )}

          <button
            onClick={resetStopwatch}
            className="flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            Reset
          </button>

          <button
            onClick={addLap}
            disabled={!stopwatch.isRunning}
            className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Flag className="h-5 w-5 mr-2" />
            Lap
          </button>
        </div>

        {lapTimes.length > 0 && (
          <div className="w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Lap Times
            </h3>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Lap
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Total Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Split Time
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {lapTimes.map((lap, index) => (
                    <tr key={lap.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {lapTimes.length - index}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-mono">
                        {lap.time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-mono">
                        {lap.splitTime}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stopwatch;