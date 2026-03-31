import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Chip, IconButton, Button, Avatar, TextField, Paper, Divider } from '@mui/material';
import { ArrowBack, SmartToy, Send, Person, TrendingUp, AccessTime, Check } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { chatbotMetrics, chatbotConversations } from '../mockData';

const topQuestions = [
  { category: 'Availability', count: 342, pct: 26.6 },
  { category: 'Pricing & Rent', count: 281, pct: 21.9 },
  { category: 'Tour Scheduling', count: 224, pct: 17.4 },
  { category: 'Pet Policy', count: 156, pct: 12.1 },
  { category: 'Parking', count: 138, pct: 10.7 },
  { category: 'Amenities', count: 143, pct: 11.1 },
];

const demoMessages = [
  { role: 'visitor', text: 'Hi! Is the 2BR unit still available?', time: '2:34 PM' },
  { role: 'bot', text: 'Hi there! Yes, we have two 2BR/2BA units available at Sunset Ridge. Unit 102 (1,050 sqft, $1,950/mo) and Unit 302 (1,050 sqft, $2,000/mo). Would you like to schedule a tour?', time: '2:34 PM' },
  { role: 'visitor', text: 'What is the earliest I can move in?', time: '2:35 PM' },
  { role: 'bot', text: 'Both units are available for immediate move-in! I can schedule you a self-guided tour today. What time works best for you?', time: '2:35 PM' },
  { role: 'visitor', text: 'Do you allow pets?', time: '2:36 PM' },
  { role: 'bot', text: 'Yes! We are pet-friendly. We allow up to 2 pets per unit (cats & dogs under 50 lbs). There is a $350 pet deposit and $35/month pet rent per pet. Want me to include pet-friendly units in your tour?', time: '2:36 PM' },
];

export default function AiChatbotPage({ onNavigate }) {
  const [messages, setMessages] = useState(demoMessages);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);

  const botResponses = [
    'Great question! Let me check our availability for you...',
    'I can help with that! Our community features a resort-style pool, fitness center, and co-working space.',
    'Rent is due on the 1st of each month. We accept ACH, credit/debit cards, and online payments through the resident portal.',
    'I\'ll schedule a tour for you right away! Can I get your name and preferred time?',
    'Our leases start at 12 months, with 14 and 18-month options available at a discount.',
  ];

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = { role: 'visitor', text: input, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const botMsg = { role: 'bot', text: botResponses[Math.floor(Math.random() * botResponses.length)], time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      setMessages(prev => [...prev, botMsg]);
      setTyping(false);
    }, 1200);
  };

  return (
    <Box sx={{ p: { xs: '16px', md: '20px 24px' }, maxWidth: 1440 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <IconButton onClick={() => onNavigate('home')} size="small" sx={{ color: '#64748B', bgcolor: '#F1F5F9' }}><ArrowBack sx={{ fontSize: 16 }} /></IconButton>
        <Box sx={{ p: '6px', borderRadius: '10px', bgcolor: '#7C3AED12' }}><SmartToy sx={{ fontSize: 20, color: '#7C3AED' }} /></Box>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: '1.4rem', color: '#0F172A' }}>AI Leasing Chatbot</Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>24/7 AI assistant — 2x lead conversion, instant responses</Typography>
        </Box>
      </Box>

      <Grid container spacing={1.75} sx={{ mb: 2.5 }}>
        {[
          { label: 'Total Conversations', value: chatbotMetrics.totalConversations.toLocaleString(), color: '#0F172A' },
          { label: 'Resolved by AI', value: chatbotMetrics.resolvedByAI.toLocaleString(), color: '#059669' },
          { label: 'Leads Captured', value: chatbotMetrics.leadsCaptured, color: '#7C3AED' },
          { label: 'Avg Response Time', value: chatbotMetrics.avgResponseTime, color: '#2563EB' },
          { label: 'After-Hours Handled', value: chatbotMetrics.afterHoursConversations, color: '#F59E0B' },
          { label: 'Satisfaction Score', value: `${chatbotMetrics.satisfactionScore}/5`, color: '#059669' },
        ].map(s => (
          <Grid item xs={6} md={2} key={s.label}>
            <Card><CardContent sx={{ p: '14px !important' }}>
              <Typography sx={{ fontSize: '0.6rem', color: '#94A3B8', fontWeight: 600, mb: 0.5 }}>{s.label}</Typography>
              <Typography sx={{ fontWeight: 800, fontSize: '1.3rem', color: s.color, lineHeight: 1 }}>{s.value}</Typography>
            </CardContent></Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={5}>
          <Card sx={{ mb: 2 }}>
            <CardContent sx={{ p: '16px !important' }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#0F172A', mb: 2 }}>Top Question Categories</Typography>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={topQuestions} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="category" tick={{ fontSize: 10, fill: '#64748B' }} width={90} />
                  <Tooltip formatter={v => [`${v} queries`, 'Count']} />
                  <Bar dataKey="count" fill="#7C3AED" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardContent sx={{ p: '16px !important' }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#0F172A', mb: 1.5 }}>Performance Metrics</Typography>
              {[
                { label: 'AI Resolution Rate', value: `${Math.round((chatbotMetrics.resolvedByAI / chatbotMetrics.totalConversations) * 100)}%`, color: '#059669' },
                { label: 'Human Handoff Rate', value: `${Math.round((chatbotMetrics.humanHandoffs / chatbotMetrics.totalConversations) * 100)}%`, color: '#F59E0B' },
                { label: 'Lead Capture Rate', value: `${Math.round((chatbotMetrics.leadsCaptured / chatbotMetrics.totalConversations) * 100)}%`, color: '#7C3AED' },
                { label: 'After-Hours Coverage', value: `${Math.round((chatbotMetrics.afterHoursConversations / chatbotMetrics.totalConversations) * 100)}%`, color: '#2563EB' },
              ].map(m => (
                <Box key={m.label} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.75, borderBottom: '1px solid #F1F5F9' }}>
                  <Typography sx={{ fontSize: '0.72rem', color: '#64748B' }}>{m.label}</Typography>
                  <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: m.color }}>{m.value}</Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={7}>
          <Card sx={{ display: 'flex', flexDirection: 'column', height: 480, border: '1px solid #E2E8F0', boxShadow: 'none', borderRadius: '12px' }}>
            <Box sx={{ p: 2, borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#7C3AED', borderRadius: '12px 12px 0 0' }}>
              <SmartToy sx={{ fontSize: 20, color: '#fff' }} />
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', color: '#fff' }}>Rently AI Assistant</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#4ADE80' }} />
                  <Typography sx={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.8)' }}>{'Online · Avg reply < 30s'}</Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ flex: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {messages.map((msg, i) => (
                <Box key={i} sx={{ display: 'flex', justifyContent: msg.role === 'visitor' ? 'flex-end' : 'flex-start', gap: 0.75 }}>
                  {msg.role === 'bot' && (
                    <Avatar sx={{ width: 26, height: 26, bgcolor: '#7C3AED', flexShrink: 0 }}>
                      <SmartToy sx={{ fontSize: 14, color: '#fff' }} />
                    </Avatar>
                  )}
                  <Box sx={{ maxWidth: '75%' }}>
                    <Box sx={{
                      p: '10px 14px', borderRadius: msg.role === 'visitor' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                      bgcolor: msg.role === 'visitor' ? '#2563EB' : '#F8FAFC',
                      color: msg.role === 'visitor' ? '#fff' : '#0F172A',
                    }}>
                      <Typography sx={{ fontSize: '0.75rem', lineHeight: 1.5 }}>{msg.text}</Typography>
                    </Box>
                    <Typography sx={{ fontSize: '0.58rem', color: '#94A3B8', mt: 0.25, textAlign: msg.role === 'visitor' ? 'right' : 'left' }}>{msg.time}</Typography>
                  </Box>
                  {msg.role === 'visitor' && (
                    <Avatar sx={{ width: 26, height: 26, bgcolor: '#2563EB18', flexShrink: 0 }}>
                      <Person sx={{ fontSize: 14, color: '#2563EB' }} />
                    </Avatar>
                  )}
                </Box>
              ))}
              {typing && (
                <Box sx={{ display: 'flex', gap: 0.75 }}>
                  <Avatar sx={{ width: 26, height: 26, bgcolor: '#7C3AED' }}>
                    <SmartToy sx={{ fontSize: 14, color: '#fff' }} />
                  </Avatar>
                  <Box sx={{ p: '10px 14px', borderRadius: '14px 14px 14px 4px', bgcolor: '#F8FAFC' }}>
                    <Typography sx={{ fontSize: '0.72rem', color: '#94A3B8' }}>AI is typing...</Typography>
                  </Box>
                </Box>
              )}
            </Box>

            <Box sx={{ p: 1.5, borderTop: '1px solid #E2E8F0', display: 'flex', gap: 1 }}>
              <TextField size="small" fullWidth placeholder="Ask the AI assistant..." value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                sx={{ '& .MuiInputBase-root': { fontSize: '0.75rem', borderRadius: '8px' } }} />
              <Button variant="contained" size="small" onClick={sendMessage}
                sx={{ minWidth: 42, borderRadius: '8px', bgcolor: '#7C3AED' }}>
                <Send sx={{ fontSize: 16 }} />
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
