import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Chip, IconButton, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { ArrowBack, Assessment, Download, Schedule, TrendingUp, Build, People, AttachMoney, Home } from '@mui/icons-material';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { revenueTrend, occupancyTrend, leaseExpirations, expenseBreakdown } from '../mockData';

const reports = [
  {
    id: 'revenue', title: 'Revenue Report', icon: AttachMoney, color: '#059669', bg: '#05966912',
    metric: '$284,750', label: 'This Month', change: '+5.1%', up: true,
    desc: 'Monthly revenue, collections, NOI, expense ratio',
    chartData: revenueTrend, chartType: 'line', dataKey: 'revenue',
  },
  {
    id: 'occupancy', title: 'Occupancy Report', icon: Home, color: '#2563EB', bg: '#2563EB12',
    metric: '88.5%', label: 'Current', change: '+2.3%', up: true,
    desc: 'Vacancy rates, move-in/out trends, unit turnover',
    chartData: occupancyTrend, chartType: 'bar', dataKey: 'occupied',
  },
  {
    id: 'lease', title: 'Lease Report', icon: Schedule, color: '#7C3AED', bg: '#7C3AED12',
    metric: '52', label: 'Active Leases', change: '8 expiring soon', up: false,
    desc: 'Lease expirations, renewals, terms summary',
    chartData: leaseExpirations, chartType: 'bar', dataKey: 'count',
  },
  {
    id: 'maintenance', title: 'Maintenance Report', icon: Build, color: '#F59E0B', bg: '#F59E0B12',
    metric: '8', label: 'Open Tickets', change: '-15% MoM', up: true,
    desc: 'Work orders, costs, resolution times, vendor performance',
    chartData: [{ cat: 'Urgent', v: 2 }, { cat: 'High', v: 1 }, { cat: 'Medium', v: 3 }, { cat: 'Low', v: 2 }], chartType: 'bar', dataKey: 'v',
  },
  {
    id: 'tenant', title: 'Tenant Report', icon: People, color: '#DC2626', bg: '#DC262612',
    metric: '72%', label: 'Renewal Rate', change: '+4%', up: true,
    desc: 'Demographics, satisfaction scores, NPS, retention',
    chartData: [{ m: 'Q3', r: 68 }, { m: 'Q4', r: 70 }, { m: 'Q1', r: 72 }], chartType: 'line', dataKey: 'r',
  },
  {
    id: 'marketing', title: 'Marketing Report', icon: TrendingUp, color: '#7C3AED', bg: '#7C3AED12',
    metric: '34.2%', label: 'Conversion', change: '+4.7%', up: true,
    desc: 'Lead sources, tour conversion, cost per lease',
    chartData: [{ s: 'Zillow', v: 30 }, { s: 'Website', v: 25 }, { s: 'Referral', v: 20 }, { s: 'Apts.com', v: 15 }, { s: 'Walk-in', v: 10 }], chartType: 'bar', dataKey: 'v',
  },
];

const COLORS = ['#2563EB', '#7C3AED', '#059669', '#F59E0B', '#DC2626'];

export default function ReportsPage({ onNavigate }) {
  const [dateRange, setDateRange] = useState('this-month');
  const [generated, setGenerated] = useState({});

  const generate = (id) => setGenerated(prev => ({ ...prev, [id]: true }));

  return (
    <Box sx={{ p: { xs: '16px', md: '20px 24px' }, maxWidth: 1440 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={() => onNavigate('home')} size="small" sx={{ color: '#64748B', bgcolor: '#F1F5F9' }}><ArrowBack sx={{ fontSize: 16 }} /></IconButton>
          <Box sx={{ p: '6px', borderRadius: '10px', bgcolor: '#2563EB12' }}><Assessment sx={{ fontSize: 20, color: '#2563EB' }} /></Box>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: '1.4rem', color: '#0F172A' }}>Reports & Analytics</Typography>
            <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>Pre-built business intelligence reports with export</Typography>
          </Box>
        </Box>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <Select value={dateRange} onChange={e => setDateRange(e.target.value)} sx={{ fontSize: '0.72rem', height: 34, borderRadius: '8px' }}>
            <MenuItem value="this-month" sx={{ fontSize: '0.72rem' }}>This Month</MenuItem>
            <MenuItem value="last-month" sx={{ fontSize: '0.72rem' }}>Last Month</MenuItem>
            <MenuItem value="q1-2026" sx={{ fontSize: '0.72rem' }}>Q1 2026</MenuItem>
            <MenuItem value="ytd" sx={{ fontSize: '0.72rem' }}>Year to Date</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={2}>
        {reports.map(r => {
          const Icon = r.icon;
          return (
            <Grid item xs={12} sm={6} md={4} key={r.id}>
              <Card sx={{ height: '100%', border: '1px solid #E2E8F0', boxShadow: 'none', borderRadius: '12px' }}>
                <CardContent sx={{ p: '16px !important' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <Box sx={{ p: '6px', borderRadius: '8px', bgcolor: r.bg }}>
                        <Icon sx={{ fontSize: 18, color: r.color }} />
                      </Box>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', color: '#0F172A' }}>{r.title}</Typography>
                    </Box>
                    <Chip label={r.change} size="small" sx={{ height: 18, fontSize: '0.58rem', fontWeight: 700, bgcolor: r.up ? '#05966912' : '#F59E0B12', color: r.up ? '#059669' : '#F59E0B' }} />
                  </Box>

                  <Box sx={{ mb: 1 }}>
                    <Typography sx={{ fontWeight: 800, fontSize: '1.3rem', color: r.color, lineHeight: 1 }}>{r.metric}</Typography>
                    <Typography sx={{ fontSize: '0.62rem', color: '#94A3B8' }}>{r.label}</Typography>
                  </Box>

                  <ResponsiveContainer width="100%" height={80}>
                    {r.chartType === 'line' ? (
                      <LineChart data={r.chartData}>
                        <Line type="monotone" dataKey={r.dataKey} stroke={r.color} strokeWidth={2} dot={false} />
                        <Tooltip wrapperStyle={{ fontSize: '0.65rem' }} />
                      </LineChart>
                    ) : (
                      <BarChart data={r.chartData} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
                        <Bar dataKey={r.dataKey} fill={r.color} radius={[2, 2, 0, 0]} />
                        <Tooltip wrapperStyle={{ fontSize: '0.65rem' }} />
                      </BarChart>
                    )}
                  </ResponsiveContainer>

                  <Typography sx={{ fontSize: '0.68rem', color: '#94A3B8', mt: 1, mb: 1.5, lineHeight: 1.4 }}>{r.desc}</Typography>

                  <Box sx={{ display: 'flex', gap: 0.75 }}>
                    <Button variant={generated[r.id] ? 'contained' : 'outlined'} size="small" onClick={() => generate(r.id)}
                      sx={{ flex: 1, fontSize: '0.65rem', height: 28, borderRadius: '7px',
                        bgcolor: generated[r.id] ? r.color : 'transparent',
                        color: generated[r.id] ? '#fff' : r.color,
                        borderColor: r.color,
                        '&:hover': { bgcolor: r.color, color: '#fff' },
                      }}>
                      {generated[r.id] ? 'Generated ✓' : 'Generate Report'}
                    </Button>
                    {generated[r.id] && (
                      <Button variant="outlined" size="small" startIcon={<Download sx={{ fontSize: '12px !important' }} />}
                        sx={{ fontSize: '0.65rem', height: 28, borderRadius: '7px', borderColor: '#E2E8F0', color: '#64748B', minWidth: 36, px: 1 }}>
                        CSV
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
