
import React, { useState } from 'react';
import { UserRole } from '../types';
import { GoogleGenAI } from "@google/genai";

const AdvisoryModule: React.FC<{ role: UserRole }> = ({ role }) => {
  const [loading, setLoading] = useState(false);
  const [advisory, setAdvisory] = useState<string | null>(null);
  const [crop, setCrop] = useState('Tomato');
  const [season, setSeason] = useState('Winter');
  const [scheduledDate, setScheduledDate] = useState('');
  const [targetChannel, setTargetChannel] = useState<'sms' | 'push' | 'both'>('both');

  const generateAdvisory = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Create a brief professional agricultural advisory for Bihar farmers regarding ${crop} cultivation in the ${season} season. Include tips for pest control, irrigation, and post-harvest management. Keep it concise (under 200 words).`,
        config: {
          systemInstruction: "You are an expert agriculture extension specialist for the Bihar Government's vegetable scheme. Provide practical, science-based advice tailored to local soil and climate conditions."
        }
      });
      setAdvisory(response.text);
    } catch (err) {
      console.error(err);
      setAdvisory("Failed to generate advisory. Please check connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500" role="region" aria-label="Farm Advisory Management">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-slate-100 uppercase tracking-tight">Farm Advisory</h2>
          <p className="text-gray-500 dark:text-slate-400 text-sm font-medium">Expert guidance for high-yield vegetable production</p>
        </div>
        <div className="flex space-x-2 bg-white dark:bg-slate-900 p-1 rounded-2xl border dark:border-slate-800 shadow-sm" role="tablist" aria-label="Advisory View Options">
          <button role="tab" aria-selected="true" className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl transition-all">New Advisory</button>
          <button role="tab" aria-selected="false" className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-gray-400 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all">History</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border dark:border-slate-800 shadow-sm h-fit space-y-8 transition-colors">
          <div>
            <h3 className="font-black mb-6 text-sm uppercase tracking-widest text-gray-400" id="targeting-label">Targeting Criteria</h3>
            <div className="space-y-5" role="group" aria-labelledby="targeting-label">
              <div>
                <label htmlFor="advisory-crop" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Target Crop</label>
                <select 
                  id="advisory-crop"
                  value={crop} 
                  onChange={e => setCrop(e.target.value)} 
                  className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl p-3.5 text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white transition-all"
                >
                  <option>Tomato</option>
                  <option>Potato</option>
                  <option>Onion</option>
                  <option>Cauliflower</option>
                  <option>Peas</option>
                </select>
              </div>
              <div>
                <label htmlFor="advisory-season" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Current Season</label>
                <select 
                  id="advisory-season"
                  value={season} 
                  onChange={e => setSeason(e.target.value)} 
                  className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl p-3.5 text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white transition-all"
                >
                  <option>Winter (Rabi)</option>
                  <option>Summer (Zaid)</option>
                  <option>Monsoon (Kharif)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t dark:border-slate-800">
            <h3 className="font-black mb-6 text-sm uppercase tracking-widest text-gray-400" id="scheduling-label">Scheduling</h3>
            <div className="space-y-5" role="group" aria-labelledby="scheduling-label">
              <div>
                <label id="delivery-chan-label" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Delivery Channel</label>
                <div className="flex p-1 bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl" role="group" aria-labelledby="delivery-chan-label">
                  {['sms', 'push', 'both'].map((ch) => (
                    <button
                      key={ch}
                      aria-pressed={targetChannel === ch}
                      onClick={() => setTargetChannel(ch as any)}
                      className={`flex-1 py-2.5 text-[9px] font-black uppercase rounded-lg transition-all ${targetChannel === ch ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-slate-300'}`}
                    >
                      {ch}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="advisory-date" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Schedule Delivery</label>
                <input 
                  id="advisory-date"
                  type="datetime-local" 
                  className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl p-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white transition-all" 
                />
              </div>
            </div>
          </div>

          <button 
            onClick={generateAdvisory}
            disabled={loading}
            aria-label={loading ? "Generating advisory text" : "Generate agricultural advisory with Gemini AI"}
            className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-emerald-700 disabled:bg-gray-300 dark:disabled:bg-slate-800 disabled:text-gray-500 transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
          >
            {loading ? <i className="fa-solid fa-spinner fa-spin mr-2" aria-hidden="true"></i> : <i className="fa-solid fa-wand-magic-sparkles mr-2" aria-hidden="true"></i>}
            Generate with Gemini
          </button>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] border dark:border-slate-800 shadow-sm min-h-[500px] flex flex-col transition-colors overflow-hidden">
            <div className="p-8 border-b dark:border-slate-800 flex items-center justify-between bg-gray-50/50 dark:bg-slate-800/30">
              <h3 className="font-black text-xl text-gray-900 dark:text-slate-100 uppercase tracking-tight">Draft Workspace</h3>
              {advisory && (
                <div className="flex space-x-3">
                  <button aria-label="Edit draft advisory" className="text-gray-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center hover:text-emerald-600 transition-colors">
                    <i className="fa-solid fa-pen-to-square mr-2" aria-hidden="true"></i> Edit
                  </button>
                  <button aria-label="Broadcast advisory to registered farmers" className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">
                    Broadcast
                  </button>
                </div>
              )}
            </div>
            <div className="p-10 flex-1 flex flex-col" aria-live="polite">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-6">
                  <div className="w-16 h-16 border-4 border-emerald-100 dark:border-slate-800 border-t-emerald-600 rounded-full animate-spin" aria-hidden="true"></div>
                  <p className="font-black text-[10px] uppercase tracking-widest animate-pulse">Crafting expert advice for {crop}...</p>
                </div>
              ) : advisory ? (
                <div className="animate-in fade-in zoom-in-95 duration-500 flex-1 flex flex-col">
                  <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-10 rounded-[2.5rem] border border-emerald-100 dark:border-emerald-800/50 text-gray-800 dark:text-slate-200 leading-relaxed text-lg font-medium italic shadow-inner flex-1">
                    {advisory.split('\n').map((para, i) => (
                      <p key={i} className="mb-4 last:mb-0">{para}</p>
                    ))}
                  </div>
                  <div className="mt-8 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex -space-x-3" aria-hidden="true">
                        {[1,2,3].map(i => (
                          <div key={i} className="w-10 h-10 rounded-xl border-2 border-white dark:border-slate-900 bg-emerald-200 dark:bg-emerald-900 flex items-center justify-center text-[10px] font-black text-emerald-700 dark:text-emerald-300 shadow-sm">F{i}</div>
                        ))}
                      </div>
                      <span className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase">Targeting 4,250+ Farmers</span>
                    </div>
                    <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
                       <i className="fa-solid fa-circle-check" aria-hidden="true"></i>
                       <span className="text-[10px] font-black uppercase tracking-widest">Compliant with State Policy</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-6 text-center">
                  <div className="w-24 h-24 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 border dark:border-slate-700 shadow-inner" aria-hidden="true">
                    <i className="fa-solid fa-bullhorn text-4xl opacity-20"></i>
                  </div>
                  <div>
                    <p className="font-black text-gray-900 dark:text-slate-100 text-xl uppercase tracking-tight">Ready to Broadcast</p>
                    <p className="max-w-xs text-sm text-gray-500 mt-2 font-medium">Select a crop and season to start generating highly targeted agricultural guidance for the cooperative network.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvisoryModule;
