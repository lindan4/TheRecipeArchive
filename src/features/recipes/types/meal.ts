export interface MealSummary {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

export interface MealDetails extends MealSummary {
  strInstructions: string;
  [key: string]: string | null;
}

export type IngredientLine = [name: string, quantity: string];
