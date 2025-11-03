import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { API_CONFIG } from '../config/api-config';
import type { PhishingAttempt } from '../types';

export interface WebSocketEvents {
  'attempt:created': { attempt: PhishingAttempt };
  'attempt:clicked': { attempt: PhishingAttempt };
  'attempts:updated': { attempts: PhishingAttempt[] };
  connection: { status: string };
}

/**
 * Hook for managing WebSocket connection to phishing attempts service
 */
export function useWebSocket(
  onAttemptCreated?: (attempt: PhishingAttempt) => void,
  onAttemptClicked?: (attempt: PhishingAttempt) => void,
  onAttemptsUpdated?: (attempts: PhishingAttempt[]) => void,
) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [attempts, setAttempts] = useState<PhishingAttempt[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial attempts
  const fetchAttempts = useCallback(async () => {
    try {
      const response = await fetch(
        `${API_CONFIG.MANAGEMENT_API_URL}/phishing-attempts`,
      );
      if (response.ok) {
        const data = await response.json();
        setAttempts(data);
      }
    } catch (err) {
      console.error('Failed to fetch attempts:', err);
      setError('Failed to fetch attempts');
    }
  }, []);

  // Initialize WebSocket connection
  useEffect(() => {
    // Socket.IO uses HTTP/HTTPS URLs, not ws://
    // For namespace connection, use the full URL: http://localhost:3001/phishing-attempts
    const baseUrl = API_CONFIG.MANAGEMENT_API_URL.replace('/v1', '');
    const wsUrl = import.meta.env.VITE_WS_URL || baseUrl;
    const namespace = '/phishing-attempts';
    const namespaceUrl = `${wsUrl}${namespace}`;

    console.log(`🔌 Connecting to WebSocket namespace`);
    console.log(`Full URL: ${namespaceUrl}`);
    console.log(`Expected namespace: ${namespace}`);

    // Connection options - Socket.IO will extract namespace from URL path
    const connectionOptions = {
      transports: ['websocket'],
      withCredentials: true,
    };

    // Connect directly to the namespace URL
    // Format: http://localhost:3001/phishing-attempts
    // Socket.IO automatically extracts /phishing-attempts as the namespace
    const newSocket = io(namespaceUrl, connectionOptions);
    
    // Log immediately after creation
    console.log(`Socket created. Namespace: ${newSocket.nsp.name}`);
    console.log(`Socket URL: ${newSocket.io.uri}`);

    newSocket.on('connect', () => {
      console.log('✅ WebSocket connected successfully');
      console.log('Socket ID:', newSocket.id);
      console.log('Namespace:', newSocket.nsp.name);
      setIsConnected(true);
      setError(null);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      setIsConnected(false);
    });

    newSocket.on('connect_error', (err) => {
      console.error('❌ WebSocket connection error:', err);
      console.error('Error details:', {
        message: err.message,
        type: err.type,
        description: err.description,
        transport: err.transport,
      });
      setError(`Failed to connect: ${err.message || 'Unknown error'}`);
      setIsConnected(false);
    });

    newSocket.on('attempt:created', (data: WebSocketEvents['attempt:created']) => {
      console.log('📧 New attempt created:', data.attempt);
      const newAttempt = data.attempt;
      setAttempts((prev) => [newAttempt, ...prev]);
      onAttemptCreated?.(newAttempt);
    });

    newSocket.on('attempt:clicked', (data: WebSocketEvents['attempt:clicked']) => {
      console.log('🖱️ Attempt clicked:', data.attempt);
      const clickedAttempt = data.attempt;
      setAttempts((prev) =>
        prev.map((attempt) =>
          attempt.id === clickedAttempt.id ? clickedAttempt : attempt,
        ),
      );
      onAttemptClicked?.(clickedAttempt);
    });

    newSocket.on('attempts:updated', (data: WebSocketEvents['attempts:updated']) => {
      console.log('🔄 Attempts updated:', data.attempts);
      setAttempts(data.attempts);
      onAttemptsUpdated?.(data.attempts);
    });

    setSocket(newSocket);

    return () => {
      console.log('Cleaning up WebSocket connection');
      if (newSocket.connected) {
        newSocket.disconnect();
      }
    };
  }, [onAttemptCreated, onAttemptClicked, onAttemptsUpdated]);

  // Fetch attempts on mount as fallback, WebSocket will update in real-time
  useEffect(() => {
    // Initial fetch, even if not connected yet
    fetchAttempts();
  }, [fetchAttempts]);

  return {
    socket,
    isConnected,
    attempts,
    error,
    refetch: fetchAttempts,
  };
}

