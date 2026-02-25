/**
 * User Activity Log Page Logic (SAM_LG_02_01)
 */

// Sample Activity Log Data
// Sample Activity Log Data
const activityLogs = [
    { time: '2026.02.11 14:20:12', type: '로그인', userId: 'admin.kim', userName: '김민수', message: 'Interactive session established via 192.168.1.50 using WebClient. User-Agent: Chrome/121.0.0.0.' },
    { time: '2026.02.11 13:45:30', type: '수정', userId: 'op.song', userName: '송지은', message: 'Security policy change: [SESSION_EXPIRY] updated from [1800s] to [3600s]. Scope: GLOBAL.' },
    { time: '2026.02.11 13:10:05', type: '생성', userId: 'admin.lee', userName: '이지원', message: 'New administrative role [VCDM_VIEWER] registered. Permissions: [vcdm:read]. Target system: VCDM.' },
    { time: '2026.02.11 12:30:45', type: '로그아웃', userId: 'air.kim', userName: '김동하', message: 'User requested termination of session [SID-99120]. Duration: 02:45:12.' },
    { time: '2026.02.11 11:50:22', type: '삭제', userId: 'admin.park', userName: '박준호', message: 'Permanent deletion of inactive account [temp_user] (Last Login: 2025-12-01). Associated role mappings cleared.' },
    { time: '2026.02.11 10:15:10', type: '로그인', userId: 'op.yoon', userName: '윤서진', message: 'Authorization success via SAML 2.0 Provider. Subject: op.yoon@vssi.local. IP: 192.168.1.124.' },
    { time: '2026.02.11 09:40:05', type: '수정', userId: 'admin.choi', userName: '최유나', message: 'Role mapping update: Added [NET_ADAPT_VIEW] to group [OPERATOR]. Affects 12 users.' },
    { time: '2026.02.11 09:10:00', type: '로그인', userId: 'admin.jung', userName: '정우성', message: 'Superuser login detected from secure bastion host. Address: 10.20.30.44. MFA verified.' },
    { time: '2026.02.10 18:20:15', type: '로그아웃', userId: 'vp.song', userName: '송태태', message: 'Implicit session logout due to inactivity timeout (IDLE_TIME > 3600s).' },
    { time: '2026.02.10 17:45:12', type: '생성', userId: 'admin.kim', userName: '김민수', message: 'Resource addition: New common code group [ERR_TYPE_ENUM] defined with 5 literals.' },
    { time: '2026.02.10 16:30:00', type: '수정', userId: 'admin.lee', userName: '이지원', message: 'Global password complexity requirement [MIN_SPECIAL_CHARS] updated from [1] to [2].' }
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
            <td class="td-message" data-label="메시지">${log.message}</td>
        `;
        body.appendChild(row);
    });

    if (logs.length === 0) {
        body.innerHTML = `
            <tr>
                <td colspan="5" class="py-20 text-center text-slate-500">
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
    const headers = ['발생 일시', '아이디', '이름', '로그 유형', '메시지'];

    const rows = activityLogs.map(log => [
        log.time,
        log.userId,
        log.userName,
        log.type,
        `"${log.message.replace(/"/g, '""')}"`
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
