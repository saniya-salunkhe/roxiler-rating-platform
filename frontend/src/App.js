import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminStores from './pages/admin/AdminStores';
import AddUser from './pages/admin/AddUser';
import AddStore from './pages/admin/AddStore';
import UserDetail from './pages/admin/UserDetail';

import StoreList from './pages/user/StoreList';
import ChangePassword from './pages/user/ChangePassword';

import OwnerDashboard from './pages/store/OwnerDashboard';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';


/* ==========================================================================
   PRIVATE ROUTE
   ========================================================================== */

function PrivateRoute({ children, roles }) {
  const { user } = useAuth();

  // User is not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // User does not have required role
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}


/* ==========================================================================
   HOME REDIRECT
   Redirect user according to their role
   ========================================================================== */

function HomeRedirect() {
  const { user } = useAuth();

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect according to role
  switch (user.role) {
    case 'admin':
      return <Navigate to="/admin/dashboard" replace />;

    case 'store_owner':
      return <Navigate to="/owner/dashboard" replace />;

    default:
      return <Navigate to="/stores" replace />;
  }
}


/* ==========================================================================
   APP
   ========================================================================== */

export default function App() {
  const { isAuthenticated } = useAuth();

  /*
   * ================================================================
   * AUTHENTICATION PAGES
   * ================================================================
   *
   * Login and Signup should NOT display:
   * - Navbar
   * - Footer
   *
   * This allows the full-screen background video to work correctly.
   */

  if (!isAuthenticated) {
    return (
      <Routes>

        {/* Login */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Signup */}
        <Route
          path="/signup"
          element={<Signup />}
        />

        {/* Any unknown URL → Login */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    );
  }


  /*
   * ================================================================
   * AUTHENTICATED PAGES
   * ================================================================
   *
   * Logged-in users get:
   * - Navbar
   * - Page content
   * - Footer
   */

  return (
    <div className="app-layout">

      {/* ==========================================================
          NAVBAR
          ========================================================== */}

      <Navbar />


      {/* ==========================================================
          MAIN CONTENT
          ========================================================== */}

      <main className="app-main">

        <Routes>

          {/* ======================================================
              HOME
              ====================================================== */}

          <Route
            path="/"
            element={<HomeRedirect />}
          />


          {/* ======================================================
              ADMIN ROUTES
              ====================================================== */}

          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute roles={['admin']}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <PrivateRoute roles={['admin']}>
                <AdminUsers />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/stores"
            element={
              <PrivateRoute roles={['admin']}>
                <AdminStores />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/users/add"
            element={
              <PrivateRoute roles={['admin']}>
                <AddUser />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/stores/add"
            element={
              <PrivateRoute roles={['admin']}>
                <AddStore />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/users/:id"
            element={
              <PrivateRoute roles={['admin']}>
                <UserDetail />
              </PrivateRoute>
            }
          />


          {/* ======================================================
              NORMAL USER ROUTES
              ====================================================== */}

          <Route
            path="/stores"
            element={
              <PrivateRoute roles={['user', 'admin']}>
                <StoreList />
              </PrivateRoute>
            }
          />

          <Route
            path="/change-password"
            element={
              <PrivateRoute
                roles={[
                  'user',
                  'admin',
                  'store_owner'
                ]}
              >
                <ChangePassword />
              </PrivateRoute>
            }
          />


          {/* ======================================================
              STORE OWNER ROUTES
              ====================================================== */}

          <Route
            path="/owner/dashboard"
            element={
              <PrivateRoute roles={['store_owner']}>
                <OwnerDashboard />
              </PrivateRoute>
            }
          />


          {/* ======================================================
              UNKNOWN AUTHENTICATED ROUTE
              ====================================================== */}

          <Route
            path="*"
            element={<HomeRedirect />}
          />

        </Routes>

      </main>


      {/* ==========================================================
          FOOTER
          ========================================================== */}

      <Footer />

    </div>
  );
}