import React from 'react';
import { siteConfig } from '../../config/site';
import { HeroBackground } from './HeroBackground';

export const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-primary-900 py-12 border-t border-white/10 mt-auto">
      <HeroBackground className="opacity-60" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-white font-serif text-xl font-bold tracking-wider">
          {siteConfig.name}
        </div>
        <p className="text-gray-300 text-sm text-center md:text-left">
          {siteConfig.copyright}
        </p>
        <div className="text-gray-300 text-sm">
          Last update: {siteConfig.lastUpdate}
        </div>
      </div>
    </footer>
  );
};
