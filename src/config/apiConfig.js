// API Configuration
// Centralized configuration for all API endpoints

// Environment-based configuration
const ENV = process.env.NODE_ENV || 'development';

// Base URLs for different environments
const BASE_URLS = {
  development: 'http://192.168.1.78:7000/api',
  staging: 'http://staging-api.example.com/api',
  production: 'https://api.example.com/api',
};

// Base URL for all API calls
export const API_BASE_URL = BASE_URLS[ENV] || BASE_URLS.development;

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/admin/login',
  REGISTER: '/admin/register',
  LOGOUT: '/admin/logout',
  VERIFY_TOKEN: '/verify-token',
  
  // User endpoints
  GET_ALL_USERS: '/admin/getAllUsers',
  CREATE_USER: '/admin/createUser',
  GET_USER_BY_ID: '/admin/users',
  UPDATE_USER: '/admin/updateUser',
  DELETE_USER: '/admin/deleteUser',
  
  // Ticket endpoints
  GET_ALL_TICKETS: '/admin/getAllTicket',
  CREATE_TICKET: '/ticket/createTicket',
  UPDATE_TICKET: '/ticket/updateTicket',
  GET_TICKET_BY_ID: '/admin/tickets',
  DELETE_TICKET: '/admin/tickets',
  GET_TICKETS_BY_OPERATOR: '/admin/tickets/operator',
  GET_TICKETS_BY_DATE_RANGE: '/admin/tickets/date-range',
  GET_TICKETS_BY_ROUTE: '/admin/tickets/route',
};

// API Configuration
export const API_CONFIG = {
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
};

// Vite Proxy Configuration (for development)
export const VITE_PROXY_CONFIG = {
  target: 'http://192.168.1.78:7000',
  changeOrigin: true,
  secure: false,
  rewrite: (path) => path.replace(/^\/api/, '/api'),
};

// Helper function to get full API URL
export const getApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};

// Helper function to get auth headers
export const getAuthHeaders = (token) => {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

// Environment info
export const ENV_INFO = {
  current: ENV,
  isDevelopment: ENV === 'development',
  isProduction: ENV === 'production',
  isStaging: ENV === 'staging',
};

export default {
  API_BASE_URL,
  API_ENDPOINTS,
  API_CONFIG,
  HTTP_STATUS,
  ERROR_MESSAGES,
  VITE_PROXY_CONFIG,
  ENV_INFO,
  getApiUrl,
  getAuthHeaders,
}; 