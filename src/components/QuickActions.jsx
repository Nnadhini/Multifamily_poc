import React from 'react';
import { Card, CardContent, Typography, Box, Tooltip } from '@mui/material';
import { PersonAdd, PriceChange, Campaign, AutoAwesome, Handyman, TrendingUp } from '@mui/icons-material';

const actions = [
  { label: 'Tour Invite', icon: <PersonAdd />, color: '#2563EB', bg: '#EFF6FF' },
  { label: 'Bulk Pricing', icon: <PriceChange />, color: '#059669', bg: '#ECFDF5' },
  { label: 'Marketing', icon: <Campaign />, color: '#7C3AED', bg: '#F5F3FF' },
  { label: 'AI Analysis', icon: <AutoAwesome />, color: '#F59E0B', bg: '#FFFBEB' },
  { label: 'Repairs', icon: <Handyman />, color: '#DC2626', bg: '#FEF2F2' },
  { label: 'Reports', icon: <TrendingUp />, color: '#0891B2', bg: '#ECFEFF' },
];

export default function QuickActions() {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: '16px !important', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#0F172A', mb: 1.25 }}>Quick Actions</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0.75, flex: 1 }}>
          {actions.map(a => (
            <Tooltip key={a.label} title={a.label} arrow>
              <Box sx={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 0.5,
                p: 1, borderRadius: '10px', bgcolor: a.bg, border: `1px solid ${a.color}10`,
                cursor: 'pointer', transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: `0 6px 16px ${a.color}18`, border: `1px solid ${a.color}25` },
              }}>
                {React.cloneElement(a.icon, { sx: { fontSize: 18, color: a.color } })}
                <Typography sx={{ fontSize: '0.52rem', fontWeight: 600, color: a.color, textAlign: 'center', lineHeight: 1.1 }}>{a.label}</Typography>
              </Box>
            </Tooltip>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
