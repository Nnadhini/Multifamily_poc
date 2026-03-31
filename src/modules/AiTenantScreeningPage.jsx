import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Chip, IconButton, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, LinearProgress, Avatar, Alert } from '@mui/material';
import { ArrowBack, Shield, CheckCircle, Cancel, HelpOutline, Warning } from '@mui/icons-material';
import { applicants } from '../mockData';

const riskColors = {
  low: { color: '#059669', bg: '#05966912', label: 'Low Risk' },
  medium: { color: '#F59E0B', bg: '#F59E0B12', label: 'Medium Risk' },
  high: { color: '#DC2626', bg: '#DC262612', label: 'High Risk' },
};

const scoreColor = (score) => score >= 80 ? '#059669' : score >= 60 ? '#F59E0B' : '#DC2626';

export default function AiTenantScreeningPage({ onNavigate }) {
  const [appList, setAppList] = useState(applicants);

  const updateStatus = (id, status) => setAppList(prev => prev.map(a => a.id === id ? { ...a, status } : a));

  const pending = appList.filter(a => a.status === 'pending').length;
  const approved = appList.filter(a => a.status === 'approved').length;
  const declined = appList.filter(a => a.status === 'declined').length;
  const avgScore = Math.round(appList.reduce((s, a) => s + a.aiScore, 0) / appList.length);
  const processingTime = '4.2 min';

  return (
    <Box sx={{ p: { xs: '16px', md: '20px 24px' }, maxWidth: 1440 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <IconButton onClick={() => onNavigate('home')} size="small" sx={{ color: '#64748B', bgcolor: '#F1F5F9' }}><ArrowBack sx={{ fontSize: 16 }} /></IconButton>
        <Box sx={{ p: '6px', borderRadius: '10px', bgcolor: '#7C3AED12' }}><Shield sx={{ fontSize: 20, color: '#7C3AED' }} /></Box>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: '1.4rem', color: '#0F172A' }}>AI Tenant Screening</Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>AI risk scoring — reduces bad debt by up to 60%</Typography>
        </Box>
      </Box>

      <Alert severity="info" sx={{ mb: 2, borderRadius: '10px', fontSize: '0.78rem' }}>
        AI-powered screening analyzes credit, income, rental history &amp; employment. Average processing time: <strong>{processingTime}</strong>. Compliance: Fair Housing Act.
      </Alert>

      <Grid container spacing={1.75} sx={{ mb: 2.5 }}>
        {[
          { label: 'Pending Review', value: pending, color: '#F59E0B' },
          { label: 'Approved', value: approved, color: '#059669' },
          { label: 'Declined', value: declined, color: '#DC2626' },
          { label: 'Avg AI Score', value: avgScore, color: '#7C3AED' },
          { label: 'Avg Processing', value: processingTime, color: '#2563EB' },
        ].map(s => (
          <Grid item xs={6} md key={s.label}>
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
              {['Applicant', 'Unit', 'Applied', 'AI Score', 'Risk', 'Credit Score', 'Income Ratio', 'Rental History', 'Employment', 'Flags', 'Recommendation', 'Action'].map(h => (
                <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.65rem', color: '#64748B', py: 1.25 }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {appList.map(app => {
              const rc = riskColors[app.riskLevel];
              return (
                <TableRow key={app.id} sx={{ '&:hover': { bgcolor: '#F8FAFC' }, opacity: app.status !== 'pending' ? 0.75 : 1 }}>
                  <TableCell sx={{ py: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <Avatar sx={{ width: 26, height: 26, fontSize: '0.6rem', bgcolor: '#7C3AED18', color: '#7C3AED', fontWeight: 700 }}>
                        {app.name.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                      <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#0F172A' }}>{app.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.72rem', color: '#7C3AED', fontWeight: 700, py: 1 }}>{app.unit}</TableCell>
                  <TableCell sx={{ fontSize: '0.68rem', color: '#64748B', py: 1 }}>{app.appliedDate}</TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <Box sx={{ width: 32, height: 32, borderRadius: '50%', border: `3px solid ${scoreColor(app.aiScore)}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography sx={{ fontSize: '0.6rem', fontWeight: 800, color: scoreColor(app.aiScore) }}>{app.aiScore}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <Chip label={rc.label} size="small" sx={{ height: 18, fontSize: '0.58rem', fontWeight: 700, bgcolor: rc.bg, color: rc.color }} />
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: app.creditScore >= 700 ? '#059669' : app.creditScore >= 640 ? '#F59E0B' : '#DC2626' }}>{app.creditScore}</Typography>
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: app.incomeRatio >= 3 ? '#059669' : '#DC2626' }}>{app.incomeRatio}x</Typography>
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <Chip label={app.rentalHistory} size="small" sx={{ height: 16, fontSize: '0.55rem', fontWeight: 600,
                      bgcolor: app.rentalHistory === 'excellent' ? '#05966912' : app.rentalHistory === 'good' ? '#2563EB12' : '#F59E0B12',
                      color: app.rentalHistory === 'excellent' ? '#059669' : app.rentalHistory === 'good' ? '#2563EB' : '#F59E0B',
                    }} />
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <Chip label={app.employment} size="small" sx={{ height: 16, fontSize: '0.55rem', fontWeight: 600,
                      bgcolor: app.employment === 'verified' ? '#05966912' : '#F59E0B12',
                      color: app.employment === 'verified' ? '#059669' : '#F59E0B',
                    }} />
                  </TableCell>
                  <TableCell sx={{ py: 1, maxWidth: 120 }}>
                    {app.flags.length === 0 ? (
                      <Typography sx={{ fontSize: '0.62rem', color: '#059669' }}>None</Typography>
                    ) : (
                      app.flags.map((f, i) => <Chip key={i} label={f} size="small" sx={{ height: 16, fontSize: '0.5rem', bgcolor: '#DC262608', color: '#DC2626', mb: 0.25, display: 'block' }} />)
                    )}
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <Chip label={app.recommendation} size="small" sx={{ height: 18, fontSize: '0.58rem', fontWeight: 700,
                      bgcolor: app.recommendation === 'Approve' ? '#05966912' : app.recommendation === 'Decline' ? '#DC262612' : '#F59E0B12',
                      color: app.recommendation === 'Approve' ? '#059669' : app.recommendation === 'Decline' ? '#DC2626' : '#F59E0B',
                    }} />
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>
                    {app.status !== 'pending' ? (
                      <Chip label={app.status === 'approved' ? 'Approved' : 'Declined'} size="small"
                        sx={{ bgcolor: app.status === 'approved' ? '#05966912' : '#DC262612', color: app.status === 'approved' ? '#059669' : '#DC2626', fontWeight: 700, fontSize: '0.62rem' }} />
                    ) : (
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Button size="small" variant="contained" onClick={() => updateStatus(app.id, 'approved')}
                          sx={{ fontSize: '0.58rem', height: 22, minWidth: 52, bgcolor: '#059669', borderRadius: '5px', px: 0.75 }}>Approve</Button>
                        <Button size="small" variant="outlined" onClick={() => updateStatus(app.id, 'declined')}
                          sx={{ fontSize: '0.58rem', height: 22, minWidth: 52, borderColor: '#DC2626', color: '#DC2626', borderRadius: '5px', px: 0.75 }}>Decline</Button>
                      </Box>
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
