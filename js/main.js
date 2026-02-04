document.addEventListener('DOMContentLoaded', () => {
    const tabsContainer = document.getElementById('tabs-container');
    const tableBody = document.getElementById('screen-table-body');
    const pageTitle = document.getElementById('page-title');
    const totalCountEl = document.getElementById('total-count');

    // Default tab
    let currentTab = 'COMMON';

    // Implemented Screens Whitelist
    const implementedScreens = [
        'CM_LG_01_01',
        'CM_LG_02_01',
        'SAM_AS_10_01'
    ];

    function init() {
        setupTabs();
        renderTable(currentTab);
        setupSearch();
    }

    function setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all
                tabButtons.forEach(b => b.classList.remove('active'));
                // Add active to clicked
                btn.classList.add('active');

                // Update current tab
                currentTab = btn.getAttribute('data-tab');
                renderTable(currentTab);
            });
        });
    }

    function renderTable(tabKey) {
        // Clear table
        tableBody.innerHTML = '';

        const data = screenData[tabKey] || [];

        // Update counts
        totalCountEl.textContent = data.length;

        // Populate table
        data.forEach((item, index) => {
            const tr = document.createElement('tr');
            tr.className = 'border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors group table-row-hover animate-fade-in';
            tr.style.animationDelay = `${index * 0.05}s`;

            const isImplemented = implementedScreens.includes(item.id);
            const idHtml = isImplemented
                ? `<span class="screen-id-link text-sm font-bold text-teal-400 hover:text-teal-300 cursor-pointer underline underline-offset-4 decoration-teal-500/30" onclick="openScreen('${item.id}')">${item.id}</span>`
                : `<span class="text-sm font-bold text-slate-600 cursor-not-allowed" title="Not Implemented">${item.id}</span>`;

            tr.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-400">${item.category}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-300 font-medium">${item.menu1}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-300">${item.menu2}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    ${idHtml}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-white font-bold">${item.name}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm ${getTypeClass(item.type)}">
                        ${item.type}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono">${item.date}</td>
                <td class="px-6 py-4 whitespace-nowrap text-xs text-slate-500">${item.remarks}</td>
            `;
            tableBody.appendChild(tr);
        });
    }

    function getTypeClass(type) {
        if (type === '모달') return 'bg-purple-900/30 text-purple-400 border border-purple-900/50';
        if (type === '이메일') return 'bg-blue-900/30 text-blue-400 border border-blue-900/50';
        return 'bg-teal-900/30 text-teal-400 border border-teal-900/50';
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
