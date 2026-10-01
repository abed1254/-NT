import React from 'react';
import { 
  Minus, 
  Square, 
  X, 
  Maximize2, 
  Download, 
  Printer, 
  FolderOpen, 
  HelpCircle,
  Stethoscope,
  Maximize
} from 'lucide-react';

interface Props {
  isMaximized: boolean;
  onToggleMaximize: () => void;
  onMinimize: () => void;
  onClose: () => void;
  onOpenInstallModal: () => void;
  onPrint: () => void;
  onOpenPatientModal: () => void;
  onOpenHelp: () => void;
  isInstallable: boolean;
  isInstalled: boolean;
}

export const WindowsTitleBar: React.FC<Props> = ({
  isMaximized,
  onToggleMaximize,
  onMinimize,
  onClose,
  onOpenInstallModal,
  onPrint,
  onOpenPatientModal,
  onOpenHelp,
  isInstallable,
  isInstalled
}) => {
  return (
    <div className="windows-titlebar h-10 bg-slate-950 text-slate-200 border-b border-slate-800 flex items-center justify-between select-none px-2 z-50 flex-shrink-0">
      {/* Right side in RTL (Application identity & Windows icon) */}
      <div className="flex items-center gap-2.5 px-1">
        {/* Windows 11 Logo */}
        <div className="grid grid-cols-2 gap-0.5 w-4 h-4 text-sky-400">
          <div className="bg-sky-400 rounded-[1px]"></div>
          <div className="bg-sky-400 rounded-[1px]"></div>
          <div className="bg-sky-400 rounded-[1px]"></div>
          <div className="bg-sky-400 rounded-[1px]"></div>
        </div>

        <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-rose-500 to-indigo-600 flex items-center justify-center text-white text-xs shadow-sm">
          <Stethoscope className="w-3.5 h-3.5" />
        </div>

        <span className="text-xs font-bold text-slate-100 tracking-wide truncate">
          سامانه تخصصی سن بارداری، سونوگرافی NT و تخمین زایمان
        </span>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800/80">
          نسخه دسکتاپ ویندوز
        </span>
      </div>

      {/* Middle Quick Actions */}
      <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-300">
        <button
          onClick={onOpenPatientModal}
          className="px-2.5 py-1 rounded hover:bg-slate-800/80 text-slate-300 hover:text-white flex items-center gap-1.5 transition text-[11px]"
          title="پرونده بیماران (Ctrl+O)"
        >
          <FolderOpen className="w-3.5 h-3.5 text-indigo-400" />
          <span>پرونده‌ها</span>
        </button>

        <button
          onClick={onPrint}
          className="px-2.5 py-1 rounded hover:bg-slate-800/80 text-slate-300 hover:text-white flex items-center gap-1.5 transition text-[11px]"
          title="چاپ و ذخیره به عنوان PDF (Ctrl+P)"
        >
          <Printer className="w-3.5 h-3.5 text-emerald-400" />
          <span>چاپ / PDF</span>
        </button>

        {!isInstalled && (
          <button
            onClick={onOpenInstallModal}
            className="px-2.5 py-1 rounded bg-sky-600/90 hover:bg-sky-600 text-white flex items-center gap-1.5 transition text-[11px] font-bold shadow-xs animate-pulse"
            title="نصب بر روی ویندوز به صورت برنامه دسکتاپ مستقل"
          >
            <Download className="w-3.5 h-3.5" />
            <span>نصب برنامه ویندوز</span>
          </button>
        )}

        <button
          onClick={onOpenHelp}
          className="px-2 py-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition"
          title="راهنمای نرم‌افزار و دستورالعمل‌ها"
        >
          <HelpCircle className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Left side in RTL (Standard Windows Window Controls: Minimize, Maximize, Close) */}
      <div className="flex items-center" dir="ltr">
        <button
          onClick={onMinimize}
          className="w-11 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition"
          title="کوچک کردن پنجره"
          aria-label="Minimize"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onToggleMaximize}
          className="w-11 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition"
          title={isMaximized ? 'بازیابی پنجره (Restore)' : 'بزرگ کردن پنجره (Maximize)'}
          aria-label="Maximize"
        >
          {isMaximized ? (
            <Maximize className="w-3.5 h-3.5" />
          ) : (
            <Square className="w-3.5 h-3.5" />
          )}
        </button>

        <button
          onClick={onClose}
          className="w-12 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#e81123] transition"
          title="بستن برنامه (Alt+F4)"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
