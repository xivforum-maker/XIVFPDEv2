import React, { useState, useEffect } from 'react';
import { siteConfig } from '../config/site';

export const CountdownTimer = () => {
  const targetDate = new Date(siteConfig.conferenceStartDate).getTime();
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };

    updateTime(); // Initial call
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="mt-16 bg-gray-50 rounded-2xl p-8 sm:p-10 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
      <div className="text-center md:text-left">
        <h3 className="text-2xl sm:text-3xl font-serif text-primary-900 mb-2">Conference starts in</h3>
        <p className="text-gray-500">{siteConfig.conferenceStartDateString}</p>
      </div>
      <div className="flex justify-center gap-3 sm:gap-6">
        {[
          { label: 'Days', value: timeLeft.days },
          { label: 'Hours', value: timeLeft.hours },
          { label: 'Minutes', value: timeLeft.minutes },
          { label: 'Seconds', value: timeLeft.seconds }
        ].map((item) => (
          <div key={item.label} className="flex flex-col items-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white border border-gray-200 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-serif font-bold text-primary-900 shadow-sm">
              {item.value.toString().padStart(2, '0')}
            </div>
            <span className="mt-3 text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
