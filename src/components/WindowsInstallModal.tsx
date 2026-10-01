import React from 'react';
import { 
  X, 
  Download, 
  Monitor, 
  CheckCircle2, 
  Laptop, 
  Terminal, 
  ShieldCheck, 
  Copy, 
  ExternalLink,
  Sparkles
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onInstallPwa: () => void;
  isInstallable: boolean;
  isInstalled: boolean;
}

export const WindowsInstallModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onInstallPwa,
  isInstallable,
  isInstalled
}) => {
  const [copiedCmd, setCopiedCmd] = React.useState(false);

  if (!isOpen) return null;

  const copyBuildScript = () => {
    const script = `npx @bubblewrap/cli build\n# یا برای ساخت فایل EXE با الکترون:\nnpx nativefier --name "Pregnancy-NT-Calculator" --platform "windows" --icon "public/icon.svg" "https://..."`;
    navigator.clipboard.writeText(script);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Title bar */}
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">نصب برنامه روی ویندوز (Windows Desktop Application)</h3>
              <p className="text-[11px] text-slate-400">نصب مستقیم به عنوان اپلیکیشن مستقل در ویندوز ۱۰ و ۱۱ بدون نیاز به مرورگر</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto text-xs text-slate-300 leading-relaxed">
          {/* Main Action Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-sky-950/80 via-indigo-950/40 to-slate-900 border border-sky-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-right">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-300">
                <Sparkles className="w-3 h-3 text-sky-400" />
                سریع‌ترین روش (یک کلیک)
              </span>
              <h4 className="text-sm font-extrabold text-white">نصب برنامه بر روی دسکتاپ ویندوز</h4>
              <p className="text-[11px] text-slate-300">
                با نصب نرم‌افزار، آیکون اختصاصی در دسکتاپ و منوی استارت ویندوز قرار گرفته و پنجره مستقل باز می‌شود.
              </p>
            </div>

            {isInstalled ? (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>برنامه در ویندوز نصب است</span>
              </div>
            ) : isInstallable ? (
              <button
                onClick={onInstallPwa}
                className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black shadow-lg shadow-sky-500/30 flex items-center gap-2 transition flex-shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>نصب در ویندوز</span>
              </button>
            ) : (
              <div className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-[11px] text-center">
                از طریق منوی مرورگر Edge یا Chrome روی دکمه Install کلیک کنید
              </div>
            )}
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-1.5 text-sky-400 font-bold text-xs">
                <Monitor className="w-4 h-4" />
                <span>پنجره مستقل ویندوز</span>
              </div>
              <p className="text-[11px] text-slate-400">بدون نوار آدرس مرورگر، همراه با کلیدهای میانبر استاندارد ویندوز و ظاهر مدرن Fluent.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>عملکرد ۱۰۰٪ آفلاین</span>
              </div>
              <p className="text-[11px] text-slate-400">تمام محاسبات بدون نیاز به اینترنت کار می‌کنند و اطلاعات پرونده در هارد دیسک ذخیره می‌شود.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-1.5 text-purple-400 font-bold text-xs">
                <Laptop className="w-4 h-4" />
                <span>چاپ مستقیم A4</span>
              </div>
              <p className="text-[11px] text-slate-400">خروجی منظم نسخه و برگه خلاصه پرونده مامایی متناسب با پرینترهای درمانگاه و بهداشت.</p>
            </div>
          </div>

          {/* Guide Steps */}
          <div className="space-y-2.5 pt-1">
            <h5 className="font-bold text-slate-200 text-xs">راهنمای دستی نصب در مرورگر مایکروسافت اج (Microsoft Edge) یا گوگل کروم:</h5>
            <ol className="list-decimal list-inside space-y-1 text-slate-400 text-[11px] leading-relaxed">
              <li>در بالای مرورگر Edge، آیکون <strong className="text-slate-200">App available</strong> (سه مربع و یک علامت مثبت) در انتهای نوار آدرس را مشاهده می‌کنید.</li>
              <li>روی آن کلیک کرده و گزینه <strong className="text-sky-300">Install</strong> را انتخاب نمایید.</li>
              <li>گزینه‌های <strong className="text-slate-200">Pin to Taskbar</strong> و <strong className="text-slate-200">Create Desktop Shortcut</strong> را تیک بزنید تا نرم‌افزار به نوار وظیفه و دسکتاپ ویندوز الصاق گردد.</li>
            </ol>
          </div>

          {/* For IT / Developers: Standalone EXE creation instructions */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] text-slate-300 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                تبدیل به فایل اجرایی EXE مستقل با PWABuilder یا Electron:
              </span>
              <button
                onClick={copyBuildScript}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 text-[10px] transition"
              >
                <Copy className="w-3 h-3" />
                <span>{copiedCmd ? 'کپی شد!' : 'کپی دستور'}</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-400">
              می‌توانید آدرس این سامانه را در سایت رسمی مایکروسافت <strong className="text-sky-400">PWABuilder.com</strong> وارد کرده و مستقیماً پکیج نصبی <code className="text-rose-300">.msix</code> یا فایل نصبی ویندوز استور را با یک کلیک تحویل بگیرید.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition"
          >
            بستن پنجره
          </button>
        </div>
      </div>
    </div>
  );
};
