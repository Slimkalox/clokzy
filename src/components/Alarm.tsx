import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Plus, Trash2, Check, X } from 'lucide-react';
import type { Alarm as AlarmType } from '../types';

const Alarm: React.FC = () => {
  const [alarms, setAlarms] = useState<AlarmType[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAlarm, setNewAlarm] = useState<Partial<AlarmType>>({
    time: '',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    recurrence: 'once',
    isActive: true,
    days: [],
  });

  useEffect(() => {
    const checkAlarms = setInterval(() => {
      const now = new Date();
      alarms.forEach((alarm) => {
        if (alarm.isActive) {
          const [hours, minutes] = alarm.time.split(':');
          const alarmTime = new Date();
          alarmTime.setHours(parseInt(hours), parseInt(minutes), 0);

          if (
            now.getHours() === alarmTime.getHours() &&
            now.getMinutes() === alarmTime.getMinutes() &&
            now.getSeconds() === 0
          ) {
            triggerAlarm(alarm);
          }
        }
      });
    }, 1000);

    return () => clearInterval(checkAlarms);
  }, [alarms]);

  const triggerAlarm = (alarm: AlarmType) => {
    // Request notification permission
    if (Notification.permission === 'granted') {
      new Notification('Alarm', {
        body: `It's ${alarm.time}!`,
        icon: '/alarm-icon.png'
      });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('Alarm', {
            body: `It's ${alarm.time}!`,
            icon: '/alarm-icon.png'
          });
        }
      });
    }
  };

  const toggleAlarm = (id: string) => {
    setAlarms(alarms.map(alarm =>
      alarm.id === id ? { ...alarm, isActive: !alarm.isActive } : alarm
    ));
  };

  const deleteAlarm = (id: string) => {
    setAlarms(alarms.filter(alarm => alarm.id !== id));
  };

  const addAlarm = () => {
    if (newAlarm.time) {
      setAlarms([
        ...alarms,
        {
          ...newAlarm,
          id: crypto.randomUUID(),
        } as AlarmType,
      ]);
      setShowAddForm(false);
      setNewAlarm({
        time: '',
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        recurrence: 'once',
        isActive: true,
        days: [],
      });
    }
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const toggleDay = (day: number) => {
    const currentDays = newAlarm.days || [];
    const updatedDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day];
    setNewAlarm({ ...newAlarm, days: updatedDays });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Alarms</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Alarm
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Time
              </label>
              <input
                type="time"
                value={newAlarm.time}
                onChange={(e) => setNewAlarm({ ...newAlarm, time: e.target.value })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Recurrence
              </label>
              <select
                value={newAlarm.recurrence}
                onChange={(e) => setNewAlarm({ ...newAlarm, recurrence: e.target.value as AlarmType['recurrence'] })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="once">Once</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>

            {newAlarm.recurrence === 'weekly' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Days of Week
                </label>
                <div className="flex gap-2 flex-wrap">
                  {weekDays.map((day, index) => (
                    <button
                      key={day}
                      onClick={() => toggleDay(index)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        newAlarm.days?.includes(index)
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={addAlarm}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Add Alarm
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {alarms.map((alarm) => (
          <div
            key={alarm.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <button
                onClick={() => toggleAlarm(alarm.id)}
                className={`p-2 rounded-full ${
                  alarm.isActive
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-400 dark:text-gray-600'
                }`}
              >
                {alarm.isActive ? <Bell className="h-6 w-6" /> : <BellOff className="h-6 w-6" />}
              </button>
              <div>
                <div className="text-xl font-semibold text-gray-900 dark:text-white">
                  {alarm.time}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {alarm.recurrence === 'weekly'
                    ? alarm.days?.map(day => weekDays[day]).join(', ')
                    : alarm.recurrence}
                </div>
              </div>
            </div>
            <button
              onClick={() => deleteAlarm(alarm.id)}
              className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Alarm;