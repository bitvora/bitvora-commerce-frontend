'use client';

import { useEffect, useState } from 'react';

export function useCountdown(expiresAt?: string) {
  const [countdownText, setCountdownText] = useState<string>('');

  useEffect(() => {
    if (!expiresAt) return;

    const expiryDate = new Date(expiresAt).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = expiryDate - now;

      if (diff <= 0) {
        setCountdownText('Expired');
        return;
      }

      const totalSeconds = Math.floor(diff / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      const parts = [];
      if (hours > 0) parts.push(`${hours} hr${hours > 1 ? 's' : ''}`);
      if (minutes > 0) parts.push(`${minutes} min${minutes > 1 ? 's' : ''}`);
      parts.push(`${seconds} sec${seconds !== 1 ? 's' : ''}`);

      setCountdownText(parts.join(' '));
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  return countdownText;
}
