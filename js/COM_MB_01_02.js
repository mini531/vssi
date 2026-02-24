document.addEventListener('DOMContentLoaded', () => {
    // === Elements ===
    const btnUpdateComplete = document.getElementById('btn-update-complete');
    const confirmModal = document.getElementById('confirm-modal');
    const successModal = document.getElementById('success-modal');

    const nameInput = document.getElementById('edit-member-name');
    const affiliationInput = document.getElementById('edit-member-affiliation');
    const emailInput = document.getElementById('edit-member-email');
    const phoneInput = document.getElementById('edit-member-phone');

    // === Event Listeners ===
    if (btnUpdateComplete) {
        btnUpdateComplete.addEventListener('click', () => {
            processEdit();
        });
    }

    // === Functions ===

    window.closeConfirmModal = function () {
        confirmModal.classList.remove('active');
    };

    window.closeSuccessModal = function () {
        successModal.classList.remove('active');
        location.href = 'COM_MB_01_01.html';
    };

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

    window.processEdit = function () {
        let hasError = false;

        const nameVal = nameInput.value.trim();
        const affVal = affiliationInput.value.trim();
        const emailVal = emailInput.value.trim();
        const phoneVal = phoneInput.value.trim();

        // 1. Mandatory Check
        if (!nameVal) {
            setError('edit-member-name', '이름을 입력해 주세요.');
            hasError = true;
        }

        if (!affVal) {
            setError('edit-member-affiliation', '소속을 입력해 주세요.');
            hasError = true;
        }

        if (!emailVal) {
            setError('edit-member-email', '이메일을 입력해 주세요.');
            hasError = true;
        } else {
            // 2. Email format check
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailVal)) {
                setError('edit-member-email', '올바른 이메일 형식으로 입력해 주세요.');
                hasError = true;
            }
        }

        if (!phoneVal) {
            setError('edit-member-phone', '휴대폰 번호를 입력해 주세요.');
            hasError = true;
        } else {
            // 3. Phone format check (Mock: 000-0000-0000 style)
            const phoneRegex = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
            if (!phoneRegex.test(phoneVal)) {
                setError('edit-member-phone', '올바른 휴대폰 번호 형식으로 입력해 주세요.');
                hasError = true;
            }
        }

        if (!hasError) {
            confirmModal.classList.add('active');
        }
    };

    window.executeEdit = function () {
        confirmModal.classList.remove('active');
        successModal.classList.add('active');
    };
});
