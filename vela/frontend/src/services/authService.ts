import { apiClient } from './api/client';
import { VelaUser } from '../types/vela';
import { INITIAL_USER } from './mockData';

export const authService = {
  async getCurrentUser(): Promise<VelaUser> {
    try {
      const data = await apiClient.get<VelaUser>('/users/me');
      return data;
    } catch {
      return INITIAL_USER;
    }
  },

  async login(email: string, _password: string): Promise<VelaUser> {
    try {
      const data = await apiClient.post<any>('/auth/login', { email, _password });
      if (data.tokens?.accessToken) {
        apiClient.setToken(data.tokens.accessToken);
      }
      return data.user || INITIAL_USER;
    } catch {
      return { ...INITIAL_USER, email };
    }
  },

  async register(
    email: string,
    name: string,
    dateOfBirth: string,
    _password?: string
  ): Promise<VelaUser> {
    try {
      const data = await apiClient.post<any>('/auth/register', {
        email,
        name,
        dateOfBirth,
        password: _password || 'Password123!',
      });
      if (data.tokens?.accessToken) {
        apiClient.setToken(data.tokens.accessToken);
      }
      return data.user;
    } catch {
      const [yearStr, monthStr, dayStr] = dateOfBirth.split('-');
      return {
        ...INITIAL_USER,
        email,
        name,
        dateOfBirth,
        birthYear: parseInt(yearStr, 10) || 1998,
        birthMonth: parseInt(monthStr, 10) || 10,
        birthDay: parseInt(dayStr, 10) || 27,
      };
    }
  },
};

