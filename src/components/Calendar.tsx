import React, { useState, useRef } from 'react';
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

    // Previous 2 months
    for (let i = 2; i >= 1; i--) {
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

    // Next 2 months
    for (let i = 1; i <= 2; i++) {
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

  const monthInputRef = useRef<HTMLInputElement>(null);

  const handleMonthInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value; // YYYY-MM
    if (value) {
      const [year, month] = value.split('-').map(Number);
      handleMonthSelect(year, month - 1);
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

  const weekDays = [
    t('monday'),
    t('tuesday'),
    t('wednesday'),
    t('thursday'),
    t('friday'),
    t('saturday'),
    t('sunday')
  ];

  const isQuickMonth = getQuickMonthOptions().some(
    option => option.year === currentYear && option.month === currentMonth
  );

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <div className="month-navigation">
          <label htmlFor="month-picker-input" className="month-picker-label">
            <h2 className="month-title clickable" title={t('selectAnyMonth')}>
              {t('calendar')} {!isQuickMonth && <span className="selected-month-tag">({getMonthYearString(currentYear, currentMonth, language)})</span>}
            </h2>
            <input
              id="month-picker-input"
              ref={monthInputRef}
              type="month"
              className="hidden-month-picker"
              onChange={handleMonthInputChange}
              min={`${getMinDate().year}-${String(getMinDate().month + 1).padStart(2, '0')}`}
              max={`${maxYear}-12`}
              value={`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`}
            />
          </label>
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

      <div className="calendar-body">
        <div className="calendar-grid">
          {weekDays.map((day) => (
            <div key={day} className="weekday-header">
              <span className="full-day">{day}</span>
              <span className="short-day">{day.substring(0, 3)}</span>
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

            const statusClass = availabilityPercentage > 75
              ? 'status-high'
              : availabilityPercentage >= 40
                ? 'status-medium'
                : 'status-low';

            // Fill from top to bottom means vertical gradient
            // We'll use a color depending on the status
            const fillColor = availabilityPercentage > 75
              ? 'rgba(76, 175, 80, 0.2)'
              : availabilityPercentage >= 40
                ? 'rgba(255, 235, 59, 0.2)'
                : 'rgba(255, 152, 0, 0.2)';

            return (
              <div
                key={index}
                className={`calendar-day ${isPast ? 'past' : ''} ${isCurrentDay ? 'today' : ''} ${hasReservations ? 'has-reservations' : ''} ${statusClass}`}
                style={{
                  background: isPast ? undefined : `linear-gradient(to top, ${fillColor} ${availabilityPercentage}%, transparent ${availabilityPercentage}%)`
                }}
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
                {hasReservations && (
                  <div className="reservation-indicator">
                    {reservations.length} {reservations.length === 1 ? t('booking') : t('bookings')}
                  </div>
                )}
              </div>
            );
          })}
        </div>
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

