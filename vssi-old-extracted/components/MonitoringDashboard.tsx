
import React, { useState } from 'react';
import { 
  Search, RotateCw, ChevronLeft, ChevronRight, Calendar, 
  ChevronDown, ChevronUp, Layers, Activity, AlertTriangle, ListChecks 
} from 'lucide-react';
import { MonitoringData } from '../types';

const mockData: MonitoringData[] = [
  { id: '1', type: '수신', systemName: 'VP-강남', routingKey: 'v1.gangnam.batt', queueName: 'q.infra.batt.v1', queueType: 'Classic', ready: 1450, unacked: 0, deadLetter: 12, lastUpdated: '2026.02.04 16:45:12', status: '장애' },
  { id: '2', type: '송신', systemName: 'A 운항사', routingKey: 'v1.airline_a.auth', queueName: 'q.status.auth.v1', queueType: 'Quorum', ready: 120, unacked: 2, deadLetter: 0, lastUpdated: '2026.02.04 16:44:55', status: '지연' },
  { id: '3', type: '수신', systemName: 'VP-강남', routingKey: 'v1.gangnam.status', queueName: 'q.infra.status.v1', queueType: 'Classic', ready: 15, unacked: 2, deadLetter: 0, lastUpdated: '2026.02.04 16:44:30', status: '정상' },
  { id: '4', type: '송신', systemName: 'B 운항사', routingKey: 'v1.airline_b.plan', queueName: 'q.status.plan.v1', queueType: 'Quorum', ready: 5, unacked: 1, deadLetter: 0, lastUpdated: '2026.02.04 16:43:10', status: '정상' },
  { id: '5', type: '송신', systemName: 'VP-김포', routingKey: 'v1.gimpo.pos', queueName: 'q.flight.pos.v1', queueType: 'Classic', ready: 0, unacked: 5, deadLetter: 2, lastUpdated: '2026.02.04 16:42:05', status: '정상' },
  { id: '6', type: '수신', systemName: 'VP-인천', routingKey: 'v1.incheon.track', queueName: 'q.flight.track.v1', queueType: 'Classic', ready: 0, unacked: 0, deadLetter: 0, lastUpdated: '2026.02.04 16:40:00', status: '유휴' },
  { id: '7', type: '수신', systemName: 'VP-여의도', routingKey: 'v1.yeouido.alert', queueName: 'q.alert.emergency.v1', queueType: 'Classic', ready: 0, unacked: 0, deadLetter: 28, lastUpdated: '2026.02.04 16:38:45', status: '장애' },
  { id: '8', type: '송신', systemName: 'C 운항사', routingKey: 'v1.airline_c.met', queueName: 'q.weather.report.v1', queueType: 'Classic', ready: 2, unacked: 0, deadLetter: 0, lastUpdated: '2026.02.04 16:35:20', status: '정상' },
  { id: '9', type: '수신', systemName: 'VP-김포', routingKey: 'v1.gimpo.infra', queueName: 'q.infra.gate.v1', queueType: 'Quorum', ready: 8, unacked: 0, deadLetter: 0, lastUpdated: '2026.02.04 16:30:05', status: '정상' },
  { id: '10', type: '수신', systemName: 'VP-송도', routingKey: 'v1.songdo.infra', queueName: 'q.infra.monitor.v1', queueType: 'Classic', ready: 0, unacked: 0, deadLetter: 0, lastUpdated: '2026.02.04 16:25:30', status: '정상' },
];

const MonitoringDashboard: React.FC = () => {
  const [pageSize, setPageSize] = useState(20);
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);

  const getStatusColor = (status: MonitoringData['status']) => {
    switch (status) {
      case '장애': return 'text-red-500 bg-red-500/10 border border-red-900/50 font-black';
      case '지연': return 'text-orange-500 bg-orange-500/10 border border-orange-900/50';
      case '유휴': return 'text-slate-500 bg-slate-500/10 border border-slate-800';
      default: return 'text-teal-500 bg-teal-500/10 border border-teal-900/50';
    }
  };

  return (
    <div className="p-6 space-y-4 max-w-[1800px] mx-auto animate-in fade-in duration-500 pb-20">
      {/* Summary Section - More Compact with Icons */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SummaryCard label="활성 큐(Active)" value="12" subValue="Active count" icon={<Layers className="text-teal-500" size={18} />} />
        <SummaryCard label="총 대기(Ready)" value="1,595" subValue="Pending msg" isError icon={<Activity className="text-red-500" size={18} />} />
        <SummaryCard label="처리 중(Unacked)" value="8" subValue="In-flight" icon={<ListChecks className="text-blue-500" size={18} />} />
        <SummaryCard label="실패(Dead Letter)" value="42" subValue="DLQ isolation" isError icon={<AlertTriangle className="text-red-500 animate-pulse" size={18} />} />
      </section>

      {/* Filter Section - Collapsible & Slimmer */}
      <section className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 shadow-2xl overflow-hidden transition-all duration-300">
        <div 
          className="flex items-center justify-between px-6 py-2 cursor-pointer hover:bg-slate-800/30 transition-colors border-b border-slate-800/50"
          onClick={() => setIsFilterExpanded(!isFilterExpanded)}
        >
          <div className="flex items-center space-x-3">
            <Search size={16} className="text-teal-500" />
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">검색 필터 (Search Filter)</h2>
          </div>
          {isFilterExpanded ? <ChevronUp size={16} className="text-slate-600" /> : <ChevronDown size={16} className="text-slate-600" />}
        </div>
        
        {isFilterExpanded && (
          <div className="p-4 pt-4 animate-in slide-in-from-top duration-300">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <FilterInput label="유형">
                <div className="relative h-10 group">
                  <select className="w-full bg-slate-950/80 border border-slate-700 h-full px-4 pr-10 text-[14px] text-slate-300 focus:border-teal-500 outline-none transition-colors appearance-none cursor-pointer">
                    <option>전체</option>
                    <option>송신</option>
                    <option>수신</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none group-hover:text-slate-300 transition-colors" />
                </div>
              </FilterInput>
              <FilterInput label="시스템 이름">
                <input className="w-full bg-slate-950/80 border border-slate-700 h-10 px-4 text-[14px] text-slate-300 focus:border-teal-500 outline-none placeholder:text-slate-700 shadow-inner" placeholder="시스템 명칭 입력" />
              </FilterInput>
              <FilterInput label="라우팅 키">
                <input className="w-full bg-slate-950/80 border border-slate-700 h-10 px-4 text-[14px] text-slate-300 focus:border-teal-500 outline-none placeholder:text-slate-700 shadow-inner" placeholder="Routing Key 입력" />
              </FilterInput>
              <FilterInput label="최종 갱신일">
                <div className="flex items-center space-x-2 h-10">
                  <div className="flex-1 relative h-full">
                    <input type="date" className="w-full h-full bg-slate-950/80 border border-slate-700 px-3 text-sm text-slate-300 focus:border-teal-500 outline-none appearance-none shadow-inner" />
                    <Calendar size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
                  </div>
                  <span className="text-slate-800">—</span>
                  <div className="flex-1 relative h-full">
                    <input type="date" className="w-full h-full bg-slate-950/80 border border-slate-700 px-3 text-sm text-slate-300 focus:border-teal-500 outline-none appearance-none shadow-inner" />
                    <Calendar size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
                  </div>
                </div>
              </FilterInput>
            </div>
            <div className="flex justify-end space-x-3">
              <button className="flex items-center space-x-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-sm border border-slate-700 transition-colors font-bold">
                <RotateCw size={14} />
                <span>초기화</span>
              </button>
              <button className="flex items-center space-x-2 px-8 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-sm border border-teal-500 transition-all shadow-lg active:scale-[0.98] font-bold">
                <Search size={14} />
                <span>조회</span>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Grid Section */}
      <section className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 flex flex-col min-h-[450px] shadow-2xl overflow-hidden transition-all duration-500">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse min-w-[1400px]">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800">
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">유형</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">시스템 이름</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">라우팅 키</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">큐 명칭</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">타입</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-right">대기</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-right">처리 중</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-right">실패</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">최종 갱신일</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {mockData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors group h-12">
                  <td className="px-6 py-2">
                    <span className={`text-[10px] px-2 py-0.5 font-black uppercase tracking-tighter border ${item.type === '송신' ? 'bg-blue-900/20 text-blue-400 border-blue-800' : 'bg-purple-900/20 text-purple-400 border-purple-800'}`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-2 text-base font-bold text-slate-200 group-hover:text-teal-400 transition-colors">{item.systemName}</td>
                  <td className="px-6 py-2 text-sm font-mono text-slate-500">{item.routingKey}</td>
                  <td className="px-6 py-2 text-sm font-mono text-slate-400">{item.queueName}</td>
                  <td className="px-6 py-2 text-[10px] text-slate-600 font-bold uppercase tracking-widest">{item.queueType}</td>
                  <td className={`px-6 py-2 text-base font-mono text-right ${item.ready > 1000 ? 'text-red-500 font-black' : 'text-slate-300'}`}>{item.ready.toLocaleString()}</td>
                  <td className="px-6 py-2 text-base font-mono text-right text-slate-500">{item.unacked.toLocaleString()}</td>
                  <td className={`px-6 py-2 text-base font-mono text-right ${item.deadLetter > 10 ? 'text-red-500 font-black' : 'text-slate-300'}`}>{item.deadLetter.toLocaleString()}</td>
                  <td className="px-6 py-2 text-sm font-mono text-slate-600 italic tracking-tighter">{item.lastUpdated}</td>
                  <td className="px-6 py-2 text-center">
                    <span className={`inline-flex items-center px-3 py-1 text-[10px] font-black uppercase tracking-widest ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        <div className="px-8 py-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 bg-slate-950/60">
          <div className="mb-2 sm:mb-0 font-bold text-slate-400">
            총 <span className="text-teal-500 ml-1 font-black text-sm">128</span> 건
          </div>
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <button className="p-1.5 hover:bg-slate-800 text-slate-600 hover:text-white disabled:opacity-10 border border-transparent transition-colors" disabled><ChevronLeft size={16} /></button>
              <button className="w-7 h-7 flex items-center justify-center bg-teal-600 text-white font-black border border-teal-500 shadow-xl">1</button>
              <button className="w-7 h-7 flex items-center justify-center hover:bg-slate-800 hover:text-slate-200 border border-transparent transition-colors">2</button>
              <button className="w-7 h-7 flex items-center justify-center hover:bg-slate-800 hover:text-slate-200 border border-transparent transition-colors">3</button>
              <button className="p-1.5 hover:bg-slate-800 text-slate-600 hover:text-white border border-transparent transition-colors"><ChevronRight size={16} /></button>
            </div>
            <div className="flex items-center border-l border-slate-800 pl-8 h-8 relative group">
              <select 
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="bg-slate-950/80 border border-slate-700 pr-8 pl-3 h-full text-[11px] text-slate-300 focus:border-teal-500 outline-none cursor-pointer transition-colors appearance-none"
              >
                <option value={20}>20개씩 보기</option>
                <option value={50}>50개씩 보기</option>
                <option value={100}>100개씩 보기</option>
              </select>
              <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none group-hover:text-slate-300 transition-colors" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const SummaryCard: React.FC<{ label: string; value: string; subValue: string; icon: React.ReactNode; isError?: boolean }> = ({ label, value, subValue, icon, isError }) => (
  <div className={`bg-slate-900/60 backdrop-blur-xl border ${isError ? 'border-red-900/60 bg-red-900/10' : 'border-slate-800'} p-3.5 flex flex-col justify-between shadow-2xl transition-all hover:scale-[1.02] hover:border-slate-600 group`}>
    <div className="flex justify-between items-center mb-1">
      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-slate-300 transition-colors">{label}</span>
      <div className="p-1.5 bg-slate-950/50 border border-slate-800 shadow-inner">
        {icon}
      </div>
    </div>
    <div className="flex items-baseline space-x-2">
      <div className={`text-[24px] font-mono font-black ${isError ? 'text-red-500' : 'text-slate-100'} tracking-tighter leading-none`}>{value}</div>
      <div className="text-[9px] text-slate-600 font-bold uppercase tracking-tight">{subValue}</div>
    </div>
  </div>
);

const FilterInput: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="flex flex-col space-y-1.5">
    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{label}</label>
    <div className="relative">
      {children}
    </div>
  </div>
);

export default MonitoringDashboard;
