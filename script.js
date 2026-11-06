/**
 * ============================================================================
 * Smart Expense Tracker - by Tasleem Bibi
 * A clean, modern, pure vanilla HTML5, CSS3 & JavaScript Expense Tracker.
 * No external chart libraries or heavy frameworks - pure web fundamentals.
 * ============================================================================
 */

// Key used to store expenses in browser LocalStorage
const STORAGE_KEY = 'tasleem_smart_expense_tracker_data_v1';

// Supported Expense Categories
const CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Education',
  'Health',
  'Other'
];

// Color palette mapping for categories (matching our purple & teal UI)
const CATEGORY_COLORS = {
  Food: { primary: '#f97316', bg: '#fff7ed', dark: '#c2410c' },
  Transport: { primary: '#0284c7', bg: '#f0f9ff', dark: '#0369a1' },
  Shopping: { primary: '#ec4899', bg: '#fdf2f8', dark: '#be185d' },
  Bills: { primary: '#eab308', bg: '#fefce8', dark: '#a16207' },
  Education: { primary: '#7c3aed', bg: '#f5f3ff', dark: '#5b21b6' },
  Health: { primary: '#10b981', bg: '#ecfdf5', dark: '#047857' },
  Other: { primary: '#64748b', bg: '#f1f5f9', dark: '#334155' }
};

// 12 Authentic sample expenses for a student studying in Sukkur, Sindh, Pakistan
const SAMPLE_SUKKUR_EXPENSES = [
  {
    id: 'exp-1',
    title: 'Sukkur IBA Semester Tuition Installment',
    amount: 35000,
    category: 'Education',
    date: '2026-11-02',
    note: 'Fall semester installment fee via challan voucher'
  },
  {
    id: 'exp-2',
    title: 'Sukkur-Rohri Student Bus Pass & Rickshaw',
    amount: 2200,
    category: 'Transport',
    date: '2026-11-03',
    note: 'Monthly student bus route card & local rickshaw transport'
  },
  {
    id: 'exp-3',
    title: 'Hostel Mess & Military Road Canteen',
    amount: 4800,
    category: 'Food',
    date: '2026-11-04',
    note: 'Weekly hostel mess food and evening chai with batchmates'
  },
  {
    id: 'exp-4',
    title: 'CS Reference Textbooks & Spiral Notebooks',
    amount: 3100,
    category: 'Education',
    date: '2026-11-05',
    note: 'Data Structures book & stationery from Minara Road bazaar'
  },
  {
    id: 'exp-5',
    title: 'Hostel Internet & Room Electricity Share',
    amount: 1850,
    category: 'Bills',
    date: '2026-11-06',
    note: 'Shared high-speed fiber broadband & room utility bill'
  },
  {
    id: 'exp-6',
    title: 'Warm Winter Shalwar Kameez Fabric',
    amount: 4200,
    category: 'Shopping',
    date: '2026-10-28',
    note: 'Winter cloth tailoring material from Shahi Bazaar Sukkur'
  },
  {
    id: 'exp-7',
    title: 'Medical Checkup & Pharmacy Prescription',
    amount: 1450,
    category: 'Health',
    date: '2026-10-25',
    note: 'Seasonal flu medicine, Panadol & multivitamin syrup'
  },
  {
    id: 'exp-8',
    title: 'Sachal Sarmast Hostel Monthly Laundry',
    amount: 1200,
    category: 'Other',
    date: '2026-10-20',
    note: 'Dhobi laundry and uniform ironing charges'
  },
  {
    id: 'exp-9',
    title: 'Fruit & Dry Groceries from Station Road',
    amount: 2600,
    category: 'Food',
    date: '2026-10-18',
    note: 'Bananas, apples, milk, tea bags, and biscuits'
  },
  {
    id: 'exp-10',
    title: 'Intercity Daewoo Bus Ticket to Sukkur',
    amount: 2900,
    category: 'Transport',
    date: '2026-10-14',
    note: 'Weekend family visit return bus ticket'
  },
  {
    id: 'exp-11',
    title: 'Jazz Mobile Monthly Data Package',
    amount: 1350,
    category: 'Bills',
    date: '2026-10-10',
    note: 'Super 4G monthly student bundle with 30GB'
  },
  {
    id: 'exp-12',
    title: 'Laboratory Safety Coat & University ID Lanyard',
    amount: 950,
    category: 'Education',
    date: '2026-10-05',
    note: 'Official lab kit and replacement card holder'
  }
];

/**
 * Global Application State
 */
const AppState = {
  expenses: [],
  selectedMonth: 'all', // 'YYYY-MM' or 'all'
  categoryFilter: 'all',
  searchQuery: '',
  sortBy: 'date-desc',
  expenseToDeleteId: null,
  chartBarBoxes: [] // Coordinates of rendered canvas bars for mouse interactions
};

/**
 * Format any numeric value as Pakistani Rupee currency (e.g. Rs. 1,500)
 * @param {number} amount
 * @returns {string}
 */
function formatPKR(amount) {
  const numeric = Math.round(Number(amount) || 0);
  return `Rs. ${numeric.toLocaleString('en-PK')}`;
}

/**
 * Format date string (YYYY-MM-DD) into readable format (e.g. "Nov 4, 2026")
 * @param {string} dateString
 * @returns {string}
 */
function formatDate(dateString) {
  if (!dateString) return '';
  try {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(year, month, day);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
  } catch {
    // fallback
  }
  return dateString;
}

/**
 * Load expenses from LocalStorage or initialize with sample data
 */
function loadExpensesFromStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        AppState.expenses = parsed;
        return;
      }
    }
  } catch (err) {
    console.error('Error loading data from localStorage:', err);
  }

  // Initialize with Sukkur student sample data
  AppState.expenses = JSON.parse(JSON.stringify(SAMPLE_SUKKUR_EXPENSES));
  saveExpensesToStorage();
}

/**
 * Save current expenses array into LocalStorage
 */
function saveExpensesToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(AppState.expenses));
  } catch (err) {
    console.error('Error saving data to localStorage:', err);
    showToast('Failed to save data locally', 'danger');
  }
}

/**
 * Build dynamic list of months from all expenses
 */
function updateMonthFilterDropdown() {
  const select = document.getElementById('monthFilterSelect');
  if (!select) return;

  const currentSelection = AppState.selectedMonth;
  const monthSet = new Set();

  AppState.expenses.forEach(exp => {
    if (exp.date && exp.date.length >= 7) {
      monthSet.add(exp.date.substring(0, 7)); // 'YYYY-MM'
    }
  });

  // Sort months descending (newest first)
  const sortedMonths = Array.from(monthSet).sort().reverse();

  // Keep "All Months" as first option
  select.innerHTML = '<option value="all">All Months</option>';

  sortedMonths.forEach(ym => {
    const [year, month] = ym.split('-');
    const dateObj = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
    const label = dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    const option = document.createElement('option');
    option.value = ym;
    option.textContent = label;
    select.appendChild(option);
  });

  // If previous selection still exists or is 'all', keep it
  if (currentSelection === 'all' || sortedMonths.includes(currentSelection)) {
    select.value = currentSelection;
  } else if (sortedMonths.length > 0) {
    // Default to the latest month in data
    select.value = sortedMonths[0];
    AppState.selectedMonth = sortedMonths[0];
  } else {
    select.value = 'all';
    AppState.selectedMonth = 'all';
  }
}

/**
 * Compute summary stats for the active monthly filter
 */
function calculateDashboardMetrics() {
  let periodExpenses = AppState.expenses;
  if (AppState.selectedMonth !== 'all') {
    periodExpenses = periodExpenses.filter(e => e.date && e.date.startsWith(AppState.selectedMonth));
  }

  const totalSpent = periodExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const totalCount = periodExpenses.length;

  // Category totals
  const categoryTotals = {};
  periodExpenses.forEach(e => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + (Number(e.amount) || 0);
  });

  let topCategory = 'None';
  let topCategoryAmount = 0;
  for (const [cat, amt] of Object.entries(categoryTotals)) {
    if (amt > topCategoryAmount) {
      topCategoryAmount = amt;
      topCategory = cat;
    }
  }

  // Daily average spend
  let avgDaily = 0;
  if (totalSpent > 0) {
    if (AppState.selectedMonth !== 'all' && AppState.selectedMonth.includes('-')) {
      const [yearStr, monthStr] = AppState.selectedMonth.split('-');
      const year = parseInt(yearStr, 10);
      const month = parseInt(monthStr, 10);
      const daysInMonth = new Date(year, month, 0).getDate();
      avgDaily = Math.round(totalSpent / daysInMonth);
    } else {
      const uniqueDays = new Set(periodExpenses.map(e => e.date)).size;
      avgDaily = Math.round(totalSpent / Math.max(1, uniqueDays));
    }
  }

  // Update UI Elements
  document.getElementById('statTotalSpent').textContent = formatPKR(totalSpent);
  document.getElementById('statTotalCount').textContent = totalCount.toString();
  document.getElementById('statTopCategory').textContent = topCategory;
  document.getElementById('statTopCategoryAmount').textContent = formatPKR(topCategoryAmount);
  document.getElementById('statDailyAverage').textContent = formatPKR(avgDaily) + '/day';

  // Label period
  const periodLabelEl = document.getElementById('statPeriodLabel');
  if (AppState.selectedMonth === 'all') {
    periodLabelEl.textContent = 'All Recorded';
  } else {
    const [y, m] = AppState.selectedMonth.split('-');
    const d = new Date(parseInt(y, 10), parseInt(m, 10) - 1, 1);
    periodLabelEl.textContent = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }

  document.getElementById('chartTotalLabel').textContent = `Total: ${formatPKR(totalSpent)}`;
}

/**
 * Filter, search, and sort the expenses list for display
 */
function getFilteredAndSortedExpenses() {
  let list = [...AppState.expenses];

  // 1. Month filter
  if (AppState.selectedMonth !== 'all') {
    list = list.filter(e => e.date && e.date.startsWith(AppState.selectedMonth));
  }

  // 2. Category filter
  if (AppState.categoryFilter !== 'all') {
    list = list.filter(e => e.category === AppState.categoryFilter);
  }

  // 3. Search query (matches title or note)
  if (AppState.searchQuery.trim()) {
    const q = AppState.searchQuery.trim().toLowerCase();
    list = list.filter(e => 
      e.title.toLowerCase().includes(q) ||
      (e.note && e.note.toLowerCase().includes(q))
    );
  }

  // 4. Sort
  const sortBy = AppState.sortBy;
  list.sort((a, b) => {
    if (sortBy === 'date-desc') {
      return b.date.localeCompare(a.date);
    }
    if (sortBy === 'date-asc') {
      return a.date.localeCompare(b.date);
    }
    if (sortBy === 'amount-desc') {
      return b.amount - a.amount;
    }
    if (sortBy === 'amount-asc') {
      return a.amount - b.amount;
    }
    if (sortBy === 'title-asc') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  return list;
}

/**
 * Render the expense items list or the empty state
 */
function renderExpensesList() {
  const container = document.getElementById('expensesListContainer');
  const emptyState = document.getElementById('emptyStateContainer');
  const countEl = document.getElementById('filteredResultsCount');
  const chipsEl = document.getElementById('activeFilterChips');

  const filtered = getFilteredAndSortedExpenses();
  countEl.textContent = `Showing ${filtered.length} ${filtered.length === 1 ? 'expense' : 'expenses'}`;

  // Active filter chips
  chipsEl.innerHTML = '';
  if (AppState.categoryFilter !== 'all') {
    const chip = document.createElement('span');
    chip.className = 'filter-chip';
    chip.innerHTML = `Category: ${AppState.categoryFilter} <button type="button" aria-label="Remove category filter" onclick="clearCategoryFilter()">&times;</button>`;
    chipsEl.appendChild(chip);
  }
  if (AppState.searchQuery.trim()) {
    const chip = document.createElement('span');
    chip.className = 'filter-chip';
    chip.innerHTML = `Search: "${AppState.searchQuery}" <button type="button" aria-label="Remove search filter" onclick="clearSearchFilter()">&times;</button>`;
    chipsEl.appendChild(chip);
  }

  if (filtered.length === 0) {
    container.innerHTML = '';
    emptyState.style.display = 'flex';
    return;
  }

  emptyState.style.display = 'none';
  container.innerHTML = '';

  filtered.forEach(exp => {
    const card = document.createElement('article');
    card.className = 'expense-row-card';
    card.setAttribute('data-id', exp.id);

    const initial = exp.category.charAt(0);
    const categoryClass = `cat-${exp.category}`;

    card.innerHTML = `
      <div class="expense-left">
        <div class="category-badge-icon ${categoryClass}" aria-hidden="true" title="${exp.category}">
          ${initial}
        </div>
        <div class="expense-details">
          <div class="expense-title-row">
            <h3 class="expense-title">${escapeHTML(exp.title)}</h3>
            <span class="expense-category-pill ${categoryClass}">${exp.category}</span>
          </div>
          <div class="expense-meta-row">
            <span class="expense-date">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span>${formatDate(exp.date)}</span>
            </span>
            ${exp.note ? `<span class="expense-note" title="${escapeHTML(exp.note)}">• ${escapeHTML(exp.note)}</span>` : ''}
          </div>
        </div>
      </div>
      <div class="expense-right">
        <div class="expense-amount">${formatPKR(exp.amount)}</div>
        <div class="expense-actions">
          <button class="action-btn edit-btn" type="button" aria-label="Edit expense: ${escapeHTML(exp.title)}" onclick="openEditModal('${exp.id}')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button class="action-btn delete-btn" type="button" aria-label="Delete expense: ${escapeHTML(exp.title)}" onclick="openDeleteConfirmModal('${exp.id}')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M3 6h18"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </button>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

/**
 * Render Category Summary & Custom Canvas Bar Chart
 */
function renderCategoryChart() {
  const canvas = document.getElementById('categoryChartCanvas');
  const legendContainer = document.getElementById('chartLegendList');
  if (!canvas || !legendContainer) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Filter expenses by selected month for the chart
  let periodExpenses = AppState.expenses;
  if (AppState.selectedMonth !== 'all') {
    periodExpenses = periodExpenses.filter(e => e.date && e.date.startsWith(AppState.selectedMonth));
  }

  // Calculate totals per category
  const categoryData = {};
  CATEGORIES.forEach(cat => {
    categoryData[cat] = { total: 0, count: 0 };
  });

  let grandTotal = 0;
  periodExpenses.forEach(exp => {
    const amt = Number(exp.amount) || 0;
    if (categoryData[exp.category]) {
      categoryData[exp.category].total += amt;
      categoryData[exp.category].count += 1;
    } else {
      categoryData.Other.total += amt;
      categoryData.Other.count += 1;
    }
    grandTotal += amt;
  });

  // Update Legend List
  legendContainer.innerHTML = '';
  CATEGORIES.forEach(cat => {
    const data = categoryData[cat];
    const pct = grandTotal > 0 ? Math.round((data.total / grandTotal) * 100) : 0;
    const color = CATEGORY_COLORS[cat]?.primary || '#64748b';

    const item = document.createElement('div');
    item.className = 'legend-item';
    item.innerHTML = `
      <div class="legend-left">
        <span class="legend-color-dot" style="background-color: ${color};"></span>
        <span class="legend-name">${cat}</span>
        <span class="legend-count">(${data.count})</span>
      </div>
      <div class="legend-right">
        <span class="legend-amount">${formatPKR(data.total)}</span>
        <span class="legend-pct-pill">${pct}%</span>
      </div>
    `;
    legendContainer.appendChild(item);
  });

  // Handle High-DPI Canvas scaling
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);

  // Clear Canvas
  ctx.clearRect(0, 0, width, height);

  // If no expenses, draw friendly canvas message
  if (grandTotal === 0) {
    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('No spending recorded for this period', width / 2, height / 2);
    AppState.chartBarBoxes = [];
    return;
  }

  // Find max category value for scale
  let maxVal = 0;
  CATEGORIES.forEach(cat => {
    if (categoryData[cat].total > maxVal) {
      maxVal = categoryData[cat].total;
    }
  });
  if (maxVal === 0) maxVal = 1000;
  // Add 15% headroom for top amount labels
  const ceiling = maxVal * 1.2;

  // Chart layout padding
  const paddingLeft = 45;
  const paddingRight = 15;
  const paddingTop = 25;
  const paddingBottom = 35;
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Draw horizontal light grid lines
  ctx.strokeStyle = '#f1f5f9';
  ctx.lineWidth = 1;
  const gridSteps = 4;
  for (let i = 0; i <= gridSteps; i++) {
    const y = paddingTop + (chartHeight / gridSteps) * i;
    ctx.beginPath();
    ctx.moveTo(paddingLeft, y);
    ctx.lineTo(width - paddingRight, y);
    ctx.stroke();

    // Grid labels
    const stepVal = Math.round(ceiling * (1 - i / gridSteps));
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    // Short format for PKR axis (e.g. 5k, 20k)
    const axisText = stepVal >= 1000 ? `${Math.round(stepVal / 1000)}k` : `${stepVal}`;
    ctx.fillText(axisText, paddingLeft - 8, y);
  }

  // Draw Bars
  const barCount = CATEGORIES.length;
  const barWidth = Math.max(16, Math.min(32, (chartWidth / barCount) * 0.6));
  const slotWidth = chartWidth / barCount;
  AppState.chartBarBoxes = [];

  CATEGORIES.forEach((cat, index) => {
    const total = categoryData[cat].total;
    const count = categoryData[cat].count;
    const pct = Math.round((total / grandTotal) * 100);
    const barHeight = Math.max(4, (total / ceiling) * chartHeight);

    const x = paddingLeft + index * slotWidth + (slotWidth - barWidth) / 2;
    const y = paddingTop + chartHeight - barHeight;

    // Save bounding box for hover tooltips
    AppState.chartBarBoxes.push({
      category: cat,
      total,
      count,
      pct,
      x,
      y,
      width: barWidth,
      height: barHeight
    });

    // Create Bar Gradient
    const color = CATEGORY_COLORS[cat]?.primary || '#6366f1';
    const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, CATEGORY_COLORS[cat]?.dark || '#4f46e5');

    // Draw Rounded Bar
    ctx.fillStyle = gradient;
    ctx.beginPath();
    const radius = Math.min(6, barWidth / 2);
    ctx.roundRect(x, y, barWidth, barHeight, [radius, radius, 0, 0]);
    ctx.fill();

    // Value text on top of bar if non-zero
    if (total > 0) {
      ctx.fillStyle = '#334155';
      ctx.font = 'bold 9px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      const labelText = total >= 1000 ? `${(total / 1000).toFixed(total >= 10000 ? 0 : 1)}k` : `${total}`;
      ctx.fillText(labelText, x + barWidth / 2, y - 3);
    }

    // Category label on X-axis (short initial or truncated)
    ctx.fillStyle = '#64748b';
    ctx.font = '500 10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const shortLabel = cat.length > 5 ? cat.substring(0, 4) + '..' : cat;
    ctx.fillText(shortLabel, x + barWidth / 2, paddingTop + chartHeight + 8);
  });
}

/**
 * Handle Canvas Mousemove for Interactive Hover Tooltips
 */
function handleCanvasMouseMove(event) {
  const canvas = document.getElementById('categoryChartCanvas');
  const tooltip = document.getElementById('chartTooltip');
  if (!canvas || !tooltip) return;

  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  let hovered = null;
  for (const box of AppState.chartBarBoxes) {
    if (
      mouseX >= box.x - 6 &&
      mouseX <= box.x + box.width + 6 &&
      mouseY >= box.y - 10 &&
      mouseY <= rect.height
    ) {
      hovered = box;
      break;
    }
  }

  if (hovered) {
    tooltip.style.display = 'block';
    tooltip.innerHTML = `
      <strong>${hovered.category}</strong><br/>
      ${formatPKR(hovered.total)} (${hovered.pct}%)<br/>
      <span style="opacity: 0.8;">${hovered.count} ${hovered.count === 1 ? 'transaction' : 'transactions'}</span>
    `;
    tooltip.style.left = `${hovered.x + hovered.width / 2}px`;
    tooltip.style.top = `${hovered.y}px`;
  } else {
    tooltip.style.display = 'none';
  }
}

/**
 * Open the Add/Edit Expense Modal Dialog
 * @param {string|null} expenseId - If provided, opens in edit mode; otherwise, add mode
 */
function openExpenseModal(expenseId = null) {
  const modal = document.getElementById('expenseModal');
  const heading = document.getElementById('modalHeading');
  const form = document.getElementById('expenseForm');
  const idInput = document.getElementById('expenseIdInput');
  const titleInput = document.getElementById('titleInput');
  const amountInput = document.getElementById('amountInput');
  const categoryInput = document.getElementById('categoryInput');
  const dateInput = document.getElementById('dateInput');
  const noteInput = document.getElementById('noteInput');

  form.reset();

  if (expenseId) {
    const expense = AppState.expenses.find(e => e.id === expenseId);
    if (!expense) return;

    heading.textContent = 'Edit Expense';
    idInput.value = expense.id;
    titleInput.value = expense.title;
    amountInput.value = expense.amount;
    categoryInput.value = expense.category;
    dateInput.value = expense.date;
    noteInput.value = expense.note || '';
  } else {
    heading.textContent = 'Add New Expense';
    idInput.value = '';
    // Set default date to today's local date
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
  }

  modal.classList.add('is-open');
  setTimeout(() => titleInput.focus(), 50);
}

/**
 * Close the Add/Edit Expense Modal Dialog
 */
function closeExpenseModal() {
  const modal = document.getElementById('expenseModal');
  modal.classList.remove('is-open');
}

/**
 * Open delete confirmation modal
 * @param {string} expenseId
 */
function openDeleteConfirmModal(expenseId) {
  const expense = AppState.expenses.find(e => e.id === expenseId);
  if (!expense) return;

  AppState.expenseToDeleteId = expenseId;
  const descEl = document.getElementById('confirmDeleteDetails');
  descEl.textContent = `Are you sure you want to delete "${expense.title}" (${formatPKR(expense.amount)})?`;

  const modal = document.getElementById('deleteConfirmModal');
  modal.classList.add('is-open');
}

/**
 * Close delete confirmation modal
 */
function closeDeleteConfirmModal() {
  AppState.expenseToDeleteId = null;
  const modal = document.getElementById('deleteConfirmModal');
  modal.classList.remove('is-open');
}

/**
 * Confirm and execute deletion of pending expense
 */
function confirmDeleteExpense() {
  const id = AppState.expenseToDeleteId;
  if (!id) return;

  const target = AppState.expenses.find(e => e.id === id);
  AppState.expenses = AppState.expenses.filter(e => e.id !== id);
  saveExpensesToStorage();
  closeDeleteConfirmModal();

  refreshAllViews();
  showToast(`Deleted "${target ? target.title : 'Expense'}"`, 'danger');
}

/**
 * Handle form submission for Add / Edit Expense
 */
function handleExpenseFormSubmit(event) {
  event.preventDefault();

  const idInput = document.getElementById('expenseIdInput');
  const titleInput = document.getElementById('titleInput');
  const amountInput = document.getElementById('amountInput');
  const categoryInput = document.getElementById('categoryInput');
  const dateInput = document.getElementById('dateInput');
  const noteInput = document.getElementById('noteInput');

  const title = titleInput.value.trim();
  const amount = Math.round(Number(amountInput.value));
  const category = categoryInput.value;
  const date = dateInput.value;
  const note = noteInput.value.trim();

  if (!title) {
    showToast('Please enter an expense title', 'danger');
    titleInput.focus();
    return;
  }

  if (isNaN(amount) || amount <= 0) {
    showToast('Please enter a valid amount greater than 0', 'danger');
    amountInput.focus();
    return;
  }

  if (!date) {
    showToast('Please select a valid date', 'danger');
    dateInput.focus();
    return;
  }

  const existingId = idInput.value;

  if (existingId) {
    // Update existing expense
    const index = AppState.expenses.findIndex(e => e.id === existingId);
    if (index !== -1) {
      AppState.expenses[index] = {
        id: existingId,
        title,
        amount,
        category,
        date,
        note
      };
      showToast(`Updated "${title}" successfully`, 'info');
    }
  } else {
    // Create new expense
    const newExpense = {
      id: 'exp-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      title,
      amount,
      category,
      date,
      note
    };
    AppState.expenses.unshift(newExpense);
    showToast(`Added "${title}" (${formatPKR(amount)})`, 'info');
  }

  saveExpensesToStorage();
  closeExpenseModal();

  // If new expense was in a different month, switch viewing period to that month or all
  const expMonth = date.substring(0, 7);
  updateMonthFilterDropdown();
  if (AppState.selectedMonth !== 'all' && AppState.selectedMonth !== expMonth) {
    AppState.selectedMonth = expMonth;
    document.getElementById('monthFilterSelect').value = expMonth;
  }

  refreshAllViews();
}

/**
 * Export current or all expenses as a standard CSV file
 */
function exportExpensesAsCSV() {
  if (AppState.expenses.length === 0) {
    showToast('No expenses available to export', 'danger');
    return;
  }

  const headers = ['ID', 'Date', 'Title', 'Category', 'Amount (PKR)', 'Note'];
  
  const escapeCSV = (val) => {
    const str = String(val ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const rows = AppState.expenses.map(exp => [
    escapeCSV(exp.id),
    escapeCSV(exp.date),
    escapeCSV(exp.title),
    escapeCSV(exp.category),
    escapeCSV(exp.amount),
    escapeCSV(exp.note || '')
  ].join(','));

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  const dateStamp = new Date().toISOString().split('T')[0];
  link.setAttribute('download', `smart-expenses-tasleem-${dateStamp}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showToast(`Exported ${AppState.expenses.length} expenses to CSV`, 'info');
}

/**
 * Display a modern toast alert banner
 * @param {string} message
 * @param {'info'|'danger'} type
 */
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${escapeHTML(message)}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 3200);
}

/**
 * Escape HTML to prevent XSS injection
 * @param {string} text
 * @returns {string}
 */
function escapeHTML(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Clear Category Filter
 */
window.clearCategoryFilter = function () {
  AppState.categoryFilter = 'all';
  const select = document.getElementById('categoryFilterSelect');
  if (select) select.value = 'all';
  renderExpensesList();
};

/**
 * Clear Search Filter
 */
window.clearSearchFilter = function () {
  AppState.searchQuery = '';
  const input = document.getElementById('searchInput');
  const clearBtn = document.getElementById('searchClearBtn');
  if (input) input.value = '';
  if (clearBtn) clearBtn.style.display = 'none';
  renderExpensesList();
};

/**
 * Global helper to open edit modal from row
 */
window.openEditModal = function (id) {
  openExpenseModal(id);
};

/**
 * Global helper to open delete modal from row
 */
window.openDeleteConfirmModal = function (id) {
  openDeleteConfirmModal(id);
};

/**
 * Full refresh of all components
 */
function refreshAllViews() {
  calculateDashboardMetrics();
  renderCategoryChart();
  renderExpensesList();
}

/**
 * Attach All Event Listeners on DOM Ready
 */
function initializeApp() {
  loadExpensesFromStorage();
  updateMonthFilterDropdown();
  refreshAllViews();

  // Header & Action Buttons
  document.getElementById('btnOpenAddModal')?.addEventListener('click', () => openExpenseModal());
  document.getElementById('btnQuickAdd')?.addEventListener('click', () => openExpenseModal());
  document.getElementById('btnExportCSV')?.addEventListener('click', exportExpensesAsCSV);

  // Reload Sample Data Button
  document.getElementById('btnResetData')?.addEventListener('click', () => {
    if (confirm('Reset all expenses back to the 12 realistic Sukkur student sample records?')) {
      AppState.expenses = JSON.parse(JSON.stringify(SAMPLE_SUKKUR_EXPENSES));
      saveExpensesToStorage();
      updateMonthFilterDropdown();
      refreshAllViews();
      showToast('Restored Sukkur student sample expenses', 'info');
    }
  });

  // Empty state buttons
  document.getElementById('btnEmptyAddExpense')?.addEventListener('click', () => openExpenseModal());
  document.getElementById('btnEmptyResetFilters')?.addEventListener('click', () => {
    AppState.categoryFilter = 'all';
    AppState.searchQuery = '';
    AppState.selectedMonth = 'all';
    document.getElementById('categoryFilterSelect').value = 'all';
    document.getElementById('searchInput').value = '';
    document.getElementById('monthFilterSelect').value = 'all';
    document.getElementById('searchClearBtn').style.display = 'none';
    refreshAllViews();
  });

  // Month filter dropdown change
  document.getElementById('monthFilterSelect')?.addEventListener('change', (e) => {
    AppState.selectedMonth = e.target.value;
    refreshAllViews();
  });

  // Category filter dropdown change
  document.getElementById('categoryFilterSelect')?.addEventListener('change', (e) => {
    AppState.categoryFilter = e.target.value;
    renderExpensesList();
  });

  // Sort dropdown change
  document.getElementById('sortSelect')?.addEventListener('change', (e) => {
    AppState.sortBy = e.target.value;
    renderExpensesList();
  });

  // Search input live filtering
  const searchInput = document.getElementById('searchInput');
  const searchClearBtn = document.getElementById('searchClearBtn');

  searchInput?.addEventListener('input', (e) => {
    AppState.searchQuery = e.target.value;
    if (searchClearBtn) {
      searchClearBtn.style.display = e.target.value ? 'block' : 'none';
    }
    renderExpensesList();
  });

  searchClearBtn?.addEventListener('click', () => {
    clearSearchFilter();
  });

  // Add / Edit Modal Event Listeners
  document.getElementById('btnCloseModal')?.addEventListener('click', closeExpenseModal);
  document.getElementById('btnCancelModal')?.addEventListener('click', closeExpenseModal);
  document.getElementById('expenseForm')?.addEventListener('submit', handleExpenseFormSubmit);

  // Delete Confirm Modal Event Listeners
  document.getElementById('btnCancelDelete')?.addEventListener('click', closeDeleteConfirmModal);
  document.getElementById('btnConfirmDelete')?.addEventListener('click', confirmDeleteExpense);

  // Close modals on clicking backdrop
  document.getElementById('expenseModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'expenseModal') closeExpenseModal();
  });
  document.getElementById('deleteConfirmModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'deleteConfirmModal') closeDeleteConfirmModal();
  });

  // Keyboard shortcut: Escape key closes active modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeExpenseModal();
      closeDeleteConfirmModal();
    }
  });

  // Canvas Interactions
  const canvas = document.getElementById('categoryChartCanvas');
  canvas?.addEventListener('mousemove', handleCanvasMouseMove);
  canvas?.addEventListener('mouseleave', () => {
    const tooltip = document.getElementById('chartTooltip');
    if (tooltip) tooltip.style.display = 'none';
  });

  // Window resize handler: redraw canvas cleanly on screen size changes
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      renderCategoryChart();
    }, 150);
  });
}

// Start application when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
