import React, { useState } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Chip, IconButton, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, LinearProgress, Alert,
} from '@mui/material';
import { ArrowBack, ShowChart, TrendingUp, Warning, CheckCircle } from '@mui/icons-material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, LineChart, Line, ReferenceLine,
} from 'recharts';
import {
  unitMarketTimeline, marketTransitionForecast, offMarketReasons, marketPredictionAccuracy,
} from '../mockData';

const statusConfig = {
  'on-market':  { color: '#2563EB', bg: '#2563EB12', label: 'On-Market' },
  'off-market': { color: '#059669', bg: '#05966912', label: 'Off-Market' },
};

const confidenceColor = (c) => c >= 80 ? '#059669' : c >= 60 ? '#F59E0B' : '#94A3B8';

const actionUrgency = (days) => {
  if (days <= 14) return { color: '#DC2626', bg: '#FEF2F2', label: 'Urgent' };
  if (days <= 45) return { color: '#F59E0B', bg: '#FFFBEB', label: 'Soon' };
  return { color: '#059669', bg: '#ECFDF5', label: 'Monitor' };
};

export default function MarketStatusPredictorPage({ onNavigate }) {
  const [actions, setActions] = useState({});

  const takeAction = (unit) => setActions((prev) => ({ ...prev, [unit]: true }));

  const onMarketCount = unitMarketTimeline.filter((u) => u.currentStatus === 'on-market').length;
  const offMarketCount = unitMarketTimeline.filter((u) => u.currentStatus === 'off-market').length;
  const next30 = unitMarketTimeline.filter((u) => u.currentStatus === 'off-market' && u.daysUntilChange <= 30).length;
  const next60 = unitMarketTimeline.filter((u) => u.currentStatus === 'off-market' && u.daysUntilChange <= 60).length;
  const next90 = unitMarketTimeline.filter((u) => u.currentStatus === 'off-market' && u.daysUntilChange <= 90).length;

  // Accuracy metric
  const accuracyPct = Math.round(
    (marketPredictionAccuracy.filter((d) => d.predicted === d.actual).length / marketPredictionAccuracy.length) * 100
  );

  // Conversion opportunities: off-market units with high confidence going on-market soon
  const conversionOpportunities = unitMarketTimeline
    .filter((u) => u.currentStatus === 'off-market' && u.renewalProbability != null && u.renewalProbability < 70)
    .sort((a, b) => b.confidence - a.confidence);

  return (
    <Box sx={{ p: { xs: '16px', md: '20px 24px' }, maxWidth: 1440 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <IconButton onClick={() => onNavigate('home')} size="small" sx={{ color: '#64748B', bgcolor: '#F1F5F9' }}>
          <ArrowBack sx={{ fontSize: 16 }} />
        </IconButton>
        <Box sx={{ p: '6px', borderRadius: '10px', bgcolor: '#2563EB12' }}>
          <ShowChart sx={{ fontSize: 20, color: '#2563EB' }} />
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: '1.4rem', color: '#0F172A' }}>On/Off-Market Predictor</Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>
            AI predicts when units will go on-market or off-market — start pre-marketing before vacancy occurs
          </Typography>
        </Box>
      </Box>

      <Alert severity="info" sx={{ mb: 2, borderRadius: '10px', fontSize: '0.78rem' }} icon={<Warning fontSize="small" />}>
        <strong>{next30} units</strong> predicted to go on-market in the next 30 days. Pre-market now to reduce vacancy days and maximize on-market conversion.
      </Alert>

      {/* KPI Bar */}
      <Grid container spacing={1.75} sx={{ mb: 2.5 }}>
        {[
          { label: 'Currently On-Market', value: onMarketCount, color: '#2563EB' },
          { label: 'Currently Off-Market', value: offMarketCount, color: '#059669' },
          { label: 'On-Market in 30d', value: next30, color: '#F59E0B' },
          { label: 'On-Market in 60d', value: next60, color: '#DC2626' },
          { label: 'On-Market in 90d', value: next90, color: '#7C3AED' },
          { label: 'Model Accuracy', value: `${accuracyPct}%`, color: '#059669' },
        ].map((s) => (
          <Grid item xs={6} md={2} key={s.label}>
            <Card>
              <CardContent sx={{ p: '14px !important' }}>
                <Typography sx={{ fontSize: '0.6rem', color: '#94A3B8', fontWeight: 600, mb: 0.5 }}>{s.label}</Typography>
                <Typography sx={{ fontWeight: 800, fontSize: '1.3rem', color: s.color, lineHeight: 1 }}>{s.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={2} sx={{ mb: 2.5 }}>
        {/* Transition Forecast */}
        <Grid item xs={12} md={7}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: '16px !important' }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#0F172A', mb: 0.5 }}>
                6-Month Market Transition Forecast
              </Typography>
              <Typography sx={{ fontSize: '0.68rem', color: '#94A3B8', mb: 1.5 }}>
                Predicted units going on-market vs off-market per month — plan pre-marketing campaigns in advance
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={marketTransitionForecast} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} allowDecimals={false} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '0.7rem' }} />
                  <Bar dataKey="goingOnMarket" name="Going On-Market" fill="#2563EB" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="goingOffMarket" name="Going Off-Market" fill="#059669" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Accuracy + Off-market reasons */}
        <Grid item xs={12} md={5}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: '16px !important' }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#0F172A', mb: 0.5 }}>
                Prediction Accuracy vs Actuals
              </Typography>
              <Typography sx={{ fontSize: '0.68rem', color: '#94A3B8', mb: 1 }}>
                Historical model predictions vs actual market status changes (units/month)
              </Typography>
              <ResponsiveContainer width="100%" height={120}>
                <LineChart data={marketPredictionAccuracy} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748B' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748B' }} allowDecimals={false} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '0.68rem' }} />
                  <Line type="monotone" dataKey="predicted" stroke="#7C3AED" strokeWidth={2} strokeDasharray="5 3" dot={{ r: 3 }} name="Predicted" />
                  <Line type="monotone" dataKey="actual" stroke="#2563EB" strokeWidth={2} dot={{ r: 3 }} name="Actual" />
                </LineChart>
              </ResponsiveContainer>

              <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', color: '#0F172A', mt: 1.5, mb: 0.75 }}>Off-Market Breakdown</Typography>
              {offMarketReasons.map((r) => (
                <Box key={r.reason} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Typography sx={{ fontSize: '0.68rem', color: '#64748B' }}>{r.reason}</Typography>
                  <Chip label={r.count} size="small" sx={{ height: 18, fontSize: '0.62rem', fontWeight: 700, bgcolor: `${r.color}12`, color: r.color }} />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* On-Market Conversion Opportunities */}
      <Card sx={{ mb: 2.5, border: '1px solid #2563EB25', bgcolor: '#2563EB04' }}>
        <CardContent sx={{ p: '16px !important' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.25 }}>
            <TrendingUp sx={{ color: '#2563EB', fontSize: 18 }} />
            <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#0F172A' }}>
              On-Market Conversion Opportunities
            </Typography>
            <Chip label={`${conversionOpportunities.length} units`} size="small" sx={{ bgcolor: '#2563EB15', color: '#2563EB', fontWeight: 700, fontSize: '0.58rem', height: 18 }} />
          </Box>
          <Typography sx={{ fontSize: '0.72rem', color: '#64748B', mb: 1.5 }}>
            Off-market units with moderate-to-high confidence of becoming available soon. Start pre-marketing now to fill vacancy day 1.
          </Typography>
          <Grid container spacing={1.25}>
            {conversionOpportunities.slice(0, 4).map((u) => {
              const urg = actionUrgency(u.daysUntilChange);
              return (
                <Grid item xs={12} sm={6} md={3} key={u.unit}>
                  <Box sx={{ p: '12px 14px', borderRadius: '10px', bgcolor: '#fff', border: `1px solid ${urg.color}25` }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', color: '#0F172A' }}>Unit {u.unit}</Typography>
                      <Chip label={urg.label} size="small" sx={{ height: 16, fontSize: '0.52rem', fontWeight: 700, bgcolor: urg.bg, color: urg.color }} />
                    </Box>
                    <Typography sx={{ fontSize: '0.68rem', color: '#64748B', mb: 0.25 }}>{u.type} · {u.building}</Typography>
                    <Typography sx={{ fontSize: '0.65rem', color: '#94A3B8', mb: 0.5 }}>Predicted: {u.predictedChangeDate}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.75 }}>
                      <LinearProgress variant="determinate" value={u.confidence}
                        sx={{
                          flex: 1, height: 5, borderRadius: '3px',
                          bgcolor: `${confidenceColor(u.confidence)}18`,
                          '& .MuiLinearProgress-bar': { bgcolor: confidenceColor(u.confidence), borderRadius: '3px' },
                        }} />
                      <Typography sx={{ fontSize: '0.6rem', fontWeight: 700, color: confidenceColor(u.confidence) }}>{u.confidence}%</Typography>
                    </Box>
                    <Typography sx={{ fontSize: '0.6rem', color: '#7C3AED', fontWeight: 600 }}>{u.recommendedAction}</Typography>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </CardContent>
      </Card>

      {/* Unit-Level Prediction Table */}
      <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#0F172A', mb: 1.5 }}>
        Unit-Level Market Status Predictions
      </Typography>
      <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: 'none', border: '1px solid #E2E8F0' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#F8FAFC' }}>
              {['Unit', 'Type', 'Current Status', 'Predicted Change', 'Confidence', 'Days Until Change', 'Key Driver', 'Recommended Action', 'Rev. Risk/Day', 'Action'].map((h) => (
                <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.65rem', color: '#64748B', py: 1.25 }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {unitMarketTimeline.sort((a, b) => a.daysUntilChange - b.daysUntilChange).map((u) => {
              const sc = statusConfig[u.currentStatus];
              const urg = actionUrgency(u.daysUntilChange);
              return (
                <TableRow key={u.unit} sx={{ '&:hover': { bgcolor: '#F8FAFC' } }}>
                  <TableCell sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#0F172A', py: 1 }}>{u.unit}</TableCell>
                  <TableCell sx={{ fontSize: '0.65rem', color: '#64748B', py: 1 }}>{u.type}</TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <Chip label={sc.label} size="small" sx={{ height: 18, fontSize: '0.58rem', fontWeight: 700, bgcolor: sc.bg, color: sc.color }} />
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.68rem', color: '#64748B', py: 1 }}>{u.predictedChangeDate}</TableCell>
                  <TableCell sx={{ py: 1, minWidth: 110 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <LinearProgress variant="determinate" value={u.confidence}
                        sx={{
                          flex: 1, height: 6, borderRadius: '3px',
                          bgcolor: `${confidenceColor(u.confidence)}18`,
                          '& .MuiLinearProgress-bar': { bgcolor: confidenceColor(u.confidence), borderRadius: '3px' },
                        }} />
                      <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: confidenceColor(u.confidence), minWidth: 28 }}>{u.confidence}%</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <Chip label={`${u.daysUntilChange}d`} size="small" sx={{ height: 18, fontSize: '0.6rem', fontWeight: 700, bgcolor: urg.bg, color: urg.color }} />
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.62rem', color: '#64748B', py: 1, maxWidth: 160 }}>{u.driver}</TableCell>
                  <TableCell sx={{ fontSize: '0.62rem', color: '#2563EB', py: 1, maxWidth: 140, fontWeight: 600 }}>{u.recommendedAction}</TableCell>
                  <TableCell sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#DC2626', py: 1 }}>
                    ${u.revenueRiskPerDay}/d
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>
                    {actions[u.unit] ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CheckCircle sx={{ fontSize: 14, color: '#059669' }} />
                        <Typography sx={{ fontSize: '0.6rem', color: '#059669', fontWeight: 700 }}>Done</Typography>
                      </Box>
                    ) : (
                      <Button variant="outlined" size="small" onClick={() => takeAction(u.unit)}
                        sx={{ fontSize: '0.58rem', height: 22, borderRadius: '6px', borderColor: '#2563EB', color: '#2563EB', minWidth: 68, px: 0.5 }}>
                        Take Action
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
