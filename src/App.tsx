import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/Home';
import { RegistrationPage } from './pages/Registration';
import { ParticipantsPage } from './pages/Participants';
import { ProgramPage } from './pages/Program';
import { ScientificCommitteePage } from './pages/ScientificCommittee';
import { OrganizingCommitteePage } from './pages/OrganizingCommittee';
import { images } from './data/images';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col font-sans text-gray-900 selection:bg-accent-500 selection:text-white relative">
        {/* Globalne stałe tło z efektem paralaksy dla całej aplikacji */}
        <div 
          className="fixed inset-0 z-[-2]"
          style={{
            backgroundImage: `url("${images.globalBackground.url}")`,
            backgroundSize: images.globalBackground.size,
            backgroundPosition: images.globalBackground.position,
            backgroundAttachment: images.globalBackground.attachment as any,
          }}
        />
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/registration" element={<RegistrationPage />} />
          <Route path="/participants" element={<ParticipantsPage />} />
          <Route path="/program" element={<ProgramPage />} />
          <Route path="/scientific" element={<ScientificCommitteePage />} />
          <Route path="/organization" element={<OrganizingCommitteePage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}
