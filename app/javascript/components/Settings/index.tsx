import React, { useState } from 'react';
import {
  Box, Typography, Tabs, Tab, Switch, FormControlLabel,
  TextField, Button, Divider, Card, CardContent, Grid,
} from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  root: {
    padding: '24px',
    maxWidth: '960px',
    margin: '0 auto',
  },
  pageTitle: {
    fontFamily: 'Quicksand, sans-serif',
    fontWeight: 700,
    fontSize: '24px',
    marginBottom: '24px',
  },
  sectionTitle: {
    fontFamily: 'Quicksand, sans-serif',
    fontWeight: 600,
    fontSize: '16px',
    marginBottom: '16px',
  },
  card: {
    borderRadius: '12px',
    marginBottom: '20px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  },
  tabPanel: {
    padding: '24px 0',
  },
});

const Settings: React.FC = () => {
  const classes = useStyles();
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Box className={classes.root}>
      <Typography className={classes.pageTitle}>Settings</Typography>
      <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ mb: 3 }}>
        <Tab label="Community" sx={{ textTransform: 'none', fontFamily: 'Quicksand' }} />
        <Tab label="Notifications" sx={{ textTransform: 'none', fontFamily: 'Quicksand' }} />
        <Tab label="Users & Roles" sx={{ textTransform: 'none', fontFamily: 'Quicksand' }} />
        <Tab label="Integrations" sx={{ textTransform: 'none', fontFamily: 'Quicksand' }} />
      </Tabs>

      {activeTab === 0 && (
        <div className={classes.tabPanel}>
          <Card className={classes.card}>
            <CardContent>
              <Typography className={classes.sectionTitle}>Community Configuration</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}><TextField fullWidth label="Office Hours - Open" type="time" InputLabelProps={{ shrink: true }} /></Grid>
                <Grid item xs={6}><TextField fullWidth label="Office Hours - Close" type="time" InputLabelProps={{ shrink: true }} /></Grid>
              </Grid>
            </CardContent>
          </Card>
          <Card className={classes.card}>
            <CardContent>
              <Typography className={classes.sectionTitle}>Amenities & Rules</Typography>
              <FormControlLabel control={<Switch />} label="Pool available" />
              <FormControlLabel control={<Switch />} label="Gym available" />
              <FormControlLabel control={<Switch />} label="Pet friendly" />
              <FormControlLabel control={<Switch />} label="Parking included" />
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 1 && (
        <div className={classes.tabPanel}>
          <Card className={classes.card}>
            <CardContent>
              <Typography className={classes.sectionTitle}>Notification Preferences</Typography>
              <FormControlLabel control={<Switch defaultChecked />} label="Late payment alerts" />
              <br />
              <FormControlLabel control={<Switch defaultChecked />} label="Emergency maintenance" />
              <br />
              <FormControlLabel control={<Switch defaultChecked />} label="Tour completions" />
              <br />
              <FormControlLabel control={<Switch />} label="Lease renewal reminders (30 days)" />
              <br />
              <FormControlLabel control={<Switch />} label="Lease renewal reminders (60 days)" />
              <br />
              <FormControlLabel control={<Switch defaultChecked />} label="New lead notifications" />
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 2 && (
        <div className={classes.tabPanel}>
          <Card className={classes.card}>
            <CardContent>
              <Typography className={classes.sectionTitle}>User Management</Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Manage agents, assign roles, and control community access.
              </Typography>
              <Button variant="outlined" sx={{ textTransform: 'none' }}>Manage Agents</Button>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 3 && (
        <div className={classes.tabPanel}>
          <Card className={classes.card}>
            <CardContent>
              <Typography className={classes.sectionTitle}>Connected Integrations</Typography>
              <FormControlLabel control={<Switch defaultChecked />} label="Rently Smart Locks" />
              <br />
              <FormControlLabel control={<Switch />} label="Payment Gateway (Stripe)" />
              <br />
              <FormControlLabel control={<Switch />} label="Applicant Screening" />
              <br />
              <FormControlLabel control={<Switch />} label="Listing Syndication" />
            </CardContent>
          </Card>
        </div>
      )}
    </Box>
  );
};

export default Settings;
