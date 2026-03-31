import React from 'react';
import { Box, Typography, Button, Card, CardContent, Grid, Chip, IconButton } from '@mui/material';
import { ArrowBack, AccountBalance, TrendingUp, TrendingDown, AttachMoney, Receipt, CreditCard, Add } from '@mui/icons-material';

const stats = [
  { label: 'Total Collected', value: '$284,750', change: '+5.1%', up: true, color: '#059669' },
  { label: 'Outstanding', value: '$12,400', change: '-8.2%', up: true, color: '#F59E0B' },
  { label: 'Expenses', value: '$86,200', change: '+2.1%', up: false, color: '#DC2626' },
  { label: 'Net Income', value: '$198,550', change: '+7.3%', up: true, color: '#2563EB' },
];

const features = [
  { title: 'Rent Collection', desc: 'Track payments, send reminders, manage ACH/card payments', stat: '$284.7K collected' },
  { title: 'Expense Tracking', desc: 'Log maintenance costs, vendor invoices, utilities, insurance', stat: '$86.2K this month' },
  { title: 'P&L Statements', desc: 'Auto-generated profit and loss by property, building, unit', stat: '3 reports ready' },
  { title: 'Late Payment Mgmt', desc: 'Overdue tracking, late fees, legal notice automation', stat: '4 overdue' },
  { title: 'Budget vs Actual', desc: 'Monthly/quarterly budget comparison with variance alerts', stat: '-2.3% variance' },
  { title: 'Tax Reports', desc: 'Generate 1099s, depreciation schedules, tax summaries', stat: 'FY2026 ready' },
];

export default function FinancialsPage({ onNavigate }) {
  return (
    <Box sx={{ p: { xs: '16px', md: '20px 24px' }, maxWidth: 1440 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <IconButton onClick={() => onNavigate('home')} size="small" sx={{ color: '#64748B', bgcolor: '#F1F5F9' }}><ArrowBack sx={{ fontSize: 16 }} /></IconButton>
        <Box sx={{ p: '6px', borderRadius: '10px', bgcolor: '#ECFDF512' }}><AccountBalance sx={{ fontSize: 20, color: '#059669' }} /></Box>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: '1.4rem', color: '#0F172A' }}>Financials</Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>Rent collected, expenses, P&L, late payments</Typography>
        </Box>
      </Box>

      <Grid container spacing={1.75} sx={{ mb: 2.5 }}>
        {stats.map(s => (
          <Grid item xs={6} md={3} key={s.label}>
            <Card><CardContent sx={{ p: '16px !important' }}>
              <Typography sx={{ fontSize: '0.6rem', color: '#94A3B8', fontWeight: 600, mb: 0.5 }}>{s.label}</Typography>
              <Typography sx={{ fontWeight: 800, fontSize: '1.4rem', color: '#0F172A', lineHeight: 1 }}>{s.value}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.35, mt: 0.5 }}>
                {s.up ? <TrendingUp sx={{ fontSize: 12, color: '#059669' }} /> : <TrendingDown sx={{ fontSize: 12, color: '#DC2626' }} />}
                <Typography sx={{ fontSize: '0.58rem', fontWeight: 700, color: s.up ? '#059669' : '#DC2626' }}>{s.change}</Typography>
              </Box>
            </CardContent></Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={1.75}>
        {features.map((f, i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <Card sx={{ height: '100%', cursor: 'pointer' }}><CardContent sx={{ p: '18px !important' }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#0F172A', mb: 0.5 }}>{f.title}</Typography>
              <Typography sx={{ fontSize: '0.72rem', color: '#64748B', lineHeight: 1.5, mb: 1.25 }}>{f.desc}</Typography>
              <Chip label={f.stat} size="small" sx={{ height: 20, fontSize: '0.58rem', fontWeight: 600, bgcolor: '#05966908', color: '#059669' }} />
            </CardContent></Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
