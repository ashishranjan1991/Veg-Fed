
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
    <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 h-16 flex items-center justify-between px-8 z-10 sticky top-0 transition-colors duration-300">
      <div className="flex items-center space-x-2">
        <span className="text-gray-500 dark:text-slate-400 text-sm font-medium">{t.schemeName}</span>
      </div>

      <div className="flex items-center space-x-4 lg:space-x-6">
        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all shadow-sm"
          title="Toggle Dark Mode"
        >
          {theme === 'light' ? <i className="fa-solid fa-moon"></i> : <i className="fa-solid fa-sun"></i>}
        </button>

        {/* Language Toggle */}
        <div className="flex items-center bg-gray-100 dark:bg-slate-800 rounded-lg p-1 transition-colors duration-300">
          <button
            onClick={() => setLanguage('en')}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${language === 'en' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'}`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('hi')}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${language === 'hi' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'}`}
          >
            हिन्दी
          </button>
        </div>

        {/* Font Size Toggle */}
        <div className="hidden md:flex items-center space-x-1 border-l pl-6 border-gray-200 dark:border-slate-800">
          <button
            onClick={() => setFontSize('sm')}
            className={`w-8 h-8 flex items-center justify-center rounded-md border text-sm font-bold ${fontSize === 'sm' ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400' : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-400 dark:text-slate-500'}`}
            title="Small Font"
          >
            A-
          </button>
          <button
            onClick={() => setFontSize('md')}
            className={`w-8 h-8 flex items-center justify-center rounded-md border text-base font-bold ${fontSize === 'md' ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400' : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-400 dark:text-slate-500'}`}
            title="Medium Font"
          >
            A
          </button>
          <button
            onClick={() => setFontSize('lg')}
            className={`w-8 h-8 flex items-center justify-center rounded-md border text-lg font-bold ${fontSize === 'lg' ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400' : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-400 dark:text-slate-500'}`}
            title="Large Font"
          >
            A+
          </button>
        </div>

        <button className="relative text-gray-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
          <i className="fa-solid fa-bell text-xl"></i>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">3</span>
        </button>

        <div className="flex items-center space-x-3 border-l pl-6 border-gray-200 dark:border-slate-800">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-900 dark:text-slate-100 leading-none">{user.name}</p>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">{user.organization || user.role}</p>
          </div>
          <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-full flex items-center justify-center font-bold">
            {user.name.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
