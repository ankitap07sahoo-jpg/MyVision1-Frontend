import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';

// Clear any stale AWS Amplify session data from localStorage
// This prevents "There is already a signed in user" errors
Object.keys(localStorage).forEach((key) => {
  if (key.startsWith('CognitoIdentityServiceProvider') || key.startsWith('amplify-')) {
    localStorage.removeItem(key);
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
