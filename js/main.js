document.addEventListener('DOMContentLoaded', () => {
    const tabsContainer = document.getElementById('tabs-container');
    const tableBody = document.getElementById('screen-table-body');
    const pageTitle = document.getElementById('page-title');
    const totalCountEl = document.getElementById('total-count');

    // Default filters
    let currentTab = 'COMMON';

    // Implemented Screens Whitelist
    const implementedScreens = [
        'COM_LG_01_01',
        'COM_LG_02_01',
        'COM_CM_01_01',
        'COM_CM_01_02',
        'COM_IT_01_01',
        'SAM_AS_10_01',
        'SAM_AU_01_01',
        'SAM_AU_02_01'
    ];

    function init() {
        setupTabs();
        setupMobileSelect();
        renderTable();
        setupSearch();
    }

    function setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const mobileSelect = document.getElementById('mobile-tabs-select');

        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                tabButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                currentTab = btn.getAttribute('data-tab');
                if (mobileSelect) mobileSelect.value = currentTab;
                renderTable();
            });
        });
    }

    function setupMobileSelect() {
        const mobileSelect = document.getElementById('mobile-tabs-select');
        const tabButtons = document.querySelectorAll('.tab-btn');

        if (!mobileSelect) return;

        mobileSelect.addEventListener('change', (e) => {
            currentTab = e.target.value;

            // Sync desktop tabs
            tabButtons.forEach(btn => {
                if (btn.getAttribute('data-tab') === currentTab) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });

            renderTable();
        });
    }

    function getYearHtml(date) {
        if (!date) return '';

        let html = date;
        // Replace 2026년 with teal span
        html = html.replace(/2026년/g, '<span class="text-teal-400 font-mono">2026년</span>');
        // Replace 2027년 with amber span
        html = html.replace(/2027년/g, '<span class="text-amber-400 font-mono">2027년</span>');

        // If it's just a range or has other chars, the base color will be slate
        return `<span class="text-slate-500">${html}</span>`;
    }

    function renderTable() {
        // Clear table
        tableBody.innerHTML = '';

        let data = screenData[currentTab] || [];

        // Track previous values for grouping
        let prevCategory = '';
        let prevMenu1 = '';
        let prevMenu2 = '';

        // Update counts
        totalCountEl.textContent = data.length;

        // Populate table
        data.forEach((item, index) => {
            const tr = document.createElement('tr');
            tr.className = 'data-table-row animate-fade-in';
            tr.style.animationDelay = `${index * 0.05}s`;

            const isImplemented = implementedScreens.includes(item.id);
            let idHtml = '';

            if (isImplemented) {
                idHtml = `<span class="text-sm font-bold text-teal-400 hover:text-teal-300 cursor-pointer underline underline-offset-4 decoration-teal-500/30" onclick="openScreen('${item.id}')">${item.id}</span>`;
            } else if (item.id === 'SAM_AU_01_02') {
                // Special case for Included Modal - Primary Color but not a link
                idHtml = `<span class="text-sm font-bold text-teal-400 opacity-80">${item.id}</span>`;
            } else {
                idHtml = `<span class="text-sm font-bold text-slate-600 cursor-not-allowed" title="Not Implemented">${item.id}</span>`;
            }

            // Grouping Logic: Dim text if same as previous row
            const categoryChanged = item.category !== prevCategory;
            const menu1Changed = categoryChanged || item.menu1 !== prevMenu1;
            const menu2Changed = menu1Changed || item.menu2 !== prevMenu2;

            const yearHtml = getYearHtml(item.date);

            tr.innerHTML = `
                <td class="td-center ${categoryChanged ? '' : 'opacity-20'}">${item.category}</td>
                <td class="${menu1Changed ? 'text-white' : 'opacity-20'}">${item.menu1}</td>
                <td class="${menu2Changed ? 'text-white' : 'opacity-20'}">${item.menu2}</td>
                <td class="whitespace-nowrap">
                    ${idHtml}
                </td>
                <td class="text-white font-bold">${item.name}</td>
                <td class="td-center">
                    <span class="badge ${getTypeClass(item.type)}">
                        ${item.type}
                    </span>
                </td>
                <td class="td-date">${yearHtml}</td>
                <td class="text-xs text-slate-500">${item.remarks}</td>
            `;
            tableBody.appendChild(tr);

            // Update trackers
            prevCategory = item.category;
            prevMenu1 = item.menu1;
            prevMenu2 = item.menu2;
        });
    }

    function getTypeClass(type) {
        if (type === '모달') return 'badge-purple';
        if (type === '이메일') return 'badge-info';
        return 'badge-success';
    }

    // Global function for onclick
    window.openScreen = function (id) {
        if (!implementedScreens.includes(id)) return;

        const url = `./screens/${id}.html`;
        window.open(url, '_blank');
    };

    function setupSearch() {
        const searchInput = document.getElementById('search-input');
        if (!searchInput) return;

        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const rows = tableBody.querySelectorAll('tr');

            let visibleCount = 0;
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                if (text.includes(term)) {
                    row.style.display = '';
                    visibleCount++;
                } else {
                    row.style.display = 'none';
                }
            });
            totalCountEl.textContent = visibleCount;
        });
    }

    // Run init
    init();
});
