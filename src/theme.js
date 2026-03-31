import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#2563EB', light: '#3B82F6', dark: '#1D4ED8' },
    secondary: { main: '#7C3AED', light: '#8B5CF6', dark: '#6D28D9' },
    success: { main: '#10B981', light: '#D1FAE5', dark: '#059669' },
    warning: { main: '#F59E0B', light: '#FEF3C7', dark: '#D97706' },
    error: { main: '#EF4444', light: '#FEE2E2', dark: '#DC2626' },
    info: { main: '#06B6D4', light: '#CFFAFE', dark: '#0891B2' },
    background: { default: '#F8FAFC', paper: '#FFFFFF' },
    text: { primary: '#0F172A', secondary: '#64748B', disabled: '#CBD5E1' },
    divider: '#E2E8F0',
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h4: { fontWeight: 800, fontSize: '1.75rem', letterSpacing: '-0.03em', lineHeight: 1.2 },
    h5: { fontWeight: 700, fontSize: '1.25rem', letterSpacing: '-0.02em' },
    h6: { fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.01em' },
    subtitle1: { fontWeight: 600, fontSize: '0.95rem' },
    subtitle2: { fontWeight: 600, fontSize: '0.8rem', color: '#64748B' },
    body1: { fontSize: '0.9rem', lineHeight: 1.6 },
    body2: { fontSize: '0.82rem', color: '#64748B', lineHeight: 1.5 },
    caption: { fontSize: '0.72rem', color: '#94A3B8' },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': { boxSizing: 'border-box' },
        body: { overflowX: 'hidden' },
        '@import': "url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap')",
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px rgba(15,23,42,0.03)',
          transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
          '&:hover': {
            boxShadow: '0 12px 28px -8px rgba(15,23,42,0.1)',
            transform: 'translateY(-2px)',
            borderColor: '#CBD5E1',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 10, textTransform: 'none', fontWeight: 600, padding: '8px 20px', fontSize: '0.82rem' },
        contained: { boxShadow: 'none', '&:hover': { boxShadow: '0 4px 14px rgba(37,99,235,0.35)' } },
        outlined: { borderWidth: '1.5px', '&:hover': { borderWidth: '1.5px' } },
      },
    },
    MuiChip: {
      styleOverrides: { root: { fontWeight: 600, borderRadius: 8 } },
    },
  },
});

export default theme;
