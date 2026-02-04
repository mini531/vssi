
import React, { useState } from 'react';
import { 
  LayoutDashboard, Activity, Users, ShieldAlert, FileText, 
  Settings, Link, Bell, ChevronRight 
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
}

const menuItems = [
  { id: 'dashboard', label: '대시보드', icon: LayoutDashboard },
  { id: 'monitoring', label: '모니터링', icon: Activity },
  { id: 'users', label: '사용자 관리', icon: Users },
  { 
    id: 'security', 
    label: '권한/보안', 
    icon: ShieldAlert,
    sub: ['역할 정의', '역할 배정', '보안 정책 설정']
  },
  { 
    id: 'logs', 
    label: '로그 조회', 
    icon: FileText,
    sub: ['시스템 로그', '사용자 활동 로그']
  },
  { 
    id: 'system', 
    label: '시스템 운영', 
    icon: Settings,
    sub: ['코드 관리', '장애 관리', '백업 설정', '백업 이력']
  },
  { 
    id: 'int_manage', 
    label: '연계 시스템 관리', 
    icon: Link,
    sub: ['버티포트', '운항사', '기체 관리', '교통 관리자', '도심항공 교통 정보 시스템']
  },
  { 
    id: 'int_ops', 
    label: '연계 시스템 운영', 
    icon: Link,
    initialExpanded: true,
    sub: ['연계 상태 모니터링', '연계 시스템 통계']
  },
  { id: 'notice', label: '공지사항 관리', icon: Bell },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['int_ops']);

  const toggleMenu = (id: string) => {
    setExpandedMenus(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  return (
    <aside 
      className={`relative z-40 h-full bg-slate-900/90 backdrop-blur-md border-r border-slate-800 transition-all duration-300 ${
        isOpen ? 'w-72' : 'w-0 overflow-hidden border-none'
      }`}
    >
      <div className="py-6 flex flex-col h-full overflow-y-auto w-72">
        {menuItems.map((item) => {
          const isExpanded = expandedMenus.includes(item.id);
          const hasSub = item.sub && item.sub.length > 0;

          return (
            <div key={item.id} className="mb-1">
              <button 
                onClick={() => hasSub && toggleMenu(item.id)}
                className={`w-full flex items-center px-6 py-4 text-[15px] transition-colors ${
                  isExpanded && hasSub ? 'text-teal-400 bg-slate-800/50' : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-100'
                }`}
              >
                <item.icon size={20} className={`mr-4 shrink-0 ${isExpanded && hasSub ? 'text-teal-400' : 'text-slate-500'}`} />
                <span className="flex-1 text-left font-bold tracking-tight">{item.label}</span>
                {hasSub && (
                  <ChevronRight size={16} className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                )}
              </button>
              {hasSub && isExpanded && (
                <div className="bg-slate-950/40 py-2">
                  {item.sub!.map((sub, idx) => (
                    <button key={idx} className={`w-full flex items-center pl-16 pr-6 py-3 text-sm transition-colors text-left ${
                      sub === '연계 상태 모니터링' ? 'text-teal-400 font-black border-l-2 border-teal-500' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'
                    }`}>
                      {sub}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
