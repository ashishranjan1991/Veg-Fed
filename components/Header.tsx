
import React from 'react';
import { UserProfile } from '../types';
import { Language, FontSize, translations } from '../translations';

interface HeaderProps {
  user: UserProfile;
  language: Language;
  setLanguage: (lang: Language) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const Header: React.FC<HeaderProps> = ({ user, language, setLanguage, fontSize, setFontSize, theme, setTheme }) => {
  const t = translations[language];
  const logoUrl = "https://tarkaari.in/assets/img/logo-veg.png";

  return (
    <div className="flex flex-col w-full z-50 sticky top-0 transition-colors duration-300">
      {/* Official Government Bilingual Masthead (Mini) */}
      <div className="bg-emerald-800 text-white py-1 px-4 text-center border-b border-emerald-900 shadow-sm">
        <p className="text-[9px] font-black uppercase tracking-tight leading-tight">बिहार राज्य सब्ज़ी प्रसंस्करण एवं विपणन सहकारी फेडरेशन लि. पटना | Bihar State Vegetable Processing and Marketing Co-operative Federation Ltd. Patna</p>
      </div>
      
      <header role="banner" className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 h-16 flex items-center justify-between px-4 md:px-8 transition-colors duration-300">
        <div className="flex items-center space-x-3 shrink-0">
          <img src={logoUrl} className="w-8 h-8 object-contain" alt="Vegfed Logo" />
          <span className="text-gray-500 dark:text-slate-400 text-xs md:text-sm font-black truncate max-w-[100px] md:max-w-none uppercase tracking-tighter">
            VEGFED ERP
          </span>
        </div>

        {/* Global ERP Search Bar - Prominent */}
        <div className="hidden lg:flex flex-1 max-w-xl mx-8 relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <i className="fa-solid fa-magnifying-glass text-gray-400 group-focus-within:text-emerald-500 transition-colors text-xs" aria-hidden="true"></i>
          </div>
          <input 
            type="search" 
            placeholder="Search modules, farmers, or reports (e.g. 'Tomato procurement')"
            aria-label="Global ERP Search"
            className="w-full bg-gray-100/50 dark:bg-slate-800/50 border border-transparent dark:border-slate-700/50 rounded-2xl py-2.5 pl-11 pr-12 text-[11px] font-bold focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 outline-none transition-all dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-600 shadow-inner"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <kbd className="hidden xl:inline-block px-1.5 py-1 text-[8px] font-black text-gray-400 dark:text-slate-500 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded shadow-sm">CTRL K</kbd>
          </div>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4 shrink-0">
          <div className="flex items-center bg-gray-100 dark:bg-slate-800 rounded-lg p-0.5 md:p-1" role="group" aria-label="Font size adjustment">
            <button 
              onClick={() => setFontSize('sm')} 
              aria-pressed={fontSize === 'sm'}
              className={`w-7 h-7 md:w-8 md:h-8 flex items-center justify-center text-[10px] font-black rounded transition-all ${fontSize === 'sm' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-gray-400'}`}
              title="Smaller Font"
              aria-label="Set small font size"
            >A-</button>
            <button 
              onClick={() => setFontSize('md')} 
              aria-pressed={fontSize === 'md'}
              className={`w-7 h-7 md:w-8 md:h-8 flex items-center justify-center text-xs font-black rounded transition-all ${fontSize === 'md' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-gray-400'}`}
              title="Default Font"
              aria-label="Set default font size"
            >A</button>
            <button 
              onClick={() => setFontSize('lg')} 
              aria-pressed={fontSize === 'lg'}
              className={`w-7 h-7 md:w-8 md:h-8 flex items-center justify-center text-sm font-black rounded transition-all ${fontSize === 'lg' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-gray-400'}`}
              title="Larger Font"
              aria-label="Set large font size"
            >A+</button>
          </div>

          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            aria-label={theme === 'light' ? "Switch to dark theme" : "Switch to light theme"}
            aria-pressed={theme === 'dark'}
            className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-500 hover:text-emerald-600 transition-all"
          >
            {theme === 'light' ? <i className="fa-solid fa-moon text-xs" aria-hidden="true"></i> : <i className="fa-solid fa-sun text-xs" aria-hidden="true"></i>}
          </button>

          <div className="flex items-center bg-gray-100 dark:bg-slate-800 rounded-lg p-1" role="group" aria-label="Language selection">
            <button onClick={() => setLanguage('en')} aria-pressed={language === 'en'} aria-label="Switch to English" className={`px-2 md:px-2.5 py-1 text-[9px] md:text-[10px] font-black rounded ${language === 'en' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-gray-400'}`}>EN</button>
            <button onClick={() => setLanguage('hi')} aria-pressed={language === 'hi'} aria-label="हिन्दी में बदलें" className={`px-2 md:px-2.5 py-1 text-[9px] md:text-[10px] font-black rounded ${language === 'hi' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-gray-400'}`}>हिन्दी</button>
          </div>

          <div className="hidden sm:flex items-center space-x-3 border-l pl-4 border-gray-200 dark:border-slate-800">
            <div className="text-right hidden md:block">
              <p className="text-[11px] font-black text-gray-900 dark:text-slate-100 leading-none">{user.name}</p>
              <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">{user.role}</p>
            </div>
            <div className="w-8 h-8 md:w-9 md:h-9 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-lg flex items-center justify-center font-black text-xs" aria-hidden="true">
              {user.name.charAt(0)}
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
