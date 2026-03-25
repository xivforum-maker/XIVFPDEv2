import React from 'react';
import { motion } from 'motion/react';
import { CountdownTimer } from '../../components/CountdownTimer';
import { images } from '../../data/images';

export const GeneralInfoSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-white/85 backdrop-blur-[2px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-serif text-primary-900 mb-6">General Information</h2>
            <div className="w-16 h-1 bg-accent-500 mb-8" />
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              The Forum of Partial Differential Equations is an international conference devoted to recent advances in the theory and applications of partial differential equations.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              The meeting aims to bring together researchers at different career stages to present new results, exchange ideas, and foster collaborations across various areas of PDEs.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              The conference is organized by the Institute of Mathematics of the Polish Academy of Sciences, University of Warsaw, and University of Wrocław.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div 
              className="aspect-[4/3] rounded-3xl overflow-hidden"
              style={{
                maskImage: images.bedlewo.maskImage,
                maskComposite: 'intersect',
                WebkitMaskImage: images.bedlewo.maskImage,
                WebkitMaskComposite: 'source-in'
              }}
            >
              <img 
                src={images.bedlewo.url} 
                alt={images.bedlewo.alt} 
                className="w-full h-full object-cover"
                style={{ 
                  objectPosition: images.bedlewo.objectPosition,
                  transform: images.bedlewo.transform,
                }}
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 sm:-bottom-8 sm:-left-8 bg-primary-900 text-white p-6 sm:p-8 rounded-2xl shadow-2xl z-10 border border-white/10 backdrop-blur-sm">
              <p className="text-3xl sm:text-4xl font-serif font-bold text-accent-500 mb-1">14th</p>
              <p className="text-xs sm:text-sm uppercase tracking-wider opacity-80">Edition</p>
            </div>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <CountdownTimer />
        </motion.div>
      </div>
    </section>
  );
};
