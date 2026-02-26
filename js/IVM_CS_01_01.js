document.addEventListener('DOMContentLoaded', () => {
    // === Mock Data (Notices) ===
    let noticesData = [
        {
            id: '5',
            title: '[점검] 2024년 3월 정기 시스템 점검 안내',
            isVisible: true,
            content: `안녕하세요, SAMS 시스템 관리자입니다.

안정적인 서비스 제공을 위해 아래와 같이 3월 정기 시스템 점검이 진행될 예정입니다.
점검 시간 동안 시스템 접속 및 일부 서비스 이용이 제한될 수 있으니 업무에 참고하시기 바랍니다.

■ 점검 일시
- 2024년 3월 15일(금) 02:00 ~ 06:00 (4시간)

■ 점검 내용
1. 서버 보안 패치 및 OS 업데이트
2. 데이터베이스 성능 최적화 작업
3. 네트워크 장비 펌웨어 업그레이드
4. 노후화된 스토리지 장비 교체

■ 서비스 영향
- 점검 시간 중 SAMS 웹 포털 접속 불가
- API 연동 서비스 간헐적 끊김 발생 가능
- 배치 작업(Batch Job) 일시 중지 및 점검 후 재가동

■ 협조 요청 사항
- 점검 시작 전 작성 중인 문서를 저장하고 시스템에서 로그아웃해 주시기 바랍니다.
- 긴급한 업무 처리가 필요한 경우, 사전에 담당자에게 연락 주시기 바랍니다.

더 나은 서비스를 제공하기 위해 최선을 다하겠습니다.
감사합니다.`,
            regDate: '2024.03.10 09:00:00',
            modDate: '2024.03.10 09:00:00',
            publicSystems: ['ivms', 'ifps', 'ifrs', 'v-cdm', 'sams'],
            attachments: [
                { name: '2024년_3월_정기점검_계획서.pdf', size: '1.2MB' },
                { name: '작업_영향도_평가.xlsx', size: '45KB' }
            ]
        },
        {
            id: '4',
            title: '[공지] 개인정보 처리방침 및 보안 정책 변경 안내',
            isVisible: true,
            content: `SAMS 이용자 여러분, 안녕하십니까.

개인정보보호법 개정 및 내부 보안 강화 정책에 따라 개인정보 처리방침과 보안 정책이 일부 변경되었습니다.
변경 내용은 2024년 3월 20일부터 적용되오니 내용을 숙지하시어 이용에 불편 없으시길 바랍니다.

■ 주요 변경 사항
1. 비밀번호 작성 규칙 강화
   - 기존: 영문/숫자/특수문자 중 2가지 이상 조합, 8자리 이상
   - 변경: 영문/숫자/특수문자 모두 포함, 10자리 이상
   - 시행일 이후 비밀번호 변경 시 필수 적용

2. 2단계 인증(2FA) 의무화 대상 확대
   - 기존: 관리자 등급 계정
   - 변경: 모든 운영자 및 개인정보 취급자 계정

3. 장기 미접속자 계정 정책
   - 6개월 이상 미접속 시 계정 잠금 처리 (기존 1년)
   - 잠금 해제는 부서장 승인 후 보안팀 요청 필요

자세한 내용은 첨부된 '보안 정책 가이드 v2.0' 문서를 확인해 주시기 바랍니다.
안전한 시스템 사용을 위해 여러분의 적극적인 협조 부탁드립니다.`,
            regDate: '2024.03.01 14:00:00',
            modDate: '2024.03.01 14:00:00',
            publicSystems: ['ivms', 'ifps'],
            attachments: [
                { name: '개인정보처리방침_개정안_신구대조표.hwp', size: '256KB' },
                { name: 'SAMS_보안정책_가이드_v2.0.pdf', size: '3.5MB' }
            ]
        },
        {
            id: '2',
            title: '[사과문] 2월 2일 서비스 접속 장애에 대한 보상 안내',
            isVisible: true,
            content: `안녕하십니까, SAMS 운영팀입니다.

지난 2월 2일(금) 14:30부터 15:15까지 약 45분간 발생한 데이터센터 네트워크 불안정으로 인해
시스템 접속 지연 및 일부 기능 오류가 발생했습니다.
서비스 이용에 불편을 드린 점 머리 숙여 깊이 사과드립니다.

■ 장애 원인
- IDC 백본 스위치 장비의 일시적인 부하로 인한 패킷 손실 발생
- 이중화 장비로의 자동 절체 과정에서 일부 세션 단절

■ 조치 현황
- 문제 발생 즉시 트래픽 우회 경로 활성화
- 해당 네트워크 장비 제조사 긴급 점검 및 펌웨어 패치 완료
- 모니터링 임계치 재설정 및 알람 발송 로직 강화

■ 재발 방지 대책
- 네트워크 장비 이중화 테스트 주기 단축 (분기 -> 월간)
- 트래픽 부하 분산 처리 용량 증설 예정

해당 장애로 인해 업무 처리에 차질을 빚으신 부서 및 담당자분들께 다시 한번 사과의 말씀을 드립니다.
동일한 문제가 발생하지 않도록 인프라 관리에 만전을 기하겠습니다.`,
            regDate: '2024.02.05 09:00:00',
            modDate: '2024.02.05 09:00:00',
            publicSystems: ['ivms'],
            attachments: []
        },
        {
            id: '1',
            title: '설 연휴 기간 시스템 운영 및 비상 연락망 안내',
            isVisible: true,
            content: `민족 대명절 설을 맞이하여 임직원 여러분의 가정에 행복이 가득하시길 기원합니다.
연휴 기간 중 시스템 운영 정책 및 비상 대응 체계를 아래와 같이 안내해 드립니다.

1. 집중 모니터링 기간
   - 2024.02.09(금) ~ 2024.02.12(월)

2. 주요 운영 정책
   - 해당 기간 중 신규 기능 배포 및 형상 변경 작업 금지 (Code Freeze)
   - 24시간 관제 센터 비상 근무 체계 가동
   - 중요 장애 발생 시 SMS 및 비상 연락망을 통한 즉시 전파

3. 비상 연락망
   - 시스템 총괄: 박팀장 (010-1234-5678)
   - 서버/네트워크: 김책임 (010-9876-5432)
   - 애플리케이션: 이선임 (010-5555-4444)
   - 보안 관제: 관제실 (내선 1004)

4. 기타 사항
   - 연휴 기간 중 발생한 일반 문의(단순 기능 문의 등)는 연휴 종료 후 순차적으로 처리될 예정입니다.
   - 긴급 장애 발생 시에는 지체 없이 관제실로 유선 연락 부탁드립니다.

새해 복 많이 받으십시오.`,
            regDate: '2024.02.01 17:00:00',
            modDate: '2024.02.01 17:00:00',
            publicSystems: ['ivms', 'ifps', 'ifrs', 'v-cdm', 'sams'],
            attachments: [
                { name: '2024_설연휴_비상근무편성표.xlsx', size: '15KB' }
            ]
        }
    ];

    // Filter notices to only show those for IVMS
    const notices = noticesData.filter(n => n.publicSystems.includes('ivms') && n.isVisible);

    // === Elements ===
    const noticeListBody = document.getElementById('notice-list-body');
    const emptyState = document.getElementById('empty-state');
    const detailContent = document.getElementById('detail-content');

    // Form Elements
    const noticeTitleInput = document.getElementById('notice-title');
    const noticeContentView = document.getElementById('notice-content-view');
    const noticeRegDateInput = document.getElementById('notice-reg-date');
    const noticeModDateInput = document.getElementById('notice-mod-date');
    const noticeVisibilityView = document.getElementById('notice-visibility-view');
    const noticeSystemsView = document.getElementById('notice-systems-view');

    // File Elements
    const fileListContainer = document.getElementById('file-list');

    // Filter Elements
    const filterType = document.getElementById('filter-type');
    const filterKeyword = document.getElementById('filter-keyword');
    const noticeFilterContent = document.getElementById('notice-filter-content');
    const noticeFilterChevron = document.getElementById('notice-filter-chevron');

    // App State
    let currentNotice = null;
    let currentAttachments = [];

    // === Initialization ===
    renderNoticeList();

    // === Functions ===

    function renderNoticeList() {
        noticeListBody.innerHTML = '';

        // Filter Data
        let filteredNotices = notices;
        const type = filterType ? filterType.value : 'all';
        const keyword = filterKeyword ? filterKeyword.value.toLowerCase().trim() : '';

        if (keyword) {
            filteredNotices = filteredNotices.filter(notice => {
                const title = notice.title.toLowerCase();
                const content = notice.content.toLowerCase();

                if (type === 'all') {
                    return title.includes(keyword) || content.includes(keyword);
                } else if (type === 'title') {
                    return title.includes(keyword);
                } else if (type === 'content') {
                    return content.includes(keyword);
                }
                return true;
            });
        }

        // Update Total Count
        const totalCountEl = document.getElementById('total-count');
        if (totalCountEl) totalCountEl.innerText = `총 ${filteredNotices.length} 건`;

        // Empty State
        if (filteredNotices.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td colspan="3" class="text-center py-4 text-slate-500">검색 결과가 없습니다.</td>`;
            noticeListBody.appendChild(tr);
            return;
        }

        // Render Items
        filteredNotices.forEach((notice) => {
            const tr = document.createElement('tr');
            tr.className = 'data-table-row clickable-row';
            tr.dataset.id = notice.id;
            tr.onclick = () => selectNotice(notice, tr);

            if (currentNotice && currentNotice.id === notice.id) {
                tr.classList.add('active');
            }

            const regDateFormatted = notice.regDate.substring(0, 10);

            tr.innerHTML = `
                <td data-label="제목">
                    <div class="flex items-center gap-1">
                        ${notice.title}
                        ${notice.attachments.length > 0 ? '<i data-lucide="paperclip" class="w-3 h-3 text-slate-400"></i>' : ''}
                    </div>
                </td>
                <td class="td-date" data-label="등록일">${regDateFormatted}</td>
            `;
            noticeListBody.appendChild(tr);
        });
        if (window.lucide) lucide.createIcons();
    }

    // === Filter Functions ===
    window.toggleNoticeFilter = function () {
        if (noticeFilterContent.classList.contains('hidden')) {
            noticeFilterContent.classList.remove('hidden');
            if (noticeFilterChevron) noticeFilterChevron.style.transform = 'rotate(180deg)';
        } else {
            noticeFilterContent.classList.add('hidden');
            if (noticeFilterChevron) noticeFilterChevron.style.transform = 'rotate(0deg)';
        }
    };

    window.resetNoticeFilter = function () {
        filterType.value = 'all';
        filterKeyword.value = '';
        renderNoticeList();
    };

    window.applyNoticeFilter = function () {
        renderNoticeList();
    };


    // === Detail View ===
    function selectNotice(notice, rowElement) {
        currentNotice = notice;
        currentAttachments = [...notice.attachments];

        // Update Active Row
        document.querySelectorAll('.data-table-row').forEach(r => r.classList.remove('active'));
        if (rowElement) rowElement.classList.add('active');
        else {
            const el = document.querySelector(`.data-table-row[data-id="${notice.id}"]`);
            if (el) el.classList.add('active');
        }

        // Fill Form
        noticeTitleInput.value = notice.title;
        noticeContentView.textContent = notice.content;
        noticeRegDateInput.value = notice.regDate;
        noticeModDateInput.value = notice.modDate;

        // Render Files
        renderFileList();

        // Show Content
        emptyState.classList.add('hidden');
        detailContent.classList.remove('hidden');

        // Mobile View Toggle
        if (typeof openDetailPane === 'function') openDetailPane();
    }

    function renderFileList() {
        const attachSection = document.getElementById('notice-attachments-section');
        fileListContainer.innerHTML = '';

        if (currentAttachments.length === 0) {
            if (attachSection) attachSection.classList.add('hidden');
            return;
        }

        if (attachSection) attachSection.classList.remove('hidden');

        currentAttachments.forEach((file, index) => {
            const div = document.createElement('div');
            div.className = 'file-list-item';
            div.onclick = () => downloadFile(index);

            div.innerHTML = `
                <div class="flex items-center overflow-hidden">
                    <i data-lucide="file" class="w-4 h-4 text-slate-400 mr-2 flex-shrink-0"></i>
                    <span class="text-sm truncate mr-2">${file.name}</span>
                    <span class="text-xs text-slate-500">(${file.size || '30KB'})</span>
                </div>
                <button class="text-slate-400 hover:text-primary"><i data-lucide="download" class="w-4 h-4"></i></button>
            `;
            fileListContainer.appendChild(div);
        });
        if (window.lucide) lucide.createIcons();
    }

    window.downloadFile = function (index) {
        const file = currentAttachments[index];
        if (file) {
            alert(file.name + ' 파일을 다운로드합니다.');
        }
    };

    // === Deep Linking Handle ===
    function handleDeepLinking() {
        const urlParams = new URLSearchParams(window.location.search);
        const noticeId = urlParams.get('id');
        if (noticeId) {
            const notice = notices.find(n => n.id === noticeId);
            if (notice) {
                // Ensure list is rendered first
                selectNotice(notice);

                // Scroll to active row if needed
                setTimeout(() => {
                    const row = document.querySelector(`.data-table-row[data-id="${noticeId}"]`);
                    if (row) row.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            }
        }
    }

    handleDeepLinking();
});
