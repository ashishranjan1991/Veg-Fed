
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
  const logoUrl = "https://tarkaari.in/assets/img/logo-veg.png";

  const getLevelLabel = () => {
    if (role === UserRole.FARMER) return "Farmer Access";
    if (role === UserRole.PVCS_USER) return "Primary Cooperative (L2)";
    return "State Federation (L3)";
  };

  const menuItems = [
    { id: 'dashboard', label: t.dashboard, icon: 'fa-gauge-high', roles: Object.values(UserRole) },
    { id: 'user-mgmt', label: t.userMgmt, icon: 'fa-user-gear', roles: [UserRole.ADMIN, UserRole.DEPT_OFFICIAL, UserRole.UNION_USER] },
    { id: 'master-data', label: t.masterData, icon: 'fa-database', roles: [UserRole.ADMIN, UserRole.DEPT_OFFICIAL, UserRole.PVCS_USER] },
    { id: 'farmers', label: t.membership, icon: 'fa-users', roles: Object.values(UserRole) },
    { id: 'land-crop', label: t.landCrops, icon: 'fa-map-location-dot', roles: [UserRole.PVCS_USER, UserRole.ADMIN, UserRole.FARMER] },
    { id: 'procurement', label: t.procurement, icon: 'fa-truck-field', roles: [UserRole.PVCS_USER, UserRole.UNION_USER, UserRole.ADMIN] },
    { id: 'quality', label: t.qualityCheck, icon: 'fa-microscope', roles: [UserRole.PVCS_USER, UserRole.UNION_USER, UserRole.ADMIN] },
    { id: 'projects', label: t.projects, icon: 'fa-trowel-bricks', roles: [UserRole.UNION_USER, UserRole.ADMIN, UserRole.DEPT_OFFICIAL] },
    { id: 'marketing', label: t.marketing, icon: 'fa-shop', roles: [UserRole.UNION_USER, UserRole.ADMIN] },
    { id: 'reports', label: t.reports, icon: 'fa-chart-pie', roles: [UserRole.PVCS_USER, UserRole.UNION_USER, UserRole.DEPT_OFFICIAL, UserRole.ADMIN] },
    { id: 'schemes', label: t.schemes, icon: 'fa-file-invoice', roles: Object.values(UserRole) },
    { id: 'advisory', label: t.advisories, icon: 'fa-bullhorn', roles: Object.values(UserRole) },
  ];

  return (
    <nav 
      role="navigation" 
      aria-label="Main Menu"
      className="w-72 bg-slate-900 dark:bg-slate-900 text-white flex flex-col h-full sticky top-0 transition-all duration-300 border-r border-slate-800"
    >
      <div className="p-8 flex items-center space-x-4">
        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center p-1.5 shadow-xl shadow-emerald-900/40" aria-hidden="true">
          <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
        </div>
        <div>
          <h1 className="text-xl font-black leading-none tracking-tight">TARKAARI</h1>
          <p className="text-[9px] text-emerald-500 mt-1 uppercase font-black tracking-[0.2em]">{getLevelLabel()}</p>
        </div>
      </div>

      <div className="flex-1 px-4 mt-6 space-y-1 overflow-y-auto custom-scrollbar" role="tablist" aria-orientation="vertical">
        {menuItems
          .filter(item => item.roles.includes(role))
          .map(item => (
            <button
              key={item.id}
              role="tab"
              aria-selected={activeTab === item.id}
              aria-current={activeTab === item.id ? 'page' : undefined}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-4 px-5 py-3.5 rounded-2xl transition-all ${
                activeTab === item.id 
                ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-900/40' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <i className={`fa-solid ${item.icon} text-lg w-6`} aria-hidden="true"></i>
              <span className="font-bold text-sm tracking-tight">{item.label}</span>
            </button>
          ))}
      </div>

      <div className="px-6 py-4 mt-auto border-t border-slate-800/50">
        <button 
          onClick={onLogout}
          aria-label="Logout"
          className="w-full flex items-center space-x-4 px-5 py-4 rounded-2xl text-slate-500 hover:bg-red-900/20 hover:text-red-400 transition-colors"
        >
          <i className="fa-solid fa-right-from-bracket text-lg" aria-hidden="true"></i>
          <span className="font-bold text-sm">{t.logout}</span>
        </button>
      </div>

      <div className="p-6 bg-slate-800/20 m-6 rounded-[2rem] border border-slate-700/30">
        <label id="tier-switch-label" className="block text-[9px] uppercase font-black text-slate-600 mb-3 tracking-widest">{t.switchTier}</label>
        <div className="grid grid-cols-1 gap-1.5" role="group" aria-labelledby="tier-switch-label">
          <button 
            onClick={() => onRoleSwitch(UserRole.FARMER)} 
            aria-pressed={role === UserRole.FARMER}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${role === UserRole.FARMER ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-900 text-slate-500 hover:text-white'}`}
          >
            Tier 1: Farmer
          </button>
          <button 
            onClick={() => onRoleSwitch(UserRole.PVCS_USER)} 
            aria-pressed={role === UserRole.PVCS_USER}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${role === UserRole.PVCS_USER ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-900 text-slate-500 hover:text-white'}`}
          >
            Tier 2: PVCS
          </button>
          <button 
            onClick={() => onRoleSwitch(UserRole.DEPT_OFFICIAL)} 
            aria-pressed={role === UserRole.DEPT_OFFICIAL}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${role === UserRole.DEPT_OFFICIAL ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-900 text-slate-500 hover:text-white'}`}
          >
            Tier 3: State
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
