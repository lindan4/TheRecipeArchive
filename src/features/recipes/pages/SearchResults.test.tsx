import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';
import SearchResults from './SearchResults';
import store from '../../../app/store';

vi.mock('../api/mealApi', () => ({
  fetchMeals: vi.fn().mockResolvedValue([
    {
      idMeal: '1',
      strMeal: 'Shakshuka',
      strMealThumb: 'thumb.jpg'
    }
  ])
}));

describe('SearchResults view', () => {
  it('shows returned search result', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/search?keyword=shakshuka']}>
          <Routes>
            <Route path="/search" element={<SearchResults />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Shakshuka/i)).toBeInTheDocument();
    });
  });
});
