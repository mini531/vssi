document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Icons
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // 2. Monitoring Groups & Node Pool
    const groups = [
        { id: 'IVS', name: 'IVS 그룹', color: '#14b8a6' },
        { id: 'VOS', name: 'VOS 그룹', color: '#3b82f6' },
        { id: 'WAS', name: 'WAS 그룹', color: '#a855f7' },
        { id: 'DB', name: '통합 DB', color: '#f59e0b' }
    ];

    const nodePool = [
        { id: 'IVS-VOS-01', name: 'VOS운용서버#1', group: 'IVS', baseLoad: 20 },
        { id: 'IVS-VOS-02', name: 'VOS운용서버#2', group: 'IVS', baseLoad: 85 },
        { id: 'IVS-VOS-03', name: 'VOS운용서버#3', group: 'IVS', baseLoad: 25 },
        { id: 'IVS-DB-01', name: '통합DB VM#1', group: 'IVS', baseLoad: 88 },
        { id: 'IVS-L2-SW', name: 'IVS L2 스위치', group: 'IVS', baseLoad: 15 },
        { id: 'VOS-VP-01', name: 'VP운용 단말#1', group: 'VOS', baseLoad: 15 },
        { id: 'VOS-VP-03', name: 'VP운용 단말#3', group: 'VOS', baseLoad: 65 },
        { id: 'VOS-GW-01', name: 'IVS 게이트웨이', group: 'VOS', baseLoad: 75 },
        { id: 'VOS-CONS-01', name: '지상 감시 콘솔', group: 'VOS', baseLoad: 60 },
        { id: 'VOS-NWICS', name: 'NWICS 콘솔', group: 'VOS', baseLoad: 82 },
        { id: 'IVS-WAS-01', name: 'WAS서버 VM#1', group: 'WAS', baseLoad: 70 },
        { id: 'IVS-WAS-02', name: 'WAS서버 VM#2', group: 'WAS', baseLoad: 30 },
        { id: 'WEB-01', name: 'WEB서버 VM#1', group: 'WAS', baseLoad: 20 },
        { id: 'SAMS-DB-PRM', name: 'SAMS DB (Main)', group: 'DB', baseLoad: 92 }
    ];

    // Real Notice Data (Integrated from SAM_BD_01_01 source logic)
    const notices = [
        { id: '5', title: '[점검] 2024년 3월 정기 시스템 점검 안내', regDate: '2024.03.10' },
        { id: '4', title: '[공지] 개인정보 처리방침 및 보안 정책 변경 안내', regDate: '2024.03.01' },
        { id: '3', title: 'SAMS v2.1 기능 업데이트 릴리즈 노트', regDate: '2024.02.20' },
        { id: '2', title: '[안내] 시스템 보안 강화를 위한 패스워드 변경 주기 단축 안내', regDate: '2024.02.10' }
    ];

    // Real Activity Logs (Integrated from SAM_LG_02_01.js)
    const activityLogs = [
        { time: '2026.02.11 14:20:12', type: '로그인', userId: 'admin.kim', userName: '김민수', message: 'Interactive session established via 192.168.1.50 using WebClient. User-Agent: Chrome/121.0.0.0.' },
        { time: '2026.02.11 13:45:30', type: '수정', userId: 'op.song', userName: '송지은', message: 'Security policy change: [SESSION_EXPIRY] updated from [1800s] to [3600s]. Scope: GLOBAL.' },
        { time: '2026.02.11 13:10:05', type: '생성', userId: 'admin.lee', userName: '이지원', message: 'New administrative role [VCDM_VIEWER] registered. Permissions: [vcdm:read]. Target system: VCDM.' },
        { time: '2026.02.11 12:30:45', type: '로그아웃', userId: 'air.kim', userName: '김동하', message: 'User requested termination of session [SID-99120]. Duration: 02:45:12.' },
        { time: '2026.02.11 11:50:22', type: '삭제', userId: 'admin.park', userName: '박준호', message: 'Permanent deletion of inactive account [temp_user] (Last Login: 2025-12-01). Associated role mappings cleared.' },
        { time: '2026.02.11 10:15:10', type: '로그인', userId: 'op.yoon', userName: '윤서진', message: 'Authorization success via SAML 2.0 Provider. Subject: op.yoon@vssi.local. IP: 192.168.1.124.' }
    ];

    const Dashboard = {
        charts: {},

        init() {
            this.initHealthGauge();
            this.initEnvelopeCharts();
            this.initLiveFeeds();
            this.initNoticeHub();
            this.startSimulation();
        },

        initHealthGauge() {
            const ctx = document.getElementById('health-gauge').getContext('2d');
            this.charts.health = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    datasets: [{
                        data: [98, 2],
                        backgroundColor: ['#14b8a6', '#1e293b'],
                        borderWidth: 0,
                        circumference: 270,
                        rotation: 225,
                        cutout: '85%'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false }, tooltip: { enabled: false } }
                }
            });
        },

        initEnvelopeCharts() {
            const chartOptions = {
                type: 'line',
                data: {
                    labels: Array(20).fill(''),
                    datasets: groups.map(g => ({
                        label: g.name,
                        data: Array(20).fill(0),
                        borderColor: g.color,
                        tension: 0.4,
                        borderWidth: 2,
                        pointRadius: 0,
                        fill: false
                    }))
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false }, tooltip: { enabled: true } },
                    scales: {
                        x: { display: false },
                        y: {
                            display: true,
                            min: 0, max: 100,
                            grid: { color: 'rgba(51, 65, 85, 0.2)' },
                            ticks: { color: '#475569', font: { size: 8 } }
                        }
                    }
                }
            };
            this.charts.cpu = new Chart(document.getElementById('chart-cpu').getContext('2d'), JSON.parse(JSON.stringify(chartOptions)));
            this.charts.latency = new Chart(document.getElementById('chart-latency').getContext('2d'), JSON.parse(JSON.stringify(chartOptions)));
        },

        updateMetrics() {
            nodePool.forEach(node => {
                node.currentCPU = Math.min(100, Math.max(0, node.baseLoad + (Math.random() * 10 - 5)));
                node.currentLat = Math.min(100, Math.max(0, (node.baseLoad / 1.5) + (Math.random() * 8 - 4)));
            });
            this.updateEnvelopeChart(this.charts.cpu, 'currentCPU');
            this.updateEnvelopeChart(this.charts.latency, 'currentLat');
            this.updateRankingList();
        },

        updateEnvelopeChart(chart, metricKey) {
            groups.forEach((group, i) => {
                const groupNodes = nodePool.filter(n => n.group === group.id);
                const maxVal = Math.max(...groupNodes.map(n => n[metricKey]));
                const dataset = chart.data.datasets[i];
                dataset.data.shift();
                dataset.data.push(maxVal);
            });
            chart.update('none');
        },

        updateRankingList() {
            const cpuRank = document.getElementById('cpu-rank-container');
            const latRank = document.getElementById('latency-rank-container');
            if (!cpuRank || !latRank) return;

            const topCPU = [...nodePool].sort((a, b) => b.currentCPU - a.currentCPU).slice(0, 5);
            const topLat = [...nodePool].sort((a, b) => b.currentLat - a.currentLat).slice(0, 5);

            cpuRank.innerHTML = topCPU.map((n, i) => this.renderRankItem(n, n.currentCPU, 'CPU', i)).join('');
            latRank.innerHTML = topLat.map((n, i) => this.renderRankItem(n, n.currentLat, 'LAT', i)).join('');
        },

        renderRankItem(node, val, type, idx) {
            const barColorClass = val > 80 ? 'bg-error' : (val > 60 ? 'bg-warning' : 'bg-teal-500');
            const textColorClass = val > 80 ? 'text-error' : (val > 60 ? 'text-warning' : '');
            return `
                <div class="db-rank-item">
                    <div class="db-rank-label">
                        <span class="db-rank-idx">${idx + 1}</span>
                        <span class="db-rank-name">${node.name}</span>
                        <span class="db-rank-group">${node.group}</span>
                    </div>
                    <div class="db-rank-metrics">
                        <div class="db-progress-container">
                            <div class="db-progress-fill ${barColorClass}" style="width: ${val}%"></div>
                        </div>
                        <span class="db-rank-value ${textColorClass}">${Math.round(val)}${type === 'CPU' ? '%' : ''}</span>
                    </div>
                </div>
            `;
        },

        initLiveFeeds() {
            const faultContainer = document.getElementById('fault-feed-container');
            const accessContainer = document.getElementById('access-log-container');

            const faults = [
                { id: 'FLT-001', time: '2026.02.11 14:30:22', system: 'SAMS DB', level: '치명적', desc: '데이터베이스 커넥션 풀 초과로 인한 지연 발생. 특정 쿼리의 락(Lock) 경합 의심.' },
                { id: 'FLT-002', time: '2026.02.11 11:20:15', system: 'IVS GW', level: '요주의', desc: 'IVS 게이트웨이 인터페이스 응답 속도 저하 (Response time > 5s)' },
                { id: 'FLT-003', time: '2026.02.10 17:50:00', system: 'VOS Node 1', level: '경미', desc: '노드 1번 CPU 사용률 80% 상회 알림' },
                { id: 'FLT-004', time: '2026.02.10 15:10:45', system: 'Network Switch A', level: '치명적', desc: '스위치 포트 05번 링크 다운 감지' }
            ];


            if (faultContainer) {
                faultContainer.innerHTML = faults.slice(0, 3).map(f => `
                    <div class="db-feed-item" onclick="location.href='SAM_SY_02_01.html?id=${f.id}'">
                        <div class="flex-between-center mb-1">
                            <span class="db-item-title ${f.level === '치명적' ? 'text-error' : (f.level === '요주의' ? 'text-warning' : '')}">${f.level}</span>
                            <span class="db-notice-date">${f.time}</span>
                        </div>
                        <div class="db-notice-link text-white">${f.system}: ${f.desc}</div>
                    </div>
                `).join('');
            }

            if (accessContainer) {
                accessContainer.innerHTML = activityLogs.slice(0, 6).map(l => {
                    const timeOnly = l.time.split(' ')[1];

                    return `
                        <div class="db-feed-item non-clickable">
                            <div class="flex-between-center">
                                <span class="db-notice-link text-white">[${l.type}] ${l.userName} (${l.userId})</span>
                                <span class="db-notice-date">${timeOnly}</span>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        },

        initNoticeHub() {
            const container = document.getElementById('dashboard-notice-list');
            if (!container) return;

            container.innerHTML = notices.slice(0, 4).map(n => `
                <div class="db-feed-item" onclick="location.href='SAM_BD_01_01.html?id=${n.id}'">
                    <div class="db-notice-link text-white mb-1">${n.title}</div>
                    <div class="db-notice-date">${n.regDate}</div>
                </div>
            `).join('');
        },

        startSimulation() {
            this.updateMetrics();
            setInterval(() => {
                const scoreSpan = document.getElementById('health-score');
                if (scoreSpan) {
                    let current = parseInt(scoreSpan.innerText);
                    current = Math.max(95, Math.min(100, current + (Math.random() > 0.5 ? 1 : -1)));
                    scoreSpan.innerText = current;
                }
                this.updateMetrics();
            }, 3000);
        }
    };

    Dashboard.init();
});
