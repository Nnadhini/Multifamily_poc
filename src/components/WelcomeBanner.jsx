import React from 'react';
import { Box, Typography, Button, Chip, Avatar, LinearProgress } from '@mui/material';
import { CalendarMonth, FileDownload, Add, WbSunny, TrendingUp, Apartment, People, AttachMoney } from '@mui/icons-material';

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return { text: 'Good morning', icon: <WbSunny /> };
  if (h < 17) return { text: 'Good afternoon', icon: <WbSunny /> };
  return { text: 'Good evening', icon: <WbSunny /> };
};

export default function WelcomeBanner({ community }) {
  const g = getGreeting();
  const occRate = Math.round((community.occupiedUnits / community.totalUnits) * 100);
  const target = 95;

  return (
    <Box sx={{
      mb: 1.75, p: '22px 26px', borderRadius: '18px',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 40%, #0F172A 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Decorative elements */}
      <Box sx={{ position: 'absolute', top: -40, right: -20, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.08), transparent)', pointerEvents: 'none' }} />
      <Box sx={{ position: 'absolute', bottom: -60, right: 120, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.06), transparent)', pointerEvents: 'none' }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
        <Box sx={{ flex: 1 }}>
          {/* Greeting */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
            {React.cloneElement(g.icon, { sx: { fontSize: 16, color: '#FCD34D' } })}
            <Typography sx={{ color: '#94A3B8', fontSize: '0.75rem', fontWeight: 500 }}>{g.text}, Jane</Typography>
          </Box>
          <Typography sx={{ color: '#F8FAFC', fontWeight: 800, fontSize: '1.6rem', letterSpacing: '-0.03em', lineHeight: 1.15, mb: 0.25 }}>
            {community.name}
          </Typography>
          <Typography sx={{ color: '#64748B', fontSize: '0.72rem', mb: 2 }}>{community.address}</Typography>

          {/* Inline Stats */}
          <Box sx={{ display: 'flex', gap: 2.5 }}>
            {[
              { icon: <Apartment />, value: community.totalUnits, label: 'Total Units', color: '#60A5FA' },
              { icon: <People />, value: community.occupiedUnits, label: 'Occupied', color: '#34D399' },
              { icon: <TrendingUp />, value: community.totalUnits - community.occupiedUnits, label: 'Available', color: '#FBBF24' },
              { icon: <AttachMoney />, value: '$284.8K', label: 'Revenue', color: '#A78BFA' },
            ].map(s => (
              <Box key={s.label} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ p: '5px', borderRadius: '8px', bgcolor: `${s.color}15`, display: 'flex' }}>
                  {React.cloneElement(s.icon, { sx: { fontSize: 14, color: s.color } })}
                </Box>
                <Box>
                  <Typography sx={{ color: '#F1F5F9', fontWeight: 800, fontSize: '1.05rem', lineHeight: 1 }}>{s.value}</Typography>
                  <Typography sx={{ color: '#64748B', fontSize: '0.55rem', fontWeight: 500 }}>{s.label}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Right side: Occupancy ring + actions */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1.5 }}>
          {/* Action buttons */}
          <Box sx={{ display: 'flex', gap: 0.75 }}>
            <Button variant="outlined" startIcon={<CalendarMonth sx={{ fontSize: '13px !important' }} />} size="small"
              sx={{ color: '#94A3B8', borderColor: '#334155', fontSize: '0.68rem', height: 30, borderRadius: '8px', '&:hover': { borderColor: '#475569', bgcolor: 'rgba(255,255,255,0.03)' } }}>
              Mar 2026
            </Button>
            <Button variant="outlined" startIcon={<FileDownload sx={{ fontSize: '13px !important' }} />} size="small"
              sx={{ color: '#94A3B8', borderColor: '#334155', fontSize: '0.68rem', height: 30, borderRadius: '8px' }}>
              Export
            </Button>
            <Button variant="contained" startIcon={<Add sx={{ fontSize: '13px !important' }} />} size="small"
              sx={{ fontSize: '0.68rem', height: 30, borderRadius: '8px', background: 'linear-gradient(135deg, #2563EB, #7C3AED)', boxShadow: '0 2px 10px rgba(37,99,235,0.3)' }}>
              Add Unit
            </Button>
          </Box>

          {/* Circular Occupancy Gauge */}
          <Box sx={{ position: 'relative', width: 100, height: 100 }}>
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#1E293B" strokeWidth="6" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="url(#occGauge)" strokeWidth="6"
                strokeDasharray={`${occRate * 2.64} ${264 - occRate * 2.64}`}
                strokeDashoffset="66" strokeLinecap="round"
                style={{ transition: 'stroke-dasharray 1s ease' }} />
              <defs>
                <linearGradient id="occGauge" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#2563EB" />
                  <stop offset="100%" stopColor="#10B981" />
                </linearGradient>
              </defs>
            </svg>
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
              <Typography sx={{ color: '#F8FAFC', fontWeight: 800, fontSize: '1.35rem', lineHeight: 1 }}>{occRate}%</Typography>
              <Typography sx={{ color: '#64748B', fontSize: '0.5rem', fontWeight: 500 }}>Occupied</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography sx={{ color: '#64748B', fontSize: '0.55rem' }}>Target: {target}%</Typography>
            <Box sx={{ width: 50, height: 3, borderRadius: 2, bgcolor: '#1E293B', overflow: 'hidden' }}>
              <Box sx={{ width: `${(occRate/target)*100}%`, height: '100%', borderRadius: 2, background: 'linear-gradient(90deg, #2563EB, #10B981)' }} />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
