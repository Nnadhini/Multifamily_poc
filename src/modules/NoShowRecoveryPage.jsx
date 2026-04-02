import React, { useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Chip, IconButton, Button,
  LinearProgress, Avatar, Divider,
} from '@mui/material';
import {
  ArrowBack, NotificationsNone, Schedule, Lock, Sms, Campaign,
  AutoAwesome, Warning, CheckCircle, TrendingDown, AttachMoney, People,
} from '@mui/icons-material';
import { noShowFunnel, recoveryTimeline } from '../mockData';

const funnelStages = [
  { key: 'booked', label: 'Booked', value: noShowFunnel.booked, color: '#2563EB', pct: 100 },
  { key: 'reminded', label: 'Reminded', value: noShowFunnel.reminded, color: '#7C3AED', pct: 100 },
  { key: 'showedUp', label: 'Showed Up', value: noShowFunnel.showedUp, color: '#059669', pct: 85 },
  { key: 'noShow', label: 'No-Show', value: noShowFunnel.noShow, color: '#DC2626', pct: 15 },
  { key: 'recovered', label: 'Recovered', value: noShowFunnel.recovered, color: '#F59E0B', pct: 10 },
  { key: 'slotFilled', label: 'Slot Filled', value: noShowFunnel.slotFilled, color: '#10B981', pct: 8 },
];

const preventionSteps = [
  { time: 'Booking', label: 'Tour Confirmed', detail: 'SMS + Email + Calendar invite sent instantly', color: '#2563EB', icon: <CheckCircle sx={{ fontSize: 16 }} /> },
  { time: '24 hrs before', label: 'Smart Reminder', detail: '"Tomorrow at 2PM — Unit 102 tour. Here\'s a sneak peek 📸"', color: '#7C3AED', icon: <NotificationsNone sx={{ fontSize: 16 }} /> },
  { time: '2 hrs before', label: 'Final Nudge + Directions', detail: 'Directions, parking info, and what to look for', color: '#0891B2', icon: <Campaign sx={{ fontSize: 16 }} /> },
  { time: '30 min before', label: 'Smart Lock Code Ready', detail: '"Code: 4582. Valid 2:00–2:30 PM. See you soon!"', color: '#059669', icon: <Lock sx={{ fontSize: 16 }} /> },
];

const riskFactors = [
  { label: 'Confirmation email opened?', value: 'No', risk: true },
  { label: 'Calendar invite accepted?', value: 'No', risk: true },
  { label: 'Any reminders responded to?', value: 'No', risk: true },
  { label: 'Previous no-show history?', value: 'Yes (1x)', risk: true },
  { label: 'Lead source', value: 'Zillow', risk: false },
  { label: 'Booking lead time', value: '5 days', risk: false },
];

const waitlistCandidates = [
  { name: 'David K.', score: 92, unit: '102', note: 'Viewed listing 3x this week', color: '#059669' },
  { name: 'Lauren H.', score: 74, unit: '102', note: 'Inquired yesterday, quick responder', color: '#2563EB' },
  { name: 'Alex R.', score: 58, unit: '102', note: 'On general waitlist, 2BR preference', color: '#F59E0B' },
];

const recoveryIconMap = {
  schedule: <Schedule sx={{ fontSize: 16 }} />,
  lock: <Lock sx={{ fontSize: 16 }} />,
  sms: <Sms sx={{ fontSize: 16 }} />,
  campaign: <Campaign sx={{ fontSize: 16 }} />,
  auto_awesome: <AutoAwesome sx={{ fontSize: 16 }} />,
  notification_important: <Warning sx={{ fontSize: 16 }} />,
};

const recoveryStatusColors = {
  trigger: '#94A3B8',
  detected: '#DC2626',
  action: '#2563EB',
  final: '#F59E0B',
};

export default function NoShowRecoveryPage({ onNavigate }) {
  const [riskScore] = useState('HIGH');
  const [slotFilled, setSlotFilled] = useState(false);

  const riskColor = riskScore === 'HIGH' ? '#DC2626' : riskScore === 'MEDIUM' ? '#F59E0B' : '#059669';
  const riskBg = riskScore === 'HIGH' ? '#FEF2F2' : riskScore === 'MEDIUM' ? '#FFFBEB' : '#ECFDF5';

  return (
    <Box sx={{ p: { xs: '16px', md: '20px 24px' }, maxWidth: 1440 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
        <IconButton onClick={() => onNavigate('home')} size="small" sx={{ color: '#64748B', bgcolor: '#F1F5F9' }}>
          <ArrowBack sx={{ fontSize: 16 }} />
        </IconButton>
        <Box sx={{ p: '6px', borderRadius: '10px', bgcolor: '#DC262612' }}>
          <Schedule sx={{ fontSize: 20, color: '#DC2626' }} />
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: '1.4rem', color: '#0F172A' }}>No-Show Recovery Engine</Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>Prevent, recover, and fill every wasted tour slot — $168K annual impact</Typography>
        </Box>
      </Box>

      {/* Tour Pipeline Funnel */}
      <Card sx={{ mb: 2.5 }}>
        <CardContent sx={{ p: '18px !important' }}>
          <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#0F172A', mb: 1.5 }}>Tour Pipeline — This Month</Typography>
          <Grid container spacing={1}>
            {funnelStages.map((stage, idx) => (
              <Grid item xs={4} sm={2} key={stage.key}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{ position: 'relative', mb: 0.75 }}>
                    <LinearProgress variant="determinate" value={stage.pct}
                      sx={{
                        height: 8, borderRadius: 4,
                        bgcolor: `${stage.color}18`,
                        '& .MuiLinearProgress-bar': { bgcolor: stage.color, borderRadius: 4 },
                        mb: 0.5,
                      }} />
                    {idx > 0 && (
                      <Typography sx={{ position: 'absolute', top: -8, right: 0, fontSize: '0.55rem', color: '#94A3B8' }}>
                        {stage.pct}%
                      </Typography>
                    )}
                  </Box>
                  <Typography sx={{ fontWeight: 800, fontSize: '1.25rem', color: stage.color, lineHeight: 1 }}>{stage.value}</Typography>
                  <Typography sx={{ fontSize: '0.6rem', color: '#94A3B8', mt: 0.25 }}>{stage.label}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ display: 'flex', gap: 0.75, mt: 1.5, flexWrap: 'wrap' }}>
            <Chip label="✅ 85% show-up rate (vs 70% industry avg)" size="small" sx={{ bgcolor: '#ECFDF5', color: '#059669', fontSize: '0.62rem' }} />
            <Chip label="⚡ 67% no-show recovery rate" size="small" sx={{ bgcolor: '#EFF6FF', color: '#2563EB', fontSize: '0.62rem' }} />
            <Chip label="🎯 8 slots auto-filled from waitlist" size="small" sx={{ bgcolor: '#F5F3FF', color: '#7C3AED', fontSize: '0.62rem' }} />
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={2.5}>
        {/* Left Column */}
        <Grid item xs={12} md={6}>
          {/* Prevention Timeline */}
          <Card sx={{ mb: 2.5 }}>
            <CardContent sx={{ p: '18px !important' }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#0F172A', mb: 1.5 }}>
                🛡️ Before Tour: Prevention Timeline
              </Typography>
              {preventionSteps.map((step, idx) => (
                <Box key={idx} sx={{ display: 'flex', gap: 1.5, mb: idx < preventionSteps.length - 1 ? 1.5 : 0 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: `${step.color}15`, color: step.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {step.icon}
                    </Box>
                    {idx < preventionSteps.length - 1 && (
                      <Box sx={{ width: 1, flex: 1, bgcolor: '#E2E8F0', my: 0.5 }} />
                    )}
                  </Box>
                  <Box sx={{ flex: 1, pb: idx < preventionSteps.length - 1 ? 1.5 : 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
                      <Chip label={step.time} size="small" sx={{ height: 18, fontSize: '0.55rem', bgcolor: `${step.color}12`, color: step.color, fontWeight: 700 }} />
                      <Typography sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#0F172A' }}>{step.label}</Typography>
                    </Box>
                    <Typography sx={{ fontSize: '0.68rem', color: '#64748B', lineHeight: 1.4 }}>{step.detail}</Typography>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>

          {/* AI No-Show Risk Prediction */}
          <Card>
            <CardContent sx={{ p: '18px !important' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <AutoAwesome sx={{ color: '#7C3AED', fontSize: 18 }} />
                <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#0F172A' }}>AI No-Show Risk Prediction</Typography>
                <Chip label="Live Demo" size="small" sx={{ bgcolor: '#7C3AED15', color: '#7C3AED', fontSize: '0.58rem', fontWeight: 700, height: 18 }} />
              </Box>
              <Box sx={{ bgcolor: riskBg, border: `2px solid ${riskColor}30`, borderRadius: '12px', p: '14px 16px', mb: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography sx={{ fontSize: '0.78rem', color: '#64748B' }}>Risk Score for <strong>Sarah M. — Tour @ 2:00 PM</strong></Typography>
                  <Chip label={riskScore} sx={{ bgcolor: riskColor, color: '#fff', fontWeight: 800, fontSize: '0.75rem', height: 26 }} />
                </Box>
                <LinearProgress variant="determinate" value={80}
                  sx={{ height: 8, borderRadius: 4, bgcolor: `${riskColor}20`, '& .MuiLinearProgress-bar': { bgcolor: riskColor, borderRadius: 4 } }} />
                <Typography sx={{ fontSize: '0.62rem', color: riskColor, fontWeight: 600, mt: 0.5 }}>Risk: 80/100 — Auto-trigger extra reminder call</Typography>
              </Box>
              <Typography sx={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748B', mb: 0.75 }}>Risk Factors Checklist</Typography>
              {riskFactors.map((f, idx) => (
                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 0.4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    {f.risk ? <Warning sx={{ fontSize: 13, color: '#DC2626' }} /> : <CheckCircle sx={{ fontSize: 13, color: '#059669' }} />}
                    <Typography sx={{ fontSize: '0.68rem', color: '#64748B' }}>{f.label}</Typography>
                  </Box>
                  <Chip label={f.value} size="small" sx={{
                    height: 18, fontSize: '0.58rem', fontWeight: 600,
                    bgcolor: f.risk ? '#FEF2F2' : '#ECFDF5',
                    color: f.risk ? '#DC2626' : '#059669',
                  }} />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={6}>
          {/* Recovery Sequence */}
          <Card sx={{ mb: 2.5 }}>
            <CardContent sx={{ p: '18px !important' }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#0F172A', mb: 1.5 }}>
                🔄 After No-Show: Recovery Sequence
              </Typography>
              {recoveryTimeline.map((step, idx) => (
                <Box key={idx} sx={{ display: 'flex', gap: 1.5, mb: idx < recoveryTimeline.length - 1 ? 1.5 : 0 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box sx={{
                      width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                      bgcolor: `${recoveryStatusColors[step.status]}15`,
                      color: recoveryStatusColors[step.status],
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {recoveryIconMap[step.icon] || <Schedule sx={{ fontSize: 16 }} />}
                    </Box>
                    {idx < recoveryTimeline.length - 1 && (
                      <Box sx={{ width: 1, flex: 1, bgcolor: '#E2E8F0', my: 0.5 }} />
                    )}
                  </Box>
                  <Box sx={{ flex: 1, pb: idx < recoveryTimeline.length - 1 ? 1.5 : 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
                      <Chip label={step.time} size="small" sx={{
                        height: 18, fontSize: '0.55rem', fontWeight: 700,
                        bgcolor: `${recoveryStatusColors[step.status]}12`,
                        color: recoveryStatusColors[step.status],
                      }} />
                      <Typography sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#0F172A' }}>{step.event}</Typography>
                    </Box>
                    <Typography sx={{ fontSize: '0.68rem', color: '#64748B', lineHeight: 1.4 }}>{step.detail}</Typography>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>

          {/* Waitlist Auto-Fill */}
          <Card sx={{ mb: 2.5 }}>
            <CardContent sx={{ p: '18px !important' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <People sx={{ color: '#059669', fontSize: 18 }} />
                <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#0F172A' }}>Waitlist Auto-Fill</Typography>
                {slotFilled && (
                  <Chip label="✅ Slot filled in 12 min!" sx={{ bgcolor: '#ECFDF5', color: '#059669', fontWeight: 700, fontSize: '0.62rem' }} size="small" />
                )}
              </Box>
              <Typography sx={{ fontSize: '0.72rem', color: '#64748B', mb: 1.25 }}>
                No-show detected → AI ranks waitlist candidates → instant SMS to top match
              </Typography>
              {waitlistCandidates.map((c, idx) => (
                <Box key={idx} sx={{
                  display: 'flex', alignItems: 'center', gap: 1.25, p: '10px 12px',
                  borderRadius: '10px', mb: 0.75,
                  bgcolor: idx === 0 ? '#ECFDF5' : '#F8FAFC',
                  border: `1px solid ${idx === 0 ? '#D1FAE5' : '#E2E8F0'}`,
                }}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: `${c.color}20`, color: c.color, fontSize: '0.72rem', fontWeight: 700 }}>
                    {c.name[0]}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <Typography sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#0F172A' }}>{c.name}</Typography>
                      {idx === 0 && <Chip label="Top Match" size="small" sx={{ height: 16, fontSize: '0.52rem', bgcolor: '#059669', color: '#fff' }} />}
                    </Box>
                    <Typography sx={{ fontSize: '0.62rem', color: '#94A3B8' }}>{c.note}</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography sx={{ fontWeight: 800, fontSize: '0.88rem', color: c.color }}>{c.score}</Typography>
                    <Typography sx={{ fontSize: '0.55rem', color: '#94A3B8' }}>AI score</Typography>
                  </Box>
                </Box>
              ))}
              <Button variant="contained" fullWidth size="small" onClick={() => setSlotFilled(true)}
                sx={{ mt: 1, borderRadius: '8px', bgcolor: '#059669', fontSize: '0.72rem', '&:hover': { bgcolor: '#047857' } }}>
                {slotFilled ? '✅ SMS Sent to David K.' : '⚡ Send Slot Offer to Top Candidate'}
              </Button>
            </CardContent>
          </Card>

          {/* Revenue Impact Calculator */}
          <Card sx={{ border: '2px solid #05966930', bgcolor: '#ECFDF508' }}>
            <CardContent sx={{ p: '18px !important' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <AttachMoney sx={{ color: '#059669', fontSize: 20 }} />
                <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#0F172A' }}>Revenue Impact Calculator</Typography>
              </Box>
              <Grid container spacing={1.25}>
                <Grid item xs={6}>
                  <Box sx={{ bgcolor: '#FEF2F2', borderRadius: '10px', p: '12px 14px', border: '1px solid #FECACA', height: '100%' }}>
                    <Chip label="BEFORE" size="small" sx={{ bgcolor: '#DC2626', color: '#fff', fontSize: '0.55rem', fontWeight: 700, height: 18, mb: 1 }} />
                    {[
                      { label: 'No-show rate', value: '30%' },
                      { label: 'Wasted slots/mo', value: '30' },
                      { label: 'Lost leases/mo', value: '~10' },
                      { label: 'Revenue lost/mo', value: '$16,500' },
                    ].map(r => (
                      <Box key={r.label} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.4 }}>
                        <Typography sx={{ fontSize: '0.65rem', color: '#64748B' }}>{r.label}</Typography>
                        <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: '#DC2626' }}>{r.value}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ bgcolor: '#ECFDF5', borderRadius: '10px', p: '12px 14px', border: '1px solid #D1FAE5', height: '100%' }}>
                    <Chip label="AFTER" size="small" sx={{ bgcolor: '#059669', color: '#fff', fontSize: '0.55rem', fontWeight: 700, height: 18, mb: 1 }} />
                    {[
                      { label: 'No-show rate', value: '15%' },
                      { label: 'Tours recovered/mo', value: '+25' },
                      { label: 'Extra leases/mo', value: '+8.5' },
                      { label: 'Revenue recovered', value: '$14,025' },
                    ].map(r => (
                      <Box key={r.label} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.4 }}>
                        <Typography sx={{ fontSize: '0.65rem', color: '#64748B' }}>{r.label}</Typography>
                        <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: '#059669' }}>{r.value}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Grid>
              </Grid>
              <Divider sx={{ my: 1.25 }} />
              <Box sx={{ textAlign: 'center', bgcolor: '#0F172A', borderRadius: '10px', p: '12px 16px' }}>
                <Typography sx={{ color: '#94A3B8', fontSize: '0.62rem', mb: 0.25 }}>💰 Annual Portfolio Impact</Typography>
                <Typography sx={{ color: '#34D399', fontWeight: 900, fontSize: '2rem', lineHeight: 1 }}>$168,000</Typography>
                <Typography sx={{ color: '#64748B', fontSize: '0.6rem', mt: 0.25 }}>recovered per portfolio per year</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
