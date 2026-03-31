import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Chip, IconButton, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, LinearProgress } from '@mui/material';
import { ArrowBack, BookOnline, Phone, Email, Schedule, AttachMoney } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { crmLeads, crmPipelineSummary, tourFunnelData } from '../mockData';

const stageOrder = ['Inquiry', 'Tour Scheduled', 'Tour Completed', 'Application Submitted', 'Negotiating', 'No Response'];

const statusConfig = {
  hot: { color: '#DC2626', bg: '#DC262612' },
  warm: { color: '#F59E0B', bg: '#F59E0B12' },
  cold: { color: '#94A3B8', bg: '#94A3B808' },
};

const scoreColor = (score) => score >= 80 ? '#059669' : score >= 60 ? '#F59E0B' : '#DC2626';

export default function BookingsLeadsPage({ onNavigate }) {
  const [leads, setLeads] = useState(crmLeads);
  const [stageFilter, setStageFilter] = useState('all');
  const [contacted, setContacted] = useState({});

  const contact = (id, type) => setContacted(prev => ({ ...prev, [id]: type }));

  const filtered = stageFilter === 'all' ? leads : leads.filter(l => l.stage === stageFilter);
  const hotRevenue = leads.filter(l => l.status === 'hot').length * 1900;

  const stagesData = stageOrder.map(s => ({ stage: s, count: leads.filter(l => l.stage === s).length })).filter(d => d.count > 0);

  return (
    <Box sx={{ p: { xs: '16px', md: '20px 24px' }, maxWidth: 1440 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <IconButton onClick={() => onNavigate('home')} size="small" sx={{ color: '#64748B', bgcolor: '#F1F5F9' }}><ArrowBack sx={{ fontSize: 16 }} /></IconButton>
        <Box sx={{ p: '6px', borderRadius: '10px', bgcolor: '#7C3AED12' }}><BookOnline sx={{ fontSize: 20, color: '#7C3AED' }} /></Box>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: '1.4rem', color: '#0F172A' }}>Bookings & Leads</Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>Lead pipeline, tour schedule, conversion funnel • Revenue pipeline: <strong style={{ color: '#059669' }}>${hotRevenue.toLocaleString()}/mo</strong></Typography>
        </Box>
      </Box>

      <Grid container spacing={1.75} sx={{ mb: 2.5 }}>
        {[
          { label: 'Total Leads', value: crmPipelineSummary.totalLeads, color: '#0F172A' },
          { label: 'Hot Leads', value: crmPipelineSummary.hotLeads, color: '#DC2626' },
          { label: 'Avg Lead Score', value: crmPipelineSummary.avgScore, color: '#059669' },
          { label: 'Conversion Rate', value: `${crmPipelineSummary.conversionRate}%`, color: '#2563EB' },
          { label: 'Avg Days in Pipeline', value: crmPipelineSummary.avgDaysInPipeline.toFixed(1), color: '#7C3AED' },
          { label: 'Est. Monthly Revenue', value: `$${crmPipelineSummary.estimatedRevenue.toLocaleString()}`, color: '#059669' },
        ].map(s => (
          <Grid item xs={6} md={2} key={s.label}>
            <Card><CardContent sx={{ p: '14px !important' }}>
              <Typography sx={{ fontSize: '0.6rem', color: '#94A3B8', fontWeight: 600, mb: 0.5 }}>{s.label}</Typography>
              <Typography sx={{ fontWeight: 800, fontSize: '1.3rem', color: s.color, lineHeight: 1 }}>{s.value}</Typography>
            </CardContent></Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2} sx={{ mb: 2.5 }}>
        <Grid item xs={12} md={5}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: '16px !important' }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#0F172A', mb: 2 }}>Pipeline by Stage</Typography>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={stagesData} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="stage" tick={{ fontSize: 10, fill: '#64748B' }} width={110} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#7C3AED" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={7}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: '16px !important' }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#0F172A', mb: 1.5 }}>Tour Conversion Funnel</Typography>
              {tourFunnelData.map((s, i) => (
                <Box key={s.stage} sx={{ mb: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.4 }}>
                    <Typography sx={{ fontSize: '0.72rem', color: '#64748B' }}>{s.stage}</Typography>
                    <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: s.color }}>{s.value}</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={(s.value / tourFunnelData[0].value) * 100}
                    sx={{ height: 8, borderRadius: '4px', bgcolor: `${s.color}18`, '& .MuiLinearProgress-bar': { bgcolor: s.color, borderRadius: '4px' } }} />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', gap: 0.75, mb: 1.5, flexWrap: 'wrap' }}>
        {['all', ...stageOrder].map(s => (
          <Chip key={s} label={s === 'all' ? 'All Stages' : s} size="small" onClick={() => setStageFilter(s)}
            sx={{ height: 26, fontSize: '0.62rem', fontWeight: 600, cursor: 'pointer',
              bgcolor: stageFilter === s ? '#7C3AED' : '#F1F5F9',
              color: stageFilter === s ? '#fff' : '#64748B',
            }} />
        ))}
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: 'none', border: '1px solid #E2E8F0' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#F8FAFC' }}>
              {['Lead', 'Source', 'Stage', 'Interested In', 'Budget', 'Score', 'Status', 'Tour Date', 'Follow Up', 'Actions'].map(h => (
                <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.65rem', color: '#64748B', py: 1.25 }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.sort((a, b) => b.score - a.score).map(lead => {
              const sc = statusConfig[lead.status];
              return (
                <TableRow key={lead.id} sx={{ '&:hover': { bgcolor: '#F8FAFC' } }}>
                  <TableCell sx={{ py: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <Avatar sx={{ width: 26, height: 26, fontSize: '0.6rem', bgcolor: '#7C3AED18', color: '#7C3AED', fontWeight: 700 }}>
                        {lead.name.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#0F172A' }}>{lead.name}</Typography>
                        <Typography sx={{ fontSize: '0.6rem', color: '#94A3B8' }}>{lead.email}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.68rem', color: '#64748B', py: 1 }}>{lead.source}</TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <Chip label={lead.stage} size="small" sx={{ height: 18, fontSize: '0.55rem', fontWeight: 600, bgcolor: '#7C3AED10', color: '#7C3AED' }} />
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.68rem', color: '#64748B', py: 1, maxWidth: 120 }}>{lead.interestedIn}</TableCell>
                  <TableCell sx={{ fontSize: '0.68rem', color: '#64748B', py: 1 }}>{lead.budget}</TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: `${scoreColor(lead.score)}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography sx={{ fontSize: '0.62rem', fontWeight: 800, color: scoreColor(lead.score) }}>{lead.score}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <Chip label={lead.status} size="small" sx={{ height: 18, fontSize: '0.58rem', fontWeight: 700, bgcolor: sc.bg, color: sc.color, textTransform: 'capitalize' }} />
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.68rem', color: '#64748B', py: 1 }}>{lead.tourDate || '—'}</TableCell>
                  <TableCell sx={{ fontSize: '0.68rem', color: lead.followUpDate <= '2026-03-31' ? '#DC2626' : '#64748B', fontWeight: lead.followUpDate <= '2026-03-31' ? 700 : 400, py: 1 }}>{lead.followUpDate}</TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton size="small" onClick={() => contact(lead.id, 'called')}
                        sx={{ color: contacted[lead.id] === 'called' ? '#059669' : '#2563EB', bgcolor: contacted[lead.id] === 'called' ? '#05966912' : '#2563EB12', width: 24, height: 24 }}>
                        <Phone sx={{ fontSize: 12 }} />
                      </IconButton>
                      <IconButton size="small" onClick={() => contact(lead.id, 'emailed')}
                        sx={{ color: contacted[lead.id] === 'emailed' ? '#059669' : '#7C3AED', bgcolor: contacted[lead.id] === 'emailed' ? '#05966912' : '#7C3AED12', width: 24, height: 24 }}>
                        <Email sx={{ fontSize: 12 }} />
                      </IconButton>
                    </Box>
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
