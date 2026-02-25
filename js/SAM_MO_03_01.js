// SAM_MO_03_01.js - Network Traffic Monitoring

// Sample Network Data
const networkData = [
    { id: 1, source: 'VOS운용서버#1', target: 'IVS L2스위치', status: '정상', lastUpdate: '2026.02.10 16:40' },
    { id: 2, source: 'VOS운용서버#2', target: 'IVS L2스위치', status: '정상', lastUpdate: '2026.02.10 16:40' },
    { id: 3, source: 'VOS운용서버#3', target: 'IVS L2스위치', status: '정상', lastUpdate: '2026.02.10 16:40' },
    { id: 4, source: 'VOS운용서버#4', target: 'IVS L2스위치', status: '정상', lastUpdate: '2026.02.10 16:40' },
    { id: 5, source: 'WAS서버(IVS) VM#1', target: 'IVS L2스위치', status: '정상', lastUpdate: '2026.02.10 16:40' },
    { id: 6, source: 'WAS서버(IVS) VM#2', target: 'IVS L2스위치', status: '정상', lastUpdate: '2026.02.10 16:40' },
    { id: 7, source: 'WEB서버(IVS) VM#1', target: 'IVS L2스위치', status: '정상', lastUpdate: '2026.02.10 16:40' },
    { id: 8, source: 'WEB서버(IVS) VM#2', target: 'IVS L2스위치', status: '정상', lastUpdate: '2026.02.10 16:40' },
    { id: 9, source: '통합DB서버(IVS) VM#1', target: 'IVS L2스위치', status: '정상', lastUpdate: '2026.02.10 16:40' },
    { id: 10, source: '통합DB서버(IVS) VM#2', target: 'IVS L2스위치', status: '정상', lastUpdate: '2026.02.10 16:40' },
    { id: 11, source: 'VCDM운용서버 VM#1', target: 'IVS L2스위치', status: '정상', lastUpdate: '2026.02.10 16:40' },
    { id: 12, source: 'VCDM운용서버 VM#2', target: 'IVS L2스위치', status: '위험', lastUpdate: '2026.02.10 16:40' },
    { id: 13, source: 'IVS L2스위치', target: 'CEC 미들웨어', status: '위험', lastUpdate: '2026.02.10 16:40' },
    { id: 14, source: 'CEC 미들웨어', target: 'IVS L3스위치', status: '정상', lastUpdate: '2026.02.10 16:40' },
    { id: 15, source: 'IVS L3스위치', target: 'WAN', status: '정상', lastUpdate: '2026.02.10 16:40' }
];

// Sample Failure History Data
const failureHistoryData = [
    { date: '2026.02.10 09:00', status: 'Critical', content: '패킷 손실율 80% 초과' },
    { date: '2026.02.09 14:30', status: 'Warning', content: '응답 지연 (Lat > 200ms)' },
    { date: '2026.02.08 11:15', status: 'Critical', content: '연결 끊김 (Timeout)' },
    { date: '2026.02.07 16:45', status: 'Warning', content: '대역폭 사용률 90% 초과' },
    { date: '2026.02.06 08:20', status: 'Critical', content: '패킷 손실율 75% 초과' }
];

let filteredNetworkData = [...networkData];
let filteredFailureData = [...failureHistoryData];
let currentNetwork = null;

// Initialize
document.addEventListener('DOMContentLoaded', function () {
    renderNetworkList();
    lucide.createIcons();

    // Check URL Parameters for auto-selection
    const urlParams = new URLSearchParams(window.location.search);
    const sourceParam = urlParams.get('source');
    const targetParam = urlParams.get('target');

    if (sourceParam && targetParam) {
        const matchingNet = networkData.find(n => n.source === sourceParam && n.target === targetParam);
        if (matchingNet) {
            // Find the row element
            setTimeout(() => {
                const rows = document.querySelectorAll('#network-list-body .data-table-row');
                const matchingRow = Array.from(rows).find(row =>
                    row.cells[0].textContent === sourceParam && row.cells[1].textContent === targetParam
                );
                selectNetwork(matchingNet, matchingRow);
            }, 100);
        }
    }
});

// Toggle Network Filter
function toggleNetworkFilter() {
    const content = document.getElementById('network-filter-content');
    const chevron = document.getElementById('network-filter-chevron');
    content.classList.toggle('hidden');
    chevron.classList.toggle('rotate-180');
}

// Reset Network Filter
function resetNetworkFilter() {
    document.getElementById('filter-network-status').value = 'all';
    document.getElementById('filter-network-type').value = 'all';
    document.getElementById('filter-network-keyword').value = '';
    applyNetworkFilter();
}

// Apply Network Filter
function applyNetworkFilter() {
    const statusFilter = document.getElementById('filter-network-status').value;
    const typeFilter = document.getElementById('filter-network-type').value;
    const keyword = document.getElementById('filter-network-keyword').value.toLowerCase();

    filteredNetworkData = networkData.filter(net => {
        const statusMatch = statusFilter === 'all' || net.status === statusFilter;

        let keywordMatch = true;
        if (keyword) {
            if (typeFilter === 'all') {
                keywordMatch = net.source.toLowerCase().includes(keyword) ||
                    net.target.toLowerCase().includes(keyword);
            } else if (typeFilter === 'start') {
                keywordMatch = net.source.toLowerCase().includes(keyword);
            } else if (typeFilter === 'end') {
                keywordMatch = net.target.toLowerCase().includes(keyword);
            }
        }

        return statusMatch && keywordMatch;
    });

    renderNetworkList();
}

// Render Network List
function renderNetworkList() {
    const tbody = document.getElementById('network-list-body');
    const totalCount = document.getElementById('network-total-count');

    tbody.innerHTML = '';
    totalCount.textContent = `총 ${filteredNetworkData.length} 건`;

    filteredNetworkData.forEach((net, index) => {
        const row = document.createElement('tr');
        row.className = 'data-table-row clickable-row';
        row.onclick = () => selectNetwork(net, row);

        const statusBadgeClass = net.status === '정상' ? 'badge-success' :
            net.status === '위험' ? 'badge-warning' : 'badge-error';

        row.innerHTML = `
            <td data-label="송신 노드">${net.source}</td>
            <td data-label="수신 노드">${net.target}</td>
            <td class="td-center" data-label="상태"><span class="badge ${statusBadgeClass}">${net.status}</span></td>
            <td class="td-date" data-label="최근 갱신 일시">${net.lastUpdate}</td>
        `;

        tbody.appendChild(row);
    });

    lucide.createIcons();
}

// Select Network
function selectNetwork(net, element) {
    currentNetwork = net;

    // Update Active Row
    document.querySelectorAll('#network-list-body .data-table-row').forEach(r => r.classList.remove('active'));
    if (element) element.classList.add('active');

    // Hide empty state, show detail
    document.getElementById('empty-state').classList.add('hidden');
    document.getElementById('detail-content').classList.remove('hidden');

    // Populate detail info
    document.getElementById('selected-network-name').textContent = `${net.source} > ${net.target}`;
    document.getElementById('net-detail-source').textContent = net.source;
    document.getElementById('net-detail-target').textContent = net.target;

    const statusBadgeClass = net.status === '정상' ? 'badge-success' :
        net.status === '위험' ? 'badge-warning' : 'badge-error';
    document.getElementById('net-detail-status').innerHTML =
        `<span class="badge ${statusBadgeClass} w-fit">${net.status}</span>`;

    // Initialize Chart
    ChartManager.stopAll();
    ChartManager.startNetworkMonitoring();

    // Render failure history
    renderFailureHistory();

    // Mobile: Show detail pane
    if (window.innerWidth < 1024) {
        document.querySelector('.split-container').classList.add('show-detail');
    }

    lucide.createIcons();
}

// Close Detail Pane (Mobile)
function closeDetailPane() {
    document.querySelector('.split-container').classList.remove('show-detail');
    ChartManager.stopAll();
}

// Toggle Failure Filter
function toggleFailureFilter() {
    const content = document.getElementById('failure-filter-content');
    const chevron = document.getElementById('failure-filter-chevron');
    content.classList.toggle('hidden');
    chevron.classList.toggle('rotate-180');
}

// Reset Failure Filter
function resetFailureFilter() {
    document.getElementById('filter-failure-status').value = 'all';
    document.getElementById('filter-date-start').value = '';
    document.getElementById('filter-date-end').value = '';
    applyFailureFilter();
}

// Apply Failure Filter
function applyFailureFilter() {
    const statusFilter = document.getElementById('filter-failure-status').value;
    const dateStart = document.getElementById('filter-date-start').value;
    const dateEnd = document.getElementById('filter-date-end').value;

    filteredFailureData = failureHistoryData.filter(item => {
        const statusMatch = statusFilter === 'all' || item.status === statusFilter;

        let dateMatch = true;
        if (dateStart || dateEnd) {
            const itemDate = item.date.split(' ')[0].replace(/\./g, '-');
            if (dateStart && itemDate < dateStart) dateMatch = false;
            if (dateEnd && itemDate > dateEnd) dateMatch = false;
        }

        return statusMatch && dateMatch;
    });

    renderFailureHistory();
}

// Render Failure History
function renderFailureHistory() {
    const tbody = document.getElementById('failure-history-body');
    const totalCount = document.getElementById('failure-total-count');

    tbody.innerHTML = '';
    totalCount.textContent = `총 ${filteredFailureData.length} 건`;

    filteredFailureData.forEach(item => {
        const row = document.createElement('tr');
        row.className = 'data-table-row';

        const statusBadgeClass = item.status === 'Critical' ? 'badge-error' : 'badge-warning';

        row.innerHTML = `
            <td class="td-date" data-label="발생 일시">${item.date}</td>
            <td class="td-center" data-label="상태"><span class="badge ${statusBadgeClass}">${item.status}</span></td>
            <td data-label="내용">${item.content}</td>
        `;

        tbody.appendChild(row);
    });

    lucide.createIcons();
}

// --- Real-time Chart Logic (Network Traffic) ---
const ChartManager = {
    intervals: [],
    charts: {},

    startNetworkMonitoring: function () {
        this.stopAll();
        this.runChart('chart-network', 'val-net', 'net');
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
            // Generate random value
            let newVal = 0;
            let label = '';

            if (type === 'net') {
                newVal = Math.floor(Math.random() * 60) + 20;
                label = `S: ${Math.floor(newVal / 2)} Kbps / R: ${newVal * 2} Kbps`;
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
