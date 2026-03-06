document.addEventListener('DOMContentLoaded', () => {
    // === 1. Map Initialization ===
    const map = L.map('monitoring-map', {
        zoomControl: false,
        minZoom: 7,
        maxZoom: 18,
        center: [35.55, 129.20],
        zoom: 11,
        preferCanvas: true
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // === 2. Mock Data ===
    const vertiports = [
        { id: 'VP-01', name: '길천 버티포트', stand: '가용', crowd: '낮음', lat: 35.602239, lng: 129.077892, fato: 1, stands: 1 },
        { id: 'VP-02', name: '자수정 동굴', stand: '가용', crowd: '낮음', lat: 35.542033, lng: 129.091725, fato: 1, stands: 1 },
        { id: 'VP-03', name: '일산해수욕장', stand: '미가용', crowd: '보통', lat: 35.500028, lng: 129.430933, fato: 1, stands: 1 },
        { id: 'VP-04', name: '울산대공원', stand: '가용', crowd: '보통', lat: 35.530022, lng: 129.284694, fato: 1, stands: 3 },
        { id: 'VP-05', name: '울산역', stand: '미가용', crowd: '높음', lat: 35.550756, lng: 129.139639, fato: 2, stands: 5 },
        { id: 'VP-06', name: '울산과학기술원', stand: '가용', crowd: '낮음', lat: 35.575114, lng: 129.191906, fato: 1, stands: 1 },
        { id: 'VP-07', name: '태화강역', stand: '가용', crowd: '보통', lat: 35.540261, lng: 129.358611, fato: 1, stands: 3 },
        { id: 'VP-08', name: '울산공항', stand: '가용', crowd: '낮음', lat: 35.590839, lng: 129.356700, fato: 2, stands: 5 },
    ];

    const flights = [
        { id: 'KE326', alt: '18,470 ft', spd: '410 km/h', trk: '129°' },
        { id: '7C191', alt: '36,000 ft', spd: '425 km/h', trk: '62°' },
        { id: 'OZ097', alt: '14,356 ft', spd: '410 km/h', trk: '102°' }
    ];

    const events = [
        { time: '23:59:10 UTC', code: 'TG001', msg: 'Mode switch HOLD→CRZ' },
        { time: '23:58:47 UTC', code: 'TG002', msg: 'Battery health check' },
        { time: '23:58:23 UTC', code: 'TG001', msg: 'Altitude change requested 1500→1200' }
    ];

    // === 3. Vertiport Status Pagination ===
    let vpPage = 0;
    let activeVpId = 'VP-01'; // Default: Gilcheon
    const perPage = 4;
    const vpListEl = document.getElementById('vp-list');
    const prevBtn = document.getElementById('vp-prev');
    const nextBtn = document.getElementById('vp-next');

    function renderVertiports() {
        if (!vpListEl) return;
        vpListEl.innerHTML = '';
        const start = vpPage * perPage;
        const end = start + perPage;
        const items = vertiports.slice(start, end);

        items.forEach(v => {
            const item = document.createElement('div');
            item.className = `mon-status-item ${v.id === activeVpId ? 'active' : ''}`;
            item.onclick = () => {
                map.flyTo([v.lat, v.lng], 14);
                activeVpId = v.id;

                // Sync with parent select box
                const parentSelect = document.getElementById('vp-select');
                if (parentSelect) parentSelect.value = v.id;

                // Deselect Flight Plan items
                document.querySelectorAll('.mon-flight-item').forEach(i => i.classList.remove('active'));

                renderVertiports();
                openVpModal(v);
            };

            const getStatusTheme = (val) => {
                if (val === '가용' || val === '낮음') return 'success';
                if (val === '보통') return 'warning';
                if (val === '높음' || val === '미가용') return 'error';
                return 'neutral';
            };

            const sTheme = getStatusTheme(v.stand);
            const cTheme = getStatusTheme(v.crowd);

            item.innerHTML = `
                <div class="mon-status-info">
                    <div class="mon-status-name">${v.name}</div>
                    <div class="mon-status-icons">
                        <i data-lucide="wifi" class="w-3 h-3"></i>
                        <i data-lucide="battery-charging" class="w-3 h-3"></i>
                        <i data-lucide="shield-check" class="w-3 h-3"></i>
                    </div>
                </div>
                <div class="mon-status-indicators">
                    <div class="mon-stat-row">
                        <span class="mon-stat-label">STAND</span>
                        <span class="mon-stat-dot bg-${sTheme}"></span>
                        <span class="mon-stat-value text-${sTheme}">${v.stand}</span>
                    </div>
                    <div class="mon-stat-row">
                        <span class="mon-stat-label">혼잡도</span>
                        <span class="mon-stat-dot bg-${cTheme}"></span>
                        <span class="mon-stat-value text-${cTheme}">${v.crowd}</span>
                    </div>
                </div>
            `;
            vpListEl.appendChild(item);
        });

        // Update button states
        if (prevBtn) prevBtn.disabled = vpPage === 0;
        if (nextBtn) nextBtn.disabled = (vpPage + 1) * perPage >= vertiports.length;

        if (window.lucide) {
            lucide.createIcons();
        }
    }

    if (prevBtn) {
        prevBtn.onclick = () => {
            if (vpPage > 0) { vpPage--; renderVertiports(); }
        };
    }
    if (nextBtn) {
        nextBtn.onclick = () => {
            if ((vpPage + 1) * perPage < vertiports.length) { vpPage++; renderVertiports(); }
        };
    }

    renderVertiports();

    // === 3.2 Operation Status Synchronization ===
    function initOpsStatus() {
        const select = document.getElementById('vp-select');
        const chart = document.getElementById('ops-chart');
        if (!select || !chart) return;

        // Populate Select Box
        select.innerHTML = vertiports.map(v => `<option value="${v.id}">${v.name}</option>`).join('');

        // Render Stacked Bar Chart
        function renderOpsChart() {
            chart.innerHTML = '';
            // Create 8 bars
            for (let i = 0; i < 8; i++) {
                const totalHeight = Math.floor(Math.random() * 60) + 30; // 30% to 90%
                const cancelRatio = Math.random() * 0.15; // 0% to 15%
                const delayRatio = Math.random() * 0.2; // 0% to 20%
                const cancelHeight = totalHeight * cancelRatio;
                const delayHeight = totalHeight * delayRatio;
                const successHeight = totalHeight - cancelHeight - delayHeight;

                const barContainer = document.createElement('div');
                barContainer.className = 'flex flex-col justify-end items-center h-full';
                barContainer.style.width = '10%'; // 8 bars + spacing fits well

                // Stacked Bar Wrapper
                const bar = document.createElement('div');
                bar.className = 'w-2 flex flex-col-reverse items-center overflow-hidden';
                bar.style.height = `${totalHeight}%`;

                // Success section (Teal) - Bottom
                const successPart = document.createElement('div');
                successPart.className = 'bg-success w-full';
                successPart.style.height = `${(successHeight / totalHeight) * 100}%`;

                // Delay section (Warning) - Middle
                const delayPart = document.createElement('div');
                delayPart.className = 'bg-warning w-full';
                delayPart.style.height = `${(delayHeight / totalHeight) * 100}%`;

                // Cancel section (Danger) - Top
                const cancelPart = document.createElement('div');
                cancelPart.className = 'bg-danger w-full';
                cancelPart.style.height = `${(cancelHeight / totalHeight) * 100}%`;

                bar.appendChild(successPart);
                bar.appendChild(delayPart);
                bar.appendChild(cancelPart);
                barContainer.appendChild(bar);
                chart.appendChild(barContainer);
            }
        }

        renderOpsChart();
        select.onchange = () => {
            activeVpId = select.value;
            renderOpsChart();
            renderVertiports(); // Update list highlight
        };
    }
    initOpsStatus();

    // === 3.1 Panel Collapse Logic ===
    document.querySelectorAll('.overlay-panel-header').forEach(header => {
        header.onclick = () => {
            const panel = header.closest('.overlay-panel');
            if (panel) {
                panel.classList.toggle('collapsed');
            }
        };
    });

    // === 3.3 Map Interaction: Deselect All ===
    function clearAllSelections() {
        activeVpId = null;
        renderVertiports();
        document.querySelectorAll('.mon-flight-item').forEach(i => i.classList.remove('active'));
    }
    map.on('click', clearAllSelections);
    map.on('dragend', clearAllSelections);
    map.on('dragstart', () => {
        map.closePopup(); // Close any open popup so the map can be freely dragged
    });

    // === 4. Network Topology Canvas ===
    function initNetworkCanvas() {
        const canvas = document.getElementById('mon-network-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;

        function resize() {
            const rect = canvas.parentElement.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            canvas.style.width = rect.width + 'px';
            canvas.style.height = rect.height + 'px';
            ctx.scale(dpr, dpr);
        }

        window.addEventListener('resize', resize);
        resize();

        window.hoveredNode = null;

        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            let prevHovered = window.hoveredNode;
            window.hoveredNode = null;
            nodes.forEach(n => {
                const nx = centerX + (n.relX || 0);
                const ny = centerY + (n.relY || 0);
                // Box size: 70x24 (was 50x16)
                if (mouseX >= nx - 35 && mouseX <= nx + 35 &&
                    mouseY >= ny - 12 && mouseY <= ny + 12) {
                    window.hoveredNode = n;
                }
            });

            if (prevHovered !== window.hoveredNode) {
                canvas.style.cursor = window.hoveredNode ? 'pointer' : 'default';
            }
        });

        canvas.addEventListener('click', (e) => {
            if (window.hoveredNode && window.openHardwareModal) {
                window.openHardwareModal(window.hoveredNode.name);
            }
        });

        let centerX = 0, centerY = 0;

        const nodes = [
            // Left column (DATA) - spread to -115
            { name: 'DATA #1', relX: -115, relY: -40 },
            { name: 'DATA #2', relX: -115, relY: 0 },
            { name: 'DATA #3', relX: -115, relY: 40 },
            // Right column (RADAR) - spread to 115
            { name: 'RADAR #1', relX: 115, relY: -40 },
            { name: 'RADAR #2', relX: 115, relY: 0 },
            { name: 'RADAR #3', relX: 115, relY: 40 },
            // Top symmetric (5G) - spread to 70
            { name: '5G #1', relX: -70, relY: -65 },
            { name: '5G #2', relX: 70, relY: -65 },
            // Bottom center (LEO)
            { name: 'LEO', relX: 0, relY: 60 }
        ];

        let offset = 0;
        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            centerX = canvas.width / (2 * dpr);
            centerY = canvas.height / (2 * dpr);

            // 1. Draw Links first (underneath everything)
            nodes.forEach(n => {
                const nx = centerX + n.relX;
                const ny = centerY + n.relY;
                const isHovered = window.hoveredNode === n;

                ctx.setLineDash([4, 4]);
                ctx.lineDashOffset = -offset;
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(nx, ny);
                ctx.strokeStyle = isHovered ? 'rgba(20, 184, 166, 0.9)' : 'rgba(20, 184, 166, 0.3)';
                ctx.lineWidth = isHovered ? 2 : 1;
                ctx.stroke();
                ctx.setLineDash([]);
            });

            // 2. Draw Nodes
            nodes.forEach(n => {
                const nx = centerX + n.relX;
                const ny = centerY + n.relY;
                const isHovered = window.hoveredNode === n;

                ctx.fillStyle = isHovered ? '#334155' : 'rgba(30, 41, 59, 1)'; // Fully opaque boxes
                ctx.fillRect(nx - 35, ny - 12, 70, 24);
                ctx.strokeStyle = isHovered ? '#2dd4bf' : '#14b8a6';
                ctx.lineWidth = isHovered ? 2 : 1;
                ctx.strokeRect(nx - 35, ny - 12, 70, 24);

                ctx.fillStyle = isHovered ? '#fff' : '#e2e8f0';
                ctx.font = isHovered ? 'bold 10px Inter' : '500 10px Inter';
                ctx.textAlign = 'center';
                ctx.fillText(n.name, nx, ny + 4);
            });

            // 3. Draw Center Hub last (to block link lines effectively)
            ctx.beginPath();
            ctx.arc(centerX, centerY, 24, 0, Math.PI * 2);
            ctx.strokeStyle = '#2dd4bf';
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.fillStyle = '#0f172a'; // Fully opaque slate blocks the links
            ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 12px Inter';
            ctx.textAlign = 'center';
            ctx.fillText('VSSI', centerX, centerY + 4);

            offset += 0.5;
            requestAnimationFrame(draw);
        }
        draw();
    }
    initNetworkCanvas();

    // === 5. Flight Plans & Event Log ===
    const flightLogEl = document.getElementById('flight-plans');
    flights.forEach(f => {
        const div = document.createElement('div');
        div.className = 'mon-flight-item';
        div.innerHTML = `
            <div class="mon-flight-id">${f.id}</div>
            <div class="mon-flight-details">
                <span>ALT ${f.alt}</span>
                <span>SPD ${f.spd}</span>
                <span>TRK ${f.trk}</span>
            </div>
        `;
        flightLogEl.appendChild(div);
    });

    const eventLogEl = document.getElementById('event-log');
    function renderTimelineEvents() {
        if (!eventLogEl) return;
        eventLogEl.innerHTML = '';
        events.forEach(e => {
            const div = document.createElement('div');
            div.className = 'mon-timeline-item';
            div.innerHTML = `
                <div class="mon-timeline-time">${e.time}</div>
                <div class="mon-timeline-marker"></div>
                <div class="mon-timeline-content">
                    <span class="mon-timeline-code">${e.code}</span>
                    <span class="mon-timeline-text">${e.msg}</span>
                </div>
            `;
            eventLogEl.appendChild(div);
        });
    }
    renderTimelineEvents();

    // === 6. Advanced Map Animations (Demo Migration) ===
    const ROUTE_COORDS = [
        [35.602239, 129.077892], // VP-01 길천 버티포트
        [35.575114, 129.191906], // VP-06 울산과학기술원
        [35.550756, 129.139639], // VP-05 울산역
        [35.542033, 129.091725], // VP-02 자수정 동굴
        [35.530022, 129.284694], // VP-04 울산대공원
        [35.540261, 129.358611], // VP-07 태화강역
        [35.500028, 129.430933], // VP-03 일산해수욕장
        [35.590839, 129.356700], // VP-08 울산공항
    ];

    // Create pan-able layers
    const airwaysLayer = L.layerGroup().addTo(map);
    const flightsLayer = L.layerGroup().addTo(map);

    // Draw airway polyline
    L.polyline(ROUTE_COORDS, {
        color: '#14b8a6',
        weight: 1,
        opacity: 0.5,
        dashArray: '5, 5'
    }).addTo(airwaysLayer);

    // Add waypoint markers
    ROUTE_COORDS.forEach(coord => {
        L.circleMarker(coord, {
            radius: 3,
            color: '#14b8a6',
            fillColor: '#0f172a',
            fillOpacity: 1,
            weight: 1
        }).addTo(airwaysLayer);
    });

    /**
     * Interpolates a point on the route based on phase t [0, 1]
     */
    function pointOnRoute(t) {
        if (!Array.isArray(ROUTE_COORDS) || ROUTE_COORDS.length < 2) return null;
        const segs = ROUTE_COORDS.length - 1;
        const pos = t * segs;
        const i = Math.floor(pos);
        const frac = pos - i;
        const nextIdx = (i + 1) >= ROUTE_COORDS.length ? i : i + 1;
        const [lat1, lng1] = ROUTE_COORDS[i];
        const [lat2, lng2] = ROUTE_COORDS[nextIdx];
        return [lat1 + (lat2 - lat1) * frac, lng1 + (lng2 - lng1) * frac];
    }

    /**
     * Calculates heading based on current position and a small epsilon
     */
    function headingOnRoute(t) {
        const eps = 1e-4;
        const p1 = pointOnRoute(Math.max(0, t - eps));
        const p2 = pointOnRoute(Math.min(1, t + eps));
        if (!p1 || !p2) return 0;
        const dy = p2[0] - p1[0], dx = p2[1] - p1[1];
        let deg = Math.atan2(dx, dy) * 180 / Math.PI;
        return (deg + 360) % 360;
    }

    function makeDroneIcon(angle = 0) {
        return L.divIcon({
            className: 'drone-marker',
            html: `
                <div class="drone-marker-container" style="transform: rotate(${angle}deg);">
                    <div class="drone-arm ccw">
                        <div class="propeller prop-tl"></div>
                        <div class="propeller prop-br"></div>
                    </div>
                    <div class="drone-arm cw">
                        <div class="propeller prop-tr"></div>
                        <div class="propeller prop-bl"></div>
                    </div>
                    <div class="drone-body"></div>
                </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        });
    }

    // Flight Instances mapped to markers
    const planeMarkers = {};
    const flightData = [
        { id: 'KE326', alt: 18470, spd: 410, trk: 129, phase: 0.02 },
        { id: '7C191', alt: 36000, spd: 425, trk: 62, phase: 0.18 },
        { id: 'OZ097', alt: 14356, spd: 410, trk: 102, phase: 0.33 }
    ];

    flightData.forEach(p => {
        const t0 = p.phase % 1;
        const pos = pointOnRoute(t0);
        const hdg = headingOnRoute(t0);

        const marker = L.marker(pos, {
            icon: makeDroneIcon(hdg),
            pane: 'markerPane'
        })
            .bindPopup(`
            <div class="text-xs">
                <div class="font-bold border-b border-slate-700 mb-1 pb-1">${p.id}</div>
                <div>ALT: ${p.alt.toLocaleString()} ft</div>
                <div>SPD: ${p.spd.toLocaleString()} km/h</div>
            </div>
        `)
            .addTo(flightsLayer);

        planeMarkers[p.id] = { marker, t: t0, spd: p.spd };
    });

    // Animation Loop
    const KM_PER_ROUTE = 60; // Approximate route length in km for speed calculation
    const TICK_MS = 50;

    setInterval(() => {
        Object.keys(planeMarkers).forEach(id => {
            const obj = planeMarkers[id];
            // Calc dt per tick (speed km/h -> phase change)
            const dt = (obj.spd / 3600) * (TICK_MS / 1000) / KM_PER_ROUTE;
            obj.t = (obj.t + dt) % 1;

            const pos = pointOnRoute(obj.t);
            const hdg = headingOnRoute(obj.t);

            obj.marker.setLatLng(pos);
            const iconEl = obj.marker.getElement();
            if (iconEl) {
                const container = iconEl.querySelector('.drone-marker-container');
                if (container) container.style.transform = `rotate(${hdg}deg)`;
            }
        });
    }, TICK_MS);

    // Coordinate Flight List Click
    if (flightLogEl) {
        flightLogEl.addEventListener('click', (e) => {
            const item = e.target.closest('.mon-flight-item');
            if (!item) return;

            const fltId = item.querySelector('.mon-flight-id').textContent.trim();
            const obj = planeMarkers[fltId];
            if (obj) {
                map.flyTo(obj.marker.getLatLng(), 14, { animate: true, duration: 0.8 });
                obj.marker.openPopup();

                // Highlight item
                document.querySelectorAll('.mon-flight-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');

                // Deselect Vertiport items
                activeVpId = null;
                renderVertiports();
            }
        });
    }

    // === 7. Event Log Modal Logic ===
    const eventLogModal = document.getElementById('event-log-modal');
    const modalTbody = document.getElementById('modal-event-tbody');
    const btnMoreLog = document.getElementById('btn-more-log');

    if (btnMoreLog) {
        btnMoreLog.onclick = () => openEventLogModal();
    }

    let logPage = 1;
    const itemsPerLogPage = 10;

    const mockLogs = [
        { date: '2026.02.26', time: '01:09:00 UTC', code: 'TG001', msg: 'Mode switch CRZ→APP', type: 'INFO' },
        { date: '2026.02.26', time: '01:07:59 UTC', code: 'TG004', msg: 'Latency high on link', type: 'WARN' },
        { date: '2026.02.26', time: '01:06:56 UTC', code: 'TG002', msg: 'Battery health check', type: 'INFO' },
        { date: '2026.02.26', time: '01:06:44 UTC', code: 'TG002', msg: 'Battery level low', type: 'ERROR' },
        { date: '2026.02.26', time: '01:06:17 UTC', code: 'TG002', msg: 'Battery health check', type: 'INFO' },
        { date: '2026.02.26', time: '01:04:55 UTC', code: 'TG003', msg: 'Geo-fence entering', type: 'INFO' },
        { date: '2026.02.26', time: '01:03:49 UTC', code: 'TG001', msg: 'Mode switch HOLD→CRZ', type: 'INFO' },
        { date: '2026.02.26', time: '01:03:24 UTC', code: 'TG003', msg: 'Geo-fence entering', type: 'INFO' },
        { date: '2026.02.26', time: '01:02:46 UTC', code: 'TG003', msg: 'Geo-fence entering', type: 'INFO' },
        { date: '2026.02.26', time: '01:02:29 UTC', code: 'TG002', msg: 'Battery level low', type: 'ERROR' }
    ];

    window.openEventLogModal = () => {
        if (eventLogModal) eventLogModal.classList.add('active');

        // Ensure filter is collapsed by default
        const filterContent = document.getElementById('filter-content');
        const filterChevron = document.getElementById('filter-chevron');
        if (filterContent) filterContent.classList.add('hidden');
        if (filterChevron) {
            filterChevron.setAttribute('data-lucide', 'chevron-down');
            if (window.lucide) lucide.createIcons();
        }

        renderModalLogs();
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('log-start-date').value = today;
        document.getElementById('log-end-date').value = today;
    };

    window.closeEventLogModal = () => {
        if (eventLogModal) eventLogModal.classList.remove('active');
    };

    window.toggleFilter = () => {
        const content = document.getElementById('filter-content');
        const chevron = document.getElementById('filter-chevron');
        if (!content || !chevron) return;

        const isHidden = content.classList.contains('hidden');
        if (isHidden) {
            content.classList.remove('hidden');
            chevron.setAttribute('data-lucide', 'chevron-up');
        } else {
            content.classList.add('hidden');
            chevron.setAttribute('data-lucide', 'chevron-down');
        }
        if (window.lucide) lucide.createIcons();
    };

    function renderModalLogs() {
        if (!modalTbody) return;
        modalTbody.innerHTML = '';
        mockLogs.forEach(log => {
            const tr = document.createElement('tr');
            tr.className = 'data-table-row';
            // Combined date and time (Target: YYYY.MM.DD HH:mm:ss)
            const dateTime = `${log.date} ${log.time.replace(' UTC', '')}`;
            tr.innerHTML = `
                <td class="td-date text-center">${dateTime}</td>
                <td class="td-center"><span class="badge badge-purple">${log.code}</span></td>
                <td>${log.msg}</td>
            `;
            modalTbody.appendChild(tr);
        });
        document.getElementById('modal-log-total').textContent = `총 ${mockLogs.length} 건`;
    }

    window.prevLogPage = () => { if (logPage > 1) { logPage--; renderModalLogs(); } };
    window.nextLogPage = () => { /* Mock only 1 page */ };

    // === 8. Hardware Status Modal Logic (from SAM_MO_01_01.js) ===
    const ChartManager = {
        intervals: [],
        charts: {},

        startServerMonitoring: function () {
            this.stopAll();
            this.runChart('chart-cpu', 'val-cpu', 'cpu');
            this.runChart('chart-mem', 'val-mem', 'mem');
            this.runChart('chart-disk', 'val-disk', 'disk');
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

            const dataPoints = 60;
            const data = type === 'net' ? { in: new Array(dataPoints).fill(0), out: new Array(dataPoints).fill(0) } : new Array(dataPoints).fill(0);

            const primaryColor = type === 'net' ? '#10b981' : '#3b82f6';
            const secondaryColor = '#3b82f6';
            const gridColor = '#334155';

            const update = () => {
                let newVal = 0;
                let label = '';

                if (type === 'cpu') {
                    newVal = Math.floor(Math.random() * 30) + 5;
                    label = `${newVal}%`;
                } else if (type === 'mem') {
                    newVal = Math.floor(Math.random() * 10) + 40;
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

                const currentValEl = document.getElementById(valueId + '-current');
                if (currentValEl) currentValEl.textContent = label;

                ctx.clearRect(0, 0, width, height);

                ctx.beginPath();
                ctx.strokeStyle = gridColor;
                ctx.lineWidth = 0.5;
                for (let i = 0; i < width; i += width / 10) { ctx.moveTo(i, 0); ctx.lineTo(i, height); }
                for (let i = 0; i < height; i += height / 4) { ctx.moveTo(0, i); ctx.lineTo(width, i); }
                ctx.stroke();

                const step = width / (dataPoints - 1);

                if (type === 'net') {
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

    window.openHardwareModal = (serverName, status = 'normal') => {
        const titleEl = document.getElementById('monitoring-modal-title');
        if (titleEl) titleEl.textContent = `인프라 상태`;
        const nameEl = document.getElementById('server-modal-name');
        if (nameEl) nameEl.textContent = serverName;
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
        const modal = document.getElementById('monitoring-detail-modal');
        if (modal) modal.classList.add('active');
        setTimeout(() => ChartManager.startServerMonitoring(), 100);

        const totalDisk = 32.00;
        const usedDisk = (Math.random() * 10 + 12).toFixed(2);
        const usagePercent = (usedDisk / totalDisk * 100).toFixed(1);
        const usageTextEl = document.getElementById('disk-usage-text');
        const usageBarEl = document.getElementById('disk-usage-bar');
        if (usageTextEl) usageTextEl.textContent = `${usedDisk} TB / ${totalDisk.toFixed(2)} TB (${usagePercent}%)`;
        if (usageBarEl) usageBarEl.style.setProperty('--progress-width', `${usagePercent}%`);
    };

    window.closeMonitoringModal = () => {
        const modal = document.getElementById('monitoring-detail-modal');
        if (modal) modal.classList.remove('active');
        ChartManager.stopAll();
    };

    // === Vertiport Status Modal ===
    const now = new Date();
    const addMin = (d, m) => new Date(d.getTime() + m * 60000);
    const hm = d => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

    const VP_OPS_DATA = (() => {
        const flights = [
            { base: -25, call: 'KE124', dest: 'ICN', stand: 'S1', sid: 'MID3B' },
            { base: -18, call: 'OZ456', dest: 'GMP', stand: 'S2', sid: 'DET1J' },
            { base: -8, call: '7C892', dest: 'CJU', stand: 'S1', sid: 'KOR2A' },
            { base: 2, call: 'LJ234', dest: 'PUS', stand: 'S3', sid: 'MID3B' },
            { base: 12, call: 'TW567', dest: 'USN', stand: 'S2', sid: 'DET1J' },
            { base: 22, call: 'BX123', dest: 'YNY', stand: 'S1', sid: 'KOR2A' },
            { base: 35, call: 'RS789', dest: 'CJU', stand: 'S3', sid: 'MID3B' },
            { base: 48, call: 'YP345', dest: 'ICN', stand: 'S2', sid: 'DET1J' },
        ];
        return flights.map((f, i) => {
            const eobt = addMin(now, f.base);
            const tobt = addMin(eobt, 2 + (i % 3));
            const tsat = addMin(tobt, 8 + (i % 6));
            const sobt = addMin(eobt, -45);
            const ctot = addMin(tsat, -3);
            const ttot = addMin(tsat, 3);
            const isPast = f.base < -5;
            const aobt = isPast ? addMin(tobt, (i % 3) - 1) : null;
            const atot = isPast ? addMin(ttot, (i % 4) - 2) : null;
            const asrt = addMin(eobt, -12);
            const delay = Math.round((tsat - eobt) / 60000);
            return {
                call: f.call, dest: f.dest, ac: 'E-VTOL', pp: f.stand,
                EOBT: hm(eobt), TOBT: hm(tobt), TSAT: hm(tsat),
                Delay: (delay > 0 ? '+' : '') + delay,
                AOBT: aobt ? hm(aobt) : '--:--',
                FATO: '09R', CTOT: hm(ctot), TTOT: hm(ttot),
                ATOT: atot ? hm(atot) : '--:--',
                SID: f.sid, SOBT: hm(sobt), WTC: 'L',
                State: isPast ? 'DEP' : 'PLN',
                ASRT: hm(asrt),
                _delay: delay
            };
        });
    })();

    window.openVpModal = (v) => {
        const modal = document.getElementById('vp-status-modal');
        if (!modal) return;

        // Set title
        const titleEl = document.getElementById('vp-modal-title');
        if (titleEl) titleEl.textContent = `버티포트 현황 — ${v.name}`;

        // Update KPI: 가용 스탠드, 가용 FATO dynamically
        const kpiCards = document.querySelectorAll('#vp-status-modal .vp-kpi-card');
        if (kpiCards[0]) kpiCards[0].querySelector('.vp-kpi-value').textContent = `${v.stands} / ${v.stands}`;
        if (kpiCards[1]) kpiCards[1].querySelector('.vp-kpi-value').textContent = `${v.fato} / ${v.fato}`;

        // Swap diagram image per vertiport
        const VP_DIAGRAM_MAP = {
            'VP-01': '../images/vp_01.png',
            'VP-02': '../images/vp_02.png',
            'VP-03': '../images/vp_03.png',
        };
        const diagImg = document.getElementById('vp-diagram-img');
        if (diagImg) diagImg.src = VP_DIAGRAM_MAP[v.id] || '../images/vp_default.png';

        const standEl = document.getElementById('vp-modal-stand');
        if (standEl) {
            standEl.textContent = v.stand;
            standEl.className = v.stand === '\uac00\uc6a9' ? 'badge badge-success' : 'badge badge-danger';
        }

        const crowdEl = document.getElementById('vp-modal-crowd');
        if (crowdEl) {
            crowdEl.textContent = v.crowd;
            if (v.crowd === '\ub0ae\uc74c') crowdEl.className = 'badge badge-success';
            else if (v.crowd === '\ubcf4\ud1b5') crowdEl.className = 'badge badge-warning';
            else if (v.crowd === '\ub192\uc74c') crowdEl.className = 'badge badge-danger';
            else crowdEl.className = 'badge';
        }

        // Populate ops table
        const tbody = document.getElementById('vp-ops-tbody');
        if (tbody) {
            tbody.innerHTML = VP_OPS_DATA.map(r => {
                const d = r._delay;
                const dCls = d > 10 ? 'text-error' : (d > 5 ? 'text-warning' : '');
                const sCls = r.State === 'DEP' ? 'badge badge-success' : 'badge badge-info';
                return `<tr>
                    <td class="font-semibold"><span class="badge badge-outline">${r.call}</span></td>
                    <td>${r.dest}</td>
                    <td>${r.ac}</td>
                    <td>${r.pp}</td>
                    <td>${r.EOBT}</td>
                    <td>${r.TOBT}</td>
                    <td>${r.TSAT}</td>
                    <td class="${dCls}">${r.Delay}</td>
                    <td>${r.AOBT}</td>
                    <td>${r.FATO}</td>
                    <td>${r.CTOT}</td>
                    <td>${r.TTOT}</td>
                    <td>${r.ATOT}</td>
                    <td>${r.SID}</td>
                    <td>${r.SOBT}</td>
                    <td>${r.WTC}</td>
                    <td><span class="${sCls}">${r.State}</span></td>
                    <td>${r.ASRT}</td>
                </tr>`;
            }).join('');
        }

        modal.classList.add('active');
        if (window.lucide) lucide.createIcons();

        // Initialize timeline after modal is visible
        setTimeout(() => initVpTimeline(v), 50);
    };

    function initVpTimeline(v) {
        const cvs = document.getElementById('vp-timeline');
        if (!cvs) return;
        const ctx = cvs.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const nowFn = () => new Date();
        const addMin = (d, m) => new Date(d.getTime() + m * 60000);

        // Build flight data from VP_OPS_DATA
        const now = nowFn();
        const depFlights = VP_OPS_DATA.slice(0, 3).map((r, i) => {
            const base = -25 + i * 15;
            const t0 = addMin(now, base);
            const t1 = addMin(t0, parseInt(r.delay) || 3);
            return { id: r.call, t0, t1, delay: parseInt(r.delay) || 0 };
        });
        const arrFlights = [
            { id: 'AR201', t0: addMin(now, -18), t1: addMin(now, -14), delay: -4 },
            { id: 'AR305', t0: addMin(now, -5), t1: addMin(now, 0), delay: 5 },
            { id: 'AR412', t0: addMin(now, 8), t1: addMin(now, 13), delay: 5 },
        ];

        let span = 60 * 60 * 1000; // 1h window
        let center = now.getTime();
        let dragging = false, dragStartX = 0, dragStartCenter = center;
        let hitArr = [];

        function resize() {
            const parent = cvs.parentElement;
            const W = parent.clientWidth;
            const H = 90;
            cvs.style.width = W + 'px';
            cvs.style.height = H + 'px';
            cvs.width = Math.floor(W * dpr);
            cvs.height = Math.floor(H * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        function worldToX(t) {
            const W = cvs.width / dpr;
            return (t - (center - span / 2)) * (W / span);
        }
        function xToWorld(x) {
            const W = cvs.width / dpr;
            return (center - span / 2) + x * (span / W);
        }

        const colorByDelay = d => d > 10 ? 'rgba(248,113,113,1)' : (d > 0 ? 'rgba(251,191,36,1)' : 'rgba(45,212,191,1)');

        function draw() {
            hitArr = [];
            const W = cvs.width / dpr;
            const H = cvs.height / dpr;
            ctx.clearRect(0, 0, W, H);
            ctx.fillStyle = 'rgba(15,23,42,0.15)';
            ctx.fillRect(0, 0, W, H);

            // Separator line
            ctx.strokeStyle = 'rgba(51,65,85,0.4)';
            ctx.beginPath(); ctx.moveTo(0, H / 2); ctx.lineTo(W, H / 2); ctx.stroke();

            // Tick marks & labels
            let step = 15 * 60000;
            if (span <= 30 * 60000) step = 5 * 60000;
            const tStart = xToWorld(0), tEnd = xToWorld(W);
            const first = Math.ceil(tStart / step) * step;
            ctx.fillStyle = 'rgba(148,163,184,0.7)';
            ctx.font = `10px ui-sans-serif`;
            for (let t = first; t <= tEnd; t += step) {
                const x = worldToX(t);
                ctx.strokeStyle = 'rgba(51,65,85,0.3)';
                ctx.beginPath(); ctx.moveTo(x, 20); ctx.lineTo(x, H - 20); ctx.stroke();
                const d = new Date(t);
                const lab = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
                ctx.fillText(lab, x - 12, 14);
            }

            // Draw dots
            const drawDot = (f, y, isArr) => {
                const x = worldToX(f.t0.getTime());
                ctx.beginPath();
                ctx.arc(x, y, 5, 0, Math.PI * 2);
                ctx.fillStyle = isArr ? 'rgba(99,179,237,0.9)' : colorByDelay(f.delay);
                ctx.fill();
                ctx.strokeStyle = '#0b1a2b'; ctx.lineWidth = 1.5; ctx.stroke(); ctx.lineWidth = 1;
                ctx.fillStyle = 'rgba(255,255,255,0.6)';
                ctx.font = '9px ui-sans-serif';
                ctx.fillText(f.id, x + 8, y + 4);
                hitArr.push({ x, y, f, isArr });
            };

            depFlights.forEach(f => drawDot(f, H * 0.28, false));
            arrFlights.forEach(f => drawDot(f, H * 0.72, true));

            // Now marker
            const nowX = worldToX(now.getTime());
            const marker = document.getElementById('vp-tl-now-marker');
            if (marker) {
                marker.style.left = Math.max(0, nowX) + 'px';
                marker.style.height = H + 'px';
            }
        }

        function zoomAt(px, factor) {
            const tb = xToWorld(px);
            span = Math.max(5 * 60000, Math.min(24 * 3600000, span * factor));
            const ta = xToWorld(px);
            center += (tb - ta);
            draw();
        }

        // Zoom buttons
        const plusBtn = document.getElementById('vp-tl-plus');
        const minusBtn = document.getElementById('vp-tl-minus');
        const nowBtn = document.getElementById('vp-tl-now');
        if (plusBtn) plusBtn.onclick = () => zoomAt(cvs.clientWidth / 2, 0.7);
        if (minusBtn) minusBtn.onclick = () => zoomAt(cvs.clientWidth / 2, 1.3);
        if (nowBtn) nowBtn.onclick = () => { center = nowFn().getTime(); draw(); };

        // Wheel zoom
        cvs.addEventListener('wheel', e => {
            e.preventDefault();
            const rect = cvs.getBoundingClientRect();
            zoomAt(e.clientX - rect.left, e.deltaY < 0 ? 0.85 : 1.15);
        }, { passive: false });

        // Drag pan
        cvs.addEventListener('mousedown', e => { dragging = true; dragStartX = e.clientX; dragStartCenter = center; });
        window.addEventListener('mouseup', () => dragging = false);
        cvs.addEventListener('mousemove', e => {
            if (dragging) {
                const dx = e.clientX - dragStartX;
                const W = cvs.getBoundingClientRect().width;
                center = dragStartCenter - dx * (span / W);
                draw();
                return;
            }
            // Tooltip
            const rect = cvs.getBoundingClientRect();
            const mx = e.clientX - rect.left, my = e.clientY - rect.top;
            const tip = document.getElementById('vp-tl-tip');
            let best = null, bestD = 1e9;
            for (const p of hitArr) {
                const dx = mx - p.x, dy = my - p.y;
                const d2 = dx * dx + dy * dy;
                if (d2 < 81 && d2 < bestD) { best = p; bestD = d2; }
            }
            if (tip) {
                if (best) {
                    const d = best.f.delay;
                    tip.textContent = `${best.f.id} · ${String(best.f.t0.getHours()).padStart(2, '0')}:${String(best.f.t0.getMinutes()).padStart(2, '0')} · 지연 ${d > 0 ? '+' : ''}${d}분`;
                    tip.style.left = (mx + 12) + 'px'; tip.style.top = (my - 8) + 'px'; tip.style.display = 'block';
                } else { tip.style.display = 'none'; }
            }
        });
        cvs.addEventListener('mouseleave', () => {
            const tip = document.getElementById('vp-tl-tip');
            if (tip) tip.style.display = 'none';
        });

        resize();
        draw();
    }

    // Map Image Enlargement
    const vpDiagramImg = document.getElementById('vp-diagram-img');
    const vpDiagramPanel = document.getElementById('vp-diagram-panel');
    const vpDiagramTools = document.getElementById('vp-diagram-tools');
    const btnVpDiagramShrink = document.getElementById('btn-vp-diagram-shrink');
    const btnVpDiagramZoomIn = document.getElementById('btn-vp-diagram-zoom-in');
    const btnVpDiagramZoomOut = document.getElementById('btn-vp-diagram-zoom-out');
    const btnVpDiagramReset = document.getElementById('btn-vp-diagram-reset');

    let currentZoom = 1;
    let panX = 0;
    let panY = 0;
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let hasDragged = false;

    function applyTransform() {
        if (vpDiagramImg) {
            vpDiagramImg.style.transform = `translate(${panX}px, ${panY}px) scale(${currentZoom})`;
        }
    }

    if (vpDiagramImg && vpDiagramPanel && vpDiagramTools && btnVpDiagramShrink) {
        vpDiagramImg.addEventListener('click', (e) => {
            if (hasDragged) return; // Prevent open if it was a drag
            if (!vpDiagramPanel.classList.contains('full-size')) {
                vpDiagramPanel.classList.add('full-size');
                vpDiagramTools.classList.remove('hidden');
                currentZoom = 1; panX = 0; panY = 0;
                applyTransform();
            }
        });

        btnVpDiagramZoomIn?.addEventListener('click', (e) => {
            e.stopPropagation();
            currentZoom += 0.2;
            applyTransform();
        });

        btnVpDiagramZoomOut?.addEventListener('click', (e) => {
            e.stopPropagation();
            currentZoom = Math.max(0.5, currentZoom - 0.2);
            applyTransform();
        });

        btnVpDiagramReset?.addEventListener('click', (e) => {
            e.stopPropagation();
            currentZoom = 1; panX = 0; panY = 0;
            applyTransform();
        });

        btnVpDiagramShrink.addEventListener('click', (e) => {
            e.stopPropagation();
            vpDiagramPanel.classList.remove('full-size');
            vpDiagramTools.classList.add('hidden');
            currentZoom = 1; panX = 0; panY = 0;
            vpDiagramImg.style.transform = '';
        });

        // Wheel to zoom
        vpDiagramPanel.addEventListener('wheel', (e) => {
            if (!vpDiagramPanel.classList.contains('full-size')) return;
            e.preventDefault();

            const zoomStep = 0.1;
            const prevZoom = currentZoom;

            if (e.deltaY < 0) {
                currentZoom += zoomStep; // Zoom in
            } else {
                currentZoom = Math.max(0.2, currentZoom - zoomStep); // Zoom out, min 0.2x
            }

            // Adjust pan to zoom towards mouse cursor
            const rect = vpDiagramPanel.getBoundingClientRect();
            // Mouse position relative to center of panel
            const mx = e.clientX - (rect.left + rect.width / 2);
            const my = e.clientY - (rect.top + rect.height / 2);

            // Adjust pan so the point under the mouse stays in the same place
            panX -= mx * (currentZoom / prevZoom - 1);
            panY -= my * (currentZoom / prevZoom - 1);

            applyTransform();
        }, { passive: false });

        // Drag to pan
        vpDiagramPanel.addEventListener('mousedown', (e) => {
            if (!vpDiagramPanel.classList.contains('full-size')) return;
            if (e.target.closest('.vp-diagram-tools')) return; // Ignore clicks on tools

            e.preventDefault(); // prevent native image drag
            isDragging = true;
            hasDragged = false;
            startX = e.clientX - panX;
            startY = e.clientY - panY;
            vpDiagramPanel.classList.add('dragging');
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            hasDragged = true;
            panX = e.clientX - startX;
            panY = e.clientY - startY;
            applyTransform();
        });

        const stopDrag = () => {
            if (isDragging) {
                isDragging = false;
                vpDiagramPanel.classList.remove('dragging');
                // Use a short timeout to prevent click from firing right after mouseup
                setTimeout(() => hasDragged = false, 50);
            }
        };

        window.addEventListener('mouseup', stopDrag);
        // Ensure drag stops if mouse leaves window
        document.addEventListener('mouseleave', stopDrag);
    }

    window.closeVpModal = () => {
        const modal = document.getElementById('vp-status-modal');
        if (modal) modal.classList.remove('active');
        // Reset full size when closing
        if (vpDiagramPanel && vpDiagramTools) {
            vpDiagramPanel.classList.remove('full-size');
            vpDiagramTools.classList.add('hidden');
            currentZoom = 1; panX = 0; panY = 0;
            if (vpDiagramImg) vpDiagramImg.style.transform = '';
        }
    };

    // === Flight Ops Stat Modal Logic ===
    const flightOpsStatModal = document.getElementById('flight-ops-stat-modal');
    const btnMoreFlightOps = document.getElementById('btn-more-flight-ops');
    let flightOpsChartInstance = null;

    if (btnMoreFlightOps) {
        btnMoreFlightOps.onclick = () => openFlightOpsStatModal();
    }

    window.openFlightOpsStatModal = () => {
        if (flightOpsStatModal) flightOpsStatModal.classList.add('active');

        // Populate Vertiport Select if empty or needs refresh
        const vpSelectModal = document.getElementById('flight-ops-vp-select-modal');
        if (vpSelectModal) {
            vpSelectModal.innerHTML = '<option value="ALL">전체</option>' +
                vertiports.map(v => `<option value="${v.id}">${v.name}</option>`).join('');

            // Inherit from parent selection
            if (activeVpId) {
                vpSelectModal.value = activeVpId;
            } else {
                vpSelectModal.value = 'ALL';
            }
        }

        // Ensure filter is collapsed
        const filterContent = document.getElementById('flight-ops-filter-content');
        const filterChevron = document.getElementById('flight-ops-filter-chevron');
        if (filterContent) filterContent.classList.add('hidden');
        if (filterChevron) {
            filterChevron.setAttribute('data-lucide', 'chevron-down');
            if (window.lucide) lucide.createIcons();
        }

        // Set Defaults
        const periodTypeSelect = document.getElementById('flight-ops-period-type');
        if (periodTypeSelect) periodTypeSelect.value = 'daily';

        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const dateStr = `${yyyy}-${mm}-${dd}`;

        const startInput = document.getElementById('flight-ops-start-date');
        const endInput = document.getElementById('flight-ops-end-date');
        if (startInput) startInput.value = dateStr;
        if (endInput) endInput.value = dateStr;

        updateFlightOpsDateInputs();

        // Render initial chart (optional, but requested "on search", 
        // however usually users expect something on first open. 
        // Let's call it once to show data.)
        renderFlightOpsChart();
    };

    window.closeFlightOpsStatModal = () => {
        if (flightOpsStatModal) flightOpsStatModal.classList.remove('active');
    };

    window.toggleFlightOpsFilter = () => {
        const content = document.getElementById('flight-ops-filter-content');
        const chevron = document.getElementById('flight-ops-filter-chevron');
        if (!content || !chevron) return;

        const isHidden = content.classList.contains('hidden');
        if (isHidden) {
            content.classList.remove('hidden');
            chevron.setAttribute('data-lucide', 'chevron-up');
        } else {
            content.classList.add('hidden');
            chevron.setAttribute('data-lucide', 'chevron-down');
        }
        if (window.lucide) lucide.createIcons();
    };

    window.updateFlightOpsDateInputs = () => {
        const periodType = document.getElementById('flight-ops-period-type')?.value || 'daily';
        const startDateInput = document.getElementById('flight-ops-start-date');
        const endDateInput = document.getElementById('flight-ops-end-date');
        const dateSep = document.getElementById('flight-ops-date-sep');
        const dateLabel = document.getElementById('flight-ops-date-label');

        if (!startDateInput || !endDateInput) return;

        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');

        if (periodType === 'daily') {
            if (dateLabel) dateLabel.textContent = '대상 일';
            startDateInput.type = 'date';
            const dd = String(today.getDate()).padStart(2, '0');
            startDateInput.value = `${yyyy}-${mm}-${dd}`;
            endDateInput.style.display = 'none'; // Only one date for Daily as per request
            if (dateSep) dateSep.style.display = 'none';
        } else {
            if (periodType === 'weekly') {
                if (dateLabel) dateLabel.textContent = '대상 주';
                startDateInput.type = 'week';
                // Current week calculation
                const d = new Date();
                d.setHours(0, 0, 0, 0);
                d.setDate(d.getDate() + 4 - (d.getDay() || 7));
                const yearStart = new Date(d.getFullYear(), 0, 1);
                const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
                startDateInput.value = `${d.getFullYear()}-W${String(weekNo).padStart(2, '0')}`;
                endDateInput.style.display = 'none';
                if (dateSep) dateSep.style.display = 'none';
            } else if (periodType === 'monthly') {
                if (dateLabel) dateLabel.textContent = '대상 월';
                startDateInput.type = 'month';
                startDateInput.value = `${yyyy}-${mm}`;
                endDateInput.style.display = 'none';
                if (dateSep) dateSep.style.display = 'none';
            }
        }
    };

    // Add button listeners
    const btnSearch = document.getElementById('btn-flight-ops-search');
    const btnReset = document.getElementById('btn-flight-ops-reset');
    if (btnSearch) btnSearch.onclick = () => renderFlightOpsChart();
    if (btnReset) {
        btnReset.onclick = () => {
            const vpSelect = document.getElementById('flight-ops-vp-select-modal');
            const periodType = document.getElementById('flight-ops-period-type');
            if (vpSelect) vpSelect.value = activeVpId || 'ALL';
            if (periodType) periodType.value = 'daily';
            updateFlightOpsDateInputs();
        };
    }

    function renderFlightOpsChart() {
        const canvas = document.getElementById('flight-ops-modal-chart');
        if (!canvas) return;

        if (flightOpsChartInstance) {
            flightOpsChartInstance.destroy();
        }

        const ctx = canvas.getContext('2d');
        const periodType = document.getElementById('flight-ops-period-type')?.value || 'daily';

        let labels = [];
        let normalData = [];
        let delayData = [];
        let cancelData = [];

        const chartTitle = document.getElementById('flight-ops-chart-title');
        const startDateVal = document.getElementById('flight-ops-start-date')?.value;
        const selectedDate = startDateVal ? new Date(startDateVal) : new Date();

        if (chartTitle) chartTitle.textContent = "운항 통계";

        if (periodType === 'daily') {
            const today = new Date();
            let limitHour = 23;

            // If selectedDate is today, limit to current hour
            if (selectedDate.getFullYear() === today.getFullYear() &&
                selectedDate.getMonth() === today.getMonth() &&
                selectedDate.getDate() === today.getDate()) {
                limitHour = today.getHours();
            }

            for (let i = 0; i <= limitHour; i++) {
                labels.push(`${String(i).padStart(2, '0')}:00`);
                normalData.push(Math.floor(Math.random() * 5) + 2);
                delayData.push(Math.floor(Math.random() * 2));
                cancelData.push(Math.floor(Math.random() * 1.5));
            }
        } else if (periodType === 'weekly') {
            labels = ['월', '화', '수', '목', '금', '토', '일'];
            normalData = [45, 52, 48, 50, 60, 30, 25];
            delayData = [4, 2, 5, 3, 8, 1, 0];
            cancelData = [1, 2, 0, 1, 3, 0, 0];
        } else if (periodType === 'monthly') {
            const month = selectedDate.getMonth() + 1;
            const today = new Date();
            let limitDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();

            // If current month, limit to today
            if (selectedDate.getFullYear() === today.getFullYear() && selectedDate.getMonth() === today.getMonth()) {
                limitDay = today.getDate();
            }

            for (let i = 1; i <= limitDay; i++) {
                labels.push(`${month}월 ${i}일`);
                normalData.push(Math.floor(Math.random() * 20) + 30);
                delayData.push(Math.floor(Math.random() * 5));
                cancelData.push(Math.floor(Math.random() * 2));
            }
        }

        // Ensure Chart is available
        if (typeof Chart === 'undefined') return;

        flightOpsChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: '정상',
                        data: normalData,
                        backgroundColor: '#14b8a6', // Success color
                        borderColor: '#0f766e',
                        borderWidth: 1,
                        barThickness: 12
                    },
                    {
                        label: '지연',
                        data: delayData,
                        backgroundColor: '#f97316', // Warning color
                        borderColor: '#c2410c',
                        borderWidth: 1,
                        barThickness: 12
                    },
                    {
                        label: '취소',
                        data: cancelData,
                        backgroundColor: '#ef4444', // Danger color
                        borderColor: '#b91c1c',
                        borderWidth: 1,
                        barThickness: 12
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        stacked: true,
                        grid: { color: '#334155' },
                        ticks: {
                            color: '#94a3b8',
                            callback: function (val, index) {
                                const label = this.getLabelForValue(val);
                                if (periodType === 'monthly') {
                                    const dayMatch = label.match(/(\d+)일/);
                                    if (dayMatch) {
                                        const day = parseInt(dayMatch[1]);
                                        if (day === 1 || day % 5 === 0) return label;
                                    }
                                    return "";
                                }
                                if (periodType === 'daily') {
                                    const hourMatch = label.match(/(\d+):00/);
                                    if (hourMatch) {
                                        const hour = parseInt(hourMatch[1]);
                                        if (hour % 4 === 0) return label; // Show every 4 hours for clarity
                                    }
                                    return "";
                                }
                                return label;
                            }
                        }
                    },
                    y: {
                        stacked: true,
                        grid: { color: '#334155' },
                        ticks: { color: '#94a3b8', stepSize: 5 }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: { color: '#e2e8f0', font: { family: "'Inter', sans-serif" } }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                }
            }
        });
    }

    // Initialize Lucide Icons
    if (window.lucide) lucide.createIcons();
});
