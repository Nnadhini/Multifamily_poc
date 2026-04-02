import React from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Chip, IconButton, Divider,
} from '@mui/material';
import {
  ArrowBack, TrendingUp, AttachMoney, EventAvailable, Stars,
  CheckCircle, Cancel,
} from '@mui/icons-material';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { managerRoiData, leadSourceBreakdown } from '../mockData';

const CustomTooltipDark = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box sx={{ bgcolor: '#0F172A', borderRadius: '8px', p: '8px 12px', border: '1px solid #334155' }}>
        <Typography sx={{ color: '#94A3B8', fontSize: '0.65rem', mb: 0.5 }}>{label}</Typography>
        {payload.map(p => (
          <Typography key={p.dataKey} sx={{ color: p.color, fontSize: '0.72rem', fontWeight: 600 }}>
            {p.name}: {typeof p.value === 'number' && p.name === 'Revenue' ? `$${p.value.toLocaleString()}` : p.value}
          </Typography>
        ))}
      </Box>
    );
  }
  return null;
};

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  if (percent < 0.08) return null;
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function ManagerRoiPage({ onNavigate }) {
  const { heroStats, monthlyPerformance, featureImpact } = managerRoiData;

  return (
    <Box sx={{ p: { xs: '16px', md: '20px 24px' }, maxWidth: 1440 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
        <IconButton onClick={() => onNavigate('home')} size="small" sx={{ color: '#64748B', bgcolor: '#F1F5F9' }}>
          <ArrowBack sx={{ fontSize: 16 }} />
        </IconButton>
        <Box sx={{ p: '6px', borderRadius: '10px', bgcolor: '#05966912' }}>
          <TrendingUp sx={{ fontSize: 20, color: '#059669' }} />
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: '1.4rem', color: '#0F172A' }}>Manager ROI Dashboard</Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>Concrete value Rently delivers — why managers never cancel</Typography>
        </Box>
      </Box>

      {/* Hero Stats */}
      <Grid container spacing={1.75} sx={{ mb: 2.5 }}>
        {[
          { label: 'Tours Generated', value: heroStats.tours, icon: <EventAvailable sx={{ fontSize: 22, color: '#2563EB' }} />, color: '#2563EB', bg: '#EFF6FF', suffix: '' },
          { label: 'Leases Signed', value: heroStats.leases, icon: <CheckCircle sx={{ fontSize: 22, color: '#059669' }} />, color: '#059669', bg: '#ECFDF5', suffix: '' },
          { label: 'Revenue This Month', value: `$${heroStats.revenue.toLocaleString()}`, icon: <AttachMoney sx={{ fontSize: 22, color: '#7C3AED' }} />, color: '#7C3AED', bg: '#F5F3FF', suffix: '' },
          { label: 'ROI on Rently', value: `${heroStats.roi}x`, icon: <Stars sx={{ fontSize: 22, color: '#F59E0B' }} />, color: '#F59E0B', bg: '#FFFBEB', suffix: '' },
        ].map(s => (
          <Grid item xs={6} md={3} key={s.label}>
            <Card sx={{ bgcolor: s.bg, border: `1px solid ${s.color}20` }}>
              <CardContent sx={{ p: '16px !important' }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 0.75 }}>
                  {s.icon}
                  <Chip label="This Month" size="small" sx={{ height: 18, fontSize: '0.52rem', bgcolor: `${s.color}10`, color: s.color }} />
                </Box>
                <Typography sx={{ fontWeight: 900, fontSize: '1.75rem', color: s.color, lineHeight: 1 }}>{s.value}</Typography>
                <Typography sx={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 600, mt: 0.25 }}>{s.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2.5}>
        {/* Monthly Performance Chart */}
        <Grid item xs={12} md={7}>
          <Card sx={{ mb: 2.5 }}>
            <CardContent sx={{ p: '18px !important' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <TrendingUp sx={{ color: '#2563EB', fontSize: 18 }} />
                <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#0F172A' }}>Monthly Performance (6 Months)</Typography>
                <Chip label="↑ Trending Up" size="small" sx={{ bgcolor: '#ECFDF5', color: '#059669', fontSize: '0.6rem', fontWeight: 700 }} />
              </Box>
              <ResponsiveContainer width="100%" height={240}>
                <ComposedChart data={monthlyPerformance} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                  <YAxis yAxisId="right" orientation="right" tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 10, fill: '#94A3B8' }} />
                  <Tooltip content={<CustomTooltipDark />} />
                  <Bar yAxisId="left" dataKey="tours" name="Tours" fill="#2563EB" radius={[4, 4, 0, 0]} maxBarSize={30} />
                  <Bar yAxisId="left" dataKey="leases" name="Leases" fill="#059669" radius={[4, 4, 0, 0]} maxBarSize={30} />
                  <Line yAxisId="right" type="monotone" dataKey="revenue" name="Revenue" stroke="#7C3AED" strokeWidth={2.5} dot={{ fill: '#7C3AED', r: 4 }} />
                </ComposedChart>
              </ResponsiveContainer>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 1 }}>
                {[{ color: '#2563EB', label: 'Tours' }, { color: '#059669', label: 'Leases' }, { color: '#7C3AED', label: 'Revenue' }].map(l => (
                  <Box key={l.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: 2, bgcolor: l.color }} />
                    <Typography sx={{ fontSize: '0.62rem', color: '#64748B' }}>{l.label}</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* Feature Impact Table */}
          <Card>
            <CardContent sx={{ p: '18px !important' }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#0F172A', mb: 1.5 }}>Feature Impact Breakdown</Typography>
              <Box sx={{ overflowX: 'auto' }}>
                <Box sx={{ minWidth: 480 }}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1.5fr 1fr', gap: 0.5, mb: 0.75, px: 1 }}>
                    {['Feature', 'Engagement Impact', 'Tour Impact', 'Revenue Saved'].map(h => (
                      <Typography key={h} sx={{ fontSize: '0.6rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>{h}</Typography>
                    ))}
                  </Box>
                  {featureImpact.map((row, idx) => (
                    <Box key={idx} sx={{
                      display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1.5fr 1fr', gap: 0.5,
                      px: 1, py: 0.75, borderRadius: '6px', mb: 0.25,
                      bgcolor: idx % 2 === 0 ? '#F8FAFC' : 'transparent',
                    }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#0F172A' }}>{row.feature}</Typography>
                      <Typography sx={{ fontSize: '0.68rem', color: '#2563EB' }}>{row.engagement}</Typography>
                      <Typography sx={{ fontSize: '0.68rem', color: '#7C3AED' }}>{row.tours}</Typography>
                      <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: '#059669' }}>{row.savings}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={5}>
          {/* Lead Source Breakdown */}
          <Card sx={{ mb: 2.5 }}>
            <CardContent sx={{ p: '18px !important' }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#0F172A', mb: 0.5 }}>Lead Source Breakdown</Typography>
              <Typography sx={{ fontSize: '0.7rem', color: '#94A3B8', mb: 1.5 }}>Where tours come from this month</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                <PieChart width={220} height={180}>
                  <Pie data={leadSourceBreakdown} cx={110} cy={90} innerRadius={50} outerRadius={85} paddingAngle={3} dataKey="value" labelLine={false} label={renderCustomLabel}>
                    {leadSourceBreakdown.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </Box>
              {leadSourceBreakdown.map((item, idx) => (
                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 0.4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: 2, bgcolor: item.color, flexShrink: 0 }} />
                    <Typography sx={{ fontSize: '0.68rem', color: '#0F172A' }}>{item.name}</Typography>
                  </Box>
                  <Chip label={`${item.value}%`} size="small" sx={{ height: 18, fontSize: '0.6rem', fontWeight: 700, bgcolor: `${item.color}12`, color: item.color }} />
                </Box>
              ))}
            </CardContent>
          </Card>

          {/* Rently vs Without Rently */}
          <Card>
            <CardContent sx={{ p: '18px !important' }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#0F172A', mb: 1.5 }}>Rently vs Without Rently</Typography>
              <Grid container spacing={1}>
                {[
                  { header: 'Without Rently', color: '#DC2626', bg: '#FEF2F2', border: '#FECACA',
                    items: [
                      { label: 'After-hours leads captured', value: '~40%' },
                      { label: 'Tour no-show rate', value: '30%' },
                      { label: 'Days to fill vacancy', value: '18 days' },
                      { label: 'Listing inquiries/mo', value: 'Baseline' },
                      { label: 'Tour-to-lease rate', value: '34%' },
                      { label: 'Monthly revenue', value: '$12,375' },
                    ],
                    icon: <Cancel sx={{ color: '#DC2626', fontSize: 16 }} />,
                  },
                  { header: 'With Rently', color: '#059669', bg: '#ECFDF5', border: '#D1FAE5',
                    items: [
                      { label: 'After-hours leads captured', value: '~100%' },
                      { label: 'Tour no-show rate', value: '15%' },
                      { label: 'Days to fill vacancy', value: '12 days' },
                      { label: 'Listing inquiries/mo', value: '+130%' },
                      { label: 'Tour-to-lease rate', value: '42%' },
                      { label: 'Monthly revenue', value: '$26,400' },
                    ],
                    icon: <CheckCircle sx={{ color: '#059669', fontSize: 16 }} />,
                  },
                ].map(col => (
                  <Grid item xs={6} key={col.header}>
                    <Box sx={{ bgcolor: col.bg, border: `1px solid ${col.border}`, borderRadius: '10px', p: '12px' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                        {col.icon}
                        <Typography sx={{ fontWeight: 700, fontSize: '0.72rem', color: col.color }}>{col.header}</Typography>
                      </Box>
                      {col.items.map(item => (
                        <Box key={item.label} sx={{ mb: 0.6 }}>
                          <Typography sx={{ fontSize: '0.58rem', color: '#94A3B8' }}>{item.label}</Typography>
                          <Typography sx={{ fontWeight: 700, fontSize: '0.72rem', color: col.color }}>{item.value}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Bottom Banner */}
      <Box sx={{
        mt: 2.5, p: '20px 28px', borderRadius: '16px',
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)',
        textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <Box sx={{ position: 'absolute', top: -40, right: 40, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(5,150,105,0.12), transparent)' }} />
        <Box sx={{ position: 'absolute', bottom: -60, left: '30%', width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.08), transparent)' }} />
        <Stars sx={{ color: '#FCD34D', fontSize: 28, mb: 1 }} />
        <Typography sx={{ color: '#F8FAFC', fontWeight: 800, fontSize: '1.2rem', mb: 0.5 }}>
          "This is why managers never cancel Rently"
        </Typography>
        <Typography sx={{ color: '#94A3B8', fontSize: '0.8rem', maxWidth: 560, mx: 'auto' }}>
          Every vacant day costs $50–80. Rently owns the front door — smart locks, self-guided tours, and the richest prospect behavioral data in multifamily. The AI layer on top turns that data into signed leases and makes Rently irreplaceable.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2.5, mt: 2 }}>
          {[
            { value: '12x', label: 'Average ROI' },
            { value: '$168K', label: 'Annual Impact/Portfolio' },
            { value: '94%', label: 'Manager Retention Rate' },
          ].map(s => (
            <Box key={s.label} sx={{ textAlign: 'center' }}>
              <Typography sx={{ color: '#34D399', fontWeight: 900, fontSize: '1.5rem', lineHeight: 1 }}>{s.value}</Typography>
              <Typography sx={{ color: '#64748B', fontSize: '0.6rem' }}>{s.label}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
