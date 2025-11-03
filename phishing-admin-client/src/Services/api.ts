import axios, { AxiosError } from 'axios';
import { API_CONFIG } from '../config/api-config';

export const api = axios.create({
  baseURL: '', // Will use full URLs from API_CONFIG
  timeout: API_CONFIG.REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.debug(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    console.error('API Response Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
    });
    return Promise.reject(error);
  },
);

export interface CreatePhishingSimulationPayload {
  targetMail: string;
  targetName?: string;
}

export const createPhishingSimulation = (
  payload: CreatePhishingSimulationPayload,
) => {
  return api.post(`${API_CONFIG.SIMULATOR_API_URL}/phishing`, payload);
};

export type PhishingAttemptRaw = {
  _id: string;
  targetMail: string;
  targetHashcode: string;
  status: 'created' | 'clicked';
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export const getPhishingAttempts = () => {
  return api.get<PhishingAttemptRaw[]>(
    `${API_CONFIG.MANAGEMENT_API_URL}/phishing-attempts`,
  );
};

export const deleteAllPhishingAttempts = () => {
  return api.delete(`${API_CONFIG.MANAGEMENT_API_URL}/phishing-attempts`);
};
