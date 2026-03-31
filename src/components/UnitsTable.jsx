import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton, TextField, InputAdornment, ToggleButtonGroup, ToggleButton, Avatar, Tooltip } from '@mui/material';
import { Search, OpenInNew, TrendingUp, TrendingDown } from '@mui/icons-material';
import { units } from '../mockData';

const statusConfig = {
  occupied: { label: 'Occupied', color: '#059669', bg: '#ECFDF5' },
  vacant: { label: 'Vacant', color: '#DC2626', bg: '#FEF2F2' },
  pending: { label: 'Pending', color: '#D97706', bg: '#FFFBEB' },
  maintenance: { label: 'Maintenance', color: '#7C3AED', bg: '#F5F3FF' },
};

export default function UnitsTable({ onSelectUnit }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const filtered = units.filter(u => {
    if (filter !== 'all' && u.status !== filter) return false;
    if (search && !u.unit.includes(search) && !u.tenant?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const getRentDiff = (u) => ((u.rent - u.marketRent) / u.marketRent * 100).toFixed(1);
  const getScoreColor = (s) => s >= 80 ? '#059669' : s >= 60 ? '#D97706' : '#DC2626';

  return (
    <Card>
      <CardContent sx={{ p: '20px !important' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1.5 }}>
          <Box>
            <Typography variant="h6">Units Overview</Typography>
            <Typography variant="body2">{filtered.length} units across all buildings</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            <TextField size="small" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 16, color: '#94A3B8' }} /></InputAdornment>, sx: { borderRadius: '10px', fontSize: '0.8rem', height: 36 } }} sx={{ width: 180 }} />
            <ToggleButtonGroup value={filter} exclusive onChange={(_, v) => v && setFilter(v)} size="small"
              sx={{ '& .MuiToggleButton-root': { borderRadius: '8px !important', textTransform: 'none', fontSize: '0.72rem', fontWeight: 600, px: 1.25, py: 0.5 } }}>
              <ToggleButton value="all">All</ToggleButton>
              <ToggleButton value="occupied">Occupied</ToggleButton>
              <ToggleButton value="vacant">Vacant</ToggleButton>
              <ToggleButton value="pending">Pending</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ '& th': { color: '#64748B', fontWeight: 700, fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '2px solid #E2E8F0', py: 1.25 } }}>
                <TableCell>Unit</TableCell><TableCell>Type</TableCell><TableCell>Rent</TableCell><TableCell>vs Market</TableCell><TableCell>Status</TableCell><TableCell>Tenant</TableCell><TableCell>Score</TableCell><TableCell align="center" sx={{ width: 40 }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((unit) => {
                const sc = statusConfig[unit.status];
                const diff = getRentDiff(unit);
                const isOver = parseFloat(diff) > 0;
                return (
                  <TableRow key={unit.id} hover onClick={() => onSelectUnit?.(unit)}
                    sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#F8FAFC' }, '& td': { py: 1.25, borderBottom: '1px solid #F1F5F9', fontSize: '0.8rem' } }}>
                    <TableCell>
                      <Box>
                        <Typography sx={{ fontWeight: 700, color: '#0F172A', fontSize: '0.82rem' }}>#{unit.unit}</Typography>
                        <Typography sx={{ color: '#94A3B8', fontSize: '0.65rem' }}>{unit.building}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell><Typography sx={{ color: '#64748B', fontSize: '0.76rem' }}>{unit.type}<br/><span style={{ fontSize: '0.65rem', color: '#94A3B8' }}>{unit.sqft} sqft</span></Typography></TableCell>
                    <TableCell><Typography sx={{ fontWeight: 700, color: '#0F172A', fontSize: '0.85rem' }}>${unit.rent.toLocaleString()}</Typography></TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {isOver ? <TrendingUp sx={{ fontSize: 14, color: '#D97706' }} /> : <TrendingDown sx={{ fontSize: 14, color: '#059669' }} />}
                        <Typography sx={{ fontSize: '0.72rem', fontWeight: 600, color: isOver ? '#D97706' : '#059669' }}>{isOver ? '+' : ''}{diff}%</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={sc.label} size="small" sx={{ bgcolor: sc.bg, color: sc.color, fontWeight: 700, fontSize: '0.66rem', height: 22 }} />
                      {unit.daysVacant && <Typography sx={{ color: '#94A3B8', mt: 0.25, fontSize: '0.6rem' }}>{unit.daysVacant}d vacant</Typography>}
                    </TableCell>
                    <TableCell>
                      {unit.tenant ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                          <Avatar sx={{ width: 22, height: 22, fontSize: 9, bgcolor: '#E2E8F0', color: '#64748B' }}>{unit.tenant.split(' ').map(n => n[0]).join('')}</Avatar>
                          <Typography sx={{ fontSize: '0.76rem' }}>{unit.tenant}</Typography>
                        </Box>
                      ) : <Typography sx={{ color: '#CBD5E1', fontSize: '0.76rem' }}>-</Typography>}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="AI Tour Readiness Score" arrow>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Box sx={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: `${getScoreColor(unit.tourScore)}15`, border: `2px solid ${getScoreColor(unit.tourScore)}` }}>
                            <Typography sx={{ fontSize: '0.6rem', fontWeight: 800, color: getScoreColor(unit.tourScore) }}>{unit.tourScore}</Typography>
                          </Box>
                        </Box>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center"><IconButton size="small"><OpenInNew sx={{ fontSize: 14, color: '#CBD5E1' }} /></IconButton></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
