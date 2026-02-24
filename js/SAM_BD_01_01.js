document.addEventListener('DOMContentLoaded', () => {
    // === Mock Data (Notices) ===
    let notices = [
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
            id: '3',
            title: 'SAMS v2.1 기능 업데이트 릴리즈 노트',
            isVisible: true,
            content: `SAMS 시스템이 v2.1로 업데이트되었습니다.
이번 업데이트에서는 사용자 피드백을 반영하여 대시보드 시인성을 개선하고 리포팅 기능을 대폭 강화했습니다.

[주요 업데이트 내용]

1. 대시보드 (Dashboard)
   - 위젯 레이아웃 사용자 설정 기능 추가 (드래그 앤 드롭 지원)
   - 실시간 트래픽 차트 렌더링 속도 30% 개선
   - 다크 모드 테마 세분화 (Midnight Blue / Deep Black)

2. 리포팅 (Reporting)
   - 주간/월간 운영 보고서 자동 생성 기능 추가
   - 보고서 포맷 다양화 (PDF, Excel, HTML)
   - 메일 발송 예약 기능 지원

3. 알림 센터 (Notification)
   - 알림 카테고리 필터링 기능 추가 (장애, 작업, 보안, 기타)
   - 중요 알림 상단 고정 기능 추가
   - 브라우저 데스크탑 알림 연동

4. 기타 버그 수정
   - 간헐적으로 발생하던 세션 만료 오류 수정
   - 모바일 환경에서 일부 테이블 깨짐 현상 수정

업데이트와 관련된 상세 매뉴얼은 자료실을 참고해 주시기 바랍니다.
시스템 사용 중 오류가 발견되면 '장애 관리 > 장애 신고' 메뉴를 이용해 주십시오.`,
            regDate: '2024.02.20 10:30:00',
            modDate: '2024.02.21 11:00:00',
            publicSystems: ['sams'],
            attachments: [
                { name: 'SAMS_v2.1_User_Manual.pdf', size: '8.2MB' }
            ]
        },
        {
            id: '2',
            title: '[사과문] 2월 2일 서비스 접속 장애에 대한 보상 안내',
            isVisible: false,
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

    const registrants = ['홍길동', '김철수', '이영희', '박민수', '최지은'];

    // === Elements ===
    const noticeListBody = document.getElementById('notice-list-body');
    const detailPane = document.getElementById('detail-pane');
    const emptyState = document.getElementById('empty-state');
    const detailContent = document.getElementById('detail-content');

    // Header Elements
    const regHeaderGroup = document.getElementById('reg-header-group');
    const rightPaneHeader = document.getElementById('right-pane-header');
    const rightPaneTitle = document.getElementById('right-pane-title');
    const viewModeButtons = document.getElementById('view-mode-buttons');
    const editModeButtons = document.getElementById('edit-mode-buttons');
    const regModeButtons = document.getElementById('reg-mode-buttons');

    // Form Elements
    const noticeTitleInput = document.getElementById('notice-title');
    const noticeContentEdit = document.getElementById('notice-content-edit');
    const noticeContentView = document.getElementById('notice-content-view');
    const noticeRegDateInput = document.getElementById('notice-reg-date');
    const noticeModDateInput = document.getElementById('notice-mod-date');
    const noticeDatesSection = document.getElementById('notice-dates-section');
    const noticeVisibilityView = document.getElementById('notice-visibility-view');
    const noticeVisibilityEdit = document.getElementById('notice-visibility-edit');
    const noticeRegistrantInput = document.getElementById('notice-registrant');

    const noticeSystemsView = document.getElementById('notice-systems-view');
    const noticeSystemsEditWrapper = document.getElementById('notice-systems-edit-wrapper');
    const noticeSystemsTrigger = document.getElementById('notice-systems-trigger');
    const noticeSystemsDropdown = document.getElementById('notice-systems-dropdown');
    const selectedSystemsText = document.getElementById('selected-systems-text');

    const reqTitleMark = document.getElementById('req-title');
    const reqVisibilityMark = document.getElementById('req-visibility');
    const reqSystemsMark = document.getElementById('req-systems');
    const reqContentMark = document.getElementById('req-content');

    // File Elements
    const fileUploadArea = document.getElementById('file-upload-area');
    const fileListContainer = document.getElementById('file-list');
    const fileInput = document.getElementById('file-input');

    // Modals
    const deleteConfirmModal = document.getElementById('delete-confirm-modal');
    const confirmModal = document.getElementById('confirm-modal');
    const successModal = document.getElementById('success-modal');

    // App State
    let currentNotice = null;
    let isEditMode = false;
    let isRegMode = false;
    let currentAttachments = [];

    // Filter Elements
    const filterVisibility = document.getElementById('filter-visibility');
    const filterType = document.getElementById('filter-type');
    const filterKeyword = document.getElementById('filter-keyword');
    const noticeFilterContent = document.getElementById('notice-filter-content');
    const noticeFilterChevron = document.getElementById('notice-filter-chevron');


    // === Initialization ===
    renderNoticeList();

    // Check for deep link (id) in URL
    const urlParams = new URLSearchParams(window.location.search);
    const deepNoticeId = urlParams.get('id');
    if (deepNoticeId) {
        const targetNotice = notices.find(n => n.id === deepNoticeId);
        if (targetNotice) {
            // Select and scroll into view after a short delay to ensure rendering is complete
            setTimeout(() => {
                selectNotice(targetNotice);
                const row = document.querySelector(`.data-table-row[data-id="${deepNoticeId}"]`);
                if (row) {
                    row.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 100);
        }
    }

    // === Functions ===

    function renderNoticeList() {
        noticeListBody.innerHTML = '';

        // Filter Data
        let filteredNotices = notices;
        const visStatus = filterVisibility ? filterVisibility.value : 'all';
        const type = filterType ? filterType.value : 'all';
        const keyword = filterKeyword ? filterKeyword.value.toLowerCase().trim() : '';

        if (visStatus !== 'all') {
            filteredNotices = filteredNotices.filter(notice => String(notice.isVisible) === visStatus);
        }

        // Pre-assign registrants if missing to make search work accurately
        filteredNotices.forEach((notice, index) => {
            if (!notice.registrant) {
                notice.registrant = registrants[index % registrants.length];
            }
        });

        if (keyword) {
            filteredNotices = filteredNotices.filter(notice => {
                const regName = notice.registrant.toLowerCase();
                const title = notice.title.toLowerCase();
                const content = notice.content.toLowerCase();

                if (type === 'all') {
                    return title.includes(keyword) || content.includes(keyword) || regName.includes(keyword);
                } else if (type === 'title') {
                    return title.includes(keyword);
                } else if (type === 'content') {
                    return content.includes(keyword);
                } else if (type === 'registrant') {
                    return regName.includes(keyword);
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
            tr.innerHTML = `<td colspan="4" class="text-center py-4">검색 결과가 없습니다.</td>`;
            noticeListBody.appendChild(tr);
            return;
        }

        // Render Items
        filteredNotices.forEach((notice, index) => {
            const tr = document.createElement('tr');
            tr.className = 'data-table-row clickable-row';
            tr.dataset.id = notice.id;
            tr.onclick = () => selectNotice(notice, tr);

            // Highlight active
            if (currentNotice && currentNotice.id === notice.id) {
                tr.classList.add('active');
            }

            // Mock Registrant
            const registrant = notice.registrant || registrants[index % registrants.length];
            notice.registrant = registrant;

            // Date Format YYYY.MM.DD HH:mm:ss
            const regDateFull = notice.regDate;
            const regDateFormatted = regDateFull.substring(0, 19);

            tr.innerHTML = `
                <td data-label="Title">
                    <div class="flex items-center gap-1">
                        ${notice.title}
                        ${notice.attachments.length > 0 ? '<i data-lucide="paperclip" class="w-3 h-3 text-gray-400"></i>' : ''}
                    </div>
                </td>
                <td class="td-center" data-label="Visibility">
                    <span class="badge ${notice.isVisible ? 'badge-success' : 'badge-secondary'}">
                        ${notice.isVisible ? '공개' : '비공개'}
                    </span>
                </td>
                <td class="td-date" data-label="Date">${regDateFormatted}</td>
                <td class="td-center" data-label="Registrant">${registrant}</td>
            `;
            noticeListBody.appendChild(tr);
        });
        lucide.createIcons();
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
        if (filterVisibility) filterVisibility.value = 'all';
        filterType.value = 'all';
        filterKeyword.value = '';
        renderNoticeList();
    };

    window.applyNoticeFilter = function () {
        renderNoticeList();
    };


    // === Detail View ===
    function selectNotice(notice, rowElement) {
        // Reset modes immediately to ensure renderFileList works correctly for view mode
        isEditMode = false;
        isRegMode = false;

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

        // Show Content in Div
        noticeContentView.textContent = notice.content;
        noticeContentEdit.value = notice.content;

        // Populate Dates & Registrant
        if (noticeRegistrantInput) noticeRegistrantInput.value = notice.registrant || '';
        noticeRegDateInput.value = notice.regDate;
        noticeModDateInput.value = notice.modDate;

        // Populate Visibility
        if (noticeVisibilityView) noticeVisibilityView.textContent = notice.isVisible ? '공개' : '비공개';
        const visRadios = document.getElementsByName('notice-visibility');
        visRadios.forEach(radio => {
            if (radio.value === String(notice.isVisible)) {
                radio.checked = true;
            }
        });

        // Populate Public Systems
        const systems = notice.publicSystems || [];
        document.querySelectorAll('.notice-system').forEach(checkbox => {
            const systemId = checkbox.id.replace('sys-', '');
            checkbox.checked = systems.includes(systemId);
        });
        updateSelectedSystemsText();

        // Render Files
        renderFileList();

        // Show View Mode
        resetViewMode();

        // Ensure Title is correct
        if (rightPaneTitle) rightPaneTitle.innerText = '공지사항 정보';

        // Show Content
        emptyState.classList.add('hidden');
        detailContent.classList.remove('hidden');
    }

    function resetViewMode() {
        isEditMode = false;
        isRegMode = false;

        // Headers
        rightPaneHeader.classList.remove('hidden');
        regHeaderGroup.classList.add('hidden');
        if (rightPaneTitle) rightPaneTitle.innerText = '공지사항 정보';

        // Buttons
        viewModeButtons.classList.remove('hidden');
        editModeButtons.classList.add('hidden');
        regModeButtons.classList.add('hidden');

        // Inputs
        noticeTitleInput.disabled = true;
        if (noticeVisibilityView) noticeVisibilityView.classList.remove('hidden');
        if (noticeVisibilityEdit) noticeVisibilityEdit.classList.add('hidden');

        // Toggle Content View/Edit
        noticeContentView.classList.remove('hidden');
        noticeContentEdit.classList.add('hidden');

        // Hide Required Marks
        reqTitleMark.classList.add('hidden');
        reqVisibilityMark.classList.add('hidden');
        reqContentMark.classList.add('hidden');

        // Hide File Upload Area
        fileUploadArea.classList.add('hidden');

        // Reset Public Systems View
        noticeSystemsView.classList.remove('hidden');
        noticeSystemsEditWrapper.classList.add('hidden');
        noticeSystemsDropdown.classList.remove('active');
        document.querySelectorAll('.notice-system').forEach(cb => cb.disabled = true);

        // Dates
        noticeDatesSection.classList.remove('hidden');

        // Reset Errors
        resetErrors();
    }

    // === File Handling ===
    window.handleFileSelect = function (event) {
        const files = Array.from(event.target.files);
        if (!files.length) return;

        files.forEach(file => {
            currentAttachments.push({
                name: file.name,
                size: formatBytes(file.size),
                file: file
            });
        });

        event.target.value = '';
        renderFileList();
    };

    window.removeFile = function (index) {
        currentAttachments.splice(index, 1);
        renderFileList();
    };

    function renderFileList() {
        const attachSection = document.getElementById('notice-attachments-section');
        fileListContainer.innerHTML = '';

        if (!isEditMode && !isRegMode && currentAttachments.length === 0) {
            if (attachSection) attachSection.classList.add('hidden');
            return;
        }

        if (attachSection) attachSection.classList.remove('hidden');

        if (currentAttachments.length === 0) {
            return;
        }

        currentAttachments.forEach((file, index) => {
            const div = document.createElement('div');
            div.className = 'file-list-item';

            const fileSize = file.size || 'Unknown';

            let actionBtn = '';
            if (isEditMode || isRegMode) {
                actionBtn = `<button onclick="removeFile(${index})" class="text-gray-400 hover:text-red-500"><i data-lucide="x" class="w-4 h-4"></i></button>`;
            } else {
                actionBtn = `<button class="text-gray-400 hover:text-primary"><i data-lucide="download" class="w-4 h-4"></i></button>`;
                div.onclick = () => downloadFile(index);
            }

            div.innerHTML = `
                <div class="flex items-center overflow-hidden">
                    <i data-lucide="file" class="w-4 h-4 text-gray-400 mr-2 flex-shrink-0"></i>
                    <span class="text-sm truncate mr-2">${file.name}</span>
                    <span class="text-xs text-gray-500">(${fileSize})</span>
                </div>
                ${actionBtn}
            `;
            fileListContainer.appendChild(div);
        });
        lucide.createIcons();
    }

    window.downloadFile = function (index) {
        if (isEditMode || isRegMode) return;
        const file = currentAttachments[index];
        if (file) {
            // Create a dummy blob for simulation
            const dummyContent = `This is a simulated download for: ${file.name}\nSize: ${file.size || 'Unknown'}`;
            const blob = new Blob([dummyContent], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);

            // Trigger actual download
            const a = document.createElement('a');
            a.href = url;
            a.download = file.name;
            document.body.appendChild(a);
            a.click();

            // Cleanup
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }
    };

    function formatBytes(bytes, decimals = 2) {
        if (!+bytes) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))}${sizes[i]}`;
    }


    // === Registration Mode ===
    window.initRegistrationMode = function () {
        isRegMode = true;
        isEditMode = false;
        currentNotice = null;
        currentAttachments = [];

        document.querySelectorAll('.data-table-row').forEach(r => r.classList.remove('active'));

        rightPaneHeader.classList.add('hidden');
        regHeaderGroup.classList.remove('hidden');

        viewModeButtons.classList.add('hidden');
        editModeButtons.classList.add('hidden');
        regModeButtons.classList.remove('hidden');

        noticeTitleInput.value = '';
        noticeContentEdit.value = '';
        noticeContentView.textContent = '';

        noticeTitleInput.disabled = false;
        if (noticeVisibilityView) noticeVisibilityView.classList.add('hidden');
        if (noticeVisibilityEdit) noticeVisibilityEdit.classList.remove('hidden');
        const visRadios = document.getElementsByName('notice-visibility');
        visRadios.forEach(r => {
            if (r.value === 'true') r.checked = true;
        });

        noticeContentView.classList.add('hidden');
        noticeContentEdit.classList.remove('hidden');
        noticeContentEdit.disabled = false;

        reqTitleMark.classList.remove('hidden');
        reqVisibilityMark.classList.remove('hidden');
        reqContentMark.classList.remove('hidden');

        fileUploadArea.classList.remove('hidden');

        // Setup Public Systems for Reg Mode
        noticeSystemsView.classList.add('hidden');
        noticeSystemsEditWrapper.classList.remove('hidden');
        noticeSystemsTrigger.classList.remove('disabled');
        document.querySelectorAll('.notice-system').forEach(cb => {
            cb.disabled = false;
            cb.checked = true; // All checked for new reg
        });
        updateSelectedSystemsText();

        renderFileList();

        noticeDatesSection.classList.add('hidden');

        resetErrors();

        emptyState.classList.add('hidden');
        detailContent.classList.remove('hidden');
    };

    window.cancelRegistration = function () {
        isRegMode = false;
        if (currentNotice) {
            selectNotice(currentNotice);
        } else {
            emptyState.classList.remove('hidden');
            detailContent.classList.add('hidden');
        }
    };


    // === Edit Mode ===
    window.enterEditMode = function () {
        isEditMode = true;

        viewModeButtons.classList.add('hidden');
        editModeButtons.classList.remove('hidden');

        noticeTitleInput.disabled = false;
        if (noticeVisibilityView) noticeVisibilityView.classList.add('hidden');
        if (noticeVisibilityEdit) noticeVisibilityEdit.classList.remove('hidden');

        noticeContentView.classList.add('hidden');
        noticeContentEdit.classList.remove('hidden');
        noticeContentEdit.disabled = false;

        reqTitleMark.classList.remove('hidden');
        reqVisibilityMark.classList.remove('hidden');
        reqContentMark.classList.remove('hidden');

        fileUploadArea.classList.remove('hidden');

        // Setup Public Systems for Edit Mode
        noticeSystemsView.classList.add('hidden');
        noticeSystemsEditWrapper.classList.remove('hidden');
        noticeSystemsTrigger.classList.remove('disabled');
        document.querySelectorAll('.notice-system').forEach(cb => cb.disabled = false);
        updateSelectedSystemsText();

        renderFileList();

        if (noticeDatesSection) noticeDatesSection.classList.add('hidden');

        regHeaderGroup.classList.add('hidden');
        rightPaneHeader.classList.remove('hidden');
        if (rightPaneTitle) rightPaneTitle.innerText = '공지사항 수정';
    };

    window.cancelEdit = function () {
        if (currentNotice) {
            selectNotice(currentNotice);
        } else {
            resetViewMode();
        }
    };

    // === Save Logic ===
    window.saveChanges = function () {
        if (!validateForm()) return;
        showConfirmModal('공지사항 수정', '공지사항을 수정하시겠습니까?');
    };

    window.processRegistration = function () {
        if (!validateForm()) return;
        showConfirmModal('공지사항 등록', '공지사항을 등록하시겠습니까?');
    };

    window.confirmSaveAction = function () {
        if (isEditMode) {
            // Modification Logic
            currentNotice.title = noticeTitleInput.value;
            currentNotice.content = noticeContentEdit.value;
            const visRadios = document.getElementsByName('notice-visibility');
            currentNotice.isVisible = Array.from(visRadios).find(r => r.checked).value === 'true';

            // Save Public Systems
            currentNotice.publicSystems = Array.from(document.querySelectorAll('.notice-system:checked'))
                .map(cb => cb.id.replace('sys-', ''));

            currentNotice.attachments = [...currentAttachments];
            currentNotice.modDate = getCurrentTime();

            renderNoticeList();
            selectNotice(currentNotice, document.querySelector(`.data-table-row[data-id="${currentNotice.id}"]`));

            closeConfirmModal();
            showSuccessModal('공지사항이 수정되었습니다.');

        } else if (isRegMode) {
            // Registration Logic
            const newId = (parseInt(notices[0]?.id || 0) + 1).toString();
            const visRadios = document.getElementsByName('notice-visibility');
            const isVisible = Array.from(visRadios).find(r => r.checked).value === 'true';

            const newNotice = {
                id: newId,
                title: noticeTitleInput.value,
                content: noticeContentEdit.value,
                isVisible: isVisible,
                attachments: [...currentAttachments],
                regDate: getCurrentTime(),
                modDate: getCurrentTime(),
                registrant: '홍길동',
                publicSystems: Array.from(document.querySelectorAll('.notice-system:checked'))
                    .map(cb => cb.id.replace('sys-', ''))
            };

            notices.unshift(newNotice);

            renderNoticeList();
            selectNotice(newNotice);

            closeConfirmModal();
            showSuccessModal('공지사항이 등록되었습니다.');
        }
    };

    window.showConfirmModal = function (title, desc) {
        if (title) document.getElementById('confirm-modal-title').innerText = title;
        if (desc) document.getElementById('confirm-modal-desc').innerHTML = desc;
        confirmModal.classList.add('active');
        lucide.createIcons();
    };

    window.closeConfirmModal = function () {
        confirmModal.classList.remove('active');
    };

    function validateForm() {
        let isValid = true;
        if (!noticeTitleInput.value.trim()) {
            setError('notice-title', '제목을 입력해주세요.');
            isValid = false;
        }
        if (!noticeContentEdit.value.trim()) {
            setError('notice-content-edit', '내용을 입력해주세요.');
            isValid = false;
        }
        return isValid;
    }

    function setError(fieldId, msg) {
        document.getElementById('error-' + fieldId).textContent = msg;
        document.getElementById(fieldId).classList.add('error');
    }

    window.resetError = function (fieldId) {
        const errorEl = document.getElementById('error-' + fieldId);
        if (errorEl) errorEl.textContent = '';
        const inputEl = document.getElementById(fieldId);
        if (inputEl) inputEl.classList.remove('error');
    };

    function resetErrors() {
        document.querySelectorAll('.form-error').forEach(el => el.innerText = '');
        document.querySelectorAll('.form-input').forEach(el => el.classList.remove('error'));
    }

    function getCurrentTime() {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        const h = String(now.getHours()).padStart(2, '0');
        const min = String(now.getMinutes()).padStart(2, '0');
        const s = String(now.getSeconds()).padStart(2, '0');
        return `${y}.${m}.${d} ${h}:${min}:${s}`;
    }

    // === Delete Logic ===
    window.showDeleteWarning = function () {
        deleteConfirmModal.classList.add('active');
        lucide.createIcons();
    };

    window.closeDeleteConfirm = function () {
        deleteConfirmModal.classList.remove('active');
    };

    window.confirmDeleteAction = function () {
        if (currentNotice) {
            notices = notices.filter(n => n.id !== currentNotice.id);
            currentNotice = null;
            renderNoticeList();

            emptyState.classList.remove('hidden');
            detailContent.classList.add('hidden');

            closeDeleteConfirm();
            showSuccessModal('공지사항이 삭제되었습니다.');
        }
    };

    // Modal Helpers
    function showSuccessModal(msg) {
        const msgEl = document.getElementById('success-message');
        if (msgEl) msgEl.textContent = msg;
        successModal.classList.add('active');
        lucide.createIcons();
    }

    window.closeSuccessModal = function () {
        successModal.classList.remove('active');
    };

    window.closeDetailPane = function () {
        emptyState.classList.remove('hidden');
        detailContent.classList.add('hidden');
    };

    // === Multi-Select Helpers ===
    window.toggleSystemDropdown = function () {
        if (isEditMode || isRegMode) {
            noticeSystemsDropdown.classList.toggle('active');
            noticeSystemsTrigger.classList.toggle('active');
        }
    };

    window.toggleSystemSelection = function (event, id) {
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'LABEL') return;
        const checkbox = document.getElementById(id);
        if (!checkbox.disabled) {
            checkbox.checked = !checkbox.checked;
            updateSelectedSystemsText();
        }
    };

    window.toggleAllSystemsSelection = function (event) {
        const allCheckbox = document.getElementById('sys-all');
        const systemCheckboxes = document.querySelectorAll('.notice-system');

        if (allCheckbox.disabled) return;

        // If clicking the div (not input or label), toggle the primary checkbox manually first
        if (event.target.tagName !== 'INPUT' && event.target.tagName !== 'LABEL') {
            allCheckbox.checked = !allCheckbox.checked;
        }

        // At this point, allCheckbox.checked is correctly set (either by browser or by the manual toggle above)
        // Now sync all other checkboxes
        const isChecked = allCheckbox.checked;
        systemCheckboxes.forEach(cb => {
            cb.checked = isChecked;
        });
        updateSelectedSystemsText();
    };

    window.updateSelectedSystemsText = function () {
        const checked = document.querySelectorAll('.notice-system:checked');
        const allCheckboxes = document.querySelectorAll('.notice-system');
        const allCheckbox = document.getElementById('sys-all');

        // Update "Select All" checkbox state
        if (allCheckbox) {
            allCheckbox.checked = checked.length === allCheckboxes.length && allCheckboxes.length > 0;
        }

        let text = '';
        if (checked.length === 0) {
            text = '선택한 시스템 없음';
            selectedSystemsText.classList.add('placeholder');
            selectedSystemsText.classList.remove('text-gray-400');
        } else if (checked.length === allCheckboxes.length) {
            text = '전체';
            selectedSystemsText.classList.remove('placeholder');
            selectedSystemsText.classList.remove('text-gray-400');
        } else {
            const labels = Array.from(checked).map(cb => {
                const fullText = cb.nextElementSibling.textContent;
                return fullText.includes(' (') ? fullText.split(' (')[0] : fullText;
            });
            text = labels.join(', ');
            selectedSystemsText.classList.remove('placeholder');
            selectedSystemsText.classList.remove('text-gray-400');
        }
        selectedSystemsText.textContent = (checked.length === 0) ? '시스템 선택' : text;
        if (noticeSystemsView) noticeSystemsView.textContent = text;
    };

    // Close dropdown when clicking outside
    document.addEventListener('click', function (e) {
        if (noticeSystemsEditWrapper && !noticeSystemsEditWrapper.contains(e.target)) {
            if (noticeSystemsDropdown) noticeSystemsDropdown.classList.remove('active');
            if (noticeSystemsTrigger) noticeSystemsTrigger.classList.remove('active');
        }
    });

});
