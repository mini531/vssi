/**
 * Code Management Page Logic (SAM_SY_01_01)
 */

// Sample Code Groups Data
const codeGroups = [
    { id: 'SYS_LEVEL', name: '시스템 레벨', desc: '시스템의 중요도 및 로그 레벨을 정의합니다.', status: '사용', updatedAt: '2026.02.11 09:30:12' },
    { id: 'LOG_TYPE', name: '로그 유형', desc: '시스템에서 발생하는 각종 이벤트의 성격을 구분합니다.', status: '사용', updatedAt: '2026.02.11 08:15:45' },
    { id: 'ERR_CODE', name: '오류 코드', desc: '', status: '사용', updatedAt: '2026.02.10 17:50:00' },
    { id: 'ROLE_TYPE', name: '역할 유형', desc: '시스템 기능 접근을 제어하기 위한 사용자 역할 정의입니다.', status: '사용', updatedAt: '2026.02.10 16:20:30' },
    { id: 'SYS_ACRONYM', name: '시스템 약어', desc: '', status: '사용', updatedAt: '2026.02.10 14:10:15' },
    { id: 'USER_STATUS', name: '사용자 상태', desc: '계정의 정상여부 및 잠금 등 상태 정보를 관리합니다.', status: '사용', updatedAt: '2026.02.09 11:45:00' },
    { id: 'CONN_TYPE', name: '연결 방식', desc: '장비 및 인터페이스 간의 통신 프로토콜 방식을 관리합니다.', status: '미사용', updatedAt: '2026.02.09 10:05:22' }
];

// Sample Codes Data
const codesData = {
    'SYS_LEVEL': [
        { code: 'DEBUG', name: '디버그', desc: '개발 및 문제 해결용 상세 정보', sort: 1, used: '사용' },
        { code: 'INFO', name: '정보', desc: '정상적인 시스템 작동 정보', sort: 2, used: '사용' },
        { code: 'WARN', name: '경고', desc: '주의가 필요한 상황', sort: 3, used: '사용' },
        { code: 'ERROR', name: '오류', desc: '시스템 기능 수행 불가 상황', sort: 4, used: '사용' },
        { code: 'FATAL', name: '치명적 오류', desc: '시스템 즉시 중단 상황', sort: 5, used: '사용' }
    ],
    'LOG_TYPE': [
        { code: 'LOGIN', name: '로그인', desc: '사용자 접속 기록', sort: 1, used: '사용' },
        { code: 'LOGOUT', name: '로그아웃', desc: '사용자 접속 종료 기록', sort: 2, used: '사용' },
        { code: 'CREATE', name: '생성', desc: '데이터 신규 생성 기록', sort: 3, used: '사용' },
        { code: 'UPDATE', name: '수정', desc: '데이터 변경 기록', sort: 4, used: '사용' },
        { code: 'DELETE', name: '삭제', desc: '데이터 삭제 기록', sort: 5, used: '사용' }
    ],
    'ERR_CODE': [
        { code: 'E001', name: '인증 검색 실패', desc: '사용자 인증 정보를 찾을 수 없음', sort: 10, used: '사용' },
        { code: 'E002', name: '권한 거부', desc: '요청한 작업에 대한 권한이 없음', sort: 20, used: '사용' },
        { code: 'E003', name: '입력값 유효성 오류', desc: '필수 입력 항목 누락 또는 형식 불일치', sort: 30, used: '사용' },
        { code: 'E999', name: '알 수 없는 시스템 오류', desc: '정의되지 않은 예상치 못한 오류 발생', sort: 99, used: '사용' }
    ],
    'ROLE_TYPE': [
        { code: 'SUPER', name: '최고 관리자', desc: '시스템 전체 제어 권한', sort: 1, used: '사용' },
        { code: 'ADMIN', name: '운영 관리자', desc: '주요 설정 및 계정 관리 권한', sort: 2, used: '사용' },
        { code: 'OPER', name: '운영자', desc: '모니터링 및 일반 운영 권한', sort: 3, used: '사용' },
        { code: 'VIEWER', name: '관찰자', desc: '읽기 전용 메뉴 접근 권한', sort: 4, used: '사용' }
    ],
    'SYS_ACRONYM': [
        { code: 'SAMS', name: 'SAMS', desc: 'Smart Asset Management System', sort: 1, used: '사용' },
        { code: 'IVS', name: 'IVS', desc: 'Integrated Verification System', sort: 2, used: '사용' },
        { code: 'VOS', name: 'VOS', desc: 'Virtual Operation System', sort: 3, used: '사용' }
    ],
    'USER_STATUS': [
        { code: 'normal', name: '정상', desc: '일반적인 사용 가능 상태', sort: 1, used: '사용' },
        { code: 'locked', name: '잠김', desc: '비밀번호 실패 등으로 인한 잠김', sort: 2, used: '사용' },
        { code: 'suspended', name: '정지', desc: '관리자에 의한 계정 정지', sort: 3, used: '사용' },
        { code: 'withdrawn', name: '탈퇴', desc: '탈퇴 처리된 계정', sort: 4, used: '사용' }
    ],
    'CONN_TYPE': [
        { code: 'TCP', name: 'TCP/IP', desc: '표준 스트림 기반 전송 방식', sort: 1, used: '사용' },
        { code: 'HTTP', name: 'REST API (HTTP)', desc: '웹 표준 프로토콜 기반 요청 방식', sort: 2, used: '사용' },
        { code: 'MQ', name: 'Message Queue', desc: '비동기 메시징 기반 대기열 방식', sort: 3, used: '사용' }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    // Initial Render Code Groups
    renderCodeGroups(codeGroups);

    // Initial Filter Toggle Logic (Closed by default)
    const chevron = document.getElementById('filter-chevron');
    if (chevron) chevron.style.transform = 'rotate(0deg)';

    window.toggleFilter = function () {
        const content = document.getElementById('filter-content');
        const chevron = document.getElementById('filter-chevron');
        if (content.classList.contains('hidden')) {
            content.classList.remove('hidden');
            chevron.style.transform = 'rotate(180deg)';
        } else {
            content.classList.add('hidden');
            chevron.style.transform = 'rotate(0deg)';
        }
    };
});

// Render Code Groups Table
function renderCodeGroups(groups) {
    const listBody = document.getElementById('group-list-body');
    listBody.innerHTML = '';

    groups.forEach((group, index) => {
        const tr = document.createElement('tr');
        tr.className = 'data-table-row clickable-row';
        tr.onclick = () => selectCodeGroup(group, tr);

        tr.innerHTML = `
            <td data-label="코드 그룹 ID">${group.id}</td>
            <td data-label="코드 그룹 이름">${group.name}</td>
            <td class="td-center" data-label="사용 여부">
                <span class="badge ${group.status === '사용' ? 'badge-success' : 'badge-default'}">
                    ${group.status}
                </span>
            </td>
            <td class="td-date" data-label="최근 갱신 일시">${group.updatedAt}</td>
        `;
        listBody.appendChild(tr);
    });

    lucide.createIcons();

    const totalCount = document.getElementById('group-total-count');
    if (totalCount) totalCount.innerText = `총 ${groups.length} 건`;
}

let selectedGroup = null;

// Select Code Group
function selectCodeGroup(group, row) {
    selectedGroup = group;

    // Highlight row
    document.querySelectorAll('#group-list-body tr').forEach(r => r.classList.remove('active'));
    row.classList.add('active');

    const emptyState = document.getElementById('empty-state');
    const detailContent = document.getElementById('detail-content');
    const groupInfoView = document.getElementById('group-info-view');

    emptyState.classList.add('hidden');
    detailContent.classList.remove('hidden');
    if (groupInfoView) groupInfoView.classList.remove('hidden');

    // Populate Group Info
    document.getElementById('info-group-id').value = group.id;
    document.getElementById('info-group-name').value = group.name;

    // Render Status as Badge
    const statusContainer = document.getElementById('info-group-status-container');
    if (statusContainer) {
        statusContainer.innerHTML = `
            <span class="badge ${group.status === '사용' ? 'badge-success' : 'badge-default'}">
                ${group.status}
            </span>
        `;
    }

    // Toggle description area visibility
    const descContainer = document.getElementById('info-group-desc-container');
    if (descContainer) {
        if (group.desc && group.desc.trim() !== '') {
            descContainer.classList.remove('hidden');
            document.getElementById('info-group-desc').value = group.desc;
        } else {
            descContainer.classList.add('hidden');
        }
    }

    const viewHeader = document.getElementById('view-header-group');
    const regHeaderGroup = document.getElementById('reg-header-group');
    const editHeaderGroup = document.getElementById('edit-header-group');
    const regHeaderCode = document.getElementById('reg-header-code');
    const editHeaderCode = document.getElementById('edit-header-code');
    const viewButtons = document.getElementById('view-mode-buttons');
    const regButtons = document.getElementById('reg-mode-buttons');
    const tableView = document.getElementById('code-table-view');
    const regFormGroup = document.getElementById('reg-form-view');
    const regFormCode = document.getElementById('reg-code-form-view');

    if (viewHeader) viewHeader.classList.remove('hidden');
    if (regHeaderGroup) regHeaderGroup.classList.add('hidden');
    if (editHeaderGroup) editHeaderGroup.classList.add('hidden');
    if (regHeaderCode) regHeaderCode.classList.add('hidden');
    if (editHeaderCode) editHeaderCode.classList.add('hidden');
    if (viewButtons) viewButtons.classList.remove('hidden');
    if (regButtons) regButtons.classList.add('hidden');
    if (tableView) tableView.classList.remove('hidden');
    if (regFormGroup) regFormGroup.classList.add('hidden');
    if (regFormCode) regFormCode.classList.add('hidden');
    if (groupInfoView) groupInfoView.classList.remove('hidden');

    const nameDisplay = document.getElementById('selected-group-name');
    if (nameDisplay) {
        nameDisplay.innerText = `${group.name} (${group.id})`;
    }

    renderCodes(codesData[group.id] || []);

    // Mobile View Toggle
    openDetailPane();
}

// Render Codes (Right Pane)
function renderCodes(codeList) {
    const listBody = document.getElementById('code-list-body');
    listBody.innerHTML = '';

    if (codeList.length === 0) {
        listBody.innerHTML = `<tr><td colspan="7" class="td-center">등록된 코드가 없습니다. '코드 등록' 버튼을 눌러 추가하세요.</td></tr>`;
    } else {
        codeList.forEach(code => {
            const tr = document.createElement('tr');
            tr.className = 'data-table-row';
            tr.innerHTML = `
                <td class="td-center" data-label="선택">
                    <input type="checkbox" class="custom-checkbox code-checkbox" value="${code.code}" onchange="updateDeleteButtonState()">
                </td>
                <td class="font-medium text-slate-200" data-label="코드 ID">${code.code}</td>
                <td data-label="코드 이름">${code.name}</td>
                <td class="td-message text-slate-400 text-sm whitespace-pre-wrap" data-label="설명">${code.desc || '-'}</td>
                <td class="td-center" data-label="사용 여부">
                    <span class="badge ${code.used === '사용' ? 'badge-success' : 'badge-danger'}">
                        ${code.used}
                    </span>
                </td>
                <td class="td-center" data-label="순서">${code.sort}</td>
                <td class="td-center" data-label="관리">
                    <div class="flex items-center justify-center gap-2">
                        <button class="text-slate-400 hover:text-teal-400 transition-colors" title="수정" onclick="editCodeInline('${code.code}')">
                            <i data-lucide="edit-3" class="w-4 h-4"></i>
                        </button>
                        <button class="text-slate-400 hover:text-red-400 transition-colors" title="삭제" onclick="deleteCode('${code.code}')">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    </div>
                </td>
            `;
            listBody.appendChild(tr);
        });
    }

    lucide.createIcons();

    const totalCount = document.getElementById('code-total-count');
    if (totalCount) totalCount.innerText = `총 ${codeList.length} 건`;

    // Reset header checkbox
    const headerCheckbox = document.getElementById('code-select-all');
    if (headerCheckbox) headerCheckbox.checked = false;

    // Reset delete button state
    updateDeleteButtonState();
}

// Update Delete Button State based on checkboxes
window.updateDeleteButtonState = function () {
    const checkboxes = document.querySelectorAll('.code-checkbox:checked');
    const deleteBtn = document.getElementById('btn-delete-codes');
    if (deleteBtn) {
        deleteBtn.disabled = (checkboxes.length === 0);
    }
};

// Toggle All Codes
document.addEventListener('change', (e) => {
    if (e.target.id === 'code-select-all') {
        const checkboxes = document.querySelectorAll('.code-checkbox');
        checkboxes.forEach(cb => cb.checked = e.target.checked);
        updateDeleteButtonState();
    }
});

// Modal Interaction State
let confirmActionType = null; // 'SAVE_GROUP', 'SAVE_CODE', 'DELETE_SINGLE', 'DELETE_MULTIPLE'
let pendingDeleteId = null;

window.editCodeInline = function (codeId) {
    alert(`코드 [${codeId}] 수정 기능은 개발 중입니다.`);
};

window.deleteCode = function (codeId) {
    confirmActionType = 'DELETE_SINGLE';
    pendingDeleteId = codeId;

    const modal = document.getElementById('confirm-modal');
    const title = document.getElementById('confirm-modal-title');
    const desc = document.getElementById('confirm-modal-desc');

    title.innerText = '코드 삭제';
    desc.innerText = `코드 [${codeId}]를 삭제하시겠습니까?`;

    modal.classList.add('active');
    lucide.createIcons();
};

window.deleteSelectedCodes = function () {
    const checkboxes = document.querySelectorAll('.code-checkbox:checked');
    const selected = Array.from(checkboxes).map(cb => cb.value);

    if (selected.length === 0) return;

    confirmActionType = 'DELETE_MULTIPLE';

    const modal = document.getElementById('confirm-modal');
    const title = document.getElementById('confirm-modal-title');
    const desc = document.getElementById('confirm-modal-desc');

    title.innerText = '코드 삭제';
    desc.innerText = `선택한 ${selected.length}개의 코드를 삭제하시겠습니까?`;

    modal.classList.add('active');
    lucide.createIcons();
};

// Filter Logic for Groups
window.applyGroupFilter = function () {
    const filterId = document.getElementById('filter-group-id').value.trim().toLowerCase();
    const filterName = document.getElementById('filter-group-name').value.trim().toLowerCase();
    const filterStatus = document.getElementById('filter-group-status').value;

    const filtered = codeGroups.filter(group => {
        const matchId = !filterId || group.id.toLowerCase().includes(filterId);
        const matchName = !filterName || group.name.toLowerCase().includes(filterName);
        const matchStatus = filterStatus === 'all' || group.status === filterStatus;
        return matchId && matchName && matchStatus;
    });

    renderCodeGroups(filtered);
};

window.resetGroupFilter = function () {
    document.getElementById('filter-group-id').value = '';
    document.getElementById('filter-group-name').value = '';
    document.getElementById('filter-group-status').value = 'all';
    renderCodeGroups(codeGroups);
};

// Registration Mode (Code Group)
// Registration Mode Toggle
window.initRegistrationMode = function (type) {
    const emptyState = document.getElementById('empty-state');
    const detailContent = document.getElementById('detail-content');
    const splitContainer = document.querySelector('.split-container');
    const codeIdInput = document.getElementById('reg-code-id');

    emptyState.classList.add('hidden');
    detailContent.classList.remove('hidden');

    // Common UI Switches
    document.getElementById('view-header-group').classList.add('hidden');
    document.getElementById('view-mode-buttons').classList.add('hidden');
    document.getElementById('code-table-view').classList.add('hidden');
    document.getElementById('reg-mode-buttons').classList.remove('hidden');

    // Hide all Registration/Edit Headers & Forms at once
    document.getElementById('reg-header-group').classList.add('hidden');
    document.getElementById('edit-header-group').classList.add('hidden');
    document.getElementById('reg-header-code').classList.add('hidden');
    document.getElementById('edit-header-code').classList.add('hidden');
    document.getElementById('reg-form-view').classList.add('hidden');
    document.getElementById('reg-code-form-view').classList.add('hidden');
    document.getElementById('group-info-view').classList.add('hidden');

    // Reset styles and states
    codeIdInput.disabled = false;
    document.getElementById('reg-code-id-required').classList.remove('hidden');

    const groupIdInput = document.getElementById('reg-group-id');
    groupIdInput.disabled = false;
    document.getElementById('reg-group-id-required').classList.remove('hidden');

    if (type === 'group' || type === 'editGroup') {
        // ... (headers and form hidden at top already)

        // Header & Buttons
        if (type === 'group') {
            document.getElementById('reg-header-group').classList.remove('hidden');
            document.getElementById('edit-header-group').classList.add('hidden');

            // Reset Selection
            document.querySelectorAll('#group-list-body tr').forEach(r => r.classList.remove('active'));
            selectedGroup = null;

            // Clear Group Form
            groupIdInput.value = '';
            document.getElementById('reg-group-name').value = '';
            document.getElementById('reg-group-desc').value = '';
            document.getElementById('reg-group-status').value = '사용';
        } else {
            document.getElementById('reg-header-group').classList.add('hidden');
            document.getElementById('edit-header-group').classList.remove('hidden');

            // ID is not editable
            groupIdInput.disabled = true;
            document.getElementById('reg-group-id-required').classList.add('hidden');
        }

        document.getElementById('btn-save-group').classList.remove('hidden');
        document.getElementById('btn-save-code').classList.add('hidden');

        // Form Views
        document.getElementById('reg-form-view').classList.remove('hidden');
    } else if (type === 'code' || type === 'edit') {
        if (!selectedGroup) {
            alert('코드 그룹을 먼저 선택해주세요.');
            return;
        }

        // Form Views - Toggle only the code form
        document.getElementById('reg-code-form-view').classList.remove('hidden');
        document.getElementById('btn-save-group').classList.add('hidden');
        document.getElementById('btn-save-code').classList.remove('hidden');

        if (type === 'code') {
            document.getElementById('reg-header-code').classList.remove('hidden');
            document.getElementById('edit-header-code').classList.add('hidden');
            document.getElementById('reg-code-parent-name').innerText = `${selectedGroup.name} (${selectedGroup.id})`;

            // Clear Code Form
            codeIdInput.value = '';
            document.getElementById('reg-code-name').value = '';
            document.getElementById('reg-code-desc').value = '';
            document.getElementById('reg-parent-code-id').value = '';
            document.getElementById('reg-code-sort').value = '10';
            document.getElementById('reg-code-status').value = '사용';
            resetError('reg-code-sort');
        } else {
            // Edit Mode
            document.getElementById('reg-header-code').classList.add('hidden');
            document.getElementById('edit-header-code').classList.remove('hidden');
            document.getElementById('edit-code-parent-name').innerText = `${selectedGroup.name} (${selectedGroup.id})`;

            // ID is not editable
            codeIdInput.disabled = true;
            document.getElementById('reg-code-id-required').classList.add('hidden');
        }
    }

    // Clear Errors
    document.querySelectorAll('.form-error').forEach(el => el.innerText = '');
    document.querySelectorAll('.form-input').forEach(el => el.classList.remove('error'));

    // Mobile View Toggle
    openDetailPane();
};

window.editCodeInline = function (codeId) {
    if (!selectedGroup || !codesData[selectedGroup.id]) return;

    const codeData = codesData[selectedGroup.id].find(c => c.code === codeId);
    if (!codeData) return;

    // Switch to UI
    initRegistrationMode('edit');
    confirmActionType = 'EDIT_CODE';

    // Populate values
    document.getElementById('reg-code-id').value = codeData.code;
    document.getElementById('reg-code-name').value = codeData.name;
    document.getElementById('reg-code-desc').value = codeData.desc || '';
    document.getElementById('reg-parent-code-id').value = codeData.parentCodeId || '';
    document.getElementById('reg-code-sort').value = codeData.sort;
    document.getElementById('reg-code-status').value = codeData.used;
};

window.editGroupInline = function (groupId) {
    const group = codeGroups.find(g => g.id === groupId);
    if (!group) return;

    // Switch to UI
    initRegistrationMode('editGroup');
    confirmActionType = 'EDIT_GROUP';
    pendingDeleteId = groupId; // Use this to keep track of which group we are editing

    // Populate values
    document.getElementById('reg-group-id').value = group.id;
    document.getElementById('reg-group-name').value = group.name;
    document.getElementById('reg-group-desc').value = group.desc || '';
    document.getElementById('reg-group-status').value = group.status;
};

window.deleteGroup = function (groupId) {
    confirmActionType = 'DELETE_GROUP';
    pendingDeleteId = groupId;

    const modal = document.getElementById('confirm-modal');
    const title = document.getElementById('confirm-modal-title');
    const desc = document.getElementById('confirm-modal-desc');

    title.innerText = '코드 그룹 삭제';
    desc.innerText = `코드 그룹 [${groupId}]을 삭제하시겠습니까?\n내부의 모든 코드도 함께 삭제됩니다.`;

    modal.classList.add('active');
    lucide.createIcons();
};

window.cancelRegistration = function () {
    // Reset state for ID input
    const codeIdInput = document.getElementById('reg-code-id');
    codeIdInput.disabled = false;
    document.getElementById('reg-code-id-required').classList.remove('hidden');

    const groupIdInput = document.getElementById('reg-group-id');
    groupIdInput.disabled = false;
    document.getElementById('reg-group-id-required').classList.remove('hidden');

    if (selectedGroup) {
        // Return to Code Table View
        renderCodes(codesData[selectedGroup.id] || []);

        document.getElementById('reg-header-code').classList.add('hidden');
        document.getElementById('edit-header-code').classList.add('hidden');
        document.getElementById('reg-header-group').classList.add('hidden');
        document.getElementById('edit-header-group').classList.add('hidden');
        document.getElementById('reg-code-form-view').classList.add('hidden');
        document.getElementById('reg-form-view').classList.add('hidden');
        document.getElementById('group-info-view').classList.remove('hidden');

        document.getElementById('view-header-group').classList.remove('hidden');
        document.getElementById('view-mode-buttons').classList.remove('hidden');
        document.getElementById('code-table-view').classList.remove('hidden');
        document.getElementById('reg-mode-buttons').classList.add('hidden');
    } else {
        // Return to Empty State
        closeDetailPane();
    }

    // Refresh Icons for newly added buttons
    lucide.createIcons();

    // Mobile View Toggle
    closeDetailPane();
};

// Validation Helpers
window.resetError = function (fieldId) {
    const el = document.getElementById(fieldId);
    if (el) el.classList.remove('error');
    const errDiv = document.getElementById('error-' + fieldId);
    if (errDiv) errDiv.innerText = '';
};

function setError(fieldId, msg) {
    const el = document.getElementById(fieldId);
    if (el) el.classList.add('error');
    const errDiv = document.getElementById('error-' + fieldId);
    if (errDiv) errDiv.innerText = msg;
};

window.saveRegistration = function (type) {
    let hasError = false;

    if (type === 'group') {
        const groupId = document.getElementById('reg-group-id');
        const groupName = document.getElementById('reg-group-name');

        resetError('reg-group-id');
        resetError('reg-group-name');

        if (!groupId.value.trim()) {
            setError('reg-group-id', '코드 그룹 ID를 입력해주세요.');
            hasError = true;
        } else if (!/^[A-Z0-9_]+$/.test(groupId.value.trim())) {
            setError('reg-group-id', '영문 대문자, 숫자, 언더바(_)만 입력 가능합니다.');
            hasError = true;
        }

        if (!groupName.value.trim()) {
            setError('reg-group-name', '코드 그룹 이름을 입력해주세요.');
            hasError = true;
        }
    } else { // This block now handles both 'code' (new) and 'edit' (existing)
        const codeId = document.getElementById('reg-code-id');
        const codeName = document.getElementById('reg-code-name');
        const codeSort = document.getElementById('reg-code-sort');

        resetError('reg-code-id');
        resetError('reg-code-name');
        resetError('reg-code-sort');

        if (!codeId.value.trim()) {
            setError('reg-code-id', '코드 ID를 입력해주세요.');
            hasError = true;
        }
        if (!codeName.value.trim()) {
            setError('reg-code-name', '코드 이름을 입력해주세요.');
            hasError = true;
        }
        if (!codeSort.value.trim()) {
            setError('reg-code-sort', '순서를 입력해주세요.');
            hasError = true;
        }
    }

    if (hasError) return;

    // Show Confirm Modal
    const modal = document.getElementById('confirm-modal');
    const title = document.getElementById('confirm-modal-title');
    const desc = document.getElementById('confirm-modal-desc');

    if (type === 'group') {
        const isEdit = document.getElementById('reg-group-id').disabled;
        if (isEdit) {
            confirmActionType = 'EDIT_GROUP';
            title.innerText = '코드 그룹 수정';
            desc.innerText = '입력하신 정보로 코드 그룹을 수정하시겠습니까?';
        } else {
            confirmActionType = 'SAVE_GROUP';
            title.innerText = '코드 그룹 등록';
            desc.innerText = '입력하신 정보로 코드 그룹을 등록하시겠습니까?';
        }
    } else {
        // Distinguish between ADD and EDIT
        const isEdit = document.getElementById('reg-code-id').disabled;
        if (isEdit) {
            confirmActionType = 'EDIT_CODE';
            title.innerText = '코드 수정';
            desc.innerText = '입력하신 정보로 코드를 수정하시겠습니까?';
        } else {
            confirmActionType = 'SAVE_CODE';
            title.innerText = '코드 등록';
            desc.innerText = '입력하신 정보로 코드를 등록하시겠습니까?';
        }
    }

    modal.classList.add('active');
    lucide.createIcons();
};

window.confirmSaveRegistration = function () {
    const currentAction = confirmActionType; // Save current action type before closing modal
    closeConfirmModal();

    if (!currentAction) return;

    const now = new Date();
    const timestamp = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    if (currentAction === 'SAVE_GROUP') {
        // Group Saving Logic
        const newId = document.getElementById('reg-group-id').value.trim();
        const newName = document.getElementById('reg-group-name').value.trim();
        const newStatus = document.getElementById('reg-group-status').value;

        codeGroups.unshift({
            id: newId,
            name: newName,
            status: newStatus,
            updatedAt: timestamp
        });

        document.getElementById('success-message').innerText = '등록 완료되었습니다.';
    } else if (currentAction === 'EDIT_GROUP') {
        // Group Update Logic
        const groupId = document.getElementById('reg-group-id').value.trim();
        const groupName = document.getElementById('reg-group-name').value.trim();
        const groupDesc = document.getElementById('reg-group-desc').value.trim();
        const groupStatus = document.getElementById('reg-group-status').value;

        const index = codeGroups.findIndex(g => g.id === groupId);
        if (index !== -1) {
            codeGroups[index] = {
                ...codeGroups[index],
                name: groupName,
                desc: groupDesc,
                status: groupStatus,
                updatedAt: timestamp
            };
        }

        document.getElementById('success-message').innerText = '수정 완료되었습니다.';
    } else if (currentAction === 'SAVE_CODE') {
        // Code Saving Logic
        const codeId = document.getElementById('reg-code-id').value.trim();
        const codeName = document.getElementById('reg-code-name').value.trim();
        const codeDesc = document.getElementById('reg-code-desc').value.trim();
        const parentCodeId = document.getElementById('reg-parent-code-id').value.trim();
        const codeSort = document.getElementById('reg-code-sort').value;
        const codeStatus = document.getElementById('reg-code-status').value;

        if (selectedGroup) {
            if (!codesData[selectedGroup.id]) codesData[selectedGroup.id] = [];
            codesData[selectedGroup.id].unshift({
                code: codeId,
                name: codeName,
                desc: codeDesc,
                parentCodeId: parentCodeId,
                sort: parseInt(codeSort),
                used: codeStatus
            });
        }

        document.getElementById('success-message').innerText = '등록 완료되었습니다.';
    } else if (currentAction === 'EDIT_CODE') {
        // Code Update Logic
        const codeId = document.getElementById('reg-code-id').value.trim();
        const codeName = document.getElementById('reg-code-name').value.trim();
        const codeDesc = document.getElementById('reg-code-desc').value.trim();
        const codeSort = document.getElementById('reg-code-sort').value;
        const codeStatus = document.getElementById('reg-code-status').value;

        if (selectedGroup && codesData[selectedGroup.id]) {
            const index = codesData[selectedGroup.id].findIndex(c => c.code === codeId);
            if (index !== -1) {
                codesData[selectedGroup.id][index] = {
                    code: codeId,
                    name: codeName,
                    desc: codeDesc,
                    parentCodeId: parentCodeId,
                    sort: parseInt(codeSort),
                    used: codeStatus
                };
            }
        }

        document.getElementById('success-message').innerText = '수정 완료되었습니다.';
    } else if (currentAction === 'DELETE_SINGLE') {
        if (selectedGroup && codesData[selectedGroup.id]) {
            codesData[selectedGroup.id] = codesData[selectedGroup.id].filter(c => c.code !== pendingDeleteId);
            document.getElementById('success-message').innerText = '삭제되었습니다.';
        }
    } else if (currentAction === 'DELETE_GROUP') {
        const groupId = pendingDeleteId;
        const index = codeGroups.findIndex(g => g.id === groupId);
        if (index !== -1) {
            // 실제로 삭제될 필요 없다 하여 주석 처리
            // codeGroups.splice(index, 1);
            // delete codesData[groupId]; 

            // if (selectedGroup && selectedGroup.id === groupId) {
            //     selectedGroup = null;
            //     document.getElementById('empty-state').classList.remove('hidden');
            //     document.getElementById('detail-content').classList.add('hidden');
            // }
        }
        document.getElementById('success-message').innerText = '삭제되었습니다.';
    } else if (currentAction === 'DELETE_MULTIPLE') {
        const checkboxes = document.querySelectorAll('.code-checkbox:checked');
        const selected = Array.from(checkboxes).map(cb => cb.value);

        if (selectedGroup && codesData[selectedGroup.id]) {
            codesData[selectedGroup.id] = codesData[selectedGroup.id].filter(c => !selected.includes(c.code));
            document.getElementById('success-message').innerText = '삭제되었습니다.';
        }
    }

    // Show Success Modal
    const successModal = document.getElementById('success-modal');
    const successTitle = document.getElementById('success-modal-title');
    if (currentAction.startsWith('DELETE')) {
        successTitle.innerText = '삭제 완료';
    } else if (currentAction.startsWith('EDIT')) {
        successTitle.innerText = '수정 완료';
    } else {
        successTitle.innerText = '등록 완료';
    }
    // Refresh Icons for newly added buttons
    lucide.createIcons();
};

window.closeSuccessModal = function () {
    const successModal = document.getElementById('success-modal');
    successModal.classList.remove('active');

    // We need to know what to refresh based on what WAS done
    // Since confirmActionType is null, we can't tell here.
    // Let's modify the flow to NOT clear confirmActionType in closeConfirmModal, 
    // but clear it in closeSuccessModal.

    // Actually, I'll just check the success message or some other state.
    const msg = document.getElementById('success-message').innerText;
    if (msg.includes('등록') || msg.includes('수정')) {
        cancelRegistration();
        renderCodeGroups(codeGroups);
    } else if (msg.includes('그룹 삭제')) {
        renderCodeGroups(codeGroups);
    } else {
        // Refresh Codes after deletion
        if (selectedGroup) {
            renderCodes(codesData[selectedGroup.id] || []);
        } else {
            renderCodeGroups(codeGroups);
        }
    }

    confirmActionType = null;
    pendingDeleteId = null;
};


function deleteSelectedCode() {
    alert('선택한 코드를 삭제하시겠습니까?');
}

