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

            // Open Detail Pane (Mobile)
            openDetailPane();

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
            case 'role_total':
                // 통합 관리자: All permissions
                checkboxes.forEach(cb => cb.checked = true);
                break;

            case 'role_operator':
                // 통합 운용자: IVMS, IFPS, SAMS write access
                setPermissions('ivms', ['read', 'write']);
                setPermissions('ifps', ['read', 'write']);
                setPermissions('sams', ['read', 'write']);
                break;

            case 'role_vcdm':
                // VCDM 운용자: V-CDM write access only
                setPermissions('vcdm', ['read', 'write']);
                break;

            case 'role_airline':
                // 항공사: IFRS 운항사 전용 write access only
                setPermissions('ifrs-airline', ['read', 'write']);
                break;

            case 'role_vertiport':
                // 버티포트 운용자: IFRS 버티포트 전용 write access only
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

    // Show Registration Form Inputs (reused for Edit)
    document.getElementById('registration-form').classList.remove('hidden');

    // Show Bulk Select Controls
    document.getElementById('bulk-select-controls').classList.remove('hidden');

    // Clear any previous validation errors
    clearValidationErrors();

    // Populate Inputs
    const roleId = document.querySelector('.clickable-row.active').dataset.roleId;
    const roleName = document.querySelector('.clickable-row.active').cells[1].textContent;

    const idInput = document.getElementById('reg-role-id');
    const nameInput = document.getElementById('reg-role-name');

    idInput.value = roleId;
    nameInput.value = roleName;

    // Set Read-only/Disabled states
    idInput.disabled = true; // ID is not editable
    nameInput.disabled = false;
    nameInput.focus();

    // Hide required asterisk for ID in edit mode
    document.getElementById('reg-role-id-required').classList.add('hidden');

    // Enable all checkboxes
    const checkboxes = document.querySelectorAll('#detail-content input[type="checkbox"]');
    checkboxes.forEach(cb => cb.disabled = false);

    // Sync Bulk Select State based on initial values
    updateBulkSelectState('read');
    updateBulkSelectState('write');
    updateBulkSelectState('delete');
}

function saveChanges() {
    const nameInput = document.getElementById('reg-role-name');
    const nameError = document.getElementById('error-reg-role-name');

    // Validate Name
    if (!nameInput.value.trim()) {
        nameError.textContent = '권한 이름을 입력해 주세요.';
        nameError.classList.remove('hidden');
        nameInput.classList.add('error');
        nameInput.focus();
        return;
    } else {
        nameError.classList.add('hidden');
        nameInput.classList.remove('error');
    }

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

    // Hide Inputs
    document.getElementById('registration-form').classList.add('hidden');

    // Hide Bulk Select Controls
    document.getElementById('bulk-select-controls').classList.add('hidden');

    // Reset Input Styles (in case they were modified for edit mode)
    const idInput = document.getElementById('reg-role-id');
    idInput.disabled = false;

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
    const idInput = document.getElementById('reg-role-id');
    const nameInput = document.getElementById('reg-role-name');

    idInput.value = '';
    nameInput.value = '';

    // Clear any previous validation errors (critical for switching modes)
    clearValidationErrors();

    // Ensure inputs are enabled and standard style (resetting from potential Edit Mode)
    idInput.disabled = false;
    nameInput.disabled = false;

    // Show required asterisk for ID in registration mode
    document.getElementById('reg-role-id-required').classList.remove('hidden');

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

    // Close Detail Pane (Mobile) - return to list if cancelling from mobile reg
    closeDetailPane();

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

function clearValidationErrors() {
    const idInput = document.getElementById('reg-role-id');
    const nameInput = document.getElementById('reg-role-name');
    const idError = document.getElementById('error-reg-role-id');
    const nameError = document.getElementById('error-reg-role-name');

    // Remove error classes
    idInput.classList.remove('error');
    nameInput.classList.remove('error');

    // Hide error messages
    idError.classList.add('hidden');
    nameError.classList.add('hidden');
}

// Mobile Split Pane Functions
function openDetailPane() {
    document.querySelector('.split-container').classList.add('show-detail');
}

function closeDetailPane() {
    document.querySelector('.split-container').classList.remove('show-detail');
}

// Ensure globally available
window.closeDetailPane = closeDetailPane;
window.openDetailPane = openDetailPane;
