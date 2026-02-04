// Common interactions for VSSI Admin System

// Wait for includes to load before initializing dependent logic
document.addEventListener('includes-loaded', () => {
    // Initialize Icons
    if (window.lucide) lucide.createIcons();

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
