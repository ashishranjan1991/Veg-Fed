
import React from 'react';
import { UserRole } from '../types';
import { Language, translations } from '../translations';

interface SidebarProps {
  role: UserRole;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onRoleSwitch: (role: UserRole) => void;
  onLogout: () => void;
  language: Language;
}

const Sidebar: React.FC<SidebarProps> = ({ role, activeTab, setActiveTab, onRoleSwitch, onLogout, language }) => {
  const t = translations[language];

  // Logic to determine Level display in sidebar
  const getLevelLabel = () => {
    if (role === UserRole.FARMER) return "Level 1: Producer";
    if (role === UserRole.PVCS_USER) return "Level 2: Primary Coop";
    return "Level 3: State Federation";
  };

  const menuItems = [
    { id: 'dashboard', label: t.dashboard, icon: 'fa-gauge-high', roles: Object.values(UserRole) },
    { id: 'master-data', label: t.masterData, icon: 'fa-database', roles: [UserRole.ADMIN, UserRole.DEPT_OFFICIAL] },
    { id: 'farmers', label: t.membership, icon: 'fa-users', roles: Object.values(UserRole) },
    { id: 'land-crop', label: t.landCrops, icon: 'fa-map-location-dot', roles: [UserRole.PVCS_USER, UserRole.ADMIN, UserRole.FARMER] },
    { id: 'procurement', label: t.procurement, icon: 'fa-truck-field', roles: [UserRole.PVCS_USER, UserRole.UNION_USER, UserRole.ADMIN] },
    { id: 'quality', label: t.qualityCheck, icon: 'fa-microscope', roles: [UserRole.PVCS_USER, UserRole.UNION_USER, UserRole.ADMIN] },
    { id: 'reports', label: t.reports, icon: 'fa-chart-pie', roles: [UserRole.PVCS_USER, UserRole.UNION_USER, UserRole.DEPT_OFFICIAL, UserRole.ADMIN] },
    { id: 'schemes', label: t.schemes, icon: 'fa-file-invoice', roles: Object.values(UserRole) },
    { id: 'advisory', label: t.advisories, icon: 'fa-bullhorn', roles: Object.values(UserRole) },
  ];

  return (
    <div className="w-72 bg-slate-900 dark:bg-slate-900 text-white flex flex-col h-full sticky top-0 transition-all duration-300">
      <div className="p-8 flex items-center space-x-4">
        <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-2xl font-black shadow-xl shadow-emerald-500/20">V</div>
        <div>
          <h1 className="text-xl font-black leading-none tracking-tight">VEGFED</h1>
          <p className="text-[9px] text-slate-500 mt-1 uppercase font-black tracking-[0.2em]">{getLevelLabel()}</p>
        </div>
      </div>

      <nav className="flex-1 px-4 mt-6 space-y-2 overflow-y-auto custom-scrollbar">
        {menuItems
          .filter(item => item.roles.includes(role))
          .map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-4 px-5 py-4 rounded-2xl transition-all ${
                activeTab === item.id 
                ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-900/40 translate-x-1' 
                : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'
              }`}
            >
              <i className={`fa-solid ${item.icon} text-lg`}></i>
              <span className="font-bold text-sm tracking-tight">{item.label}</span>
            </button>
          ))}
      </nav>

      <div className="px-6 py-4 mt-auto border-t border-slate-800/50">
        <button 
          onClick={onLogout}
          className="w-full flex items-center space-x-4 px-5 py-4 rounded-2xl text-slate-500 hover:bg-red-900/20 hover:text-red-400 transition-colors"
        >
          <i className="fa-solid fa-right-from-bracket text-lg"></i>
          <span className="font-bold text-sm">{t.logout}</span>
        </button>
      </div>

      <div className="p-6 bg-slate-800/30 m-6 rounded-3xl border border-slate-700/30">
        <label className="block text-[10px] uppercase font-black text-slate-600 mb-3 tracking-widest">{t.switchTier}</label>
        <div className="grid grid-cols-1 gap-2">
          <button 
            onClick={() => onRoleSwitch(UserRole.FARMER)} 
            className={`w-full text-left p-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors ${role === UserRole.FARMER ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-500 hover:text-white'}`}
          >
            Tier 1: Farmer
          </button>
          <button 
            onClick={() => onRoleSwitch(UserRole.PVCS_USER)} 
            className={`w-full text-left p-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors ${role === UserRole.PVCS_USER ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-500 hover:text-white'}`}
          >
            Tier 2: PVCS
          </button>
          <button 
            onClick={() => onRoleSwitch(UserRole.DEPT_OFFICIAL)} 
            className={`w-full text-left p-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors ${role === UserRole.DEPT_OFFICIAL ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-500 hover:text-white'}`}
          >
            Tier 3: State
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
