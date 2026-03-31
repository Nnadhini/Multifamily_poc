# Multifamily POC — Rently Portal

A proof-of-concept multifamily property management portal built for stakeholder demonstrations. The application simulates an end-to-end property management experience, including AI-powered modules, financial reporting, tenant management, and operational workflows.

**Live Demo:** https://rently-portal-poc.vercel.app

---

## Technical Stack

| Layer | Technology |
|---|---|
| Framework | React 18 (JSX) |
| Build Tool | Vite 8 |
| UI Component Library | MUI (Material UI) v5 |
| Charting | Recharts, Nivo (bar, line, heatmap) |
| Data Grid | MUI X Data Grid |
| Drag & Drop | @hello-pangea/dnd |
| PDF Export | @react-pdf/renderer |
| Date Handling | date-fns, date-fns-tz |
| Routing | React Router DOM v6 (client-side state routing) |
| Notifications | notistack |
| Scrollbars | overlayscrollbars-react |
| Linting | ESLint 9 |
| Deployment | Vercel |

---

## Project Structure

```
src/
├── App.jsx                  # Root layout: sidebar + page routing
├── main.jsx                 # React entry point with MUI theme provider
├── theme.js                 # Custom MUI theme (colors, typography)
├── mockData.js              # Simulated communities, units, tenants, leases
├── components/              # Shared UI components (dashboard, charts, tables)
└── modules/                 # Full-page feature modules
app/
└── javascript/
    └── components/          # TypeScript utility components (search, nav, settings)
```

---

## Functional Flow

### 1. Application Shell
- On launch the user lands on the **Home Page** with a welcome banner and quick-action cards.
- A collapsible **Sidebar** lets the user switch communities/buildings and navigate between all modules.
- The active community and building are passed as props to every page — no global store required.

### 2. Core Operations Modules

| Module | Key Features |
|---|---|
| **Dashboard** | KPI cards (occupancy, revenue, NOI), revenue & occupancy charts, lease expiry timeline, recent activity feed, manager command center |
| **Properties** | Community/building/unit listing with status filters, unit detail panel, occupancy map |
| **Tenant Management** | Tenant directory, profile view, rent payment history, communication log |
| **Lease Management** | Active/expiring/expired lease table, lease detail panel, renewal workflow |
| **Financials** | Revenue breakdown, expense tracking, NOI summary, interactive data grid, PDF export |
| **Maintenance** | Work order queue, priority filtering, technician assignment, status tracking |
| **Bookings & Leads** | Prospect pipeline (kanban-style), tour scheduling, lead source tracking |
| **Communication Hub** | Templated messaging, bulk outreach, conversation threads per tenant |
| **Reports** | Prebuilt & custom reports with chart previews and export options |

### 3. AI-Powered Modules

| Module | Description |
|---|---|
| **Dynamic Pricing** | AI-suggested rent prices per unit based on market benchmarks and vacancy trends |
| **Vacancy Predictor** | Move-out risk scoring per tenant with recommended actions |
| **AI Tenant Screening** | Application scoring with background/credit summary and approval recommendations |
| **AI Chatbot** | Conversational assistant for property managers — answers queries from mock data |
| **Predictive Maintenance** | Flags units likely to require maintenance based on age and history patterns |
| **Renewal Nudger** | Identifies leases 60–90 days from expiry and generates personalised renewal offers |
| **Smart Rent Reminders** | Automated reminder schedule builder with channel selection (email/SMS/push) |
| **AI Listing Writer** | Generates marketing copy for vacant units using unit attributes and comps |
| **AI Finance Insights** | Natural-language financial summaries and anomaly highlights from ledger data |

### 4. Navigation Model
- Routing is entirely **client-side state-based** (no URL changes) — `App.jsx` maps a `currentPage` string to the corresponding page component.
- Community and building selections persist across page navigation via lifted state in `App.jsx`.

---

## Running Locally

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Building for Production

```bash
npm run build       # outputs to dist/
npm run preview     # preview the production build locally
```

## Deploying Updates

```bash
npx vercel deploy --prod --yes
```
