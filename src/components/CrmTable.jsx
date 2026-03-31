import React, { useState } from 'react';
import {
  Card, CardContent, Typography, Box, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, IconButton, TextField, InputAdornment, ToggleButtonGroup,
  ToggleButton, Avatar, Tooltip, Button, LinearProgress, Menu, MenuItem, Badge
} from '@mui/material';
import {
  Search, MoreVert, Email, Phone, CalendarMonth, PersonAdd,
  LocalFireDepartment, Whatshot, AcUnit, TrendingUp, ArrowForward,
  FilterList, Sort, Download, AutoAwesome
} from '@mui/icons-material';
import { crmLeads, crmPipelineSummary } from '../mockData';

const statusConfig = {
  hot: { label: 'Hot', color: '#DC2626', bg: '#FEF2F2', icon: <LocalFireDepartment sx={{ fontSize: 12 }} /> },
  warm: { label: 'Warm', color: '#F59E0B', bg: '#FFFBEB', icon: <Whatshot sx={{ fontSize: 12 }} /> },
  cold: { label: 'Cold', color: '#64748B', bg: '#F1F5F9', icon: <AcUnit sx={{ fontSize: 12 }} /> },
};

const stageConfig = {
  'Inquiry': { color: '#94A3B8', step: 1 },
  'Tour Scheduled': { color: '#2563EB', step: 2 },
  'Tour Completed': { color: '#7C3AED', step: 3 },
  'Application Submitted': { color: '#F59E0B', step: 4 },
  'Negotiating': { color: '#0891B2', step: 5 },
  'No Response': { color: '#DC2626', step: 0 },
};

const sourceColors = {
  'Zillow': '#DC2626', 'Website': '#2563EB', 'Apartments.com': '#059669',
  'Referral': '#7C3AED', 'Walk-in': '#D97706', 'Other': '#64748B',
};

const getScoreColor = (s) => s >= 80 ? '#059669' : s >= 50 ? '#F59E0B' : '#DC2626';
const getScoreBg = (s) => s >= 80 ? '#ECFDF5' : s >= 50 ? '#FFFBEB' : '#FEF2F2';

const StageProgress = ({ stage }) => {
  const cfg = stageConfig[stage] || stageConfig['Inquiry'];
  const steps = 5;
  return (
    <Box sx={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
      {Array.from({ length: steps }).map((_, i) => (
        <Box key={i} sx={{
          width: 14, height: 3.5, borderRadius: 2,
          bgcolor: i < cfg.step ? cfg.color : '#E2E8F0',
          transition: 'background-color 0.3s',
        }} />
      ))}
    </Box>
  );
};

export default function CrmTable() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const ps = crmPipelineSummary;

  const filtered = crmLeads.filter(l => {
    if (filter !== 'all' && l.status !== filter) return false;
    if (search && !l.name.toLowerCase().includes(search.toLowerCase()) && !l.interestedIn.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const isOverdue = (date) => {
    if (!date) return false;
    return new Date(date) <= new Date();
  };

  return (
    <Card>
      <CardContent sx={{ p: '18px !important' }}>
        {/* Header with Pipeline Summary */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.25 }}>
              <PersonAdd sx={{ fontSize: 18, color: '#2563EB' }} />
              <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#0F172A' }}>Leads & CRM Pipeline</Typography>
              <Chip label={`${ps.totalLeads} leads`} size="small" sx={{ height: 18, fontSize: '0.55rem', fontWeight: 700, bgcolor: '#EFF6FF', color: '#2563EB' }} />
            </Box>
            <Typography sx={{ fontSize: '0.7rem', color: '#94A3B8' }}>Track, engage, and convert prospects into tenants</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 0.75 }}>
            <Button variant="outlined" size="small" startIcon={<Download sx={{ fontSize: '13px !important' }} />}
              sx={{ fontSize: '0.68rem', height: 30, borderColor: '#E2E8F0', color: '#64748B', borderRadius: '8px' }}>Export</Button>
            <Button variant="contained" size="small" startIcon={<PersonAdd sx={{ fontSize: '13px !important' }} />}
              sx={{ fontSize: '0.68rem', height: 30, borderRadius: '8px', background: 'linear-gradient(135deg, #2563EB, #1D4ED8)' }}>Add Lead</Button>
          </Box>
        </Box>

        {/* Pipeline Stats Bar */}
        <Box sx={{ display: 'flex', gap: 1.25, mb: 2, p: 1.25, borderRadius: '12px', bgcolor: '#F8FAFC', border: '1px solid #F1F5F9' }}>
          {[
            { label: 'Hot Leads', value: ps.hotLeads, icon: <LocalFireDepartment sx={{ fontSize: 13 }} />, color: '#DC2626', bg: '#FEF2F2' },
            { label: 'Warm', value: ps.warmLeads, icon: <Whatshot sx={{ fontSize: 13 }} />, color: '#F59E0B', bg: '#FFFBEB' },
            { label: 'Cold', value: ps.coldLeads, icon: <AcUnit sx={{ fontSize: 13 }} />, color: '#64748B', bg: '#F1F5F9' },
            { label: 'Avg Score', value: `${ps.avgScore}`, icon: <AutoAwesome sx={{ fontSize: 13 }} />, color: '#7C3AED', bg: '#F5F3FF' },
            { label: 'Avg Days', value: `${ps.avgDaysInPipeline}d`, icon: <CalendarMonth sx={{ fontSize: 13 }} />, color: '#0891B2', bg: '#ECFEFF' },
            { label: 'Conv. Rate', value: `${ps.conversionRate}%`, icon: <TrendingUp sx={{ fontSize: 13 }} />, color: '#059669', bg: '#ECFDF5' },
            { label: 'Est. Revenue', value: `$${(ps.estimatedRevenue/1000).toFixed(1)}K`, icon: <TrendingUp sx={{ fontSize: 13 }} />, color: '#2563EB', bg: '#EFF6FF' },
          ].map(s => (
            <Box key={s.label} sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Box sx={{ p: '4px', borderRadius: '6px', bgcolor: s.bg, display: 'flex' }}>
                {React.cloneElement(s.icon, { sx: { fontSize: 13, color: s.color } })}
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>{s.value}</Typography>
                <Typography sx={{ fontSize: '0.48rem', color: '#94A3B8', fontWeight: 500 }}>{s.label}</Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Filters */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <TextField size="small" placeholder="Search leads..." value={search} onChange={(e) => setSearch(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 15, color: '#94A3B8' }} /></InputAdornment>, sx: { borderRadius: '8px', fontSize: '0.76rem', height: 32 } }} sx={{ width: 200 }} />
            <ToggleButtonGroup value={filter} exclusive onChange={(_, v) => v && setFilter(v)} size="small"
              sx={{ '& .MuiToggleButton-root': { borderRadius: '7px !important', textTransform: 'none', fontSize: '0.66rem', fontWeight: 600, px: 1.25, py: 0.35 } }}>
              <ToggleButton value="all">All ({ps.totalLeads})</ToggleButton>
              <ToggleButton value="hot">🔥 Hot ({ps.hotLeads})</ToggleButton>
              <ToggleButton value="warm">Warm ({ps.warmLeads})</ToggleButton>
              <ToggleButton value="cold">Cold ({ps.coldLeads})</ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="Sort" arrow><IconButton size="small" sx={{ color: '#94A3B8' }}><Sort sx={{ fontSize: 16 }} /></IconButton></Tooltip>
            <Tooltip title="Filter" arrow><IconButton size="small" sx={{ color: '#94A3B8' }}><FilterList sx={{ fontSize: 16 }} /></IconButton></Tooltip>
          </Box>
        </Box>

        {/* Table */}
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ '& th': { color: '#64748B', fontWeight: 700, fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '2px solid #E2E8F0', py: 1 } }}>
                <TableCell>Lead</TableCell>
                <TableCell>Source</TableCell>
                <TableCell>Interested In</TableCell>
                <TableCell>Stage</TableCell>
                <TableCell>Score</TableCell>
                <TableCell>Follow-Up</TableCell>
                <TableCell>Budget</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((lead) => {
                const sc = statusConfig[lead.status];
                const overdue = isOverdue(lead.followUpDate);
                return (
                  <TableRow key={lead.id} hover sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#F8FAFC' }, '& td': { py: 1.1, borderBottom: '1px solid #F1F5F9', fontSize: '0.78rem' } }}>
                    {/* Lead Info */}
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ position: 'relative' }}>
                          <Avatar sx={{ width: 30, height: 30, fontSize: 11, fontWeight: 700, bgcolor: `${sc.color}15`, color: sc.color }}>
                            {lead.name.split(' ').map(n => n[0]).join('')}
                          </Avatar>
                          <Box sx={{ position: 'absolute', bottom: -1, right: -1, width: 10, height: 10, borderRadius: '50%', bgcolor: sc.color, border: '1.5px solid #fff' }} />
                        </Box>
                        <Box>
                          <Typography sx={{ fontWeight: 700, color: '#0F172A', fontSize: '0.78rem', lineHeight: 1.2 }}>{lead.name}</Typography>
                          <Typography sx={{ color: '#94A3B8', fontSize: '0.6rem' }}>{lead.email}</Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    {/* Source */}
                    <TableCell>
                      <Chip label={lead.source} size="small" sx={{
                        height: 20, fontSize: '0.58rem', fontWeight: 600,
                        bgcolor: `${sourceColors[lead.source]}08`,
                        color: sourceColors[lead.source],
                        border: `1px solid ${sourceColors[lead.source]}20`,
                      }} />
                    </TableCell>

                    {/* Interested In */}
                    <TableCell>
                      <Typography sx={{ fontSize: '0.74rem', fontWeight: 600, color: '#0F172A', lineHeight: 1.2 }}>{lead.interestedIn}</Typography>
                      <Typography sx={{ fontSize: '0.58rem', color: '#94A3B8' }}>{lead.touchpoints} touchpoints · {lead.daysInPipeline}d in pipeline</Typography>
                    </TableCell>

                    {/* Stage */}
                    <TableCell>
                      <Box>
                        <Chip label={lead.stage} size="small" sx={{
                          height: 20, fontSize: '0.56rem', fontWeight: 700, mb: 0.35,
                          bgcolor: `${(stageConfig[lead.stage]?.color || '#94A3B8')}10`,
                          color: stageConfig[lead.stage]?.color || '#94A3B8',
                        }} />
                        <StageProgress stage={lead.stage} />
                      </Box>
                    </TableCell>

                    {/* AI Score */}
                    <TableCell>
                      <Tooltip title={`AI Lead Score: ${lead.score}/100`} arrow>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Box sx={{
                            width: 32, height: 32, borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            bgcolor: getScoreBg(lead.score),
                            border: `2px solid ${getScoreColor(lead.score)}`,
                          }}>
                            <Typography sx={{ fontSize: '0.62rem', fontWeight: 800, color: getScoreColor(lead.score) }}>{lead.score}</Typography>
                          </Box>
                        </Box>
                      </Tooltip>
                    </TableCell>

                    {/* Follow-Up */}
                    <TableCell>
                      {lead.followUpDate ? (
                        <Box>
                          <Badge variant={overdue ? 'dot' : 'standard'} color="error" invisible={!overdue}
                            sx={{ '& .MuiBadge-dot': { width: 6, height: 6, top: 2, right: 2 } }}>
                            <Chip label={new Date(lead.followUpDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              size="small" sx={{
                                height: 20, fontSize: '0.58rem', fontWeight: 600,
                                bgcolor: overdue ? '#FEF2F2' : '#F8FAFC',
                                color: overdue ? '#DC2626' : '#64748B',
                                border: `1px solid ${overdue ? '#FEE2E2' : '#F1F5F9'}`,
                              }} />
                          </Badge>
                          {overdue && <Typography sx={{ fontSize: '0.5rem', color: '#DC2626', fontWeight: 600, mt: 0.15 }}>Overdue!</Typography>}
                        </Box>
                      ) : <Typography sx={{ color: '#CBD5E1', fontSize: '0.72rem' }}>-</Typography>}
                    </TableCell>

                    {/* Budget */}
                    <TableCell>
                      <Typography sx={{ fontSize: '0.74rem', fontWeight: 600, color: '#0F172A' }}>{lead.budget}</Typography>
                    </TableCell>

                    {/* Quick Actions */}
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.25 }}>
                        <Tooltip title="Send Email" arrow>
                          <IconButton size="small" sx={{ color: '#94A3B8', p: '3px', '&:hover': { color: '#2563EB', bgcolor: '#EFF6FF' } }}>
                            <Email sx={{ fontSize: 14 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Call" arrow>
                          <IconButton size="small" sx={{ color: '#94A3B8', p: '3px', '&:hover': { color: '#059669', bgcolor: '#ECFDF5' } }}>
                            <Phone sx={{ fontSize: 14 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Schedule Tour" arrow>
                          <IconButton size="small" sx={{ color: '#94A3B8', p: '3px', '&:hover': { color: '#7C3AED', bgcolor: '#F5F3FF' } }}>
                            <CalendarMonth sx={{ fontSize: 14 }} />
                          </IconButton>
                        </Tooltip>
                        <IconButton size="small" onClick={(e) => { setAnchorEl(e.currentTarget); setSelectedLead(lead); }}
                          sx={{ color: '#CBD5E1', p: '3px', '&:hover': { color: '#64748B' } }}>
                          <MoreVert sx={{ fontSize: 14 }} />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Context Menu */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}
          PaperProps={{ sx: { borderRadius: '10px', boxShadow: '0 8px 24px rgba(15,23,42,0.1)', border: '1px solid #E2E8F0', minWidth: 180 } }}>
          {['View Full Profile', 'Send Follow-Up Email', 'Schedule Tour', 'Move to Next Stage', 'Add Note', 'Mark as Lost'].map(item => (
            <MenuItem key={item} onClick={() => setAnchorEl(null)} sx={{ fontSize: '0.76rem', py: 0.75 }}>{item}</MenuItem>
          ))}
        </Menu>

        {/* AI Insight Footer */}
        <Box sx={{ mt: 1.5, p: 1.25, borderRadius: '10px', background: 'linear-gradient(135deg, #0F172A, #1E293B)', border: '1px solid #334155', display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <Box sx={{ p: '5px', borderRadius: '8px', background: 'linear-gradient(135deg, #7C3AED, #2563EB)', display: 'flex', flexShrink: 0 }}>
            <AutoAwesome sx={{ color: '#fff', fontSize: 14 }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ color: '#F1F5F9', fontSize: '0.72rem', fontWeight: 600, lineHeight: 1.3 }}>
              AI Recommendation: 2 hot leads (David Kim, Nina Williams) haven't received follow-up in 2+ days.
              <Typography component="span" sx={{ color: '#60A5FA', fontSize: '0.72rem', fontWeight: 600 }}> Sending a personalized email within 24hrs increases conversion by 40%.</Typography>
            </Typography>
          </Box>
          <Button size="small" endIcon={<ArrowForward sx={{ fontSize: '12px !important' }} />}
            sx={{ color: '#60A5FA', fontSize: '0.66rem', fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0 }}>
            Send Emails
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
