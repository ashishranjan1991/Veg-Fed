
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Land & Crop Management</h2>
          <p className="text-gray-500 text-sm">Geo-tagging and cultivation lifecycle tracking</p>
        </div>
        {!showAdd && (
          <button 
            onClick={() => setShowAdd(true)}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg hover:bg-emerald-700 flex items-center space-x-2"
          >
            <i className="fa-solid fa-location-dot"></i>
            <span>Register New Plot</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Map View Simulation */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-200 rounded-2xl h-[400px] relative overflow-hidden shadow-inner border border-gray-300">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1000')] bg-cover opacity-60"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/90 backdrop-blur p-4 rounded-xl shadow-2xl border border-white flex items-center space-x-4">
                <i className="fa-solid fa-crosshairs text-emerald-600 text-2xl animate-pulse"></i>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400">GPS Tracker Active</p>
                  <p className="text-sm font-bold text-gray-900">25.5941° N, 85.1376° E</p>
                </div>
              </div>
            </div>
            
            {/* Simulated Plot Overlays */}
            {plots.map((plot, i) => (
              <div 
                key={plot.id}
                className="absolute w-24 h-16 border-2 border-emerald-500 bg-emerald-500/20 flex items-center justify-center cursor-pointer hover:bg-emerald-500/40 transition-all"
                style={{ top: 150 + (i * 40), left: 200 + (i * 60) }}
              >
                <span className="text-[10px] font-black text-emerald-900">PLOT {plot.id}</span>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
              <h3 className="font-bold text-gray-900">Cultivation History</h3>
              <div className="flex space-x-2">
                <button className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded">2025-26</button>
                <button className="text-xs font-bold text-gray-400 px-3 py-1 rounded hover:bg-gray-100">2024-25</button>
              </div>
            </div>
            <div className="p-0">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-400 uppercase text-[10px] font-black">
                  <tr>
                    <th className="px-6 py-3">Plot ID</th>
                    <th className="px-6 py-3">Sowing Date</th>
                    <th className="px-6 py-3">Crop Type</th>
                    <th className="px-6 py-3">Yield (Est.)</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-bold">PL001</td>
                    <td className="px-6 py-4">12 Oct 2025</td>
                    <td className="px-6 py-4">Tomato</td>
                    <td className="px-6 py-4">2.5 Tons</td>
                    <td className="px-6 py-4"><span className="text-emerald-600 font-bold">Vegetative</span></td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-bold">PL002</td>
                    <td className="px-6 py-4">20 Nov 2025</td>
                    <td className="px-6 py-4">Potato</td>
                    <td className="px-6 py-4">4.0 Tons</td>
                    <td className="px-6 py-4"><span className="text-blue-500 font-bold">Sown</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar / Form */}
        <div className="space-y-6">
          {showAdd ? (
            <div className="bg-white p-6 rounded-2xl border shadow-lg animate-in slide-in-from-right-4">
              <h3 className="font-bold text-lg mb-4">Plot Registration</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Khata / Khesra No.</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" placeholder="Khata" className="w-full border rounded-lg p-2 text-sm" />
                    <input type="text" placeholder="Khesra" className="w-full border rounded-lg p-2 text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total Area (Acres)</label>
                  <input type="number" placeholder="0.00" className="w-full border rounded-lg p-2 text-sm" />
                </div>
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center space-x-3">
                  <i className="fa-solid fa-camera text-emerald-600"></i>
                  <span className="text-xs font-bold text-emerald-700">Upload Land Record / Receipt</span>
                </div>
                <button 
                  onClick={() => setShowAdd(false)}
                  className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold shadow-lg"
                >
                  Confirm Geo-Tagging
                </button>
                <button onClick={() => setShowAdd(false)} className="w-full text-xs font-bold text-gray-400">Cancel</button>
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-2xl border shadow-sm">
              <h4 className="font-bold mb-4">Active Plots Summary</h4>
              <div className="space-y-4">
                {plots.map(p => (
                  <div key={p.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-gray-900">Plot {p.id}</p>
                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{p.soilType} Soil</p>
                      </div>
                      <span className="text-xs font-bold text-emerald-600">{p.areaAcres} Acres</span>
                    </div>
                    <div className="mt-3 flex items-center space-x-2 text-[10px] font-bold text-gray-500 uppercase">
                      <i className="fa-solid fa-droplet text-blue-400"></i>
                      <span>{p.irrigationSource}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 rounded-xl bg-indigo-900 text-white">
                <p className="text-[10px] font-black uppercase text-indigo-300">Total Cultivation Area</p>
                <p className="text-2xl font-black">2.00 Acres</p>
              </div>
            </div>
          )}
          
          <div className="bg-emerald-900 p-6 rounded-2xl shadow-xl text-white relative overflow-hidden">
            <h4 className="font-bold text-emerald-400 mb-2">Crop Calendar</h4>
            <p className="text-xs text-slate-300 mb-4">View recommended sowing and harvesting timelines based on your location.</p>
            <button className="text-xs font-bold bg-white/10 hover:bg-white/20 transition-all border border-white/20 px-4 py-2 rounded-lg">Open Calendar</button>
            <i className="fa-solid fa-calendar-days absolute -bottom-6 -right-6 text-6xl text-white/5"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandCropModule;
