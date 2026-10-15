import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Spinner } from '../common/Spinner'

/*
  ProtectedRoute — guards the admin console. Sends unauthenticated visitors to
  /login and remembers where they were going.
*/
export function ProtectedRoute({ children }) {
  const { isAuthenticated, isAdmin, initializing } = useAuth()
  const location = useLocation()

  if (initializing) {
    return (
      <div className="grid min-h-screen place-items-center">
        <Spinner label="Loading console…" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  // Only owners / managers may enter the admin console; send everyone else back
  // to their customer account rather than showing the dashboard.
  if (!isAdmin) {
    return <Navigate to="/account" replace />
  }

  // Render the layout passed in as children (e.g. <MainLayout/>); its <Outlet/>
  // then paints the matched admin page. Fall back to a bare Outlet if none given.
  return children || <Outlet />
}
