import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// enregistrer le service worker (optionnel : tu peux le laisser dans hook)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(err => console.warn("SW registration failed", err));
}

createRoot(document.getElementById('root')).render(
     <App />
)
