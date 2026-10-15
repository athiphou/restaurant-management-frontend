# Agent Guide - Restaurant Project (Frontend)

## Project Overview

This is a **React 19 + Vite 8 frontend** for a restaurant management system. The scaffolding, API layer, routing definitions, shared components, and page stubs are all in place. Most pages are placeholder shells -- the actual CRUD UIs have **not been built yet**.

It is the frontend half of `D:\etecshool\restaurant_project_laravel`, whose sibling is the **Laravel 10 REST API backend** at `backend/resturant_laravel_project/`. There is a detailed `agent_guide.md` in that backend directory describing the API this frontend consumes.

**Key facts:**
- **Framework:** React 19.2 (JavaScript / JSX, not TypeScript)
- **Build tooling:** Vite 8 (via `@vitejs/plugin-react` + Oxc)
- **Styling:** Tailwind CSS 4 (via `@tailwindcss/vite` plugin)
- **Linting:** Oxlint (`.oxlintrc.json` with React rules)
- **State / data fetching:** Custom `useApi` hook + `apiClient` fetch wrapper (no axios, no react-query)
- **Routing:** Route registry defined (`src/routes/index.jsx`) but **react-router-dom is NOT installed** -- routes are not wired up yet

---

## Directory Structure

```
restaurant_project_laravel/              # frontend root
├── .env                                 # VITE_API_URL=http://127.0.0.1:8000/api
├── .env.example
├── .gitignore
├── .oxlintrc.json                       # Oxlint rules (react plugin)
├── .vscode/
├── index.html                           # HTML shell, mounts #root
├── package.json
├── vite.config.js                       # Vite + React + Tailwind plugins
├── tailwind.config.js                   # Content globs, empty theme.extend
├── agent_guide.md                       # This file
├── public/
│   ├── favicon.svg                      # Site icon
│   └── icons.svg                        # SVG icon sprite
└── src/
    ├── main.jsx                         # React entry (createRoot, StrictMode)
    ├── index.css                        # Tailwind entry: @import "tailwindcss"
    ├── App.jsx                          # Root component (placeholder "Hello Tailwind!")
    ├── App.css                          # Imported by App.jsx (unused)
    │
    ├── api/                             # API service layer (fetch wrapper)
    │   ├── client.js                    #   fetch wrapper, Bearer token, ApiError
    │   ├── index.js                     #   barrel re-export of all services
    │   ├── README.md                    #   API layer docs
    │   ├── auth.js                      #   register, login, logout, me
    │   ├── role.js                      #   roles, user_roles CRUD
    │   ├── restaurant.js               #   restaurants, branches, tables CRUD
    │   ├── staff.js                     #   positions, employees, drivers CRUD
    │   ├── customer.js                  #   customers, addresses CRUD
    │   ├── menu.js                      #   food categories, foods, variants, addons, addon items
    │   ├── promotion.js                 #   promotions CRUD
    │   ├── order.js                     #   orders, items, deliveries, status history
    │   ├── payment.js                   #   payments CRUD
    │   └── inventory.js                 #   suppliers, ingredients, inventory, recipes
    │
    ├── assets/                          # Static assets
    │   ├── hero.png                     #   Hero image (imported in App.jsx but unused)
    │   ├── react.svg                    #   React logo (unused template leftover)
    │   └── vite.svg                     #   Vite logo (unused template leftover)
    │
    ├── components/                      # Shared UI components
    │   ├── index.js                     #   Barrel re-export
    │   ├── common/
    │   │   ├── EmptyState.jsx           #   "No records found" placeholder
    │   │   ├── PageHeader.jsx           #   Title + optional action slot
    │   │   └── Spinner.jsx              #   Animated loading spinner
    │   ├── layout/
    │   │   ├── MainLayout.jsx           #   Sidebar + main content shell (stub)
    │   │   ├── Navbar.jsx               #   Top header bar (stub)
    │   │   └── Sidebar.jsx              #   Nav links (hardcoded, no react-router)
    │   └── ui/
    │       ├── Badge.jsx                #   Color badge (gray/green/red/yellow)
    │       ├── Button.jsx               #   Button (primary/secondary/danger variants)
    │       └── Input.jsx                #   Labeled input field
    │
    ├── context/
    │   └── AuthContext.jsx              #   AuthProvider + useAuth hook (login, register, logout)
    │
    ├── hooks/
    │   ├── useApi.js                    #   Generic data-fetching hook (loading/data/error)
    │   └── useForm.js                   #   Form state hook (values, errors, handleChange, reset)
    │
    ├── pages/                           # Page components (mostly placeholders)
    │   ├── auth/
    │   │   ├── LoginPage.jsx            #   Login form (TODO: wire to AuthContext)
    │   │   └── RegisterPage.jsx         #   Placeholder text only
    │   ├── dashboard/
    │   │   └── DashboardPage.jsx        #   Placeholder text only
    │   ├── menu/
    │   │   └── MenuPage.jsx             #   Placeholder text only
    │   ├── order/
    │   │   └── OrdersPage.jsx           #   Placeholder text only
    │   ├── customer/
    │   │   └── CustomersPage.jsx        #   Partially built (uses useApi, lists customers)
    │   ├── staff/
    │   │   └── EmployeesPage.jsx        #   Placeholder text only
    │   ├── restaurant/
    │   │   └── RestaurantsPage.jsx      #   Partially built (uses useApi, lists restaurants)
    │   ├── inventory/
    │   │   └── InventoryPage.jsx        #   Placeholder text only
    │   ├── payment/
    │   │   └── PaymentsPage.jsx         #   Placeholder text only
    │   ├── promotion/
    │   │   └── PromotionsPage.jsx       #   Placeholder text only
    │   └── role/
    │       └── RolesPage.jsx            #   Placeholder text only
    │
    ├── routes/
    │   └── index.jsx                    #   Route registry (paths + names, elements are null)
    │
    └── utils/
        └── formatters.js                #   formatCurrency, formatDate, classNames
```

---

## Current State

### What IS built
1. **Full API service layer** -- `src/api/` has one file per domain (auth, role, restaurant, staff, customer, menu, promotion, order, payment, inventory). Each maps 1:1 to the Laravel REST endpoints. All return the backend `{ success, data }` envelope.
2. **Fetch wrapper** (`src/api/client.js`) -- handles JSON, `Bearer` token auth, `ApiError` with status/data. Base URL from `VITE_API_URL` env var.
3. **Auth context** (`src/context/AuthContext.jsx`) -- `AuthProvider` + `useAuth()` hook with `login`, `register`, `logout` methods. Token management delegates to `apiClient`.
4. **Custom hooks** -- `useApi` (generic data fetching with loading/data/error) and `useForm` (form state with values/errors/handleChange/reset).
5. **Shared components** -- `Button`, `Input`, `Badge` (UI primitives); `PageHeader`, `Spinner`, `EmptyState` (common patterns); `MainLayout`, `Navbar`, `Sidebar` (layout shells, all stubs).
6. **Route registry** (`src/routes/index.jsx`) -- 20+ route definitions with paths and names, but `element` fields are all `null` (not wired to page components).
7. **Page stubs** -- 11 page directories created. `CustomersPage` and `RestaurantsPage` have partial implementations (fetch + list). All others are placeholder text.
8. **Formatters** (`src/utils/formatters.js`) -- `formatCurrency`, `formatDate`, `classNames` helpers.
9. **Environment** -- `.env` with `VITE_API_URL=http://127.0.0.1:8000/api`.

### What is NOT built / wired up
1. **No react-router-dom** -- the route registry exists but routing is not functional. `App.jsx` still renders "Hello Tailwind!" and does not import routes or pages.
2. **`App.jsx` not connected** -- does not mount `<AuthProvider>`, `<MainLayout>`, or any router.
3. **`main.jsx` not connected** -- does not wrap app in `<AuthProvider>`.
4. **Layout components are stubs** -- `MainLayout` renders a placeholder aside; `Sidebar` has hardcoded `<a>` tags (no `<Link>`); `Navbar` shows "User menu" text.
5. **Most pages are placeholders** -- only `CustomersPage` and `RestaurantsPage` fetch data. The rest render a heading and a description string.
6. **No CRUD modals/forms** -- pages have "Add" buttons but no create/edit/delete UI.
7. **No Vite dev proxy** -- `vite.config.js` has no proxy to the Laravel backend; CORS will block API calls in development without it.
8. **No testing** -- no test framework installed.
9. **No error boundaries or toast notifications.**
10. **`Sidebar.jsx` import paths broken** -- page components import from `../components/...` which is incorrect relative to `src/pages/*/` (should be `../../components/...`).

---

## API Layer Detail

Base URL: `http://127.0.0.1:8000/api` (from `.env` → `VITE_API_URL`).

| File | Domain | Endpoints |
|---|---|---|
| `auth.js` | Auth | `POST /register`, `POST /login`, `POST /logout`, `GET /user` |
| `role.js` | Roles | CRUD `/roles`, CRUD `/user-roles` |
| `restaurant.js` | Structure | CRUD `/restaurants`, CRUD `/restaurant-branches`, CRUD `/restaurant-tables` |
| `staff.js` | Staff | CRUD `/staff-positions`, CRUD `/employees`, CRUD `/delivery-drivers` |
| `customer.js` | Customers | CRUD `/customers`, CRUD `/customer-addresses` |
| `menu.js` | Menu | CRUD `/food-categories`, `/foods`, `/food-variants`, `/food-addons`, `/food-addon-items` |
| `promotion.js` | Promos | CRUD `/promotions` |
| `order.js` | Orders | CRUD `/orders`, `/order-items`, `/deliveries`, `/order-status-history` |
| `payment.js` | Payments | CRUD `/payments` |
| `inventory.js` | Inventory | CRUD `/suppliers`, `/ingredients`, `/inventory`, `/recipes` |

**Conventions:**
- One function per endpoint, named `<verb><Resource>` (e.g. `createFood`, `deleteTable`).
- Nested resources expose both flat and scoped variants (`listTables(branchId)`).
- All return `{ success, data }` envelope via `apiClient`.
- Auth token set automatically on login via `setAuthToken()`.

---

## Shared Components

### UI Primitives (`src/components/ui/`)
- **`Button`** -- `variant` prop: `primary` (blue), `secondary` (gray), `danger` (red). Supports `disabled`.
- **`Input`** -- `label` prop renders a `<label>` wrapper. Spreads remaining props to `<input>`.
- **`Badge`** -- `color` prop: `gray`, `green`, `red`, `yellow`. Rounded pill style.

### Common (`src/components/common/`)
- **`PageHeader`** -- `title` + optional `action` slot (typically a `<Button>`).
- **`Spinner`** -- Animated spinning border circle + `label` text.
- **`EmptyState`** -- Centered gray text placeholder.

### Layout (`src/components/layout/`)
- **`MainLayout`** -- Flex container with fixed-width sidebar + main content area. Currently a stub.
- **`Navbar`** -- Top header bar with title + "User menu" placeholder.
- **`Sidebar`** -- Navigation links hardcoded as `<a>` tags (needs react-router `<Link>`).

---

## Hooks

- **`useApi(serviceFn, deps)`** -- Calls `serviceFn` on mount, returns `{ data, loading, error }`. Handles cleanup via `active` flag. Expects `serviceFn` to return `{ data }` envelope.
- **`useForm(initialValues)`** -- Returns `{ values, errors, setErrors, setValue, handleChange, reset }`. `handleChange` reads `e.target.name`/`value`.

---

## Configuration

### `vite.config.js`
Two plugins: `react()` and `tailwindcss()`. **No dev proxy configured** -- add one to forward `/api` to `http://127.0.0.1:8000` for development.

### `tailwind.config.js`
Scans `./index.html` and `./src/**/*.{js,jsx,ts,tsx}`. `theme.extend` is empty.

### `.oxlintrc.json`
React plugin enabled. `react/rules-of-hooks` = error, `react/only-export-components` = warn.

### `.env`
```
VITE_API_URL=http://127.0.0.1:8000/api
```

---

## Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start Vite dev server (HMR)
npm run build        # Production build → dist/
npm run preview      # Preview production build
npm run lint         # Run oxlint
```

---

## Known Issues / Bugs

1. **Import paths broken in pages** -- `src/pages/*/` files import from `../components/...` but components are at `src/components/...`, so the correct relative path is `../../components/...`. This will cause module-not-found errors at runtime.
2. **`Sidebar.jsx` uses `<a>` tags** -- should use react-router `<Link>` for client-side navigation.
3. **`App.jsx` not integrated** -- still renders the original placeholder; does not use routes, layout, or auth context.
4. **`main.jsx` not integrated** -- does not wrap in `<AuthProvider>`.
5. **No Vite proxy** -- API calls will fail in dev due to CORS unless a proxy is added to `vite.config.js`.

---

## Next Steps (Priority Order)

1. **Install react-router-dom** and wire up routing in `App.jsx` using the route registry.
2. **Fix import paths** in all page components (`../components/` → `../../components/`).
3. **Wrap app in `<AuthProvider>`** in `main.jsx`.
4. **Mount `<MainLayout>`** with `<Sidebar>` and `<Navbar>` in the router tree.
5. **Add Vite dev proxy** for `/api` → `http://127.0.0.1:8000`.
6. **Complete `LoginPage`** -- wire form to `useAuth().login`.
7. **Complete `RegisterPage`** -- build registration form.
8. **Build CRUD UIs** for each page (list, create, edit, delete) using `useApi`, `useForm`, and the API services.
9. **Add error handling** -- toast notifications or error boundaries.
10. **Add testing** -- choose a framework (Vitest recommended for Vite projects).

---

## When Working on This Project

1. **Read the backend guide first** (`../backend/resturant_laravel_project/agent_guide.md`) to understand the API endpoints, data model, and relationships.
2. **Run `npm run lint`** before finishing changes; fix any violations.
3. **Keep Tailwind utilities in JSX** -- use `tailwind.config.js` for custom theme tokens, not plain CSS.
4. **Follow the API conventions** -- use `useApi` + the matching `*Api` service for data fetching.
5. **Use shared components** (`Button`, `Input`, `Badge`, `PageHeader`, `Spinner`, `EmptyState`) -- do not create duplicate primitives.
6. **One component per file**, named export for components, default export for pages.
7. **Clean up unused template assets** (`react.svg`, `vite.svg`, unused imports in `App.jsx`) as you refactor.
