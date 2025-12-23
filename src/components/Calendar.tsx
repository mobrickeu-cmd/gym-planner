import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { useNotification } from '../context/NotificationContext';
import {
  getDaysInMonth,
  getFirstDayOfMonth,
  formatDate,
  getMonthName,
  getMonthYearString,
  isToday,
  isPastDate,
  isValidDateRange,
  generateTimeSlots,
} from '../utils/dateUtils';
import TimeSlotModal from './TimeSlotModal';
import ReservationList from './ReservationList';
import './Calendar.css';

const Calendar: React.FC = () => {
  const { userRole, currentCustomer, getReservationsByDate, timeRangeSettings } = useApp();
  const { language, t } = useLanguage();
  const { showNotification } = useNotification();
  const [selectedDate, setSelectedDate] = useState<{ year: number; month: number; day: number } | null>(null);
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const [showReservations, setShowReservations] = useState(false);
  const [selectedReservationDate, setSelectedReservationDate] = useState<string | null>(null);

  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  const maxYear = 2030;

  // Calculate minimum date (3 months ago)
  const getMinDate = () => {
    const minDate = new Date(today.getFullYear(), today.getMonth() - 3, 1);
    return { year: minDate.getFullYear(), month: minDate.getMonth() };
  };

  const minDate = getMinDate();

  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      const newYear = currentYear - 1;
      if (newYear > minDate.year || (newYear === minDate.year && 11 >= minDate.month)) {
        setCurrentYear(newYear);
        setCurrentMonth(11);
      }
    } else {
      const newMonth = currentMonth - 1;
      if (currentYear > minDate.year || (currentYear === minDate.year && newMonth >= minDate.month)) {
        setCurrentMonth(newMonth);
      }
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      if (currentYear < maxYear) {
        setCurrentYear(currentYear + 1);
        setCurrentMonth(0);
      }
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleMonthSelect = (year: number, month: number) => {
    if (isValidDateRange(year, month)) {
      setCurrentYear(year);
      setCurrentMonth(month);
    }
  };

  const handleDayClick = (day: number) => {
    if (isPastDate(currentYear, currentMonth, day)) {
      return;
    }

    if (userRole === 'customer' && (!currentCustomer || currentCustomer.sessions <= 0)) {
      const alertMsg = language === 'ro'
        ? 'Nu aveți sesiuni rămase. Vă rugăm să actualizați profilul de client.'
        : 'You have no remaining sessions. Please update your customer profile.';
      showNotification(alertMsg, 'error');
      return;
    }

    setSelectedDate({ year: currentYear, month: currentMonth, day });
    setShowTimeSlots(true);
  };

  const handleViewReservations = (date: string) => {
    setSelectedReservationDate(date);
    setShowReservations(true);
  };

  const getQuickMonthOptions = () => {
    const options: Array<{ year: number; month: number; label: string }> = [];
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    // Previous 3 months
    for (let i = 3; i >= 1; i--) {
      let year = currentYear;
      let month = currentMonth - i;
      if (month < 0) {
        month += 12;
        year -= 1;
      }
      const minDate = getMinDate();
      if (year > minDate.year || (year === minDate.year && month >= minDate.month)) {
        options.push({
          year,
          month,
          label: `${getMonthName(month, language)} ${year}`,
        });
      }
    }

    // Current month
    options.push({
      year: currentYear,
      month: currentMonth,
      label: `${getMonthName(currentMonth, language)} ${currentYear} (${t('current')})`,
    });

    // Next 3 months
    for (let i = 1; i <= 3; i++) {
      let year = currentYear;
      let month = currentMonth + i;
      if (month > 11) {
        month -= 12;
        year += 1;
      }
      if (year <= maxYear) {
        options.push({
          year,
          month,
          label: `${getMonthName(month, language)} ${year}`,
        });
      }
    }

    return options;
  };

  const handleAnyMonthSelect = () => {
    const minDate = getMinDate();
    const yearPrompt = language === 'ro'
      ? `Introduceți anul (${minDate.year}-${maxYear}):`
      : `Enter year (${minDate.year}-${maxYear}):`;
    const monthPrompt = language === 'ro'
      ? 'Introduceți luna (1-12):'
      : 'Enter month (1-12):';
    const errorMsg = language === 'ro'
      ? 'An sau lună invalidă. Vă rugăm să încercați din nou.'
      : 'Invalid year or month. Please try again.';

    const yearInput = prompt(yearPrompt);
    const monthInput = prompt(monthPrompt);

    if (yearInput && monthInput) {
      const year = parseInt(yearInput);
      const month = parseInt(monthInput) - 1;

      if (
        !isNaN(year) &&
        !isNaN(month) &&
        month >= 0 &&
        month <= 11 &&
        isValidDateRange(year, month)
      ) {
        handleMonthSelect(year, month);
      } else {
        showNotification(errorMsg, 'error');
      }
    }
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const days: (number | null)[] = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  const weekDays = ['Lun', 'Mar', 'Mie', 'Joi', 'Vin', 'Sâm', 'Dum'];

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <div className="month-navigation">
          <button
            onClick={handlePreviousMonth}
            disabled={currentYear === minDate.year && currentMonth === minDate.month}
            className="nav-button"
          >
            ← {t('previous')}
          </button>
          <h2 className="month-title clickable" onClick={handleAnyMonthSelect} title={t('selectAnyMonth')}>
            {getMonthYearString(currentYear, currentMonth, language)}
          </h2>
          <button
            onClick={handleNextMonth}
            disabled={currentYear === maxYear && currentMonth === 11}
            className="nav-button"
          >
            {t('next')} →
          </button>
        </div>

        <div className="month-selector">
          <div className="quick-months">
            {getQuickMonthOptions().map((option, index) => (
              <button
                key={index}
                onClick={() => handleMonthSelect(option.year, option.month)}
                className={`quick-month-btn ${currentYear === option.year && currentMonth === option.month ? 'active' : ''
                  }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="calendar-grid">
        {weekDays.map((day) => (
          <div key={day} className="weekday-header">
            {day}
          </div>
        ))}

        {days.map((day, index) => {
          if (day === null) {
            return <div key={index} className="calendar-day empty"></div>;
          }

          const dateStr = formatDate(currentYear, currentMonth, day);
          const reservations = getReservationsByDate(dateStr);
          const isPast = isPastDate(currentYear, currentMonth, day);
          const isCurrentDay = isToday(currentYear, currentMonth, day);
          const hasReservations = reservations.length > 0;

          // Calculate availability percentage (hours without any reservations)
          const allSlots = generateTimeSlots(timeRangeSettings.startHour, timeRangeSettings.endHour);
          const occupiedSlots = new Set(reservations.map(r => r.timeSlot));
          const emptySlotsCount = allSlots.filter(slot => !occupiedSlots.has(slot)).length;
          const availabilityPercentage = Math.round((emptySlotsCount / allSlots.length) * 100);

          return (
            <div
              key={index}
              className={`calendar-day ${isPast ? 'past' : ''} ${isCurrentDay ? 'today' : ''} ${hasReservations ? 'has-reservations' : ''
                }`}
              onClick={() => {
                if (isPast) {
                  if (hasReservations) {
                    handleViewReservations(dateStr);
                  }
                  return;
                }
                handleDayClick(day);
              }}
              onDoubleClick={() => hasReservations && handleViewReservations(dateStr)}
            >
              <div className="day-number">{day}</div>
              <div className="availability-percentage" title={t('availableSlots' as any)}>
                {availabilityPercentage}% {t('availableSlots' as any)}
              </div>
              {hasReservations && (
                <div className="reservation-indicator">
                  {reservations.length} {reservations.length === 1 ? t('booking') : t('bookings')}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showTimeSlots && selectedDate && (
        <TimeSlotModal
          date={selectedDate}
          onClose={() => {
            setShowTimeSlots(false);
            setSelectedDate(null);
          }}
        />
      )}

      {showReservations && selectedReservationDate && (
        <ReservationList
          date={selectedReservationDate}
          onClose={() => {
            setShowReservations(false);
            setSelectedReservationDate(null);
          }}
        />
      )}
    </div>
  );
};

export default Calendar;

