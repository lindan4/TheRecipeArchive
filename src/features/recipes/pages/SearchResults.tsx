import { Box, CircularProgress, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { RecipeItem, SearchBar } from '../components';
import { fetchMeals } from '../api/mealApi';
import useDocumentTitle from '../../../shared/hooks/useDocumentTitle';
import type { MealSummary } from '../types/meal';
import styles from './SearchResults.module.css';

const SearchResults = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<MealSummary[]>([]);

  const keyword = useMemo(() => searchParams.get('keyword') ?? '', [searchParams]);
  useDocumentTitle(loading ? 'Loading... | The Recipe Archive' : `Search results for ${keyword || 'all meals'} | The Recipe Archive`);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    fetchMeals(keyword)
      .then((mealResults) => {
        if (mounted) {
          setSearchResults(mealResults);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setSearchResults([]);
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [keyword]);

  if (loading) {
    return (
      <div className={styles.searchResultsLoadingContainer}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className={styles.searchResultsContainer}>
      <Box className={styles.searchGrid}>
        <div className={styles.searchHeader}>
          <SearchBar
            initialValue={keyword}
            onSearchPress={(value) => {
              navigate(`/search?keyword=${encodeURIComponent(value)}`);
            }}
          />
          <Typography sx={{ mt: 2 }}>
            Found {searchResults.length} result{searchResults.length === 1 ? '' : 's'}.
          </Typography>
        </div>

        <Box className={styles.resultsGrid}>
          {searchResults.map((searchResultItem) => (
            <div key={searchResultItem.idMeal}>
              <RecipeItem item={searchResultItem} to={`/meal?id=${searchResultItem.idMeal}`} />
            </div>
          ))}
        </Box>
      </Box>
    </div>
  );
};

export default SearchResults;
