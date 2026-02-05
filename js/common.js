// Common interactions for VSSI Admin System

// Wait for includes to load before initializing dependent logic
document.addEventListener('includes-loaded', () => {
    // Initialize Icons
    if (window.lucide) lucide.createIcons();

    // Update Header Title (Page Subtitle)
    updateHeaderTitle();

    // Initialize System Title (Header Main Title)
    initSystemTitle();

    // Update Sidebar based on active system
    updateSidebarMenu();

    // Start Clock
    updateTime();
    setInterval(updateTime, 1000);

    // Highlight Active Sidebar Menu if needed
    // (Optional: Logic to add 'bg-teal-900' to current page link)
});

// Sidebar Toggle
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    if (sidebar.classList.contains('w-64')) {
        sidebar.classList.remove('w-64');
        sidebar.classList.add('w-0', 'border-none');
    } else {
        sidebar.classList.remove('w-0', 'border-none');
        sidebar.classList.add('w-64');
    }
}

// Submenu Toggle - ACCORDION FIXED
function toggleSubmenu(id, btn) {
    const menu = document.getElementById(id);
    if (!menu) return;

    const icon = btn.querySelector('.lucide-chevron-right, .lucide-chevron-down');

    // Close all OTHER submenus first, EXCEPT the current one and the Active Page's menu
    const allSubmenus = ['security-sub', 'logs-sub', 'ops-sub', 'link-sub', 'linkops-sub'];

    allSubmenus.forEach(subId => {
        if (subId === id) return; // Don't close myself
        if (subId === 'linkops-sub') return; // Don't close active page menu

        const otherMenu = document.getElementById(subId);
        if (!otherMenu || otherMenu.classList.contains('hidden')) return;

        // Close it
        otherMenu.classList.add('hidden');

        // Reset its button icon
        const otherBtn = otherMenu.previousElementSibling;
        if (otherBtn) {
            const otherIcon = otherBtn.querySelector('.lucide-chevron-right, .lucide-chevron-down');
            if (otherIcon) {
                otherIcon.classList.remove('rotate-90');
                otherIcon.classList.remove('rotate-180');
            }
            // Remove active style if not linkops-sub
            if (subId !== 'linkops-sub') {
                otherBtn.classList.remove('bg-[#0f1623]');
            }
        }
    });

    // Toggle current
    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
        if (icon && icon.classList.contains('lucide-chevron-right')) {
            icon.classList.add('rotate-90');
        } else if (icon && icon.classList.contains('lucide-chevron-down')) {
            icon.classList.add('rotate-180');
        }
        btn.classList.add('bg-[#0f1623]');
    } else {
        menu.classList.add('hidden');
        if (icon) {
            icon.classList.remove('rotate-90');
            icon.classList.remove('rotate-180');
        }
        btn.classList.remove('bg-[#0f1623]');
    }
}

// System Switcher Toggle
function toggleSystemSwitcher() {
    const modal = document.getElementById('system-switcher-modal');
    if (modal) {
        if (modal.classList.contains('hidden')) {
            modal.classList.remove('hidden');
        } else {
            modal.classList.add('hidden');
        }
    }
}

// Profile Toggle
function toggleProfile() {
    const dd = document.getElementById('profile-dropdown');
    if (dd) {
        if (dd.classList.contains('hidden')) {
            dd.classList.remove('hidden');
        } else {
            dd.classList.add('hidden');
        }
    }
}

// Filter Toggle
function toggleFilter() {
    const content = document.getElementById('filter-content');
    const icon = document.getElementById('filter-chevron');
    if (!content) return;

    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        if (icon) icon.classList.remove('rotate-180');
    } else {
        content.classList.add('hidden');
        if (icon) icon.classList.add('rotate-180');
    }
}

// Time Update
function updateTime() {
    const dateEl = document.getElementById('server-date');
    const timeEl = document.getElementById('server-time');

    // Defensive check - if elements don't exist yet (loading), just return
    if (!dateEl || !timeEl) return;

    const now = new Date();
    dateEl.innerText = now.getFullYear() + '.' + String(now.getMonth() + 1).padStart(2, '0') + '.' + String(now.getDate()).padStart(2, '0');
    timeEl.innerText = now.toTimeString().split(' ')[0];
}

// Header Title Update (Sub Title)
function updateHeaderTitle() {
    const titleEl = document.getElementById('header-page-title');
    const divider = document.querySelector('.header-divider-text');
    if (!titleEl) return;

    const pageTitle = document.body.getAttribute('data-page-title');
    if (pageTitle && pageTitle.trim() !== '') {
        titleEl.innerText = pageTitle;
        if (divider) divider.style.display = ''; // Let CSS classes take over
    } else {
        titleEl.innerText = '';
        if (divider) divider.style.display = 'none'; // Force hide
    }
}

// System Title Initialization (Main Title)
function initSystemTitle() {
    const systemMap = {
        'VSSI': 'VSSI',
        'IVMS': '버티포트 통합 관리 시스템',
        'IFPS': '통합 비행 계획 관리 시스템',
        'IFRS': '통합 운항 예약 시스템',
        'V-CDM': '협동적 의사 결정 지원 시스템',
        'SAMS': '관리자 시스템'
    };

    const acronym = document.body.getAttribute('data-system-acronym');
    let systemName = '';

    if (acronym && systemMap[acronym]) {
        systemName = systemMap[acronym];
    } else {
        // Fallback or localStorage
        const savedName = localStorage.getItem('vssi-system-name');
        const savedAcronym = localStorage.getItem('vssi-system-acronym');

        if (savedName && savedAcronym) {
            systemName = savedName;
            updateSwitcherUI(savedAcronym);
        } else {
            systemName = 'VSSI';
        }
    }

    // Update Header
    const headerTitle = document.getElementById('header-system-title');
    if (headerTitle) {
        headerTitle.innerText = systemName;
    }

    if (acronym) {
        updateSwitcherUI(acronym);
    }
}

// Switch System
function switchSystem(name, acronym) {
    localStorage.setItem('vssi-system-name', name);
    localStorage.setItem('vssi-system-acronym', acronym);

    // Update Header
    const headerTitle = document.getElementById('header-system-title');
    if (headerTitle) {
        headerTitle.innerText = name;
    }

    // Update Switcher UI
    updateSwitcherUI(acronym);

    // Close Modal
    toggleSystemSwitcher();

    // Update Sidebar
    updateSidebarMenu();
}

// Sidebar Menu Visibility Filter
function updateSidebarMenu() {
    const currentSystem = localStorage.getItem('vssi-system-acronym') || 'SAMS';
    const sidebarItems = document.querySelectorAll('[data-system]');

    sidebarItems.forEach(item => {
        const sys = item.getAttribute('data-system');
        if (sys === 'ALL' || sys === currentSystem) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

// Helper: Update Switcher UI State
function updateSwitcherUI(activeAcronym) {
    // Remove active class and badges from all
    const allItems = document.querySelectorAll('.system-switcher-item');
    allItems.forEach(item => {
        item.classList.remove('active');
        const badge = item.querySelector('.switcher-badge');
        if (badge) badge.remove();

        const acronymSpan = item.querySelector('.switcher-acronym');
        if (acronymSpan) acronymSpan.classList.remove('current');
    });

    // Add active to selected
    const activeItem = document.getElementById(`switcher-item-${activeAcronym}`);
    if (activeItem) {
        activeItem.classList.add('active');

        const acronymSpan = activeItem.querySelector('.switcher-acronym');
        if (acronymSpan) acronymSpan.classList.add('current');

        // Add badge
        const contentDiv = activeItem.querySelector('.switcher-item-content');
        if (contentDiv) {
            const badge = document.createElement('span');
            badge.className = 'switcher-badge';
            badge.innerText = 'CURRENT';
            contentDiv.appendChild(badge);
        }
    }
}

// Loading Spinner Utils
window.vssi = {
    showLoading: function (text = '처리 중입니다...') {
        let overlay = document.getElementById('global-loading');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'global-loading';
            overlay.className = 'loading-overlay';
            overlay.innerHTML = `
                <i data-lucide="loader-2" class="loading-spinner"></i>
                <div class="loading-text">${text}</div>
            `;
            document.body.appendChild(overlay);
            if (window.lucide) {
                lucide.createIcons({
                    attrs: { 'stroke-width': 1.5 },
                    nameAttr: 'data-lucide'
                });
            }
        } else {
            overlay.querySelector('.loading-text').innerText = text;
        }

        // Force reflow and add active class
        overlay.offsetHeight;
        overlay.classList.add('active');
    },
    hideLoading: function () {
        const overlay = document.getElementById('global-loading');
        if (overlay) {
            overlay.classList.remove('active');
        }
    }
};
