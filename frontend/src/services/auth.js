import axios from 'axios';

const API_URL = '/api/auth';

const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  if (response.data.access_token) {
    localStorage.setItem('token', response.data.access_token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

const signup = async (name, email, password) => {
  const response = await axios.post(`${API_URL}/register`, { name, email, password });
  if (response.data.access_token) {
    localStorage.setItem('token', response.data.access_token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

const onboard = async (onboardingData) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(`${API_URL}/onboard`, onboardingData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

const getMe = async () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  const response = await axios.get(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export default { login, signup, onboard, logout, getMe };
