document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Icons
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // 2. Monitoring Groups & Node Pool
    const groups = [
        { id: 'VOS_RUN', name: 'VOS운용서버', color: '#14b8a6' },
        { id: 'WAS_RUN', name: 'WAS서버', color: '#3b82f6' },
        { id: 'WEB_RUN', name: 'WEB서버', color: '#a855f7' },
        { id: 'DB_TOTAL', name: '통합DB', color: '#f59e0b' },
        { id: 'VCDM_RUN', name: 'VCDM운용서버', color: '#ef4444' },
        { id: 'VP_RUN', name: 'VP운용 단말', color: '#10b981' },
        { id: 'ALONE_SRV', name: '단독 서버', color: '#6366f1' }
    ];

    const nodePool = [
        { id: 'VOS-01', name: 'VOS운용서버#1', group: 'VOS_RUN', baseLoad: 20 },
        { id: 'WAS-01', name: 'WAS서버#1', group: 'WAS_RUN', baseLoad: 35 },
        { id: 'WEB-01', name: 'WEB서버#1', group: 'WEB_RUN', baseLoad: 25 },
        { id: 'DB-01', name: '통합DB#1', group: 'DB_TOTAL', baseLoad: 90 },
        { id: 'VCDM-01', name: 'VCDM운용서버#1', group: 'VCDM_RUN', baseLoad: 15 },
        { id: 'VP-01', name: 'VP운용 단말#1', group: 'VP_RUN', baseLoad: 10 },
        { id: 'SRV-01', name: '단독 서버#1', group: 'ALONE_SRV', baseLoad: 50 }
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
        { time: '2026.02.11 14:20:12', type: '로그인', userId: 'admin.kim', userName: '김민수' },
        { time: '2026.02.11 12:30:45', type: '로그아웃', userId: 'air.kim', userName: '김동하' },
        { time: '2026.02.11 10:15:10', type: '로그인', userId: 'op.yoon', userName: '윤서진' },
        { time: '2026.02.10 18:20:15', type: '로그아웃', userId: 'vp.song', userName: '송태태' },
        { time: '2026.02.10 14:10:00', type: '로그인', userId: 'admin.jung', userName: '정우성' },
        { time: '2026.02.10 09:30:45', type: '로그아웃', userId: 'op.song', userName: '송지은' }
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
                            ticks: {
                                color: '#94a3b8',
                                font: { size: 8 },
                                mirror: true,
                                padding: -10
                            }
                        }
                    },
                    layout: {
                        padding: { left: -5, right: 0, top: 0, bottom: 0 }
                    }
                }
            };
            this.charts.cpu = new Chart(document.getElementById('chart-cpu').getContext('2d'), JSON.parse(JSON.stringify(chartOptions)));

            // 2.2 Registration Status Chart (7 Days Bar Chart)
            const signupCtx = document.getElementById('chart-signup').getContext('2d');
            const last7Days = Array.from({ length: 7 }, (_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - (6 - i));
                return `${d.getMonth() + 1}/${d.getDate()}`;
            });

            this.charts.signup = new Chart(signupCtx, {
                type: 'bar',
                data: {
                    labels: last7Days,
                    datasets: [{
                        label: '등록 건 수',
                        data: [12, 18, 15, 22, 19, 25, 14], // Simulated dynamic data
                        backgroundColor: 'rgba(20, 184, 166, 0.6)',
                        borderColor: '#14b8a6',
                        borderWidth: 1,
                        borderRadius: 2,
                        maxBarThickness: 10
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: { enabled: true }
                    },
                    scales: {
                        x: {
                            grid: { display: false },
                            ticks: { color: '#475569', font: { size: 10 } }
                        },
                        y: {
                            beginAtZero: true,
                            grid: { color: 'rgba(51, 65, 85, 0.2)' },
                            ticks: {
                                color: '#94a3b8',
                                font: { size: 10 },
                                mirror: true,
                                padding: -10
                            }
                        }
                    },
                    layout: {
                        padding: { left: -5, right: 0, top: 10, bottom: 0 }
                    }
                }
            });
        },

        updateMetrics() {
            nodePool.forEach(node => {
                node.currentCPU = Math.min(100, Math.max(0, node.baseLoad + (Math.random() * 10 - 5)));
                node.currentMem = Math.min(100, Math.max(0, (node.baseLoad / 1.2) + (Math.random() * 8 - 4)));
            });
            this.updateEnvelopeChart(this.charts.cpu, 'currentCPU');
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
            const memRank = document.getElementById('latency-rank-container');
            if (!cpuRank || !memRank) return;

            const topCPU = [...nodePool].sort((a, b) => b.currentCPU - a.currentCPU).slice(0, 5);
            const topMem = [...nodePool].sort((a, b) => b.currentMem - a.currentMem).slice(0, 5);

            cpuRank.innerHTML = topCPU.map((n, i) => this.renderRankItem(n, n.currentCPU, 'CPU', i)).join('');
            memRank.innerHTML = topMem.map((n, i) => this.renderRankItem(n, n.currentMem, 'MEM', i)).join('');
        },

        renderRankItem(node, val, type, idx) {
            const barColorClass = val > 80 ? 'bg-error' : (val > 60 ? 'bg-warning' : 'bg-success');
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
                        <span class="db-rank-value ${textColorClass}">${Math.round(val)}%</span>
                    </div>
                </div>
            `;
        },

        initLiveFeeds() {
            const faultContainer = document.getElementById('fault-feed-container');
            const accessContainer = document.getElementById('access-log-container');

            const faults = [
                { id: 'FLT-001', time: '2026.02.11 14:30:22', system: 'IVMS (버티포트 통합 관리 시스템)', status: '조치중' },
                { id: 'FLT-002', time: '2026.02.11 11:20:15', system: 'IFPS (통합 비행 계획 관리 시스템)', status: '접수' },
                { id: 'FLT-003', time: '2026.02.10 17:50:00', system: 'IFRS (통합 운항 예약 시스템)', status: '완료' },
                { id: 'FLT-004', time: '2026.02.10 15:10:45', system: 'V-CDM (협동적 의사 결정 지원 시스템)', status: '완료' }
            ];


            if (faultContainer) {
                faultContainer.innerHTML = faults.slice(0, 3).map(f => {
                    const statusClass = f.status === '완료' ? 'text-success' : (f.status === '조치중' ? 'text-info' : 'text-secondary');
                    return `
                        <div class="db-feed-item" onclick="location.href='SAM_SY_02_01.html?id=${f.id}'">
                            <div class="flex-between-center mb-1">
                                <span class="db-item-title ${statusClass}">${f.status}</span>
                                <span class="db-notice-date">${f.time}</span>
                            </div>
                            <div class="db-notice-link text-white">${f.system}</div>
                        </div>
                    `;
                }).join('');
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

            container.innerHTML = notices.slice(0, 3).map(n => `
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

    // Health Info Modal Logic
    window.openHealthInfoModal = function () {
        const modal = document.getElementById('health-info-modal');
        if (modal) {
            modal.classList.add('active');
            if (window.lucide) {
                window.lucide.createIcons({
                    nameAttr: 'data-lucide',
                    root: modal
                });
            }
        }
    };

    window.closeHealthInfoModal = function () {
        const modal = document.getElementById('health-info-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    };

    /**
     * Chart Legend Horizontal Scroll
     * @param {string} id - Legend container ID
     * @param {number} distance - Scroll distance
     */
    window.scrollLegend = function (id, distance) {
        const container = document.getElementById(id);
        if (container) {
            container.scrollBy({
                left: distance,
                behavior: 'smooth'
            });
        }
    };
});
