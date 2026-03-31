import React from 'react';
import { Drawer, Box, Typography, IconButton, Chip, Divider, Avatar, Button, LinearProgress } from '@mui/material';
import { Close, Edit, Tour, AttachMoney, CalendarMonth, SquareFoot, AutoAwesome, TrendingUp, TrendingDown } from '@mui/icons-material';

const statusConfig = {
  occupied: { label: 'Occupied', color: '#059669', bg: '#ECFDF5' },
  vacant: { label: 'Vacant', color: '#DC2626', bg: '#FEF2F2' },
  pending: { label: 'Pending', color: '#D97706', bg: '#FFFBEB' },
  maintenance: { label: 'Maintenance', color: '#7C3AED', bg: '#F5F3FF' },
};

export default function UnitDetailPanel({ unit, open, onClose }) {
  if (!unit) return null;
  const sc = statusConfig[unit.status];
  const diff = ((unit.rent - unit.marketRent) / unit.marketRent * 100).toFixed(1);
  const isOver = parseFloat(diff) > 0;

  return (
    <Drawer anchor="right" open={open} onClose={onClose}
      sx={{ '& .MuiDrawer-paper': { width: 360, borderTopLeftRadius: 20, borderBottomLeftRadius: 20, border: 'none', boxShadow: '-12px 0 40px rgba(15,23,42,0.1)' } }}>
      <Box sx={{ p: 2.5, overflowY: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: '1.35rem', color: '#0F172A' }}>Unit #{unit.unit}</Typography>
            <Typography variant="body2">{unit.building}</Typography>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ bgcolor: '#F1F5F9', '&:hover': { bgcolor: '#E2E8F0' } }}><Close sx={{ fontSize: 16 }} /></IconButton>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mb: 2.5 }}>
          <Chip label={sc.label} sx={{ bgcolor: sc.bg, color: sc.color, fontWeight: 700, fontSize: '0.76rem', height: 28 }} />
          <Chip label={`Score: ${unit.tourScore}`} sx={{ bgcolor: unit.tourScore >= 80 ? '#ECFDF5' : '#FFFBEB', color: unit.tourScore >= 80 ? '#059669' : '#D97706', fontWeight: 700, fontSize: '0.76rem', height: 28 }} />
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mb: 2.5 }}>
          {[
            { icon: <AttachMoney />, label: 'Rent', value: `$${unit.rent.toLocaleString()}/mo` },
            { icon: <SquareFoot />, label: 'Size', value: `${unit.sqft} sqft` },
            { icon: <CalendarMonth />, label: 'Lease End', value: unit.leaseEnd || 'N/A' },
            { icon: <Tour />, label: 'Type', value: unit.type },
          ].map(({ icon, label, value }) => (
            <Box key={label} sx={{ p: 1.25, borderRadius: '10px', bgcolor: '#F8FAFC', border: '1px solid #F1F5F9' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.35 }}>
                {React.cloneElement(icon, { sx: { fontSize: 14, color: '#94A3B8' } })}
                <Typography sx={{ color: '#94A3B8', fontWeight: 600, fontSize: '0.62rem' }}>{label}</Typography>
              </Box>
              <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#0F172A' }}>{value}</Typography>
            </Box>
          ))}
        </Box>

        {/* AI Market Analysis */}
        <Box sx={{ p: 1.5, borderRadius: '12px', background: 'linear-gradient(135deg, #0F172A, #1E293B)', border: '1px solid #334155', mb: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1 }}>
            <AutoAwesome sx={{ fontSize: 14, color: '#7C3AED' }} />
            <Typography sx={{ color: '#F1F5F9', fontWeight: 700, fontSize: '0.78rem' }}>AI Market Analysis</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
            <Typography sx={{ color: '#94A3B8', fontSize: '0.7rem' }}>Your Price</Typography>
            <Typography sx={{ color: '#F1F5F9', fontWeight: 700, fontSize: '0.78rem' }}>${unit.rent.toLocaleString()}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
            <Typography sx={{ color: '#94A3B8', fontSize: '0.7rem' }}>Market Rate</Typography>
            <Typography sx={{ color: '#60A5FA', fontWeight: 700, fontSize: '0.78rem' }}>${unit.marketRent.toLocaleString()}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ color: '#94A3B8', fontSize: '0.7rem' }}>Difference</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {isOver ? <TrendingUp sx={{ fontSize: 12, color: '#F59E0B' }} /> : <TrendingDown sx={{ fontSize: 12, color: '#10B981' }} />}
              <Typography sx={{ color: isOver ? '#F59E0B' : '#10B981', fontWeight: 700, fontSize: '0.78rem' }}>{isOver ? '+' : ''}{diff}%</Typography>
            </Box>
          </Box>
          {unit.status === 'vacant' && parseFloat(diff) > 2 && (
            <Box sx={{ mt: 1, p: 1, borderRadius: '8px', bgcolor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <Typography sx={{ fontSize: '0.68rem', color: '#FCA5A5', lineHeight: 1.4 }}>
                Overpriced by {diff}%. Reducing to ${unit.marketRent} could fill {Math.round(unit.daysVacant * 0.6)} days faster.
              </Typography>
            </Box>
          )}
          {unit.status === 'occupied' && parseFloat(diff) < -3 && (
            <Box sx={{ mt: 1, p: 1, borderRadius: '8px', bgcolor: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
              <Typography sx={{ fontSize: '0.68rem', color: '#6EE7B7', lineHeight: 1.4 }}>
                Underpriced. Consider increasing by ${Math.abs(unit.rent - unit.marketRent)}/mo at renewal (+${Math.abs(unit.rent - unit.marketRent) * 12}/yr).
              </Typography>
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        {unit.tenant && (
          <Box sx={{ mb: 2.5 }}>
            <Typography sx={{ fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.62rem', mb: 1 }}>Tenant</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, p: 1.5, borderRadius: '10px', bgcolor: '#F8FAFC', border: '1px solid #F1F5F9' }}>
              <Avatar sx={{ bgcolor: '#2563EB', width: 36, height: 36, fontSize: 13 }}>{unit.tenant.split(' ').map(n => n[0]).join('')}</Avatar>
              <Box>
                <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>{unit.tenant}</Typography>
                <Typography sx={{ color: '#94A3B8', fontSize: '0.65rem' }}>Active Lease</Typography>
              </Box>
            </Box>
          </Box>
        )}

        <Box sx={{ mb: 2.5 }}>
          <Typography sx={{ fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.62rem', mb: 1.25 }}>Tour Performance (30d)</Typography>
          {[
            { label: 'Scheduled', value: 8, max: 8, color: '#3B82F6' },
            { label: 'Completed', value: 6, max: 8, color: '#8B5CF6' },
            { label: 'Applications', value: 2, max: 8, color: '#10B981' },
          ].map(({ label, value, max, color }) => (
            <Box key={label} sx={{ mb: 1.25 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.35 }}>
                <Typography sx={{ fontSize: '0.72rem', color: '#64748B' }}>{label}</Typography>
                <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#0F172A' }}>{value}</Typography>
              </Box>
              <LinearProgress variant="determinate" value={(value/max)*100}
                sx={{ height: 5, borderRadius: 3, bgcolor: '#F1F5F9', '& .MuiLinearProgress-bar': { borderRadius: 3, bgcolor: color } }} />
            </Box>
          ))}
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="contained" fullWidth startIcon={<Edit sx={{ fontSize: '16px !important' }} />} sx={{ py: 1, fontSize: '0.78rem' }}>Edit</Button>
          <Button variant="outlined" fullWidth startIcon={<Tour sx={{ fontSize: '16px !important' }} />} sx={{ py: 1, fontSize: '0.78rem' }}>Tour</Button>
        </Box>
      </Box>
    </Drawer>
  );
}
