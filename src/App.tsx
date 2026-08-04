import { useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import { RouterProvider } from '@tanstack/react-router'
import { createAppI18n } from './i18n'
import { createAppRouter } from './router'
import { ThemeProvider } from './theme/ThemeProvider'

export interface AppProps {
  initialEntries?: string[]
}

export function App({ initialEntries }: AppProps) {
  const [i18n] = useState(createAppI18n)
  const [router] = useState(() => createAppRouter(initialEntries))

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </I18nextProvider>
  )
}

export default App
