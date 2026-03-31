import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Chip, Avatar, Button } from '@mui/material';
import {
  Dashboard, AccountBalance, Apartment, People, Description, Build,
  EventAvailable, BarChart, Email, PriceChange, TrendingUp, SmartToy,
  Campaign, NotificationsNone, AutoAwesome, WbSunny, ArrowForward,
  Verified, Speed
} from '@mui/icons-material';

const portalModules = [
  { key: 'dashboard', title: 'Dashboard', desc: 'Occupancy rate, revenue, today\'s pending tasks', icon: <Dashboard />, color: '#2563EB', bg: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)', stats: '88.5% occupancy' },
  { key: 'financials', title: 'Financials', desc: 'Rent collected, expenses, P&L, late payments', icon: <AccountBalance />, color: '#059669', bg: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)', stats: '$284.8K revenue' },
  { key: 'properties', title: 'Properties', desc: 'Unit status, vacancy, photos, documents', icon: <Apartment />, color: '#7C3AED', bg: 'linear-gradient(135deg, #F5F3FF, #EDE9FE)', stats: '148 total units' },
  { key: 'tenants', title: 'Tenant Management', desc: 'Profiles, KYC docs, payment history, comms', icon: <People />, color: '#0891B2', bg: 'linear-gradient(135deg, #ECFEFF, #CFFAFE)', stats: '131 active tenants' },
  { key: 'leases', title: 'Lease Management', desc: 'E-sign, renewals, expiry alerts, clauses', icon: <Description />, color: '#D97706', bg: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)', stats: '52 expiring soon' },
  { key: 'maintenance', title: 'Maintenance', desc: 'Requests, vendor assign, SLA tracking, costs', icon: <Build />, color: '#DC2626', bg: 'linear-gradient(135deg, #FEF2F2, #FEE2E2)', stats: '12 open tickets' },
  { key: 'bookings', title: 'Bookings & Leads', desc: 'Inquiries, viewings, application pipeline', icon: <EventAvailable />, color: '#2563EB', bg: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)', stats: '42 active tours' },
  { key: 'reports', title: 'Reports & Analytics', desc: 'Rent yield, vacancy, expense trends, ROI', icon: <BarChart />, color: '#7C3AED', bg: 'linear-gradient(135deg, #F5F3FF, #EDE9FE)', stats: '15 report types' },
  { key: 'communication', title: 'Communication Hub', desc: 'WhatsApp, SMS, email, notices, broadcasts', icon: <Email />, color: '#059669', bg: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)', stats: '24 unread messages' },
];

const aiFeatures = [
  { key: 'ai-pricing', title: 'Dynamic Pricing', desc: 'Auto-adjust rent based on market & demand', impact: '↑ Yield by 10-20%', icon: <PriceChange />, color: '#059669' },
  { key: 'ai-vacancy', title: 'Vacancy Predictor', desc: 'Predict move-outs early, start re-marketing fast', impact: '↓ Vacancy days', icon: <TrendingUp />, color: '#2563EB' },
  { key: 'ai-screening', title: 'AI Tenant Screening', desc: 'Risk score, fraud check, income verification', impact: '↓ Bad debt losses', icon: <Verified />, color: '#7C3AED' },
  { key: 'ai-chatbot', title: 'AI Chatbot', desc: '24/7 tenant queries, lead capture, auto-reply', impact: '↑ Lead conversion', icon: <SmartToy />, color: '#0891B2' },
  { key: 'ai-predictive-maint', title: 'Predictive Maintenance', desc: 'Flag issues before they escalate into big costs', impact: '↓ Repair expenses', icon: <Build />, color: '#D97706' },
  { key: 'ai-renewal', title: 'Renewal Nudger', desc: 'Auto-remind tenants, offer smart discounts', impact: '↑ Retention rate', icon: <Campaign />, color: '#DC2626' },
  { key: 'ai-rent-reminders', title: 'Smart Rent Reminders', desc: 'Auto-escalate overdue, legal notices', impact: '↓ Late payments', icon: <NotificationsNone />, color: '#059669' },
  { key: 'ai-listing', title: 'AI Listing Writer', desc: 'Auto-generate listing copy, photos tagging', impact: '↑ Faster fill rate', icon: <AutoAwesome />, color: '#7C3AED' },
  { key: 'ai-finance', title: 'AI Finance Insights', desc: 'Spot underperforming units, tax optimization', impact: '↑ Net income', icon: <AccountBalance />, color: '#2563EB' },
];

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

export default function HomePage({ onNavigate }) {
  return (
    <Box sx={{ p: { xs: '16px', md: '24px 28px' }, maxWidth: 1440 }}>
      {/* Welcome Hero */}
      <Box sx={{
        mb: 3, p: '28px 32px', borderRadius: '20px',
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        <Box sx={{ position: 'absolute', top: -60, right: -30, width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.1), transparent)' }} />
        <Box sx={{ position: 'absolute', bottom: -80, left: '40%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.08), transparent)' }} />
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1 }}>
            <WbSunny sx={{ fontSize: 18, color: '#FCD34D' }} />
            <Typography sx={{ color: '#94A3B8', fontSize: '0.82rem' }}>{getGreeting()}, Jane</Typography>
          </Box>
          <Typography sx={{ color: '#F8FAFC', fontWeight: 800, fontSize: '2rem', letterSpacing: '-0.03em', lineHeight: 1.15, mb: 0.5 }}>
            Welcome to Rently Manager
          </Typography>
          <Typography sx={{ color: '#64748B', fontSize: '0.88rem', maxWidth: 600, lineHeight: 1.5 }}>
            Manage your properties, track revenue, engage tenants, and let AI boost your rental income — all from one place.
          </Typography>

          {/* Quick Stats */}
          <Box sx={{ display: 'flex', gap: 3, mt: 2.5 }}>
            {[
              { value: '308', label: 'Total Units', color: '#60A5FA' },
              { value: '271', label: 'Occupied', color: '#34D399' },
              { value: '$284.8K', label: 'Monthly Revenue', color: '#A78BFA' },
              { value: '42', label: 'Active Tours', color: '#FBBF24' },
              { value: '12', label: 'Pending Tasks', color: '#F87171' },
            ].map(s => (
              <Box key={s.label}>
                <Typography sx={{ color: s.color, fontWeight: 800, fontSize: '1.35rem', lineHeight: 1 }}>{s.value}</Typography>
                <Typography sx={{ color: '#64748B', fontSize: '0.6rem', fontWeight: 500 }}>{s.label}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Portal Modules */}
      <Box sx={{ mb: 3.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Typography sx={{ fontWeight: 800, fontSize: '1.15rem', color: '#0F172A' }}>Property Management</Typography>
          <Chip label="9 modules" size="small" sx={{ height: 20, fontSize: '0.6rem', fontWeight: 600, bgcolor: '#F1F5F9', color: '#64748B' }} />
        </Box>
        <Grid container spacing={1.75}>
          {portalModules.map(mod => (
            <Grid item xs={12} sm={6} md={4} key={mod.key}>
              <Card onClick={() => onNavigate(mod.key)} sx={{
                cursor: 'pointer', height: '100%', position: 'relative', overflow: 'hidden',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 16px 32px -8px rgba(15,23,42,0.12)', '& .arrow-icon': { opacity: 1, transform: 'translateX(0)' } },
              }}>
                <CardContent sx={{ p: '18px !important' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Box sx={{ p: '8px', borderRadius: '12px', background: mod.bg, display: 'flex' }}>
                      {React.cloneElement(mod.icon, { sx: { fontSize: 22, color: mod.color } })}
                    </Box>
                    <ArrowForward className="arrow-icon" sx={{ fontSize: 16, color: mod.color, opacity: 0, transform: 'translateX(-8px)', transition: 'all 0.3s' }} />
                  </Box>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.92rem', color: '#0F172A', mb: 0.35 }}>{mod.title}</Typography>
                  <Typography sx={{ fontSize: '0.72rem', color: '#94A3B8', lineHeight: 1.4, mb: 1.25 }}>{mod.desc}</Typography>
                  <Chip label={mod.stats} size="small" sx={{ height: 20, fontSize: '0.58rem', fontWeight: 600, bgcolor: `${mod.color}08`, color: mod.color, border: `1px solid ${mod.color}15` }} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* AI Features */}
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Box sx={{ p: '4px', borderRadius: '6px', background: 'linear-gradient(135deg, #7C3AED, #2563EB)', display: 'flex' }}>
            <AutoAwesome sx={{ color: '#fff', fontSize: 16 }} />
          </Box>
          <Typography sx={{ fontWeight: 800, fontSize: '1.15rem', color: '#0F172A' }}>AI Features to Boost Revenue</Typography>
          <Chip label="9 AI tools" size="small" sx={{ height: 20, fontSize: '0.6rem', fontWeight: 600, bgcolor: '#F5F3FF', color: '#7C3AED' }} />
        </Box>
        <Typography sx={{ fontSize: '0.78rem', color: '#94A3B8', mb: 2, ml: 4 }}>Powered by machine learning to maximize your rental income</Typography>

        <Grid container spacing={1.75}>
          {aiFeatures.map(ai => (
            <Grid item xs={12} sm={6} md={4} key={ai.key}>
              <Card onClick={() => onNavigate(ai.key)} sx={{
                cursor: 'pointer', height: '100%',
                background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                border: '1px solid #334155',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 16px 32px -8px ${ai.color}25`,
                  borderColor: `${ai.color}40`,
                  '& .arrow-icon': { opacity: 1, transform: 'translateX(0)' },
                },
              }}>
                <CardContent sx={{ p: '18px !important' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Box sx={{ p: '8px', borderRadius: '12px', bgcolor: `${ai.color}15`, display: 'flex' }}>
                      {React.cloneElement(ai.icon, { sx: { fontSize: 20, color: ai.color } })}
                    </Box>
                    <ArrowForward className="arrow-icon" sx={{ fontSize: 16, color: ai.color, opacity: 0, transform: 'translateX(-8px)', transition: 'all 0.3s' }} />
                  </Box>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#F1F5F9', mb: 0.35 }}>{ai.title}</Typography>
                  <Typography sx={{ fontSize: '0.7rem', color: '#94A3B8', lineHeight: 1.4, mb: 1.25 }}>{ai.desc}</Typography>
                  <Chip label={ai.impact} size="small" sx={{ height: 22, fontSize: '0.6rem', fontWeight: 700, bgcolor: `${ai.color}20`, color: ai.color, border: `1px solid ${ai.color}30` }} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
