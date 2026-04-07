import React, { useState } from 'react';
import {
  Box, Card, CardContent, TextField, Button, Typography,
  Alert, Divider, CircularProgress, InputAdornment, IconButton, Tabs, Tab,
} from '@mui/material';
import { Visibility, VisibilityOff, Home } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginPage() {
  const { login, register, loading, error } = useAuth();
  const [tab, setTab]               = useState(0); // 0=login, 1=register
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [fullName, setFullName]     = useState('');
  const [showPass, setShowPass]     = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    try {
      if (tab === 0) {
        await login(email, password);
      } else {
        if (!fullName.trim()) { setLocalError('Full name is required'); return; }
        await register(email, password, fullName);
      }
    } catch (err) {
      setLocalError(err.message);
    }
  };

  const fillDemo = () => { setEmail('manager@rently.com'); setPassword('Manager1234!'); };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        p: 2,
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 420, borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          {/* Logo */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Home sx={{ color: 'primary.main', fontSize: 32 }} />
              <Typography variant="h5" fontWeight={700} color="primary.main">
                Rently Portal
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Multifamily Property Management
            </Typography>
          </Box>

          <Tabs value={tab} onChange={(_, v) => setTab(v)} centered sx={{ mb: 3 }}>
            <Tab label="Sign In" />
            <Tab label="Register" />
          </Tabs>

          {(error || localError) && (
            <Alert severity="error" sx={{ mb: 2 }}>{localError || error}</Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            {tab === 1 && (
              <TextField
                label="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                fullWidth
                size="small"
                sx={{ mb: 2 }}
                autoComplete="name"
              />
            )}

            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              size="small"
              sx={{ mb: 2 }}
              autoComplete="email"
              required
            />

            <TextField
              label="Password"
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              size="small"
              sx={{ mb: 3 }}
              autoComplete={tab === 0 ? 'current-password' : 'new-password'}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setShowPass(!showPass)} edge="end">
                      {showPass ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ mb: 2, textTransform: 'none', fontWeight: 600 }}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : tab === 0 ? 'Sign In' : 'Create Account'}
            </Button>
          </Box>

          <Divider sx={{ my: 2 }}>
            <Typography variant="caption" color="text.secondary">or</Typography>
          </Divider>

          <Button
            variant="outlined"
            fullWidth
            size="small"
            onClick={fillDemo}
            sx={{ textTransform: 'none' }}
          >
            Use demo credentials
          </Button>

          <Typography variant="caption" color="text.secondary" display="block" textAlign="center" sx={{ mt: 2 }}>
            Demo: manager@rently.com / Manager1234!
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
