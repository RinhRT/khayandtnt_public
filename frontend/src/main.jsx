import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './contexts/themeContext.jsx'

import { store, persistor } from './store/index'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}> 
        <ThemeProvider>
          <App/>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </StrictMode>,
)
