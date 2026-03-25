import React from 'react';
import { motion } from 'motion/react';
import { MapPin, ExternalLink, Calendar } from 'lucide-react';
import { siteConfig } from '../../config/site';

export const ImportantInfoSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-white/90 backdrop-blur-[2px]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div>
            <h2 className="text-4xl font-serif text-primary-900 mb-4">Important Information</h2>
            <div className="w-16 h-1 bg-accent-500 mx-auto" />
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-8">
          <div 
            className="w-full md:w-[calc(50%-16px)] lg:w-[calc(25%-24px)] bg-white/95 backdrop-blur-sm shadow-xl p-8 rounded-2xl text-center border border-white/50"
          >
            <Calendar size={32} className="mx-auto text-accent-500 mb-4" />
            <h4 className="text-lg font-serif font-bold text-primary-900 mb-2">Dates</h4>
            <p className="text-gray-600">{siteConfig.dates}</p>
          </div>
          
          <div 
            className="w-full md:w-[calc(50%-16px)] lg:w-[calc(25%-24px)] bg-white/95 backdrop-blur-sm shadow-xl p-8 rounded-2xl text-center border border-white/50 flex flex-col items-center"
          >
            <MapPin size={32} className="mx-auto text-accent-500 mb-4" />
            <h4 className="text-lg font-serif font-bold text-primary-900 mb-2">Location</h4>
            <p className="text-gray-600 mb-4">{siteConfig.location}</p>
            <a 
              href={siteConfig.links.map}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-600 hover:text-accent-700 hover:underline mt-auto"
            >
              View on the map <ExternalLink size={14} />
            </a>
          </div>
          
          <div 
            className="w-full md:w-[calc(50%-16px)] lg:w-[calc(25%-24px)] bg-white/95 backdrop-blur-sm shadow-xl p-8 rounded-2xl text-center border border-white/50"
          >
            <Calendar size={32} className="mx-auto text-accent-500 mb-4" />
            <h4 className="text-lg font-serif font-bold text-primary-900 mb-2">Deadlines</h4>
            <div className="text-gray-600 space-y-1">
              <p><span className="font-medium text-gray-900">Registration:</span> {siteConfig.deadlines.registration}</p>
              <p><span className="font-medium text-gray-900">Abstracts:</span> {siteConfig.deadlines.abstracts}</p>
            </div>
          </div>
          
          <div 
            className="w-full md:w-[calc(50%-16px)] lg:w-[calc(25%-24px)] bg-white/95 backdrop-blur-sm shadow-xl p-8 rounded-2xl text-center border border-white/50 flex flex-col items-center justify-center"
          >
            <MapPin size={32} className="mx-auto text-accent-500 mb-4" />
            <h4 className="text-lg font-serif font-bold text-primary-900 mb-2">Contact</h4>
            <div className="text-gray-600 space-y-1 text-sm">
              <p><span className="font-medium text-gray-900">Email:</span> <a href={`mailto:${siteConfig.contactEmail}`} className="text-accent-600 hover:text-accent-700 hover:underline transition-colors">{siteConfig.contactEmail}</a></p>
              <p><span className="font-medium text-gray-900">Organizers:</span> J.&nbsp;Mederski, B.&nbsp;Bieganowski, S.&nbsp;Cygan</p>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-12 border-t border-gray-100 mb-8">
          <div>
            <h3 className="text-2xl font-serif text-primary-900">Related Events</h3>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4">
          {siteConfig.relatedEvents.map((event, idx) => (
            <a
              key={idx}
              href={event.url}
              target="_blank"
              rel="noreferrer"
              className="w-full md:w-[calc(33.333%-11px)] block p-5 rounded-xl border border-white/50 shadow-md bg-white/95 backdrop-blur-sm hover:-translate-y-1 hover:shadow-xl hover:border-accent-300 hover:bg-white transition-all duration-300 group"
            >
              <h4 className="text-lg font-serif font-bold text-primary-800 mb-2 group-hover:text-accent-600 transition-colors">{event.name}</h4>
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <Calendar size={14} className="text-gray-400" />
                {event.date}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
