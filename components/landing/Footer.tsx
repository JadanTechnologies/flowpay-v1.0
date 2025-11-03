import React from 'react';
import { Zap, Facebook, Twitter, Linkedin } from 'lucide-react';
// FIX: The `react-router-dom` module seems to have CJS/ESM interop issues in this environment. Using a namespace import as a workaround.
import * as ReactRouterDOM from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';

const Footer: React.FC = () => {
  const { settings } = useAppContext();
  const branding = settings?.branding;
  const platformName = branding?.platformName || 'FlowPay';
  
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (href.startsWith('#')) {
        const id = href.substring(1);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    } else {
        // For external or absolute links, just navigate.
        // This won't work correctly with react-router-dom's Link, but for `a` tags it's fine.
        window.location.href = href;
    }
  };

  const legalLinks = [
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Refund Policy', href: '/refund' }
  ];
  
  const footerSections = [
    ...(branding?.footerLinkSections || []),
    {
      title: 'Legal',
      links: legalLinks,
    },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <ReactRouterDOM.Link to="/" className="flex items-center gap-2">
              <Zap className="text-primary" size={28} />
              <span className="text-2xl font-bold">{platformName}</span>
            </ReactRouterDOM.Link>
            <p className="mt-4 text-gray-400">{branding?.footerDescription || 'The ultimate SaaS platform for POS, Inventory, and Logistics management.'}</p>
            <div className="mt-6 flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white"><Facebook /></a>
                <a href="#" className="text-gray-400 hover:text-white"><Twitter /></a>
                <a href="#" className="text-gray-400 hover:text-white"><Linkedin /></a>
            </div>
          </div>
          
          {footerSections.map(section => (
            <div key={section.title}>
              <h4 className="font-semibold tracking-wider uppercase">{section.title}</h4>
              <ul className="mt-4 space-y-2">
                {section.links.map(link => (
                  <li key={link.name}>
                    {link.href.startsWith('/') ? (
                        <ReactRouterDOM.Link to={link.href} className="text-gray-400 hover:text-white">{link.name}</ReactRouterDOM.Link>
                    ) : (
                        <a href={link.href} onClick={(e) => handleScroll(e, link.href)} className="text-gray-400 hover:text-white">{link.name}</a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 pt-8 border-t border-gray-800 text-center text-gray-500">
          <p>{settings?.footerCredits || `© ${new Date().getFullYear()} ${platformName} Inc. All rights reserved.`}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;