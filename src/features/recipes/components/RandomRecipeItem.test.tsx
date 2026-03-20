import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { RandomRecipeItem } from './RandomRecipeItem';

vi.mock('../api/mealApi', () => ({
  getRandomRecipe: vi.fn().mockResolvedValue({
    idMeal: '52772',
    strMeal: 'Teriyaki Chicken Casserole',
    strMealThumb: 'thumb.jpg'
  })
}));

describe('RandomRecipeItem component', () => {
  it('renders fetched recipe title', async () => {
    render(
      <MemoryRouter>
        <RandomRecipeItem />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Teriyaki Chicken Casserole/i)).toBeInTheDocument();
    });
  });
});
