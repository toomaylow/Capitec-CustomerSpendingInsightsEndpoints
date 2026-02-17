# 🏦 Capitec Customer Spending Insights Dashboard
> ✅ **Bug fixed:** `App.jsx` and `main.jsx` moved into `src/` — blank page issue resolved.


A production-grade, responsive financial analytics dashboard built with React + Vite. Displays customer spending data, category breakdowns, monthly trends, transaction history, and budget goals — all styled with Capitec's official brand colours.

---

## 📸 Features

| Section | Description |
|---|---|
| **Overview** | KPI cards, spending trend chart, donut category chart, recent transactions |
| **Trends** | Monthly area chart, transaction count bar chart, average transaction chart |
| **Categories** | Pie distribution, per-category progress bars, category cards |
| **Transactions** | Filterable, searchable transaction list with category tags |
| **Goals** | Budget progress bars with status indicators (on track / warning) |

---

## 🛠 Tech Stack

- **React 18** — UI framework
- **Vite 5** — lightning-fast build tooling
- **Recharts** — composable chart library
- **Lucide React** — icon set
- **Nginx 1.25** — production static file server (multi-stage Docker build)

---

## 🚀 Quick Start

### Option A — Docker (Recommended, production build)

```bash
# Clone / enter the project directory
cd capitec-dashboard

# Build the Docker image
docker build -t capitec-dashboard .

# Run the container
docker run -p 8080:80 --name capitec-dashboard capitec-dashboard

# Open in browser
open http://localhost:8080
```

### Option B — Docker Compose

```bash
# Build and start
docker compose up --build

# Stop
docker compose down
```

App is served at **http://localhost:8080**

---

### Option C — Local Node.js development

**Prerequisites:** Node.js ≥ 18, npm ≥ 9

```bash
# Install dependencies
npm install

# Start dev server (hot module reload)
npm run dev
# → http://localhost:3000

# Production build (output to ./dist)
npm run build

# Preview production build locally
npm run preview
# → http://localhost:4173
```

---

### Option D — Dev Docker (hot reload via volume mount)

```bash
docker compose --profile dev up dashboard-dev
# → http://localhost:3000
```

---

## 🧪 Testing

The project is structured for easy unit and integration testing. Add a test runner as follows:

```bash
# Install Vitest (recommended for Vite projects)
npm install -D vitest @testing-library/react @testing-library/jest-dom

# Run tests
npx vitest run

# Watch mode
npx vitest
```

**Manual smoke test checklist:**
- [ ] Overview tab loads with 4 KPI cards and animated counters
- [ ] Switching period (7D / 30D / 90D / 1Y) updates the UI
- [ ] Chart toggle (Area / Bar) works on the trend chart
- [ ] Sidebar collapses and expands via the hamburger menu
- [ ] Transactions tab search and category filter work correctly
- [ ] Goals tab shows correct progress bar colours (blue = on track, red = warning)
- [ ] Sidebar navigation routes between all 5 tabs

---

## 📁 Project Structure

```
capitec-dashboard/
├── src/
│   ├── App.jsx          # Main application component (all data + UI)
│   └── main.jsx         # React entry point
├── index.html           # HTML shell
├── vite.config.js       # Vite configuration
├── package.json
├── Dockerfile           # Multi-stage production build (Node → Nginx)
├── Dockerfile.dev       # Dev container with hot reload
├── docker-compose.yml   # Orchestration for prod + dev
├── nginx.conf           # Nginx SPA config with gzip + caching
└── README.md
```

---

## 🎨 Branding

Colours strictly follow Capitec's brand guidelines:

| Token | Value | Usage |
|---|---|---|
| `CAP_BLUE` | `#003DA5` | Primary — nav, active states, charts |
| `CAP_RED` | `#E4002B` | Accent — alerts, warnings, logo |
| `CAP_DARK` | `#001F5B` | Typography — headings, values |

Category colours are sourced directly from the `CustomerSpendingInsightsEndpoints.md` specification.

---

## 🔌 Data

All data is mocked inline in `App.jsx` to match the exact shapes defined in `CustomerSpendingInsightsEndpoints.md`. To connect to a live API, replace the `MOCK_*` constants at the top of `App.jsx` with `fetch()` calls to:

```
GET /api/customers/{customerId}/profile
GET /api/customers/{customerId}/spending/summary
GET /api/customers/{customerId}/spending/categories
GET /api/customers/{customerId}/spending/trends
GET /api/customers/{customerId}/transactions
GET /api/customers/{customerId}/goals
GET /api/customers/{customerId}/filters
```

---

## 📦 Docker Image Details

The production image uses a **2-stage build**:

1. **Builder** (`node:20-alpine`) — installs deps and runs `vite build`
2. **Runner** (`nginx:1.25-alpine`) — serves the static `dist/` folder

Final image size is typically **~25 MB**.

---

## 📄 Licence

Internal use — Capitec Bank Ltd © 2024
