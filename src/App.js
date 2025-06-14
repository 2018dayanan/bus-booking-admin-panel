import React, { Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'

// We use those styles to show code examples, you should remove them in your application.
import './scss/examples.scss'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Components
const ProtectedRoute = React.lazy(() => import('./components/ProtectedRoute'))

// Pages
const PublicWebsite = React.lazy(() => import('./views/pages/PublicWebsite'))
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

// Services
import authService from './services/authService'

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)
  const dispatch = useDispatch()

  useEffect(() => {
    // Initialize authentication state
    const initializeAuth = () => {
      const token = authService.getToken()
      const user = authService.getUser()
      
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

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<PublicWebsite />} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/register" element={<Register />} />
          <Route path="/admin/404" element={<Page404 />} />
          <Route path="/admin/500" element={<Page500 />} />
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute>
                <DefaultLayout />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Page404 />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
