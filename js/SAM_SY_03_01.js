/**
 * Backup Settings Page Logic (SAM_SY_03_01)
 */

document.addEventListener('DOMContentLoaded', function () {
    // Mock data for backup settings
    const defaultSettings = {
        backupCycle: 'daily',
        backupTime: '02:00',
        retentionPeriod: 30,
        encryptionEnabled: false,
        backupDays: ['mon', 'wed', 'fri'], // For weekly backups
        backupDayMonthly: '1', // For monthly backups
        backupTargets: ['ivs', 'vos'], // New: node selection
        autoBackupEnabled: true
    };

    let currentSettings = { ...defaultSettings };



    // Initialize form with default values
    function loadSettings() {
        document.getElementById('backup-cycle').value = currentSettings.backupCycle;
        document.getElementById('backup-time').value = currentSettings.backupTime;
        document.getElementById('retention-period').value = currentSettings.retentionPeriod;
        document.getElementById('encryption-enabled').checked = currentSettings.encryptionEnabled;
        document.getElementById('backup-day-monthly').value = currentSettings.backupDayMonthly;
        document.getElementById('auto-backup-enabled').checked = currentSettings.autoBackupEnabled;

        // Load weekly days
        document.querySelectorAll('.backup-day').forEach(checkbox => {
            const day = checkbox.id.replace('day-', '');
            checkbox.checked = currentSettings.backupDays.includes(day);
        });
        updateSelectedDaysText();

        // Load backup targets
        document.querySelectorAll('.backup-target').forEach(checkbox => {
            const node = checkbox.id.replace('target-', '');
            checkbox.checked = currentSettings.backupTargets.includes(node);
        });
        updateSelectedTargetsText();

        // Show/hide cycle specific inputs
        toggleCycleSpecificInputs();


    }



    // Toggle inputs based on backup cycle
    function toggleCycleSpecificInputs() {
        const cycle = document.getElementById('backup-cycle').value;
        const weeklyContainer = document.getElementById('weekly-days-container');
        const monthlyContainer = document.getElementById('monthly-day-container');

        // Reset
        weeklyContainer.classList.add('hidden');
        monthlyContainer.classList.add('hidden');

        if (cycle === 'weekly') {
            weeklyContainer.classList.remove('hidden');
        } else if (cycle === 'monthly') {
            monthlyContainer.classList.remove('hidden');
        }
    }

    // Listen to cycle changes
    document.getElementById('backup-cycle').addEventListener('change', toggleCycleSpecificInputs);

    // Reset error for a specific field
    window.resetError = function (fieldId) {
        const field = document.getElementById(fieldId);
        if (field) field.classList.remove('error');
        const errDiv = document.getElementById('error-' + fieldId);
        if (errDiv) errDiv.textContent = '';
    };

    // Set error for a specific field
    function setError(fieldId, message) {
        const field = document.getElementById(fieldId);
        if (field) field.classList.add('error');
        const errDiv = document.getElementById('error-' + fieldId);
        if (errDiv) errDiv.textContent = message;
    }

    // Clear all errors
    function clearAllErrors() {
        ['backup-cycle', 'backup-time', 'retention-period', 'backup-days', 'backup-targets', 'backup-day-monthly'].forEach(fieldId => {
            resetError(fieldId);
        });
    }

    // Enter Edit Mode
    window.enterEditMode = function () {
        // Enable inputs
        document.getElementById('backup-cycle').disabled = false;
        document.getElementById('backup-time').disabled = false;
        document.getElementById('retention-period').disabled = false;
        document.getElementById('encryption-enabled').disabled = false;

        document.getElementById('backup-day-monthly').disabled = false;
        document.getElementById('auto-backup-enabled').disabled = false;



        // Enable weekly day dropdown
        document.getElementById('weekly-days-view').classList.add('hidden');
        document.getElementById('weekly-days-edit-wrapper').classList.remove('hidden');
        document.getElementById('weekly-days-trigger').classList.remove('disabled');
        document.querySelectorAll('.backup-day').forEach(cb => cb.disabled = false);
        document.getElementById('day-all').disabled = false;

        // Enable backup target dropdown
        document.getElementById('backup-targets-view').classList.add('hidden');
        document.getElementById('backup-targets-edit-wrapper').classList.remove('hidden');
        document.getElementById('backup-targets-trigger').classList.remove('disabled');
        document.querySelectorAll('.backup-target').forEach(cb => cb.disabled = false);
        document.getElementById('target-all').disabled = false;

        // Show guide texts
        document.querySelectorAll('.input-guide-text').forEach(el => el.classList.remove('hidden'));
        // Show required marks
        document.querySelectorAll('.required-mark').forEach(el => el.classList.remove('hidden'));

        // Toggle buttons
        document.getElementById('view-mode-buttons').classList.add('hidden');
        document.getElementById('edit-mode-buttons').classList.remove('hidden');

        // Update Title
        document.getElementById('card-title').innerText = '백업 설정 수정';

        lucide.createIcons();
    };

    // Cancel Edit
    window.cancelEdit = function () {
        // Restore original values
        loadSettings();

        // Clear errors
        clearAllErrors();

        // Disable inputs
        document.getElementById('backup-cycle').disabled = true;
        document.getElementById('backup-time').disabled = true;
        document.getElementById('retention-period').disabled = true;
        document.getElementById('encryption-enabled').disabled = true;

        document.getElementById('backup-day-monthly').disabled = true;
        document.getElementById('auto-backup-enabled').disabled = true;



        // Disable weekly backup days
        document.getElementById('weekly-days-view').classList.remove('hidden');
        document.getElementById('weekly-days-edit-wrapper').classList.add('hidden');
        document.getElementById('weekly-days-trigger').classList.add('disabled');
        document.getElementById('weekly-days-dropdown').classList.remove('active');
        document.getElementById('weekly-days-trigger').classList.remove('active');
        document.querySelectorAll('.backup-day').forEach(cb => cb.disabled = true);
        document.getElementById('day-all').disabled = true;
        updateSelectedDaysText();

        // Disable backup targets
        document.getElementById('backup-targets-view').classList.remove('hidden');
        document.getElementById('backup-targets-edit-wrapper').classList.add('hidden');
        document.getElementById('backup-targets-trigger').classList.add('disabled');
        document.getElementById('backup-targets-dropdown').classList.remove('active');
        document.getElementById('backup-targets-trigger').classList.remove('active');
        document.querySelectorAll('.backup-target').forEach(cb => cb.disabled = true);
        document.getElementById('target-all').disabled = true;
        updateSelectedTargetsText();

        // Hide guide texts
        document.querySelectorAll('.input-guide-text').forEach(el => el.classList.add('hidden'));
        // Hide required marks
        document.querySelectorAll('.required-mark').forEach(el => el.classList.add('hidden'));

        // Toggle buttons
        document.getElementById('edit-mode-buttons').classList.add('hidden');
        document.getElementById('view-mode-buttons').classList.remove('hidden');

        // Update Title
        document.getElementById('card-title').innerText = '백업 설정 정보';
    };

    // Save Changes (Validation and Show Confirm)
    window.saveChanges = function () {
        // Get values
        const backupCycle = document.getElementById('backup-cycle').value;
        const backupTime = document.getElementById('backup-time').value;
        const retentionPeriod = parseInt(document.getElementById('retention-period').value);

        // Clear previous errors
        clearAllErrors();

        let hasError = false;

        // Validation: Backup time
        if (!backupTime) {
            setError('backup-time', '백업 시간을 입력해 주세요.');
            hasError = true;
        }

        // Validation: Retention period
        if (!retentionPeriod || retentionPeriod < 1 || retentionPeriod > 365) {
            setError('retention-period', '보관 기간은 1-365일 사이로 설정해 주세요.');
            hasError = true;
        }



        // Validation: Weekly days (only if cycle is weekly)
        if (backupCycle === 'weekly') {
            const selectedDays = Array.from(document.querySelectorAll('.backup-day:checked'));
            if (selectedDays.length === 0) {
                setError('backup-days', '최소 1개 이상의 요일을 선택해 주세요.');
                hasError = true;
            }
        }

        // Validation: Backup targets
        const selectedTargets = Array.from(document.querySelectorAll('.backup-target:checked'));
        if (selectedTargets.length === 0) {
            setError('backup-targets', '최소 1개 이상의 백업 대상을 선택해 주세요.');
            hasError = true;
        }

        if (hasError) return;

        // Show confirm modal
        document.getElementById('confirm-modal').classList.add('active');
        lucide.createIcons();
    };

    // Process Save (Actual Save Logic)
    window.processSave = function () {
        // Get values
        const backupCycle = document.getElementById('backup-cycle').value;
        const backupTime = document.getElementById('backup-time').value;
        const retentionPeriod = parseInt(document.getElementById('retention-period').value);
        const encryptionEnabled = document.getElementById('encryption-enabled').checked;
        const backupDayMonthly = document.getElementById('backup-day-monthly').value;
        const autoBackupEnabled = document.getElementById('auto-backup-enabled').checked;

        // Get selected days for weekly backup
        const backupDays = Array.from(document.querySelectorAll('.backup-day:checked'))
            .map(cb => cb.id.replace('day-', ''));

        // Get selected targets
        const backupTargets = Array.from(document.querySelectorAll('.backup-target:checked'))
            .map(cb => cb.id.replace('target-', ''));

        // Update current settings
        currentSettings = {
            backupCycle,
            backupTime,
            retentionPeriod,
            encryptionEnabled,
            backupDays,
            backupDayMonthly,
            backupTargets,
            autoBackupEnabled
        };

        // Disable inputs
        document.getElementById('backup-cycle').disabled = true;
        document.getElementById('backup-time').disabled = true;
        document.getElementById('retention-period').disabled = true;
        document.getElementById('encryption-enabled').disabled = true;
        document.getElementById('backup-day-monthly').disabled = true;
        document.getElementById('auto-backup-enabled').disabled = true;

        // Disable weekly backup days
        document.getElementById('weekly-days-view').classList.remove('hidden');
        document.getElementById('weekly-days-edit-wrapper').classList.add('hidden');
        document.getElementById('weekly-days-trigger').classList.add('disabled');
        document.getElementById('weekly-days-dropdown').classList.remove('active');
        document.getElementById('weekly-days-trigger').classList.remove('active');
        document.querySelectorAll('.backup-day').forEach(cb => cb.disabled = true);
        document.getElementById('day-all').disabled = true;

        // Disable backup targets
        document.getElementById('backup-targets-view').classList.remove('hidden');
        document.getElementById('backup-targets-edit-wrapper').classList.add('hidden');
        document.getElementById('backup-targets-trigger').classList.add('disabled');
        document.getElementById('backup-targets-dropdown').classList.remove('active');
        document.getElementById('backup-targets-trigger').classList.remove('active');
        document.querySelectorAll('.backup-target').forEach(cb => cb.disabled = true);
        document.getElementById('target-all').disabled = true;

        // Hide guide texts
        document.querySelectorAll('.input-guide-text').forEach(el => el.classList.add('hidden'));
        // Hide required marks
        document.querySelectorAll('.required-mark').forEach(el => el.classList.add('hidden'));

        // Toggle buttons
        document.getElementById('edit-mode-buttons').classList.add('hidden');
        document.getElementById('view-mode-buttons').classList.remove('hidden');

        // Update Title
        document.getElementById('card-title').innerText = '백업 설정 정보';



        // Close confirm modal
        document.getElementById('confirm-modal').classList.remove('active');

        // Show success modal
        setTimeout(() => {
            document.getElementById('success-modal').classList.add('active');
            lucide.createIcons();
        }, 200);
    };

    // Close Confirm Modal
    window.closeConfirmModal = function () {
        document.getElementById('confirm-modal').classList.remove('active');
    };

    // Close Success Modal
    window.closeSuccessModal = function () {
        document.getElementById('success-modal').classList.remove('active');
    };

    // Close Success Modal
    window.closeSuccessModal = function () {
        document.getElementById('success-modal').classList.remove('active');
    };

    // --- Weekly Backup Dropdown Logic ---

    // Toggle Dropdown
    window.toggleWeeklyDropdown = function () {
        const trigger = document.getElementById('weekly-days-trigger');
        if (trigger.classList.contains('disabled')) return;
        document.getElementById('weekly-days-dropdown').classList.toggle('active');
        trigger.classList.toggle('active');
    };

    // Toggle All Days
    window.toggleAllDaysSelection = function (event) {
        const allCheckbox = document.getElementById('day-all');
        const dayCheckboxes = document.querySelectorAll('.backup-day');

        if (allCheckbox.disabled) return;

        if (event.target.tagName !== 'INPUT' && event.target.tagName !== 'LABEL') {
            allCheckbox.checked = !allCheckbox.checked;
        }

        const isChecked = allCheckbox.checked;
        dayCheckboxes.forEach(cb => {
            cb.checked = isChecked;
        });
        updateSelectedDaysText();
    };

    // Toggle Checkbox via Row Click
    window.toggleDaySelection = function (event, id) {
        // If clicking input or label directly, let default behavior happen
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'LABEL') return;

        const checkbox = document.getElementById(id);
        if (!checkbox.disabled) {
            checkbox.checked = !checkbox.checked;
            updateSelectedDaysText();
        }
    };

    // Update Summary Text
    window.updateSelectedDaysText = function () {
        const checked = document.querySelectorAll('.backup-day:checked');
        const allCheckboxes = document.querySelectorAll('.backup-day');
        const allCheckbox = document.getElementById('day-all');
        const textSpan = document.getElementById('selected-days-text');
        const viewInput = document.getElementById('weekly-days-view');

        // Update "Select All" checkbox state
        if (allCheckbox) {
            allCheckbox.checked = checked.length === allCheckboxes.length && allCheckboxes.length > 0;
        }

        let text = '';
        if (checked.length === 0) {
            text = '요일 선택';
            textSpan.classList.add('placeholder');
        } else if (checked.length === allCheckboxes.length) {
            text = '매일';
            textSpan.classList.remove('placeholder');
        } else {
            const labels = Array.from(checked).map(cb => {
                return cb.nextElementSibling.textContent.replace('요일', ''); // Shorten for summary
            });
            text = labels.join(', ');
            textSpan.classList.remove('placeholder');
        }

        textSpan.textContent = text;
        if (viewInput) viewInput.value = text;
    };

    // --- Backup Target Dropdown Logic ---

    // Toggle Dropdown
    window.toggleTargetDropdown = function () {
        const trigger = document.getElementById('backup-targets-trigger');
        if (trigger.classList.contains('disabled')) return;
        document.getElementById('backup-targets-dropdown').classList.toggle('active');
        trigger.classList.toggle('active');
    };

    // Toggle All Targets
    window.toggleAllTargetsSelection = function (event) {
        const allCheckbox = document.getElementById('target-all');
        const targetCheckboxes = document.querySelectorAll('.backup-target');

        if (allCheckbox.disabled) return;

        if (event.target.tagName !== 'INPUT' && event.target.tagName !== 'LABEL') {
            allCheckbox.checked = !allCheckbox.checked;
        }

        const isChecked = allCheckbox.checked;
        targetCheckboxes.forEach(cb => {
            cb.checked = isChecked;
        });
        updateSelectedTargetsText();
    };

    // Toggle Checkbox via Row Click
    window.toggleTargetSelection = function (event, id) {
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'LABEL') return;

        const checkbox = document.getElementById(id);
        if (!checkbox.disabled) {
            checkbox.checked = !checkbox.checked;
            updateSelectedTargetsText();
        }
    };

    // Update Summary Text
    window.updateSelectedTargetsText = function () {
        const checked = document.querySelectorAll('.backup-target:checked');
        const allCheckboxes = document.querySelectorAll('.backup-target');
        const allCheckbox = document.getElementById('target-all');
        const textSpan = document.getElementById('selected-targets-text');
        const viewInput = document.getElementById('backup-targets-view');

        // Update "Select All" checkbox state
        if (allCheckbox) {
            allCheckbox.checked = checked.length === allCheckboxes.length && allCheckboxes.length > 0;
        }

        let text = '';
        if (checked.length === 0) {
            text = '노드 선택';
            textSpan.classList.add('placeholder');
        } else if (checked.length === allCheckboxes.length) {
            text = '전체';
            textSpan.classList.remove('placeholder');
        } else {
            const labels = Array.from(checked).map(cb => cb.nextElementSibling.textContent);
            text = labels.join(', ');
            textSpan.classList.remove('placeholder');
        }

        textSpan.textContent = text;
        if (viewInput) viewInput.value = text;
    };

    // Close dropdown when clicking outside
    document.addEventListener('click', function (e) {
        // Weekly days container
        const weeklyContainer = document.getElementById('weekly-days-edit-wrapper');
        if (weeklyContainer && !weeklyContainer.contains(e.target)) {
            const dropdown = document.getElementById('weekly-days-dropdown');
            if (dropdown) dropdown.classList.remove('active');
            const trigger = document.getElementById('weekly-days-trigger');
            if (trigger) trigger.classList.remove('active');
        }

        // Backup targets container
        const targetsContainer = document.getElementById('backup-targets-edit-wrapper');
        if (targetsContainer && !targetsContainer.contains(e.target)) {
            const dropdown = document.getElementById('backup-targets-dropdown');
            if (dropdown) dropdown.classList.remove('active');
            const trigger = document.getElementById('backup-targets-trigger');
            if (trigger) trigger.classList.remove('active');
        }
    });

    // Load initial settings
    // populateBackupTimeSelect();
    loadSettings();
    lucide.createIcons();
});
