import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Chip, IconButton, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Alert, Tooltip } from '@mui/material';
import { ArrowBack, PriceChange, TrendingUp, CheckCircle, AutoFixHigh } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartTooltip, Legend, ResponsiveContainer } from 'recharts';
import { units } from '../mockData';

const initialSuggestions = units.map(u => ({
  ...u,
  suggested: u.status === 'vacant' && u.rent > u.marketRent
    ? Math.round(u.marketRent * 0.97)
    : u.rent < u.marketRent
    ? Math.round(u.marketRent * 1.01)
    : u.rent,
  applied: false,
}));

export default function DynamicPricingPage({ onNavigate }) {
  const [rows, setRows] = useState(initialSuggestions);

  const applySuggestion = (id) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, rent: r.suggested, applied: true } : r));
  };
  const applyAll = () => {
    setRows(prev => prev.map(r => r.applied ? r : { ...r, rent: r.suggested, applied: true }));
  };

  const totalCurrentRent = rows.reduce((s, r) => s + (r.status === 'occupied' || r.status === 'pending' ? r.rent : 0), 0);
  const totalSuggestedRent = rows.reduce((s, r) => s + (r.status === 'occupied' || r.status === 'pending' ? r.suggested : 0), 0);
  const uplift = totalSuggestedRent - totalCurrentRent;
  const annualUplift = uplift * 12;
  const appliedCount = rows.filter(r => r.applied).length;
  const oppCount = rows.filter(r => r.suggested !== r.rent && !r.applied).length;

  const chartData = rows.map(r => ({
    unit: `Unit ${r.unit}`,
    'Current Rent': r.rent,
    'AI Suggested': r.suggested,
    'Market Rent': r.marketRent,
  }));

  const getCellColor = (row) => {
    if (row.applied) return '#059669';
    if (row.suggested > row.rent) return '#059669';
    if (row.suggested < row.rent) return '#DC2626';
    return '#64748B';
  };

  const getStatusChip = (row) => {
    if (row.applied) return <Chip label="Applied" size="small" sx={{ bgcolor: '#05966918', color: '#059669', fontWeight: 700, fontSize: '0.58rem', height: 20 }} />;
    if (row.suggested > row.rent) return <Chip label="Opportunity" size="small" sx={{ bgcolor: '#05966918', color: '#059669', fontWeight: 700, fontSize: '0.58rem', height: 20 }} />;
    if (row.suggested < row.rent) return <Chip label="Overpriced" size="small" sx={{ bgcolor: '#DC262618', color: '#DC2626', fontWeight: 700, fontSize: '0.58rem', height: 20 }} />;
    return <Chip label="At Market" size="small" sx={{ bgcolor: '#64748B18', color: '#64748B', fontWeight: 700, fontSize: '0.58rem', height: 20 }} />;
  };

  return (
    <Box sx={{ p: { xs: '16px', md: '20px 24px' }, maxWidth: 1440 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <IconButton onClick={() => onNavigate('home')} size="small" sx={{ color: '#64748B', bgcolor: '#F1F5F9' }}><ArrowBack sx={{ fontSize: 16 }} /></IconButton>
        <Box sx={{ p: '6px', borderRadius: '10px', bgcolor: '#05966912' }}><PriceChange sx={{ fontSize: 20, color: '#059669' }} /></Box>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontWeight: 800, fontSize: '1.4rem', color: '#0F172A' }}>AI Dynamic Pricing Engine</Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>AI-suggested rent optimization based on market demand and vacancy</Typography>
        </Box>
        <Button variant="contained" size="small" startIcon={<AutoFixHigh sx={{ fontSize: '14px !important' }} />}
          onClick={applyAll}
          sx={{ fontSize: '0.72rem', height: 32, borderRadius: '8px', bgcolor: '#059669' }}>
          Apply All Suggestions
        </Button>
      </Box>

      <Alert severity="success" sx={{ mb: 2, borderRadius: '10px', fontSize: '0.78rem' }}
        icon={<TrendingUp fontSize="small" />}>
        <strong>+${annualUplift.toLocaleString()}/year from pricing optimization</strong> — {oppCount} units have revenue opportunities. {appliedCount} suggestions applied.
      </Alert>

      <Grid container spacing={1.75} sx={{ mb: 2.5 }}>
        {[
          { label: 'Current Monthly Rent', value: `$${totalCurrentRent.toLocaleString()}`, color: '#64748B' },
          { label: 'Optimized Monthly Rent', value: `$${totalSuggestedRent.toLocaleString()}`, color: '#059669' },
          { label: 'Monthly Uplift', value: `+$${uplift.toLocaleString()}`, color: '#059669' },
          { label: 'Annual Impact', value: `+$${annualUplift.toLocaleString()}`, color: '#7C3AED' },
        ].map(s => (
          <Grid item xs={6} md={3} key={s.label}>
            <Card><CardContent sx={{ p: '16px !important' }}>
              <Typography sx={{ fontSize: '0.6rem', color: '#94A3B8', fontWeight: 600, mb: 0.5 }}>{s.label}</Typography>
              <Typography sx={{ fontWeight: 800, fontSize: '1.4rem', color: s.color, lineHeight: 1 }}>{s.value}</Typography>
            </CardContent></Card>
          </Grid>
        ))}
      </Grid>

      <Card sx={{ mb: 2.5 }}>
        <CardContent sx={{ p: '16px !important' }}>
          <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#0F172A', mb: 2 }}>Rent Comparison by Unit</Typography>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="unit" tick={{ fontSize: 11, fill: '#64748B' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748B' }} tickFormatter={v => `$${v}`} />
              <RechartTooltip formatter={v => `$${v.toLocaleString()}`} />
              <Legend wrapperStyle={{ fontSize: '0.72rem' }} />
              <Bar dataKey="Current Rent" fill="#2563EB" radius={[3, 3, 0, 0]} />
              <Bar dataKey="AI Suggested" fill="#059669" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Market Rent" fill="#F59E0B" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: 'none', border: '1px solid #E2E8F0' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#F8FAFC' }}>
              {['Unit', 'Building', 'Type', 'Status', 'Current Rent', 'Market Rent', 'AI Suggested', 'Δ Monthly', 'Signal', 'Action'].map(h => (
                <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.65rem', color: '#64748B', py: 1.25, borderBottom: '1px solid #E2E8F0' }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => {
              const delta = row.suggested - row.rent;
              return (
                <TableRow key={row.id} sx={{ '&:hover': { bgcolor: '#F8FAFC' }, opacity: row.status === 'vacant' || row.status === 'maintenance' ? 0.7 : 1 }}>
                  <TableCell sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#0F172A', py: 1 }}>{row.unit}</TableCell>
                  <TableCell sx={{ fontSize: '0.72rem', color: '#64748B', py: 1 }}>{row.building}</TableCell>
                  <TableCell sx={{ fontSize: '0.72rem', color: '#64748B', py: 1 }}>{row.type}</TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <Chip label={row.status} size="small" sx={{ height: 18, fontSize: '0.58rem', fontWeight: 600,
                      bgcolor: row.status === 'occupied' ? '#05966912' : row.status === 'vacant' ? '#DC262612' : row.status === 'maintenance' ? '#F59E0B12' : '#2563EB12',
                      color: row.status === 'occupied' ? '#059669' : row.status === 'vacant' ? '#DC2626' : row.status === 'maintenance' ? '#F59E0B' : '#2563EB',
                    }} />
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.72rem', color: '#64748B', py: 1 }}>${row.rent.toLocaleString()}</TableCell>
                  <TableCell sx={{ fontSize: '0.72rem', color: '#64748B', py: 1 }}>${row.marketRent.toLocaleString()}</TableCell>
                  <TableCell sx={{ fontSize: '0.72rem', fontWeight: 700, color: getCellColor(row), py: 1 }}>${row.suggested.toLocaleString()}</TableCell>
                  <TableCell sx={{ fontSize: '0.72rem', fontWeight: 700, color: delta > 0 ? '#059669' : delta < 0 ? '#DC2626' : '#64748B', py: 1 }}>
                    {delta > 0 ? '+' : ''}{delta !== 0 ? `$${delta}` : '—'}
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>{getStatusChip(row)}</TableCell>
                  <TableCell sx={{ py: 1 }}>
                    {!row.applied && row.suggested !== row.rent ? (
                      <Button variant="outlined" size="small" onClick={() => applySuggestion(row.id)}
                        sx={{ fontSize: '0.6rem', height: 24, borderRadius: '6px', minWidth: 80, borderColor: '#059669', color: '#059669', '&:hover': { bgcolor: '#05966908' } }}>
                        Apply
                      </Button>
                    ) : row.applied ? (
                      <CheckCircle sx={{ fontSize: 18, color: '#059669' }} />
                    ) : (
                      <Typography sx={{ fontSize: '0.6rem', color: '#94A3B8' }}>No change</Typography>
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
