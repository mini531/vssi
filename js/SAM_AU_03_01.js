/**
 * Security Policy Settings - IP Access Management Logic (SAM_AU_03_01)
 */

// Sample IP Data
let ipData = [
    { id: 1, ip: '10.10.10.11', mac: '00:0C:29:43:2F:C8', purpose: '통합 서버 운영', reqName: '홍길동', reqDept: '시스템관리팀', user: '관리자', date: '2026.02.01 10:15:30' },
    { id: 2, ip: '10.10.10.12', mac: '00:0C:29:43:2F:C9', purpose: '통합 서버 운영 (이중화)', reqName: '이나영', reqDept: '운영기획팀', user: '관리자', date: '2026.02.01 10:15:45' },
    { id: 3, ip: '172.16.50.10', mac: '00:1A:2B:3C:4D:5E', purpose: '관제실 단말', reqName: '최민수', reqDept: '보안관제팀', user: '관리자', date: '2026.02.10 14:22:10' },
    { id: 4, ip: '211.238.10.55', mac: '54:E1:AD:66:3F:01', purpose: '운항사 A 연동', reqName: '박보검', reqDept: '인천공항공사', user: '관리자', date: '2026.02.15 09:30:00' },
    { id: 5, ip: '192.168.1.100', mac: 'F0:18:98:C1:B2:A3', purpose: '테스트 단말', reqName: '김태희', reqDept: '기술지원팀', user: '관리자', date: '2026.02.20 18:05:12' }
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
        tbody.innerHTML = `<tr><td colspan="8" class="td-center">등록된 IP 정보가 없습니다.</td></tr>`;
        return;
    }

    data.forEach((item) => {
        const tr = document.createElement('tr');
        tr.className = 'data-table-row';
        tr.innerHTML = `
            <td data-label="IP 주소">${item.ip}</td>
            <td data-label="MAC">${item.mac || '-'}</td>
            <td data-label="용도">${item.purpose || '-'}</td>
            <td data-label="신청자 이름">${item.reqName || '-'}</td>
            <td data-label="신청자 소속">${item.reqDept || '-'}</td>
            <td data-label="등록자">${item.user || '-'}</td>
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
    const mac = document.getElementById('filter-mac').value.toLowerCase();
    const purpose = document.getElementById('filter-purpose').value.toLowerCase();
    const reqName = document.getElementById('filter-req-name').value.toLowerCase();
    const reqDept = document.getElementById('filter-req-dept').value.toLowerCase();
    const user = document.getElementById('filter-user').value.toLowerCase();

    const filtered = ipData.filter(item => {
        const matchIp = !ip || item.ip.toLowerCase().includes(ip);
        const matchMac = !mac || (item.mac && item.mac.toLowerCase().includes(mac));
        const matchPurpose = !purpose || (item.purpose && item.purpose.toLowerCase().includes(purpose));
        const matchReqName = !reqName || (item.reqName && item.reqName.toLowerCase().includes(reqName));
        const matchReqDept = !reqDept || (item.reqDept && item.reqDept.toLowerCase().includes(reqDept));
        const matchUser = !user || (item.user && item.user.toLowerCase().includes(user));
        return matchIp && matchMac && matchPurpose && matchReqName && matchReqDept && matchUser;
    });

    renderIpList(filtered);
};

window.resetFilter = function () {
    document.getElementById('filter-ip').value = '';
    document.getElementById('filter-mac').value = '';
    document.getElementById('filter-purpose').value = '';
    document.getElementById('filter-req-name').value = '';
    document.getElementById('filter-req-dept').value = '';
    document.getElementById('filter-user').value = '';
    renderIpList(ipData);
};

/**
 * Registration Logic
 */
window.openRegistrationModal = function (e) {
    if (e) e.stopPropagation(); // Prevent filter toggle

    document.getElementById('reg-ip').value = '';
    document.getElementById('reg-mac').value = '';
    document.getElementById('reg-purpose').value = '';
    document.getElementById('reg-req-name').value = '';
    document.getElementById('reg-req-dept').value = '';
    clearErrors();

    document.getElementById('registration-modal').classList.add('active');
    lucide.createIcons();
};

window.closeRegistrationModal = function () {
    document.getElementById('registration-modal').classList.remove('active');
};

window.confirmRegistration = function () {
    const ip = document.getElementById('reg-ip').value;
    const mac = document.getElementById('reg-mac').value;
    const purpose = document.getElementById('reg-purpose').value;
    const reqName = document.getElementById('reg-req-name').value;
    const reqDept = document.getElementById('reg-req-dept').value;

    clearErrors();
    let hasError = false;

    if (!ip.trim()) {
        setError('reg-ip', '접근 IP 주소를 입력해 주세요.');
        hasError = true;
    } else if (!validateIp(ip)) {
        setError('reg-ip', '유효한 IP 주소를 입력해주세요.');
        hasError = true;
    }

    if (!mac.trim()) {
        setError('reg-mac', 'MAC 주소를 입력해 주세요.');
        hasError = true;
    } else if (!validateMac(mac)) {
        setError('reg-mac', '유효한 MAC 주소를 입력해주세요.');
        hasError = true;
    }

    if (!purpose.trim()) {
        setError('reg-purpose', '용도를 입력해 주세요.');
        hasError = true;
    }

    if (!reqName.trim()) {
        setError('reg-req-name', '신청자 이름을 입력해 주세요.');
        hasError = true;
    }

    if (!reqDept.trim()) {
        setError('reg-req-dept', '신청자 소속을 입력해 주세요.');
        hasError = true;
    }

    if (hasError) return;

    document.getElementById('confirm-save-modal').classList.add('active');
    lucide.createIcons();
};

window.processRegistration = function () {
    const ip = document.getElementById('reg-ip').value;
    const mac = document.getElementById('reg-mac').value;
    const purpose = document.getElementById('reg-purpose').value;
    const reqName = document.getElementById('reg-req-name').value;
    const reqDept = document.getElementById('reg-req-dept').value;
    const fullDate = getFullTimestamp();

    const newItem = {
        id: Date.now(),
        ip,
        mac,
        purpose,
        reqName,
        reqDept,
        user: '관리자',
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
    ['reg-ip', 'reg-mac', 'reg-purpose', 'reg-req-name', 'reg-req-dept'].forEach(id => resetError(id));
}

function validateIp(ip) {
    // IPv4, CIDR, or Wildcard (e.g. 192.168.*.*)
    const ipv4 = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const cidr = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\/(?:[1-2]?[0-9]|3[0-2])$/;
    const wildcard = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|\*)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|\*)$/;
    return ipv4.test(ip) || cidr.test(ip) || wildcard.test(ip);
}

function validateMac(mac) {
    // Regular expression for MAC address (supports : and - separators)
    const regex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
    return regex.test(mac);
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
