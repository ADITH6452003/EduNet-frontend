import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const BACKEND = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
setInterval(() => fetch(`${BACKEND}/health`).catch(() => {}), 10 * 60 * 1000);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
