import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Chip, IconButton, Button } from '@mui/material';
import { ArrowBack, Apartment, Add } from '@mui/icons-material';

export default function PropertiesPage({ onNavigate }) {
  return (
    <Box sx={{ p: { xs: '16px', md: '20px 24px' }, maxWidth: 1440 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <IconButton onClick={() => onNavigate('home')} size="small" sx={{ color: '#64748B', bgcolor: '#F1F5F9' }}>
          <ArrowBack sx={{ fontSize: 16 }} />
        </IconButton>
        <Box sx={{ p: '6px', borderRadius: '10px', bgcolor: '#7C3AED12' }}>
          <Apartment sx={{ fontSize: 20, color: '#7C3AED' }} />
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: '1.4rem', color: '#0F172A' }}>Properties</Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>Unit status, vacancy, photos, documents</Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.75, mb: 2.5 }}>
        <Button variant="outlined" size="small" sx={{ fontSize: '0.72rem', height: 32, borderColor: '#E2E8F0', color: '#64748B', borderRadius: '8px' }}>Filter</Button>
        <Button variant="contained" size="small" startIcon={<Add sx={{ fontSize: '14px !important' }} />}
          sx={{ fontSize: '0.72rem', height: 32, borderRadius: '8px', bgcolor: '#7C3AED' }}>Add New</Button>
      </Box>

      <Card sx={{ p: 5, textAlign: 'center', bgcolor: '#F8FAFC', border: '2px dashed #E2E8F0' }}>
        <Box sx={{ p: '12px', borderRadius: '14px', bgcolor: '#7C3AED08', display: 'inline-flex', mb: 2 }}>
          <Apartment sx={{ fontSize: 36, color: '#7C3AED' }} />
        </Box>
        <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#0F172A', mb: 0.5 }}>Properties</Typography>
        <Typography sx={{ fontSize: '0.82rem', color: '#94A3B8', maxWidth: 400, mx: 'auto', lineHeight: 1.5 }}>
          Unit status, vacancy, photos, documents. This module is ready for development — the navigation and routing are fully wired up.
        </Typography>
        <Chip label="Module Ready for Development" size="small" sx={{ mt: 2, bgcolor: '#7C3AED10', color: '#7C3AED', fontWeight: 600 }} />
      </Card>
    </Box>
  );
}
