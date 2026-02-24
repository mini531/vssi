// SAM_MO_04_01.js - Interface Status Monitoring

// Sample Interface Data
const interfaceData = [
    { id: 1, name: 'MQ_IVS_VOS_SYS_INFO', sender: 'IVS', receiver: 'VOS', type: 'MQ', status: '정상', txCount: '124,501', errorCount: 0, successRate: 99.9, tps: 45, tpsDiff: 5.2, latency: 12 },
    { id: 2, name: 'MQ_VOS_IVS_DRONE_CMD', sender: 'VOS', receiver: 'IVS', type: 'MQ', status: '정상', txCount: '85,200', errorCount: 0, successRate: 100.0, tps: 12, tpsDiff: -2.1, latency: 8 },
    { id: 3, name: 'REST_AUTH_TOKEN_SYNC', sender: 'IVS', receiver: 'CEC', type: 'REST', status: '지연', txCount: '12,400', errorCount: 15, successRate: 98.5, tps: 120, tpsDiff: 15.4, latency: 450 },
    { id: 4, name: 'MQ_ALARM_EVENT_SEND', sender: 'IVS', receiver: 'VOS', type: 'MQ', status: '장애', txCount: '45,201', errorCount: 1542, successRate: 75.2, tps: 0, tpsDiff: -100, latency: 0 },
    { id: 5, name: 'REST_VOS_TELEMETRY', sender: 'VOS', receiver: 'IVS', type: 'REST', status: '정상', txCount: '1,204,500', errorCount: 5, successRate: 99.9, tps: 850, tpsDiff: 8.7, latency: 5 },
    { id: 6, name: 'MQ_DB_LOG_STORAGE', sender: 'IVS', receiver: 'DB', type: 'MQ', status: '정상', txCount: '945,000', errorCount: 0, successRate: 99.9, tps: 210, tpsDiff: 1.5, latency: 15 },
    { id: 7, name: 'MQ_FILE_TRANSFER', sender: 'VOS', receiver: 'NAS', type: 'MQ', status: '지연', txCount: '1,201', errorCount: 60, successRate: 95.0, tps: 5, tpsDiff: -12.3, latency: 1500 }
];

// Sample Transaction Logs
const transactionLogs = [
    { time: '2026.02.11 09:15:24', status: '성공', volume: '1.20', latency: '12', error: '-' },
    { time: '2026.02.11 09:15:22', status: '성공', volume: '0.80', latency: '15', error: '-' },
    { time: '2026.02.11 09:15:18', status: '실패', volume: '0.00', latency: '0', error: 'MQ_ERR_2041: Connection Timeout' },
    { time: '2026.02.11 09:15:15', status: '성공', volume: '2.50', latency: '10', error: '-' },
    { time: '2026.02.11 09:15:10', status: '실패', volume: '0.00', latency: '2500', error: 'SYS_BUSY: Processing Overload' },
    { time: '2026.02.11 09:15:05', status: '성공', volume: '1.40', latency: '14', error: '-' }
];

let filteredData = [...interfaceData];
let filteredLogs = [...transactionLogs];
let currentInterface = null;

// Initialize
document.addEventListener('DOMContentLoaded', function () {
    renderInterfaceList();
    lucide.createIcons();
});

// Generic Toggle Filter
function toggleFilter(idPrefix) {
    const content = document.getElementById(`${idPrefix}-content`);
    const chevron = document.getElementById(`${idPrefix}-chevron`);
    if (content && chevron) {
        content.classList.toggle('hidden');
        chevron.classList.toggle('rotate-180');
    }
}

// Reset Filter
function resetFilter() {
    document.getElementById('filter-sender').value = 'all';
    document.getElementById('filter-receiver').value = 'all';
    document.getElementById('filter-type').value = 'all';
    document.getElementById('filter-status').value = 'all';
    document.getElementById('filter-keyword').value = '';
    applyFilter();
}

// Apply Filter
function applyFilter() {
    const senderFilter = document.getElementById('filter-sender').value;
    const receiverFilter = document.getElementById('filter-receiver').value;
    const typeFilter = document.getElementById('filter-type').value;
    const statusFilter = document.getElementById('filter-status').value;
    const keyword = document.getElementById('filter-keyword').value.toLowerCase();

    filteredData = interfaceData.filter(item => {
        const senderMatch = senderFilter === 'all' || item.sender === senderFilter;
        const receiverMatch = receiverFilter === 'all' || item.receiver === receiverFilter;
        const typeMatch = typeFilter === 'all' || item.type === typeFilter;
        const statusMatch = statusFilter === 'all' || item.status === statusFilter;
        const keywordMatch = !keyword || item.name.toLowerCase().includes(keyword);
        return senderMatch && receiverMatch && typeMatch && statusMatch && keywordMatch;
    });

    renderInterfaceList();
}

// Render Interface List
function renderInterfaceList() {
    const tbody = document.getElementById('list-body');
    const totalCount = document.getElementById('total-count');

    tbody.innerHTML = '';
    totalCount.textContent = `총 ${filteredData.length} 건`;

    filteredData.forEach(item => {
        const row = document.createElement('tr');
        row.className = 'data-table-row clickable-row';
        row.onclick = () => selectInterface(item, row);

        const statusBadgeClass = item.status === '정상' ? 'badge-success' :
            item.status === '지연' ? 'badge-warning' : 'badge-error';

        row.innerHTML = `
            <td data-label="Name">${item.name}</td>
            <td data-label="Sender">${item.sender}</td>
            <td data-label="Receiver">${item.receiver}</td>
            <td class="td-center" data-label="Type">${item.type}</td>
            <td class="td-center" data-label="Status"><span class="badge ${statusBadgeClass}">${item.status}</span></td>
        `;

        tbody.appendChild(row);
    });

    lucide.createIcons();
}

// Select Interface
function selectInterface(item, element) {
    currentInterface = item;

    // Update Active Row
    document.querySelectorAll('#list-body .data-table-row').forEach(r => r.classList.remove('active'));
    if (element) element.classList.add('active');

    // Hide empty state, show detail
    document.getElementById('empty-state').classList.add('hidden');
    document.getElementById('detail-content').classList.remove('hidden');

    // Populate summary info
    document.getElementById('selected-interface-name').textContent = item.name;
    document.getElementById('net-detail-source').textContent = item.sender;
    document.getElementById('net-detail-target').textContent = item.receiver;
    document.getElementById('net-detail-type').textContent = item.type;

    const statusBadgeClass = item.status === '정상' ? 'badge-success' : (item.status === '지연' ? 'badge-warning' : 'badge-error');
    document.getElementById('net-detail-status').innerHTML = `<span class="badge ${statusBadgeClass} w-fit">${item.status}</span>`;

    // Restart Charts
    ChartManager.startMonitoring();

    // Render logs
    resetLogFilter();

    // Mobile scroll
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
    ChartManager.stopAll();
}

// Reset Log Filter
function resetLogFilter() {
    document.getElementById('filter-log-status').value = 'all';
    document.getElementById('filter-log-date-start').value = '';
    document.getElementById('filter-log-date-end').value = '';
    applyLogFilter();
}

// Apply Log Filter
function applyLogFilter() {
    const statusFilter = document.getElementById('filter-log-status').value;
    const dateStart = document.getElementById('filter-log-date-start').value;
    const dateEnd = document.getElementById('filter-log-date-end').value;

    filteredLogs = transactionLogs.filter(log => {
        const statusMatch = statusFilter === 'all' || log.status === statusFilter;

        let dateMatch = true;
        if (dateStart || dateEnd) {
            const logDate = log.time.split(' ')[0].replace(/\./g, '-');
            if (dateStart && logDate < dateStart) dateMatch = false;
            if (dateEnd && logDate > dateEnd) dateMatch = false;
        }

        return statusMatch && dateMatch;
    });

    renderLogs();
}

// Render Logs
function renderLogs() {
    const tbody = document.getElementById('log-body');
    const totalCount = document.getElementById('log-total-count');

    tbody.innerHTML = '';
    if (totalCount) totalCount.textContent = `총 ${filteredLogs.length} 건`;

    filteredLogs.forEach(log => {
        const row = document.createElement('tr');
        row.className = 'data-table-row';

        const statusBadgeClass = log.status === '성공' ? 'badge-success' : 'badge-error';

        const volumeFormatted = parseFloat(log.volume).toFixed(2);

        row.innerHTML = `
            <td class="td-date td-center" data-label="Time">${log.time}</td>
            <td class="td-number" data-label="Volume">${volumeFormatted}</td>
            <td class="td-number" data-label="Latency">${log.latency}</td>
            <td class="td-center" data-label="Status"><span class="badge ${statusBadgeClass}">${log.status}</span></td>
            <td data-label="Error">${log.error}</td>
        `;

        tbody.appendChild(row);
    });
}

// --- Real-time Chart Logic ---
const ChartManager = {
    intervals: [],

    startMonitoring: function () {
        this.stopAll();
        this.runChart('chart-tps', 1000, true);
        this.runChart('chart-latency', 1000, false, 500);
        this.runChart('chart-volume', 1024 * 50, true, null, 'KB');
    },

    stopAll: function () {
        this.intervals.forEach(clearInterval);
        this.intervals = [];
    },

    formatValue: function (val, unit) {
        if (unit === 'KB') {
            if (val >= 1024) return `${(val / 1024).toFixed(1)} MB`;
            return `${Math.floor(val)} KB`;
        }
        return val.toLocaleString();
    },

    runChart: function (canvasId, maxScale, showHistory = false, threshold = null, unit = '') {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const parent = canvas.parentElement;

        const resize = () => {
            canvas.width = parent.clientWidth;
            canvas.height = parent.clientHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const dataPoints = 30;
        const currentData = new Array(dataPoints).fill(0).map(() => Math.random() * maxScale * 0.5);
        const historyValue = Math.random() * maxScale * 0.4 + (maxScale * 0.1);

        let primaryColor = canvasId === 'chart-tps' ? '#10b981' :
            canvasId === 'chart-volume' ? '#3b82f6' : '#6366f1';
        const historyColor = 'rgba(148, 163, 184, 0.4)';
        const gridColor = '#1e293b';

        const update = () => {
            const width = canvas.width;
            const height = canvas.height;

            // Generate next random point
            const nextVal = Math.floor(Math.random() * (maxScale * 0.8)) + (maxScale * 0.1);
            currentData.shift();
            currentData.push(nextVal);

            // Update Value Label in Footer
            const valueLabelId = canvasId === 'chart-tps' ? 'val-tps-current' :
                canvasId === 'chart-latency' ? 'val-latency-current' : 'val-volume-current';
            const valEl = document.getElementById(valueLabelId);
            if (valEl) {
                valEl.textContent = this.formatValue(nextVal, unit);
            }

            // Dynamic Color Change if threshold exceeded (Latency chart)
            if (threshold !== null) {
                const isOverThreshold = currentData.some(d => d > threshold);
                primaryColor = isOverThreshold ? '#ef4444' : '#3b82f6';
            }

            ctx.clearRect(0, 0, width, height);

            // 1. Threshold Line & Label (Latency)
            if (threshold !== null) {
                const ty = height - (threshold / maxScale) * height;
                ctx.beginPath();
                ctx.strokeStyle = '#ef4444';
                ctx.setLineDash([5, 5]);
                ctx.moveTo(0, ty);
                ctx.lineTo(width, ty);
                ctx.stroke();
                ctx.setLineDash([]);

                // Threshold Label
                ctx.fillStyle = '#ef4444';
                ctx.font = 'bold 10px Inter';
                ctx.textAlign = 'right';
                ctx.fillText('Limit (500ms)', width - 5, ty - 5);
            }

            // 2. Previous Day Average Line (TPS)
            if (showHistory) {
                const hy = height - (historyValue / maxScale) * height;
                ctx.beginPath();
                ctx.strokeStyle = historyColor;
                ctx.lineWidth = 1;
                ctx.setLineDash([10, 5]);
                ctx.moveTo(0, hy);
                ctx.lineTo(width, hy);
                ctx.stroke();
                ctx.setLineDash([]);

                // Label for average
                ctx.fillStyle = historyColor;
                ctx.font = '10px Inter';
                ctx.textAlign = 'left';
                ctx.fillText(`Yest. Avg: ${this.formatValue(historyValue, unit)}`, 5, hy - 5);
            }

            const step = width / (dataPoints - 1);

            // 3. Current Path
            ctx.beginPath();
            ctx.strokeStyle = primaryColor;
            ctx.lineWidth = 2;
            for (let i = 0; i < currentData.length; i++) {
                const x = i * step;
                const normalize = (currentData[i] / maxScale) * height;
                const y = height - normalize;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();

            // 4. Gradient Fill
            const grad = ctx.createLinearGradient(0, 0, 0, height);
            grad.addColorStop(0, primaryColor + '44'); // Slightly subtler
            grad.addColorStop(1, primaryColor + '00');
            ctx.fillStyle = grad;
            ctx.lineTo(width, height);
            ctx.lineTo(0, height);
            ctx.fill();
        };

        const interval = setInterval(update, 2000);
        this.intervals.push(interval);
        update();
    }
};
