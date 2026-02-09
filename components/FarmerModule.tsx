
import React, { useState } from 'react';
import { UserRole, FarmerRegistration } from '../types';
import { GoogleGenAI } from "@google/genai";

interface FarmerModuleProps {
  role: UserRole;
}

const FarmerModule: React.FC<FarmerModuleProps> = ({ role }) => {
  const [view, setView] = useState<'list' | 'details' | 'self' | 'register'>(role === UserRole.FARMER ? 'self' : 'list');
  const [step, setStep] = useState(1);
  const [isVerifying, setIsVerifying] = useState(false);
  const [geoInsights, setGeoInsights] = useState<{text: string, links: {title: string, uri: string}[]} | null>(null);
  
  const [formData, setFormData] = useState<Partial<FarmerRegistration>>({
    firstName: '', lastName: '', mobile: '', dbtNumber: '', bankName: '', accountNumber: '', crops: [], landArea: 0,
    latitude: undefined, longitude: undefined
  });

  const logoUrl = "https://tarkaari.in/assets/img/logo-veg.png";

  const [farmers] = useState<FarmerRegistration[]>([
    { 
      id: 'APP1001', firstName: 'Ramesh', lastName: 'Mahto', mobile: '9876543210', 
      applicationDate: '2026-01-05', status: 'Approved', dbtNumber: 'DBT123', 
      dob: '1985-05-10', gender: 'Male', aadhaar: '123412341234', 
      bankName: 'SBI', accountNumber: '123', ifsc: 'SBIN001', crops: ['Tomato'], landArea: 2.5,
      latitude: 25.5941, longitude: 85.1376,
      documents: [{ type: 'Aadhaar Card', status: 'Verified' }]
    }
  ]);

  const handleVerifyGeotag = async () => {
    setIsVerifying(true);
    setGeoInsights(null);

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      setIsVerifying(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      
      setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));

      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: `I am at coordinates ${lat}, ${lng} in Bihar. Please verify if this location is suitable for vegetable farming (specifically Tomato, Potato, or Cauliflower). Using Google Maps data, identify any nearby major irrigation canals, water bodies, or government procurement centers. Provide a professional and concise agricultural summary suitable for a farmer.`,
          config: {
            tools: [{ googleMaps: {} }],
            toolConfig: {
              retrievalConfig: {
                latLng: { latitude: lat, longitude: lng }
              }
            }
          }
        });

        const textOutput = response.text || "Location verified. Regional agricultural profile successfully mapped.";
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const links = chunks
          .filter((chunk: any) => chunk.maps)
          .map((chunk: any) => ({
            title: chunk.maps.title,
            uri: chunk.maps.uri
          }));

        setGeoInsights({ text: textOutput, links });
      } catch (error) {
        console.error("AI Geo-tagging error:", error);
        setGeoInsights({ text: "Coordinates captured successfully. Automatic land suitability assessment is currently unavailable; manual verification will be conducted by the Block Agriculture Officer.", links: [] });
      } finally {
        setIsVerifying(false);
      }
    }, (error) => {
      alert("Permission Denied. Please allow location access to geotag your plot. This is mandatory for government subsidy eligibility.");
      setIsVerifying(false);
    }, { enableHighAccuracy: true });
  };

  const renderRegistrationWizard = () => (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500 pb-20">
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-gray-100 dark:border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-12">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex flex-col items-center relative z-10">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all ${
                step === s ? 'bg-emerald-600 text-white shadow-xl scale-110' : 
                step > s ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'
              }`}>
                {step > s ? <i className="fa-solid fa-check"></i> : s}
              </div>
              <span className={`text-[10px] font-black uppercase mt-3 tracking-widest ${step === s ? 'text-emerald-600' : 'text-gray-400'}`}>
                {s === 1 ? 'DBT' : s === 2 ? 'Profile' : s === 3 ? 'Geotag' : 'Success'}
              </span>
            </div>
          ))}
          <div className="absolute top-[4.5rem] left-20 right-20 h-1 bg-gray-50 dark:bg-slate-800 -z-0">
             <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${((step-1)/3)*100}%` }}></div>
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Step 1: DBT Linkage</h3>
              <p className="text-gray-500 text-sm mt-1">Authenticate using Government of Bihar Agriculture DBT records.</p>
            </div>
            <div className="space-y-4">
               <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">DBT Registration ID</label>
               <div className="flex space-x-3">
                 <input 
                   type="text" 
                   value={formData.dbtNumber}
                   onChange={e => setFormData({ ...formData, dbtNumber: e.target.value })}
                   placeholder="e.g. 231XXXXXXXX" 
                   className="flex-1 bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl px-6 py-4 font-black outline-none focus:ring-4 focus:ring-emerald-500/20 dark:text-white"
                 />
                 <button onClick={() => setStep(2)} className="bg-emerald-600 text-white px-8 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-200 dark:shadow-none hover:bg-emerald-700">Validate</button>
               </div>
               <p className="text-xs text-emerald-600 font-bold"><i className="fa-solid fa-circle-info mr-2"></i> System will auto-fetch land records from BR-LRC database.</p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Step 2: Personal & KYC</h3>
              <p className="text-gray-500 text-sm mt-1">Verify your banking and identity details.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Name</label>
                 <input 
                  type="text" 
                  value={`${formData.firstName} ${formData.lastName}`}
                  className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-4 py-3 font-bold dark:text-white" 
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Assigned PVCS</label>
                 <input type="text" readOnly value="Patna Harit Union" className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-4 py-3 font-bold text-gray-400" />
               </div>
               <div className="md:col-span-2 space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Bank A/C Number</label>
                 <input type="text" placeholder="Fetched from DBT" className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-4 py-3 font-bold dark:text-white" />
               </div>
            </div>
            <div className="flex justify-between pt-8">
               <button onClick={() => setStep(1)} className="text-gray-400 font-black text-xs uppercase tracking-widest">Back</button>
               <button onClick={() => setStep(3)} className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-emerald-700">Continue</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-in fade-in duration-300">
             <div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Step 3: Plot Geotagging</h3>
              <p className="text-gray-500 text-sm mt-1">Capture your farm location to unlock AI-driven insights and procurement eligibility.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Crop Selected</label>
                 <select className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-4 py-3 font-bold dark:text-white">
                   <option>Tomato (Hybrid)</option>
                   <option>Potato (Seed)</option>
                   <option>Onion (Red)</option>
                 </select>
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Land Area (Acres)</label>
                 <input 
                  type="number" 
                  value={formData.landArea}
                  onChange={e => setFormData({ ...formData, landArea: Number(e.target.value) })}
                  className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-4 py-3 font-bold dark:text-white" 
                 />
               </div>
            </div>

            <div className="p-8 bg-emerald-50/50 dark:bg-emerald-950/20 border-2 border-dashed border-emerald-300 dark:border-emerald-800 rounded-[2.5rem] shadow-inner relative overflow-hidden">
               <div className="flex items-center justify-between mb-8 relative z-10">
                  <div>
                    <h4 className="text-sm font-black text-emerald-800 dark:text-emerald-400 uppercase tracking-tight">Digital Land Signature</h4>
                    <p className="text-[10px] text-emerald-600 font-bold uppercase mt-1">Gemini AI Maps Grounding Enabled</p>
                  </div>
                  <button 
                    onClick={handleVerifyGeotag}
                    disabled={isVerifying}
                    className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl flex items-center space-x-3 hover:bg-emerald-700 active:scale-95 transition-all"
                  >
                    {isVerifying ? <i className="fa-solid fa-satellite fa-spin"></i> : <i className="fa-solid fa-location-crosshairs"></i>}
                    <span>{isVerifying ? 'Grounding...' : 'Capture Plot GPS'}</span>
                  </button>
               </div>
               
               {formData.latitude && (
                 <div className="grid grid-cols-2 gap-4 mb-6 relative z-10 animate-in fade-in slide-in-from-top-2">
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border dark:border-slate-800 shadow-sm">
                       <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Latitude</p>
                       <p className="text-base font-black text-emerald-600">{formData.latitude.toFixed(6)}° N</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border dark:border-slate-800 shadow-sm">
                       <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Longitude</p>
                       <p className="text-base font-black text-emerald-600">{formData.longitude.toFixed(6)}° E</p>
                    </div>
                 </div>
               )}

               {geoInsights && (
                 <div className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-2xl relative z-10 animate-in zoom-in-95">
                    <div className="flex items-center space-x-3 mb-5 border-b border-white/10 pb-4">
                       <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
                          <i className="fa-solid fa-wand-magic-sparkles"></i>
                       </div>
                       <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">AI Land Assessment</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Verified via Gemini 2.5 Flash</p>
                       </div>
                    </div>
                    <p className="text-sm font-medium italic leading-relaxed text-slate-200">"{geoInsights.text}"</p>
                    {geoInsights.links.length > 0 && (
                      <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-white/5">
                        {geoInsights.links.map((link, idx) => (
                          <a key={idx} href={link.uri} target="_blank" rel="noopener noreferrer" className="bg-white/5 hover:bg-emerald-500/20 border border-white/10 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center">
                             <i className="fa-solid fa-map-pin mr-2 text-emerald-400"></i> {link.title}
                          </a>
                        ))}
                      </div>
                    )}
                 </div>
               )}
               
               <i className="fa-solid fa-mountain-sun absolute -bottom-10 -right-10 text-[200px] text-emerald-500/5 rotate-12 pointer-events-none"></i>
            </div>

            <div className="flex justify-between pt-8">
               <button onClick={() => setStep(2)} className="text-gray-400 font-black text-xs uppercase tracking-widest">Back</button>
               <button onClick={() => setStep(4)} className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-emerald-700">Submit Application</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="text-center py-16 space-y-8 animate-in zoom-in duration-500">
             <div className="w-28 h-28 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-5xl mx-auto shadow-inner relative">
                <i className="fa-solid fa-cloud-check"></i>
                <div className="absolute -bottom-2 -right-2 bg-emerald-600 text-white w-10 h-10 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-900 animate-bounce">
                   <i className="fa-solid fa-check text-xs"></i>
                </div>
             </div>
             <div>
                <h3 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Registration Filed!</h3>
                <p className="text-gray-500 font-medium mt-3">ID: <span className="font-black text-emerald-600">BR-VEG-F-2026-9921</span></p>
             </div>
             <p className="text-sm text-gray-400 max-w-md mx-auto leading-relaxed">Your profile and geotagged plot data is now synced with the VEGFED Bihar state database. You will receive an SMS regarding PVCS approval status shortly.</p>
             <button onClick={() => setView('self')} className="bg-slate-900 text-white px-14 py-4 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:bg-black transition-all">Go to My Portal</button>
          </div>
        )}
        
        <img src={logoUrl} className="absolute -bottom-10 -left-10 w-48 h-48 opacity-10 -rotate-12 pointer-events-none" alt="" />
      </div>
    </div>
  );

  const renderSelfView = () => (
    <div className="space-y-8 max-w-4xl mx-auto pb-20">
      <div className="bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] border border-gray-100 dark:border-slate-800 shadow-sm transition-colors overflow-hidden relative">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-10 mb-12 relative z-10">
          <div className="w-40 h-40 bg-emerald-100 dark:bg-emerald-900 rounded-[3rem] flex items-center justify-center text-5xl font-black text-emerald-700 dark:text-emerald-300 border-8 border-white dark:border-slate-800 shadow-2xl overflow-hidden group">
             <img src={logoUrl} className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform" alt="" />
          </div>
          <div className="text-center md:text-left flex-1 pt-4">
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
              <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 text-[10px] font-black uppercase rounded-lg border border-emerald-100 dark:border-emerald-800/50">Verified Member</span>
              <span className="px-3 py-1 bg-blue-50 dark:bg-blue-950/40 text-blue-600 text-[10px] font-black uppercase rounded-lg border border-blue-100 dark:border-blue-800/50">Tier 1: Farmer</span>
            </div>
            <h2 className="text-5xl font-black text-gray-900 dark:text-white leading-none tracking-tighter mb-4">Ramesh Mahto</h2>
            <div className="flex flex-col md:flex-row md:items-center gap-4 text-gray-400 text-[10px] font-black uppercase tracking-widest">
               <span className="flex items-center"><i className="fa-solid fa-fingerprint mr-2 text-emerald-600"></i> UID: VEGFED-F-10042</span>
               <span className="hidden md:block text-gray-200">|</span>
               <span className="flex items-center"><i className="fa-solid fa-calendar-check mr-2 text-emerald-600"></i> Active Since 2023</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
          <div className="space-y-8 bg-gray-50 dark:bg-slate-800/30 p-8 rounded-[2.5rem] border dark:border-slate-800 shadow-inner">
            <div className="flex items-center justify-between border-b dark:border-slate-700 pb-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-emerald-600 flex items-center">
                 <i className="fa-solid fa-id-card mr-2"></i> Registry Profile
              </h3>
              <button className="text-[9px] font-black text-gray-400 uppercase hover:text-emerald-600 transition-colors">Request Edit</button>
            </div>
            <div className="grid grid-cols-2 gap-y-8 gap-x-4">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">DBT Number</p>
                <p className="font-black text-gray-900 dark:text-slate-100 tracking-tight">DBT12345678</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mobile Number</p>
                <p className="font-black text-gray-900 dark:text-slate-100 tracking-tight">+91 98765 43210</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Aadhaar Vault ID</p>
                <p className="font-black text-gray-900 dark:text-slate-100 tracking-tight">•••• 4321</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Local PVCS</p>
                <p className="font-black text-emerald-600 tracking-tight">Patna (Harit)</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-emerald-600 border-b dark:border-slate-800 pb-2 flex items-center">
               <i className="fa-solid fa-building-columns mr-2"></i> DBT Settlement Hub
            </h3>
             <div className="p-8 bg-emerald-600 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
               <div className="flex items-center justify-between mb-6 relative z-10">
                 <div>
                    <p className="text-[10px] font-black uppercase opacity-60 tracking-widest">Settlement Bank</p>
                    <p className="text-lg font-black tracking-tight">State Bank of India</p>
                 </div>
                 <i className="fa-solid fa-shield-check text-2xl text-emerald-300"></i>
               </div>
               <div className="relative z-10">
                  <p className="text-[10px] font-black uppercase opacity-60 tracking-widest">Account Disbursal</p>
                  <p className="text-xl font-mono mt-1">•••• •••• •••• 1234</p>
               </div>
               <p className="text-[9px] font-black text-emerald-100 mt-8 uppercase tracking-widest relative z-10 flex items-center">
                  <span className="w-2 h-2 bg-emerald-300 rounded-full mr-2 animate-pulse"></span>
                  E-KYC Verified for Direct Payments
               </p>
               <i className="fa-solid fa-indian-rupee-sign absolute -bottom-10 -right-10 text-[180px] text-white/10 -rotate-12 pointer-events-none group-hover:scale-110 transition-transform"></i>
             </div>
          </div>
        </div>
        
        <img src={logoUrl} className="absolute -bottom-10 -left-10 w-[250px] h-[250px] opacity-10 -rotate-12 pointer-events-none" alt="" />
      </div>

      {/* Persistent Geotagging & AI Insights Card */}
      <div className="bg-slate-900 rounded-[3.5rem] p-10 text-white overflow-hidden relative group border border-white/5 shadow-2xl">
         <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
               <div>
                  <h4 className="text-2xl font-black uppercase tracking-tight leading-none mb-2">Geo-Spatial Plot Profile</h4>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Digital Signature & Agricultural Potentials</p>
               </div>
               <button 
                  onClick={handleVerifyGeotag}
                  disabled={isVerifying}
                  className="bg-emerald-600 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-emerald-700 active:scale-95 transition-all flex items-center space-x-3 self-start"
               >
                  {isVerifying ? <i className="fa-solid fa-satellite-dish fa-spin"></i> : <i className="fa-solid fa-location-arrow"></i>}
                  <span>{isVerifying ? 'Grounding Insights...' : 'Recapture Geotag'}</span>
               </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-1 space-y-6">
                  <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-md">
                     <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-4">Location Centroid</p>
                     <div className="space-y-4">
                        <div className="flex justify-between items-center">
                           <span className="text-[9px] font-black uppercase text-slate-400">Lat</span>
                           <span className="text-base font-black text-emerald-400 tracking-tight">25.5941° N</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-[9px] font-black uppercase text-slate-400">Lng</span>
                           <span className="text-base font-black text-emerald-400 tracking-tight">85.1376° E</span>
                        </div>
                     </div>
                     <a href="https://maps.google.com/?q=25.5941,85.1376" target="_blank" rel="noopener" className="mt-6 w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[9px] font-black uppercase tracking-widest text-center block transition-all">View on Satellite Map</a>
                  </div>
               </div>

               <div className="lg:col-span-2">
                  {geoInsights ? (
                     <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl animate-in fade-in slide-in-from-right-4">
                        <div className="flex items-center space-x-4 mb-6">
                           <div className="w-12 h-12 bg-emerald-500 text-white rounded-[1.25rem] flex items-center justify-center shadow-lg shadow-emerald-500/20">
                              <i className="fa-solid fa-wand-magic-sparkles"></i>
                           </div>
                           <div>
                              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Gemini 2.5 Flash Insight</p>
                              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Grounding with Google Maps</p>
                           </div>
                        </div>
                        <p className="text-sm font-medium italic leading-relaxed text-slate-200 mb-8 border-l-4 border-emerald-500/30 pl-6">"{geoInsights.text}"</p>
                        {geoInsights.links.length > 0 && (
                          <div className="flex flex-wrap gap-3">
                             {geoInsights.links.map((link, idx) => (
                                <a key={idx} href={link.uri} target="_blank" rel="noopener noreferrer" className="bg-white/5 hover:bg-emerald-500/20 px-5 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center border border-white/10 group/link">
                                   <i className="fa-solid fa-map-location-dot mr-3 text-emerald-400 group-hover/link:scale-110 transition-transform"></i> {link.title}
                                </a>
                             ))}
                          </div>
                        )}
                     </div>
                  ) : (
                     <div className="h-full bg-white/5 border border-dashed border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center py-12 opacity-40">
                        <i className="fa-solid fa-map-location-dot text-6xl mb-6 text-emerald-500/50"></i>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-center max-w-[250px]">Geotag your plot to unlock AI-driven soil and resource insights</p>
                     </div>
                  )}
               </div>
            </div>
         </div>
         <i className="fa-solid fa-satellite-dish absolute -bottom-10 -right-10 text-[250px] text-white/5 group-hover:text-white/10 transition-all pointer-events-none -rotate-12"></i>
      </div>
      
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border dark:border-slate-800 flex flex-col md:flex-row items-center justify-between shadow-sm gap-6">
         <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-emerald-50 dark:bg-slate-800 rounded-[1.5rem] flex items-center justify-center p-3 text-emerald-600 shadow-inner">
               <img src={logoUrl} className="w-full h-full object-contain" alt="" />
            </div>
            <div>
               <h4 className="font-black text-2xl text-gray-900 dark:text-white uppercase tracking-tight">Identity & Membership</h4>
               <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Download your official Bihar State VEGFED Member Card</p>
            </div>
         </div>
         <button className="w-full md:w-auto px-10 py-4 bg-emerald-600 text-white rounded-[1.25rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-emerald-900/10 hover:bg-emerald-700 active:scale-95 transition-all">
            <i className="fa-solid fa-download mr-2"></i> Download ID
         </button>
      </div>
    </div>
  );

  const renderAdminView = () => (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Farmer Registry Queue</h2>
          <p className="text-gray-400 dark:text-slate-500 text-sm font-medium">Monitoring enrollment at {role === UserRole.PVCS_USER ? 'Block' : 'Federation'} Level</p>
        </div>
        {role === UserRole.PVCS_USER && (
           <button onClick={() => {setView('register'); setStep(1); setGeoInsights(null);}} className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-200 dark:shadow-none hover:bg-emerald-700 transition-all">New Onboarding</button>
        )}
      </div>
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden p-4">
         <table className="w-full text-left">
            <thead>
               <tr className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] border-b dark:border-slate-800">
                  <th className="px-8 py-6">Member Applicant</th>
                  <th className="px-8 py-6">DBT Identity</th>
                  <th className="px-8 py-6">Coordinates</th>
                  <th className="px-8 py-6">Status</th>
                  <th className="px-8 py-6 text-right">Audit</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
               {farmers.map(f => (
                 <tr key={f.id} className="group hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-8 py-8">
                       <p className="font-black text-lg text-gray-900 dark:text-slate-100 tracking-tight">{f.firstName} {f.lastName}</p>
                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{f.mobile}</p>
                    </td>
                    <td className="px-8 py-8">
                       <p className="text-sm font-black text-gray-600 dark:text-slate-400 tracking-tight">{f.dbtNumber}</p>
                    </td>
                    <td className="px-8 py-8">
                       {f.latitude ? (
                         <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-lg">Geotagged</span>
                       ) : (
                         <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Missing</span>
                       )}
                    </td>
                    <td className="px-8 py-8">
                       <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 text-[10px] font-black uppercase rounded-lg border border-emerald-100 dark:border-emerald-800/50">{f.status}</span>
                    </td>
                    <td className="px-8 py-8 text-right">
                       <button className="w-12 h-12 bg-gray-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all">
                          <i className="fa-solid fa-arrow-right-to-bracket"></i>
                       </button>
                    </td>
                 </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );

  return view === 'register' ? renderRegistrationWizard() : (view === 'self' ? renderSelfView() : renderAdminView());
};

export default FarmerModule;
