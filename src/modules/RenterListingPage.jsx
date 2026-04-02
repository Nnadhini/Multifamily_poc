import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Chip, Button, IconButton,
  Avatar, LinearProgress, Divider, Rating,
} from '@mui/material';
import {
  ArrowBack, PlayArrow, Pause, LocationOn, DirectionsWalk,
  DirectionsBus, Star, CalendarMonth, People, VerifiedUser,
  TrendingUp, CheckCircle, AccessTime,
} from '@mui/icons-material';
import { tourReviews, units } from '../mockData';

const unit102 = units.find(u => u.unit === '102') || units[1];

const rooms = [
  { label: 'Living Room', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', desc: 'Open-concept living area with abundant natural light' },
  { label: 'Kitchen', color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', desc: 'Modern gourmet kitchen with granite countertops' },
  { label: 'Master Bedroom', color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', desc: 'Spacious master bedroom with walk-in closet' },
  { label: 'Bathroom', color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', desc: 'Spa-inspired bathroom with modern fixtures' },
  { label: 'Balcony', color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', desc: 'Private balcony with South Austin skyline views' },
];

const voiceovers = [
  'Welcome to Unit 102 at Sunset Ridge — a stunning 2-bedroom, 2-bath apartment in Building A. As you step inside, notice the open-concept living area where natural light floods through oversized windows, creating a warm and inviting atmosphere perfect for both relaxing and entertaining.',
  'The gourmet kitchen is a chef\'s dream, featuring granite countertops, stainless steel appliances, and ample cabinet space. The large breakfast bar seamlessly connects to the living area, making this an ideal space for hosting friends and family.',
  'The spacious master bedroom easily accommodates a king-size bed while still leaving room to breathe. The walk-in closet provides generous storage, and the large windows frame a beautiful view of the community courtyard.',
  'The spa-inspired bathroom boasts modern fixtures, a soaking tub, and a separate walk-in shower with rainfall head. Dual vanities with under-mount sinks add a touch of luxury to your daily routine.',
  'Step outside onto your private balcony and take in the breathtaking South Austin views. Whether you\'re enjoying your morning coffee or unwinding after a long day, this outdoor oasis is the perfect retreat.',
];

const timeSlots = ['Today 2:00 PM', 'Today 4:30 PM', 'Tomorrow 10:00 AM', 'Tomorrow 1:00 PM', 'Tomorrow 3:30 PM'];

export default function RenterListingPage({ onNavigate }) {
  const [playing, setPlaying] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(0);
  const [progress, setProgress] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const intervalRef = useRef(null);
  const SLIDE_DURATION = 5000;

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setCurrentRoom(r => (r + 1) % rooms.length);
            return 0;
          }
          return prev + (100 / (SLIDE_DURATION / 100));
        });
      }, 100);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [playing]);

  const handlePlayPause = () => setPlaying(p => !p);

  const goToRoom = (idx) => {
    setCurrentRoom(idx);
    setProgress(0);
  };

  return (
    <Box sx={{ p: { xs: '16px', md: '20px 24px' }, maxWidth: 1440 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <IconButton onClick={() => onNavigate('home')} size="small" sx={{ color: '#64748B', bgcolor: '#F1F5F9' }}>
          <ArrowBack sx={{ fontSize: 16 }} />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Chip label="🏠 Renter View — Listing Page Simulation" size="small" sx={{ bgcolor: '#EFF6FF', color: '#2563EB', fontWeight: 700, fontSize: '0.65rem', mb: 0.5 }} />
          <Typography sx={{ fontWeight: 800, fontSize: '1.4rem', color: '#0F172A', lineHeight: 1.2 }}>
            2BR/2BA Apartment $1,950/mo South Austin TX — Self-Guided Tour | Sunset Ridge
          </Typography>
        </Box>
      </Box>

      {/* SEO URL Preview */}
      <Box sx={{ bgcolor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', p: '10px 14px', mb: 2 }}>
        <Typography sx={{ fontSize: '0.62rem', color: '#94A3B8', fontWeight: 600, mb: 0.25 }}>SEO-Optimized URL</Typography>
        <Typography sx={{ fontSize: '0.78rem', color: '#2563EB', fontFamily: 'monospace' }}>
          homes.rently.com<span style={{ color: '#059669', fontWeight: 700 }}>/austin-tx/south-austin/2br-sunset-ridge-unit-102</span>
        </Typography>
        <Typography sx={{ fontSize: '0.65rem', color: '#94A3B8', mt: 0.5 }}>
          Meta: Spacious 2BR/2BA apartment in South Austin TX at Sunset Ridge. $1,950/mo. Self-guided tours 24/7. Smart lock access. Pet-friendly. Pool & gym. Apply online today.
        </Typography>
      </Box>

      <Grid container spacing={2.5}>
        {/* Left Column */}
        <Grid item xs={12} md={8}>
          {/* Photo Grid */}
          <Box sx={{ mb: 2.5 }}>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={8}>
                <Box sx={{
                  height: 240, borderRadius: '14px', background: rooms[0].color,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative',
                }}>
                  <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>{rooms[0].label}</Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.7rem', mt: 0.5, px: 2, textAlign: 'center' }}>{rooms[0].desc}</Typography>
                  <Chip label="Main Photo" size="small" sx={{ position: 'absolute', top: 10, left: 10, bgcolor: 'rgba(0,0,0,0.45)', color: '#fff', fontSize: '0.58rem' }} />
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Grid container spacing={1} sx={{ height: '100%' }}>
                  {rooms.slice(1, 5).map((room, idx) => (
                    <Grid item xs={6} key={idx}>
                      <Box sx={{
                        height: 112, borderRadius: '10px', background: room.color,
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '0.62rem', textAlign: 'center', px: 0.5 }}>{room.label}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Box>

          {/* Tour Activity Badge */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Chip icon={<People sx={{ fontSize: '14px !important', color: '#059669 !important' }} />}
              label="14 people toured this unit in the last 7 days"
              sx={{ bgcolor: '#ECFDF5', color: '#059669', fontWeight: 700, fontSize: '0.68rem', border: '1px solid #D1FAE5' }} />
            <Chip icon={<TrendingUp sx={{ fontSize: '14px !important', color: '#DC2626 !important' }} />}
              label="High demand"
              sx={{ bgcolor: '#FEF2F2', color: '#DC2626', fontWeight: 700, fontSize: '0.68rem', border: '1px solid #FECACA' }} />
          </Box>

          {/* AI Virtual Tour Player */}
          <Card sx={{ mb: 2.5, overflow: 'hidden' }}>
            <Box sx={{ p: '14px 16px', bgcolor: '#0F172A', display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ p: '4px 6px', borderRadius: '6px', background: 'linear-gradient(135deg, #7C3AED, #2563EB)' }}>
                <Typography sx={{ color: '#fff', fontSize: '0.6rem', fontWeight: 700 }}>AI VIRTUAL TOUR</Typography>
              </Box>
              <Typography sx={{ color: '#94A3B8', fontSize: '0.7rem' }}>Cinematic walkthrough powered by AI</Typography>
            </Box>

            {/* Tour Stage */}
            <Box sx={{
              position: 'relative', height: 280,
              background: rooms[currentRoom].color,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden',
            }}>
              {/* Ken Burns animation overlay */}
              <Box sx={{
                position: 'absolute', inset: 0,
                background: rooms[currentRoom].color,
                animation: playing ? 'kenBurns 5s ease-in-out infinite' : 'none',
                '@keyframes kenBurns': {
                  '0%': { transform: 'scale(1) translate(0,0)' },
                  '50%': { transform: 'scale(1.08) translate(-1%, 1%)' },
                  '100%': { transform: 'scale(1) translate(0,0)' },
                },
              }} />
              {/* Room label overlay */}
              <Box sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '1.8rem', textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}>
                  {rooms[currentRoom].label}
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.82rem', mt: 0.5 }}>
                  {rooms[currentRoom].desc}
                </Typography>
              </Box>
              {/* Unit details overlay */}
              <Box sx={{
                position: 'absolute', bottom: 12, right: 12, zIndex: 2,
                bgcolor: 'rgba(0,0,0,0.55)', borderRadius: '8px', p: '6px 10px',
              }}>
                <Typography sx={{ color: '#fff', fontSize: '0.62rem', fontWeight: 600 }}>Unit 102 · 1,050 sqft · $1,950/mo</Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.55rem' }}>2BR/2BA · Building A · South Austin</Typography>
              </Box>
              {/* Room counter */}
              <Box sx={{ position: 'absolute', top: 12, right: 12, zIndex: 2, bgcolor: 'rgba(0,0,0,0.45)', borderRadius: '6px', p: '4px 8px' }}>
                <Typography sx={{ color: '#fff', fontSize: '0.62rem' }}>{currentRoom + 1} / {rooms.length}</Typography>
              </Box>
            </Box>

            {/* Controls */}
            <Box sx={{ p: '12px 16px', bgcolor: '#1E293B' }}>
              <LinearProgress variant="determinate" value={progress}
                sx={{ mb: 1.5, height: 3, borderRadius: 2, bgcolor: '#334155', '& .MuiLinearProgress-bar': { bgcolor: '#7C3AED' } }} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton onClick={handlePlayPause} size="small"
                  sx={{ bgcolor: '#7C3AED', color: '#fff', '&:hover': { bgcolor: '#6D28D9' }, width: 34, height: 34 }}>
                  {playing ? <Pause sx={{ fontSize: 18 }} /> : <PlayArrow sx={{ fontSize: 18 }} />}
                </IconButton>
                <Box sx={{ display: 'flex', gap: 0.75, flex: 1, overflowX: 'auto' }}>
                  {rooms.map((room, idx) => (
                    <Chip key={idx} label={room.label} size="small" onClick={() => goToRoom(idx)}
                      sx={{
                        fontSize: '0.6rem', height: 22, cursor: 'pointer', flexShrink: 0,
                        bgcolor: currentRoom === idx ? '#7C3AED' : 'rgba(255,255,255,0.08)',
                        color: currentRoom === idx ? '#fff' : '#94A3B8',
                        border: currentRoom === idx ? '1px solid #7C3AED' : '1px solid transparent',
                      }} />
                  ))}
                </Box>
              </Box>
            </Box>

            {/* AI Voiceover */}
            <CardContent sx={{ bgcolor: '#F8FAFC', p: '12px 16px !important' }}>
              <Typography sx={{ fontSize: '0.62rem', color: '#7C3AED', fontWeight: 700, mb: 0.5 }}>🎙️ AI NARRATION</Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#475569', lineHeight: 1.6, fontStyle: 'italic' }}>
                "{voiceovers[currentRoom]}"
              </Typography>
            </CardContent>
          </Card>

          {/* Market Price Comparison */}
          <Card sx={{ mb: 2.5, border: '1px solid #D1FAE5' }}>
            <CardContent sx={{ p: '16px !important' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <TrendingUp sx={{ color: '#059669', fontSize: 20 }} />
                <Typography sx={{ fontWeight: 700, fontSize: '0.92rem', color: '#0F172A' }}>Market Price Comparison</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {[
                  { label: 'This Unit', value: '$1,950/mo', color: '#0F172A', note: 'Unit 102' },
                  { label: 'South Austin 2BR Avg', value: '$1,892/mo', color: '#64748B', note: 'Market average' },
                  { label: 'Difference', value: '+3% above', color: '#F59E0B', note: 'Still competitive' },
                ].map(item => (
                  <Box key={item.label} sx={{ flex: 1, minWidth: 120, bgcolor: '#F8FAFC', borderRadius: '10px', p: '10px 14px' }}>
                    <Typography sx={{ fontSize: '0.6rem', color: '#94A3B8', fontWeight: 600 }}>{item.label}</Typography>
                    <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: item.color }}>{item.value}</Typography>
                    <Typography sx={{ fontSize: '0.6rem', color: '#94A3B8' }}>{item.note}</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* Tour Reviews */}
          <Box sx={{ mb: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#0F172A' }}>Tour Reviews</Typography>
              <Chip label="4.8 ⭐ avg" size="small" sx={{ bgcolor: '#FFFBEB', color: '#D97706', fontWeight: 700, fontSize: '0.62rem' }} />
              <Chip label={`${tourReviews.length} reviews`} size="small" sx={{ bgcolor: '#F1F5F9', color: '#64748B', fontSize: '0.62rem' }} />
            </Box>
            <Grid container spacing={1.5}>
              {tourReviews.map(review => (
                <Grid item xs={12} sm={6} key={review.id}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent sx={{ p: '14px !important' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Avatar sx={{ width: 28, height: 28, bgcolor: '#7C3AED15', color: '#7C3AED', fontSize: '0.68rem', fontWeight: 700 }}>
                          {review.reviewer[0]}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#0F172A' }}>{review.reviewer}</Typography>
                          <Typography sx={{ fontSize: '0.6rem', color: '#94A3B8' }}>{review.date}</Typography>
                        </Box>
                        <Chip label="Self-Guided Tour" size="small" sx={{ bgcolor: '#EFF6FF', color: '#2563EB', fontSize: '0.55rem', height: 18 }} />
                      </Box>
                      <Rating value={review.rating} readOnly size="small" sx={{ mb: 0.75, '& .MuiRating-iconFilled': { color: '#F59E0B' } }} />
                      <Typography sx={{ fontSize: '0.72rem', color: '#64748B', lineHeight: 1.5 }}>{review.text}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Neighborhood Info */}
          <Card>
            <CardContent sx={{ p: '16px !important' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <LocationOn sx={{ color: '#2563EB', fontSize: 20 }} />
                <Typography sx={{ fontWeight: 700, fontSize: '0.92rem', color: '#0F172A' }}>Neighborhood — South Austin, TX</Typography>
              </Box>
              <Grid container spacing={1.5} sx={{ mb: 1.5 }}>
                {[
                  { icon: <DirectionsWalk sx={{ fontSize: 18, color: '#059669' }} />, label: 'Walk Score', value: '82', badge: 'Very Walkable' },
                  { icon: <DirectionsBus sx={{ fontSize: 18, color: '#2563EB' }} />, label: 'Transit Score', value: '68', badge: 'Excellent Transit' },
                  { icon: <Star sx={{ fontSize: 18, color: '#F59E0B' }} />, label: 'Bike Score', value: '74', badge: 'Very Bikeable' },
                ].map(item => (
                  <Grid item xs={4} key={item.label}>
                    <Box sx={{ textAlign: 'center', bgcolor: '#F8FAFC', borderRadius: '10px', p: '12px 8px' }}>
                      {item.icon}
                      <Typography sx={{ fontWeight: 800, fontSize: '1.3rem', color: '#0F172A', lineHeight: 1 }}>{item.value}</Typography>
                      <Typography sx={{ fontSize: '0.58rem', color: '#94A3B8', mt: 0.25 }}>{item.label}</Typography>
                      <Chip label={item.badge} size="small" sx={{ mt: 0.5, height: 16, fontSize: '0.52rem', bgcolor: '#F1F5F9', color: '#64748B' }} />
                    </Box>
                  </Grid>
                ))}
              </Grid>
              <Typography sx={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600, mb: 0.75 }}>Nearby Amenities</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                {['HEB Grocery (0.3 mi)', 'Barton Springs Pool (1.2 mi)', 'SoCo District (0.8 mi)', 'Lady Bird Lake (1.5 mi)', 'Austin-Bergstrom Airport (8 mi)', 'UT Austin (4 mi)'].map(a => (
                  <Chip key={a} label={a} size="small" sx={{ fontSize: '0.6rem', height: 22, bgcolor: '#EFF6FF', color: '#2563EB' }} />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column — Booking CTA */}
        <Grid item xs={12} md={4}>
          <Card sx={{ position: 'sticky', top: 20, border: '2px solid #2563EB20', boxShadow: '0 8px 32px -8px rgba(37,99,235,0.15)' }}>
            <CardContent sx={{ p: '20px !important' }}>
              <Box sx={{ mb: 1.5 }}>
                <Typography sx={{ fontWeight: 800, fontSize: '1.8rem', color: '#0F172A', lineHeight: 1 }}>$1,950<span style={{ fontSize: '1rem', fontWeight: 500, color: '#64748B' }}>/mo</span></Typography>
                <Typography sx={{ fontSize: '0.72rem', color: '#94A3B8', mt: 0.25 }}>Unit 102 · 2BR/2BA · 1,050 sqft</Typography>
              </Box>

              <Box sx={{ bgcolor: '#ECFDF5', borderRadius: '8px', p: '8px 12px', mb: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <CheckCircle sx={{ color: '#059669', fontSize: 16 }} />
                  <Typography sx={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700 }}>Available Now — Immediate Move-In</Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 1.5 }}>
                {[
                  { label: 'Type', value: '2BR/2BA' },
                  { label: 'Size', value: '1,050 sqft' },
                  { label: 'Floor', value: '1st Floor, Building A' },
                  { label: 'Deposit', value: '$1,950 (1 month)' },
                  { label: 'Pet Policy', value: 'Cats & dogs welcome' },
                  { label: 'Parking', value: 'Covered spot included' },
                ].map(f => (
                  <Box key={f.label} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: '0.68rem', color: '#94A3B8' }}>{f.label}</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#0F172A' }}>{f.value}</Typography>
                  </Box>
                ))}
              </Box>

              <Divider sx={{ my: 1.5 }} />

              <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', color: '#0F172A', mb: 1 }}>
                <CalendarMonth sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5, color: '#2563EB' }} />
                Book a Self-Guided Tour
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, mb: 1.5 }}>
                {timeSlots.map(slot => (
                  <Button key={slot} variant={selectedSlot === slot ? 'contained' : 'outlined'} size="small"
                    onClick={() => setSelectedSlot(slot)}
                    startIcon={<AccessTime sx={{ fontSize: '14px !important' }} />}
                    sx={{
                      fontSize: '0.68rem', justifyContent: 'flex-start', borderRadius: '8px',
                      bgcolor: selectedSlot === slot ? '#2563EB' : 'transparent',
                      color: selectedSlot === slot ? '#fff' : '#2563EB',
                      borderColor: '#2563EB',
                      '&:hover': { bgcolor: selectedSlot === slot ? '#1D4ED8' : '#EFF6FF' },
                    }}>
                    {slot}
                  </Button>
                ))}
              </Box>

              <Button variant="contained" fullWidth size="large"
                disabled={!selectedSlot}
                sx={{
                  borderRadius: '10px', bgcolor: '#059669', fontWeight: 700, fontSize: '0.85rem',
                  '&:hover': { bgcolor: '#047857' }, mb: 1,
                }}>
                {selectedSlot ? `Book Tour — ${selectedSlot}` : 'Select a Time Slot'}
              </Button>

              <Button variant="outlined" fullWidth size="small"
                sx={{ borderRadius: '8px', borderColor: '#E2E8F0', color: '#64748B', fontSize: '0.7rem' }}>
                Contact Leasing Office
              </Button>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 1.5 }}>
                <VerifiedUser sx={{ fontSize: 14, color: '#94A3B8' }} />
                <Typography sx={{ fontSize: '0.6rem', color: '#94A3B8' }}>Verified listing · Smart lock access · Instant confirmation</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
