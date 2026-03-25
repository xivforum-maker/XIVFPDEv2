import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { siteConfig } from '../../config/site';
import { sponsors } from '../../data/sponsors';
import { HeroBackground } from './HeroBackground';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting);
      },
      { root: null, threshold: 0 }
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, [location.pathname]);

  const isAtTop = !isScrolled;
  const isMiddle = isScrolled && !isFooterVisible;
  const isAtBottom = isScrolled && isFooterVisible;

  const headerClass = isAtTop 
    ? 'bg-transparent' 
    : isMiddle 
      ? 'shadow-lg bg-gray-50/95 backdrop-blur-md border-b border-gray-200/50' 
      : 'shadow-lg bg-primary-900 border-b border-white/10 overflow-hidden';
      
  const navPadding = isAtTop ? 'py-5' : 'py-3';
  
  const textClass = isMiddle ? 'text-primary-900' : 'text-white';
  const linkClass = isMiddle ? 'text-gray-600 hover:text-primary-900' : 'text-gray-200 hover:text-white';
  const activeLinkClass = isMiddle ? 'text-accent-600' : 'text-accent-400';
  
  const mobileMenuBg = isMiddle 
    ? 'bg-gray-50/95 backdrop-blur-md border-gray-200/50 shadow-2xl' 
    : 'bg-primary-900/95 backdrop-blur-md border-white/10 shadow-2xl';
    
  const mobileLinkClass = isMiddle 
    ? 'text-gray-700 hover:text-accent-600 hover:bg-gray-200/50' 
    : 'text-gray-200 hover:text-accent-400 hover:bg-white/5';
    
  const mobileActiveLinkClass = isMiddle 
    ? 'text-accent-600 bg-gray-200/50' 
    : 'text-accent-400 bg-white/10';

  const logoClass = isMiddle 
    ? 'opacity-90 hover:opacity-100' 
    : 'brightness-0 invert opacity-80 hover:opacity-100';

  const borderClass = isMiddle ? 'border-gray-300' : 'border-gray-400/30';
  const overlayClass = isMiddle ? 'bg-gray-900/20' : 'bg-primary-900/40';

  return (
    <>
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${headerClass}`}>
        <HeroBackground className={`transition-opacity duration-300 ${isAtBottom ? 'opacity-60' : 'opacity-0'}`} />
        <div className={`max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center transition-all duration-300 ${navPadding} relative z-[40]`}>
          <div className="flex items-center gap-3 lg:gap-6">
            {!isHome && (
              <div className={`flex items-center gap-3 lg:gap-6 border-r pr-3 lg:pr-6 shrink-0 transition-colors duration-300 ${borderClass}`}>
                {sponsors.map((sponsor, idx) => (
                  <a key={idx} href={sponsor.url} target="_blank" rel="noreferrer" className="flex items-center shrink-0">
                    <img 
                      src={sponsor.logo} 
                      alt={sponsor.name.replace('\n', ' ')} 
                      className={`h-8 lg:h-9 w-auto object-contain shrink-0 transition-all duration-300 hover:scale-105 ${logoClass}`} 
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </a>
                ))}
              </div>
            )}
            <Link to="/" className={`font-serif text-xl sm:text-2xl font-bold tracking-wider shrink-0 whitespace-nowrap transition-colors duration-300 ${textClass}`}>
              {siteConfig.name}
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex space-x-6">
            {siteConfig.navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.href}
                className={`text-sm font-medium tracking-wide uppercase transition-colors duration-300 ${
                  location.pathname === link.href ? activeLinkClass : linkClass
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className={`xl:hidden relative z-[60] transition-colors duration-300 ${textClass}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`fixed inset-0 backdrop-blur-sm z-[40] xl:hidden transition-colors duration-300 ${overlayClass}`}
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`fixed top-0 right-0 h-screen w-72 max-w-[80vw] z-[45] flex flex-col border-l transition-colors duration-300 ${mobileMenuBg} xl:hidden`}
            >
              <div className="flex-1 overflow-y-auto px-6 pt-24 pb-8 flex flex-col items-center space-y-2">
                {siteConfig.navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block w-full text-center px-4 py-3 text-lg font-medium rounded-xl transition-colors duration-300 ${
                      location.pathname === link.href 
                        ? mobileActiveLinkClass 
                        : mobileLinkClass
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
