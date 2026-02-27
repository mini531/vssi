document.addEventListener('DOMContentLoaded', () => {

    // ── Shared vertiport data (same 8 Ulsan VPs) ──────────────────────
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

    const events = [
        { time: '12:04:22 UTC', code: 'TG001', msg: 'Mode switch HOLD→CRZ' },
        { time: '12:03:58 UTC', code: 'TG002', msg: 'Battery health check' },
        { time: '12:03:31 UTC', code: 'TG001', msg: 'Altitude change requested 1500→1200' },
        { time: '12:02:47 UTC', code: 'VP-05', msg: '울산역 VP – FATO 1 점검 시작' },
        { time: '12:02:10 UTC', code: 'TG003', msg: 'Geofence boundary warning' },
        { time: '12:01:38 UTC', code: 'VP-08', msg: '울산공항 VP – ATOT 지연 +8분' },
        { time: '12:00:54 UTC', code: 'TG001', msg: 'Wind speed alert: 18kt NE' },
        { time: '12:00:11 UTC', code: 'SYS', msg: 'Data exchange latency spike: 94ms' },
    ];

    // ── ① Vertiport Status Panel ───────────────────────────────────────
    const container = document.getElementById('vp-view-container');
    const cardBtn = document.getElementById('vp-card-btn');
    const listBtn = document.getElementById('vp-list-btn');
    let activeVpId = null;

    const statusTheme = v => {
        if (v === '가용' || v === '낮음') return 'success';
        if (v === '보통') return 'warning';
        return 'error';
    };

    const mapTitleEl = document.getElementById('db-map-vp-name');

    function selectVp(vpId) {
        activeVpId = vpId;
        // Highlight active item
        container.querySelectorAll('[data-vp-id]').forEach(el => {
            el.classList.toggle('active', el.dataset.vpId === vpId);
        });
        // Update title with VP name
        const vp = vertiports.find(v => v.id === vpId);
        if (mapTitleEl && vp) mapTitleEl.innerHTML = ` <span class="text-primary"> - </span><span class="text-accent-teal">${vp.name}</span>`;
        // Show diagram on right panel
        if (typeof showDiagram === 'function') showDiagram(vpId);
    }

    function renderCardView() {
        container.innerHTML = `<ul class="vp-card-grid list-none p-0">${vertiports.map(v => {
            const sT = statusTheme(v.stand), cT = statusTheme(v.crowd);
            const act = activeVpId === v.id ? ' active' : '';
            return `<li class="vp-card${act}" data-vp-id="${v.id}">
                <article>
                    <h3 class="vp-card-name">${v.name}</h3>
                    <div class="vp-card-body">
                        <div class="vp-card-status-col">
                            <div class="mon-stat-row">
                                <span class="mon-stat-label">STAND</span>
                                <span class="mon-stat-dot bg-${sT}"></span>
                                <span class="mon-stat-value text-${sT}">${v.stand}</span>
                            </div>
                            <div class="mon-stat-row">
                                <span class="mon-stat-label">혼잡도</span>
                                <span class="mon-stat-dot bg-${cT}"></span>
                                <span class="mon-stat-value text-${cT}">${v.crowd}</span>
                            </div>
                        </div>
                        <div class="vp-card-spec-col">
                            <span class="vp-card-spec-inline">FATO <strong>${v.fato}</strong></span>
                            <span class="vp-card-spec-inline">STAND <strong>${v.stands}</strong></span>
                        </div>
                    </div>
                </article>
            </li>`;
        }).join('')}</ul>`;
        bindVpClicks();
    }

    function renderListView() {
        const rows = vertiports.map(v => {
            const sT = statusTheme(v.stand);
            const cT = statusTheme(v.crowd);
            const act = activeVpId === v.id ? ' active' : '';
            return `<tr data-vp-id="${v.id}" class="${act}">
                <td>${v.name}</td>
                <td class="td-number">${v.fato}</td>
                <td class="td-number">${v.stands}</td>
                <td class="td-center"><span class="badge badge-${sT}">${v.stand}</span></td>
                <td class="td-center"><span class="badge badge-${cT}">${v.crowd}</span></td>
            </tr>`;
        }).join('');
        container.innerHTML = `
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>버티포트 이름</th>
                            <th class="text-right">FATO 수</th>
                            <th class="text-right">STAND 수</th>
                            <th class="text-center">STAND 상태</th>
                            <th class="text-center">혼잡도</th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>`;
        bindVpClicks();
    }

    function bindVpClicks() {
        container.querySelectorAll('[data-vp-id]').forEach(el => {
            el.addEventListener('click', () => selectVp(el.dataset.vpId));
        });
    }

    // Default: card view
    renderCardView();

    function setActiveBtn(activeEl, inactiveEl) {
        activeEl.classList.add('btn-primary');
        activeEl.classList.remove('btn-secondary');
        inactiveEl.classList.add('btn-secondary');
        inactiveEl.classList.remove('btn-primary');
    }

    cardBtn.addEventListener('click', () => {
        setActiveBtn(cardBtn, listBtn);
        renderCardView();
    });
    listBtn.addEventListener('click', () => {
        setActiveBtn(listBtn, cardBtn);
        renderListView();
    });

    // ── ② Mini Map ─────────────────────────────────────────────────────
    const miniMap = L.map('db-mini-map', {
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: true,
        dragging: true,
        center: [35.548, 129.27],
        zoom: 10
    });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd', maxZoom: 19
    }).addTo(miniMap);

    L.control.zoom({ position: 'bottomright' }).addTo(miniMap);

    // Diagram overlay elements
    const diagramOverlay = document.getElementById('db-diagram-overlay');
    const diagramImg = document.getElementById('db-diagram-img');
    const diagramBackBtn = document.getElementById('db-diagram-back');
    const mapEl = document.getElementById('db-mini-map');

    const VP_DIAGRAM_MAP = {
        'VP-01': '../images/vp_01.png',
        'VP-02': '../images/vp_02.png',
        'VP-03': '../images/vp_03.png',
    };

    const mapTitleTextEl = document.getElementById('db-map-title-text');

    function showDiagram(vpId) {
        const src = VP_DIAGRAM_MAP[vpId] || '../images/vp_default.png';
        diagramImg.src = src;
        mapEl.classList.add('hidden');
        diagramOverlay.classList.remove('hidden');
        if (diagramBackBtn) diagramBackBtn.classList.remove('hidden');
        if (mapTitleTextEl) mapTitleTextEl.textContent = '버티포트 배치도';
    }

    function showMap() {
        diagramOverlay.classList.add('hidden');
        mapEl.classList.remove('hidden');
        miniMap.invalidateSize();
        if (mapTitleEl) mapTitleEl.textContent = '';
        if (mapTitleTextEl) mapTitleTextEl.textContent = '버티포트 위치';
        // Clear active state on left panel
        activeVpId = null;
        container.querySelectorAll('[data-vp-id]').forEach(el => el.classList.remove('active'));
        if (diagramBackBtn) diagramBackBtn.classList.add('hidden');
    }

    if (diagramBackBtn) {
        diagramBackBtn.addEventListener('click', showMap);
    }

    // Map Image Modal
    const mapImageModal = document.getElementById('map-image-modal');
    const mapModalTitle = document.getElementById('map-modal-title');
    const mapModalImg = document.getElementById('map-modal-img');

    if (diagramImg) {
        diagramImg.style.cursor = 'pointer';
        diagramImg.addEventListener('click', () => {
            if (mapImageModal && activeVpId) {
                const vp = vertiports.find(v => v.id === activeVpId);
                if (vp) {
                    if (mapModalTitle) mapModalTitle.textContent = `버티포트 배치도 - ${vp.name}`;
                    if (mapModalImg) mapModalImg.src = diagramImg.src;
                    mapImageModal.classList.add('active');
                }
            }
        });
    }

    window.closeMapImageModal = () => {
        if (mapImageModal) mapImageModal.classList.remove('active');
        currentDbZoom = 1; dbPanX = 0; dbPanY = 0;
        if (mapModalImg) mapModalImg.style.transform = '';
    };

    // Map Image Modal Zoom & Pan logic
    const btnDbMapZoomIn = document.getElementById('btn-db-map-zoom-in');
    const btnDbMapZoomOut = document.getElementById('btn-db-map-zoom-out');
    const btnDbMapReset = document.getElementById('btn-db-map-reset');
    const mapModalContent = document.querySelector('.modal-map-content');

    let currentDbZoom = 1;
    let dbPanX = 0;
    let dbPanY = 0;
    let isDbDragging = false;
    let dbStartX = 0;
    let dbStartY = 0;
    let hasDbDragged = false;

    function applyDbMapTransform() {
        if (mapModalImg) {
            mapModalImg.style.transform = `translate(${dbPanX}px, ${dbPanY}px) scale(${currentDbZoom})`;
        }
    }

    if (mapModalImg && mapModalContent) {
        btnDbMapZoomIn?.addEventListener('click', (e) => {
            e.stopPropagation();
            currentDbZoom += 0.2;
            applyDbMapTransform();
        });

        btnDbMapZoomOut?.addEventListener('click', (e) => {
            e.stopPropagation();
            currentDbZoom = Math.max(0.5, currentDbZoom - 0.2);
            applyDbMapTransform();
        });

        btnDbMapReset?.addEventListener('click', (e) => {
            e.stopPropagation();
            currentDbZoom = 1; dbPanX = 0; dbPanY = 0;
            applyDbMapTransform();
        });

        // Wheel to zoom
        mapModalContent.addEventListener('wheel', (e) => {
            e.preventDefault();

            const zoomStep = 0.1;
            const prevZoom = currentDbZoom;

            if (e.deltaY < 0) {
                currentDbZoom += zoomStep; // Zoom in
            } else {
                currentDbZoom = Math.max(0.2, currentDbZoom - zoomStep); // Zoom out, min 0.2x
            }

            // Adjust pan to zoom towards mouse cursor
            const rect = mapModalContent.getBoundingClientRect();
            // Mouse position relative to center of panel
            const mx = e.clientX - (rect.left + rect.width / 2);
            const my = e.clientY - (rect.top + rect.height / 2);

            // Adjust pan so the point under the mouse stays in the same place
            dbPanX -= mx * (currentDbZoom / prevZoom - 1);
            dbPanY -= my * (currentDbZoom / prevZoom - 1);

            applyDbMapTransform();
        }, { passive: false });

        // Drag to pan
        mapModalContent.addEventListener('mousedown', (e) => {
            if (e.target.closest('.modal-map-tools')) return; // Ignore clicks on tools

            e.preventDefault(); // prevent native image drag
            isDbDragging = true;
            hasDbDragged = false;
            dbStartX = e.clientX - dbPanX;
            dbStartY = e.clientY - dbPanY;
            mapModalContent.classList.add('dragging');
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDbDragging) return;
            hasDbDragged = true;
            dbPanX = e.clientX - dbStartX;
            dbPanY = e.clientY - dbStartY;
            applyDbMapTransform();
        });

        const stopDbDrag = () => {
            if (isDbDragging) {
                isDbDragging = false;
                mapModalContent.classList.remove('dragging');
                // Use a short timeout to prevent click from firing right after mouseup
                setTimeout(() => hasDbDragged = false, 50);
            }
        };

        window.addEventListener('mouseup', stopDbDrag);
        // Ensure drag stops if mouse leaves window
        document.addEventListener('mouseleave', stopDbDrag);
    }

    vertiports.forEach(v => {
        let baseColor = '#14b8a6'; // 낮음 (Success)
        let hoverColor = '#5eead4';

        if (v.crowd === '보통') {
            baseColor = '#f59e0b'; // 보통 (Warning)
            hoverColor = '#fbbf24';
        } else if (v.crowd === '높음') {
            baseColor = '#ef4444'; // 높음 (Danger)
            hoverColor = '#fca5a5';
        }
        const dot = L.circleMarker([v.lat, v.lng], {
            radius: 6,
            color: baseColor,
            fillColor: baseColor,
            fillOpacity: 0.9,
            weight: 1.5
        }).addTo(miniMap);
        dot.bindTooltip(v.name, { permanent: false, direction: 'top', className: 'leaflet-tooltip' });
        dot.on('click', () => selectVp(v.id));
        dot.on('mouseover', () => {
            dot.setRadius(9);
            dot.setStyle({ color: hoverColor, fillColor: hoverColor, weight: 2.5 });
        });
        dot.on('mouseout', () => {
            dot.setRadius(6);
            dot.setStyle({ color: baseColor, fillColor: baseColor, weight: 1.5 });
        });
    });

    // ── ③ Infra Canvas ─────────────────────────────────────────────────
    const infraCanvas = document.getElementById('db-infra-canvas');
    if (infraCanvas) {
        const ctx = infraCanvas.getContext('2d');
        const container = infraCanvas.parentElement;
        const dpr = window.devicePixelRatio || 1;
        let layoutScale = 1;

        function resize() {
            const rect = container.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) return;

            infraCanvas.width = rect.width * dpr;
            infraCanvas.height = rect.height * dpr;
            infraCanvas.style.width = rect.width + 'px';
            infraCanvas.style.height = rect.height + 'px';
            ctx.scale(dpr, dpr);

            // Calculate scale based on container width
            layoutScale = Math.min(1.2, rect.width / 340);
        }

        const resizeObserver = new ResizeObserver(() => {
            resize();
        });
        resizeObserver.observe(container);

        // Initial call after small delay to let grid settle
        requestAnimationFrame(() => {
            resize();
        });

        let hoveredNode = null;
        let centerX = 0, centerY = 0;

        const nodes = [
            { name: 'DATA #1', relX: -115, relY: -40 },
            { name: 'DATA #2', relX: -115, relY: 0 },
            { name: 'DATA #3', relX: -115, relY: 40 },
            { name: 'RADAR #1', relX: 115, relY: -40 },
            { name: 'RADAR #2', relX: 115, relY: 0 },
            { name: 'RADAR #3', relX: 115, relY: 40 },
            { name: '5G #1', relX: -70, relY: -65 },
            { name: '5G #2', relX: 70, relY: -65 },
            { name: 'LEO', relX: 0, relY: 60 }
        ];

        let offset = 0;
        function draw() {
            ctx.clearRect(0, 0, infraCanvas.width / dpr, infraCanvas.height / dpr);
            centerX = infraCanvas.width / (2 * dpr);
            centerY = infraCanvas.height / (2 * dpr);

            // 1. Draw Links
            nodes.forEach(n => {
                const nx = centerX + (n.relX * layoutScale);
                const ny = centerY + (n.relY * layoutScale);
                const isHovered = hoveredNode === n;

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
                const nx = centerX + (n.relX * layoutScale);
                const ny = centerY + (n.relY * layoutScale);
                const isHovered = hoveredNode === n;

                const nw = 70 * Math.max(0.85, layoutScale);
                const nh = 24 * Math.max(0.85, layoutScale);

                ctx.fillStyle = isHovered ? '#334155' : 'rgba(30, 41, 59, 1)';
                ctx.fillRect(nx - nw / 2, ny - nh / 2, nw, nh);
                ctx.strokeStyle = isHovered ? '#2dd4bf' : '#14b8a6';
                ctx.lineWidth = isHovered ? 2 : 1;
                ctx.strokeRect(nx - nw / 2, ny - nh / 2, nw, nh);

                ctx.fillStyle = isHovered ? '#fff' : '#e2e8f0';
                ctx.font = isHovered ? `bold ${10 * Math.max(0.9, layoutScale)}px Inter` : `500 ${10 * Math.max(0.9, layoutScale)}px Inter`;
                ctx.textAlign = 'center';
                ctx.fillText(n.name, nx, ny + (4 * Math.max(0.85, layoutScale)));
            });

            // 3. Draw Center Hub
            const hubR = 24 * Math.max(0.85, layoutScale);
            ctx.beginPath();
            ctx.arc(centerX, centerY, hubR, 0, Math.PI * 2);
            ctx.strokeStyle = '#2dd4bf';
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.fillStyle = '#0f172a';
            ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.font = `bold ${12 * Math.max(0.9, layoutScale)}px Inter`;
            ctx.textAlign = 'center';
            ctx.fillText('VSSI', centerX, centerY + (4 * Math.max(0.85, layoutScale)));

            offset += 0.5;
            requestAnimationFrame(draw);
        }

        draw();

        infraCanvas.addEventListener('mousemove', (e) => {
            const rect = infraCanvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            let prevHovered = hoveredNode;
            hoveredNode = null;
            nodes.forEach(n => {
                const nx = centerX + (n.relX * layoutScale);
                const ny = centerY + (n.relY * layoutScale);
                const nw = 70 * Math.max(0.85, layoutScale);
                const nh = 24 * Math.max(0.85, layoutScale);

                if (mouseX >= nx - nw / 2 && mouseX <= nx + nw / 2 &&
                    mouseY >= ny - nh / 2 && mouseY <= ny + nh / 2) {
                    hoveredNode = n;
                }
            });

            if (prevHovered !== hoveredNode) {
                infraCanvas.style.cursor = hoveredNode ? 'pointer' : 'default';
            }
        });

        infraCanvas.addEventListener('click', (e) => {
            if (hoveredNode) {
                openHardwareModal(hoveredNode.name);
            }
        });
    }

    // ── ④ Infrastructure Modal & Charts ───────────────────────────────
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

            const primaryColor = type === 'net' ? '#14b8a6' : '#3b82f6';
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
            if (status === 'warning') {
                statusEl.textContent = '지연';
                statusEl.className = 'badge badge-warning';
            } else if (status === 'fault') {
                statusEl.textContent = '장애';
                statusEl.className = 'badge badge-error';
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
        if (usageBarEl) usageBarEl.style.width = `${usagePercent}%`;
    };

    window.closeMonitoringModal = () => {
        const modal = document.getElementById('monitoring-detail-modal');
        if (modal) modal.classList.remove('active');
        ChartManager.stopAll();
    };

    // ── ⑤ Event Log ────────────────────────────────────────────────────
    const logBody = document.getElementById('db-log-body');
    const btnMoreLog = document.getElementById('btn-more-log');
    const eventLogModal = document.getElementById('event-log-modal');
    const modalTbody = document.getElementById('modal-event-tbody');

    const mockLogs = [
        { date: '2026년 2월 26일', time: '12:04:22 UTC', code: 'TG001', msg: 'Mode switch HOLD→CRZ', type: 'INFO' },
        { date: '2026년 2월 26일', time: '12:03:58 UTC', code: 'TG002', msg: 'Battery health check', type: 'INFO' },
        { date: '2026년 2월 26일', time: '12:03:31 UTC', code: 'TG001', msg: 'Altitude change requested 1500→1200', type: 'INFO' },
        { date: '2026년 2월 26일', time: '12:02:47 UTC', code: 'VP-05', msg: '울산역 VP – FATO 1 점검 시작', type: 'INFO' },
        { date: '2026년 2월 26일', time: '12:02:10 UTC', code: 'TG003', msg: 'Geofence boundary warning', type: 'WARN' },
        { date: '2026년 2월 26일', time: '12:01:38 UTC', code: 'VP-08', msg: '울산공항 VP – ATOT 지연 +8분', type: 'WARN' },
        { date: '2026년 2월 26일', time: '12:00:54 UTC', code: 'TG001', msg: 'Wind speed alert: 18kt NE', type: 'WARN' },
        { date: '2026년 2월 26일', time: '12:00:11 UTC', code: 'SYS', msg: 'Data exchange latency spike: 94ms', type: 'ERROR' },
    ];

    function renderSummaryLogs() {
        if (!logBody) return;
        logBody.innerHTML = events.slice(0, 3).map(e => `
            <li class="mon-timeline-item">
                <time class="mon-timeline-time" datetime="${e.time}">${e.time}</time>
                <div class="mon-timeline-marker"></div>
                <div class="mon-timeline-content">
                    <code class="mon-timeline-code">${e.code}</code>
                    <span class="mon-timeline-text">${e.msg}</span>
                </div>
            </li>
        `).join('');
    }

    function renderModalLogs() {
        if (!modalTbody) return;
        modalTbody.innerHTML = '';
        mockLogs.forEach(log => {
            const tr = document.createElement('tr');
            tr.className = 'data-table-row';
            const dateTime = `${log.date} ${log.time.replace(' UTC', '')}`;
            // Use time tag for the first column
            tr.innerHTML = `
                <td class="td-date text-center"><time datetime="${log.date} ${log.time}">${dateTime}</time></td>
                <td class="td-center"><code class="badge badge-purple">${log.code}</code></td>
                <td>${log.msg}</td>
            `;
            modalTbody.appendChild(tr);
        });
        const totalEl = document.getElementById('modal-log-total');
        if (totalEl) totalEl.textContent = `총 ${mockLogs.length} 건`;
    }

    if (btnMoreLog) {
        btnMoreLog.onclick = () => {
            if (eventLogModal) eventLogModal.classList.add('active');
            renderModalLogs();
            const today = new Date().toISOString().split('T')[0];
            const startEl = document.getElementById('log-start-date');
            const endEl = document.getElementById('log-end-date');
            if (startEl) startEl.value = today;
            if (endEl) endEl.value = today;
        };
    }

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


    // ── ④ Row 3: Stats, Load, Top Flights, Notice ──────────────────────────
    function renderOpsStats() {
        const container = document.getElementById('db-ops-stats-container');
        if (!container) return;
        const stats = [
            { label: '전체 운항 건수', value: 33, color: 'text-white' },
            { label: '정상 운항', value: 17, color: 'text-success' },
            { label: '지연 운항', value: 13, color: 'text-warning' },
            { label: '취소 운항', value: 3, color: 'text-error' }
        ];

        container.innerHTML = `<ul class="list-none p-0 m-0 space-y-2 mt-1">${stats.map(s => `
            <li class="db-stat-item">
                <span class="db-stat-label">${s.label}</span>
                <span class="db-stat-value ${s.color}">${s.value}</span>
            </li>
        `).join('')}</ul>`;
    }

    function renderSystemLoad() {
        const container = document.getElementById('db-sys-load-container');
        if (!container) return;
        const loads = [
            { id: 'CPU', val: 12, unit: '%' },
            { id: '메모리', val: 45, unit: '%' },
            { id: '디스크', val: 5, unit: '%' },
            { id: '네트워크', val: 24, unit: 'Mbps' }
        ];

        container.innerHTML = `
            <div class="grid grid-cols-2 gap-3">${loads.map(l => `
            <div class="db-stat-card">
                <span class="db-card-label">${l.id} (${l.unit})</span>
                <span class="db-card-value db-card-value-md text-accent-teal">${l.val}</span>
            </div>
        `).join('')}</div>`;
    }

    function renderTopFlights() {
        const container = document.getElementById('db-top-flights-container');
        if (!container) return;
        const plans = [
            { id: 'FP-VOS-2024-001', route: '길천 -> 태화강역', time: '14:30' },
            { id: 'FP-VOS-2024-002', route: '울산대공원 -> 자수정 동굴', time: '15:10' },
            { id: 'FP-VOS-2024-003', route: '울산역 -> 울산과학기술원', time: '16:00' },
            { id: 'FP-VOS-2024-004', route: '울산공항 -> 일산해수욕장', time: '17:20' }
        ];

        container.innerHTML = `
            <div class="custom-scrollbar overflow-y-auto max-h-[145px]">
                ${plans.map(p => `
                    <div class="db-feed-item">
                        <div class="flex justify-between items-center mb-1">
                            <span class="text-white font-medium text-xs">${p.id}</span>
                            <span class="db-stat-label">${p.time}</span>
                        </div>
                        <div class="db-notice-sub">${p.route}</div>
                    </div>
                `).join('')}
            </div>`;
    }

    function renderNoticeList() {
        const container = document.getElementById('db-notice-container');
        if (!container) return;
        const notices = [
            { id: '5', title: '[점검] 2024년 3월 정기 시스템 점검 안내', date: '2024.03.10' },
            { id: '4', title: '[공지] 개인정보 처리방침 및 보안 정책 변경 안내', date: '2024.03.01' },
            { id: '3', title: 'IVMS v2.1 기능 업데이트 릴리즈 노트', date: '2024.02.20' }
        ];

        container.innerHTML = notices.map(n => `
            <div class="db-feed-item" onclick="location.href='IVM_CS_01_01.html?id=${n.id}'">
                <div class="db-notice-link text-white mb-1 font-medium truncate">${n.title}</div>
                <div class="db-notice-date">${n.date}</div>
            </div>
        `).join('');
    }

    // Initialize Row 3
    renderOpsStats();
    renderSystemLoad();
    renderTopFlights();
    renderNoticeList();

    renderSummaryLogs();

    // ── Lucide icons ────────────────────────────────────────────────────
    if (window.lucide) lucide.createIcons();
});
