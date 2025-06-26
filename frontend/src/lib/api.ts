// src/lib/api.ts
// Helper functions to call backend API endpoints

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Helper function to make authenticated requests
const makeRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type');
  
  if (!response.ok) {
    let errorMsg = 'Request failed';
    if (contentType && contentType.includes('application/json')) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      errorMsg = error.error || error.message || 'Request failed';
    } else {
      errorMsg = await response.text().catch(() => 'Network error');
    }
    throw new Error(errorMsg);
  }

  if (contentType && contentType.includes('application/json')) {
    return response.json();
  } else {
    throw new Error('Response is not JSON');
  }
};

// Auth API
export const authAPI = {
  register: async (userData: { 
    email: string; 
    username: string; 
    firstName: string;
    middleName?: string;
    lastName: string;
    phoneNumber: string;
    password: string; 
    bday: string 
  }) => {
    return makeRequest('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  login: async (credentials: { email: string; password: string }) => {
    const response = await makeRequest('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.token) {
      // Normalize user object to always have 'id'
      const user = { ...response.user, id: response.user.id || response.user._id || response.user.userId };
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(user));
    }
    
    return response;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  },
};

// Articles API
export const articlesAPI = {
  getAll: async (params: { category?: string; search?: string; limit?: number; offset?: number } = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });
    
    return makeRequest(`/articles?${searchParams.toString()}`);
  },

  getById: async (id: number) => {
    return makeRequest(`/articles/${id}`);
  },

  getByCategory: async (category: string, params: { limit?: number; offset?: number } = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });
    
    return makeRequest(`/articles/category/${category}?${searchParams.toString()}`);
  },

  search: async (query: string, category?: string) => {
    const searchParams = new URLSearchParams({ q: query });
    if (category) {
      searchParams.append('category', category);
    }
    
    return makeRequest(`/articles/search?${searchParams.toString()}`);
  },

  create: async (articleData: { title: string; content: string; category: string; tags?: string; imageUrl?: string }) => {
    return makeRequest('/articles', {
      method: 'POST',
      body: JSON.stringify(articleData),
    });
  },

  update: async (id: number, articleData: Partial<{ title: string; content: string; category: string; tags: string; imageUrl: string }>) => {
    return makeRequest(`/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(articleData),
    });
  },

  delete: async (id: number) => {
    return makeRequest(`/articles/${id}`, {
      method: 'DELETE',
    });
  },

  getMyArticles: async () => {
    return makeRequest('/articles/user/my-articles');
  },

  getRelated: async (id: number) => {
    return makeRequest(`/articles/${id}/related`);
  }, 
};

// Admin API
export const adminAPI = {
  getAllArticles: async () => {
    return makeRequest('/articles/admin/all');
  },

  updateArticleStatus: async (id: number, status: 'pending' | 'approved' | 'rejected') => {
    return makeRequest(`/articles/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  getAllUsers: async () => {
    return makeRequest('/users');
  },

  getUserProfile: async (id: number) => {
    return makeRequest(`/users/profile/${id}`);
  },
};

// Legacy functions for backward compatibility
export async function fetchArticles() {
  return articlesAPI.getAll();
}

export async function fetchArticleById(id: string) {
  return articlesAPI.getById(parseInt(id));
}

export async function submitArticle(formData: FormData) {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('Authentication required');
  }

  // Convert FormData to JSON for the new API
  const data: any = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });

  return articlesAPI.create(data);
}
