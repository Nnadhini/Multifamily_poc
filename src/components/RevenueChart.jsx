import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { m: 'O', r: 261 }, { m: 'N', r: 268 }, { m: 'D', r: 265 },
  { m: 'J', r: 272 }, { m: 'F', r: 279 }, { m: 'M', r: 285 },
];

export default function RevenueChart() {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: '16px !important', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#0F172A' }}>Revenue</Typography>
            <Typography sx={{ fontSize: '0.65rem', color: '#94A3B8' }}>Last 6 months</Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#0F172A', lineHeight: 1 }}>$285K</Typography>
            <Chip label="+5.1%" size="small" sx={{ height: 16, fontSize: '0.5rem', fontWeight: 700, bgcolor: '#ECFDF5', color: '#059669', mt: 0.25 }} />
          </Box>
        </Box>
        <Box sx={{ flex: 1, minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: -25 }} barCategoryGap="30%">
              <XAxis dataKey="m" tick={{ fontSize: 9, fill: '#CBD5E1' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: '#CBD5E1' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}K`} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 11 }} formatter={(v) => [`$${v}K`]} />
              <Bar dataKey="r" fill="#2563EB" radius={[4, 4, 0, 0]} name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}
