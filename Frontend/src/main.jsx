import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./i18n.js"
import AppTheme from "./shared-theme/AppTheme.jsx";
import CssBaseline from '@mui/material/CssBaseline';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <AppTheme>
      <CssBaseline/>
      <App />
    </AppTheme>
    </GoogleOAuthProvider>
  </StrictMode>,
)