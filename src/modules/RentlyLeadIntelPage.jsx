import React, { useState } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Chip, IconButton, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Avatar, LinearProgress,
} from '@mui/material';
import { ArrowBack, PersonSearch, Phone, Email, CheckCircle } from '@mui/icons-material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, LineChart, Line,
} from 'recharts';
import {
  rentlyRenterIntents, rentlySearchTrends, rentlyLeadFunnelData, rentlyLeadSummary,
} from '../mockData';

const intentColor = (score) => score >= 80 ? '#059669' : score >= 60 ? '#F59E0B' : '#DC2626';
const intentBg = (score) => score >= 80 ? '#05966912' : score >= 60 ? '#F59E0B12' : '#DC262612';
const intentLabel = (score) => score >= 80 ? 'High' : score >= 60 ? 'Medium' : 'Low';

const sourceColors = {
  'Rently App': '#7C3AED',
  'Rently Search': '#2563EB',
  'Rently Email': '#059669',
};

export default function RentlyLeadIntelPage({ onNavigate }) {
  const [intents, setIntents] = useState(rentlyRenterIntents);
  const [contacted, setContacted] = useState({});
  const [sent, setSent] = useState({});
  const [filterSource, setFilterSource] = useState('all');

  const contactLead = (id, type) => setContacted((prev) => ({ ...prev, [id]: type }));
  const sendListing = (id) => setSent((prev) => ({ ...prev, [id]: true }));

  const filtered = filterSource === 'all'
    ? intents
    : intents.filter((l) => l.source === filterSource);

  return (
    <Box sx={{ p: { xs: '16px', md: '20px 24px' }, maxWidth: 1440 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <IconButton onClick={() => onNavigate('home')} size="small" sx={{ color: '#64748B', bgcolor: '#F1F5F9' }}>
          <ArrowBack sx={{ fontSize: 16 }} />
        </IconButton>
        <Box sx={{ p: '6px', borderRadius: '10px', bgcolor: '#7C3AED12' }}>
          <PersonSearch sx={{ fontSize: 20, color: '#7C3AED' }} />
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: '1.4rem', color: '#0F172A' }}>Rently Lead Intel</Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>
            Capture renters actively searching on Rently — score, match, and convert before competitors do
          </Typography>
        </Box>
      </Box>

      {/* KPI Bar */}
      <Grid container spacing={1.75} sx={{ mb: 2.5 }}>
        {[
          { label: 'Renter Intents Captured', value: rentlyLeadSummary.totalIntents, color: '#0F172A' },
          { label: 'High-Intent (≥80)', value: rentlyLeadSummary.highIntent, color: '#059669' },
          { label: 'Avg Search-to-Contact', value: rentlyLeadSummary.avgSearchToContact, color: '#2563EB' },
          { label: 'Rently Conversion Rate', value: `${rentlyLeadSummary.rentlyConversionRate}%`, color: '#7C3AED' },
          { label: 'Avg Intent Score', value: rentlyLeadSummary.avgIntentScore, color: '#F59E0B' },
          { label: 'Matched Vacant Units', value: rentlyLeadSummary.matchedUnits, color: '#DC2626' },
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
        {/* Search Trends */}
        <Grid item xs={12} md={7}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: '16px !important' }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#0F172A', mb: 0.5 }}>
                Weekly Search Trends — Your Listings vs Market
              </Typography>
              <Typography sx={{ fontSize: '0.68rem', color: '#94A3B8', mb: 1.5 }}>
                Renters searching for properties matching your listings on the Rently platform
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={rentlySearchTrends} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#64748B' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748B' }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '0.7rem' }} />
                  <Bar dataKey="yourListings" name="Your Listings" fill="#7C3AED" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="marketAvg" name="Market Avg" fill="#E2E8F0" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Funnel */}
        <Grid item xs={12} md={5}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: '16px !important' }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#0F172A', mb: 1.5 }}>
                Rently Lead Funnel
              </Typography>
              {rentlyLeadFunnelData.map((s) => (
                <Box key={s.stage} sx={{ mb: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.4 }}>
                    <Typography sx={{ fontSize: '0.68rem', color: '#64748B' }}>{s.stage}</Typography>
                    <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: s.color }}>{s.value.toLocaleString()}</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(s.value / rentlyLeadFunnelData[0].value) * 100}
                    sx={{
                      height: 8, borderRadius: '4px',
                      bgcolor: `${s.color}18`,
                      '& .MuiLinearProgress-bar': { bgcolor: s.color, borderRadius: '4px' },
                    }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Match Engine Panel */}
      <Card sx={{ mb: 2.5, border: '1px solid #7C3AED25', bgcolor: '#7C3AED04' }}>
        <CardContent sx={{ p: '16px !important' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.25 }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#0F172A' }}>⚡ Match Engine — Vacant Units Ready to Fill</Typography>
            <Chip label="AI-Powered" size="small" sx={{ bgcolor: '#7C3AED15', color: '#7C3AED', fontSize: '0.6rem', fontWeight: 700, height: 18 }} />
          </Box>
          <Typography sx={{ fontSize: '0.72rem', color: '#64748B', mb: 1.5 }}>
            These vacant units have the highest match rate against current Rently searcher criteria. Click to trigger 1-click outreach to all matched high-intent leads.
          </Typography>
          <Grid container spacing={1.5}>
            {[
              { unit: '102 (2BR/2BA)', matchedLeads: 4, topMatch: 'Olivia Carter', score: 91, topBudget: '$1,700–2,100', rent: '$1,950', action: 'Send to 4 leads' },
              { unit: '302 (2BR/2BA)', matchedLeads: 3, topMatch: 'Mia Santos', score: 93, topBudget: '$1,600–1,950', rent: '$2,000', action: 'Send to 3 leads' },
              { unit: '103 (Studio)', matchedLeads: 2, topMatch: 'Taylor Kim', score: 90, topBudget: '$950–1,150', rent: '$1,100', action: 'Send to 2 leads' },
            ].map((u) => (
              <Grid item xs={12} md={4} key={u.unit}>
                <Box sx={{ p: '12px 14px', borderRadius: '10px', bgcolor: '#fff', border: '1px solid #E2E8F0' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.75 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', color: '#0F172A' }}>Unit {u.unit}</Typography>
                    <Chip label={`${u.matchedLeads} matches`} size="small" sx={{ bgcolor: '#7C3AED12', color: '#7C3AED', fontWeight: 700, fontSize: '0.58rem', height: 18 }} />
                  </Box>
                  <Typography sx={{ fontSize: '0.68rem', color: '#64748B', mb: 0.25 }}>Top: <strong>{u.topMatch}</strong> — match {u.score}%</Typography>
                  <Typography sx={{ fontSize: '0.62rem', color: '#94A3B8', mb: 1 }}>Budget {u.topBudget} | Rent {u.rent}</Typography>
                  <Button variant="contained" fullWidth size="small"
                    sx={{ fontSize: '0.62rem', height: 26, borderRadius: '6px', bgcolor: '#7C3AED', '&:hover': { bgcolor: '#6D28D9' } }}>
                    {u.action}
                  </Button>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Source Filter */}
      <Box sx={{ display: 'flex', gap: 0.75, mb: 1.5, flexWrap: 'wrap' }}>
        {['all', 'Rently App', 'Rently Search', 'Rently Email'].map((s) => (
          <Chip key={s} label={s === 'all' ? 'All Sources' : s} size="small" onClick={() => setFilterSource(s)}
            sx={{
              height: 26, fontSize: '0.62rem', fontWeight: 600, cursor: 'pointer',
              bgcolor: filterSource === s ? '#7C3AED' : '#F1F5F9',
              color: filterSource === s ? '#fff' : '#64748B',
            }} />
        ))}
      </Box>

      {/* Renter Intent Table */}
      <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: 'none', border: '1px solid #E2E8F0' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#F8FAFC' }}>
              {['Renter', 'Source', 'Search Criteria', 'Budget', 'Move-in', 'Days Active', 'Intent Score', 'Match %', 'Last Seen', 'Actions'].map((h) => (
                <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.65rem', color: '#64748B', py: 1.25 }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.sort((a, b) => b.intentScore - a.intentScore).map((lead) => (
              <TableRow key={lead.id} sx={{ '&:hover': { bgcolor: '#F8FAFC' } }}>
                <TableCell sx={{ py: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <Avatar sx={{ width: 26, height: 26, fontSize: '0.6rem', bgcolor: '#7C3AED18', color: '#7C3AED', fontWeight: 700 }}>
                      {lead.name.split(' ').map((n) => n[0]).join('')}
                    </Avatar>
                    <Box>
                      <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#0F172A' }}>{lead.name}</Typography>
                      <Typography sx={{ fontSize: '0.58rem', color: '#94A3B8' }}>{lead.email}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell sx={{ py: 1 }}>
                  <Chip label={lead.source} size="small" sx={{
                    height: 18, fontSize: '0.55rem', fontWeight: 600,
                    bgcolor: `${sourceColors[lead.source] || '#94A3B8'}12`,
                    color: sourceColors[lead.source] || '#94A3B8',
                  }} />
                </TableCell>
                <TableCell sx={{ fontSize: '0.68rem', color: '#64748B', py: 1 }}>
                  {lead.bedsWanted} · {lead.neighborhoods[0]}
                </TableCell>
                <TableCell sx={{ fontSize: '0.68rem', color: '#64748B', py: 1 }}>
                  ${lead.budgetMin.toLocaleString()}–{lead.budgetMax.toLocaleString()}
                </TableCell>
                <TableCell sx={{ fontSize: '0.68rem', color: '#64748B', py: 1 }}>{lead.moveInDate}</TableCell>
                <TableCell sx={{ fontSize: '0.72rem', fontWeight: 700, color: lead.daysSearching <= 7 ? '#059669' : '#F59E0B', py: 1 }}>
                  {lead.daysSearching}d
                </TableCell>
                <TableCell sx={{ py: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{
                      width: 30, height: 30, borderRadius: '50%',
                      bgcolor: intentBg(lead.intentScore),
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Typography sx={{ fontSize: '0.6rem', fontWeight: 800, color: intentColor(lead.intentScore) }}>{lead.intentScore}</Typography>
                    </Box>
                    <Chip label={intentLabel(lead.intentScore)} size="small" sx={{
                      height: 16, fontSize: '0.52rem', fontWeight: 700,
                      bgcolor: intentBg(lead.intentScore),
                      color: intentColor(lead.intentScore),
                    }} />
                  </Box>
                </TableCell>
                <TableCell sx={{ py: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <LinearProgress variant="determinate" value={lead.matchPct}
                      sx={{
                        width: 48, height: 6, borderRadius: '3px',
                        bgcolor: '#E2E8F0',
                        '& .MuiLinearProgress-bar': { bgcolor: lead.matchPct >= 80 ? '#059669' : '#F59E0B', borderRadius: '3px' },
                      }} />
                    <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: lead.matchPct >= 80 ? '#059669' : '#F59E0B' }}>{lead.matchPct}%</Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ fontSize: '0.65rem', color: '#64748B', py: 1 }}>{lead.lastActive}</TableCell>
                <TableCell sx={{ py: 1 }}>
                  <Box sx={{ display: 'flex', gap: 0.4 }}>
                    {sent[lead.id] ? (
                      <Chip label="Sent ✓" size="small" sx={{ bgcolor: '#05966912', color: '#059669', fontWeight: 700, fontSize: '0.55rem', height: 20 }} />
                    ) : (
                      <Button variant="outlined" size="small" onClick={() => sendListing(lead.id)}
                        sx={{ fontSize: '0.55rem', height: 22, borderRadius: '6px', borderColor: '#7C3AED', color: '#7C3AED', minWidth: 68, px: 0.75 }}>
                        Send Listing
                      </Button>
                    )}
                    <IconButton size="small" onClick={() => contactLead(lead.id, 'called')}
                      sx={{ color: contacted[lead.id] === 'called' ? '#059669' : '#2563EB', bgcolor: contacted[lead.id] === 'called' ? '#05966912' : '#2563EB12', width: 22, height: 22 }}>
                      <Phone sx={{ fontSize: 11 }} />
                    </IconButton>
                    <IconButton size="small" onClick={() => contactLead(lead.id, 'emailed')}
                      sx={{ color: contacted[lead.id] === 'emailed' ? '#059669' : '#7C3AED', bgcolor: contacted[lead.id] === 'emailed' ? '#05966912' : '#7C3AED12', width: 22, height: 22 }}>
                      <Email sx={{ fontSize: 11 }} />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
