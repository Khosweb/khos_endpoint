// ui.js

// DOM Elements
const els = {
    loginSection: document.getElementById('login-section'),
    dashboardSection: document.getElementById('dashboard-section'),
    userDisplay: document.getElementById('user-display'),
    loginError: document.getElementById('login-error'),
    loadingOverlay: document.getElementById('loading-overlay'),
    dropzoneText: document.getElementById('dropzone-text'),
    dropzone: document.getElementById('dropzone'),
    tableBody: document.getElementById('tracking-table-body'),
    noDataMsg: document.getElementById('no-data'),
    statTotal: document.getElementById('stat-total'),
    statRed: document.getElementById('stat-red'),
    statYellow: document.getElementById('stat-yellow'),
    statGreen: document.getElementById('stat-green'),
    exportBtn: document.getElementById('export-error-btn')
};

export const ui = {
    initTheme() {
        const currentTheme = localStorage.getItem('theme') || 'light';
        const isDark = currentTheme === 'dark';
        if (isDark) document.documentElement.classList.add('dark');
        
        const themeIcon = document.getElementById('theme-icon');
        if (themeIcon) {
            themeIcon.className = isDark ? 'fas fa-sun text-sm' : 'fas fa-moon text-sm';
        }
    },

    toggleTheme() {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        const themeIcon = document.getElementById('theme-icon');
        if (themeIcon) {
            themeIcon.className = isDark ? 'fas fa-sun text-sm' : 'fas fa-moon text-sm';
        }
    },

    showLogin(message = '') {
        els.loginSection.classList.remove('hidden');
        els.dashboardSection.classList.add('hidden');
        if (message) this.showLoginError(message);
    },

    showDashboard(userName) {
        els.loginSection.classList.add('hidden');
        els.dashboardSection.classList.remove('hidden');
        els.userDisplay.textContent = `สวัสดี, ${userName}`;
    },

    showLoginError(msg) {
        els.loginError.textContent = msg;
        els.loginError.classList.remove('hidden');
    },

    setLoading(isLoading) {
        if (isLoading) els.loadingOverlay.classList.remove('hidden');
        else els.loadingOverlay.classList.add('hidden');
    },

    updateDropzoneUI(file) {
        if (file) {
            els.dropzoneText.textContent = `ไฟล์ที่เลือก: ${file.name}`;
            els.dropzoneText.className = "text-xs font-bold text-emerald-600 dark:text-emerald-400";
            els.dropzone.classList.add('border-emerald-500', 'bg-emerald-50/50', 'dark:bg-emerald-900/20');
        } else {
            els.dropzoneText.textContent = "ลากวางไฟล์ที่นี่ หรือ คลิกเพื่อเลือก";
            els.dropzoneText.className = "text-xs font-semibold text-slate-600 dark:text-slate-300 truncate";
            els.dropzone.classList.remove('border-emerald-500', 'bg-emerald-50/50', 'dark:bg-emerald-900/20');
        }
    },

    renderTable(data, sortBy = '', sortDesc = false) {
        // Update table headers to show sorting indicators
        const headers = document.querySelectorAll('#tracking-table-thead th[data-sort]');
        headers.forEach(th => {
            const field = th.getAttribute('data-sort');
            // Remove existing sort indicators from text
            let text = th.textContent.replace(/  [▲▼]/g, '');
            th.className = th.className.replace(' text-blue-600 dark:text-blue-400', '');
            
            if (field === sortBy) {
                text += sortDesc ? '  ▼' : '  ▲';
                th.classList.add('text-blue-600', 'dark:text-blue-400');
            }
            th.textContent = text;
        });

        els.tableBody.innerHTML = '';
        if (!data || data.length === 0) {
            els.noDataMsg.classList.remove('hidden');
            if (els.exportBtn) els.exportBtn.classList.add('hidden'); // ซ่อนปุ่ม Export หากไม่มีข้อมูล
            return;
        }
        
        els.noDataMsg.classList.add('hidden');
        
        // เช็คว่ามีรายการที่ผิดพลาดไหม เพื่อแสดง/ซ่อนปุ่ม Export
        const hasErrors = data.some(item => item.color_status === 'RED' || item.color_status === 'YELLOW');
        if (els.exportBtn) {
            if(hasErrors) els.exportBtn.classList.remove('hidden');
            else els.exportBtn.classList.add('hidden');
        }

        data.forEach(item => {
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-slate-50/70 dark:hover:bg-slate-800/45 border-b border-slate-100 dark:border-slate-800/80 transition duration-150';
            
            const statusClass = item.color_status === 'RED' ? 'status-red' : 
                              item.color_status === 'YELLOW' ? 'status-yellow' : 'status-green';
            
            const statusText = item.color_status === 'RED' ? 'ยังไม่เปิด Authen' : 
                              item.color_status === 'YELLOW' ? 'รอปิด Endpoint' : 'สมบูรณ์';

            const checkClaimClass = item.check_claimcode === 'ตรง' ? 'status-green' : 
                                  item.check_claimcode === 'ตรวจสอบ' ? 'status-yellow' : 
                                  item.check_claimcode === 'ไม่ตรง' ? 'status-red' : 
                                  'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400';
            
            const checkClaimVal = item.check_claimcode || 'ยังไม่ได้นำเข้า';

            tr.innerHTML = `
                <td class="py-3.5 px-4 font-mono text-xs font-semibold">
                    <span class="text-blue-600 dark:text-blue-400 bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100/50 dark:border-blue-900/30 rounded-lg px-2.5 py-1 inline-block">${item.vn}</span>
                </td>
                <td class="py-3.5 px-4 text-slate-700 dark:text-slate-200 font-medium tracking-wide">${item.cid}</td>
                <td class="py-3.5 px-4 font-mono text-xs text-slate-600">
                    ${item.nhso_authen_code ? `<span class="bg-slate-100 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 px-2 py-0.5 rounded font-medium dark:text-slate-300">${item.nhso_authen_code}</span>` : '<span class="text-slate-400 dark:text-slate-600">-</span>'}
                </td>
                <td class="py-3.5 px-4 text-xs font-medium text-slate-500 dark:text-slate-400">${item.pcode || '<span class="text-slate-400 dark:text-slate-600">-</span>'}</td>
                <td class="py-3.5 px-4 text-xs font-semibold text-slate-700 dark:text-slate-200">${(item.uc_money != null && !isNaN(item.uc_money)) ? Number(item.uc_money).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '<span class="text-slate-400 dark:text-slate-600">-</span>'}</td>
                <td class="py-3.5 px-4 text-xs text-emerald-600 dark:text-emerald-400 font-bold">${item.claim_code || '<span class="text-slate-400 dark:text-slate-600">-</span>'}</td>
                <td class="py-3.5 px-4 text-xs text-indigo-500 dark:text-indigo-400 font-semibold">${item.authen_code_type || '<span class="text-slate-400 dark:text-slate-600">-</span>'}</td>
                <td class="py-3.5 px-4 text-xs text-slate-500 dark:text-slate-400 truncate max-w-[150px]" title="${item.pttype_note || ''}">${item.pttype_note || '<span class="text-slate-400 dark:text-slate-600">-</span>'}</td>
                <td class="py-3.5 px-4 text-xs text-slate-500 dark:text-slate-400 font-medium">${item.department || '<span class="text-slate-400 dark:text-slate-600">-</span>'}</td>
                <td class="py-3.5 px-4 text-xs text-slate-500 dark:text-slate-400 font-medium">${item.staff || '<span class="text-slate-400 dark:text-slate-600">-</span>'}</td>
                <td class="py-3.5 px-4 text-center">
                    <span class="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-sm leading-none ${checkClaimClass}">
                        ${checkClaimVal}
                    </span>
                </td>
                <td class="py-3.5 px-4 text-center">
                    <span class="inline-flex items-center justify-center px-3 py-1 rounded-full text-[11px] font-bold shadow-sm leading-none ${statusClass}">
                        ${statusText}
                    </span>
                </td>
            `;
            els.tableBody.appendChild(tr);
        });
    },

    updateStats(data) {
        if (!data) return;
        const uniquePersons = new Set(data.map(i => i.cid)).size;
        const totalVisits = data.length;
        const red = data.filter(i => i.color_status === 'RED').length;
        const yellow = data.filter(i => i.color_status === 'YELLOW').length;
        const green = data.filter(i => i.color_status === 'GREEN').length;

        els.statTotal.innerHTML = `${uniquePersons} <span class="text-lg text-gray-400">/ ${totalVisits}</span>`;
        els.statRed.textContent = red;
        els.statYellow.textContent = yellow;
        els.statGreen.textContent = green;
    },

    renderWeeklySummary(summaryData, onDateClick) {
        const container = document.getElementById('weekly-summary-container');
        const section = document.getElementById('weekly-summary-section');
        if (!container || !section) return;

        if (!summaryData || summaryData.length === 0) {
            section.classList.add('hidden');
            return;
        }

        section.classList.remove('hidden');
        container.innerHTML = '';

        summaryData.forEach(day => {
            const date = new Date(day.visit_date);
            const dateStr = day.visit_date.split('T')[0];
            const displayDate = date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
            
            // เลือกสีหลักของการ์ดตามความสำคัญ (แดง > เหลือง > เขียว)
            const mainColor = day.red > 0 ? 'border-red-500 bg-red-50/30 dark:bg-red-900/10' : 
                             day.yellow > 0 ? 'border-amber-500 bg-amber-50/30 dark:bg-amber-900/10' : 
                             'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-900/10';

            const card = document.createElement('div');
            card.className = `p-3 rounded-xl border ${mainColor} cursor-pointer transition transform hover:-translate-y-1 hover:shadow-md text-center`;
            card.onclick = () => onDateClick(dateStr);

            card.innerHTML = `
                <p class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">${displayDate}</p>
                <div class="flex justify-center space-x-1.5 items-center">
                    <span class="w-2 h-2 rounded-full bg-red-500" title="ยังไม่เปิด Authen"></span>
                    <span class="text-xs font-bold">${day.red}</span>
                    <span class="w-2 h-2 rounded-full bg-amber-500 ml-1" title="รอปิด Endpoint"></span>
                    <span class="text-xs font-bold">${day.yellow}</span>
                </div>
            `;
            container.appendChild(card);
        });
    },

    switchTab(tabId) {
        const tabTracker = document.getElementById('tab-tracker');
        const tabGrafana = document.getElementById('tab-grafana');
        const tabEmbedGrafana = document.getElementById('tab-embed-grafana');
        const trackerView = document.getElementById('tracker-view-container');
        const grafanaView = document.getElementById('grafana-view-container');
        const embedGrafanaView = document.getElementById('embed-grafana-view-container');

        const activeClass = 'px-4 py-2.5 text-xs font-extrabold tracking-wider border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 focus:outline-none transition cursor-pointer flex items-center space-x-2 uppercase';
        const inactiveClass = 'px-4 py-2.5 text-xs font-extrabold tracking-wider border-b-2 border-transparent text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 focus:outline-none transition cursor-pointer flex items-center space-x-2 uppercase';

        if (tabId === 'tab-tracker') {
            tabTracker.className = activeClass;
            tabGrafana.className = inactiveClass;
            tabEmbedGrafana.className = inactiveClass;
            trackerView.classList.remove('hidden');
            grafanaView.classList.add('hidden');
            embedGrafanaView.classList.add('hidden');
        } else if (tabId === 'tab-grafana') {
            tabTracker.className = inactiveClass;
            tabGrafana.className = activeClass;
            tabEmbedGrafana.className = inactiveClass;
            trackerView.classList.add('hidden');
            grafanaView.classList.remove('hidden');
            embedGrafanaView.classList.add('hidden');
        } else if (tabId === 'tab-embed-grafana') {
            tabTracker.className = inactiveClass;
            tabGrafana.className = inactiveClass;
            tabEmbedGrafana.className = activeClass;
            trackerView.classList.add('hidden');
            grafanaView.classList.add('hidden');
            embedGrafanaView.classList.remove('hidden');
        }
    },

    renderSavedQueriesDropdown(queries, selectedId = '') {
        const select = document.getElementById('query-template-select');
        if (!select) return;
        
        select.innerHTML = '<option value="" disabled selected>-- โหลดคำสั่ง SQL --</option>';
        
        queries.forEach(q => {
            const opt = document.createElement('option');
            opt.value = q.id;
            opt.textContent = `[${q.db_type.toUpperCase()}] ${q.name}`;
            if (String(q.id) === String(selectedId)) {
                opt.selected = true;
            }
            select.appendChild(opt);
        });
    },

    renderGrafanaTable(rows, sortBy = '', sortDesc = false, searchFilter = '', onHeaderClick) {
        const thead = document.getElementById('query-table-head');
        const tbody = document.getElementById('query-table-body');
        const noData = document.getElementById('query-no-data');
        
        thead.innerHTML = '';
        tbody.innerHTML = '';
        
        if (!rows || rows.length === 0) {
            noData.classList.remove('hidden');
            return;
        }
        
        // 1. กรองข้อมูลในฝั่งไคลเอนต์ตาม Search Box
        let filteredRows = [...rows];
        if (searchFilter) {
            const query = searchFilter.toLowerCase();
            filteredRows = filteredRows.filter(row => {
                return Object.values(row).some(val => 
                    String(val || '').toLowerCase().includes(query)
                );
            });
        }
        
        // 2. จัดเรียงข้อมูลในฝั่งไคลเอนต์ตามคอลัมน์ที่เลือก
        if (sortBy) {
            filteredRows.sort((a, b) => {
                let valA = a[sortBy];
                let valB = b[sortBy];
                
                // ตรวจสอบว่าเป็นตัวเลขหรือไม่
                if (valA !== null && valB !== null && !isNaN(valA) && !isNaN(valB) && String(valA).trim() !== '' && String(valB).trim() !== '') {
                    valA = Number(valA);
                    valB = Number(valB);
                } else {
                    valA = String(valA || '').toLowerCase();
                    valB = String(valB || '').toLowerCase();
                }
                
                if (valA < valB) return sortDesc ? 1 : -1;
                if (valA > valB) return sortDesc ? -1 : 1;
                return 0;
            });
        }
        
        if (filteredRows.length === 0) {
            noData.classList.remove('hidden');
            return;
        }
        
        noData.classList.add('hidden');
        
        // 3. วาดหัวข้อคอลัมน์ (Headers)
        const firstRow = filteredRows[0];
        const headers = Object.keys(firstRow);
        
        const trHead = document.createElement('tr');
        headers.forEach(header => {
            const th = document.createElement('th');
            th.className = 'py-3 px-4 cursor-pointer hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition duration-150 select-none text-[11px] font-bold tracking-wider';
            th.onclick = () => onHeaderClick(header);
            
            let displayName = header;
            if (header === sortBy) {
                displayName += sortDesc ? '  ▼' : '  ▲';
                th.classList.add('text-blue-600', 'dark:text-blue-400');
            }
            
            th.textContent = displayName;
            trHead.appendChild(th);
        });
        thead.appendChild(trHead);
        
        // 4. วาดข้อมูล (Rows)
        filteredRows.forEach((row, idx) => {
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-slate-50/70 dark:hover:bg-slate-800/45 border-b border-slate-100 dark:border-slate-800/80 transition duration-150 text-slate-700 dark:text-slate-200';
            
            headers.forEach(header => {
                const td = document.createElement('td');
                td.className = 'py-3 px-4 text-xs font-medium truncate max-w-[200px]';
                
                let val = row[header];
                
                // ตกแต่งรูปแบบการแสดงผลคอลัมน์พิเศษ
                if (val === null || val === undefined) {
                    td.innerHTML = '<span class="text-slate-400 dark:text-slate-600">-</span>';
                } else if (header.toLowerCase() === 'color_status' || header.toLowerCase() === 'status_color') {
                    const statusClass = val === 'RED' ? 'status-red' : 
                                      val === 'YELLOW' ? 'status-yellow' : 
                                      val === 'GREEN' ? 'status-green' : '';
                    td.innerHTML = `<span class="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${statusClass}">${val}</span>`;
                } else if (header.toLowerCase() === 'check_claimcode' || header.toLowerCase() === 'check_claim') {
                    const statusClass = val === 'ตรง' ? 'status-green' : 
                                      val === 'ตรวจสอบ' ? 'status-yellow' : 
                                      val === 'ไม่ตรง' ? 'status-red' : 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400';
                    td.innerHTML = `<span class="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${statusClass}">${val}</span>`;
                } else if (header.toLowerCase() === 'vn' || header.toLowerCase() === 'hn') {
                    td.className = 'py-2 px-4 font-mono text-[11px] font-semibold';
                    td.innerHTML = `<span class="text-blue-600 dark:text-blue-400 bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100/50 dark:border-blue-900/30 rounded px-2 py-0.5 inline-block">${val}</span>`;
                } else if (header.toLowerCase().includes('cid')) {
                    td.className = 'py-3 px-4 font-mono text-xs text-slate-600 dark:text-slate-400';
                    td.textContent = val;
                } else if (header.toLowerCase() === 'uc_money' && !isNaN(val)) {
                    td.className = 'py-3 px-4 text-xs font-semibold text-right';
                    td.textContent = Number(val).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
                } else if (typeof val === 'object' && val.type === 'Buffer' && Array.isArray(val.data)) {
                    // ดีโค้ดข้อมูล Binary (CAST CONVERT USING utf8) กลับเป็นภาษาไทย
                    try {
                        const decoder = new TextDecoder('utf-8');
                        const bytes = new Uint8Array(val.data);
                        td.textContent = decoder.decode(bytes);
                    } catch (e) {
                        td.textContent = '[Binary Data]';
                    }
                } else {
                    td.textContent = val;
                }
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
    }
};
