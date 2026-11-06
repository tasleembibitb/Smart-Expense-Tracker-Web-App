# Smart Expense Tracker

A modern, responsive web app to track personal expenses, analyse monthly spending, and visualise where money goes — built for students and everyday budgeting in PKR.

**Built by Tasleem Bibi** — Final-year BSCS student, Begum Nusrat Bhutto Women University, Sukkur, Pakistan.

## Features

- Add expenses with title, amount in PKR, category, date, and note
- Edit and delete any expense
- Dashboard: total spent, number of expenses, top spending category, daily average
- Category-wise breakdown with charts
- Search by title or note, filter by category, sort by date or amount
- Monthly view — see spending for a selected month or all months
- Data saved in the browser with localStorage, so it stays after refresh
- Export expenses as a CSV file
- Sample data included: 12 realistic expenses for a student in Sukkur
- Fully mobile responsive

Categories: Food, Transport, Shopping, Bills, Education, Health, Other.

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- JavaScript / TypeScript

## How to Run

```bash
npm install
npm run dev
```

Then open the local address shown in the terminal (usually http://localhost:3000).

To build for production:

```bash
npm run build
```

## Project Structure

```text
├── index.html
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   └── utils/
├── package.json
├── vite.config.ts
└── README.md
```

## Author

**Tasleem Bibi**
- GitHub: https://github.com/tasleembibitb
- LinkedIn: https://www.linkedin.com/in/tasleem-bibi-431b2a361/
- Location: Sukkur, Sindh, Pakistan
