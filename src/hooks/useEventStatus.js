import { useState, useEffect } from 'react';

/**
 * Custom hook to check if event is past opening date
 * @param {Date|string} dataApertura - Event opening date
 * @returns {boolean} True if event has passed opening date
 */
export const useEventStatus = (dataApertura) => {
  const [isEventOpen, setIsEventOpen] = useState(false);

  useEffect(() => {
    if (!dataApertura) {
      const t = setTimeout(() => setIsEventOpen(false), 0);
      return () => clearTimeout(t);
    }

    const checkStatus = () => {
      const now = new Date().getTime();
      const openingDate = new Date(dataApertura).getTime();
      setIsEventOpen(now >= openingDate);
    };

    // Initial check (deferred)
    const t2 = setTimeout(checkStatus, 0);

    // Check every minute
    const interval = setInterval(checkStatus, 60000);

    return () => {
      clearInterval(interval);
      clearTimeout(t2);
    };
  }, [dataApertura]);

  return isEventOpen;
};
