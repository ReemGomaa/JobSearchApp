import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import History from '../components/History';
import { Provider } from 'react-redux';
import  store  from '../store/store';

const renderWithProviders = (ui: React.ReactElement) => {
  return render(<Provider store={store}>{ui}</Provider>);
};

describe('History Component', () => {
  test('renders History correctly', () => {
    renderWithProviders(<History />);
    expect(screen.getByText('Search History')).toBeInTheDocument();
  });

  test('displays search history items', () => {
    renderWithProviders(<History />);
    expect(screen.getByText('developer')).toBeInTheDocument(); // Adjust based on actual test data
  });

  test('clears history when Clear History button is clicked', () => {
    // Mock localStorage to simulate clearing history
    localStorage.setItem('searchHistory', JSON.stringify(['developer', 'designer']));
    renderWithProviders(<History />);
    
    // Simulate button click
    fireEvent.click(screen.getByText('Clear History'));
    
    // Check if history is cleared
    expect(localStorage.getItem('searchHistory')).toBe('[]');
    expect(screen.queryByText('developer')).not.toBeInTheDocument();
  });
});
