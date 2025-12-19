import api from './api';

export const login = async (username, password) => {
  try {
    const response = await api.post('/auth/login', {
      username,
      password
    });

    const { token, username: responseUsername, role, userId } = response.data;

    // Store access token
    localStorage.setItem('token', token);

    // Build user object from response
    const userResponse = {
      id: userId,
      username: responseUsername,
      role: role, // Role comes from JWT token
      userId: userId
    };

    localStorage.setItem('user', JSON.stringify(userResponse));

    return {
      success: true,
      token: token,
      user: userResponse
    };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        'Login failed. Please check your credentials.';
    throw new Error(errorMessage);
  }
};

export const logout = async () => {
  try {
    // Call logout endpoint to clear refresh token cookie
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Ignore logout API errors, still clear local storage
      console.error('Logout API error:', error);
    }
    
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  } catch (e) {
    // Ignore storage errors
  }
};

export const getCurrentUser = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    }
  } catch (e) {
    // Ignore storage errors
  }
  return null;
};

export const getToken = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('token');
    }
  } catch (e) {
    // Ignore storage errors
  }
  return null;
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const getMe = async () => {
  try {
    // Decode JWT token to get user info
    const token = getToken();
    if (!token) {
      return null;
    }

    // Parse JWT token to get user info (simple base64 decode)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const user = {
        id: payload.userId,
        username: payload.sub,
        role: payload.role
      };
      
      return {
        success: true,
        user: user
      };
    } catch (e) {
      // If token parsing fails, return null
      return null;
    }
  } catch (error) {
    return null;
  }
};

