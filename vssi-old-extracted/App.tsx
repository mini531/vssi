
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MonitoringDashboard from './components/MonitoringDashboard';
import SystemSwitcher from './components/SystemSwitcher';
import Login from './components/Login';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [serverTime, setServerTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setServerTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleSwitcher = () => setIsSwitcherOpen(!isSwitcherOpen);

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex flex-col h-screen w-full bg-[#0a0f1d] overflow-hidden font-sans relative">
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full" style={{ 
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(50, 100, 255, 0.1) 1px, transparent 0)`, 
          backgroundSize: '48px 48px' 
        }}></div>
        <div className="absolute top-1/4 left-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-[-10%] w-[50%] h-[50%] bg-teal-600/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <Header 
        onToggleSidebar={toggleSidebar} 
        onToggleSwitcher={toggleSwitcher}
        onLogout={handleLogout}
        serverTime={serverTime}
      />
      
      <div className="flex flex-1 relative overflow-hidden z-10">
        <Sidebar isOpen={isSidebarOpen} />
        
        <main className={`flex-1 overflow-auto transition-all duration-300`}>
          <MonitoringDashboard />
        </main>
      </div>

      {isSwitcherOpen && <SystemSwitcher onClose={() => setIsSwitcherOpen(false)} />}
    </div>
  );
};

export default App;
