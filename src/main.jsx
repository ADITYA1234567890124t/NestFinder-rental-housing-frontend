window.global = window
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import { store } from '@/redux/store'
import { AuthProvider } from '@/context/AuthContext'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                fontFamily: "'DM Sans', sans-serif",
                borderRadius: '12px',
                padding: '12px 16px',
                fontSize: '14px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
              },
              success: { iconTheme: { primary: '#f97316', secondary: '#fff' } },
            }}
          />
        </AuthProvider>
      </BrowserRouter>
    </Provider>

)
