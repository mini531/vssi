// IFP_RS_01_01.js - 예약 관리 스크립트
// ─────────────────────────────────────────────────────────────────────────────

/** 버티포트 데이터 (IVM_DB_01_01.js와 동일) */
const VERTIPORTS = [
    { id: 'VP-01', name: '길천 버티포트' },
    { id: 'VP-02', name: '자수정 동굴' },
    { id: 'VP-03', name: '일산해수욕장' },
    { id: 'VP-04', name: '울산대공원' },
    { id: 'VP-05', name: '울산역' },
    { id: 'VP-06', name: '울산과학기술원' },
    { id: 'VP-07', name: '태화강역' },
    { id: 'VP-08', name: '울산공항' },
];

/** 더미 예약 데이터 생성 (오늘 날짜 기준) */
const _today = new Date();
const _format = (d) => {
    const y = d.getFullYear();
    const m = (d.getMonth() + 1).toString().padStart(2, '0');
    const _d = d.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${_d}`;
};
const todayStr = _format(_today);
const yesterdayStr = _format(new Date(_today.getTime() - 86400000));

const MOCK_RESERVATIONS = [
    { id: 'RS-2026-0001', date: yesterdayStr, type: '정기', operator: '운항사A', flightNo: 'UA101', from: 'VP-01', depTime: '09:10', to: 'VP-03', arrTime: '10:15', status: '대기', matching: '매칭 대기' },
    { id: 'RS-2026-0002', date: todayStr, type: '정기', operator: '운항사B', flightNo: 'UB202', from: 'VP-02', depTime: '10:20', to: 'VP-04', arrTime: '10:45', status: '승인', matching: '매칭 완료', fplId: 'FPL-2026-0001' },
    { id: 'RS-2026-0003', date: todayStr, type: '부정기', operator: '운항사C', flightNo: 'UC303', from: 'VP-03', depTime: '11:30', to: 'VP-05', arrTime: '12:15', status: '확정', matching: '매칭 완료', fplId: 'FPL-2026-0002' },
    { id: 'RS-2026-0004', date: todayStr, type: '주문형', operator: '운항사D', flightNo: 'UD404', from: 'VP-07', depTime: '13:00', to: 'VP-06', arrTime: '13:45', status: '반려-승인', matching: '매칭 대기' },
    { id: 'RS-2026-0005', date: todayStr, type: '부정기', operator: '운항사D', flightNo: 'UD405', from: 'VP-05', depTime: '14:30', to: 'VP-08', arrTime: '15:15', status: '승인', matching: '매칭 완료', fplId: 'FPL-2026-0003' },
    { id: 'RS-2026-0006', date: todayStr, type: '정기', operator: '운항사A', flightNo: 'UA102', from: 'VP-06', depTime: '15:00', to: 'VP-04', arrTime: '15:45', status: '확정', matching: '매칭 완료', fplId: 'FPL-2026-0004' },
    { id: 'RS-2026-0007', date: todayStr, type: '주문형', operator: '운항사B', flightNo: 'UB203', from: 'VP-01', depTime: '16:10', to: 'VP-02', arrTime: '16:50', status: '대기', matching: '매칭 대기' },
    { id: 'RS-2026-0008', date: todayStr, type: '정기', operator: '운항사C', flightNo: 'UC304', from: 'VP-04', depTime: '08:00', to: 'VP-07', arrTime: '08:45', status: '반려-확정', matching: '매칭 대기' },
    { id: 'RS-2026-0009', date: todayStr, type: '부정기', operator: '운항사A', flightNo: 'UA103', from: 'VP-08', depTime: '09:30', to: 'VP-05', arrTime: '10:20', status: '확정', matching: '매칭 완료', fplId: 'FPL-2026-0005' },
    { id: 'RS-2026-0010', date: todayStr, type: '정기', operator: '운항사B', flightNo: 'UB204', from: 'VP-02', depTime: '11:00', to: 'VP-01', arrTime: '11:45', status: '승인', matching: '매칭 완료', fplId: 'FPL-2026-0006' },
    { id: 'RS-2026-0011', date: todayStr, type: '주문형', operator: '운항사C', flightNo: 'UC305', from: 'VP-03', depTime: '12:15', to: 'VP-04', arrTime: '13:00', status: '대기', matching: '매칭 대기' },
    { id: 'RS-2026-0012', date: todayStr, type: '부정기', operator: '운항사D', flightNo: 'UD406', from: 'VP-05', depTime: '14:00', to: 'VP-03', arrTime: '14:50', status: '승인', matching: '매칭 완료', fplId: 'FPL-2026-0007' },
    { id: 'RS-2026-0013', date: todayStr, type: '정기', operator: '운항사A', flightNo: 'UA104', from: 'VP-06', depTime: '15:30', to: 'VP-08', arrTime: '16:20', status: '확정', matching: '매칭 완료', fplId: 'FPL-2026-0008' },
    { id: 'RS-2026-0014', date: todayStr, type: '부정기', operator: '운항사B', flightNo: 'UB205', from: 'VP-01', depTime: '10:00', to: 'VP-07', arrTime: '10:45', status: '대기', matching: '매칭 대기' },
    { id: 'RS-2026-0015', date: todayStr, type: '주문형', operator: '운항사C', flightNo: 'UC306', from: 'VP-04', depTime: '11:45', to: 'VP-02', arrTime: '12:30', status: '반려-확정', matching: '매칭 대기' },
    { id: 'RS-2026-0016', date: todayStr, type: '정기', operator: '운항사D', flightNo: 'UD407', from: 'VP-08', depTime: '13:20', to: 'VP-05', arrTime: '14:10', status: '승인', matching: '매칭 완료', fplId: 'FPL-2026-0009' },
    { id: 'RS-2026-0017', date: todayStr, type: '부정기', operator: '운항사A', flightNo: 'UA105', from: 'VP-02', depTime: '15:10', to: 'VP-06', arrTime: '15:55', status: '확정', matching: '매칭 완료', fplId: 'FPL-2026-0010' },
    { id: 'RS-2026-0018', date: todayStr, type: '정기', operator: '운항사C', flightNo: 'UC307', from: 'VP-07', depTime: '16:40', to: 'VP-01', arrTime: '17:25', status: '승인', matching: '매칭 완료', fplId: 'FPL-2026-0011' },
    { id: 'RS-2026-0019', date: todayStr, type: '주문형', operator: '운항사B', flightNo: 'UB206', from: 'VP-05', depTime: '09:00', to: 'VP-08', arrTime: '10:00', status: '대기', matching: '매칭 대기' },
    { id: 'RS-2026-0020', date: todayStr, type: '정기', operator: '운항사D', flightNo: 'UD408', from: 'VP-03', depTime: '10:30', to: 'VP-04', arrTime: '11:15', status: '확정', matching: '매칭 완료', fplId: 'FPL-2026-0012' },
];

/** 상태별 배지 클래스 매핑 */
const STATUS_BADGE_MAP = {
    '대기': 'badge-warning',
    '승인': 'badge-success',
    '확정': 'badge-info',
    '반려-승인': 'badge-error',
    '반려-확정': 'badge-error',
    '매칭 완료': 'badge-success',
    '매칭 대기': 'badge-default',
    '정기': 'badge-info',
    '부정기': 'badge-purple',
    '주문형': 'badge-orange'
};

function vpName(vpId) {
    const vp = VERTIPORTS.find(v => v.id === vpId);
    return vp ? vp.name : vpId;
}

/** 버티포트 셀렉트 박스 초기화 */
function initVpSelects() {
    const depSelect = document.getElementById('departure-vp');
    const arrSelect = document.getElementById('arrival-vp');
    if (!depSelect || !arrSelect) return;

    VERTIPORTS.forEach(vp => {
        const opt1 = document.createElement('option');
        opt1.value = vp.id;
        opt1.textContent = vp.name;
        depSelect.appendChild(opt1);

        const opt2 = document.createElement('option');
        opt2.value = vp.id;
        opt2.textContent = vp.name;
        arrSelect.appendChild(opt2);
    });
}



/** 필터 상태 */
let currentFilters = {
    type: 'all',
    status: 'all',
    startDate: '',
    endDate: '',
    rsvNo: '',
    operator: '',
    flightNo: '',
    fromVp: 'all',
    toVp: 'all',
    matching: 'all'
};

/** 데이터 필터링 (메인 검색 패널 기준) */
function getSearchedData() {
    return MOCK_RESERVATIONS.filter(rs => {
        const dateMatch = (!currentFilters.startDate || rs.date >= currentFilters.startDate) &&
            (!currentFilters.endDate || rs.date <= currentFilters.endDate);
        const rsvNoMatch = !currentFilters.rsvNo || rs.id.toLowerCase().includes(currentFilters.rsvNo.toLowerCase());
        const operatorMatch = !currentFilters.operator || rs.operator.toLowerCase().includes(currentFilters.operator.toLowerCase());
        const flightNoMatch = !currentFilters.flightNo || rs.flightNo.toLowerCase().includes(currentFilters.flightNo.toLowerCase());
        const fromVpMatch = currentFilters.fromVp === 'all' || rs.from === currentFilters.fromVp;
        const toVpMatch = currentFilters.toVp === 'all' || rs.to === currentFilters.toVp;
        const matchingMatch = currentFilters.matching === 'all' || rs.matching === currentFilters.matching;

        return dateMatch && rsvNoMatch && operatorMatch && flightNoMatch && fromVpMatch && toVpMatch && matchingMatch;
    });
}

/** 데이터 전체 필터링 (써머리 퀵 필터 포함) */
function getFilteredReservations(data) {
    return data.filter(rs => {
        const typeMatch = currentFilters.type === 'all' || rs.type === currentFilters.type;

        let statusMatch = true;
        if (currentFilters.status !== 'all') {
            if (currentFilters.status === '반려') {
                statusMatch = rs.status.startsWith('반려');
            } else {
                statusMatch = rs.status === currentFilters.status;
            }
        }

        return typeMatch && statusMatch;
    });
}

/** 검색 실행 */
function performSearch() {
    currentFilters.startDate = document.getElementById('filter-date-start')?.value || '';
    currentFilters.endDate = document.getElementById('filter-date-end')?.value || '';
    currentFilters.rsvNo = document.getElementById('filter-rsv-no')?.value || '';
    currentFilters.operator = document.getElementById('filter-operator')?.value || '';
    currentFilters.flightNo = document.getElementById('filter-flight-no')?.value || '';
    currentFilters.fromVp = document.getElementById('departure-vp')?.value || 'all';
    currentFilters.toVp = document.getElementById('arrival-vp')?.value || 'all';
    currentFilters.matching = document.getElementById('filter-matching')?.value || 'all';

    currentSearchedData = getSearchedData();
    renderReservations(currentSearchedData);
}

/** 필터 초기화 */
function resetFilters() {
    const defaultDate = todayStr;
    if (document.getElementById('filter-date-start')) document.getElementById('filter-date-start').value = defaultDate;
    if (document.getElementById('filter-date-end')) document.getElementById('filter-date-end').value = defaultDate;
    if (document.getElementById('filter-rsv-no')) document.getElementById('filter-rsv-no').value = '';
    if (document.getElementById('filter-operator')) document.getElementById('filter-operator').value = '';
    if (document.getElementById('filter-flight-no')) document.getElementById('filter-flight-no').value = '';
    if (document.getElementById('departure-vp')) document.getElementById('departure-vp').value = 'all';
    if (document.getElementById('arrival-vp')) document.getElementById('arrival-vp').value = 'all';
    if (document.getElementById('filter-matching')) document.getElementById('filter-matching').value = 'all';

    // 퀵 필터 초기화
    currentFilters.type = 'all';
    currentFilters.status = 'all';

    document.querySelectorAll('.summary-flat-item').forEach(btn => btn.classList.remove('active'));
    document.querySelector('#summary-type [data-type="all"]')?.classList.add('active');
    document.querySelector('#summary-status [data-status="all"]')?.classList.add('active');


    performSearch();
}

/** 써머리 통계 계산 및 렌더링 (상호 유기적 필터링 반영) */
function renderSummary(data = currentSearchedData) {
    // 1. 예약 형식 통계 계산 (현재 선택된 '상태' 필터 영향 받음)
    const dataFilteredByStatus = data.filter(rs => {
        if (currentFilters.status === 'all') return true;
        if (currentFilters.status === '반려') return rs.status.startsWith('반려');
        return rs.status === currentFilters.status;
    });

    const typeCounts = { all: dataFilteredByStatus.length, '정기': 0, '부정기': 0, '주문형': 0 };
    dataFilteredByStatus.forEach(rs => {
        if (typeCounts[rs.type] !== undefined) typeCounts[rs.type]++;
    });

    // 2. 상태 통계 계산 (현재 선택된 '예약 형식' 필터 영향 받음)
    const dataFilteredByType = data.filter(rs => {
        if (currentFilters.type === 'all') return true;
        return rs.type === currentFilters.type;
    });

    const statusCounts = { all: dataFilteredByType.length, '대기': 0, '승인': 0, '확정': 0, '반려': 0 };
    dataFilteredByType.forEach(rs => {
        if (rs.status === '대기') statusCounts['대기']++;
        else if (rs.status === '승인') statusCounts['승인']++;
        else if (rs.status === '확정') statusCounts['확정']++;
        else if (rs.status.startsWith('반려')) statusCounts['반려']++;
    });

    // 3. UI 업데이트
    Object.keys(typeCounts).forEach(key => {
        const btn = document.querySelector(`#summary-type [data-type="${key}"]`);
        if (btn) btn.querySelector('.db-card-value').textContent = typeCounts[key];
    });

    Object.keys(statusCounts).forEach(key => {
        const btn = document.querySelector(`#summary-status [data-status="${key}"]`);
        if (btn) btn.querySelector('.db-card-value').textContent = statusCounts[key];
    });
}

/** 전역 변수로 현재 검색 결과 저장 */
let currentSearchedData = [];

/** 테이블 렌더링 (필터 적용) */
function renderReservations(data = currentSearchedData) {
    // 써머리 통계 상호 업데이트
    renderSummary(data);

    const tbody = document.getElementById('reservation-table-body');
    const totalCount = document.getElementById('total-count');
    if (!tbody) return;

    const filtered = getFilteredReservations(data);

    tbody.innerHTML = filtered.map(rs => `
        <tr class="data-table-row">
            <td class="font-medium">${rs.id}</td>
            <td class="td-center">${rs.date}</td>
            <td class="td-center"><span class="badge ${STATUS_BADGE_MAP[rs.type]}">${rs.type}</span></td>
            <td>${rs.operator}</td>
            <td>${rs.flightNo}</td>
            <td>${vpName(rs.from)}</td>
            <td class="td-center">${rs.depTime}</td>
            <td>${vpName(rs.to)}</td>
            <td class="td-center">${rs.arrTime}</td>
            <td class="td-center"><span class="badge ${STATUS_BADGE_MAP[rs.status]}">${rs.status}</span></td>
            <td class="td-center"><span class="badge ${STATUS_BADGE_MAP[rs.matching]}">${rs.matching}</span></td>
            <td class="td-center">
                <button class="btn-xs btn-secondary btn-detail" title="세부 정보" data-id="${rs.id}">
                    <i data-lucide="info" class="w-3 h-3"></i>
                    <span>세부 정보</span>
                </button>
            </td>
            <td class="td-center">
                <button class="btn-xs btn-secondary btn-log" title="로그" data-id="${rs.id}">
                    <i data-lucide="history" class="w-3 h-3"></i>
                    <span>로그</span>
                </button>
            </td>
        </tr>
    `).join('');

    if (totalCount) totalCount.textContent = `총 ${filtered.length} 건`;
    if (window.lucide) lucide.createIcons();

    // 세부 정보 버튼 이벤트 바인딩
    document.querySelectorAll('.btn-detail').forEach(btn => {
        btn.onclick = (e) => {
            const id = e.target.closest('button').dataset.id;
            openReservationDetail(id, 'detail');
        };
    });

    // 로그 버튼 이벤트 바인딩
    document.querySelectorAll('.btn-log').forEach(btn => {
        btn.onclick = (e) => {
            const id = e.target.closest('button').dataset.id;
            openReservationDetail(id, 'log');
        };
    });
}

/** 상세 모달 열기 */
function openReservationDetail(id, initialTab = 'detail') {
    const rs = MOCK_RESERVATIONS.find(item => item.id === id);
    if (!rs) return;

    // 데이터 채우기
    document.getElementById('modal-res-id').textContent = rs.id;
    document.getElementById('modal-res-operator').textContent = rs.operator;
    document.getElementById('modal-res-flightNo').textContent = rs.flightNo;
    document.getElementById('modal-res-type').textContent = rs.type;
    document.getElementById('modal-res-date').textContent = rs.date;
    document.getElementById('modal-res-from').textContent = vpName(rs.from);
    document.getElementById('modal-res-to').textContent = vpName(rs.to);
    document.getElementById('modal-res-depTime').textContent = rs.depTime;
    document.getElementById('modal-res-arrTime').textContent = rs.arrTime;
    document.getElementById('modal-log-res-id').textContent = rs.id;

    // 로그 탭 타임라인 렌더링
    renderLogTimeline(rs);

    // 상태 배지

    // 상태 배지
    const statusEl = document.getElementById('modal-res-status');
    statusEl.innerHTML = `<span class="badge ${STATUS_BADGE_MAP[rs.status] || 'badge-default'}">${rs.status}</span>`;

    // 매칭 배지
    const matchingEl = document.getElementById('modal-res-matching');
    matchingEl.innerHTML = `<span class="badge ${STATUS_BADGE_MAP[rs.matching] || 'badge-default'}">${rs.matching}</span>`;

    // 비행계획 매칭 섹션 및 탭 노출 제어
    const fplSection = document.getElementById('fpl-match-section');
    const fplTabHeader = document.getElementById('modal-tab-header-fpl');

    if (rs.matching === '매칭 완료') {
        fplSection.classList.remove('hidden');
        fplTabHeader.classList.remove('hidden');

        const fplId = rs.fplId || `FPL-${rs.date.replace(/-/g, '')}-${rs.id.split('-').pop()}`;

        // 상세 섹션 내 요약 정보
        document.getElementById('modal-fpl-id').textContent = fplId;

        // 비행계획서 탭 데이터 채우기
        document.getElementById('modal-fpl-res-id').textContent = rs.id;
        document.getElementById('modal-fpl-id-summary').textContent = fplId;

        document.getElementById('modal-fpl-basic-id').textContent = fplId;
        document.getElementById('modal-fpl-basic-flightNo').textContent = rs.flightNo;
        document.getElementById('modal-fpl-basic-operator').textContent = rs.operator;

        document.getElementById('modal-fpl-route-from').textContent = vpName(rs.from);
        document.getElementById('modal-fpl-route-to').textContent = vpName(rs.to);
        document.getElementById('modal-fpl-route-path').textContent = `${vpName(rs.from)} → ${vpName(rs.to)}`;

        document.getElementById('modal-fpl-time-eobt').textContent = rs.depTime;
        document.getElementById('modal-fpl-time-eldt').textContent = rs.arrTime;

        document.getElementById('modal-fpl-match-res-id').textContent = rs.id;
        document.getElementById('modal-fpl-match-datetime').textContent = `${todayStr} 10:00:15`;
    } else {
        fplSection.classList.add('hidden');
        fplTabHeader.classList.add('hidden');
    }

    // 모달 활성화 및 탭 초기화
    switchModalTab(initialTab);
    document.getElementById('reservation-detail-modal').classList.add('active');
    if (window.lucide) lucide.createIcons();
}

/** 상세 모달 닫기 */
function closeReservationDetail() {
    document.getElementById('reservation-detail-modal').classList.remove('active');
}

/** 모달 탭 전환 */
function switchModalTab(tab) {
    const detailTab = document.getElementById('modal-tab-detail');
    const fplTab = document.getElementById('modal-tab-fpl');
    const logTab = document.getElementById('modal-tab-log');
    const tabItems = document.querySelectorAll('.modal-tab-item');

    detailTab.classList.add('hidden');
    if (fplTab) fplTab.classList.add('hidden');
    logTab.classList.add('hidden');
    tabItems.forEach(i => i.classList.remove('active'));

    if (tab === 'detail') {
        detailTab.classList.remove('hidden');
        tabItems[0].classList.add('active');
    } else if (tab === 'log') {
        logTab.classList.remove('hidden');
        tabItems[1].classList.add('active');
    } else if (tab === 'fpl') {
        if (fplTab) fplTab.classList.remove('hidden');
        tabItems[2].classList.add('active');
    }

    if (window.lucide) lucide.createIcons();
}

/** CSV 다운로드 */
function downloadReservationsAsCSV() {
    const data = getFilteredReservations(currentSearchedData);
    if (data.length === 0) {
        alert('다운로드할 데이터가 없습니다.');
        return;
    }

    // 헤더 (세부 정보, 로그 제외)
    const headers = ['예약 번호', '운항일', '예약 형식', '운항사', '편명', '이륙 버티포트', '이륙 시각', '착륙 버티포트', '착륙 시각', '상태', '비행계획서 매칭'];

    // 데이터 행 생성
    const rows = data.map(rs => [
        rs.id,
        rs.date,
        rs.type,
        rs.operator,
        rs.flightNo,
        vpName(rs.from),
        rs.depTime,
        vpName(rs.to),
        rs.arrTime,
        rs.status,
        rs.matching
    ]);

    // CSV 문자열 합치기 (BOM 추가로 엑셀 한글 깨짐 방지)
    const csvContent = "\uFEFF" + [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');

    link.setAttribute('href', url);
    link.setAttribute('download', `예약목록_${timestamp}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/** 이벤트 바인딩 */
function initEvents() {
    // 써머리 클릭
    const typeItems = document.querySelectorAll('#summary-type .summary-flat-item');
    const statusItems = document.querySelectorAll('#summary-status .summary-flat-item');

    typeItems.forEach(item => {
        item.addEventListener('click', () => {
            typeItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            currentFilters.type = item.getAttribute('data-type');
            renderReservations();
        });
    });

    statusItems.forEach(item => {
        item.addEventListener('click', () => {
            statusItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            currentFilters.status = item.getAttribute('data-status');
            renderReservations();
        });
    });

    // 검색 버튼
    const searchBtn = document.querySelector('.filter-btn-search');
    if (searchBtn) searchBtn.addEventListener('click', performSearch);

    // 초기화 버튼
    const resetBtn = document.querySelector('.filter-btn-reset');
    if (resetBtn) resetBtn.addEventListener('click', resetFilters);

    // 다운로드 버튼
    const downloadBtn = document.getElementById('btn-download');
    if (downloadBtn) downloadBtn.addEventListener('click', downloadReservationsAsCSV);
}

/** 초기화 */
document.addEventListener('DOMContentLoaded', () => {
    const defaultDate = todayStr;
    const startInput = document.getElementById('filter-date-start');
    const endInput = document.getElementById('filter-date-end');
    if (startInput) startInput.value = defaultDate;
    if (endInput) endInput.value = defaultDate;

    initVpSelects();
    initEvents();

    // 초기 검색 실행 (전체 데이터 로드)
    performSearch();
});

/** 처리 이력 타임라인 렌더링 */
function renderLogTimeline(rs) {
    const container = document.getElementById('log-timeline-container');
    if (!container) return;

    const logs = [];
    const baseDate = todayStr;

    // 1. 요청 (기본)
    logs.push({
        category: 'REQUEST',
        actor: rs.operator,
        action: '예약 요청',
        timestamp: `${baseDate} 10:00:05`,
        details: `${vpName(rs.from)} → ${vpName(rs.to)} 노선 FATO 예약 요청`
    });

    // 2. 승인 (승인 이상 상태)
    if (['승인', '확정', '완료', '반려-승인', '반려-확정'].includes(rs.status)) {
        logs.push({
            category: 'APPROVAL',
            actor: vpName(rs.from),
            action: '이륙 버티포트 승인',
            timestamp: `${baseDate} 10:00:08`,
            details: '이륙 자원(FATO 1) 승인 완료'
        });
        logs.push({
            category: 'APPROVAL',
            actor: vpName(rs.to),
            action: '착륙 버티포트 승인',
            timestamp: `${baseDate} 10:00:10`,
            details: '착륙 자원(FATO 1) 승인 완료'
        });
    }

    // 3. 반려-승인 (VPO 타임아웃 등)
    if (rs.status === '반려-승인') {
        logs.push({
            category: 'SYSTEM',
            actor: '통합버티포트시스템',
            action: '예약 반려',
            timestamp: `${baseDate} 10:10:25`,
            details: 'VPO 응답 타임아웃으로 예약 반려 및 운항사에 통보'
        });
    }

    // 4. 자원 배정 (확정 이상 상태)
    if (['확정', '완료', '반려-확정'].includes(rs.status)) {
        logs.push({
            category: 'ALLOCATION',
            actor: '통합버티포트시스템',
            action: 'FATO 자원 배정',
            timestamp: `${baseDate} 10:00:11`,
            details: '출도착 FATO 자원(A1, B2) 배정 및 10분 안전 마진 확보'
        });
    }

    // 5. 확정 및 통보
    if (['확정', '완료'].includes(rs.status)) {
        logs.push({
            category: 'CONFIRMATION',
            actor: '통합버티포트시스템',
            action: '예약 확정 및 통보',
            timestamp: `${baseDate} 10:00:12`,
            details: `최종 예약 확정 통보 (${rs.operator})`
        });
        
        // FPL 매칭
        if (rs.matching === '매칭 완료') {
            logs.push({
                category: 'SYSTEM',
                actor: '통합비행계획시스템',
                action: '비행계획서 매칭',
                timestamp: `${baseDate} 10:00:15`,
                details: `비행계획서 ${rs.fplId || 'FPL-2026-0001'}와 예약 정보 매칭 완료`
            });
        }
    }

    // 6. 반려-확정
    if (rs.status === '반려-확정') {
        logs.push({
            category: 'SYSTEM',
            actor: '통합버티포트시스템',
            action: '예약 반려',
            timestamp: `${baseDate} 10:05:00`,
            details: 'FATO 자원 할당 실패로 예약 반려 및 운항사에 통보'
        });
    }

    // 시간 역순 정렬 (최근 것이 위로)
    logs.reverse();

    // 카테고리 한글 매핑
    const categoryMap = {
        'REQUEST': '요청',
        'APPROVAL': '승인',
        'ALLOCATION': '배정',
        'CONFIRMATION': '확정',
        'SYSTEM': '시스템'
    };

    // HTML 생성
    container.innerHTML = logs.map(log => `
        <div class="log-timeline-item">
            <div class="log-timeline-dot dot-${log.category.toLowerCase()}"></div>
            <div class="log-item-header">
                <div class="log-item-title-group">
                    <span class="log-category-badge badge-${log.category.toLowerCase()}">${categoryMap[log.category] || log.category}</span>
                </div>
                <span class="log-item-timestamp">${log.timestamp}</span>
            </div>
            <div class="log-item-details">
                <span class="log-item-actor-tag">${log.actor}</span>
                <span class="log-detail-text-content">${log.action} - ${log.details}</span>
            </div>
        </div>
    `).join('');

    // 이력 총 건수 업데이트
    const historyCountEl = document.getElementById('modal-log-history-count');
    if (historyCountEl) {
        historyCountEl.textContent = `총 ${logs.length}건`;
    }
}

