import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { tourFunnelData } from '../mockData';

export default function TourConversionFunnel() {
  const max = tourFunnelData[0].value;
  const overall = ((tourFunnelData[4].value / max) * 100).toFixed(1);

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: '16px !important' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#0F172A' }}>Lead Funnel</Typography>
            <Typography sx={{ fontSize: '0.65rem', color: '#94A3B8' }}>This month</Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography sx={{ fontWeight: 800, fontSize: '1.2rem', color: '#059669', lineHeight: 1 }}>{overall}%</Typography>
            <Typography sx={{ fontSize: '0.5rem', color: '#94A3B8' }}>Conv. rate</Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
          {tourFunnelData.map((item, i) => {
            const widthPct = 55 + (45 * item.value / max);
            const drop = i > 0 ? (((tourFunnelData[i-1].value - item.value) / tourFunnelData[i-1].value) * 100).toFixed(0) : null;
            return (
              <React.Fragment key={item.stage}>
                {i > 0 && (
                  <Box sx={{ height: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography sx={{ fontSize: '0.48rem', color: '#EF4444', fontWeight: 700 }}>-{drop}%</Typography>
                  </Box>
                )}
                <Box sx={{
                  width: `${widthPct}%`, minWidth: 100,
                  background: `linear-gradient(135deg, ${item.color}10, ${item.color}05)`,
                  border: `1px solid ${item.color}20`,
                  borderRadius: '8px', p: '5px 10px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  transition: 'all 0.2s',
                  '&:hover': { background: `${item.color}15`, transform: 'scale(1.02)' },
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: item.color }} />
                    <Typography sx={{ fontSize: '0.62rem', fontWeight: 600, color: '#334155' }}>{item.stage}</Typography>
                  </Box>
                  <Typography sx={{ fontSize: '0.82rem', fontWeight: 800, color: item.color }}>{item.value}</Typography>
                </Box>
              </React.Fragment>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
}
