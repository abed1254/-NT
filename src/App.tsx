/**
 * سامانه تخصصی سن بارداری، سونوگرافی NT و تخمین زایمان
 * نسخه دسکتاپ ویندوز — شبکه بهداشت و درمان شهرستان سیریک (خانه بهداشت روستای گهردو)
 * انطباق کامل با گایدلاین بالینی ACOG No. 700 و قانون نیگل
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Baby, 
  Calendar as CalendarIcon, 
  Clock, 
  FileText, 
  Printer, 
  Save, 
  Sparkles, 
  Trash2, 
  Share2, 
  ChevronRight, 
  Activity, 
  Scale, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  User, 
  HelpCircle, 
  Heart, 
  ShieldAlert, 
  Info,
  Waves,
  Stethoscope,
  Volume2,
  VolumeX,
  Building2,
  FolderOpen,
  HeartPulse,
  TestTube2,
  Syringe
} from 'lucide-react';
import { JalaliDate, PERSIAN_MONTH_NAMES } from './utils/jalali';
import { 
  calculateLmpData, 
  calculateNTWindow, 
  calculateUltrasoundData, 
  evaluateAcog, 
  getFruitForWeek, 
  getPrenatalMilestones 
} from './utils/calculator';
import { ActiveTab, CalendarMode, PatientRecord } from './types';
import { usePWAInstall } from './hooks/usePWAInstall';
import { WindowsTitleBar } from './components/WindowsTitleBar';
import { WindowsMenuBar } from './components/WindowsMenuBar';
import { WindowsStatusBar } from './components/WindowsStatusBar';
import { WindowsInstallModal } from './components/WindowsInstallModal';
import { PatientManagerModal } from './components/PatientManagerModal';
import { ClinicalToolsModal } from './components/ClinicalToolsModal';
import { PrintReportView } from './components/PrintReportView';

const STORAGE_KEY_PATIENTS = 'sirik_pregnancy_patients_v2';
const STORAGE_KEY_ACTIVE = 'sirik_pregnancy_active_state_v2';

// Map of milestone icon names (stored as strings in calculator.ts) to Lucide components
const MILESTONE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  HeartPulse,
  ShieldAlert,
  TestTube2,
  Sparkles,
  Activity,
  Syringe,
  Waves,
  Stethoscope
};

export default function App() {
  const { isInstallable, isInstalled, install: installPwa } = usePWAInstall();

  // Window frame & desktop app states
  const [isMaximized, setIsMaximized] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [statusMessage, setStatusMessage] = useState('نرم‌افزار آماده به کار است');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Modals
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [toolsModalTab, setToolsModalTab] = useState<'bmi' | 'converter' | 'crl' | 'about' | 'csharp' | null>(null);

  // Active view tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('lmp');

  // Patient demographic information
  const [patientId, setPatientId] = useState<string>('');
  const [fullName, setFullName] = useState<string>('مریم دریانورد');
  const [nationalCode, setNationalCode] = useState<string>('3450123456');
  const [phone, setPhone] = useState<string>('09170000000');
  const [gravida, setGravida] = useState<number>(1);
  const [para, setPara] = useState<number>(0);
  const [abortion, setAbortion] = useState<number>(0);
  const [notes, setNotes] = useState<string>('مراقبت دوره اول بارداری — خانه بهداشت روستای گهردو');

  // LMP Inputs
  const [calModeLmp, setCalModeLmp] = useState<CalendarMode>('shamsi');
  const [lmpShamsiDay, setLmpShamsiDay] = useState<number>(12);
  const [lmpShamsiMonth, setLmpShamsiMonth] = useState<number>(4);
  const [lmpShamsiYear, setLmpShamsiYear] = useState<number>(1405);
  const [lmpMiladiStr, setLmpMiladiStr] = useState<string>('2026-07-03');
  const [cycleLength, setCycleLength] = useState<number>(28);

  // Ultrasound Inputs
  const [calModeUs, setCalModeUs] = useState<CalendarMode>('shamsi');
  const [usShamsiDay, setUsShamsiDay] = useState<number>(5);
  const [usShamsiMonth, setUsShamsiMonth] = useState<number>(6);
  const [usShamsiYear, setUsShamsiYear] = useState<number>(1405);
  const [usMiladiStr, setUsMiladiStr] = useState<string>('2026-08-27');
  const [usWeeks, setUsWeeks] = useState<number>(11);
  const [usDays, setUsDays] = useState<number>(2);

  // Patients storage
  const [patients, setPatients] = useState<PatientRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PATIENTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sound effect helper (subtle web audio API click/beep)
  const playSound = useCallback((type: 'click' | 'save' | 'alert') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'click') {
        osc.frequency.setValueAtTime(480, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      } else if (type === 'save') {
        osc.frequency.setValueAtTime(580, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.07, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === 'alert') {
        osc.frequency.setValueAtTime(740, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(520, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
        osc.start();
        osc.stop(ctx.currentTime + 0.22);
      }
    } catch {
      // Audio not permitted or supported
    }
  }, [soundEnabled]);

  // Sync dates when Shamsi/Miladi changes
  const lmpDateObj = useMemo(() => {
    if (calModeLmp === 'shamsi') {
      return JalaliDate.jalaliToGregorian(lmpShamsiYear, lmpShamsiMonth, lmpShamsiDay);
    }
    const parts = lmpMiladiStr.split('-');
    if (parts.length === 3) {
      return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    }
    return new Date();
  }, [calModeLmp, lmpShamsiYear, lmpShamsiMonth, lmpShamsiDay, lmpMiladiStr]);

  const usDateObj = useMemo(() => {
    if (calModeUs === 'shamsi') {
      return JalaliDate.jalaliToGregorian(usShamsiYear, usShamsiMonth, usShamsiDay);
    }
    const parts = usMiladiStr.split('-');
    if (parts.length === 3) {
      return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    }
    return new Date();
  }, [calModeUs, usShamsiYear, usShamsiMonth, usShamsiDay, usMiladiStr]);

  // Derived Calculations
  const lmpData = useMemo(() => {
    return calculateLmpData(lmpDateObj, cycleLength);
  }, [lmpDateObj, cycleLength]);

  const ntWindow = useMemo(() => {
    return calculateNTWindow(lmpDateObj);
  }, [lmpDateObj]);

  const usData = useMemo(() => {
    return calculateUltrasoundData(usDateObj, usWeeks, usDays);
  }, [usDateObj, usWeeks, usDays]);

  const acog = useMemo(() => {
    return evaluateAcog(lmpDateObj, lmpData.edd, usDateObj, usWeeks, usData.edd);
  }, [lmpDateObj, lmpData.edd, usDateObj, usWeeks, usData.edd]);

  const fruit = useMemo(() => {
    return getFruitForWeek(lmpData.weeks);
  }, [lmpData.weeks]);

  const milestones = useMemo(() => {
    return getPrenatalMilestones(lmpDateObj);
  }, [lmpDateObj]);

  // Save patients list to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PATIENTS, JSON.stringify(patients));
    } catch {
      // ignore
    }
  }, [patients]);

  // Keyboard shortcuts (Windows standard: Ctrl+P, Ctrl+S, Ctrl+N, Ctrl+O, F11, Zoom)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        window.print();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSavePatient();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        handleNewPatient();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        setShowPatientModal(true);
      } else if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === '=' || e.key === '+')) {
        e.preventDefault();
        handleZoomIn();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === '-' || e.key === '_')) {
        e.preventDefault();
        handleZoomOut();
      } else if ((e.ctrlKey || e.metaKey) && e.key === '0') {
        e.preventDefault();
        handleResetZoom();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [patients, fullName, nationalCode, phone, gravida, para, abortion, notes, lmpShamsiYear, lmpShamsiMonth, lmpShamsiDay, cycleLength]);

  // Actions
  const handleNewPatient = () => {
    playSound('click');
    setPatientId('');
    setFullName('');
    setNationalCode('');
    setPhone('');
    setGravida(1);
    setPara(0);
    setAbortion(0);
    setNotes('');

    // Default to ~10 weeks ago
    const today = new Date();
    const past = new Date(today);
    past.setDate(past.getDate() - 70);
    const j = JalaliDate.gregorianToJalali(past.getFullYear(), past.getMonth() + 1, past.getDate());

    setLmpShamsiDay(j.day);
    setLmpShamsiMonth(j.month);
    setLmpShamsiYear(j.year);
    setLmpMiladiStr(JalaliDate.formatMiladiIso(past));
    setCycleLength(28);

    setStatusMessage('پرونده جدید آماده ثبت است.');
  };

  const handleSavePatient = () => {
    const id = patientId || `pat_${Date.now()}`;
    const newRecord: PatientRecord = {
      id,
      fullName: fullName.trim() || 'بدون نام',
      nationalCode: nationalCode.trim(),
      phone: phone.trim(),
      gravida,
      para,
      abortion,
      lmpDateShamsi: { year: lmpShamsiYear, month: lmpShamsiMonth, day: lmpShamsiDay },
      lmpCycleLength: cycleLength,
      usScanDateShamsi: { year: usShamsiYear, month: usShamsiMonth, day: usShamsiDay },
      usWeeks,
      usDays,
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setPatients(prev => {
      const exists = prev.find(p => p.id === id);
      if (exists) {
        return prev.map(p => (p.id === id ? newRecord : p));
      }
      return [newRecord, ...prev];
    });

    setPatientId(id);
    playSound('save');
    setStatusMessage(`پرونده «${newRecord.fullName}» با موفقیت در دیسک محلی ذخیره شد.`);
  };

  const handleSelectPatient = (p: PatientRecord) => {
    setPatientId(p.id);
    setFullName(p.fullName);
    setNationalCode(p.nationalCode);
    setPhone(p.phone);
    setGravida(p.gravida || 1);
    setPara(p.para || 0);
    setAbortion(p.abortion || 0);
    setNotes(p.notes || '');

    setLmpShamsiDay(p.lmpDateShamsi.day);
    setLmpShamsiMonth(p.lmpDateShamsi.month);
    setLmpShamsiYear(p.lmpDateShamsi.year);
    setCycleLength(p.lmpCycleLength || 28);

    const gDate = JalaliDate.jalaliToGregorian(p.lmpDateShamsi.year, p.lmpDateShamsi.month, p.lmpDateShamsi.day);
    setLmpMiladiStr(JalaliDate.formatMiladiIso(gDate));

    if (p.usScanDateShamsi) {
      setUsShamsiDay(p.usScanDateShamsi.day);
      setUsShamsiMonth(p.usScanDateShamsi.month);
      setUsShamsiYear(p.usScanDateShamsi.year);
      setUsWeeks(p.usWeeks ?? 11);
      setUsDays(p.usDays ?? 2);
      const usGDate = JalaliDate.jalaliToGregorian(p.usScanDateShamsi.year, p.usScanDateShamsi.month, p.usScanDateShamsi.day);
      setUsMiladiStr(JalaliDate.formatMiladiIso(usGDate));
    }

    playSound('click');
    setStatusMessage(`پرونده «${p.fullName}» با موفقیت فراخوانی شد.`);
  };

  const handleDeletePatient = (id: string) => {
    if (confirm('آیا از حذف این پرونده از حافظه محلی ویندوز مطمئن هستید؟')) {
      setPatients(prev => prev.filter(p => p.id !== id));
      if (patientId === id) setPatientId('');
      playSound('alert');
      setStatusMessage('پرونده با موفقیت حذف گردید.');
    }
  };

  const handleFillExample = () => {
    playSound('click');
    setFullName('فاطمه حیدری');
    setNationalCode('3450987654');
    setPhone('09171234567');
    setGravida(2);
    setPara(1);
    setAbortion(0);
    setNotes('بارداری دوم — سابقه سزارین قبلی — درخواست غربالگری اول سونوگرافی NT');

    const today = new Date();
    const lmpPast = new Date(today);
    lmpPast.setDate(lmpPast.getDate() - 84); // ۱۲ هفته
    const jLmp = JalaliDate.gregorianToJalali(lmpPast.getFullYear(), lmpPast.getMonth() + 1, lmpPast.getDate());

    setLmpShamsiDay(jLmp.day);
    setLmpShamsiMonth(jLmp.month);
    setLmpShamsiYear(jLmp.year);
    setLmpMiladiStr(JalaliDate.formatMiladiIso(lmpPast));
    setCycleLength(28);

    const usPast = new Date(today);
    usPast.setDate(usPast.getDate() - 7);
    const jUs = JalaliDate.gregorianToJalali(usPast.getFullYear(), usPast.getMonth() + 1, usPast.getDate());

    setUsShamsiDay(jUs.day);
    setUsShamsiMonth(jUs.month);
    setUsShamsiYear(jUs.year);
    setUsMiladiStr(JalaliDate.formatMiladiIso(usPast));
    setUsWeeks(11);
    setUsDays(2);

    setStatusMessage('داده‌های نمونه بالینی با موفقیت بارگذاری شد.');
  };

  const handleResetForm = () => {
    if (confirm('آیا مایل به بازنشانی مقادیر ورودی هستید؟')) {
      handleNewPatient();
    }
  };

  const handleCopySummary = () => {
    const summary = `
گزارش بالینی سن بارداری و سونوگرافی NT:
بیمار: ${fullName || 'نامشخص'} (کد ملی: ${nationalCode || '---'})
سن جنین بر اساس LMP: ${lmpData.weeks} هفته و ${lmpData.daysRem} روز
تاریخ زایمان تخمینی LMP: ${JalaliDate.formatShamsi(lmpData.edd)}
پنجره طلایی سونوگرافی NT: از ${JalaliDate.formatShamsi(ntWindow.startDate)} تا ${JalaliDate.formatShamsi(ntWindow.endDate)}
تاریخ طلایی ایده‌آل NT: ${JalaliDate.formatShamsi(ntWindow.bestDate)}
نتیجه انطباق ACOG: ${acog.title}
مرکز: شبکه بهداشت و درمان سیریک - خانه بهداشت گهردو
    `.trim();

    navigator.clipboard.writeText(summary).then(
      () => {
        playSound('save');
        setStatusMessage('خلاصه گزارش بالینی در کلیپ‌بورد ویندوز کپی شد.');
      },
      () => {
        // Clipboard API unavailable (e.g. non-secure context) — fall back to textarea
        try {
          const ta = document.createElement('textarea');
          ta.value = summary;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          playSound('save');
          setStatusMessage('خلاصه گزارش بالینی در کلیپ‌بورد کپی شد.');
        } catch {
          alert('کپی در کلیپ‌بورد ممکن نشد؛ لطفاً دسترسی کلیپ‌بورد را بررسی کنید.');
        }
      }
    );
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(patients, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `sirik_patients_backup_${JalaliDate.formatShamsiShort(new Date()).replace(/\//g, '-')}.json`;
    a.click();
    playSound('save');
    setStatusMessage('فایل پشتیبان JSON با موفقیت دانلود شد.');
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          setPatients(imported);
          playSound('save');
          setStatusMessage(`${imported.length} پرونده از فایل پشتیبان با موفقیت بازیابی شد.`);
        } else {
          alert('قالب فایل نامعتبر است.');
        }
      } catch {
        alert('خطا در خواندن فایل JSON.');
      }
    };
    reader.readAsText(file);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(1.4, prev + 0.1));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(0.7, prev - 0.1));
  };

  const handleResetZoom = () => {
    setZoomLevel(1.0);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleWindowClose = () => {
    if (confirm('آیا می‌خواهید از برنامه خارج شوید؟ پرونده‌های ذخیره‌شده حفظ می‌شوند.')) {
      window.close();
      // Most browsers block window.close() for tabs not opened by script.
      setStatusMessage('مرورگر اجازه بستن خودکار تب را نمی‌دهد؛ لطفاً تب را دستی ببندید.');
      setTimeout(() => setStatusMessage('نرم‌افزار آماده به کار است'), 8000);
    }
  };

  return (
    <div 
      className="h-screen w-screen flex flex-col overflow-hidden bg-slate-950 text-slate-100 select-none" 
      dir="rtl"
    >
      {/* 1. Native Windows 11 Title Bar */}
      <WindowsTitleBar
        isMaximized={isMaximized}
        onToggleMaximize={() => setIsMaximized(!isMaximized)}
        onMinimize={() => setStatusMessage('برای کوچک‌کردن پنجره از دکمه‌های مرورگر استفاده کنید.')}
        onClose={handleWindowClose}
        onOpenInstallModal={() => setShowInstallModal(true)}
        onPrint={() => window.print()}
        onOpenPatientModal={() => setShowPatientModal(true)}
        onOpenHelp={() => setToolsModalTab('about')}
        isInstallable={isInstallable}
        isInstalled={isInstalled}
      />

      {/* 2. Classic Windows Application Menu Bar */}
      <WindowsMenuBar
        onNewPatient={handleNewPatient}
        onSavePatient={handleSavePatient}
        onOpenPatientModal={() => setShowPatientModal(true)}
        onPrint={() => window.print()}
        onFillExample={handleFillExample}
        onReset={handleResetForm}
        onCopySummary={handleCopySummary}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetZoom={handleResetZoom}
        onToggleFullscreen={toggleFullscreen}
        onOpenBmiTool={() => setToolsModalTab('bmi')}
        onOpenConverterTool={() => setToolsModalTab('converter')}
        onOpenInstallModal={() => setShowInstallModal(true)}
        onOpenAbout={() => setToolsModalTab('about')}
        onOpenCSharpCode={() => setToolsModalTab('csharp')}
      />

      {/* 3. Main Workspace Area (Scalable via Windows Zoom) */}
      <div 
        className="flex-1 overflow-y-auto overflow-x-hidden windows-mica-bg p-3 sm:p-5"
        style={{ zoom: zoomLevel }}
      >
        <div className="max-w-7xl mx-auto space-y-5">
          {/* Header Action Card: Sirik Health Network Branding & Patient Quick Bar */}
          <div className="windows-panel-dark rounded-2xl p-4 sm:p-5 border border-slate-700/60 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 w-full lg:w-auto">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-500 to-indigo-600 flex items-center justify-center text-white text-2xl shadow-lg shadow-rose-500/25 flex-shrink-0 animate-pulse">
                <Baby className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    نسخه جامع بالینی و مامایی تحت ویندوز
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    معیار ACOG No. 700 & قانون نیگل
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    خانه بهداشت روستای گهردو
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
                  سامانه هوشمند <span className="gradient-text-rose">سن بارداری و سونوگرافی NT</span>
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  شبکه بهداشت و درمان شهرستان سیریک — تعیین دقیق سن جنین، تاریخ طلایی سونوگرافی NT و تخمین زایمان
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto justify-end no-print">
              <button
                onClick={handleSavePatient}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition"
                title="ذخیره پرونده در حافظه ویندوز (Ctrl+S)"
              >
                <Save className="w-4 h-4" />
                <span>ذخیره پرونده</span>
              </button>

              <button
                onClick={() => window.print()}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-1.5 transition"
                title="چاپ خلاصه پرونده استاندارد A4 (Ctrl+P)"
              >
                <Printer className="w-4 h-4 text-rose-400" />
                <span>چاپ A4 / خروجی PDF</span>
              </button>

              <button
                onClick={handleFillExample}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-rose-600/20 transition"
              >
                <Sparkles className="w-4 h-4" />
                <span>داده نمونه</span>
              </button>

              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition"
                title={soundEnabled ? 'قطع صدای برنامه' : 'فعال کردن صدای برنامه'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Patient Quick Demographic Header Bar */}
          <div className="windows-panel-dark rounded-2xl p-4 border border-slate-800 shadow-md">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <h3 className="font-bold text-xs text-slate-200 flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-400" />
                <span>مشخصات پرونده مادر تحت مراقبت</span>
              </h3>
              {patientId && (
                <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                  شناسه: {patientId}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">نام و نام خانوادگی:</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="مثال: فاطمه حیدری"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">کد ملی:</label>
                <input
                  type="text"
                  value={nationalCode}
                  onChange={(e) => setNationalCode(e.target.value)}
                  placeholder="۱۰ رقم"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">شماره تماس:</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0917..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs font-mono"
                />
              </div>

              <div className="grid grid-cols-3 gap-1">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1" title="تعداد بارداری (Gravida)">بارداری</label>
                  <input
                    type="number"
                    min="1"
                    max="15"
                    value={gravida}
                    onChange={(e) => setGravida(parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg py-1.5 text-center text-white text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1" title="تعداد زایمان (Para)">زایمان</label>
                  <input
                    type="number"
                    min="0"
                    max="15"
                    value={para}
                    onChange={(e) => setPara(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg py-1.5 text-center text-white text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1" title="تعداد سقط (Abortion)">سقط</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={abortion}
                    onChange={(e) => setAbortion(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg py-1.5 text-center text-white text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">یادداشت مامایی:</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="سوابق بیماری، آلرژی یا دارویی..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Navigation View Tabs (LMP, Ultrasound, ACOG Compare, Milestones) */}
          <div className="flex flex-wrap gap-2 p-1.5 windows-panel-dark rounded-2xl border border-slate-800 no-print">
            <button
              onClick={() => { setActiveTab('lmp'); playSound('click'); }}
              className={`flex-1 min-w-[190px] py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === 'lmp'
                  ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md shadow-rose-600/20'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <CalendarIcon className="w-4 h-4 text-rose-300" />
              <span>محاسبه با آخرین قاعدگی (LMP)</span>
            </button>

            <button
              onClick={() => { setActiveTab('us'); playSound('click'); }}
              className={`flex-1 min-w-[190px] py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === 'us'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Waves className="w-4 h-4 text-indigo-400" />
              <span>محاسبه با سونوگرافی (US)</span>
            </button>

            <button
              onClick={() => { setActiveTab('compare'); playSound('click'); }}
              className={`flex-1 min-w-[190px] py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === 'compare'
                  ? 'bg-gradient-to-r from-purple-600 to-sky-600 text-white shadow-md shadow-purple-600/20'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Scale className="w-4 h-4 text-purple-300" />
              <span>مقایسه بالینی و گایدلاین ACOG</span>
            </button>

            <button
              onClick={() => { setActiveTab('milestones'); playSound('click'); }}
              className={`flex-1 min-w-[190px] py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === 'milestones'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Activity className="w-4 h-4 text-emerald-300" />
              <span>تقویم مراجعات و آزمایش‌ها ({milestones.length})</span>
            </button>
          </div>

          {/* TAB 1: LMP Calculation Mode */}
          {activeTab === 'lmp' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Inputs Column */}
                <div className="windows-panel-dark rounded-3xl p-5 border border-slate-800 shadow-md space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center text-xs">
                        <CalendarIcon className="w-4 h-4" />
                      </span>
                      اطلاعات قاعدگی مادر (LMP)
                    </h3>
                    <div className="flex bg-slate-950 p-0.5 rounded-lg text-xs font-semibold border border-slate-800">
                      <button
                        onClick={() => setCalModeLmp('shamsi')}
                        className={`px-2.5 py-1 rounded-md transition ${
                          calModeLmp === 'shamsi' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        شمسی
                      </button>
                      <button
                        onClick={() => setCalModeLmp('miladi')}
                        className={`px-2.5 py-1 rounded-md transition ${
                          calModeLmp === 'miladi' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        میلادی
                      </button>
                    </div>
                  </div>

                  {/* Shamsi Inputs */}
                  {calModeLmp === 'shamsi' ? (
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-300">
                        تاریخ اولین روز آخرین قاعدگی (شمسی):
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <span className="text-[10px] text-slate-400 block mb-1">روز</span>
                          <select
                            value={lmpShamsiDay}
                            onChange={(e) => {
                              const d = parseInt(e.target.value);
                              setLmpShamsiDay(d);
                              const g = JalaliDate.jalaliToGregorian(lmpShamsiYear, lmpShamsiMonth, d);
                              setLmpMiladiStr(JalaliDate.formatMiladiIso(g));
                            }}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                          >
                            {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                              <option key={d} value={d}>{d}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <span className="text-[10px] text-slate-400 block mb-1">ماه</span>
                          <select
                            value={lmpShamsiMonth}
                            onChange={(e) => {
                              const m = parseInt(e.target.value);
                              setLmpShamsiMonth(m);
                              const g = JalaliDate.jalaliToGregorian(lmpShamsiYear, m, lmpShamsiDay);
                              setLmpMiladiStr(JalaliDate.formatMiladiIso(g));
                            }}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                          >
                            {PERSIAN_MONTH_NAMES.map((name, idx) => (
                              <option key={idx} value={idx + 1}>{name}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <span className="text-[10px] text-slate-400 block mb-1">سال</span>
                          <select
                            value={lmpShamsiYear}
                            onChange={(e) => {
                              const y = parseInt(e.target.value);
                              setLmpShamsiYear(y);
                              const g = JalaliDate.jalaliToGregorian(y, lmpShamsiMonth, lmpShamsiDay);
                              setLmpMiladiStr(JalaliDate.formatMiladiIso(g));
                            }}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                          >
                            {[1406, 1405, 1404, 1403, 1402].map((y) => (
                              <option key={y} value={y}>{y}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-300">
                        تاریخ اولین روز آخرین قاعدگی (میلادی):
                      </label>
                      <input
                        type="date"
                        value={lmpMiladiStr}
                        onChange={(e) => {
                          const val = e.target.value;
                          setLmpMiladiStr(val);
                          const p = val.split('-');
                          if (p.length === 3) {
                            const j = JalaliDate.gregorianToJalali(parseInt(p[0]), parseInt(p[1]), parseInt(p[2]));
                            setLmpShamsiDay(j.day);
                            setLmpShamsiMonth(j.month);
                            setLmpShamsiYear(j.year);
                          }
                        }}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500 font-mono"
                      />
                    </div>
                  )}

                  {/* Menstrual Cycle Length */}
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-300">میانگین طول دوره قاعدگی:</label>
                      <span className="text-xs font-black text-rose-400 bg-rose-950/80 px-2.5 py-0.5 rounded-full border border-rose-800">
                        {cycleLength} روز
                      </span>
                    </div>
                    <input
                      type="range"
                      min="21"
                      max="40"
                      value={cycleLength}
                      onChange={(e) => setCycleLength(parseInt(e.target.value))}
                      className="w-full accent-rose-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 px-1">
                      <span>۲۱ روز (کوتاه)</span>
                      <span>۲۸ روز (استاندارد نیگل)</span>
                      <span>۴۰ روز (طولانی)</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      تعدیل هوشمند قانون نیگل: انحراف چرخه از ۲۸ روز مستقیماً در تاریخ تخمک‌گذاری و محاسبه روز زایمان تصحیح می‌گردد.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
                    <Info className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
                    <span>مبنای محاسبه ۲۸۰ روز کامل (۴۰ هفته) از اولین روز خونریزی قاعدگی طبق استاندارد ACOG است.</span>
                  </div>
                </div>

                {/* Results Column */}
                <div className="lg:col-span-2 space-y-5">
                  {/* 4 Quick Stat Summary Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="windows-panel-dark rounded-2xl p-4 border border-rose-900/50 bg-gradient-to-br from-rose-950/30 to-slate-900 flex flex-col justify-between shadow-sm">
                      <div className="flex items-center justify-between text-xs text-rose-400 font-bold mb-1">
                        <span>سن جنین امروز</span>
                        <Baby className="w-4 h-4" />
                      </div>
                      <div className="text-lg sm:text-2xl font-black text-white">
                        {lmpData.weeks} هفته و {lmpData.daysRem} روز
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        {lmpData.diffDays} روز از لقاح فرضی
                      </div>
                    </div>

                    <div className="windows-panel-dark rounded-2xl p-4 border border-indigo-900/50 bg-gradient-to-br from-indigo-950/30 to-slate-900 flex flex-col justify-between shadow-sm">
                      <div className="flex items-center justify-between text-xs text-indigo-400 font-bold mb-1">
                        <span>تاریخ تخمینی زایمان</span>
                        <CalendarIcon className="w-4 h-4" />
                      </div>
                      <div className="text-base sm:text-lg font-black text-white">
                        {JalaliDate.formatShamsi(lmpData.edd)}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        {JalaliDate.formatMiladi(lmpData.edd)}
                      </div>
                    </div>

                    <div className="windows-panel-dark rounded-2xl p-4 border border-purple-900/50 bg-gradient-to-br from-purple-950/30 to-slate-900 flex flex-col justify-between shadow-sm">
                      <div className="flex items-center justify-between text-xs text-purple-400 font-bold mb-1">
                        <span>سه‌‌ماهه بارداری</span>
                        <Activity className="w-4 h-4" />
                      </div>
                      <div className="text-base sm:text-xl font-black text-white">
                        {lmpData.trimester}
                      </div>
                      <div className="text-[11px] text-purple-300 font-medium mt-1 truncate">
                        {lmpData.trimesterDescription}
                      </div>
                    </div>

                    <div className="windows-panel-dark rounded-2xl p-4 border border-emerald-900/50 bg-gradient-to-br from-emerald-950/30 to-slate-900 flex flex-col justify-between shadow-sm">
                      <div className="flex items-center justify-between text-xs text-emerald-400 font-bold mb-1">
                        <span>شمارش معکوس زایمان</span>
                        <Clock className="w-4 h-4" />
                      </div>
                      <div className="text-lg sm:text-2xl font-black text-white">
                        {lmpData.daysToEdd > 0 ? `${lmpData.daysToEdd} روز` : 'موعد زایمان'}
                      </div>
                      <div className="text-[11px] text-emerald-400 font-medium mt-1">
                        {lmpData.progressPercent}٪ سپری شده
                      </div>
                    </div>
                  </div>

                  {/* SPECIAL SECTION: NT Ultrasound Golden Window & First Trimester Screening */}
                  <div className="windows-panel-dark rounded-3xl p-5 border-2 border-indigo-700/60 bg-gradient-to-br from-indigo-950/40 via-slate-900 to-purple-950/40 shadow-xl space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-indigo-800/40 gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-lg shadow-md shadow-indigo-600/30 flex-shrink-0">
                          <Waves className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-black text-white text-base">تاریخ و پنجره طلایی سونوگرافی NT</h4>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-900 text-indigo-200 border border-indigo-700">
                              غربالگری کروموزومی اول
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">
                            محدوده علمی معتبر: بین ۱۱ هفته و ۰ روز تا ۱۳ هفته و ۶ روز (اندازه جنین CRL بین ۴۵ تا ۸۴ میلی‌متر)
                          </p>
                        </div>
                      </div>

                      {/* NT Status Badge */}
                      <span className={`px-3.5 py-1 rounded-full text-xs font-black self-start sm:self-auto border ${
                        ntWindow.status === 'active'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-600 animate-pulse'
                          : ntWindow.status === 'upcoming'
                          ? 'bg-amber-950 text-amber-300 border-amber-600'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}>
                        {ntWindow.status === 'active' && `هم‌اکنون در بازه طلایی (${ntWindow.daysRemainingOrPassed} روز مهلت)`}
                        {ntWindow.status === 'upcoming' && `موعد نرسیده (${ntWindow.daysRemainingOrPassed} روز مانده)`}
                        {ntWindow.status === 'passed' && 'بازه سونوگرافی NT سپری شده'}
                      </span>
                    </div>

                    {/* 3 NT Dates Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* Start Date */}
                      <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-indigo-900/60 flex flex-col justify-between">
                        <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                          شروع بازه مجاز (11w0d)
                        </span>
                        <div className="mt-2">
                          <span className="text-base font-extrabold text-white block">
                            {JalaliDate.formatShamsi(ntWindow.startDate)}
                          </span>
                          <span className="text-[11px] text-slate-500 block mt-0.5 font-mono">
                            {JalaliDate.formatMiladi(ntWindow.startDate)}
                          </span>
                        </div>
                      </div>

                      {/* Golden Target */}
                      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/25 flex flex-col justify-between">
                        <span className="text-[11px] font-bold text-indigo-100 flex items-center justify-between">
                          <span>بهترین زمان طلایی (12w2d)</span>
                          <Sparkles className="w-4 h-4 text-amber-300" />
                        </span>
                        <div className="mt-2">
                          <span className="text-base font-black text-white block">
                            {JalaliDate.formatShamsi(ntWindow.bestDate)}
                          </span>
                          <span className="text-[11px] text-indigo-200 block mt-0.5 font-mono">
                            {JalaliDate.formatMiladi(ntWindow.bestDate)}
                          </span>
                        </div>
                      </div>

                      {/* Deadline */}
                      <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-rose-900/60 flex flex-col justify-between">
                        <span className="text-[11px] font-bold text-rose-400 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                          پایان مهلت مجاز (13w6d)
                        </span>
                        <div className="mt-2">
                          <span className="text-base font-extrabold text-white block">
                            {JalaliDate.formatShamsi(ntWindow.endDate)}
                          </span>
                          <span className="text-[11px] text-slate-500 block mt-0.5 font-mono">
                            {JalaliDate.formatMiladi(ntWindow.endDate)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Guidance Advice */}
                    <div className="p-3.5 rounded-xl bg-indigo-950/50 border border-indigo-800/60 text-xs text-indigo-200 leading-relaxed flex items-start gap-2.5">
                      <Stethoscope className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                      <span>
                        سونوگرافی اندازه‌گیری ضخامت چین پشت گردن جنین (Nuchal Translucency) همراه با آزمایش خون دوگانه (Double Marker: Free β-hCG و PAPP-A) الزامی است. پس از سن ۱۳ هفته و ۶ روز به دلیل بسته شدن لنفاتیک‌های گردنی، غربالگری مرحله اول ارزش تشخیصی خود را از دست می‌دهد.
                      </span>
                    </div>
                  </div>

                  {/* Baby Size & Fruit Comparison */}
                  <div className="windows-panel-dark rounded-3xl p-5 border border-slate-800 flex flex-col sm:flex-row items-center gap-5">
                    <div className="w-20 h-20 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-4xl shadow-inner flex-shrink-0">
                      {fruit.emoji}
                    </div>
                    <div className="space-y-1.5 text-center sm:text-right flex-1">
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800">
                          اندازه تقریبی جنین
                        </span>
                        <span className="font-black text-white text-base">
                          {fruit.name} (هفته {lmpData.weeks})
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {fruit.desc}
                      </p>
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-1 text-xs text-slate-400 font-medium">
                        <span>طول تقریبی: <strong className="text-slate-200">{fruit.len}</strong></span>
                        <span>وزن تقریبی: <strong className="text-slate-200">{fruit.weight}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* 40-Week Progress Bar */}
                  <div className="windows-panel-dark rounded-3xl p-5 border border-slate-800 space-y-3">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-300">
                      <span>مسیر پیشرفت ۴۰ هفته‌ای بارداری</span>
                      <span className="text-rose-400 font-mono">
                        هفته {lmpData.weeks} از ۴۰ ({lmpData.progressPercent}٪)
                      </span>
                    </div>
                    <div className="w-full h-3.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-l from-rose-500 via-pink-400 to-indigo-500 rounded-full transition-all duration-500"
                        style={{ width: `${lmpData.progressPercent}%` }}
                      ></div>
                    </div>
                    <div className="grid grid-cols-3 text-center text-[10px] text-slate-400 pt-1">
                      <div className="border-l border-slate-800">
                        <strong className="text-rose-400 block font-bold">سه‌ماهه اول</strong>
                        هفته ۱ الی ۱۳
                      </div>
                      <div className="border-l border-slate-800">
                        <strong className="text-indigo-400 block font-bold">سه‌ماهه دوم</strong>
                        هفته ۱۴ الی ۲۷
                      </div>
                      <div>
                        <strong className="text-emerald-400 block font-bold">سه‌ماهه سوم</strong>
                        هفته ۲۸ الی ۴۰+
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Ultrasound Calculation Mode */}
          {activeTab === 'us' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Ultrasound Inputs Column */}
                <div className="windows-panel-dark rounded-3xl p-5 border border-slate-800 shadow-md space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs">
                        <Waves className="w-4 h-4" />
                      </span>
                      اطلاعات برگه سونوگرافی
                    </h3>
                    <div className="flex bg-slate-950 p-0.5 rounded-lg text-xs font-semibold border border-slate-800">
                      <button
                        onClick={() => setCalModeUs('shamsi')}
                        className={`px-2.5 py-1 rounded-md transition ${
                          calModeUs === 'shamsi' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        شمسی
                      </button>
                      <button
                        onClick={() => setCalModeUs('miladi')}
                        className={`px-2.5 py-1 rounded-md transition ${
                          calModeUs === 'miladi' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        میلادی
                      </button>
                    </div>
                  </div>

                  {/* Scan Date */}
                  {calModeUs === 'shamsi' ? (
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-300">
                        تاریخ انجام سونوگرافی (شمسی):
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <span className="text-[10px] text-slate-400 block mb-1">روز</span>
                          <select
                            value={usShamsiDay}
                            onChange={(e) => {
                              const d = parseInt(e.target.value);
                              setUsShamsiDay(d);
                              const g = JalaliDate.jalaliToGregorian(usShamsiYear, usShamsiMonth, d);
                              setUsMiladiStr(JalaliDate.formatMiladiIso(g));
                            }}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                          >
                            {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                              <option key={d} value={d}>{d}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <span className="text-[10px] text-slate-400 block mb-1">ماه</span>
                          <select
                            value={usShamsiMonth}
                            onChange={(e) => {
                              const m = parseInt(e.target.value);
                              setUsShamsiMonth(m);
                              const g = JalaliDate.jalaliToGregorian(usShamsiYear, m, usShamsiDay);
                              setUsMiladiStr(JalaliDate.formatMiladiIso(g));
                            }}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                          >
                            {PERSIAN_MONTH_NAMES.map((name, idx) => (
                              <option key={idx} value={idx + 1}>{name}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <span className="text-[10px] text-slate-400 block mb-1">سال</span>
                          <select
                            value={usShamsiYear}
                            onChange={(e) => {
                              const y = parseInt(e.target.value);
                              setUsShamsiYear(y);
                              const g = JalaliDate.jalaliToGregorian(y, usShamsiMonth, usShamsiDay);
                              setUsMiladiStr(JalaliDate.formatMiladiIso(g));
                            }}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                          >
                            {[1406, 1405, 1404, 1403, 1402].map((y) => (
                              <option key={y} value={y}>{y}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-300">
                        تاریخ انجام سونوگرافی (میلادی):
                      </label>
                      <input
                        type="date"
                        value={usMiladiStr}
                        onChange={(e) => {
                          const val = e.target.value;
                          setUsMiladiStr(val);
                          const p = val.split('-');
                          if (p.length === 3) {
                            const j = JalaliDate.gregorianToJalali(parseInt(p[0]), parseInt(p[1]), parseInt(p[2]));
                            setUsShamsiDay(j.day);
                            setUsShamsiMonth(j.month);
                            setUsShamsiYear(j.year);
                          }
                        }}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                      />
                    </div>
                  )}

                  {/* Gestational Age recorded in scan report */}
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <label className="block text-xs font-bold text-slate-300">
                      سن جنین درج‌شده در برگه سونوگرافی (GA):
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-[10px] text-slate-400 block mb-1">تعداد هفته کامل</span>
                        <input
                          type="number"
                          min="4"
                          max="42"
                          value={usWeeks}
                          onChange={(e) => setUsWeeks(parseInt(e.target.value) || 0)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 text-center font-bold"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block mb-1">روز اضافی (۰ تا ۶)</span>
                        <input
                          type="number"
                          min="0"
                          max="6"
                          value={usDays}
                          onChange={(e) => setUsDays(parseInt(e.target.value) || 0)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 text-center font-bold"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
                    <Info className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                    <span>
                      اندازه‌گیری ابعاد CRL در سه‌ماهه اول دقیق‌ترین ملاک برای اصلاح یا تایید تاریخ زایمان است.
                    </span>
                  </div>
                </div>

                {/* Ultrasound Calculated Outputs */}
                <div className="lg:col-span-2 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="windows-panel-dark rounded-2xl p-4 border border-indigo-900/60 bg-gradient-to-br from-indigo-950/40 to-slate-900">
                      <span className="text-xs text-indigo-400 font-bold block mb-1">
                        سن واقعی جنین در امروز (با احتساب پیشرفت زمان)
                      </span>
                      <div className="text-xl sm:text-2xl font-black text-white mt-1">
                        {usData.currentWeeks} هفته و {usData.currentDaysRem} روز
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        {usData.daysSinceScan} روز از تاریخ سونوگرافی گذشته است
                      </div>
                    </div>

                    <div className="windows-panel-dark rounded-2xl p-4 border border-rose-900/60 bg-gradient-to-br from-rose-950/40 to-slate-900">
                      <span className="text-xs text-rose-400 font-bold block mb-1">
                        تاریخ زایمان بر اساس سونوگرافی (EDD)
                      </span>
                      <div className="text-lg sm:text-xl font-black text-white mt-1">
                        {JalaliDate.formatShamsi(usData.edd)}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        {JalaliDate.formatMiladi(usData.edd)}
                      </div>
                    </div>

                    <div className="windows-panel-dark rounded-2xl p-4 border border-teal-900/60 bg-gradient-to-br from-teal-950/40 to-slate-900">
                      <span className="text-xs text-teal-400 font-bold block mb-1">
                        تاریخ معادل بازسازی‌شده LMP
                      </span>
                      <div className="text-lg sm:text-xl font-black text-white mt-1">
                        {JalaliDate.formatShamsi(usData.equivLmp)}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        {JalaliDate.formatMiladi(usData.equivLmp)}
                      </div>
                    </div>
                  </div>

                  {/* Clinical Guidelines Card */}
                  <div className="windows-panel-dark rounded-3xl p-5 border border-slate-800 space-y-3">
                    <h4 className="font-extrabold text-white text-sm flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-indigo-400" />
                      دستورالعمل بالینی در تفسیر سن سونوگرافی و LMP:
                    </h4>
                    <div className="space-y-2.5 text-xs text-slate-300">
                      <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">۱</span>
                        <span><strong>سه‌ماهه اول (تا ۱۳ هفته و ۶ روز):</strong> اگر اختلاف سونوگرافی با LMP بیش از ۵ الی ۷ روز باشد، تاریخ تخمینی زایمان به نفع سونوگرافی اصلاح می‌گردد.</span>
                      </div>
                      <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">۲</span>
                        <span><strong>سه‌ماهه دوم (۱۴ تا ۲۷ هفته):</strong> به دلیل تفاوت ژنتیکی اندازه نوزادان، اختلاف تا ۱۰ الی ۱۴ روز معمولاً طبیعی بوده و تاریخ LMP حفظ می‌شود.</span>
                      </div>
                      <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">۳</span>
                        <span><strong>سه‌ماهه سوم:</strong> خطای بیومتری به ۲۱ روز (۳ هفته) می‌رسد، بنابراین تاریخ‌های اولیه همواره معتبرترین ملاک هستند.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ACOG Comparison & Committee Opinion No. 700 */}
          {activeTab === 'compare' && (
            <div className="windows-panel-dark rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-xl space-y-6">
              <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div>
                  <h3 className="font-black text-white text-base sm:text-lg flex items-center gap-2">
                    <Scale className="w-5 h-5 text-purple-400" />
                    مقایسه بالینی همزمان LMP و سونوگرافی
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    تطبیق خودکار با استاندارد کالج متخصصین زنان و زایمان آمریکا (ACOG Committee Opinion No. 700)
                  </p>
                </div>
                <span className={`px-4 py-1 rounded-full text-xs font-black self-start sm:self-auto border ${
                  acog.isAcceptableLmp
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                    : 'bg-amber-950 text-amber-300 border-amber-600'
                }`}>
                  {acog.badgeText}
                </span>
              </div>

              {/* Two Methods Compare Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-900/50 space-y-2.5">
                  <div className="flex items-center justify-between text-rose-300 font-extrabold text-sm">
                    <span>روش اول: تاریخ آخرین قاعدگی (LMP)</span>
                    <CalendarIcon className="w-4 h-4" />
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between py-1 border-b border-rose-900/30">
                      <span className="text-slate-400">سن جنین در امروز:</span>
                      <strong className="text-white font-bold">{lmpData.weeks} هفته و {lmpData.daysRem} روز</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-rose-900/30">
                      <span className="text-slate-400">تاریخ تخمینی زایمان (شمسی):</span>
                      <strong className="text-white font-bold">{JalaliDate.formatShamsi(lmpData.edd)}</strong>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">مبنای محاسبه:</span>
                      <span className="text-slate-300 font-medium">۲۸۰ روز از آغاز خونریزی (تعدیل {cycleLength} روزه)</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-900/50 space-y-2.5">
                  <div className="flex items-center justify-between text-indigo-300 font-extrabold text-sm">
                    <span>روش دوم: گزارش سونوگرافی (US)</span>
                    <Waves className="w-4 h-4" />
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between py-1 border-b border-indigo-900/30">
                      <span className="text-slate-400">سن جنین در امروز:</span>
                      <strong className="text-white font-bold">{usData.currentWeeks} هفته و {usData.currentDaysRem} روز</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-indigo-900/30">
                      <span className="text-slate-400">تاریخ تخمینی زایمان (شمسی):</span>
                      <strong className="text-white font-bold">{JalaliDate.formatShamsi(usData.edd)}</strong>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">مبنای محاسبه:</span>
                      <span className="text-slate-300 font-medium">ابعاد بیومتریک در {usWeeks} هفته و {usDays} روز</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ACOG Decision Output Box */}
              <div className={`p-5 rounded-2xl border transition-all ${
                acog.isAcceptableLmp
                  ? 'bg-emerald-950/30 border-emerald-800'
                  : 'bg-amber-950/30 border-amber-800'
              }`}>
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 ${
                    acog.isAcceptableLmp
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {acog.isAcceptableLmp ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="font-extrabold text-white text-base">{acog.title}</h4>
                      <span className="text-xs font-bold px-3 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300 font-mono">
                        اختلاف: {acog.discrepancyDays} روز (مجاز: تا {acog.thresholdDays} روز)
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {acog.message}
                    </p>
                  </div>
                </div>
              </div>

              {/* Reference Table */}
              <div className="overflow-x-auto pt-2">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="bg-slate-950 text-slate-300 font-bold border-b border-slate-800">
                      <th className="p-3">سن بارداری در زمان سونوگرافی</th>
                      <th className="p-3">شاخص اندازه‌گیری</th>
                      <th className="p-3">حداکثر اختلاف مجاز روز</th>
                      <th className="p-3">تصمیم بالینی ACOG</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-slate-400">
                    <tr>
                      <td className="p-3 font-semibold text-slate-200">زیر ۹ هفته کامل</td>
                      <td className="p-3">طول تاج تا کفل (CRL)</td>
                      <td className="p-3 font-bold text-rose-400">&gt; ۵ روز</td>
                      <td className="p-3 text-slate-300">تغییر تاریخ زایمان به سونوگرافی</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-200">هفته ۹ تا ۱۳+۶ (غربالگری اول NT)</td>
                      <td className="p-3">طول تاج تا کفل (CRL)</td>
                      <td className="p-3 font-bold text-rose-400">&gt; ۷ روز</td>
                      <td className="p-3 text-slate-300">تغییر تاریخ زایمان به سونوگرافی</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-200">هفته ۱۴ تا ۱۵+۶</td>
                      <td className="p-3">بیومتری چندگانه (BPD, HC, AC, FL)</td>
                      <td className="p-3 font-bold text-rose-400">&gt; ۷ روز</td>
                      <td className="p-3 text-slate-300">تغییر تاریخ زایمان به سونوگرافی</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-200">هفته ۱۶ تا ۲۱+۶ (آنومالی اسکن)</td>
                      <td className="p-3">بیومتری آنومالی</td>
                      <td className="p-3 font-bold text-rose-400">&gt; ۱۰ روز</td>
                      <td className="p-3 text-slate-300">تغییر تاریخ زایمان به سونوگرافی</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-200">هفته ۲۲ تا ۲۷+۶</td>
                      <td className="p-3">بیومتری چندگانه</td>
                      <td className="p-3 font-bold text-rose-400">&gt; ۱۴ روز</td>
                      <td className="p-3 text-slate-300">تغییر تاریخ زایمان به سونوگرافی</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: Prenatal Milestones Calendar */}
          {activeTab === 'milestones' && (
            <div className="windows-panel-dark rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="font-black text-white text-base sm:text-lg flex items-center gap-2">
                    <Activity className="w-5 h-5 text-emerald-400" />
                    تقویم مراجعات، آزمایش‌ها و سونوگرافی‌های ضروری مادر
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    محاسبه شده بر مبنای آخرین قاعدگی و پروتکل پرونده سلامت مادران
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                  {milestones.length} نوبت مراقبت
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {milestones.map((m) => {
                  const MilestoneIcon = MILESTONE_ICONS[m.iconName];
                  return (
                  <div
                    key={m.id}
                    className={`p-4 rounded-2xl border ${m.bgClass} flex flex-col justify-between space-y-3 shadow-sm`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-white flex items-center gap-1.5">
                          {MilestoneIcon && <MilestoneIcon className={`w-4 h-4 ${m.colorClass}`} />}
                          {m.title}
                        </span>
                      </div>
                      <span className={`text-[11px] font-bold block mt-1 ${m.colorClass}`}>
                        {m.weekRange}
                      </span>
                      <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                        {m.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/60 flex justify-between items-center text-[11px]">
                      <span className="text-slate-400">تاریخ پیشنهادی:</span>
                      <strong className="text-white font-bold">
                        {JalaliDate.formatShamsi(m.date)}
                      </strong>
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Windows Desktop Footer: Sirik Health Network Branding */}
          <footer className="mt-8 pt-4 pb-6 border-t border-slate-800 no-print">
            <div className="windows-panel-dark rounded-2xl px-6 py-4 border border-slate-800 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-indigo-600 text-white flex items-center justify-center text-lg shadow-md shadow-rose-500/20">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="text-center sm:text-right">
                  <p className="text-xs sm:text-sm font-black text-white">
                    طراحی و تنظیم: شبکه بهداشت و درمان شهرستان سیریک — خانه بهداشت روستای گهردو
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    ویژه پزشکان، ماماها و بهورزان گرامی در مراقبت‌های بالینی مادر و نوزاد
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] font-bold text-slate-300 bg-slate-950 px-3.5 py-1.5 rounded-full border border-slate-800">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                <span>استاندارد مراقبت‌های بالینی مادر و نوزاد (ACOG Bulletin No. 700)</span>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* 4. Windows Desktop Application Status Bar */}
      <WindowsStatusBar
        zoomLevel={zoomLevel}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetZoom={handleResetZoom}
        statusMessage={statusMessage}
        patientCount={patients.length}
      />

      {/* 5. Windows Install Helper Modal */}
      <WindowsInstallModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
        onInstallPwa={installPwa}
        isInstallable={isInstallable}
        isInstalled={isInstalled}
      />

      {/* 6. Patient Database & Record Manager Modal */}
      <PatientManagerModal
        isOpen={showPatientModal}
        onClose={() => setShowPatientModal(false)}
        patients={patients}
        onSelectPatient={handleSelectPatient}
        onDeletePatient={handleDeletePatient}
        onNewPatient={handleNewPatient}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
      />

      {/* 7. Clinical Tools & BMI / Converter Modal */}
      {toolsModalTab && (
        <ClinicalToolsModal
          isOpen={true}
          onClose={() => setToolsModalTab(null)}
          activeTool={toolsModalTab}
        />
      )}

      {/* 8. Dedicated A4 Print Sheet (Active during window.print()) */}
      <PrintReportView
        patient={{
          fullName,
          nationalCode,
          phone,
          gravida,
          para,
          abortion
        }}
        lmpDate={lmpDateObj}
        eddLmp={lmpData.edd}
        weeksLmp={lmpData.weeks}
        daysRemLmp={lmpData.daysRem}
        ntWindow={ntWindow}
        usScanDate={usDateObj}
        usWeeks={usWeeks}
        usDays={usDays}
        eddUs={usData.edd}
        acog={acog}
        milestones={milestones}
      />
    </div>
  );
}
