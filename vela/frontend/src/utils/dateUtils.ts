import { BirthdayCountdown, AgeCategory } from '../types/vela';

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function getMonthName(monthNumber: number): string {
  return MONTH_NAMES[monthNumber - 1] || '';
}

export function formatBirthday(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length < 3) return dateStr;
  const monthIdx = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  return `${MONTH_NAMES[monthIdx]} ${day}`;
}

export function getZodiacSign(day: number, month: number): string {
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'Pisces';
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
  return 'Capricorn';
}

export function calculateBirthdayCountdown(dateStr: string): BirthdayCountdown {
  const parts = (dateStr || '1998-10-27').split('-');
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);

  const now = new Date();
  let nextBday = new Date(now.getFullYear(), month, day, 0, 0, 0);

  // If birthday passed this year, look at next year
  if (now.getTime() > nextBday.getTime() + 24 * 60 * 60 * 1000) {
    nextBday = new Date(now.getFullYear() + 1, month, day, 0, 0, 0);
  }

  const diffMs = nextBday.getTime() - now.getTime();
  const isToday = now.getMonth() === month && now.getDate() === day;

  if (diffMs <= 0 || isToday) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      formattedDate: `${MONTH_NAMES[month]} ${day}`,
      isToday: true,
    };
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days,
    hours,
    minutes,
    seconds,
    formattedDate: `${MONTH_NAMES[month]} ${day}`,
    isToday: false,
  };
}

export function getAgeCategoryFromDob(dateStr: string): {
  category: AgeCategory;
  label: string;
  isParentManaged: boolean;
} {
  const parts = (dateStr || '1998-10-27').split('-');
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const birth = new Date(year, month, day);
  const now = new Date();

  const diffMonths = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
  const ageYears = Math.floor(diffMonths / 12);

  if (diffMonths < 12) {
    return { category: 'newborn', label: 'Newborn / Baby (0-11m)', isParentManaged: true };
  }
  if (ageYears < 4) {
    return { category: 'toddler', label: 'Toddler (1-3y)', isParentManaged: true };
  }
  if (ageYears < 13) {
    return { category: 'kid', label: 'Kid (4-12y)', isParentManaged: true };
  }
  if (ageYears < 18) {
    return { category: 'teen', label: 'Teen (13-17y)', isParentManaged: false };
  }
  return { category: 'adult', label: 'Adult (18+)', isParentManaged: false };
}


