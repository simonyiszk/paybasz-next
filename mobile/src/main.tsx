import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App.tsx'
import './index.css'
import { NoNFCBanner } from '@/components/NoNFCBanner.tsx'
import { AppContextProvider } from '@/components/AppContext.tsx'
import { TerminalTypeInput } from '@/components/TerminalTypeContext.tsx'
import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NoNFCBanner>
      <QueryClientProvider client={queryClient}>
        <AppContextProvider>
          <TerminalTypeInput>
            <App />
          </TerminalTypeInput>
        </AppContextProvider>
      </QueryClientProvider>
    </NoNFCBanner>
  </React.StrictMode>
)
