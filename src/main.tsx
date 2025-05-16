import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { CostBuilderAuthProvider } from './contexts/CostBuilderAuthContext'
import './index.css'

console.log("Lovable: main.tsx execution started");

// Create a client
const queryClient = new QueryClient()

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <CostBuilderAuthProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </ThemeProvider>
      </CostBuilderAuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
