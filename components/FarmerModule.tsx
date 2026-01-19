
import React, { useState } from 'react';
import { UserRole, FarmerRegistration } from '../types';

interface FarmerModuleProps {
  role: UserRole;
}

const FarmerModule: React.FC<FarmerModuleProps> = ({ role }) => {
  const [view, setView] = useState<'list' | 'details'>('list');
  const [selectedFarmer, setSelectedFarmer] = useState<FarmerRegistration | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [newDoc, setNewDoc] = useState<{ type: string; status: 'Pending' | 'Verified' | 'Rejected' }>({
    type: 'Aadhaar Card',
    status: 'Pending',
  });

  const [farmers, setFarmers] = useState<FarmerRegistration[]>([
    { 
      id: 'APP1001', 
      firstName: 'Ramesh', 
      lastName: 'Mahto', 
      mobile: '9876543210', 
      applicationDate: '2026-01-05', 
      status: 'Submitted', 
      dbtNumber: 'DBT123', 
      dob: '1985-05-10', 
      gender: 'Male', 
      aadhaar: '123412341234', 
      bankName: 'SBI', 
      accountNumber: '123', 
      ifsc: 'SBIN001', 
      crops: ['Tomato'], 
      landArea: 2.5,
      documents: [
        { type: 'Aadhaar Card', status: 'Verified' },
        { type: 'Land Record', status: 'Pending' }
      ]
    },
    { 
      id: 'APP1002', 
      firstName: 'Suresh', 
      lastName: 'Prasad', 
      mobile: '9876543211', 
      applicationDate: '2026-01-08', 
      status: 'Approved', 
      dbtNumber: 'DBT124', 
      dob: '1980-03-12', 
      gender: 'Male', 
      aadhaar: '432143214321', 
      bankName: 'SBI', 
      accountNumber: '124', 
      ifsc: 'SBIN001', 
      crops: ['Potato'], 
      landArea: 5.0,
      documents: [
        { type: 'Aadhaar Card', status: 'Verified' },
        { type: 'Bank Passbook', status: 'Verified' }
      ]
    },
    { 
      id: 'APP1003', 
      firstName: 'Anita', 
      lastName: 'Devi', 
      mobile: '9876543212', 
      applicationDate: '2026-01-10', 
      status: 'Under Review', 
      dbtNumber: 'DBT125', 
      dob: '1990-11-20', 
      gender: 'Female', 
      aadhaar: '567856785678', 
      bankName: 'PNB', 
      accountNumber: '125', 
      ifsc: 'PUNB001', 
      crops: ['Onion'], 
      landArea: 1.5,
      documents: []
    },
  ]);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Approved': return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400';
      case 'Under Review': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
      case 'Submitted': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
      case 'Rejected': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      case 'Deactivated': return 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400';
      default: return 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-400';
    }
  };

  const getDocStatusStyle = (status: string) => {
    switch(status) {
      case 'Verified': return 'text-emerald-600 dark:text-emerald-400';
      case 'Pending': return 'text-amber-600 dark:text-amber-400';
      case 'Rejected': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-400 dark:text-slate-500';
    }
  };

  const handleViewDetails = (farmer: FarmerRegistration) => {
    setSelectedFarmer(farmer);
    setView('details');
    setShowUploadForm(false);
  };

  const handleAddDocument = () => {
    if (!selectedFarmer) return;
    
    const updatedDocs = [...(selectedFarmer.documents || []), { ...newDoc }];
    const updatedFarmer = { ...selectedFarmer, documents: updatedDocs };
    
    setFarmers(farmers.map(f => f.id === selectedFarmer.id ? updatedFarmer : f));
    setSelectedFarmer(updatedFarmer);
    setShowUploadForm(false);
    setNewDoc({ type: 'Aadhaar Card', status: 'Pending' });
  };

  const docTypes = ['Aadhaar Card', 'Land Record', 'Bank Passbook', 'Farmer ID', 'DBT Certificate', 'Photo'];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100">Farmer Membership Management</h2>
          <p className="text-gray-500 dark:text-slate-400 text-sm">Review applications and manage vegetable producers</p>
        </div>
        {view === 'details' && (
          <button 
            onClick={() => setView('list')}
            className="text-gray-500 dark:text-slate-400 font-bold flex items-center hover:text-gray-800 dark:hover:text-slate-200 transition-colors"
          >
            <i className="fa-solid fa-arrow-left mr-2"></i>
            Back to List
          </button>
        )}
      </div>

      {view === 'list' ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase">Application ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase">Farmer Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase">Mobile</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase">Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                {farmers.map(farmer => (
                  <tr key={farmer.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-slate-100">{farmer.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-slate-300">{farmer.firstName} {farmer.lastName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-slate-300">{farmer.mobile}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-slate-400">{farmer.applicationDate}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(farmer.status)}`}>
                        {farmer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
                      <button 
                        onClick={() => handleViewDetails(farmer)}
                        className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : selectedFarmer && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm transition-colors">
              <div className="flex justify-between items-center mb-6 border-b dark:border-slate-800 pb-4">
                <h3 className="text-xl font-bold flex items-center dark:text-slate-100">
                  <i className="fa-solid fa-user-circle text-emerald-600 dark:text-emerald-400 mr-3"></i>
                  Applicant Profile
                </h3>
                {selectedFarmer.status === 'Approved' && (
                  <button className="text-xs font-bold text-red-500 dark:text-red-400 border border-red-100 dark:border-red-900/50 px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">Deactivate Membership</button>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">Full Name</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-slate-100">{selectedFarmer.firstName} {selectedFarmer.lastName}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">DBT Registration ID</p>
                  <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{selectedFarmer.dbtNumber}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">Date of Birth</p>
                  <p className="text-gray-700 dark:text-slate-300">{selectedFarmer.dob}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">Gender</p>
                  <p className="text-gray-700 dark:text-slate-300">{selectedFarmer.gender}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">Aadhaar (Last 4)</p>
                  <p className="text-gray-700 dark:text-slate-300">•••• •••• {selectedFarmer.aadhaar.slice(-4)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">Primary Mobile</p>
                  <p className="text-gray-700 dark:text-slate-100 font-bold">{selectedFarmer.mobile}</p>
                </div>
              </div>

              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">Document Repository</h4>
                  <button 
                    onClick={() => setShowUploadForm(!showUploadForm)}
                    className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center space-x-1"
                  >
                    <i className={`fa-solid ${showUploadForm ? 'fa-xmark' : 'fa-plus'}`}></i>
                    <span>{showUploadForm ? 'Cancel' : 'Upload New'}</span>
                  </button>
                </div>

                {showUploadForm && (
                  <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/50 rounded-xl animate-in slide-in-from-top-2 duration-300">
                    <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300 mb-3 uppercase tracking-wider">New Document Details</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase mb-1">Document Type</label>
                        <select 
                          value={newDoc.type} 
                          onChange={(e) => setNewDoc({...newDoc, type: e.target.value})}
                          className="w-full bg-white dark:bg-slate-800 border border-emerald-200 dark:border-slate-700 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500 dark:text-slate-100"
                        >
                          {docTypes.map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase mb-1">Initial Status</label>
                        <select 
                          value={newDoc.status} 
                          onChange={(e) => setNewDoc({...newDoc, status: e.target.value as any})}
                          className="w-full bg-white dark:bg-slate-800 border border-emerald-200 dark:border-slate-700 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500 dark:text-slate-100"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Verified">Verified</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>
                    </div>
                    <button 
                      onClick={handleAddDocument}
                      className="mt-4 w-full bg-emerald-600 text-white py-2 rounded-lg font-bold text-xs uppercase tracking-widest shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all"
                    >
                      Save Document
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(selectedFarmer.documents && selectedFarmer.documents.length > 0) ? (
                    selectedFarmer.documents.map((doc, idx) => (
                      <div key={idx} className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-800 flex items-center justify-between hover:border-emerald-200 dark:hover:border-emerald-900 transition-all group">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                            <i className={`fa-solid ${doc.type.includes('Photo') ? 'fa-image' : 'fa-file-lines'}`}></i>
                          </div>
                          <div>
                            <span className="text-xs font-bold text-gray-700 dark:text-slate-200">{doc.type}</span>
                            <p className="text-[9px] text-gray-400 dark:text-slate-500 font-medium">Updated Recently</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                           <span className={`text-[10px] font-black uppercase tracking-widest ${getDocStatusStyle(doc.status)}`}>{doc.status}</span>
                           <button className="text-gray-300 dark:text-slate-600 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                             <i className="fa-solid fa-eye"></i>
                           </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 py-8 border border-dashed border-gray-200 dark:border-slate-800 rounded-xl flex flex-col items-center justify-center text-gray-400 dark:text-slate-600">
                      <i className="fa-solid fa-folder-open text-3xl mb-2 opacity-20"></i>
                      <p className="text-xs font-bold uppercase tracking-wider">No documents uploaded</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8">
                <h4 className="text-sm font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-4">Bank Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50 dark:bg-slate-800/50 p-4 rounded-xl border border-gray-100 dark:border-slate-800">
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 dark:text-slate-400 mb-1">Bank Name</p>
                    <p className="text-sm font-bold dark:text-slate-200">{selectedFarmer.bankName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 dark:text-slate-400 mb-1">Account Number</p>
                    <p className="text-sm font-bold dark:text-slate-200">•••••••{selectedFarmer.accountNumber.slice(-4)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 dark:text-slate-400 mb-1">IFSC Code</p>
                    <p className="text-sm font-bold dark:text-slate-200">{selectedFarmer.ifsc}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm transition-colors">
              <h3 className="text-xl font-bold mb-6 flex items-center border-b dark:border-slate-800 pb-4 dark:text-slate-100">
                <i className="fa-solid fa-file-contract text-emerald-600 dark:text-emerald-400 mr-3"></i>
                Approval Workflow
              </h3>
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <button className="w-full flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all">
                  Approve Application
                </button>
                <button className="w-full flex-1 bg-white dark:bg-slate-800 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 py-3 rounded-xl font-bold hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                  Reject / Mark Incomplete
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm transition-colors">
              <h4 className="font-bold text-gray-900 dark:text-slate-100 mb-4">Application Timeline</h4>
              <div className="space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-100 dark:before:bg-emerald-900">
                <div className="relative pl-8">
                  <div className="absolute left-0 top-1 w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center text-white text-[10px]">
                    <i className="fa-solid fa-check"></i>
                  </div>
                  <p className="text-xs font-bold text-gray-900 dark:text-slate-200 leading-none">Application Submitted</p>
                  <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-1">{selectedFarmer.applicationDate} • Self</p>
                </div>
                <div className="relative pl-8">
                  <div className="absolute left-0 top-1 w-6 h-6 bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-300 rounded-full flex items-center justify-center text-[10px]">
                    <i className="fa-solid fa-clock"></i>
                  </div>
                  <p className="text-xs font-bold text-gray-600 dark:text-slate-400 leading-none uppercase">Document Verification</p>
                  <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-1">Pending Officer Signature</p>
                </div>
                <div className="relative pl-8 opacity-40">
                  <div className="absolute left-0 top-1 w-6 h-6 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-gray-400 dark:text-slate-600 text-[10px]">
                    <i className="fa-solid fa-user-check"></i>
                  </div>
                  <p className="text-xs font-bold text-gray-400 dark:text-slate-500 leading-none uppercase">Membership ID Issued</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl shadow-xl text-white relative overflow-hidden transition-colors">
              <h4 className="font-bold text-emerald-400 mb-2">Member Support</h4>
              <p className="text-xs text-slate-300 mb-4">Need help verifying this member? Contact the District Union helpline.</p>
              <div className="flex items-center space-x-2 text-xl font-bold">
                <i className="fa-solid fa-phone"></i>
                <span>1800-456-789</span>
              </div>
              <i className="fa-solid fa-headphones absolute -bottom-6 -right-6 text-6xl text-white/5"></i>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerModule;
