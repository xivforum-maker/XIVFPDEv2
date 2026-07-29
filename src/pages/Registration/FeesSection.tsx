import React from 'react';
import { UserCheck, Mail, CalendarClock, Lock } from 'lucide-react';
import { siteConfig } from '../../config/site';

export const FeesSection = () => {
  return (
    <>
    <div className="mb-10 p-6 bg-accent-50 border-l-4 border-accent-500 rounded-r-xl flex items-start gap-4">
      <div className="p-3 bg-accent-100 rounded-full text-accent-600 shrink-0">
        <CalendarClock size={24} />
        </div>
        <div>
        <h3 className="text-xl font-serif font-bold text-primary-900 mb-1">Payment Deadline</h3>
        <p className="text-gray-700 leading-relaxed">
          The deadline for payment is <strong className="text-accent-600">{siteConfig.deadlines.payment}</strong>. Please ensure your transfer is completed before this date.
        </p>
      </div>
    </div>

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
          Registration for the conference is now closed. Thank you for your interest in the XIV Forum of Partial Differential Equations. In exceptional cases, please contact the organizers directly.
        </p>
        
        <button
          type="button"
          disabled
          className="block w-full cursor-not-allowed text-center px-8 py-4 bg-gray-200 text-gray-500 font-medium rounded-xl shadow-sm mb-6"
        >
          Registration is Closed <Lock size={18} className="inline ml-2" />
        </button>
        
        <div className="flex items-center justify-center gap-3 text-gray-600 bg-gray-50 p-4 rounded-xl">
          <Mail size={20} className="text-primary-900" />
          <span>Contact: <a href={`mailto:${siteConfig.contactEmail}`} className="text-accent-600 hover:underline font-medium">{siteConfig.contactEmail}</a></span>
        </div>
      </div>
    </div>
    </>
  );
};
