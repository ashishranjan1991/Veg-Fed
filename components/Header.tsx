
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

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 h-16 flex items-center justify-between px-4 md:px-8 z-10 sticky top-0 transition-colors duration-300">
      <div className="flex items-center space-x-2 shrink-0">
        <span className="text-gray-500 dark:text-slate-400 text-xs md:text-sm font-black truncate max-w-[100px] md:max-w-none uppercase tracking-tighter">
          VEGFED ERP
        </span>
      </div>

      {/* Persistent Search Bar for MD and up */}
      <div className="hidden sm:flex flex-1 max-w-sm md:max-w-md mx-4 md:mx-8 relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <i className="fa-solid fa-magnifying-glass text-gray-400 group-focus-within:text-emerald-500 transition-colors"></i>
        </div>
        <input 
          type="text" 
          placeholder="Search modules..."
          className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl py-2 pl-11 pr-4 text-[11px] font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all dark:text-white"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
           <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[9px] font-black text-gray-300 bg-white dark:bg-slate-900 border dark:border-slate-700 rounded shadow-sm">⌘K</kbd>
        </div>
      </div>

      <div className="flex items-center space-x-2 md:space-x-4 shrink-0">
        {/* Font Scale Control - Always showing on tablet/desktop */}
        <div className="flex items-center bg-gray-100 dark:bg-slate-800 rounded-lg p-0.5 md:p-1">
          <button 
            onClick={() => setFontSize('sm')} 
            className={`w-7 h-7 md:w-8 md:h-8 flex items-center justify-center text-[10px] font-black rounded transition-all ${fontSize === 'sm' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-gray-400'}`}
            title="Smaller Font"
          >A-</button>
          <button 
            onClick={() => setFontSize('md')} 
            className={`w-7 h-7 md:w-8 md:h-8 flex items-center justify-center text-xs font-black rounded transition-all ${fontSize === 'md' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-gray-400'}`}
            title="Default Font"
          >A</button>
          <button 
            onClick={() => setFontSize('lg')} 
            className={`w-7 h-7 md:w-8 md:h-8 flex items-center justify-center text-sm font-black rounded transition-all ${fontSize === 'lg' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-gray-400'}`}
            title="Larger Font"
          >A+</button>
        </div>

        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-500 hover:text-emerald-600 transition-all"
        >
          {theme === 'light' ? <i className="fa-solid fa-moon text-xs"></i> : <i className="fa-solid fa-sun text-xs"></i>}
        </button>

        <div className="flex items-center bg-gray-100 dark:bg-slate-800 rounded-lg p-1">
          <button onClick={() => setLanguage('en')} className={`px-2 md:px-2.5 py-1 text-[9px] md:text-[10px] font-black rounded ${language === 'en' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-gray-400'}`}>EN</button>
          <button onClick={() => setLanguage('hi')} className={`px-2 md:px-2.5 py-1 text-[9px] md:text-[10px] font-black rounded ${language === 'hi' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-gray-400'}`}>हिन्दी</button>
        </div>

        <div className="hidden sm:flex items-center space-x-3 border-l pl-4 border-gray-200 dark:border-slate-800">
          <div className="text-right hidden md:block">
            <p className="text-[11px] font-black text-gray-900 dark:text-slate-100 leading-none">{user.name}</p>
            <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">{user.role}</p>
          </div>
          <div className="w-8 h-8 md:w-9 md:h-9 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-lg flex items-center justify-center font-black text-xs">
            {user.name.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
