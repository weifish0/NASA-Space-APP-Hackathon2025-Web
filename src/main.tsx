import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './utils/testApi' // Automatically test API connection in development environment
import './utils/testWeatherAssistant' // Test Weather Assistant integration
import './utils/manualTest' // Manual testing tools

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
