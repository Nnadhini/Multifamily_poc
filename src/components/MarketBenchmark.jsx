import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const CircularGauge = ({ value, max, label, color, size = 56 }) => {
  const pct = (value / max) * 100;
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.25 }}>
      <Box sx={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#F1F5F9" strokeWidth="4" />
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="4"
            strokeDasharray={circ} strokeDashoffset={offset}
            strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`}
            style={{ transition: 'stroke-dashoffset 1s ease' }} />
        </svg>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
          <Typography sx={{ fontSize: '0.65rem', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>{value}</Typography>
        </Box>
      </Box>
      <Typography sx={{ fontSize: '0.48rem', fontWeight: 600, color: '#94A3B8', textAlign: 'center' }}>{label}</Typography>
    </Box>
  );
};

export default function MarketBenchmark() {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: '16px !important', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#0F172A', mb: 0.25 }}>Market Position</Typography>
        <Typography sx={{ fontSize: '0.65rem', color: '#94A3B8', mb: 1.5 }}>vs local competitors</Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 1.5 }}>
          <CircularGauge value="88%" max={100} label="Occupancy" color="#2563EB" />
          <CircularGauge value="$1.6K" max={100} label="Avg Rent" color="#059669" />
          <CircularGauge value="34%" max={100} label="Conv. Rate" color="#7C3AED" />
        </Box>

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
          {[
            { label: 'You', occ: 88, rent: '$1,650', color: '#2563EB' },
            { label: 'Market Avg', occ: 91, rent: '$1,720', color: '#94A3B8' },
            { label: 'Top 10%', occ: 95, rent: '$1,810', color: '#10B981' },
          ].map(c => (
            <Box key={c.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.75, px: 0.5 }}>
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: c.color, flexShrink: 0 }} />
              <Typography sx={{ fontSize: '0.6rem', fontWeight: c.label === 'You' ? 700 : 400, color: c.label === 'You' ? '#0F172A' : '#94A3B8', flex: 1 }}>{c.label}</Typography>
              <Typography sx={{ fontSize: '0.6rem', fontWeight: 600, color: '#64748B' }}>{c.occ}%</Typography>
              <Typography sx={{ fontSize: '0.6rem', fontWeight: 600, color: '#64748B' }}>{c.rent}</Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
