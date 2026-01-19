
import React from 'react';
import { QualityParameter } from '../types';
import { Language, translations } from '../translations';

// Define props to include language for internationalization and fixing type errors
interface QualityModuleProps {
  role: string;
  language?: Language;
}

const QualityModule: React.FC<QualityModuleProps> = ({ role, language = 'en' }) => {
  const t = translations[language];
  const parameters: QualityParameter[] = [
    { name: 'Diameter (Size)', unit: 'mm', standard: '50-70mm', status: 'Pass' },
    { name: 'Color Intensity', unit: 'Score', standard: 'Deep Red', status: 'Pass' },
    { name: 'Firmness', unit: 'N', standard: '> 4.5', status: 'Pass' },
    { name: 'Surface Defects', unit: '%', standard: '< 5%', status: 'Warning' },
    { name: 'Moisture Content', unit: '%', standard: '70-85%', status: 'Pass' },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t.qualityStandards}</h2>
          <p className="text-gray-500 text-sm">Configure and monitor vegetable grading parameters</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md hover:bg-indigo-700 flex items-center space-x-2">
          <i className="fa-solid fa-gear"></i>
          <span>{t.configureParams}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center">
            <span className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded flex items-center justify-center mr-3">
              <i className="fa-solid fa-tomato"></i>
            </span>
            Active Standards: Tomato (Hybrid)
          </h3>
          <div className="space-y-4">
            {parameters.map(param => (
              <div key={param.name} className="flex items-center justify-between p-4 border rounded-xl hover:border-indigo-300 transition-colors">
                <div>
                  <p className="font-bold text-gray-800">{param.name}</p>
                  <p className="text-xs text-gray-500">Standard: {param.standard} ({param.unit})</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                  param.status === 'Pass' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {param.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-indigo-900 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-4">Quality-Wise Pricing Matrix</h3>
            <p className="text-indigo-200 text-sm mb-8">Base prices are adjusted based on final grading outcome at procurement level.</p>
            <div className="space-y-4">
              {[
                { grade: 'A', desc: 'Premium / Export Quality', factor: '100% of Base' },
                { grade: 'B', desc: 'Standard / Market Quality', factor: '80% of Base' },
                { grade: 'C', desc: 'Processing / Low Quality', factor: '60% of Base' },
                { grade: 'D', desc: 'Rejected / Below Standard', factor: 'No Payment' },
              ].map(item => (
                <div key={item.grade} className="flex items-center justify-between p-4 bg-white/10 rounded-xl border border-white/20">
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl font-black">{item.grade}</span>
                    <div>
                      <p className="font-bold text-sm leading-none">{item.desc}</p>
                      <p className="text-[10px] text-indigo-300 mt-1 uppercase tracking-wider">Price Factor: {item.factor}</p>
                    </div>
                  </div>
                  <i className="fa-solid fa-chevron-right text-white/40"></i>
                </div>
              ))}
            </div>
          </div>
          <i className="fa-solid fa-microscope absolute -bottom-10 -right-10 text-[180px] text-white/5 pointer-events-none"></i>
        </div>
      </div>
    </div>
  );
};

export default QualityModule;
