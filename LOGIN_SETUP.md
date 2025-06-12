# Login System Setup

This admin panel now includes a complete authentication system with login functionality, route protection, and token storage.

## Features Implemented

✅ **Login Form** - Functional login form with validation  
✅ **API Integration** - Connected to your real API at http://34.229.93.103/api  
✅ **Route Protection** - Protected routes that redirect to login if not authenticated  
✅ **Token Storage** - JWT tokens stored in localStorage  
✅ **Redux State Management** - Authentication state managed with Redux  
✅ **Logout Functionality** - Logout button in header dropdown  
✅ **Auto-redirect** - Redirects to dashboard after login, or to intended page  
✅ **Authenticated API Service** - Utility for making authenticated requests  

## How to Test

### Test Credentials
Use your actual API credentials:

- **Email/Phone:** `daychy72@gmail.com`
- **Password:** `12345678`

### Testing Steps
1. Start the development server: `npm start`
2. Navigate to the application
3. You'll be redirected to `/login` if not authenticated
4. Use your credentials above to log in
5. After successful login, you'll be redirected to the dashboard
6. Try accessing protected routes - they should work when authenticated
7. Use the logout button in the header dropdown to log out

## API Integration

The system is now connected to your API at `http://34.229.93.103/api`.

### API Endpoint
- **URL:** `POST http://34.229.93.103/api/login`
- **Request Body:**
  ```json
  {
    "emailOrPhone": "daychy72@gmail.com",
    "password": "12345678"
  }
  ```

### API Response Format
Your API returns this response format:
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "_id": "68010d45c064aee78ec020f1",
    "name": "Dayanan Chaudhary",
    "email": "daychy72@gmail.com",
    "phone": "1234567890",
    "address": "kathmandu",
    "profilePicture": "https://giftolexia.com/wp-content/uploads/2015/11/dummy-profile.png",
    "gender": "male",
    "role": "admin",
    "isVerified": true,
    "status": "active",
    "createdAt": "2025-04-17T14:16:37.474Z",
    "updatedAt": "2025-05-31T19:55:09.133Z",
    "__v": 0,
    "otp": "6650",
    "otpExpiry": "2025-05-10T05:26:29.628Z",
    "rewardPoints": 2620
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Making Authenticated API Calls

Use the `apiService` for making authenticated requests to protected endpoints:

```javascript
import apiService from '../services/apiService'

// Example: Get user profile
const profile = await apiService.getUserProfile()

// Example: Make a custom authenticated request
const data = await apiService.get('/some-protected-endpoint')

// Example: POST request with data
const result = await apiService.post('/api/endpoint', { key: 'value' })
```

## Configuration

### API Settings
The API configuration is in `src/services/authService.js`:

```javascript
const USE_MOCK_API = false; // Set to true to use mock API for testing
const API_BASE_URL = 'http://34.229.93.103/api';
```

### Switching to Mock API
If you need to test without the real API, set `USE_MOCK_API = true` in `authService.js`.

## File Structure

```
src/
├── services/
│   ├── authService.js      # Main authentication service
│   ├── apiService.js       # Authenticated API requests
│   └── mockApi.js          # Mock API for testing
├── components/
│   ├── ProtectedRoute.js   # Route protection component
│   ├── LoginDebug.js       # Debug component for testing
│   └── header/
│       └── AppHeaderDropdown.js  # Logout functionality
├── views/pages/login/
│   └── Login.js            # Login form component
├── store.js                # Redux store with auth state
└── App.js                  # Main app with protected routes
```

## Customization

### Styling
The login form uses CoreUI components and can be styled by modifying the CSS classes in `Login.js`.

### Form Validation
Form validation is handled in the `validateForm()` function in `Login.js`. You can add more validation rules as needed.

### User Roles
The system supports user roles. You can extend the `ProtectedRoute` component to check for specific roles:

```javascript
// Example: Role-based route protection
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" />;
  }
  
  return children;
};
```

## Security Notes

1. **Token Storage:** Tokens are stored in localStorage. For enhanced security, consider using httpOnly cookies.
2. **Token Expiration:** Implement token refresh logic for long sessions.
3. **HTTPS:** Always use HTTPS in production.
4. **Input Validation:** The current validation is client-side. Always validate on the server as well.

## Troubleshooting

### Common Issues

1. **Login not working:**
   - Check browser console for errors
   - Verify API endpoint is accessible
   - Ensure CORS is properly configured on your API
   - Check network tab for API response

2. **Routes not protecting:**
   - Check Redux state in browser dev tools
   - Verify `isAuthenticated` is being set correctly

3. **Token not persisting:**
   - Check localStorage in browser dev tools
   - Verify token is being stored after login

### Debug Mode
To enable debug logging, add this to your browser console:
```javascript
localStorage.setItem('debug', 'true');
```

## Next Steps

1. Test the login with your actual credentials
2. Remove the debug panel from the login page once testing is complete
3. Add password reset functionality if needed
4. Implement user registration if required
5. Add remember me functionality
6. Implement token refresh logic
7. Add role-based access control 