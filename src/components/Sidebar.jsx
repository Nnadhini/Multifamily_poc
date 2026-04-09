import React, { useState } from 'react';
import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Collapse, Typography, Avatar, IconButton, Divider, Chip, Tooltip, Badge } from '@mui/material';
import {
  Dashboard, People, Build, BarChart, Settings, ExpandLess, ExpandMore,
  ChevronLeft, ChevronRight, LocationCity, FiberManualRecord, AutoAwesome,
  NotificationsNone, Home, AccountBalance, Apartment, Description,
  Campaign, SmartToy, TrendingUp, Email, PriceChange, EventAvailable,
  RocketLaunch, HomeWork, Search, EventBusy, Insights, PersonSearch, ShowChart,
} from '@mui/icons-material';

export default function Sidebar({ communities, selected, selectedBuilding, onSelectCommunity, onSelectBuilding, open, onToggle, currentPage, onNavigate }) {
  const [expandedCommunity, setExpandedCommunity] = useState(selected?.id);
  const [showAi, setShowAi] = useState(false);
  const [showRevenue, setShowRevenue] = useState(false);
  const width = open ? 264 : 68;

  const mainNav = [
    { key: 'home', label: 'Home', icon: <Home /> },
    { key: 'dashboard', label: 'Dashboard', icon: <Dashboard /> },
    { key: 'financials', label: 'Financials', icon: <AccountBalance /> },
    { key: 'properties', label: 'Properties', icon: <Apartment /> },
    { key: 'tenants', label: 'Tenants', icon: <People /> },
    { key: 'leases', label: 'Leases', icon: <Description /> },
    { key: 'maintenance', label: 'Maintenance', icon: <Build /> },
    { key: 'bookings', label: 'Bookings & Leads', icon: <EventAvailable /> },
    { key: 'reports', label: 'Reports', icon: <BarChart /> },
    { key: 'communication', label: 'Communication', icon: <Email /> },
  ];

  const aiNav = [
    { key: 'ai-pricing', label: 'Dynamic Pricing', icon: <PriceChange /> },
    { key: 'ai-vacancy', label: 'Vacancy Predictor', icon: <TrendingUp /> },
    { key: 'ai-screening', label: 'Tenant Screening', icon: <People /> },
    { key: 'ai-chatbot', label: 'AI Chatbot', icon: <SmartToy /> },
    { key: 'ai-predictive-maint', label: 'Predictive Maint.', icon: <Build /> },
    { key: 'ai-renewal', label: 'Renewal Nudger', icon: <Campaign /> },
    { key: 'ai-rent-reminders', label: 'Rent Reminders', icon: <NotificationsNone /> },
    { key: 'ai-listing', label: 'Listing Writer', icon: <AutoAwesome /> },
    { key: 'ai-finance', label: 'Finance Insights', icon: <AccountBalance /> },
    { key: 'market-predictor', label: 'Market Predictor', icon: <ShowChart /> },
  ];

  const revenueNav = [
    { key: 'renter-listing', label: 'Renter Listing', icon: <HomeWork /> },
    { key: 'seo-audit', label: 'SEO Audit', icon: <Search /> },
    { key: 'no-show-recovery', label: 'No-Show Recovery', icon: <EventBusy /> },
    { key: 'manager-roi', label: 'Manager ROI', icon: <Insights /> },
    { key: 'rently-lead-intel', label: 'Lead Intel', icon: <PersonSearch /> },
  ];

  const getDotColor = (occ, tot) => { const r = (occ/tot)*100; return r >= 90 ? '#10B981' : r >= 75 ? '#F59E0B' : '#EF4444'; };
  const getOccColor = (occ, tot) => { const r = (occ/tot)*100; return r >= 90 ? 'success' : r >= 75 ? 'warning' : 'error'; };

  const NavItem = ({ item }) => {
    const active = currentPage === item.key;
    return (
      <Tooltip key={item.key} title={!open ? item.label : ''} placement="right" arrow>
        <ListItemButton onClick={() => onNavigate(item.key)}
          sx={{ borderRadius: '10px', mb: '1px', py: '5px', mx: '4px',
            bgcolor: active ? 'rgba(37,99,235,0.12)' : 'transparent',
            color: active ? '#60A5FA' : '#94A3B8',
            '&:hover': { bgcolor: active ? 'rgba(37,99,235,0.18)' : 'rgba(255,255,255,0.04)', color: '#E2E8F0' }
          }}>
          <ListItemIcon sx={{ color: 'inherit', minWidth: open ? 34 : 'unset' }}>{item.icon}</ListItemIcon>
          {open && <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.76rem', fontWeight: active ? 600 : 500 }} />}
        </ListItemButton>
      </Tooltip>
    );
  };

  return (
    <Drawer variant="permanent" sx={{ width, flexShrink: 0, '& .MuiDrawer-paper': { width, transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)', overflowX: 'hidden', bgcolor: '#0F172A', color: '#E2E8F0', borderRight: 'none' } }}>
      {/* Logo */}
      <Box sx={{ p: open ? '14px 14px 10px' : '14px 10px 10px', display: 'flex', alignItems: 'center', gap: 1.5, minHeight: 52 }}>
        <Box sx={{ width: 30, height: 30, borderRadius: '8px', background: 'linear-gradient(135deg, #2563EB, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: 13 }}>R</Typography>
        </Box>
        {open && (
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ color: '#F8FAFC', fontWeight: 700, fontSize: '0.85rem', lineHeight: 1.1 }}>Rently</Typography>
            <Typography sx={{ color: '#64748B', fontSize: '0.55rem' }}>Manager Portal</Typography>
          </Box>
        )}
        <IconButton onClick={onToggle} size="small" sx={{ color: '#475569', '&:hover': { color: '#94A3B8' } }}>
          {open ? <ChevronLeft fontSize="small" /> : <ChevronRight fontSize="small" />}
        </IconButton>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', '&::-webkit-scrollbar': { width: 3 }, '&::-webkit-scrollbar-thumb': { bgcolor: '#1E293B', borderRadius: 3 } }}>
        {/* Main Nav */}
        <List sx={{ px: 0.5, py: 0.5 }}>
          {mainNav.map(item => <NavItem key={item.key} item={item} />)}
        </List>

        <Divider sx={{ borderColor: '#1E293B', mx: 1.5, my: 0.5 }} />

        {/* AI Features */}
        {open && (
          <ListItemButton onClick={() => setShowAi(!showAi)} sx={{ mx: '4px', borderRadius: '10px', py: '5px' }}>
            <ListItemIcon sx={{ minWidth: 34, color: '#7C3AED' }}><AutoAwesome sx={{ fontSize: 18 }} /></ListItemIcon>
            <ListItemText primary="AI Features" primaryTypographyProps={{ fontSize: '0.76rem', fontWeight: 600, color: '#7C3AED' }} />
            <Chip label="10" size="small" sx={{ height: 16, fontSize: '0.5rem', bgcolor: '#7C3AED20', color: '#7C3AED', fontWeight: 700 }} />
            {showAi ? <ExpandLess sx={{ color: '#475569', fontSize: 16, ml: 0.5 }} /> : <ExpandMore sx={{ color: '#475569', fontSize: 16, ml: 0.5 }} />}
          </ListItemButton>
        )}
        <Collapse in={showAi || !open}>
          <List sx={{ px: 0.5 }}>
            {aiNav.map(item => <NavItem key={item.key} item={item} />)}
          </List>
        </Collapse>

        <Divider sx={{ borderColor: '#1E293B', mx: 1.5, my: 0.5 }} />

        {/* Revenue Engine */}
        {open && (
          <ListItemButton onClick={() => setShowRevenue(!showRevenue)} sx={{ mx: '4px', borderRadius: '10px', py: '5px' }}>
            <ListItemIcon sx={{ minWidth: 34, color: '#059669' }}><RocketLaunch sx={{ fontSize: 18 }} /></ListItemIcon>
            <ListItemText primary="Revenue Engine" primaryTypographyProps={{ fontSize: '0.76rem', fontWeight: 600, color: '#059669' }} />
            <Chip label="5" size="small" sx={{ height: 16, fontSize: '0.5rem', bgcolor: '#05966920', color: '#059669', fontWeight: 700 }} />
            {showRevenue ? <ExpandLess sx={{ color: '#475569', fontSize: 16, ml: 0.5 }} /> : <ExpandMore sx={{ color: '#475569', fontSize: 16, ml: 0.5 }} />}
          </ListItemButton>
        )}
        <Collapse in={showRevenue || !open}>
          <List sx={{ px: 0.5 }}>
            {revenueNav.map(item => <NavItem key={item.key} item={item} />)}
          </List>
        </Collapse>

        <Divider sx={{ borderColor: '#1E293B', mx: 1.5, my: 0.5 }} />
        {open && <Box sx={{ px: 2, pt: 1, pb: 0.5 }}><Typography sx={{ color: '#475569', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.55rem' }}>Properties</Typography></Box>}
        <List sx={{ px: 0.5 }}>
          {communities.map((c) => (
            <React.Fragment key={c.id}>
              <Tooltip title={!open ? c.name : ''} placement="right" arrow>
                <ListItemButton onClick={() => { onSelectCommunity(c); setExpandedCommunity(expandedCommunity === c.id ? null : c.id); }}
                  sx={{ borderRadius: '10px', mb: '1px', py: '4px', mx: '4px', bgcolor: selected?.id === c.id ? 'rgba(37,99,235,0.1)' : 'transparent' }}>
                  <ListItemIcon sx={{ minWidth: open ? 32 : 'unset' }}>
                    <LocationCity sx={{ color: selected?.id === c.id ? '#60A5FA' : '#475569', fontSize: 17 }} />
                  </ListItemIcon>
                  {open && <>
                    <ListItemText primary={c.name} primaryTypographyProps={{ fontSize: '0.72rem', fontWeight: selected?.id === c.id ? 600 : 400, color: selected?.id === c.id ? '#F1F5F9' : '#94A3B8', noWrap: true }} />
                    <Chip label={`${Math.round((c.occupiedUnits/c.totalUnits)*100)}%`} size="small" color={getOccColor(c.occupiedUnits, c.totalUnits)} sx={{ height: 16, fontSize: '0.52rem', fontWeight: 700, '& .MuiChip-label': { px: 0.5 } }} />
                    {expandedCommunity === c.id ? <ExpandLess sx={{ color: '#475569', ml: 0.5, fontSize: 14 }} /> : <ExpandMore sx={{ color: '#475569', ml: 0.5, fontSize: 14 }} />}
                  </>}
                </ListItemButton>
              </Tooltip>
              {open && <Collapse in={expandedCommunity === c.id}>
                <List disablePadding>
                  {c.buildings.map((b) => (
                    <ListItemButton key={b.id} onClick={() => onSelectBuilding(b)}
                      sx={{ borderRadius: '8px', py: '2px', pl: 5, mx: '4px', bgcolor: selectedBuilding?.id === b.id ? 'rgba(37,99,235,0.08)' : 'transparent' }}>
                      <FiberManualRecord sx={{ fontSize: 5, mr: 1.5, color: getDotColor(b.occupied, b.units) }} />
                      <ListItemText primary={b.name} secondary={`${b.occupied}/${b.units}`}
                        primaryTypographyProps={{ fontSize: '0.68rem', color: '#94A3B8' }}
                        secondaryTypographyProps={{ fontSize: '0.55rem', color: '#475569' }} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>}
            </React.Fragment>
          ))}
        </List>
      </Box>

      {/* User */}
      {open && <>
        <Divider sx={{ borderColor: '#1E293B' }} />
        <Box sx={{ p: '10px 14px', display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <Avatar sx={{ width: 28, height: 28, bgcolor: '#7C3AED', fontSize: 11, fontWeight: 700 }}>JD</Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ color: '#E2E8F0', fontSize: '0.72rem', fontWeight: 600 }}>Jane Doe</Typography>
            <Typography sx={{ color: '#475569', fontSize: '0.55rem' }}>Property Manager</Typography>
          </Box>
          <IconButton size="small" sx={{ color: '#475569' }}><Settings sx={{ fontSize: 16 }} /></IconButton>
        </Box>
      </>}
    </Drawer>
  );
}
