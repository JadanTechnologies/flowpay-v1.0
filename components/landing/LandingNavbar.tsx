import React, { useState } from 'react';
import { Zap, Menu, X } from 'lucide-react';
// FIX: The `react-router-dom` module seems to have CJS/ESM interop issues in this environment. Using a namespace import as a workaround.
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM;
import { useAppContext } from '../../contexts/AppContext';

const LandingNavbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { settings } = useAppContext();
  const branding = settings?.branding;
  const platformName = branding?.platformName || 'FlowPay';
  const logoUrl = branding?.logoUrl;

  const navLinks = branding?.landingNavItems || [];

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (href.startsWith('#')) {
        const id = href.substring(1);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }
    setIsOpen(false); // Close mobile menu on click
  };


  return (
    <header className="sticky top-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-2">
              {logoUrl ? <img src={logoUrl} alt={platformName} className="h-8 w-auto" /> : <Zap className="text-primary" size={28} />}
              <span className="text-2xl font-bold text-gray-900">{platformName}</span>
            </Link>
          </div>
          <nav className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} onClick={(e) => handleScroll(e, link.href)} className="font-medium text-gray-600 hover:text-primary transition-colors">
                {link.name}
              </a>
            ))}
          </nav>
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login" className="font-medium text-gray-600 hover:text-primary transition-colors">
              {branding?.signInButtonText || 'Sign In'}
            </Link>
            <Link to="/login" className="px-4 py-2 bg-primary text-white rounded-md font-semibold hover:bg-primary-dark transition-colors">
              {branding?.mainCtaText || 'Start Free Trial'}
            </Link>
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-primary">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} onClick={(e) => handleScroll(e, link.href)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-50">
                {link.name}
              </a>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="px-5">
               <Link to="/login" className="block w-full text-center px-4 py-2 bg-primary text-white rounded-md font-semibold hover:bg-primary-dark transition-colors">
                {branding?.mobileMenuCtaText || 'Start Free Trial'}
              </Link>
              <p className="mt-3 text-center text-base font-medium text-gray-500">
                {branding?.mobileMenuExistingCustomerText || 'Existing customer?'}{' '}
                <Link to="/login" className="text-primary hover:underline">{branding?.signInButtonText || 'Sign In'}</Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default LandingNavbar;