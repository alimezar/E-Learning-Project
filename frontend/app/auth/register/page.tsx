'use client';

import { useState } from 'react';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Update form data
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate input dynamically
    validateField(name, value);
  };

  const validateField = (name: string, value: string) => {
    let error = '';
    if (name === 'name' && value.trim().length < 3) {
      error = 'Name must be at least 3 characters long.';
    } else if (name === 'password' && value.length < 8) {
      error = 'Password must be at least 8 characters long.';
    } else if (name === 'email' && !/\S+@\S+\.\S+/.test(value)) {
      error = 'Invalid email format.';
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Final validation check before submission
    if (Object.values(errors).some((error) => error !== '')) {
      setErrorMessage('Please fix the errors before submitting.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to register user');
      }

      setSuccessMessage('User registered successfully!');
      setFormData({ name: '', email: '', password: '', role: 'student' });
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  return (
    <section style={styles.container}>
      <h1 style={styles.title}>Register</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            style={styles.input}
            required
          />
          {errors.name && <p style={styles.errorText}>{errors.name}</p>}
        </label>
        <label style={styles.label}>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
            required
          />
          {errors.email && <p style={styles.errorText}>{errors.email}</p>}
        </label>
        <label style={styles.label}>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
            required
          />
          {errors.password && <p style={styles.errorText}>{errors.password}</p>}
        </label>
        <button type="submit" style={styles.button}>Register</button>
      </form>
      {successMessage && <p style={styles.successText}>{successMessage}</p>}
      {errorMessage && <p style={styles.errorText}>{errorMessage}</p>}
    </section>
  );
}

const styles = {
  container: {
    maxWidth: '400px',
    margin: '0 auto',
    padding: '1rem',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center' as const,
  },
  title: {
    fontSize: '2rem',
    marginBottom: '1.5rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  },
  label: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-start' as const,
    fontSize: '1rem',
  },
  input: {
    padding: '0.5rem',
    fontSize: '1rem',
    borderRadius: '4px',
    border: '1px solid #ddd',
    width: '100%',
  },
  button: {
    padding: '0.75rem',
    fontSize: '1rem',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  errorText: {
    color: 'red',
    fontSize: '0.85rem',
    marginTop: '0.5rem',
  },
  successText: {
    color: 'green',
    fontSize: '1rem',
    marginTop: '1rem',
  },
};
