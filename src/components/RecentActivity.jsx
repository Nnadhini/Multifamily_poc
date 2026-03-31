import React from 'react';
import { Card, CardContent, Typography, Box, Avatar, Button } from '@mui/material';
import { DirectionsWalk, Description, Build, Payment, Warning } from '@mui/icons-material';
import { recentActivity } from '../mockData';

const iconMap = {
  tour: { icon: <DirectionsWalk sx={{ fontSize: 14 }} />, color: '#2563EB', bg: '#EFF6FF' },
  lease: { icon: <Description sx={{ fontSize: 14 }} />, color: '#7C3AED', bg: '#F5F3FF' },
  maintenance: { icon: <Build sx={{ fontSize: 14 }} />, color: '#D97706', bg: '#FFFBEB' },
  payment: { icon: <Payment sx={{ fontSize: 14 }} />, color: '#059669', bg: '#ECFDF5' },
  alert: { icon: <Warning sx={{ fontSize: 14 }} />, color: '#DC2626', bg: '#FEF2F2' },
};

export default function RecentActivity() {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: '20px !important' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Recent Activity</Typography>
          <Button size="small" sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#2563EB' }}>View All</Button>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {recentActivity.map((item, i) => {
            const cfg = iconMap[item.icon] || iconMap.tour;
            return (
              <Box key={item.id} sx={{ display: 'flex', gap: 1.25, py: 1.25, borderBottom: i < recentActivity.length - 1 ? '1px solid #F1F5F9' : 'none', px: 0.5, cursor: 'pointer', borderRadius: '8px', transition: 'background 0.15s', '&:hover': { bgcolor: '#F8FAFC' } }}>
                <Avatar sx={{ width: 28, height: 28, bgcolor: cfg.bg, color: cfg.color }}>{cfg.icon}</Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: '0.76rem', color: '#0F172A', lineHeight: 1.4 }}>{item.message}</Typography>
                  <Typography sx={{ color: '#94A3B8', fontSize: '0.65rem', mt: 0.15 }}>{item.time}</Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
}
