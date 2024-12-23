'use client';

import { useState, useEffect } from 'react';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export default function ViewAllUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch('http://localhost:3001/users/all', {
          credentials: 'include',
        });
        const data = await response.json();

        if (response.ok) {
          setUsers(data);
        } else {
          setError(data.message || 'Failed to fetch users.');
        }
      } catch (err) {
        setError('An error occurred while fetching users.');
      }
    }

    fetchUsers();
  }, []);

  async function handleDeleteUser(userId: string) {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
        setMessage('User deleted successfully!');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to delete user.');
      }
    } catch (err) {
      setError('An error occurred while deleting the user.');
    }
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>All Users</h1>
      {error && <p style={styles.error}>{error}</p>}
      {message && <p style={styles.message}>{message}</p>}
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Role</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td style={styles.td}>{user.name}</td>
              <td style={styles.td}>{user.email}</td>
              <td style={styles.td}>{user.role}</td>
              <td style={styles.td}>
                <button
                  style={styles.deleteButton}
                  onClick={() => handleDeleteUser(user._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: { padding: '2rem', fontFamily: 'Arial, sans-serif' },
  title: { fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' },
  error: { color: 'red', marginBottom: '1rem' },
  message: { color: 'green', marginBottom: '1rem' },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as 'collapse',
    marginTop: '1rem',
  },
  th: {
    border: '1px solid #ddd',
    padding: '0.5rem',
    textAlign: 'left' as 'left',
    backgroundColor: '#f2f2f2',
  },
  td: {
    border: '1px solid #ddd',
    padding: '0.5rem',
    textAlign: 'left' as 'left',
  },
  deleteButton: {
    padding: '0.5rem',
    backgroundColor: 'red',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};
