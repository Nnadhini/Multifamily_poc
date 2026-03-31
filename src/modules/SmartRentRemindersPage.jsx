import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Chip, IconButton, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Switch, Alert } from '@mui/material';
import { ArrowBack, NotificationsActive, CheckCircle, Warning, Error, Schedule } from '@mui/icons-material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { rentPayments } from '../mockData';

const reminderSchedule = [
  { trigger: '7 days before', type: 'email', enabled: true, desc: 'Friendly reminder email' },
  { trigger: '3 days before', type: 'SMS', enabled: true, desc: 'SMS payment reminder' },
  { trigger: '1 day before', type: 'email+SMS', enabled: true, desc: 'Final reminder with payment link' },
  { trigger: 'Day of due date', type: 'push', enabled: true, desc: 'Push notification with 1-click pay' },
  { trigger: '3 days overdue', type: 'email+SMS', enabled: true, desc: 'Overdue notice with late fee warning' },
  { trigger: '7 days overdue', type: 'call', enabled: false, desc: 'Auto-call reminder (requires phone)' },
];

const methodData = [
  { name: 'ACH', value: 45, color: '#2563EB' },
  { name: 'Card', value: 30, color: '#7C3AED' },
  { name: 'Check', value: 15, color: '#F59E0B' },
  { name: 'Pending', value: 10, color: '#94A3B8' },
];

const statusConfig = {
  paid: { icon: CheckCircle, color: '#059669', bg: '#05966912', label: 'Paid' },
  partial: { icon: Warning, color: '#F59E0B', bg: '#F59E0B12', label: 'Partial' },
  overdue: { icon: Error, color: '#DC2626', bg: '#DC262612', label: 'Overdue' },
  upcoming: { icon: Schedule, color: '#2563EB', bg: '#2563EB12', label: 'Upcoming' },
};

export default function SmartRentRemindersPage({ onNavigate }) {
  const [schedule, setSchedule] = useState(reminderSchedule);
  const [payments, setPayments] = useState(rentPayments);
  const [remindSent, setRemindSent] = useState({});

  const toggleReminder = (i) => setSchedule(prev => prev.map((r, idx) => idx === i ? { ...r, enabled: !r.enabled } : r));
  const sendReminder = (id) => setRemindSent(prev => ({ ...prev, [id]: true }));

  const overdue = payments.filter(p => p.status === 'overdue');
  const collectionRate = Math.round((payments.filter(p => p.status === 'paid').length / payments.filter(p => p.status !== 'upcoming').length) * 100);
  const lateFeesTotal = payments.reduce((s, p) => s + p.lateFee, 0);
  const overdueAmount = overdue.reduce((s, p) => s + (p.amountDue - p.amountPaid), 0);

  return (
    <Box sx={{ p: { xs: '16px', md: '20px 24px' }, maxWidth: 1440 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <IconButton onClick={() => onNavigate('home')} size="small" sx={{ color: '#64748B', bgcolor: '#F1F5F9' }}><ArrowBack sx={{ fontSize: 16 }} /></IconButton>
        <Box sx={{ p: '6px', borderRadius: '10px', bgcolor: '#F59E0B12' }}><NotificationsActive sx={{ fontSize: 20, color: '#F59E0B' }} /></Box>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: '1.4rem', color: '#0F172A' }}>Smart Rent Reminders</Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>Automated payment reminders — collection rate: <strong style={{ color: '#059669' }}>{collectionRate}%</strong></Typography>
        </Box>
      </Box>

      {overdueAmount > 0 && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: '10px', fontSize: '0.78rem' }}>
          <strong>${overdueAmount.toLocaleString()} overdue</strong> across {overdue.length} units. Automated reminders will be sent tonight. Late fees accrued: <strong>${lateFeesTotal}</strong>.
        </Alert>
      )}

      <Grid container spacing={1.75} sx={{ mb: 2.5 }}>
        {[
          { label: 'Collection Rate', value: `${collectionRate}%`, color: '#059669' },
          { label: 'Overdue Units', value: overdue.length, color: '#DC2626' },
          { label: 'Overdue Amount', value: `$${overdueAmount.toLocaleString()}`, color: '#DC2626' },
          { label: 'Late Fees Accrued', value: `$${lateFeesTotal}`, color: '#F59E0B' },
          { label: 'Active Reminders', value: schedule.filter(r => r.enabled).length, color: '#2563EB' },
        ].map(s => (
          <Grid item xs={6} md key={s.label}>
            <Card><CardContent sx={{ p: '14px !important' }}>
              <Typography sx={{ fontSize: '0.6rem', color: '#94A3B8', fontWeight: 600, mb: 0.5 }}>{s.label}</Typography>
              <Typography sx={{ fontWeight: 800, fontSize: '1.3rem', color: s.color, lineHeight: 1 }}>{s.value}</Typography>
            </CardContent></Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2} sx={{ mb: 2.5 }}>
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent sx={{ p: '16px !important' }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#0F172A', mb: 1.5 }}>Automated Reminder Schedule</Typography>
              {schedule.map((r, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1, borderBottom: i < schedule.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A' }}>{r.trigger}</Typography>
                    <Typography sx={{ fontSize: '0.65rem', color: '#94A3B8' }}>{r.desc}</Typography>
                  </Box>
                  <Chip label={r.type} size="small" sx={{ mx: 1.5, height: 20, fontSize: '0.6rem', bgcolor: '#2563EB12', color: '#2563EB', fontWeight: 600 }} />
                  <Switch size="small" checked={r.enabled} onChange={() => toggleReminder(i)}
                    sx={{ '& .MuiSwitch-track': { bgcolor: r.enabled ? '#059669' : '#E2E8F0' } }} />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={5}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: '16px !important' }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#0F172A', mb: 1 }}>Payment Method Distribution</Typography>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={methodData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label={({ name, value }) => `${name} ${value}%`} labelLine={false}>
                    {methodData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip formatter={v => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#0F172A', mb: 1.5 }}>Payment Status — Current Month</Typography>
      <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: 'none', border: '1px solid #E2E8F0' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#F8FAFC' }}>
              {['Unit', 'Tenant', 'Amount Due', 'Status', 'Due Date', 'Days Overdue', 'Late Fee', 'Reminder', 'Action'].map(h => (
                <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.65rem', color: '#64748B', py: 1.25 }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map(p => {
              const cfg = statusConfig[p.status];
              const Icon = cfg.icon;
              const daysOverdue = p.status === 'overdue' ? Math.round((new Date('2026-03-31') - new Date(p.dueDate)) / (1000 * 60 * 60 * 24)) : 0;
              return (
                <TableRow key={p.id} sx={{ '&:hover': { bgcolor: '#F8FAFC' } }}>
                  <TableCell sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#0F172A', py: 1 }}>{p.unit}</TableCell>
                  <TableCell sx={{ fontSize: '0.72rem', color: '#64748B', py: 1 }}>{p.tenant}</TableCell>
                  <TableCell sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#0F172A', py: 1 }}>${p.amountDue.toLocaleString()}</TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Icon sx={{ fontSize: 14, color: cfg.color }} />
                      <Chip label={cfg.label} size="small" sx={{ height: 18, fontSize: '0.58rem', fontWeight: 700, bgcolor: cfg.bg, color: cfg.color }} />
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.68rem', color: '#64748B', py: 1 }}>{p.dueDate}</TableCell>
                  <TableCell sx={{ fontSize: '0.72rem', fontWeight: p.status === 'overdue' ? 700 : 400, color: p.status === 'overdue' ? '#DC2626' : '#94A3B8', py: 1 }}>
                    {p.status === 'overdue' ? `${daysOverdue}d` : '—'}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.72rem', fontWeight: 700, color: p.lateFee > 0 ? '#DC2626' : '#94A3B8', py: 1 }}>
                    {p.lateFee > 0 ? `$${p.lateFee}` : '—'}
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>
                    {remindSent[p.id] ? (
                      <Chip label="Sent" size="small" sx={{ bgcolor: '#05966912', color: '#059669', fontWeight: 700, fontSize: '0.58rem', height: 18 }} />
                    ) : (
                      <Chip label={p.status === 'paid' ? 'Not Needed' : 'Pending'} size="small"
                        sx={{ bgcolor: p.status === 'paid' ? '#F1F5F9' : '#F59E0B12', color: p.status === 'paid' ? '#94A3B8' : '#F59E0B', fontWeight: 600, fontSize: '0.58rem', height: 18 }} />
                    )}
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>
                    {(p.status === 'overdue' || p.status === 'partial' || p.status === 'upcoming') && !remindSent[p.id] && (
                      <Button variant="outlined" size="small" onClick={() => sendReminder(p.id)}
                        sx={{ fontSize: '0.6rem', height: 24, borderRadius: '6px', borderColor: '#F59E0B', color: '#F59E0B', minWidth: 72 }}>
                        Remind
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
