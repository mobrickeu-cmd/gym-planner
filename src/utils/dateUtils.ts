export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

export const getFirstDayOfMonth = (year: number, month: number): number => {
  const day = new Date(year, month, 1).getDay();
  // Adjust so Monday is 0, Tuesday is 1, ..., Sunday is 6
  return day === 0 ? 6 : day - 1;
};

export const formatDate = (year: number, month: number, day: number): string => {
  const monthStr = String(month + 1).padStart(2, '0');
  const dayStr = String(day).padStart(2, '0');
  return `${year}-${monthStr}-${dayStr}`;
};

export const parseDate = (dateStr: string): { year: number; month: number; day: number } => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return { year, month: month - 1, day };
};

export const getMonthName = (month: number, language: 'ro' | 'en' = 'ro'): string => {
  const monthsRo = [
    'Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie',
    'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'
  ];
  const monthsEn = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return language === 'en' ? monthsEn[month] : monthsRo[month];
};

export const getMonthYearString = (year: number, month: number, language: 'ro' | 'en' = 'ro'): string => {
  return `${getMonthName(month, language)} ${year}`;
};

export const isToday = (year: number, month: number, day: number): boolean => {
  const today = new Date();
  return (
    year === today.getFullYear() &&
    month === today.getMonth() &&
    day === today.getDate()
  );
};

export const isPastDate = (year: number, month: number, day: number): boolean => {
  const date = new Date(year, month, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

export const generateTimeSlots = (startHour: number = 0, endHour: number = 23): string[] => {
  const slots: string[] = [];
  for (let hour = startHour; hour <= endHour; hour++) {
    slots.push(`${String(hour).padStart(2, '0')}:00`);
  }
  return slots;
};

export const isValidDateRange = (year: number, month: number): boolean => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const maxYear = 2030;

  // Calculate the minimum date (3 months ago)
  const minDate = new Date(currentYear, currentMonth - 3, 1);
  const minYear = minDate.getFullYear();
  const minMonth = minDate.getMonth();

  // Check if year is before minimum
  if (year < minYear) {
    return false;
  }

  // Check if year is after maximum
  if (year > maxYear) {
    return false;
  }

  // Check if it's the minimum year and month is before minimum month
  if (year === minYear && month < minMonth) {
    return false;
  }

  // Check if it's the maximum year and month is after December (11)
  if (year === maxYear && month > 11) {
    return false;
  }

  return true;
};

