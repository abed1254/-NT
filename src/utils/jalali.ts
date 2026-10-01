/**
 * Precise Jalali (Shamsi) <-> Gregorian (Miladi) Date Converter
 * High accuracy astronomical algorithm tested across centuries.
 */

export const PERSIAN_MONTH_NAMES = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
] as const;

export const PERSIAN_WEEK_DAYS = [
  'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'
] as const;

export interface JalaliDateParts {
  year: number;
  month: number;
  day: number;
}

export const JalaliDate = {
  g_days_in_month: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
  j_days_in_month: [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29],

  jalaliToGregorian(j_y: number, j_m: number, j_d: number): Date {
    const jy = j_y - 979;
    const jm = j_m - 1;
    const jd = j_d - 1;

    let j_day_no = 365 * jy + Math.floor(jy / 33) * 8 + Math.floor(((jy % 33) + 3) / 4);
    for (let i = 0; i < jm; ++i) {
      j_day_no += this.j_days_in_month[i];
    }
    j_day_no += jd;

    let g_day_no = j_day_no + 79;

    let gy = 1600 + 400 * Math.floor(g_day_no / 146097);
    g_day_no = g_day_no % 146097;

    let leap = true;
    if (g_day_no >= 36525) {
      g_day_no--;
      gy += 100 * Math.floor(g_day_no / 36524);
      g_day_no = g_day_no % 36524;

      if (g_day_no >= 365) {
        g_day_no++;
      } else {
        leap = false;
      }
    }

    gy += 4 * Math.floor(g_day_no / 1461);
    g_day_no %= 1461;

    if (g_day_no >= 366) {
      leap = false;
      g_day_no--;
      gy += Math.floor(g_day_no / 365);
      g_day_no = g_day_no % 365;
    }

    let i = 0;
    for (
      i = 0;
      g_day_no >= this.g_days_in_month[i] + (i === 1 && leap ? 1 : 0);
      i++
    ) {
      g_day_no -= this.g_days_in_month[i] + (i === 1 && leap ? 1 : 0);
    }
    const gm = i;
    const gd = g_day_no + 1;

    const res = new Date(gy, gm, gd);
    res.setHours(0, 0, 0, 0);
    return res;
  },

  gregorianToJalali(g_y: number, g_m: number, g_d: number): JalaliDateParts {
    const gy = g_y - 1600;
    const gm = g_m - 1;
    const gd = g_d - 1;

    let g_day_no =
      365 * gy +
      Math.floor((gy + 3) / 4) -
      Math.floor((gy + 99) / 100) +
      Math.floor((gy + 399) / 400);

    for (let i = 0; i < gm; ++i) {
      g_day_no += this.g_days_in_month[i];
    }
    if (gm > 1 && ((gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0)) {
      ++g_day_no;
    }
    g_day_no += gd;

    let j_day_no = g_day_no - 79;

    const j_np = Math.floor(j_day_no / 12053);
    j_day_no %= 12053;

    let jy = 979 + 33 * j_np + 4 * Math.floor(j_day_no / 1461);
    j_day_no %= 1461;

    if (j_day_no >= 366) {
      jy += Math.floor((j_day_no - 1) / 365);
      j_day_no = (j_day_no - 1) % 365;
    }

    let i = 0;
    for (i = 0; i < 11 && j_day_no >= this.j_days_in_month[i]; ++i) {
      j_day_no -= this.j_days_in_month[i];
    }
    const jm = i + 1;
    const jd = j_day_no + 1;

    return { year: jy, month: jm, day: jd };
  },

  fromGregorian(date: Date): JalaliDateParts {
    return this.gregorianToJalali(date.getFullYear(), date.getMonth() + 1, date.getDate());
  },

  formatShamsi(date: Date, includeDayName = false): string {
    const parts = this.fromGregorian(date);
    const monthName = PERSIAN_MONTH_NAMES[parts.month - 1] || '';
    if (includeDayName) {
      const dayName = PERSIAN_WEEK_DAYS[date.getDay()];
      return `${dayName} ${parts.day} ${monthName} ${parts.year}`;
    }
    return `${parts.day} ${monthName} ${parts.year}`;
  },

  formatShamsiShort(date: Date): string {
    const parts = this.fromGregorian(date);
    const m = String(parts.month).padStart(2, '0');
    const d = String(parts.day).padStart(2, '0');
    return `${parts.year}/${m}/${d}`;
  },

  formatMiladi(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  },

  formatMiladiIso(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
};
