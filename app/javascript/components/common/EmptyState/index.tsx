import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 40px',
    textAlign: 'center',
    border: '2px dashed #E0E0E0',
    borderRadius: '16px',
    backgroundColor: '#FAFAFA',
    margin: '20px 0',
  },
  icon: {
    fontSize: '64px !important',
    color: '#CCC',
    marginBottom: '16px',
  },
  title: {
    fontFamily: 'Quicksand, sans-serif',
    fontWeight: 700,
    fontSize: '18px',
    color: '#333',
    marginBottom: '8px',
  },
  subtitle: {
    fontFamily: 'Quicksand, sans-serif',
    fontWeight: 400,
    fontSize: '14px',
    color: '#999',
    marginBottom: '24px',
    maxWidth: '400px',
  },
  actionBtn: {
    textTransform: 'none',
    fontFamily: 'Quicksand, sans-serif',
    fontWeight: 600,
    borderRadius: '8px',
    padding: '8px 24px',
  },
});

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  subtitle: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  subtitle,
  actionLabel,
  onAction,
}) => {
  const classes = useStyles();

  return (
    <Box className={classes.container}>
      {icon || <AddIcon className={classes.icon} />}
      <Typography className={classes.title}>{title}</Typography>
      <Typography className={classes.subtitle}>{subtitle}</Typography>
      {actionLabel && onAction && (
        <Button
          variant="contained"
          color="primary"
          className={classes.actionBtn}
          onClick={onAction}
          startIcon={<AddIcon />}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;
