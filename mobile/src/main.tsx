import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App.tsx'
import './index.css'
import { NoNFCBanner } from '@/components/NoNFCBanner.tsx'
import { UserStateValidator } from '@/components/UserContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NoNFCBanner>
      <UserStateValidator>
        <App />
      </UserStateValidator>
    </NoNFCBanner>
  </React.StrictMode>
)
