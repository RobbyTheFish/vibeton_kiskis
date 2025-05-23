import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import IsometricCity from './IsometricCity.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <IsometricCity />
  </StrictMode>,
)
