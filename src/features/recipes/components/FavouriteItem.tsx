import { Favorite } from '@mui/icons-material';
import { Card, CardActionArea, CardContent, CardMedia, IconButton, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import type { MouseEvent } from 'react';
import type { MealSummary } from '../types/meal';

interface FavouriteItemProps {
  item: MealSummary;
  to: string;
  removeFromFavourite: (event: MouseEvent<HTMLButtonElement>) => void;
}

const FavouriteItem = ({ item, to, removeFromFavourite }: FavouriteItemProps) => {
  return (
    <Card
      sx={{
        width: '100%',
        minHeight: 320,
        borderRadius: 4,
        border: '1px solid var(--surface-border)',
        background: 'var(--surface-solid)',
        transition: 'transform 220ms ease, box-shadow 220ms ease',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: '0 14px 30px rgba(47, 27, 12, 0.18)'
        }
      }}
    >
      <CardActionArea component={RouterLink} to={to} sx={{ height: '100%' }}>
        <CardMedia component="img" src={item.strMealThumb} alt={`Picture of ${item.strMeal}`} sx={{ height: 220 }} />
        <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
          <Typography
            sx={{
              lineHeight: 1.25,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {item.strMeal}
          </Typography>
          <IconButton aria-label="remove from favourite" onClick={removeFromFavourite}>
            <Favorite sx={{ color: '#d6426a' }} />
          </IconButton>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export { FavouriteItem };
