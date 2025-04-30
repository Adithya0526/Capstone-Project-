import axios from 'axios';

// Create an axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:3001/api', // Changed from relative URL to explicit localhost URL
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for debugging
api.interceptors.request.use(request => {
  console.log('API Request:', request.url);
  return request;
});

// Add response interceptor for debugging
api.interceptors.response.use(
  response => {
    console.log('API Response:', response.config.url, response.data);
    return response;
  },
  error => {
    console.error('API Error:', error.config?.url, error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// User API
export const getUsers = async () => {
  try {
    const response = await api.get('/user');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const getUserById = async (id: number) => {
  try {
    const response = await api.get(`/user/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error);
    throw error;
  }
};

export const createUser = async (userData: any) => {
  try {
    const response = await api.post('/user', userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Product API
export const getProducts = async () => {
  try {
    const response = await api.get('/product');
    console.log('Products API response:', response.data);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const getProductById = async (id: number) => {
  try {
    const response = await api.get(`/product/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw error;
  }
};

// Billing API
export const getBillings = async () => {
  try {
    const response = await api.get('/billing');
    console.log('Billings API response:', response.data);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching billings:', error);
    return [];
  }
};

export const getBillingById = async (id: number) => {
  try {
    const response = await api.get(`/billing/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching billing ${id}:`, error);
    throw error;
  }
};

export const getBillingItems = async (billingId: number) => {
  try {
    const response = await api.get(`/billing/${billingId}/items`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching billing items ${billingId}:`, error);
    throw error;
  }
};

export const createBilling = async (billingData: any) => {
  try {
    const response = await api.post('/billing', billingData);
    return response.data;
  } catch (error) {
    console.error('Error creating billing:', error);
    throw error;
  }
};

// Update functionality
export const updateBillingStatus = async (billingId: number, status: string) => {
  try {
    const response = await api.patch(`/billing/${billingId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error updating billing status ${billingId}:`, error);
    throw error;
  }
};
