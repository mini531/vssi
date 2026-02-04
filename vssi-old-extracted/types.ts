
export type SystemType = 'IVMS' | 'IFPS' | 'IFRS' | 'V-CDM' | 'SAMS';

export interface MonitoringData {
  id: string;
  type: '송신' | '수신';
  systemName: string;
  routingKey: string;
  queueName: string;
  queueType: 'Classic' | 'Quorum';
  ready: number;
  unacked: number;
  deadLetter: number;
  lastUpdated: string;
  // Updated status to support Korean status strings used in the monitoring dashboard
  status: '정상' | '장애' | '지연' | '유휴';
}

export interface SummaryStats {
  // Updated status to support Korean status strings used in the monitoring dashboard
  status: '정상' | '장애' | '지연' | '유휴';
  activeCount: number;
  inactiveCount: number;
  totalReady: number;
  totalDeadLetter: number;
}
