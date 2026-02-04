
import React from 'react';
import { X, ExternalLink } from 'lucide-react';

interface SystemSwitcherProps {
  onClose: () => void;
}

const systems = [
  { id: 'IVMS', name: 'IVMS', desc: '버티포트 통합 관리 시스템', color: 'text-teal-500' },
  { id: 'IFPS', name: 'IFPS', desc: '통합 비행 계획 관리 시스템', color: 'text-blue-500' },
  { id: 'IFRS', name: 'IFRS', desc: '통합 운항 예약 시스템', color: 'text-purple-500' },
  { id: 'V-CDM', name: 'V-CDM', desc: '협동적 의사 결정 지원 시스템', color: 'text-orange-500' },
  { id: 'SAMS', name: 'SAMS', desc: '관리자 시스템', color: 'text-teal-400', active: true },
];

const SystemSwitcher: React.FC<SystemSwitcherProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-start p-14 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-80 bg-slate-900 border border-slate-700 shadow-2xl flex flex-col animate-in slide-in-from-left duration-200">
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-800/50">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-teal-500"></span>
            <h3 className="text-sm font-bold text-slate-100">VSSI System Switcher</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>
        
        <div className="p-2 space-y-1 overflow-y-auto">
          {systems.map((sys) => (
            <button 
              key={sys.id}
              className={`w-full group flex items-start p-4 text-left transition-all ${
                sys.active ? 'bg-teal-900/20 border border-teal-800/50' : 'hover:bg-slate-800 border border-transparent'
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className={`text-lg font-black tracking-tighter ${sys.color}`}>{sys.id}</span>
                  {sys.active && <span className="text-[10px] bg-teal-900 text-teal-400 px-1 font-bold">CURRENT</span>}
                </div>
                <div className="text-xs text-slate-400 font-medium">{sys.desc}</div>
              </div>
              {!sys.active && <ExternalLink size={14} className="text-slate-600 group-hover:text-slate-300 mt-1" />}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex justify-center">
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">K-UAM VSSI Platform</span>
        </div>
      </div>
      
      {/* Backdrop to close when clicking outside */}
      <div className="fixed inset-0 -z-10" onClick={onClose}></div>
    </div>
  );
};

export default SystemSwitcher;
