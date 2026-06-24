import React from 'react'
import ReactDOM from 'react-dom/client'
import QuizApp from '../QuizApp.jsx'
import { AuthProvider } from './AuthContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <QuizApp />
    </AuthProvider>
  </React.StrictMode>
)
