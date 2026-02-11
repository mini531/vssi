/**
 * System Log Page Logic (SAM_LG_01_01)
 */

// Sample Log Data
const systemLogs = [
    { time: '2026.02.11 14:05:12', level: 'INFO', module: 'AUTH', errorCode: '-', message: 'Authentication provider [AzureAD] initialization started. Loading metadata from https://login.microsoftonline.com/vssi-tenant/.well-known/openid-configuration.' },
    { time: '2026.02.11 13:58:45', level: 'ERROR', module: 'DB', errorCode: 'DB_CONN_001', message: 'Unexpected rollback during transaction [TID-58291]. Caused by: resource deadlock detected while waiting for resource in session 48. LOCK_WAIT_TIMEOUT exceeded.' },
    { time: '2026.02.11 13:42:10', level: 'WARN', module: 'SERVER', errorCode: '-', message: 'High volatile memory usage detected on Node VM#2 (85.4%). Background garbage collection triggered. Threshold for auto-scaling not yet met.' },
    { time: '2026.02.11 13:30:05', level: 'INFO', module: 'API', errorCode: '-', message: 'Successfully synchronized 45 flight plan updates with K-UAM Core API. Response payload size: 1.2MB. Processing time: 340ms.' },
    { time: '2026.02.11 12:45:22', level: 'ERROR', module: 'NETWORK', errorCode: 'NET_LOSS_802', message: 'Critical packet loss (3.5%) detected between Gateway [GW-SEOUL-01] and IVS WAN. Latency spikes exceeding 500ms observed in last 5 minutes.' },
    { time: '2026.02.11 12:15:10', level: 'INFO', module: 'AUTH', errorCode: '-', message: 'System configuration policy [SECURITY_LEVEL_HIGH] applied to all instances in cluster [CL-PROD-01] by user [admin].' },
    { time: '2026.02.11 11:30:55', level: 'DEBUG', module: 'SERVER', errorCode: '-', message: 'Internal state dump: active_sessions=1240, thread_pool_utilization=0.42, gc_count_total=582, last_checkpoint_time=2026-02-11T11:25:00Z.' },
    { time: '2026.02.11 10:20:15', level: 'WARN', module: 'DB', errorCode: '-', message: 'Performance Warning: Slow query detected in transaction log indexing task. Execution time [2.8s] exceeds threshold [2.5s]. Query: SELECT * FROM trans_logs WHERE timestamp > ...' },
    { time: '2026.02.11 09:15:30', level: 'INFO', module: 'SERVER', errorCode: '-', message: 'Daily integrity check for system binaries completed. 4,520 files verified. No unauthorized modifications detected.' },
    { time: '2026.02.11 08:45:12', level: 'ERROR', module: 'API', errorCode: 'AUTH_FAIL_403', message: 'Inbound request security handshake failed. SSL Exception: Peer certificate for 203.0.113.44 has expired or is not yet valid (NotBefore: 2026-01-01, NotAfter: 2026-02-10).' },
    { time: '2026.02.10 23:30:00', level: 'INFO', module: 'SERVER', errorCode: '-', message: 'Automated full system backup archive [backup_PROD_20260210.tar.gz] successfully uploaded to secondary storage [S3-SEOUL-LOGS]. Size: 14.5GB.' }
];

document.addEventListener('DOMContentLoaded', () => {
    // Set default dates
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('filter-date-start').value = today;
    document.getElementById('filter-date-end').value = today;

    // Initial Render
    renderLogs(systemLogs);
});

// Render Logs Table
function renderLogs(logs) {
    const body = document.getElementById('log-body');
    const totalCount = document.getElementById('total-count');

    body.innerHTML = '';
    totalCount.innerText = `총 ${logs.length} 건`;

    logs.forEach(log => {
        const row = document.createElement('tr');
        row.className = 'data-table-row';

        // Level Badge Class
        let badgeClass = 'badge-default';
        if (log.level === 'ERROR') badgeClass = 'badge-error';
        else if (log.level === 'WARN') badgeClass = 'badge-warning';
        else if (log.level === 'INFO') badgeClass = 'badge-info';
        else if (log.level === 'DEBUG') badgeClass = 'badge-purple';

        // Conditional Error Code: Only show if Level is ERROR
        const errorCodeDisplay = log.level === 'ERROR' ? log.errorCode : '-';

        row.innerHTML = `
            <td class="td-date">${log.time}</td>
            <td class="td-center"><span class="badge ${badgeClass}">${log.level}</span></td>
            <td class="td-center">${log.module}</td>
            <td>${errorCodeDisplay}</td>
            <td>${log.message}</td>
        `;
        body.appendChild(row);
    });

    if (logs.length === 0) {
        body.innerHTML = `
            <tr>
                <td colspan="5" class="py-20 text-center text-slate-500">
                    <div class="flex flex-col items-center gap-2">
                        <i data-lucide="search-x" class="w-8 h-8 opacity-20"></i>
                        <span>조건에 맞는 로그 데이터가 없습니다.</span>
                    </div>
                </td>
            </tr>
        `;
        if (window.lucide) lucide.createIcons();
    }
}


// Apply Filters
function applyFilter() {
    const level = document.getElementById('filter-level').value;
    const module = document.getElementById('filter-module').value;
    const errorCode = document.getElementById('filter-error-code').value.trim().toUpperCase();

    const filtered = systemLogs.filter(log => {
        const matchLevel = level === 'all' || log.level === level;
        const matchModule = module === 'all' || log.module === module;
        const matchErrorCode = !errorCode || log.errorCode.toUpperCase().includes(errorCode);

        return matchLevel && matchModule && matchErrorCode;
    });

    renderLogs(filtered);

}

// Reset Filters
function resetFilter() {
    document.getElementById('filter-level').value = 'all';
    document.getElementById('filter-module').value = 'all';
    document.getElementById('filter-error-code').value = '';

    const today = new Date().toISOString().split('T')[0];
    document.getElementById('filter-date-start').value = today;
    document.getElementById('filter-date-end').value = today;

    renderLogs(systemLogs);
}

// Download Logs (Real CSV Generation)
function downloadLogs() {
    if (systemLogs.length === 0) return;

    if (window.vssi && typeof window.vssi.showLoading === 'function') {
        window.vssi.showLoading('로그 파일을 생성 중입니다...');

        setTimeout(() => {
            generateAndDownloadCSV();
            window.vssi.hideLoading();
        }, 1000);
    } else {
        generateAndDownloadCSV();
    }
}

function generateAndDownloadCSV() {
    // CSV Headers
    const headers = ['발생 일시', '로그 레벨', '모듈', '오류 코드', '메시지'];

    // Convert data to CSV rows
    const rows = systemLogs.map(log => [
        log.time,
        log.level,
        log.module,
        log.level === 'ERROR' ? log.errorCode : '-',
        `"${log.message.replace(/"/g, '""')}"` // Wrap message in quotes & escape internal quotes
    ]);

    // Combine headers and rows
    const csvContent = [
        '\uFEFF' + headers.join(','), // Add BOM for Excel Korean support
        ...rows.map(r => r.join(','))
    ].join('\n');

    // Create Blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0].replace(/-/g, '');
    const filename = `system_logs_${dateStr}.csv`;

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
