import React, { useState } from 'react';
import { Search, Bell, ChevronDown, User, Settings, Calculator as CalculatorIcon, Store, CheckCircle, AlertTriangle, XCircle, Handshake, CreditCard, Loader, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import DigitalClock from '../ui/DigitalClock';
import Calculator from '../ui/Calculator';
import NetworkStatusIndicator from '../ui/NetworkStatusIndicator';
import { Notification } from '../../types';
import { GoogleGenAI } from '@google/genai';

const NotificationIcon: React.FC<{type: Notification['type']}> = ({ type }) => {
    switch(type) {
        case 'success': return <CheckCircle className="text-green-500" />;
        case 'warning': return <AlertTriangle className="text-yellow-500" />;
        case 'error': return <XCircle className="text-red-500" />;
        default: return <Bell className="text-blue-500" />;
    }
}

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
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-surface rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col border border-border" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h2 className="text-xl font-bold text-text-primary">Search results for "{query}"</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary"><X /></button>
        </div>
        <div className="p-6 overflow-y-auto">
          {isSearching ? (
            <div className="flex flex-col items-center justify-center h-40">
              <Loader className="animate-spin text-primary" size={32} />
              <p className="mt-4 text-text-secondary">Searching with AI...</p>
            </div>
          ) : (
            <div>
              <div className="prose prose-invert max-w-none text-text-secondary" dangerouslySetInnerHTML={renderMarkdown(searchResult)} />
              {searchSources && searchSources.length > 0 && (
                <div className="mt-8 pt-4 border-t border-border">
                  <h3 className="font-semibold text-text-primary mb-2">Sources from Google Search:</h3>
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

const Header: React.FC = () => {
  const { 
      session, 
      branches, 
      currentBranchId, 
      setCurrentBranchId,
      notificationHistory,
      hasUnreadNotifications,
      markNotificationsAsRead
  } = useAppContext();
  const [showCalculator, setShowCalculator] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const isCashier = session?.user?.app_metadata?.role === 'Cashier';

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
        const prompt = `Based on Google Search results for "${searchQuery}", provide a concise summary of how the FlowPay SaaS platform addresses this topic. FlowPay is a B2B SaaS for POS, Inventory, Accounting, and Logistics. Focus on its features and benefits. Format the response as simple Markdown, using **bold** for emphasis.`;

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
        setSearchResult("Sorry, I couldn't find any information on that. Please try another search term or check your API key setup.");
    } finally {
        setIsSearching(false);
    }
  };

  const handleBellClick = () => {
    setShowNotifications(prev => !prev);
    if (!showNotifications) { // When opening
        markNotificationsAsRead();
    }
  }

  const currentBranch = branches.find(b => b.id === currentBranchId);
  const userName = session?.user?.user_metadata?.name || session?.user?.email;
  const userRole = session?.user?.app_metadata?.role?.replace(/_/g, ' ') || 'User';

  return (
    <>
      <header className="bg-surface border-b border-border p-4 flex items-center justify-between">
        {/* Search Bar and Clock */}
        <div className="flex items-center gap-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for features (e.g., inventory)..."
              className="bg-background border border-border rounded-lg pl-10 pr-4 py-2 w-64 md:w-96 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </form>
          <div className="hidden lg:block">
            <DigitalClock />
          </div>
        </div>


        {/* Right side icons and profile */}
        <div className="flex items-center gap-4">
            <div className="group relative">
                <button 
                  className={`flex items-center gap-2 bg-background p-2 rounded-lg border border-border ${isCashier ? 'cursor-not-allowed opacity-70' : 'group-hover:bg-border/50'}`}
                  disabled={isCashier}
                >
                    <Store size={18} className="text-primary" />
                    <span className="font-semibold text-sm text-text-primary">{currentBranch?.name || 'Select Branch'}</span>
                    {!isCashier && <ChevronDown size={16} className="text-text-secondary group-hover:rotate-180 transition-transform" />}
                </button>
                {!isCashier && (
                   <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity invisible group-hover:visible z-10">
                      {branches.map(branch => (
                           <button 
                              key={branch.id} 
                              onClick={() => setCurrentBranchId(branch.id)}
                              className={`w-full text-left px-4 py-2 text-sm ${currentBranchId === branch.id ? 'text-primary' : 'text-text-secondary'} hover:bg-background`}
                          >
                              {branch.name}
                          </button>
                      ))}
                   </div>
                )}
            </div>
            
          <button
            onClick={() => setShowCalculator(true)}
            className="text-text-secondary hover:text-text-primary"
            title="Open Calculator"
          >
            <CalculatorIcon size={22} />
          </button>
          <div className="relative">
            <button onClick={handleBellClick} className="relative text-text-secondary hover:text-text-primary">
                <Bell size={22} />
                {hasUnreadNotifications && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                )}
            </button>
            {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-surface border border-border rounded-md shadow-lg z-20">
                    <div className="p-3 font-semibold border-b border-border text-text-primary">Notifications</div>
                    <div className="max-h-96 overflow-y-auto">
                        {notificationHistory.length === 0 ? (
                            <p className="p-4 text-sm text-text-secondary text-center">No notifications yet.</p>
                        ) : (
                            notificationHistory.map(notif => (
                                <div key={notif.id} className="p-3 border-b border-border last:border-b-0 hover:bg-background flex gap-3">
                                    <div className="pt-1">
                                        <NotificationIcon type={notif.type} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-text-primary">{notif.message}</p>
                                        <p className="text-xs text-text-secondary mt-1">{new Date(parseInt(notif.id.split('_')[1])).toLocaleString()}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
          </div>

          <NetworkStatusIndicator />

          <div className="w-px h-6 bg-border"></div>

          <div className="group relative">
              <button className="flex items-center gap-2">
                  <img src="https://picsum.photos/seed/user/100/100" alt="avatar" className="w-9 h-9 rounded-full" />
                  <div>
                      <p className="font-semibold text-sm text-text-primary text-left">{userName}</p>
                      <p className="text-xs text-text-secondary text-left capitalize">{userRole}</p>
                  </div>
                  <ChevronDown size={16} className="text-text-secondary group-hover:rotate-180 transition-transform" />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity invisible group-hover:visible z-10">
                  <Link to="/app/settings/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-background hover:text-text-primary">
                      <User size={16} /> Profile
                  </Link>
                  <Link to="/app/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-background hover:text-text-primary">
                      <Settings size={16} /> Settings
                  </Link>
              </div>
          </div>
        </div>
      </header>
      {showCalculator && <Calculator onClose={() => setShowCalculator(false)} />}
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

export default Header;