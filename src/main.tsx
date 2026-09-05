import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { StorageProvider } from './context/StorageContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <StorageProvider>
      <App />
    </StorageProvider>
  </React.StrictMode>
);
