document.addEventListener('DOMContentLoaded', () => {
    const roleRows = document.querySelectorAll('.clickable-row');
    const emptyState = document.getElementById('empty-state');
    const detailContent = document.getElementById('detail-content');
    const selectedRoleName = document.getElementById('selected-role-name');

    // Handle Role Selection
    roleRows.forEach(row => {
        row.addEventListener('click', () => {
            // Remove active class from all rows
            roleRows.forEach(r => r.classList.remove('active', 'bg-slate-700/50'));

            // Add active class to clicked row
            row.classList.add('active', 'bg-slate-700/50');

            // Toggle Panes
            emptyState.classList.add('hidden');
            detailContent.classList.remove('hidden');

            // Update Header Name
            const roleName = row.cells[1].textContent;
            selectedRoleName.textContent = roleName;

            // Mock Data for Permissions based on Role
            updatePermissions(row.dataset.roleId);
        });
    });

    /**
     * Update permissions based on selected role
     * Each role has predefined access patterns
     */
    function updatePermissions(roleId) {
        // Reset all checkboxes first
        const checkboxes = detailContent.querySelectorAll('input[type="checkbox"]');

        checkboxes.forEach(cb => {
            cb.checked = false;
        });

        // Helper function to check checkboxes by system and permissions
        const setPermissions = (system, permissions) => {
            permissions.forEach(perm => {
                const cb = detailContent.querySelector(`input[data-system="${system}"][data-permission="${perm}"]`);
                if (cb) cb.checked = true;
            });
        };

        // Role-based permission patterns
        switch (roleId) {
            case 'ROLE_TOTAL_ADMIN':
                // 통합 관리자: All permissions
                checkboxes.forEach(cb => cb.checked = true);
                break;

            case 'ROLE_TOTAL_OPERATOR':
                // 통합 운용자: IVMS, IFPS, SAMS write access
                setPermissions('ivms', ['read', 'write']);
                setPermissions('ifps', ['read', 'write']);
                setPermissions('sams', ['read', 'write']);
                break;

            case 'ROLE_VCDM_OPERATOR':
                // VCDM 운용자: V-CDM write access only
                setPermissions('vcdm', ['read', 'write']);
                break;

            case 'ROLE_AIRLINE':
                // 항공사: IFRS 운항사 전용 write access only
                setPermissions('ifrs-airline', ['read', 'write']);
                break;

            case 'ROLE_VERTIPORT_OPERATOR':
                // 버티포트운용자: IFRS 버티포트 전용 write access only
                setPermissions('ifrs-vertiport', ['read', 'write']);
                break;
        }
    }
});

// Edit Mode Functions
function enterEditMode() {
    // Toggle button groups
    document.getElementById('view-mode-buttons').style.display = 'none';
    document.getElementById('edit-mode-buttons').style.display = 'flex';

    // Enable all checkboxes
    const checkboxes = document.querySelectorAll('#detail-content input[type="checkbox"]');
    checkboxes.forEach(cb => cb.disabled = false);
}

function saveChanges() {
    // Here you would normally save the changes via API
    console.log('Saving changes...');

    // Exit edit mode
    exitEditMode();
}

function cancelEdit() {
    // Restore original state (would normally reload from server)
    console.log('Canceling changes...');

    // Exit edit mode
    exitEditMode();
}

function exitEditMode() {
    // Toggle button groups
    document.getElementById('view-mode-buttons').style.display = 'flex';
    document.getElementById('edit-mode-buttons').style.display = 'none';

    // Disable all checkboxes
    const checkboxes = document.querySelectorAll('#detail-content input[type="checkbox"]');
    checkboxes.forEach(cb => cb.disabled = true);
}
