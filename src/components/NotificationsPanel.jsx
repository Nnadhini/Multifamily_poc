import React from 'react';
import { Card, CardContent, Typography, Box, Avatar, Button, Badge } from '@mui/material';
import { Notifications } from '@mui/icons-material';

const notifications = [
  { id: 1, title: 'Tour completed', msg: 'Sarah Miller - Unit 102 self-guided tour', time: '15m', avatar: 'SM', color: '#2563EB', bg: '#EFF6FF', unread: true },
  { id: 2, title: 'New application', msg: 'Lisa Park applied for Unit 201', time: '1h', avatar: 'LP', color: '#7C3AED', bg: '#F5F3FF', unread: true },
  { id: 3, title: 'AI Price Alert', msg: 'Unit 302 overpriced - reduction recommended', time: '2h', avatar: 'AI', color: '#F59E0B', bg: '#FFFBEB', unread: true },
  { id: 4, title: 'Repair completed', msg: 'Unit 107 plumbing fixed', time: '3h', avatar: 'MP', color: '#059669', bg: '#ECFDF5', unread: false },
  { id: 5, title: 'Payment received', msg: '$1,475 from James Wilson - Unit 202', time: '4h', avatar: 'JW', color: '#0891B2', bg: '#ECFEFF', unread: false },
];

export default function NotificationsPanel() {
  const unread = notifications.filter(n => n.unread).length;
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ p: '18px !important', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Badge badgeContent={unread} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.5rem', height: 14, minWidth: 14 } }}>
              <Notifications sx={{ fontSize: 16, color: '#2563EB' }} />
            </Badge>
            <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#0F172A' }}>Notifications</Typography>
          </Box>
          <Button size="small" sx={{ fontSize: '0.62rem', fontWeight: 600, color: '#2563EB', minWidth: 'auto' }}>Mark all read</Button>
        </Box>

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.5, overflowY: 'auto', '&::-webkit-scrollbar': { width: 3 }, '&::-webkit-scrollbar-thumb': { bgcolor: '#E2E8F0', borderRadius: 3 } }}>
          {notifications.map(n => (
            <Box key={n.id} sx={{
              display: 'flex', gap: 1, p: '8px 10px', borderRadius: '10px',
              bgcolor: n.unread ? `${n.color}04` : '#fff',
              border: `1px solid ${n.unread ? n.color + '12' : '#F1F5F9'}`,
              cursor: 'pointer', transition: 'all 0.2s',
              '&:hover': { bgcolor: `${n.color}06`, borderColor: `${n.color}20` },
            }}>
              <Avatar sx={{ width: 30, height: 30, bgcolor: n.bg, color: n.color, fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{n.avatar}</Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#0F172A' }}>{n.title}</Typography>
                  {n.unread && <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: n.color, flexShrink: 0 }} />}
                  <Typography sx={{ fontSize: '0.55rem', color: '#CBD5E1', ml: 'auto', flexShrink: 0 }}>{n.time}</Typography>
                </Box>
                <Typography sx={{ fontSize: '0.66rem', color: '#64748B', lineHeight: 1.3 }} noWrap>{n.msg}</Typography>
              </Box>
            </Box>
          ))}
        </Box>

        <Button fullWidth size="small" sx={{ mt: 1.5, fontSize: '0.68rem', color: '#64748B', fontWeight: 600, bgcolor: '#F8FAFC', borderRadius: '8px', '&:hover': { bgcolor: '#F1F5F9' } }}>
          View All Notifications
        </Button>
      </CardContent>
    </Card>
  );
}
