import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import type { MealSummary } from '../types/meal';

interface RecipeItemProps {
  item: MealSummary;
  to: string;
}

const RecipeItem = ({ item, to }: RecipeItemProps) => {
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
      <CardActionArea
        component={RouterLink}
        to={to}
        sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
      >
        <CardMedia component="img" src={item.strMealThumb} alt={`Picture of ${item.strMeal}`} sx={{ height: 220 }} />
        <CardContent>
          <Typography
            variant="h6"
            component="p"
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
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export { RecipeItem };
