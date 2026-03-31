import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const data = [
  { month: 'Oct', actual: 82 }, { month: 'Nov', actual: 84 }, { month: 'Dec', actual: 83 },
  { month: 'Jan', actual: 86 }, { month: 'Feb', actual: 87 }, { month: 'Mar', actual: 88.5 },
  { month: 'Apr', predicted: 89.2, upper: 91.0, lower: 87.5 },
  { month: 'May', predicted: 87.1, upper: 90.2, lower: 84.0 },
  { month: 'Jun', predicted: 85.5, upper: 89.0, lower: 82.0 },
  { month: 'Jul', predicted: 88.0, upper: 90.5, lower: 85.5 },
];

export default function OccupancyChart() {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: '18px !important', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: '0.92rem', color: '#0F172A' }}>Occupancy & Forecast</Typography>
            <Typography sx={{ fontSize: '0.68rem', color: '#94A3B8' }}>6-month history + AI prediction</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Chip icon={<Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#2563EB', ml: '6px !important' }} />} label="Actual" size="small" sx={{ height: 18, fontSize: '0.55rem', bgcolor: '#EFF6FF', color: '#2563EB', fontWeight: 600, '& .MuiChip-label': { pr: '6px' } }} />
            <Chip icon={<Box sx={{ width: 6, height: 2.5, borderRadius: 1, bgcolor: '#7C3AED', ml: '6px !important' }} />} label="AI" size="small" sx={{ height: 18, fontSize: '0.55rem', bgcolor: '#F5F3FF', color: '#7C3AED', fontWeight: 600, '& .MuiChip-label': { pr: '6px' } }} />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.25, mb: 1.5 }}>
          {[
            { label: 'Current', value: '88.5%', sub: '+2.3%', color: '#059669' },
            { label: 'Predicted Jul', value: '88.0%', sub: 'Stable', color: '#7C3AED' },
            { label: 'At-Risk Units', value: '17', sub: '-3 vs last', color: '#059669' },
          ].map(s => (
            <Box key={s.label} sx={{ flex: 1, p: '8px 10px', borderRadius: '10px', bgcolor: '#F8FAFC', border: '1px solid #F1F5F9' }}>
              <Typography sx={{ fontSize: '0.52rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.4 }}>
                <Typography sx={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>{s.value}</Typography>
                <Typography sx={{ fontSize: '0.5rem', color: s.color, fontWeight: 700 }}>{s.sub}</Typography>
              </Box>
            </Box>
          ))}
        </Box>

        <Box sx={{ flex: 1, minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="actG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="predB" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.06} />
                  <stop offset="100%" stopColor="#7C3AED" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: '#94A3B8' }} axisLine={false} tickLine={false} domain={[78, 100]} unit="%" />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 11 }} />
              <Area type="monotone" dataKey="upper" stroke="none" fill="url(#predB)" />
              <Area type="monotone" dataKey="lower" stroke="none" fill="#FFFFFF" />
              <Area type="monotone" dataKey="actual" stroke="#2563EB" strokeWidth={2.5} fill="url(#actG)" dot={{ r: 3, fill: '#2563EB', stroke: '#fff', strokeWidth: 2 }} />
              <Area type="monotone" dataKey="predicted" stroke="#7C3AED" strokeWidth={2} strokeDasharray="6 3" fill="none" dot={{ r: 3, fill: '#7C3AED', stroke: '#fff', strokeWidth: 2 }} />
              <ReferenceLine x="Mar" stroke="#CBD5E1" strokeDasharray="4 4" />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}
