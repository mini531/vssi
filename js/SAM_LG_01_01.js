/**
 * System Log Page Logic (SAM_LG_01_01)
 */

// Sample Log Data (Comprehensive Error List)
const systemLogs = [
    { time: '2026.02.11 15:30:12', severity: '높음', errorCode: '500', message: '내부 서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' },
    { time: '2026.02.11 14:55:05', severity: '높음', errorCode: '503', message: '현재 서비스 이용이 불가능합니다. (서버 과부하)' },
    { time: '2026.02.11 14:20:45', severity: '보통', errorCode: '401', message: '인증 정보가 유효하지 않습니다. 다시 로그인해 주세요.' },
    { time: '2026.02.11 13:10:22', severity: '낮음', errorCode: '404', message: '요청하신 페이지를 찾을 수 없습니다. (URL 오류)' },
    { time: '2026.02.11 12:05:18', severity: '높음', errorCode: '504', message: '서버 응답 시간이 초과되었습니다. 네트워크 상태를 확인하세요.' },
    { time: '2026.02.11 11:40:30', severity: '보통', errorCode: '403', message: '접근 권한이 없습니다. 관리자에게 문의하세요.' },
    { time: '2026.02.11 10:15:12', severity: '낮음', errorCode: '400', message: '잘못된 요청 형식입니다. 입력값을 확인해 주세요.' },
    { time: '2026.02.11 09:50:45', severity: '높음', errorCode: '502', message: '배드 게이트웨이 오류: 상위 서버로부터 잘못된 응답을 받았습니다.' },
    { time: '2026.02.10 23:45:10', severity: '낮음', errorCode: '408', message: '클라이언트 요청 시간 초과: 연결이 끊겼습니다.' },
    { time: '2026.02.10 22:30:00', severity: '보통', errorCode: '429', message: '너무 많은 요청이 발생했습니다. 잠시 대기 후 이용해 주세요.' }
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

        // Severity Badge Class
        let badgeClass = 'badge-default';
        if (log.severity === '높음') badgeClass = 'badge-error';
        else if (log.severity === '보통') badgeClass = 'badge-warning';
        else if (log.severity === '낮음') badgeClass = 'badge-info';

        row.innerHTML = `
            <td class="td-date" data-label="발생 일시">${log.time}</td>
            <td class="td-center" data-label="심각도"><span class="badge ${badgeClass}">${log.severity}</span></td>
            <td data-label="오류 코드">${log.errorCode}</td>
            <td class="td-message" data-label="메시지">${log.message}</td>
        `;
        body.appendChild(row);
    });

    if (logs.length === 0) {
        body.innerHTML = `
            <tr>
                <td colspan="4" class="py-20 text-center text-slate-500">
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
    const severity = document.getElementById('filter-severity').value;
    const errorCode = document.getElementById('filter-error-code').value.trim().toUpperCase();

    const filtered = systemLogs.filter(log => {
        const matchSeverity = severity === 'all' || log.severity === severity;
        const matchErrorCode = !errorCode || log.errorCode.toUpperCase().includes(errorCode);

        return matchSeverity && matchErrorCode;
    });

    renderLogs(filtered);

}

// Reset Filters
function resetFilter() {
    document.getElementById('filter-severity').value = 'all';
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
    const headers = ['발생 일시', '심각도', '오류 코드', '메시지'];

    // Convert data to CSV rows
    const rows = systemLogs.map(log => [
        log.time,
        log.severity,
        log.errorCode,
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
