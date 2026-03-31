import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Chip, IconButton, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, Tooltip } from '@mui/material';
import { ArrowBack, People, Warning, Email, Phone, Celebration, TrendingDown } from '@mui/icons-material';
import { units } from '../mockData';

const tenants = units
  .filter(u => u.tenant && u.status === 'occupied')
  .map(u => {
    const daysToExpiry = u.leaseEnd
      ? Math.round((new Date(u.leaseEnd) - new Date('2026-03-31')) / (1000 * 60 * 60 * 24))
      : null;
    const risk = daysToExpiry <= 30 ? 'high' : daysToExpiry <= 90 ? 'medium' : 'low';
    const payStatus = ['paid', 'paid', 'paid', 'overdue', 'partial'][Math.floor(Math.random() * 5)] || 'paid';
    return { ...u, daysToExpiry, risk, payStatus: u.unit === '303' ? 'overdue' : u.unit === '301' ? 'partial' : 'paid' };
  });

const riskConfig = {
  high: { color: '#DC2626', bg: '#DC262612', label: 'High Risk' },
  medium: { color: '#F59E0B', bg: '#F59E0B12', label: 'At Risk' },
  low: { color: '#059669', bg: '#05966912', label: 'Stable' },
};

const payConfig = {
  paid: { color: '#059669', bg: '#05966912', label: 'Current' },
  partial: { color: '#F59E0B', bg: '#F59E0B12', label: 'Partial' },
  overdue: { color: '#DC2626', bg: '#DC262612', label: 'Overdue' },
};

export default function TenantManagementPage({ onNavigate }) {
  const [reminded, setReminded] = useState({});

  const atRisk = tenants.filter(t => t.risk === 'high' || t.risk === 'medium').length;
  const avgRent = Math.round(tenants.reduce((s, t) => s + t.rent, 0) / tenants.length);

  const sendReminder = (id) => setReminded(prev => ({ ...prev, [id]: true }));

  return (
    <Box sx={{ p: { xs: '16px', md: '20px 24px' }, maxWidth: 1440 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <IconButton onClick={() => onNavigate('home')} size="small" sx={{ color: '#64748B', bgcolor: '#F1F5F9' }}><ArrowBack sx={{ fontSize: 16 }} /></IconButton>
        <Box sx={{ p: '6px', borderRadius: '10px', bgcolor: '#2563EB12' }}><People sx={{ fontSize: 20, color: '#2563EB' }} /></Box>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: '1.4rem', color: '#0F172A' }}>Tenant Management</Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>Profiles, lease risk, payment status, retention actions</Typography>
        </Box>
      </Box>

      <Grid container spacing={1.75} sx={{ mb: 2.5 }}>
        {[
          { label: 'Total Tenants', value: tenants.length, color: '#0F172A' },
          { label: 'At-Risk Tenants', value: atRisk, color: '#DC2626', sub: 'lease ending < 90 days' },
          { label: 'Avg Monthly Rent', value: `$${avgRent.toLocaleString()}`, color: '#059669' },
          { label: 'Overdue Payments', value: tenants.filter(t => t.payStatus === 'overdue').length, color: '#DC2626' },
          { label: 'Retention Impact', value: `-$${(atRisk * 5200).toLocaleString()}`, color: '#F59E0B', sub: 'potential turnover cost' },
        ].map(s => (
          <Grid item xs={6} md key={s.label}>
            <Card><CardContent sx={{ p: '14px !important' }}>
              <Typography sx={{ fontSize: '0.6rem', color: '#94A3B8', fontWeight: 600, mb: 0.5 }}>{s.label}</Typography>
              <Typography sx={{ fontWeight: 800, fontSize: '1.3rem', color: s.color, lineHeight: 1 }}>{s.value}</Typography>
              {s.sub && <Typography sx={{ fontSize: '0.58rem', color: '#94A3B8', mt: 0.25 }}>{s.sub}</Typography>}
            </CardContent></Card>
          </Grid>
        ))}
      </Grid>

      <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: 'none', border: '1px solid #E2E8F0' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#F8FAFC' }}>
              {['Tenant', 'Unit', 'Type', 'Rent', 'Lease End', 'Days Left', 'Renewal Risk', 'Payment', 'Actions'].map(h => (
                <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.65rem', color: '#64748B', py: 1.25 }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tenants.sort((a, b) => (a.daysToExpiry || 999) - (b.daysToExpiry || 999)).map(t => {
              const rc = riskConfig[t.risk];
              const pc = payConfig[t.payStatus];
              return (
                <TableRow key={t.id} sx={{ '&:hover': { bgcolor: '#F8FAFC' } }}>
                  <TableCell sx={{ py: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 28, height: 28, fontSize: '0.65rem', bgcolor: '#2563EB18', color: '#2563EB', fontWeight: 700 }}>
                        {t.tenant.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#0F172A' }}>{t.tenant}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#7C3AED', py: 1 }}>{t.unit}</TableCell>
                  <TableCell sx={{ fontSize: '0.72rem', color: '#64748B', py: 1 }}>{t.type}</TableCell>
                  <TableCell sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#059669', py: 1 }}>${t.rent.toLocaleString()}</TableCell>
                  <TableCell sx={{ fontSize: '0.72rem', color: '#64748B', py: 1 }}>{t.leaseEnd}</TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: t.daysToExpiry <= 30 ? '#DC2626' : t.daysToExpiry <= 90 ? '#F59E0B' : '#059669' }}>
                      {t.daysToExpiry} days
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <Chip label={rc.label} size="small" sx={{ height: 18, fontSize: '0.58rem', fontWeight: 700, bgcolor: rc.bg, color: rc.color }} />
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <Chip label={pc.label} size="small" sx={{ height: 18, fontSize: '0.58rem', fontWeight: 700, bgcolor: pc.bg, color: pc.color }} />
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title={reminded[t.id] ? 'Reminder sent!' : 'Send reminder'}>
                        <IconButton size="small" onClick={() => sendReminder(t.id)} sx={{ color: reminded[t.id] ? '#059669' : '#2563EB', bgcolor: reminded[t.id] ? '#05966912' : '#2563EB12', width: 26, height: 26 }}>
                          <Email sx={{ fontSize: 13 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Offer renewal">
                        <IconButton size="small" onClick={() => onNavigate('ai-renewal')} sx={{ color: '#7C3AED', bgcolor: '#7C3AED12', width: 26, height: 26 }}>
                          <Celebration sx={{ fontSize: 13 }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
