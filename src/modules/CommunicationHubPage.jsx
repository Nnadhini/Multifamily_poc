import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Chip, IconButton, Button, Avatar, Divider, TextField, InputAdornment, Badge } from '@mui/material';
import { ArrowBack, Chat, Search, Flag, Reply, CheckCircle, Build, Receipt, QuestionAnswer } from '@mui/icons-material';
import { tenantMessages } from '../mockData';

const categoryConfig = {
  maintenance: { color: '#F59E0B', bg: '#F59E0B12', icon: Build, label: 'Maintenance' },
  lease: { color: '#2563EB', bg: '#2563EB12', icon: Receipt, label: 'Lease' },
  general: { color: '#7C3AED', bg: '#7C3AED12', icon: QuestionAnswer, label: 'General' },
  payment: { color: '#DC2626', bg: '#DC262612', icon: Receipt, label: 'Payment' },
};

const quickReplies = [
  'Thank you for reaching out. We\'ll look into this and get back to you within 24 hours.',
  'Your maintenance request has been logged and a technician will be assigned shortly.',
  'We have received your lease renewal inquiry. Our team will contact you within 2 business days.',
  'We appreciate your patience. This issue has been escalated to our management team.',
];

export default function CommunicationHubPage({ onNavigate }) {
  const [messages, setMessages] = useState(tenantMessages);
  const [selected, setSelected] = useState(messages[0]);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [reply, setReply] = useState('');
  const [resolved, setResolved] = useState({});
  const [flagged, setFlagged] = useState({});
  const [replied, setReplied] = useState({});

  const markRead = (id) => setMessages(prev => prev.map(m => m.id === id ? { ...m, unread: false } : m));
  const toggleFlag = (id) => setFlagged(prev => ({ ...prev, [id]: !prev[id] }));
  const resolveMsg = (id) => setResolved(prev => ({ ...prev, [id]: true }));
  const sendReply = () => {
    if (reply.trim()) {
      setReplied(prev => ({ ...prev, [selected.id]: true }));
      setMessages(prev => prev.map(m => m.id === selected.id ? { ...m, unread: false } : m));
      setReply('');
    }
  };

  const filtered = messages.filter(m => {
    const matchSearch = m.tenant.toLowerCase().includes(search.toLowerCase()) || m.subject.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === 'all' || m.category === catFilter;
    return matchSearch && matchCat;
  });

  const unreadCount = messages.filter(m => m.unread).length;
  const priorityCount = messages.filter(m => m.priority).length;

  return (
    <Box sx={{ p: { xs: '16px', md: '20px 24px' }, maxWidth: 1440 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <IconButton onClick={() => onNavigate('home')} size="small" sx={{ color: '#64748B', bgcolor: '#F1F5F9' }}><ArrowBack sx={{ fontSize: 16 }} /></IconButton>
        <Box sx={{ p: '6px', borderRadius: '10px', bgcolor: '#2563EB12' }}>
          <Badge badgeContent={unreadCount} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.58rem', minWidth: 16, height: 16 } }}>
            <Chat sx={{ fontSize: 20, color: '#2563EB' }} />
          </Badge>
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: '1.4rem', color: '#0F172A' }}>Communication Hub</Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>{unreadCount} unread · {priorityCount} priority · Tenant messages & quick replies</Typography>
        </Box>
      </Box>

      <Grid container spacing={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden', height: 580 }}>
        {/* Sidebar */}
        <Grid item xs={12} md={4} sx={{ borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', bgcolor: '#FAFAFA' }}>
          <Box sx={{ p: 1.5, borderBottom: '1px solid #E2E8F0' }}>
            <TextField size="small" fullWidth placeholder="Search messages..." value={search} onChange={e => setSearch(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 15, color: '#94A3B8' }} /></InputAdornment>, sx: { fontSize: '0.72rem', height: 32, borderRadius: '8px' } }} />
            <Box sx={{ display: 'flex', gap: 0.5, mt: 1, flexWrap: 'wrap' }}>
              {['all', 'maintenance', 'lease', 'general', 'payment'].map(c => (
                <Chip key={c} label={c === 'all' ? 'All' : categoryConfig[c]?.label} size="small" onClick={() => setCatFilter(c)}
                  sx={{ height: 22, fontSize: '0.58rem', fontWeight: 600, cursor: 'pointer',
                    bgcolor: catFilter === c ? '#2563EB' : '#F1F5F9',
                    color: catFilter === c ? '#fff' : '#64748B',
                  }} />
              ))}
            </Box>
          </Box>
          <Box sx={{ overflowY: 'auto', flex: 1 }}>
            {filtered.map(msg => {
              const cc = categoryConfig[msg.category];
              return (
                <Box key={msg.id} onClick={() => { setSelected(msg); markRead(msg.id); }}
                  sx={{ p: 1.5, cursor: 'pointer', borderBottom: '1px solid #F1F5F9',
                    bgcolor: selected?.id === msg.id ? '#EFF6FF' : msg.unread ? '#FFFBEB' : 'transparent',
                    '&:hover': { bgcolor: '#F8FAFC' },
                  }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Avatar sx={{ width: 28, height: 28, fontSize: '0.62rem', bgcolor: '#2563EB18', color: '#2563EB', fontWeight: 700, flexShrink: 0 }}>
                      {msg.avatar}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography sx={{ fontSize: '0.72rem', fontWeight: msg.unread ? 800 : 600, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 100 }}>{msg.tenant}</Typography>
                        <Typography sx={{ fontSize: '0.58rem', color: '#94A3B8', flexShrink: 0, ml: 0.5 }}>{msg.time}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {msg.unread && <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#2563EB', flexShrink: 0 }} />}
                        {(msg.priority || flagged[msg.id]) && <Flag sx={{ fontSize: 10, color: '#DC2626', flexShrink: 0 }} />}
                        <Chip label={cc?.label} size="small" sx={{ height: 14, fontSize: '0.5rem', fontWeight: 600, bgcolor: cc?.bg, color: cc?.color }} />
                      </Box>
                    </Box>
                  </Box>
                  <Typography sx={{ fontSize: '0.68rem', fontWeight: msg.unread ? 700 : 400, color: '#0F172A', mb: 0.25, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{msg.subject}</Typography>
                  <Typography sx={{ fontSize: '0.62rem', color: '#94A3B8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{msg.preview}</Typography>
                </Box>
              );
            })}
          </Box>
        </Grid>

        {/* Message View */}
        <Grid item xs={12} md={8} sx={{ display: 'flex', flexDirection: 'column' }}>
          {selected ? (
            <>
              <Box sx={{ p: 2, borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#0F172A' }}>{selected.subject}</Typography>
                  <Typography sx={{ fontSize: '0.68rem', color: '#94A3B8' }}>{selected.tenant} · Unit {selected.unit} · {selected.time}</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <IconButton size="small" onClick={() => toggleFlag(selected.id)} sx={{ color: flagged[selected.id] ? '#DC2626' : '#94A3B8' }}>
                    <Flag sx={{ fontSize: 16 }} />
                  </IconButton>
                  {!resolved[selected.id] && (
                    <Button variant="outlined" size="small" startIcon={<CheckCircle sx={{ fontSize: '12px !important' }} />} onClick={() => resolveMsg(selected.id)}
                      sx={{ fontSize: '0.65rem', height: 28, borderRadius: '7px', borderColor: '#059669', color: '#059669' }}>
                      Resolve
                    </Button>
                  )}
                  {resolved[selected.id] && <Chip label="Resolved" size="small" sx={{ bgcolor: '#05966912', color: '#059669', fontWeight: 700, fontSize: '0.65rem' }} />}
                </Box>
              </Box>

              <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
                <Box sx={{ bgcolor: '#F8FAFC', borderRadius: '10px', p: 2, mb: 2 }}>
                  <Typography sx={{ fontSize: '0.78rem', color: '#0F172A', lineHeight: 1.6 }}>{selected.preview}</Typography>
                </Box>
                {replied[selected.id] && (
                  <Box sx={{ bgcolor: '#EFF6FF', borderRadius: '10px', p: 2, ml: 4 }}>
                    <Typography sx={{ fontSize: '0.68rem', color: '#94A3B8', mb: 0.5 }}>You replied:</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#0F172A' }}>{reply || 'Thank you for your message. We will follow up shortly.'}</Typography>
                  </Box>
                )}
              </Box>

              <Box sx={{ p: 1.5, borderTop: '1px solid #E2E8F0' }}>
                <Typography sx={{ fontSize: '0.65rem', color: '#94A3B8', mb: 0.75 }}>Quick replies:</Typography>
                <Box sx={{ display: 'flex', gap: 0.5, mb: 1.5, flexWrap: 'wrap' }}>
                  {quickReplies.slice(0, 2).map((qr, i) => (
                    <Chip key={i} label={qr.slice(0, 40) + '...'} size="small" onClick={() => setReply(qr)}
                      sx={{ height: 22, fontSize: '0.58rem', bgcolor: '#F1F5F9', color: '#64748B', cursor: 'pointer', maxWidth: 200 }} />
                  ))}
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField size="small" fullWidth multiline maxRows={3} placeholder="Type a reply..." value={reply} onChange={e => setReply(e.target.value)}
                    sx={{ '& .MuiInputBase-root': { fontSize: '0.72rem', borderRadius: '8px' } }} />
                  <Button variant="contained" size="small" onClick={sendReply}
                    sx={{ minWidth: 64, borderRadius: '8px', bgcolor: '#2563EB', fontSize: '0.65rem', alignSelf: 'flex-end' }}>
                    <Reply sx={{ fontSize: 16 }} />
                  </Button>
                </Box>
              </Box>
            </>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94A3B8' }}>
              <Typography sx={{ fontSize: '0.82rem' }}>Select a message to view</Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
