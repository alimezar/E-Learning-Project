'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include', // Important to send and receive cookies
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const result = await response.json();

      // Parse the user role from the 'user' cookie or the response
      const userCookie = document.cookie
        .split('; ')
        .find((cookie) => cookie.startsWith('user='));

      if (!userCookie) {
        throw new Error('User data not found. Login failed.');
      }

      const userData = JSON.parse(decodeURIComponent(userCookie.split('=')[1]));

      // Redirect based on role
      switch (userData.role) {
        case 'student':
          router.push('/profile/student');
          break;
        case 'instructor':
          router.push('/profile/instructor');
          break;
        case 'admin':
          router.push('/profile/admin');
          break;
        default:
          throw new Error('Unknown user role');
      }
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  return (
    <section style={{ maxWidth: '400px', margin: '2rem auto', textAlign: 'center' }}>
      <h1>Login</h1>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
          />
        </label>
        <button
          type="submit"
          style={{
            backgroundColor: '#4c9aff',
            color: 'white',
            padding: '0.8rem',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Login
        </button>
      </form>
    </section>
  );
}
