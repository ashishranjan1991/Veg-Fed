
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
    { name: 'हरित (Harit)', location: 'Patna', logo: 'H' },
    { name: 'तिरहुत (Tirhut)', location: 'Motihari', logo: 'T' },
    { name: 'मिथिला (Mithila)', location: 'Darbhanga', logo: 'M' },
    { name: 'मगध (Magadh)', location: 'Gaya', logo: 'G' },
    { name: 'भागलपुर (Bhagalpur)', location: 'Bhagalpur', logo: 'B' },
    { name: 'मुंगेर (Munger)', location: 'Munger', logo: 'U' },
    { name: 'शाहाबाद (Shahabad)', location: 'Ara', logo: 'S' },
    { name: 'सारण (Saran)', location: 'Chapra', logo: 'R' }
  ];

  return (
    <div className={`min-h-screen bg-white dark:bg-slate-950 flex flex-col font-size-${fontSize} transition-colors duration-300`}>
      {/* Public Header */}
      <header role="banner" className="bg-white dark:bg-slate-900 border-b dark:border-slate-800 py-3 sticky top-0 z-50 transition-colors shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3 md:space-x-4 shrink-0">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-lg" aria-hidden="true">
              <i className="fa-solid fa-leaf"></i>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xs md:text-sm font-black text-emerald-800 dark:text-emerald-400 leading-tight uppercase tracking-tight">TARKAARI.IN</h1>
              <p className="text-[8px] md:text-[9px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-widest">VEGFED BIHAR OFFICIAL</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4 shrink-0">
             <div className="flex items-center bg-gray-100 dark:bg-slate-800 rounded-lg p-0.5 md:p-1" role="group" aria-label="Font adjustment">
                <button onClick={() => setFontSize('sm')} aria-label="Small font" className={`w-7 h-7 md:w-8 md:h-7 flex items-center justify-center text-[10px] font-black rounded ${fontSize === 'sm' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-gray-400'}`}>A-</button>
                <button onClick={() => setFontSize('md')} aria-label="Medium font" className={`w-7 h-7 md:w-8 md:h-7 flex items-center justify-center text-xs font-black rounded ${fontSize === 'md' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-gray-400'}`}>A</button>
                <button onClick={() => setFontSize('lg')} aria-label="Large font" className={`w-7 h-7 md:w-8 md:h-7 flex items-center justify-center text-sm font-black rounded ${fontSize === 'lg' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-gray-400'}`}>A+</button>
             </div>

             <div className="flex items-center space-x-2 border-l border-gray-200 dark:border-slate-800 pl-2 md:pl-4">
               <button 
                  onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
                  aria-label="Toggle Theme"
                  className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-500 hover:text-emerald-600 transition-colors"
                >
                  {theme === 'light' ? <i className="fa-solid fa-moon text-xs"></i> : <i className="fa-solid fa-sun text-xs"></i>}
               </button>
               <div className="flex items-center bg-gray-100 dark:bg-slate-800 rounded-lg p-1" role="group" aria-label="Language selection">
                  <button onClick={() => setLanguage('en')} aria-pressed={language === 'en'} className={`px-2 md:px-2.5 py-1 text-[9px] md:text-[10px] font-black rounded ${language === 'en' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-gray-400'}`}>EN</button>
                  <button onClick={() => setLanguage('hi')} aria-pressed={language === 'hi'} className={`px-2 md:px-2.5 py-1 text-[9px] md:text-[10px] font-black rounded ${language === 'hi' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-gray-400'}`}>हिन्दी</button>
               </div>
             </div>
          </div>
        </div>
      </header>

      {/* Marquee Ticker */}
      <div className="bg-emerald-900 text-white overflow-hidden py-2 text-[10px] font-black uppercase tracking-[0.1em] border-y border-emerald-800">
        <div className="animate-marquee whitespace-nowrap inline-block px-8">
          {t.tickerMsg} &nbsp; | &nbsp; {t.tickerMsg}
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-800 to-emerald-950 py-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 text-white animate-in fade-in slide-in-from-left-8 duration-700">
            <span className="inline-block bg-white/10 border border-white/20 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase mb-6">बिहार राज्य सब्जी प्रसंस्करण एवं विपणन योजना</span>
            <h2 className="text-5xl lg:text-8xl font-black mb-8 leading-none tracking-tighter">{t.slogan}</h2>
            <div className="flex space-x-4 mb-10">
               <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-xl border border-white/10">
                  <i className="fa-solid fa-check-circle text-emerald-400"></i>
                  <span className="text-xs font-bold">100% Traceable</span>
               </div>
               <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-xl border border-white/10">
                  <i className="fa-solid fa-leaf text-emerald-400"></i>
                  <span className="text-xs font-bold">Fresh Harvest</span>
               </div>
            </div>
          </div>

          <div className="lg:col-span-5 animate-in fade-in slide-in-from-right-8 duration-700">
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 shadow-2xl border-4 border-emerald-500/10 transition-colors">
              <div className="flex bg-gray-100 dark:bg-slate-800 p-1.5 rounded-2xl mb-8" role="tablist">
                <button onClick={() => setTab('login')} role="tab" aria-selected={tab === 'login'} className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${tab === 'login' ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm' : 'text-gray-400'}`}>{t.signIn}</button>
                <button onClick={() => setTab('register')} role="tab" aria-selected={tab === 'register'} className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${tab === 'register' ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm' : 'text-gray-400'}`}>{t.joinCooperative}</button>
              </div>

              {tab === 'login' ? (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-2 mb-4" role="group" aria-label="Login Role Selection">
                    <button onClick={() => setLoginRole(UserRole.FARMER)} aria-pressed={loginRole === UserRole.FARMER} className={`py-3 text-[10px] font-black uppercase rounded-lg border transition-all ${loginRole === UserRole.FARMER ? 'bg-emerald-600 text-white border-emerald-600' : 'text-gray-400 border-gray-200'}`}>Farmer</button>
                    <button onClick={() => setLoginRole(UserRole.PVCS_USER)} aria-pressed={loginRole !== UserRole.FARMER} className={`py-3 text-[10px] font-black uppercase rounded-lg border transition-all ${loginRole !== UserRole.FARMER ? 'bg-emerald-600 text-white border-emerald-600' : 'text-gray-400 border-gray-200'}`}>Official</button>
                  </div>
                  <div>
                    <label htmlFor="login-id" className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">{t.userId}</label>
                    <input id="login-id" type="text" className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-5 py-4 mt-1 outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white" />
                  </div>
                  <div>
                    <label htmlFor="login-pwd" className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">{t.password}</label>
                    <input id="login-pwd" type="password" className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-5 py-4 mt-1 outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white" />
                  </div>
                  <button onClick={() => onLogin(loginRole)} aria-label="Login" className="w-full bg-emerald-600 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-emerald-700 shadow-xl transition-all">
                    {t.loginButton}
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label htmlFor="reg-dbt" className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">{t.dbtNumber}</label>
                    <input id="reg-dbt" type="text" value={dbtId} onChange={e => setDbtId(e.target.value)} placeholder="e.g. 231XXXXXXXX" className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-5 py-4 mt-1 outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white" />
                  </div>
                  <button onClick={() => setOtpSent(true)} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-emerald-700 shadow-xl">
                    {otpSent ? t.verifyButton : t.startRegistration}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <i className="fa-solid fa-leaf absolute -bottom-20 -right-20 text-[400px] text-white/5 -rotate-12 pointer-events-none"></i>
      </section>

      {/* Brand Values - VEGFED Promise */}
      <section className="py-24 px-6 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl text-left">
              <span className="text-emerald-600 font-black text-xs uppercase tracking-[0.4em] mb-4 block">The Tarkaari Advantage</span>
              <h3 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Pure, Fresh, and Fair</h3>
            </div>
            <p className="text-gray-500 max-w-sm text-sm font-medium leading-relaxed">By connecting farmers directly to your kitchen, we ensure maximum income for growers and minimum cost for you.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {[
               { title: 'Farmer First', icon: 'fa-hands-holding-child', desc: 'Ensuring 70-80% of consumer price reaches the actual grower through our 3-tier system.' },
               { title: 'Quality Graded', icon: 'fa-microscope', desc: 'Every batch undergoes rigorous quality checks using digital grading parameters.' },
               { title: 'Rapid Logistics', icon: 'fa-truck-fast', desc: 'Harvest to retail cycle completed within 12-18 hours for maximum nutrient retention.' }
             ].map((val, i) => (
               <div key={i} className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl mb-8 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    <i className={`fa-solid ${val.icon}`}></i>
                  </div>
                  <h4 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-4">{val.title}</h4>
                  <p className="text-sm text-gray-500 dark:text-slate-400 font-medium leading-relaxed">{val.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Union Reach Map Visualization */}
      <section className="py-24 px-6 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
           <div className="text-center mb-20">
              <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-wider">Our Union Network</h3>
              <p className="text-gray-400 text-sm mt-4 font-bold uppercase tracking-widest">Bridging Rural Bihar to Urban Markets</p>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {unions.map((union, i) => (
                <div key={i} className="group p-8 rounded-[2rem] border-2 border-gray-50 dark:border-slate-800 hover:border-emerald-500 transition-all text-center bg-white dark:bg-slate-900 cursor-default">
                  <div className="w-14 h-14 bg-gray-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 text-xl font-black text-gray-400 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    {union.logo}
                  </div>
                  <h5 className="font-black text-gray-900 dark:text-slate-100 uppercase tracking-tight text-sm">{union.name}</h5>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mt-2">{union.location}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer role="contentinfo" className="bg-slate-950 text-slate-500 pt-24 pb-12 px-6 border-t-[12px] border-emerald-600">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-16">
          <div className="lg:col-span-1 space-y-8">
            <div className="flex items-center space-x-3 text-white">
               <i className="fa-solid fa-leaf text-3xl text-emerald-500"></i>
               <span className="font-black text-2xl uppercase tracking-tighter">TARKAARI</span>
            </div>
            <p className="text-xs font-medium leading-relaxed uppercase tracking-widest">Fresh from the fields of Bihar, delivered with integrity.</p>
            <div className="flex space-x-4">
               {['facebook', 'twitter', 'instagram'].map(s => (
                 <a key={s} href="#" aria-label={`Link to ${s}`} className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center hover:text-emerald-500 transition-colors">
                   <i className={`fa-brands fa-${s}`}></i>
                 </a>
               ))}
            </div>
          </div>
          <div>
            <h5 className="text-white font-black mb-8 uppercase tracking-[0.2em] text-[10px]">Portal Access</h5>
            <ul className="space-y-4 text-[11px] font-bold uppercase tracking-widest">
               <li className="hover:text-emerald-500 cursor-pointer transition-colors">Farmer Registration</li>
               <li className="hover:text-emerald-500 cursor-pointer transition-colors">Official Dashboard</li>
               <li className="hover:text-emerald-500 cursor-pointer transition-colors">Tender Notices</li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-black mb-8 uppercase tracking-[0.2em] text-[10px]">Governance</h5>
            <ul className="space-y-4 text-[11px] font-bold uppercase tracking-widest">
               <li className="hover:text-emerald-500 cursor-pointer transition-colors">Cooperative Dept.</li>
               <li className="hover:text-emerald-500 cursor-pointer transition-colors">RTI Information</li>
               <li className="hover:text-emerald-500 cursor-pointer transition-colors">State Policy</li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-black mb-8 uppercase tracking-[0.2em] text-[10px]">Headquarters</h5>
            <p className="text-xs font-medium leading-relaxed">Vikas Bhawan, New Secretariat Building,<br/>Bailey Road, Patna - 800015</p>
            <p className="text-emerald-500 font-black text-lg mt-6 tracking-tighter">1800-1800-110</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-slate-900 mt-20 pt-12 flex flex-col md:flex-row items-center justify-between gap-4">
           <p className="text-[10px] uppercase font-black tracking-widest text-slate-700">© 2025 VEGFED BIHAR | TARKAARI.IN</p>
           <p className="text-[10px] uppercase font-black tracking-widest text-slate-700">Designed for Bihar Farmers</p>
        </div>
      </footer>
      <style dangerouslySetInnerHTML={{ __html: `@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } } .animate-marquee { display: inline-block; animation: marquee 30s linear infinite; }` }} />
    </div>
  );
};

export default Home;
