// Route registry. Wire these into your router (e.g. react-router-dom) once installed.
// Example:
//   <Route path="/" element={<MainLayout />}>
//     {routes.map((r) => (
//       <Route key={r.path} path={r.path} element={r.element} />
//     ))}
//   </Route>

export const routes = [
  { path: '/', element: null, name: 'Home', redirect: '/dashboard' },
  { path: '/home', element: null, name: 'Customer home' },
  { path: '/dashboard', element: null, name: 'Dashboard' },

  // Authentication
  { path: '/login', element: null, name: 'Login' },
  { path: '/register', element: null, name: 'Register' },

  // Restaurant structure
  { path: '/restaurants', element: null, name: 'Restaurants' },
  { path: '/restaurants/:id/branches', element: null, name: 'Branches' },
  { path: '/tables', element: null, name: 'Tables' },

  // Staff
  { path: '/staff', element: null, name: 'Employees' },
  { path: '/staff/positions', element: null, name: 'Positions' },
  { path: '/staff/drivers', element: null, name: 'Drivers' },

  // Customers
  { path: '/customers', element: null, name: 'Customers' },

  // Menu
  { path: '/admin/menu', element: null, name: 'Menu manager (admin)' },
  { path: '/menu', element: null, name: 'Public menu' },
  { path: '/menu/:id', element: null, name: 'Food detail' },

  // Promotions
  { path: '/promotions', element: null, name: 'Promotions' },

  // Orders & delivery
  { path: '/orders', element: null, name: 'Orders' },
  { path: '/orders/:id', element: null, name: 'Order detail' },
  { path: '/deliveries', element: null, name: 'Deliveries' },

  // Payments
  { path: '/payments', element: null, name: 'Payments' },

  // Inventory & recipes
  { path: '/inventory', element: null, name: 'Inventory' },
  { path: '/recipes', element: null, name: 'Recipes' },
]
