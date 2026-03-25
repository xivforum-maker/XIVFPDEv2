import React from 'react';
import { motion } from 'motion/react';
import { PageHeader } from '../../components/layout/PageHeader';
import { siteConfig } from '../../config/site';
import { FeesSection } from './FeesSection';
import { PaymentInfoSection } from './PaymentInfoSection';

export const RegistrationPage = () => {
  return (
    <main className="flex-grow relative pb-24">
      <div className="absolute inset-0 z-[-1] bg-gray-50/90 backdrop-blur-[3px]" />
      <PageHeader title="Registration" subtitle={`Join the ${siteConfig.fullName}`} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
        >
          <FeesSection />
          <PaymentInfoSection />
        </motion.div>
      </div>
    </main>
  );
};
