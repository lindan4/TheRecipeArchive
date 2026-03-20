import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { Box, CircularProgress, IconButton, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getMealInfoWithId } from '../api/mealApi';
import { addToFavouriteFBStore, removeFromFavouriteFBStore } from '../../user/api/userApi';
import useDocumentTitle from '../../../shared/hooks/useDocumentTitle';
import { useAppSelector } from '../../user/state/hooks';
import type { IngredientLine, MealDetails } from '../types/meal';
import styles from './MealInfo.module.css';

interface ParsedInstruction {
  kind: 'heading' | 'step';
  text: string;
  stepNumber?: number;
}

const MealInfo = () => {
  const [searchParams] = useSearchParams();
  const id = useMemo(() => searchParams.get('id') ?? '', [searchParams]);

  const [mealInfo, setMealInfo] = useState<MealDetails | null>(null);
  const [mealIngredients, setMealIngredients] = useState<IngredientLine[]>([]);
  const [loading, setLoading] = useState(true);

  const { userFavourites, isUserLoggedIn } = useAppSelector((state) => state.user);
  useDocumentTitle(loading ? 'Loading... | The Recipe Archive' : mealInfo ? `${mealInfo.strMeal} | The Recipe Archive` : 'Meal not found | The Recipe Archive');

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    getMealInfoWithId(id)
      .then(({ mealData, ingredients }) => {
        if (mounted) {
          setMealInfo(mealData);
          setMealIngredients(ingredients);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setMealInfo(null);
          setMealIngredients([]);
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  const favourited = mealInfo ? userFavourites.includes(mealInfo.idMeal) : false;

  const parsedInstructions = useMemo<ParsedInstruction[]>(() => {
    if (!mealInfo?.strInstructions) {
      return [];
    }

    const lines = mealInfo.strInstructions
      .split(/\r?\n/)
      .map((line) => line.replace(/\s+/g, ' ').trim())
      .map((line) => line.replace(/^\d+\.\s*/, ''))
      .filter((line) => line.length > 0);

    let stepCounter = 0;
    const parsed: ParsedInstruction[] = [];

    lines.forEach((line) => {
      if (/^directions:?$/i.test(line)) {
        return;
      }

      const stepHeadingMatch = line.match(/^step\s*(\d+)\s*[-:]\s*(.+)$/i);
      if (stepHeadingMatch) {
        parsed.push({
          kind: 'heading',
          text: `Step ${stepHeadingMatch[1]}: ${stepHeadingMatch[2].trim()}`
        });
        return;
      }

      stepCounter += 1;
      parsed.push({
        kind: 'step',
        text: line,
        stepNumber: stepCounter
      });
    });

    return parsed;
  }, [mealInfo]);

  const toggleFavourite = async () => {
    if (!mealInfo || !isUserLoggedIn) {
      return;
    }

    if (favourited) {
      await removeFromFavouriteFBStore(mealInfo.idMeal);
    } else {
      await addToFavouriteFBStore(mealInfo.idMeal);
    }
  };

  if (loading) {
    return (
      <div className={styles.mealInfoLoadingContainer}>
        <CircularProgress />
      </div>
    );
  }

  if (!mealInfo) {
    return (
      <div className={styles.outerMealInfoNoContentContainer}>
        <Typography variant="h5">The meal with id {id || '(missing)'} was not found.</Typography>
      </div>
    );
  }

  return (
    <div className={styles.outerMealInfoContainer}>
      <Box className={styles.mealGrid}>
        <div>
          <img src={mealInfo.strMealThumb} alt={`Picture of ${mealInfo.strMeal}`} className={styles.mealImage} />
        </div>

        <div>
          <div className={styles.upperSectionMealContent}>
            <Typography variant="h3" className={styles.mealTitle}>
              {mealInfo.strMeal}
            </Typography>
            <IconButton disabled={!isUserLoggedIn} onClick={toggleFavourite} aria-label="toggle favourite">
              {favourited ? <Favorite sx={{ color: '#d6426a' }} /> : <FavoriteBorder />}
            </IconButton>
          </div>

          <section className={styles.sectionCard}>
            <Typography variant="h6">Ingredients</Typography>
            <ul>
              {mealIngredients.map(([name, quantity]) => (
                <li key={`${name}-${quantity}`}>
                  {quantity} - {name}
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.sectionCard}>
            <Typography variant="h6">Steps</Typography>
            <div className={styles.stepsContainer}>
              {parsedInstructions.map((item, index) => {
                if (item.kind === 'heading') {
                  return (
                    <Typography key={`${item.text}-${index}`} variant="subtitle1" className={styles.stepHeading}>
                      {item.text}
                    </Typography>
                  );
                }

                return (
                  <p key={`${item.text}-${index}`} className={styles.stepLine}>
                    <span className={styles.stepNumber}>{item.stepNumber}.</span> {item.text}
                  </p>
                );
              })}
            </div>
          </section>
        </div>
      </Box>
    </div>
  );
};

export default MealInfo;
