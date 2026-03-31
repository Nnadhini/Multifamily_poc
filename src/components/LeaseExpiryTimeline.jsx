import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { EventBusy } from '@mui/icons-material';
import { leaseExpirations } from '../mockData';

const riskColors = {
  low: { bg: '#ECFDF5', color: '#059669', border: '#D1FAE5', label: 'Low Risk' },
  medium: { bg: '#FFFBEB', color: '#D97706', border: '#FEF3C7', label: 'Monitor' },
  high: { bg: '#FEF2F2', color: '#DC2626', border: '#FEE2E2', label: 'Action Needed' },
};

export default function LeaseExpiryTimeline() {
  const total = leaseExpirations.reduce((s, l) => s + l.count, 0);
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: '20px !important' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EventBusy sx={{ fontSize: 18, color: '#DC2626' }} />
            <Box>
              <Typography variant="h6" sx={{ mb: 0 }}>Lease Expirations</Typography>
              <Typography variant="body2">Next 6 months</Typography>
            </Box>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography sx={{ fontWeight: 800, fontSize: '1.15rem', color: '#0F172A' }}>{total}</Typography>
            <Typography sx={{ fontSize: '0.6rem', color: '#94A3B8' }}>Total expiring</Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {leaseExpirations.map(({ month, count, risk }) => {
            const rc = riskColors[risk];
            return (
              <Box key={month} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: '8px 12px', borderRadius: '10px', bgcolor: rc.bg, border: `1px solid ${rc.border}`, transition: 'transform 0.15s', '&:hover': { transform: 'translateX(4px)' } }}>
                <Typography sx={{ fontWeight: 700, color: rc.color, minWidth: 28, fontSize: '0.8rem' }}>{month}</Typography>
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: '3px' }}>
                  {Array.from({ length: Math.min(count, 20) }).map((_, i) => (
                    <Box key={i} sx={{ width: 8, height: 8, borderRadius: '2px', bgcolor: rc.color, opacity: 0.6 + (i/count)*0.4 }} />
                  ))}
                </Box>
                <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', color: '#0F172A', minWidth: 20, textAlign: 'right' }}>{count}</Typography>
                <Chip label={rc.label} size="small" sx={{ height: 18, fontSize: '0.58rem', fontWeight: 700, bgcolor: 'transparent', color: rc.color, border: `1px solid ${rc.color}33`, '& .MuiChip-label': { px: '5px' } }} />
              </Box>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
}
