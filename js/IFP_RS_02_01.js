// IFP_RS_02_01.js - 예약 타임라인 스크립트
// ─────────────────────────────────────────────────────────────────────────────

/** 데이터 */
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

/** 더미 예약 데이터 (오늘 날짜 기준) */
const _today = new Date();
const _format = (d) => {
    const y = d.getFullYear();
    const m = (d.getMonth() + 1).toString().padStart(2, '0');
    const _d = d.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${_d}`;
};
const todayStr = _format(_today);
const tomorrowStr = _format(new Date(_today.getTime() + 86400000));

const MOCK_RESERVATIONS = [
    { id: 'RS-001', date: todayStr, from: 'VP-01', depTime: '09:10', to: 'VP-03', arrTime: '10:15', status: '확정', flightNo: 'UA101' },
    { id: 'RS-002', date: todayStr, from: 'VP-02', depTime: '10:20', to: 'VP-04', arrTime: '10:45', status: '승인', flightNo: 'UB202' },
    { id: 'RS-003', date: todayStr, from: 'VP-03', depTime: '11:30', to: 'VP-05', arrTime: '12:15', status: '대기', flightNo: 'UC303' },
    { id: 'RS-004', date: todayStr, from: 'VP-07', depTime: '13:00', to: 'VP-06', arrTime: '13:45', status: '반려-승인', flightNo: 'UD404' },
    { id: 'RS-005', date: todayStr, from: 'VP-05', depTime: '09:45', to: 'VP-08', arrTime: '10:30', status: '확정', flightNo: 'UA105' },
    { id: 'RS-006', date: todayStr, from: 'VP-01', depTime: '14:30', to: 'VP-02', arrTime: '15:15', status: '확정', flightNo: 'VA202' },
    { id: 'RS-007', date: todayStr, from: 'VP-04', depTime: '15:00', to: 'VP-07', arrTime: '15:45', status: '승인', flightNo: 'VB103' },
    { id: 'RS-008', date: tomorrowStr, from: 'VP-01', depTime: '09:00', to: 'VP-05', arrTime: '09:45', status: '확정', flightNo: 'NX101' },
    { id: 'RS-009', date: todayStr, from: 'VP-06', depTime: '16:00', to: 'VP-01', arrTime: '16:45', status: '확정', flightNo: 'VC301' },
    { id: 'RS-010', date: todayStr, from: 'VP-08', depTime: '17:30', to: 'VP-02', arrTime: '18:15', status: '승인', flightNo: 'VD402' },
];

/** 상태별 색상 매핑 */
const STATUS_COLORS = {
    '확정': 'bg-info',
    '승인': 'bg-success',
    '대기': 'bg-warning',
    '반려-승인': 'bg-error',
    '반려-확정': 'bg-error'
};

/** 전역 상태 */
let selectedDate = new Date(); 
const _d = new Date();
const _day = _d.getDay();
const _diff = _d.getDate() - _day + (_day === 0 ? -6 : 1);
let displayedWeekStart = new Date(_d.setDate(_diff)); // 이번 주 월요일

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    initWeeklyCalendar();
    renderTimelineHours();
    renderAll();
    
    // 1분마다 시간 인디케이터 업데이트
    setInterval(updateCurrentTimeMarker, 60000);
});

function renderAll() {
    renderWeeklyCalendar();
    renderTimelineRows();
    updateCurrentTimeMarker();
}

/** 주간 캘린더 초기화 및 이벤트 */
function initWeeklyCalendar() {
    document.getElementById('prev-week').addEventListener('click', () => {
        displayedWeekStart.setDate(displayedWeekStart.getDate() - 7);
        renderWeeklyCalendar();
    });
    document.getElementById('next-week').addEventListener('click', () => {
        displayedWeekStart.setDate(displayedWeekStart.getDate() + 7);
        renderWeeklyCalendar();
    });

    // 주간 피커 (달력에서 날짜 선택 시 해당 주간으로 이동)
    const datePicker = document.getElementById('weekly-date-picker');
    if (datePicker) {
        datePicker.addEventListener('change', (e) => {
            const pickedDate = new Date(e.target.value);
            if (!isNaN(pickedDate.getTime())) {
                selectedDate = new Date(pickedDate);
                
                // 해당 날짜의 월요일 계산
                const day = pickedDate.getDay(); // 0(일) ~ 6(토)
                const diff = pickedDate.getDate() - day + (day === 0 ? -6 : 1); // 월요일로 맞춤
                displayedWeekStart = new Date(pickedDate.setDate(diff));
                
                renderAll();
                document.getElementById('selected-date-display').textContent = `${formatDate(selectedDate)} (${getDayName(selectedDate)})`;
            }
        });
    }
}

/** 주간 캘린더 렌더링 */
function renderWeeklyCalendar() {
    const container = document.getElementById('weekly-days');
    const weekDisplay = document.getElementById('current-week-range');
    if (!container) return;

    container.innerHTML = '';
    const tempDate = new Date(displayedWeekStart);

    // 주간 범위 텍스트 업데이트
    const weekEnd = new Date(tempDate);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weekDisplay.textContent = `${formatDate(tempDate)} ~ ${formatDate(weekEnd)}`;

    for (let i = 0; i < 7; i++) {
        const d = new Date(tempDate);
        const dateStr = formatDate(d, '-');
        const isActive = formatDate(selectedDate, '-') === dateStr;
        
        // 버티포트별 예약 건수 계산
        const vpCounts = VERTIPORTS.map(vp => {
            const count = MOCK_RESERVATIONS.filter(r => r.date === dateStr && (r.from === vp.id || r.to === vp.id)).length;
            return { 
                name: vp.name, 
                count 
            };
        });

        const dayCard = document.createElement('div');
        dayCard.className = `weekly-day-card ${isActive ? 'active' : ''}`;
        dayCard.innerHTML = `
            <div class="weekly-header-row">
                <span class="weekly-date-label">${d.getMonth() + 1}/${d.getDate()}</span>
                <span class="weekly-day-label">${getDayName(d)}</span>
            </div>
            <div class="weekly-vp-grid">
                ${vpCounts.map(vc => `
                    <div class="vp-count-item ${vc.count > 0 ? 'has-data' : ''}">
                        <span class="vp-name">${vc.name}</span>
                        <span class="vp-val">${vc.count}</span>
                    </div>
                `).join('')}
            </div>
        `;
        dayCard.addEventListener('click', () => {
            selectedDate = new Date(d);
            renderAll();
            document.getElementById('selected-date-display').textContent = `${formatDate(d)} (${getDayName(d)})`;
        });
        container.appendChild(dayCard);
        tempDate.setDate(tempDate.getDate() + 1);
    }
}

/** 타임라인 시간 헤더 (00 ~ 23) */
function renderTimelineHours() {
    const header = document.getElementById('timeline-hours-header');
    if (!header) return;

    header.innerHTML = '';
    for (let i = 0; i < 24; i++) {
        const hour = i.toString().padStart(2, '0');
        const cell = document.createElement('div');
        cell.className = 'timeline-hour-cell';
        cell.textContent = `${hour}:00`;
        header.appendChild(cell);
    }
}

/** 타임라인 로우(버티포트별) 및 핀 렌더링 */
function renderTimelineRows() {
    const container = document.getElementById('timeline-rows');
    const dateStr = formatDate(selectedDate, '-');
    if (!container) return;

    container.innerHTML = '';
    
    // 해당 날짜의 예약 필터링
    const dayReservations = MOCK_RESERVATIONS.filter(r => r.date === dateStr);

    VERTIPORTS.forEach(vp => {
        const row = document.createElement('div');
        row.className = 'timeline-vp-row';
        
        // 버티포트 정보 칼럼
        const vpInfo = document.createElement('div');
        vpInfo.className = 'timeline-vp-info';
        vpInfo.innerHTML = `<span class="timeline-vp-name">${vp.name}</span>`;
        row.appendChild(vpInfo);

        // 그리드 영역
        const contentArea = document.createElement('div');
        contentArea.className = 'timeline-content-area';
        
        // 해당 버티포트와 관련된 예약 찾기 (이륙 or 착륙)
        const vpRes = dayReservations.filter(r => r.from === vp.id || r.to === vp.id);
        
        // 겹침 방지를 위한 행 기준 (단순화: 1개당 1행 권장이나, 공간 효율 위해 배치)
        // 사용자가 "한 개당 한 행으로 구성" 요청함 -> 겹치지 않게 하기 위함
        vpRes.forEach(res => {
            const isDep = res.from === vp.id;
            const timeStr = isDep ? res.depTime : res.arrTime;
            const leftPos = calculateTimePosition(timeStr);
            const statusColor = STATUS_COLORS[res.status] || 'bg-slate-500';

            const pinRow = document.createElement('div');
            pinRow.className = 'reservation-pin-row';
            pinRow.innerHTML = `
                <div class="timeline-pin" style="left: calc(${leftPos}% - 10px)">
                    <span class="pin-dot ${statusColor}"></span>
                    <span class="pin-text">${timeStr} | ${res.flightNo}</span>
                </div>
            `;
            contentArea.appendChild(pinRow);
        });

        row.appendChild(contentArea);
        container.appendChild(row);
    });
}

/** 현재 시간 인디케이터 업데이트 */
function updateCurrentTimeMarker() {
    const marker = document.getElementById('current-time-marker');
    if (!marker) return;

    // 실제 '오늘'과 선택된 날짜가 같을 때만 표시
    const isToday = formatDate(selectedDate, '-') === todayStr;

    if (!isToday) {
        marker.style.display = 'none';
        return;
    }

    // 데모용 현재 시간 (실제 시간 대신 고정값 시뮬레이션 가능하나, 여기서는 로컬 시간 사용)
    const now = new Date();
    const hours = now.getHours();
    const mins = now.getMinutes();
    const timeStr = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    
    // 왼쪽에서 128px(VP 칼럼) 이후부터 계산
    const leftPos = calculateTimePosition(timeStr);
    
    marker.style.display = 'block';
    marker.style.left = `calc(128px + ${leftPos}%)`;
}

/** 시간 문자열(HH:MM)을 퍼센트 위치로 변환 */
function calculateTimePosition(timeStr) {
    const [h, m] = timeStr.split(':').map(Number);
    const totalMinutes = h * 60 + m;
    const dayMinutes = 24 * 60;
    return (totalMinutes / dayMinutes) * 100;
}

/** 날짜 포맷팅 */
function formatDate(date, sep = '.') {
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    return `${y}${sep}${m}${sep}${d}`;
}

function getDayName(date) {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return days[date.getDay()];
}
