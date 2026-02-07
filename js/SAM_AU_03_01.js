document.addEventListener('DOMContentLoaded', function () {
    // Mock data for security settings
    const defaultSettings = {
        sessionTimeout: 30,
        passwordExpiry: 90,
        loginFailureLimit: 5,
        allowDuplicateLogin: true,
        allowMultipleLogin: false
    };

    let currentSettings = { ...defaultSettings };

    // Initialize form with default values
    function loadSettings() {
        document.getElementById('session-timeout').value = currentSettings.sessionTimeout;
        document.getElementById('password-expiry').value = currentSettings.passwordExpiry;
        document.getElementById('login-failure-limit').value = currentSettings.loginFailureLimit;
        document.getElementById('allow-duplicate-login').checked = currentSettings.allowDuplicateLogin;
        document.getElementById('allow-multiple-login').checked = currentSettings.allowMultipleLogin;
    }

    // Enter Edit Mode
    window.enterEditMode = function () {
        // Enable inputs
        document.getElementById('session-timeout').disabled = false;
        document.getElementById('password-expiry').disabled = false;
        document.getElementById('login-failure-limit').disabled = false;
        document.getElementById('allow-duplicate-login').disabled = false;
        document.getElementById('allow-multiple-login').disabled = false;

        // Show guide texts
        document.querySelectorAll('.input-guide-text').forEach(el => el.classList.remove('hidden'));

        // Toggle buttons
        document.getElementById('view-mode-buttons').classList.add('hidden');
        document.getElementById('edit-mode-buttons').classList.remove('hidden');
    };

    // Cancel Edit
    window.cancelEdit = function () {
        // Restore original values
        loadSettings();

        // Clear errors
        document.getElementById('error-session-timeout').textContent = '';
        document.getElementById('error-password-expiry').textContent = '';
        document.getElementById('error-login-failure-limit').textContent = '';

        // Disable inputs
        document.getElementById('session-timeout').disabled = true;
        document.getElementById('password-expiry').disabled = true;
        document.getElementById('login-failure-limit').disabled = true;
        document.getElementById('allow-duplicate-login').disabled = true;
        document.getElementById('allow-multiple-login').disabled = true;

        // Hide guide texts
        document.querySelectorAll('.input-guide-text').forEach(el => el.classList.add('hidden'));

        // Toggle buttons
        document.getElementById('edit-mode-buttons').classList.add('hidden');
        document.getElementById('view-mode-buttons').classList.remove('hidden');
    };

    // Save Changes (Validation and Show Confirm)
    window.saveChanges = function () {
        // Get values
        const sessionTimeout = parseInt(document.getElementById('session-timeout').value);
        const passwordExpiry = parseInt(document.getElementById('password-expiry').value);
        const loginFailureLimit = parseInt(document.getElementById('login-failure-limit').value);

        // Clear previous errors
        document.getElementById('error-session-timeout').textContent = '';
        document.getElementById('error-password-expiry').textContent = '';
        document.getElementById('error-login-failure-limit').textContent = '';

        let hasError = false;

        // Validation
        if (!sessionTimeout || sessionTimeout < 1 || sessionTimeout > 1440) {
            document.getElementById('error-session-timeout').textContent = '세션 타임아웃 시간은 1-1440분 사이로 설정해주세요.';
            hasError = true;
        }

        if (isNaN(passwordExpiry) || passwordExpiry < 0 || passwordExpiry > 365) {
            document.getElementById('error-password-expiry').textContent = '비밀번호 만료 기간은 0-365일 사이로 설정해주세요.';
            hasError = true;
        }

        if (!loginFailureLimit || loginFailureLimit < 3 || loginFailureLimit > 10) {
            document.getElementById('error-login-failure-limit').textContent = '로그인 실패 허용 횟수는 3-10회 사이로 설정해주세요.';
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
        const sessionTimeout = parseInt(document.getElementById('session-timeout').value);
        const passwordExpiry = parseInt(document.getElementById('password-expiry').value);
        const loginFailureLimit = parseInt(document.getElementById('login-failure-limit').value);
        const allowDuplicateLogin = document.getElementById('allow-duplicate-login').checked;
        const allowMultipleLogin = document.getElementById('allow-multiple-login').checked;

        // Update current settings
        currentSettings = {
            sessionTimeout,
            passwordExpiry,
            loginFailureLimit,
            allowDuplicateLogin,
            allowMultipleLogin
        };

        // Disable inputs
        document.getElementById('session-timeout').disabled = true;
        document.getElementById('password-expiry').disabled = true;
        document.getElementById('login-failure-limit').disabled = true;
        document.getElementById('allow-duplicate-login').disabled = true;
        document.getElementById('allow-multiple-login').disabled = true;

        // Hide guide texts
        document.querySelectorAll('.input-guide-text').forEach(el => el.classList.add('hidden'));

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

    // Load initial settings
    loadSettings();
});
