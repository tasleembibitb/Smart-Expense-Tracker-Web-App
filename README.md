# Smart Expense Tracker - by Tasleem Bibi

A complete, modern, and responsive web application built with pure **HTML5, CSS3, and Vanilla JavaScript**. Designed specifically for students and individuals to monitor personal finances, analyze monthly spending habits, and visualize expense distributions with custom interactive Canvas charts.

---

## 🌟 Key Features

1. **Add & Record Expenses**:
   - Title, Amount in Pakistani Rupees (PKR), Category, Date, and optional Note.
   - 7 Core Categories: `Food`, `Transport`, `Shopping`, `Bills`, `Education`, `Health`, and `Other`.
2. **Edit & Delete Any Expense**:
   - Quick one-click edit modal pre-filled with existing data.
   - Safe delete confirmation dialog to prevent accidental deletion.
3. **Smart Financial Dashboard**:
   - **Total Spent**: Live summation based on the selected month or all-time period.
   - **Total Expenses**: Real-time transaction counter.
   - **Top Category**: Automatically identifies your highest expenditure category with exact PKR amount.
   - **Daily Average Spend**: Computes estimated daily expenditure rate.
4. **Category Breakdown with Custom JavaScript Canvas Bar Chart**:
   - Hand-crafted HTML5 Canvas bar chart with zero external libraries.
   - High-DPI retina display support, color-coded bars, and grid lines.
   - Interactive hover tooltips showing category name, PKR amount, count, and percentage share.
   - Percentage distribution pills under the chart.
5. **Multi-Criteria Search, Filtering & Sorting**:
   - **Live Search**: Search instantaneously across titles and detailed notes.
   - **Category Filter**: Instant category filtering with active filter chip badges.
   - **Sorting**: Sort by Date (Newest/Oldest), Amount (Highest/Lowest), or Title (A–Z).
6. **Monthly Period Filter**:
   - Select specific months (e.g., *November 2026*, *October 2026*) or view *All Months*.
   - Automatically computes monthly totals and averages.
7. **Offline LocalStorage Persistence**:
   - All entries and modifications persist reliably in browser `localStorage`.
8. **Export as CSV**:
   - One-click export button generating standard, Excel-compatible `.csv` files.
9. **Realistic Sukkur Student Sample Data**:
   - Pre-loaded with 12 authentic expenses for a student living in Sukkur, Sindh, Pakistan (Sukkur IBA tuition installments, local rickshaw & bus routes, hostel mess, reference books from Minara Road, etc.).
   - "Reload Sample Data" button allows quick testing and resetting.
10. **Modern Purple & Teal Aesthetic**:
    - Clean white cards, smooth hover effects, clear empty states, and 100% mobile responsive design.

---

## 🚀 How to Use the App

### 1. Adding an Expense
- Click the **"+ Add Expense"** button in the header or the **"+ New Entry"** button in the history card.
- Enter the title (e.g., `Hostel Mess Fees`), amount in PKR (e.g., `4500`), pick a category, choose the date, and optionally add a note.
- Click **"Save Expense"**. The dashboard and chart update immediately.

### 2. Editing an Expense
- Locate the expense in the history list.
- Click the **Pencil icon (Edit)** on the right side of the item.
- Modify any details and click **"Save Expense"**.

### 3. Deleting an Expense
- Click the **Trash icon (Delete)** on the right side of any expense.
- A confirmation dialog appears showing the item name and amount. Confirm to remove it.

### 4. Viewing by Month
- Use the **"Viewing Period"** dropdown at the top to filter between specific months or view *All Months*.
- All 4 dashboard cards and the bar chart will instantly reflect the chosen month's data.

### 5. Filtering and Searching
- Type keywords into the search box to find specific expenses by title or note.
- Use the **Category dropdown** to isolate specific categories like *Food* or *Education*.
- Change the **Sort dropdown** to arrange items by amount or date.

### 6. Exporting to CSV
- Click the teal **"Export CSV"** button in the top navigation bar.
- A `.csv` file named `smart-expenses-tasleem-[date].csv` will download immediately to your device.

### 7. Resetting Data
- Click **"Reload Sample Data"** in the top control bar at any time to restore the original 12 Sukkur student expenses.

---

## 🛠️ Project Structure

```text
├── index.html        # Clean, accessible semantic HTML5 layout
├── style.css         # Modern purple & teal styles, card layouts & mobile media queries
├── script.js         # Pure Vanilla JavaScript app logic, canvas bar chart & storage
├── src/
│   └── utils/
│       └── calculations.ts  # Decoupled calculation logic & data utilities
├── tests/
│   └── calculations.test.ts # Fast Node.js test runner unit tests
└── README.md         # Documentation and user guide
```

---

*Designed and developed by **Tasleem Bibi**.*
