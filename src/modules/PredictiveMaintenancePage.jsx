import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Chip, IconButton, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, LinearProgress, Alert } from '@mui/material';
import { ArrowBack, Engineering, Warning, CheckCircle, Error, TrendingDown } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { equipmentHealth } from '../mockData';

const statusConfig = {
  good: { color: '#059669', bg: '#05966912', label: 'Good' },
  warning: { color: '#F59E0B', bg: '#F59E0B12', label: 'Warning', icon: Warning },
  critical: { color: '#DC2626', bg: '#DC262612', label: 'Critical', icon: Error },
};

const savingsData = equipmentHealth.map(e => ({
  name: e.name.slice(0, 10),
  'Reactive Cost': e.replacementCost,
  'Preventive Cost': e.preventiveCost,
  savings: e.replacementCost - e.preventiveCost,
}));

export default function PredictiveMaintenancePage({ onNavigate }) {
  const [scheduled, setScheduled] = useState({});

  const schedule = (id) => setScheduled(prev => ({ ...prev, [id]: true }));

  const critical = equipmentHealth.filter(e => e.status === 'critical').length;
  const warning = equipmentHealth.filter(e => e.status === 'warning').length;
  const totalSavings = equipmentHealth.reduce((s, e) => s + e.replacementCost - e.preventiveCost, 0);
  const avgCondition = Math.round(equipmentHealth.reduce((s, e) => s + e.condition, 0) / equipmentHealth.length);

  return (
    <Box sx={{ p: { xs: '16px', md: '20px 24px' }, maxWidth: 1440 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <IconButton onClick={() => onNavigate('home')} size="small" sx={{ color: '#64748B', bgcolor: '#F1F5F9' }}><ArrowBack sx={{ fontSize: 16 }} /></IconButton>
        <Box sx={{ p: '6px', borderRadius: '10px', bgcolor: '#F59E0B12' }}><Engineering sx={{ fontSize: 20, color: '#F59E0B' }} /></Box>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: '1.4rem', color: '#0F172A' }}>Predictive Maintenance</Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>AI equipment health monitoring — save 20% on repair costs</Typography>
        </Box>
      </Box>

      <Alert severity="error" sx={{ mb: 2, borderRadius: '10px', fontSize: '0.78rem' }}>
        <strong>{critical} equipment items critical</strong> with failure probability 78-85%. Scheduling preventive maintenance now could save <strong>${totalSavings.toLocaleString()}</strong> vs reactive replacement.
      </Alert>

      <Grid container spacing={1.75} sx={{ mb: 2.5 }}>
        {[
          { label: 'Monitored Equipment', value: equipmentHealth.length, color: '#0F172A' },
          { label: 'Critical Status', value: critical, color: '#DC2626' },
          { label: 'Warning Status', value: warning, color: '#F59E0B' },
          { label: 'Avg Condition', value: `${avgCondition}%`, color: avgCondition >= 70 ? '#059669' : avgCondition >= 50 ? '#F59E0B' : '#DC2626' },
          { label: 'Preventive Savings', value: `$${totalSavings.toLocaleString()}`, color: '#059669' },
        ].map(s => (
          <Grid item xs={6} md key={s.label}>
            <Card><CardContent sx={{ p: '14px !important' }}>
              <Typography sx={{ fontSize: '0.6rem', color: '#94A3B8', fontWeight: 600, mb: 0.5 }}>{s.label}</Typography>
              <Typography sx={{ fontWeight: 800, fontSize: '1.3rem', color: s.color, lineHeight: 1 }}>{s.value}</Typography>
            </CardContent></Card>
          </Grid>
        ))}
      </Grid>

      <Card sx={{ mb: 2.5 }}>
        <CardContent sx={{ p: '16px !important' }}>
          <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#0F172A', mb: 2 }}>Reactive vs Preventive Cost Comparison</Typography>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={savingsData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748B' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748B' }} tickFormatter={v => `$${v}`} />
              <Tooltip formatter={v => `$${v.toLocaleString()}`} />
              <Legend wrapperStyle={{ fontSize: '0.72rem' }} />
              <Bar dataKey="Reactive Cost" fill="#DC2626" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Preventive Cost" fill="#059669" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: 'none', border: '1px solid #E2E8F0' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#F8FAFC' }}>
              {['Equipment', 'Building', 'Type', 'Age', 'Condition', 'Failure Prob.', 'Est. Fail Date', 'Status', 'Preventive Cost', 'Replacement Cost', 'Savings', 'Action'].map(h => (
                <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.65rem', color: '#64748B', py: 1.25 }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {equipmentHealth.sort((a, b) => b.failureProbability - a.failureProbability).map(e => {
              const sc = statusConfig[e.status];
              return (
                <TableRow key={e.id} sx={{ '&:hover': { bgcolor: '#F8FAFC' } }}>
                  <TableCell sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#0F172A', py: 1 }}>{e.name}</TableCell>
                  <TableCell sx={{ fontSize: '0.68rem', color: '#64748B', py: 1 }}>{e.building}</TableCell>
                  <TableCell sx={{ fontSize: '0.68rem', color: '#64748B', py: 1 }}>{e.type}</TableCell>
                  <TableCell sx={{ fontSize: '0.72rem', color: '#64748B', py: 1 }}>{e.age}yr</TableCell>
                  <TableCell sx={{ py: 1, minWidth: 100 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <LinearProgress variant="determinate" value={e.condition}
                        sx={{ flex: 1, height: 6, borderRadius: '3px',
                          bgcolor: `${e.condition >= 70 ? '#059669' : e.condition >= 50 ? '#F59E0B' : '#DC2626'}18`,
                          '& .MuiLinearProgress-bar': { bgcolor: e.condition >= 70 ? '#059669' : e.condition >= 50 ? '#F59E0B' : '#DC2626', borderRadius: '3px' }
                        }} />
                      <Typography sx={{ fontSize: '0.62rem', fontWeight: 700, minWidth: 28, color: e.condition >= 70 ? '#059669' : e.condition >= 50 ? '#F59E0B' : '#DC2626' }}>{e.condition}%</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, color: e.failureProbability >= 70 ? '#DC2626' : e.failureProbability >= 40 ? '#F59E0B' : '#059669' }}>
                      {e.failureProbability}%
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.68rem', color: '#64748B', py: 1 }}>{e.estimatedFailDate}</TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <Chip label={sc.label} size="small" sx={{ height: 18, fontSize: '0.58rem', fontWeight: 700, bgcolor: sc.bg, color: sc.color }} />
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#059669', py: 1 }}>${e.preventiveCost}</TableCell>
                  <TableCell sx={{ fontSize: '0.72rem', color: '#DC2626', py: 1 }}>${e.replacementCost.toLocaleString()}</TableCell>
                  <TableCell sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#059669', py: 1 }}>
                    ${(e.replacementCost - e.preventiveCost).toLocaleString()}
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>
                    {scheduled[e.id] ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CheckCircle sx={{ fontSize: 14, color: '#059669' }} />
                        <Typography sx={{ fontSize: '0.62rem', color: '#059669' }}>Scheduled</Typography>
                      </Box>
                    ) : (
                      <Button variant="outlined" size="small" onClick={() => schedule(e.id)}
                        sx={{ fontSize: '0.6rem', height: 24, borderRadius: '6px',
                          borderColor: e.status === 'critical' ? '#DC2626' : '#F59E0B',
                          color: e.status === 'critical' ? '#DC2626' : '#F59E0B',
                          minWidth: 80,
                        }}>
                        Schedule
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
