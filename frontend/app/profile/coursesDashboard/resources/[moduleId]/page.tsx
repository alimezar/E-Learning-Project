'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ModuleDetails() {
  const params = useParams();
  const router = useRouter();
  const moduleId = params?.moduleId;
  const quizzesId = params?.quizzesId;

  const [module, setModule] = useState({
    title: '',
    description: '',
    resources: [] as string[],
    course_id: '', // Match the API property name
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModuleDetails = async () => {
      try {
        if (!moduleId) throw new Error('Module ID is missing.');

        const response = await fetch(`http://localhost:3001/modules/${moduleId}`);
        if (!response.ok) throw new Error('Failed to fetch module details.');

        const data = await response.json();
        setModule(data); // The API response includes `course_id`
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchModuleDetails();
  }, [moduleId]);

  const handleCompleteModule = async () => {
    try {
      console.log('Model done');
      console.log('Model ID:', moduleId);
      console.log('Course ID:', module.course_id);

      // Extract userData from a cookie
      const userCookie = document.cookie.split('; ').find(row => row.startsWith('user='));
      if (!userCookie) throw new Error('User cookie not found.');

      const userData = JSON.parse(decodeURIComponent(userCookie.split('=')[1]));
      const userId = userData.id;

      console.log('User ID:', userId);

      // Check if progress exists for the user and course
      const progressResponse = await fetch(`http://localhost:3001/progress/user/${userId}`);
      if (!progressResponse.ok) throw new Error('Failed to fetch user progress.');

      let progressData = await progressResponse.json();

      // Find progress for the specific course
      let courseProgress = progressData.find(
        (progress: any) => progress.courseId === module.course_id
      );

      if (!courseProgress) {
        console.log('Progress not found, initializing progress...');
        // Initialize progress if it doesn't exist
        const initProgressResponse = await fetch(`http://localhost:3001/progress`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, courseId: module.course_id }),
        });

        if (!initProgressResponse.ok) throw new Error('Failed to initialize progress.');

        courseProgress = await initProgressResponse.json();
        console.log('Initialized progress:', courseProgress);
      }

      // Check if moduleId exists in completedCourses
      if (!courseProgress.completedCourses.includes(moduleId)) {
        courseProgress.completedCourses.push(moduleId); // Add module ID to completedCourses
        console.log('Module ID added to completedCourses:', moduleId);
      } else {
        console.log('Module ID already exists in completedCourses.');
      }

      // Fetch the total number of modules in the course
      const courseModulesResponse = await fetch(`http://localhost:3001/courses/${module.course_id}/modules`);
      if (!courseModulesResponse.ok) throw new Error('Failed to fetch course modules.');

      const courseModules = await courseModulesResponse.json();
      const totalModules = courseModules.length;

      // Calculate completedPercentage
      const completedPercentage = (courseProgress.completedCourses.length / totalModules) * 100;
      courseProgress.completedPercentage = Math.round(completedPercentage); // Update the percentage

      console.log('Updated completed percentage:', courseProgress.completedPercentage);

      // Update progress on the server using PUT
      const updateProgressResponse = await fetch(`http://localhost:3001/progress`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          courseId: module.course_id,
          updateData: {
            completedCourses: courseProgress.completedCourses,
            completedPercentage: courseProgress.completedPercentage,
          },
        }),
      });

      if (!updateProgressResponse.ok) throw new Error('Failed to update progress.');
      console.log('Progress updated successfully.');
    } catch (err: any) {
      console.error('Error:', err.message);
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
        onClick={() => router.push(`/profile/coursesDashboard/resources/${moduleId}/quizzes/${quizzesId}`)}
      >
        Take Quiz
      </button>

      {/* Complete Module button */}
      <button style={styles.completeModuleButton} onClick={handleCompleteModule}>
        Complete Module
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
  completeModuleButton: {
    display: 'block',
    marginTop: '1rem',
    padding: '1rem 2rem',
    backgroundColor: '#007BFF',
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
