import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'

// Add a simple loading component
const LoadingFallback = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    fontFamily: 'Poppins, sans-serif',
    fontSize: '1.5rem'
  }}>
    <div>Loading Power Supplement...</div>
  </div>
);

// Create a function to ensure the DOM is fully loaded
const renderApp = () => {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    createRoot(rootElement).render(
      <StrictMode>
        <HelmetProvider>
          <BrowserRouter>
            <Suspense fallback={<LoadingFallback />}>
              <App />
            </Suspense>
          </BrowserRouter>
        </HelmetProvider>
      </StrictMode>
    );
  }
};

// Ensure DOM is fully loaded before rendering
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  renderApp();
}
