import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Chip, IconButton, Button, Select, MenuItem, FormControl, InputLabel, LinearProgress, Alert, Divider } from '@mui/material';
import { ArrowBack, Edit, AutoFixHigh, Publish, Compare, CheckCircle } from '@mui/icons-material';
import { units } from '../mockData';

const vacantUnits = units.filter(u => u.status === 'vacant' || u.status === 'maintenance');

const generateListing = (unit) => `Welcome to Unit ${unit.unit} at Sunset Ridge Apartments — a stunning ${unit.type} featuring ${unit.sqft} square feet of modern living space.

This beautifully designed apartment offers an open-concept layout with natural light throughout, a gourmet kitchen with stainless steel appliances and granite countertops, and in-unit washer/dryer hookups.

Residents enjoy premium amenities including a resort-style pool, state-of-the-art fitness center, co-working lounge, and pet-friendly community spaces. Located minutes from downtown Austin with easy highway access.

• ${unit.type} floor plan | ${unit.sqft} sqft
• Hardwood floors & high ceilings
• Walk-in closet & spa-inspired bath
• Private balcony with city views
• Smart home technology included
• Covered parking available

Available now at $${unit.marketRent}/month. Schedule your self-guided tour today!`;

const beforeListings = {
  102: `Unit 102 is a 2 bedroom 2 bathroom apartment. It has 1050 square feet. Rent is $1950 per month. Call to schedule a showing.`,
  302: `2BR/2BA unit available. 1050 sq ft. $2000/month. Available immediately.`,
  203: `Large 3 bedroom unit. 1320 sqft. Will be ready after maintenance. $2400/month.`,
};

const abTestData = {
  102: { variantA: { views: 142, leads: 18, ctr: '12.7%' }, variantB: { views: 156, leads: 31, ctr: '19.9%', winner: true } },
  302: { variantA: { views: 98, leads: 11, ctr: '11.2%' }, variantB: { views: 112, leads: 24, ctr: '21.4%', winner: true } },
};

export default function AiListingWriterPage({ onNavigate }) {
  const [selectedUnit, setSelectedUnit] = useState(vacantUnits[0]);
  const [generated, setGenerated] = useState(false);
  const [published, setPublished] = useState({});
  const [view, setView] = useState('generated');

  const handleSelect = (unitId) => {
    const unit = vacantUnits.find(u => u.id === parseInt(unitId));
    if (unit) { setSelectedUnit(unit); setGenerated(false); }
  };

  const generateNow = () => setGenerated(true);

  const listing = generated ? generateListing(selectedUnit) : '';
  const beforeText = beforeListings[selectedUnit?.unit] || `Unit ${selectedUnit?.unit} - ${selectedUnit?.type}, ${selectedUnit?.sqft} sqft, $${selectedUnit?.rent}/month. Available now.`;

  const seoScore = generated ? 87 : 0;
  const readabilityScore = generated ? 92 : 0;
  const engagementScore = generated ? 89 : 0;

  return (
    <Box sx={{ p: { xs: '16px', md: '20px 24px' }, maxWidth: 1440 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <IconButton onClick={() => onNavigate('home')} size="small" sx={{ color: '#64748B', bgcolor: '#F1F5F9' }}><ArrowBack sx={{ fontSize: 16 }} /></IconButton>
        <Box sx={{ p: '6px', borderRadius: '10px', bgcolor: '#7C3AED12' }}><Edit sx={{ fontSize: 20, color: '#7C3AED' }} /></Box>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: '1.4rem', color: '#0F172A' }}>AI Listing Writer</Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>Generate optimized property listings — 2x more lead inquiries</Typography>
        </Box>
      </Box>

      <Grid container spacing={1.75} sx={{ mb: 2.5 }}>
        {[
          { label: 'Vacant Units', value: vacantUnits.length, color: '#DC2626' },
          { label: 'Listings Generated', value: 3, color: '#7C3AED' },
          { label: 'Avg Inquiry Increase', value: '+94%', color: '#059669' },
          { label: 'Avg SEO Score', value: '88/100', color: '#2563EB' },
        ].map(s => (
          <Grid item xs={6} md={3} key={s.label}>
            <Card><CardContent sx={{ p: '14px !important' }}>
              <Typography sx={{ fontSize: '0.6rem', color: '#94A3B8', fontWeight: 600, mb: 0.5 }}>{s.label}</Typography>
              <Typography sx={{ fontWeight: 800, fontSize: '1.3rem', color: s.color, lineHeight: 1 }}>{s.value}</Typography>
            </CardContent></Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 2 }}>
            <CardContent sx={{ p: '16px !important' }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#0F172A', mb: 1.5 }}>Select Vacant Unit</Typography>
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <Select value={selectedUnit?.id || ''} onChange={e => handleSelect(e.target.value)}
                  sx={{ fontSize: '0.75rem', borderRadius: '8px' }}>
                  {vacantUnits.map(u => (
                    <MenuItem key={u.id} value={u.id} sx={{ fontSize: '0.75rem' }}>
                      Unit {u.unit} — {u.type} ({u.sqft} sqft)
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {selectedUnit && (
                <Box sx={{ bgcolor: '#F8FAFC', borderRadius: '8px', p: 1.5, mb: 2 }}>
                  {[
                    { label: 'Type', value: selectedUnit.type },
                    { label: 'Size', value: `${selectedUnit.sqft} sqft` },
                    { label: 'Market Rent', value: `$${selectedUnit.marketRent}/mo` },
                    { label: 'Status', value: selectedUnit.status },
                    { label: 'Days Vacant', value: selectedUnit.daysVacant ? `${selectedUnit.daysVacant} days` : 'N/A' },
                  ].map(f => (
                    <Box key={f.label} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography sx={{ fontSize: '0.65rem', color: '#94A3B8' }}>{f.label}</Typography>
                      <Typography sx={{ fontSize: '0.68rem', fontWeight: 600, color: '#0F172A' }}>{f.value}</Typography>
                    </Box>
                  ))}
                </Box>
              )}
              <Button variant="contained" fullWidth startIcon={<AutoFixHigh />} onClick={generateNow}
                sx={{ borderRadius: '8px', bgcolor: '#7C3AED', fontSize: '0.75rem', mb: 1 }}>
                Generate AI Listing
              </Button>
            </CardContent>
          </Card>

          {generated && (
            <Card>
              <CardContent sx={{ p: '16px !important' }}>
                <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#0F172A', mb: 1.5 }}>Quality Metrics</Typography>
                {[
                  { label: 'SEO Score', value: seoScore, color: '#059669' },
                  { label: 'Readability', value: readabilityScore, color: '#2563EB' },
                  { label: 'Engagement', value: engagementScore, color: '#7C3AED' },
                ].map(m => (
                  <Box key={m.label} sx={{ mb: 1.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography sx={{ fontSize: '0.72rem', color: '#64748B' }}>{m.label}</Typography>
                      <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: m.color }}>{m.value}/100</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={m.value}
                      sx={{ height: 6, borderRadius: '3px', bgcolor: `${m.color}18`, '& .MuiLinearProgress-bar': { bgcolor: m.color, borderRadius: '3px' } }} />
                  </Box>
                ))}
                <Divider sx={{ my: 1.5 }} />
                <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', color: '#0F172A', mb: 1 }}>Publish To</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                  {['Zillow', 'Apartments.com', 'Realtor.com', 'Property Website'].map(platform => (
                    <Button key={platform} variant={published[platform] ? 'contained' : 'outlined'} size="small"
                      startIcon={published[platform] ? <CheckCircle sx={{ fontSize: '13px !important' }} /> : <Publish sx={{ fontSize: '13px !important' }} />}
                      onClick={() => setPublished(prev => ({ ...prev, [platform]: true }))}
                      sx={{ fontSize: '0.65rem', height: 28, borderRadius: '7px',
                        bgcolor: published[platform] ? '#059669' : 'transparent',
                        color: published[platform] ? '#fff' : '#7C3AED',
                        borderColor: published[platform] ? '#059669' : '#7C3AED',
                      }}>
                      {published[platform] ? `Published to ${platform}` : `Publish to ${platform}`}
                    </Button>
                  ))}
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 2 }}>
            <CardContent sx={{ p: '16px !important' }}>
              <Box sx={{ display: 'flex', gap: 0.75, mb: 2 }}>
                {['generated', 'before', 'ab-test'].map(v => (
                  <Chip key={v} label={v === 'generated' ? 'AI Generated' : v === 'before' ? 'Before (Original)' : 'A/B Results'} size="small"
                    onClick={() => setView(v)} sx={{ height: 26, fontSize: '0.65rem', fontWeight: 600, cursor: 'pointer',
                      bgcolor: view === v ? '#7C3AED' : '#F1F5F9', color: view === v ? '#fff' : '#64748B' }} />
                ))}
              </Box>

              {view === 'generated' && (
                <>
                  {!generated ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <AutoFixHigh sx={{ fontSize: 48, color: '#E2E8F0', mb: 2 }} />
                      <Typography sx={{ fontSize: '0.82rem', color: '#94A3B8' }}>Select a unit and click "Generate AI Listing" to see the magic</Typography>
                    </Box>
                  ) : (
                    <Box sx={{ bgcolor: '#F8FAFC', borderRadius: '10px', p: 2 }}>
                      <Typography sx={{ fontSize: '0.78rem', color: '#0F172A', lineHeight: 1.8, whiteSpace: 'pre-line' }}>{listing}</Typography>
                    </Box>
                  )}
                </>
              )}

              {view === 'before' && (
                <Box sx={{ bgcolor: '#FEF2F2', borderRadius: '10px', p: 2, border: '1px solid #FECACA' }}>
                  <Typography sx={{ fontSize: '0.68rem', color: '#DC2626', fontWeight: 700, mb: 1 }}>Before AI (original listing)</Typography>
                  <Typography sx={{ fontSize: '0.78rem', color: '#64748B', lineHeight: 1.8 }}>{beforeText}</Typography>
                </Box>
              )}

              {view === 'ab-test' && selectedUnit && abTestData[selectedUnit.unit] ? (
                <Grid container spacing={2}>
                  {['variantA', 'variantB'].map(v => {
                    const data = abTestData[selectedUnit.unit][v];
                    return (
                      <Grid item xs={6} key={v}>
                        <Box sx={{ p: 2, borderRadius: '10px', border: `2px solid ${data.winner ? '#059669' : '#E2E8F0'}`, bgcolor: data.winner ? '#05966908' : '#FAFAFA' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', color: '#0F172A' }}>Variant {v === 'variantA' ? 'A' : 'B'}</Typography>
                            {data.winner && <Chip label="Winner" size="small" sx={{ bgcolor: '#05966918', color: '#059669', fontWeight: 700, fontSize: '0.58rem', height: 18 }} />}
                          </Box>
                          {[
                            { label: 'Listing Views', value: data.views },
                            { label: 'Lead Inquiries', value: data.leads },
                            { label: 'Click-Through Rate', value: data.ctr },
                          ].map(m => (
                            <Box key={m.label} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                              <Typography sx={{ fontSize: '0.68rem', color: '#64748B' }}>{m.label}</Typography>
                              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: data.winner ? '#059669' : '#0F172A' }}>{m.value}</Typography>
                            </Box>
                          ))}
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>
              ) : view === 'ab-test' ? (
                <Typography sx={{ fontSize: '0.78rem', color: '#94A3B8', textAlign: 'center', py: 3 }}>No A/B test data for this unit yet. Generate and publish a listing to start testing.</Typography>
              ) : null}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
