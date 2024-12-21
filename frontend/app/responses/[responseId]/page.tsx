'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ResponsePage({ params }: { params: Promise<{ responseId: string }> }) {
  const [responseId, setResponseId] = useState<string | null>(null);
  const [responseScore, setResponseScore] = useState<number | null>(null);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    async function fetchParams() {
      try {
        const resolvedParams = await params;
        setResponseId(resolvedParams.responseId);
      } catch (err) {
        setError("Failed to load page parameters.");
        console.error("Error resolving params:", err);
      }
    }

    fetchParams();
  }, [params]);

  useEffect(() => {
    if (!responseId) return;

    async function fetchResponse() {
      try {
        setError("");
        const res = await fetch(`http://localhost:3001/responses/${responseId}`);
        if (!res.ok) throw new Error("Failed to fetch response data");

        const responseText = await res.text();
        if (responseText) {
          const responseJson = JSON.parse(responseText);
          setResponseScore(responseJson.score || null);
        } else {
          setResponseScore(null);
        }
      } catch (err) {
        setError("Could not load the response. Please try again later.");
        console.error(err);
      }
    }

    fetchResponse();
  }, [responseId]);

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column' as 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#2c295d',
      color: '#fff',
      fontFamily: 'Arial, sans-serif',
    },
    text: {
      fontSize: '2rem',
      fontWeight: 'bold',
      textAlign: 'center' as 'center',
      marginBottom: '20px',
    },
    button: {
      padding: '10px 20px',
      fontSize: '1rem',
      fontWeight: 'bold',
      color: '#2c295d',
      backgroundColor: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    },
  };

  const handleGoHome = () => {
    router.push('/'); // Redirect to the main page
  };

  if (error) {
    return (
      <div style={styles.container}>
        <h1 style={styles.text}>{error}</h1>
        <button style={styles.button} onClick={handleGoHome}>
          Go to Main Page
        </button>
      </div>
    );
  }

  if (!responseId || responseScore === null) {
    return (
      <div style={styles.container}>
        <h1 style={styles.text}>Loading...</h1>
        <button style={styles.button} onClick={handleGoHome}>
          Go to Main Page
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.text}>Your score: {responseScore}/5</h1>
      <button style={styles.button} onClick={handleGoHome}>
        Go to Main Page
      </button>
    </div>
  );
}
