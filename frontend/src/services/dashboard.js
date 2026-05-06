import axios from 'axios';

const API_URL = '/api';

const getDashboardData = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/dashboard/data`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

const uploadReport = async (file) => {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await axios.post(`${API_URL}/reports/upload`, formData, {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

const getReports = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/reports/`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export default { getDashboardData, uploadReport, getReports };
