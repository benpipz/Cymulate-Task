import React, { useState } from 'react';
import SimulateForm from '../Components/SimulateForm';
import AttemptsList from '../Components/AttemptsList';
import Layout from '../layout/Layout';

export default function Dashboard() {
  const [tab, setTab] = useState<'simulate' | 'attempts'>('simulate');

  return (
    <Layout>
      <h1 style={styles.title}>Phishing Simulator</h1>

      <div style={styles.tabContainer}>
        <button
          onClick={() => setTab('simulate')}
          style={{
            ...styles.tabButton,
            ...(tab === 'simulate' ? styles.activeTab : {}),
          }}
        >
          Simulate Attack
        </button>
        <button
          onClick={() => setTab('attempts')}
          style={{
            ...styles.tabButton,
            ...(tab === 'attempts' ? styles.activeTab : {}),
          }}
        >
          Ongoing Attempts
        </button>
      </div>

      <div style={styles.contentWrapper}>
        {tab === 'simulate' ? <SimulateForm /> : <AttemptsList />}
      </div>
    </Layout>
  );
}

const styles: Record<string, React.CSSProperties> = {
  title: { textAlign: 'center', marginBottom: '20px', color: '#333' },
  tabContainer: { display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '24px' },
  tabButton: {
    padding: '10px 20px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#ccc',
    borderRadius: '8px',
    backgroundColor: '#f1f1f1',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  activeTab: {
    backgroundColor: '#007bff',
    color: 'white',
    borderColor: '#007bff',
  },
  contentWrapper: { padding: '16px' },
};
