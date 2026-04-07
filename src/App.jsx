import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import Sidebar from './components/Sidebar';
import HomePage from './components/HomePage';
import DashboardPage from './components/DashboardPage';
import FinancialsPage from './modules/FinancialsPage';
import PropertiesPage from './modules/PropertiesPage';
import TenantManagementPage from './modules/TenantManagementPage';
import LeaseManagementPage from './modules/LeaseManagementPage';
import MaintenancePage from './modules/MaintenancePage';
import BookingsLeadsPage from './modules/BookingsLeadsPage';
import ReportsPage from './modules/ReportsPage';
import CommunicationHubPage from './modules/CommunicationHubPage';
import DynamicPricingPage from './modules/DynamicPricingPage';
import VacancyPredictorPage from './modules/VacancyPredictorPage';
import AiTenantScreeningPage from './modules/AiTenantScreeningPage';
import AiChatbotPage from './modules/AiChatbotPage';
import PredictiveMaintenancePage from './modules/PredictiveMaintenancePage';
import RenewalNudgerPage from './modules/RenewalNudgerPage';
import SmartRentRemindersPage from './modules/SmartRentRemindersPage';
import AiListingWriterPage from './modules/AiListingWriterPage';
import AiFinanceInsightsPage from './modules/AiFinanceInsightsPage';
import RenterListingPage from './modules/RenterListingPage';
import SeoAuditPage from './modules/SeoAuditPage';
import NoShowRecoveryPage from './modules/NoShowRecoveryPage';
import ManagerRoiPage from './modules/ManagerRoiPage';
import LoginPage from './pages/LoginPage.jsx';
import { useAuth } from './context/AuthContext.jsx';
import { fetchCommunities } from './api/communities.js';

// Map URL path → component
const PAGE_ROUTES = [
  { path: '/',                  Component: HomePage },
  { path: '/dashboard',         Component: DashboardPage },
  { path: '/financials',        Component: FinancialsPage },
  { path: '/properties',        Component: PropertiesPage },
  { path: '/tenants',           Component: TenantManagementPage },
  { path: '/leases',            Component: LeaseManagementPage },
  { path: '/maintenance',       Component: MaintenancePage },
  { path: '/bookings',          Component: BookingsLeadsPage },
  { path: '/reports',           Component: ReportsPage },
  { path: '/communication',     Component: CommunicationHubPage },
  { path: '/ai-pricing',        Component: DynamicPricingPage },
  { path: '/ai-vacancy',        Component: VacancyPredictorPage },
  { path: '/ai-screening',      Component: AiTenantScreeningPage },
  { path: '/ai-chatbot',        Component: AiChatbotPage },
  { path: '/ai-predictive-maint', Component: PredictiveMaintenancePage },
  { path: '/ai-renewal',        Component: RenewalNudgerPage },
  { path: '/ai-rent-reminders', Component: SmartRentRemindersPage },
  { path: '/ai-listing',        Component: AiListingWriterPage },
  { path: '/ai-finance',        Component: AiFinanceInsightsPage },
  { path: '/renter-listing',    Component: RenterListingPage },
  { path: '/seo-audit',         Component: SeoAuditPage },
  { path: '/no-show-recovery',  Component: NoShowRecoveryPage },
  { path: '/manager-roi',       Component: ManagerRoiPage },
];

function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();

  const { data: communities = [] } = useQuery({
    queryKey: ['communities'],
    queryFn: fetchCommunities,
  });

  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [selectedBuilding, setSelectedBuilding]   = useState(null);
  const [sidebarOpen, setSidebarOpen]             = useState(true);

  // Initialise selectedCommunity once communities load
  const community = selectedCommunity ?? communities[0] ?? null;

  // currentPage derived from URL so sidebar highlights correctly
  const currentPage = location.pathname.replace(/^\//, '') || 'home';

  const sharedProps = { community, building: selectedBuilding, onNavigate: (key) => navigate(`/${key === 'home' ? '' : key}`) };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar
        communities={communities}
        selected={community}
        selectedBuilding={selectedBuilding}
        onSelectCommunity={(c) => { setSelectedCommunity(c); setSelectedBuilding(null); }}
        onSelectBuilding={setSelectedBuilding}
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        currentPage={currentPage}
        onNavigate={(key) => navigate(`/${key === 'home' ? '' : key}`)}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: sidebarOpen ? '264px' : '68px',
          transition: 'margin-left 0.3s cubic-bezier(0.4,0,0.2,1)',
          minHeight: '100vh',
        }}
      >
        <Routes>
        {PAGE_ROUTES.map(({ path, Component }) => (
            <Route
              key={path}
              path={path}
              element={React.createElement(Component, sharedProps)}
            />
          ))}
          {/* Catch-all → home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route
        path="/*"
        element={isAuthenticated ? <AppShell /> : <Navigate to="/login" replace />}
      />
    </Routes>
  );
}
