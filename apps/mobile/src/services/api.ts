import axios from 'axios';
import { AppConfig } from '../types';

const API_URL = process.env.API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchAppConfig = async (): Promise<AppConfig> => {
  try {
    const { data } = await api.get<AppConfig>('/v1/app/config');
    return data;
  } catch (error) {
    console.error('Failed to fetch app config:', error);
    throw error;
  }
};

export const registerDeviceToken = async (token: string, platform: 'android' | 'ios') => {
  try {
    await api.post('/v1/device/register', {
      fcmToken: token,
      platform,
    });
  } catch (error) {
    console.error('Failed to register device token:', error);
  }
};

export const trackPushOpened = async (pushMessageId: number) => {
  try {
    await api.post('/v1/push/opened', {
      pushMessageId,
    });
  } catch (error) {
    console.error('Failed to track push opened:', error);
  }
};

