import React, { useState } from 'react';
import { Box } from '@mui/material';
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
import { communities } from './mockData';

const pages = {
  home: HomePage,
  dashboard: DashboardPage,
  financials: FinancialsPage,
  properties: PropertiesPage,
  tenants: TenantManagementPage,
  leases: LeaseManagementPage,
  maintenance: MaintenancePage,
  bookings: BookingsLeadsPage,
  reports: ReportsPage,
  communication: CommunicationHubPage,
  'ai-pricing': DynamicPricingPage,
  'ai-vacancy': VacancyPredictorPage,
  'ai-screening': AiTenantScreeningPage,
  'ai-chatbot': AiChatbotPage,
  'ai-predictive-maint': PredictiveMaintenancePage,
  'ai-renewal': RenewalNudgerPage,
  'ai-rent-reminders': SmartRentRemindersPage,
  'ai-listing': AiListingWriterPage,
  'ai-finance': AiFinanceInsightsPage,
  'renter-listing': RenterListingPage,
  'seo-audit': SeoAuditPage,
  'no-show-recovery': NoShowRecoveryPage,
  'manager-roi': ManagerRoiPage,
};

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedCommunity, setSelectedCommunity] = useState(communities[0]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const PageComponent = pages[currentPage] || HomePage;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar
        communities={communities}
        selected={selectedCommunity}
        selectedBuilding={selectedBuilding}
        onSelectCommunity={(c) => { setSelectedCommunity(c); setSelectedBuilding(null); }}
        onSelectBuilding={setSelectedBuilding}
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />
      <Box component="main" sx={{ flexGrow: 1, ml: sidebarOpen ? '264px' : '68px', transition: 'margin-left 0.3s cubic-bezier(0.4,0,0.2,1)', minHeight: '100vh' }}>
        <PageComponent
          community={selectedCommunity}
          building={selectedBuilding}
          onNavigate={setCurrentPage}
        />
      </Box>
    </Box>
  );
}
