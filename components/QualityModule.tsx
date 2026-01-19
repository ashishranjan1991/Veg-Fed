
import React, { useState } from 'react';
import { QualityParameter, UserRole } from '../types';
import { Language, translations } from '../translations';

interface QualityModuleProps {
  role: UserRole;
  language?: Language;
}

const QualityModule: React.FC<QualityModuleProps> = ({ role, language = 'en' }) => {
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<'standards' | 'traceability'>('standards');
  const [isGeneratingBatch, setIsGeneratingBatch] = useState(false);
  const [batchId, setBatchId] = useState<string | null>(null);

  const parameters: QualityParameter[] = [
    { name: 'Diameter (Size)', unit: 'mm', standard: '50-70mm', status: 'Pass' },
    { name: 'Color Intensity', unit: 'Score', standard: 'Deep Red', status: 'Pass' },
    { name: 'Firmness', unit: 'N', standard: '> 4.5', status: 'Pass' },
    { name: 'Surface Defects', unit: '%', standard: '< 5%', status: 'Warning' },
    { name: 'Moisture Content', unit: '%', standard: '70-85%', status: 'Pass' },
  ];

  const handleGenerateTraceability = () => {
    setIsGeneratingBatch(true);
    setTimeout(() => {
      setBatchId(`BATCH-PVCS-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-001`);
      setIsGeneratingBatch(false);
    }, 1500);
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">{t.qualityStandards}</h2>
          <p className="text-gray-500 dark:text-slate-400 text-sm">Configure and monitor vegetable grading parameters (FR-04)</p>
        </div>
        <div className="flex space-x-2 bg-white dark:bg-slate-900 p-1 rounded-2xl border dark:border-slate-800 shadow-sm">
           <button onClick={() => setActiveTab('standards')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'standards' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400'}`}>Standards</button>
           <button onClick={() => setActiveTab('traceability')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'traceability' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400'}`}>{t.traceability}</button>
        </div>
      </div>

      {activeTab === 'standards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm p-10">
            <h3 className="font-black text-lg mb-6 flex items-center dark:text-white uppercase tracking-tight">
              <span className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-xl flex items-center justify-center mr-4">
                <i className="fa-solid fa-leaf"></i>
              </span>
              Active Standards: Tomato (Hybrid)
            </h3>
            <div className="space-y-4">
              {parameters.map(param => (
                <div key={param.name} className="flex items-center justify-between p-5 border dark:border-slate-800 rounded-2xl bg-gray-50 dark:bg-slate-800/50 group hover:border-indigo-300 transition-colors">
                  <div>
                    <p className="font-black text-gray-800 dark:text-slate-200 text-sm uppercase tracking-tight">{param.name}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Goal: {param.standard}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                    param.status === 'Pass' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {param.status}
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-10 bg-indigo-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 transition-all">
              Update System Values
            </button>
          </div>

          <div className="bg-indigo-900 rounded-[3rem] shadow-2xl p-10 text-white relative overflow-hidden flex flex-col justify-between">
            <div className="relative z-10">
              <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">Quality-Wise Pricing Matrix</h3>
              <p className="text-indigo-200 text-sm mb-10 font-medium">Base prices are adjusted based on final grading outcome at procurement level.</p>
              <div className="space-y-4">
                {[
                  { grade: 'A', desc: 'Premium / Export Quality', factor: '100% of Base' },
                  { grade: 'B', desc: 'Standard / Market Quality', factor: '80% of Base' },
                  { grade: 'C', desc: 'Processing / Low Quality', factor: '60% of Base' },
                  { grade: 'D', desc: 'Rejected / Below Standard', factor: 'No Payment' },
                ].map(item => (
                  <div key={item.grade} className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/10 group hover:bg-white/10 transition-all">
                    <div className="flex items-center space-x-6">
                      <span className="text-3xl font-black text-emerald-400">{item.grade}</span>
                      <div>
                        <p className="font-black text-sm uppercase tracking-tight leading-none">{item.desc}</p>
                        <p className="text-[10px] text-indigo-300 mt-2 uppercase font-bold tracking-[0.2em]">Price Factor: {item.factor}</p>
                      </div>
                    </div>
                    <i className="fa-solid fa-chevron-right text-white/20 group-hover:text-white/60 transition-all"></i>
                  </div>
                ))}
              </div>
            </div>
            <i className="fa-solid fa-microscope absolute -bottom-10 -right-10 text-[250px] text-white/5 pointer-events-none -rotate-12"></i>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm p-12 text-center animate-in slide-in-from-right-12">
           <div className="max-w-2xl mx-auto space-y-10">
              <div className="w-32 h-32 bg-gray-50 dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center text-4xl text-gray-200 mx-auto shadow-inner relative">
                 <i className="fa-solid fa-qrcode"></i>
                 {batchId && <div className="absolute inset-0 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center text-white text-5xl animate-in zoom-in"><i className="fa-solid fa-check"></i></div>}
              </div>
              
              {!batchId ? (
                <>
                  <div>
                    <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Generate Batch ID</h3>
                    <p className="text-gray-500 mt-2 font-medium">Create unique traceability identifiers for current procurement (FR-04.3)</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-left p-6 bg-gray-50 dark:bg-slate-800 rounded-3xl border dark:border-slate-700">
                     <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Procurement Node</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-slate-100">Patna Center #402</p>
                     </div>
                     <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Commodity</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-slate-100">Tomato (Hybrid-A)</p>
                     </div>
                  </div>
                  <button 
                    onClick={handleGenerateTraceability}
                    disabled={isGeneratingBatch}
                    className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-emerald-100 dark:shadow-none hover:bg-emerald-700 disabled:opacity-50 transition-all"
                  >
                    {isGeneratingBatch ? <i className="fa-solid fa-dna fa-spin mr-3"></i> : <i className="fa-solid fa-wand-magic-sparkles mr-3"></i>}
                    Seal Batch & Generate QR
                  </button>
                </>
              ) : (
                <div className="space-y-10 animate-in fade-in zoom-in duration-500">
                   <div>
                      <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-2">Digital Signature Active</h4>
                      <p className="text-2xl font-black text-gray-900 dark:text-white font-mono tracking-tighter">{batchId}</p>
                   </div>
                   <div className="flex justify-center space-x-6">
                      <div className="p-6 bg-white dark:bg-slate-800 border-4 border-gray-900 dark:border-white rounded-3xl shadow-2xl">
                         <i className="fa-solid fa-qrcode text-[120px]"></i>
                      </div>
                      <div className="text-left space-y-4 self-center">
                         <div className="flex items-center space-x-3 text-emerald-600">
                            <i className="fa-solid fa-circle-check"></i>
                            <span className="text-[10px] font-black uppercase tracking-widest">Farm-to-Table Ready</span>
                         </div>
                         <p className="text-xs text-gray-500 font-medium max-w-[200px]">QR code contains: Harvest Date, Quality Grade A, Procurement Location, and Soil Metadata.</p>
                      </div>
                   </div>
                   <div className="flex space-x-4">
                      <button className="flex-1 bg-slate-900 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl">Print Sticker Labels</button>
                      <button onClick={() => setBatchId(null)} className="px-8 py-4 text-gray-400 font-black text-[10px] uppercase tracking-widest border border-gray-100 dark:border-slate-800 rounded-xl hover:bg-gray-50">New Batch</button>
                   </div>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};

export default QualityModule;
