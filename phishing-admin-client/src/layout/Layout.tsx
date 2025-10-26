import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={styles.pageWrapper}>
      <div style={styles.card}>
        {children}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  pageWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    minHeight: '100vh',
    backgroundColor: '#f4f6f8',
    paddingTop: '50px',
    fontFamily: `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`,
  },
  card: {
    backgroundColor: '#fff',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    minWidth: '700px',
    maxWidth: '900px',
  },
};
