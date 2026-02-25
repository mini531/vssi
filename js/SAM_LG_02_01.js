/**
 * User Activity Log Page Logic (SAM_LG_02_01)
 */

// Sample Activity Log Data
// Sample Activity Log Data
const activityLogs = [
    { time: '2026.02.11 14:20:12', type: '로그인', userId: 'admin.kim', userName: '김민수' },
    { time: '2026.02.11 12:30:45', type: '로그아웃', userId: 'air.kim', userName: '김동하' },
    { time: '2026.02.11 10:15:10', type: '로그인', userId: 'op.yoon', userName: '윤서진' },
    { time: '2026.02.10 18:20:15', type: '로그아웃', userId: 'vp.song', userName: '송태태' },
    { time: '2026.02.10 14:10:00', type: '로그인', userId: 'admin.jung', userName: '정우성' },
    { time: '2026.02.10 09:30:45', type: '로그아웃', userId: 'op.song', userName: '송지은' }
];

document.addEventListener('DOMContentLoaded', () => {
    // Set default dates
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('filter-date-start').value = today;
    document.getElementById('filter-date-end').value = today;

    // Initial Render
    renderLogs(activityLogs);
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

        row.innerHTML = `
            <td class="td-date" data-label="발생 일시">${log.time}</td>
            <td data-label="아이디">${log.userId}</td>
            <td data-label="이름">${log.userName}</td>
            <td data-label="로그 유형">${log.type}</td>
        `;
        body.appendChild(row);
    });

    if (logs.length === 0) {
        body.innerHTML = `
            <tr>
                <td colspan="4" class="py-20 text-center text-slate-500">
                    <div class="flex flex-col items-center gap-2">
                        <i data-lucide="search-x" class="w-8 h-8 opacity-20"></i>
                        <span>조건에 맞는 활동 로그 데이터가 없습니다.</span>
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
    const userId = document.getElementById('filter-user-id').value.trim().toLowerCase();
    const userName = document.getElementById('filter-user-name').value.trim().toLowerCase();

    const filtered = activityLogs.filter(log => {
        const matchType = type === 'all' || log.type === type;
        const matchUserId = !userId || log.userId.toLowerCase().includes(userId);
        const matchUserName = !userName || log.userName.toLowerCase().includes(userName);

        return matchType && matchUserId && matchUserName;
    });

    renderLogs(filtered);
}

// Reset Filters
function resetFilter() {
    document.getElementById('filter-type').value = 'all';
    document.getElementById('filter-user-id').value = '';
    document.getElementById('filter-user-name').value = '';

    const today = new Date().toISOString().split('T')[0];
    document.getElementById('filter-date-start').value = today;
    document.getElementById('filter-date-end').value = today;

    renderLogs(activityLogs);
}

// Download Logs (CSV Generation)
function downloadLogs() {
    if (activityLogs.length === 0) return;

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
    const headers = ['발생 일시', '아이디', '이름', '로그 유형'];

    const rows = activityLogs.map(log => [
        log.time,
        log.userId,
        log.userName,
        log.type
    ]);

    const csvContent = [
        '\uFEFF' + headers.join(','),
        ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0].replace(/-/g, '');
    const filename = `activity_logs_${dateStr}.csv`;

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
