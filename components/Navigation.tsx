import React from 'react';
import { ViewMode, Language } from '../types';
import { translations } from '../translations';

interface NavigationProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange, language, onLanguageChange }) => {
  const t = translations[language].nav;

  const navItems = [
    { id: ViewMode.DASHBOARD, label: t[ViewMode.DASHBOARD], icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )},
    { id: ViewMode.MIRROR, label: t[ViewMode.MIRROR], icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    )},
    { id: ViewMode.ARCHIVE, label: t[ViewMode.ARCHIVE], icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )},
    { id: ViewMode.THEATER, label: t[ViewMode.THEATER], icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )},
  ];

  return (
    <nav className="w-full md:w-20 lg:w-64 h-20 md:h-screen bg-surface border-t md:border-t-0 md:border-r border-subtle flex md:flex-col items-center md:items-start justify-between p-4 z-50 fixed bottom-0 md:relative transition-all">
      
      {/* Top Section */}
      <div className="flex flex-row md:flex-col items-center md:items-start w-full md:w-auto flex-1 justify-around md:justify-start">
        <div className="hidden md:block mb-12 mt-4 px-2">
          <h1 className="font-display text-xl lg:text-2xl tracking-widest text-text hidden lg:block">DASEIN</h1>
          <h1 className="font-display text-xl text-text lg:hidden">D</h1>
          <p className="text-[10px] text-muted mt-1 tracking-wider uppercase hidden lg:block">{t.subtitle}</p>
        </div>

        <div className="flex md:flex-col w-full gap-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg w-full transition-all duration-300 group ${
                currentView === item.id 
                  ? 'text-white' 
                  : 'text-muted hover:text-white'
              }`}
            >
              <div className={`${currentView === item.id ? 'text-core' : 'group-hover:text-gray-300'} transition-colors`}>
                {item.icon}
              </div>
              <span className={`font-serif text-sm tracking-wide hidden lg:block ${currentView === item.id ? 'text-white' : ''}`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Language Toggle */}
      <div className="hidden md:block w-full px-2 mb-4">
        <button 
          onClick={() => onLanguageChange(language === 'en' ? 'zh' : 'en')}
          className="flex items-center lg:justify-between justify-center w-full px-3 py-2 rounded border border-subtle text-xs text-muted hover:text-text hover:border-gray-600 transition-colors"
        >
           <span className="hidden lg:inline">Language</span>
           <span className="font-serif font-bold">{language === 'en' ? 'EN' : '中'}</span>
        </button>
      </div>

      <div className="md:hidden absolute top-[-60px] right-4">
        <button 
            onClick={() => onLanguageChange(language === 'en' ? 'zh' : 'en')}
            className="w-10 h-10 bg-surface border border-subtle rounded-full flex items-center justify-center text-xs font-serif"
        >
             {language === 'en' ? 'EN' : '中'}
        </button>
      </div>

    </nav>
  );
};

export default Navigation;
