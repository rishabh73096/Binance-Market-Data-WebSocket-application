import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import ChartComponent from './ChartComponent'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChartComponent />
  </StrictMode>,
)
