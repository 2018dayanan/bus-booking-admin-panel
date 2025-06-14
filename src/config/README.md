# API Configuration

This directory contains centralized configuration for all API-related settings in the application.

## Files

### `apiConfig.js`
Centralized configuration file containing:
- API base URLs for different environments
- All API endpoints
- HTTP status codes
- Error messages
- Helper functions

## Usage

### Importing Configuration

```javascript
import { API_BASE_URL, API_ENDPOINTS, getApiUrl } from '../config/apiConfig';
```

### Using Base URL

```javascript
// Instead of hardcoding URLs
const API_BASE_URL = 'http://192.168.1.78:7000/api';

// Use the centralized config
import { API_BASE_URL } from '../config/apiConfig';
```

### Using Endpoints

```javascript
// Instead of hardcoding endpoints
const response = await apiClient.get('/admin/getAllUsers');

// Use the centralized endpoints
import { API_ENDPOINTS } from '../config/apiConfig';
const response = await apiClient.get(API_ENDPOINTS.GET_ALL_USERS);
```

### Using Helper Functions

```javascript
import { getApiUrl, getAuthHeaders } from '../config/apiConfig';

// Get full API URL
const fullUrl = getApiUrl(API_ENDPOINTS.LOGIN);

// Get auth headers
const headers = getAuthHeaders(token);
```

## Environment Configuration

The configuration automatically detects the environment:

- **Development**: `http://192.168.1.78:7000/api`
- **Staging**: `http://staging-api.example.com/api`
- **Production**: `https://api.example.com/api`

## Benefits

1. **Single Source of Truth**: All API URLs in one place
2. **Easy Maintenance**: Change URLs in one file
3. **Environment Support**: Different URLs for different environments
4. **Type Safety**: Consistent endpoint names
5. **Better Organization**: Clear separation of concerns

## Migration Guide

### Before (Hardcoded)
```javascript
const API_BASE_URL = 'http://192.168.1.78:7000/api';

class UserService {
  async getAllUsers() {
    const response = await apiClient.get('/admin/getAllUsers');
    return response;
  }
}
```

### After (Centralized)
```javascript
import { API_BASE_URL, API_ENDPOINTS } from '../config/apiConfig';

class UserService {
  async getAllUsers() {
    const response = await apiClient.get(API_ENDPOINTS.GET_ALL_USERS);
    return response;
  }
}
```

## Adding New Endpoints

1. Add the endpoint to `API_ENDPOINTS` in `apiConfig.js`
2. Use the endpoint constant in your service files
3. Update this README if needed

```javascript
// In apiConfig.js
export const API_ENDPOINTS = {
  // ... existing endpoints
  NEW_ENDPOINT: '/admin/newEndpoint',
};

// In your service
const response = await apiClient.get(API_ENDPOINTS.NEW_ENDPOINT);
``` 