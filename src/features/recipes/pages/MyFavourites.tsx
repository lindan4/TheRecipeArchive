import { Box, CircularProgress, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FavouriteItem } from '../components';
import { fetchUserFavouritesInfo } from '../api/mealApi';
import { removeFromFavouriteFBStore } from '../../user/api/userApi';
import useDocumentTitle from '../../../shared/hooks/useDocumentTitle';
import { useAppSelector } from '../../user/state/hooks';
import type { MealSummary } from '../types/meal';
import styles from './MyFavourites.module.css';

const MyFavourites = () => {
  const navigate = useNavigate();
  const userFavourites = useAppSelector((state) => state.user.userFavourites);

  const [localFavouriteList, setLocalFavouriteList] = useState<MealSummary[]>([]);
  const [loading, setLoading] = useState(false);
  useDocumentTitle(loading ? 'Loading... | The Recipe Archive' : 'My Favourites | The Recipe Archive');

  useEffect(() => {
    const authLocal = localStorage.getItem('authUser');
    if (!authLocal) {
      navigate('/');
      return;
    }

    let mounted = true;
    setLoading(true);

    fetchUserFavouritesInfo(userFavourites)
      .then((favouritesInfo) => {
        if (mounted) {
          setLocalFavouriteList(favouritesInfo);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setLocalFavouriteList([]);
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [navigate, userFavourites]);

  if (loading) {
    return (
      <div className={styles.favouritesLoadingContainer}>
        <CircularProgress />
      </div>
    );
  }

  if (localFavouriteList.length === 0) {
    return (
      <div className={styles.noFavouritesOuterContainer}>
        <Typography variant="h5" align="center">
          You have no favourites yet. Search for meals and tap the heart icon to save them.
        </Typography>
      </div>
    );
  }

  return (
    <div className={styles.favouritesOuterContainer}>
      <Typography variant="h3" className={styles.pageTitle}>
        My Favourites
      </Typography>
      <Box className={styles.favouritesGrid}>
        {localFavouriteList.map((favouriteItem) => (
          <div key={favouriteItem.idMeal}>
            <FavouriteItem
              item={favouriteItem}
              to={`/meal?id=${favouriteItem.idMeal}`}
              removeFromFavourite={(event) => {
                event.preventDefault();
                event.stopPropagation();
                void removeFromFavouriteFBStore(favouriteItem.idMeal);
              }}
            />
          </div>
        ))}
      </Box>
    </div>
  );
};

export default MyFavourites;
