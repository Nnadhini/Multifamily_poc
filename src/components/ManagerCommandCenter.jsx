import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Chip, Avatar, Button, IconButton, LinearProgress, Badge, Checkbox, Tooltip, Collapse } from '@mui/material';
import {
  Notifications, CheckCircle, Schedule, Warning, Assignment,
  Email, Phone, ArrowForward, ExpandMore, ExpandLess,
  Flag, Timer, PersonAdd, EventAvailable, PriceChange,
  Campaign, AutoAwesome, Handyman, TrendingUp
} from '@mui/icons-material';

const tasks = [
  { id: 1, title: 'Renew lease - Anna Garcia (Unit 301)', priority: 'urgent', due: 'Due in 2 days', category: 'Lease', done: false, impact: 'Prevent $5,200 turnover cost' },
  { id: 2, title: 'Review pricing for 3 underpriced units', priority: 'high', due: 'This week', category: 'Revenue', done: false, impact: '+$2,840/mo revenue' },
  { id: 3, title: 'Approve Lisa Park application (Unit 201)', priority: 'urgent', due: 'Today', category: 'Application', done: false, impact: 'Fill vacant unit' },
  { id: 4, title: 'Schedule HVAC repair - Unit 203', priority: 'high', due: 'ASAP', category: 'Maintenance', done: false, impact: '2 tours blocked' },
  { id: 5, title: 'Update Unit 302 photos for listings', priority: 'medium', due: 'This week', category: 'Marketing', done: false, impact: '+15% tour conversion' },
  { id: 6, title: 'Send renewal offers (May expirations)', priority: 'medium', due: 'Next week', category: 'Lease', done: false, impact: '14 leases at risk' },
  { id: 7, title: 'Review monthly revenue report', priority: 'low', due: 'End of month', category: 'Admin', done: true, impact: '' },
];

const notifications = [
  { id: 1, type: 'tour', title: 'Tour completed', message: 'Sarah Miller finished self-guided tour of Unit 102', time: '15m ago', avatar: 'SM', color: '#2563EB', bg: '#EFF6FF', unread: true },
  { id: 2, type: 'app', title: 'New application', message: 'Lisa Park submitted application for Unit 201', time: '1h ago', avatar: 'LP', color: '#7C3AED', bg: '#F5F3FF', unread: true },
  { id: 3, type: 'alert', title: 'AI Alert', message: 'Unit 302 vacant 22 days - price reduction recommended', time: '2h ago', avatar: 'AI', color: '#F59E0B', bg: '#FFFBEB', unread: true },
  { id: 4, type: 'maintenance', title: 'Repair completed', message: 'Plumbing fix finished in Unit 107 by MaintenancePro', time: '3h ago', avatar: 'MP', color: '#059669', bg: '#ECFDF5', unread: false },
  { id: 5, type: 'payment', title: 'Payment received', message: '$1,475 rent from James Wilson - Unit 202', time: '4h ago', avatar: 'JW', color: '#0891B2', bg: '#ECFEFF', unread: false },
];

const quickActions = [
  { label: 'Send Tour Invite', icon: <PersonAdd />, color: '#2563EB', bg: '#EFF6FF' },
  { label: 'Bulk Price Update', icon: <PriceChange />, color: '#059669', bg: '#ECFDF5' },
  { label: 'Marketing Blast', icon: <Campaign />, color: '#7C3AED', bg: '#F5F3FF' },
  { label: 'Run AI Analysis', icon: <AutoAwesome />, color: '#F59E0B', bg: '#FFFBEB' },
  { label: 'Schedule Repairs', icon: <Handyman />, color: '#DC2626', bg: '#FEF2F2' },
  { label: 'Export Reports', icon: <TrendingUp />, color: '#0891B2', bg: '#ECFEFF' },
];

const priorityConfig = {
  urgent: { color: '#DC2626', bg: '#FEF2F2', icon: <Flag sx={{ fontSize: 10 }} /> },
  high: { color: '#F59E0B', bg: '#FFFBEB', icon: <Warning sx={{ fontSize: 10 }} /> },
  medium: { color: '#2563EB', bg: '#EFF6FF', icon: <Schedule sx={{ fontSize: 10 }} /> },
  low: { color: '#64748B', bg: '#F1F5F9', icon: <Timer sx={{ fontSize: 10 }} /> },
};

const categoryConfig = {
  Lease: '#7C3AED', Revenue: '#059669', Application: '#2563EB',
  Maintenance: '#D97706', Marketing: '#E11D48', Admin: '#64748B',
};

export default function ManagerCommandCenter() {
  const [tasksDone, setTasksDone] = useState(tasks.filter(t => t.done).map(t => t.id));
  const [showAllTasks, setShowAllTasks] = useState(false);
  const [activeTab, setActiveTab] = useState('tasks');

  const toggleTask = (id) => {
    setTasksDone(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const pendingCount = tasks.length - tasksDone.length;
  const urgentCount = tasks.filter(t => t.priority === 'urgent' && !tasksDone.includes(t.id)).length;
  const unreadNotifs = notifications.filter(n => n.unread).length;
  const displayTasks = showAllTasks ? tasks : tasks.slice(0, 5);

  return (
    <Card sx={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)', border: '1px solid #E2E8F0', '&:hover': { transform: 'none' } }}>
      <CardContent sx={{ p: '20px !important' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <Box sx={{ p: '7px', borderRadius: '10px', background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', display: 'flex' }}>
              <Assignment sx={{ color: '#fff', fontSize: 18 }} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#0F172A' }}>Command Center</Typography>
              <Typography sx={{ color: '#94A3B8', fontSize: '0.65rem' }}>Your daily productivity hub</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip label={`${urgentCount} urgent`} size="small" sx={{ height: 20, fontSize: '0.6rem', fontWeight: 700, bgcolor: '#FEF2F2', color: '#DC2626' }} />
            <Chip label={`${pendingCount} pending`} size="small" sx={{ height: 20, fontSize: '0.6rem', fontWeight: 700, bgcolor: '#EFF6FF', color: '#2563EB' }} />
          </Box>
        </Box>

        {/* Quick Actions Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 1, mb: 2.5 }}>
          {quickActions.map(qa => (
            <Tooltip key={qa.label} title={qa.label} arrow>
              <Box sx={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5,
                p: '10px 4px', borderRadius: '10px', bgcolor: qa.bg, border: `1px solid ${qa.color}15`,
                cursor: 'pointer', transition: 'all 0.2s',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: `0 4px 12px ${qa.color}20`, border: `1px solid ${qa.color}30` },
              }}>
                {React.cloneElement(qa.icon, { sx: { fontSize: 18, color: qa.color } })}
                <Typography sx={{ fontSize: '0.55rem', fontWeight: 600, color: qa.color, textAlign: 'center', lineHeight: 1.2 }}>{qa.label}</Typography>
              </Box>
            </Tooltip>
          ))}
        </Box>

        {/* Tab Toggle */}
        <Box sx={{ display: 'flex', gap: 0.5, mb: 2, p: '3px', bgcolor: '#F1F5F9', borderRadius: '10px' }}>
          {[
            { key: 'tasks', label: 'Tasks', count: pendingCount },
            { key: 'notifications', label: 'Notifications', count: unreadNotifs },
          ].map(tab => (
            <Box key={tab.key} onClick={() => setActiveTab(tab.key)}
              sx={{
                flex: 1, py: '6px', px: 1.5, borderRadius: '8px', cursor: 'pointer', textAlign: 'center',
                bgcolor: activeTab === tab.key ? '#fff' : 'transparent',
                boxShadow: activeTab === tab.key ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.2s',
              }}>
              <Typography sx={{ fontSize: '0.72rem', fontWeight: activeTab === tab.key ? 700 : 500, color: activeTab === tab.key ? '#0F172A' : '#94A3B8' }}>
                {tab.label} <span style={{ fontSize: '0.6rem', fontWeight: 700, color: activeTab === tab.key ? '#2563EB' : '#CBD5E1' }}>({tab.count})</span>
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <Box>
            {/* Progress bar */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography sx={{ fontSize: '0.65rem', color: '#64748B' }}>Daily Progress</Typography>
                <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#0F172A' }}>{tasksDone.length}/{tasks.length} done</Typography>
              </Box>
              <LinearProgress variant="determinate" value={(tasksDone.length / tasks.length) * 100}
                sx={{ height: 6, borderRadius: 3, bgcolor: '#F1F5F9', '& .MuiLinearProgress-bar': { borderRadius: 3, background: 'linear-gradient(90deg, #2563EB, #7C3AED)' } }} />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
              {displayTasks.map(task => {
                const done = tasksDone.includes(task.id);
                const pc = priorityConfig[task.priority];
                return (
                  <Box key={task.id} sx={{
                    display: 'flex', alignItems: 'flex-start', gap: 1, p: '8px 10px', borderRadius: '10px',
                    bgcolor: done ? '#F8FAFC' : '#fff', border: done ? '1px solid #F1F5F9' : `1px solid ${pc.color}15`,
                    opacity: done ? 0.5 : 1, transition: 'all 0.2s',
                    '&:hover': { bgcolor: done ? '#F1F5F9' : `${pc.color}05`, borderColor: `${pc.color}25` },
                  }}>
                    <Checkbox size="small" checked={done} onChange={() => toggleTask(task.id)}
                      sx={{ p: 0, mt: '1px', color: pc.color, '&.Mui-checked': { color: '#10B981' }, '& .MuiSvgIcon-root': { fontSize: 16 } }} />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.25 }}>
                        <Typography sx={{ fontSize: '0.74rem', fontWeight: 600, color: done ? '#94A3B8' : '#0F172A', textDecoration: done ? 'line-through' : 'none', lineHeight: 1.3 }}>
                          {task.title}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                        <Chip label={task.priority} size="small" icon={pc.icon}
                          sx={{ height: 16, fontSize: '0.52rem', fontWeight: 700, bgcolor: pc.bg, color: pc.color, '& .MuiChip-icon': { color: pc.color, fontSize: 10, ml: '4px' }, '& .MuiChip-label': { px: '4px' } }} />
                        <Chip label={task.category} size="small"
                          sx={{ height: 16, fontSize: '0.52rem', fontWeight: 600, bgcolor: `${categoryConfig[task.category]}10`, color: categoryConfig[task.category], '& .MuiChip-label': { px: '4px' } }} />
                        <Typography sx={{ fontSize: '0.56rem', color: '#94A3B8' }}>{task.due}</Typography>
                        {task.impact && !done && <Typography sx={{ fontSize: '0.56rem', color: '#059669', fontWeight: 600 }}>{task.impact}</Typography>}
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
            {tasks.length > 5 && (
              <Button size="small" onClick={() => setShowAllTasks(!showAllTasks)} endIcon={showAllTasks ? <ExpandLess /> : <ExpandMore />}
                sx={{ mt: 1, fontSize: '0.68rem', color: '#64748B', fontWeight: 600, '&:hover': { bgcolor: '#F8FAFC' } }}>
                {showAllTasks ? 'Show Less' : `Show ${tasks.length - 5} More`}
              </Button>
            )}
          </Box>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {notifications.map(n => (
              <Box key={n.id} sx={{
                display: 'flex', gap: 1.25, p: '8px 10px', borderRadius: '10px',
                bgcolor: n.unread ? `${n.color}05` : '#fff',
                border: n.unread ? `1px solid ${n.color}15` : '1px solid #F1F5F9',
                cursor: 'pointer', transition: 'all 0.2s',
                '&:hover': { bgcolor: `${n.color}08` },
              }}>
                <Avatar sx={{ width: 28, height: 28, bgcolor: n.bg, color: n.color, fontSize: 10, fontWeight: 700 }}>{n.avatar}</Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#0F172A' }}>{n.title}</Typography>
                    {n.unread && <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: n.color }} />}
                  </Box>
                  <Typography sx={{ fontSize: '0.68rem', color: '#64748B', lineHeight: 1.3 }}>{n.message}</Typography>
                  <Typography sx={{ fontSize: '0.56rem', color: '#CBD5E1', mt: 0.25 }}>{n.time}</Typography>
                </Box>
              </Box>
            ))}
            <Button fullWidth size="small" sx={{ mt: 0.5, fontSize: '0.68rem', color: '#2563EB', fontWeight: 600 }}>View All Notifications</Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
