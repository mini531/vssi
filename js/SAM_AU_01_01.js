document.addEventListener('DOMContentLoaded', () => {
    const roleRows = document.querySelectorAll('.clickable-row');
    const emptyState = document.getElementById('empty-state');
    const detailContent = document.getElementById('detail-content');
    const selectedRoleName = document.getElementById('selected-role-name');

    // Handle Role Selection
    roleRows.forEach(row => {
        row.addEventListener('click', () => {
            // Remove active class from all rows
            roleRows.forEach(r => r.classList.remove('active'));

            // Add active class to clicked row
            row.classList.add('active');

            // Toggle Panes
            emptyState.classList.add('hidden');
            detailContent.classList.remove('hidden');

            // Force Disable Checkboxes (Bug Fix)
            const checkboxes = detailContent.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(cb => cb.disabled = true);

            // Ensure View Mode UI
            document.getElementById('view-mode-buttons').classList.remove('hidden');
            document.getElementById('edit-mode-buttons').classList.add('hidden');
            document.getElementById('reg-mode-buttons').classList.add('hidden');
            document.getElementById('bulk-select-controls').classList.add('hidden');
            document.getElementById('reg-header-group').classList.add('hidden');
            document.getElementById('reg-header-group').classList.add('hidden');
            // Remove 'hidden' from the details title specifically
            const detailTitleGroup = detailContent.querySelector('.search-panel-title-group');
            if (detailTitleGroup) detailTitleGroup.classList.remove('hidden');
            document.getElementById('registration-form').classList.add('hidden');

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


    // Event Listener for Permission Checkboxes to sync "Select All" state
    detailContent.addEventListener('change', (e) => {
        if (e.target.matches('input[type="checkbox"][data-permission]')) {
            const type = e.target.dataset.permission;
            updateBulkSelectState(type);
        }
    });
});

// Edit Mode Functions
function enterEditMode() {
    // Toggle button groups
    document.getElementById('view-mode-buttons').classList.add('hidden');
    document.getElementById('edit-mode-buttons').classList.remove('hidden');

    // Show Bulk Select
    document.getElementById('bulk-select-controls').classList.remove('hidden');
    // Reset bulk select checkboxes
    document.getElementById('select-all-read').checked = false;
    document.getElementById('select-all-write').checked = false;
    document.getElementById('select-all-delete').checked = false;

    // Enable all checkboxes
    const checkboxes = document.querySelectorAll('#detail-content input[type="checkbox"]');
    checkboxes.forEach(cb => cb.disabled = false);

    // Sync Bulk Select State based on initial values
    updateBulkSelectState('read');
    updateBulkSelectState('write');
    updateBulkSelectState('delete');
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
    document.getElementById('view-mode-buttons').classList.remove('hidden');
    document.getElementById('edit-mode-buttons').classList.add('hidden');

    // Hide Bulk Select
    document.getElementById('bulk-select-controls').classList.add('hidden');

    // Disable all checkboxes
    const checkboxes = document.querySelectorAll('#detail-content input[type="checkbox"]');
    checkboxes.forEach(cb => cb.disabled = true);
}
// Registration Mode Functions
function initRegistrationMode() {
    // 1. Deselect any active row
    const roleRows = document.querySelectorAll('.clickable-row');
    roleRows.forEach(r => r.classList.remove('active', 'bg-slate-700/50'));

    // 2. Hide Empty State & Show Detail Content
    document.getElementById('empty-state').classList.add('hidden');
    document.getElementById('detail-content').classList.remove('hidden');

    // 3. Toggle Headers
    // Hide standard title group (only in detail content), show registration title group
    const detailTitleGroup = document.getElementById('detail-content').querySelector('.search-panel-title-group');
    if (detailTitleGroup) detailTitleGroup.classList.add('hidden');
    document.getElementById('reg-header-group').classList.remove('hidden');

    // 4. Toggle Buttons
    document.getElementById('view-mode-buttons').classList.add('hidden');
    document.getElementById('edit-mode-buttons').classList.add('hidden');
    document.getElementById('reg-mode-buttons').classList.remove('hidden');

    // Show Bulk Select
    document.getElementById('bulk-select-controls').classList.remove('hidden');
    // Reset bulk select checkboxes
    document.getElementById('select-all-read').checked = false;
    document.getElementById('select-all-write').checked = false;
    document.getElementById('select-all-delete').checked = false;

    // 5. Show Registration Form Inputs
    document.getElementById('registration-form').classList.remove('hidden');

    // Clear Inputs
    document.getElementById('reg-role-id').value = '';
    document.getElementById('reg-role-name').value = '';
    document.getElementById('error-reg-role-id').classList.add('hidden');
    document.getElementById('error-reg-role-name').classList.add('hidden');

    // 6. Reset & Enable Checkboxes
    const checkboxes = document.querySelectorAll('#detail-content input[type="checkbox"]');
    checkboxes.forEach(cb => {
        cb.checked = false;
        cb.disabled = false;
    });

    // 7. Focus on ID
    document.getElementById('reg-role-id').focus();
}

function cancelRegistration() {
    // Simply reload the page or reset UI to empty state
    // For this prototype, we'll reset to empty state

    // 1. Show Empty State
    document.getElementById('empty-state').classList.remove('hidden');
    document.getElementById('detail-content').classList.add('hidden');

    // 2. Restore Headers
    const detailTitleGroup = document.getElementById('detail-content').querySelector('.search-panel-title-group');
    if (detailTitleGroup) detailTitleGroup.classList.remove('hidden');
    document.getElementById('reg-header-group').classList.add('hidden');

    // Hide Bulk Select
    document.getElementById('bulk-select-controls').classList.add('hidden');

    // 3. Hide Inputs
    document.getElementById('registration-form').classList.add('hidden');

    // 4. Reset Buttons logic is handled when a row is clicked, 
    // but we ensure view buttons are defaults if we ever show detail again
    document.getElementById('view-mode-buttons').classList.remove('hidden');
    document.getElementById('reg-mode-buttons').classList.add('hidden');
}

function saveRegistration() {
    const idInput = document.getElementById('reg-role-id');
    const nameInput = document.getElementById('reg-role-name');
    const idError = document.getElementById('error-reg-role-id');
    const nameError = document.getElementById('error-reg-role-name');

    let isValid = true;

    // Validate ID
    if (!idInput.value.trim()) {
        idError.textContent = '권한 아이디를 입력해 주세요.';
        idError.classList.remove('hidden');
        idInput.classList.add('error');
        isValid = false;
    } else {
        idError.classList.add('hidden');
        idInput.classList.remove('error');
    }

    // Validate Name
    if (!nameInput.value.trim()) {
        nameError.textContent = '권한 이름을 입력해 주세요.';
        nameError.classList.remove('hidden');
        nameInput.classList.add('error');
        isValid = false;
    } else {
        nameError.classList.add('hidden');
        nameInput.classList.remove('error');
    }

    if (!isValid) return;

    // Show Confirm Modal
    const modal = document.getElementById('confirm-modal');
    modal.classList.add('active');
    if (window.lucide) lucide.createIcons();
}

function processRegistration() {
    // Close Confirm Modal
    closeConfirmModal();

    // Show Success Modal after short delay
    setTimeout(() => {
        const modal = document.getElementById('success-modal');
        modal.classList.add('active');
        if (window.lucide) lucide.createIcons();
    }, 200);
}

function closeConfirmModal() {
    document.getElementById('confirm-modal').classList.remove('active');
}

function closeSuccessModal() {
    document.getElementById('success-modal').classList.remove('active');
    // Reset UI after success
    cancelRegistration();
}

// Bulk Select Function
function toggleAllPermissions(type) {
    const isChecked = document.getElementById(`select-all-${type}`).checked;
    const checkboxes = document.querySelectorAll(`input[data-permission="${type}"]`);

    checkboxes.forEach(cb => {
        if (!cb.disabled) {
            cb.checked = isChecked;
        }
    });
}

/**
 * Update the state of the "Select All" checkbox based on individual checkboxes
 * If all enabled checkboxes of the type are checked, check the "Select All" box
 */
function updateBulkSelectState(type) {
    const selectAllCb = document.getElementById(`select-all-${type}`);
    const checkboxes = Array.from(document.querySelectorAll(`input[data-permission="${type}"]`));

    // Filter only enabled checkboxes (or all if we want strict logical "all")
    // Usually "Select All" applies to what is available to be selected.
    // In this context, all are effectively available in edit mode.
    const enabledCheckboxes = checkboxes.filter(cb => !cb.disabled);

    if (enabledCheckboxes.length === 0) {
        selectAllCb.checked = false;
        return;
    }

    const allChecked = enabledCheckboxes.every(cb => cb.checked);
    selectAllCb.checked = allChecked;

    // Optional: If some are checked, could use indeterminate state
    // selectAllCb.indeterminate = !allChecked && enabledCheckboxes.some(cb => cb.checked);
}
