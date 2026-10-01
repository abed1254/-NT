import React, { useState } from 'react';
import { 
  X, 
  Search, 
  UserCheck, 
  Trash2, 
  Download, 
  Upload, 
  UserPlus, 
  Calendar, 
  Clock, 
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';
import { PatientRecord } from '../types';
import { PERSIAN_MONTH_NAMES } from '../utils/jalali';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  patients: PatientRecord[];
  onSelectPatient: (patient: PatientRecord) => void;
  onDeletePatient: (id: string) => void;
  onNewPatient: () => void;
  onExportJson: () => void;
  onImportJson: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PatientManagerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  patients,
  onSelectPatient,
  onDeletePatient,
  onNewPatient,
  onExportJson,
  onImportJson
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredPatients = patients.filter(p => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    return (
      p.fullName.toLowerCase().includes(q) ||
      p.nationalCode.toLowerCase().includes(q) ||
      p.phone.includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">مدیریت پرونده‌های بارداری مادران (بانک داده محلی ویندوز)</h3>
              <p className="text-[11px] text-slate-400">جستجو، بازیابی و مدیریت سوابق ثبت‌شده در حافظه دستگاه</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
            <input
              type="text"
              placeholder="جستجو بر اساس نام مادر، کد ملی یا موبایل..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pr-9 pl-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
            <button
              onClick={() => {
                onNewPatient();
                onClose();
              }}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>بیمار جدید</span>
            </button>

            <button
              onClick={onExportJson}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition"
              title="خروجی فایل پشتیبان از تمام پرونده‌ها"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>پشتیبان JSON</span>
            </button>

            <label className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-sky-400" />
              <span>بازیابی فایل</span>
              <input type="file" accept=".json" onChange={onImportJson} className="hidden" />
            </label>
          </div>
        </div>

        {/* Patients List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-2.5">
          {filteredPatients.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-3">
              <AlertCircle className="w-10 h-10 mx-auto text-slate-500" />
              <p className="text-xs">هیچ پرونده‌ای یافت نشد.</p>
              <p className="text-[11px] text-slate-500">
                می‌توانید اطلاعات بیمار فعلی را با زدن کلید Ctrl+S یا دکمه «ذخیره پرونده» در سیستم ذخیره نمایید.
              </p>
            </div>
          ) : (
            filteredPatients.map((patient) => {
              const lmp = patient.lmpDateShamsi;
              const monthName = PERSIAN_MONTH_NAMES[lmp.month - 1];
              return (
                <div
                  key={patient.id}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-100 text-sm">{patient.fullName || 'بدون نام'}</span>
                      {patient.nationalCode && (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-mono">
                          کد ملی: {patient.nationalCode}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400 bg-indigo-950/60 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800/40">
                        G{patient.gravida}P{patient.para}Ab{patient.abortion}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-rose-400" />
                        <span>تاریخ LMP: {lmp.day} {monthName} {lmp.year}</span>
                      </span>

                      {patient.phone && (
                        <span>تلفن: {patient.phone}</span>
                      )}

                      <span className="flex items-center gap-1 text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span>ثبت: {new Date(patient.createdAt).toLocaleDateString('fa-IR')}</span>
                      </span>
                    </div>

                    {patient.notes && (
                      <p className="text-[11px] text-slate-400 line-clamp-1">
                        یادداشت: {patient.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                    <button
                      onClick={() => {
                        onSelectPatient(patient);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition"
                    >
                      بارگذاری پرونده
                    </button>

                    <button
                      onClick={() => onDeletePatient(patient.id)}
                      className="p-1.5 rounded-lg hover:bg-rose-950/80 text-slate-400 hover:text-rose-400 transition"
                      title="حذف پرونده"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
          <span>مجموع پرونده‌ها: {patients.length} مورد</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
};
