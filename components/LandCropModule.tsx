
import React, { useState } from 'react';
import { UserRole, LandPlot } from '../types';

const LandCropModule: React.FC<{ role: UserRole }> = ({ role }) => {
  const [plots, setPlots] = useState<LandPlot[]>([
    { id: 'PL001', farmerId: 'FAR001', khataNumber: '102', khesraNumber: '455', areaAcres: 1.2, coordinates: { lat: 25.5941, lng: 85.1376 }, currentCrop: 'Tomato', soilType: 'Loamy', irrigationSource: 'Borewell' },
    { id: 'PL002', farmerId: 'FAR001', khataNumber: '102', khesraNumber: '456', areaAcres: 0.8, coordinates: { lat: 25.5945, lng: 85.1380 }, currentCrop: 'Potato', soilType: 'Alluvial', irrigationSource: 'Canal' },
  ]);

  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-slate-100 uppercase tracking-tight">Geo-Spatial Registry</h2>
          <p className="text-gray-500 dark:text-slate-400 text-sm font-medium">Land tagging and cultivation lifecycle tracking (FR-03)</p>
        </div>
        {!showAdd && (
          <button 
            onClick={() => setShowAdd(true)}
            className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 hover:bg-emerald-700 active:scale-95 transition-all flex items-center space-x-3"
          >
            <i className="fa-solid fa-location-dot"></i>
            <span>Register New Plot</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Map View Simulation */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-200 dark:bg-slate-800 rounded-[3rem] h-[450px] relative overflow-hidden shadow-inner border dark:border-slate-800">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1000')] bg-cover opacity-60 mix-blend-overlay"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-6 rounded-3xl shadow-2xl border border-white/20 flex items-center space-x-5 transition-colors">
                <i className="fa-solid fa-crosshairs text-emerald-600 text-2xl animate-pulse"></i>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">GPS Tracker Active</p>
                  <p className="text-sm font-black text-gray-900 dark:text-white">25.5941° N, 85.1376° E</p>
                </div>
              </div>
            </div>
            
            {/* Simulated Plot Overlays */}
            {plots.map((plot, i) => (
              <div 
                key={plot.id}
                className="absolute w-28 h-20 border-2 border-emerald-500/50 bg-emerald-500/10 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-emerald-500/30 transition-all rounded-xl"
                style={{ top: 150 + (i * 60), left: 200 + (i * 80) }}
              >
                <div className="text-center">
                   <p className="text-[9px] font-black text-emerald-900 dark:text-emerald-400 uppercase tracking-widest">PLOT {plot.id}</p>
                   <p className="text-[8px] font-bold text-emerald-600 dark:text-emerald-500">{plot.areaAcres} Ac</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
            <div className="p-8 border-b dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/30">
              <h3 className="font-black text-gray-900 dark:text-slate-100 uppercase tracking-tight">Cultivation History</h3>
              <div className="flex space-x-2 bg-white dark:bg-slate-900 p-1 rounded-xl border dark:border-slate-800 shadow-sm">
                <button className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-4 py-1.5 rounded-lg transition-all">2025-26</button>
                <button className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-4 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-all">2024-25</button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-slate-800/50 text-gray-400 uppercase text-[9px] font-black tracking-widest border-b dark:border-slate-800">
                  <tr>
                    <th className="px-8 py-5">Plot ID</th>
                    <th className="px-8 py-5">Sowing Date</th>
                    <th className="px-8 py-5">Crop Type</th>
                    <th className="px-8 py-5">Yield (Est.)</th>
                    <th className="px-8 py-5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-slate-800">
                  <tr className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-8 py-6 font-black text-gray-900 dark:text-slate-200 text-sm">PL001</td>
                    <td className="px-8 py-6 text-sm text-gray-500 dark:text-slate-400 font-medium">12 Oct 2025</td>
                    <td className="px-8 py-6 text-sm font-bold text-emerald-600 dark:text-emerald-400">Tomato (A)</td>
                    <td className="px-8 py-6 text-sm font-black text-gray-900 dark:text-slate-100">2.5 Tons</td>
                    <td className="px-8 py-6"><span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase rounded-lg">Vegetative</span></td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-8 py-6 font-black text-gray-900 dark:text-slate-200 text-sm">PL002</td>
                    <td className="px-8 py-6 text-sm text-gray-500 dark:text-slate-400 font-medium">20 Nov 2025</td>
                    <td className="px-8 py-6 text-sm font-bold text-blue-600 dark:text-blue-400">Potato</td>
                    <td className="px-8 py-6 text-sm font-black text-gray-900 dark:text-slate-100">4.0 Tons</td>
                    <td className="px-8 py-6"><span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[9px] font-black uppercase rounded-lg">Sown</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar / Form */}
        <div className="space-y-8">
          {showAdd ? (
            <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border dark:border-slate-800 shadow-2xl animate-in slide-in-from-right-8 duration-500 transition-colors">
              <h3 className="font-black text-2xl text-gray-900 dark:text-white uppercase tracking-tight mb-8">Plot Registration</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Survey Details</label>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="Khata No." className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white transition-all" />
                    <input type="text" placeholder="Khesra No." className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Cultivation Area (Acres)</label>
                  <input type="number" step="0.01" placeholder="e.g. 1.25" className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white transition-all" />
                </div>
                <div className="p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-[1.5rem] border border-emerald-100 dark:border-emerald-800/50 flex flex-col items-center text-center space-y-3 cursor-pointer group hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-all">
                  <i className="fa-solid fa-camera text-3xl text-emerald-600 group-hover:scale-110 transition-transform"></i>
                  <p className="text-[10px] font-black text-emerald-800 dark:text-emerald-400 uppercase tracking-[0.2em]">Upload Land Receipt / LPC</p>
                </div>
                <button 
                  onClick={() => setShowAdd(false)}
                  className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 hover:bg-emerald-700 active:scale-95 transition-all"
                >
                  Verify Geo-Tagging
                </button>
                <button onClick={() => setShowAdd(false)} className="w-full text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 dark:hover:text-slate-500 transition-colors">Discard Draft</button>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border dark:border-slate-800 shadow-sm space-y-8 transition-colors">
              <h4 className="font-black text-gray-900 dark:text-slate-100 uppercase tracking-widest text-sm border-b dark:border-slate-800 pb-4">Active Assets</h4>
              <div className="space-y-5">
                {plots.map(p => (
                  <div key={p.id} className="p-6 bg-gray-50 dark:bg-slate-800/50 rounded-[1.5rem] border dark:border-slate-800 group hover:border-emerald-500/50 transition-all">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-black text-gray-900 dark:text-slate-200 uppercase tracking-tight">Plot {p.id}</p>
                        <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest mt-1">{p.soilType} Soil Profile</p>
                      </div>
                      <span className="text-xs font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-lg">{p.areaAcres} Ac</span>
                    </div>
                    <div className="mt-6 flex items-center justify-between">
                       <div className="flex items-center space-x-3 text-[10px] font-black text-gray-500 dark:text-slate-400 uppercase tracking-widest">
                         <i className="fa-solid fa-droplet text-blue-400"></i>
                         <span>{p.irrigationSource}</span>
                       </div>
                       <i className="fa-solid fa-arrow-right text-gray-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all"></i>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-8 rounded-[2rem] bg-slate-900 dark:bg-emerald-900 text-white shadow-xl shadow-slate-900/20">
                <p className="text-[10px] font-black uppercase text-slate-400 dark:text-emerald-300 tracking-[0.2em] mb-2">Aggregate Managed Area</p>
                <p className="text-4xl font-black">2.00 <span className="text-sm text-slate-500 dark:text-emerald-400 uppercase">Acres</span></p>
              </div>
            </div>
          )}
          
          <div className="bg-emerald-900 p-10 rounded-[3rem] shadow-2xl text-white relative overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98]">
            <h4 className="font-black text-2xl text-emerald-400 uppercase tracking-tight mb-4 leading-none">Crop Calendar</h4>
            <p className="text-xs text-emerald-100/70 font-medium leading-relaxed mb-8">View recommended sowing and harvesting timelines based on your regional soil metadata and climate alerts.</p>
            <button className="w-full text-[10px] font-black bg-white/10 hover:bg-white/20 transition-all border border-white/20 px-6 py-4 rounded-xl uppercase tracking-[0.2em]">Open Digital Calendar</button>
            <i className="fa-solid fa-calendar-days absolute -bottom-10 -right-10 text-[180px] text-white/5 pointer-events-none -rotate-12"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandCropModule;
