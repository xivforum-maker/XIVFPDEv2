import React from 'react';
import { Landmark, CreditCard, AlertCircle } from 'lucide-react';
import { siteConfig } from '../../config/site';

export const PaymentInfoSection = () => {
  return (
    <div className="mt-12 pt-12 border-t border-gray-100">
      <div className="bg-gradient-to-br from-primary-900 to-primary-800 rounded-2xl p-8 md:p-10 text-white shadow-xl relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 text-primary-700 opacity-30 pointer-events-none">
          <Landmark size={240} strokeWidth={1} />
        </div>
        
        <div className="relative z-10">
          <h3 className="text-2xl font-serif mb-8 flex items-center gap-3 text-white">
            <CreditCard className="text-accent-400" /> Payment Information
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <div className="space-y-6">
              <h4 className="text-primary-200 font-medium uppercase tracking-wider text-sm border-b border-primary-700/50 pb-2">Bank Details</h4>
              <div className="space-y-4">
                <div>
                  <div className="text-primary-300 text-sm mb-1">Bank Name</div>
                  <div className="font-medium text-lg">{siteConfig.payment.bankName}</div>
                  <div className="text-sm text-primary-200">{siteConfig.payment.bankAddress}</div>
                </div>
                <div>
                  <div className="text-primary-300 text-sm mb-1">Account Number (IBAN EUR)</div>
                  <div className="font-mono text-lg tracking-wider bg-primary-950/50 inline-block px-3 py-1.5 rounded-md border border-primary-700/50">
                    {siteConfig.payment.ibanEur}
                  </div>
                </div>
                <div>
                  <div className="text-primary-300 text-sm mb-1">Account Number (IBAN PLN)</div>
                  <div className="font-mono text-lg tracking-wider bg-primary-950/50 inline-block px-3 py-1.5 rounded-md border border-primary-700/50">
                    {siteConfig.payment.ibanPln}
                  </div>
                </div>
                <div>
                  <div className="text-primary-300 text-sm mb-1">SWIFT / BIC</div>
                  <div className="font-mono text-lg tracking-wider">{siteConfig.payment.swift}</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-primary-200 font-medium uppercase tracking-wider text-sm border-b border-primary-700/50 pb-2">Payment Address & Title</h4>
              <div className="space-y-4">
                <div>
                  <div className="text-primary-300 text-sm mb-1">Account Holder</div>
                  <div className="font-medium text-lg">{siteConfig.payment.accountHolder}</div>
                </div>
                <div className="mt-6 p-4 bg-white/10 border border-white/20 rounded-xl backdrop-blur-sm">
                  <div className="text-primary-200 text-sm mb-1">Transfer Description (Important)</div>
                  <div className="font-mono font-medium text-white text-lg">{siteConfig.payment.transferDescription}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Justified Cases Section */}
      <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 rounded-r-xl p-6 text-blue-900">
        <h4 className="font-medium mb-2 flex items-center gap-2">
          <AlertCircle size={20} className="text-blue-600" /> Financial Support
        </h4>
        <p className="text-sm leading-relaxed text-blue-800">
          In justified cases and subject to availability of funds, it is possible to apply for financial support for participation in the conference. Applications will be handled individually. Interested participants should contact the organisers directly at <a href={`mailto:${siteConfig.contactEmail}`} className="font-medium text-blue-700 hover:underline">{siteConfig.contactEmail}</a>.
        </p>
      </div>
    </div>
  );
};
