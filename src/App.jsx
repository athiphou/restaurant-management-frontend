import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from './components/layout/MainLayout'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import { ErrorBoundary } from './components/common/ErrorBoundary'
import { PublicLayout } from './components/customer/PublicLayout'

import HomePage from './pages/public/HomePage'
import MenuPage from './pages/public/MenuPage'
import LocationsPage from './pages/public/LocationsPage'
import CheckoutPage from './pages/public/CheckoutPage'
import OrderConfirmationPage from './pages/public/OrderConfirmationPage'
import TrackingPage from './pages/public/TrackingPage'
import AccountPage from './pages/public/AccountPage'

import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'

import DashboardPage from './pages/dashboard/DashboardPage'
import OrdersPage from './pages/order/OrdersPage'
import CategoriesPage from './pages/menu/CategoriesPage'
import FoodsPage from './pages/menu/FoodsPage'
import VariantsPage from './pages/menu/VariantsPage'
import AddonsPage from './pages/menu/AddonsPage'
import AddonItemsPage from './pages/menu/AddonItemsPage'
import RestaurantsPage from './pages/restaurant/RestaurantsPage'
import BranchesPage from './pages/restaurant/BranchesPage'
import TablesPage from './pages/restaurant/TablesPage'
import DeliveriesPage from './pages/delivery/DeliveriesPage'
import DriversPage from './pages/delivery/DriversPage'
import PositionsPage from './pages/staff/PositionsPage'
import EmployeesPage from './pages/staff/EmployeesPage'
import SuppliersPage from './pages/inventory/SuppliersPage'
import IngredientsPage from './pages/inventory/IngredientsPage'
import InventoryPage from './pages/inventory/InventoryPage'
import TransactionsPage from './pages/inventory/TransactionsPage'
import RecipesPage from './pages/inventory/RecipesPage'
import PaymentsPage from './pages/payment/PaymentsPage'
import PromotionsPage from './pages/promotion/PromotionsPage'
import RolesPage from './pages/role/RolesPage'
import UserRolesPage from './pages/role/UserRolesPage'
import ProfilePage from './pages/settings/ProfilePage'
import CustomersPage from './pages/customer/CustomersPage'

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          {/* ===== Customer-facing site ===== */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/locations" element={<LocationsPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmed" element={<OrderConfirmationPage />} />
            <Route path="/tracking" element={<TrackingPage />} />
            <Route path="/account" element={<AccountPage />} />
          </Route>

          {/* ===== Authentication ===== */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* ===== Protected admin console (scaffolded) ===== */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/:id" element={<OrdersPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/promotions" element={<PromotionsPage />} />
            <Route path="/payments" element={<PaymentsPage />} />
            <Route path="/deliveries" element={<DeliveriesPage />} />
            <Route path="/drivers" element={<DriversPage />} />
            <Route path="/staff" element={<EmployeesPage />} />
            <Route path="/staff/positions" element={<PositionsPage />} />
            <Route path="/admin/menu" element={<FoodsPage />} />
            <Route path="/admin/menu/categories" element={<CategoriesPage />} />
            <Route path="/admin/menu/variants" element={<VariantsPage />} />
            <Route path="/admin/menu/addons" element={<AddonsPage />} />
            <Route path="/admin/menu/addon-items" element={<AddonItemsPage />} />
            <Route path="/restaurants" element={<RestaurantsPage />} />
            <Route path="/branches" element={<BranchesPage />} />
            <Route path="/tables" element={<TablesPage />} />
            <Route path="/suppliers" element={<SuppliersPage />} />
            <Route path="/ingredients" element={<IngredientsPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/inventory/transactions" element={<TransactionsPage />} />
            <Route path="/recipes" element={<RecipesPage />} />
            <Route path="/roles" element={<RolesPage />} />
            <Route path="/user-roles" element={<UserRolesPage />} />
          </Route>

          {/* ===== Fallback ===== */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
