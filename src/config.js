/**
 * Application configuration
 * Environment-based backend URL selection
 */

const API_BASE_URL = 
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080'
    : 'https://d100-ew70.onrender.com';

export { API_BASE_URL };
