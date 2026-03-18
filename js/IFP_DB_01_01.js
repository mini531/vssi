// IFP_DB_01_01.js - IFPS 대시보드 (개정판 v2 - 인라인 스타일 제거)
// ─────────────────────────────────────────────────────────────────────────────
// 데이터 정의
// ─────────────────────────────────────────────────────────────────────────────

/** IVM_DB_01_01.js와 동일한 8개 버티포트 */
const VERTIPORTS = [
    { id: 'VP-01', name: '길천 버티포트',   stand: '가용',   crowd: '낮음', fato: 1, stands: 1 },
    { id: 'VP-02', name: '자수정 동굴',      stand: '가용',   crowd: '낮음', fato: 1, stands: 1 },
    { id: 'VP-03', name: '일산해수욕장',     stand: '미가용', crowd: '보통', fato: 1, stands: 1 },
    { id: 'VP-04', name: '울산대공원',       stand: '가용',   crowd: '보통', fato: 1, stands: 3 },
    { id: 'VP-05', name: '울산역',           stand: '미가용', crowd: '높음', fato: 2, stands: 5 },
    { id: 'VP-06', name: '울산과학기술원',   stand: '가용',   crowd: '낮음', fato: 1, stands: 1 },
    { id: 'VP-07', name: '태화강역',         stand: '가용',   crowd: '보통', fato: 1, stands: 3 },
    { id: 'VP-08', name: '울산공항',         stand: '가용',   crowd: '낮음', fato: 2, stands: 5 },
];

/** 일일 자원예약 목록 */
const RESERVATIONS = [
    { id: 'RS-2026-0001', operator: '운항사A',  time: '09:10-10:15', from: 'VP-01', to: 'VP-03', status1: '정기',   status2: '대기' },
    { id: 'RS-2026-0002', operator: '운항사B',  time: '10:20-10:45', from: 'VP-02', to: 'VP-04', status1: '정기',   status2: '승인' },
    { id: 'RS-2026-0003', operator: '운항사C',  time: '11:30-12:15', from: 'VP-03', to: 'VP-05', status1: '부정기',  status2: '확정' },
    { id: 'RS-2026-0004', operator: '운항사D',  time: '13:00-13:45', from: 'VP-07', to: 'VP-06', status1: '주문형', status2: '승인' },
    { id: 'RS-2026-0005', operator: '운항사D',  time: '14:30-15:15', from: 'VP-05', to: 'VP-08', status1: '부정기',  status2: '반려' },
    { id: 'RS-2026-0006', operator: '운항사A',  time: '15:00-15:45', from: 'VP-06', to: 'VP-04', status1: '정기',   status2: '대기' },
];

/** 예약 상태 → 배지 색상 매핑 */
const RS_STATUS_MAP = {
    '정기':   'badge-info',
    '부정기': 'badge-purple',
    '주문형': 'badge-orange',
    '대기':   'badge-warning',
    '승인':   'badge-success',
    '확정':   'badge-info',
    '반려':   'badge-error',
};

/** 예약의 필터 상태 분류 */
const RS_FILTER_STATUS = {
    'RS-2026-0001': '대기',
    'RS-2026-0002': '승인',
    'RS-2026-0003': '확정',
    'RS-2026-0004': '승인',
    'RS-2026-0005': '반려',
    'RS-2026-0006': '대기',
};

/** 일일 비행계획 목록 */
const FLIGHT_PLANS = [
    { id: 'FPL-2026-0001', time: '08:30-10:15', from: 'VP-01', to: 'VP-03', status1: '정기',   status2: '승인',  timeline: 'rsv-ok'   },
    { id: 'FPL-2026-0002', time: '10:03-10:45', from: 'VP-02', to: 'VP-04', status1: '정기',   status2: '확정',  timeline: 'stand'    },
    { id: 'FPL-2026-0003', time: '11:30-12:15', from: 'VP-03', to: 'VP-06', status1: '부정기',  status2: '승인',  timeline: 'taxi'     },
    { id: 'FPL-2026-0004', time: '13:00-13:45', from: 'VP-07', to: 'VP-05', status1: '주문형', status2: '승인',  timeline: 'afit'     },
    { id: 'FPL-2026-0005', time: '14:30-15:15', from: 'VP-05', to: 'VP-08', status1: '정기',   status2: '확정',  timeline: 'atot'     },
    { id: 'FPL-2026-0006', time: '15:00-15:45', from: 'VP-02', to: 'VP-07', status1: '부정기',  status2: '승인',  timeline: 'airborne' },
    { id: 'FPL-2026-0007', time: '16:00-18:45', from: 'VP-04', to: 'VP-03', status1: '주문형', status2: '반려',  timeline: 'aldt'     },
];


/** 비행계획 필터 상태 */
const FP_FILTER_STATUS = {
    'FPL-2026-0001': '승인',
    'FPL-2026-0002': '확정',
    'FPL-2026-0003': '승인',
    'FPL-2026-0004': '승인',
    'FPL-2026-0005': '확정',
    'FPL-2026-0006': '승인',
    'FPL-2026-0007': '반려',
};

/** 타임라인 스텝 */
const TIMELINE_STEPS = [
    { key: 'rsv-ok',   label: '예약승인' },
    { key: 'plan-ok',  label: '계획승인' },
    { key: 'confirm',  label: '계획확정' },
    { key: 'stand',    label: 'STAND'    },
    { key: 'taxi',     label: '지상이동'  },
    { key: 'afit',     label: 'AFIT'     },
    { key: 'atot',     label: 'ATOT'     },
    { key: 'airborne', label: '비행중'    },
    { key: 'aldt',     label: 'ALDT'     },
    { key: 'afot',     label: 'AFOT'     },
    { key: 'aibt',     label: 'AIBT'     },
];


// ─────────────────────────────────────────────────────────────────────────────
// 상태 변수
// ─────────────────────────────────────────────────────────────────────────────
let selectedFplId = null;
let selectedVpId  = null;
let rsFilter      = 'all';
let fpFilter      = 'all';

// ─────────────────────────────────────────────────────────────────────────────
// 유틸
// ─────────────────────────────────────────────────────────────────────────────
function vpName(vpId) {
    const vp = VERTIPORTS.find(v => v.id === vpId);
    return vp ? vp.name : vpId;
}

function badgeClass(status) {
    return RS_STATUS_MAP[status] || 'badge-info';
}

function statusTheme(val) {
    if (val === '가용' || val === '낮음') return 'success';
    if (val === '보통') return 'warning';
    return 'error';
}

/** 요약 카운트 업데이트 */
function updateSummaryCounts() {
    // 필터링된 데이터 준비
    let rsData = RESERVATIONS;
    let fpData = FLIGHT_PLANS;

    if (selectedVpId) {
        rsData = rsData.filter(r => r.from === selectedVpId || r.to === selectedVpId);
        fpData = fpData.filter(fp => fp.from === selectedVpId || fp.to === selectedVpId);
    }

    // 자원예약 카운트
    document.getElementById('rs-cnt-all').textContent = rsData.length;
    document.getElementById('rs-cnt-wait').textContent = rsData.filter(r => r.status2 === '대기').length;
    document.getElementById('rs-cnt-ok').textContent = rsData.filter(r => r.status2 === '승인').length;
    document.getElementById('rs-cnt-adj').textContent = rsData.filter(r => r.status2 === '확정').length;
    document.getElementById('rs-cnt-err').textContent = rsData.filter(r => r.status2 === '반려').length;

    // 비행계획 카운트
    document.getElementById('fp-cnt-all').textContent = fpData.length;
    document.getElementById('fp-cnt-ok').textContent = fpData.filter(fp => fp.status2 === '승인').length;
    document.getElementById('fp-cnt-adj').textContent = fpData.filter(fp => fp.status2 === '확정').length;
    document.getElementById('fp-cnt-err').textContent = fpData.filter(fp => fp.status2 === '반려').length;
}

// ─────────────────────────────────────────────────────────────────────────────
// ① 버티포트 현황 렌더링
// ─────────────────────────────────────────────────────────────────────────────
function renderVertiports() {
    const grid = document.getElementById('vp-card-grid');
    if (!grid) return;

    grid.innerHTML = VERTIPORTS.map(vp => {
        const fpCnt   = FLIGHT_PLANS.filter(fp => fp.from === vp.id || fp.to === vp.id);
        const total     = fpCnt.length;
        const confirmed = fpCnt.filter(fp => fp.status2 === '확정').length;
        const approved  = fpCnt.filter(fp => fp.status2 === '승인').length;
        const missed    = fpCnt.filter(fp => fp.status2 === '반려').length;
        const isActive = selectedVpId === vp.id ? ' active' : '';

        return `<article class="ifps-vp-card${isActive}" data-vp-id="${vp.id}">
            <header class="ifps-vp-card-header">
                <span class="ifps-vp-card-name">${vp.name}</span>
            </header>
            <dl class="ifps-vp-card-stats">
                <dt class="ifps-vp-stat-label">일일 총편수</dt>
                <dd class="ifps-vp-stat-value">${total}편</dd>
                <dt class="ifps-vp-stat-label">확정 편수</dt>
                <dd class="ifps-vp-stat-value">${confirmed}편</dd>
                <dt class="ifps-vp-stat-label">완료 편수</dt>
                <dd class="ifps-vp-stat-value text-success">${approved}편</dd>
                <dt class="ifps-vp-stat-label">미실시 편수</dt>
                <dd class="ifps-vp-stat-value${missed > 0 ? ' text-error' : ''}">${missed}편</dd>
            </dl>
        </article>`;
    }).join('');

    // 클릭 이벤트 위임
    grid.querySelectorAll('.ifps-vp-card').forEach(el => {
        el.addEventListener('click', () => selectVertiport(el.dataset.vpId));
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// ② 자원예약 목록 렌더링
// ─────────────────────────────────────────────────────────────────────────────
function renderReservationList() {
    const ul = document.getElementById('reservation-list');
    if (!ul) return;

    let data = RESERVATIONS;
    if (selectedVpId) {
        data = data.filter(r => r.from === selectedVpId || r.to === selectedVpId);
    }
    if (rsFilter !== 'all') {
        data = data.filter(r => RS_FILTER_STATUS[r.id] === rsFilter);
    }

    if (data.length === 0) {
        ul.innerHTML = `<li class="ifps-empty-msg">조건에 맞는 예약이 없습니다</li>`;
        return;
    }

    ul.innerHTML = data.map(r => {
        const isActive = selectedFplId === r.id ? ' active' : '';
        return `<li class="ifps-fp-card${isActive}" data-fpl-id="${r.id}">
            <div class="ifps-fp-card-header">
                <span class="ifps-fp-card-id">${r.id}</span>
                <div class="ifps-fp-card-badges">
                    <span class="badge ${badgeClass(r.status1)}">${r.status1}</span>
                    <span class="badge ${badgeClass(r.status2)}">${r.status2}</span>
                </div>
            </div>
            <p class="ifps-fp-card-operator"><span class="ifps-fp-label">운항사:</span>${r.operator}</p>
            <p class="ifps-fp-card-meta"><span class="ifps-fp-label">운항 시간:</span>${r.time}</p>
            <p class="ifps-fp-card-route">
                <span class="ifps-fp-label">경로:</span>
                <span class="route-from">${vpName(r.from)}</span>
                <span class="route-arrow">→</span>
                <span class="route-to">${vpName(r.to)}</span>
            </p>
        </li>`;
    }).join('');

    ul.querySelectorAll('.ifps-fp-card').forEach(el => {
        el.addEventListener('click', () => selectFpl(el.dataset.fplId, 'rs'));
    });

    if (window.lucide) lucide.createIcons();
}

// ─────────────────────────────────────────────────────────────────────────────
// ③ 비행계획 목록 렌더링
// ─────────────────────────────────────────────────────────────────────────────
function renderFlightPlanList() {
    const ul = document.getElementById('flight-plan-list');
    if (!ul) return;

    let data = FLIGHT_PLANS;
    if (selectedVpId) {
        data = data.filter(fp => fp.from === selectedVpId || fp.to === selectedVpId);
    }
    if (fpFilter !== 'all') {
        data = data.filter(fp => FP_FILTER_STATUS[fp.id] === fpFilter);
    }

    if (data.length === 0) {
        ul.innerHTML = `<li class="ifps-empty-msg">조건에 맞는 비행계획이 없습니다</li>`;
        return;
    }

    ul.innerHTML = data.map(fp => {
        const isActive = selectedFplId === fp.id ? ' active' : '';
        return `<li class="ifps-fp-card${isActive}" data-fpl-id="${fp.id}">
            <div class="ifps-fp-card-header">
                <span class="ifps-fp-card-id">${fp.id}</span>
                <div class="ifps-fp-card-badges">
                    <span class="badge ${badgeClass(fp.status1)}">${fp.status1}</span>
                    <span class="badge ${badgeClass(fp.status2)}">${fp.status2}</span>
                </div>
            </div>
            <p class="ifps-fp-card-meta"><span class="ifps-fp-label">운항 시간:</span>${fp.time}</p>
            <p class="ifps-fp-card-route">
                <span class="ifps-fp-label">경로:</span>
                <span class="route-from">${vpName(fp.from)}</span>
                <span class="route-arrow">→</span>
                <span class="route-to">${vpName(fp.to)}</span>
            </p>
        </li>`;
    }).join('');

    ul.querySelectorAll('.ifps-fp-card').forEach(el => {
        el.addEventListener('click', () => selectFpl(el.dataset.fplId, 'fp'));
    });

    if (window.lucide) lucide.createIcons();
}

// ─────────────────────────────────────────────────────────────────────────────
// ④ 타임라인 렌더링
// ─────────────────────────────────────────────────────────────────────────────
function renderTimeline(activeKey) {
    const body = document.getElementById('timeline-track');
    if (!body) return;

    // ── 선택 없음: 빈 상태 UI ──
    if (!selectedFplId) {
        body.innerHTML = `
            <div class="ifps-timeline-empty">
                <i data-lucide="mouse-pointer-click" class="ifps-timeline-empty-icon w-8 h-8"></i>
                <p class="ifps-timeline-empty-msg">자원예약 또는 비행계획 목록에서 항목을 선택하세요</p>
            </div>`;
        if (window.lucide) lucide.createIcons();
        return;
    }

    // ── 선택됨: 타임라인 UI ──
    const activeIdx   = TIMELINE_STEPS.findIndex(s => s.key === activeKey);
    const stepCount   = TIMELINE_STEPS.length;
    // flex: 1 구조이므로 각 스텝의 중심점은 (idx + 0.5) / stepCount 지점이 됨
    const progressPct = activeIdx < 0 ? 0 : ((activeIdx + 0.5) / stepCount) * 100;

    const CHECK_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0f172a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
    const PLAY_ICON  = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="#0f172a" stroke="#0f172a" stroke-width="1"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;

    const stepsHtml = TIMELINE_STEPS.map((step, idx) => {
        const isDone    = idx < activeIdx;
        const isCurrent = idx === activeIdx;
        const dotClass  = isDone ? 'is-done' : isCurrent ? 'is-current' : '';
        const lblClass  = isDone ? 'is-done' : isCurrent ? 'is-current' : '';
        const icon      = isDone ? CHECK_ICON : isCurrent ? PLAY_ICON : '';

        return `<div class="ifps-tl-step">
            <div class="ifps-tl-dot ${dotClass}">${icon}</div>
            <span class="ifps-tl-label ${lblClass}">${step.label}</span>
        </div>`;
    }).join('');

    body.innerHTML = `
        <div class="ifps-timeline-track">
            <div class="ifps-tl-line-bg"></div>
            <div class="ifps-tl-line-active" style="width:${progressPct}%"></div>
            <div class="ifps-tl-steps">${stepsHtml}</div>
        </div>`;
    // NOTE: 타임라인 진행 너비는 JS 계산값이므로 인라인 style이 유일하게 허용되는 예외입니다.
}


// ─────────────────────────────────────────────────────────────────────────────
// 이벤트 핸들러
// ─────────────────────────────────────────────────────────────────────────────

/** 비행계획 / 예약 선택 */
window.selectFpl = function(id, listType) {
    const subjectEl = document.getElementById('timeline-subject');

    // 현재 선택된 것과 같은 것을 클릭하면 해제
    if (selectedFplId === id) {
        selectedFplId = null;
        if (subjectEl) subjectEl.textContent = '';
        renderTimeline(null);
        renderReservationList();
        renderFlightPlanList();
        return;
    }

    selectedFplId = id;

    const item = (listType === 'fp') 
        ? FLIGHT_PLANS.find(f => f.id === id)
        : RESERVATIONS.find(r => r.id === id);

    // 타임라인 키 결정 logic
    let timelineKey = null;
    if (item) {
        if (item.status2 === '대기' || item.status2 === '반려') {
            timelineKey = null; // 아무것도 활성화 안됨
        } else if (item.status2 === '승인') {
            timelineKey = (listType === 'rs') ? 'rsv-ok' : 'plan-ok';
        } else if (item.status2 === '확정') {
            // 확정 시에는 기본적으로 'confirm' 단계, FP인 경우 실제 timeline 데이터 사용
            timelineKey = (listType === 'fp') ? item.timeline : 'confirm';
            
            // 만약 예약인데 대응하는 비행계획의 상세 타임라인 정보가 있다면 그것을 사용 (확장성)
            if (listType === 'rs') {
                const fpId = id.replace('RS-', 'FPL-');
                const fp = FLIGHT_PLANS.find(f => f.id === fpId);
                if (fp && fp.status2 === '확정') timelineKey = fp.timeline;
            }
        }
    }

    // 타임라인 제목 업데이트
    if (subjectEl) {
        const fp = FLIGHT_PLANS.find(f => f.id === id);
        const rs = RESERVATIONS.find(r => r.id === id);
        const item = fp || rs;
        if (item) {
            subjectEl.innerHTML = `
                <div class="ifps-vp-filter-tag">
                    <span>${id}  ·  ${vpName(item.from)} → ${vpName(item.to)}</span>
                    <button class="ifps-vp-reset-btn" onclick="selectFpl('${id}'); event.stopPropagation();" title="선택 취소">
                        <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>
                    </button>
                </div>`;
            if (window.lucide) lucide.createIcons();
        }
    }

    renderTimeline(timelineKey);
    renderReservationList();
    renderFlightPlanList();
};

/** 버티포트 선택 → 좌우 목록 필터 */
window.selectVertiport = function(vpId) {
    const labelEl = document.getElementById('vp-filter-label');

    if (selectedVpId === vpId) {
        selectedVpId = null;
        if (labelEl) labelEl.innerHTML = '';
    } else {
        selectedVpId = vpId;
        const vp = VERTIPORTS.find(v => v.id === vpId);
        if (labelEl && vp) {
            labelEl.innerHTML = `
                <div class="ifps-vp-filter-tag">
                    <span>선택: ${vp.name}</span>
                    <button class="ifps-vp-reset-btn" onclick="selectVertiport('${vpId}'); event.stopPropagation();" title="선택 취소">
                        <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>
                    </button>
                </div>`;
            if (window.lucide) lucide.createIcons();
        }
    }

    renderVertiports();
    renderReservationList();
    renderFlightPlanList();
    updateSummaryCounts();
};

/** 자원예약 상태 필터 */
window.filterReservationList = function(status) {
    rsFilter = status;

    const idMap = { 'all': 'rs-sum-all', '대기': 'rs-sum-wait', '승인': 'rs-sum-ok', '확정': 'rs-sum-adj', '반려': 'rs-sum-err' };
    Object.entries(idMap).forEach(([key, cardId]) => {
        const el = document.getElementById(cardId);
        if (el) el.classList.toggle('ifps-card-all', status === key);
    });

    renderReservationList();
};

/** 비행계획 상태 필터 */
window.filterFlightList = function(status) {
    fpFilter = status;

    const idMap = { 'all': 'fp-sum-all', '승인': 'fp-sum-ok', '확정': 'fp-sum-adj', '반려': 'fp-sum-err' };
    Object.entries(idMap).forEach(([key, cardId]) => {
        const el = document.getElementById(cardId);
        if (el) el.classList.toggle('ifps-card-all', status === key);
    });

    renderFlightPlanList();
};

// ─────────────────────────────────────────────────────────────────────────────
// 초기화
// ─────────────────────────────────────────────────────────────────────────────
document.addEventListener('includes-loaded', function() {
    updateSummaryCounts();
    renderVertiports();
    renderReservationList();
    renderFlightPlanList();
    renderTimeline(null); // 초기 진입: 빈 상태 표시

    if (window.lucide) lucide.createIcons();
});

