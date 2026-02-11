import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
});

export const fetchDashboard = () => api.get('/dashboard/');

export const fetchEmployees = (params) => api.get('/employees/', { params });
export const addEmployee = (data) => api.post('/employees/', data);
export const updateEmployee = (id, data) =>
  api.put(`/employees/${id}/`, data);
export const deleteEmployee = (id) => api.delete(`/employees/${id}/`);

export const fetchDepartments = () => api.get('/departments/');

export const markAttendance = (data) => api.post('/attendance/', data);
export const fetchAttendance = (employeeId, params) =>
  api.get(`/attendance/${employeeId}/`, { params });
export const fetchDailyAttendance = (date) =>
  api.get('/attendance/daily/', { params: { date } });

export default api;
