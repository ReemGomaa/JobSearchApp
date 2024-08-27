// historySlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface HistoryState {
  history: string[];
}

const initialState: HistoryState = {
  history: JSON.parse(localStorage.getItem('searchHistory') || '[]'),
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    addToHistory: (state, action: PayloadAction<string>) => {
      if (!state.history.includes(action.payload)) {
        state.history.push(action.payload);
        localStorage.setItem('searchHistory', JSON.stringify(state.history));
      }
    },
    clearHistory: (state) => {
      state.history = [];
      localStorage.removeItem('searchHistory'); // Clear from local storage
    },
  },
});

export const { addToHistory, clearHistory } = historySlice.actions;
export default historySlice.reducer;
