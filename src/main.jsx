import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/Context'; // Correct import for AuthProvider

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <BrowserRouter>
    <AuthProvider>
        <App />
        {/* ToastContainer should be placed here */}
        <ToastContainer />
    </AuthProvider>
      </BrowserRouter>
  </StrictMode>
);
