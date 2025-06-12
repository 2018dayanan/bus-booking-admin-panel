import { legacy_createStore as createStore } from 'redux'
import authService from './services/authService'

const initialState = {
  sidebarShow: true,
  theme: 'light',
  auth: {
    isAuthenticated: authService.isAuthenticated(),
    user: authService.getUser(),
    loading: false,
    error: null,
  },
}

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    case 'LOGIN_START':
      return {
        ...state,
        auth: {
          ...state.auth,
          loading: true,
          error: null,
        },
      }
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        auth: {
          ...state.auth,
          isAuthenticated: true,
          user: rest.user || rest.response?.user,
          loading: false,
          error: null,
        },
      }
    case 'LOGIN_FAILURE':
      return {
        ...state,
        auth: {
          ...state.auth,
          loading: false,
          error: rest.error,
        },
      }
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
    default:
      return state
  }
}

const store = createStore(changeState)
export default store
