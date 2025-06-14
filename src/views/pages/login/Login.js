import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CAlert,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import authService from '../../../services/authService'
import LoginDebug from '../../../components/LoginDebug'

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  })
  const [formErrors, setFormErrors] = useState({})
  const [checkingAuth, setCheckingAuth] = useState(true)
  
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth)

  // Get the page user was trying to access
  const from = location.state?.from?.pathname || '/admin/dashboard'

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is authenticated from Redux state
        if (isAuthenticated) {
          console.log('User already authenticated, redirecting to dashboard')
          navigate(from, { replace: true })
          return
        }

        // Also check localStorage for token
        const token = authService.getToken()
        if (token) {
          console.log('Token found in localStorage, redirecting to dashboard')
          navigate(from, { replace: true })
          return
        }

        // If not authenticated, show login form
        setCheckingAuth(false)
      } catch (error) {
        console.error('Error checking authentication:', error)
        setCheckingAuth(false)
      }
    }

    checkAuth()
  }, [isAuthenticated, navigate, from])

  // Show loading spinner while checking authentication
  if (checkingAuth) {
    return (
      <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md={6} className="text-center">
              <CSpinner color="primary" variant="grow" />
              <p className="mt-3">Checking authentication...</p>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    )
  }

  const validateForm = () => {
    const errors = {}
    if (!credentials.username.trim()) {
      errors.username = 'Email or Phone is required'
    }
    if (!credentials.password.trim()) {
      errors.password = 'Password is required'
    }
    return errors
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate form
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    try {
      dispatch({ type: 'LOGIN_START' })
      
      const response = await authService.login(credentials)
      
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        response: response // Pass the complete response
      })
      
      navigate(from, { replace: true })
    } catch (error) {
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        error: error.message || 'Login failed. Please try again.' 
      })
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleSubmit}>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>
                    
                    {error && (
                      <CAlert color="danger" className="mb-3">
                        {error}
                      </CAlert>
                    )}
                    
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        name="username"
                        placeholder="Email or Phone"
                        autoComplete="username"
                        value={credentials.username}
                        onChange={handleInputChange}
                        invalid={!!formErrors.username}
                        feedback={formErrors.username}
                      />
                    </CInputGroup>
                    
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        name="password"
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={credentials.password}
                        onChange={handleInputChange}
                        invalid={!!formErrors.password}
                        feedback={formErrors.password}
                      />
                    </CInputGroup>
                    
                    <CRow>
                      <CCol xs={6}>
                        <CButton 
                          color="primary" 
                          className="px-4" 
                          type="submit"
                          disabled={loading}
                        >
                          {loading ? 'Logging in...' : 'Login'}
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
        
        {/* Debug Panel - Remove this after testing */}
        {/* <CRow className="justify-content-center mt-4">
          <CCol md={8}>
            <LoginDebug />
          </CCol>
        </CRow> */}
      </CContainer>
    </div>
  )
}

export default Login
