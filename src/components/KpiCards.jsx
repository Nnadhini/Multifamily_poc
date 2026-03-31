import React from 'react';
import { Box, Card, CardContent, Typography, Grid } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';
import { kpiData } from '../mockData';

const sparkData = {
  occ: [82,84,83,86,87,88.5],
  rev: [261,268,265,272,279,285],
  tours: [55,48,52,45,46,42],
  conv: [28,30,31,29,33,34.2],
  maint: [18,16,20,15,14,12],
  vacant: [24,22,21,20,19,18],
};

const MiniSparkline = ({ data, color, height = 24, width = 60 }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => `${(i/(data.length-1))*width},${height - ((v-min)/range)*height}`).join(' ');
  const fill = pts + ` ${width},${height} 0,${height}`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <polygon points={fill} fill={`${color}12`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={width} cy={parseFloat(pts.split(' ').pop().split(',')[1])} r="2" fill={color} />
    </svg>
  );
};

const kpis = [
  { label: 'Occupancy', value: `${kpiData.occupancyRate}%`, change: kpiData.occupancyChange, color: '#2563EB', spark: sparkData.occ },
  { label: 'Revenue', value: `$${(kpiData.monthlyRevenue/1000).toFixed(1)}K`, change: kpiData.revenueChange, color: '#059669', spark: sparkData.rev },
  { label: 'Tours', value: kpiData.activeTours, change: kpiData.toursChange, color: '#7C3AED', spark: sparkData.tours },
  { label: 'Conversion', value: `${kpiData.tourConversion}%`, change: kpiData.conversionChange, color: '#0891B2', spark: sparkData.conv },
  { label: 'Maintenance', value: kpiData.pendingMaintenance, change: kpiData.maintenanceChange, color: '#D97706', spark: sparkData.maint },
  { label: 'Days Vacant', value: kpiData.avgDaysVacant, change: kpiData.daysVacantChange, color: '#DC2626', spark: sparkData.vacant },
];

export default function KpiCards() {
  return (
    <Grid container spacing={1.5}>
      {kpis.map(({ label, value, change, color, spark }) => (
        <Grid item xs={6} sm={4} md={2} key={label}>
          <Card sx={{ height: '100%', cursor: 'pointer' }}>
            <CardContent sx={{ p: '14px !important' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography sx={{ color: '#94A3B8', fontWeight: 600, fontSize: '0.6rem', mb: 0.5 }}>{label}</Typography>
                  <Typography sx={{ fontWeight: 800, color: '#0F172A', fontSize: '1.3rem', lineHeight: 1 }}>{value}</Typography>
                </Box>
                <MiniSparkline data={spark} color={color} />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.35, mt: 0.75 }}>
                {change >= 0 ? <TrendingUp sx={{ fontSize: 12, color: '#059669' }} /> : <TrendingDown sx={{ fontSize: 12, color: '#DC2626' }} />}
                <Typography sx={{ fontSize: '0.58rem', fontWeight: 700, color: change >= 0 ? '#059669' : '#DC2626' }}>
                  {change >= 0 ? '+' : ''}{change}%
                </Typography>
                <Typography sx={{ fontSize: '0.52rem', color: '#CBD5E1', ml: 0.25 }}>vs last mo</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
