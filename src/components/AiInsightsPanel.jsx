import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Button, Chip, IconButton, Collapse, LinearProgress } from '@mui/material';
import { AutoAwesome, TrendingUp, Warning, People, Tour, Build, ArrowForward, ExpandMore, Close } from '@mui/icons-material';
import { aiInsights, revenueOpportunities } from '../mockData';

const iconMap = {
  money: { icon: <TrendingUp />, color: '#059669', bg: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)' },
  alert: { icon: <Warning />, color: '#DC2626', bg: 'linear-gradient(135deg, #FEF2F2, #FEE2E2)' },
  people: { icon: <People />, color: '#7C3AED', bg: 'linear-gradient(135deg, #F5F3FF, #EDE9FE)' },
  tour: { icon: <Tour />, color: '#2563EB', bg: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)' },
  tool: { icon: <Build />, color: '#D97706', bg: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)' },
};

const priorityColors = { critical: '#DC2626', high: '#F59E0B', medium: '#2563EB' };

export default function AiInsightsPanel() {
  const [dismissed, setDismissed] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const visible = aiInsights.filter(i => !dismissed.includes(i.id));
  const opp = revenueOpportunities;

  return (
    <Card sx={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', border: '1px solid #334155', '&:hover': { transform: 'none', boxShadow: '0 12px 28px -8px rgba(15,23,42,0.3)' } }}>
      <CardContent sx={{ p: '20px !important' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ p: '6px', borderRadius: '10px', background: 'linear-gradient(135deg, #7C3AED, #2563EB)', display: 'flex' }}>
              <AutoAwesome sx={{ color: '#fff', fontSize: 18 }} />
            </Box>
            <Box>
              <Typography sx={{ color: '#F8FAFC', fontWeight: 700, fontSize: '0.95rem' }}>AI Revenue Advisor</Typography>
              <Typography sx={{ color: '#64748B', fontSize: '0.68rem' }}>5 insights found - Updated 2 min ago</Typography>
            </Box>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography sx={{ color: '#10B981', fontWeight: 800, fontSize: '1.25rem', lineHeight: 1 }}>${opp.totalOpportunity.toLocaleString()}/mo</Typography>
            <Typography sx={{ color: '#64748B', fontSize: '0.62rem' }}>Total opportunity</Typography>
          </Box>
        </Box>

        {/* Revenue opportunity breakdown */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2.5 }}>
          {[
            { label: 'Underpriced', value: `$${opp.underpricedRevenue.toLocaleString()}`, color: '#10B981' },
            { label: 'Vacancy Loss', value: `$${opp.vacancyLoss.toLocaleString()}`, color: '#F59E0B' },
            { label: 'Turnover Risk', value: `$${opp.turnoverCost.toLocaleString()}`, color: '#EF4444' },
          ].map(item => (
            <Box key={item.label} sx={{ flex: 1, p: 1.25, borderRadius: '10px', bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <Typography sx={{ color: item.color, fontWeight: 700, fontSize: '0.9rem' }}>{item.value}</Typography>
              <Typography sx={{ color: '#64748B', fontSize: '0.6rem', fontWeight: 500 }}>{item.label}</Typography>
            </Box>
          ))}
        </Box>

        {/* Insight cards */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {visible.map((insight) => {
            const cfg = iconMap[insight.icon];
            const isExpanded = expanded === insight.id;
            return (
              <Box key={insight.id} sx={{ p: '10px 12px', borderRadius: '10px', bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', transition: 'all 0.2s ease', '&:hover': { bgcolor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' } }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
                  <Box sx={{ p: '5px', borderRadius: '8px', background: cfg.bg, display: 'flex', flexShrink: 0, mt: '1px' }}>
                    {React.cloneElement(cfg.icon, { sx: { fontSize: 14, color: cfg.color } })}
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.25 }}>
                      <Typography sx={{ color: '#F1F5F9', fontWeight: 600, fontSize: '0.78rem', lineHeight: 1.3 }}>{insight.title}</Typography>
                      <Chip label={insight.priority} size="small" sx={{ height: 16, fontSize: '0.55rem', fontWeight: 700, bgcolor: `${priorityColors[insight.priority]}20`, color: priorityColors[insight.priority], '& .MuiChip-label': { px: '5px' } }} />
                    </Box>
                    <Collapse in={isExpanded} collapsedSize={0}>
                      <Typography sx={{ color: '#94A3B8', fontSize: '0.72rem', lineHeight: 1.5, mt: 0.5, mb: 1 }}>{insight.description}</Typography>
                    </Collapse>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      <Chip label={insight.impact} size="small" sx={{ height: 18, fontSize: '0.6rem', fontWeight: 700, bgcolor: '#059669', color: '#fff', '& .MuiChip-label': { px: '6px' } }} />
                      <Button size="small" endIcon={<ArrowForward sx={{ fontSize: '12px !important' }} />}
                        sx={{ color: '#60A5FA', fontSize: '0.66rem', fontWeight: 600, p: '0 4px', minWidth: 'auto', '&:hover': { bgcolor: 'rgba(37,99,235,0.1)' } }}>
                        {insight.action}
                      </Button>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.25, flexShrink: 0 }}>
                    <IconButton size="small" onClick={() => setExpanded(isExpanded ? null : insight.id)} sx={{ color: '#475569', p: '2px' }}>
                      <ExpandMore sx={{ fontSize: 16, transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'none' }} />
                    </IconButton>
                    <IconButton size="small" onClick={() => setDismissed([...dismissed, insight.id])} sx={{ color: '#334155', p: '2px', '&:hover': { color: '#EF4444' } }}>
                      <Close sx={{ fontSize: 12 }} />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
}
