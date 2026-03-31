import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Chip, IconButton, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, LinearProgress, Alert } from '@mui/material';
import { ArrowBack, Assignment, Send, CheckCircle, Warning } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { units, leaseExpirations } from '../mockData';

const activeLeases = units
  .filter(u => u.leaseEnd && u.tenant)
  .map(u => {
    const daysLeft = Math.round((new Date(u.leaseEnd) - new Date('2026-03-31')) / (1000 * 60 * 60 * 24));
    const renewalStatus = daysLeft <= 30 ? 'urgent' : daysLeft <= 90 ? 'pending' : 'stable';
    const renewalSent = false;
    return { ...u, daysLeft, renewalStatus, renewalSent, deposit: u.rent * 2, leaseStart: '2025-' + u.leaseEnd.slice(5) };
  });

const statusConfig = {
  urgent: { color: '#DC2626', bg: '#DC262612', label: 'Urgent' },
  pending: { color: '#F59E0B', bg: '#F59E0B12', label: 'Action Needed' },
  stable: { color: '#059669', bg: '#05966912', label: 'Stable' },
};

export default function LeaseManagementPage({ onNavigate }) {
  const [leases, setLeases] = useState(activeLeases);
  const [sent, setSent] = useState({});

  const sendOffer = (id) => setSent(prev => ({ ...prev, [id]: true }));

  const expiring90 = leases.filter(l => l.daysLeft <= 90).length;
  const renewalRate = 72;
  const avgRent = Math.round(leases.reduce((s, l) => s + l.rent, 0) / leases.length);
  const totalDeposit = leases.reduce((s, l) => s + l.deposit, 0);

  const chartColors = leaseExpirations.map(m => m.risk === 'high' ? '#DC2626' : m.risk === 'medium' ? '#F59E0B' : '#059669');

  return (
    <Box sx={{ p: { xs: '16px', md: '20px 24px' }, maxWidth: 1440 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <IconButton onClick={() => onNavigate('home')} size="small" sx={{ color: '#64748B', bgcolor: '#F1F5F9' }}><ArrowBack sx={{ fontSize: 16 }} /></IconButton>
        <Box sx={{ p: '6px', borderRadius: '10px', bgcolor: '#05966912' }}><Assignment sx={{ fontSize: 20, color: '#059669' }} /></Box>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: '1.4rem', color: '#0F172A' }}>Lease Management</Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>Active leases, expiry timeline, renewal pipeline</Typography>
        </Box>
      </Box>

      {expiring90 > 0 && (
        <Alert severity="warning" sx={{ mb: 2, borderRadius: '10px', fontSize: '0.78rem' }}>
          <strong>{expiring90} leases</strong> expiring within 90 days — act now to avoid turnover cost of <strong>${(expiring90 * 5200).toLocaleString()}</strong>
        </Alert>
      )}

      <Grid container spacing={1.75} sx={{ mb: 2.5 }}>
        {[
          { label: 'Active Leases', value: leases.length, color: '#0F172A' },
          { label: 'Expiring < 90 Days', value: expiring90, color: '#DC2626' },
          { label: 'Renewal Rate', value: `${renewalRate}%`, color: '#059669' },
          { label: 'Avg Monthly Rent', value: `$${avgRent.toLocaleString()}`, color: '#2563EB' },
          { label: 'Total Deposits Held', value: `$${totalDeposit.toLocaleString()}`, color: '#7C3AED' },
        ].map(s => (
          <Grid item xs={6} md key={s.label}>
            <Card><CardContent sx={{ p: '14px !important' }}>
              <Typography sx={{ fontSize: '0.6rem', color: '#94A3B8', fontWeight: 600, mb: 0.5 }}>{s.label}</Typography>
              <Typography sx={{ fontWeight: 800, fontSize: '1.3rem', color: s.color, lineHeight: 1 }}>{s.value}</Typography>
            </CardContent></Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2} sx={{ mb: 2.5 }}>
        <Grid item xs={12} md={5}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: '16px !important' }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#0F172A', mb: 2 }}>Lease Expirations by Month</Typography>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={leaseExpirations} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {leaseExpirations.map((_, i) => <Cell key={i} fill={chartColors[i]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                {[{ label: 'High', color: '#DC2626' }, { label: 'Medium', color: '#F59E0B' }, { label: 'Low', color: '#059669' }].map(l => (
                  <Box key={l.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '2px', bgcolor: l.color }} />
                    <Typography sx={{ fontSize: '0.62rem', color: '#64748B' }}>{l.label} Risk</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={7}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: '16px !important' }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#0F172A', mb: 1 }}>Renewal Rate Pipeline</Typography>
              {[
                { label: 'Lease Renewals Sent', value: 8, total: leases.length, color: '#2563EB' },
                { label: 'Renewals Accepted', value: 5, total: leases.length, color: '#059669' },
                { label: 'Renewals Pending', value: 3, total: leases.length, color: '#F59E0B' },
                { label: 'Non-Renewals', value: 2, total: leases.length, color: '#DC2626' },
              ].map(item => (
                <Box key={item.label} sx={{ mb: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography sx={{ fontSize: '0.72rem', color: '#64748B' }}>{item.label}</Typography>
                    <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: item.color }}>{item.value}/{item.total}</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={(item.value / item.total) * 100}
                    sx={{ height: 6, borderRadius: '3px', bgcolor: `${item.color}18`, '& .MuiLinearProgress-bar': { bgcolor: item.color, borderRadius: '3px' } }} />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: 'none', border: '1px solid #E2E8F0' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#F8FAFC' }}>
              {['Unit', 'Tenant', 'Type', 'Monthly Rent', 'Deposit', 'Lease End', 'Days Left', 'Status', 'Action'].map(h => (
                <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.65rem', color: '#64748B', py: 1.25 }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {leases.sort((a, b) => a.daysLeft - b.daysLeft).map(l => {
              const cfg = statusConfig[l.renewalStatus];
              return (
                <TableRow key={l.id} sx={{ '&:hover': { bgcolor: '#F8FAFC' } }}>
                  <TableCell sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#0F172A', py: 1 }}>{l.unit}</TableCell>
                  <TableCell sx={{ fontSize: '0.72rem', color: '#64748B', py: 1 }}>{l.tenant}</TableCell>
                  <TableCell sx={{ fontSize: '0.72rem', color: '#64748B', py: 1 }}>{l.type}</TableCell>
                  <TableCell sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#059669', py: 1 }}>${l.rent.toLocaleString()}</TableCell>
                  <TableCell sx={{ fontSize: '0.72rem', color: '#64748B', py: 1 }}>${l.deposit.toLocaleString()}</TableCell>
                  <TableCell sx={{ fontSize: '0.72rem', color: '#64748B', py: 1 }}>{l.leaseEnd}</TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: l.daysLeft <= 30 ? '#DC2626' : l.daysLeft <= 90 ? '#F59E0B' : '#059669' }}>
                      {l.daysLeft}d
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <Chip label={cfg.label} size="small" sx={{ height: 18, fontSize: '0.58rem', fontWeight: 700, bgcolor: cfg.bg, color: cfg.color }} />
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>
                    {sent[l.id] ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CheckCircle sx={{ fontSize: 14, color: '#059669' }} />
                        <Typography sx={{ fontSize: '0.62rem', color: '#059669' }}>Sent</Typography>
                      </Box>
                    ) : (
                      <Button variant="outlined" size="small" startIcon={<Send sx={{ fontSize: '11px !important' }} />}
                        onClick={() => sendOffer(l.id)}
                        sx={{ fontSize: '0.6rem', height: 24, borderRadius: '6px', borderColor: '#2563EB', color: '#2563EB', minWidth: 80 }}>
                        Send Offer
                      </Button>
                    )}
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
