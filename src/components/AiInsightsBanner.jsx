import React, { useState } from 'react';
import { Box, Typography, Chip, Button, IconButton, Card } from '@mui/material';
import { AutoAwesome, ArrowForward, ChevronLeft, ChevronRight, Close, TrendingUp, Warning, People, Tour, Build } from '@mui/icons-material';
import { aiInsights, revenueOpportunities } from '../mockData';

const iconMap = {
  money: { icon: <TrendingUp sx={{ fontSize: 16 }} />, color: '#059669' },
  alert: { icon: <Warning sx={{ fontSize: 16 }} />, color: '#DC2626' },
  people: { icon: <People sx={{ fontSize: 16 }} />, color: '#7C3AED' },
  tour: { icon: <Tour sx={{ fontSize: 16 }} />, color: '#2563EB' },
  tool: { icon: <Build sx={{ fontSize: 16 }} />, color: '#D97706' },
};

export default function AiInsightsBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissed, setDismissed] = useState([]);
  const visible = aiInsights.filter(i => !dismissed.includes(i.id));
  if (visible.length === 0) return null;
  const current = visible[currentIndex % visible.length];
  const cfg = iconMap[current.icon];

  return (
    <Card sx={{
      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)',
      border: '1px solid #334155', borderRadius: '14px',
      '&:hover': { transform: 'none', boxShadow: '0 8px 24px rgba(15,23,42,0.2)' },
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', p: '14px 18px', gap: 2 }}>
        {/* AI Badge */}
        <Box sx={{ p: '8px', borderRadius: '10px', background: 'linear-gradient(135deg, #7C3AED, #2563EB)', display: 'flex', flexShrink: 0 }}>
          <AutoAwesome sx={{ color: '#fff', fontSize: 18 }} />
        </Box>

        {/* Revenue Summary */}
        <Box sx={{ display: 'flex', gap: 2, flexShrink: 0 }}>
          <Box>
            <Typography sx={{ color: '#10B981', fontWeight: 800, fontSize: '1.1rem', lineHeight: 1 }}>${revenueOpportunities.totalOpportunity.toLocaleString()}</Typography>
            <Typography sx={{ color: '#64748B', fontSize: '0.55rem' }}>Monthly opportunity</Typography>
          </Box>
          <Box sx={{ width: 1, bgcolor: '#334155' }} />
        </Box>

        {/* Current Insight */}
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
          {React.cloneElement(cfg.icon, { sx: { color: cfg.color, fontSize: 18, flexShrink: 0 } })}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ color: '#F1F5F9', fontWeight: 600, fontSize: '0.78rem', lineHeight: 1.2 }} noWrap>{current.title}</Typography>
            <Typography sx={{ color: '#94A3B8', fontSize: '0.68rem', lineHeight: 1.3 }} noWrap>{current.description}</Typography>
          </Box>
        </Box>

        {/* Impact + Action */}
        <Chip label={current.impact} size="small" sx={{ bgcolor: '#059669', color: '#fff', fontWeight: 700, fontSize: '0.62rem', height: 22, flexShrink: 0 }} />
        <Button size="small" endIcon={<ArrowForward sx={{ fontSize: '12px !important' }} />}
          sx={{ color: '#60A5FA', fontSize: '0.68rem', fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0, '&:hover': { bgcolor: 'rgba(37,99,235,0.1)' } }}>
          {current.action}
        </Button>

        {/* Navigation */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, flexShrink: 0 }}>
          <IconButton size="small" onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            sx={{ color: '#475569', p: '3px', '&:hover': { color: '#94A3B8' } }}>
            <ChevronLeft sx={{ fontSize: 16 }} />
          </IconButton>
          <Typography sx={{ color: '#475569', fontSize: '0.6rem', fontWeight: 600, minWidth: 24, textAlign: 'center' }}>
            {(currentIndex % visible.length) + 1}/{visible.length}
          </Typography>
          <IconButton size="small" onClick={() => setCurrentIndex(currentIndex + 1)}
            sx={{ color: '#475569', p: '3px', '&:hover': { color: '#94A3B8' } }}>
            <ChevronRight sx={{ fontSize: 16 }} />
          </IconButton>
          <IconButton size="small" onClick={() => setDismissed([...dismissed, current.id])}
            sx={{ color: '#334155', p: '3px', ml: 0.5, '&:hover': { color: '#EF4444' } }}>
            <Close sx={{ fontSize: 14 }} />
          </IconButton>
        </Box>
      </Box>

      {/* Progress dots */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5, pb: 1 }}>
        {visible.map((_, i) => (
          <Box key={i} onClick={() => setCurrentIndex(i)} sx={{
            width: i === currentIndex % visible.length ? 16 : 5, height: 5, borderRadius: 3,
            bgcolor: i === currentIndex % visible.length ? '#2563EB' : '#334155',
            cursor: 'pointer', transition: 'all 0.2s',
          }} />
        ))}
      </Box>
    </Card>
  );
}
