import React, { useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Chip, IconButton,
  LinearProgress, Divider,
} from '@mui/material';
import {
  ArrowBack, CheckCircle, TravelExplore, Code, TrendingUp,
} from '@mui/icons-material';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { seoKeywords, trafficProjection } from '../mockData';

const seoScores = [
  { label: 'Page Title', score: 95, detail: '2BR/2BA Apartment $1,950/mo South Austin TX — Self-Guided Tour | Sunset Ridge', icon: '📄' },
  { label: 'URL Structure', score: 100, detail: '/austin-tx/south-austin/2br-sunset-ridge-unit-102', icon: '🔗' },
  { label: 'Meta Description', score: 90, detail: 'Spacious 2BR/2BA in South Austin TX. $1,950/mo. Self-guided tours 24/7. Smart lock access. Pet-friendly. Pool & gym. Apply online.', icon: '📝' },
  { label: 'Structured Data', score: 100, detail: 'Schema.org: ApartmentComplex, Offer, Review, GeoCoordinates', icon: '🗂️' },
  { label: 'Content Depth', score: 90, detail: '1,240 words · 5 tour reviews · neighborhood data · market comparison', icon: '📊' },
  { label: 'Technical SEO', score: 95, detail: 'Mobile responsive · <1.2s load · all images have alt tags · canonical URL set', icon: '⚙️' },
];

const overallScore = Math.round(seoScores.reduce((s, i) => s + i.score, 0) / seoScores.length);

const jsonLdCode = `{
  "@context": "https://schema.org",
  "@type": "Apartment",
  "name": "Unit 102 — 2BR/2BA at Sunset Ridge",
  "description": "Spacious 2BR/2BA in South Austin TX. $1,950/mo.",
  "url": "https://homes.rently.com/austin-tx/south-austin/2br-sunset-ridge-unit-102",
  "image": ["https://homes.rently.com/photos/unit-102-living.jpg"],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "1200 Sunset Blvd, Unit 102",
    "addressLocality": "Austin",
    "addressRegion": "TX",
    "postalCode": "78701"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 30.2672,
    "longitude": -97.7431
  },
  "offers": {
    "@type": "Offer",
    "price": "1950",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "5"
  }
}`;

const getScoreColor = (score) => {
  if (score >= 90) return '#059669';
  if (score >= 75) return '#F59E0B';
  return '#DC2626';
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box sx={{ bgcolor: '#0F172A', borderRadius: '8px', p: '8px 12px', border: '1px solid #334155' }}>
        <Typography sx={{ color: '#94A3B8', fontSize: '0.65rem', mb: 0.5 }}>{label}</Typography>
        {payload.map(p => (
          <Typography key={p.dataKey} sx={{ color: p.color, fontSize: '0.72rem', fontWeight: 600 }}>
            {p.name}: {p.value.toLocaleString()} visits/day
          </Typography>
        ))}
      </Box>
    );
  }
  return null;
};

export default function SeoAuditPage({ onNavigate }) {
  const [expandedCode, setExpandedCode] = useState(false);

  const totalOpportunity = seoKeywords.reduce((s, k) => s + k.estimatedClicks, 0);

  return (
    <Box sx={{ p: { xs: '16px', md: '20px 24px' }, maxWidth: 1440 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
        <IconButton onClick={() => onNavigate('home')} size="small" sx={{ color: '#64748B', bgcolor: '#F1F5F9' }}>
          <ArrowBack sx={{ fontSize: 16 }} />
        </IconButton>
        <Box sx={{ p: '6px', borderRadius: '10px', bgcolor: '#05966912' }}>
          <TravelExplore sx={{ fontSize: 20, color: '#059669' }} />
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: '1.4rem', color: '#0F172A' }}>SEO Audit Dashboard</Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>Proving SEO optimization drives traffic from 2K → 20K daily</Typography>
        </Box>
      </Box>

      {/* Hero KPIs */}
      <Grid container spacing={1.75} sx={{ mb: 2.5 }}>
        {[
          { label: 'Overall SEO Score', value: `${overallScore}/100`, color: '#059669', bg: '#ECFDF5' },
          { label: 'Total Keyword Opportunity', value: `${(totalOpportunity / 1000).toFixed(1)}K clicks/mo`, color: '#2563EB', bg: '#EFF6FF' },
          { label: 'Rich Result CTR Boost', value: '6-8x higher', color: '#7C3AED', bg: '#F5F3FF' },
          { label: 'Traffic Growth Target', value: '2K → 20K/day', color: '#F59E0B', bg: '#FFFBEB' },
        ].map(s => (
          <Grid item xs={6} md={3} key={s.label}>
            <Card sx={{ bgcolor: s.bg, border: `1px solid ${s.color}20` }}>
              <CardContent sx={{ p: '14px !important' }}>
                <Typography sx={{ fontSize: '0.6rem', color: '#94A3B8', fontWeight: 600, mb: 0.5 }}>{s.label}</Typography>
                <Typography sx={{ fontWeight: 800, fontSize: '1.3rem', color: s.color, lineHeight: 1 }}>{s.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2.5}>
        {/* Left: SEO Score Panel */}
        <Grid item xs={12} md={5}>
          <Card sx={{ mb: 2.5 }}>
            <CardContent sx={{ p: '18px !important' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#0F172A' }}>SEO Score Panel</Typography>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography sx={{ fontWeight: 900, fontSize: '2rem', color: '#059669', lineHeight: 1 }}>{overallScore}</Typography>
                  <Typography sx={{ fontSize: '0.58rem', color: '#94A3B8' }}>/ 100</Typography>
                </Box>
              </Box>
              <LinearProgress variant="determinate" value={overallScore}
                sx={{ height: 8, borderRadius: 4, mb: 2.5, bgcolor: '#E2E8F0', '& .MuiLinearProgress-bar': { bgcolor: '#059669', borderRadius: 4 } }} />
              {seoScores.map(item => (
                <Box key={item.label} sx={{ mb: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <CheckCircle sx={{ fontSize: 14, color: '#059669' }} />
                      <Typography sx={{ fontSize: '0.72rem', fontWeight: 600, color: '#0F172A' }}>
                        {item.icon} {item.label}
                      </Typography>
                    </Box>
                    <Chip label={`${item.score}/100`} size="small"
                      sx={{ height: 18, fontSize: '0.58rem', fontWeight: 700, bgcolor: `${getScoreColor(item.score)}15`, color: getScoreColor(item.score) }} />
                  </Box>
                  <LinearProgress variant="determinate" value={item.score}
                    sx={{ height: 4, borderRadius: 2, mb: 0.5, bgcolor: '#F1F5F9', '& .MuiLinearProgress-bar': { bgcolor: getScoreColor(item.score), borderRadius: 2 } }} />
                  <Typography sx={{ fontSize: '0.62rem', color: '#94A3B8', pl: 2.5, fontFamily: item.label === 'URL Structure' ? 'monospace' : 'inherit' }}>
                    {item.detail}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>

          {/* Before / After Comparison */}
          <Card>
            <CardContent sx={{ p: '18px !important' }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#0F172A', mb: 1.5 }}>Before vs After SEO</Typography>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Box sx={{ bgcolor: '#FEF2F2', borderRadius: '10px', p: 1.5, border: '1px solid #FECACA', height: '100%' }}>
                    <Chip label="BEFORE" size="small" sx={{ bgcolor: '#DC2626', color: '#fff', fontSize: '0.55rem', fontWeight: 700, height: 18, mb: 1 }} />
                    <Typography sx={{ fontSize: '0.65rem', color: '#64748B', lineHeight: 1.5, mb: 0.75 }}>
                      <strong style={{ color: '#DC2626' }}>Title:</strong><br />2 Bed 2 Bath Apartment for Rent
                    </Typography>
                    <Typography sx={{ fontSize: '0.65rem', color: '#64748B', lineHeight: 1.5, mb: 0.75 }}>
                      <strong style={{ color: '#DC2626' }}>URL:</strong><br />/listing?id=102&type=2bed
                    </Typography>
                    <Typography sx={{ fontSize: '0.65rem', color: '#64748B', lineHeight: 1.5 }}>
                      <strong style={{ color: '#DC2626' }}>Meta:</strong><br />Nice apartment. Call for details.
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ bgcolor: '#ECFDF5', borderRadius: '10px', p: 1.5, border: '1px solid #D1FAE5', height: '100%' }}>
                    <Chip label="AFTER" size="small" sx={{ bgcolor: '#059669', color: '#fff', fontSize: '0.55rem', fontWeight: 700, height: 18, mb: 1 }} />
                    <Typography sx={{ fontSize: '0.65rem', color: '#64748B', lineHeight: 1.5, mb: 0.75 }}>
                      <strong style={{ color: '#059669' }}>Title:</strong><br />2BR/2BA Apt $1,950 South Austin — Self-Guided Tour
                    </Typography>
                    <Typography sx={{ fontSize: '0.65rem', color: '#64748B', lineHeight: 1.5, mb: 0.75 }}>
                      <strong style={{ color: '#059669' }}>URL:</strong><br />/austin-tx/south-austin/2br-sunset-ridge-unit-102
                    </Typography>
                    <Typography sx={{ fontSize: '0.65rem', color: '#64748B', lineHeight: 1.5 }}>
                      <strong style={{ color: '#059669' }}>Meta:</strong><br />Spacious 2BR South Austin. Tours 24/7. Pet-friendly. Apply today.
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Right: Charts & Tables */}
        <Grid item xs={12} md={7}>
          {/* Google Search Preview */}
          <Card sx={{ mb: 2.5 }}>
            <CardContent sx={{ p: '18px !important' }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#0F172A', mb: 1.5 }}>Google Search Results Preview</Typography>
              <Grid container spacing={1.5}>
                {/* Plain result */}
                <Grid item xs={12} sm={6}>
                  <Box sx={{ border: '1px solid #E2E8F0', borderRadius: '10px', p: 1.5 }}>
                    <Chip label="CURRENT — Plain Result" size="small" sx={{ bgcolor: '#FEF2F2', color: '#DC2626', fontSize: '0.55rem', fontWeight: 700, height: 18, mb: 1 }} />
                    <Typography sx={{ fontSize: '0.7rem', color: '#1A0DAB', fontWeight: 500, lineHeight: 1.3, mb: 0.25 }}>
                      2 Bed 2 Bath Apartment for Rent
                    </Typography>
                    <Typography sx={{ fontSize: '0.62rem', color: '#006621' }}>homes.rently.com/listing?id=102</Typography>
                    <Typography sx={{ fontSize: '0.65rem', color: '#4D5156', mt: 0.5, lineHeight: 1.4 }}>
                      Nice 2 bedroom apartment available. Call for pricing and availability.
                    </Typography>
                    <Chip label="CTR: ~1-2%" size="small" sx={{ mt: 1, bgcolor: '#FEF2F2', color: '#DC2626', fontSize: '0.58rem', height: 20 }} />
                  </Box>
                </Grid>
                {/* Rich result */}
                <Grid item xs={12} sm={6}>
                  <Box sx={{ border: '2px solid #059669', borderRadius: '10px', p: 1.5, bgcolor: '#ECFDF508' }}>
                    <Chip label="SEO-OPTIMIZED — Rich Result" size="small" sx={{ bgcolor: '#ECFDF5', color: '#059669', fontSize: '0.55rem', fontWeight: 700, height: 18, mb: 1 }} />
                    <Typography sx={{ fontSize: '0.7rem', color: '#1A0DAB', fontWeight: 500, lineHeight: 1.3, mb: 0.25 }}>
                      2BR/2BA Apt $1,950 South Austin — Self-Guided Tour | Sunset Ridge
                    </Typography>
                    <Typography sx={{ fontSize: '0.62rem', color: '#006621' }}>homes.rently.com › austin-tx › south-austin › 2br-sunset-ridge-unit-102</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, my: 0.25 }}>
                      {'⭐⭐⭐⭐⭐'.split('').map((s, i) => <Typography key={i} sx={{ fontSize: '0.65rem' }}>{s}</Typography>)}
                      <Typography sx={{ fontSize: '0.6rem', color: '#70757A', ml: 0.25 }}>4.8 (5 reviews) · $1,950/mo · Available</Typography>
                    </Box>
                    <Typography sx={{ fontSize: '0.65rem', color: '#4D5156', lineHeight: 1.4 }}>
                      Spacious 2BR/2BA in South Austin TX. Self-guided tours 24/7. Smart lock access. Pet-friendly. Pool & gym.
                    </Typography>
                    <Chip label="CTR: ~8-12%" size="small" sx={{ mt: 1, bgcolor: '#ECFDF5', color: '#059669', fontSize: '0.58rem', height: 20, fontWeight: 700 }} />
                  </Box>
                </Grid>
              </Grid>
              <Box sx={{ bgcolor: '#FFFBEB', borderRadius: '8px', p: '8px 12px', mt: 1.5, border: '1px solid #FEF3C7' }}>
                <Typography sx={{ fontSize: '0.7rem', color: '#D97706', fontWeight: 600 }}>
                  📈 Rich Result = 6-8x higher click-through rate. If 1,000 people see both listings, rich result gets 80-120 clicks vs 10-20 for plain text.
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Traffic Growth Projection */}
          <Card sx={{ mb: 2.5 }}>
            <CardContent sx={{ p: '18px !important' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <TrendingUp sx={{ color: '#2563EB', fontSize: 20 }} />
                <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#0F172A' }}>Traffic Growth Projection (12 Months)</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
                {[
                  { label: 'Baseline', color: '#94A3B8' },
                  { label: 'SEO Setup', color: '#F59E0B' },
                  { label: 'Growth', color: '#2563EB' },
                  { label: 'Scale & Peak', color: '#059669' },
                ].map(p => (
                  <Box key={p.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: 2, bgcolor: p.color }} />
                    <Typography sx={{ fontSize: '0.6rem', color: '#64748B' }}>{p.label}</Typography>
                  </Box>
                ))}
              </Box>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={trafficProjection} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="projGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="currGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#94A3B8" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#94A3B8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                  <YAxis tickFormatter={v => `${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 10, fill: '#94A3B8' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="current" name="Current" stroke="#94A3B8" fill="url(#currGrad)" strokeWidth={1.5} strokeDasharray="4 4" />
                  <Area type="monotone" dataKey="projected" name="SEO-Optimized" stroke="#059669" fill="url(#projGrad)" strokeWidth={2} />
                  <ReferenceLine y={20000} stroke="#059669" strokeDasharray="3 3" label={{ value: '20K Goal', fill: '#059669', fontSize: 10 }} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Keyword Opportunity Table */}
          <Card sx={{ mb: 2.5 }}>
            <CardContent sx={{ p: '18px !important' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#0F172A' }}>Keyword Opportunity</Typography>
                <Chip label={`${(totalOpportunity / 1000).toFixed(1)}K est. clicks/mo`} size="small"
                  sx={{ bgcolor: '#EFF6FF', color: '#2563EB', fontWeight: 700, fontSize: '0.62rem' }} />
              </Box>
              <Box sx={{ overflowX: 'auto' }}>
                <Box sx={{ minWidth: 500 }}>
                  {/* Header */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 0.5, mb: 0.75, px: 1 }}>
                    {['Keyword', 'Monthly Searches', 'Competition', 'Current Rank', 'Est. Clicks'].map(h => (
                      <Typography key={h} sx={{ fontSize: '0.6rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>{h}</Typography>
                    ))}
                  </Box>
                  {seoKeywords.map((kw, idx) => (
                    <Box key={idx} sx={{
                      display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 0.5,
                      px: 1, py: 0.75, borderRadius: '6px', mb: 0.25,
                      bgcolor: idx % 2 === 0 ? '#F8FAFC' : 'transparent',
                    }}>
                      <Typography sx={{ fontSize: '0.68rem', color: '#0F172A', fontWeight: 500 }}>{kw.keyword}</Typography>
                      <Typography sx={{ fontSize: '0.68rem', color: '#2563EB', fontWeight: 600 }}>{kw.monthlySearches.toLocaleString()}</Typography>
                      <Chip label={kw.competition} size="small" sx={{
                        height: 18, fontSize: '0.55rem', fontWeight: 700,
                        bgcolor: kw.competition === 'None' ? '#ECFDF5' : '#FFFBEB',
                        color: kw.competition === 'None' ? '#059669' : '#D97706',
                        width: 'fit-content',
                      }} />
                      <Chip label={kw.currentRank} size="small" sx={{ height: 18, fontSize: '0.55rem', bgcolor: '#FEF2F2', color: '#DC2626', width: 'fit-content' }} />
                      <Typography sx={{ fontSize: '0.68rem', color: '#059669', fontWeight: 700 }}>{kw.estimatedClicks.toLocaleString()}</Typography>
                    </Box>
                  ))}
                  <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 0.5, px: 1, pt: 0.75, borderTop: '1px solid #E2E8F0', mt: 0.5 }}>
                    <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: '#0F172A', gridColumn: '1 / 5' }}>Total Opportunity</Typography>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669' }}>{totalOpportunity.toLocaleString()}</Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Structured Data */}
          <Card>
            <CardContent sx={{ p: '18px !important' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Code sx={{ color: '#7C3AED', fontSize: 20 }} />
                  <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#0F172A' }}>Structured Data (JSON-LD)</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  {['ApartmentComplex', 'Offer', 'AggregateRating', 'GeoCoordinates'].map(t => (
                    <Chip key={t} label={`✅ ${t}`} size="small" sx={{ height: 18, fontSize: '0.52rem', bgcolor: '#ECFDF5', color: '#059669' }} />
                  ))}
                </Box>
              </Box>
              <Box
                sx={{
                  bgcolor: '#0F172A', borderRadius: '10px', p: '12px 14px',
                  fontFamily: 'monospace', fontSize: '0.65rem', color: '#A5F3FC',
                  maxHeight: expandedCode ? 'none' : 160, overflow: 'hidden', position: 'relative', cursor: 'pointer',
                }}
                onClick={() => setExpandedCode(e => !e)}
              >
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', color: '#A5F3FC' }}>
                  {jsonLdCode}
                </pre>
                {!expandedCode && (
                  <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 40, background: 'linear-gradient(transparent, #0F172A)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', pb: 0.5 }}>
                    <Typography sx={{ color: '#7C3AED', fontSize: '0.65rem', fontWeight: 600 }}>Click to expand ▼</Typography>
                  </Box>
                )}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 1 }}>
                <CheckCircle sx={{ fontSize: 14, color: '#059669' }} />
                <Typography sx={{ fontSize: '0.65rem', color: '#059669', fontWeight: 600 }}>Validated — Google Rich Result eligible</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
