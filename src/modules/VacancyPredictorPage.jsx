import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Chip, IconButton, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, LinearProgress, Alert } from '@mui/material';
import { ArrowBack, TrendingUp, Warning, Psychology } from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { occupancyTrend, predictedOccupancy, atRiskUnits } from '../mockData';

const combinedData = [
  ...occupancyTrend.map(d => ({ month: d.month, actual: d.occupied, predicted: null, lower: null, upper: null })),
  ...predictedOccupancy.map(d => ({ month: d.month, actual: d.actual, predicted: d.predicted, lower: d.lower, upper: d.upper })),
];

const riskConfig = {
  high: { color: '#DC2626', bg: '#DC262612', label: 'High Risk' },
  medium: { color: '#F59E0B', bg: '#F59E0B12', label: 'Medium' },
  low: { color: '#059669', bg: '#05966912', label: 'Low Risk' },
};

const getRisk = (prob) => prob >= 60 ? 'high' : prob >= 35 ? 'medium' : 'low';

export default function VacancyPredictorPage({ onNavigate }) {
  const [actions, setActions] = useState({});

  const takeAction = (unit) => setActions(prev => ({ ...prev, [unit]: true }));

  const totalRisk = atRiskUnits.filter(u => u.moveOutProbability >= 60).length;
  const potentialLoss = atRiskUnits.reduce((s, u) => s + u.potentialLoss * (u.moveOutProbability / 100), 0);
  const avgPredOccupancy = predictedOccupancy.reduce((s, d) => s + d.predicted, 0) / predictedOccupancy.length;

  return (
    <Box sx={{ p: { xs: '16px', md: '20px 24px' }, maxWidth: 1440 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <IconButton onClick={() => onNavigate('home')} size="small" sx={{ color: '#64748B', bgcolor: '#F1F5F9' }}><ArrowBack sx={{ fontSize: 16 }} /></IconButton>
        <Box sx={{ p: '6px', borderRadius: '10px', bgcolor: '#2563EB12' }}><TrendingUp sx={{ fontSize: 20, color: '#2563EB' }} /></Box>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: '1.4rem', color: '#0F172A' }}>AI Vacancy Predictor</Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>ML-powered move-out forecasting with 85% accuracy</Typography>
        </Box>
      </Box>

      <Alert severity="warning" sx={{ mb: 2, borderRadius: '10px', fontSize: '0.78rem' }} icon={<Warning fontSize="small" />}>
        <strong>{totalRisk} high-risk tenants</strong> detected. Estimated vacancy revenue impact: <strong>${Math.round(potentialLoss).toLocaleString()}/month</strong> if not addressed.
      </Alert>

      <Grid container spacing={1.75} sx={{ mb: 2.5 }}>
        {[
          { label: 'Current Occupancy', value: '88.5%', color: '#059669' },
          { label: 'Predicted (4-mo avg)', value: `${avgPredOccupancy.toFixed(1)}%`, color: '#2563EB' },
          { label: 'High-Risk Units', value: totalRisk, color: '#DC2626' },
          { label: 'Predicted Revenue Loss', value: `-$${Math.round(potentialLoss).toLocaleString()}/mo`, color: '#F59E0B' },
          { label: 'Model Confidence', value: '85%', color: '#7C3AED' },
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
          <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#0F172A', mb: 0.5 }}>Occupancy Forecast — Actual + AI Prediction (with confidence band)</Typography>
          <Typography sx={{ fontSize: '0.68rem', color: '#94A3B8', mb: 2 }}>Dashed line = AI prediction. Shaded area = confidence band.</Typography>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={combinedData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} />
              <YAxis domain={[75, 100]} tick={{ fontSize: 11, fill: '#64748B' }} tickFormatter={v => `${v}%`} />
              <Tooltip formatter={(v, n) => v != null ? [`${v}%`, n] : ['-', n]} />
              <Legend wrapperStyle={{ fontSize: '0.72rem' }} />
              <ReferenceLine x="Mar" stroke="#94A3B8" strokeDasharray="4 4" label={{ value: 'Today', fontSize: 10, fill: '#94A3B8' }} />
              <Line type="monotone" dataKey="actual" stroke="#2563EB" strokeWidth={2.5} dot={{ r: 4 }} name="Actual Occupancy" connectNulls={false} />
              <Line type="monotone" dataKey="predicted" stroke="#F59E0B" strokeWidth={2} strokeDasharray="6 3" dot={{ r: 3 }} name="AI Predicted" connectNulls={false} />
              <Line type="monotone" dataKey="upper" stroke="#F59E0B" strokeWidth={1} strokeDasharray="2 4" dot={false} name="Upper Band" connectNulls={false} />
              <Line type="monotone" dataKey="lower" stroke="#F59E0B" strokeWidth={1} strokeDasharray="2 4" dot={false} name="Lower Band" connectNulls={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#0F172A', mb: 1.5 }}>At-Risk Units — Move-Out Probability Analysis</Typography>
      <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: 'none', border: '1px solid #E2E8F0' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#F8FAFC' }}>
              {['Unit', 'Tenant', 'Lease End', 'Days Left', 'Move-Out Probability', 'Risk', 'AI Reason', 'Recommended Action', 'Revenue Risk', 'Action'].map(h => (
                <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.65rem', color: '#64748B', py: 1.25 }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {atRiskUnits.sort((a, b) => b.moveOutProbability - a.moveOutProbability).map(u => {
              const risk = getRisk(u.moveOutProbability);
              const rc = riskConfig[risk];
              return (
                <TableRow key={u.unit} sx={{ '&:hover': { bgcolor: '#F8FAFC' } }}>
                  <TableCell sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#0F172A', py: 1 }}>{u.unit}</TableCell>
                  <TableCell sx={{ fontSize: '0.72rem', color: '#64748B', py: 1 }}>{u.tenant}</TableCell>
                  <TableCell sx={{ fontSize: '0.68rem', color: '#64748B', py: 1 }}>{u.leaseEnd}</TableCell>
                  <TableCell sx={{ fontSize: '0.72rem', fontWeight: 700, color: u.daysRemaining <= 30 ? '#DC2626' : u.daysRemaining <= 90 ? '#F59E0B' : '#059669', py: 1 }}>{u.daysRemaining}d</TableCell>
                  <TableCell sx={{ py: 1, minWidth: 140 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress variant="determinate" value={u.moveOutProbability}
                        sx={{ flex: 1, height: 8, borderRadius: '4px', bgcolor: `${rc.color}18`, '& .MuiLinearProgress-bar': { bgcolor: rc.color, borderRadius: '4px' } }} />
                      <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: rc.color, minWidth: 32 }}>{u.moveOutProbability}%</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <Chip label={rc.label} size="small" sx={{ height: 18, fontSize: '0.58rem', fontWeight: 700, bgcolor: rc.bg, color: rc.color }} />
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.65rem', color: '#64748B', py: 1, maxWidth: 150 }}>{u.reason}</TableCell>
                  <TableCell sx={{ fontSize: '0.65rem', color: '#2563EB', py: 1, maxWidth: 130, fontWeight: 600 }}>{u.recommendedAction}</TableCell>
                  <TableCell sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#DC2626', py: 1 }}>-${u.potentialLoss}/mo</TableCell>
                  <TableCell sx={{ py: 1 }}>
                    {actions[u.unit] ? (
                      <Chip label="Action Taken" size="small" sx={{ bgcolor: '#05966912', color: '#059669', fontWeight: 700, fontSize: '0.58rem', height: 20 }} />
                    ) : (
                      <Button variant="outlined" size="small" onClick={() => takeAction(u.unit)}
                        sx={{ fontSize: '0.6rem', height: 24, borderRadius: '6px', borderColor: '#2563EB', color: '#2563EB', minWidth: 80 }}>
                        Act Now
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
