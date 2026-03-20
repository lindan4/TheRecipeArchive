import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Main from './Main';
import store from '../../../app/store';

vi.mock('../components', async () => {
  const actual = await vi.importActual<typeof import('../components')>('../components');
  return {
    ...actual,
    RandomRecipeItem: () => <div data-testid="random-item" />
  };
});

describe('Main view', () => {
  it('renders the app title', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Main />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/The Recipe Archive/i)).toBeInTheDocument();
  });
});
