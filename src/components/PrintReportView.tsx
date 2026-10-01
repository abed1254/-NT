import React from 'react';
import { AcogEvaluation, MilestoneItem, NTWindowData, PatientRecord } from '../types';
import { JalaliDate } from '../utils/jalali';

interface Props {
  patient: Partial<PatientRecord>;
  lmpDate: Date;
  eddLmp: Date;
  weeksLmp: number;
  daysRemLmp: number;
  ntWindow: NTWindowData;
  usScanDate?: Date;
  usWeeks?: number;
  usDays?: number;
  eddUs?: Date;
  acog: AcogEvaluation;
  milestones: MilestoneItem[];
}

export const PrintReportView: React.FC<Props> = ({
  patient,
  lmpDate,
  eddLmp,
  weeksLmp,
  daysRemLmp,
  ntWindow,
  usScanDate,
  usWeeks,
  usDays,
  eddUs,
  acog,
  milestones
}) => {
  const printDateStr = JalaliDate.formatShamsi(new Date(), true);

  return (
    <div className="hidden print:block print-area bg-white text-slate-900 p-8 max-w-4xl mx-auto font-sans leading-normal">
      {/* Official Header */}
      <div className="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-xl font-black text-slate-900">
            جمهوری اسلامی ایران — وزارت بهداشت، درمان و آموزش پزشکی
          </h1>
          <h2 className="text-base font-bold text-slate-800">
            دانشگاه علوم پزشکی هرمزگان — شبکه بهداشت و درمان شهرستان سیریک
          </h2>
          <h3 className="text-sm font-semibold text-rose-700">
            مرکز خدمات جامع سلامت / خانه بهداشت روستای گهردو
          </h3>
        </div>
        <div className="text-left text-xs font-medium space-y-1">
          <p>تاریخ چاپ: <strong className="font-bold">{printDateStr}</strong></p>
          <p>نوع سند: <strong className="font-bold">برگه جامع ارزیابی سن بارداری و غربالگری NT</strong></p>
          <p>استاندارد: <strong className="font-bold">پروتکل بالینی ACOG No. 700</strong></p>
        </div>
      </div>

      {/* Patient Demographic Information */}
      <div className="border border-slate-300 rounded-lg p-4 mb-5 bg-slate-50/50">
        <h4 className="font-black text-xs text-slate-900 mb-2 border-b border-slate-200 pb-1">
          مشخصات هویتی و مامایی مادر
        </h4>
        <div className="grid grid-cols-4 gap-3 text-xs">
          <div>نام و نام‌خانوادگی: <strong className="font-bold text-slate-900">{patient.fullName || '---'}</strong></div>
          <div>کد ملی: <strong className="font-bold text-slate-900">{patient.nationalCode || '---'}</strong></div>
          <div>شماره تماس: <strong className="font-bold text-slate-900">{patient.phone || '---'}</strong></div>
          <div>شرح زایمان: <strong className="font-bold text-slate-900">G{patient.gravida ?? 1}P{patient.para ?? 0}Ab{patient.abortion ?? 0}</strong></div>
        </div>
      </div>

      {/* Calculations & Results */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        {/* LMP Card */}
        <div className="border border-slate-300 rounded-lg p-4">
          <h4 className="font-bold text-xs text-rose-800 border-b border-rose-200 pb-1 mb-2">
            روش اول: بر مبنای آخرین قاعدگی (LMP)
          </h4>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span>تاریخ اولین روز LMP:</span>
              <strong className="font-bold">{JalaliDate.formatShamsi(lmpDate)}</strong>
            </div>
            <div className="flex justify-between">
              <span>سن تخمینی امروز:</span>
              <strong className="font-bold text-slate-900">{weeksLmp} هفته و {daysRemLmp} روز</strong>
            </div>
            <div className="flex justify-between">
              <span>تاریخ زایمان تخمینی (EDD):</span>
              <strong className="font-bold text-rose-700">{JalaliDate.formatShamsi(eddLmp)}</strong>
            </div>
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>معادل میلادی:</span>
              <span>{JalaliDate.formatMiladi(eddLmp)}</span>
            </div>
          </div>
        </div>

        {/* Ultrasound Card */}
        <div className="border border-slate-300 rounded-lg p-4">
          <h4 className="font-bold text-xs text-indigo-800 border-b border-indigo-200 pb-1 mb-2">
            روش دوم: بر مبنای سونوگرافی (US)
          </h4>
          <div className="space-y-1.5 text-xs">
            {usScanDate && eddUs ? (
              <>
                <div className="flex justify-between">
                  <span>تاریخ انجام سونوگرافی:</span>
                  <strong className="font-bold">{JalaliDate.formatShamsi(usScanDate)}</strong>
                </div>
                <div className="flex justify-between">
                  <span>سن درج‌شده در سونوگرافی:</span>
                  <strong className="font-bold">{usWeeks} هفته و {usDays} روز</strong>
                </div>
                <div className="flex justify-between">
                  <span>تاریخ زایمان تخمینی سونو:</span>
                  <strong className="font-bold text-indigo-700">{JalaliDate.formatShamsi(eddUs)}</strong>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>معادل میلادی:</span>
                  <span>{JalaliDate.formatMiladi(eddUs)}</span>
                </div>
              </>
            ) : (
              <p className="text-slate-500 italic">اطلاعات سونوگرافی ثبت نشده است.</p>
            )}
          </div>
        </div>
      </div>

      {/* NT Ultrasound Window Box */}
      <div className="border-2 border-indigo-600 rounded-lg p-4 mb-5 bg-indigo-50/40">
        <h4 className="font-black text-sm text-indigo-900 mb-1 flex items-center justify-between">
          <span>پنجره طلایی سونوگرافی NT و غربالگری ناهنجاری اول (CRL 45-84 mm)</span>
          <span className="text-xs bg-indigo-600 text-white px-2 py-0.5 rounded font-bold">بسیار حائز اهمیت</span>
        </h4>
        <p className="text-xs text-slate-700 mb-3">
          محدوده مجاز علمی جهت اندازه‌گیری دقیق ضخامت چین پشت گردن جنین (Nuchal Translucency) و آزمایش دبل مارکر:
        </p>
        <div className="grid grid-cols-3 gap-3 text-center text-xs">
          <div className="bg-white p-2.5 rounded border border-indigo-200">
            <span className="text-slate-500 block mb-0.5">شروع بازه مجاز (11w0d)</span>
            <strong className="font-black text-slate-900">{JalaliDate.formatShamsi(ntWindow.startDate)}</strong>
          </div>
          <div className="bg-indigo-600 text-white p-2.5 rounded border border-indigo-700">
            <span className="text-indigo-100 block mb-0.5">بهترین زمان طلایی (12w2d)</span>
            <strong className="font-black text-white">{JalaliDate.formatShamsi(ntWindow.bestDate)}</strong>
          </div>
          <div className="bg-white p-2.5 rounded border border-rose-300">
            <span className="text-rose-600 block mb-0.5">پایان مهلت مجاز (13w6d)</span>
            <strong className="font-black text-slate-900">{JalaliDate.formatShamsi(ntWindow.endDate)}</strong>
          </div>
        </div>
      </div>

      {/* ACOG Clinical Triage Decision */}
      <div className="border border-slate-300 rounded-lg p-4 mb-5 bg-slate-50">
        <h4 className="font-bold text-xs text-slate-900 mb-1">
          نتیجه تطبیق با راهنمای کمیته بالینی ACOG (Committee Opinion No. 700):
        </h4>
        <p className="text-xs text-slate-700 leading-relaxed font-medium">
          {acog.message}
        </p>
      </div>

      {/* Prenatal Milestones Calendar */}
      <div className="border border-slate-300 rounded-lg p-4 mb-6">
        <h4 className="font-bold text-xs text-slate-900 mb-2 border-b border-slate-200 pb-1">
          برنامه زمان‌بندی آزمایش‌ها و مراقبت‌های مادر و جنین
        </h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {milestones.slice(0, 6).map((m) => (
            <div key={m.id} className="flex justify-between items-center py-1 border-b border-slate-100">
              <span className="font-semibold text-slate-800">{m.title} ({m.weekRange}):</span>
              <strong className="font-bold text-slate-900">{JalaliDate.formatShamsi(m.date)}</strong>
            </div>
          ))}
        </div>
      </div>

      {/* Signatures */}
      <div className="pt-8 border-t border-slate-300 flex justify-between items-end text-xs">
        <div className="text-center w-48">
          <p className="font-bold text-slate-800">مهر و امضای ماما / مراقب سلامت</p>
          <div className="h-16"></div>
          <p className="text-slate-400">....................................</p>
        </div>
        <div className="text-center w-48">
          <p className="font-bold text-slate-800">مهر و امضای پزشک معالج</p>
          <div className="h-16"></div>
          <p className="text-slate-400">....................................</p>
        </div>
      </div>
    </div>
  );
};
