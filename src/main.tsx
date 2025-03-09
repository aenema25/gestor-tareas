import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppRoutes from './routes/index.tsx'
import ThemeProvider from './providers/theme/index.tsx'
import { Amplify } from "aws-amplify";
import awsconfig from "../amplify_outputs.json"

Amplify.configure(awsconfig);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  </StrictMode>,
)