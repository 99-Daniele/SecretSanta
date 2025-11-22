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
      setIsEventOpen(false);
      return;
    }

    const checkStatus = () => {
      const now = new Date().getTime();
      const openingDate = new Date(dataApertura).getTime();
      setIsEventOpen(now >= openingDate);
    };

    // Initial check
    checkStatus();

    // Check every minute
    const interval = setInterval(checkStatus, 60000);

    return () => clearInterval(interval);
  }, [dataApertura]);

  return isEventOpen;
};
