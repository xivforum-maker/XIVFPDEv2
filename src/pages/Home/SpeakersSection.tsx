import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink, User } from 'lucide-react';
import { invitedSpeakers } from '../../data/speakers';

export const SpeakersSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-gray-50/90 backdrop-blur-[3px]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-serif text-primary-900 mb-4">Invited Speakers</h2>
            <div className="w-16 h-1 bg-accent-500 mx-auto" />
          </motion.div>
        </div>
        
        <motion.div 
          className="flex flex-wrap justify-center gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.05
              }
            }
          }}
        >
          {invitedSpeakers.map((speaker, idx) => (
            <motion.div
              key={idx}
              className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
            >
              <a 
                href={speaker.url !== "#" ? speaker.url : undefined}
                target={speaker.url !== "#" ? "_blank" : undefined}
                rel={speaker.url !== "#" ? "noreferrer" : undefined}
                className={`relative block h-full bg-white p-5 rounded-xl shadow-sm border border-gray-100 transition-all duration-300 group ${speaker.url !== "#" ? "hover:-translate-y-1 hover:shadow-lg hover:border-accent-300 cursor-pointer" : ""}`}
              >
                {speaker.url !== "#" && (
                  <ExternalLink size={14} className="absolute top-3 right-3 text-gray-300 group-hover:text-accent-500 transition-colors" />
                )}
                <div className="flex items-center justify-between gap-4 h-full">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-serif font-bold text-primary-900 mb-1 leading-tight pr-2 group-hover:text-accent-600 transition-colors">{speaker.name}</h4>
                    <p className="text-gray-600 text-sm leading-snug">{speaker.affiliation}</p>
                  </div>
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-primary-50 border-2 border-primary-100 flex items-center justify-center shrink-0">
                    {speaker.image ? (
                      <img 
                        src={speaker.image} 
                        alt={speaker.name} 
                        className="w-full h-full object-cover" 
                        style={{ objectPosition: speaker.imagePosition || 'center' }}
                      />
                    ) : (
                      <User size={24} className="text-primary-400" />
                    )}
                  </div>
                </div>
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
