import React from 'react';
import { motion } from 'motion/react';
import { images } from '../../data/images';

export const HeroBackground = ({ className = "" }: { className?: string }) => (
  <div className={`absolute inset-0 overflow-hidden pointer-events-none select-none z-0 ${className}`}>
    <div className="absolute top-0 left-0 w-full h-screen">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url("${images.hero.url}")` }}
      >
        <div className={`absolute inset-0 ${images.hero.overlay}`} />
        <div className={`absolute inset-0 ${images.hero.gradient}`} />
      </div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
        <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[15%] left-[10%] text-white/15 font-serif italic text-3xl md:text-5xl transform -rotate-12">∂u/∂t = αΔu</motion.div>
        <motion.div animate={{ y: [0, 15, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute top-[60%] left-[5%] text-white/10 font-serif italic text-4xl md:text-6xl transform rotate-6">∂²u/∂t² = c²Δu</motion.div>
        <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }} className="absolute top-[25%] right-[5%] md:right-[10%] text-white/15 font-serif italic text-2xl md:text-4xl transform rotate-12">∂ₜu + (u⋅∇)u = -∇p + νΔu</motion.div>
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} className="absolute top-[70%] right-[10%] md:right-[15%] text-white/10 font-serif italic text-3xl md:text-5xl transform -rotate-6">∇⋅u = 0</motion.div>
        <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 3 }} className="absolute top-[45%] left-[30%] md:left-[40%] text-white/5 font-serif italic text-5xl md:text-7xl">iℏ∂ₜψ = -ℏ²/2m Δψ + Vψ</motion.div>
        <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }} className="absolute bottom-[15%] left-[30%] text-white/15 font-serif italic text-3xl md:text-5xl transform rotate-3">-Δu = λu</motion.div>
      </div>
    </div>
  </div>
);
