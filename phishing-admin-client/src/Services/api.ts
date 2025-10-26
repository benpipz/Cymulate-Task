import axios from 'axios';

export const api = axios.create({
  timeout: 5000,
});

export const postSimulate = (payload: { targetMail: string; targetName?: string }) => {
  return api.post('http://localhost:3000/v1/phishing', payload);
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

export const getAttempts = () => {
  return api.get<PhishingAttemptRaw[]>('http://localhost:3001/v1/phishing-attempts');
};
