import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './i18n/config'
import './index.scss'
import { store } from './app/store'
import { Home } from './pages/Home'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found')
}

createRoot(rootElement).render(
  <StrictMode>
    <Provider store={store}>
      <Home />
    </Provider>
  </StrictMode>,
)
