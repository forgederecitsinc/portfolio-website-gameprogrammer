import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Enforce light mode always
document.documentElement.classList.remove('dark');
try {
  localStorage.removeItem('theme');
} catch {
  // Ignore storage restrictions
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
