import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Chip, IconButton, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, Alert } from '@mui/material';
import { ArrowBack, Build, CheckCircle, Warning } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { maintenanceTickets } from '../mockData';

const priorityConfig = {
  urgent: { color: '#DC2626', bg: '#DC262612' },
  high: { color: '#F59E0B', bg: '#F59E0B12' },
  medium: { color: '#2563EB', bg: '#2563EB12' },
  low: { color: '#059669', bg: '#05966912' },
};
const statusConfig = {
  open: { color: '#DC2626', bg: '#DC262612' },
  'in-progress': { color: '#F59E0B', bg: '#F59E0B12' },
  scheduled: { color: '#2563EB', bg: '#2563EB12' },
  resolved: { color: '#059669', bg: '#05966912' },
};

const categoryData = [
  { cat: 'HVAC', count: 2 },
  { cat: 'Plumbing', count: 2 },
  { cat: 'Electrical', count: 1 },
  { cat: 'Appliance', count: 1 },
  { cat: 'General', count: 1 },
  { cat: 'Painting', count: 1 },
];

export default function MaintenancePage({ onNavigate }) {
  const [tickets, setTickets] = useState(maintenanceTickets);
  const [statusFilter, setStatusFilter] = useState('all');

  const updateStatus = (id, newStatus) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: newStatus, actualCost: newStatus === 'resolved' ? t.estimatedCost : t.actualCost } : t));
  };

  const filtered = statusFilter === 'all' ? tickets : tickets.filter(t => t.status === statusFilter);
  const open = tickets.filter(t => t.status === 'open').length;
  const inProgress = tickets.filter(t => t.status === 'in-progress').length;
  const resolved = tickets.filter(t => t.status === 'resolved').length;
  const totalEstCost = tickets.filter(t => t.status !== 'resolved').reduce((s, t) => s + t.estimatedCost, 0);
  const totalActualCost = tickets.filter(t => t.status === 'resolved').reduce((s, t) => s + (t.actualCost || 0), 0);
  const avgDays = (tickets.reduce((s, t) => s + t.daysOpen, 0) / tickets.length).toFixed(1);

  return (
    <Box sx={{ p: { xs: '16px', md: '20px 24px' }, maxWidth: 1440 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <IconButton onClick={() => onNavigate('home')} size="small" sx={{ color: '#64748B', bgcolor: '#F1F5F9' }}><ArrowBack sx={{ fontSize: 16 }} /></IconButton>
        <Box sx={{ p: '6px', borderRadius: '10px', bgcolor: '#F59E0B12' }}><Build sx={{ fontSize: 20, color: '#F59E0B' }} /></Box>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: '1.4rem', color: '#0F172A' }}>Maintenance</Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>Work orders, costs, assignments, resolution tracking</Typography>
        </Box>
      </Box>

      <Grid container spacing={1.75} sx={{ mb: 2.5 }}>
        {[
          { label: 'Open Tickets', value: open, color: '#DC2626' },
          { label: 'In Progress', value: inProgress, color: '#F59E0B' },
          { label: 'Resolved (Month)', value: resolved, color: '#059669' },
          { label: 'Pending Cost', value: `$${totalEstCost.toLocaleString()}`, color: '#DC2626' },
          { label: 'Resolved Cost', value: `$${totalActualCost.toLocaleString()}`, color: '#059669' },
          { label: 'Avg Days Open', value: avgDays, color: '#2563EB' },
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
          <Card>
            <CardContent sx={{ p: '16px !important' }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#0F172A', mb: 2 }}>Tickets by Category</Typography>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={categoryData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="cat" tick={{ fontSize: 10, fill: '#64748B' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={7}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: '16px !important' }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#0F172A', mb: 2 }}>Revenue Impact</Typography>
              <Alert severity="error" sx={{ mb: 1.5, fontSize: '0.75rem', borderRadius: '8px' }}>
                Unit 203 (HVAC) vacant for 6 days — <strong>$480 vacancy loss</strong> and 2 cancelled tours
              </Alert>
              <Alert severity="warning" sx={{ mb: 1.5, fontSize: '0.75rem', borderRadius: '8px' }}>
                <strong>3 urgent/high tickets</strong> open — potential <strong>$2,800 vacancy risk</strong> if not resolved within 72h
              </Alert>
              <Alert severity="success" sx={{ fontSize: '0.75rem', borderRadius: '8px' }}>
                2 tickets resolved this week — saved estimated <strong>$350</strong> in escalation costs
              </Alert>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
        {['all', 'open', 'in-progress', 'scheduled', 'resolved'].map(s => (
          <Chip key={s} label={s === 'all' ? 'All' : s.replace('-', ' ')} size="small" onClick={() => setStatusFilter(s)}
            sx={{ height: 26, fontSize: '0.65rem', fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize',
              bgcolor: statusFilter === s ? '#0F172A' : '#F1F5F9',
              color: statusFilter === s ? '#fff' : '#64748B',
            }} />
        ))}
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: 'none', border: '1px solid #E2E8F0' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#F8FAFC' }}>
              {['Ticket', 'Unit', 'Category', 'Description', 'Priority', 'Status', 'Assigned', 'Est. Cost', 'Days Open', 'Update Status'].map(h => (
                <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.65rem', color: '#64748B', py: 1.25 }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map(t => {
              const pc = priorityConfig[t.priority];
              const sc = statusConfig[t.status];
              return (
                <TableRow key={t.id} sx={{ '&:hover': { bgcolor: '#F8FAFC' } }}>
                  <TableCell sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#7C3AED', py: 1 }}>{t.id}</TableCell>
                  <TableCell sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#0F172A', py: 1 }}>{t.unit}</TableCell>
                  <TableCell sx={{ fontSize: '0.72rem', color: '#64748B', py: 1 }}>{t.category}</TableCell>
                  <TableCell sx={{ fontSize: '0.68rem', color: '#64748B', py: 1, maxWidth: 160 }}>{t.description}</TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <Chip label={t.priority} size="small" sx={{ height: 18, fontSize: '0.58rem', fontWeight: 700, bgcolor: pc.bg, color: pc.color, textTransform: 'capitalize' }} />
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <Chip label={t.status.replace('-', ' ')} size="small" sx={{ height: 18, fontSize: '0.58rem', fontWeight: 700, bgcolor: sc.bg, color: sc.color, textTransform: 'capitalize' }} />
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.68rem', color: '#64748B', py: 1 }}>{t.assignedTo}</TableCell>
                  <TableCell sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#F59E0B', py: 1 }}>${t.estimatedCost}</TableCell>
                  <TableCell sx={{ fontSize: '0.72rem', fontWeight: 700, color: t.daysOpen >= 5 ? '#DC2626' : '#64748B', py: 1 }}>{t.daysOpen}d</TableCell>
                  <TableCell sx={{ py: 1 }}>
                    {t.status !== 'resolved' && (
                      <Select size="small" value={t.status} onChange={e => updateStatus(t.id, e.target.value)}
                        sx={{ fontSize: '0.65rem', height: 26, minWidth: 100, '& .MuiSelect-select': { py: '2px' } }}>
                        <MenuItem value="open" sx={{ fontSize: '0.72rem' }}>Open</MenuItem>
                        <MenuItem value="in-progress" sx={{ fontSize: '0.72rem' }}>In Progress</MenuItem>
                        <MenuItem value="scheduled" sx={{ fontSize: '0.72rem' }}>Scheduled</MenuItem>
                        <MenuItem value="resolved" sx={{ fontSize: '0.72rem' }}>Resolved</MenuItem>
                      </Select>
                    )}
                    {t.status === 'resolved' && <CheckCircle sx={{ fontSize: 18, color: '#059669' }} />}
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
