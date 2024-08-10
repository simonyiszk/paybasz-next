import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.tsx'
import './index.css'
import { NoNFCBanner } from '@/components/NoNFCBanner.tsx'
import { AppContextProvider } from '@/components/AppContext.tsx'
import { TerminalTypeInput } from '@/components/TerminalTypeContext.tsx'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ThemeProvider } from '@/components/Theme.tsx'
import { EnableRotatedForCustomerProvider } from '@/components/EnableRotatedForCustomerContext.tsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EnableRotatedForCustomerProvider>
      <ThemeProvider>
        <NoNFCBanner>
          <QueryClientProvider client={queryClient}>
            <AppContextProvider>
              <TerminalTypeInput>
                <App />
              </TerminalTypeInput>
            </AppContextProvider>
          </QueryClientProvider>
        </NoNFCBanner>
      </ThemeProvider>
    </EnableRotatedForCustomerProvider>
  </StrictMode>
)
