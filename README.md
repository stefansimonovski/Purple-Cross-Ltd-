# Purple Cross Ltd — Employee Management

A front-end employee management dashboard built for the Purple Cross Ltd case study. View, create, edit, and delete employee records with filtering, sorting, pagination, and JSON import/export.

The original case study brief lives in [Requirements.md](./Requirements.md).

## Tech stack

- **Vue 3** with Composition API and TypeScript
- **Vite** for development and production builds
- **Vue Router** for page navigation
- **Pinia** for in-memory employee state
- **Element Plus** for UI components
- **Yup** for form validation
- **Day.js** for date comparisons

## Getting started

### Prerequisites

- Node.js 20+
- npm

### Install and run

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

### Build for production

```bash
npm run build
npm run preview
```

## Data source

Sample employees are loaded from [`public/data/employees.json`](./public/data/employees.json) on first visit. All changes (create, edit, delete, import) are kept in memory for the session only and are not persisted to the file unless you export JSON.

Each employee record has:

| Field | Type | Notes |
|-------|------|-------|
| `code` | string | Unique key (e.g. `EMP001`) |
| `fullName` | string | Required |
| `occupation` | string | Required |
| `department` | string | Required |
| `dateOfEmployment` | string | ISO date `YYYY-MM-DD` |
| `terminationDate` | string \| null | Optional |

## Features

### Index page

- Sortable, filterable employee grid (table on desktop, cards on mobile)
- Employment status labels: “Employed soon” / “Currently employed”
- Termination status labels: “—” / “To be terminated” / “Terminated”
- View, Edit, and Delete (with confirmation) per row
- Search by name or code; filter by department and occupation
- Pagination (10 / 20 / 50 per page)
- Create Employee floating action button (bottom-right)
- Export current list to JSON; import JSON (replaces in-memory list)

### Create employee

- Form for all employee fields with validation
- Required: Code, Full Name, Occupation, Department
- Save adds the employee; Cancel returns without saving

### Employee profile

- Read-only view of all fields
- Edit mode with the same validated form
- Not-found handling for invalid employee codes

### Nice-to-have extras

- App navigation bar with branding and logged-in user badge
- Responsive layout for mobile, tablet, and desktop

## Project structure

```
src/
  components/     # EmployeeTable, EmployeeForm, AppNav, dialogs
  composables/    # useMediaQuery
  pages/          # Index, Create, Profile
  router/         # Route definitions
  stores/         # Pinia employees store
  types/          # TypeScript interfaces
  utils/          # Validation, date labels, import/export helpers
public/data/      # Initial employees.json
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build locally |
