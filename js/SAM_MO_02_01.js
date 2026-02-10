// SAM_MO_02_01.js - Hardware Monitoring

// Sample Hardware Data
const hardwareData = [
    { id: 1, type: '통합', name: 'VOS운용서버#1', status: '정상', lastUpdate: '2026.02.10 16:20' },
    { id: 2, type: '통합', name: 'VOS운용서버#2', status: '장애', lastUpdate: '2026.02.10 16:19' },
    { id: 3, type: '통합', name: 'VOS운용서버#3', status: '정상', lastUpdate: '2026.02.10 16:20' },
    { id: 4, type: '통합', name: 'VOS운용서버#4', status: '정상', lastUpdate: '2026.02.10 16:20' },
    { id: 5, type: '통합', name: 'WAS서버(IVS) VM#1', status: '위험', lastUpdate: '2026.02.10 16:18' },
    { id: 6, type: '통합', name: 'WAS서버(IVS) VM#2', status: '정상', lastUpdate: '2026.02.10 16:20' },
    { id: 7, type: '통합', name: 'WEB서버(IVS) VM#1', status: '정상', lastUpdate: '2026.02.10 16:20' },
    { id: 8, type: '통합', name: 'WEB서버(IVS) VM#2', status: '정상', lastUpdate: '2026.02.10 16:20' },
    { id: 9, type: '통합', name: '통합DB서버(IVS) VM#1', status: '위험', lastUpdate: '2026.02.10 16:17' },
    { id: 10, type: '통합', name: '통합DB서버(IVS) VM#2', status: '정상', lastUpdate: '2026.02.10 16:20' },
    { id: 11, type: '통합', name: 'VCDM운용서버 VM#1', status: '정상', lastUpdate: '2026.02.10 16:20' },
    { id: 12, type: '통합', name: 'VCDM운용서버 VM#2', status: '정상', lastUpdate: '2026.02.10 16:20' },
    { id: 13, type: '단독', name: 'CEC 미들웨어', status: '정상', lastUpdate: '2026.02.10 16:20' },
    { id: 14, type: '연동', name: 'VP운용 단말 #1', status: '정상', lastUpdate: '2026.02.10 16:20' },
    { id: 15, type: '연동', name: 'VP운용 단말 #2', status: '정상', lastUpdate: '2026.02.10 16:20' },
    { id: 16, type: '연동', name: 'VP운용 단말 #3', status: '위험', lastUpdate: '2026.02.10 16:18' },
    { id: 17, type: '연동', name: 'VP운용 단말 #4', status: '정상', lastUpdate: '2026.02.10 16:20' },
    { id: 18, type: '연동', name: '지상 감시 콘솔', status: '위험', lastUpdate: '2026.02.10 16:15' },
    { id: 19, type: '연동', name: '상황 인식 콘솔', status: '정상', lastUpdate: '2026.02.10 16:20' },
    { id: 20, type: '연동', name: 'NWICS 콘솔', status: '장애', lastUpdate: '2026.02.10 16:10' },
    { id: 21, type: '연동', name: 'MSDP', status: '정상', lastUpdate: '2026.02.10 16:20' },
    { id: 22, type: '연동', name: '감시SW 중앙 서버', status: '위험', lastUpdate: '2026.02.10 16:16' },
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
        row.className = 'data-table-row';
        row.onclick = () => selectHardware(hw);

        const statusBadgeClass = hw.status === '정상' ? 'badge-success' :
            hw.status === '위험' ? 'badge-warning' : 'badge-error';

        row.innerHTML = `
            <td>${hw.type}</td>
            <td>${hw.name}</td>
            <td class="td-center"><span class="badge ${statusBadgeClass}">${hw.status}</span></td>
            <td class="td-date">${hw.lastUpdate}</td>
        `;

        tbody.appendChild(row);
    });

    lucide.createIcons();
}

// Select Hardware
function selectHardware(hw) {
    currentHardware = hw;

    // Hide empty state, show detail
    document.getElementById('empty-state').classList.add('hidden');
    document.getElementById('detail-content').classList.remove('hidden');

    // Populate header
    document.getElementById('selected-hardware-name').textContent = hw.name;

    // Populate detail info
    document.getElementById('hw-detail-type').textContent = hw.type;
    document.getElementById('hw-detail-name').textContent = hw.name;

    const statusBadgeClass = hw.status === '정상' ? 'badge-success' :
        hw.status === '위험' ? 'badge-warning' : 'badge-error';
    document.getElementById('hw-detail-status').innerHTML =
        `<span class="badge ${statusBadgeClass} w-fit">${hw.status}</span>`;

    // Initialize/Update Charts
    initCharts();

    // Mobile: Show detail pane
    const detailPane = document.getElementById('detail-pane');
    if (window.innerWidth < 1024) {
        detailPane.classList.add('mobile-detail-active');
    }

    lucide.createIcons();
}

// Close Detail Pane (Mobile)
function closeDetailPane() {
    const detailPane = document.getElementById('detail-pane');
    detailPane.classList.remove('mobile-detail-active');
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

        const primaryColor = '#3b82f6'; // Main blue
        const gridColor = '#334155';

        const update = () => {
            // Generate random value based on type
            let newVal = 0;
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
                label = `Active ${newVal}%`;
            }

            // Shift data
            data.push(newVal);
            data.shift();

            // Update Label
            const valEl = document.getElementById(valueId);
            if (valEl) valEl.textContent = label;

            // Draw
            ctx.clearRect(0, 0, width, height);

            // Grid
            ctx.beginPath();
            ctx.strokeStyle = gridColor;
            ctx.lineWidth = 0.5;
            // Vertical lines
            for (let i = 0; i < width; i += width / 10) { ctx.moveTo(i, 0); ctx.lineTo(i, height); }
            // Horizontal lines
            for (let i = 0; i < height; i += height / 4) { ctx.moveTo(0, i); ctx.lineTo(width, i); }
            ctx.stroke();

            // Path
            ctx.beginPath();
            ctx.strokeStyle = primaryColor;
            ctx.lineWidth = 2;
            ctx.fillStyle = 'rgba(59, 130, 246, 0.2)'; // fill blue alpha

            ctx.moveTo(0, height);

            const step = width / (dataPoints - 1);

            for (let i = 0; i < data.length; i++) {
                const x = i * step;
                const normalize = (data[i] / 100) * height; // assume 0-100 scale
                const y = height - normalize;
                ctx.lineTo(x, y);
            }

            ctx.lineTo(width, height);
            ctx.closePath();
            ctx.fill();

            // Stroke line on top
            ctx.beginPath();
            for (let i = 0; i < data.length; i++) {
                const x = i * step;
                const normalize = (data[i] / 100) * height;
                const y = height - normalize;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        };

        const interval = setInterval(update, 1000); // 1 sec update
        this.intervals.push(interval);
        update(); // initial draw
    }
};
