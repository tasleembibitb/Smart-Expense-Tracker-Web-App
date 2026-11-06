/**
 * Smart Expense Tracker - Core Calculation & Data Utilities
 * Decoupled pure functions for calculations, filtering, sorting, and CSV export.
 */

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: 'Food' | 'Transport' | 'Shopping' | 'Bills' | 'Education' | 'Health' | 'Other';
  date: string; // YYYY-MM-DD
  note?: string;
}

export const CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Education',
  'Health',
  'Other'
] as const;

export type Category = typeof CATEGORIES[number];

/**
 * Format a number as PKR currency, e.g. Rs. 1,500
 */
export function formatPKR(amount: number): string {
  const numeric = Math.round(Number(amount) || 0);
  const formatted = numeric.toLocaleString('en-PK');
  return `Rs. ${formatted}`;
}

/**
 * Filter expenses by a specific month ('YYYY-MM') or 'all'
 */
export function filterByMonth(expenses: Expense[], month: string): Expense[] {
  if (!month || month === 'all') {
    return expenses;
  }
  return expenses.filter(exp => exp.date && exp.date.startsWith(month));
}

/**
 * Calculate dashboard metrics for a list of expenses
 */
export function calculateDashboardStats(expenses: Expense[], selectedMonth: string = 'all') {
  const filtered = filterByMonth(expenses, selectedMonth);
  const totalSpent = filtered.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
  const totalCount = filtered.length;

  // Highest spending category
  const categoryTotals: Record<string, number> = {};
  filtered.forEach(exp => {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + (Number(exp.amount) || 0);
  });

  let highestCategory = 'None';
  let highestCategoryAmount = 0;
  for (const [cat, amt] of Object.entries(categoryTotals)) {
    if (amt > highestCategoryAmount) {
      highestCategoryAmount = amt;
      highestCategory = cat;
    }
  }

  // Average daily spend:
  // If specific month (YYYY-MM), divide total by days in that month (or days elapsed)
  // If 'all', divide by count of unique dates with expenses (min 1)
  let avgDailySpend = 0;
  if (totalSpent > 0) {
    if (selectedMonth && selectedMonth !== 'all' && selectedMonth.includes('-')) {
      const [yearStr, monthStr] = selectedMonth.split('-');
      const year = parseInt(yearStr, 10);
      const month = parseInt(monthStr, 10);
      const daysInMonth = new Date(year, month, 0).getDate();
      avgDailySpend = Math.round(totalSpent / daysInMonth);
    } else {
      const uniqueDays = new Set(filtered.map(e => e.date)).size;
      avgDailySpend = Math.round(totalSpent / Math.max(1, uniqueDays));
    }
  }

  return {
    totalSpent,
    totalCount,
    highestCategory,
    highestCategoryAmount,
    avgDailySpend
  };
}

/**
 * Aggregate category totals and percentages
 */
export function calculateCategoryBreakdown(expenses: Expense[]) {
  const grandTotal = expenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
  
  const map: Record<string, { total: number; count: number }> = {};
  CATEGORIES.forEach(cat => {
    map[cat] = { total: 0, count: 0 };
  });

  expenses.forEach(exp => {
    if (map[exp.category]) {
      map[exp.category].total += Number(exp.amount) || 0;
      map[exp.category].count += 1;
    } else {
      map.Other.total += Number(exp.amount) || 0;
      map.Other.count += 1;
    }
  });

  return CATEGORIES.map(cat => {
    const total = map[cat].total;
    const count = map[cat].count;
    const percentage = grandTotal > 0 ? Math.round((total / grandTotal) * 100) : 0;
    return {
      category: cat,
      total,
      count,
      percentage
    };
  });
}

/**
 * Filter and sort expenses by category, search query, and sort key
 */
export function filterAndSortExpenses(
  expenses: Expense[],
  options: {
    category?: string;
    search?: string;
    sortBy?: 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc' | 'title-asc';
    month?: string;
  }
): Expense[] {
  let result = [...expenses];

  // Month filter
  if (options.month && options.month !== 'all') {
    result = filterByMonth(result, options.month);
  }

  // Category filter
  if (options.category && options.category !== 'all') {
    result = result.filter(exp => exp.category.toLowerCase() === options.category!.toLowerCase());
  }

  // Search filter (title or note)
  if (options.search && options.search.trim()) {
    const q = options.search.trim().toLowerCase();
    result = result.filter(exp => 
      exp.title.toLowerCase().includes(q) ||
      (exp.note && exp.note.toLowerCase().includes(q))
    );
  }

  // Sorting
  const sortBy = options.sortBy || 'date-desc';
  result.sort((a, b) => {
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

  return result;
}

/**
 * Generate CSV text representation of expenses
 */
export function generateCSV(expenses: Expense[]): string {
  const headers = ['ID', 'Date', 'Title', 'Category', 'Amount (PKR)', 'Note'];
  
  const escapeCell = (val: string | number) => {
    const str = String(val ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const rows = expenses.map(exp => [
    escapeCell(exp.id),
    escapeCell(exp.date),
    escapeCell(exp.title),
    escapeCell(exp.category),
    escapeCell(exp.amount),
    escapeCell(exp.note || '')
  ].join(','));

  return [headers.join(','), ...rows].join('\r\n');
}

/**
 * Initial 12 realistic sample expenses for a student in Sukkur, Pakistan
 */
export const SAMPLE_SUKKUR_EXPENSES: Expense[] = [
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
