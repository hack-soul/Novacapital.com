import React, { useState, useEffect } from 'react';
import { initSeed } from '../lib/storage';
import { getCurrentSession, isAdmin } from '../lib/auth';
import type { Page } from '../lib/types';

import { ToastContainer } from '../components/ui';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CryptoTicker from '../components/CryptoTicker';

import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';
import PlansPage from '../pages/PlansPage';
import FAQPage from '../pages/FAQPage';
import ContactPage from '../pages/ContactPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';

import DashboardLayout from '../pages/dashboard/DashboardLayout';
import DashboardOverview from '../pages/dashboard/Overview';
import DepositPage from '../pages/dashboard/Deposit';
import WithdrawPage from '../pages/dashboard/Withdraw';
import { DepositHistoryPage, WithdrawalHistoryPage, InvestmentHistoryPage, NotificationsPage } from '../pages/dashboard/History';
import ProfilePage from '../pages/dashboard/Profile';

import AdminLayout from '../pages/admin/AdminLayout';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminDeposits from '../pages/admin/AdminDeposits';
import AdminWithdrawals from '../pages/admin/AdminWithdrawals';
import AdminPlans from '../pages/admin/AdminPlans';
import AdminCryptos from '../pages/admin/AdminCryptos';
import AdminSettings from '../pages/admin/AdminSettings';

initSeed();

function ProtectedRoute({ children, adminOnly = false, onNavigate, currentPage }: { children: React.ReactNode; adminOnly?: boolean; onNavigate: (p: Page) => void; currentPage: Page }) {
  const session = getCurrentSession();
  useEffect(() => {
    if (!session) { onNavigate('login'); }
    else if (adminOnly && !isAdmin()) { onNavigate('dashboard'); }
  }, []);
  if (!session) return null;
  if (adminOnly && !isAdmin()) return null;
  return <>{children}</>;
}

const PUBLIC_PAGES: Page[] = ['home', 'about', 'plans', 'faq', 'contact', 'login', 'register'];
const DASHBOARD_PAGES: Page[] = ['dashboard', 'dashboard/deposit', 'dashboard/withdraw', 'dashboard/deposits', 'dashboard/withdrawals', 'dashboard/investments', 'dashboard/notifications', 'dashboard/profile', 'dashboard/settings'];
const ADMIN_PAGES: Page[] = ['admin', 'admin/users', 'admin/deposits', 'admin/withdrawals', 'admin/plans', 'admin/cryptos', 'admin/settings', 'admin/faqs'];

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [sessionKey, setSessionKey] = useState(0);

  function navigate(page: Page) {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function onLogin() {
    setSessionKey(k => k + 1);
  }

  function onLogout() {
    setSessionKey(k => k + 1);
    setCurrentPage('home');
  }

  const isPublic = PUBLIC_PAGES.includes(currentPage);
  const isDashboard = DASHBOARD_PAGES.includes(currentPage);
  const isAdminPage = ADMIN_PAGES.includes(currentPage);

  function renderDashboardContent() {
    switch (currentPage) {
      case 'dashboard': return <DashboardOverview onNavigate={navigate} />;
      case 'dashboard/deposit': return <DepositPage />;
      case 'dashboard/withdraw': return <WithdrawPage />;
      case 'dashboard/deposits': return <DepositHistoryPage />;
      case 'dashboard/withdrawals': return <WithdrawalHistoryPage />;
      case 'dashboard/investments': return <InvestmentHistoryPage />;
      case 'dashboard/notifications': return <NotificationsPage />;
      case 'dashboard/profile': return <ProfilePage />;
      case 'dashboard/settings': return <ProfilePage />;
      default: return <DashboardOverview onNavigate={navigate} />;
    }
  }

  function renderAdminContent() {
    switch (currentPage) {
      case 'admin': return <AdminDashboard />;
      case 'admin/users': return <AdminUsers />;
      case 'admin/deposits': return <AdminDeposits />;
      case 'admin/withdrawals': return <AdminWithdrawals />;
      case 'admin/plans': return <AdminPlans />;
      case 'admin/cryptos': return <AdminCryptos />;
      case 'admin/settings': return <AdminSettings />;
      case 'admin/faqs': return <AdminSettings />;
      default: return <AdminDashboard />;
    }
  }

  function renderPublicContent() {
    switch (currentPage) {
      case 'home': return <HomePage onNavigate={navigate} />;
      case 'about': return <AboutPage onNavigate={navigate} />;
      case 'plans': return <PlansPage onNavigate={navigate} />;
      case 'faq': return <FAQPage onNavigate={navigate} />;
      case 'contact': return <ContactPage />;
      case 'login': return <LoginPage onNavigate={navigate} onLogin={onLogin} />;
      case 'register': return <RegisterPage onNavigate={navigate} onLogin={onLogin} />;
      default: return <HomePage onNavigate={navigate} />;
    }
  }

  if (isDashboard) {
    return (
      <ProtectedRoute onNavigate={navigate} currentPage={currentPage}>
        <DashboardLayout currentPage={currentPage} onNavigate={navigate} onLogout={onLogout}>
          {renderDashboardContent()}
        </DashboardLayout>
        <ToastContainer />
      </ProtectedRoute>
    );
  }

  if (isAdminPage) {
    return (
      <ProtectedRoute adminOnly onNavigate={navigate} currentPage={currentPage}>
        <AdminLayout currentPage={currentPage} onNavigate={navigate} onLogout={onLogout}>
          {renderAdminContent()}
        </AdminLayout>
        <ToastContainer />
      </ProtectedRoute>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar currentPage={currentPage} onNavigate={navigate} key={sessionKey} />
      <CryptoTicker />
      <main className="flex-1">
        {renderPublicContent()}
      </main>
      {!['login', 'register'].includes(currentPage) && (
        <Footer onNavigate={navigate} />
      )}
      <ToastContainer />
    </div>
  );
}
