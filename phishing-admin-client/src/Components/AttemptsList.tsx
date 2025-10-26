import { useQuery } from '@tanstack/react-query';
import type { PhishingAttempt } from '../types';
import { getAttempts, type PhishingAttemptRaw } from '../Services/api';

function mapRaw(raw: PhishingAttemptRaw): PhishingAttempt {
  return {
    id: raw._id,
    targetMail: raw.targetMail,
    targetHashcode: raw.targetHashcode,
    status: raw.status,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

export default function AttemptsList() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['attempts'],
    queryFn: async () => {
      const res = await getAttempts();
      return res.data.map(mapRaw);
    },
    refetchInterval: 5000,
    staleTime: 10000,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading attempts <button onClick={() => refetch()}>Retry</button></div>;

  return (
    <div>
      <button onClick={() => refetch()} style={{ marginBottom: 12 }}>Refresh</button>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ padding: 8, textAlign: 'left' }}>Target Email</th>
            <th style={{ padding: 8, textAlign: 'left' }}>Status</th>
            <th style={{ padding: 8, textAlign: 'left' }}>Created</th>
            <th style={{ padding: 8, textAlign: 'left' }}>Updated</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((attempt) => (
            <tr key={attempt.id}>
              <td style={{ padding: 8 }}>{attempt.targetMail}</td>
              <td style={{ padding: 8 }}>{attempt.status}</td>
              <td style={{ padding: 8 }}>
                {new Date(attempt.createdAt).toLocaleString()}
              </td>
              <td style={{ padding: 8 }}>
                {new Date(attempt.updatedAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
