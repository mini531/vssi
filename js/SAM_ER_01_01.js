/**
 * Fault Receipt Page Logic (SAM_ER_01_01)
 */

// Sample Fault Data
const faultsData = [
    {
        id: 'FLT-001',
        time: '2026.02.11 14:30:22',
        system: 'IVMS (버티포트 통합 관리 시스템)',
        registrant: '홍길동',
        status: '조치중',
        desc: '현재 버티포트 통합 제어 모듈에서 간헐적인 응답 지연 현상이 보고되고 있습니다. 통신 패킷 분석 결과, 피크 시간대 데이터 유입 급증으로 인한 버퍼 오버플로우가 원인으로 추정됩니다. 특히 이착륙 관제 데이터의 실시간 전송 과정에서 약 5% 수준의 패킷 손실이 확인되어 전반적인 관제 가시성에 영향을 주고 있는 상황입니다. 하드웨어 리소스 최적화 및 로드밸런싱 설정에 대한 전수 조사가 필요합니다.',
        actions: [
            { id: 'ACT-001', time: '2026.02.11 14:45', actor: '홍길동', content: '네트워크 구간 점검 및 스위치 설정 재확인', result: '조치중' },
            { id: 'ACT-002', time: '2026.02.11 15:00', actor: '홍길동', content: '방화벽 정책 임시 허용 및 트래픽 바이패스 처리', result: '조치중' }
        ]
    },
    {
        id: 'FLT-002',
        time: '2026.02.11 11:20:15',
        system: 'IFPS (통합 비행 계획 관리 시스템)',
        registrant: '이나영',
        status: '접수',
        desc: '인근 타 기관 비행 계획 수신 인터페이스의 응답 속도가 최근 1시간 동안 눈에 띄게 저하되었습니다. 평균 응답 시간(Response time)이 5초를 상회하고 있으며, 이로 인해 대기열에 비행 계획 데이터가 누적되고 있습니다. 외부망 연결 상태는 정상인 것으로 확인되나, API 서버의 쓰레드 풀 고갈 가능성이 높습니다. 대외 인터페이스 연동 상태 확인 및 해당 서버 로그 분석을 진행할 예정입니다.',
        actions: []
    },
    {
        id: 'FLT-003',
        time: '2026.02.10 17:50:00',
        system: 'IFRS (통합 운항 예약 시스템)',
        registrant: '김철수',
        status: '완료',
        desc: '예약 데이터베이스의 특정 테이블 검색 성능이 비정상적으로 저하되어 시스템 알람이 발생했습니다. 분석 결과, 대규모 데이터 삽입으로 인한 인덱스 파편화(Fragmentation)가 주요 원인으로 식별되었습니다. 이로 인해 사용자 검색 요청 시 타임아웃 오류가 빈번하게 발생했었으나, 인덱스 리빌드 작업을 통해 현재는 정상 수준의 응답 속도를 회복했습니다. 향후 주기적인 통계 정보 갱신을 자동화할 계획입니다.',
        actions: [
            { id: 'ACT-003', time: '2026.02.10 18:05', actor: '김철수', content: 'DB 인덱스 리빌드 및 통계 정보 갱신', result: '성공' }
        ]
    }
];

// Current user simulation
const currentUser = '홍길동';

let selectedFaultId = null;
let isRegMode = false;

document.addEventListener('DOMContentLoaded', () => {
    init();
});

function init() {
    // Filter data for current user only
    const myFaults = faultsData.filter(f => f.registrant === currentUser);
    renderFaults(myFaults);

    // Initialize date filters to today
    const today = new Date().toISOString().split('T')[0];
    const startInput = document.getElementById('filter-date-start');
    const endInput = document.getElementById('filter-date-end');
    if (startInput) startInput.value = today;
    if (endInput) endInput.value = today;

    lucide.createIcons();

    // Check for mode=reg in URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('mode') === 'reg') {
        initRegistrationMode();
    }
}

function renderFaults(list) {
    const listBody = document.getElementById('fault-list-body');
    const totalCount = document.getElementById('fault-total-count');

    listBody.innerHTML = '';
    totalCount.innerText = `총 ${list.length} 건`;

    if (list.length === 0) {
        listBody.innerHTML = `<tr><td colspan="3" class="td-center py-8 text-slate-500">장애 접수 내역이 없습니다.</td></tr>`;
        return;
    }

    list.forEach(fault => {
        const tr = document.createElement('tr');
        tr.className = 'data-table-row clickable-row';
        tr.dataset.faultId = fault.id;
        if (selectedFaultId === fault.id) tr.classList.add('active');

        tr.onclick = () => selectFault(fault.id, tr);

        tr.innerHTML = `
            <td data-label="시스템">${fault.system}</td>
            <td class="td-date text-center" data-label="등록 일시">${fault.time}</td>
            <td class="td-center" data-label="상태"><span class="badge ${getStatusClass(fault.status)}">${fault.status}</span></td>
        `;
        listBody.appendChild(tr);
    });
}

function selectFault(id, row) {
    if (isRegMode) {
        // Option: allow switching or block? 
        // Following SAM_US_01_01, list selection is often allowed to exit reg mode
        cancelRegistration();
    }

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
    document.getElementById('reg-content').classList.add('hidden');
    document.getElementById('detail-content').classList.remove('hidden');

    // Content
    document.getElementById('detail-system').innerText = fault.system;
    document.getElementById('detail-time').innerText = fault.time;
    document.getElementById('detail-status').innerHTML = `<span class="badge ${getStatusClass(fault.status)}">${fault.status}</span>`;
    document.getElementById('detail-desc').innerText = fault.desc;

    renderActions(fault.actions);

    // Mobile View Toggle
    if (typeof openDetailPane === 'function') openDetailPane();
}

function renderActions(actions) {
    const actionBody = document.getElementById('action-list-body');
    const totalCount = document.getElementById('action-total-count');
    actionBody.innerHTML = '';
    if (totalCount) totalCount.innerText = `총 ${actions ? actions.length : 0} 건`;

    if (!actions || actions.length === 0) {
        actionBody.innerHTML = `<tr><td colspan="4" class="td-center py-4 text-slate-500">등록된 조치 내역이 없습니다.</td></tr>`;
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
        `;
        actionBody.appendChild(tr);
    });
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

// Registration Mode Logic
window.initRegistrationMode = function () {
    isRegMode = true;
    selectedFaultId = null;

    // Deselect list
    document.querySelectorAll('#fault-list-body tr').forEach(tr => tr.classList.remove('active'));

    document.getElementById('empty-state').classList.add('hidden');
    document.getElementById('detail-content').classList.add('hidden');
    document.getElementById('reg-content').classList.remove('hidden');

    // Set current datetime
    document.getElementById('reg-fault-system').value = 'SAMS';
    document.getElementById('reg-fault-desc').value = '';

    clearAllFaultErrors();
    lucide.createIcons();

    if (typeof openDetailPane === 'function') openDetailPane();
};

window.cancelRegistration = function () {
    isRegMode = false;
    document.getElementById('reg-content').classList.add('hidden');

    if (selectedFaultId) {
        document.getElementById('detail-content').classList.remove('hidden');
    } else {
        document.getElementById('empty-state').classList.remove('hidden');
        // On mobile, if no parent view to return to, go back to list
        if (typeof closeDetailPane === 'function') {
            closeDetailPane();
        }
    }
};

window.resetFaultError = function (id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('error');
    const err = document.getElementById('error-' + id);
    if (err) err.innerText = '';
};

function setFaultError(id, msg) {
    const el = document.getElementById(id);
    if (el) el.classList.add('error');
    const err = document.getElementById('error-' + id);
    if (err) err.innerText = msg;
}

function clearAllFaultErrors() {
    ['reg-fault-system', 'reg-fault-desc'].forEach(id => {
        resetFaultError(id);
    });
}

window.handleFaultRegistration = function () {
    const system = document.getElementById('reg-fault-system').value;
    const desc = document.getElementById('reg-fault-desc').value;

    let hasError = false;
    clearAllFaultErrors();

    if (!system) {
        setFaultError('reg-fault-system', '시스템을 선택해주세요.');
        hasError = true;
    }
    if (!desc.trim()) {
        setFaultError('reg-fault-desc', '장애 내용을 입력해주세요.');
        hasError = true;
    }

    if (hasError) return;

    // Show Confirm Modal
    if (typeof showConfirmModal === 'function') {
        showConfirmModal('장애 접수 등록', '장애 접수 내용을 저장하시겠습니까?');
    }
};

window.confirmSaveRegistration = function () {
    // Hide registration UI
    isRegMode = false;
    const regContent = document.getElementById('reg-content');
    if (regContent) regContent.classList.add('hidden');

    // Simulation: Success
    showSuccessModal('등록 완료되었습니다.', '등록 완료');

    // On mobile, return to list view after saving
    if (typeof closeDetailPane === 'function') {
        closeDetailPane();
    }

    closeConfirmModal();
};

window.closeSuccessModal = function () {
    document.getElementById('success-modal').classList.remove('active');
    // Note: location.reload() removed to show in-session list removal for testing empty state
};

// Deletion Logic
window.showDeleteWarning = function () {
    if (!selectedFaultId) return;
    const modal = document.getElementById('delete-confirm-modal');
    if (modal) modal.classList.add('active');
};

window.closeDeleteConfirm = function () {
    const modal = document.getElementById('delete-confirm-modal');
    if (modal) modal.classList.remove('active');
};

window.confirmDeleteAction = function () {
    // Simulation: Remove from in-memory array
    const idx = faultsData.findIndex(f => f.id === selectedFaultId);
    if (idx > -1) {
        faultsData.splice(idx, 1);
    }

    // Refresh List
    applyFaultFilter();

    // Close Detail
    selectedFaultId = null;
    document.getElementById('detail-content').classList.add('hidden');
    document.getElementById('empty-state').classList.remove('hidden');

    // On mobile, return to list view after deletion
    if (typeof closeDetailPane === 'function') {
        closeDetailPane();
    }

    closeDeleteConfirm();
    showSuccessModal('삭제되었습니다.', '삭제 완료');
};

// Common Utilities
window.toggleFilter = function (id) {
    const content = document.getElementById(`${id}-content`);
    const chevron = document.getElementById(`${id}-chevron`);
    const isHidden = content.classList.toggle('hidden');
    if (chevron) chevron.style.transform = isHidden ? 'rotate(0deg)' : 'rotate(180deg)';
};

window.applyFaultFilter = function () {
    const statusTerm = document.getElementById('filter-fault-status').value;
    const startDate = document.getElementById('filter-date-start').value;
    const endDate = document.getElementById('filter-date-end').value;

    const myFaults = faultsData.filter(f => f.registrant === currentUser);

    const filtered = myFaults.filter(f => {
        const matchStatus = statusTerm === 'all' || f.status === statusTerm;
        let matchDate = true;
        if (startDate || endDate) {
            const faultDate = f.time.split(' ')[0].replace(/\./g, '-');
            if (startDate && faultDate < startDate) matchDate = false;
            if (endDate && faultDate > endDate) matchDate = false;
        }
        return matchStatus && matchDate;
    });

    renderFaults(filtered);
};

window.resetFaultFilter = function () {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('filter-fault-status').value = 'all';
    document.getElementById('filter-date-start').value = today;
    document.getElementById('filter-date-end').value = today;
    const myFaults = faultsData.filter(f => f.registrant === currentUser);
    renderFaults(myFaults);
};
