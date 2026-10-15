import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, 
  Save, 
  FolderOpen, 
  Printer, 
  Sparkles, 
  Trash2, 
  Copy, 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  Calculator, 
  Download, 
  HelpCircle, 
  Info,
  Calendar,
  Layers,
  ChevronDown
} from 'lucide-react';

interface Props {
  onNewPatient: () => void;
  onSavePatient: () => void;
  onOpenPatientModal: () => void;
  onPrint: () => void;
  onFillExample: () => void;
  onReset: () => void;
  onCopySummary: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onToggleFullscreen: () => void;
  onOpenBmiTool: () => void;
  onOpenConverterTool: () => void;
  onOpenInstallModal: () => void;
  onOpenAbout: () => void;
  onOpenCSharpCode?: () => void;
}

export const WindowsMenuBar: React.FC<Props> = ({
  onNewPatient,
  onSavePatient,
  onOpenPatientModal,
  onPrint,
  onFillExample,
  onReset,
  onCopySummary,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onToggleFullscreen,
  onOpenBmiTool,
  onOpenConverterTool,
  onOpenInstallModal,
  onOpenAbout,
  onOpenCSharpCode
}) => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const menuBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuBarRef.current && !menuBarRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = (name: string) => {
    setOpenMenu(openMenu === name ? null : name);
  };

  const handleItemClick = (callback: () => void) => {
    callback();
    setOpenMenu(null);
  };

  return (
    <div 
      ref={menuBarRef} 
      className="windows-menubar bg-slate-900 border-b border-slate-800 text-slate-300 text-xs px-3 py-1 flex items-center gap-1 select-none z-40 relative flex-shrink-0 overflow-x-auto whitespace-nowrap"
    >
      {/* پرونده (File) */}
      <div className="relative">
        <button
          onClick={() => toggleMenu('file')}
          className={`px-2.5 py-1 rounded hover:bg-slate-800 transition flex items-center gap-1 ${
            openMenu === 'file' ? 'bg-slate-800 text-white' : ''
          }`}
        >
          <span>پرونده</span>
        </button>

        {openMenu === 'file' && (
          <div className="absolute right-0 top-full mt-1 w-64 bg-slate-900 border border-slate-700/80 rounded-lg shadow-2xl py-1 z-50 text-slate-200">
            <button
              onClick={() => handleItemClick(onNewPatient)}
              className="w-full px-3 py-1.5 hover:bg-indigo-600/30 text-right flex items-center justify-between text-xs transition"
            >
              <span className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                <span>ثبت بیمار جدید</span>
              </span>
              <kbd className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">Ctrl+N</kbd>
            </button>

            <button
              onClick={() => handleItemClick(onSavePatient)}
              className="w-full px-3 py-1.5 hover:bg-indigo-600/30 text-right flex items-center justify-between text-xs transition"
            >
              <span className="flex items-center gap-2">
                <Save className="w-3.5 h-3.5 text-emerald-400" />
                <span>ذخیره در بانک داده محلی ویندوز</span>
              </span>
              <kbd className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">Ctrl+S</kbd>
            </button>

            <button
              onClick={() => handleItemClick(onOpenPatientModal)}
              className="w-full px-3 py-1.5 hover:bg-indigo-600/30 text-right flex items-center justify-between text-xs transition"
            >
              <span className="flex items-center gap-2">
                <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>مدیریت پرونده‌های ذخیره‌شده</span>
              </span>
              <kbd className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">Ctrl+O</kbd>
            </button>

            <div className="h-px bg-slate-800 my-1"></div>

            <button
              onClick={() => handleItemClick(onPrint)}
              className="w-full px-3 py-1.5 hover:bg-indigo-600/30 text-right flex items-center justify-between text-xs transition"
            >
              <span className="flex items-center gap-2">
                <Printer className="w-3.5 h-3.5 text-rose-400" />
                <span>چاپ پرونده بالینی / خروجی PDF</span>
              </span>
              <kbd className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">Ctrl+P</kbd>
            </button>
          </div>
        )}
      </div>

      {/* ویرایش (Edit) */}
      <div className="relative">
        <button
          onClick={() => toggleMenu('edit')}
          className={`px-2.5 py-1 rounded hover:bg-slate-800 transition flex items-center gap-1 ${
            openMenu === 'edit' ? 'bg-slate-800 text-white' : ''
          }`}
        >
          <span>ویرایش</span>
        </button>

        {openMenu === 'edit' && (
          <div className="absolute right-0 top-full mt-1 w-60 bg-slate-900 border border-slate-700/80 rounded-lg shadow-2xl py-1 z-50 text-slate-200">
            <button
              onClick={() => handleItemClick(onFillExample)}
              className="w-full px-3 py-1.5 hover:bg-indigo-600/30 text-right flex items-center gap-2 text-xs transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>بارگذاری داده نمونه بالینی</span>
            </button>

            <button
              onClick={() => handleItemClick(onCopySummary)}
              className="w-full px-3 py-1.5 hover:bg-indigo-600/30 text-right flex items-center gap-2 text-xs transition"
            >
              <Copy className="w-3.5 h-3.5 text-sky-400" />
              <span>کپی گزارش تشخیصی به کلیپ‌بورد</span>
            </button>

            <div className="h-px bg-slate-800 my-1"></div>

            <button
              onClick={() => handleItemClick(onReset)}
              className="w-full px-3 py-1.5 hover:bg-rose-900/40 text-right flex items-center gap-2 text-xs text-rose-300 transition"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span>پاکسازی مقادیر فرم</span>
            </button>
          </div>
        )}
      </div>

      {/* مشاهده (View) */}
      <div className="relative">
        <button
          onClick={() => toggleMenu('view')}
          className={`px-2.5 py-1 rounded hover:bg-slate-800 transition flex items-center gap-1 ${
            openMenu === 'view' ? 'bg-slate-800 text-white' : ''
          }`}
        >
          <span>نمایش</span>
        </button>

        {openMenu === 'view' && (
          <div className="absolute right-0 top-full mt-1 w-56 bg-slate-900 border border-slate-700/80 rounded-lg shadow-2xl py-1 z-50 text-slate-200">
            <button
              onClick={() => handleItemClick(onZoomIn)}
              className="w-full px-3 py-1.5 hover:bg-indigo-600/30 text-right flex items-center justify-between text-xs transition"
            >
              <span className="flex items-center gap-2">
                <ZoomIn className="w-3.5 h-3.5 text-sky-400" />
                <span>بزرگ‌نمایی صفحه</span>
              </span>
              <kbd className="text-[10px] text-slate-400">Ctrl +</kbd>
            </button>

            <button
              onClick={() => handleItemClick(onZoomOut)}
              className="w-full px-3 py-1.5 hover:bg-indigo-600/30 text-right flex items-center justify-between text-xs transition"
            >
              <span className="flex items-center gap-2">
                <ZoomOut className="w-3.5 h-3.5 text-sky-400" />
                <span>کوچک‌نمایی</span>
              </span>
              <kbd className="text-[10px] text-slate-400">Ctrl -</kbd>
            </button>

            <button
              onClick={() => handleItemClick(onResetZoom)}
              className="w-full px-3 py-1.5 hover:bg-indigo-600/30 text-right flex items-center justify-between text-xs transition"
            >
              <span>بازنشانی اندازه (۱۰۰٪)</span>
              <kbd className="text-[10px] text-slate-400">Ctrl 0</kbd>
            </button>

            <div className="h-px bg-slate-800 my-1"></div>

            <button
              onClick={() => handleItemClick(onToggleFullscreen)}
              className="w-full px-3 py-1.5 hover:bg-indigo-600/30 text-right flex items-center justify-between text-xs transition"
            >
              <span className="flex items-center gap-2">
                <Maximize className="w-3.5 h-3.5 text-emerald-400" />
                <span>تمام‌صفحه (Fullscreen)</span>
              </span>
              <kbd className="text-[10px] text-slate-400">F11</kbd>
            </button>
          </div>
        )}
      </div>

      {/* ابزارها (Tools) */}
      <div className="relative">
        <button
          onClick={() => toggleMenu('tools')}
          className={`px-2.5 py-1 rounded hover:bg-slate-800 transition flex items-center gap-1 ${
            openMenu === 'tools' ? 'bg-slate-800 text-white' : ''
          }`}
        >
          <span>ابزارهای بالینی</span>
        </button>

        {openMenu === 'tools' && (
          <div className="absolute right-0 top-full mt-1 w-64 bg-slate-900 border border-slate-700/80 rounded-lg shadow-2xl py-1 z-50 text-slate-200">
            <button
              onClick={() => handleItemClick(onOpenBmiTool)}
              className="w-full px-3 py-1.5 hover:bg-indigo-600/30 text-right flex items-center gap-2 text-xs transition"
            >
              <Calculator className="w-3.5 h-3.5 text-purple-400" />
              <span>محاسبه‌گر BMI و وزن مجاز بارداری</span>
            </button>

            <button
              onClick={() => handleItemClick(onOpenConverterTool)}
              className="w-full px-3 py-1.5 hover:bg-indigo-600/30 text-right flex items-center gap-2 text-xs transition"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>مبدل تقویم شمسی و میلادی</span>
            </button>
          </div>
        )}
      </div>

      {/* نصب و راهنما (Windows / Install) */}
      <div className="relative">
        <button
          onClick={() => toggleMenu('windows')}
          className={`px-2.5 py-1 rounded hover:bg-slate-800 transition flex items-center gap-1 text-sky-400 font-semibold ${
            openMenu === 'windows' ? 'bg-slate-800 text-sky-300' : ''
          }`}
        >
          <Download className="w-3 h-3 ml-0.5" />
          <span>نصب برنامه ویندوز</span>
        </button>

        {openMenu === 'windows' && (
          <div className="absolute right-0 top-full mt-1 w-72 bg-slate-900 border border-slate-700/80 rounded-lg shadow-2xl py-1 z-50 text-slate-200">
            <button
              onClick={() => handleItemClick(onOpenInstallModal)}
              className="w-full px-3 py-2 hover:bg-sky-600/30 text-right flex items-start gap-2.5 text-xs transition"
            >
              <Download className="w-4 h-4 text-sky-400 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="block text-slate-100">نصب برنامه ویندوز (Desktop App)</strong>
                <span className="text-[11px] text-slate-400">ایجاد آیکون مستقل دسکتاپ و منوی استارت ویندوز</span>
              </div>
            </button>

            {onOpenCSharpCode && (
              <button
                onClick={() => handleItemClick(onOpenCSharpCode)}
                className="w-full px-3 py-2 hover:bg-indigo-600/30 text-right flex items-start gap-2.5 text-xs transition"
              >
                <FileText className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="block text-slate-100">مشاهده و دریافت کد C# Windows Forms</strong>
                  <span className="text-[11px] text-slate-400">کد منبع C# .NET 8 برای Visual Studio</span>
                </div>
              </button>
            )}

            <div className="h-px bg-slate-800 my-1"></div>

            <button
              onClick={() => handleItemClick(onOpenAbout)}
              className="w-full px-3 py-1.5 hover:bg-indigo-600/30 text-right flex items-center gap-2 text-xs transition"
            >
              <Info className="w-3.5 h-3.5 text-indigo-400" />
              <span>درباره نرم‌افزار و شبکه بهداشت سیریک</span>
            </button>
          </div>
        )}
      </div>

      {/* Center/End Right tag */}
      <div className="mr-auto text-[11px] text-slate-400 hidden sm:flex items-center gap-2 font-medium">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
        <span>سامانه تحت ویندوز ۱۰ و ۱۱ — نسخه بالینی آنلاین/آفلاین</span>
      </div>
    </div>
  );
};
