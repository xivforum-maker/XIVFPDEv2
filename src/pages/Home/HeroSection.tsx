import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { MapPin } from 'lucide-react';
import { HeroBackground } from '../../components/layout/HeroBackground';
import { siteConfig } from '../../config/site';

export const HeroSection = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <HeroBackground />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <p className="text-accent-500 font-medium tracking-[0.2em] uppercase mb-4 text-sm sm:text-base">
            {siteConfig.dates}
          </p>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif text-white leading-tight mb-6">
            XIV Forum of <br />
            <span className="italic font-light">Partial Differential Equations</span>
          </h1>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-gray-200 mb-16">
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-accent-500" />
              <span>{siteConfig.location}</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/registration" 
              className="px-8 py-3 bg-accent-500 hover:bg-accent-600 text-white font-medium rounded-full transition-all transform hover:scale-105 shadow-lg shadow-accent-500/30"
            >
              Register Now
            </Link>
            <Link 
              to="/program" 
              className="px-8 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-medium rounded-full border border-white/20 transition-all"
            >
              View Programme
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
