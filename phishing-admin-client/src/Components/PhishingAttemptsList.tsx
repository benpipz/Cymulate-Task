import React, { useMemo } from 'react';
import type { PhishingAttempt } from '../hooks/useWebSocket';
import { useWebSocket } from '../hooks/useWebSocket';
import { toast } from 'react-toastify';

function mapPhishingAttemptResponse(raw: any): PhishingAttempt {
  return {
    id: raw._id || raw.id,
    targetMail: raw.targetMail,
    targetHashcode: raw.targetHashcode,
    status: raw.status,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

export default function PhishingAttemptsList() {
  // Callbacks for WebSocket events
  const handleAttemptCreated = React.useCallback((attempt: PhishingAttempt) => {
    toast.info(
      `New phishing attempt created: ${attempt.targetMail}`,
      {
        position: 'top-right',
        autoClose: 4000,
      },
    );
  }, []);

  const handleAttemptClicked = React.useCallback((attempt: PhishingAttempt) => {
    toast.success(
      `Phishing attempt clicked: ${attempt.targetMail}`,
      {
        position: 'top-right',
        autoClose: 3000,
      },
    );
  }, []);

  const {
    isConnected,
    attempts,
    error,
    refetch,
  } = useWebSocket(handleAttemptCreated, handleAttemptClicked);

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadgeStyle = (status: 'created' | 'clicked') => {
    return {
      ...styles.statusBadge,
      ...(status === 'clicked' ? styles.statusClicked : styles.statusCreated),
    };
  };

  // Sort attempts by creation date (newest first)
  const sortedAttempts = useMemo(() => {
    return [...attempts].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [attempts]);

  if (error && attempts.length === 0) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorMessage}>
          {error}
          {!isConnected && ' - WebSocket disconnected'}
        </div>
        <button onClick={() => refetch()} style={styles.retryButton}>
          Retry
        </button>
      </div>
    );
  }

  if (!isConnected && attempts.length === 0) {
    return (
      <div style={styles.loading}>
        <div>Connecting to server...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>
            Phishing Attempts ({sortedAttempts.length})
          </h2>
          <div style={styles.connectionStatus}>
            <span
              style={{
                ...styles.statusIndicator,
                backgroundColor: isConnected ? '#4caf50' : '#f44336',
              }}
            />
            {isConnected ? 'Connected' : 'Disconnected'}
          </div>
        </div>
        <button
          onClick={() => refetch()}
          style={styles.refreshButton}
          disabled={!isConnected}
        >
          Refresh
        </button>
      </div>

      {!sortedAttempts || sortedAttempts.length === 0 ? (
        <div style={styles.emptyState}>No phishing attempts found</div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Target Email</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Created</th>
                <th style={styles.th}>Updated</th>
              </tr>
            </thead>
            <tbody>
              {sortedAttempts.map((attempt) => (
                <tr key={attempt.id} style={styles.tr}>
                  <td style={styles.td}>{attempt.targetMail}</td>
                  <td style={styles.td}>
                    <span style={getStatusBadgeStyle(attempt.status)}>
                      {attempt.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={styles.td}>{formatDate(attempt.createdAt)}</td>
                  <td style={styles.td}>{formatDate(attempt.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: '100%',
  },
  loading: {
    padding: '40px',
    textAlign: 'center',
    color: '#666',
  },
  errorContainer: {
    padding: '20px',
    textAlign: 'center',
  },
  errorMessage: {
    color: '#d32f2f',
    marginBottom: '12px',
    fontSize: '14px',
  },
  retryButton: {
    padding: '8px 16px',
    backgroundColor: '#1976d2',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  title: {
    margin: '0 0 8px 0',
    fontSize: '20px',
    fontWeight: '600',
    color: '#333',
  },
  connectionStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    color: '#666',
  },
  statusIndicator: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    display: 'inline-block',
  },
  refreshButton: {
    padding: '8px 16px',
    backgroundColor: '#1976d2',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  tableContainer: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#fff',
  },
  th: {
    padding: '12px',
    textAlign: 'left',
    backgroundColor: '#f5f5f5',
    fontWeight: '600',
    fontSize: '14px',
    color: '#333',
    borderBottom: '2px solid #ddd',
  },
  tr: {
    borderBottom: '1px solid #eee',
    transition: 'background-color 0.2s',
  },
  td: {
    padding: '12px',
    fontSize: '14px',
    color: '#666',
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    display: 'inline-block',
  },
  statusCreated: {
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
  },
  statusClicked: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
  },
  emptyState: {
    padding: '40px',
    textAlign: 'center',
    color: '#999',
    fontSize: '14px',
  },
};
