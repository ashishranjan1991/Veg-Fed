
import React, { useState, useEffect } from 'react';
import { UserRole, UserProfile } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import FarmerModule from './components/FarmerModule';
import ProcurementModule from './components/ProcurementModule';
import QualityModule from './components/QualityModule';
import SchemeModule from './components/SchemeModule';
import AdvisoryModule from './components/AdvisoryModule';
import LandCropModule from './components/LandCropModule';
import MasterDataModule from './components/MasterDataModule';
import ReportsModule from './components/ReportsModule';
import Home from './components/Home';
import { Language, FontSize } from './translations';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentRole, setCurrentRole] = useState<UserRole>(UserRole.FARMER);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [user, setUser] = useState<UserProfile | null>(null);
  
  // Accessibility & Theme State
  const [language, setLanguage] = useState<Language>('en');
  const [fontSize, setFontSize] = useState<FontSize>('md');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Apply theme to document root for Tailwind 'class' strategy
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    if (isAuthenticated) {
      const profiles: Record<UserRole, UserProfile> = {
        [UserRole.ADMIN]: { id: 'ADM001', name: 'System Admin', role: UserRole.ADMIN },
        [UserRole.PVCS_USER]: { id: 'PVCS001', name: 'Rajesh Kumar', role: UserRole.PVCS_USER, organization: 'Patna Block PVCS' },
        [UserRole.UNION_USER]: { id: 'UNI001', name: 'Sanjay Singh', role: UserRole.UNION_USER, organization: 'Patna District Union' },
        [UserRole.DEPT_OFFICIAL]: { id: 'DEPT001', name: 'Dr. Amit Sharma', role: UserRole.DEPT_OFFICIAL, organization: 'Cooperative Dept, Bihar' },
        [UserRole.FARMER]: { id: 'FAR001', name: 'Ramesh Mahto', role: UserRole.FARMER, location: 'Danapur' }
      };
      setUser(profiles[currentRole]);
    } else {
      setUser(null);
    }
  }, [currentRole, isAuthenticated]);

  const handleLogin = (role: UserRole) => {
    setCurrentRole(role);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveTab('dashboard');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard role={currentRole} language={language} />;
      case 'master-data':
        return <MasterDataModule role={currentRole} language={language} />;
      case 'farmers':
        return <FarmerModule role={currentRole} />;
      case 'land-crop':
        return <LandCropModule role={currentRole} />;
      case 'procurement':
        return <ProcurementModule role={currentRole} language={language} />;
      case 'quality':
        return <QualityModule role={currentRole} language={language} />;
      case 'schemes':
        return <SchemeModule role={currentRole} />;
      case 'advisory':
        return <AdvisoryModule role={currentRole} />;
      case 'reports':
        return <ReportsModule role={currentRole} language={language} />;
      default:
        return <Dashboard role={currentRole} language={language} />;
    }
  };

  if (!isAuthenticated) {
    return (
      <Home 
        onLogin={handleLogin} 
        language={language} 
        setLanguage={setLanguage} 
        fontSize={fontSize} 
        setFontSize={setFontSize}
        theme={theme}
        setTheme={setTheme}
      />
    );
  }

  return (
    <div className={`flex h-screen overflow-hidden bg-gray-100 dark:bg-slate-950 text-gray-900 dark:text-slate-100 font-size-${fontSize} transition-colors duration-300`}>
      <Sidebar 
        role={currentRole} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onRoleSwitch={setCurrentRole}
        onLogout={handleLogout}
        language={language}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        {user && (
          <Header 
            user={user} 
            language={language} 
            setLanguage={setLanguage} 
            fontSize={fontSize} 
            setFontSize={setFontSize}
            theme={theme}
            setTheme={setTheme}
          />
        )}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 transition-colors duration-300">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
