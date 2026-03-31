import React, { useState, useCallback } from 'react';
import { Dialog, InputBase, List, ListItem, ListItemText, ListItemIcon, Typography, Chip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import ApartmentIcon from '@mui/icons-material/Apartment';
import PersonIcon from '@mui/icons-material/Person';
import BuildIcon from '@mui/icons-material/Build';
import { makeStyles } from '@mui/styles';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles({
  searchDialog: {
    '& .MuiDialog-paper': {
      position: 'fixed',
      top: '15%',
      width: '600px',
      maxWidth: '90vw',
      borderRadius: '12px',
      overflow: 'hidden',
    },
  },
  searchInput: {
    padding: '16px 20px',
    fontSize: '16px',
    borderBottom: '1px solid #E0E0E0',
    fontFamily: 'Quicksand, sans-serif',
  },
  resultsList: {
    maxHeight: '400px',
    overflow: 'auto',
    padding: '8px',
  },
  resultItem: {
    borderRadius: '8px',
    margin: '2px 0',
    '&:hover': {
      backgroundColor: '#F5F5F5',
    },
  },
  shortcutHint: {
    padding: '12px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid #E0E0E0',
    backgroundColor: '#FAFAFA',
  },
  kbd: {
    backgroundColor: '#E0E0E0',
    borderRadius: '4px',
    padding: '2px 8px',
    fontSize: '12px',
    fontFamily: 'monospace',
  },
});

interface SearchResult {
  id: string;
  type: 'community' | 'unit' | 'tenant' | 'maintenance';
  title: string;
  subtitle: string;
  url: string;
}

interface GlobalSearchProps {
  open: boolean;
  onClose: () => void;
}

const typeIcons: Record<string, React.ReactNode> = {
  community: <ApartmentIcon fontSize="small" />,
  unit: <HomeIcon fontSize="small" />,
  tenant: <PersonIcon fontSize="small" />,
  maintenance: <BuildIcon fontSize="small" />,
};

const typeColors: Record<string, string> = {
  community: '#4CAF50',
  unit: '#2196F3',
  tenant: '#FF9800',
  maintenance: '#F44336',
};

const GlobalSearch: React.FC<GlobalSearchProps> = ({ open, onClose }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);

  const handleSearch = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
    // TODO: Integrate with actual search API
    // For now, filter mock results
    if (searchQuery.trim().length > 0) {
      setResults([
        { id: '1', type: 'community', title: 'Sunset Gardens', subtitle: '123 Main St, Los Angeles, CA', url: '/multifamily' },
        { id: '2', type: 'unit', title: 'Unit 204 - Building A', subtitle: 'Sunset Gardens · Occupied', url: '/multifamily' },
        { id: '3', type: 'tenant', title: 'John Smith', subtitle: 'Unit 204 · Lease expires Mar 2027', url: '/multifamily' },
      ].filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase())));
    } else {
      setResults([]);
    }
  }, []);

  const handleSelect = (result: SearchResult) => {
    navigate(result.url);
    onClose();
    setQuery('');
  };

  return (
    <Dialog open={open} onClose={onClose} className={classes.searchDialog}>
      <InputBase
        className={classes.searchInput}
        placeholder="Search communities, units, tenants, tickets..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        startAdornment={<SearchIcon sx={{ mr: 1, color: '#999' }} />}
        autoFocus
        fullWidth
      />
      <List className={classes.resultsList}>
        {results.map((result) => (
          <ListItem
            key={result.id}
            className={classes.resultItem}
            onClick={() => handleSelect(result)}
            button
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              {typeIcons[result.type]}
            </ListItemIcon>
            <ListItemText primary={result.title} secondary={result.subtitle} />
            <Chip
              label={result.type}
              size="small"
              sx={{ backgroundColor: typeColors[result.type], color: '#fff', fontSize: '10px', height: '20px' }}
            />
          </ListItem>
        ))}
        {query && results.length === 0 && (
          <Typography sx={{ p: 3, textAlign: 'center', color: '#999' }}>
            No results found for &quot;{query}&quot;
          </Typography>
        )}
      </List>
      <div className={classes.shortcutHint}>
        <Typography variant="caption" color="textSecondary">
          <span className={classes.kbd}>↑↓</span> Navigate &nbsp;
          <span className={classes.kbd}>↵</span> Select &nbsp;
          <span className={classes.kbd}>Esc</span> Close
        </Typography>
      </div>
    </Dialog>
  );
};

export default GlobalSearch;
