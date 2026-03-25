import React from 'react';
import { motion } from 'motion/react';
import { HeroBackground } from './HeroBackground';

export const PageHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <div className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
    <HeroBackground />
    <motion.div
      className="relative z-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">{title}</h1>
      {subtitle && <p className="text-accent-400 text-lg">{subtitle}</p>}
      <div className="w-16 h-1 bg-accent-500 mx-auto mt-8" />
    </motion.div>
  </div>
);
