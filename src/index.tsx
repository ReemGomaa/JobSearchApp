import React from 'react';
import { createRoot } from 'react-dom/client';  // Import createRoot
import { Provider } from 'react-redux';
import App from './App';
import store from './store/store';
import './global.css'; 

const container = document.getElementById('root');
const root = createRoot(container!);  // Use createRoot with the root element

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);