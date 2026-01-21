
import React, { useState } from 'react';
import { UserRole } from '../types';
import { Language, FontSize, translations } from '../translations';

interface HomeProps {
  onLogin: (role: UserRole) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const Home: React.FC<HomeProps> = ({ onLogin, language, setLanguage, fontSize, setFontSize, theme, setTheme }) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [loginRole, setLoginRole] = useState<UserRole>(UserRole.FARMER);
  const t = translations[language];
  
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [dbtId, setDbtId] = useState('');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({
    name: '',
    mobile: '',
    category: 'Technical',
    message: ''
  });

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackSent(true);
    setTimeout(() => {
      setFeedbackSent(false);
      setIsFormOpen(false);
    }, 2500);
  };

  const openSupportForm = (category: string) => {
    setFeedbackForm({ ...feedbackForm, category });
    setIsFormOpen(true);
  };

  const unions = [
    { name: 'हरित (Harit)', location: 'Patna' },
    { name: 'तिरहुत (Tirhut)', location: 'Motihari' },
    { name: 'मिथिला (Mithila)', location: 'Darbhanga' },
    { name: 'मगध (Magadh)', location: 'Gaya' },
    { name: 'भागलपुर (Bhagalpur)', location: 'Bhagalpur' },
    { name: 'मुंगेर (Munger)', location: 'Munger' },
    { name: 'शाहाबाद (Shahabad)', location: 'Ara' },
    { name: 'सारण (Saran)', location: 'Chapra' }
  ];

  return (
    <div className={`min-h-screen bg-white dark:bg-slate-950 flex flex-col font-size-${fontSize} transition-colors duration-300`}>
      {/* Fixed Public Header: Toggles and Search Bar Visibility */}
      <header className="bg-white dark:bg-slate-900 border-b dark:border-slate-800 py-3 sticky top-0 z-50 transition-colors shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-4">
          {/* Logo Section */}
          <div className="flex items-center space-x-3 md:space-x-4 shrink-0">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-lg">V</div>
            <div className="hidden sm:block">
              <h1 className="text-xs md:text-sm font-black text-emerald-800 dark:text-emerald-400 leading-tight uppercase tracking-tight">{t.schemeName}</h1>
              <p className="text-[8px] md:text-[9px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-widest">Government of Bihar</p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-xs font-black text-emerald-800 dark:text-emerald-400 uppercase">VEGFED</h1>
            </div>
          </div>

          {/* Central Search Bar - Fixed Visibility */}
          <div className="hidden md:flex flex-1 max-w-xs md:max-w-md mx-4 md:mx-6 relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <i className="fa-solid fa-magnifying-glass text-gray-400 group-focus-within:text-emerald-500 transition-colors"></i>
            </div>
            <input 
              type="text" 
              placeholder="Search public info..."
              className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl py-2 pl-11 pr-4 text-[11px] font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all dark:text-white"
            />
          </div>

          {/* Controls Section - Toggles are now ALWAYS flex/visible */}
          <div className="flex items-center space-x-2 md:space-x-4 shrink-0">
             {/* Font Size Toggle */}
             <div className="flex items-center bg-gray-100 dark:bg-slate-800 rounded-lg p-0.5 md:p-1">
                <button onClick={() => setFontSize('sm')} className={`w-7 h-7 md:w-8 md:h-7 flex items-center justify-center text-[10px] font-black rounded ${fontSize === 'sm' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-gray-400'}`}>A-</button>
                <button onClick={() => setFontSize('md')} className={`w-7 h-7 md:w-8 md:h-7 flex items-center justify-center text-xs font-black rounded ${fontSize === 'md' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-gray-400'}`}>A</button>
                <button onClick={() => setFontSize('lg')} className={`w-7 h-7 md:w-8 md:h-7 flex items-center justify-center text-sm font-black rounded ${fontSize === 'lg' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-gray-400'}`}>A+</button>
             </div>

             {/* Theme & Language Toggles - Removed hidden class */}
             <div className="flex items-center space-x-2 border-l border-gray-200 dark:border-slate-800 pl-2 md:pl-4">
               <button 
                  onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
                  className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-500 hover:text-emerald-600 transition-colors"
                  aria-label="Toggle Theme"
                >
                  {theme === 'light' ? <i className="fa-solid fa-moon text-xs"></i> : <i className="fa-solid fa-sun text-xs"></i>}
               </button>
               <div className="flex items-center bg-gray-100 dark:bg-slate-800 rounded-lg p-1">
                  <button onClick={() => setLanguage('en')} className={`px-2 md:px-2.5 py-1 text-[9px] md:text-[10px] font-black rounded ${language === 'en' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-gray-400'}`}>EN</button>
                  <button onClick={() => setLanguage('hi')} className={`px-2 md:px-2.5 py-1 text-[9px] md:text-[10px] font-black rounded ${language === 'hi' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-gray-400'}`}>हिन्दी</button>
               </div>
             </div>
          </div>
        </div>
      </header>

      <div className="bg-emerald-900 text-white overflow-hidden py-2 text-[10px] font-black uppercase tracking-[0.1em] border-y border-emerald-800">
        <div className="animate-marquee whitespace-nowrap inline-block px-8">
          {t.tickerMsg} &nbsp; | &nbsp; {t.tickerMsg}
        </div>
      </div>

      <section className="relative bg-gradient-to-br from-emerald-800 to-emerald-900 py-16 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 text-white">
            <span className="inline-block bg-white/10 border border-white/20 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase mb-6">बिहार राज्य सब्जी प्रसंस्करण एवं विपणन योजना</span>
            <h2 className="text-5xl lg:text-7xl font-black mb-6 leading-tight">{t.slogan}</h2>
            <p className="text-emerald-50/70 text-lg mb-8 max-w-xl leading-relaxed">वेजफेड के माध्यम से बिहार के किसानों को सीधे बाजार से जोड़कर उनकी आय में वृद्धि करना और उपभोक्ताओं को ताजी सब्जियां उपलब्ध कराना।</p>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 shadow-2xl border-4 border-emerald-500/10 transition-colors">
              <div className="flex bg-gray-100 dark:bg-slate-800 p-1.5 rounded-2xl mb-8">
                <button onClick={() => setTab('login')} className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${tab === 'login' ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm' : 'text-gray-400'}`}>{t.signIn}</button>
                <button onClick={() => setTab('register')} className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${tab === 'register' ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm' : 'text-gray-400'}`}>{t.joinCooperative}</button>
              </div>

              {tab === 'login' ? (
                <div className="space-y-5 transition-opacity duration-500">
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <button onClick={() => setLoginRole(UserRole.FARMER)} className={`py-2.5 text-[10px] font-black uppercase rounded-lg border transition-all ${loginRole === UserRole.FARMER ? 'bg-emerald-600 text-white border-emerald-600' : 'text-gray-400 border-gray-200'}`}>Farmer Login</button>
                    <button onClick={() => setLoginRole(UserRole.PVCS_USER)} className={`py-2.5 text-[10px] font-black uppercase rounded-lg border transition-all ${loginRole !== UserRole.FARMER ? 'bg-emerald-600 text-white border-emerald-600' : 'text-gray-400 border-gray-200'}`}>Official Login</button>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">{t.userId}</label>
                    <input type="text" className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">{t.password}</label>
                    <input type="password" className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white" />
                  </div>
                  <button onClick={() => onLogin(loginRole)} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-emerald-700 transition-all active:scale-95 shadow-lg">
                    {t.loginButton}
                  </button>
                </div>
              ) : (
                <div className="space-y-5 transition-opacity duration-500">
                   <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">{t.dbtNumber}</label>
                    <input type="text" value={dbtId} onChange={e => setDbtId(e.target.value)} placeholder="e.g. 231XXXXXXXX" className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white" />
                  </div>
                  <button onClick={() => setOtpSent(true)} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-emerald-700 shadow-lg">
                    {otpSent ? t.verifyButton : t.startRegistration}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Support Hub Section */}
      <section className="py-24 px-6 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-emerald-600 font-black text-xs uppercase tracking-[0.3em]">{t.supportAndFeedback}</span>
            <h3 className="text-4xl font-black text-gray-900 dark:text-white mt-4 mb-6 uppercase tracking-tight">How can we help?</h3>
            <p className="text-gray-500 dark:text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">Select a category to raise a specialized ticket. Our teams respond within 24-48 hours.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
             {[
               { id: 'Technical', icon: 'fa-microchip', color: 'bg-blue-600', label: 'Technical Issue' },
               { id: 'Pricing', icon: 'fa-indian-rupee-sign', color: 'bg-emerald-600', label: 'Pricing Query' },
               { id: 'Membership', icon: 'fa-id-card', color: 'bg-amber-600', label: 'Membership' },
               { id: 'Other', icon: 'fa-headset', color: 'bg-indigo-600', label: 'General Help' }
             ].map((item) => (
               <div 
                key={item.id} 
                onClick={() => openSupportForm(item.id)}
                className="group bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all cursor-pointer active:scale-95"
               >
                  <div className={`w-14 h-14 ${item.color} text-white rounded-2xl flex items-center justify-center text-xl mb-6 shadow-xl`}>
                    <i className={`fa-solid ${item.icon}`}></i>
                  </div>
                  <h4 className="font-black text-gray-900 dark:text-white text-xl uppercase tracking-tight">{item.label}</h4>
                  <div className="mt-8 flex items-center text-emerald-600 font-black text-[10px] uppercase tracking-widest">
                    <span>Raise Ticket</span>
                    <i className="fa-solid fa-arrow-right ml-2 group-hover:translate-x-2 transition-transform"></i>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Support Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsFormOpen(false)}></div>
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl relative z-10 overflow-hidden flex flex-col transition-all duration-300">
             <div className="p-8 bg-emerald-600 text-white flex justify-between items-center">
                <h4 className="text-2xl font-black uppercase tracking-tight">{feedbackForm.category} Support</h4>
                <button onClick={() => setIsFormOpen(false)} className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-lg">
                  <i className="fa-solid fa-xmark"></i>
                </button>
             </div>
             <div className="p-10">
               {feedbackSent ? (
                 <div className="text-center py-10">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-3xl mx-auto mb-6"><i className="fa-solid fa-check"></i></div>
                    <h5 className="text-2xl font-black text-gray-900 dark:text-white mb-2 uppercase">Ticket Raised</h5>
                    <p className="text-gray-500 font-medium">Tracking ID: TCK-2026-042</p>
                 </div>
               ) : (
                 <form onSubmit={handleFeedbackSubmit} className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Full Name</label>
                      <input required type="text" className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl px-5 py-4 text-sm font-bold dark:text-white" value={feedbackForm.name} onChange={e => setFeedbackForm({...feedbackForm, name: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Mobile Number</label>
                      <input required type="tel" className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl px-5 py-4 text-sm font-bold dark:text-white" value={feedbackForm.mobile} onChange={e => setFeedbackForm({...feedbackForm, mobile: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Issue Description</label>
                      <textarea required rows={4} className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl px-5 py-4 text-sm font-medium dark:text-white" value={feedbackForm.message} onChange={e => setFeedbackForm({...feedbackForm, message: e.target.value})} />
                    </div>
                    <button type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-emerald-700 active:scale-95 transition-all">Submit Case</button>
                 </form>
               )}
             </div>
          </div>
        </div>
      )}

      {/* Union Network Section */}
      <section className="py-20 px-6 bg-white dark:bg-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto text-center">
           <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-wider mb-12">हमारा नेटवर्क (Union Network)</h3>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {unions.map((union, i) => (
                <div key={i} className="bg-gray-50 dark:bg-slate-800/50 p-6 rounded-3xl border dark:border-slate-800 transition-all hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg group">
                  <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 rounded-lg flex items-center justify-center mb-3 mx-auto group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <i className="fa-solid fa-building"></i>
                  </div>
                  <h5 className="font-black text-gray-900 dark:text-slate-100 text-sm">{union.name}</h5>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">{union.location}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-400 pt-20 pb-10 px-6 border-t-8 border-emerald-600">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="space-y-6">
            <div className="flex items-center space-x-3 text-white">
               <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center font-black text-xl">V</div>
               <span className="font-black text-xl uppercase tracking-tighter">VEGFED</span>
            </div>
            <p className="text-sm font-medium">Official ERP Portal for Bihar State Vegetable Co-operative Federation.</p>
          </div>
          <div>
            <h5 className="text-white font-bold mb-6 uppercase tracking-widest text-[10px]">Quick Links</h5>
            <ul className="space-y-3 text-[10px] font-black uppercase tracking-widest">
               <li className="hover:text-emerald-500 cursor-pointer">Horticulture Bihar</li>
               <li className="hover:text-emerald-500 cursor-pointer">Govt of Bihar Main Portal</li>
               <li className="hover:text-emerald-500 cursor-pointer">Agriculture DBT</li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-bold mb-6 uppercase tracking-widest text-[10px]">Contact Info</h5>
            <p className="text-sm font-medium">Vikas Bhawan, New Secretariat, Patna</p>
            <p className="text-sm mt-2 font-black text-emerald-500 uppercase">1800-1800-110 (Toll Free)</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-slate-800 mt-20 pt-10 text-center">
           <p className="text-[10px] uppercase font-black tracking-widest text-slate-600">© 2025 VEGFED BIHAR | All Rights Reserved</p>
        </div>
      </footer>
      <style dangerouslySetInnerHTML={{ __html: `@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } } .animate-marquee { display: inline-block; animation: marquee 30s linear infinite; }` }} />
    </div>
  );
};

export default Home;
