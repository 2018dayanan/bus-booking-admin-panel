import React, { Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { CSpinner, useColorModes } from '@coreui/react'

// Global styles
import './scss/components/example.scss'
import './scss/style.scss'

// 🧩 Lazy-loaded components (code-splitting improves performance)
const DefaultLayout = React.lazy(() => import('layout/components/DefaultLayout'))
const ProtectedRoute = React.lazy(() => import('@/ProtectedRoutes/ProtectedRoute'))
const PublicWebsite = React.lazy(() => import('views/pages/PublicWebsite'))
const Login = React.lazy(() => import('features/auth/pages/login/Login'))
const Register = React.lazy(() => import('features/auth/pages/register/Register'))
const Page404 = React.lazy(() => import('views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('views/pages/page500/Page500'))

// Authentication service for managing tokens & user data
import authService from 'features/auth/services/authService'

const App = () => {
  // 🌙 CoreUI color mode hook (handles light/dark themes)
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')

  // 🎨 Redux state for theme persistence
  const storedTheme = useSelector((state) => state.theme)
  const dispatch = useDispatch()

  // ✅ Initialize user authentication on first render
  useEffect(() => {
    const initializeAuth = () => {
      const token = authService.getToken()
      const user = authService.getUser()
      
      // If user already logged in, restore session
      if (token && user) {
        console.log('App: Found existing authentication, updating Redux state')
        dispatch({ 
          type: 'LOGIN_SUCCESS', 
          user: user 
        })
      } else {
        console.log('App: No existing authentication found')
      }
    }

    initializeAuth()
  }, [dispatch])

  // 🎨 Handle theme setup (either from URL param or saved Redux theme)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]

    // Allow theme override via URL (e.g. ?theme=dark)
    if (theme) {
      setColorMode(theme)
    }

    // If a color mode is already stored, use it
    if (isColorModeSet()) {
      return
    }

    // Otherwise, apply the saved theme from Redux
    setColorMode(storedTheme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <BrowserRouter>
      {/* Suspense fallback ensures spinner shows while lazy components load */}
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<PublicWebsite />} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/register" element={<Register />} />
          <Route path="/admin/404" element={<Page404 />} />
          <Route path="/admin/500" element={<Page500 />} />

          {/* Protected routes (require login) */}
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute>
                <DefaultLayout />
              </ProtectedRoute>
            } 
          />

          {/* Catch-all for unknown paths */}
          <Route path="*" element={<Page404 />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
