import axios from 'axios';
import type { IngredientLine, MealDetails, MealSummary } from '../types/meal';

interface MealDbResponse<TMeal> {
  meals: TMeal[] | null;
}

const mealApi = axios.create({
  baseURL: 'https://www.themealdb.com/api/json/v1/1'
});

export const fetchMeals = async (keyword: string): Promise<MealSummary[]> => {
  const { data } = await mealApi.get<MealDbResponse<MealSummary>>(`/search.php?s=${encodeURIComponent(keyword)}`);
  return data.meals ?? [];
};

export const getRandomRecipe = async (): Promise<MealSummary> => {
  const { data } = await mealApi.get<MealDbResponse<MealSummary>>('/random.php');
  if (!data.meals || data.meals.length === 0) {
    throw new Error('No random meal found.');
  }

  return data.meals[0];
};

export const getMealInfoWithId = async (
  id: string
): Promise<{ mealData: MealDetails; ingredients: IngredientLine[] }> => {
  const { data } = await mealApi.get<MealDbResponse<MealDetails>>(`/lookup.php?i=${encodeURIComponent(id)}`);
  const mealData = data.meals?.[0];

  if (!mealData) {
    throw new Error('Meal not found.');
  }

  const entries = Object.entries(mealData);
  const ingredientNames = entries
    .filter(([key, value]) => key.startsWith('strIngredient') && typeof value === 'string' && value.trim().length > 0)
    .map(([, value]) => value as string);

  const ingredientQuantities = entries
    .filter(([key, value]) => key.startsWith('strMeasure') && typeof value === 'string' && value.trim().length > 0)
    .map(([, value]) => value as string);

  const ingredients: IngredientLine[] = ingredientNames.map((name, index) => [name, ingredientQuantities[index] ?? '']);

  return { mealData, ingredients };
};

export const fetchUserFavouritesInfo = async (userFavourites: string[]): Promise<MealSummary[]> => {
  if (userFavourites.length === 0) {
    return [];
  }

  const requests = userFavourites.map(async (favouriteItemId) => {
    const { data } = await mealApi.get<MealDbResponse<MealSummary>>(`/lookup.php?i=${encodeURIComponent(favouriteItemId)}`);
    return data.meals?.[0] ?? null;
  });

  const resolved = await Promise.all(requests);
  return resolved.filter((meal): meal is MealSummary => meal !== null);
};
