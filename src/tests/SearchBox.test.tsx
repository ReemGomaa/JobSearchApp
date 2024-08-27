import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchBox from '../components/SearchBox';
import { Provider } from 'react-redux';
import store from '../store/store';

// Mock fetch globally
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({
      data: {
        jobs: [
          { id: '1', attributes: { title: 'Developer' } },
        ],
      },
    }),
  })
) as jest.Mock;

const renderWithProviders = (ui: React.ReactElement) => {
  return render(<Provider store={store}>{ui}</Provider>);
};

describe('SearchBox Component', () => {
  test('renders SearchBox correctly', () => {
    renderWithProviders(<SearchBox />);
    expect(screen.getByPlaceholderText('Search for jobs')).toBeInTheDocument();
  });

  test('handles input change', () => {
    renderWithProviders(<SearchBox />);
    fireEvent.change(screen.getByPlaceholderText('Search for jobs'), {
      target: { value: 'developer' },
    });
    expect(screen.getByPlaceholderText('Search for jobs')).toHaveValue('developer');
  });

  test('calls handleSearch when the search button is clicked', async () => {
    renderWithProviders(<SearchBox />);
    fireEvent.change(screen.getByPlaceholderText('Search for jobs'), {
      target: { value: 'developer' },
    });
    fireEvent.click(screen.getByText('Search'));

    // Ensure the API call was made
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('https://skills-api-zeta.vercel.app/jobs/search?query=developer');
    });
  });

  test('calls handleSearch when Enter key is pressed', async () => {
    renderWithProviders(<SearchBox />);
    fireEvent.change(screen.getByPlaceholderText('Search for jobs'), {
      target: { value: 'developer' },
    });
    fireEvent.keyDown(screen.getByPlaceholderText('Search for jobs'), {
      key: 'Enter',
      code: 'Enter',
      charCode: 13,
    });

    // Ensure the API call was made
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('https://skills-api-zeta.vercel.app/jobs/search?query=developer');
    });
  });

});
