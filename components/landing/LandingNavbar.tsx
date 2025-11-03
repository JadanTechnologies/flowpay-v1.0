import React, { useState } from 'react';
import { Zap, Menu, X, Search, Loader } from 'lucide-react';
// FIX: The `react-router-dom` module seems to have CJS/ESM interop issues in this environment. Using a namespace import as a workaround.
import * as ReactRouterDOM from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { GoogleGenAI } from '@google/genai';

interface SearchResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  searchResult: string;
  searchSources: any[];
  isSearching: boolean;
}

const SearchResultsModal: React.FC<SearchResultsModalProps> = ({ isOpen, onClose, query, searchResult, searchSources, isSearching }) => {
  if (!isOpen) return null;

  const renderMarkdown = (text: string) => {
    if (!text) return { __html: '' };
    // Basic markdown for bold and newlines for presentation
    let html = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br />');
    return { __html: html };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Search results for "{query}"</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><X /></button>
        </div>
        <div className="p-6 overflow-y-auto">
          {isSearching ? (
            <div className="flex flex-col items-center justify-center h-40">
              <Loader className="animate-spin text-primary" size={32} />
              <p className="mt-4 text-gray-600">Searching with AI...</p>
            </div>
          ) : (
            <div>
              <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={renderMarkdown(searchResult)} />
              {searchSources && searchSources.length > 0 && (
                <div className="mt-8 pt-4 border-t">
                  <h3 className="font-semibold text-gray-800 mb-2">Sources from Google Search:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {searchSources.map((source, index) => (
                      <li key={index}>
                        <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm">
                          {source.web.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


const LandingNavbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { settings } = useAppContext();
  const branding = settings?.branding;
  const platformName = branding?.platformName || 'FlowPay';
  const logoUrl = branding?.logoUrl;

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchResult, setSearchResult] = useState('');
  const [searchSources, setSearchSources] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!searchQuery.trim()) return;
      
      setIsSearchModalOpen(true);
      setIsSearching(true);
      setSearchResult('');
      setSearchSources([]);
      
      try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
          const prompt = `Based on Google Search results for "${searchQuery}", provide a concise summary of how FlowPay addresses this topic. FlowPay is a B2B SaaS for POS, Inventory, Accounting, and Logistics. Focus on its features and benefits. Format the response as simple Markdown, using **bold** for emphasis.`;

          const response = await ai.models.generateContent({
              model: "gemini-2.5-flash",
              contents: prompt,
              config: {
                  tools: [{googleSearch: {}}],
              },
          });
          
          setSearchResult(response.text);
          const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
          const validSources = sources.filter((s: any) => s.web && s.web.uri && s.web.title);
          setSearchSources(validSources);
      } catch (error) {
          console.error("Error during search:", error);
          setSearchResult("Sorry, I couldn't find any information on that. Please try another search term.");
      } finally {
          setIsSearching(false);
      }
  };


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
    <>
      <header className="sticky top-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <ReactRouterDOM.Link to="/" className="flex items-center gap-2">
                {logoUrl ? <img src={logoUrl} alt={platformName} className="h-8 w-auto" /> : <Zap className="text-primary" size={28} />}
                <span className="text-2xl font-bold text-gray-900">{platformName}</span>
              </ReactRouterDOM.Link>
            </div>
            <nav className="hidden md:flex md:items-center md:space-x-8">
              {navLinks.map((link) => (
                <a key={link.name} href={link.href} onClick={(e) => handleScroll(e, link.href)} className="font-medium text-gray-600 hover:text-primary transition-colors">
                  {link.name}
                </a>
              ))}
            </nav>
            <div className="hidden md:flex flex-1 items-center justify-center px-8">
                <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search features (e.g., inventory)"
                        className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                </form>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <ReactRouterDOM.Link to="/login" className="font-medium text-gray-600 hover:text-primary transition-colors">
                {branding?.signInButtonText || 'Sign In'}
              </ReactRouterDOM.Link>
              <ReactRouterDOM.Link to="/login" className="px-4 py-2 bg-primary text-white rounded-md font-semibold hover:bg-primary-dark transition-colors">
                {branding?.mainCtaText || 'Start Free Trial'}
              </ReactRouterDOM.Link>
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
            <div className="px-2 pt-3 pb-3 space-y-1 sm:px-3">
              <form onSubmit={handleSearchSubmit} className="relative mb-3 px-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search features..."
                      className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
              </form>
              {navLinks.map((link) => (
                <a key={link.name} href={link.href} onClick={(e) => handleScroll(e, link.href)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-50">
                  {link.name}
                </a>
              ))}
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="px-5">
                 <ReactRouterDOM.Link to="/login" className="block w-full text-center px-4 py-2 bg-primary text-white rounded-md font-semibold hover:bg-primary-dark transition-colors">
                  {branding?.mobileMenuCtaText || 'Start Free Trial'}
                </ReactRouterDOM.Link>
                <p className="mt-3 text-center text-base font-medium text-gray-500">
                  {branding?.mobileMenuExistingCustomerText || 'Existing customer?'}{' '}
                  <ReactRouterDOM.Link to="/login" className="text-primary hover:underline">{branding?.signInButtonText || 'Sign In'}</ReactRouterDOM.Link>
                </p>
              </div>
            </div>
          </div>
        )}
      </header>
      <SearchResultsModal
        isOpen={isSearchModalOpen}
        onClose={() => {
            setIsSearchModalOpen(false);
            setSearchQuery('');
        }}
        query={searchQuery}
        searchResult={searchResult}
        searchSources={searchSources}
        isSearching={isSearching}
      />
    </>
  );
};

export default LandingNavbar;