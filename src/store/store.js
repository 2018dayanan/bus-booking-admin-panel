// Redux core
import { legacy_createStore as createStore } from 'redux'

// Auth service handles token/user persistence (e.g., in localStorage)
import authService from 'features/auth/services/authService'

// 🏁 Initial global state
// This defines your application's default Redux store structure
const initialState = {
  sidebarShow: true, // Controls visibility of sidebar UI
  theme: 'light', // Default theme (can be toggled)
  auth: {
    // Authentication state
    isAuthenticated: authService.isAuthenticated(), // Returns true if a valid token exists
    user: authService.getUser(), // Fetches stored user info (from localStorage or cookies)
    loading: false, // True during async login/signup actions
    error: null, // Stores any auth-related errors
  },
}

// 🧠 Reducer: updates store state based on dispatched actions
const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    // 🔧 Generic setter (used for small UI updates like sidebar toggling)
    case 'set':
      return { ...state, ...rest }

    // 🟢 Login process started — sets loading state
    case 'LOGIN_START':
      return {
        ...state,
        auth: {
          ...state.auth,
          loading: true,
          error: null,
        },
      }

    // ✅ Login successful — stores user data and updates authentication
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        auth: {
          ...state.auth,
          isAuthenticated: true,
          user: rest.user || rest.response?.user, // Handles both direct and nested responses
          loading: false,
          error: null,
        },
      }

    // ❌ Login failed — saves error message to display in UI
    case 'LOGIN_FAILURE':
      return {
        ...state,
        auth: {
          ...state.auth,
          loading: false,
          error: rest.error, // Expected to be a string or error object
        },
      }

    // 🚪 Logout — clears user data and resets authentication
    case 'LOGOUT':
      return {
        ...state,
        auth: {
          isAuthenticated: false,
          user: null,
          loading: false,
          error: null,
        },
      }

    // Default: return unchanged state if action type doesn’t match
    default:
      return state
  }
}

// 🏬 Create Redux store
const store = createStore(changeState)

export default store
