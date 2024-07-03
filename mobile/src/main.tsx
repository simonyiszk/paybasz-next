import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App.tsx'
import './index.css'
import { NoNFCBanner } from '@/components/NoNFCBanner.tsx'
import { AppContextProvider } from '@/components/AppContext.tsx'
import { TerminalTypeInput } from '@/components/TerminalTypeContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NoNFCBanner>
      <AppContextProvider>
        <TerminalTypeInput>
          <App />
        </TerminalTypeInput>
      </AppContextProvider>
    </NoNFCBanner>
  </React.StrictMode>
)
