"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ModuleDetails() {
  const params = useParams();
  const router = useRouter();
  const moduleId = params?.moduleId;

  const [module, setModule] = useState({
    title: '',
    description: '',
    resources: [] as string[],
  });
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('Guest');
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Extract the 'user' cookie
    const cookies = document.cookie.split('; ');
    const userCookie = cookies.find((cookie) => cookie.startsWith('user='));

    if (userCookie) {
      try {
        const userData = JSON.parse(decodeURIComponent(userCookie.split('=')[1]));
        setUsername(userData.name);
        setUserId(userData.id);
      } catch (error) {
        console.error('Failed to parse user cookie:', error);
        setUsername('Guest'); // Fallback to guest
      }
    } else {
      setUsername('Guest'); // Default for unauthenticated users
    }
  }, []);

  useEffect(() => {
    const fetchModuleDetails = async () => {
      try {
        if (!moduleId) throw new Error('Module ID is missing.');

        const response = await fetch(`http://localhost:3001/modules/${moduleId}`);
        if (!response.ok) throw new Error('Failed to fetch module details.');

        const data = await response.json();
        setModule(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchModuleDetails();
  }, [moduleId]);

  const handleTakeQuiz = async () => {
    try {
      if (!userId || !moduleId) throw new Error('User ID or Module ID is missing.');
  
      // Check for quizzes created by instructors for this module
      const instructorQuizResponse = await fetch(`http://localhost:3001/quizzes?moduleId=${moduleId}&role=instructor`);
      if (!instructorQuizResponse.ok) throw new Error('Failed to fetch quizzes.');
  
      const instructorQuizzes = await instructorQuizResponse.json();
  
      if (instructorQuizzes.length === 0) {
        alert('No instructor has initialized the quiz');
        return;
      }
  
      const instructorQuiz = instructorQuizzes[0]; // Use the first instructor-created quiz
  
      // Check if the student has already taken the instructor-created quiz
      const responseCheck = await fetch(
        `http://localhost:3001/responses?quizId=${instructorQuiz._id}&userId=${userId}`
      );
      if (!responseCheck.ok) throw new Error('Failed to check existing responses.');
  
      const studentResponses = await responseCheck.json();
  
      if (studentResponses.length > 0) {
        // Student has already taken the instructor's quiz; create a new quiz
        const response = await fetch('http://localhost:3001/quizzes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, moduleId }),
        });
  
        if (!response.ok) throw new Error('Failed to create quiz.');
  
        const quiz = await response.json();
        router.push(`/profile/coursesDashboard/resources/${moduleId}/quizzes/${quiz._id}`);
      } else {
        // Student has not taken the instructor's quiz; redirect to the instructor's quiz
        router.push(`/profile/coursesDashboard/resources/${moduleId}/quizzes/${instructorQuiz._id}`);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };
  

  if (error) {
    return <p style={{ color: 'red', textAlign: 'center' }}>Error: {error}</p>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{module.title}</h1>
      <p style={styles.description}>{module.description}</p>

      <h2 style={styles.subtitle}>Resources</h2>
      <ul style={styles.resourceList}>
        {module.resources.map((resource, index) => (
          <li key={index} style={styles.resourceItem}>
            <a href={resource} download target="_blank" rel="noopener noreferrer" style={styles.resourceLink}>
              Download Resource {index + 1}
            </a>
          </li>
        ))}
      </ul>

      <button
        style={styles.quizButton}
        onClick={handleTakeQuiz}
      >
        Take Quiz
      </button>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem',
    fontFamily: 'Arial, sans-serif',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '10px',
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
    fontWeight: 'bold',
    textAlign: 'center' as const,
    color: '#333',
  },
  description: {
    marginBottom: '2rem',
    fontSize: '1.2rem',
    textAlign: 'justify' as const,
    lineHeight: '1.6',
    color: '#555',
  },
  subtitle: {
    fontSize: '1.8rem',
    marginBottom: '1rem',
    color: '#333',
    textAlign: 'center' as const,
  },
  resourceList: {
    listStyleType: 'none',
    padding: 0,
    marginBottom: '2rem',
  },
  resourceItem: {
    marginBottom: '0.5rem',
  },
  resourceLink: {
    textDecoration: 'none',
    color: '#007BFF',
    fontWeight: 'bold',
    fontSize: '1rem',
  },
  quizButton: {
    display: 'block',
    marginTop: '2rem',
    padding: '1rem 2rem',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1.2rem',
    cursor: 'pointer',
    textAlign: 'center' as const,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
  },
};
