import { Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { ToastContainer } from 'react-toastify'
import AppRoutes from './routes/AppRoutes.jsx'
import AppProviders from './context/AppProviders.jsx'
import 'react-toastify/dist/ReactToastify.css'
import './index.css'

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <AppProviders>
          <div className="min-h-screen bg-neutral-50 text-neutral-900">
            <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
              <AppRoutes />
            </Suspense>
            <ToastContainer
              position="top-right"
              autoClose={4000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </div>
        </AppProviders>
      </BrowserRouter>
    </HelmetProvider>
  )
}

export default App
