import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppShell from './components/AppShell';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Contact from './pages/Contact';
const Dashboard = lazy(() => import('./pages/Dashboard').then((m) => ({ default: m.Dashboard })));
const CardsPage = lazy(() => import('./pages/CardsPage').then((m) => ({ default: m.CardsPage })));
const TransactionsPage = lazy(() => import('./pages/TransactionsPage').then((m) => ({ default: m.TransactionsPage })));
const BillingPage = lazy(() => import('./pages/BillingPage').then((m) => ({ default: m.BillingPage })));
const RepaymentsPage = lazy(() => import('./pages/RepaymentsPage').then((m) => ({ default: m.RepaymentsPage })));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage').then((m) => ({ default: m.NotificationsPage })));
const ReportsPage = lazy(() => import('./pages/ReportsPage').then((m) => ({ default: m.ReportsPage })));
const ProfilePage = lazy(() => import('./pages/ProfilePage').then((m) => ({ default: m.ProfilePage })));
const AdminDashboard = lazy(() => import('./pages/AdminPages').then((m) => ({ default: m.AdminDashboard })));
const AdminUsersPage = lazy(() => import('./pages/AdminPages').then((m) => ({ default: m.AdminUsersPage })));
const AdminCardsPage = lazy(() => import('./pages/AdminPages').then((m) => ({ default: m.AdminCardsPage })));
const AdminContactsPage = lazy(() => import('./pages/AdminPages').then((m) => ({ default: m.AdminContactsPage })));

const loadingPage = <div className="loading-state"><div className="spinner" /><span>Opening your workspace…</span></div>;

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={loadingPage}><Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute role="user" />}>
            <Route element={<AppShell />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/cards" element={<CardsPage />} />
              <Route path="/transactions" element={<TransactionsPage />} />
              <Route path="/billing" element={<BillingPage />} />
              <Route path="/repayments" element={<RepaymentsPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute role="admin" />}>
            <Route element={<AppShell />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/cards" element={<AdminCardsPage />} />
              <Route path="/admin/contacts" element={<AdminContactsPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes></Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}
