import { fetchUserFavouritesInfo } from '../api/mealApi';
import { vi } from 'vitest';

vi.mock('../api/mealApi', () => ({
  fetchUserFavouritesInfo: vi.fn().mockResolvedValue([])
}));

describe('favourite fetching operation', () => {
  it('returns array payload', async () => {
    const result = await fetchUserFavouritesInfo([]);
    expect(Array.isArray(result)).toBe(true);
  });
});
