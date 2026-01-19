
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
    <div className="animate-in fade-in duration-500">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Farm Advisory & Communication</h2>
          <p className="text-gray-500 text-sm">Expert guidance for high-yield vegetable production</p>
        </div>
        <div className="flex space-x-2 bg-white p-1 rounded-xl border shadow-sm">
          <button className="px-4 py-2 text-xs font-bold text-emerald-600 bg-emerald-50 rounded-lg">New Advisory</button>
          <button className="px-4 py-2 text-xs font-bold text-gray-400 rounded-lg hover:bg-gray-50">Sent History</button>
          <button className="px-4 py-2 text-xs font-bold text-gray-400 rounded-lg hover:bg-gray-50">Weather Alerts</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-2xl border shadow-sm h-fit space-y-6">
          <div>
            <h3 className="font-bold mb-4 text-lg">Targeting Criteria</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">Target Crop</label>
                <select value={crop} onChange={e => setCrop(e.target.value)} className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none">
                  <option>Tomato</option>
                  <option>Potato</option>
                  <option>Onion</option>
                  <option>Cauliflower</option>
                  <option>Peas</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">Current Season</label>
                <select value={season} onChange={e => setSeason(e.target.value)} className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none">
                  <option>Winter (Rabi)</option>
                  <option>Summer (Zaid)</option>
                  <option>Monsoon (Kharif)</option>
                </select>
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          <div>
            <h3 className="font-bold mb-4 text-lg">Scheduling & Delivery</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">Delivery Channel</label>
                <div className="flex p-1 bg-gray-100 rounded-xl">
                  {['sms', 'push', 'both'].map((ch) => (
                    <button
                      key={ch}
                      onClick={() => setTargetChannel(ch as any)}
                      className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${targetChannel === ch ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500'}`}
                    >
                      {ch}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">Schedule Delivery</label>
                <input type="datetime-local" className="w-full border rounded-xl p-3 text-sm outline-none" />
              </div>
            </div>
          </div>

          <button 
            onClick={generateAdvisory}
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-emerald-700 disabled:bg-gray-300 transition-all shadow-xl shadow-emerald-200"
          >
            {loading ? <i className="fa-solid fa-spinner fa-spin mr-2"></i> : <i className="fa-solid fa-wand-magic-sparkles mr-2"></i>}
            Generate with Gemini
          </button>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border shadow-sm min-h-[500px] flex flex-col">
            <div className="p-6 border-b flex items-center justify-between bg-gray-50/50">
              <h3 className="font-bold text-lg">Draft Advisory</h3>
              {advisory && (
                <div className="flex space-x-3">
                  <button className="text-gray-500 text-sm font-bold flex items-center hover:text-gray-900">
                    <i className="fa-solid fa-pen-to-square mr-2"></i> Edit
                  </button>
                  <button className="bg-emerald-600 text-white px-6 py-2 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-emerald-700 shadow-lg shadow-emerald-100">
                    Send Now
                  </button>
                </div>
              )}
            </div>
            <div className="p-8 flex-1">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
                  <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
                  <p className="font-medium animate-pulse">Crafting expert advice for {crop}...</p>
                </div>
              ) : advisory ? (
                <div className="animate-in fade-in zoom-in-95">
                  <div className="bg-emerald-50 p-8 rounded-3xl border border-emerald-100 text-gray-800 leading-relaxed text-lg italic shadow-inner">
                    {advisory.split('\n').map((para, i) => (
                      <p key={i} className="mb-4 last:mb-0">{para}</p>
                    ))}
                  </div>
                  <div className="mt-6 flex items-center space-x-4">
                    <div className="flex -space-x-2">
                      {[1,2,3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-emerald-200 flex items-center justify-center text-[10px] font-bold text-emerald-700">F{i}</div>
                      ))}
                    </div>
                    <span className="text-xs font-bold text-gray-400 tracking-wider uppercase">Targeting 4,250+ Farmers</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-2 text-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <i className="fa-solid fa-bullhorn text-4xl opacity-20"></i>
                  </div>
                  <p className="font-bold text-gray-900">Ready to Broadcast</p>
                  <p className="max-w-xs text-sm">Select a crop and season to start generating highly targeted agricultural guidance for the cooperative network.</p>
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
