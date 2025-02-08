import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Flag, Check } from 'lucide-react';
import type { Timer as TimerType } from '../types';

interface LapTime {
  id: string;
  time: string;
  duration: string;
}

const Timer: React.FC = () => {
  const [timer, setTimer] = useState<TimerType>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    isRunning: false,
    progress: 0,
  });
  const [inputTimer, setInputTimer] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [lapTimes, setLapTimes] = useState<LapTime[]>([]);
  const [lastLapTime, setLastLapTime] = useState(0);

  const startTimer = () => {
    if (!timer.isRunning) {
      setTimer(prev => ({ ...prev, isRunning: true }));
      setLastLapTime(Date.now());
    }
  };

  const pauseTimer = () => {
    setTimer(prev => ({ ...prev, isRunning: false }));
  };

  const resetTimer = () => {
    setTimer({
      hours: 0,
      minutes: 0,
      seconds: 0,
      isRunning: false,
      progress: 0,
    });
    setInputTimer({
      hours: 0,
      minutes: 0,
      seconds: 0,
    });
    setTotalSeconds(0);
    setRemainingSeconds(0);
    setLapTimes([]);
    setLastLapTime(0);
  };

  const updateInputTime = (field: 'hours' | 'minutes' | 'seconds', value: string) => {
    const numValue = Math.max(0, Math.min(field === 'hours' ? 99 : 59, parseInt(value) || 0));
    setInputTimer(prev => ({ ...prev, [field]: numValue }));
  };

  const setTimerFromInput = () => {
    const seconds = inputTimer.hours * 3600 + inputTimer.minutes * 60 + inputTimer.seconds;
    if (seconds > 0) {
      setTimer(prev => ({ ...prev, ...inputTimer }));
      setTotalSeconds(seconds);
      setRemainingSeconds(seconds);
    }
  };

  const formatTime = useCallback((totalSecs: number) => {
    const hours = Math.floor(totalSecs / 3600);
    const minutes = Math.floor((totalSecs % 3600) / 60);
    const seconds = totalSecs % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  const addLapTime = () => {
    if (timer.isRunning) {
      const currentTime = Date.now();
      const lapDuration = (currentTime - lastLapTime) / 1000; // Convert to seconds
      setLapTimes(prev => [...prev, {
        id: crypto.randomUUID(),
        time: formatTime(Math.floor(totalSeconds - remainingSeconds)),
        duration: formatTime(Math.floor(lapDuration))
      }]);
      setLastLapTime(currentTime);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timer.isRunning && remainingSeconds > 0) {
      interval = setInterval(() => {
        setRemainingSeconds(prev => {
          if (prev <= 1) {
            setTimer(prevTimer => ({ ...prevTimer, isRunning: false }));
            if (Notification.permission === 'default') {
              Notification.requestPermission();
            }
            if (Notification.permission === 'granted') {
              new Notification('Timer Complete!', {
                body: 'Your timer has finished.',
                icon: '/timer-icon.png'
              });
            }
            return 0;
          }
          
          const newRemaining = prev - 1;
          const progress = ((totalSeconds - newRemaining) / totalSeconds) * 100;
          setTimer(prevTimer => ({ ...prevTimer, progress }));
          return newRemaining;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timer.isRunning, remainingSeconds, totalSeconds]);

  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timer.progress / 100) * circumference;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Timer</h2>
      
      <div className="flex flex-col items-center justify-center space-y-8">
        <div className="relative">
          <svg className="transform -rotate-90 w-72 h-72">
            <circle
              cx="144"
              cy="144"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="144"
              cy="144"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="text-indigo-600 dark:text-indigo-400 transition-all duration-300 ease-in-out"
            />
          </svg>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-gray-900 dark:text-white">
            {formatTime(remainingSeconds)}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Hours
            </label>
            <input
              type="number"
              min="0"
              max="99"
              value={inputTimer.hours}
              onChange={(e) => updateInputTime('hours', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Minutes
            </label>
            <input
              type="number"
              min="0"
              max="59"
              value={inputTimer.minutes}
              onChange={(e) => updateInputTime('minutes', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Seconds
            </label>
            <input
              type="number"
              min="0"
              max="59"
              value={inputTimer.seconds}
              onChange={(e) => updateInputTime('seconds', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={setTimerFromInput}
            className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Check className="h-5 w-5 mr-2" />
            Set Timer
          </button>

          {!timer.isRunning ? (
            <button
              onClick={startTimer}
              disabled={totalSeconds === 0 && remainingSeconds === 0}
              className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="h-5 w-5 mr-2" />
              Start
            </button>
          ) : (
            <button
              onClick={pauseTimer}
              className="flex items-center px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              <Pause className="h-5 w-5 mr-2" />
              Pause
            </button>
          )}

          <button
            onClick={resetTimer}
            className="flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            Reset
          </button>

          <button
            onClick={addLapTime}
            disabled={!timer.isRunning}
            className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Flag className="h-5 w-5 mr-2" />
            Flag
          </button>
        </div>

        {lapTimes.length > 0 && (
          <div className="w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Lap Times</h3>
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
                      Lap Time
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {lapTimes.map((lap, index) => (
                    <tr key={lap.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {lap.time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {lap.duration}
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

export default Timer;