import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.jsx'

// Auto-update service worker silently in the background.
// Checks for a new deploy every 60 seconds — no manual cache clearing needed.
registerSW({
  immediate: true,
  onRegisteredSW(swUrl, registration) {
    if (!registration) return
    setInterval(async () => {
      if (!navigator.onLine) return
      try {
        const res = await fetch(swUrl, { cache: 'no-store' })
        if (res.status === 200) await registration.update()
      } catch { /* offline or network error — skip */ }
    }, 60 * 1000)
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
