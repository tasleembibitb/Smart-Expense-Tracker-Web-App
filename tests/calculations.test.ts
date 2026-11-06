import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatPKR,
  filterByMonth,
  calculateDashboardStats,
  calculateCategoryBreakdown,
  filterAndSortExpenses,
  generateCSV,
  SAMPLE_SUKKUR_EXPENSES
} from '../src/utils/calculations';

test('formatPKR formats amounts properly with commas and prefix', () => {
  assert.equal(formatPKR(1500), 'Rs. 1,500');
  assert.equal(formatPKR(35000), 'Rs. 35,000');
  assert.equal(formatPKR(0), 'Rs. 0');
  assert.equal(formatPKR(950), 'Rs. 950');
});

test('sample expenses contains 12 realistic records for Sukkur student', () => {
  assert.equal(SAMPLE_SUKKUR_EXPENSES.length, 12);
  const titles = SAMPLE_SUKKUR_EXPENSES.map(e => e.title);
  assert.ok(titles.some(t => t.includes('Sukkur IBA')));
  assert.ok(titles.some(t => t.includes('Bus')));
  assert.ok(titles.some(t => t.includes('Hostel')));
  assert.ok(titles.some(t => t.includes('Groceries') || t.includes('Fruit')));
});

test('filterByMonth filters expenses by YYYY-MM correctly', () => {
  const nov = filterByMonth(SAMPLE_SUKKUR_EXPENSES, '2026-11');
  const oct = filterByMonth(SAMPLE_SUKKUR_EXPENSES, '2026-10');
  const all = filterByMonth(SAMPLE_SUKKUR_EXPENSES, 'all');

  assert.equal(nov.length, 5);
  assert.equal(oct.length, 7);
  assert.equal(all.length, 12);
});

test('calculateDashboardStats produces accurate summary metrics', () => {
  const novStats = calculateDashboardStats(SAMPLE_SUKKUR_EXPENSES, '2026-11');
  // Nov expenses: 35000 + 2200 + 4800 + 3100 + 1850 = 46950
  assert.equal(novStats.totalSpent, 46950);
  assert.equal(novStats.totalCount, 5);
  assert.equal(novStats.highestCategory, 'Education');
  assert.equal(novStats.highestCategoryAmount, 38100); // 35000 + 3100
  // Nov has 30 days: 46950 / 30 = 1565
  assert.equal(novStats.avgDailySpend, Math.round(46950 / 30));

  const emptyStats = calculateDashboardStats([]);
  assert.equal(emptyStats.totalSpent, 0);
  assert.equal(emptyStats.totalCount, 0);
  assert.equal(emptyStats.highestCategory, 'None');
  assert.equal(emptyStats.avgDailySpend, 0);
});

test('calculateCategoryBreakdown computes percentages and counts correctly', () => {
  const breakdown = calculateCategoryBreakdown(SAMPLE_SUKKUR_EXPENSES);
  assert.equal(breakdown.length, 7);
  const totalSum = breakdown.reduce((acc, c) => acc + c.total, 0);
  const expectedSum = SAMPLE_SUKKUR_EXPENSES.reduce((acc, e) => acc + e.amount, 0);
  assert.equal(totalSum, expectedSum);

  const education = breakdown.find(b => b.category === 'Education');
  assert.ok(education);
  assert.ok(education.count >= 3);
  assert.ok(education.percentage > 0);
});

test('filterAndSortExpenses handles search and sorting properly', () => {
  // Search
  const searchResults = filterAndSortExpenses(SAMPLE_SUKKUR_EXPENSES, {
    search: 'Hostel'
  });
  assert.ok(searchResults.length >= 3);
  assert.ok(searchResults.every(e => e.title.includes('Hostel') || e.note?.includes('hostel')));

  // Category filter
  const transportOnly = filterAndSortExpenses(SAMPLE_SUKKUR_EXPENSES, {
    category: 'Transport'
  });
  assert.equal(transportOnly.length, 2);
  assert.ok(transportOnly.every(e => e.category === 'Transport'));

  // Sort by amount descending
  const sortedAmountDesc = filterAndSortExpenses(SAMPLE_SUKKUR_EXPENSES, {
    sortBy: 'amount-desc'
  });
  assert.equal(sortedAmountDesc[0].amount, 35000);
  assert.equal(sortedAmountDesc[sortedAmountDesc.length - 1].amount, 950);

  // Sort by amount ascending
  const sortedAmountAsc = filterAndSortExpenses(SAMPLE_SUKKUR_EXPENSES, {
    sortBy: 'amount-asc'
  });
  assert.equal(sortedAmountAsc[0].amount, 950);
});

test('generateCSV generates valid CSV text with headers and proper escaping', () => {
  const csv = generateCSV(SAMPLE_SUKKUR_EXPENSES);
  assert.ok(csv.startsWith('ID,Date,Title,Category,Amount (PKR),Note'));
  const lines = csv.split('\r\n');
  assert.equal(lines.length, 13); // header + 12 items
  // commas in title or notes should be wrapped in quotes
  assert.ok(csv.includes('"'));
});
