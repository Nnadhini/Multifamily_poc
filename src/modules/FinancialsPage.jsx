import React, { useState } from 'react';
import { Box, Typography, Button, Card, CardContent, Grid, Chip, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tabs, Tab } from '@mui/material';
import { ArrowBack, AccountBalance, TrendingUp, TrendingDown, CheckCircle, Warning, Schedule, Error } from '@mui/icons-material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { rentPayments, expenseBreakdown, revenueTrend } from '../mockData';

const stats = [
  { label: 'Total Collected', value: '$284,750', change: '+5.1%', up: true, color: '#059669' },
  { label: 'Outstanding', value: '$12,400', change: '-8.2%', up: true, color: '#F59E0B' },
  { label: 'Expenses', value: '$86,200', change: '+2.1%', up: false, color: '#DC2626' },
  { label: 'Net Income', value: '$198,550', change: '+7.3%', up: true, color: '#2563EB' },
];

const EXPENSE_COLORS = ['#2563EB', '#7C3AED', '#059669', '#F59E0B', '#DC2626', '#94A3B8', '#0F172A'];

const statusConfig = {
  paid: { label: 'Paid', color: '#059669', bg: '#05966912', icon: CheckCircle },
  partial: { label: 'Partial', color: '#F59E0B', bg: '#F59E0B12', icon: Warning },
  overdue: { label: 'Overdue', color: '#DC2626', bg: '#DC262612', icon: Error },
  upcoming: { label: 'Upcoming', color: '#2563EB', bg: '#2563EB12', icon: Schedule },
};

export default function FinancialsPage({ onNavigate }) {
  const [tab, setTab] = useState(0);
  const [payments, setPayments] = useState(rentPayments);

  const collectedCount = payments.filter(p => p.status === 'paid').length;
  const nonUpcoming = payments.filter(p => p.status !== 'upcoming');
  const collectionRate = nonUpcoming.length > 0 ? Math.round((collectedCount / nonUpcoming.length) * 100) : 0;

  const markPaid = (id) => {
    setPayments(prev => prev.map(p => p.id === id ? { ...p, status: 'paid', amountPaid: p.amountDue, paidDate: new Date().toISOString().split('T')[0] } : p));
  };

  return (
    <Box sx={{ p: { xs: '16px', md: '20px 24px' }, maxWidth: 1440 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <IconButton onClick={() => onNavigate('home')} size="small" sx={{ color: '#64748B', bgcolor: '#F1F5F9' }}><ArrowBack sx={{ fontSize: 16 }} /></IconButton>
        <Box sx={{ p: '6px', borderRadius: '10px', bgcolor: '#ECFDF512' }}><AccountBalance sx={{ fontSize: 20, color: '#059669' }} /></Box>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: '1.4rem', color: '#0F172A' }}>Financials</Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>Rent collected, expenses, P&L, late payments • Collection Rate: <strong style={{ color: '#059669' }}>{collectionRate}%</strong></Typography>
        </Box>
      </Box>

      <Grid container spacing={1.75} sx={{ mb: 2.5 }}>
        {stats.map(s => (
          <Grid item xs={6} md={3} key={s.label}>
            <Card><CardContent sx={{ p: '16px !important' }}>
              <Typography sx={{ fontSize: '0.6rem', color: '#94A3B8', fontWeight: 600, mb: 0.5 }}>{s.label}</Typography>
              <Typography sx={{ fontWeight: 800, fontSize: '1.4rem', color: s.color, lineHeight: 1 }}>{s.value}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.35, mt: 0.5 }}>
                {s.up ? <TrendingUp sx={{ fontSize: 12, color: '#059669' }} /> : <TrendingDown sx={{ fontSize: 12, color: '#DC2626' }} />}
                <Typography sx={{ fontSize: '0.58rem', fontWeight: 700, color: s.up ? '#059669' : '#DC2626' }}>{s.change}</Typography>
              </Box>
            </CardContent></Card>
          </Grid>
        ))}
      </Grid>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2, '& .MuiTab-root': { fontSize: '0.72rem', fontWeight: 600, minHeight: 36 } }}>
        <Tab label="Rent Collection" />
        <Tab label="Expense Breakdown" />
        <Tab label="Revenue Trend" />
      </Tabs>

      {tab === 0 && (
        <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: 'none', border: '1px solid #E2E8F0' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                {['Unit', 'Tenant', 'Amount Due', 'Amount Paid', 'Status', 'Due Date', 'Paid Date', 'Method', 'Late Fee', 'Action'].map(h => (
                  <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.65rem', color: '#64748B', py: 1.25 }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map(p => {
                const cfg = statusConfig[p.status];
                const Icon = cfg.icon;
                return (
                  <TableRow key={p.id} sx={{ '&:hover': { bgcolor: '#F8FAFC' } }}>
                    <TableCell sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#0F172A', py: 1 }}>{p.unit}</TableCell>
                    <TableCell sx={{ fontSize: '0.72rem', color: '#64748B', py: 1 }}>{p.tenant}</TableCell>
                    <TableCell sx={{ fontSize: '0.72rem', color: '#0F172A', py: 1 }}>${p.amountDue.toLocaleString()}</TableCell>
                    <TableCell sx={{ fontSize: '0.72rem', fontWeight: 700, color: p.amountPaid === p.amountDue ? '#059669' : p.amountPaid > 0 ? '#F59E0B' : '#DC2626', py: 1 }}>
                      ${p.amountPaid.toLocaleString()}
                    </TableCell>
                    <TableCell sx={{ py: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Icon sx={{ fontSize: 14, color: cfg.color }} />
                        <Chip label={cfg.label} size="small" sx={{ height: 18, fontSize: '0.58rem', fontWeight: 700, bgcolor: cfg.bg, color: cfg.color }} />
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.72rem', color: '#64748B', py: 1 }}>{p.dueDate}</TableCell>
                    <TableCell sx={{ fontSize: '0.72rem', color: '#64748B', py: 1 }}>{p.paidDate || '—'}</TableCell>
                    <TableCell sx={{ fontSize: '0.72rem', color: '#64748B', py: 1 }}>{p.method || '—'}</TableCell>
                    <TableCell sx={{ fontSize: '0.72rem', fontWeight: 700, color: p.lateFee > 0 ? '#DC2626' : '#94A3B8', py: 1 }}>
                      {p.lateFee > 0 ? `$${p.lateFee}` : '—'}
                    </TableCell>
                    <TableCell sx={{ py: 1 }}>
                      {(p.status === 'overdue' || p.status === 'partial') && (
                        <Button variant="outlined" size="small" onClick={() => markPaid(p.id)}
                          sx={{ fontSize: '0.6rem', height: 24, borderRadius: '6px', minWidth: 70, borderColor: '#059669', color: '#059669' }}>
                          Mark Paid
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {tab === 1 && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card><CardContent sx={{ p: '16px !important' }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#0F172A', mb: 2 }}>Expense Breakdown</Typography>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={expenseBreakdown} dataKey="amount" nameKey="category" cx="50%" cy="50%" outerRadius={90} label={({ category, pct }) => `${category} ${pct}%`} labelLine={false}>
                    {expenseBreakdown.map((_, i) => <Cell key={i} fill={EXPENSE_COLORS[i % EXPENSE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={v => `$${v.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent></Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card><CardContent sx={{ p: '16px !important' }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#0F172A', mb: 2 }}>Expense by Category</Typography>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={expenseBreakdown} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                  <YAxis type="category" dataKey="category" tick={{ fontSize: 11, fill: '#64748B' }} width={80} />
                  <Tooltip formatter={v => `$${v.toLocaleString()}`} />
                  <Bar dataKey="amount" fill="#2563EB" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent></Card>
          </Grid>
        </Grid>
      )}

      {tab === 2 && (
        <Card><CardContent sx={{ p: '16px !important' }}>
          <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#0F172A', mb: 2 }}>Revenue vs Projected (Last 6 Months)</Typography>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={revenueTrend} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748B' }} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={v => `$${v.toLocaleString()}`} />
              <Legend wrapperStyle={{ fontSize: '0.72rem' }} />
              <Line type="monotone" dataKey="revenue" stroke="#059669" strokeWidth={2.5} dot={{ r: 4 }} name="Actual Revenue" />
              <Line type="monotone" dataKey="projected" stroke="#94A3B8" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} name="Projected" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent></Card>
      )}
    </Box>
  );
}
