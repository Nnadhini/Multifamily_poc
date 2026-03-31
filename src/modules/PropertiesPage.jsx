import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Chip, IconButton, Button, TextField, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions, Divider } from '@mui/material';
import { ArrowBack, Apartment, Search, BedOutlined, SquareFoot, Person, CalendarMonth, Close } from '@mui/icons-material';
import { units } from '../mockData';

const statusConfig = {
  occupied: { color: '#059669', bg: '#05966912', label: 'Occupied' },
  vacant: { color: '#DC2626', bg: '#DC262612', label: 'Vacant' },
  maintenance: { color: '#F59E0B', bg: '#F59E0B12', label: 'Maintenance' },
  pending: { color: '#2563EB', bg: '#2563EB12', label: 'Pending' },
};

export default function PropertiesPage({ onNavigate }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [buildingFilter, setBuildingFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const buildings = ['all', ...Array.from(new Set(units.map(u => u.building)))];
  const statuses = ['all', 'occupied', 'vacant', 'maintenance', 'pending'];

  const filtered = units.filter(u => {
    const matchSearch = u.unit.includes(search) || (u.tenant || '').toLowerCase().includes(search.toLowerCase()) || u.type.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || u.status === statusFilter;
    const matchBuilding = buildingFilter === 'all' || u.building === buildingFilter;
    return matchSearch && matchStatus && matchBuilding;
  });

  const totalVacant = units.filter(u => u.status === 'vacant').length;
  const vacancyRate = ((totalVacant / units.length) * 100).toFixed(1);
  const totalRevenue = units.filter(u => u.status === 'occupied').reduce((s, u) => s + u.rent, 0);
  const occupiedUnits = units.filter(u => u.status === 'occupied');
  const avgRevPerSqft = occupiedUnits.length > 0
    ? (occupiedUnits.reduce((s, u) => s + u.rent / u.sqft, 0) / occupiedUnits.length).toFixed(2)
    : '0.00';

  return (
    <Box sx={{ p: { xs: '16px', md: '20px 24px' }, maxWidth: 1440 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <IconButton onClick={() => onNavigate('home')} size="small" sx={{ color: '#64748B', bgcolor: '#F1F5F9' }}><ArrowBack sx={{ fontSize: 16 }} /></IconButton>
        <Box sx={{ p: '6px', borderRadius: '10px', bgcolor: '#7C3AED12' }}><Apartment sx={{ fontSize: 20, color: '#7C3AED' }} /></Box>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: '1.4rem', color: '#0F172A' }}>Properties</Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>Unit status, vacancy, rent and tenant details</Typography>
        </Box>
      </Box>

      <Grid container spacing={1.75} sx={{ mb: 2.5 }}>
        {[
          { label: 'Total Units', value: units.length, color: '#0F172A' },
          { label: 'Occupied', value: units.filter(u => u.status === 'occupied').length, color: '#059669' },
          { label: 'Vacancy Rate', value: `${vacancyRate}%`, color: '#DC2626' },
          { label: 'Monthly Revenue', value: `$${totalRevenue.toLocaleString()}`, color: '#2563EB' },
          { label: 'Avg Rev/sqft', value: `$${avgRevPerSqft}`, color: '#7C3AED' },
        ].map(s => (
          <Grid item xs={6} md key={s.label}>
            <Card><CardContent sx={{ p: '14px !important' }}>
              <Typography sx={{ fontSize: '0.6rem', color: '#94A3B8', fontWeight: 600, mb: 0.5 }}>{s.label}</Typography>
              <Typography sx={{ fontWeight: 800, fontSize: '1.3rem', color: s.color, lineHeight: 1 }}>{s.value}</Typography>
            </CardContent></Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        <TextField size="small" placeholder="Search units, tenants..." value={search} onChange={e => setSearch(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 16, color: '#94A3B8' }} /></InputAdornment>, sx: { fontSize: '0.72rem', height: 34, borderRadius: '8px' } }}
          sx={{ minWidth: 220 }} />
        <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
          {statuses.map(s => (
            <Chip key={s} label={s === 'all' ? 'All Status' : statusConfig[s]?.label || s} size="small" onClick={() => setStatusFilter(s)}
              sx={{ height: 28, fontSize: '0.65rem', fontWeight: 600, cursor: 'pointer',
                bgcolor: statusFilter === s ? (s === 'all' ? '#0F172A' : statusConfig[s]?.bg) : '#F1F5F9',
                color: statusFilter === s ? (s === 'all' ? '#fff' : statusConfig[s]?.color) : '#64748B',
              }} />
          ))}
        </Box>
        <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
          {buildings.map(b => (
            <Chip key={b} label={b === 'all' ? 'All Buildings' : b} size="small" onClick={() => setBuildingFilter(b)}
              sx={{ height: 28, fontSize: '0.65rem', fontWeight: 600, cursor: 'pointer',
                bgcolor: buildingFilter === b ? '#7C3AED' : '#F1F5F9',
                color: buildingFilter === b ? '#fff' : '#64748B',
              }} />
          ))}
        </Box>
      </Box>

      <Grid container spacing={1.75}>
        {filtered.map(unit => {
          const cfg = statusConfig[unit.status];
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={unit.id}>
              <Card onClick={() => setSelected(unit)} sx={{ cursor: 'pointer', border: '1px solid #E2E8F0', boxShadow: 'none', borderRadius: '12px', '&:hover': { borderColor: '#7C3AED', boxShadow: '0 4px 12px rgba(124,58,237,0.1)' } }}>
                <CardContent sx={{ p: '14px !important' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.25 }}>
                    <Box>
                      <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#0F172A' }}>Unit {unit.unit}</Typography>
                      <Typography sx={{ fontSize: '0.65rem', color: '#64748B' }}>{unit.building}</Typography>
                    </Box>
                    <Chip label={cfg.label} size="small" sx={{ height: 20, fontSize: '0.58rem', fontWeight: 700, bgcolor: cfg.bg, color: cfg.color }} />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1.5, mb: 1.25 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                      <BedOutlined sx={{ fontSize: 13, color: '#94A3B8' }} />
                      <Typography sx={{ fontSize: '0.65rem', color: '#64748B' }}>{unit.type}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                      <SquareFoot sx={{ fontSize: 13, color: '#94A3B8' }} />
                      <Typography sx={{ fontSize: '0.65rem', color: '#64748B' }}>{unit.sqft} sqft</Typography>
                    </Box>
                  </Box>
                  <Typography sx={{ fontWeight: 800, fontSize: '1.25rem', color: '#059669' }}>${unit.rent.toLocaleString()}<Typography component="span" sx={{ fontSize: '0.65rem', color: '#94A3B8', fontWeight: 400 }}>/mo</Typography></Typography>
                  {unit.tenant && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, mt: 0.75 }}>
                      <Person sx={{ fontSize: 13, color: '#94A3B8' }} />
                      <Typography sx={{ fontSize: '0.65rem', color: '#64748B' }}>{unit.tenant}</Typography>
                    </Box>
                  )}
                  {unit.leaseEnd && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, mt: 0.4 }}>
                      <CalendarMonth sx={{ fontSize: 13, color: '#94A3B8' }} />
                      <Typography sx={{ fontSize: '0.65rem', color: '#64748B' }}>Lease ends {unit.leaseEnd}</Typography>
                    </Box>
                  )}
                  {unit.daysVacant && (
                    <Chip label={`${unit.daysVacant} days vacant`} size="small" sx={{ mt: 0.75, height: 18, fontSize: '0.58rem', bgcolor: '#DC262612', color: '#DC2626', fontWeight: 600 }} />
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Dialog open={!!selected} onClose={() => setSelected(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '14px' } }}>
        {selected && (
          <>
            <DialogTitle sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#0F172A', pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Unit {selected.unit} — {selected.building}
              <IconButton onClick={() => setSelected(null)} size="small"><Close sx={{ fontSize: 18 }} /></IconButton>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                {[
                  { label: 'Type', value: selected.type },
                  { label: 'Size', value: `${selected.sqft} sqft` },
                  { label: 'Current Rent', value: `$${selected.rent.toLocaleString()}/mo` },
                  { label: 'Market Rent', value: `$${selected.marketRent.toLocaleString()}/mo` },
                  { label: 'Status', value: statusConfig[selected.status]?.label },
                  { label: 'Tour Score', value: `${selected.tourScore}/100` },
                  { label: 'Tenant', value: selected.tenant || 'No tenant' },
                  { label: 'Lease End', value: selected.leaseEnd || 'N/A' },
                ].map(f => (
                  <Grid item xs={6} key={f.label}>
                    <Typography sx={{ fontSize: '0.62rem', color: '#94A3B8', fontWeight: 600 }}>{f.label}</Typography>
                    <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A' }}>{f.value}</Typography>
                  </Grid>
                ))}
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2, pt: 0, gap: 1 }}>
              <Button variant="outlined" size="small" sx={{ fontSize: '0.72rem', borderRadius: '8px', borderColor: '#E2E8F0', color: '#64748B' }} onClick={() => setSelected(null)}>Close</Button>
              <Button variant="contained" size="small" sx={{ fontSize: '0.72rem', borderRadius: '8px', bgcolor: '#7C3AED' }}>Edit Unit</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
