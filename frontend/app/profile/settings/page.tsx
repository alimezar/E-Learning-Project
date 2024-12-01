'use client';

import { useState, useEffect } from 'react';

export default function SettingsPage() {
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [newEmail, setNewEmail] = useState('');
  const [dob, setDob] = useState<string | null>(null);
  const [gender, setGender] = useState<string | null>(null);
  const [resetEmail, setResetEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Load date of birth from local storage
    const savedDob = localStorage.getItem('dob');
    const savedGender = localStorage.getItem('gender');

    if (savedDob) setDob(savedDob);
    if (savedGender) setGender(savedGender);

  }, []);

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
    }
  };

  const handleProfilePictureUpload = async () => {
    if (!profilePicture) {
      setError('Please select a profile picture.');
      return;
    }
  
    // Extract userId from the cookie
    const cookies = document.cookie.split('; ');
    const userCookie = cookies.find((cookie) => cookie.startsWith('user='));
    const userId = userCookie ? JSON.parse(decodeURIComponent(userCookie.split('=')[1])).id : null;
  
    if (!userId) {
      setError('Unable to identify the user.');
      return;
    }
  
    const formData = new FormData();
    formData.append('profilePictureUrl', profilePicture);
  
    try {
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: 'PUT',
        body: formData,
        credentials: 'include', // Send cookies
      });
  
      if (!response.ok) {
        throw new Error('Failed to upload profile picture.');
      }
  
      setMessage('Profile picture updated successfully!');
    } catch (err: any) {
      setError(err.message);
    }
  };
  

  const handleEmailUpdate = async () => {
    if (!newEmail) {
      setError('Please enter a new email.');
      return;
    }
  
    // Extract userId from the cookie
    const cookies = document.cookie.split('; ');
    const userCookie = cookies.find((cookie) => cookie.startsWith('user='));
    const userId = userCookie ? JSON.parse(decodeURIComponent(userCookie.split('=')[1])).id : null;

  
    if (!userId) {
      setError('Unable to identify the user.');
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newEmail }),
        credentials: 'include', // Send cookies
      });
  
      if (!response.ok) {
        throw new Error('Failed to update email.');
      }
  
      setMessage('Email updated successfully!');
    } catch (err: any) {
      setError(err.message);
    }
  };
  
  const handleDobSave = () => {
    if (dob) {
      localStorage.setItem('dob', dob);
      setMessage('Date of birth saved!');
    }
  };

  const handleGenderSave = () => {
    if (gender) {
      localStorage.setItem('gender', gender);
      setMessage('Gender saved!');
    }
  };

  const handleResetPassword = async () => {
    if (!resetEmail) {
      setError('Please enter your email.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: resetEmail }),
      });

      if (!response.ok) {
        throw new Error('Failed to send reset password email.');
      }

      setMessage('Reset password email sent!');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Settings</h1>

      {/* Profile Picture Section */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Update Profile Picture</h3>
        <input type="file" onChange={handleProfilePictureChange} style={styles.fileInput} />
        <button onClick={handleProfilePictureUpload} style={styles.button}>
          Upload
        </button>
      </div>

      {/* Update Email Section */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Update Email</h3>
        <input
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          placeholder="Enter new email"
          style={styles.input}
        />
        <button onClick={handleEmailUpdate} style={styles.button}>
          Update Email
        </button>
      </div>

      {/* Date of Birth Section */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Set Date of Birth</h3>
        <input
          type="date"
          value={dob || ''}
          onChange={(e) => setDob(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleDobSave} style={styles.button}>
          Save DOB
        </button>
      </div>

      {/* Gender Section */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Set Gender</h3>
        <input
          type="string"
          value={gender || ''}
          onChange={(e) => setGender(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleGenderSave} style={styles.button}>
          Save Gender
        </button>
      </div>

      {/* Reset Password Section */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Reset Password</h3>
        <input
          type="email"
          value={resetEmail}
          onChange={(e) => setResetEmail(e.target.value)}
          placeholder="Enter your email"
          style={styles.input}
        />
        <button onClick={handleResetPassword} style={styles.button}>
          Send Reset Email
        </button>
      </div>

      {/* Messages */}
      {message && <p style={styles.message}>{message}</p>}
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
}

// Inline Styles
const styles = {
  container: {
    padding: '2rem',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '2rem',
  },
  section: {
    marginBottom: '2rem',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
  },
  input: {
    padding: '0.5rem',
    fontSize: '1rem',
    marginBottom: '1rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    display: 'block',
    width: '100%',
  },
  fileInput: {
    marginBottom: '1rem',
  },
  button: {
    padding: '0.5rem 1rem',
    backgroundColor: '#4c9aff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  message: {
    color: 'green',
    marginTop: '1rem',
  },
  error: {
    color: 'red',
    marginTop: '1rem',
  },
};
