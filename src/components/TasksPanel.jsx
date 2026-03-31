import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Chip, Checkbox, LinearProgress, Button } from '@mui/material';
import { Flag, Warning, Schedule, Timer, ExpandMore, CheckCircleOutline } from '@mui/icons-material';

const tasks = [
  { id: 1, title: 'Renew lease - Anna Garcia (Unit 301)', priority: 'urgent', due: '2 days', category: 'Lease', impact: '$5,200 turnover cost' },
  { id: 2, title: 'Review pricing for 3 underpriced units', priority: 'high', due: 'This week', category: 'Revenue', impact: '+$2,840/mo' },
  { id: 3, title: 'Approve Lisa Park application', priority: 'urgent', due: 'Today', category: 'Application', impact: 'Fill unit' },
  { id: 4, title: 'Schedule HVAC repair - Unit 203', priority: 'high', due: 'ASAP', category: 'Maintenance', impact: '2 tours blocked' },
  { id: 5, title: 'Update Unit 302 listing photos', priority: 'medium', due: 'This week', category: 'Marketing', impact: '+15% conversion' },
  { id: 6, title: 'Send renewal offers (May batch)', priority: 'medium', due: 'Next week', category: 'Lease', impact: '14 at risk' },
];

const pCfg = {
  urgent: { color: '#DC2626', bg: '#FEF2F2', icon: <Flag sx={{ fontSize: 9 }} /> },
  high: { color: '#F59E0B', bg: '#FFFBEB', icon: <Warning sx={{ fontSize: 9 }} /> },
  medium: { color: '#2563EB', bg: '#EFF6FF', icon: <Schedule sx={{ fontSize: 9 }} /> },
};
const catColors = { Lease: '#7C3AED', Revenue: '#059669', Application: '#2563EB', Maintenance: '#D97706', Marketing: '#E11D48' };

export default function TasksPanel() {
  const [done, setDone] = useState([]);
  const toggle = (id) => setDone(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ p: '18px !important', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <CheckCircleOutline sx={{ fontSize: 16, color: '#2563EB' }} />
            <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#0F172A' }}>Tasks</Typography>
            <Chip label={`${tasks.length - done.length} pending`} size="small" sx={{ height: 18, fontSize: '0.55rem', fontWeight: 700, bgcolor: '#EFF6FF', color: '#2563EB' }} />
          </Box>
          <Typography sx={{ fontSize: '0.65rem', color: '#94A3B8', fontWeight: 600 }}>{done.length}/{tasks.length}</Typography>
        </Box>

        <LinearProgress variant="determinate" value={(done.length/tasks.length)*100}
          sx={{ height: 4, borderRadius: 2, mb: 1.5, bgcolor: '#F1F5F9', '& .MuiLinearProgress-bar': { borderRadius: 2, background: 'linear-gradient(90deg, #2563EB, #7C3AED)' } }} />

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.5, overflowY: 'auto', '&::-webkit-scrollbar': { width: 3 }, '&::-webkit-scrollbar-thumb': { bgcolor: '#E2E8F0', borderRadius: 3 } }}>
          {tasks.map(t => {
            const isDone = done.includes(t.id);
            const pc = pCfg[t.priority];
            return (
              <Box key={t.id} sx={{
                display: 'flex', alignItems: 'flex-start', gap: 0.75, p: '7px 8px', borderRadius: '8px',
                border: `1px solid ${isDone ? '#F1F5F9' : pc.color + '12'}`, bgcolor: isDone ? '#FAFAFA' : '#fff',
                opacity: isDone ? 0.45 : 1, transition: 'all 0.2s',
                '&:hover': { bgcolor: isDone ? '#F1F5F9' : `${pc.color}04`, borderColor: `${pc.color}20` },
              }}>
                <Checkbox size="small" checked={isDone} onChange={() => toggle(t.id)}
                  sx={{ p: 0, mt: '2px', color: pc.color, '&.Mui-checked': { color: '#10B981' }, '& .MuiSvgIcon-root': { fontSize: 15 } }} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: '0.72rem', fontWeight: 600, color: isDone ? '#94A3B8' : '#0F172A', textDecoration: isDone ? 'line-through' : 'none', lineHeight: 1.25, mb: 0.25 }}>{t.title}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                    <Chip label={t.priority} icon={pc.icon} size="small"
                      sx={{ height: 14, fontSize: '0.48rem', fontWeight: 700, bgcolor: pc.bg, color: pc.color, '& .MuiChip-icon': { color: pc.color, ml: '3px' }, '& .MuiChip-label': { px: '3px' } }} />
                    <Chip label={t.category} size="small"
                      sx={{ height: 14, fontSize: '0.48rem', fontWeight: 600, bgcolor: `${catColors[t.category]}08`, color: catColors[t.category], '& .MuiChip-label': { px: '3px' } }} />
                    <Typography sx={{ fontSize: '0.5rem', color: '#94A3B8' }}>{t.due}</Typography>
                    {!isDone && <Typography sx={{ fontSize: '0.5rem', color: '#059669', fontWeight: 700 }}>{t.impact}</Typography>}
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
}
