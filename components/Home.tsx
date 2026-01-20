
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
  
  // Registration logic
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [dbtId, setDbtId] = useState('');

  // Feedback Hub logic
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
    }, 3000);
    setFeedbackForm({ name: '', mobile: '', category: 'Technical', message: '' });
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
      {/* Top Banner & Header */}
      <header className="bg-white dark:bg-slate-900 border-b dark:border-slate-800 py-3 transition-colors">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl shadow-lg">V</div>
            <div className="text-center md:text-left">
              <h1 className="text-lg md:text-xl font-black text-emerald-800 dark:text-emerald-400 leading-tight uppercase">{t.schemeName}</h1>
              <p className="text-[10px] text-gray-500 dark:text-slate-400 font-bold uppercase tracking-[0.2em] mt-0.5">Government of Bihar | Cooperative Department</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
             <div className="flex items-center bg-gray-100 dark:bg-slate-800 rounded-lg p-1">
                <button onClick={() => setLanguage('en')} className={`px-3 py-1 text-xs font-bold rounded ${language === 'en' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-gray-400'}`}>EN</button>
                <button onClick={() => setLanguage('hi')} className={`px-3 py-1 text-xs font-bold rounded ${language === 'hi' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-gray-400'}`}>हिन्दी</button>
             </div>
             <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-500">
                {theme === 'light' ? <i className="fa-solid fa-moon"></i> : <i className="fa-solid fa-sun"></i>}
             </button>
          </div>
        </div>
      </header>

      {/* News Ticker */}
      <div className="bg-emerald-900 text-white overflow-hidden py-2 text-sm font-medium border-y border-emerald-800">
        <div className="animate-marquee whitespace-nowrap inline-block px-8">
          {t.tickerMsg} &nbsp; | &nbsp; {t.tickerMsg}
        </div>
      </div>

      {/* Hero & Auth Section */}
      <section className="relative bg-gradient-to-br from-emerald-800 to-emerald-900 py-16 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 text-white">
            <span className="inline-block bg-white/10 border border-white/20 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6">बिहार राज्य सब्जी प्रसंस्करण एवं विपणन योजना</span>
            <h2 className="text-5xl lg:text-7xl font-black mb-6 leading-tight">
               {t.slogan}
            </h2>
            <p className="text-emerald-50/70 text-lg mb-8 max-w-xl">
              वेजफेड के माध्यम से बिहार के किसानों को सीधे बाजार से जोड़कर उनकी आय में वृद्धि करना और उपभोक्ताओं को ताजी सब्जियां उपलब्ध कराना।
            </p>
            <div className="flex flex-wrap gap-6">
               <div className="text-center">
                  <p className="text-3xl font-black">30,000+</p>
                  <p className="text-[10px] uppercase font-bold text-emerald-300">Registered Farmers</p>
               </div>
               <div className="text-center">
                  <p className="text-3xl font-black">285</p>
                  <p className="text-[10px] uppercase font-bold text-emerald-300">Cooperative Societies</p>
               </div>
               <div className="text-center">
                  <p className="text-3xl font-black">20</p>
                  <p className="text-[10px] uppercase font-bold text-emerald-300">Active Districts</p>
               </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl transition-colors border-4 border-emerald-500/10">
              <div className="flex bg-gray-100 dark:bg-slate-800 p-1.5 rounded-xl mb-8">
                <button onClick={() => setTab('login')} className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${tab === 'login' ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm' : 'text-gray-400'}`}>{t.signIn}</button>
                <button onClick={() => setTab('register')} className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${tab === 'register' ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm' : 'text-gray-400'}`}>{t.joinCooperative}</button>
              </div>

              {tab === 'login' ? (
                <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4">
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <button onClick={() => setLoginRole(UserRole.FARMER)} className={`py-2.5 text-[10px] font-black uppercase rounded-lg border transition-all ${loginRole === UserRole.FARMER ? 'bg-emerald-600 text-white border-emerald-600' : 'text-gray-400 border-gray-200'}`}>Farmer Login</button>
                    <button onClick={() => setLoginRole(UserRole.PVCS_USER)} className={`py-2.5 text-[10px] font-black uppercase rounded-lg border transition-all ${loginRole !== UserRole.FARMER ? 'bg-emerald-600 text-white border-emerald-600' : 'text-gray-400 border-gray-200'}`}>Official Login</button>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">{t.userId}</label>
                    <input type="text" className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">{t.password}</label>
                    <input type="password" className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white" />
                  </div>
                  <button onClick={() => onLogin(loginRole)} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-200 dark:shadow-none hover:bg-emerald-700 transition-all active:scale-95">
                    {t.loginButton}
                  </button>
                </div>
              ) : (
                <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4">
                   <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">{t.dbtNumber}</label>
                    <input 
                      type="text" 
                      value={dbtId} 
                      onChange={e => setDbtId(e.target.value)} 
                      placeholder="e.g. 231XXXXXXXX" 
                      className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white" 
                    />
                  </div>
                  {otpSent ? (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">OTP (Sent to Mobile)</label>
                      <input 
                        type="text" 
                        value={otpCode} 
                        onChange={e => setOtpCode(e.target.value)} 
                        className="w-full bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 rounded-xl px-4 py-3.5 text-center text-xl font-bold tracking-widest dark:text-white" 
                      />
                    </div>
                  ) : null}
                  <button 
                    onClick={() => setOtpSent(true)}
                    className="w-full bg-emerald-600 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 dark:shadow-none"
                  >
                    {otpSent ? t.verifyButton : t.startRegistration}
                  </button>
                  <p className="text-[10px] text-center text-gray-400 font-bold uppercase tracking-wider">Online OTP Verification is mandatory</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
           <i className="fa-solid fa-leaf text-[30rem] rotate-45 text-white"></i>
        </div>
      </section>

      {/* Support Hub Section - OPTIMIZED CLICK-TO-OPEN */}
      <section id="support" className="py-24 px-6 bg-slate-50 dark:bg-slate-950 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-emerald-600 font-black text-xs uppercase tracking-[0.3em]">{t.supportAndFeedback}</span>
            <h3 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mt-4 mb-6">How can we help?</h3>
            <p className="text-gray-500 dark:text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Select a category to raise a specialized ticket. Our district teams are ready to resolve your issues within 24-48 hours.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
             {[
               { id: 'Technical', icon: 'fa-microchip', color: 'bg-blue-600', label: 'Technical Issue', detail: 'App errors, login issues' },
               { id: 'Pricing', icon: 'fa-indian-rupee-sign', color: 'bg-emerald-600', label: 'Pricing Query', detail: 'Rate mismatches' },
               { id: 'Membership', icon: 'fa-id-card', color: 'bg-amber-600', label: 'Membership', detail: 'ID & Verification status' },
               { id: 'Other', icon: 'fa-headset', color: 'bg-indigo-600', label: 'General Help', detail: 'General feedback & support' }
             ].map((item) => (
               <div 
                key={item.id} 
                onClick={() => openSupportForm(item.id)}
                className="group bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer relative overflow-hidden active:scale-95"
               >
                  <div className={`w-14 h-14 ${item.color} text-white rounded-2xl flex items-center justify-center text-xl mb-6 shadow-xl transition-transform group-hover:rotate-6`}>
                    <i className={`fa-solid ${item.icon}`}></i>
                  </div>
                  <h4 className="font-black text-gray-900 dark:text-white text-xl uppercase tracking-tight">{item.label}</h4>
                  <p className="text-sm text-gray-400 mt-2 font-medium">{item.detail}</p>
                  <div className="mt-8 flex items-center text-emerald-600 font-black text-[10px] uppercase tracking-widest">
                    <span>Open Ticket</span>
                    <i className="fa-solid fa-arrow-right ml-2 group-hover:translate-x-2 transition-transform"></i>
                  </div>
                  <i className={`fa-solid ${item.icon} absolute -bottom-8 -right-8 text-9xl opacity-[0.03] group-hover:opacity-[0.05] transition-opacity`}></i>
               </div>
             ))}
          </div>

          <div className="mt-20 flex flex-col md:flex-row items-center justify-center gap-12 text-center md:text-left border-t border-gray-200 dark:border-slate-800 pt-16">
             <div className="flex items-center space-x-6">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900 rounded-3xl flex items-center justify-center text-2xl text-emerald-600">
                  <i className="fa-solid fa-phone-volume"></i>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Toll Free Helpline</p>
                  <p className="text-2xl font-black text-gray-900 dark:text-white">1800-1800-110</p>
                </div>
             </div>
             <div className="w-px h-12 bg-gray-200 dark:bg-slate-800 hidden md:block"></div>
             <div className="flex items-center space-x-6">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-3xl flex items-center justify-center text-2xl text-blue-600">
                  <i className="fa-solid fa-envelope-open-text"></i>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Feedback</p>
                  <p className="text-2xl font-black text-gray-900 dark:text-white">support.vegfed@bihar.gov.in</p>
                </div>
             </div>
          </div>
        </div>

        {/* Floating Modal Form (The "Opened" state) */}
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-end p-4 md:p-10 pointer-events-none">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm pointer-events-auto animate-in fade-in" onClick={() => setIsFormOpen(false)}></div>
            <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl relative z-10 pointer-events-auto animate-in slide-in-from-right-full duration-500 overflow-hidden flex flex-col">
              <div className="p-10 bg-emerald-600 text-white flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70">Raise Ticket</span>
                  <h4 className="text-3xl font-black uppercase tracking-tight">{feedbackForm.category} Support</h4>
                </div>
                <button onClick={() => setIsFormOpen(false)} className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center text-xl transition-all">
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                {feedbackSent ? (
                  <div className="text-center py-20 animate-in zoom-in">
                    <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-4xl mx-auto mb-8 shadow-inner">
                      <i className="fa-solid fa-cloud-check"></i>
                    </div>
                    <h5 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Ticket Raised!</h5>
                    <p className="text-gray-500 font-medium leading-relaxed">{t.feedbackSuccess}</p>
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-10">Tracking ID: TCK-2026-0042</p>
                  </div>
                ) : (
                  <form onSubmit={handleFeedbackSubmit} className="space-y-8">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                      <input 
                        required
                        type="text" 
                        className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-emerald-500/10 dark:text-white font-bold" 
                        value={feedbackForm.name}
                        onChange={e => setFeedbackForm({...feedbackForm, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Mobile Contact</label>
                      <input 
                        required
                        type="tel" 
                        className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-emerald-500/10 dark:text-white font-bold" 
                        value={feedbackForm.mobile}
                        onChange={e => setFeedbackForm({...feedbackForm, mobile: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Detailed Message</label>
                      <textarea 
                        required
                        rows={5}
                        placeholder="Please describe your issue in detail..."
                        className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-emerald-500/10 dark:text-white font-medium"
                        value={feedbackForm.message}
                        onChange={e => setFeedbackForm({...feedbackForm, message: e.target.value})}
                      ></textarea>
                    </div>
                    <button type="submit" className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-emerald-900/30 hover:bg-emerald-700 transition-all active:scale-95">
                       Submit Ticket
                    </button>
                  </form>
                )}
              </div>
              
              <div className="p-10 border-t dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/20 text-center">
                 <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Bihar State Vegetable Cooperative Federation</p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Leadership Section */}
      <section className="py-20 px-6 bg-white dark:bg-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-widest">Our Leadership</h3>
            <div className="w-20 h-1.5 bg-emerald-600 mx-auto mt-4 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
             {[
               { name: 'Dr. Prem Kumar', title: t.minister, img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200' },
               { name: 'Shri Dharmendra Singh (IAS)', title: t.chairman, img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200' },
               { name: 'Dr. Gagan', title: t.md, img: 'https://images.unsplash.com/photo-1519085184588-4d5def2d5e5b?auto=format&fit=crop&q=80&w=200&h=200' }
             ].map((leader, i) => (
               <div key={i} className="text-center group">
                  <div className="w-48 h-48 mx-auto rounded-[2rem] overflow-hidden border-8 border-gray-50 dark:border-slate-800 mb-6 group-hover:border-emerald-500/20 group-hover:scale-105 transition-all duration-500 shadow-xl">
                     <img src={leader.img} alt={leader.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-xl">{leader.name}</h4>
                  <p className="text-xs text-emerald-600 font-bold uppercase tracking-widest mt-2">{leader.title}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Regional Union Grid */}
      <section className="py-20 px-6 bg-gray-50 dark:bg-slate-950 transition-colors">
        <div className="max-w-7xl mx-auto">
           <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-wider">हमारा संपर्क नेटवर्क (Union Network)</h3>
                <p className="text-gray-500 dark:text-slate-400 mt-2">Connecting 3-tier structure across Bihar districts</p>
              </div>
              <button className="text-emerald-600 font-bold text-sm uppercase tracking-widest border-b-2 border-emerald-600 pb-1">View Full Network Map</button>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
              {unions.map((union, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group cursor-pointer">
                  <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-2xl flex items-center justify-center text-xl mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <i className="fa-solid fa-building-circle-check"></i>
                  </div>
                  <h5 className="font-bold text-gray-900 dark:text-slate-100 leading-tight">{union.name} सब्जी संघ</h5>
                  <p className="text-xs text-gray-400 mt-1">{union.location}, Bihar</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Flagship Schemes Section */}
      <section className="py-20 px-6 bg-white dark:bg-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                 <h3 className="text-4xl font-black text-gray-900 dark:text-white leading-tight">योजनाएँ एवं सक्रिय गतिविधियाँ</h3>
                 <div className="space-y-6">
                    {[
                      { title: 'आधारभूत संरचना योजना', desc: 'Mini-mandi development with ₹1.14 Cr allocation per PVCS.', icon: 'fa-warehouse' },
                      { title: 'तरकारी आउटलेट योजना', desc: 'Modern retail kiosks for quality vegetable distribution.', icon: 'fa-shop' },
                      { title: 'प्याज भण्डारण योजना', desc: 'Specialized warehouse grants for high-shelf-life storage.', icon: 'fa-boxes-stacked' },
                      { title: 'किसान प्रशिक्षण कार्नर', desc: 'Technical skill development for climate-resilient farming.', icon: 'fa-chalkboard-user' }
                    ].map((s, i) => (
                      <div key={i} className="flex space-x-5 p-6 rounded-3xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg transition-all group">
                         <div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center text-2xl group-hover:rotate-6 transition-transform">
                            <i className={`fa-solid ${s.icon}`}></i>
                         </div>
                         <div>
                            <h4 className="font-bold text-gray-900 dark:text-white text-lg">{s.title}</h4>
                            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">{s.desc}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
              <div className="relative">
                 <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl relative border-8 border-white dark:border-slate-800">
                    <img src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover" alt="Bihar Agriculture" />
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 to-transparent flex items-end p-10">
                       <div className="text-white">
                          <p className="text-emerald-400 font-black text-xs uppercase tracking-[0.2em] mb-2">Event Gallery</p>
                          <h4 className="text-2xl font-black">Bihar State Vegetable Expo 2025 Highlights</h4>
                          <button className="mt-4 px-6 py-2 bg-white text-emerald-900 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-emerald-100 transition-all">View All Photos</button>
                       </div>
                    </div>
                 </div>
                 <div className="absolute -bottom-10 -right-10 bg-emerald-600 text-white p-8 rounded-full w-40 h-40 flex flex-col items-center justify-center shadow-2xl rotate-12 group hover:rotate-0 transition-all duration-500">
                    <p className="text-3xl font-black">150+</p>
                    <p className="text-[10px] font-bold uppercase text-center leading-none">Vegetable Varieties</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Detailed Footer */}
      <footer className="bg-slate-900 text-slate-400 pt-20 pb-10 px-6 transition-colors border-t-8 border-emerald-600">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          <div className="space-y-8">
            <div className="flex items-center space-x-3 text-white">
               <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center font-black text-2xl shadow-lg shadow-emerald-600/20">V</div>
               <span className="font-black text-2xl tracking-tighter">VEGFED</span>
            </div>
            <p className="text-sm leading-relaxed font-medium">
              Official ERP Portal for Bihar State Vegetable Processing and Marketing Co-operative Federation Ltd. Patna.
            </p>
            <div className="flex space-x-5">
               <a href="#" className="w-11 h-11 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-600 text-white transition-all"><i className="fa-brands fa-facebook-f"></i></a>
               <a href="#" className="w-11 h-11 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-600 text-white transition-all"><i className="fa-brands fa-twitter"></i></a>
               <a href="#" className="w-11 h-11 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-600 text-white transition-all"><i className="fa-brands fa-instagram"></i></a>
            </div>
          </div>

          <div>
            <h5 className="text-white font-bold mb-8 uppercase tracking-[0.2em] text-sm">Quick Links</h5>
            <ul className="space-y-4 text-sm font-semibold">
               <li><a href="#" className="hover:text-emerald-400 transition-colors flex items-center"><i className="fa-solid fa-chevron-right text-[8px] mr-2 text-emerald-500"></i> Horticulture Bihar</a></li>
               <li><a href="#" className="hover:text-emerald-400 transition-colors flex items-center"><i className="fa-solid fa-chevron-right text-[8px] mr-2 text-emerald-500"></i> Govt. of Bihar Main Portal</a></li>
               <li><a href="#" className="hover:text-emerald-400 transition-colors flex items-center"><i className="fa-solid fa-chevron-right text-[8px] mr-2 text-emerald-500"></i> Agriculture DBT</a></li>
               <li><a href="#" className="hover:text-emerald-400 transition-colors flex items-center"><i className="fa-solid fa-chevron-right text-[8px] mr-2 text-emerald-500"></i> ICAR Research</a></li>
               <li><a href="#" className="hover:text-emerald-400 transition-colors flex items-center"><i className="fa-solid fa-chevron-right text-[8px] mr-2 text-emerald-500"></i> National Horticulture Board</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-bold mb-8 uppercase tracking-[0.2em] text-sm">Contact Info</h5>
            <ul className="space-y-5 text-sm font-medium">
               <li className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center shrink-0 text-emerald-500">
                    <i className="fa-solid fa-location-dot"></i>
                  </div>
                  <span>4th Floor, Vikas Bhawan, New Secretariat, Patna - 800015</span>
               </li>
               <li className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center shrink-0 text-emerald-500">
                    <i className="fa-solid fa-phone"></i>
                  </div>
                  <span>1800-1800-110 (Toll Free)</span>
               </li>
               <li className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center shrink-0 text-emerald-500">
                    <i className="fa-solid fa-envelope"></i>
                  </div>
                  <span>vegfedbihar@gmail.com</span>
               </li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-bold mb-8 uppercase tracking-[0.2em] text-sm">Portal Location</h5>
            <div className="rounded-[2rem] overflow-hidden grayscale hover:grayscale-0 transition-all border border-slate-700 h-48 shadow-2xl">
               <iframe className="w-full h-full" title="Vikas Bhawan Patna" src="https://www.google.com/maps?q=Vikas+Bhawan+Patna&output=embed"></iframe>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-slate-800 mt-20 pt-10 text-center flex flex-col md:flex-row items-center justify-between gap-4">
           <p className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-500">© 2025 VEGFED BIHAR | All Rights Reserved</p>
           <div className="px-6 py-2 bg-slate-800 rounded-full text-[10px] font-black uppercase text-emerald-500 tracking-widest">
              Portal Visitors: 95,034
           </div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 40s linear infinite;
        }
      `}} />
    </div>
  );
};

export default Home;
