import { CardActionArea, CardContent, CircularProgress, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { getRandomRecipe } from '../api/mealApi';
import type { MealSummary } from '../types/meal';
import itemStyles from './RandomRecipeItem.module.css';

interface RandomRecipeItemProps {
  buildTo?: (id: string) => string;
}

const RandomRecipeItem = ({ buildTo = (id) => `/meal?id=${id}` }: RandomRecipeItemProps) => {
  const [randomRecipeInfo, setRandomRecipeInfo] = useState<MealSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    getRandomRecipe()
      .then((meal) => {
        if (mounted) {
          setRandomRecipeInfo(meal);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <Paper sx={{ p: 5, display: 'grid', placeItems: 'center', borderRadius: 5, border: '1px solid var(--surface-border)' }}>
        <CircularProgress />
      </Paper>
    );
  }

  if (!randomRecipeInfo) {
    return (
      <Paper sx={{ p: 4, borderRadius: 5, border: '1px solid var(--surface-border)' }}>
        <Typography>Could not load featured recipe right now.</Typography>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        display: 'flex',
        borderRadius: 6,
        border: '1px solid var(--surface-border)',
        background: 'var(--surface-solid)',
        overflow: 'hidden',
        transition: 'transform 220ms ease, box-shadow 220ms ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 14px 30px rgba(47, 27, 12, 0.18)'
        }
      }}
    >
      <CardActionArea component={RouterLink} to={buildTo(randomRecipeInfo.idMeal)}>
        <CardContent className={itemStyles.cardContentStyle}>
          <section className={itemStyles.randomRecipeTitleSection}>
            <Typography variant="h4" component="p">
              Featured Recipe
            </Typography>
            <Typography variant="h5" component="p" sx={{ marginTop: 1.5 }}>
              {randomRecipeInfo.strMeal}
            </Typography>
          </section>
          <img
            src={randomRecipeInfo.strMealThumb}
            alt={`Picture of ${randomRecipeInfo.strMeal}`}
            className={itemStyles.randomRecipeImage}
          />
        </CardContent>
      </CardActionArea>
    </Paper>
  );
};

export { RandomRecipeItem };
