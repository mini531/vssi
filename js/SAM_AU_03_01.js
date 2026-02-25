/**
 * Security Policy Settings - IP Access Management Logic (SAM_AU_03_01)
 */

// Sample IP Data
let ipData = [
    { id: 1, ip: '10.10.10.11', desc: 'SAMS 메인 서버 #1', user: '홍길동', date: '2026.02.01 10:15:30' },
    { id: 2, ip: '10.10.10.12', desc: 'SAMS 메인 서버 #2 (Slave)', user: '이나영', date: '2026.02.01 10:15:45' },
    { id: 3, ip: '172.16.50.0/24', desc: '강남 관제실 단말 전용 대역', user: '최민수', date: '2026.02.10 14:22:10' },
    { id: 4, ip: '211.238.10.55', desc: '운항사 A 인터페이스 GW', user: '박보검', date: '2026.02.15 09:30:00' },
    { id: 5, ip: '192.168.1.100', desc: '테스트용 노트북 (관리자)', user: '홍길동', date: '2026.02.20 18:05:12' }
];

let pendingDeleteId = null;

document.addEventListener('DOMContentLoaded', () => {
    init();
});

function init() {
    renderIpList(ipData);
    lucide.createIcons();
}

/**
 * Render IP Table
 */
function renderIpList(data) {
    const tbody = document.getElementById('ip-list-body');
    const totalCount = document.getElementById('total-count');

    tbody.innerHTML = '';
    totalCount.textContent = `총 ${data.length} 건`;

    if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="td-center">등록된 IP 정보가 없습니다.</td></tr>`;
        return;
    }

    data.forEach((item) => {
        const tr = document.createElement('tr');
        tr.className = 'data-table-row';
        tr.innerHTML = `
            <td data-label="IP 주소" class="font-mono text-teal-400">${item.ip}</td>
            <td data-label="설명" class="table-text-wrap">${item.desc || '-'}</td>
            <td data-label="등록자">${item.user || '홍길동'}</td>
            <td data-label="등록 일시" class="td-center td-date">${item.date}</td>
            <td data-label="관리" class="td-center">
                <button class="text-slate-400 hover:text-red-400 transition-colors" title="삭제" onclick="showDeleteWarning(${item.id})">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    lucide.createIcons();
}

/**
 * Filter Logic
 */
window.toggleFilter = function () {
    const content = document.getElementById('filter-content');
    const chevron = document.getElementById('filter-chevron');
    const isHidden = content.classList.toggle('hidden');
    if (chevron) chevron.style.transform = isHidden ? 'rotate(0deg)' : 'rotate(180deg)';
};

window.applyFilter = function () {
    const ip = document.getElementById('filter-ip').value.toLowerCase();
    const user = document.getElementById('filter-user').value.toLowerCase();
    const desc = document.getElementById('filter-desc').value.toLowerCase();

    const filtered = ipData.filter(item => {
        const matchIp = !ip || item.ip.toLowerCase().includes(ip);
        const matchUser = !user || (item.user && item.user.toLowerCase().includes(user));
        const matchDesc = !desc || (item.desc && item.desc.toLowerCase().includes(desc));
        return matchIp && matchUser && matchDesc;
    });

    renderIpList(filtered);
};

window.resetFilter = function () {
    document.getElementById('filter-ip').value = '';
    document.getElementById('filter-user').value = '';
    document.getElementById('filter-desc').value = '';
    renderIpList(ipData);
};

/**
 * Registration Logic
 */
window.openRegistrationModal = function (e) {
    if (e) e.stopPropagation(); // Prevent filter toggle

    document.getElementById('reg-ip').value = '';
    document.getElementById('reg-desc').value = '';
    clearErrors();

    document.getElementById('registration-modal').classList.add('active');
    lucide.createIcons();
};

window.closeRegistrationModal = function () {
    document.getElementById('registration-modal').classList.remove('active');
};

window.confirmRegistration = function () {
    const ip = document.getElementById('reg-ip').value;

    clearErrors();
    let hasError = false;

    if (!ip.trim()) {
        setError('reg-ip', '접근 IP 주소를 입력해 주세요.');
        hasError = true;
    } else if (!validateIp(ip)) {
        setError('reg-ip', '유효한 IP 주소 또는 CIDR, 와일드카드 형식이 아닙니다.');
        hasError = true;
    }

    if (hasError) return;

    document.getElementById('confirm-save-modal').classList.add('active');
    lucide.createIcons();
};

window.processRegistration = function () {
    const ip = document.getElementById('reg-ip').value;
    const desc = document.getElementById('reg-desc').value;
    const fullDate = getFullTimestamp();

    const newItem = {
        id: Date.now(),
        ip,
        desc,
        user: '홍길동', // Fixed to a Korean name for mock
        date: fullDate
    };

    ipData.unshift(newItem);
    renderIpList(ipData);

    closeConfirmSaveModal();
    closeRegistrationModal();

    showSuccessModal('IP 정보가 저장되었습니다.', '저장 완료');
};

window.closeConfirmSaveModal = function () {
    document.getElementById('confirm-save-modal').classList.remove('active');
};

/**
 * Standardized Deletion Logic (Match SAM_US_01_01)
 */
window.showDeleteWarning = function (id) {
    pendingDeleteId = id;
    document.getElementById('delete-confirm-modal').classList.add('active');
    lucide.createIcons();
};

window.closeDeleteConfirm = function () {
    document.getElementById('delete-confirm-modal').classList.remove('active');
    pendingDeleteId = null;
};

window.confirmDeleteAction = function () {
    if (!pendingDeleteId) return;

    ipData = ipData.filter(item => item.id !== pendingDeleteId);
    renderIpList(ipData);

    closeDeleteConfirm();
    showSuccessModal('IP 정보가 삭제되었습니다.', '삭제 완료');
};

/**
 * Standardized Success Modal Logic
 */
function showSuccessModal(message, title) {
    document.getElementById('success-modal-title').textContent = title || '완료';
    document.getElementById('success-message').textContent = message;
    document.getElementById('success-modal').classList.add('active');
    lucide.createIcons();
}

window.closeSuccessModal = function () {
    document.getElementById('success-modal').classList.remove('active');
};

/**
 * Helpers
 */
function setError(id, msg) {
    const el = document.getElementById(id);
    const err = document.getElementById('error-' + id);
    if (el) el.classList.add('error');
    if (err) err.textContent = msg;
}

window.resetError = function (id) {
    const el = document.getElementById(id);
    const err = document.getElementById('error-' + id);
    if (el) el.classList.remove('error');
    if (err) err.textContent = '';
};

function clearErrors() {
    ['reg-ip'].forEach(id => resetError(id));
}

function validateIp(ip) {
    // IPv4, CIDR, or Wildcard (e.g. 192.168.*.*)
    const ipv4 = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const cidr = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\/(?:[1-2]?[0-9]|3[0-2])$/;
    const wildcard = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|\*)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|\*)$/;
    return ipv4.test(ip) || cidr.test(ip) || wildcard.test(ip);
}

function getFullTimestamp() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    return `${y}.${m}.${d} ${hh}:${mm}:${ss}`;
}
