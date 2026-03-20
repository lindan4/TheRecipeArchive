import { IconButton, Paper, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useState, type FormEvent } from 'react';

interface SearchBarProps {
  initialValue?: string;
  onSearchPress: (searchValue: string) => void;
}

const SearchBar = ({ initialValue = '', onSearchPress }: SearchBarProps) => {
  const [searchValue, setSearchValue] = useState<string>(initialValue);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = searchValue.trim();
    if (trimmed) {
      onSearchPress(trimmed);
    }
  };

  return (
    <Paper
      component="form"
      elevation={0}
      onSubmit={handleSubmit}
      sx={{
        p: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        width: '100%',
        borderRadius: '14px',
        border: '1px solid var(--surface-border)',
        background: 'var(--surface-solid)',
        transition: 'box-shadow 200ms ease, transform 200ms ease',
        '&:focus-within': {
          boxShadow: '0 8px 18px rgba(173, 93, 36, 0.2)',
          transform: 'translateY(-1px)'
        }
      }}
    >
      <TextField
        fullWidth
        id="search-field"
        label="Search"
        variant="outlined"
        placeholder="Search for recipes"
        value={searchValue}
        onChange={(event) => setSearchValue(event.target.value)}
        size="small"
      />
      <IconButton
        type="submit"
        aria-label="search"
        sx={{
          color: 'var(--accent-strong)',
          transition: 'transform 180ms ease',
          '&:hover': { transform: 'scale(1.08)' }
        }}
      >
        <SearchIcon />
      </IconButton>
    </Paper>
  );
};

export { SearchBar };
