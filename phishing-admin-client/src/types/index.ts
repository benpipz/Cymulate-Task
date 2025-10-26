export type PhishingAttempt = {
  id: string;
  targetMail: string;
  targetHashcode: string;
  status: 'created' | 'clicked';
  createdAt: string;
  updatedAt: string;
};
