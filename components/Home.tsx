
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
  const [loginSubView, setLoginSubView] = useState<'form' | 'forgot-identity' | 'forgot-otp' | 'forgot-reset'>('form');
  const [loginRole, setLoginRole] = useState<UserRole>(UserRole.FARMER);
  const t = translations[language];
  
  const [otpSent, setOtpSent] = useState(false);
  const [recoveryMobile, setRecoveryMobile] = useState('');
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

  const logoUrl = "https://tarkaari.in/assets/img/logo-veg.png";
  const iycLogoUrl = "https://esahkari.bihar.gov.in/coop/MIS/img/Iyclogo.png";
  const heroImageUrl = "https://tarkaari.in/Photo/slide_12.jpg";

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackSent(true);
    setTimeout(() => {
      setFeedbackSent(false);
      setIsFormOpen(false);
    }, 2500);
  };

  const handleRecoveryStart = () => {
    setLoginSubView('forgot-otp');
  };

  const handleRecoveryVerify = () => {
    setLoginSubView('forgot-reset');
  };

  const handlePasswordReset = () => {
    alert("Password updated successfully. Please login with your new credentials.");
    setLoginSubView('form');
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

  const newsItems = [
    { date: "12 Jan 2026", title: "Kharif Subsidy Registration Now Open", desc: "Farmers can now register for the upcoming season incentives via the portal." },
    { date: "10 Jan 2026", title: "New PVCS Center Inaugurated in Gaya", desc: "Hon'ble Minister of Cooperatives inaugurated the 15th center in Magadh Union." },
    { date: "08 Jan 2026", title: "Tomato Exports to Nepal Begin", desc: "Tarkaari brand produce from Tirhut Union has successfully crossed borders for retail." },
    { date: "05 Jan 2026", title: "Quality Grading Workshop at Patna Union", desc: "Training for PVCS officials on new digital grading parameters concluded successfully." }
  ];

  const impactStats = [
    { value: "60,000+", label: t.statFarmers, icon: "fa-users" },
    { value: "38", label: t.statDistricts, icon: "fa-map-location-dot" },
    { value: "150+", label: t.statVegetables, icon: "fa-leaf" },
    { value: "534", label: t.statSocieties, icon: "fa-building-columns" }
  ];

  const visionPillars = [
    { title: "Empowerment", icon: "fa-seedling", desc: "Rural communities through shared ownership." },
    { title: "Transparency", icon: "fa-magnifying-glass-chart", desc: "Digitization of PACS and FPOs." },
    { title: "Modernization", icon: "fa-microchip", desc: "Micro-ATMs and Jan Aushadhi Kendras." },
    { title: "Inclusivity", icon: "fa-people-group", desc: "Strengthening grassroots frameworks." }
  ];

  return (
    <div className={`min-h-screen bg-white dark:bg-slate-950 flex flex-col font-size-${fontSize} transition-colors duration-300`}>
      {/* Official Government Bilingual Masthead */}
      <div className="bg-emerald-800 text-white py-2 px-6 text-center border-b border-emerald-900 shadow-sm relative z-[60]">
        <p className="text-[11px] md:text-xs font-black uppercase tracking-tight leading-tight mb-0.5">बिहार राज्य सब्ज़ी प्रसंस्करण एवं विपणन सहकारी फेडरेशन लि. पटना</p>
        <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest opacity-80">Bihar State Vegetable Processing and Marketing Co-operative Federation Ltd. Patna</p>
      </div>

      {/* Public Header */}
      <header role="banner" className="bg-white dark:bg-slate-900 border-b dark:border-slate-800 py-3 sticky top-0 z-50 transition-colors shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3 md:space-x-4 shrink-0">
            <div className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center p-1 bg-white dark:bg-slate-800 rounded-full shadow-sm" aria-hidden="true">
              <img src={logoUrl} alt="Tarkaari Logo" className="w-full h-full object-contain" />
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

             {/* Right Corner Logo - Bihar Cooperative / IYCL */}
             <div className="hidden md:flex items-center pl-4 border-l border-gray-200 dark:border-slate-800">
                <img src={iycLogoUrl} alt="Bihar Cooperative Logo" className="h-10 md:h-12 w-auto object-contain" />
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
      <section className="relative py-20 px-6 overflow-hidden min-h-[600px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img src={heroImageUrl} className="w-full h-full object-cover" alt="Bihar Fresh Vegetables" />
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/95 via-emerald-900/80 to-emerald-950/95"></div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 text-white animate-in fade-in slide-in-from-left-8 duration-700">
            <span className="inline-flex items-center space-x-3 bg-emerald-600/30 backdrop-blur-md border border-emerald-400/30 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase mb-6 shadow-xl">
               <img src={logoUrl} className="w-4 h-4 object-contain" alt="" />
               <span className="text-emerald-100">बिहार राज्य सब्जी प्रसंस्करण एवं विपणन योजना</span>
            </span>
            <h2 className="text-5xl lg:text-8xl font-black mb-8 leading-none tracking-tighter drop-shadow-2xl">{t.slogan}</h2>
            <div className="flex space-x-4 mb-10">
               <div className="flex items-center space-x-2 bg-emerald-900/40 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10 shadow-lg">
                  <i className="fa-solid fa-check-circle text-emerald-400"></i>
                  <span className="text-xs font-bold text-white">100% Traceable</span>
               </div>
               <div className="flex items-center space-x-2 bg-emerald-900/40 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10 shadow-lg">
                  <i className="fa-solid fa-leaf text-emerald-400"></i>
                  <span className="text-xs font-bold text-white">Fresh Harvest</span>
               </div>
            </div>
          </div>

          <div className="lg:col-span-5 animate-in fade-in slide-in-from-right-8 duration-700">
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-[3rem] p-10 shadow-2xl border-4 border-emerald-500/20 transition-colors">
              <div className="flex bg-gray-100 dark:bg-slate-800 p-1.5 rounded-2xl mb-8" role="tablist">
                <button onClick={() => {setTab('login'); setLoginSubView('form');}} role="tab" aria-selected={tab === 'login'} className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${tab === 'login' ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm' : 'text-gray-400'}`}>{t.signIn}</button>
                <button onClick={() => setTab('register')} role="tab" aria-selected={tab === 'register'} className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${tab === 'register' ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm' : 'text-gray-400'}`}>{t.joinCooperative}</button>
              </div>

              {tab === 'login' ? (
                <div className="animate-in fade-in duration-300">
                  {loginSubView === 'form' ? (
                    <div className="space-y-5">
                      <div className="grid grid-cols-2 gap-2 mb-4" role="group" aria-label="Login Role Selection">
                        <button onClick={() => setLoginRole(UserRole.FARMER)} aria-pressed={loginRole === UserRole.FARMER} className={`py-3 text-[10px] font-black uppercase rounded-lg border transition-all ${loginRole === UserRole.FARMER ? 'bg-emerald-600 text-white border-emerald-600' : 'text-gray-400 border-gray-200'}`}>Farmer</button>
                        <button onClick={() => setLoginRole(UserRole.PVCS_USER)} aria-pressed={loginRole !== UserRole.FARMER} className={`py-3 text-[10px] font-black uppercase rounded-lg border transition-all ${loginRole !== UserRole.FARMER ? 'bg-emerald-600 text-white border-emerald-600' : 'text-gray-400 border-gray-200'}`}>Official</button>
                      </div>
                      <div>
                        <label htmlFor="login-id" className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">{t.userId}</label>
                        <input id="login-id" type="text" className="w-full bg-gray-50/50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-5 py-4 mt-1 outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center ml-1">
                          <label htmlFor="login-pwd" className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.password}</label>
                          <button onClick={() => setLoginSubView('forgot-identity')} className="text-[10px] font-black text-emerald-600 uppercase hover:underline">Forgot Password?</button>
                        </div>
                        <input id="login-pwd" type="password" className="w-full bg-gray-50/50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-5 py-4 mt-1 outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white" />
                      </div>
                      <button onClick={() => onLogin(loginRole)} aria-label="Login" className="w-full bg-emerald-600 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-emerald-700 shadow-xl transition-all">
                        {t.loginButton}
                      </button>
                    </div>
                  ) : loginSubView === 'forgot-identity' ? (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                       <div className="text-center">
                          <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">
                             <i className="fa-solid fa-shield-halved"></i>
                          </div>
                          <h4 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Recover Account</h4>
                          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Enter your registered mobile number for OTP verification.</p>
                       </div>
                       <div>
                          <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">Registered Mobile</label>
                          <input 
                            type="tel" 
                            value={recoveryMobile}
                            onChange={e => setRecoveryMobile(e.target.value)}
                            placeholder="+91 XXXXX XXXXX"
                            className="w-full bg-gray-50/50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-5 py-4 mt-1 outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white font-bold" 
                          />
                       </div>
                       <div className="flex flex-col gap-3">
                          <button onClick={handleRecoveryStart} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-emerald-700 transition-all">Send OTP</button>
                          <button onClick={() => setLoginSubView('form')} className="text-[10px] font-black text-gray-400 uppercase hover:text-gray-600">Back to Login</button>
                       </div>
                    </div>
                  ) : loginSubView === 'forgot-otp' ? (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                       <div className="text-center">
                          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">
                             <i className="fa-solid fa-envelope-open-text"></i>
                          </div>
                          <h4 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Verify Identity</h4>
                          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">6-digit code sent to {recoveryMobile || 'your mobile'}.</p>
                       </div>
                       <div className="flex justify-center gap-2">
                          {[1,2,3,4,5,6].map(i => (
                            <input key={i} type="text" maxLength={1} className="w-10 h-12 bg-gray-50 dark:bg-slate-800 border-2 dark:border-slate-700 rounded-lg text-center font-black text-emerald-600 focus:border-emerald-500 outline-none" />
                          ))}
                       </div>
                       <div className="flex flex-col gap-3">
                          <button onClick={handleRecoveryVerify} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-emerald-700 transition-all">Verify OTP</button>
                          <button className="text-[10px] font-black text-blue-600 uppercase hover:underline">Resend Code (45s)</button>
                       </div>
                    </div>
                  ) : (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                       <div className="text-center">
                          <div className="w-16 h-16 bg-amber-50 dark:bg-amber-950 text-amber-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">
                             <i className="fa-solid fa-key"></i>
                          </div>
                          <h4 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Set New Password</h4>
                          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Minimum 6 characters required.</p>
                       </div>
                       <div className="space-y-4">
                          <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">New Password</label>
                            <input type="password" placeholder="••••••••" className="w-full bg-gray-50/50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-5 py-4 mt-1 outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white" />
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">Confirm Password</label>
                            <input type="password" placeholder="••••••••" className="w-full bg-gray-50/50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-5 py-4 mt-1 outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white" />
                          </div>
                       </div>
                       <button onClick={handlePasswordReset} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-emerald-700 transition-all">Update & Finish</button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div>
                    <label htmlFor="reg-dbt" className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">{t.dbtNumber}</label>
                    <input id="reg-dbt" type="text" value={dbtId} onChange={e => setDbtId(e.target.value)} placeholder="e.g. 231XXXXXXXX" className="w-full bg-gray-50/50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-5 py-4 mt-1 outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white" />
                  </div>
                  <button onClick={() => setOtpSent(true)} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-emerald-700 shadow-xl">
                    {otpSent ? t.verifyButton : t.startRegistration}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* परिचय-बिहार तरकारी योजना (Introduction Section) */}
      <section className="py-24 px-6 bg-white dark:bg-slate-900 overflow-hidden relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
           <div className="relative">
              <div className="aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-gray-50 dark:border-slate-800">
                 <img src="https://tarkaari.in/Photo/slide_12.jpg" className="w-full h-full object-cover" alt="Bihar Cooperative Vision" />
              </div>
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-emerald-600 rounded-[3rem] p-8 text-white shadow-2xl animate-bounce-slow flex flex-col justify-center text-center">
                 <p className="text-4xl font-black">20+</p>
                 <p className="text-[10px] font-bold uppercase tracking-widest mt-2">Years of Legacy</p>
              </div>
           </div>
           <div className="space-y-8">
              <span className="text-emerald-600 font-black text-xs uppercase tracking-[0.4em] block">{language === 'hi' ? 'संक्षिप्त विवरण' : 'Overview'}</span>
              <h3 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white uppercase tracking-tight leading-none">{t.introTitle}</h3>
              <p className="text-gray-600 dark:text-slate-400 text-lg leading-relaxed font-medium">
                बिहार राज्य सब्जी प्रसंस्करण एवं विपणन सहकारी फेडरेशन लिमिटेड (VEGFED) राज्य के सब्जी उत्पादकों के लिए एक सुव्यवस्थित 3-स्तरीय सहकारी ढांचा प्रदान करता है। हमारा मुख्य उद्देश्य बिचौलियों को समाप्त करना, किसानों को उनके उत्पादन का उचित मूल्य दिलाना और उपभोक्ताओं को 'तरकारी' ब्रांड के तहत ताजी और गुणवत्तापूर्ण सब्जियां उपलब्ध कराना है।
              </p>
              <div className="grid grid-cols-2 gap-6 pt-4">
                 <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center shrink-0">
                       <i className="fa-solid fa-users-gear"></i>
                    </div>
                    <div>
                       <h5 className="font-black text-gray-900 dark:text-white uppercase text-xs">सहकारी ढांचा</h5>
                       <p className="text-[10px] text-gray-500 mt-1">3-स्तरीय सुदृढ़ प्रबंधन प्रणाली</p>
                    </div>
                 </div>
                 <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center shrink-0">
                       <i className="fa-solid fa-indian-rupee-sign"></i>
                    </div>
                    <div>
                       <h5 className="font-black text-gray-900 dark:text-white uppercase text-xs">उचित मूल्य</h5>
                       <p className="text-[10px] text-gray-500 mt-1">पारदर्शी डिजिटल भुगतान प्रणाली</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* DEPARTMENT VISION SECTION */}
      <section className="py-32 px-6 bg-gray-50 dark:bg-slate-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-20">
             <span className="text-emerald-600 font-black text-xs uppercase tracking-[0.4em] block mb-6">{t.visionTitle}</span>
             <h3 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-8 italic">"{t.visionMotto}"</h3>
             <div className="w-24 h-1.5 bg-emerald-500 mx-auto rounded-full mb-12"></div>
             <p className="text-gray-700 dark:text-slate-300 text-xl md:text-2xl leading-relaxed font-bold italic opacity-90">
                {t.visionStatement}
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
             {visionPillars.map((p, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border-2 border-transparent hover:border-emerald-500 transition-all shadow-xl hover:shadow-2xl group text-center">
                   <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-inner">
                      <i className={`fa-solid ${p.icon}`}></i>
                   </div>
                   <h4 className="text-lg font-black text-gray-900 dark:text-white uppercase mb-2">{p.title}</h4>
                   <p className="text-xs text-gray-500 dark:text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                      {p.desc}
                   </p>
                </div>
             ))}
          </div>
        </div>
        
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      </section>

      {/* Brand Values */}
      <section className="py-24 px-6 bg-white dark:bg-slate-900">
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
               <div key={i} className="bg-white dark:bg-slate-950 p-10 rounded-[2.5rem] border dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group">
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
      <section className="py-24 px-6 bg-gray-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto">
           <div className="text-center mb-20">
              <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-wider">Our Union Network</h3>
              <p className="text-gray-400 text-sm mt-4 font-bold uppercase tracking-widest">Bridging Rural Bihar to Urban Markets</p>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {unions.map((union, i) => (
                <div key={i} className="group p-8 rounded-[2rem] border-2 border-transparent bg-white dark:bg-slate-900 hover:border-emerald-500 transition-all text-center cursor-default shadow-sm hover:shadow-xl">
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

      {/* समाचार और घोषणाएँ (News & Announcements) */}
      <section className="py-24 px-6 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
           <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
              <div className="text-left">
                <span className="text-emerald-600 font-black text-xs uppercase tracking-[0.4em] mb-4 block">{language === 'hi' ? 'ताजा अपडेट' : 'Latest Updates'}</span>
                <h3 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white uppercase tracking-tight leading-none">{t.newsTitle}</h3>
              </div>
              <button className="px-8 py-3 border-2 border-emerald-600 text-emerald-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all">View All News</button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {newsItems.map((news, i) => (
                <div key={i} className="bg-white dark:bg-slate-950 p-8 rounded-[2rem] border dark:border-slate-800 shadow-sm hover:shadow-xl transition-all flex flex-col group">
                   <div className="flex items-center justify-between mb-6">
                      <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded uppercase tracking-widest">{news.date}</span>
                      <i className="fa-solid fa-bullhorn text-gray-200 group-hover:text-emerald-500 transition-colors"></i>
                   </div>
                   <h4 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight mb-4 leading-tight">{news.title}</h4>
                   <p className="text-sm text-gray-500 dark:text-slate-400 font-medium leading-relaxed mb-6 flex-1">{news.desc}</p>
                   <a href="#" className="text-[10px] font-black uppercase text-emerald-600 tracking-widest flex items-center hover:translate-x-1 transition-transform">
                     Read More <i className="fa-solid fa-arrow-right ml-2"></i>
                   </a>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Impact Numbers Section */}
      <section className="py-20 px-6 bg-emerald-950 text-white overflow-hidden relative border-t-4 border-emerald-400">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-16">
          {impactStats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center text-center group">
               <div className="w-16 h-16 bg-emerald-800/50 rounded-2xl flex items-center justify-center text-2xl text-emerald-400 mb-6 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-xl">
                  <i className={`fa-solid ${stat.icon}`}></i>
               </div>
               <p className="text-4xl lg:text-5xl font-black mb-2 tracking-tighter drop-shadow-md">{stat.value}</p>
               <p className="text-[10px] lg:text-xs font-black uppercase tracking-[0.2em] text-emerald-400/80">{stat.label}</p>
            </div>
          ))}
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400/5 rounded-full -ml-32 -mb-32 blur-3xl"></div>
      </section>

      {/* Footer */}
      <footer role="contentinfo" className="bg-slate-950 text-slate-500 pt-24 pb-12 px-6 border-t-[12px] border-emerald-600">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-16">
          <div className="lg:col-span-1 space-y-8">
            <div className="flex items-center space-x-3 text-white">
               <img src={logoUrl} className="w-14 h-14 object-contain" alt="Tarkaari Official Logo" />
               <span className="font-black text-3xl uppercase tracking-tighter">TARKAARI</span>
            </div>
            <p className="text-xs font-medium leading-relaxed uppercase tracking-widest">Fresh from the fields of Bihar, delivered with integrity.</p>
            <div className="flex space-x-4">
               {['facebook', 'twitter', 'instagram'].map(s => (
                 <a key={s} href="#" aria-label={`Link to ${s}`} className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center hover:text-emerald-500 transition-colors">
                   <i className={`fa-solid fa-envelope text-xs`}></i>
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
           <div className="flex items-center space-x-4 opacity-50 grayscale hover:grayscale-0 transition-all">
              <img src={logoUrl} className="w-8 h-8 object-contain" alt="" />
              <p className="text-[10px] uppercase font-black tracking-widest text-slate-700">© 2025 VEGFED BIHAR | TARKAARI.IN</p>
           </div>
           <p className="text-[10px] uppercase font-black tracking-widest text-slate-700">Designed for Bihar Farmers</p>
        </div>
      </footer>
      <style dangerouslySetInnerHTML={{ __html: `@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } } .animate-marquee { display: inline-block; animation: marquee 30s linear infinite; } @keyframes bounce-slow { 0%, 100% { transform: translateY(-5%); } 50% { transform: translateY(0); } } .animate-bounce-slow { animation: bounce-slow 4s ease-in-out infinite; }` }} />
    </div>
  );
};

export default Home;
