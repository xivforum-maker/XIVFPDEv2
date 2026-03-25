import React from 'react';
import { UserCheck, Mail, ExternalLink } from 'lucide-react';
import { siteConfig } from '../../config/site';

export const FeesSection = () => {
  return (
    <div className="grid md:grid-cols-2 gap-12">
      <div>
        <h3 className="text-2xl font-serif text-primary-900 mb-6 flex items-center gap-3">
          <UserCheck className="text-accent-500" /> Conference Fees
        </h3>
        <ul className="space-y-6">
          <li className="p-6 bg-gray-50 rounded-xl border border-gray-100">
            <div className="text-lg font-medium text-primary-900 mb-2">Regular Fee</div>
            <div className="text-3xl font-light text-accent-600">{siteConfig.fees.regular.pln} PLN <span className="text-lg text-gray-500">(~{siteConfig.fees.regular.eur} EUR)</span></div>
          </li>
          <li className="p-6 bg-gray-50 rounded-xl border border-gray-100">
            <div className="text-lg font-medium text-primary-900 mb-2">Reduced Fee</div>
            <div className="text-3xl font-light text-accent-600 mb-2">{siteConfig.fees.reduced.pln} PLN <span className="text-lg text-gray-500">(~{siteConfig.fees.reduced.eur} EUR)</span></div>
            <div className="text-sm text-gray-500 italic">— limited number of places</div>
          </li>
        </ul>
        
        <div className="mt-8 space-y-4 text-gray-600 text-sm leading-relaxed">
          <p>
            The reduced fee is limited and depends on the number of conference subsidies available. We encourage you to register as soon as possible to secure the reduced registration fee. A small number of conference fee waivers may also be offered to early-career researchers without financial support. More information will be provided in June.
          </p>
          <p>
            The fee covers transportation to and from Poznań on the arrival and departure days, and full-board accommodation.
          </p>
        </div>
      </div>
      
      <div>
        <h3 className="text-2xl font-serif text-primary-900 mb-6 flex items-center gap-3">
          <Mail className="text-accent-500" /> How to Register
        </h3>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Please complete the online registration form to secure your place at the conference. If you have any questions regarding the registration process, feel free to contact us.
        </p>
        
        <a 
          href={siteConfig.links.registrationForm}
          target="_blank"
          rel="noreferrer"
          className="block w-full text-center px-8 py-4 bg-accent-500 hover:bg-accent-600 text-white font-medium rounded-xl transition-all transform hover:-translate-y-1 shadow-lg shadow-accent-500/30 mb-6"
        >
          Go to Registration Form <ExternalLink size={18} className="inline ml-2" />
        </a>
        
        <div className="flex items-center justify-center gap-3 text-gray-600 bg-gray-50 p-4 rounded-xl">
          <Mail size={20} className="text-primary-900" />
          <span>Contact: <a href={`mailto:${siteConfig.contactEmail}`} className="text-accent-600 hover:underline font-medium">{siteConfig.contactEmail}</a></span>
        </div>
      </div>
    </div>
  );
};
