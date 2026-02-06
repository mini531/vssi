document.addEventListener('DOMContentLoaded', () => {
    // === Mock Data ===
    const usersByRole = {
        'ROLE_TOTAL_ADMIN': [
            { id: 'admin.kim', name: '김민수', dept: '시스템 관리팀', email: 'ms.kim@sams.com', phone: '010-1234-5678' },
            { id: 'admin.lee', name: '이지원', dept: '운영기획팀', email: 'jw.lee@sams.com', phone: '010-2345-6789' },
            { id: 'admin.park', name: '박준호', dept: '보안관제팀', email: 'jh.park@sams.com', phone: '010-3456-7890' },
            { id: 'admin.choi', name: '최유나', dept: '감사팀', email: 'yn.choi@sams.com', phone: '010-4567-8901' },
            { id: 'admin.jung', name: '정우성', dept: 'IT인프라팀', email: 'ws.jung@sams.com', phone: '010-5678-9012' },
            { id: 'admin.kang', name: '강하늘', dept: '품질관리팀', email: 'hn.kang@sams.com', phone: '010-6789-0123' }
        ],
        'ROLE_TOTAL_OPERATOR': [
            { id: 'op.song', name: '송지은', dept: '통합관제센터', email: 'je.song@sams.com', phone: '010-7890-1234' },
            { id: 'op.yoon', name: '윤서진', dept: '통합관제센터', email: 'sj.yoon@sams.com', phone: '010-8901-2345' },
            { id: 'op.han', name: '한시우', dept: '통합관제센터', email: 'sw.han@sams.com', phone: '010-9012-3456' },
            { id: 'op.lim', name: '임도연', dept: '상황실', email: 'dy.lim@sams.com', phone: '010-0123-4567' },
            { id: 'op.shin', name: '신예준', dept: '상황실', email: 'yj.shin@sams.com', phone: '010-1234-0987' },
            { id: 'op.ahn', name: '안수진', dept: '모니터링팀', email: 'sj.ahn@sams.com', phone: '010-2345-9876' },
            { id: 'op.oh', name: '오명수', dept: '모니터링팀', email: 'ms.oh@sams.com', phone: '010-3456-8765' },
            { id: 'op.seo', name: '서은지', dept: '장애대응팀', email: 'ej.seo@sams.com', phone: '010-4567-7654' },
            { id: 'op.hwang', name: '황민재', dept: '장애대응팀', email: 'mj.hwang@sams.com', phone: '010-5678-6543' }
        ],
        'ROLE_VCDM_OPERATOR': [
            { id: 'vcdm.cho', name: '조현수', dept: '대외협력팀', email: 'hs.cho@sams.com', phone: '010-6789-5432' },
            { id: 'vcdm.kwon', name: '권민지', dept: '대외협력팀', email: 'mj.kwon@sams.com', phone: '010-7890-4321' },
            { id: 'vcdm.jang', name: '장동현', dept: '운항조정팀', email: 'dh.jang@sams.com', phone: '010-8901-3210' }
        ],
        'ROLE_AIRLINE': [
            { id: 'air.kim', name: '김동하', dept: '대한항공', email: 'dh.kim@koreanair.com', phone: '010-9012-2109' },
            { id: 'air.lee', name: '이수빈', dept: '아시아나', email: 'sb.lee@asiana.com', phone: '010-0123-1098' },
            { id: 'air.park', name: '박진우', dept: '제주항공', email: 'jw.park@jejuair.net', phone: '010-1234-5432' },
            { id: 'air.choi', name: '최지우', dept: '진에어', email: 'jw.choi@jinair.com', phone: '010-2345-4321' },
            { id: 'air.jung', name: '정해인', dept: '티웨이', email: 'hi.jung@tway.com', phone: '010-3456-3210' },
            { id: 'air.kang', name: '강서준', dept: '에어부산', email: 'sj.kang@airbusan.com', phone: '010-4567-2109' }
        ],
        'ROLE_VERTIPORT_OPERATOR': [
            { id: 'vp.song', name: '송태태', dept: '김포버티포트', email: 'th.song@k-uam.com', phone: '010-5678-1092' },
            { id: 'vp.yoon', name: '윤지민', dept: '잠실버티포트', email: 'jm.yoon@k-uam.com', phone: '010-6789-0981' },
            { id: 'vp.han', name: '한정국', dept: '수서버티포트', email: 'jk.han@k-uam.com', phone: '010-7890-9870' }
        ]
    };

    // === Elements ===
    const roleRows = document.querySelectorAll('.data-table-row[data-role-id]');
    const emptyState = document.getElementById('empty-state');
    const detailContent = document.getElementById('detail-content');
    const selectedRoleNameSpan = document.getElementById('selected-role-name');
    const userListBody = document.getElementById('user-list-body');
    const totalUserCount = document.getElementById('total-user-count');
    const btnChangeRole = document.getElementById('btn-change-role');
    const userSelectAllCheckbox = document.getElementById('user-select-all');

    let currentRoleId = null;

    // === Event Listeners ===

    // Role Row Click
    roleRows.forEach(row => {
        row.addEventListener('click', () => {
            const roleId = row.dataset.roleId;
            const roleName = row.children[1].textContent;

            // UI Update
            roleRows.forEach(r => r.classList.remove('active'));
            row.classList.add('active');

            // Set Current Role
            currentRoleId = roleId;
            selectedRoleNameSpan.textContent = roleName;

            // Show Content
            emptyState.classList.add('hidden');
            detailContent.classList.remove('hidden');

            // Render Users
            renderUserTable(roleId);
        });
    });

    // Select All Checkbox
    if (userSelectAllCheckbox) {
        userSelectAllCheckbox.addEventListener('change', (e) => {
            const isChecked = e.target.checked;
            const checkboxes = document.querySelectorAll('.user-select-checkbox');
            checkboxes.forEach(cb => cb.checked = isChecked);
            updateChangeRoleButtonState();
        });
    }


    // === Functions ===

    function renderUserTable(roleId) {
        userListBody.innerHTML = '';
        const users = usersByRole[roleId] || [];
        totalUserCount.textContent = users.length;

        if (users.length === 0) {
            userListBody.innerHTML = '<tr><td colspan="6" class="text-center py-8 text-slate-500">배정된 사용자가 없습니다.</td></tr>';
            btnChangeRole.disabled = true;
            if (userSelectAllCheckbox) userSelectAllCheckbox.checked = false;
            if (userSelectAllCheckbox) userSelectAllCheckbox.disabled = true;
            return;
        }

        if (userSelectAllCheckbox) userSelectAllCheckbox.disabled = false;
        if (userSelectAllCheckbox) userSelectAllCheckbox.checked = false;

        users.forEach(user => {
            const tr = document.createElement('tr');
            tr.className = 'data-table-row';
            tr.innerHTML = `
                <td class="text-center">
                    <label class="perm-checkbox-group justify-center">
                        <input type="checkbox" class="custom-checkbox form-checkbox user-select-checkbox" data-user-id="${user.id}">
                    </label>
                </td>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.dept}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
            `;
            userListBody.appendChild(tr);
        });

        // Add Listeners to new checkboxes
        const checkboxes = document.querySelectorAll('.user-select-checkbox');
        checkboxes.forEach(cb => {
            cb.addEventListener('change', () => {
                updateChangeRoleButtonState();
                updateSelectAllState();
            });
        });

        updateChangeRoleButtonState();
    }

    function updateChangeRoleButtonState() {
        const checkedCount = document.querySelectorAll('.user-select-checkbox:checked').length;
        btnChangeRole.disabled = checkedCount === 0;
    }

    function updateSelectAllState() {
        const allCheckboxes = Array.from(document.querySelectorAll('.user-select-checkbox'));
        if (allCheckboxes.length === 0) return;

        const allChecked = allCheckboxes.every(cb => cb.checked);
        if (userSelectAllCheckbox) userSelectAllCheckbox.checked = allChecked;
    }

    // Global Functions for Buttons (Placeholders)
    window.changeRoleModal = function () {
        const checkedCount = document.querySelectorAll('.user-select-checkbox:checked').length;
        alert(`${checkedCount}명의 권한을 변경하시겠습니까? (기능 구현 예정)`);
    };

    window.assignUserModal = function () {
        alert('사용자 추가 배정 팝업 (기능 구현 예정)');
    };
});
