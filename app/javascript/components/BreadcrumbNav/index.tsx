import React from 'react';
import { Breadcrumbs, Link, Typography, Chip } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  container: {
    padding: '8px 0',
    marginBottom: '8px',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    cursor: 'pointer',
    fontFamily: 'Quicksand, sans-serif',
    fontWeight: 500,
    fontSize: '13px',
    color: '#666',
    textDecoration: 'none',
    '&:hover': {
      color: '#1976D2',
      textDecoration: 'underline',
    },
  },
  current: {
    fontFamily: 'Quicksand, sans-serif',
    fontWeight: 700,
    fontSize: '13px',
    color: '#333',
  },
});

interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
}

const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({ items }) => {
  const classes = useStyles();
  const navigate = useNavigate();

  return (
    <div className={classes.container}>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
        <Link className={classes.link} onClick={() => navigate('/multifamily')}>
          <HomeIcon sx={{ fontSize: 16 }} /> Home
        </Link>
        {items.map((item, index) =>
          index < items.length - 1 ? (
            <Link key={item.label} className={classes.link} onClick={() => item.path && navigate(item.path)}>
              {item.icon} {item.label}
            </Link>
          ) : (
            <Typography key={item.label} className={classes.current}>
              {item.label}
            </Typography>
          ),
        )}
      </Breadcrumbs>
    </div>
  );
};

export default BreadcrumbNav;
