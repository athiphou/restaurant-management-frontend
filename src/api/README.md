# API Layer (src/api)

Feature-based API service modules, one per domain section of the DBML schema, speaking to the Laravel REST backend (`backend/resturant_laravel_project`).

## Base

- `client.js` — fetch wrapper. Base URL from `VITE_API_URL` (default `http://127.0.0.1:8000/api`). Handles JSON, attaches `Authorization: Bearer <token>`, throws `ApiError` with `status`/`data` on non-2xx.
- `index.js` — barrel re-exporting every service as a namespaced API (e.g. `menuApi.listFoods()`).

## Files & domains

| File | Domain | Resources |
|---|---|---|
| `auth.js` | Authentication | register, login, logout, me |
| `role.js` | Roles | roles, user_roles |
| `restaurant.js` | Restaurant structure | restaurants, branches, tables |
| `staff.js` | Staff | staff_positions, employees, delivery_drivers |
| `customer.js` | Customers | customers, customer_addresses |
| `menu.js` | Menu | food_categories, foods, variants, addons, addon items |
| `promotion.js` | Promotions | promotions |
| `order.js` | Orders & delivery | orders, order_items, deliveries, order_status_history |
| `payment.js` | Payments | payments |
| `inventory.js` | Inventory & recipes | suppliers, ingredients, inventory, recipes |

## Conventions

- One function per endpoint, named `<verb><Resource>` (e.g. `createFood`, `deleteTable`).
- Nested resources expose both flat and scoped variants (`listTables(branchId)`).
- All return the backend's `{ success, data }` envelope via `apiClient`.
