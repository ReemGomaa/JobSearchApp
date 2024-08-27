import { configureStore } from '@reduxjs/toolkit';
import jobsReducer from './jobsSlice';
import skillsReducer from './skillSlice';
import historyReducer from './historySlice';  // Import the history slice

const store = configureStore({
  reducer: {
    jobs: jobsReducer,
    skills: skillsReducer,
    history: historyReducer,  // Add the history reducer here
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
