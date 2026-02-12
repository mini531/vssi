/**
 * Backup Settings Page Logic (SAM_SY_03_01)
 */

document.addEventListener('DOMContentLoaded', function () {
    // Mock data for backup settings
    const defaultSettings = {
        backupCycle: 'daily',
        backupTime: '02:00',
        retentionPeriod: 30,
        backupFormat: 'full',
        compressionEnabled: true,
        encryptionEnabled: false,
        encryptionPassword: '',
        backupDays: ['mon', 'wed', 'fri'], // For weekly backups
        backupDayMonthly: '1', // For monthly backups
        backupPath: '/var/backups/sams',
        autoBackupEnabled: true
    };

    let currentSettings = { ...defaultSettings };



    // Initialize form with default values
    function loadSettings() {
        document.getElementById('backup-cycle').value = currentSettings.backupCycle;
        // Set Backup Time values
        document.getElementById('backup-time').value = currentSettings.backupTime;

        document.getElementById('retention-period').value = currentSettings.retentionPeriod;
        document.getElementById('backup-format').value = currentSettings.backupFormat;
        document.getElementById('compression-enabled').checked = currentSettings.compressionEnabled;
        document.getElementById('encryption-enabled').checked = currentSettings.encryptionEnabled;
        document.getElementById('encryption-password').value = currentSettings.encryptionPassword;
        document.getElementById('backup-day-monthly').value = currentSettings.backupDayMonthly;
        document.getElementById('backup-path').value = currentSettings.backupPath;
        document.getElementById('auto-backup-enabled').checked = currentSettings.autoBackupEnabled;

        // Load weekly days
        document.querySelectorAll('.backup-day').forEach(checkbox => {
            const day = checkbox.id.replace('day-', '');
            checkbox.checked = currentSettings.backupDays.includes(day);
        });
        updateSelectedDaysText();

        // Show/hide cycle specific inputs
        toggleCycleSpecificInputs();

        // Show/hide encryption input
        toggleEncryptionInput();
    }

    // Toggle encryption password input visibility
    window.toggleEncryptionInput = function () {
        const enabled = document.getElementById('encryption-enabled').checked;
        const passwordInput = document.getElementById('encryption-password');

        if (enabled && !document.getElementById('encryption-enabled').disabled) {
            passwordInput.classList.remove('hidden');
        } else {
            passwordInput.classList.add('hidden');
        }
    };

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
        ['backup-cycle', 'backup-time', 'retention-period', 'backup-days', 'backup-path', 'encryption-password', 'backup-day-monthly'].forEach(fieldId => {
            resetError(fieldId);
        });
    }

    // Enter Edit Mode
    window.enterEditMode = function () {
        // Enable inputs
        document.getElementById('backup-cycle').disabled = false;
        document.getElementById('backup-time').disabled = false;
        document.getElementById('retention-period').disabled = false;
        document.getElementById('backup-format').disabled = false;
        document.getElementById('compression-enabled').disabled = false;
        document.getElementById('encryption-enabled').disabled = false;
        document.getElementById('encryption-password').disabled = false;
        document.getElementById('backup-day-monthly').disabled = false;
        document.getElementById('backup-path').disabled = false;
        document.getElementById('auto-backup-enabled').disabled = false;

        // Refresh encryption input state
        toggleEncryptionInput();

        // Enable weekly day dropdown
        document.getElementById('weekly-days-view').classList.add('hidden');
        document.getElementById('weekly-days-edit-wrapper').classList.remove('hidden');
        document.getElementById('weekly-days-trigger').classList.remove('disabled');
        document.querySelectorAll('.backup-day').forEach(cb => cb.disabled = false);

        // Show guide texts
        document.querySelectorAll('.input-guide-text').forEach(el => el.classList.remove('hidden'));
        // Show required marks
        document.querySelectorAll('.required-mark').forEach(el => el.classList.remove('hidden'));

        // Toggle buttons
        document.getElementById('view-mode-buttons').classList.add('hidden');
        document.getElementById('edit-mode-buttons').classList.remove('hidden');
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
        document.getElementById('backup-format').disabled = true;
        document.getElementById('compression-enabled').disabled = true;
        document.getElementById('encryption-enabled').disabled = true;
        document.getElementById('encryption-password').disabled = true;
        document.getElementById('backup-day-monthly').disabled = true;
        document.getElementById('backup-path').disabled = true;
        document.getElementById('auto-backup-enabled').disabled = true;

        // Refresh encryption input state
        toggleEncryptionInput();

        // Disable weekly backup days
        document.getElementById('weekly-days-view').classList.remove('hidden');
        document.getElementById('weekly-days-edit-wrapper').classList.add('hidden');
        document.getElementById('weekly-days-trigger').classList.add('disabled');
        document.getElementById('weekly-days-dropdown').classList.remove('active');
        document.querySelectorAll('.backup-day').forEach(cb => cb.disabled = true);
        updateSelectedDaysText();

        // Hide guide texts
        document.querySelectorAll('.input-guide-text').forEach(el => el.classList.add('hidden'));
        // Hide required marks
        document.querySelectorAll('.required-mark').forEach(el => el.classList.add('hidden'));

        // Toggle buttons
        document.getElementById('edit-mode-buttons').classList.add('hidden');
        document.getElementById('view-mode-buttons').classList.remove('hidden');
    };

    // Save Changes (Validation and Show Confirm)
    window.saveChanges = function () {
        // Get values
        const backupCycle = document.getElementById('backup-cycle').value;
        const backupTime = document.getElementById('backup-time').value;
        const retentionPeriod = parseInt(document.getElementById('retention-period').value);
        const backupPath = document.getElementById('backup-path').value.trim();

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

        // Validation: Backup path
        if (!backupPath) {
            setError('backup-path', '백업 경로를 입력해 주세요.');
            hasError = true;
        }

        // Validation: Encryption Password
        if (document.getElementById('encryption-enabled').checked) {
            const password = document.getElementById('encryption-password').value;
            if (!password) {
                setError('encryption-password', '암호화 키를 입력해 주세요.');
                hasError = true;
            }
        }

        // Validation: Weekly days (only if cycle is weekly)
        if (backupCycle === 'weekly') {
            const selectedDays = Array.from(document.querySelectorAll('.backup-day:checked'));
            if (selectedDays.length === 0) {
                setError('backup-days', '최소 1개 이상의 요일을 선택해 주세요.');
                hasError = true;
            }
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
        const backupFormat = document.getElementById('backup-format').value;
        const compressionEnabled = document.getElementById('compression-enabled').checked;
        const encryptionEnabled = document.getElementById('encryption-enabled').checked;
        const encryptionPassword = document.getElementById('encryption-password').value;
        const backupDayMonthly = document.getElementById('backup-day-monthly').value;
        const backupPath = document.getElementById('backup-path').value.trim();
        const autoBackupEnabled = document.getElementById('auto-backup-enabled').checked;

        // Get selected days for weekly backup
        const backupDays = Array.from(document.querySelectorAll('.backup-day:checked'))
            .map(cb => cb.id.replace('day-', ''));

        // Update current settings
        currentSettings = {
            backupCycle,
            backupTime,
            retentionPeriod,
            backupFormat,
            compressionEnabled,
            encryptionEnabled,
            encryptionPassword,
            backupDays,
            backupDayMonthly,
            backupPath,
            autoBackupEnabled
        };

        // Disable inputs
        document.getElementById('backup-cycle').disabled = true;
        document.getElementById('backup-time').disabled = true;
        document.getElementById('retention-period').disabled = true;
        document.getElementById('backup-format').disabled = true;
        document.getElementById('compression-enabled').disabled = true;
        document.getElementById('encryption-enabled').disabled = true;
        document.getElementById('encryption-password').disabled = true;
        document.getElementById('backup-day-monthly').disabled = true;
        document.getElementById('backup-path').disabled = true;
        document.getElementById('auto-backup-enabled').disabled = true;

        // Disable weekly backup days
        document.getElementById('weekly-days-view').classList.remove('hidden');
        document.getElementById('weekly-days-edit-wrapper').classList.add('hidden');
        document.getElementById('weekly-days-trigger').classList.add('disabled');
        document.getElementById('weekly-days-dropdown').classList.remove('active');
        document.querySelectorAll('.backup-day').forEach(cb => cb.disabled = true);

        // Hide guide texts
        document.querySelectorAll('.input-guide-text').forEach(el => el.classList.add('hidden'));
        // Hide required marks
        document.querySelectorAll('.required-mark').forEach(el => el.classList.add('hidden'));

        // Toggle buttons
        document.getElementById('edit-mode-buttons').classList.add('hidden');
        document.getElementById('view-mode-buttons').classList.remove('hidden');

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
        const textSpan = document.getElementById('selected-days-text');
        const viewInput = document.getElementById('weekly-days-view');

        let text = '';
        if (checked.length === 0) {
            text = '요일 선택';
            textSpan.classList.add('text-gray-400');
        } else {
            const labels = Array.from(checked).map(cb => {
                return cb.nextElementSibling.textContent.replace('요일', ''); // Shorten for summary
            });
            text = labels.join(', ');
            textSpan.classList.remove('text-gray-400');
        }

        textSpan.textContent = text;
        if (viewInput) viewInput.value = text;
    };

    // Close dropdown when clicking outside
    document.addEventListener('click', function (e) {
        const container = document.querySelector('.multi-select-container');
        if (container && !container.contains(e.target)) {
            const dropdown = document.getElementById('weekly-days-dropdown');
            if (dropdown) dropdown.classList.remove('active');
        }
    });

    // Load initial settings
    // populateBackupTimeSelect();
    loadSettings();
    lucide.createIcons();
});
