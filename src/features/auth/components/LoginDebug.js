import React, { useState } from 'react'
import authService from 'features/auth/services/authService'

const LoginDebug = () => {
  const [testResult, setTestResult] = useState('')
  const [loading, setLoading] = useState(false)

  const testLogin = async () => {
    setLoading(true)
    setTestResult('Testing login...')
    
    try {
      console.log('Testing login with credentials...')
      const result = await authService.login({
        username: 'daychy72@gmail.com',
        password: '12345678'
      })
      
      console.log('Login successful:', result)
      setTestResult(`Login successful! Token: ${result.token ? 'Received' : 'Not received'}`)
    } catch (error) {
      console.error('Login test failed:', error)
      setTestResult(`Login failed: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const testApiConnection = async () => {
    setLoading(true)
    setTestResult('Testing API connection...')
    
    try {
      const response = await fetch('http://34.229.93.103/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailOrPhone: 'daychy72@gmail.com',
          password: '12345678'
        }),
      })
      
      console.log('API Response status:', response.status)
      console.log('API Response headers:', response.headers)
      
      const data = await response.json()
      console.log('API Response data:', data)
      
      setTestResult(`API Connection: ${response.status} - ${JSON.stringify(data, null, 2)}`)
    } catch (error) {
      console.error('API connection test failed:', error)
      setTestResult(`API Connection failed: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const clearStorage = () => {
    localStorage.clear()
    setTestResult('Local storage cleared')
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>Login Debug Panel</h3>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={testApiConnection} disabled={loading} style={{ marginRight: '10px' }}>
          Test API Connection
        </button>
        <button onClick={testLogin} disabled={loading} style={{ marginRight: '10px' }}>
          Test Login Service
        </button>
        <button onClick={clearStorage} disabled={loading}>
          Clear Storage
        </button>
      </div>
      
      <div style={{ marginTop: '10px' }}>
        <strong>Test Result:</strong>
        <pre style={{ 
          background: '#f5f5f5', 
          padding: '10px', 
          border: '1px solid #ddd',
          whiteSpace: 'pre-wrap',
          maxHeight: '200px',
          overflow: 'auto'
        }}>
          {testResult}
        </pre>
      </div>
      
      <div style={{ marginTop: '10px' }}>
        <strong>Current Auth State:</strong>
        <pre style={{ 
          background: '#f5f5f5', 
          padding: '10px', 
          border: '1px solid #ddd',
          fontSize: '12px'
        }}>
          {JSON.stringify({
            isAuthenticated: authService.isAuthenticated(),
            token: authService.getToken() ? 'Present' : 'Not present',
            user: authService.getUser()
          }, null, 2)}
        </pre>
      </div>
    </div>
  )
}

export default LoginDebug 