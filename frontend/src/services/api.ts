import axios from 'axios';
import { User, Match, Message, AuthResponse } from '../types/User';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (username: string, password: string) =>
    api.post<AuthResponse>('/auth/signin', { username, password }),
  
  register: (userData: any) =>
    api.post('/auth/signup', userData),
};

// User API
export const userAPI = {
  getProfile: () => api.get<User>('/users/profile'),
  updateProfile: (userData: Partial<User>) => api.put<User>('/users/profile', userData),
  getPotentialMatches: () => api.get<User[]>('/users/matches'),
};

// Match API
export const matchAPI = {
  likeUser: (userId: number) => api.post(`/matches/like/${userId}`),
  rejectUser: (userId: number) => api.post(`/matches/reject/${userId}`),
  getMyMatches: () => api.get<Match[]>('/matches/my-matches'),
  getPendingMatches: () => api.get<Match[]>('/matches/pending'),
};

// Message API
export const messageAPI = {
  sendMessage: (recipientId: number, content: string) =>
    api.post<Message>('/messages/send', { recipientId, content }),
  
  getConversation: (userId: number) =>
    api.get<Message[]>(`/messages/conversation/${userId}`),
  
  getUnreadMessages: () => api.get<Message[]>('/messages/unread'),
};

export default api;