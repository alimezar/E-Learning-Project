'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [error, setError] = useState<string | null>(null);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Admin Dashboard</h1>
        <div style={styles.buttonGroup}>
          <Link href="/profile/admin/users" style={styles.button}>
            View All Users
          </Link>
        </div>
        <div style={styles.buttonGroup}>
          <Link href="/profile/instructor/courses/view" style={styles.button}>
            View All Courses
          </Link>
        </div>
      </div>

      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
}

const styles = {
  container: { padding: '2rem', fontFamily: 'Arial, sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' },
  title: { fontSize: '2rem', fontWeight: 'bold' },
  buttonGroup: { display: 'flex', gap: '1rem' },
  button: { padding: '0.5rem 1rem', backgroundColor: '#4c9aff', color: '#fff', textDecoration: 'none', borderRadius: '4px', cursor: 'pointer' },
  error: { color: 'red', marginBottom: '1rem' },
};
