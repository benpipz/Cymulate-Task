import React, { useState } from 'react';
import PhishingSimulationForm from '../Components/PhishingSimulationForm';
import PhishingAttemptsList from '../Components/PhishingAttemptsList';
import Layout from '../layout/Layout';

export default function Dashboard() {
  const [tab, setTab] = useState<'simulate' | 'attempts'>('simulate');

  return (
    <Layout>
      <h1 style={styles.title}>Phishing Simulator</h1>

      <div style={styles.tabContainer}>
        <button
          onClick={() => setTab('simulate')}
          style={
            tab === 'simulate'
              ? { ...styles.tabButton, ...styles.activeTab }
              : styles.tabButton
          }
        >
          Simulate Attack
        </button>
        <button
          onClick={() => setTab('attempts')}
          style={
            tab === 'attempts'
              ? { ...styles.tabButton, ...styles.activeTab }
              : styles.tabButton
          }
        >
          Ongoing Attempts
        </button>
      </div>

      <div style={styles.contentWrapper}>
        {tab === 'simulate' ? <PhishingSimulationForm /> : <PhishingAttemptsList />}
      </div>
    </Layout>
  );
}

const styles: Record<string, React.CSSProperties> = {
  title: {
    textAlign: 'center',
    marginBottom: '24px',
    color: '#1a1a1a',
    fontSize: '32px',
    fontWeight: '700',
    letterSpacing: '-0.5px',
  },
  tabContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '32px',
    borderBottom: '2px solid #e0e0e0',
    paddingBottom: '0',
  },
  tabButton: {
    padding: '12px 24px',
    border: 'none',
    borderBottomWidth: '3px',
    borderBottomStyle: 'solid',
    borderBottomColor: 'transparent',
    borderRadius: '8px 8px 0 0',
    backgroundColor: 'transparent',
    color: '#666',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '15px',
    fontWeight: '500',
    position: 'relative',
    bottom: '-2px',
  },
  activeTab: {
    backgroundColor: 'transparent',
    color: '#1976d2',
    borderBottomColor: '#1976d2',
    fontWeight: '600',
  },
  contentWrapper: {
    padding: '24px 0',
    minHeight: '400px',
  },
};
