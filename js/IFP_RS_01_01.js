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

/** 더미 예약 데이터 */
const MOCK_RESERVATIONS = [
    { id: 'RS-2026-0001', date: '2026-03-17', type: '정기', operator: '운항사A', flightNo: 'UA101', from: 'VP-01', depTime: '09:10', to: 'VP-03', arrTime: '10:15', status: '대기', matching: '매칭 대기' },
    { id: 'RS-2026-0002', date: '2026-03-17', type: '정기', operator: '운항사B', flightNo: 'UB202', from: 'VP-02', depTime: '10:20', to: 'VP-04', arrTime: '10:45', status: '승인', matching: '매칭 완료' },
    { id: 'RS-2026-0003', date: '2026-03-17', type: '부정기', operator: '운항사C', flightNo: 'UC303', from: 'VP-03', depTime: '11:30', to: 'VP-05', arrTime: '12:15', status: '확정', matching: '매칭 완료' },
    { id: 'RS-2026-0004', date: '2026-03-17', type: '주문형', operator: '운항사D', flightNo: 'UD404', from: 'VP-07', depTime: '13:00', to: 'VP-06', arrTime: '13:45', status: '반려-승인', matching: '매칭 대기' },
    { id: 'RS-2026-0005', date: '2026-03-17', type: '부정기', operator: '운항사D', flightNo: 'UD405', from: 'VP-05', depTime: '14:30', to: 'VP-08', arrTime: '15:15', status: '승인', matching: '매칭 완료' },
    { id: 'RS-2026-0006', date: '2026-03-17', type: '정기', operator: '운항사A', flightNo: 'UA102', from: 'VP-06', depTime: '15:00', to: 'VP-04', arrTime: '15:45', status: '확정', matching: '매칭 완료' },
    { id: 'RS-2026-0007', date: '2026-03-17', type: '주문형', operator: '운항사B', flightNo: 'UB203', from: 'VP-01', depTime: '16:10', to: 'VP-02', arrTime: '16:50', status: '대기', matching: '매칭 대기' },
    { id: 'RS-2026-0008', date: '2026-03-17', type: '정기', operator: '운항사C', flightNo: 'UC304', from: 'VP-04', depTime: '08:00', to: 'VP-07', arrTime: '08:45', status: '반려-확정', matching: '매칭 대기' },
    { id: 'RS-2026-0009', date: '2026-03-17', type: '부정기', operator: '운항사A', flightNo: 'UA103', from: 'VP-08', depTime: '09:30', to: 'VP-05', arrTime: '10:20', status: '확정', matching: '매칭 완료' },
    { id: 'RS-2026-0010', date: '2026-03-17', type: '정기', operator: '운항사B', flightNo: 'UB204', from: 'VP-02', depTime: '11:00', to: 'VP-01', arrTime: '11:45', status: '승인', matching: '매칭 완료' },
    { id: 'RS-2026-0011', date: '2026-03-17', type: '주문형', operator: '운항사C', flightNo: 'UC305', from: 'VP-03', depTime: '12:15', to: 'VP-04', arrTime: '13:00', status: '대기', matching: '매칭 대기' },
    { id: 'RS-2026-0012', date: '2026-03-17', type: '부정기', operator: '운항사D', flightNo: 'UD406', from: 'VP-05', depTime: '14:00', to: 'VP-03', arrTime: '14:50', status: '승인', matching: '매칭 완료' },
    { id: 'RS-2026-0013', date: '2026-03-17', type: '정기', operator: '운항사A', flightNo: 'UA104', from: 'VP-06', depTime: '15:30', to: 'VP-08', arrTime: '16:20', status: '확정', matching: '매칭 완료' },
    { id: 'RS-2026-0014', date: '2026-03-17', type: '부정기', operator: '운항사B', flightNo: 'UB205', from: 'VP-01', depTime: '10:00', to: 'VP-07', arrTime: '10:45', status: '대기', matching: '매칭 대기' },
    { id: 'RS-2026-0015', date: '2026-03-17', type: '주문형', operator: '운항사C', flightNo: 'UC306', from: 'VP-04', depTime: '11:45', to: 'VP-02', arrTime: '12:30', status: '반려-확정', matching: '매칭 대기' },
    { id: 'RS-2026-0016', date: '2026-03-17', type: '정기', operator: '운항사D', flightNo: 'UD407', from: 'VP-08', depTime: '13:20', to: 'VP-05', arrTime: '14:10', status: '승인', matching: '매칭 완료' },
    { id: 'RS-2026-0017', date: '2026-03-17', type: '부정기', operator: '운항사A', flightNo: 'UA105', from: 'VP-02', depTime: '15:10', to: 'VP-06', arrTime: '15:55', status: '확정', matching: '매칭 완료' },
    { id: 'RS-2026-0018', date: '2026-03-17', type: '정기', operator: '운항사C', flightNo: 'UC307', from: 'VP-07', depTime: '16:40', to: 'VP-01', arrTime: '17:25', status: '승인', matching: '매칭 완료' },
    { id: 'RS-2026-0019', date: '2026-03-17', type: '주문형', operator: '운항사B', flightNo: 'UB206', from: 'VP-05', depTime: '09:00', to: 'VP-08', arrTime: '10:00', status: '대기', matching: '매칭 대기' },
    { id: 'RS-2026-0020', date: '2026-03-17', type: '정기', operator: '운항사D', flightNo: 'UD408', from: 'VP-03', depTime: '10:30', to: 'VP-04', arrTime: '11:15', status: '확정', matching: '매칭 완료' },
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
    renderSummary(currentSearchedData);
    renderReservations(currentSearchedData);
}

/** 필터 초기화 */
function resetFilters() {
    // 입력 필드 초기화 (시나리오에 맞춰 2026-03-17 고정)
    const defaultDate = '2026-03-17';
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

    document.querySelectorAll('.summary-item').forEach(btn => btn.classList.remove('active'));
    document.querySelector('#summary-type [data-type="all"]')?.classList.add('active');
    document.querySelector('#summary-status [data-status="all"]')?.classList.add('active');

    performSearch();
}

/** 써머리 통계 계산 및 렌더링 */
function renderSummary(data = MOCK_RESERVATIONS) {
    const typeCounts = { all: data.length, '정기': 0, '부정기': 0, '주문형': 0 };
    const statusCounts = { all: data.length, '대기': 0, '승인': 0, '확정': 0, '반려': 0 };

    data.forEach(rs => {
        if (typeCounts[rs.type] !== undefined) typeCounts[rs.type]++;

        if (rs.status === '대기') statusCounts['대기']++;
        else if (rs.status === '승인') statusCounts['승인']++;
        else if (rs.status === '확정') statusCounts['확정']++;
        else if (rs.status.startsWith('반려')) statusCounts['반려']++;
    });

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
                <button class="btn-table-action btn-detail" title="세부 정보" data-id="${rs.id}">
                    <i data-lucide="info" class="w-3.5 h-3.5"></i>
                    <span>세부 정보</span>
                </button>
            </td>
            <td class="td-center">
                <button class="btn-table-action" title="로그">
                    <i data-lucide="history" class="w-3.5 h-3.5"></i>
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
            openReservationDetail(id);
        };
    });
}

/** 상세 모달 열기 */
function openReservationDetail(id) {
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
        const fplId = `FPL-${rs.date.replace(/-/g, '')}-${rs.id.split('-').pop()}`;
        document.getElementById('modal-fpl-id').textContent = fplId;
        document.getElementById('modal-fpl-detail-id').textContent = fplId;
    } else {
        fplSection.classList.add('hidden');
        fplTabHeader.classList.add('hidden');
    }

    // 모달 활성화 및 탭 초기화
    switchModalTab('detail');
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
    const typeItems = document.querySelectorAll('#summary-type .summary-item');
    const statusItems = document.querySelectorAll('#summary-status .summary-item');

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
    // 날짜 기본값 설정 (데이터 시나리오에 맞춰 2026-03-17 고정)
    const defaultDate = '2026-03-17';
    const startInput = document.getElementById('filter-date-start');
    const endInput = document.getElementById('filter-date-end');
    if (startInput) startInput.value = defaultDate;
    if (endInput) endInput.value = defaultDate;

    initVpSelects();
    initEvents();

    // 초기 검색 실행 (전체 데이터 로드)
    performSearch();
});
