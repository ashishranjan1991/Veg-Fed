
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

  const menuItems = [
    { id: 'dashboard', label: t.dashboard, icon: 'fa-gauge-high', roles: Object.values(UserRole) },
    { id: 'master-data', label: t.masterData, icon: 'fa-database', roles: [UserRole.ADMIN, UserRole.DEPT_OFFICIAL] },
    { id: 'farmers', label: t.membership, icon: 'fa-users', roles: [UserRole.PVCS_USER, UserRole.UNION_USER, UserRole.ADMIN, UserRole.FARMER] },
    { id: 'land-crop', label: t.landCrops, icon: 'fa-map-location-dot', roles: [UserRole.PVCS_USER, UserRole.ADMIN, UserRole.FARMER] },
    { id: 'procurement', label: t.procurement, icon: 'fa-truck-field', roles: [UserRole.PVCS_USER, UserRole.UNION_USER, UserRole.ADMIN] },
    { id: 'quality', label: t.qualityCheck, icon: 'fa-microscope', roles: [UserRole.PVCS_USER, UserRole.UNION_USER, UserRole.ADMIN] },
    { id: 'reports', label: t.reports, icon: 'fa-chart-pie', roles: [UserRole.PVCS_USER, UserRole.UNION_USER, UserRole.DEPT_OFFICIAL, UserRole.ADMIN] },
    { id: 'schemes', label: t.schemes, icon: 'fa-file-invoice', roles: [UserRole.DEPT_OFFICIAL, UserRole.UNION_USER, UserRole.ADMIN, UserRole.FARMER] },
    { id: 'advisory', label: t.advisories, icon: 'fa-bullhorn', roles: Object.values(UserRole) },
  ];

  return (
    <div className="w-64 bg-slate-900 dark:bg-slate-900 text-white flex flex-col h-full sticky top-0 transition-colors duration-300">
      <div className="p-6 flex items-center space-x-3">
        <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center text-xl font-bold shadow-lg shadow-emerald-500/20">B</div>
        <div>
          <h1 className="text-lg font-bold leading-none italic">Bihar ERP</h1>
          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-bold">Veg. Coop</p>
        </div>
      </div>

      <nav className="flex-1 px-4 mt-4 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems
          .filter(item => item.roles.includes(role))
          .map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === item.id ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <i className={`fa-solid ${item.icon} w-5`}></i>
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          ))}
      </nav>

      <div className="px-4 py-2 mt-auto border-t border-slate-800">
        <button 
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-red-900/20 hover:text-red-400 transition-colors"
        >
          <i className="fa-solid fa-right-from-bracket w-5"></i>
          <span className="font-medium text-sm">{t.logout}</span>
        </button>
      </div>

      <div className="p-4 bg-slate-800/50 m-4 rounded-xl border border-slate-700/50">
        <label className="block text-[10px] uppercase font-bold text-slate-500 mb-2">{t.switchTier}</label>
        <select 
          value={role} 
          onChange={(e) => onRoleSwitch(e.target.value as UserRole)}
          className="w-full bg-slate-900 border border-slate-700 text-sm rounded-lg p-2 focus:ring-emerald-500 outline-none text-slate-300"
        >
          <option value={UserRole.FARMER}>Farmer (Self)</option>
          <option value={UserRole.PVCS_USER}>PVCS (Block)</option>
          <option value={UserRole.UNION_USER}>Union (District)</option>
          <option value={UserRole.DEPT_OFFICIAL}>Dept (State)</option>
          <option value={UserRole.ADMIN}>Admin (Master)</option>
        </select>
      </div>
    </div>
  );
};

export default Sidebar;
