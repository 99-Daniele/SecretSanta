import { useState, useEffect } from 'react';

/**
 * Custom hook for countdown timer
 * @param {Date|string} targetDate - Target date for countdown
 * @returns {Object} { days, hours, minutes, seconds, isExpired }
 */
export const useCountdown = (targetDate) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    if (!targetDate) {
      // defer to avoid synchronous setState in effect
      const t = setTimeout(() => {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
      }, 0);
      return () => clearTimeout(t);
    }

    const calculateTimeLeft = () => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
        };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
        isExpired: false,
      };
    };

  // Initial calculation (deferred to avoid sync setState inside effect)
  const t2 = setTimeout(() => setTimeLeft(calculateTimeLeft()), 0);

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => {
      clearInterval(timer);
      clearTimeout(t2);
    };
  }, [targetDate]);

  return timeLeft;
};
