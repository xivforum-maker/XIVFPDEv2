import React from 'react';
import { Building2 } from 'lucide-react';
import { sponsors, partners } from '../../data/sponsors';

export const SponsorsSection = () => {
  return (
    <section className="py-24 relative overflow-hidden border-t border-gray-200/50">
      <div className="absolute inset-0 z-0 bg-gray-50/95 backdrop-blur-[4px]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Sponsors */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-serif text-gray-500 uppercase tracking-widest">Sponsors</h2>
          </div>
          
          <div className="grid grid-cols-3 gap-3 sm:gap-6 lg:gap-8 max-w-5xl mx-auto">
            {sponsors.map((sponsor, idx) => (
              <a 
                key={idx} 
                href={sponsor.url} 
                target="_blank" 
                rel="noreferrer" 
                className="group relative flex flex-col items-center justify-between aspect-square sm:aspect-[4/3] bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-6 transition-all duration-300 hover:shadow-lg hover:border-accent-300 hover:-translate-y-1"
              >
                <div className="w-full flex-1 flex items-center justify-center mb-2 sm:mb-4 min-h-0">
                  <img 
                    src={sponsor.logo} 
                    alt={sponsor.name.replace('\n', ' ')} 
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      e.currentTarget.nextElementSibling?.classList.add('flex');
                    }}
                  />
                  <div className="hidden flex-col items-center justify-center text-gray-200">
                    <Building2 className="w-6 h-6 sm:w-10 sm:h-10" />
                  </div>
                </div>
                <span className="text-[10px] sm:text-sm md:text-lg font-serif font-bold text-primary-900 text-center leading-tight group-hover:text-accent-600 transition-colors">
                  {sponsor.name.split('\n').map((part, i, arr) => (
                    <React.Fragment key={i}>
                      {part}
                      {i < arr.length - 1 && (
                        <>
                          <br className="block lg:hidden" />
                          <span className="hidden lg:inline"> </span>
                        </>
                      )}
                    </React.Fragment>
                  ))}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Partners */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-2xl font-serif text-gray-500 uppercase tracking-widest">Partners</h2>
          </div>
          
          <div className="flex justify-center gap-3 sm:gap-6 lg:gap-8 max-w-5xl mx-auto">
            {partners.map((partner, idx) => (
              <a 
                key={idx} 
                href={partner.url} 
                target="_blank" 
                rel="noreferrer" 
                className="group relative flex flex-col items-center justify-between w-[32%] min-w-[110px] sm:min-w-[220px] max-w-[280px] aspect-square sm:aspect-[4/3] bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-6 transition-all duration-300 hover:shadow-lg hover:border-accent-300 hover:-translate-y-1"
              >
                <div className="w-full flex-1 flex items-center justify-center mb-2 sm:mb-4 min-h-0">
                  <img 
                    src={partner.logo} 
                    alt={partner.name.replace('\n', ' ')} 
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      e.currentTarget.nextElementSibling?.classList.add('flex');
                    }}
                  />
                  <div className="hidden flex-col items-center justify-center text-gray-200">
                    <Building2 className="w-6 h-6 sm:w-10 sm:h-10" />
                  </div>
                </div>
                <span className="text-[10px] sm:text-sm md:text-lg font-serif font-bold text-primary-900 text-center leading-tight group-hover:text-accent-600 transition-colors">
                  {partner.name.split('\n').map((part, i, arr) => (
                    <React.Fragment key={i}>
                      {part}
                      {i < arr.length - 1 && (
                        <>
                          <br className="block lg:hidden" />
                          <span className="hidden lg:inline"> </span>
                        </>
                      )}
                    </React.Fragment>
                  ))}
                </span>
              </a>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
