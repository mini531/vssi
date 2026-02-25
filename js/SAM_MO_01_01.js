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
        // Network Chart (Inbound/Outbound)
        this.runChart('chart-net', 'val-net', 'net');
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
        const data = type === 'net' ? { in: new Array(dataPoints).fill(0), out: new Array(dataPoints).fill(0) } : new Array(dataPoints).fill(0);

        const primaryColor = type === 'net' ? '#10b981' : '#3b82f6'; // Green for In, Blue for Out/Normal
        const secondaryColor = '#3b82f6'; // Blue for Out
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
                label = `IO ${newVal}%`;
            } else if (type === 'net') {
                const inVal = Math.floor(Math.random() * 50) + 10;
                const outVal = Math.floor(Math.random() * 50) + 10;
                data.in.push(inVal);
                data.in.shift();
                data.out.push(outVal);
                data.out.shift();
                label = `수신: ${inVal}.0 Mbps / 송신: ${outVal}.0 Mbps`;
            }

            if (type !== 'net') {
                data.push(newVal);
                data.shift();
            }

            // Update Label
            const valEl = document.getElementById(valueId);
            const currentValEl = document.getElementById(valueId + '-current');
            if (valEl) valEl.textContent = label;
            if (currentValEl) currentValEl.textContent = label;

            // Draw
            ctx.clearRect(0, 0, width, height);

            // Grid
            ctx.beginPath();
            ctx.strokeStyle = gridColor;
            ctx.lineWidth = 0.5;
            for (let i = 0; i < width; i += width / 10) { ctx.moveTo(i, 0); ctx.lineTo(i, height); }
            for (let i = 0; i < height; i += height / 4) { ctx.moveTo(0, i); ctx.lineTo(width, i); }
            ctx.stroke();

            const step = width / (dataPoints - 1);

            if (type === 'net') {
                // Draw Outbound (Secondary) first so Inbound (Primary) is on top
                const drawPath = (points, color) => {
                    ctx.beginPath();
                    ctx.strokeStyle = color;
                    ctx.lineWidth = 2;
                    ctx.fillStyle = color + '22';
                    ctx.moveTo(0, height);
                    for (let i = 0; i < points.length; i++) {
                        const x = i * step;
                        const y = height - (points[i] / 100) * height;
                        ctx.lineTo(x, y);
                    }
                    ctx.lineTo(width, height);
                    ctx.closePath();
                    ctx.fill();

                    ctx.beginPath();
                    for (let i = 0; i < points.length; i++) {
                        const x = i * step;
                        const y = height - (points[i] / 100) * height;
                        if (i === 0) ctx.moveTo(x, y);
                        else ctx.lineTo(x, y);
                    }
                    ctx.stroke();
                };

                drawPath(data.out, secondaryColor);
                drawPath(data.in, primaryColor);
            } else {
                ctx.beginPath();
                ctx.strokeStyle = primaryColor;
                ctx.lineWidth = 2;
                ctx.fillStyle = primaryColor + '33';

                ctx.moveTo(0, height);
                for (let i = 0; i < data.length; i++) {
                    const x = i * step;
                    const y = height - (data[i] / 100) * height;
                    ctx.lineTo(x, y);
                }
                ctx.lineTo(width, height);
                ctx.closePath();
                ctx.fill();

                ctx.beginPath();
                for (let i = 0; i < data.length; i++) {
                    const x = i * step;
                    const y = height - (data[i] / 100) * height;
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
            }
        };

        const interval = setInterval(update, 1000);
        this.intervals.push(interval);
        update();
    }
};

/* --- Modal Functions --- */

function openHardwareModal(serverName, status = 'normal') {
    const titleEl = document.getElementById('monitoring-modal-title');
    if (titleEl) titleEl.textContent = `하드웨어 현황`;

    // Server Name in content
    const nameEl = document.getElementById('server-modal-name');
    if (nameEl) nameEl.textContent = serverName;

    // Status Badge
    const statusEl = document.getElementById('server-modal-status');
    if (statusEl) {
        if (status === 'fault') {
            statusEl.textContent = '장애';
            statusEl.className = 'badge badge-danger';
        } else {
            statusEl.textContent = '정상';
            statusEl.className = 'badge badge-success';
        }
    }

    // Show Server Content
    const serverView = document.getElementById('modal-view-server');
    if (serverView) serverView.classList.remove('hidden');

    const modal = document.getElementById('monitoring-detail-modal');
    if (modal) modal.classList.add('active');

    // Start Charts
    setTimeout(() => ChartManager.startServerMonitoring(), 100);

    // Mock Disk Usage Data (TB)
    const totalDisk = 32.00;
    const usedDisk = (Math.random() * 10 + 12).toFixed(2);
    const usagePercent = (usedDisk / totalDisk * 100).toFixed(1);

    const usageTextEl = document.getElementById('disk-usage-text');
    const usageBarEl = document.getElementById('disk-usage-bar');

    if (usageTextEl) usageTextEl.textContent = `${usedDisk} TB / ${totalDisk.toFixed(2)} TB (${usagePercent}%)`;
    if (usageBarEl) usageBarEl.style.setProperty('--progress-width', `${usagePercent}%`);
}

function closeMonitoringModal() {
    const modal = document.getElementById('monitoring-detail-modal');
    if (modal) modal.classList.remove('active');
    ChartManager.stopAll();
}

// Global exposure
window.openHardwareModal = openHardwareModal;
window.closeMonitoringModal = closeMonitoringModal;
