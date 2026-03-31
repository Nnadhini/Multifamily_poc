import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Chip, IconButton, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Slider, Alert } from '@mui/material';
import { ArrowBack, Autorenew, Send, CheckCircle, AttachMoney } from '@mui/icons-material';
import { atRiskUnits } from '../mockData';

const renewalLeases = atRiskUnits.map(u => ({
  ...u,
  suggestedIncrease: u.moveOutProbability < 40 ? 5 : u.moveOutProbability < 60 ? 3 : 2,
  campaignStatus: 'not-started',
  retentionValue: u.potentialLoss * 12 * 0.4,
}));

export default function RenewalNudgerPage({ onNavigate }) {
  const [leases, setLeases] = useState(renewalLeases);
  const [increases, setIncreases] = useState(Object.fromEntries(renewalLeases.map(l => [l.unit, l.suggestedIncrease])));
  const [sent, setSent] = useState({});

  const sendOffer = (unit) => {
    setSent(prev => ({ ...prev, [unit]: true }));
    setLeases(prev => prev.map(l => l.unit === unit ? { ...l, campaignStatus: 'offer-sent' } : l));
  };
  const sendAll = () => leases.filter(l => !sent[l.unit]).forEach(l => sendOffer(l.unit));

  const totalRetentionSavings = leases.reduce((s, l) => s + l.retentionValue, 0);
  const sentCount = Object.values(sent).filter(Boolean).length;
  const avgIncrease = (Object.values(increases).reduce((s, v) => s + v, 0) / Object.values(increases).length).toFixed(1);

  return (
    <Box sx={{ p: { xs: '16px', md: '20px 24px' }, maxWidth: 1440 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <IconButton onClick={() => onNavigate('home')} size="small" sx={{ color: '#64748B', bgcolor: '#F1F5F9' }}><ArrowBack sx={{ fontSize: 16 }} /></IconButton>
        <Box sx={{ p: '6px', borderRadius: '10px', bgcolor: '#05966912' }}><Autorenew sx={{ fontSize: 20, color: '#059669' }} /></Box>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontWeight: 800, fontSize: '1.4rem', color: '#0F172A' }}>AI Renewal Nudger</Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>Smart renewal campaigns — prevent turnover, retain revenue</Typography>
        </Box>
        <Button variant="contained" size="small" startIcon={<Send sx={{ fontSize: '13px !important' }} />}
          onClick={sendAll}
          sx={{ fontSize: '0.72rem', height: 32, borderRadius: '8px', bgcolor: '#059669' }}>
          Send All Offers
        </Button>
      </Box>

      <Alert severity="success" sx={{ mb: 2, borderRadius: '10px', fontSize: '0.78rem' }}>
        Retaining all at-risk tenants saves an estimated <strong>${Math.round(totalRetentionSavings).toLocaleString()}/year</strong> in turnover costs (avg $5,200/unit).
      </Alert>

      <Grid container spacing={1.75} sx={{ mb: 2.5 }}>
        {[
          { label: 'Leases Expiring < 90d', value: leases.filter(l => l.daysRemaining <= 90).length, color: '#DC2626' },
          { label: 'Offers Sent', value: sentCount, color: '#059669' },
          { label: 'Avg Suggested Increase', value: `${avgIncrease}%`, color: '#2563EB' },
          { label: 'Retention Savings/Year', value: `$${Math.round(totalRetentionSavings).toLocaleString()}`, color: '#059669' },
        ].map(s => (
          <Grid item xs={6} md={3} key={s.label}>
            <Card><CardContent sx={{ p: '14px !important' }}>
              <Typography sx={{ fontSize: '0.6rem', color: '#94A3B8', fontWeight: 600, mb: 0.5 }}>{s.label}</Typography>
              <Typography sx={{ fontWeight: 800, fontSize: '1.3rem', color: s.color, lineHeight: 1 }}>{s.value}</Typography>
            </CardContent></Card>
          </Grid>
        ))}
      </Grid>

      <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: 'none', border: '1px solid #E2E8F0' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#F8FAFC' }}>
              {['Unit', 'Tenant', 'Lease End', 'Days Left', 'Move-Out Risk', 'Current Rent', 'Suggested Increase', 'New Rent', 'Retention Value', 'Campaign', 'Action'].map(h => (
                <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.65rem', color: '#64748B', py: 1.25 }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {leases.sort((a, b) => b.moveOutProbability - a.moveOutProbability).map(l => {
              const inc = increases[l.unit] || l.suggestedIncrease;
              const newRent = Math.round(l.potentialLoss * (1 + inc / 100));
              return (
                <TableRow key={l.unit} sx={{ '&:hover': { bgcolor: '#F8FAFC' } }}>
                  <TableCell sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#0F172A', py: 1 }}>{l.unit}</TableCell>
                  <TableCell sx={{ fontSize: '0.72rem', color: '#64748B', py: 1 }}>{l.tenant}</TableCell>
                  <TableCell sx={{ fontSize: '0.68rem', color: '#64748B', py: 1 }}>{l.leaseEnd}</TableCell>
                  <TableCell sx={{ fontSize: '0.72rem', fontWeight: 700, color: l.daysRemaining <= 30 ? '#DC2626' : l.daysRemaining <= 90 ? '#F59E0B' : '#059669', py: 1 }}>{l.daysRemaining}d</TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, color: l.moveOutProbability >= 60 ? '#DC2626' : l.moveOutProbability >= 35 ? '#F59E0B' : '#059669' }}>
                        {l.moveOutProbability}%
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.72rem', color: '#64748B', py: 1 }}>${l.potentialLoss.toLocaleString()}</TableCell>
                  <TableCell sx={{ py: 1, minWidth: 160 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Slider size="small" value={inc} min={0} max={10} step={0.5}
                        onChange={(_, v) => setIncreases(prev => ({ ...prev, [l.unit]: v }))}
                        disabled={sent[l.unit]}
                        sx={{ flex: 1, color: '#059669', '& .MuiSlider-thumb': { width: 12, height: 12 } }} />
                      <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#059669', minWidth: 28 }}>{inc}%</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#059669', py: 1 }}>${newRent.toLocaleString()}</TableCell>
                  <TableCell sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#7C3AED', py: 1 }}>${Math.round(l.retentionValue).toLocaleString()}/yr</TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <Chip label={sent[l.unit] ? 'Offer Sent' : 'Not Started'} size="small"
                      sx={{ height: 18, fontSize: '0.58rem', fontWeight: 700,
                        bgcolor: sent[l.unit] ? '#05966912' : '#F1F5F9',
                        color: sent[l.unit] ? '#059669' : '#94A3B8',
                      }} />
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>
                    {sent[l.unit] ? (
                      <CheckCircle sx={{ fontSize: 18, color: '#059669' }} />
                    ) : (
                      <Button variant="outlined" size="small" startIcon={<Send sx={{ fontSize: '11px !important' }} />}
                        onClick={() => sendOffer(l.unit)}
                        sx={{ fontSize: '0.6rem', height: 24, borderRadius: '6px', borderColor: '#059669', color: '#059669', minWidth: 80 }}>
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
