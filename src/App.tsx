import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'

function App() {
  return (
    <div>
      <h1>Panchangam</h1>
    </div>
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element not found')

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
