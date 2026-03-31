import React from 'react';
import { Skeleton, Box, Card, CardContent, Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  card: {
    borderRadius: '12px',
    marginBottom: '16px',
  },
  statsRow: {
    display: 'flex',
    gap: '16px',
    marginBottom: '20px',
  },
  statCard: {
    flex: 1,
    borderRadius: '12px',
    padding: '20px',
  },
});

export const DashboardSkeleton: React.FC = () => {
  const classes = useStyles();
  return (
    <Box>
      <Skeleton variant="text" width="30%" height={40} sx={{ mb: 2 }} />
      <div className={classes.statsRow}>
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className={classes.statCard}>
            <Skeleton variant="text" width="60%" height={20} />
            <Skeleton variant="text" width="40%" height={36} />
            <Skeleton variant="text" width="80%" height={16} />
          </Card>
        ))}
      </div>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Card className={classes.card}>
            <CardContent>
              <Skeleton variant="text" width="40%" height={28} />
              <Skeleton variant="rectangular" height={250} sx={{ borderRadius: '8px', mt: 2 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card className={classes.card}>
            <CardContent>
              <Skeleton variant="text" width="60%" height={28} />
              <Skeleton variant="circular" width={180} height={180} sx={{ mx: 'auto', mt: 2 }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <Box>
    <Skeleton variant="rectangular" height={48} sx={{ borderRadius: '8px 8px 0 0', mb: 1 }} />
    {Array.from({ length: rows }).map((_, i) => (
      <Skeleton key={i} variant="rectangular" height={52} sx={{ mb: 0.5 }} />
    ))}
  </Box>
);

export const CardGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <Grid container spacing={2}>
    {Array.from({ length: count }).map((_, i) => (
      <Grid item xs={12} sm={6} md={4} key={i}>
        <Card sx={{ borderRadius: '12px' }}>
          <CardContent>
            <Skeleton variant="text" width="70%" height={24} />
            <Skeleton variant="text" width="50%" height={18} />
            <Skeleton variant="rectangular" height={100} sx={{ borderRadius: '8px', mt: 2 }} />
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
);
