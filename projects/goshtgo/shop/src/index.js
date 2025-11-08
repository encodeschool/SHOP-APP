import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { store } from './redux/store';
import { Provider } from 'react-redux';
import { AuthProvider } from './contexts/AuthContext.js';
import { LoadingProvider } from './contexts/LoadingContext';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n'; // ✅ make sure you have this file configured

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}> {/* ✅ Added */}
      <BrowserRouter>
        <AuthProvider>
          <Provider store={store}>
            <LoadingProvider>   {/* ✅ Added here, now has access to translations */}
              <App />
            </LoadingProvider>
          </Provider>
        </AuthProvider>
      </BrowserRouter>
    </I18nextProvider>
  </React.StrictMode>
);

reportWebVitals();
