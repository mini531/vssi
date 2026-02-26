// Common interactions for VSSI Admin System

// Wait for includes to load before initializing dependent logic
document.addEventListener('includes-loaded', () => {
    // Initialize Icons
    if (window.lucide) lucide.createIcons();

    // Update Header Title (Page Subtitle)
    updateHeaderTitle();

    // Initialize System Title (Header Main Title)
    initSystemTitle();

    // Update Sidebar based on active active system
    updateSidebarMenu();

    // Restore Sidebar State (Open/Closed)
    restoreSidebarState();

    // Start Clock
    updateTime();
    setInterval(updateTime, 1000);

    // Highlight Active Sidebar Menu
    highlightActiveMenu();

    // Auto-close sidebar on mobile menu click
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.addEventListener('click', (e) => {
            const btn = e.target.closest('.sidebar-nav-btn:not(.group), .sidebar-sub-btn, .sidebar-footer-btn');
            if (btn) {
                closeSidebarOnMobile();
            }
        });
    }
});

// Sidebar Toggle
// Sidebar Toggle
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    if (sidebar.classList.contains('collapsed')) {
        sidebar.classList.remove('collapsed');
        localStorage.setItem('vssi-sidebar-state', 'open');
    } else {
        sidebar.classList.add('collapsed');
        localStorage.setItem('vssi-sidebar-state', 'closed');
    }
}

// Restore Sidebar State
function restoreSidebarState() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    // Check if current page is Member Info (should be closed by default)
    const url = window.location.pathname;
    const isMemberInfo = url.includes('COM_MB_01_01') || url.includes('COM_MB_01_02');

    if (isMemberInfo) {
        sidebar.classList.add('collapsed');
        return;
    }

    const savedState = localStorage.getItem('vssi-sidebar-state');
    if (savedState === 'open') {
        sidebar.classList.remove('collapsed');
    } else {
        sidebar.classList.add('collapsed');
    }
}

// Submenu Toggle - ACCORDION FIXED
function toggleSubmenu(id, btn) {
    const menu = document.getElementById(id);
    if (!menu) return;

    const icon = btn.querySelector('.lucide-chevron-right, .lucide-chevron-down');

    // Close all OTHER submenus first, EXCEPT the current one and the Active Page's menu
    const allSubmenus = ['security-sub', 'logs-sub', 'ops-sub', 'link-sub', 'linkops-sub', 'monitoring-sub'];

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
        // Sync localStorage with body attribute
        localStorage.setItem('vssi-system-acronym', acronym);
        localStorage.setItem('vssi-system-name', systemName);
    } else {
        // Fallback or localStorage
        const savedName = localStorage.getItem('vssi-system-name');
        const savedAcronym = localStorage.getItem('vssi-system-acronym');

        if (savedName && savedAcronym) {
            systemName = savedName;
            updateSwitcherUI(savedAcronym);
        } else {
            systemName = 'VSSI';
            // Set defaults if nothing exists
            localStorage.setItem('vssi-system-acronym', 'VSSI');
            localStorage.setItem('vssi-system-name', 'VSSI');
        }
    }

    // Update Header
    const headerTitle = document.getElementById('header-system-title');
    const activeAcronym = acronym || localStorage.getItem('vssi-system-acronym');

    if (headerTitle) {
        headerTitle.innerText = systemName;
        // Dynamic Link: VSSI -> Intro, Others -> Dashboard
        if (activeAcronym === 'VSSI') {
            headerTitle.href = 'COM_IT_01_01.html';
        } else if (activeAcronym === 'IVMS') {
            headerTitle.href = 'IVM_DB_01_01.html';
        } else {
            headerTitle.href = 'SAM_DB_01_01.html';
        }
    }

    if (activeAcronym) {
        updateSwitcherUI(activeAcronym);
    }

    // Dynamic Header Style (Intro vs Admin)
    if (activeAcronym === 'VSSI') {
        document.body.classList.add('intro-page');
    } else {
        document.body.classList.remove('intro-page');
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
        // Dynamic Link Update
        if (acronym === 'VSSI') {
            headerTitle.href = 'COM_IT_01_01.html';
        } else if (acronym === 'IVMS') {
            headerTitle.href = 'IVM_DB_01_01.html';
        } else {
            headerTitle.href = 'SAM_DB_01_01.html';
        }
    }

    // Update Switcher UI
    updateSwitcherUI(acronym);

    // Close Modal
    toggleSystemSwitcher();

    // Update Sidebar
    updateSidebarMenu();

    // Redirect to the new system's gateway
    if (acronym === 'VSSI') {
        window.open('COM_IT_01_01.html', '_blank');
    } else if (acronym === 'IVMS') {
        window.open('IVM_DB_01_01.html', '_blank');
    } else if (acronym === 'SAMS') {
        window.open('SAM_DB_01_01.html', '_blank');
    }
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

// Dynamic Sidebar Menu Highlighting
function highlightActiveMenu() {
    const pageTitle = document.body.getAttribute('data-page-title');
    if (!pageTitle) return;

    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    // Remove all existing active states
    const allBtns = sidebar.querySelectorAll('.sidebar-nav-btn, .sidebar-sub-btn, .sidebar-footer-btn');
    allBtns.forEach(btn => btn.classList.remove('active'));

    // Also remove active from group buttons and reset icons
    const allGroups = sidebar.querySelectorAll('.sidebar-nav-btn.group');
    allGroups.forEach(group => {
        group.classList.remove('active');
        const icon = group.querySelector('.sidebar-chevron');
        if (icon) {
            icon.classList.remove('rotate-90', 'rotate-180', 'lucide-chevron-down');
            icon.classList.add('lucide-chevron-right');
        }
    });

    // Close all submenus initially
    const submenus = sidebar.querySelectorAll('.sidebar-submenu, .sidebar-submenu-list');
    submenus.forEach(sub => sub.classList.add('hidden'));

    let matched = false;

    // 1. Try to match sub-menu items first
    const subBtns = sidebar.querySelectorAll('.sidebar-sub-btn');
    subBtns.forEach(btn => {
        if (btn.textContent.trim() === pageTitle.trim()) {
            btn.classList.add('active');
            matched = true;

            // Expand parent submenu
            const parentSub = btn.closest('.sidebar-submenu, .sidebar-submenu-list');
            if (parentSub) {
                parentSub.classList.remove('hidden');
                // Highlight the group button
                const groupBtn = parentSub.previousElementSibling;
                if (groupBtn && groupBtn.classList.contains('sidebar-nav-btn')) {
                    groupBtn.classList.add('active', 'bg-[#0f1623]');
                    const icon = groupBtn.querySelector('.sidebar-chevron');
                    if (icon) {
                        icon.classList.remove('lucide-chevron-right');
                        icon.classList.add('lucide-chevron-down');
                        if (icon.classList.contains('lucide-chevron-down')) {
                            // No rotate needed if swapped to down, or use rotate
                        }
                    }
                }
            }
        }
    });

    // 2. If no sub-menu matched, try top-level buttons and footer buttons
    if (!matched) {
        const navBtns = sidebar.querySelectorAll('.sidebar-nav-btn:not(.group), .sidebar-footer-btn');
        navBtns.forEach(btn => {
            const span = btn.querySelector('span');
            if (span && span.textContent.trim() === pageTitle.trim()) {
                btn.classList.add('active');
            }
        });
    }

    // Reinitalize icons for any changed elements
    if (window.lucide) lucide.createIcons();
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

// Close sidebar on mobile after menu click
function closeSidebarOnMobile() {
    // Check if mobile (window width <= 768px)
    if (window.innerWidth <= 768) {
        const sidebar = document.getElementById('sidebar');
        if (sidebar && !sidebar.classList.contains('collapsed')) {
            sidebar.classList.add('collapsed');
            localStorage.setItem('vssi-sidebar-state', 'closed');
        }
    }
}

// Global Modal Backdrop Click Handler
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('active');

        if (typeof window.closeMonitoringModal === 'function' && e.target.id === 'monitoring-detail-modal') {
            window.closeMonitoringModal();
        }
    }
});

/**
 * Common UI Helpers for Mobile and Modals
 * Centralized to reduce redundancy across screen-specific scripts.
 */

// Mobile Split Pane Transitions
window.openDetailPane = function () {
    const splitContainer = document.querySelector('.split-container');
    if (splitContainer) splitContainer.classList.add('show-detail');
};

window.closeDetailPane = function () {
    const splitContainer = document.querySelector('.split-container');
    if (splitContainer) splitContainer.classList.remove('show-detail');

    // Optional: Stop charts if ChartManager exists (Monitoring screens)
    if (window.ChartManager && typeof window.ChartManager.stopAll === 'function') {
        window.ChartManager.stopAll();
    }

    // Optional: Reset views if handle exists
    const emptyState = document.getElementById('empty-state');
    const detailContent = document.getElementById('detail-content');
    if (emptyState && detailContent) {
        emptyState.classList.remove('hidden');
        detailContent.classList.add('hidden');
    }
};

// Modal Helpers
window.showSuccessModal = function (msg, title = '완료') {
    const modal = document.getElementById('success-modal');
    if (!modal) return;

    const titleEl = modal.querySelector('.modal-title');
    const msgEl = modal.querySelector('.modal-desc') || document.getElementById('success-message');

    if (titleEl) titleEl.innerText = title;
    if (msgEl) msgEl.innerText = msg;

    modal.classList.add('active');
    if (window.lucide) lucide.createIcons();
};

window.closeSuccessModal = function () {
    const modal = document.getElementById('success-modal');
    if (modal) modal.classList.remove('active');
};

window.showConfirmModal = function (title, desc, confirmBtnId = 'btn-confirm-ok') {
    const modal = document.getElementById('confirm-modal');
    if (!modal) return;

    const titleEl = modal.querySelector('.modal-title') || document.getElementById('confirm-modal-title');
    const descEl = modal.querySelector('.modal-desc') || document.getElementById('confirm-modal-desc');

    if (titleEl) titleEl.innerText = title;
    if (descEl) descEl.innerText = desc;

    modal.classList.add('active');
    if (window.lucide) lucide.createIcons();
};

window.closeConfirmModal = function () {
    const modal = document.getElementById('confirm-modal');
    if (modal) modal.classList.remove('active');
};

