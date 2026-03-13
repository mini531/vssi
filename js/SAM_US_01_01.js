document.addEventListener('DOMContentLoaded', () => {
    // === Mock Data (Full List from SAM_AU_02_01) ===
    let users = [
        // role_total
        { id: 'admin.kim', name: '김민수', dept: '시스템 관리팀', email: 'ms.kim@sams.com', phone: '010-1234-5678', role: 'role_total', roleName: '통합 관리자', status: 'used', systems: ['SAMS', 'IVMS'] },
        { id: 'admin.lee', name: '이지원', dept: '운영기획팀', email: 'jw.lee@sams.com', phone: '010-2345-6789', role: 'role_total', roleName: '통합 관리자', status: 'used', systems: ['SAMS'] },
        { id: 'admin.park', name: '박준호', dept: '보안관제팀', email: 'jh.park@sams.com', phone: '010-3456-7890', role: 'role_total', roleName: '통합 관리자', status: 'used', systems: ['IVMS', 'IFPS'] },
        { id: 'admin.choi', name: '최유나', dept: '감사팀', email: 'yn.choi@sams.com', phone: '010-4567-8901', role: 'role_total', roleName: '통합 관리자', status: 'used', systems: ['SAMS'] },
        { id: 'admin.jung', name: '정우성', dept: 'IT인프라팀', email: 'ws.jung@sams.com', phone: '010-5678-9012', role: 'role_total', roleName: '통합 관리자', status: 'used', systems: ['SAMS', 'IVMS', 'IFPS', 'IFRS', 'V-CDM'] },
        { id: 'admin.kang', name: '강하늘', dept: '품질관리팀', email: 'hn.kang@sams.com', phone: '010-6789-0123', role: 'role_total', roleName: '통합 관리자', status: 'used', systems: ['SAMS'] },
        // role_operator
        { id: 'op.song', name: '송지은', dept: '통합관제센터', email: 'je.song@sams.com', phone: '010-7890-1234', role: 'role_operator', roleName: '통합 운용자', status: 'used', systems: ['IVMS'] },
        { id: 'op.yoon', name: '윤서진', dept: '통합관제센터', email: 'sj.yoon@sams.com', phone: '010-8901-2345', role: 'role_operator', roleName: '통합 운용자', status: 'used', systems: ['IVMS'] },
        { id: 'op.han', name: '한시우', dept: '통합관제센터', email: 'sw.han@sams.com', phone: '010-9012-3456', role: 'role_operator', roleName: '통합 운용자', status: 'used', systems: ['IVMS'] },
        { id: 'op.lim', name: '임도연', dept: '상황실', email: 'dy.lim@sams.com', phone: '010-0123-4567', role: 'role_operator', roleName: '통합 운용자', status: 'used', systems: ['IVMS'] },
        { id: 'op.shin', name: '신예준', dept: '상황실', email: 'yj.shin@sams.com', phone: '010-1234-0987', role: 'role_operator', roleName: '통합 운용자', status: 'used', systems: ['IVMS'] },
        { id: 'op.ahn', name: '안수진', dept: '모니터링팀', email: 'sj.ahn@sams.com', phone: '010-2345-9876', role: 'role_operator', roleName: '통합 운용자', status: 'used', systems: ['IVMS'] },
        { id: 'op.oh', name: '오명수', dept: '모니터링팀', email: 'ms.oh@sams.com', phone: '010-3456-8765', role: 'role_operator', roleName: '통합 운용자', status: 'unused', systems: ['IVMS'] },
        { id: 'op.seo', name: '서은지', dept: '장애대응팀', email: 'ej.seo@sams.com', phone: '010-4567-7654', role: 'role_operator', roleName: '통합 운용자', status: 'used', systems: ['IVMS'] },
        { id: 'op.hwang', name: '황민재', dept: '장애대응팀', email: 'mj.hwang@sams.com', phone: '010-5678-6543', role: 'role_operator', roleName: '통합 운용자', status: 'used', systems: ['IVMS'] },
        // role_vcdm
        { id: 'vcdm.cho', name: '조현수', dept: '대외협력팀', email: 'hs.cho@sams.com', phone: '010-6789-5432', role: 'role_vcdm', roleName: 'VCDM 운용자', status: 'used', systems: ['V-CDM'] },
        { id: 'vcdm.kwon', name: '권민지', dept: '대외협력팀', email: 'mj.kwon@sams.com', phone: '010-7890-4321', role: 'role_vcdm', roleName: 'VCDM 운용자', status: 'used', systems: ['V-CDM'] },
        { id: 'vcdm.jang', name: '장동현', dept: '운항조정팀', email: 'dh.jang@sams.com', phone: '010-8901-3210', role: 'role_vcdm', roleName: 'VCDM 운용자', status: 'used', systems: ['V-CDM'] },
        // role_airline
        { id: 'air.kim', name: '김동하', dept: '대한항공', email: 'dh.kim@koreanair.com', phone: '010-9012-2109', role: 'role_airline', roleName: '항공사', status: 'used', systems: ['IFPS'] },
        { id: 'air.lee', name: '이수빈', dept: '아시아나', email: 'sb.lee@asiana.com', phone: '010-0123-1098', role: 'role_airline', roleName: '항공사', status: 'used', systems: ['IFPS'] },
        { id: 'air.park', name: '박진우', dept: '제주항공', email: 'jw.park@jejuair.net', phone: '010-1234-5432', role: 'role_airline', roleName: '항공사', status: 'used', systems: ['IFPS'] },
        { id: 'air.choi', name: '최지우', dept: '진에어', email: 'jw.choi@jinair.com', phone: '010-2345-4321', role: 'role_airline', roleName: '항공사', status: 'used', systems: ['IFPS'] },
        { id: 'air.jung', name: '정해인', dept: '티웨이', email: 'hi.jung@tway.com', phone: '010-3456-3210', role: 'role_airline', roleName: '항공사', status: 'used', systems: ['IFPS'] },
        { id: 'air.kang', name: '강서준', dept: '에어부산', email: 'sj.kang@airbusan.com', phone: '010-4567-2109', role: 'role_airline', roleName: '항공사', status: 'used', systems: ['IFPS'] },
        // role_vertiport
        { id: 'vp.song', name: '송태태', dept: '김포버티포트', email: 'th.song@k-uam.com', phone: '010-5678-1092', role: 'role_vertiport', roleName: '버티포트 운용자', status: 'used', systems: ['IVMS'] },
        { id: 'vp.yoon', name: '윤지민', dept: '잠실버티포트', email: 'jm.yoon@k-uam.com', phone: '010-6789-0981', role: 'role_vertiport', roleName: '버티포트 운용자', status: 'used', systems: ['IVMS'] },
        { id: 'vp.han', name: '한정국', dept: '수서버티포트', email: 'jk.han@k-uam.com', phone: '010-7890-9870', role: 'role_vertiport', roleName: '버티포트 운용자', status: 'used', systems: ['IVMS'] },
        // unassigned
        { id: 'eng.choi', name: '최현우', dept: '시설관리팀', email: 'hw.choi@sams.com', phone: '010-7777-8888', role: 'unassigned', roleName: '미배정', status: 'normal', systems: [] },
        { id: 'intern.jung', name: '정민아', dept: 'IT지원팀', email: 'ma.jung@sams.com', phone: '010-9999-0000', role: 'unassigned', roleName: '미배정', status: 'normal', systems: [] },
        { id: 'user.out1', name: '이탈퇴', dept: '운영기획팀', email: 'out1@sams.com', phone: '010-0000-0001', role: 'unassigned', roleName: '미배정', status: 'withdrawn', systems: [], withdrawalDate: '2026.03.12 15:30:00' },
        { id: 'user.out2', name: '박탈퇴', dept: '보안관제팀', email: 'out2@sams.com', phone: '010-0000-0002', role: 'unassigned', roleName: '미배정', status: 'withdrawn', systems: [], withdrawalDate: '2026.03.11 11:20:00' }
    ];

    // Role Definition
    const roles = [
        { id: 'unassigned', name: '미배정' },
        { id: 'role_total', name: '통합 관리자' },
        { id: 'role_operator', name: '통합 운용자' },
        { id: 'role_vcdm', name: 'VCDM 운용자' },
        { id: 'role_airline', name: '항공사' },
        { id: 'role_vertiport', name: '버티포트 운용자' }
    ];

    // Status Definition
    const statuses = [
        { id: 'normal', name: '정상' },
        { id: 'locked', name: '잠김' },
        { id: 'suspended', name: '휴면' },
        { id: 'withdrawn', name: '탈퇴' },
        { id: 'pending', name: '승인 대기' }
    ];

    // === Elements ===
    const userListBody = document.getElementById('user-list-body');
    const detailPane = document.getElementById('detail-pane');
    const emptyState = document.getElementById('empty-state');
    const detailContent = document.getElementById('detail-content');

    // Header Elements
    const selectedUserNameSpan = document.getElementById('selected-user-name');
    const regHeaderGroup = document.getElementById('reg-header-group');
    const viewModeButtons = document.getElementById('view-mode-buttons');
    const editModeButtons = document.getElementById('edit-mode-buttons');
    const regModeButtons = document.getElementById('reg-mode-buttons');

    // Form Elements
    const formInputs = document.querySelectorAll('.form-input, .custom-checkbox, .custom-radio');
    const userIdInput = document.getElementById('user-id');
    const userNameInput = document.getElementById('user-name');
    const userEmailInput = document.getElementById('user-email');
    const userPhoneInput = document.getElementById('user-phone');
    const userDeptInput = document.getElementById('user-dept');
    const userRoleNameInput = document.getElementById('user-role-name');
    const userRoleIdInput = document.getElementById('user-role-id');

    // Status Elements
    const userStatusTextInput = document.getElementById('user-status-text');
    const userStatusValueInput = document.getElementById('user-status-value');
    const btnSelectStatus = document.getElementById('btn-select-status');

    const userSystemCheckboxes = document.getElementsByName('user-systems');
    const userRegDateInput = document.getElementById('user-reg-date');
    const userModDateInput = document.getElementById('user-mod-date');
    const userRegistrantInput = document.getElementById('user-registrant');
    const userLastLoginInput = document.getElementById('user-last-login');
    const userWithdrawalDateInput = document.getElementById('user-withdrawal-date');
    const userPwErrorCountInput = document.getElementById('user-pw-error-count');

    // Buttons
    const btnCheckId = document.getElementById('btn-check-id');
    const btnSelectRole = document.getElementById('btn-select-role');

    // Modals
    const roleSelectModal = document.getElementById('role-select-modal');
    const roleSelectList = document.getElementById('role-select-list');
    const statusSelectModal = document.getElementById('status-select-modal');
    const statusSelectList = document.getElementById('status-select-list');
    const deleteConfirmModal = document.getElementById('delete-confirm-modal');
    const resultModal = document.getElementById('result-modal');


    let currentUser = null;
    let isEditMode = false;
    let isRegMode = false;
    let isIdChecked = false; // For registration mock check
    let isRegistrationComplete = false; // Flag to distinguish Reg completion vs intermediate success
    let tempSelectedRole = null; // For modal selection
    let tempSelectedStatus = null; // For status modal selection

    // === Filter Elements ===
    const userFilterContent = document.getElementById('user-filter-content');
    const userFilterChevron = document.getElementById('user-filter-chevron');
    const filterUserType = document.getElementById('filter-user-type');
    const filterUserKeyword = document.getElementById('filter-user-keyword');
    const filterUserRole = document.getElementById('filter-user-role');
    const filterUserStatus = document.getElementById('filter-user-status');

    // === Initialization ===

    // Populate Role Filter logic
    if (filterUserRole) {
        roles.forEach(role => {
            const option = document.createElement('option');
            option.value = role.id;
            option.textContent = role.name;
            filterUserRole.appendChild(option);
        });
    }

    // Populate Status Filter
    if (filterUserStatus) {
        statuses.forEach(status => {
            const option = document.createElement('option');
            option.value = status.id;
            option.textContent = status.name;
            filterUserStatus.appendChild(option);
        });
    }

    renderUserList();

    // === Functions ===

    function renderUserList() {
        userListBody.innerHTML = '';

        // Filter Data
        let filteredUsers = users;
        // Filter by Role
        if (filterUserRole && filterUserRole.value !== 'all') {
            filteredUsers = filteredUsers.filter(u => u.role === filterUserRole.value);
        }

        // Filter by Status
        if (filterUserStatus && filterUserStatus.value !== 'all') {
            filteredUsers = filteredUsers.filter(u => {
                let statusId = u.status;
                if (statusId === 'used') statusId = 'normal';
                if (statusId === 'unused') statusId = 'suspended';
                return statusId === filterUserStatus.value;
            });
        }

        if (filterUserType && filterUserKeyword) {
            const type = filterUserType.value;
            const keyword = filterUserKeyword.value.toLowerCase().trim();

            if (keyword) {
                filteredUsers = filteredUsers.filter(user => {
                    if (type === 'all') {
                        return (user.id && user.id.toLowerCase().includes(keyword)) ||
                            (user.name && user.name.toLowerCase().includes(keyword)) ||
                            (user.dept && user.dept.toLowerCase().includes(keyword));
                    } else if (type === 'id') {
                        return user.id && user.id.toLowerCase().includes(keyword);
                    } else if (type === 'name') {
                        return user.name && user.name.toLowerCase().includes(keyword);
                    } else if (type === 'dept') {
                        return user.dept && user.dept.toLowerCase().includes(keyword);
                    }
                    return true;
                });
            }
        }

        // Update Total Count
        const totalCountEl = document.getElementById('user-total-count');
        if (totalCountEl) totalCountEl.innerText = `총 ${filteredUsers.length} 건`;

        // Empty State for List
        if (filteredUsers.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td colspan="5" class="text-center py-4">검색 결과가 없습니다.</td>`;
            userListBody.appendChild(tr);
            return;
        }

        filteredUsers.forEach(user => {
            const tr = document.createElement('tr');
            tr.className = 'data-table-row clickable-row';
            tr.dataset.userId = user.id;
            tr.onclick = () => selectUser(user, tr);

            // Highlight if active
            if (currentUser && currentUser.id === user.id) {
                tr.classList.add('active');
            }

            // Map old 'used'/'unused' to new status if needed (migration logic)
            let displayStatus = user.status;
            if (displayStatus === 'used') displayStatus = 'normal';
            if (displayStatus === 'unused') displayStatus = 'suspended';

            const statusObj = statuses.find(s => s.id === displayStatus);
            const statusName = statusObj ? statusObj.name : displayStatus;

            tr.innerHTML = `
                <td data-label="ID">${user.id}</td>
                <td data-label="Name">${user.name}</td>
                <td data-label="Dept">${user.dept}</td>
                <td data-label="Role">${user.roleName}</td>
                <td data-label="Status">${statusName}</td>
            `;

            // Map old 'used'/'unused' to new status if needed (migration logic)
            if (user.status === 'used') user.status = 'normal';
            if (user.status === 'unused') user.status = 'suspended';

            // Add mock dates if missing
            if (!user.regDate) user.regDate = '2026.01.15 10:30:00';
            if (!user.modDate) user.modDate = '2026.02.01 14:20:00';
            if (!user.registrant) user.registrant = '시스템관리자';
            if (!user.lastLogin) user.lastLogin = '2026.03.11 09:12:45';
            if (user.pwErrorCount === undefined) user.pwErrorCount = Math.floor(Math.random() * 5);
            if (user.status === 'withdrawn' && !user.withdrawalDate) user.withdrawalDate = '2026.03.12 18:00:00';

            userListBody.appendChild(tr);
        });
    }

    // === Filter Functions ===
    // === Filter Functions ===
    window.toggleUserFilter = function () {
        const chevron = document.getElementById('user-filter-chevron');
        if (userFilterContent.classList.contains('hidden')) {
            userFilterContent.classList.remove('hidden');
            if (chevron) chevron.style.transform = 'rotate(180deg)';
        } else {
            userFilterContent.classList.add('hidden');
            if (chevron) chevron.style.transform = 'rotate(0deg)';
        }
    };

    window.resetUserFilter = function () {
        if (filterUserRole) filterUserRole.value = 'all';
        if (filterUserStatus) filterUserStatus.value = 'all';
        filterUserType.value = 'all';
        filterUserKeyword.value = '';
        renderUserList();
    };

    window.applyUserFilter = function () {
        renderUserList();
    };

    function selectUser(user, rowElement) {
        currentUser = user;

        // Update Active Row
        document.querySelectorAll('.data-table-row').forEach(r => r.classList.remove('active'));
        if (rowElement) rowElement.classList.add('active');
        else {
            const el = document.querySelector(`.data-table-row[data-user-id="${user.id}"]`);
            if (el) el.classList.add('active');
        }

        // Update Detail View Headers
        selectedUserNameSpan.textContent = user.name;

        // Fill Form
        userIdInput.value = user.id;
        userNameInput.value = user.name;
        userEmailInput.value = user.email;
        userPhoneInput.value = user.phone;
        userDeptInput.value = user.dept;

        // Role
        userRoleIdInput.value = user.role;
        userRoleNameInput.value = user.roleName;

        // Status
        // Handle migration from old 'message' if needed, but Mock Data has 'used/unused'.
        // I will map them for display: used->normal, unused->suspended
        let statusId = user.status;
        if (statusId === 'used') statusId = 'normal';
        else if (statusId === 'unused') statusId = 'suspended';

        const statusObj = statuses.find(s => s.id === statusId);
        if (statusObj) {
            userStatusTextInput.value = statusObj.name;
            userStatusValueInput.value = statusObj.id;
        } else {
            // Fallback
            userStatusTextInput.value = statusId;
            userStatusValueInput.value = statusId;
        }


        // Systems
        userSystemCheckboxes.forEach(cb => {
            cb.checked = (user.systems && user.systems.includes(cb.value));
        });

        // Dates
        if (userRegDateInput) userRegDateInput.value = user.regDate || '-';
        if (userModDateInput) userModDateInput.value = user.modDate || '-';
        if (userRegistrantInput) userRegistrantInput.value = user.registrant || '시스템관리자';
        if (userLastLoginInput) userLastLoginInput.value = user.lastLogin || '-';
        if (userWithdrawalDateInput) {
            userWithdrawalDateInput.value = (user.status === 'withdrawn') ? (user.withdrawalDate || '-') : '-';
        }
        if (userPwErrorCountInput) userPwErrorCountInput.value = user.pwErrorCount !== undefined ? user.pwErrorCount : '0';

        // Show View Mode
        resetViewMode();

        // Show Pane (Mobile)
        openDetailPane();
    }

    function resetViewMode() {
        isEditMode = false;
        isRegMode = false;
        isIdChecked = false;

        // Headers
        const rightPaneHeader = document.getElementById('right-pane-header');
        if (rightPaneHeader) rightPaneHeader.classList.remove('hidden');
        regHeaderGroup.classList.add('hidden');

        // Buttons
        viewModeButtons.classList.remove('hidden');
        editModeButtons.classList.add('hidden');
        regModeButtons.classList.add('hidden');

        btnCheckId.classList.add('hidden');

        // Form State
        formInputs.forEach(input => {
            input.disabled = true;
            input.classList.remove('error');
        });
        document.querySelectorAll('.form-error').forEach(el => el.innerText = '');

        // Hide/Disable Role Select Button
        btnSelectRole.classList.add('hidden');
        btnSelectRole.disabled = true;

        // Hide/Disable Status Select Button
        btnSelectStatus.classList.add('hidden');
        btnSelectStatus.disabled = true;
        userStatusTextInput.disabled = true;


        // Hide Password Section
        const passwordSection = document.getElementById('password-section');
        if (passwordSection) passwordSection.classList.add('hidden');

        // Hide Reg Password Section
        const regPasswordSection = document.getElementById('reg-password-section');
        if (regPasswordSection) regPasswordSection.classList.add('hidden');

        // SHOW Systems (View Mode needs to see it, just disabled)
        const desiredSystemsSection = document.getElementById('desired-systems-section');
        if (desiredSystemsSection) desiredSystemsSection.classList.remove('hidden');

        // SHOW Dates (View Mode)
        const userDatesSection = document.getElementById('user-dates-section');
        if (userDatesSection) userDatesSection.classList.remove('hidden');

        // Reset Button (Double check, it should be hidden with section)
        const btnResetPw = document.getElementById('btn-reset-pw');
        if (btnResetPw) btnResetPw.disabled = true;

        // Hide Required Marks
        document.querySelectorAll('.required-mark').forEach(el => el.classList.add('hidden'));

        // Layout
        emptyState.classList.add('hidden');
        detailContent.classList.remove('hidden');
    }

    // === Window Exposed Functions ===

    window.initRegistrationMode = function () {
        isRegMode = true;
        isEditMode = false;
        currentUser = null;
        isIdChecked = false;
        isRegistrationComplete = false;

        // Deselect List
        document.querySelectorAll('.data-table-row').forEach(r => r.classList.remove('active'));

        // Header: Hide "User Info", Show "User Registration"
        const rightPaneHeader = document.getElementById('right-pane-header');
        if (rightPaneHeader) rightPaneHeader.classList.add('hidden');
        regHeaderGroup.classList.remove('hidden');

        // Buttons
        viewModeButtons.classList.add('hidden');
        editModeButtons.classList.add('hidden');
        regModeButtons.classList.remove('hidden');

        // Clear & Enable Form
        formInputs.forEach(input => {
            input.value = '';

            // Should not enable role/status input (must use select button)
            if (input.id !== 'user-role-name' && input.id !== 'user-status-text') {
                input.disabled = false;
            }

            input.classList.remove('error'); // Clear error class
        });
        // Clear all error messages
        document.querySelectorAll('.form-error').forEach(el => el.innerText = '');

        // Uncheck boxes
        userSystemCheckboxes.forEach(cb => cb.checked = false);

        // Status: Default to 'Normal' (Using 'used' or 'normal' as default for new?)
        // Usually new user is normal. 
        userStatusValueInput.value = 'normal';
        userStatusTextInput.value = '정상';
        // Status select should be disabled in Reg Mode? Or allowed?
        // User request didn't specify, but usually status is fixed to Normal on creation or selectable.
        // Assuming selectable like Role.
        btnSelectStatus.classList.remove('hidden');
        btnSelectStatus.disabled = false;


        // Clear Role
        userRoleIdInput.value = '';
        userRoleNameInput.value = '';

        // Show Check button
        btnCheckId.classList.remove('hidden');

        // Show & Enable Role Select Button
        btnSelectRole.classList.remove('hidden');
        btnSelectRole.disabled = false;

        // Hide Password Section (Reset Btn)
        const passwordSection = document.getElementById('password-section');
        if (passwordSection) passwordSection.classList.add('hidden');

        // SHOW Reg Password Section
        const regPasswordSection = document.getElementById('reg-password-section');
        if (regPasswordSection) regPasswordSection.classList.remove('hidden');

        // HIDE Desired Systems
        const desiredSystemsSection = document.getElementById('desired-systems-section');
        if (desiredSystemsSection) desiredSystemsSection.classList.add('hidden');

        // HIDE Dates
        const userDatesSection = document.getElementById('user-dates-section');
        if (userDatesSection) userDatesSection.classList.add('hidden');

        // Reset Button Disabled in Reg Mode
        const btnResetPw = document.getElementById('btn-reset-pw');
        if (btnResetPw) btnResetPw.disabled = true;

        // Show Required Marks
        document.querySelectorAll('.required-mark').forEach(el => el.classList.remove('hidden'));

        // Show Pane
        emptyState.classList.add('hidden');
        detailContent.classList.remove('hidden');
        openDetailPane();
    };

    window.enterEditMode = function () {
        isEditMode = true;

        // Buttons
        viewModeButtons.classList.add('hidden');
        editModeButtons.classList.remove('hidden');

        // Enable Inputs (except ID and Dates)
        formInputs.forEach(input => {
            if (input.id !== 'user-id' &&
                input.id !== 'user-reg-date' &&
                input.id !== 'user-mod-date' &&
                input.id !== 'user-role-name' &&
                input.id !== 'user-status-text') {
                input.disabled = false;
            }
        });

        // Show & Enable Role Select
        btnSelectRole.classList.remove('hidden');
        btnSelectRole.disabled = false;

        // Show & Enable Status Select
        btnSelectStatus.classList.remove('hidden');
        btnSelectStatus.disabled = false;

        // Show Password Section
        const passwordSection = document.getElementById('password-section');
        if (passwordSection) passwordSection.classList.remove('hidden');

        // HIDE Reg Password Section
        const regPasswordSection = document.getElementById('reg-password-section');
        if (regPasswordSection) regPasswordSection.classList.add('hidden');

        // SHOW Desired Systems
        const desiredSystemsSection = document.getElementById('desired-systems-section');
        if (desiredSystemsSection) desiredSystemsSection.classList.remove('hidden');

        // HIDE Dates (Edit Mode)
        const userDatesSection = document.getElementById('user-dates-section');
        if (userDatesSection) userDatesSection.classList.add('hidden');

        // Enable Reset PW Button
        const btnResetPw = document.getElementById('btn-reset-pw');
        if (btnResetPw) btnResetPw.disabled = false;

        // Show Required Marks
        document.querySelectorAll('.required-mark').forEach(el => el.classList.remove('hidden'));

        // Ensure Right Pane Header is Visible
        const rightPaneHeader = document.getElementById('right-pane-header');
        if (rightPaneHeader) rightPaneHeader.classList.remove('hidden');
        regHeaderGroup.classList.add('hidden');
    };

    window.cancelEdit = function () {
        if (currentUser) {
            selectUser(currentUser, document.querySelector(`.data-table-row[data-user-id="${currentUser.id}"]`));
        } else {
            resetViewMode();
        }
    };

    window.cancelRegistration = function () {
        isRegMode = false;
        if (currentUser) {
            selectUser(currentUser, document.querySelector(`.data-table-row[data-user-id="${currentUser.id}"]`));
        } else {
            closeDetailPane();
            emptyState.classList.remove('hidden');
            detailContent.classList.add('hidden');
        }
    };

    window.saveChanges = function () {
        // Collect Systems
        const selectedSystems = [];
        userSystemCheckboxes.forEach(cb => {
            if (cb.checked) selectedSystems.push(cb.value);
        });

        // Collect Status
        const status = userStatusValueInput.value;

        // Update local data mock
        if (currentUser) {
            currentUser.name = userNameInput.value;
            currentUser.email = userEmailInput.value;
            currentUser.phone = userPhoneInput.value;
            currentUser.dept = userDeptInput.value;

            currentUser.role = userRoleIdInput.value;
            currentUser.roleName = userRoleNameInput.value;

            currentUser.status = status;
            currentUser.systems = selectedSystems;

            renderUserList();
            // Re-select to refresh view
            selectUser(currentUser, document.querySelector(`.data-table-row[data-user-id="${currentUser.id}"]`));

            showSuccessModal('회원 정보가 수정되었습니다.', '수정 완료');
        }
    };

    // Helper functions for validation
    window.resetError = function (fieldId) {
        document.getElementById(fieldId).classList.remove('error');
        const errDiv = document.getElementById('error-' + fieldId);
        if (errDiv) errDiv.innerText = '';

        if (fieldId === 'user-id') {
            isIdChecked = false;
        }
    }

    function setError(fieldId, msg) {
        document.getElementById(fieldId).classList.add('error');
        const errDiv = document.getElementById('error-' + fieldId);
        if (errDiv) errDiv.innerText = msg;
    }

    window.processRegistration = function () {
        let hasError = false;

        // 1. ID Check
        const userId = userIdInput.value.trim();
        if (!userId) {
            setError('user-id', '아이디를 입력해주세요.');
            hasError = true;
        } else if (!/^[A-Za-z0-9]{5,20}$/.test(userId)) {
            setError('user-id', '영문 또는 영문과 숫자 조합으로 5~20자리');
            hasError = true;
        } else if (!isIdChecked) {
            setError('user-id', '아이디 중복 확인을 해주세요.');
            hasError = true;
        }

        // 2. Name Check
        if (!userNameInput.value.trim()) {
            setError('user-name', '이름을 입력해주세요.');
            hasError = true;
        }

        // 3. Dept Check
        if (!userDeptInput.value.trim()) {
            setError('user-dept', '소속을 입력해주세요.');
            hasError = true;
        }

        // 4. Email Check
        const userEmail = userEmailInput.value.trim();
        if (!userEmail) {
            setError('user-email', '이메일을 입력해주세요.');
            hasError = true;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
            setError('user-email', '이메일 형식이 올바르지 않습니다.');
            hasError = true;
        }

        // 5. Phone Check
        if (!userPhoneInput.value.trim()) {
            setError('user-phone', '휴대폰 번호를 입력해주세요.');
            hasError = true;
        }

        // 6. Password Check (Reg Mode Only)
        // Reg Password Section is visible in Reg Mode
        const pw = document.getElementById('user-pw');
        const pwConfirm = document.getElementById('user-pw-confirm');

        if (!pw.value) {
            setError('user-pw', '비밀번호를 입력해주세요.');
            hasError = true;
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(pw.value)) {
            setError('user-pw', '영문 대소문자, 숫자, 특수문자를 포함하여 8자 이상 입력해주세요.');
            hasError = true;
        }

        if (!pwConfirm.value) {
            setError('user-pw-confirm', '비밀번호 확인을 입력해주세요.');
            hasError = true;
        } else if (pw.value !== pwConfirm.value) {
            setError('user-pw-confirm', '비밀번호가 일치하지 않습니다.');
            hasError = true;
        }

        // 7. Role Check
        if (!userRoleIdInput.value) {
            setError('user-role-name', '권한을 선택해주세요.');
            hasError = true;
        }

        if (hasError) return;


        // Collect Systems (Reg Mode -> Systems Hidden -> None collected)
        const selectedSystems = [];

        // Collect Status
        const status = userStatusValueInput.value;

        // Simulate Save
        const newUser = {
            id: userIdInput.value,
            name: userNameInput.value,
            email: userEmailInput.value,
            phone: userPhoneInput.value,
            dept: userDeptInput.value,
            role: userRoleIdInput.value,
            roleName: userRoleNameInput.value,
            status: status,
            systems: selectedSystems,
            regDate: new Date().toISOString().replace('T', ' ').substring(0, 19).replace(/-/g, '.'),
            modDate: new Date().toISOString().replace('T', ' ').substring(0, 19).replace(/-/g, '.')
        };
        users.push(newUser);

        // Shows Success Modal
        isRegistrationComplete = true; // Set flag to true
        showSuccessModal('회원 정보가 등록되었습니다.', '등록 완료');

        // Refresh List
        renderUserList();
    };

    // === Password Reset ===
    window.resetPassword = function () {
        // Mock logic
        showSuccessModal('비밀번호를 11111111로 초기화 하였습니다.', '비밀번호 초기화');
    };

    // === Role Select Modal ===
    window.openRoleSelectModal = function () {
        roleSelectModal.classList.add('active');
        renderRoleList();
    };

    window.closeRoleSelectModal = function () {
        roleSelectModal.classList.remove('active');
        tempSelectedRole = null;
    };

    function renderRoleList() {
        roleSelectList.innerHTML = '';

        // CSS matching SAM_AU_02_01 / Generic Radio List
        roles.forEach(role => {
            if (role.id === 'unassigned') return;

            const div = document.createElement('div');
            div.className = 'flex items-center';

            // Check if selected
            const isChecked = (currentUser && currentUser.role === role.id) || (userRoleIdInput.value === role.id);

            // Use label.perm-checkbox-group structure
            div.innerHTML = `
                <label class="perm-checkbox-group">
                    <input type="radio" name="modal-role-select" value="${role.id}" class="custom-radio" ${isChecked ? 'checked' : ''}>
                    <span class="perm-checkbox-label modal-radio-label">${role.name} <span class="modal-radio-subtext">(${role.id})</span></span>
                </label>
            `;

            roleSelectList.appendChild(div);
        });
    }

    window.confirmRoleSelect = function () {
        // If user didn't click anything, check if one is checked
        if (!tempSelectedRole) {
            const checked = document.querySelector('input[name="modal-role-select"]:checked');
            if (checked) {
                tempSelectedRole = roles.find(r => r.id === checked.value);
            }
        }

        if (tempSelectedRole) {
            userRoleIdInput.value = tempSelectedRole.id;
            userRoleNameInput.value = tempSelectedRole.name;
            resetError('user-role-name');
            closeRoleSelectModal();
        } else {
            showResultModal('권한을 선택해주세요.');
        }
    };

    // === Status Select Modal ===
    window.openStatusSelectModal = function () {
        statusSelectModal.classList.add('active');
        renderStatusList();
    };

    window.closeStatusSelectModal = function () {
        statusSelectModal.classList.remove('active');
        tempSelectedStatus = null;
    };

    function renderStatusList() {
        statusSelectList.innerHTML = '';

        statuses.forEach(status => {
            const div = document.createElement('div');
            div.className = 'flex items-center';

            // Check if selected
            const isChecked = userStatusValueInput.value === status.id;

            div.innerHTML = `
                <label class="perm-checkbox-group">
                    <input type="radio" name="modal-status-select" value="${status.id}" class="custom-radio" ${isChecked ? 'checked' : ''}>
                    <span class="perm-checkbox-label modal-radio-label">${status.name}</span>
                </label>
            `;

            statusSelectList.appendChild(div);
        });
    }

    window.confirmStatusSelect = function () {
        // If user didn't click anything, check if one is checked
        if (!tempSelectedStatus) {
            const checked = document.querySelector('input[name="modal-status-select"]:checked');
            if (checked) {
                tempSelectedStatus = statuses.find(s => s.id === checked.value);
            }
        }

        if (tempSelectedStatus) {
            userStatusValueInput.value = tempSelectedStatus.id;
            userStatusTextInput.value = tempSelectedStatus.name;
            closeStatusSelectModal();

            // If we are in Edit mode, we can optionally save or just update button?
            // User requirement: "Save in modal"? 
            // "상태 변경 누르면 권한 변경 처럼 모달에서 상태 변경 후 저장 할 수 있게 해줘."
            // Which means 'Confirm' in modal updates the input field, and then 'Save' on the main form saves it.
            // Just like Role Select. I implemented 'Save' button in modal as 'confirmStatusSelect'.
        } else {
            showResultModal('상태를 선택해주세요.');
        }
    };

    // === ID Check ===
    window.checkIdDuplicate = function () {
        const userId = userIdInput.value.trim();
        if (!userId) {
            showResultModal('아이디를 입력해주세요.');
            return;
        }

        if (!/^[A-Za-z0-9]{5,20}$/.test(userId)) {
            showResultModal('영문 또는 영문과 숫자 조합으로 5~20자리를 입력해주세요.');
            return;
        }

        // Mock check
        isIdChecked = true;
        showSuccessModal('사용 가능한 아이디입니다.');
    };

    // === Delete Flow ===
    window.showDeleteWarning = function () {
        // Uses 'delete-confirm-modal'
        deleteConfirmModal.classList.add('active');
    };

    window.closeDeleteConfirm = function () {
        deleteConfirmModal.classList.remove('active');
    };

    window.confirmDeleteAction = function () {
        closeDeleteConfirm();

        if (currentUser) {
            // Remove from array
            const idx = users.findIndex(u => u.id === currentUser.id);
            if (idx > -1) users.splice(idx, 1);

            renderUserList();

            // Reset View
            currentUser = null;
            closeDetailPane();
            emptyState.classList.remove('hidden');
            detailContent.classList.add('hidden');

            // Show Success Modal instead of Result Validator
            // showResultModal('삭제되었습니다.');
            showSuccessModal('삭제되었습니다.', '삭제 완료');
        }
    };

    // === Result Modal (Warning Icon) ===
    function showResultModal(msg) {
        // Set message (title is already '알림' or '삭제 완료' can be set)
        // document.getElementById('result-modal-title').innerText = '알림';
        document.getElementById('result-modal-desc').innerText = msg;
        resultModal.classList.add('active');
    }

    window.closeResultModal = function () {
        resultModal.classList.remove('active');
    };

    window.closeSuccessModal = function () {
        document.getElementById('success-modal').classList.remove('active');
        // Only reset mode if actual registration was completed
        if (isRegMode && isRegistrationComplete) {
            // Find the newly added user (last one)
            const newUser = users[users.length - 1];
            isRegMode = false;
            isRegistrationComplete = false; // Reset flag
            selectUser(newUser, document.querySelector(`.data-table-row[data-user-id="${newUser.id}"]`));
        }
    };

    function showSuccessModal(msg, title = '등록 완료') {
        const titleEl = document.getElementById('success-modal-title');
        if (titleEl) titleEl.innerText = title;

        const msgEl = document.getElementById('success-message');
        if (msgEl) msgEl.innerText = msg;
        document.getElementById('success-modal').classList.add('active');
    }

    // Mobile Split Pane Functions
    window.openDetailPane = function () {
        document.querySelector('.split-container').classList.add('show-detail');
    }

    window.closeDetailPane = function () {
        document.querySelector('.split-container').classList.remove('show-detail');
        if (isRegMode) {
            isRegMode = false;
            document.querySelectorAll('.data-table-row').forEach(r => r.classList.remove('active'));
            emptyState.classList.remove('hidden');
            detailContent.classList.add('hidden');
        }
    }
});
