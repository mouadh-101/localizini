import axios from 'axios';

// Get the API base URL from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Create an Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Request Interceptor ---
// This interceptor will add the JWT token to the Authorization header for authenticated requests.
apiClient.interceptors.request.use(
  (config) => {
    // Check if we have a token (e.g., from localStorage or a global state)
    // This part will be more fleshed out in the Authentication step.
    // For now, let's assume a function getToken() exists.
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null; 
    
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Response Interceptor ---
import { toast } from 'sonner'; // Import toast from sonner

// This interceptor can handle global API errors or token refresh logic.
apiClient.interceptors.response.use(
  (response) => {
    // If the response is successful, just return it
    return response;
  },
  (error) => {
    console.error('API Call Error:', error); // Log the full error object for debugging

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const status = error.response.status;
      const dataMessage = error.response.data?.message || error.response.data?.error; // Common backend error message patterns

      console.error(`API Error: Status ${status}`, error.response.data);

      // Avoid global toasts for errors that should be handled locally (e.g., form validation, auth errors)
      if (status === 400 || status === 401 || status === 403 || status === 404 || status === 422) {
        // These errors are often handled specifically in the component (e.g., AuthModal shows "Invalid credentials")
        // For 401, AuthContext might also handle logout/redirect.
        // if (status === 401 && typeof window !== 'undefined') {
        //   // Example: AuthContext might dispatch a logout action or redirect
        //   // localStorage.removeItem('authToken');
        //   // window.location.href = '/login'; // Or use Next.js router
        //   // toast.error("Session Expired", { description: "Please log in again." });
        // }
        // Do not show a generic global toast for these, as local handling is preferred.
      } else if (status >= 500) {
        // Server-side errors (500, 502, 503, etc.)
        toast.error(`Server Error: ${status}`, {
          description: dataMessage || "Something went wrong on our end. Please try again later.",
          duration: 5000,
        });
      } else {
        // Other client-side errors that weren't handled locally (e.g., 409 Conflict if not handled)
        // Could still show a toast if a specific component doesn't handle it.
        // For now, we'll let these pass through without a global toast to encourage local handling.
        // toast.warning(`API Warning: ${status}`, { description: dataMessage || "An unexpected issue occurred." });
      }
    } else if (error.request) {
      // The request was made but no response was received (e.g., network error)
      console.error('Network Error:', error.request);
      toast.error('Network Error', {
        description: 'Could not connect to the server. Please check your internet connection and try again.',
        duration: 5000,
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request Setup Error:', error.message);
      toast.error('Request Error', {
        description: error.message || 'An unexpected error occurred while setting up the request.',
        duration: 5000,
      });
    }
    return Promise.reject(error);
  }
);

export default apiClient;
