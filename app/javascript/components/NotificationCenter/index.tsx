import React, { useState } from 'react';
import {
  Badge, IconButton, Popover, List, ListItem, ListItemText,
  ListItemAvatar, Avatar, Typography, Divider, Button, Box, Chip,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PaymentIcon from '@mui/icons-material/Payment';
import BuildIcon from '@mui/icons-material/Build';
import EventIcon from '@mui/icons-material/Event';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import WarningIcon from '@mui/icons-material/Warning';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  popover: {
    '& .MuiPopover-paper': {
      width: '380px',
      maxHeight: '500px',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    },
  },
  header: {
    padding: '16px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #E0E0E0',
  },
  list: {
    maxHeight: '380px',
    overflow: 'auto',
    padding: 0,
  },
  item: {
    padding: '12px 20px',
    '&:hover': { backgroundColor: '#F8F9FA' },
  },
  unread: {
    backgroundColor: '#F0F7FF',
    '&:hover': { backgroundColor: '#E3F0FF' },
  },
  timestamp: {
    fontSize: '11px',
    color: '#999',
    marginTop: '4px',
  },
  emptyState: {
    padding: '40px 20px',
    textAlign: 'center',
  },
});

interface Notification {
  id: string;
  type: 'payment' | 'maintenance' | 'showing' | 'lease' | 'alert';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const typeIcons: Record<string, React.ReactNode> = {
  payment: <PaymentIcon />,
  maintenance: <BuildIcon />,
  showing: <EventIcon />,
  lease: <PersonAddIcon />,
  alert: <WarningIcon />,
};

const typeColors: Record<string, string> = {
  payment: '#4CAF50',
  maintenance: '#FF9800',
  showing: '#2196F3',
  lease: '#9C27B0',
  alert: '#F44336',
};

const NotificationCenter: React.FC = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  // TODO: Connect to Pusher/WebSocket for real-time notifications
  const [notifications] = useState<Notification[]>([
    {
      id: '1', type: 'payment', title: 'Late Rent Payment',
      message: 'Unit 305 - John Doe rent is 5 days overdue ($1,850)',
      timestamp: '2 hours ago', read: false,
    },
    {
      id: '2', type: 'maintenance', title: 'Emergency Maintenance',
      message: 'Unit 112 - Water leak reported (Priority: High)',
      timestamp: '4 hours ago', read: false,
    },
    {
      id: '3', type: 'showing', title: 'Tour Completed',
      message: 'Unit 204 - Sarah Miller completed self-tour',
      timestamp: '6 hours ago', read: true,
    },
    {
      id: '4', type: 'lease', title: 'Lease Expiring Soon',
      message: 'Unit 401 - Mike Johnson lease expires in 30 days',
      timestamp: '1 day ago', read: true,
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} size="small">
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        className={classes.popover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <div className={classes.header}>
          <Typography variant="subtitle1" fontWeight={700} fontFamily="Quicksand">
            Notifications
          </Typography>
          <Button size="small" sx={{ textTransform: 'none', fontSize: '12px' }}>
            Mark all read
          </Button>
        </div>
        <List className={classes.list}>
          {notifications.map((notif, idx) => (
            <React.Fragment key={notif.id}>
              <ListItem className={`${classes.item} ${!notif.read ? classes.unread : ''}`} button>
                <ListItemAvatar>
                  <Avatar sx={{ backgroundColor: typeColors[notif.type], width: 36, height: 36 }}>
                    {typeIcons[notif.type]}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={<Typography variant="body2" fontWeight={notif.read ? 400 : 600}>{notif.title}</Typography>}
                  secondary={
                    <>
                      <Typography variant="caption" color="textSecondary">{notif.message}</Typography>
                      <div className={classes.timestamp}>{notif.timestamp}</div>
                    </>
                  }
                />
                {!notif.read && <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#2196F3', ml: 1 }} />}
              </ListItem>
              {idx < notifications.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Popover>
    </>
  );
};

export default NotificationCenter;
