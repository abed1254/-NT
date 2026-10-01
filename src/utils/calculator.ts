import { AcogEvaluation, FruitSizeInfo, MilestoneItem, NTWindowData } from '../types';
import { JalaliDate } from './jalali';

export const FRUIT_SIZES: FruitSizeInfo[] = [
  { week: 4, name: 'دانه خشخاش', emoji: '🌱', len: '۱ میلی‌متر', weight: '< ۰.۱ گرم', desc: 'کاشت رویان در دیواره رحم صورت گرفته و سلول‌های بنیادی اولیه با سرعت تکثیر می‌شوند.' },
  { week: 5, name: 'دانه کنجد', emoji: '🌾', len: '۲ میلی‌متر', weight: '< ۰.۲ گرم', desc: 'لوله عصبی جنین در حال شکل‌گیری است و سیستم گردش خون اولیه آغاز به کار می‌کند.' },
  { week: 6, name: 'عدس', emoji: '🫘', len: '۴ میلی‌متر', weight: '۰.۵ گرم', desc: 'قلب کوچک جنین با سرعت ۱۰۰ الی ۱۶۰ ضربان در دقیقه آغاز به تپیدن می‌کند.' },
  { week: 7, name: 'بلوبری', emoji: '🫐', len: '۱۰ میلی‌‌متر', weight: '۱ گرم', desc: 'دست‌ها و پاهای اولیه مانند جوانه‌های کوچکی شروع به جوانه زدن می‌کنند.' },
  { week: 8, name: 'تمشک', emoji: '🍓', len: '۱۶ میلی‌متر', weight: '۱.۵ گرم', desc: 'صورت، پلک‌ها و بند ناف در حال تکوین هستند و اندام‌های حرکتی واضح‌تر می‌شوند.' },
  { week: 9, name: 'گیلاس', emoji: '🍒', len: '۲۳ میلی‌‌متر', weight: '۲.۵ گرم', desc: 'انقباضات غیرارادی ماهیچه‌ها شروع می‌شود؛ انگشتان کوچک به وضوح پدیدارند.' },
  { week: 10, name: 'توت‌فرنگی', emoji: '🍓', len: '۳۱ میلی‌متر', weight: '۴ گرم', desc: 'پایان دوره رویانی؛ جنین اکنون ساختار کلی بدنش تکمیل شده و در حال رشد سریع است.' },
  { week: 11, name: 'انجیر', emoji: '🍈', len: '۴۱ میلی‌متر', weight: '۷ گرم', desc: 'آغاز بازه مجاز برای سونوگرافی NT؛ جنین انگشتانش را باز و بسته می‌کند.' },
  { week: 12, name: 'لیمو ترش', emoji: '🍋', len: '۵۴ میلی‌متر', weight: '۱۴ گرم', desc: 'زمان طلایی و ایده‌آل برای سونوگرافی NT و آزمایش غربالگری سه ماهه اول.' },
  { week: 13, name: 'نخودفرنگی در غلاف', emoji: '🫛', len: '۷۴ میلی‌متر', weight: '۲۳ گرم', desc: 'پایان سه ماهه اول و آخرین مهلت معتبر علمی برای سونوگرافی NT جنین.' },
  { week: 14, name: 'هلو', emoji: '🍑', len: '۸.۷ سانتی‌متر', weight: '۴۳ گرم', desc: 'آغاز سه ماهه دوم؛ جنین حالات چهره مثل اخم و مکیدن شست را تمرین می‌کند.' },
  { week: 15, name: 'سیب درختی', emoji: '🍎', len: '۱۰ سانتی‌متر', weight: '۷۰ گرم', desc: 'پوست جنین بسیار نازک و شفاف است و استخوان‌ها شروع به کلسیم‌گیری می‌کنند.' },
  { week: 16, name: 'آووکادو', emoji: '🥑', len: '۱۱.۶ سانتی‌متر', weight: '۱۰۰ گرم', desc: 'چشم‌ها می‌توانند به نور حساس شوند و جنین حرکت‌های ظریفی انجام می‌دهد.' },
  { week: 18, name: 'فلفل دلمه‌ای', emoji: '🫑', len: '۱۴ سانتی‌متر', weight: '۱۹۰ گرم', desc: 'زمان ایده‌آل سونوگرافی تفصیلی آنومالی اسکن جهت بررسی دقیق سلامت جنین.' },
  { week: 20, name: 'موز', emoji: '🍌', len: '۲۵ سانتی‌متر', weight: '۳۰۰ گرم', desc: 'نیمه راه بارداری؛ احساس حرکات شیرین جنین توسط مادر به خوبی نمایان است.' },
  { week: 24, name: 'بلال', emoji: '🌽', len: '۳۰ سانتی‌متر', weight: '۶۰۰ گرم', desc: 'شنوایی جنین به صداهای محیط و صدای آرامش‌بخش مادر واکنش نشان می‌دهد.' },
  { week: 28, name: 'بادمجان', emoji: '🍆', len: '۳۷ سانتی‌متر', weight: '۱ کیلوگرم', desc: 'ورود به سه ماهه سوم؛ پلک‌های جنین باز می‌شوند و چرخه‌های خواب و بیداری شکل می‌گیرند.' },
  { week: 32, name: 'کدو حلوایی کوچک', emoji: '🎃', len: '۴۲ سانتی‌متر', weight: '۱.۷ کیلوگرم', desc: 'تکامل سریع ریه‌ها و تشکیل لایه چربی محافظ زیر پوست نوزاد.' },
  { week: 36, name: 'پاپایا یا خربزه', emoji: '🍈', len: '۴۷ سانتی‌متر', weight: '۲.۶ کیلوگرم', desc: 'جنین بیشتر فضای رحم را پر کرده و سر به سمت لگن پایین می‌آید.' },
  { week: 40, name: 'هندوانه خوشمزه', emoji: '🍉', len: '۵۱ سانتی‌متر', weight: '۳.۴ کیلوگرم', desc: 'بارداری کامل (Full Term)؛ نوزاد شما در آستانه تولد قرار دارد!' }
];

export function getFruitForWeek(week: number): FruitSizeInfo {
  let selected = FRUIT_SIZES[0];
  for (const item of FRUIT_SIZES) {
    if (week >= item.week) {
      selected = item;
    }
  }
  return selected;
}

export function calculateLmpData(lmpDate: Date, cycleLength = 28) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const cycleAdjustment = cycleLength - 28;
  const totalDays = 280 + cycleAdjustment;

  const edd = new Date(lmpDate);
  edd.setDate(edd.getDate() + totalDays);

  const diffMs = today.getTime() - lmpDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  const weeks = Math.max(0, Math.floor(diffDays / 7));
  const daysRem = Math.max(0, diffDays % 7);

  const daysToEdd = Math.ceil((edd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const progressPercent = Math.min(100, Math.max(0, Math.round((diffDays / totalDays) * 100)));

  let trimester = 'سه‌ماهه اول';
  let trimesterDescription = 'مرحله ارگانوژنز و تشکیل اندام‌های حیاتی';
  let trimesterNumber = 1;

  if (weeks >= 28) {
    trimester = 'سه‌ماهه سوم';
    trimesterDescription = 'وزن‌گیری نهایی جنین و آمادگی زایمان';
    trimesterNumber = 3;
  } else if (weeks >= 14) {
    trimester = 'سه‌ماهه دوم';
    trimesterDescription = 'رشد اسکلتی و شروع احساس تکان‌ها';
    trimesterNumber = 2;
  }

  return {
    lmpDate,
    edd,
    diffDays,
    weeks,
    daysRem,
    daysToEdd,
    progressPercent,
    trimester,
    trimesterDescription,
    trimesterNumber
  };
}

export function calculateNTWindow(lmpDate: Date): NTWindowData {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 11w0d = 77 days
  const startDate = new Date(lmpDate);
  startDate.setDate(startDate.getDate() + 77);

  // 12w2d = 86 days (Golden Target)
  const bestDate = new Date(lmpDate);
  bestDate.setDate(bestDate.getDate() + 86);

  // 13w6d = 97 days (Absolute Deadline)
  const endDate = new Date(lmpDate);
  endDate.setDate(endDate.getDate() + 97);

  let status: 'upcoming' | 'active' | 'passed' = 'upcoming';
  let daysRemainingOrPassed = 0;

  if (today < startDate) {
    status = 'upcoming';
    daysRemainingOrPassed = Math.ceil((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  } else if (today >= startDate && today <= endDate) {
    status = 'active';
    daysRemainingOrPassed = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  } else {
    status = 'passed';
    daysRemainingOrPassed = Math.floor((today.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24));
  }

  return {
    startDate,
    bestDate,
    endDate,
    status,
    daysRemainingOrPassed
  };
}

export function calculateUltrasoundData(
  scanDate: Date,
  scanWeeks: number,
  scanDays: number
) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const scanTotalDays = scanWeeks * 7 + scanDays;

  // Reconstructed equivalent LMP from Ultrasound
  const equivLmp = new Date(scanDate);
  equivLmp.setDate(equivLmp.getDate() - scanTotalDays);

  const edd = new Date(equivLmp);
  edd.setDate(edd.getDate() + 280);

  const daysSinceScan = Math.floor((today.getTime() - scanDate.getTime()) / (1000 * 60 * 60 * 24));
  const currentTotalDays = scanTotalDays + daysSinceScan;
  const currentWeeks = Math.max(0, Math.floor(currentTotalDays / 7));
  const currentDaysRem = Math.max(0, currentTotalDays % 7);

  return {
    scanDate,
    scanWeeks,
    scanDays,
    scanTotalDays,
    equivLmp,
    edd,
    daysSinceScan,
    currentWeeks,
    currentDaysRem,
    currentTotalDays
  };
}

export function evaluateAcog(
  lmpDate: Date,
  eddLmp: Date,
  scanDate: Date,
  scanWeeks: number,
  eddUs: Date
): AcogEvaluation {
  let thresholdDays = 7;
  let scanCategory = 'سه‌ماهه اول (هفته ۹ الی ۱۳)';

  if (scanWeeks < 9) {
    thresholdDays = 5;
    scanCategory = 'سونوگرافی زیر ۹ هفته (CRL)';
  } else if (scanWeeks <= 13) {
    thresholdDays = 7;
    scanCategory = 'سونوگرافی غربالگری اول / NT (هفته ۹ الی ۱۳)';
  } else if (scanWeeks <= 21) {
    thresholdDays = 10;
    scanCategory = 'سونوگرافی آنومالی اسکن (هفته ۱۴ الی ۲۱)';
  } else if (scanWeeks <= 27) {
    thresholdDays = 14;
    scanCategory = 'سه‌ماهه دوم پیشرفته (هفته ۲۲ الی ۲۷)';
  } else {
    thresholdDays = 21;
    scanCategory = 'سه‌ماهه سوم (هفته ۲۸ به بعد)';
  }

  const diffMs = Math.abs(eddLmp.getTime() - eddUs.getTime());
  const discrepancyDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (discrepancyDays <= thresholdDays) {
    return {
      thresholdDays,
      scanCategory,
      discrepancyDays,
      preferredMethod: 'lmp',
      title: 'انطباق بالینی مطلوب (تاریخ LMP تأیید می‌شود)',
      badgeText: 'مبنا: LMP رسمی',
      isAcceptableLmp: true,
      message: `اختلاف دو روش برابر با ${discrepancyDays} روز است که کمتر از حد آستانه مجاز (${thresholdDays} روز در ${scanCategory}) می‌باشد. طبق دستورالعمل رسمی کالج ACOG، تاریخ زایمان بر اساس اولین روز آخرین قاعدگی (${JalaliDate.formatShamsi(eddLmp)}) حفظ می‌گردد.`
    };
  } else {
    return {
      thresholdDays,
      scanCategory,
      discrepancyDays,
      preferredMethod: 'us',
      title: 'اختلاف معنادار بالینی (تاریخ بر اساس سونوگرافی تصحیح شود)',
      badgeText: 'مبنا: سونوگرافی',
      isAcceptableLmp: false,
      message: `اختلاف دو روش (${discrepancyDays} روز) فراتر از آستانه مجاز بالینی (${thresholdDays} روز در ${scanCategory}) است. بر اساس گایدلاین کمیته ۷۰۰ کالج زنان آمریکا (ACOG Bulletin No. 700)، سن جنین و تاریخ تخمینی زایمان باید به تاریخ سونوگرافی یعنی ${JalaliDate.formatShamsi(eddUs)} اصلاح گردد.`
    };
  }
}

export function getPrenatalMilestones(baseLmpDate: Date): MilestoneItem[] {
  const milestonesDef = [
    {
      id: 'early_heartbeat',
      title: 'سونوگرافی تشکیل قلب و ساک',
      weekRange: 'هفته ۶ الی ۸',
      targetWeek: 7,
      days: 49,
      iconName: 'HeartPulse',
      colorClass: 'text-rose-600 dark:text-rose-400',
      bgClass: 'bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:border-rose-900',
      description: 'تایید بارداری داخل رحمی، رویت کیسه زرده و شنیدن ضربان قلب رویان',
      category: 'ultrasound' as const
    },
    {
      id: 'nt_scan_combo',
      title: 'سونوگرافی NT و غربالگری اول',
      weekRange: 'هفته ۱۱ الی ۱۳+۶',
      targetWeek: 12.3,
      days: 86,
      iconName: 'ShieldAlert',
      colorClass: 'text-indigo-600 dark:text-indigo-400',
      bgClass: 'bg-indigo-50 border-indigo-200 dark:bg-indigo-950/40 dark:border-indigo-900',
      description: 'اندازه‌گیری ضخامت چین گردن (NT) و آزمایش بیوشیمی دبل مارکر (PAPP-A و Free β-hCG)',
      category: 'ultrasound' as const
    },
    {
      id: 'quad_screening',
      title: 'غربالگری سه‌ماهه دوم (کوآد)',
      weekRange: 'هفته ۱۵ الی ۱۷',
      targetWeek: 16,
      days: 112,
      iconName: 'TestTube2',
      colorClass: 'text-amber-600 dark:text-amber-400',
      bgClass: 'bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-900',
      description: 'آزمایش خون چهارگانه برای بررسی سندرم داون، تریزومی ۱۸ و نقایص لوله عصبی (NTD)',
      category: 'lab' as const
    },
    {
      id: 'anomaly_scan',
      title: 'سونوگرافی آنومالی اسکن تفصیلی',
      weekRange: 'هفته ۱۸ الی ۲۰',
      targetWeek: 19,
      days: 133,
      iconName: 'Sparkles',
      colorClass: 'text-purple-600 dark:text-purple-400',
      bgClass: 'bg-purple-50 border-purple-200 dark:bg-purple-950/40 dark:border-purple-900',
      description: 'ارزیابی جامع بیومتری، ارگان‌های داخلی، بطن‌های مغزی، کلیه‌ها، قلب و تعیین قطعی جنسیت',
      category: 'ultrasound' as const
    },
    {
      id: 'gtt_diabetes',
      title: 'آزمایش قند ناشتا و چالش گلوکز (OGTT)',
      weekRange: 'هفته ۲۴ الی ۲۸',
      targetWeek: 26,
      days: 182,
      iconName: 'Activity',
      colorClass: 'text-emerald-600 dark:text-emerald-400',
      bgClass: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-900',
      description: 'تست تحمل گلوکز خوراکی جهت پیشگیری و کنترل زودهنگام دیابت بارداری مادر',
      category: 'lab' as const
    },
    {
      id: 'rh_injection',
      title: 'تزریق آمپول روگام (در صورت Rh منفی)',
      weekRange: 'هفته ۲۸',
      targetWeek: 28,
      days: 196,
      iconName: 'Syringe',
      colorClass: 'text-sky-600 dark:text-sky-400',
      bgClass: 'bg-sky-50 border-sky-200 dark:bg-sky-950/40 dark:border-sky-900',
      description: 'پیشگیری از ایزوایمونیزاسیون برای مادران با گروه خونی منفی و همسر مثبت',
      category: 'clinical' as const
    },
    {
      id: 'growth_scan',
      title: 'سونوگرافی ارزیابی رشد جنین و مایع آمنیوتیک',
      weekRange: 'هفته ۳۲ الی ۳۴',
      targetWeek: 33,
      days: 231,
      iconName: 'Waves',
      colorClass: 'text-teal-600 dark:text-teal-400',
      bgClass: 'bg-teal-50 border-teal-200 dark:bg-teal-950/40 dark:border-teal-900',
      description: 'بررسی شاخص مایع آمنیوتیک (AFI)، وزن تخمینی جنین (EFW) و وضعیت جفت',
      category: 'ultrasound' as const
    },
    {
      id: 'nst_monitoring',
      title: 'نوار قلب جنین (NST) و آمادگی زایمان',
      weekRange: 'هفته ۳۷ الی ۴۰',
      targetWeek: 38,
      days: 266,
      iconName: 'Stethoscope',
      colorClass: 'text-rose-700 dark:text-rose-300',
      bgClass: 'bg-rose-100 border-rose-300 dark:bg-rose-900/40 dark:border-rose-800',
      description: 'بررسی ضربان قلب بدون استرس، حرکات جنینی و معاینه لگن برای زایمان ایمن',
      category: 'clinical' as const
    }
  ];

  return milestonesDef.map(item => {
    const targetDate = new Date(baseLmpDate);
    targetDate.setDate(targetDate.getDate() + item.days);
    return {
      ...item,
      date: targetDate
    };
  });
}
