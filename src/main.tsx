import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add error handling
const renderApp = () => {
  try {
    console.log('Starting to render app...');
    const rootElement = document.getElementById("root");
    
    if (!rootElement) {
      console.error('Root element not found!');
      return;
    }
    
    // Clear any loading indicators
    rootElement.innerHTML = '';
    
    const root = createRoot(rootElement);
    root.render(<App />);
    
    console.log('App rendered successfully');
  } catch (error) {
    console.error('Error rendering app:', error);
    
    // Display error message on screen
    const rootElement = document.getElementById("root");
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; background-color: #000; color: #fff; padding: 20px; text-align: center;">
          <h1 style="color: #FF3B3B; margin-bottom: 20px;">Something went wrong</h1>
          <p>We're having trouble loading the application. Please try refreshing the page.</p>
          <pre style="background: #111; padding: 15px; border-radius: 4px; max-width: 80%; overflow: auto; margin-top: 20px; color: #ddd;">${error instanceof Error ? error.message : String(error)}</pre>
          <button onclick="window.location.reload()" style="margin-top: 20px; background: #39FF14; color: #000; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">Refresh Page</button>
        </div>
      `;
    }
  }
};

// Add a small delay to ensure DOM is fully loaded
setTimeout(renderApp, 100);
