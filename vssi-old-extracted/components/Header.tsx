
import React, { useState } from 'react';
import { Menu, Grid, User, Calendar, Clock, ChevronDown, LogOut } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
  onToggleSwitcher: () => void;
  onLogout: () => void;
  serverTime: Date;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onToggleSwitcher, onLogout, serverTime }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}.${m}.${d}`;
  };

  const formatTime = (date: Date) => {
    return date.toTimeString().split(' ')[0];
  };

  return (
    <header className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-6 z-50">
      <div className="flex items-center space-x-5">
        <button 
          onClick={onToggleSidebar}
          className="p-2.5 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors border border-transparent active:border-slate-700"
        >
          <Menu size={22} />
        </button>
        <button 
          onClick={onToggleSwitcher}
          className="p-2.5 hover:bg-slate-800 text-teal-500 hover:text-teal-400 transition-colors border border-transparent active:border-slate-700"
          title="System Switcher"
        >
          <Grid size={22} />
        </button>
        <div className="flex items-center border-l border-slate-700 pl-5 space-x-4">
          <span className="text-lg font-bold tracking-tight text-slate-100 uppercase">관리자 시스템</span>
          <span className="text-sm text-slate-600">|</span>
          <h1 className="text-lg font-medium text-slate-300">연계 상태 모니터링</h1>
        </div>
      </div>

      <div className="flex items-center space-x-8 text-slate-400">
        <div className="flex items-center space-x-2 border-r border-slate-700 pr-6 relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={`flex items-center space-x-3 px-4 py-2 hover:bg-slate-800 transition-colors border border-transparent active:border-slate-700 ${isProfileOpen ? 'bg-slate-800 text-white border-slate-700' : ''}`}
          >
            <User size={18} className="text-slate-500" />
            <span className="text-base font-medium text-slate-200">관제사 홍길동</span>
            <ChevronDown size={16} className={`transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isProfileOpen && (
            <div className="absolute top-full right-4 mt-2 w-52 bg-slate-900/95 border border-slate-700 shadow-[0_10px_40px_rgba(0,0,0,0.5)] py-2 flex flex-col z-50 backdrop-blur-xl">
              <button className="flex items-center space-x-4 px-5 py-4 text-base text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-left group">
                <User size={18} className="text-slate-500 group-hover:text-teal-400" />
                <span>회원 정보</span>
              </button>
              <button 
                onClick={onLogout}
                className="flex items-center space-x-4 px-5 py-4 text-base text-red-400 hover:bg-slate-800 transition-colors border-t border-slate-800 mt-1 text-left group"
              >
                <LogOut size={18} className="text-red-500 group-hover:text-red-300" />
                <span>로그아웃</span>
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <Calendar size={18} className="text-slate-500" />
          <span className="text-base font-mono text-slate-300 tracking-tighter">{formatDate(serverTime)}</span>
        </div>
        <div className="flex items-center space-x-3 min-w-[100px]">
          <Clock size={18} className="text-slate-500" />
          <span className="text-base font-mono text-teal-500 tracking-tighter">{formatTime(serverTime)}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
