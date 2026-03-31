import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Chip, IconButton, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Alert, LinearProgress, Slider } from '@mui/material';
import { ArrowBack, Psychology, TrendingUp, TrendingDown, Warning, CheckCircle, AttachMoney } from '@mui/icons-material';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { revenueTrend, expenseBreakdown, revenueOpportunities } from '../mockData';

const recommendations = [
  { id: 1, category: 'Pricing', title: '3 units priced below market', impact: '+$34,080/yr', impactValue: 34080, priority: 'high', action: 'Adjust Pricing', color: '#059669', applied: false },
  { id: 2, category: 'Vacancy', title: 'Unit 302 vacant 22 days (avg 18)', impact: '+$1,760 savings', impactValue: 1760, priority: 'high', action: 'Reduce Price 4%', color: '#DC2626', applied: false },
  { id: 3, category: 'Expense', title: 'Maintenance costs 8% above budget', impact: '-$2,400 savings', impactValue: 2400, priority: 'medium', action: 'Review Vendors', color: '#F59E0B', applied: false },
  { id: 4, category: 'Revenue', title: 'Add pet fees for 3 units', impact: '+$3,780/yr', impactValue: 3780, priority: 'medium', action: 'Enable Pet Rent', color: '#7C3AED', applied: false },
  { id: 5, category: 'Expense', title: 'Utility costs trending up 12%', impact: '-$4,200/yr potential', impactValue: 4200, priority: 'medium', action: 'Energy Audit', color: '#F59E0B', applied: false },
];

const anomalies = [
  { month: 'Jan', item: 'Plumbing Repairs', expected: 800, actual: 2400, variance: +1600, severity: 'high' },
  { month: 'Feb', item: 'Landscaping', expected: 600, actual: 350, variance: -250, severity: 'low' },
  { month: 'Mar', item: 'Pest Control', expected: 400, actual: 650, variance: +250, severity: 'medium' },
];

const forecastData = [
  { month: 'Apr', revenue: 287000, expenses: 88000, noi: 199000 },
  { month: 'May', revenue: 282000, expenses: 91000, noi: 191000 },
  { month: 'Jun', revenue: 279000, expenses: 95000, noi: 184000 },
  { month: 'Jul', revenue: 291000, expenses: 87000, noi: 204000 },
  { month: 'Aug', revenue: 295000, expenses: 86000, noi: 209000 },
  { month: 'Sep', revenue: 298000, expenses: 85000, noi: 213000 },
];

export default function AiFinanceInsightsPage({ onNavigate }) {
  const [recs, setRecs] = useState(recommendations);
  const [capex, setCapex] = useState(50000);

  const applyRec = (id) => setRecs(prev => prev.map(r => r.id === id ? { ...r, applied: true } : r));

  const totalOpportunity = recs.filter(r => !r.applied).reduce((s, r) => s + r.impactValue, 0);
  const highPriority = recs.filter(r => r.priority === 'high' && !r.applied).length;

  const roiReturn = Math.round(capex * 1.18);

  return (
    <Box sx={{ p: { xs: '16px', md: '20px 24px' }, maxWidth: 1440 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <IconButton onClick={() => onNavigate('home')} size="small" sx={{ color: '#64748B', bgcolor: '#F1F5F9' }}><ArrowBack sx={{ fontSize: 16 }} /></IconButton>
        <Box sx={{ p: '6px', borderRadius: '10px', bgcolor: '#05966912' }}><Psychology sx={{ fontSize: 20, color: '#059669' }} /></Box>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: '1.4rem', color: '#0F172A' }}>AI Finance Insights</Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>Revenue optimization, anomaly detection, budget forecasting</Typography>
        </Box>
      </Box>

      <Alert severity="success" sx={{ mb: 2, borderRadius: '10px', fontSize: '0.78rem' }} icon={<AttachMoney fontSize="small" />}>
        AI has identified <strong>${totalOpportunity.toLocaleString()}</strong> in revenue opportunities and cost savings. <strong>{highPriority} high-priority actions</strong> need attention.
      </Alert>

      <Grid container spacing={1.75} sx={{ mb: 2.5 }}>
        {[
          { label: 'Total Opportunity', value: `$${totalOpportunity.toLocaleString()}`, color: '#059669' },
          { label: 'High Priority', value: highPriority, color: '#DC2626' },
          { label: 'Applied Recs', value: recs.filter(r => r.applied).length, color: '#2563EB' },
          { label: 'Annual NOI Forecast', value: '$2.41M', color: '#7C3AED' },
          { label: 'Expense Ratio', value: '30.3%', color: '#F59E0B' },
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
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent sx={{ p: '16px !important' }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#0F172A', mb: 2 }}>6-Month Financial Forecast</Typography>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={forecastData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                  <Tooltip formatter={v => `$${v.toLocaleString()}`} />
                  <Legend wrapperStyle={{ fontSize: '0.72rem' }} />
                  <Line type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={2} dot={{ r: 3 }} name="Revenue" />
                  <Line type="monotone" dataKey="expenses" stroke="#DC2626" strokeWidth={2} dot={{ r: 3 }} name="Expenses" />
                  <Line type="monotone" dataKey="noi" stroke="#059669" strokeWidth={2.5} dot={{ r: 4 }} name="NOI" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: '16px !important' }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#0F172A', mb: 1.5 }}>ROI Calculator</Typography>
              <Typography sx={{ fontSize: '0.72rem', color: '#64748B', mb: 0.5 }}>Capital Investment</Typography>
              <Slider value={capex} min={10000} max={200000} step={5000}
                onChange={(_, v) => setCapex(v)} sx={{ color: '#7C3AED', mb: 1 }} />
              <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#7C3AED', mb: 2 }}>
                ${capex.toLocaleString()}
              </Typography>
              <Box sx={{ bgcolor: '#F8FAFC', borderRadius: '10px', p: 1.5 }}>
                {[
                  { label: 'Investment', value: `$${capex.toLocaleString()}`, color: '#0F172A' },
                  { label: 'Projected Return (18%)', value: `$${roiReturn.toLocaleString()}`, color: '#059669' },
                  { label: 'Net Gain', value: `$${(roiReturn - capex).toLocaleString()}`, color: '#059669' },
                  { label: 'Payback Period', value: `${Math.round(capex / 18000)} months`, color: '#2563EB' },
                ].map(m => (
                  <Box key={m.label} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                    <Typography sx={{ fontSize: '0.68rem', color: '#64748B' }}>{m.label}</Typography>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: m.color }}>{m.value}</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 2.5 }}>
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent sx={{ p: '16px !important' }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#0F172A', mb: 1.5 }}>AI Recommendations</Typography>
              {recs.map(r => (
                <Box key={r.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1, borderBottom: '1px solid #F1F5F9', opacity: r.applied ? 0.6 : 1 }}>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.25 }}>
                      <Chip label={r.category} size="small" sx={{ height: 16, fontSize: '0.55rem', fontWeight: 700, bgcolor: `${r.color}12`, color: r.color }} />
                      <Chip label={r.priority} size="small" sx={{ height: 16, fontSize: '0.55rem', fontWeight: 600, bgcolor: r.priority === 'high' ? '#DC262612' : '#F59E0B12', color: r.priority === 'high' ? '#DC2626' : '#F59E0B' }} />
                    </Box>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#0F172A' }}>{r.title}</Typography>
                    <Typography sx={{ fontSize: '0.68rem', color: '#059669', fontWeight: 700 }}>{r.impact}</Typography>
                  </Box>
                  {r.applied ? (
                    <CheckCircle sx={{ fontSize: 20, color: '#059669', ml: 1.5 }} />
                  ) : (
                    <Button variant="outlined" size="small" onClick={() => applyRec(r.id)}
                      sx={{ ml: 1.5, fontSize: '0.6rem', height: 26, borderRadius: '6px', borderColor: r.color, color: r.color, minWidth: 90, flexShrink: 0 }}>
                      {r.action}
                    </Button>
                  )}
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={5}>
          <Card>
            <CardContent sx={{ p: '16px !important' }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#0F172A', mb: 1.5 }}>Expense Anomaly Detection</Typography>
              {anomalies.map((a, i) => (
                <Box key={i} sx={{ mb: 1.5, p: 1.25, borderRadius: '8px', bgcolor: a.severity === 'high' ? '#FEF2F2' : a.severity === 'medium' ? '#FFFBEB' : '#F0FDF4', border: `1px solid ${a.severity === 'high' ? '#FECACA' : a.severity === 'medium' ? '#FDE68A' : '#BBF7D0'}` }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#0F172A' }}>{a.item}</Typography>
                    <Chip label={a.month} size="small" sx={{ height: 16, fontSize: '0.55rem', bgcolor: '#F1F5F9', color: '#64748B' }} />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box>
                      <Typography sx={{ fontSize: '0.6rem', color: '#94A3B8' }}>Expected</Typography>
                      <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B' }}>${a.expected}</Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: '0.6rem', color: '#94A3B8' }}>Actual</Typography>
                      <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: a.variance > 0 ? '#DC2626' : '#059669' }}>${a.actual}</Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: '0.6rem', color: '#94A3B8' }}>Variance</Typography>
                      <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, color: a.variance > 0 ? '#DC2626' : '#059669' }}>
                        {a.variance > 0 ? '+' : ''}{a.variance > 0 ? `$${a.variance}` : `-$${Math.abs(a.variance)}`}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
