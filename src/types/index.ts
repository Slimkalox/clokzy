export interface TimeZone {
  id: string;
  name: string;
  offset: string;
  city: string;
  country: string;
  isDaytime: boolean;
  currentTime: string;
}

export interface Alarm {
  id: string;
  time: string;
  timeZone: string;
  isActive: boolean;
  recurrence: 'once' | 'daily' | 'weekly';
  days?: number[];
}

export interface Timer {
  hours: number;
  minutes: number;
  seconds: number;
  isRunning: boolean;
  progress: number;
}

export interface Stopwatch {
  time: number;
  isRunning: boolean;
  laps: number[];
}