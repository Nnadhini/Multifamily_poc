import React, { useState } from 'react';
import { Box, Grid } from '@mui/material';
import WelcomeBanner from './WelcomeBanner';
import KpiCards from './KpiCards';
import AiInsightsBanner from './AiInsightsBanner';
import OccupancyChart from './OccupancyChart';
import TourConversionFunnel from './TourConversionFunnel';
import RevenueChart from './RevenueChart';
import LeaseExpiryTimeline from './LeaseExpiryTimeline';
import MarketBenchmark from './MarketBenchmark';
import QuickActions from './QuickActions';
import TasksPanel from './TasksPanel';
import NotificationsPanel from './NotificationsPanel';
import UnitsTable from './UnitsTable';
import CrmTable from './CrmTable';
import UnitDetailPanel from './UnitDetailPanel';

export default function DashboardPage({ community, building }) {
  const [selectedUnit, setSelectedUnit] = useState(null);
  return (
    <Box sx={{ p: { xs: '14px', md: '18px 22px' }, maxWidth: 1440 }}>
      {/* Hero Welcome */}
      <WelcomeBanner community={community} />

      {/* KPIs */}
      <Box sx={{ mb: 1.75 }}><KpiCards /></Box>

      {/* AI Banner */}
      <Box sx={{ mb: 1.75 }}><AiInsightsBanner /></Box>

      {/* Bento Grid: Main Content */}
      <Grid container spacing={1.75} sx={{ mb: 1.75 }}>
        <Grid item xs={12} md={5}>
          <OccupancyChart />
        </Grid>
        <Grid item xs={12} md={7}>
          <Grid container spacing={1.75}>
            <Grid item xs={6}><TourConversionFunnel /></Grid>
            <Grid item xs={6}><QuickActions /></Grid>
            <Grid item xs={6}><RevenueChart /></Grid>
            <Grid item xs={6}><MarketBenchmark /></Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Row: Tasks + Notifications + Lease Expiry */}
      <Grid container spacing={1.75} sx={{ mb: 1.75 }}>
        <Grid item xs={12} md={5}><TasksPanel /></Grid>
        <Grid item xs={12} md={3.5}><NotificationsPanel /></Grid>
        <Grid item xs={12} md={3.5}><LeaseExpiryTimeline /></Grid>
      </Grid>

      {/* Units Table */}
      <Box sx={{ mb: 1.75 }}><UnitsTable onSelectUnit={(u) => setSelectedUnit(u)} /></Box>

      {/* CRM Pipeline Table */}
      <Box sx={{ mb: 1.75 }}><CrmTable /></Box>

      <UnitDetailPanel unit={selectedUnit} open={!!selectedUnit} onClose={() => setSelectedUnit(null)} />
    </Box>
  );
}
