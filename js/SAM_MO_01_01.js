/**
 * SAM_MO_01_01.js
 * Logic for Monitoring Dashboard & Topology Diagram
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialization if needed
});

/* --- Modal Functions --- */

// --- Real-time Chart Logic (Task Manager Style) ---
const ChartManager = {
    intervals: [],
    charts: {}, // Store chart instances/contexts

    init: function () {
        // Initial setup if needed
    },

    startServerMonitoring: function () {
        this.stopAll();
        // CPU Chart
        this.runChart('chart-cpu', 'val-cpu', 'cpu');
        // Memory Chart
        this.runChart('chart-mem', 'val-mem', 'mem');
        // Disk Chart
        this.runChart('chart-disk', 'val-disk', 'disk');
    },

    startNetworkMonitoring: function () {
        this.stopAll();
        // Network Chart
        this.runChart('chart-network', 'val-net', 'net');
    },

    stopAll: function () {
        this.intervals.forEach(clearInterval);
        this.intervals = [];
    },

    runChart: function (canvasId, valueId, type) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let width = canvas.parentElement.clientWidth;
        let height = canvas.parentElement.clientHeight;
        canvas.width = width;
        canvas.height = height;

        // Data history
        const dataPoints = 60;
        const data = new Array(dataPoints).fill(0);

        const primaryColor = '#3b82f6'; // Main blue
        const gridColor = '#334155';

        const update = () => {
            // Generate random value based on type
            let newVal = 0;
            let label = '';

            if (type === 'cpu') {
                newVal = Math.floor(Math.random() * 30) + 5; // 5-35%
                label = `${newVal}%`;
            } else if (type === 'mem') {
                newVal = Math.floor(Math.random() * 10) + 40; // 40-50%
                label = `8.4 / 16.0 GB (${newVal}%)`;
            } else if (type === 'disk') {
                if (Math.random() > 0.7) newVal = Math.floor(Math.random() * 80);
                else newVal = Math.floor(Math.random() * 5);
                label = `Active ${newVal}%`;
            } else if (type === 'net') {
                newVal = Math.floor(Math.random() * 60) + 20;
                label = `S: ${Math.floor(newVal / 2)} Kbps / R: ${newVal * 2} Kbps`;
            }

            // Shift data
            data.push(newVal);
            data.shift();

            // Update Label
            const valEl = document.getElementById(valueId);
            if (valEl) valEl.textContent = label;

            // Draw
            ctx.clearRect(0, 0, width, height);

            // Grid
            ctx.beginPath();
            ctx.strokeStyle = gridColor;
            ctx.lineWidth = 0.5;
            // Vertical lines
            for (let i = 0; i < width; i += width / 10) { ctx.moveTo(i, 0); ctx.lineTo(i, height); }
            // Horizontal lines
            for (let i = 0; i < height; i += height / 4) { ctx.moveTo(0, i); ctx.lineTo(width, i); }
            ctx.stroke();

            // Path
            ctx.beginPath();
            ctx.strokeStyle = primaryColor;
            ctx.lineWidth = 2;
            ctx.fillStyle = 'rgba(59, 130, 246, 0.2)'; // fill blue alpha

            ctx.moveTo(0, height);

            const step = width / (dataPoints - 1);

            for (let i = 0; i < data.length; i++) {
                const x = i * step;
                const normalize = (data[i] / 100) * height; // assume 0-100 scale
                const y = height - normalize;
                ctx.lineTo(x, y);
            }

            ctx.lineTo(width, height);
            ctx.closePath();
            ctx.fill();

            // Stroke line on top
            ctx.beginPath();
            for (let i = 0; i < data.length; i++) {
                const x = i * step;
                const normalize = (data[i] / 100) * height;
                const y = height - normalize;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        };

        const interval = setInterval(update, 1000); // 1 sec update
        this.intervals.push(interval);
        update(); // initial draw
    }
};

/* --- Modal Functions --- */

function openHardwareModal(serverName) {
    const titleEl = document.getElementById('monitoring-modal-title');
    if (titleEl) titleEl.textContent = `하드웨어 현황`;

    // Server Name in content (Input field)
    const nameEl = document.getElementById('server-modal-name');
    if (nameEl) nameEl.textContent = serverName;

    // Show Server Content, Hide Network Content
    // Show Server Content, Hide Network Content
    document.getElementById('modal-view-server').classList.remove('hidden');
    document.getElementById('modal-view-network').classList.add('hidden');

    document.getElementById('monitoring-detail-modal').classList.add('active');

    // Start Charts
    setTimeout(() => ChartManager.startServerMonitoring(), 100);

    // Mock Disk Usage Data (TB)
    const totalDisk = 32.00;
    const usedDisk = (Math.random() * 10 + 12).toFixed(2); // 12.00 ~ 22.00 TB (Typical usage for big projects)
    const usagePercent = (usedDisk / totalDisk * 100).toFixed(1);

    const usageTextEl = document.getElementById('disk-usage-text');
    const usageBarEl = document.getElementById('disk-usage-bar');

    if (usageTextEl) usageTextEl.textContent = `${usedDisk} TB / ${totalDisk.toFixed(2)} TB (${usagePercent}%)`;
    if (usageBarEl) usageBarEl.style.width = `${usagePercent}%`;
}

function openNetworkModal(networkId, source, target) {
    const titleEl = document.getElementById('monitoring-modal-title');
    if (titleEl) titleEl.textContent = `네트워크 현황`;

    // Network Name (Removed from view)
    // const nameEl = document.getElementById('network-modal-name');
    // if (nameEl) nameEl.textContent = networkId;

    // Update Composition Info (Split Source/Target)
    const sourceEl = document.getElementById('network-source');
    if (sourceEl) sourceEl.textContent = source;

    const targetEl = document.getElementById('network-target');
    if (targetEl) targetEl.textContent = target;

    // Update "View More" link with parameters
    const viewMoreBtn = document.getElementById('btn-view-more-network');
    if (viewMoreBtn) {
        viewMoreBtn.href = `SAM_MO_03_01.html?source=${encodeURIComponent(source)}&target=${encodeURIComponent(target)}`;
    }

    // Show Network Content, Hide Server Content
    document.getElementById('modal-view-network').classList.remove('hidden');
    document.getElementById('modal-view-server').classList.add('hidden');

    document.getElementById('monitoring-detail-modal').classList.add('active');

    // Start Charts
    setTimeout(() => ChartManager.startNetworkMonitoring(), 100);
}

function closeMonitoringModal() {
    document.getElementById('monitoring-detail-modal').classList.remove('active');
    ChartManager.stopAll();
}

// Global exposure
window.openHardwareModal = openHardwareModal;
window.openNetworkModal = openNetworkModal;
window.closeMonitoringModal = closeMonitoringModal;
