import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      // Redirect to login or refresh the page to show login form
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
};

// Problems API
export const problemsAPI = {
  getProblems: (params = {}) => api.get('/problems', { params }),
  getProblemById: (id) => api.get(`/problems/${id}`),
  runCode: (problemId, data) => api.post(`/problems/${problemId}/run`, data),
  submitCode: (problemId, data) => api.post(`/problems/${problemId}/submit`, data),
};

// Submissions API
export const submissionsAPI = {
  getUserSubmissions: (limit = 50) => api.get('/submissions', { params: { limit } }),
};

// Contests API
export const contestsAPI = {
  getContests: () => api.get('/contests'),
  registerForContest: (contestId) => api.post(`/contests/${contestId}/register`),
};

export default api;