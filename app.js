// App data
let drivers = [];
let tires = [];
let parts = []; // spare parts inventory
let pressureLogs = []; // pressure history entries
let blankingLogs = []; // blanking history entries
let paperworkData = {}; // { [driverId]: Array<Row> }
let weekendLineup = []; // [{ driverId, chassis, raceNumber }]
// Events layer for Weekend tire service
let events = []; // [{ id, championship, round, name, date, createdAt }]
let currentEventId = null; // active event context
let weekendLineupByEvent = {}; // { [eventId]: Array<{ driverId, chassis, raceNumber }> }
let currentApp = 'home'; // 'home' | 'tires' | 'parts' | 'history'
let currentView = 'main'; // 'main' or 'driver-detail'
let selectedDriverId = null;

// DOM Elements
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const navEl = document.querySelector('.tab-navigation');
const homeScreenEl = document.getElementById('home-screen');
const openTiresAppEl = document.getElementById('open-tires-app');
const openPartsAppEl = document.getElementById('open-parts-app');
const openHistoryAppEl = document.getElementById('open-history-app');
const openPaperAppEl = document.getElementById('open-paper-app');
const addDriverBtn = document.getElementById('add-driver-btn');
const addTireBtn = document.getElementById('add-tire-btn');
const driverModal = document.getElementById('driver-modal');
const tireModal = document.getElementById('tire-modal');
const closeModalBtns = document.querySelectorAll('.close-modal');
const driverForm = document.getElementById('driver-form');
const tireForm = document.getElementById('tire-form');
 const driverList = document.getElementById('driver-list');
 const tireList = document.getElementById('tire-list');
 const partsList = document.getElementById('parts-list');
 const historyByTrackEl = document.getElementById('history-by-track');
 const historyByDriverEl = document.getElementById('history-by-driver');
const driverFilter = document.getElementById('driver-filter');
const compoundFilter = document.getElementById('compound-filter');
const mountedFilter = document.getElementById('mounted-filter');
const tireDriverSelect = document.getElementById('tire-driver');
const totalTiresCount = document.getElementById('total-tires-count');
const compoundStats = document.getElementById('compound-stats');
const driverStats = document.getElementById('driver-stats');
const kpiAvailableSetsEl = document.getElementById('kpi-available-sets');
const kpiSetsPerDriverEl = document.getElementById('kpi-sets-per-driver');
const kpiMountedSetsEl = document.getElementById('kpi-mounted-sets');
const mainContent = document.querySelector('main');
const backButton = document.createElement('button');
// Update Mileage modal elements
const updateMileageModal = document.getElementById('update-mileage-modal');
const updateMileageForm = document.getElementById('update-mileage-form');
const updateTrackSelect = document.getElementById('update-track');
const updateLapsInput = document.getElementById('update-laps');
const updateSessionInput = document.getElementById('update-session');
const updateDistanceEl = document.getElementById('update-distance-display');
const updateTotalMileageEl = document.getElementById('update-total-display');
const updateTotalLapsEl = document.getElementById('update-total-laps-display');
let currentUpdatingTireId = null;

// European racing tracks (km)
const EUROPE_TRACKS = [
    { id: 'monza', name: 'Monza (ITA)', lengthKm: 5.793 },
    { id: 'imola', name: 'Imola (ITA)', lengthKm: 4.909 },
    { id: 'mugello', name: 'Mugello (ITA)', lengthKm: 5.245 },
    { id: 'misano', name: 'Misano (ITA)', lengthKm: 4.226 },
    { id: 'vallelunga', name: 'Vallelunga (ITA)', lengthKm: 4.085 },
    { id: 'spa', name: 'Spa-Francorchamps (BEL)', lengthKm: 7.004 },
    { id: 'zolder', name: 'Zolder (BEL)', lengthKm: 4.011 },
    { id: 'silverstone', name: 'Silverstone (UK)', lengthKm: 5.891 },
    { id: 'brands', name: 'Brands Hatch (UK)', lengthKm: 3.916 },
    { id: 'donington', name: 'Donington Park (UK)', lengthKm: 4.023 },
    { id: 'nurb_gp', name: 'Nürburgring GP (DEU)', lengthKm: 5.148 },
    { id: 'hockenheim', name: 'Hockenheimring (DEU)', lengthKm: 4.574 },
    { id: 'oschersleben', name: 'Oschersleben (DEU)', lengthKm: 3.696 },
    { id: 'redbull', name: 'Red Bull Ring (AUT)', lengthKm: 4.318 },
    { id: 'hungaroring', name: 'Hungaroring (HUN)', lengthKm: 4.381 },
    { id: 'slovakiaring', name: 'Slovakiaring (SVK)', lengthKm: 5.922 },
    { id: 'zandvoort', name: 'Zandvoort (NLD)', lengthKm: 4.259 },
    { id: 'assen', name: 'Assen (NLD)', lengthKm: 4.542 },
    { id: 'barcelona', name: 'Barcelona-Catalunya (ESP)', lengthKm: 4.657 },
    { id: 'jerez', name: 'Jerez (ESP)', lengthKm: 4.428 },
    { id: 'valencia', name: 'Valencia Ricardo Tormo (ESP)', lengthKm: 4.005 },
    { id: 'portimao', name: 'Portimão (PRT)', lengthKm: 4.653 },
    { id: 'paulricard', name: 'Paul Ricard (FRA)', lengthKm: 5.842 },
    { id: 'magnycours', name: 'Magny-Cours (FRA)', lengthKm: 4.411 },
    { id: 'monaco', name: 'Monaco (MCO)', lengthKm: 3.337 },
    { id: 'brno', name: 'Brno (CZE)', lengthKm: 5.403 },
    { id: 'most', name: 'Autodrom Most (CZE)', lengthKm: 4.212 }
];
// Auth & Audit elements
const loginBtn = document.getElementById('login-btn');
const homeBtn = document.getElementById('home-btn');
const loginBtnLabel = document.getElementById('login-btn-label');
const loginModalEl = document.getElementById('login-modal');
const registerModalEl = document.getElementById('register-modal');
const loginFormEl = document.getElementById('login-form');
const registerFormEl = document.getElementById('register-form');
const openRegisterLink = document.getElementById('open-register');
const auditLogContainer = document.getElementById('audit-log');
const activityListEl = document.getElementById('activity-list');
const openActivityLogBtn = document.getElementById('open-activity-log-btn');
// Auth banner elements
const authBannerEl = document.getElementById('auth-banner');
const authBannerTextEl = document.getElementById('auth-banner-text');
const authBannerCloseBtn = document.getElementById('auth-banner-close');
let auth = null; // { user, role }

// Initialize the app
function initApp() {
    loadData();
    setupEventListeners();
    loadAuth();
    updateAuthUI();
    renderDrivers();
    renderTires();
    updateDriverSelects();
    updateChampionshipsDatalist();
    updateStats();
    
    // Setup back button
    backButton.className = 'back-btn';
    backButton.innerHTML = '<i class="fas fa-arrow-left"></i> Back';
    backButton.addEventListener('click', navigateToMainView);
}

// Setup Event Listeners
function setupEventListeners() {
    // Tab navigation
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            setActiveTab(tabId);
        });
    });

    // Open modals (guarded)
    addDriverBtn.addEventListener('click', () => {
        if (!requireLoggedIn()) { showAuthBanner('You must log in before performing any action.'); return; }
        if (!requireAdmin()) { alert('Only admin can modify'); return; }
        driverModal.style.display = 'grid';
    });
    addTireBtn.addEventListener('click', () => {
        if (!requireLoggedIn()) { showAuthBanner('You must log in before performing any action.'); return; }
        if (!requireAdmin()) { alert('Only admin can modify'); return; }
        if (drivers.length === 0) {
            alert('Please add a driver first');
            return;
        }
        tireModal.style.display = 'grid';
    });

    // Auth: login/logout toggle and forms
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            if (auth && auth.user) {
                logout();
                updateAuthUI();
            } else if (loginModalEl) {
                loginModalEl.style.display = 'block';
            }
        });
    }
    // Home button returns to landing screen
    if (homeBtn) {
        homeBtn.addEventListener('click', () => {
            setActiveApp('home');
        });
    }
    if (openRegisterLink) {
        openRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (loginModalEl) loginModalEl.style.display = 'none';
            if (registerModalEl) registerModalEl.style.display = 'block';
        });
    }
    if (loginFormEl) loginFormEl.addEventListener('submit', handleLoginSubmit);
    if (registerFormEl) registerFormEl.addEventListener('submit', handleRegisterSubmit);

    // Activity Log open
    if (openActivityLogBtn) {
        openActivityLogBtn.addEventListener('click', () => {
            setActiveTab('activity');
            renderFullAuditLog();
        });
    }

    // Close modals
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            driverModal.style.display = 'none';
            tireModal.style.display = 'none';
            if (loginModalEl) loginModalEl.style.display = 'none';
            if (registerModalEl) registerModalEl.style.display = 'none';
            if (updateMileageModal) updateMileageModal.style.display = 'none';
        });
    });

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === driverModal) driverModal.style.display = 'none';
        if (e.target === tireModal) tireModal.style.display = 'none';
        if (e.target === loginModalEl) loginModalEl.style.display = 'none';
        if (e.target === registerModalEl) registerModalEl.style.display = 'none';
        if (e.target === updateMileageModal) updateMileageModal.style.display = 'none';
    });

    // Form submissions
    driverForm.addEventListener('submit', handleDriverSubmit);
    tireForm.addEventListener('submit', handleTireSubmit);

    // Filters
    driverFilter.addEventListener('change', renderTires);
    compoundFilter.addEventListener('change', renderTires);
    mountedFilter.addEventListener('change', renderTires);

    // Update mileage modal interactions
    if (updateMileageForm) {
        updateMileageForm.addEventListener('submit', handleUpdateMileageSubmit);
    }
    if (updateTrackSelect) {
        updateTrackSelect.addEventListener('change', recomputeUpdateMileagePreview);
    }
    if (updateLapsInput) {
        updateLapsInput.addEventListener('input', recomputeUpdateMileagePreview);
    }
    if (updateSessionInput) {
        updateSessionInput.addEventListener('input', recomputeUpdateMileagePreview);
    }
    // Manual override inputs removed; recomputation reacts to track, laps, and session name only
}

// Set active tab
function setActiveTab(tabId) {
    // If we're in driver detail view and trying to switch tabs, go back to main view first
    if (currentView === 'driver-detail') {
        navigateToMainView();
    }
    
    tabButtons.forEach(btn => {
        if (btn.getAttribute('data-tab') === tabId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    tabContents.forEach(content => {
        if (content.id === `${tabId}-tab`) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });

    // Update stats when switching to stats tab
    if (tabId === 'stats') {
        updateStats();
    }
    // Render activity when switching to activity tab
    if (tabId === 'activity') {
        renderFullAuditLog();
    }
    // Render parts inventory when switching to parts tab
    if (tabId === 'parts') {
        renderPartsInventory();
    }
    // Render history analytics when switching to history tab
    if (tabId === 'history') {
        renderHistoryAnalytics();
    }
}

// Render Parts Inventory (stub)
function renderPartsInventory() {
    if (!partsList) return;
    partsList.innerHTML = '';
    if (!parts || parts.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'empty-state';
        empty.textContent = 'No parts added yet';
        partsList.appendChild(empty);
        return;
    }
    parts.forEach(part => {
        const card = document.createElement('div');
        card.className = 'card';
        const installed = part.installedOn ? 'Installed' : 'Not installed';
        const mileage = Math.round(part.mileageKm || 0);
        card.innerHTML = `
            <div class="card-header">
                <span class="card-title">${part.name || part.sku || 'Part'}</span>
                <span class="card-subtitle">${part.category || ''}</span>
            </div>
            <div class="card-detail">
                <span class="card-detail-label">Status:</span>
                <span>${installed}</span>
            </div>
            <div class="card-detail">
                <span class="card-detail-label">Mileage:</span>
                <span>${mileage} km</span>
            </div>
            <div class="card-status">
                <label class="status-checkbox">
                    <input type="checkbox" ${part.installedOn ? 'checked' : ''} onchange="togglePartInstalled('${part.id}', this.checked)">
                    Installed in car
                </label>
            </div>
        `;
        partsList.appendChild(card);
    });
}

// Toggle installed status (stub logic)
function togglePartInstalled(partId, installed) {
    const part = parts.find(p => p.id === partId);
    if (!part) return;
    part.installedOn = installed ? 'chassis-1' : null; // placeholder chassis
    saveData();
    renderPartsInventory();
}

// Render History Analytics (stub)
function renderHistoryAnalytics() {
    if (historyByTrackEl) {
        historyByTrackEl.textContent = (pressureLogs.length + blankingLogs.length) === 0 ? 'No data yet' : 'Data available';
    }
    if (historyByDriverEl) {
        historyByDriverEl.textContent = (pressureLogs.length + blankingLogs.length) === 0 ? 'No data yet' : 'Data available';
    }
}

// Default rows for the paperwork grid
function createDefaultPaperworkRows(rowCount = 12) {
    const rows = [];
    for (let i = 0; i < rowCount; i++) {
        rows.push({
            dismountTireId: '',
            mileageKm: '',
            decision: '', // 'keep' | 'trash'
            mountTireId: '',
            readySession: '',
            done: false
        });
    }
    return rows;
}

// Render Tire Guy Paperwork module
function renderPaperwork() {
    const container = document.getElementById('paperwork-container');
    if (!container) return;

    // Always render the Event List even when there are no drivers yet,
    // so the module is visible on first publish (e.g., GitHub Pages).

    // Helper to compose tire option labels (show only tire code like "DW-01")
    const formatTireLabel = (t) => {
        if (t.setName && typeof t.setName === 'string') return t.setName;
        const padded = (t.setNumber != null) ? String(t.setNumber).padStart(2, '0') : '';
        return padded ? `SET-${padded}` : String(t.id).slice(-4);
    };

    // Unique chassis list from drivers
    const chassisSet = new Set();
    drivers.forEach(d => { if (d.chassis) chassisSet.add(d.chassis); });
    const chassisOptions = Array.from(chassisSet).sort();

    // Default to first driver if available
    let currentDriver = drivers && drivers.length ? drivers[0] : null;

    // Build UI skeleton
    const section = document.createElement('div');
    section.className = 'paperwork-section';

    const header = document.createElement('div');
    header.className = 'paperwork-section-header';
    const headerLeft = document.createElement('div');
    headerLeft.className = 'sh-left';
    // Back to events list when inside an event
    if (currentEventId) {
        const backToEventsBtn = document.createElement('button');
        backToEventsBtn.className = 'btn-small btn-ghost';
        backToEventsBtn.textContent = 'All events';
        backToEventsBtn.title = 'Back to events overview';
        backToEventsBtn.addEventListener('click', () => { currentEventId = null; saveData(); renderPaperwork(); });
        headerLeft.appendChild(backToEventsBtn);
    }
    // Show "Event List" title on the same row as the create button
    if (!currentEventId) {
        const listTitle = document.createElement('h3');
        listTitle.className = 'sh-title';
        listTitle.textContent = 'Event List';
        headerLeft.appendChild(listTitle);
    }
    const headerRight = document.createElement('div');
    headerRight.className = 'sh-right';
    const addEventBtn = document.createElement('button');
    addEventBtn.className = 'action-btn';
    addEventBtn.title = 'Create event';
    addEventBtn.innerHTML = '<i class="fas fa-calendar-plus"></i>';
    // Show create icon only when viewing the Event List (no active event)
    if (!currentEventId) {
        headerRight.appendChild(addEventBtn);
    }
    const addWeekendBtn = document.createElement('button');
    // square icon in header right, visible only inside an event
    addWeekendBtn.className = 'action-btn';
    addWeekendBtn.title = 'Assign weekend driver';
    addWeekendBtn.innerHTML = '<i class="fas fa-plus"></i>';
    header.appendChild(headerLeft);
    header.appendChild(headerRight);
    // Show driver assign square only when inside an event
    if (currentEventId) {
        headerRight.appendChild(addWeekendBtn);
    }
    section.appendChild(header);
    // Modules list (one per driver). Each module can expand to show its table.
    const modules = document.createElement('div');
    modules.className = 'paperwork-modules';

    container.innerHTML = '';
    section.appendChild(modules);
    container.appendChild(section);

    const ensureRows = (driverId) => {
        if (!paperworkData[driverId]) paperworkData[driverId] = createDefaultPaperworkRows();
        // migrate old structure if needed
        paperworkData[driverId] = paperworkData[driverId].map(r => ({
            dismountTireId: r.dismountTireId || '',
            mileageKm: r.mileageKm || r.km || '',
            decision: r.decision || (r.keepOrX ? (String(r.keepOrX).toLowerCase().includes('trash') ? 'trash' : 'keep') : ''),
            mountTireId: r.mountTireId || '',
            readySession: r.readySession || r.session || '',
            done: !!r.done
        }));
    };

    // Render dedicated driver detail screen with full table
    const renderPaperworkDetail = (driver, meta) => {
        container.innerHTML = '';
        const sectionDetail = document.createElement('div');
        sectionDetail.className = 'paperwork-section';

        // Header with back button and title
        const hdr = document.createElement('div');
        hdr.className = 'paperwork-section-header';
        const backBtn = document.createElement('button');
        backBtn.className = 'back-btn';
        backBtn.textContent = '← Back';
        backBtn.addEventListener('click', () => { renderPaperwork(); });
        const titleEl = document.createElement('h3');
        const chassisText = (meta && meta.chassis) ? meta.chassis : (driver.chassis || '—');
        const numberText = (meta && meta.raceNumber) ? meta.raceNumber : (driver.raceNumber || '—');
        titleEl.textContent = `${driver.name || driver.id} — Chassis: ${chassisText} — Number: ${numberText}`;
        hdr.appendChild(backBtn);
        hdr.appendChild(titleEl);
        // Export button on the right
        const hdrRight = document.createElement('div');
        const exportBtn = document.createElement('button');
        exportBtn.className = 'action-btn';
        exportBtn.title = 'Export table to CSV';
        exportBtn.innerHTML = '<i class="fas fa-download"></i>';
        hdrRight.appendChild(exportBtn);
        hdr.appendChild(hdrRight);
        sectionDetail.appendChild(hdr);

        // Helper to export current driver table to CSV readable by Excel
        const exportDriverPaperworkCSV = () => {
            const rows = paperworkData[driver.id] || [];
            const csvRows = [];
            csvRows.push(['Dismount','Mileage (km)','Decision','Mount','Ready before','Done'].join(','));
            rows.forEach(r => {
                const disTire = tires.find(t => t.id === r.dismountTireId);
                const mntTire = tires.find(t => t.id === r.mountTireId);
                const disLabel = disTire ? formatTireLabel(disTire) : '';
                const mntLabel = mntTire ? formatTireLabel(mntTire) : '';
                const decision = r.decision ? String(r.decision).toUpperCase() : '';
                const line = [disLabel, r.mileageKm || '', decision, mntLabel, r.readySession || '', r.done ? 'YES' : ''];
                // Quote values to be safe
                csvRows.push(line.map(v => `"${String(v).replace(/"/g,'""')}"`).join(','));
            });
            const csvContent = csvRows.join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            const safeName = (driver.name || driver.id).replace(/\s+/g,'_');
            a.href = url;
            a.download = `${safeName}_paperwork.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        };
        exportBtn.addEventListener('click', exportDriverPaperworkCSV);

        // Table card
        const card = document.createElement('div');
        card.className = 'paperwork-card';
        const table = document.createElement('table');
        table.className = 'paperwork-table';
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>Dismount</th>
                <th>Mileage (km)</th>
                <th>Keep/Trash</th>
                <th>Mount</th>
                <th>Ready before</th>
                <th>Done</th>
            </tr>
        `;
        table.appendChild(thead);
        const tbody = document.createElement('tbody');

        // Build options across all tires, prioritizing current driver's sets
        const allDismountEligible = tires.filter(t => t.mounted && !t.trashed);
        const allMountEligible = tires.filter(t => !t.mounted && !t.trashed);
        const dismountOptions = [
            ...allDismountEligible.filter(t => t.driverId === driver.id),
            ...allDismountEligible.filter(t => t.driverId !== driver.id)
        ];
        const mountOptions = [
            ...allMountEligible.filter(t => t.driverId === driver.id),
            ...allMountEligible.filter(t => t.driverId !== driver.id)
        ];

        ensureRows(driver.id);
        paperworkData[driver.id].forEach((row, idx) => {
            const tr = document.createElement('tr');

            // Dismount select
            const disTd = document.createElement('td');
            const disSel = document.createElement('select');
            disSel.className = 'select-tire';
            const optEmpty1 = document.createElement('option'); optEmpty1.value = ''; optEmpty1.textContent = '—'; disSel.appendChild(optEmpty1);
            dismountOptions.forEach(t => { const opt = document.createElement('option'); opt.value = t.id; opt.textContent = formatTireLabel(t); disSel.appendChild(opt); });
            disSel.value = row.dismountTireId || '';
            disSel.addEventListener('change', () => { paperworkData[driver.id][idx].dismountTireId = disSel.value; saveData(); });
            disTd.appendChild(disSel);

            // Mileage input
            const kmTd = document.createElement('td');
            kmTd.className = 'mileage-col';
            const kmInput = document.createElement('input'); kmInput.type = 'number'; kmInput.inputMode = 'numeric'; kmInput.placeholder = '0'; kmInput.value = row.mileageKm || '';
            kmInput.classList.add('input-km');
            kmInput.addEventListener('input', () => { paperworkData[driver.id][idx].mileageKm = kmInput.value; saveData(); });
            kmTd.appendChild(kmInput);

            // Decision keep/trash
            const decTd = document.createElement('td');
            const decSel = document.createElement('select');
            const optEmpty2 = document.createElement('option'); optEmpty2.value = ''; optEmpty2.textContent = '—'; decSel.appendChild(optEmpty2);
            const optKeep = document.createElement('option'); optKeep.value = 'keep'; optKeep.textContent = 'KEEP'; decSel.appendChild(optKeep);
            const optTrash = document.createElement('option'); optTrash.value = 'trash'; optTrash.textContent = 'TRASH'; decSel.appendChild(optTrash);
            decSel.value = row.decision || '';
            decSel.addEventListener('change', () => { paperworkData[driver.id][idx].decision = decSel.value; saveData(); });
            decTd.appendChild(decSel);

            // Mount select
            const mntTd = document.createElement('td');
            const mntSel = document.createElement('select');
            mntSel.className = 'select-tire';
            const optEmpty3 = document.createElement('option'); optEmpty3.value = ''; optEmpty3.textContent = '—'; mntSel.appendChild(optEmpty3);
            mountOptions.forEach(t => { const opt = document.createElement('option'); opt.value = t.id; opt.textContent = formatTireLabel(t); mntSel.appendChild(opt); });
            mntSel.value = row.mountTireId || '';
            mntSel.addEventListener('change', () => { paperworkData[driver.id][idx].mountTireId = mntSel.value; saveData(); });
            mntTd.appendChild(mntSel);

            // Ready before session
            const sesTd = document.createElement('td');
            const sesInput = document.createElement('input'); sesInput.type = 'text'; sesInput.placeholder = 'Ready before'; sesInput.value = row.readySession || '';
            sesInput.addEventListener('input', () => { paperworkData[driver.id][idx].readySession = sesInput.value; saveData(); });
            sesTd.appendChild(sesInput);

            // Done checkbox + fade effect
            const doneTd = document.createElement('td');
            const doneInput = document.createElement('input'); doneInput.type = 'checkbox'; doneInput.checked = !!row.done;
            const applyDoneStyle = () => { tr.classList.toggle('row-done', !!paperworkData[driver.id][idx].done); };
            applyDoneStyle();
            doneInput.addEventListener('change', () => { paperworkData[driver.id][idx].done = doneInput.checked; saveData(); applyDoneStyle(); });
            doneTd.appendChild(doneInput);

            tr.appendChild(disTd);
            tr.appendChild(kmTd);
            tr.appendChild(decTd);
            tr.appendChild(mntTd);
            tr.appendChild(sesTd);
            tr.appendChild(doneTd);
            tbody.appendChild(tr);
        });

        table.appendChild(tbody);
        card.appendChild(table);
        sectionDetail.appendChild(card);
        container.appendChild(sectionDetail);
    };

    // Inline form to add weekend driver (hidden by default)
    const addForm = document.createElement('div');
    addForm.className = 'weekend-add-form';
    addForm.style.display = 'none';

    // Driver field
    const ffDriver = document.createElement('div'); ffDriver.className = 'form-field';
    const driverLabel = document.createElement('label'); driverLabel.className = 'form-label'; driverLabel.textContent = 'Driver';
    driverLabel.setAttribute('for', 'weekend-driver-select');
    const driverSelect = document.createElement('select'); driverSelect.id = 'weekend-driver-select'; driverSelect.className = 'form-input';
    const defaultOpt = document.createElement('option'); defaultOpt.value = ''; defaultOpt.textContent = 'Select driver'; driverSelect.appendChild(defaultOpt);
    const eventLineup = getCurrentEventLineup();
    const rosterIdsInLineup = new Set(eventLineup.map(w => w.driverId));
    drivers.forEach(d => { if (!rosterIdsInLineup.has(d.id)) { const opt = document.createElement('option'); opt.value = d.id; opt.textContent = d.name || d.id; driverSelect.appendChild(opt); } });
    ffDriver.appendChild(driverLabel);
    ffDriver.appendChild(driverSelect);

    // Chassis field
    const ffChassis = document.createElement('div'); ffChassis.className = 'form-field';
    const chLabelEl = document.createElement('label'); chLabelEl.className = 'form-label'; chLabelEl.textContent = 'Chassis'; chLabelEl.setAttribute('for', 'weekend-chassis');
    const chInputNew = document.createElement('input'); chInputNew.type = 'text'; chInputNew.id = 'weekend-chassis'; chInputNew.className = 'form-input'; chInputNew.placeholder = 'e.g. 397';
    ffChassis.appendChild(chLabelEl);
    ffChassis.appendChild(chInputNew);

    // Number field
    const ffNumber = document.createElement('div'); ffNumber.className = 'form-field';
    const rnLabelEl = document.createElement('label'); rnLabelEl.className = 'form-label'; rnLabelEl.textContent = 'Racing Number'; rnLabelEl.setAttribute('for', 'weekend-number');
    const rnInputNew = document.createElement('input'); rnInputNew.type = 'text'; rnInputNew.id = 'weekend-number'; rnInputNew.className = 'form-input'; rnInputNew.placeholder = 'e.g. 45';
    ffNumber.appendChild(rnLabelEl);
    ffNumber.appendChild(rnInputNew);

    // Actions
    const actionsWrap = document.createElement('div'); actionsWrap.className = 'form-actions';
    const addBtn = document.createElement('button'); addBtn.className = 'btn-small btn-primary btn-equal'; addBtn.innerHTML = '<i class="fas fa-check"></i> Add';
    const cancelBtn = document.createElement('button'); cancelBtn.className = 'btn-small btn-ghost btn-equal'; cancelBtn.innerHTML = '<i class="fas fa-times"></i> Cancel'; cancelBtn.type = 'button';
    actionsWrap.appendChild(addBtn);
    actionsWrap.appendChild(cancelBtn);

    addForm.appendChild(ffDriver);
    addForm.appendChild(ffChassis);
    addForm.appendChild(ffNumber);
    addForm.appendChild(actionsWrap);
    if (currentEventId) {
        section.appendChild(addForm);
    }

    // Event creation form (hidden by default)
    const eventForm = document.createElement('div');
    eventForm.className = 'event-add-form';
    eventForm.style.display = 'none';
    let editingEventId = null; // when set, efSave edits existing

    // Championship input with datalist (choose existing or type new)
    const efChamp = document.createElement('div'); efChamp.className = 'form-field';
    const champLabel = document.createElement('label'); champLabel.className = 'form-label'; champLabel.textContent = 'Championship'; champLabel.setAttribute('for','event-championship');
    const champInput = document.createElement('input'); champInput.type='text'; champInput.placeholder='Type or choose'; champInput.className='form-input'; champInput.id='event-championship'; champInput.setAttribute('list','championship-list');
    const champDataList = document.createElement('datalist'); champDataList.id = 'championship-list';
    const uniqueChamps = Array.from(new Set(events.map(e=>e.championship).filter(Boolean))).sort();
    uniqueChamps.forEach(c=>{ const o=document.createElement('option'); o.value=c; champDataList.appendChild(o); });
    efChamp.appendChild(champLabel); efChamp.appendChild(champInput); efChamp.appendChild(champDataList);

    // Round number
    const efRound = document.createElement('div'); efRound.className='form-field';
            const roundLabel = document.createElement('label'); roundLabel.className='form-label'; roundLabel.textContent='Round n°'; roundLabel.setAttribute('for','event-round');
    const roundInput = document.createElement('input'); roundInput.type='number'; roundInput.min='1'; roundInput.className='form-input'; roundInput.id='event-round';
    efRound.appendChild(roundLabel); efRound.appendChild(roundInput);

    // Track selection (datalist from known tracks)
    const efName = document.createElement('div'); efName.className='form-field';
    const nameLabel = document.createElement('label'); nameLabel.className='form-label'; nameLabel.textContent='Track'; nameLabel.setAttribute('for','event-track');
    const trackInput = document.createElement('input'); trackInput.type='text'; trackInput.className='form-input'; trackInput.id='event-track'; trackInput.placeholder='Type or choose'; trackInput.setAttribute('list','track-list');
    const trackDataList = document.createElement('datalist'); trackDataList.id = 'track-list';
    (EUROPE_TRACKS || []).forEach(t=>{ const o=document.createElement('option'); o.value=t.name; trackDataList.appendChild(o); });
    efName.appendChild(nameLabel); efName.appendChild(trackInput); efName.appendChild(trackDataList);

    // Date
    const efDate = document.createElement('div'); efDate.className='form-field';
    const dateLabel = document.createElement('label'); dateLabel.className='form-label'; dateLabel.textContent='Date'; dateLabel.setAttribute('for','event-date');
    const dateInput = document.createElement('input'); dateInput.type='date'; dateInput.className='form-input'; dateInput.id='event-date';
    efDate.appendChild(dateLabel); efDate.appendChild(dateInput);

    // Actions
    const efActions = document.createElement('div'); efActions.className='form-actions';
    const efSave = document.createElement('button'); efSave.className='btn-primary btn-small'; efSave.textContent='Create';
    const efCancel = document.createElement('button'); efCancel.className='btn-secondary btn-small'; efCancel.textContent='Cancel';
    efActions.appendChild(efSave); efActions.appendChild(efCancel);

    eventForm.appendChild(efChamp);
    eventForm.appendChild(efRound);
    eventForm.appendChild(efName);
    eventForm.appendChild(efDate);
    eventForm.appendChild(efActions);
    section.appendChild(eventForm);

    addEventBtn.addEventListener('click', ()=>{ eventForm.style.display = eventForm.style.display === 'none' ? 'grid' : 'none'; });
    efCancel.addEventListener('click', ()=>{ eventForm.style.display='none'; });
    efSave.addEventListener('click', ()=>{
        const champVal = champInput.value.trim();
        const roundVal = parseInt(roundInput.value || '0', 10);
        const nameVal = trackInput.value.trim();
        const dateVal = dateInput.value;
        if (!champVal || !nameVal || !dateVal) return;
        const id = editingEventId || `${Date.now()}`;
        if (editingEventId) {
            const idx = events.findIndex(e => e.id === editingEventId);
            if (idx !== -1) {
                events[idx] = { ...events[idx], championship: champVal, round: roundVal, name: nameVal, date: dateVal };
            }
            editingEventId = null;
            efSave.textContent = 'Create';
        } else {
            const ev = { id, championship: champVal, round: roundVal, name: nameVal, date: dateVal, createdAt: new Date().toISOString() };
            events.push(ev);
            currentEventId = id;
            weekendLineupByEvent[id] = weekendLineupByEvent[id] || [];
        }
        eventForm.style.display = 'none';
        saveData();
        renderPaperwork();
    });
    // removed header event dropdown; event navigation via cards and back button

    addWeekendBtn.addEventListener('click', () => { addForm.style.display = addForm.style.display === 'none' ? 'flex' : 'none'; });
    cancelBtn.addEventListener('click', () => { addForm.style.display = 'none'; });
    addBtn.addEventListener('click', () => {
        if (!guardModify()) return;
        const sel = driverSelect.value;
        if (!sel) return;
        const meta = { driverId: sel, chassis: chInputNew.value.trim(), raceNumber: rnInputNew.value.trim() };
        const list = getCurrentEventLineup();
        if (!list.find(w => w.driverId === sel)) {
            list.push(meta);
            setCurrentEventLineup(list);
        }
        renderPaperwork();
    });

    // Render either events overview (no event selected) or driver lineup for selected event
    modules.innerHTML = '';
    if (!currentEventId) {
        if (events.length === 0) {
            const empty = document.createElement('p');
            empty.className = 'empty-hint';
            empty.textContent = 'No events yet. Click the calendar icon to create one.';
            modules.appendChild(empty);
        } else {
            events.sort((a,b)=> (a.date||'').localeCompare(b.date||'')).forEach(ev => {
                const card = document.createElement('div');
                card.className = 'paperwork-card event-card';
                const top = document.createElement('div');
                top.className = 'module-left';
                const title = document.createElement('div'); title.className = 'module-title';
                title.textContent = `${ev.championship || 'Champ'} • R${ev.round || '—'} • ${ev.name || ''}`;
                const dateEl = document.createElement('div'); dateEl.className = 'module-label'; dateEl.textContent = ev.date || '';
                top.appendChild(title); top.appendChild(dateEl);
                const actions = document.createElement('div'); actions.className = 'module-actions';
                const editBtn2 = document.createElement('button'); editBtn2.className = 'btn-small btn-secondary'; editBtn2.textContent = 'Edit';
                const delBtn = document.createElement('button'); delBtn.className = 'btn-small btn-danger'; delBtn.textContent = 'Delete';
                actions.appendChild(editBtn2); actions.appendChild(delBtn);
                card.appendChild(top);
                card.appendChild(actions);
                modules.appendChild(card);
                // Click anywhere on the card (except buttons) to open the event
                card.addEventListener('click', (e) => {
                    if (e.target.closest('button')) return; // ignore action buttons
                    currentEventId = ev.id;
                    saveData();
                    renderPaperwork();
                });
                editBtn2.addEventListener('click', () => {
                    editingEventId = ev.id;
                    eventForm.style.display = 'grid';
                    champInput.value = ev.championship || '';
                    roundInput.value = ev.round != null ? String(ev.round) : '';
                    trackInput.value = ev.name || '';
                    dateInput.value = ev.date || '';
                    efSave.textContent = 'Save';
                });
                delBtn.addEventListener('click', () => {
                    if (!guardModify()) return;
                    if (!confirm('Delete this event? This removes its lineup too.')) return;
                    events = events.filter(e => e.id !== ev.id);
                    delete weekendLineupByEvent[ev.id];
                    if (currentEventId === ev.id) currentEventId = null;
                    saveData();
                    renderPaperwork();
                });
            });
        }
    } else {
        const curEventLineup = getCurrentEventLineup();
        (curEventLineup.length ? curEventLineup : []).forEach(meta => {
            const driver = drivers.find(d => d.id === meta.driverId);
            if (!driver) return;
            ensureRows(driver.id);
            const item = document.createElement('div');
            item.className = 'paperwork-module';

            const left = document.createElement('div');
            left.className = 'module-left';
            const initials = (driver.name || '?').split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase();
            left.innerHTML = `${driver.photo ? `<img class="driver-avatar" src="${driver.photo}" alt="${driver.name}">` : `<div class="driver-avatar placeholder">${initials}</div>`}
                              <div class="module-title">${driver.name || driver.id}</div>`;

            const right = document.createElement('div');
            right.className = 'module-right';

            const numLabel = document.createElement('div');
            numLabel.textContent = `Number: ${meta.raceNumber || '—'}`;
            numLabel.className = 'module-label';

            const chLabel = document.createElement('div');
            chLabel.textContent = `Chassis: ${meta.chassis || '—'}`;
            chLabel.className = 'module-label';

            right.appendChild(numLabel);
            right.appendChild(chLabel);

            const actions = document.createElement('div');
            actions.className = 'module-actions';
            const editBtn = document.createElement('button');
            editBtn.className = 'btn-small btn-ghost';
            editBtn.title = 'Edit lineup entry';
            editBtn.innerHTML = '<i class="fas fa-edit"></i>';
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn-small btn-ghost';
            deleteBtn.title = 'Remove from weekend';
            deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
            actions.appendChild(editBtn);
            actions.appendChild(deleteBtn);
            right.appendChild(actions);

            const openInlineEdit = () => {
                if (!guardModify()) return;
                right.innerHTML = '';
                const numInput = document.createElement('input');
                numInput.type = 'text';
                numInput.placeholder = 'Number';
                numInput.value = meta.raceNumber || '';
                const chInput = document.createElement('input');
                chInput.type = 'text';
                chInput.placeholder = 'Chassis';
                chInput.value = meta.chassis || '';
                const saveBtn = document.createElement('button');
                saveBtn.className = 'btn-small';
                saveBtn.innerHTML = '<i class="fas fa-check"></i> Save';
                const cancelBtn = document.createElement('button');
                cancelBtn.className = 'btn-small';
                cancelBtn.innerHTML = '<i class="fas fa-times"></i> Cancel';
                right.appendChild(numInput);
                right.appendChild(chInput);
                right.appendChild(saveBtn);
                right.appendChild(cancelBtn);

                saveBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (!guardModify()) return;
                    const list = getCurrentEventLineup();
                    const idx = list.findIndex(w => w.driverId === meta.driverId);
                    if (idx !== -1) {
                        list[idx] = {
                            ...list[idx],
                            raceNumber: (numInput.value || '').trim(),
                            chassis: (chInput.value || '').trim()
                        };
                        setCurrentEventLineup(list);
                    }
                    renderPaperwork();
                });
                cancelBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    renderPaperwork();
                });
            };

            editBtn.addEventListener('click', (e) => { e.stopPropagation(); openInlineEdit(); });
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!guardModify()) return;
                const ok = confirm(`Remove ${driver.name || driver.id} from weekend lineup?`);
                if (!ok) return;
                const list = getCurrentEventLineup().filter(w => w.driverId !== meta.driverId);
                setCurrentEventLineup(list);
                renderPaperwork();
            });

            item.appendChild(left);
            item.appendChild(right);

            const nameEl = left.querySelector('.module-title');
            if (nameEl) {
                nameEl.style.cursor = 'pointer';
                nameEl.title = 'Open paperwork table';
                nameEl.addEventListener('click', (e) => {
                    e.stopPropagation();
                    renderPaperworkDetail(driver, meta);
                });
            }
            item.addEventListener('click', () => { renderPaperworkDetail(driver, meta); });
            modules.appendChild(item);
        });

        if (getCurrentEventLineup().length === 0) {
            const empty = document.createElement('p');
            empty.className = 'empty-hint';
            empty.textContent = 'No weekend drivers yet. Click + to add.';
            modules.appendChild(empty);
        }
    }
    
}

// Handle driver form submission
function handleDriverSubmit(e) {
    e.preventDefault();
    if (!guardModify()) return;
    
    const name = document.getElementById('driver-name').value;
    const team = document.getElementById('driver-team').value;
    const chassis = document.getElementById('driver-chassis') ? document.getElementById('driver-chassis').value : '';
    const championship = document.getElementById('driver-championship') ? document.getElementById('driver-championship').value : '';
    const photoInput = document.getElementById('driver-photo');
    const photoFile = photoInput && photoInput.files && photoInput.files[0] ? photoInput.files[0] : null;
    
    const finalizeAdd = (photoDataUrl) => {
        const newDriver = {
            id: Date.now().toString(),
            name,
            team,
            chassis,
            championship,
            photo: photoDataUrl || null
        };
        drivers.push(newDriver);
        saveData();
        logAction('add_driver', { driverId: newDriver.id, name });
        renderDrivers();
        updateDriverSelects();
        updateChampionshipsDatalist();
        driverForm.reset();
        driverModal.style.display = 'none';
    };

    if (photoFile) {
        const reader = new FileReader();
        reader.onload = () => finalizeAdd(reader.result);
        reader.onerror = () => finalizeAdd(null);
        reader.readAsDataURL(photoFile);
    } else {
        finalizeAdd(null);
    }
}

// Handle tire form submission
function handleTireSubmit(e) {
    e.preventDefault();
    if (!guardModify()) return;
    
    const driverId = document.getElementById('tire-driver').value;
    const compound = document.getElementById('tire-compound').value;
    const condition = document.getElementById('tire-condition').value;
    const setNumber = parseInt(document.getElementById('tire-set-number').value);
    const notes = document.getElementById('tire-notes').value;
    
    // Get driver to create set name
    const driver = drivers.find(d => d.id === driverId);
    if (!driver) return;
    
    // Create set name: first letter of first name + first letter of last name + set number (padded to at least 2 digits)
    const nameParts = driver.name.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
    const formattedSetNumber = setNumber.toString().padStart(2, '0');
    const setName = `${firstName.charAt(0)}${lastName.charAt(0)}-${formattedSetNumber}`;
    
    const newTire = {
        id: Date.now().toString(),
        driverId,
        compound,
        condition,
        notes,
        setName: setName,
        setNumber: setNumber,
        dateAdded: new Date().toISOString(),
        laps: 0,
        mileage: 0,
        events: [], // Array to store last 3 events
        trashed: false, // Whether the tire set is trashed
        mounted: false // Whether the tire set is mounted on rims
    };
    
    tires.push(newTire);
    saveData();
    logAction('add_tire', { tireId: newTire.id, driverId, setName });
    
    // Close modal first to prevent UI lag
    tireForm.reset();
    tireModal.style.display = 'none';
    
    // Update UI based on current view
    if (currentView === 'driver-detail' && selectedDriverId === driverId) {
        renderDriverTires(selectedDriverId);
    } else if (currentView === 'main') {
        renderTires();
    }
    
    updateStats();
}

// Navigate to driver detail view
function navigateToDriverDetail(driverId) {
    currentView = 'driver-detail';
    selectedDriverId = driverId;
    
    // Hide all tab content
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // Create driver detail view
    const driverDetailView = document.createElement('section');
    driverDetailView.id = 'driver-detail-view';
    driverDetailView.className = 'tab-content active';
    
    const driver = drivers.find(d => d.id === driverId);
    if (!driver) return;
    
    // Create back button
    const backBtnEl = document.createElement('button');
    backBtnEl.className = 'back-btn';
    backBtnEl.id = 'back-to-drivers-btn';
    backBtnEl.innerHTML = '<i class="fas fa-arrow-left"></i> Back';
    
    // Build driver detail header: back (left), title (center), plus (right)
    const header = document.createElement('div');
    header.className = 'section-header';
    const headerLeft = document.createElement('div');
    headerLeft.className = 'sh-left';
    headerLeft.appendChild(backBtnEl);
    const headerTitle = document.createElement('h2');
    headerTitle.className = 'sh-title';
    headerTitle.textContent = `${driver.name}'s Tires`;
    const headerRight = document.createElement('div');
    headerRight.className = 'sh-right';
    headerRight.innerHTML = `
        <button id="add-tire-for-driver-btn" class="action-btn">
            <i class="fas fa-plus"></i>
        </button>
    `;
    header.appendChild(headerLeft);
    header.appendChild(headerTitle);
    header.appendChild(headerRight);
    driverDetailView.appendChild(header);

    // Driver profile header with avatar and upload control
    const initials = (driver.name || '?').split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase();
    const profile = document.createElement('div');
    profile.className = 'driver-profile';
    profile.innerHTML = `
        <div class="driver-profile-left">
            ${driver.photo ? `<img class="driver-avatar" src="${driver.photo}" alt="${driver.name}">` : `<div class="driver-avatar placeholder">${initials}</div>`}
            <div>
                <div class="card-title">${driver.name}</div>
                ${driver.team ? `<div class="card-subtitle">${driver.team}</div>` : ''}
            </div>
        </div>
        <div class="driver-profile-actions">
            <button id="upload-driver-photo-btn" class="btn-small"><i class="fas fa-camera"></i> Upload Photo</button>
            <input id="upload-driver-photo-input" type="file" accept="image/*" style="display:none;" />
        </div>
    `;
    driverDetailView.appendChild(profile);
    
    // Remove floating action button in favor of header action button above
    
    // Add tire list
    const driverTireList = document.createElement('div');
    driverTireList.className = 'list-container';
    driverTireList.id = 'driver-tire-list';
    driverDetailView.appendChild(driverTireList);
    
    // Replace current content with driver detail view
    mainContent.innerHTML = '';
    mainContent.appendChild(driverDetailView);
    
    // Render driver's tires
    renderDriverTires(driverId);
    
    // Bind back button and add tire button
    document.getElementById('back-to-drivers-btn').addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        navigateToMainView();
    });
    document.getElementById('add-tire-for-driver-btn').addEventListener('click', () => {
        document.getElementById('tire-driver').value = driverId;
        tireModal.style.display = 'grid';
    });

    // Bind upload photo button
    const uploadBtn = document.getElementById('upload-driver-photo-btn');
    const uploadInput = document.getElementById('upload-driver-photo-input');
    if (uploadBtn && uploadInput) {
        uploadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (!guardModify()) return;
            uploadInput.click();
        });
        uploadInput.addEventListener('change', () => {
            if (!guardModify()) return;
            const file = uploadInput.files && uploadInput.files[0] ? uploadInput.files[0] : null;
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => {
                const d = drivers.find(dd => dd.id === driverId);
                if (!d) return;
                d.photo = reader.result;
                saveData();
                logAction('update_driver_photo', { driverId: driverId });
                // Re-render driver detail to reflect new avatar
                navigateToDriverDetail(driverId);
                // Also refresh driver list avatars
                renderDrivers();
            };
            reader.onerror = () => {
                alert('Failed to load image. Please try another file.');
            };
            reader.readAsDataURL(file);
        });
    }
}

// Navigate back to main view
function navigateToMainView() {
    currentView = 'main';
    selectedDriverId = null;
    
    // Restore original content
    mainContent.innerHTML = '';
    tabContents.forEach(content => {
        mainContent.appendChild(content);
    });
    
    // Activate drivers tab
    setActiveTab('drivers');
}

// Delete driver with double confirmation and optional set deletion
function deleteDriver(driverId) {
    if (!guardModify()) return;
    const driver = drivers.find(d => d.id === driverId);
    if (!driver) return;

    const confirmed = confirm(`Are you sure you want to delete driver "${driver.name}"?`);
    if (!confirmed) {
        // Explicitly abort and re-render to ensure no side effects
        renderDrivers();
        return;
    }

    const alsoDeleteSets = confirm(`BIG WARNING:\n\nAlso delete ALL tire sets related to "${driver.name}"?\nThis action cannot be undone.`);

    // Remove driver
    drivers = drivers.filter(d => d.id !== driverId);

    // Optionally remove tires
    if (alsoDeleteSets) {
        tires = tires.filter(t => t.driverId !== driverId);
    }

    // Remove paperwork entries for this driver
    if (paperworkData && paperworkData[driverId]) {
        delete paperworkData[driverId];
    }

    saveData();
    logAction('delete_driver', { driverId, alsoDeleteSets });

    // Return to main view and refresh lists
    navigateToMainView();
    renderDrivers();
    renderTires();
    updateDriverSelects();
    updateChampionshipsDatalist();
    updateStats();
}

// Function to toggle trashed status
function toggleTrashedStatus(tireId, isTrash) {
    if (!guardModify()) {
        // Re-render to revert checkbox visual change and show banner
        if (currentView === 'driver-detail') {
            renderDriverTires(selectedDriverId);
        } else {
            renderTires();
        }
        return;
    }
    const tire = tires.find(t => t.id === tireId);
    if (!tire) return;
    
    tire.trashed = isTrash;
    saveData();
    logAction('toggle_trash', { tireId, trashed: tire.trashed });
    
    if (currentView === 'driver-detail') {
        renderDriverTires(selectedDriverId);
    } else {
        renderTires();
    }
}

// Function to toggle mounted status
function toggleMountedStatus(tireId, isMounted) {
    if (!guardModify()) {
        // Re-render to revert checkbox visual change and show banner
        if (currentView === 'driver-detail') {
            renderDriverTires(selectedDriverId);
        } else {
            renderTires();
        }
        return;
    }
    const tire = tires.find(t => t.id === tireId);
    if (!tire) return;
    
    tire.mounted = isMounted;
    saveData();
    logAction('toggle_mounted', { tireId, mounted: tire.mounted });
    
    if (currentView === 'driver-detail') {
        renderDriverTires(selectedDriverId);
    } else {
        renderTires();
    }
}

// Render driver's tires in detail view
function renderDriverTires(driverId) {
    const driverTireList = document.getElementById('driver-tire-list');
    if (!driverTireList) return;
    
    driverTireList.innerHTML = '';
    
    const driverTires = tires.filter(tire => tire.driverId === driverId);
    // Keep controls enabled; guardModify will block and show login banner
    
    if (driverTires.length === 0) {
        driverTireList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-circle-notch"></i>
                <p>No tire sets found for this driver</p>
            </div>
        `;
        return;
    }
    
    driverTires.forEach(tire => {
        const tireCard = document.createElement('div');
        tireCard.className = `card tire-card ${tire.compound} ${tire.trashed ? 'trashed' : ''}`;
        
        // Calculate mileage color
        let mileageColor = '#4CAF50'; // Green by default
        if (tire.mileage > 90) {
            // Calculate gradient from yellow to red between 90-120km
            const percentage = Math.min(1, (tire.mileage - 90) / 30);
            const r = Math.floor(255);
            const g = Math.floor(204 * (1 - percentage));
            const b = 0;
            mileageColor = `rgb(${r}, ${g}, ${b})`;
        } else if (tire.mileage > 60) {
            mileageColor = '#FFCC00'; // Yellow
        }
        
        const dateAdded = new Date(tire.dateAdded).toLocaleDateString();
        // Build recent sessions snippet for inventory cards
        let sessionsHtml = '<div class="card-detail"><span class="card-detail-label">Recent Sessions:</span><span>No sessions recorded</span></div>';
        if (tire.sessions && tire.sessions.length > 0) {
            sessionsHtml = '<div class="card-detail"><span class="card-detail-label">Recent Sessions:</span><ul class="sessions-list">';
            tire.sessions.slice(0, 5).forEach(sess => {
                const label = `${sess.trackName || 'Session'}${sess.sessionName ? ' • ' + sess.sessionName : ''}`;
                sessionsHtml += `<li>${label} — ${sess.distanceKm} km, ${sess.laps || 0} laps <button class="btn-icon btn-delete-session" title="Delete" onclick="deleteTireSession('${tire.id}','${sess.id}')"><i class="fas fa-times"></i></button></li>`;
            });
            sessionsHtml += '</ul></div>';
        }
        
        
        tireCard.innerHTML = `
            <div class="card-header">
                <span class="card-title">${tire.setName}</span>
                <span class="card-subtitle">${getCompoundName(tire.compound)} - ${tire.condition === 'new' ? 'New' : 'Used'}</span>
            </div>
            <div class="card-detail">
                <span class="card-detail-label">Laps:</span>
                <span>${tire.laps}</span>
            </div>
            <div class="card-detail">
                <span class="card-detail-label">Mileage:</span>
                <span style="color: ${mileageColor}; font-weight: bold;">${tire.mileage} km</span>
            </div>
            <div class="card-detail">
                <span class="card-detail-label">Added:</span>
                <span>${dateAdded}</span>
            </div>
            <div class="card-detail">
                <span class="card-detail-label">Recent Sessions:</span>
                ${sessionsHtml}
            </div>
            ${tire.notes ? `<div class="card-notes">${tire.notes}</div>` : ''}
            <div class="card-status">
                <label class="status-checkbox">
                    <input type="checkbox" ${tire.trashed ? 'checked' : ''} onchange="toggleTrashedStatus('${tire.id}', this.checked)">
                    Trashed
                </label>
                <label class="status-checkbox">
                    <input type="checkbox" ${tire.mounted ? 'checked' : ''} onchange="toggleMountedStatus('${tire.id}', this.checked)">
                    Mounted
                </label>
            </div>
            <div class="card-actions">
                <button class="btn-small" onclick="updateTireMileage('${tire.id}')">
                    <i class="fas fa-edit"></i> Update
                </button>
                <button class="btn-small btn-delete" onclick="deleteTire('${tire.id}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `;
        
        driverTireList.appendChild(tireCard);
    });
}

// Update tire mileage and laps
function updateTireMileage(tireId) {
    if (!guardModify()) return;
    const tire = tires.find(t => t.id === tireId);
    if (!tire) return;
    currentUpdatingTireId = tireId;
    populateTrackSelect();
    // Reset inputs
    if (updateTrackSelect) updateTrackSelect.value = updateTrackSelect.options[0]?.value || '';
    if (updateLapsInput) updateLapsInput.value = '';
    if (updateSessionInput) updateSessionInput.value = '';
    // Show modal and compute initial preview
    if (updateMileageModal) {
        updateMileageModal.style.display = 'grid'; // center using CSS grid
        recomputeUpdateMileagePreview();
    }
}

function populateTrackSelect() {
    if (!updateTrackSelect) return;
    // Always rebuild the list with a placeholder, then tracks
    updateTrackSelect.innerHTML = '';
    const ph = document.createElement('option');
    ph.value = '';
    ph.textContent = 'Select a track';
    updateTrackSelect.appendChild(ph);
    EUROPE_TRACKS.forEach(track => {
        const opt = document.createElement('option');
        opt.value = track.id;
        opt.textContent = `${track.name} — ${track.lengthKm.toFixed(3)} km`;
        updateTrackSelect.appendChild(opt);
    });
}

function recomputeUpdateMileagePreview() {
    if (!currentUpdatingTireId) return;
    const tire = tires.find(t => t.id === currentUpdatingTireId);
    if (!tire) return;
    const trackId = updateTrackSelect ? updateTrackSelect.value : '';
    const laps = updateLapsInput ? parseInt(updateLapsInput.value, 10) || 0 : 0;
    const track = EUROPE_TRACKS.find(t => t.id === trackId);
    const addedDistanceRaw = track ? track.lengthKm * laps : 0;
    const addedDistance = Math.round(addedDistanceRaw);
    const newTotalMileage = Math.round((tire.mileage || 0) + addedDistance);
    const newTotalLaps = (tire.laps || 0) + laps;
    if (updateDistanceEl) updateDistanceEl.textContent = `${addedDistance} km`;
    if (updateTotalMileageEl) updateTotalMileageEl.textContent = `${newTotalMileage} km`;
    if (updateTotalLapsEl) updateTotalLapsEl.textContent = `${newTotalLaps}`;
}

function handleUpdateMileageSubmit(e) {
    e.preventDefault();
    if (!currentUpdatingTireId) return;
    const tire = tires.find(t => t.id === currentUpdatingTireId);
    if (!tire) return;
    const trackId = updateTrackSelect ? updateTrackSelect.value : '';
    const laps = updateLapsInput ? parseInt(updateLapsInput.value, 10) || 0 : 0;
    const sessionName = updateSessionInput ? updateSessionInput.value.trim() : '';
    const track = EUROPE_TRACKS.find(t => t.id === trackId);
    // Validate inputs: require a valid track and positive laps
    if (!track) { alert('Please select a track'); return; }
    if (laps <= 0) { alert('Enter a valid number of laps'); return; }

    const addedDistance = Math.round(track.lengthKm * laps);
    // Apply laps and mileage updates (rounded integers)
    tire.laps = (tire.laps || 0) + laps;
    tire.mileage = Math.round((tire.mileage || 0) + addedDistance);
    // Record session ledger entry
    if (!tire.sessions) tire.sessions = [];
    const sessionEntry = {
        id: `sess_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,8)}`,
        date: new Date().toISOString(),
        trackId: track ? track.id : null,
        trackName: track ? track.name : 'Unknown',
        sessionName,
        laps,
        distanceKm: addedDistance
    };
    tire.sessions.unshift(sessionEntry);
    saveData();
    logAction('update_mileage', {
        tireId: tire.id,
        track: track ? track.name : null,
        laps,
        session: sessionName,
        addedDistanceKm: addedDistance,
        newMileageKm: tire.mileage,
        newLaps: tire.laps
    });
    // Re-render current view
    if (currentView === 'driver-detail') {
        renderDriverTires(selectedDriverId);
    } else {
        renderTires();
    }
    // Close modal and reset
    currentUpdatingTireId = null;
    if (updateMileageModal) updateMileageModal.style.display = 'none';
    if (updateMileageForm) updateMileageForm.reset();
}

// Delete a previously recorded session mileage
function deleteTireSession(tireId, sessionId) {
    if (!guardModify()) return;
    const tire = tires.find(t => t.id === tireId);
    if (!tire || !tire.sessions) return;
    const idx = tire.sessions.findIndex(s => s.id === sessionId);
    if (idx === -1) return;
    const s = tire.sessions[idx];
    // Subtract session contribution from totals
    tire.mileage = Math.max(0, (tire.mileage || 0) - (s.distanceKm || 0));
    tire.laps = Math.max(0, (tire.laps || 0) - (s.laps || 0));
    // Remove session entry
    tire.sessions.splice(idx, 1);
    saveData();
    logAction('delete_session', { tireId, sessionId, distanceKm: s.distanceKm, laps: s.laps });
    // Re-render current view
    if (currentView === 'driver-detail') {
        renderDriverTires(selectedDriverId);
    } else {
        renderTires();
    }
}

// Add event to tire
function addTireEvent(tireId) {
    if (!guardModify()) return;
    const tire = tires.find(t => t.id === tireId);
    if (!tire) return;
    
    const eventName = prompt('Enter event name:');
    if (!eventName) return;
    
    const eventDate = prompt('Enter event date (YYYY-MM-DD):', new Date().toISOString().split('T')[0]);
    if (!eventDate) return;
    
    // Add event to the beginning of the array
    tire.events.unshift({
        name: eventName,
        date: eventDate
    });
    
    // Keep only the last 3 events
    if (tire.events.length > 3) {
        tire.events = tire.events.slice(0, 3);
    }
    
    saveData();
    logAction('add_event', { tireId, events: tire.events });
    
    if (currentView === 'driver-detail') {
        renderDriverTires(selectedDriverId);
    } else {
        renderTires();
    }
}

// Delete tire
function deleteTire(tireId) {
    if (!guardModify()) return;
    if (confirm('Are you sure you want to delete this tire?')) {
        const tireIndex = tires.findIndex(t => t.id === tireId);
        if (tireIndex !== -1) {
            tires.splice(tireIndex, 1);
            saveData();
            logAction('delete_tire', { tireId });
            
            if (currentView === 'driver-detail') {
                renderDriverTires(selectedDriverId);
            } else {
                renderTires();
            }
            
            updateStats();
        }
    }
}

// Render drivers list
function renderDrivers() {
    driverList.innerHTML = '';
    
    if (drivers.length === 0) {
        driverList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-user-slash"></i>
                <p>No drivers added yet</p>
            </div>
        `;
        return;
    }
    
    // Keep controls enabled; guardModify will block and show login banner
    drivers.forEach(driver => {
        const driverTires = tires.filter(tire => tire.driverId === driver.id);
        
        const driverCard = document.createElement('div');
        driverCard.className = 'card driver-card';
        const avatarHtml = driver.photo
            ? `<img class="driver-avatar" src="${driver.photo}" alt="${driver.name}">`
            : `<div class="driver-avatar placeholder">${(driver.name || '?').split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}</div>`;
        driverCard.innerHTML = `
            <div class="card-header">
                <div class="driver-header-left">
                    ${avatarHtml}
                    <div>
                        <span class="card-title">${driver.name}</span>
                        <span class="card-subtitle">${driver.team || ''}</span>
                    </div>
                </div>
                <button class="btn-small btn-delete driver-delete-btn" title="Delete Driver">
                    <i class="fas fa-user-minus"></i>
                </button>
            </div>
            ${driver.championship ? `
            <div class="card-detail">
                <span class="card-detail-label">Championship:</span>
                <span>${driver.championship}</span>
            </div>` : ''}
            <div class="card-detail">
                <span class="card-detail-label">Tire Sets:</span>
                <span>${driverTires.length}</span>
            </div>
        `;
        
        // Navigate to driver detail when clicking card
        driverCard.addEventListener('click', () => {
            navigateToDriverDetail(driver.id);
        });
        // Bind delete button (stop propagation so it won't navigate)
        const delBtn = driverCard.querySelector('.driver-delete-btn');
        delBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            deleteDriver(driver.id);
        });
        
        driverList.appendChild(driverCard);
    });
}

// Render tires list
function renderTires() {
    tireList.innerHTML = '';
    
    // Apply filters
    const selectedDriverId = driverFilter.value;
    const selectedCompound = compoundFilter.value;
    const selectedMountedStatus = mountedFilter.value;
    
    let filteredTires = [...tires];
    
    if (selectedDriverId !== 'all') {
        filteredTires = filteredTires.filter(tire => tire.driverId === selectedDriverId);
    }
    
    if (selectedCompound !== 'all') {
        filteredTires = filteredTires.filter(tire => tire.compound === selectedCompound);
    }
    
    // Apply mounted filter
    if (selectedMountedStatus !== 'all') {
        const isMounted = selectedMountedStatus === 'mounted';
        filteredTires = filteredTires.filter(tire => tire.mounted === isMounted);
    }
    
    if (filteredTires.length === 0) {
        tireList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-circle-notch"></i>
                <p>No tire sets found</p>
            </div>
        `;
        return;
    }
    
    // Keep controls enabled; guardModify will block and show login banner
    filteredTires.forEach(tire => {
        const driver = drivers.find(d => d.id === tire.driverId);
        const tireCard = document.createElement('div');
        tireCard.className = `card tire-card ${tire.compound} ${tire.trashed ? 'trashed' : ''}`;
        
        // Calculate mileage color
        let mileageColor = '#4CAF50'; // Green by default
        if (tire.mileage > 90) {
            // Calculate gradient from yellow to red between 90-120km
            const percentage = Math.min(1, (tire.mileage - 90) / 30);
            const r = Math.floor(255);
            const g = Math.floor(204 * (1 - percentage));
            const b = 0;
            mileageColor = `rgb(${r}, ${g}, ${b})`;
        } else if (tire.mileage > 60) {
            mileageColor = '#FFCC00'; // Yellow
        }
        
        const dateAdded = new Date(tire.dateAdded).toLocaleDateString();
        
        // Build recent sessions block for inventory cards
        let sessionsHtml = '';
        if (tire.sessions && tire.sessions.length > 0) {
            let list = '<ul class="sessions-list">';
            tire.sessions.slice(0, 5).forEach(sess => {
                const label = `${sess.trackName || 'Session'}${sess.sessionName ? ' • ' + sess.sessionName : ''}`;
                const distKm = Math.round(sess.distanceKm || 0);
                const laps = sess.laps || 0;
                list += `<li>${label} — ${distKm} km, ${laps} laps <button class="btn-icon btn-delete-session" title="Delete" onclick="deleteTireSession('${tire.id}','${sess.id}')"><i class="fas fa-times"></i></button></li>`;
            });
            list += '</ul>';
            sessionsHtml = `
            <div class="card-detail">
                <span class="card-detail-label">Recent Sessions:</span>
                <div style="font-weight: normal;">${list}</div>
            </div>`;
        } else {
            sessionsHtml = `
            <div class="card-detail">
                <span class="card-detail-label">Recent Sessions:</span>
                <span>No sessions recorded</span>
            </div>`;
        }
        
        tireCard.innerHTML = `
            <div class="card-header">
                <span class="card-title">${tire.setName}</span>
                <span class="card-subtitle">${getCompoundName(tire.compound)} - ${tire.condition === 'new' ? 'New' : 'Used'}</span>
            </div>
            <div class="card-detail">
                <span class="card-detail-label">Driver:</span>
                <span>${driver ? driver.name : 'Unknown'}</span>
            </div>
            <div class="card-detail">
                <span class="card-detail-label">Laps:</span>
                <span>${tire.laps || 0}</span>
            </div>
            <div class="card-detail">
                <span class="card-detail-label">Mileage:</span>
                <span style="color: ${mileageColor}; font-weight: bold;">${tire.mileage || 0} km</span>
            </div>
            <div class="card-detail">
                <span class="card-detail-label">Added:</span>
                <span>${dateAdded}</span>
            </div>
            ${sessionsHtml}
            ${tire.notes ? `<div class="card-notes">${tire.notes}</div>` : ''}
            <div class="card-status">
                <label class="status-checkbox">
                    <input type="checkbox" ${tire.trashed ? 'checked' : ''} onchange="toggleTrashedStatus('${tire.id}', this.checked)">
                    Trashed
                </label>
                <label class="status-checkbox">
                    <input type="checkbox" ${tire.mounted ? 'checked' : ''} onchange="toggleMountedStatus('${tire.id}', this.checked)">
                    Mounted
                </label>
            </div>
            <div class="card-actions">
                <button class="btn-small" onclick="updateTireMileage('${tire.id}')">
                    <i class="fas fa-edit"></i> Update
                </button>
                <button class="btn-small btn-delete" onclick="deleteTire('${tire.id}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `;
        
        tireList.appendChild(tireCard);
    });
}

// Update driver selects in forms and filters
function updateDriverSelects() {
    // Clear existing options
    driverFilter.innerHTML = '<option value="all">All Drivers</option>';
    tireDriverSelect.innerHTML = '';
    
    // Add driver options
    drivers.forEach(driver => {
        const filterOption = document.createElement('option');
        filterOption.value = driver.id;
        filterOption.textContent = driver.name;
        driverFilter.appendChild(filterOption);
        
        const selectOption = document.createElement('option');
        selectOption.value = driver.id;
        selectOption.textContent = driver.name;
        tireDriverSelect.appendChild(selectOption);
    });
}

// Populate championship suggestions from existing drivers
function updateChampionshipsDatalist() {
    const dataList = document.getElementById('championships-list');
    if (!dataList) return;

    // Collect unique non-empty championships
    const set = new Set();
    drivers.forEach(d => {
        if (d.championship && d.championship.trim().length > 0) {
            set.add(d.championship.trim());
        }
    });

    // Clear existing options
    dataList.innerHTML = '';

    // Add options
    Array.from(set).sort().forEach(ch => {
        const opt = document.createElement('option');
        opt.value = ch;
        dataList.appendChild(opt);
    });
}

// Update statistics
function updateStats() {
    // Update total tires count (guarded if card removed)
    if (totalTiresCount) totalTiresCount.textContent = tires.length;
    
    // Update KPI stats
    updateKpiStats();

    // Update compound stats
    updateCompoundStats();
    
    // Update driver stats
    updateDriverStats();
    // Admin-only audit summary visibility in Stats
    if (auditLogContainer) {
        if (requireAdmin()) {
            renderAuditSummary();
        } else {
            auditLogContainer.innerHTML = '<p class="muted">Activity details are visible to admins only.</p>';
        }
    }
}

// ===== Auth & Audit =====
function loadAuth() {
    const storedAuth = localStorage.getItem('auth');
    auth = storedAuth ? JSON.parse(storedAuth) : null;
    const usersStr = localStorage.getItem('users');
    if (!usersStr) {
        const defaultUsers = [{ username: 'admin', password: 'admin', role: 'admin' }];
        localStorage.setItem('users', JSON.stringify(defaultUsers));
    }
}

function updateAuthUI() {
    if (!loginBtnLabel) return;
    if (auth && auth.user) {
        loginBtnLabel.textContent = `Logout (${auth.user})`;
    } else {
        loginBtnLabel.textContent = 'Login';
    }
    // Admin-only Activity tab visibility
    const activityTabBtn = document.querySelector('.tab-btn[data-tab="activity"]');
    const activityTabContent = document.getElementById('activity-tab');
    const isAdmin = requireAdmin();
    if (activityTabBtn) activityTabBtn.style.display = isAdmin ? '' : 'none';
    if (activityTabContent) activityTabContent.style.display = isAdmin ? '' : 'none';
    if (!isAdmin) {
        const activeBtn = document.querySelector('.tab-btn.active');
        if (activeBtn && activeBtn.getAttribute('data-tab') === 'activity') {
            setActiveTab('stats');
        }
    }
    // Hide Stats summary button for non-admins
    if (openActivityLogBtn) openActivityLogBtn.style.display = isAdmin ? '' : 'none';
    // Keep add buttons enabled; clicks are guarded to show login banner
    // Re-render to apply disabled states consistently
    renderDrivers();
    renderTires();
    updateStats();
}

function handleLoginSubmit(e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const found = users.find(u => u.username === username && u.password === password);
    if (!found) { alert('Invalid credentials'); return; }
    auth = { user: found.username, role: found.role };
    localStorage.setItem('auth', JSON.stringify(auth));
    updateAuthUI();
    if (loginModalEl) loginModalEl.style.display = 'none';
}

function handleRegisterSubmit(e) {
    e.preventDefault();
    const username = document.getElementById('reg-username').value.trim();
    const password = document.getElementById('reg-password').value;
    const role = document.getElementById('reg-role').value;
    if (!username || !password) { alert('Username and password required'); return; }
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some(u => u.username === username)) { alert('Username already exists'); return; }
    users.push({ username, password, role });
    localStorage.setItem('users', JSON.stringify(users));
    alert('Account created. You can login now.');
    if (registerModalEl) registerModalEl.style.display = 'none';
    if (loginModalEl) loginModalEl.style.display = 'block';
}

function logout() {
    auth = null;
    localStorage.removeItem('auth');
}

// Banner + highlight helpers
function showAuthBanner(message) {
    if (authBannerTextEl) authBannerTextEl.textContent = message || 'You must log in before performing any action.';
    if (authBannerEl) {
        // Ensure banner is attached to body so position: fixed is viewport-relative
        try {
            if (authBannerEl.parentElement !== document.body) {
                document.body.appendChild(authBannerEl);
            }
        } catch (e) { /* no-op if DOM is not ready */ }
        authBannerEl.style.zIndex = '10000';
        authBannerEl.classList.remove('hidden');
    }
    if (loginBtn) {
        loginBtn.classList.add('highlight-login');
        setTimeout(() => loginBtn.classList.remove('highlight-login'), 1400);
    }
    // Auto-hide after a delay
    if (authBannerEl) {
        clearTimeout(authBannerEl._hideTimer);
        authBannerEl._hideTimer = setTimeout(() => hideAuthBanner(), 5000);
    }
}

function hideAuthBanner() {
    if (authBannerEl) authBannerEl.classList.add('hidden');
}

function requireLoggedIn() {
    return !!(auth && auth.user);
}

function requireAdmin() {
    return auth && auth.role === 'admin';
}

function guardModify() {
    if (!requireLoggedIn()) { showAuthBanner('You must log in before performing any action.'); return false; }
    if (!requireAdmin()) { alert('Only admin can modify'); return false; }
    return true;
}

function logAction(action, details) {
    const entry = { action, details, user: auth && auth.user ? auth.user : 'guest', at: new Date().toISOString() };
    const log = JSON.parse(localStorage.getItem('auditLog') || '[]');
    log.unshift(entry);
    localStorage.setItem('auditLog', JSON.stringify(log));
}

function renderAuditSummary() {
    const log = JSON.parse(localStorage.getItem('auditLog') || '[]');
    if (!auditLogContainer) return;
    if (log.length === 0) { auditLogContainer.innerHTML = '<p class="muted">No activity yet.</p>'; return; }
    const items = log.slice(0, 5).map(entry => {
        const time = new Date(entry.at).toLocaleString();
        const detailsStr = typeof entry.details === 'object' ? JSON.stringify(entry.details) : String(entry.details);
        return `<div class="audit-item"><strong>${entry.action}</strong> by <em>${entry.user}</em> at ${time}<br><small>${detailsStr}</small></div>`;
    }).join('');
    auditLogContainer.innerHTML = items;
}

function renderFullAuditLog() {
    const log = JSON.parse(localStorage.getItem('auditLog') || '[]');
    if (!activityListEl) return;
    if (log.length === 0) { activityListEl.innerHTML = '<p class="muted">No activity recorded.</p>'; return; }
    const items = log.slice(0, 100).map(entry => {
        const time = new Date(entry.at).toLocaleString();
        const detailsStr = typeof entry.details === 'object' ? JSON.stringify(entry.details) : String(entry.details);
        return `<div class="audit-item"><strong>${entry.action}</strong> by <em>${entry.user}</em> at ${time}<br><small>${detailsStr}</small></div>`;
    }).join('');
    activityListEl.innerHTML = items;
}

// Update compound statistics
function updateCompoundStats() {
    compoundStats.innerHTML = '';

    // Count totals for supported compounds
    const totals = {
        slicks: tires.filter(t => t.compound === 'slicks').length,
        wet: tires.filter(t => t.compound === 'wet').length,
    };

    const maxCount = Math.max(totals.slicks, totals.wet, 1);

    ['slicks', 'wet'].forEach(compound => {
        const count = totals[compound];
        const percentage = (count / maxCount) * 100;
        const statBar = document.createElement('div');
        statBar.className = 'stat-bar';
        statBar.innerHTML = `
            <div class="stat-bar-label">
                <span>${getCompoundName(compound)}</span>
                <span>${count}</span>
            </div>
            <div class="stat-bar-track">
                <div class="stat-bar-fill" style="width: ${percentage}%; background-color: ${getCompoundColor(compound)};"></div>
            </div>
        `;
        compoundStats.appendChild(statBar);
    });
}

// Update driver statistics
function updateDriverStats() {
    driverStats.innerHTML = '';
    
    if (drivers.length === 0) {
        driverStats.innerHTML = '<p>No drivers added yet</p>';
        return;
    }
    
    const driverTireCounts = {};
    
    // Count tires by driver
    drivers.forEach(driver => {
        driverTireCounts[driver.id] = tires.filter(tire => tire.driverId === driver.id).length;
    });
    
    // Find the maximum value for scaling
    const maxCount = Math.max(...Object.values(driverTireCounts), 1);
    
    // Create stat bars
    for (const [driverId, count] of Object.entries(driverTireCounts)) {
        const driver = drivers.find(d => d.id === driverId);
        if (driver) {
            const percentage = (count / maxCount) * 100;
            
            const statBar = document.createElement('div');
            statBar.className = 'stat-bar';
            statBar.innerHTML = `
                <div class="stat-bar-label">
                    <span>${driver.name}</span>
                    <span>${count}</span>
                </div>
                <div class="stat-bar-track">
                    <div class="stat-bar-fill" style="width: ${percentage}%;"></div>
                </div>
            `;
            
            driverStats.appendChild(statBar);
        }
    }
}

// Helper function to get compound display name
function getCompoundName(compound) {
    const names = {
        slicks: 'Slicks',
        wet: 'Wets'
    };
    
    return names[compound] || compound;
}

// Helper function to get compound color
function getCompoundColor(compound) {
    const colors = {
        slicks: '#ff4d4d',
        wet: '#3399ff'
    };
    
    return colors[compound] || '#e63946';
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('tireTrackerDrivers', JSON.stringify(drivers));
    localStorage.setItem('tireTrackerTires', JSON.stringify(tires));
    localStorage.setItem('tireTrackerPaperwork', JSON.stringify(paperworkData));
    localStorage.setItem('tireTrackerWeekendLineup', JSON.stringify(weekendLineup));
    // Events persistence
    localStorage.setItem('tireTrackerEvents', JSON.stringify(events));
    localStorage.setItem('tireTrackerCurrentEventId', JSON.stringify(currentEventId));
    localStorage.setItem('tireTrackerWeekendLineupByEvent', JSON.stringify(weekendLineupByEvent));
}

// Load data from localStorage
function loadData() {
    const savedDrivers = localStorage.getItem('tireTrackerDrivers');
    const savedTires = localStorage.getItem('tireTrackerTires');
    const savedPaperwork = localStorage.getItem('tireTrackerPaperwork');
    const savedWeekend = localStorage.getItem('tireTrackerWeekendLineup');
    const savedEvents = localStorage.getItem('tireTrackerEvents');
    const savedCurrentEventId = localStorage.getItem('tireTrackerCurrentEventId');
    const savedWeekendByEvent = localStorage.getItem('tireTrackerWeekendLineupByEvent');
    
    if (savedDrivers) {
        drivers = JSON.parse(savedDrivers);
    }
    
    if (savedTires) {
        tires = JSON.parse(savedTires);
    }

    if (savedPaperwork) {
        try {
            paperworkData = JSON.parse(savedPaperwork) || {};
        } catch (e) {
            paperworkData = {};
        }
    }

    if (savedWeekend) {
        try {
            weekendLineup = JSON.parse(savedWeekend) || [];
        } catch (e) {
            weekendLineup = [];
        }
    }
    if (savedEvents) {
        try { events = JSON.parse(savedEvents) || []; } catch (e) { events = []; }
    }
    if (savedWeekendByEvent) {
        try { weekendLineupByEvent = JSON.parse(savedWeekendByEvent) || {}; } catch (e) { weekendLineupByEvent = {}; }
    }
    if (savedCurrentEventId) {
        try { currentEventId = JSON.parse(savedCurrentEventId) || null; } catch (e) { currentEventId = null; }
    }
    // Migration: if old global lineup exists but no events, create a default event and move lineup
    if ((!events || events.length === 0) && (weekendLineup && weekendLineup.length > 0)) {
        const defId = 'default-event';
        events = [{ id: defId, championship: 'Default', round: 1, name: 'Unassigned', date: new Date().toISOString().slice(0,10), createdAt: new Date().toISOString() }];
        currentEventId = defId;
        weekendLineupByEvent[defId] = weekendLineup;
        // keep old global for backward compatibility
        saveData();
    }
}

// Helpers for per-event lineup scoping
function getCurrentEventLineup() {
    if (!currentEventId) return [];
    return weekendLineupByEvent[currentEventId] || [];
}
function setCurrentEventLineup(list) {
    if (!currentEventId) return;
    weekendLineupByEvent[currentEventId] = list;
    saveData();
}

// Make functions available globally
window.updateTireMileage = updateTireMileage;
window.addTireEvent = addTireEvent;
window.deleteTire = deleteTire;
window.deleteDriver = deleteDriver;
window.toggleTrashedStatus = toggleTrashedStatus;
window.toggleMountedStatus = toggleMountedStatus;

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
    // Auth banner dismiss
    if (authBannerCloseBtn) {
        authBannerCloseBtn.addEventListener('click', hideAuthBanner);
    }
// Update KPI statistics
function updateKpiStats() {
    // Available sets: non-trashed tire records
    const availableCount = tires.filter(t => !t.trashed).length;
    if (kpiAvailableSetsEl) kpiAvailableSetsEl.textContent = String(availableCount);

    // Mounted sets: mounted and not trashed
    const mountedCount = tires.filter(t => t.mounted && !t.trashed).length;
    if (kpiMountedSetsEl) kpiMountedSetsEl.textContent = String(mountedCount);

    // Sets per driver (non-trashed)
    if (kpiSetsPerDriverEl) {
        kpiSetsPerDriverEl.innerHTML = '';
        const data = drivers.map(d => {
            const count = tires.filter(t => t.driverId === d.id && !t.trashed).length;
            return { name: d.name, count };
        }).filter(item => item.count > 0);

        if (data.length === 0) {
            kpiSetsPerDriverEl.innerHTML = '<p class="muted">No sets assigned yet</p>';
            return;
        }

        const list = document.createElement('div');
        list.className = 'stat-details';
        data.forEach(({ name, count }) => {
            const row = document.createElement('div');
            row.className = 'stat-bar-label';
            row.innerHTML = `<span>${name}</span><span>${count}</span>`;
            list.appendChild(row);
        });
        kpiSetsPerDriverEl.appendChild(list);
    }
}
    // Home screen app selection
    if (openTiresAppEl) {
        openTiresAppEl.addEventListener('click', () => setActiveApp('tires'));
    }
    if (openPartsAppEl) {
        openPartsAppEl.addEventListener('click', () => setActiveApp('parts'));
    }
    if (openHistoryAppEl) {
        openHistoryAppEl.addEventListener('click', () => setActiveApp('history'));
    }
    if (openPaperAppEl) {
        openPaperAppEl.addEventListener('click', () => setActiveApp('paper'));
    }
// Set active high-level module
function setActiveApp(appId) {
    currentApp = appId;
    // Hide everything first
    tabContents.forEach(content => content.classList.remove('active'));
    if (navEl) navEl.style.display = (appId === 'tires') ? 'flex' : 'none';

    if (appId === 'home') {
        if (homeScreenEl) homeScreenEl.classList.add('active');
        return;
    }
    if (appId === 'tires') {
        // Default to Drivers list when entering Tire Tracker
        const driversTab = document.getElementById('drivers-tab');
        if (driversTab) driversTab.classList.add('active');
        renderDrivers();
        return;
    }
    if (appId === 'parts') {
        const partsTab = document.getElementById('parts-tab');
        if (partsTab) partsTab.classList.add('active');
        renderPartsInventory();
        return;
    }
    if (appId === 'history') {
        const historyTab = document.getElementById('history-tab');
        if (historyTab) historyTab.classList.add('active');
        renderHistoryAnalytics();
        return;
    }
    if (appId === 'paper') {
        const paperTab = document.getElementById('paper-tab');
        if (paperTab) paperTab.classList.add('active');
        // Always start from the Event List when opening the module
        currentEventId = null;
        renderPaperwork();
        return;
    }
}