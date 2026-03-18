// SAM_MO_02_01.js - Hardware Monitoring

// Sample Hardware Data
const hardwareData = [
    { id: 1, type: '통합', name: 'VOS운용서버#1', status: '정상', lastUpdate: '2026.02.10 16:20' },
    { id: 2, type: '통합', name: 'VOS운용서버#2', status: '장애', lastUpdate: '2026.02.10 16:19' },
    { id: 3, type: '통합', name: 'VOS운용서버#3', status: '정상', lastUpdate: '2026.02.10 16:20' },
    { id: 4, type: '통합', name: 'VOS운용서버#4', status: '정상', lastUpdate: '2026.02.10 16:20' },
    { id: 5, type: '통합', name: 'WAS서버(IVS) VM#1', status: '정상', lastUpdate: '2026.02.10 16:18' },
    { id: 6, type: '통합', name: 'WAS서버(IVS) VM#2', status: '정상', lastUpdate: '2026.02.10 16:20' },
    { id: 7, type: '통합', name: 'WEB서버(IVS) VM#1', status: '정상', lastUpdate: '2026.02.10 16:20' },
    { id: 8, type: '통합', name: 'WEB서버(IVS) VM#2', status: '정상', lastUpdate: '2026.02.10 16:20' },
    { id: 9, type: '통합', name: '통합DB서버(IVS) VM#1', status: '정상', lastUpdate: '2026.02.10 16:17' },
    { id: 10, type: '통합', name: '통합DB서버(IVS) VM#2', status: '정상', lastUpdate: '2026.02.10 16:20' },
    { id: 11, type: '통합', name: 'VCDM운용서버 VM#1', status: '정상', lastUpdate: '2026.02.10 16:20' },
    { id: 12, type: '통합', name: 'VCDM운용서버 VM#2', status: '정상', lastUpdate: '2026.02.10 16:20' },
    { id: 13, type: '단독', name: 'CEC 미들웨어', status: '정상', lastUpdate: '2026.02.10 16:20' },
    { id: 14, type: '연동', name: 'VP운용 단말 #1', status: '정상', lastUpdate: '2026.02.10 16:20' },
    { id: 15, type: '연동', name: 'VP운용 단말 #2', status: '정상', lastUpdate: '2026.02.10 16:20' },
    { id: 16, type: '연동', name: 'VP운용 단말 #3', status: '정상', lastUpdate: '2026.02.10 16:18' },
    { id: 17, type: '연동', name: 'VP운용 단말 #4', status: '정상', lastUpdate: '2026.02.10 16:20' },
    { id: 18, type: '연동', name: '지상 감시 콘솔', status: '정상', lastUpdate: '2026.02.10 16:15' },
    { id: 19, type: '연동', name: '상황 인식 콘솔', status: '정상', lastUpdate: '2026.02.10 16:20' },
    { id: 20, type: '연동', name: 'NWICS 콘솔', status: '장애', lastUpdate: '2026.02.10 16:10' },
    { id: 21, type: '연동', name: 'MSDP', status: '정상', lastUpdate: '2026.02.10 16:20' },
    { id: 22, type: '연동', name: '감시SW 중앙 서버', status: '정상', lastUpdate: '2026.02.10 16:16' },
    { id: 23, type: '연동', name: 'ADSB 수신기', status: '정상', lastUpdate: '2026.02.10 16:20' },
    { id: 24, type: '단독', name: '취약점 분석 장치', status: '정상', lastUpdate: '2026.02.10 16:20' },
    { id: 25, type: '연동', name: '고정카메라 영상처리 서버', status: '정상', lastUpdate: '2026.02.10 16:20' },
    { id: 26, type: '연동', name: 'PTZ카메라 영상처리 서버', status: '정상', lastUpdate: '2026.02.10 16:20' }
];

let filteredData = [...hardwareData];
let currentHardware = null;

// Charts
let cpuChart, memChart, diskChart;

// Initialize
document.addEventListener('DOMContentLoaded', function () {
    renderHardwareList();
    lucide.createIcons();
});

// Toggle Filter
function toggleHardwareFilter() {
    const content = document.getElementById('hardware-filter-content');
    const chevron = document.getElementById('hardware-filter-chevron');
    content.classList.toggle('hidden');
    chevron.classList.toggle('rotate-180');
}

// Reset Filter
function resetHardwareFilter() {
    document.getElementById('filter-hardware-type').value = 'all';
    document.getElementById('filter-hardware-status').value = 'all';
    document.getElementById('filter-hardware-name').value = '';
    applyHardwareFilter();
}

// Apply Filter
function applyHardwareFilter() {
    const typeFilter = document.getElementById('filter-hardware-type').value;
    const statusFilter = document.getElementById('filter-hardware-status').value;
    const nameFilter = document.getElementById('filter-hardware-name').value.toLowerCase();

    filteredData = hardwareData.filter(hw => {
        const typeMatch = typeFilter === 'all' || hw.type === typeFilter;
        const statusMatch = statusFilter === 'all' || hw.status === statusFilter;
        const nameMatch = !nameFilter || hw.name.toLowerCase().includes(nameFilter);
        return typeMatch && statusMatch && nameMatch;
    });

    renderHardwareList();
}

// Render Hardware List
function renderHardwareList() {
    const tbody = document.getElementById('hardware-list-body');
    const totalCount = document.getElementById('hardware-total-count');

    tbody.innerHTML = '';
    totalCount.textContent = `총 ${filteredData.length} 건`;

    filteredData.forEach((hw, index) => {
        const row = document.createElement('tr');
        row.className = 'data-table-row clickable-row';
        row.onclick = () => selectHardware(hw, row);

        const statusBadgeClass = hw.status === '정상' ? 'badge-success' : 'badge-error';

        row.innerHTML = `
            <td data-label="구분">${hw.type}</td>
            <td data-label="이름">${hw.name}</td>
            <td class="td-center" data-label="상태"><span class="badge ${statusBadgeClass}">${hw.status}</span></td>
            <td class="td-date" data-label="최근 갱신 일시">${hw.lastUpdate}</td>
        `;

        tbody.appendChild(row);
    });

    lucide.createIcons();
}

function selectHardware(hw, element) {
    currentHardware = hw;

    // Update Active Row
    document.querySelectorAll('#hardware-list-body .data-table-row').forEach(r => r.classList.remove('active'));
    if (element) element.classList.add('active');

    // Hide empty state, show detail
    document.getElementById('empty-state').classList.add('hidden');
    document.getElementById('detail-content').classList.remove('hidden');

    // Populate header
    document.getElementById('selected-hardware-name').textContent = hw.name;

    // Populate detail info
    document.getElementById('hw-detail-type').textContent = hw.type;
    document.getElementById('hw-detail-name').textContent = hw.name;

    const statusBadgeClass = hw.status === '정상' ? 'badge-success' : 'badge-error';
    document.getElementById('hw-detail-status').innerHTML =
        `<span class="badge ${statusBadgeClass} w-fit">${hw.status}</span>`;

    // Initialize/Update Charts
    initCharts();

    // Disk Usage Data (32TB Scale)
    const totalDisk = 32.00;
    const usedDisk = (Math.random() * 10 + 12).toFixed(2); // 12.00 ~ 22.00 TB
    const usagePercent = (usedDisk / totalDisk * 100).toFixed(1);

    const usageTextEl = document.getElementById('disk-usage-text');
    const usageBarEl = document.getElementById('disk-usage-bar');

    if (usageTextEl) usageTextEl.textContent = `${usedDisk} TB / ${totalDisk.toFixed(2)} TB (${usagePercent}%)`;
    if (usageBarEl) usageBarEl.style.width = `${usagePercent}%`;

    // Mobile: Show detail pane
    if (window.innerWidth < 1024) {
        document.querySelector('.split-container').classList.add('show-detail');
    }

    lucide.createIcons();
}


// Initialize Charts
function initCharts() {
    ChartManager.stopAll();
    ChartManager.startServerMonitoring();
}

// --- Real-time Chart Logic (Task Manager Style) ---
const ChartManager = {
    intervals: [],
    charts: {},

    init: function () {
        // Initial setup if needed
    },

    startServerMonitoring: function () {
        this.stopAll();
        // CPU Chart
        this.runChart('chart-cpu', 'val-cpu-current', 'cpu');
        // Memory Chart
        this.runChart('chart-mem', 'val-mem-current', 'mem');
        // Disk Chart
        this.runChart('chart-disk', 'val-disk-current', 'disk');
        // Network Chart
        this.runChart('chart-net', 'val-net-current', 'net');
    },

    stopAll: function () {
        this.intervals.forEach(clearInterval);
        this.intervals = [];
    },

    runChart: function (canvasId, valueId, type) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let width = canvas.parentElement.clientWidth;
        let height = canvas.parentElement.clientHeight;
        canvas.width = width;
        canvas.height = height;

        // Data history
        const dataPoints = 60;
        const data = new Array(dataPoints).fill(0);
        const data2 = type === 'net' ? new Array(dataPoints).fill(0) : null;

        const primaryColor = type === 'net' ? '#6142FE' : '#3b82f6'; // Purple for Inbound
        const secondaryColor = '#3b82f6'; // Blue for Outbound
        const gridColor = '#334155';

        const update = () => {
            // Generate random value based on type
            let newVal = 0;
            let newVal2 = 0;
            let label = '';

            if (type === 'cpu') {
                newVal = Math.floor(Math.random() * 30) + 5; // 5-35%
                label = `${newVal}%`;
            } else if (type === 'mem') {
                newVal = Math.floor(Math.random() * 10) + 40; // 40-50%
                label = `8.4 / 16.0 GB (${newVal}%)`;
            } else if (type === 'disk') {
                if (Math.random() > 0.7) newVal = Math.floor(Math.random() * 80);
                else newVal = Math.floor(Math.random() * 5);
                label = `IO ${newVal}%`;
            } else if (type === 'net') {
                newVal = (Math.random() * 20 + 10).toFixed(1); // 10-30 Mbps
                newVal2 = (Math.random() * 15 + 5).toFixed(1); // 5-20 Mbps
                label = `수신: ${newVal} Mbps / 송신: ${newVal2} Mbps`;
            }

            // Shift data
            data.push(Number(newVal));
            data.shift();
            if (data2) {
                data2.push(Number(newVal2));
                data2.shift();
            }

            // Update Label
            const valEl = document.getElementById(valueId);
            if (valEl) valEl.textContent = label;

            // Draw
            ctx.clearRect(0, 0, width, height);

            // Grid
            ctx.beginPath();
            ctx.strokeStyle = gridColor;
            ctx.lineWidth = 0.5;
            for (let i = 0; i < width; i += width / 10) { ctx.moveTo(i, 0); ctx.lineTo(i, height); }
            for (let i = 0; i < height; i += height / 4) { ctx.moveTo(0, i); ctx.lineTo(width, i); }
            ctx.stroke();

            const step = width / (dataPoints - 1);

            // Draw Dual Lines or Single Line
            const drawLine = (dataSet, color, fillAlpha) => {
                ctx.beginPath();
                ctx.strokeStyle = color;
                ctx.lineWidth = 2;
                if (fillAlpha) ctx.fillStyle = fillAlpha;

                ctx.moveTo(0, height);
                for (let i = 0; i < dataSet.length; i++) {
                    const x = i * step;
                    const normalize = (dataSet[i] / (type === 'net' ? 50 : 100)) * height;
                    const y = height - normalize;
                    ctx.lineTo(x, y);
                }

                if (fillAlpha) {
                    ctx.lineTo(width, height);
                    ctx.lineTo(0, height);
                    ctx.fill();
                } else {
                    ctx.stroke();
                }
            };

            if (type === 'net') {
                drawLine(data, primaryColor, 'rgba(20, 184, 166, 0.1)');
                drawLine(data2, secondaryColor, 'rgba(59, 130, 246, 0.1)');
                // Strokes
                drawLine(data, primaryColor);
                drawLine(data2, secondaryColor);
            } else {
                drawLine(data, primaryColor, 'rgba(59, 130, 246, 0.2)');
                drawLine(data, primaryColor);
            }
        };

        const interval = setInterval(update, 1000);
        this.intervals.push(interval);
        update();
    }
};
