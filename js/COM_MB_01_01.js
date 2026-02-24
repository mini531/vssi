document.addEventListener('DOMContentLoaded', () => {
    // === Elements ===
    const btnPwChange = document.getElementById('btn-pw-change');
    const pwChangeModal = document.getElementById('pw-change-modal');
    const confirmModal = document.getElementById('confirm-modal');
    const successModal = document.getElementById('success-modal');

    const currentPwInput = document.getElementById('current-pw');
    const newPwInput = document.getElementById('new-pw');
    const confirmPwInput = document.getElementById('confirm-pw');

    // === Event Listeners ===
    if (btnPwChange) {
        btnPwChange.addEventListener('click', () => {
            openPwModal();
        });
    }

    // === Functions ===

    window.openPwModal = function () {
        // Clear previous state
        clearInputs();
        pwChangeModal.classList.add('active');
    };

    window.closePwModal = function () {
        pwChangeModal.classList.remove('active');
    };

    window.closeConfirmModal = function () {
        confirmModal.classList.remove('active');
    };

    window.closeSuccessModal = function () {
        successModal.classList.remove('active');
        closePwModal();
    };

    function clearInputs() {
        [currentPwInput, newPwInput, confirmPwInput].forEach(input => {
            if (input) {
                input.value = '';
                input.classList.remove('error');
            }
        });
        document.querySelectorAll('.form-error').forEach(el => el.innerText = '');
    }

    window.resetError = function (id) {
        const input = document.getElementById(id);
        if (input) input.classList.remove('error');
        const errorEl = document.getElementById('error-' + id);
        if (errorEl) errorEl.innerText = '';
    };

    function setError(id, message) {
        const input = document.getElementById(id);
        if (input) input.classList.add('error');
        const errorEl = document.getElementById('error-' + id);
        if (errorEl) errorEl.innerText = message;
    }

    window.processPwChange = function () {
        let hasError = false;

        const currentVal = currentPwInput.value.trim();
        const newVal = newPwInput.value.trim();
        const confirmVal = confirmPwInput.value.trim();

        // 1. Mandatory Check
        if (!currentVal) {
            setError('current-pw', '현재 비밀번호를 입력해 주세요.');
            hasError = true;
        }

        if (!newVal) {
            setError('new-pw', '새 비밀번호를 입력해 주세요.');
            hasError = true;
        } else {
            // 2. Format check (Regex from SAM_US_01_01.js)
            const pwRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!pwRegex.test(newVal)) {
                setError('new-pw', '영문 대소문자, 숫자, 특수문자를 혼용하여 8자 이상 입력해 주세요');
                hasError = true;
            }
        }

        if (!confirmVal) {
            setError('confirm-pw', '새 비밀번호를 한 번 더 입력해 주세요.');
            hasError = true;
        } else if (newVal !== confirmVal) {
            // 3. Match check
            setError('confirm-pw', '비밀번호를 확인해 주세요.');
            hasError = true;
        }

        // Mock current password check (extra requirement from message table)
        // If not empty but "wrong", show: "현재 비밀번호를 확인해 주세요."
        // For mock purpose, let's assume 'wrong_pw' is a special value to trigger it if needed, 
        // but usually just empty check is enough for basic UI dev.
        // However, the message table has "현재 비밀번호 오입력" condition.
        // I will just implement the validation for now.

        if (!hasError) {
            confirmModal.classList.add('active');
        }
    };

    window.executePwChange = function () {
        confirmModal.classList.remove('active');
        successModal.classList.add('active');
    };
});
