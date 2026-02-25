/**
 * Fault Management Page Logic (SAM_SY_02_01)
 */

// Sample Fault Data
const faultsData = [
    {
        id: 'FLT-001',
        time: '2026.02.11 14:30:22',
        system: 'SAMS DB',
        level: '치명적',
        status: '조치중',
        desc: '데이터베이스 커넥션 풀 초과로 인한 지연 발생. 특정 쿼리의 락(Lock) 경합 의심.',
        actions: [
            { id: 'ACT-001', time: '2026.02.11 14:45', actor: '홍길동', content: 'DB 세션 모니터링 및 락 발생 커리 확인', result: '조치중' },
            { id: 'ACT-002', time: '2026.02.11 15:00', actor: '홍길동', content: '임시 세션 킬(Session Kill) 처리 및 풀 확장', result: '조치중' }
        ]
    },
    {
        id: 'FLT-002',
        time: '2026.02.11 11:20:15',
        system: 'IVS GW',
        level: '요주의',
        status: '접수',
        desc: 'IVS 게이트웨이 인터페이스 응답 속도 저하 (Response time > 5s)',
        actions: []
    },
    {
        id: 'FLT-003',
        time: '2026.02.10 17:50:00',
        system: 'VOS Node 1',
        level: '경미',
        status: '완료',
        desc: '노드 1번 CPU 사용률 80% 상회 알림',
        actions: [
            { id: 'ACT-003', time: '2026.02.10 18:05', actor: '이철수', content: '불필요한 데몬 프로세스 종료 및 리소스 최적화', result: '성공' }
        ]
    },
    {
        id: 'FLT-004',
        time: '2026.02.10 15:10:45',
        system: 'Network Switch A',
        level: '치명적',
        status: '완료',
        desc: '스위치 포트 05번 링크 다운 감지',
        actions: [
            { id: 'ACT-004', time: '2026.02.10 15:30', actor: '김영희', content: '케이블 교체 및 포트 리셋', result: '성공' }
        ]
    }
];

let selectedFaultId = null;
let pendingDeleteActionId = null;
let isDeleteOperation = false; // Track if success modal is for deletion


document.addEventListener('DOMContentLoaded', () => {
    init();
});

function init() {
    renderFaults(faultsData);

    // Initialize date filters to today
    const today = new Date().toISOString().split('T')[0];
    const startInput = document.getElementById('filter-date-start');
    const endInput = document.getElementById('filter-date-end');
    if (startInput) startInput.value = today;
    if (endInput) endInput.value = today;

    lucide.createIcons();

    // Check for deep link (id) in URL
    const urlParams = new URLSearchParams(window.location.search);
    const faultId = urlParams.get('id');
    if (faultId) {
        selectFault(faultId);
    }
}

function renderFaults(list) {
    const listBody = document.getElementById('fault-list-body');
    const totalCount = document.getElementById('fault-total-count');

    listBody.innerHTML = '';
    totalCount.innerText = `총 ${list.length} 건`;

    if (list.length === 0) {
        listBody.innerHTML = `<tr><td colspan="4" class="td-center">접수된 장애가 없습니다.</td></tr>`;
        return;
    }

    list.forEach(fault => {
        const tr = document.createElement('tr');
        tr.className = 'data-table-row clickable-row';
        tr.dataset.faultId = fault.id;
        if (selectedFaultId === fault.id) tr.classList.add('active');

        tr.onclick = () => selectFault(fault.id, tr);

        tr.innerHTML = `
            <td class="td-date" data-label="발생 일시">${fault.time}</td>
            <td data-label="시스템">${fault.system}</td>
            <td class="td-center" data-label="등급"><span class="badge ${getLevelClass(fault.level)}">${fault.level}</span></td>
            <td class="td-center" data-label="상태"><span class="badge ${getStatusClass(fault.status)}">${fault.status}</span></td>
        `;
        listBody.appendChild(tr);
    });
}

function selectFault(id, row) {
    selectedFaultId = id;
    const fault = faultsData.find(f => f.id === id);
    if (!fault) return;

    // UI State
    document.querySelectorAll('#fault-list-body tr').forEach(tr => tr.classList.remove('active'));

    let targetRow = row;
    if (!targetRow) {
        targetRow = document.querySelector(`#fault-list-body tr[data-fault-id="${id}"]`);
    }
    if (targetRow) targetRow.classList.add('active');

    document.getElementById('empty-state').classList.add('hidden');
    document.getElementById('detail-content').classList.remove('hidden');

    // Content
    document.getElementById('detail-system').innerText = fault.system;
    document.getElementById('detail-level').innerHTML = `<span class="badge ${getLevelClass(fault.level)}">${fault.level}</span>`;
    document.getElementById('detail-time').innerText = fault.time;
    document.getElementById('detail-status').innerHTML = `<span class="badge ${getStatusClass(fault.status)}">${fault.status}</span>`;
    document.getElementById('detail-desc').innerText = fault.desc;

    renderActions(fault.actions);

    // Mobile View Toggle
    openDetailPane();
}

function renderActions(actions) {
    const actionBody = document.getElementById('action-list-body');
    const totalCount = document.getElementById('action-total-count');
    actionBody.innerHTML = '';
    if (totalCount) totalCount.innerText = `총 ${actions ? actions.length : 0} 건`;

    if (!actions || actions.length === 0) {
        actionBody.innerHTML = `<tr><td colspan="5" class="td-center">등록된 조치 내역이 없습니다.</td></tr>`;
        return;
    }

    actions.forEach(action => {
        const tr = document.createElement('tr');
        tr.className = 'data-table-row';
        tr.innerHTML = `
            <td data-label="조치 일시">${action.time}</td>
            <td class="td-message table-text-wrap" data-label="조치 내용">${action.content}</td>
            <td data-label="담당자">${action.actor}</td>
            <td class="td-center" data-label="결과"><span class="badge ${getResultClass(action.result)}">${action.result}</span></td>
            <td class="td-center" data-label="관리">
                <div class="flex items-center justify-center gap-2">
                    <button class="text-slate-400 hover:text-red-400 transition-colors" title="삭제" onclick="deleteAction('${action.id}')">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                </div>
            </td>
        `;
        actionBody.appendChild(tr);
    });

    lucide.createIcons();
}

function getLevelClass(level) {
    if (level === '치명적') return 'badge-danger';
    if (level === '요주의') return 'badge-warning';
    return 'badge-info';
}

function getStatusClass(status) {
    if (status === '완료') return 'badge-success';
    if (status === '조치중') return 'badge-info';
    return 'badge-secondary';
}

function getResultClass(result) {
    if (result === '성공') return 'badge-success';
    if (result === '조치중') return 'badge-info';
    return 'badge-warning';
}

// Modal Logic
window.openActionModal = function () {
    // Set current datetime
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    const dateValue = `${year}-${month}-${day}`;
    const timeValue = `${hours}:${minutes}`;

    document.getElementById('reg-action-date').value = dateValue;
    document.getElementById('reg-action-time').value = timeValue;
    document.getElementById('reg-action-actor').value = '홍길동'; // Current logged-in user
    document.getElementById('reg-action-content').value = '';
    document.getElementById('reg-action-result').value = '성공';

    document.getElementById('action-modal').classList.add('active');
};

window.closeActionModal = function () {
    document.getElementById('action-modal').classList.remove('active');
    // Clear all error messages and classes
    clearAllActionErrors();
};

// Helper functions for validation
window.resetActionError = function (fieldId) {
    document.getElementById(fieldId).classList.remove('error');
    const errDiv = document.getElementById('error-' + fieldId);
    if (errDiv) errDiv.innerText = '';
}

function setActionError(fieldId, msg) {
    document.getElementById(fieldId).classList.add('error');
    const errDiv = document.getElementById('error-' + fieldId);
    if (errDiv) errDiv.innerText = msg;
}

function clearAllActionErrors() {
    ['reg-action-date', 'reg-action-time', 'reg-action-content', 'reg-action-actor'].forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) field.classList.remove('error');
        const errDiv = document.getElementById('error-' + fieldId);
        if (errDiv) errDiv.innerText = '';
    });
}

window.confirmActionRegistration = function () {
    const date = document.getElementById('reg-action-date').value;
    const time = document.getElementById('reg-action-time').value;
    const content = document.getElementById('reg-action-content').value;
    const actor = document.getElementById('reg-action-actor').value;
    const result = document.getElementById('reg-action-result').value;

    let hasError = false;

    // Clear previous errors
    clearAllActionErrors();

    // Validate date
    if (!date) {
        setActionError('reg-action-date', '조치 일자를 선택해주세요.');
        hasError = true;
    }

    // Validate time
    if (!time) {
        setActionError('reg-action-time', '조치 시간을 입력해주세요.');
        hasError = true;
    }

    // Validate content
    if (!content.trim()) {
        setActionError('reg-action-content', '조치 내용을 입력해주세요.');
        hasError = true;
    }

    // Validate actor
    if (!actor.trim()) {
        setActionError('reg-action-actor', '담당자를 입력해주세요.');
        hasError = true;
    }

    if (hasError) return;

    closeActionModal();
    document.getElementById('success-modal').classList.add('active');
};

window.closeSuccessModal = function () {
    const successModal = document.getElementById('success-modal');
    successModal.classList.remove('active');

    // Reset modal text to default (registration)
    const successTitle = successModal.querySelector('.modal-title');
    const successDesc = successModal.querySelector('.modal-desc');
    if (successTitle) successTitle.innerText = '등록 완료';
    if (successDesc) successDesc.innerText = '조치 내역이 성공적으로 등록되었습니다.';

    // Refresh simulation
    // Only add new action data if this was NOT a delete operation
    if (!isDeleteOperation && selectedFaultId) {
        const fault = faultsData.find(f => f.id === selectedFaultId);
        if (fault) {
            const dateValue = document.getElementById('reg-action-date').value;
            const timeValue = document.getElementById('reg-action-time').value;

            // Combine date and time, format as YYYY.MM.DD HH:MM
            const formattedTime = `${dateValue.replace(/-/g, '.')} ${timeValue}`;

            const newId = 'ACT-' + String(Date.now()).slice(-3);
            fault.actions.unshift({
                id: newId,
                time: formattedTime,
                actor: document.getElementById('reg-action-actor').value,
                content: document.getElementById('reg-action-content').value,
                result: document.getElementById('reg-action-result').value
            });
            renderActions(fault.actions);
        }
    }

    // Reset the flag
    isDeleteOperation = false;
};

// Filter Logic
window.toggleFilter = function (id) {
    const content = document.getElementById(`${id}-content`);
    const chevron = document.getElementById(`${id}-chevron`);
    const isHidden = content.classList.toggle('hidden');
    if (chevron) chevron.style.transform = isHidden ? 'rotate(0deg)' : 'rotate(180deg)';
};

window.applyFaultFilter = function () {
    const levelTerm = document.getElementById('filter-fault-level').value;
    const statusTerm = document.getElementById('filter-fault-status').value;
    const startDate = document.getElementById('filter-date-start').value;
    const endDate = document.getElementById('filter-date-end').value;

    const filtered = faultsData.filter(f => {
        const matchLevel = levelTerm === 'all' || f.level === levelTerm;
        const matchStatus = statusTerm === 'all' || f.status === statusTerm;

        // Date filtering
        let matchDate = true;
        if (startDate || endDate) {
            const faultDate = f.time.split(' ')[0].replace(/\./g, '-');
            if (startDate && faultDate < startDate) matchDate = false;
            if (endDate && faultDate > endDate) matchDate = false;
        }

        return matchLevel && matchStatus && matchDate;
    });

    renderFaults(filtered);
};

window.resetFaultFilter = function () {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('filter-fault-level').value = 'all';
    document.getElementById('filter-fault-status').value = 'all';
    document.getElementById('filter-date-start').value = today;
    document.getElementById('filter-date-end').value = today;
    renderFaults(faultsData);
};

// Delete Action
window.deleteAction = function (actionId) {
    pendingDeleteActionId = actionId;
    const modal = document.getElementById('confirm-modal');
    modal.classList.add('active');
    lucide.createIcons();
};


// Success modal logic is handled by showSuccessModal in common.js but they have custom success logic here
