export type CalendarMode = 'shamsi' | 'miladi';
export type ActiveTab = 'lmp' | 'us' | 'compare' | 'milestones' | 'patients';

export interface PatientRecord {
  id: string;
  fullName: string;
  nationalCode: string;
  phone: string;
  gravida: number; // تعداد بارداری
  para: number; // تعداد زایمان
  abortion: number; // تعداد سقط
  lmpDateShamsi: { year: number; month: number; day: number };
  lmpCycleLength: number;
  usScanDateShamsi?: { year: number; month: number; day: number };
  usWeeks?: number;
  usDays?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NTWindowData {
  startDate: Date;
  bestDate: Date;
  endDate: Date;
  status: 'upcoming' | 'active' | 'passed';
  daysRemainingOrPassed: number;
}

export interface AcogEvaluation {
  thresholdDays: number;
  scanCategory: string;
  discrepancyDays: number;
  preferredMethod: 'lmp' | 'us';
  title: string;
  message: string;
  badgeText: string;
  isAcceptableLmp: boolean;
}

export interface MilestoneItem {
  id: string;
  title: string;
  weekRange: string;
  targetWeek: number;
  date: Date;
  iconName: string;
  colorClass: string;
  bgClass: string;
  description: string;
  category: 'ultrasound' | 'lab' | 'clinical';
}

export interface FruitSizeInfo {
  week: number;
  name: string;
  emoji: string;
  len: string;
  weight: string;
  desc: string;
}
