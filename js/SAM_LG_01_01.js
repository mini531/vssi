/**
 * System Log Page Logic (SAM_LG_01_01)
 */

// Sample Log Data (Comprehensive Error List)
const systemLogs = [
    { time: '2026.02.11 15:30:12', type: '시스템', severity: '높음', errorCode: 'SYS-500', content: '메인 컨트롤러 응답 지연 발생 (임계치 초과)' },
    { time: '2026.02.11 14:55:05', type: '보안', severity: '높음', errorCode: 'SEC-101', content: '미인증 장비 보안 게이트 접속 시도 차단' },
    { time: '2026.02.11 14:20:45', type: '네트워크', severity: '보통', errorCode: 'NET-201', content: '서브넷 게이트웨이 #3 일시적 패킷 유실 발생' },
    { time: '2026.02.11 13:10:22', type: '시스템', severity: '낮음', errorCode: 'SYS-001', content: '인터페이스 엔진 정기 헬스체크 완료' },
    { time: '2026.02.11 12:05:18', type: '데이터베이스', severity: '높음', errorCode: 'DB-504', content: '로그 보관용 저장소 스토리지 용량 부족 (95% 초과)' },
    { time: '2026.02.11 11:40:30', type: '보안', severity: '보통', errorCode: 'SEC-005', content: 'SSH 비정상 접속 시도 5회 감지 (IP: 10.50.2.11)' },
    { time: '2026.02.11 10:15:12', type: '네트워크', severity: '낮음', errorCode: 'NET-110', content: '백업 링크 전환 테스트 성공 (수서 버티포트)' },
    { time: '2026.02.11 09:50:45', type: '시스템', severity: '높음', errorCode: 'SYS-502', content: 'API 게이트웨이 서비스 프로세스 강제 종료 후 재시작됨' },
    { time: '2026.02.10 23:45:10', type: '데이터베이스', severity: '낮음', errorCode: 'DB-100', content: '일일 트랜잭션 아카이브 백업 작업 완료' },
    { time: '2026.02.10 22:30:00', type: '보안', severity: '높음', errorCode: 'SEC-403', content: '인가되지 않은 API 호출 거부됨 (Token Expired)' }
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
            <td  data-label="발생 유형">${log.type || '-'}</td>
            <td class="td-center" data-label="심각도"><span class="badge ${badgeClass}">${log.severity}</span></td>
            <td class="td-center" data-label="오류 코드">${log.errorCode}</td>
            <td class="td-message" data-label="오류 내용">${log.content}</td>
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
    const type = document.getElementById('filter-type').value;
    const severity = document.getElementById('filter-severity').value;
    const errorCode = document.getElementById('filter-error-code').value.trim().toUpperCase();

    const filtered = systemLogs.filter(log => {
        const matchType = type === 'all' || log.type === type;
        const matchSeverity = severity === 'all' || log.severity === severity;
        const matchErrorCode = !errorCode || log.errorCode.toUpperCase().includes(errorCode);

        return matchType && matchSeverity && matchErrorCode;
    });

    renderLogs(filtered);

}

// Reset Filters
function resetFilter() {
    document.getElementById('filter-type').value = 'all';
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
    const headers = ['발생 일시', '발생 유형', '심각도', '오류 코드', '오류 내용'];

    // Convert data to CSV rows
    const rows = systemLogs.map(log => [
        log.time,
        log.type || '-',
        log.severity,
        log.errorCode,
        `"${log.content.replace(/"/g, '""')}"` // Wrap content in quotes & escape internal quotes
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
