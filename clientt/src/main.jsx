import { StrictMode } from 'react' // Import StrictMode for highlighting potential problems in the app
import { createRoot } from 'react-dom/client' // Import createRoot to create a React root for rendering
import './index.css' // Import global CSS styles
import App from './App.jsx' // Import main App component
import {BrowserRouter}from 'react-router-dom' // Import BrowserRouter for client-side routing
import { AppContextProvider } from './context/AppContext.jsx' // Import context provider for app-wide state

// Create React root and render the app wrapped with routing and context providers
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AppContextProvider>
      <App />
    </AppContextProvider>
  </BrowserRouter>,
)
