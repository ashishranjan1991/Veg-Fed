
import React, { useState } from 'react';
import { UserRole, UserProfile } from '../types';

interface UserManagementModuleProps {
  role: UserRole;
}

const UserManagementModule: React.FC<UserManagementModuleProps> = ({ role }) => {
  const [showCreate, setShowCreate] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  const [users, setUsers] = useState<UserProfile[]>([
    { id: 'PVCS101', name: 'Rajesh Khanna', role: UserRole.PVCS_USER, organization: 'Danapur Block PVCS' },
    { id: 'PVCS102', name: 'Manoj Tiwari', role: UserRole.PVCS_USER, organization: 'Sherghati Farmers Coop' },
    { id: 'PVCS103', name: 'Sushil Modi', role: UserRole.PVCS_USER, organization: 'Darbhanga North Node' },
    { id: 'UNI101', name: 'Vikash Kumar', role: UserRole.UNION_USER, organization: 'Patna District Union' },
  ]);

  const [newUser, setNewUser] = useState<Partial<UserProfile>>({
    name: '',
    role: UserRole.PVCS_USER,
    organization: '',
    id: ''
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      const createdUser: UserProfile = {
        id: newUser.id || `PVCS-${Math.floor(Math.random() * 1000)}`,
        name: newUser.name || 'Unknown',
        role: newUser.role as UserRole,
        organization: newUser.organization || 'General PVCS'
      };
      setUsers([createdUser, ...users]);
      setShowCreate(false);
      setIsSaving(false);
      setNewUser({ name: '', role: UserRole.PVCS_USER, organization: '', id: '' });
    }, 1500);
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.organization?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-slate-100 uppercase tracking-tight leading-none">Federation User Control</h2>
          <p className="text-gray-500 dark:text-slate-400 text-sm font-medium mt-2">Manage Tier-2 (PVCS) and Tier-3 official credentials</p>
        </div>
        <button 
          onClick={() => setShowCreate(true)}
          className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 hover:bg-emerald-700 active:scale-95 transition-all flex items-center space-x-3"
        >
          <i className="fa-solid fa-user-plus"></i>
          <span>Create New PVCS User</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Stat Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border dark:border-slate-800 shadow-sm transition-colors">
            <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-6">User Statistics</h3>
            <div className="space-y-6">
              <div className="flex justify-between items-end border-b dark:border-slate-800 pb-4">
                <span className="text-[9px] font-black text-gray-400 uppercase">Active PVCS Nodes</span>
                <span className="text-2xl font-black text-emerald-600">534</span>
              </div>
              <div className="flex justify-between items-end border-b dark:border-slate-800 pb-4">
                <span className="text-[9px] font-black text-gray-400 uppercase">Union Admins</span>
                <span className="text-2xl font-black text-blue-600">38</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-[9px] font-black text-gray-400 uppercase">Official Access</span>
                <span className="text-2xl font-black text-indigo-600">850+</span>
              </div>
            </div>
          </div>
          
          <div className="bg-emerald-900 p-8 rounded-[2.5rem] text-white relative overflow-hidden transition-all hover:scale-[1.02] shadow-2xl">
            <h4 className="font-black text-xl uppercase tracking-tight mb-4 leading-none">Role Audit</h4>
            <p className="text-xs text-emerald-100/70 font-medium leading-relaxed mb-6">Level 2 (PVCS) users can only manage local procurement and member registration.</p>
            <button className="w-full text-[9px] font-black bg-white/10 hover:bg-white/20 transition-all border border-white/20 px-4 py-3 rounded-xl uppercase tracking-widest">Download Policy</button>
            <i className="fa-solid fa-shield-halved absolute -bottom-8 -right-8 text-[120px] text-white/5 pointer-events-none -rotate-12"></i>
          </div>
        </div>

        {/* User List Panel */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
            <div className="p-8 border-b dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50 dark:bg-slate-800/30">
              <h3 className="font-black text-gray-900 dark:text-slate-100 uppercase tracking-tight">Active Federation Personnel</h3>
              <div className="relative group w-full md:w-64">
                <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[10px]"></i>
                <input 
                  type="text" 
                  placeholder="Search by name or node..." 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-[11px] font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all" 
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 dark:bg-slate-800/50 text-gray-400 uppercase text-[9px] font-black tracking-widest border-b dark:border-slate-800">
                    <th className="px-8 py-5">Officer Name</th>
                    <th className="px-8 py-5">Assigned Node / Org</th>
                    <th className="px-8 py-5">Role Level</th>
                    <th className="px-8 py-5">User ID</th>
                    <th className="px-8 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-slate-800">
                  {filteredUsers.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors group">
                      <td className="px-8 py-6">
                        <p className="text-sm font-black text-gray-900 dark:text-slate-100">{user.name}</p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Status: Active</p>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm font-bold text-gray-600 dark:text-slate-400">{user.organization}</p>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                          user.role === UserRole.PVCS_USER ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                        }`}>
                          {user.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-8 py-6 font-mono text-[11px] text-gray-400">{user.id}</td>
                      <td className="px-8 py-6 text-right">
                        <button className="text-gray-300 hover:text-emerald-600 transition-colors p-2">
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button className="text-gray-300 hover:text-red-500 transition-colors p-2">
                          <i className="fa-solid fa-ban"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-8 py-20 text-center text-gray-400">
                        <i className="fa-solid fa-users-slash text-4xl mb-4 block opacity-10"></i>
                        <p className="text-xs font-black uppercase tracking-widest">No users found matching your search</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Creation Modal Overaly */}
      {showCreate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-sm bg-black/40 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[3rem] p-10 shadow-2xl border-4 border-emerald-500/20 animate-in zoom-in-95 duration-300 overflow-hidden relative">
            <div className="flex justify-between items-start mb-10">
              <div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Create L2 User</h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Assign to Primary Cooperative Center</p>
              </div>
              <button onClick={() => setShowCreate(false)} className="w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 flex items-center justify-center transition-all">
                <i className="fa-solid fa-xmark text-gray-400"></i>
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Officer Full Name</label>
                <input 
                  required
                  type="text" 
                  value={newUser.name}
                  onChange={e => setNewUser({...newUser, name: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl px-5 py-4 text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  placeholder="e.g. Sanjay Singh"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">User ID / Mobile</label>
                  <input 
                    required
                    type="text" 
                    value={newUser.id}
                    onChange={e => setNewUser({...newUser, id: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl px-5 py-4 text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    placeholder="91XXXXXXXX"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Password / PIN</label>
                  <input 
                    required
                    type="password" 
                    className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl px-5 py-4 text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    placeholder="••••••"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Assigned PVCS Center Name</label>
                <input 
                  required
                  type="text" 
                  value={newUser.organization}
                  onChange={e => setNewUser({...newUser, organization: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl px-5 py-4 text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  placeholder="e.g. Patna Block Central PVCS"
                />
              </div>

              <div className="pt-8">
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 hover:bg-emerald-700 active:scale-95 transition-all flex items-center justify-center space-x-3 disabled:bg-gray-400"
                >
                  {isSaving ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-user-plus"></i>}
                  <span>{isSaving ? 'Establishing Profile...' : 'Authorize PVCS User'}</span>
                </button>
              </div>
            </form>
            
            <img src="https://tarkaari.in/assets/img/logo-veg.png" className="absolute -bottom-10 -left-10 w-48 h-48 opacity-5 -rotate-12 pointer-events-none" alt="" />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementModule;
