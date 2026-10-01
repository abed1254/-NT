import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  WifiOff, 
  Database, 
  Clock, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  CheckCircle2,
  HardDrive
} from 'lucide-react';
import { JalaliDate, PERSIAN_WEEK_DAYS, PERSIAN_MONTH_NAMES } from '../utils/jalali';

interface Props {
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  statusMessage?: string;
  patientCount?: number;
}

export const WindowsStatusBar: React.FC<Props> = ({
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  statusMessage = 'آماده به کار',
  patientCount = 0
}) => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const updateClock = () => {
      const now = new Date();
      const parts = JalaliDate.fromGregorian(now);
      const dayName = PERSIAN_WEEK_DAYS[now.getDay()];
      const monthName = PERSIAN_MONTH_NAMES[parts.month - 1];
      setDateStr(`${dayName} ${parts.day} ${monthName} ${parts.year}`);
      
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');
      setTimeStr(`${hh}:${mm}:${ss}`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="windows-statusbar h-7 bg-slate-950 border-t border-slate-800 text-slate-400 text-[11px] px-3 flex items-center justify-between select-none z-40 flex-shrink-0">
      {/* Right side in RTL: Status text & Organization */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-slate-300">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-semibold text-slate-200">{statusMessage}</span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 border-r border-slate-800 pr-3 text-slate-400">
          <HardDrive className="w-3.5 h-3.5 text-sky-400" />
          <span>پایگاه داده محلی: {patientCount} پرونده ذخیره‌شده</span>
        </div>

        <div className="hidden lg:flex items-center gap-1.5 border-r border-slate-800 pr-3 text-slate-400">
          <span className="text-slate-300 font-medium">شبکه بهداشت و درمان سیریک — خانه بهداشت گهردو</span>
        </div>
      </div>

      {/* Left side in RTL: Zoom & Live Clock */}
      <div className="flex items-center gap-3" dir="ltr">
        {/* Network status */}
        <div className="flex items-center gap-1">
          {isOnline ? (
            <span className="flex items-center gap-1 text-emerald-400 text-[10px]" title="متصل به شبکه">
              <Wifi className="w-3 h-3" />
              <span className="hidden md:inline">Online</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-amber-400 text-[10px]" title="حالت آفلاین فعال است">
              <WifiOff className="w-3 h-3" />
              <span className="hidden md:inline">Offline</span>
            </span>
          )}
        </div>

        {/* Zoom controls */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5">
          <button 
            onClick={onZoomOut} 
            className="hover:text-white p-0.5" 
            title="کوچک‌نمایی"
          >
            <ZoomOut className="w-3 h-3" />
          </button>
          <button 
            onClick={onResetZoom} 
            className="px-1 text-[10px] font-mono text-slate-200 hover:text-sky-400"
            title="اندازه پیش‌فرض"
          >
            {Math.round(zoomLevel * 100)}%
          </button>
          <button 
            onClick={onZoomIn} 
            className="hover:text-white p-0.5" 
            title="بزرگ‌نمایی"
          >
            <ZoomIn className="w-3 h-3" />
          </button>
        </div>

        {/* Date & Clock */}
        <div className="flex items-center gap-2 text-slate-300 font-mono text-[11px] border-l border-slate-800 pl-3">
          <Clock className="w-3 h-3 text-slate-400" />
          <span>{timeStr}</span>
          <span className="hidden md:inline font-sans text-slate-400 text-[10px]">({dateStr})</span>
        </div>
      </div>
    </div>
  );
};
