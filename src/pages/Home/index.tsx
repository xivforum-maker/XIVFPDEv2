import React from 'react';
import { HeroSection } from './HeroSection';
import { GeneralInfoSection } from './GeneralInfoSection';
import { SpeakersSection } from './SpeakersSection';
import { ImportantInfoSection } from './ImportantInfoSection';
import { SponsorsSection } from './SponsorsSection';

export const HomePage = () => {
  return (
    <main className="relative">
      <HeroSection />
      <GeneralInfoSection />
      <SpeakersSection />
      <ImportantInfoSection />
      <SponsorsSection />
    </main>
  );
};
