'use client';

import { useState, useEffect } from 'react';

interface Module {
  _id: string;
  title: string;
  content: string;
  resources: string[];
}

interface CourseWithModules {
  courseId: string;
  modules: Module[];
}

export default function CourseDetails({ params }: { params: { courseId: string } }) {
  const [courseWithModules, setCourseWithModules] = useState<CourseWithModules | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseModules = async () => {
      try {
        const response = await fetch(`http://localhost:3001/modules/course/${params.courseId}`);
        if (!response.ok) throw new Error('Failed to fetch course details.');

        const data = await response.json();
        setCourseWithModules(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchCourseModules();
  }, [params.courseId]);

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!courseWithModules) {
    return <p>Loading...</p>;
  }

  return (
    <div style={styles.container}>
      <h1>Course Modules</h1>
      <p>Course ID: {courseWithModules.courseId}</p>

      <h2>Modules</h2>
      {courseWithModules.modules.map((module) => (
        <div key={module._id} style={styles.moduleCard}>
          <h3>{module.title}</h3>
          <p>{module.content}</p>
          <p>Resources:</p>
          <ul>
            {module.resources.map((resource, index) => (
              <li key={index}>
                <a href={resource} target="_blank" rel="noopener noreferrer">
                  {resource}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    fontFamily: 'Arial, sans-serif',
  },
  moduleCard: {
    padding: '1rem',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    marginBottom: '1rem',
  },
};
