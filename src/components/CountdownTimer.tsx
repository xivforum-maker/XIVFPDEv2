import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { siteConfig } from '../config/site';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const calculateTimeLeft = (targetDate: number): TimeLeft | null => {
  const difference = targetDate - Date.now();

  if (difference <= 0) return null;

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((difference % (1000 * 60)) / 1000),
  };
};

export const CountdownTimer = () => {
  const targetDate = new Date(siteConfig.conferenceStartDate).getTime();
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(() => calculateTimeLeft(targetDate));

  useEffect(() => {
    const updateTime = () => {
      const nextTimeLeft = calculateTimeLeft(targetDate);
      setTimeLeft(nextTimeLeft);
      return nextTimeLeft !== null;
    };

    if (!updateTime()) return;

    const interval = window.setInterval(() => {
      if (!updateTime()) window.clearInterval(interval);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [targetDate]);

  return (
    <AnimatePresence initial={false}>
      {timeLeft && (
        <motion.div
          key="conference-countdown"
          initial={false}
          animate={{ opacity: 1, height: 'auto', marginTop: 64, y: 0 }}
          exit={{ opacity: 0, height: 0, marginTop: 0, y: -16 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden"
        >
          <div className="flex flex-col items-center justify-between gap-8 rounded-2xl border border-gray-100 bg-gray-50 p-8 shadow-sm sm:p-10 md:flex-row">
            <div className="text-center md:text-left">
              <h3 className="mb-2 text-2xl font-serif text-primary-900 sm:text-3xl">Conference starts in</h3>
              <p className="text-gray-500">{siteConfig.conferenceStartDateString}</p>
            </div>
            <div className="flex justify-center gap-3 sm:gap-6">
              {[
                { label: 'Days', value: timeLeft.days },
                { label: 'Hours', value: timeLeft.hours },
                { label: 'Minutes', value: timeLeft.minutes },
                { label: 'Seconds', value: timeLeft.seconds },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-gray-200 bg-white text-2xl font-bold font-serif text-primary-900 shadow-sm sm:h-20 sm:w-20 sm:text-3xl">
                    {item.value.toString().padStart(2, '0')}
                  </div>
                  <span className="mt-3 text-xs font-medium uppercase tracking-wider text-gray-500 sm:text-sm">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
