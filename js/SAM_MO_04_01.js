// SAM_MO_04_01.js - Interface Status Monitoring

// Sample Interface Data
const interfaceData = [
    { id: 1, name: 'MQ_IVS_VCDM_SYSTEM_INFO', sender: 'WAS(IVS) VM#1', receiver: 'VCDM운용 VM#1', type: 'MQ', status: '정상', txCount: '124,501', errorCount: 0, successRate: 99.9, tps: 45, tpsDiff: 5.2, latency: 12 },
    { id: 2, name: 'MQ_VCDM_IVS_COMMAND', sender: 'VCDM운용 VM#1', receiver: 'WAS(IVS) VM#1', type: 'MQ', status: '정상', txCount: '85,200', errorCount: 0, successRate: 100.0, tps: 12, tpsDiff: -2.1, latency: 8 },
    { id: 3, name: 'REST_WEB_VCDM_AUTH_SYNC', sender: 'WEB(IVS) VM#1', receiver: 'VCDM운용 VM#2', type: 'REST', status: '지연', txCount: '12,400', errorCount: 15, successRate: 98.5, tps: 120, tpsDiff: 15.4, latency: 450 },
    { id: 4, name: 'MQ_IVS_VCDM_ALARM_EVENT', sender: 'WAS(IVS) VM#2', receiver: 'VCDM운용 VM#1', type: 'MQ', status: '장애', txCount: '45,201', errorCount: 1542, successRate: 75.2, tps: 0, tpsDiff: -100, latency: 0 },
    { id: 5, name: 'REST_VCDM_WEB_TELEMETRY', sender: 'VCDM운용 VM#2', receiver: 'WEB(IVS) VM#2', type: 'REST', status: '정상', txCount: '1,204,500', errorCount: 5, successRate: 99.9, tps: 850, tpsDiff: 8.7, latency: 5 },
    { id: 6, name: 'MQ_IVS_DB_LOG_SAVE', sender: 'WAS(IVS) VM#1', receiver: '통합DB(IVS) VM#1', type: 'MQ', status: '정상', txCount: '945,000', errorCount: 0, successRate: 99.9, tps: 210, tpsDiff: 1.5, latency: 15 },
    { id: 7, name: 'MQ_DB_VCDM_FILE_TRANS', sender: '통합DB(IVS) VM#2', receiver: 'VCDM운용 VM#2', type: 'MQ', status: '지연', txCount: '1,201', errorCount: 60, successRate: 95.0, tps: 5, tpsDiff: -12.3, latency: 1500 }
];

// Sample Transaction Logs
const transactionLogs = [
    { time: '2026.02.11 09:15:24', status: '성공', volume: '1.20', latency: '12', error: '-' },
    { time: '2026.02.11 09:15:22', status: '성공', volume: '0.80', latency: '15', error: '-' },
    { time: '2026.02.11 09:15:18', status: '실패', volume: '0.00', latency: '0', error: '404: Not Found' },
    { time: '2026.02.11 09:15:15', status: '성공', volume: '2.50', latency: '10', error: '-' },
    { time: '2026.02.11 09:15:10', status: '실패', volume: '0.00', latency: '5000', error: '504: Gateway Timeout' },
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
            <td data-label="인터페이스 명">${item.name}</td>
            <td data-label="송신 노드">${item.sender}</td>
            <td data-label="수신 노드">${item.receiver}</td>
            <td class="td-center" data-label="유형">${item.type}</td>
            <td class="td-center" data-label="상태"><span class="badge ${statusBadgeClass}">${item.status}</span></td>
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

    // Status Badge
    const statusBadgeClass = item.status === '정상' ? 'badge-success' : (item.status === '지연' ? 'badge-warning' : 'badge-error');
    const statusEl = document.getElementById('net-detail-status');
    if (statusEl) statusEl.innerHTML = `<span class="badge ${statusBadgeClass} w-fit">${item.status}</span>`;

    // Toggle Content based on type
    const historySection = document.getElementById('history-section');
    const mqItems = document.querySelectorAll('.mq-only');

    if (item.type === 'REST') {
        if (historySection) historySection.classList.remove('hidden');
        mqItems.forEach(el => el.classList.add('hidden'));
        // Render logs
        resetLogFilter();
    } else if (item.type === 'MQ') {
        if (historySection) historySection.classList.add('hidden');
        mqItems.forEach(el => el.classList.remove('hidden'));

        // Populate MQ Data (Mock)
        const depth = document.getElementById('mq-depth');
        const consumers = document.getElementById('mq-consumers');
        const lastAct = document.getElementById('mq-last-activity');

        if (depth) depth.textContent = Math.floor(Math.random() * 20).toLocaleString();
        if (consumers) consumers.textContent = (Math.floor(Math.random() * 3) + 1).toLocaleString();
        if (lastAct) {
            const now = new Date();
            lastAct.textContent = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
        }
    } else {
        if (historySection) historySection.classList.add('hidden');
        mqItems.forEach(el => el.classList.add('hidden'));
    }

    // Mobile scroll
    if (window.innerWidth < 1024) {
        document.querySelector('.split-container').classList.add('show-detail');
    }

    lucide.createIcons();
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
            <td class="td-date td-center" data-label="요청 일시">${log.time}</td>
            <td class="td-number" data-label="용량 (KB)">${volumeFormatted}</td>
            <td class="td-number" data-label="응답 시간 (ms)">${log.latency}</td>
            <td class="td-center" data-label="상태"><span class="badge ${statusBadgeClass}">${log.status}</span></td>
            <td data-label="오류 내용">${log.error}</td>
        `;

        tbody.appendChild(row);
    });
}
