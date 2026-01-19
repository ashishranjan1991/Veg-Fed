
import React, { useState } from 'react';
import { UserRole, FarmerRegistration } from '../types';

interface FarmerModuleProps {
  role: UserRole;
}

const FarmerModule: React.FC<FarmerModuleProps> = ({ role }) => {
  const [view, setView] = useState<'list' | 'details' | 'self'>(role === UserRole.FARMER ? 'self' : 'list');
  const [selectedFarmer, setSelectedFarmer] = useState<FarmerRegistration | null>(null);

  const [farmers] = useState<FarmerRegistration[]>([
    { 
      id: 'APP1001', firstName: 'Ramesh', lastName: 'Mahto', mobile: '9876543210', 
      applicationDate: '2026-01-05', status: 'Approved', dbtNumber: 'DBT123', 
      dob: '1985-05-10', gender: 'Male', aadhaar: '123412341234', 
      bankName: 'SBI', accountNumber: '123', ifsc: 'SBIN001', crops: ['Tomato'], landArea: 2.5,
      documents: [{ type: 'Aadhaar Card', status: 'Verified' }]
    }
  ]);

  const renderSelfView = () => (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm transition-colors overflow-hidden relative">
        <div className="flex items-center space-x-8 mb-10 relative z-10">
          <div className="w-32 h-32 bg-emerald-100 dark:bg-emerald-900 rounded-[2.5rem] flex items-center justify-center text-4xl font-black text-emerald-700 dark:text-emerald-300 border-4 border-white dark:border-slate-800 shadow-xl">
             RM
          </div>
          <div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase rounded-lg">Verified Member</span>
            <h2 className="text-4xl font-black text-gray-900 dark:text-white mt-2 leading-none">Ramesh Mahto</h2>
            <p className="text-gray-400 mt-2 font-bold uppercase tracking-widest text-[10px]">Membership ID: VEGFED-F-10042</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-emerald-600 border-b pb-2">Profile Details</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase">DBT Registration</p>
                <p className="font-bold dark:text-slate-200">DBT12345678</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase">Mobile Number</p>
                <p className="font-bold dark:text-slate-200">+91 98765 43210</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase">Aadhaar (Last 4)</p>
                <p className="font-bold dark:text-slate-200">•••• 4321</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase">Registered Union</p>
                <p className="font-bold dark:text-slate-200 text-emerald-600">Patna (Harit)</p>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-emerald-600 border-b pb-2">Banking Status</h3>
             <div className="p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-3xl border border-emerald-100 dark:border-emerald-800/50">
               <div className="flex items-center justify-between mb-4">
                 <p className="text-sm font-black text-emerald-800 dark:text-emerald-400 uppercase">State Bank of India</p>
                 <i className="fa-solid fa-building-columns text-emerald-300"></i>
               </div>
               <p className="text-xs font-bold text-emerald-700/70 dark:text-emerald-400/70">A/C: •••••••••••1234</p>
               <p className="text-[9px] font-black text-emerald-600 mt-4 uppercase tracking-widest">Verified for Direct Benefit Transfer</p>
             </div>
          </div>
        </div>
        
        <i className="fa-solid fa-wheat-awn absolute -bottom-10 -right-10 text-[250px] text-emerald-50 dark:text-slate-800/30 -rotate-12 pointer-events-none"></i>
      </div>
      
      <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex items-center justify-between">
         <div className="flex items-center space-x-6">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-3xl text-emerald-400">
               <i className="fa-solid fa-file-pdf"></i>
            </div>
            <div>
               <h4 className="font-black text-lg">Identity Certificate</h4>
               <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Download your VEGFED Membership ID Card</p>
            </div>
         </div>
         <button className="px-8 py-3 bg-emerald-600 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-900">Download</button>
      </div>
    </div>
  );

  const renderAdminView = () => (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Membership Registry</h2>
          <p className="text-gray-400 dark:text-slate-500 text-sm font-medium">Processing application queue for {role === UserRole.PVCS_USER ? 'Block' : 'State'}</p>
        </div>
      </div>
      {/* Existing list view implementation goes here... simplified for focus */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden p-4">
         <table className="w-full text-left">
            <thead>
               <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b dark:border-slate-800">
                  <th className="px-6 py-4">Applicant</th>
                  <th className="px-6 py-4">DBT ID</th>
                  <th className="px-6 py-4">Applied On</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Review</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
               {farmers.map(f => (
                 <tr key={f.id} className="group hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-6">
                       <p className="font-black text-gray-900 dark:text-slate-100">{f.firstName} {f.lastName}</p>
                       <p className="text-[10px] text-gray-400 font-bold">{f.mobile}</p>
                    </td>
                    <td className="px-6 py-6 text-sm font-bold text-gray-500">{f.dbtNumber}</td>
                    <td className="px-6 py-6 text-xs font-bold text-gray-400">{f.applicationDate}</td>
                    <td className="px-6 py-6">
                       <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase rounded-lg">{f.status}</span>
                    </td>
                    <td className="px-6 py-6 text-right">
                       <button className="w-10 h-10 bg-gray-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-gray-400 hover:text-emerald-600 transition-colors">
                          <i className="fa-solid fa-magnifying-glass"></i>
                       </button>
                    </td>
                 </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );

  return view === 'self' ? renderSelfView() : renderAdminView();
};

export default FarmerModule;
